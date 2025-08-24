import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeMathjax from "rehype-mathjax/svg"
//@ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst"
import { QuartzTransformerPlugin } from "../types"
import { KatexOptions } from "katex"
import { Options as MathjaxOptions } from "rehype-mathjax/svg"
//@ts-ignore
import { Options as TypstOptions } from "@myriaddreamin/rehype-typst"

interface Options {
  renderEngine: "katex" | "mathjax" | "typst"
  customMacros: MacroType
  katexOptions: Omit<KatexOptions, "macros" | "output">
  // tex은 내부에서 병합하므로 여기서는 제외
  mathJaxOptions: Omit<MathjaxOptions, "tex">
  typstOptions: TypstOptions
}

interface MacroType {
  [key: string]: string
}

export const Latex: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  const engine = opts?.renderEngine ?? "katex"
  const macros = opts?.customMacros ?? {}

  // MathJax 옵션 병합: \text 지원(textmacros 포함)
  const buildMJ = (): MathjaxOptions => {
    const user = (opts?.mathJaxOptions ?? {}) as any
    const userTex = user.tex ?? {}
    const packages = Array.from(
      new Set([...(userTex.packages ?? []), "base", "ams", "newcommand", "textmacros"]),
    )
    return {
      ...user,
      tex: {
        ...userTex,
        packages,
        macros: { ...(userTex.macros ?? {}), ...macros },
      },
      svg: { ...(user.svg ?? {}), fontCache: "none" },
    } as MathJaxOptions
  }

  return {
    name: "Latex",
    markdownPlugins() {
      return [remarkMath]
    },
    htmlPlugins() {
      switch (engine) {
        case "katex": {
          return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]]
        }
        case "typst": {
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        }
        case "mathjax": {
          return [[rehypeMathjax, buildMJ()]]
        }
        default: {
          return [[rehypeMathjax, buildMJ()]]
        }
      }
    },
    externalResources() {
      switch (engine) {
        case "katex":
          return {
            css: [{ content: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" }],
            js: [
              {
                // fix copy behaviour: https://github.com/KaTeX/KaTeX/blob/main/contrib/copy-tex/README.md
                src: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js",
                loadTime: "afterDOMReady",
                contentType: "external",
              },
            ],
          }
        case "mathjax":
          return {
            js: [
              {
                // MathJax v3 TeX → SVG 
                src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js",
                loadTime: "afterDOMReady",
                contentType: "external",
              },
            ],
          }
      }
    },
  }
}
