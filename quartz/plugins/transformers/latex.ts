// quartz/plugins/transformers/latex.ts
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
// @ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst"
// MathJax를 서버사이드에서 SVG로 렌더링
// @ts-ignore
import rehypeMathjax from "rehype-mathjax/svg"

import { QuartzTransformerPlugin } from "../types"
import { KatexOptions } from "katex"
// @ts-ignore
import { Options as TypstOptions } from "@myriaddreamin/rehype-typst"

interface Options {
  renderEngine: "katex" | "mathjax" | "typst"
  customMacros: MacroType
  katexOptions: Omit<KatexOptions, "macros" | "output">
  typstOptions: TypstOptions
}

interface MacroType {
  [key: string]: string
}

export const Latex: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  // 기본: MathJax
  const engine = opts?.renderEngine ?? "mathjax"
  const macros = opts?.customMacros ?? {}

  return {
    name: "Latex",

    // $$ / $ 파싱
    markdownPlugins() {
      return [[remarkMath, { singleDollar: true }]]
    },

    // HTML 변환 단계
    htmlPlugins() {
      switch (engine) {
        case "katex":
          return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]]
        case "typst":
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        case "mathjax":
        default:
          // MathJax를 빌드 타임에 SVG로 렌더링
          return [[
            rehypeMathjax,
            {
              tex: {
                // array, amsmath, \text 등을 위해 ams/newcommand/textmacros 추가
                packages: { "[+]": ["base", "ams", "newcommand", "textmacros"] },
                macros,
              },
              svg: { fontCache: "none" },
            },
          ]]
      }
    },

    // MathJax는 SSR로 이미 SVG가 생성되므로 클라이언트 리소스 불필요
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
      // mathjax / typst는 주입할 외부 리소스 없음
      return
    },
  }
}
