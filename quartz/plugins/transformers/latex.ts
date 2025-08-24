// quartz/plugins/transformers/latex.ts
import { QuartzTransformerPlugin } from "../types"
import rehypeKatex from "rehype-katex"
// @ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst"
import { KatexOptions } from "katex"
// @ts-ignore
import { Options as TypstOptions } from "@myriaddreamin/rehype-typst"

interface Options {
  renderEngine: "katex" | "mathjax" | "typst"
  customMacros: { [key: string]: string }
  katexOptions: Omit<KatexOptions, "macros" | "output">
  typstOptions: TypstOptions
}

export const Latex: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  const engine = opts?.renderEngine ?? "mathjax"
  const macros = opts?.customMacros ?? {}

  return {
    name: "Latex",

    // 설치 없이 MathJax 런타임 스캔을 쓰기 위해 Markdown 단계는 건드리지 않습니다.
    markdownPlugins() {
      return []
    },

    // MathJax는 런타임 렌더링. KaTeX/Typst만 빌드 타임 변환을 유지합니다.
    htmlPlugins() {
      switch (engine) {
        case "katex":
          return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]]
        case "typst":
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        case "mathjax":
        default:
          return []
      }
    },

    // 인라인 스크립트 없이 MathJax를 가장 먼저 로드해 초기 진입에서 자동 typeset이 실행되도록 합니다.
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

      if (engine === "mathjax") {
        return {
          js: [
            {
              // MathJax v3 기본 config(TeX + SVG)는 $/$$ 구분자를 기본 지원하며
              // 자동으로 DOM을 스캔해 첫 로드 시 typeset합니다.
              src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js",
              loadTime: "beforeDOMReady",
              contentType: "external",
            },
          ],
        }
      }
    },
  }
}
