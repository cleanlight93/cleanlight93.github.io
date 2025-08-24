import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeMathjax from "rehype-mathjax/svg"
//@ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst"
import { QuartzTransformerPlugin } from "../types"
import { KatexOptions } from "katex"
import type { Options as MathjaxOptions } from "rehype-mathjax/svg"
//@ts-ignore
import type { Options as TypstOptions } from "@myriaddreamin/rehype-typst"

interface Options {
  renderEngine: "katex" | "mathjax" | "typst"
  customMacros: MacroType
  katexOptions: Omit<KatexOptions, "macros" | "output">
  // tex은 내부에서 병합하므로 제외
  mathJaxOptions: Omit<MathjaxOptions, "tex">
  typstOptions: TypstOptions
}

interface MacroType {
  [key: string]: string
}

export const Latex: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  const engine = opts?.renderEngine ?? "mathjax"
  const userMacros = opts?.customMacros ?? {}

  const buildMathJaxSvgOptions = (): MathjaxOptions => {
    const user = (opts?.mathJaxOptions ?? {}) as any
    const userTex = user.tex ?? {}
    const mergedPackages = Array.from(
      new Set([...(userTex.packages ?? []), "base", "ams", "newcommand", "textmacros"]),
    )
    return {
      ...user,
      tex: {
        ...userTex,
        packages: mergedPackages,
        macros: { ...(userTex.macros ?? {}), ...userMacros },
      },
      // 핵심: <defs>/<use> 없이 각 글리프를 직접 path로 출력
      svg: {
        ...(user.svg ?? {}),
        fontCache: "none",
      },
    } as MathjaxOptions
  }

  return {
    name: "Latex",
    markdownPlugins() {
      return [remarkMath]
    },
    htmlPlugins() {
      switch (engine) {
        case "katex":
          return [[rehypeKatex, { output: "html", macros: userMacros, ...(opts?.katexOptions ?? {}) }]]
        case "typst":
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        case "mathjax":
        default:
          return [[rehypeMathjax, buildMathJaxSvgOptions()]]
      }
    },
    externalResources() {
      if (engine === "katex") {
        return {
          css: [{ content: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" }],
          js: [
            {
              src: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js",
              loadTime: "afterDOMReady",
              contentType: "external",
            },
          ],
        }
      }
    },
  }
}
