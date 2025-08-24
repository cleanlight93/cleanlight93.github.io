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
  // macros는 tex.macros로 주입하므로 여기서 제외
  mathJaxOptions: Omit<MathjaxOptions, "tex">
  typstOptions: TypstOptions
}

interface MacroType {
  [key: string]: string
}

export const Latex: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  const engine = opts?.renderEngine ?? "mathjax"
  const userMacros = opts?.customMacros ?? {}

  // MathJax(svg) 옵션을 안전하게 병합하고 textmacros를 강제 포함
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
      // 필요 시 svg 출력 세부 옵션 추가 가능
      // svg: { ...(user.svg ?? {}), fontCache: "local" },
    } as MathjaxOptions
  }

  return {
    name: "Latex",
    markdownPlugins() {
      return [remarkMath]
    },
    htmlPlugins() {
      switch (engine) {
        case "katex": {
          return [[rehypeKatex, { output: "html", macros: userMacros, ...(opts?.katexOptions ?? {}) }]]
        }
        case "typst": {
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        }
        case "mathjax": {
          return [[rehypeMathjax, buildMathJaxSvgOptions()]]
        }
        default: {
          return [[rehypeMathjax, buildMathJaxSvgOptions()]]
        }
      }
    },
    externalResources() {
      // MathJax(svg)와 Typst는 빌드 타임 렌더링으로 외부 리소스 불필요
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
