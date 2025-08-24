// quartz/plugins/transformers/latex.ts
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
// @ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst"
// MathJax를 빌드 타임에 SVG로 렌더링
// @ts-ignore
import rehypeMathjax from "rehype-mathjax/svg"

import { QuartzTransformerPlugin } from "../types"
import { KatexOptions } from "katex"
// @ts-ignore
import { Options as TypstOptions } from "@myriaddreamin/rehype-typst"
import { visit } from "unist-util-visit"

interface Options {
  renderEngine: "katex" | "mathjax" | "typst"
  customMacros: MacroType
  katexOptions: Omit<KatexOptions, "macros" | "output">
  typstOptions: TypstOptions
}

interface MacroType {
  [key: string]: string
}

/**
 * remark 단계에서 실수로 코드블록(회색 박스)으로 들어간 수식을 강제로 구출한다.
 * 1) ```math / ```latex / ```tex 코드펜스 → 블록 수식
 * 2) 내용 전체가 $$ ... $$ 인 코드블록 → 블록 수식
 * 3) `...` 안이 $ ... $ 인 인라인 코드 → 인라인 수식
 */
function remarkRescueFencedMath() {
  return (tree: any) => {
    visit(tree, (node: any, index: number | null, parent: any) => {
      if (!parent || index == null) return

      if (node.type === "code") {
        const lang = (node.lang || "").toLowerCase()
        const raw = (node.value || "").trim()

        const isMathLang = lang === "math" || lang === "latex" || lang === "tex"
        const isWrappedByDollars = raw.startsWith("$$") && raw.endsWith("$$")

        if (isMathLang || isWrappedByDollars) {
          const inner = isWrappedByDollars
            ? raw.replace(/^\s*\$\$\s*/, "").replace(/\s*\$\$\s*$/, "")
            : raw
          parent.children.splice(index, 1, { type: "math", value: inner })
          return [visit.SKIP, index]
        }
      }

      if (node.type === "inlineCode") {
        const raw = (node.value || "")
        if (raw.length > 1 && raw.startsWith("$") && raw.endsWith("$")) {
          const inner = raw.slice(1, -1)
          parent.children.splice(index, 1, { type: "inlineMath", value: inner })
          return [visit.SKIP, index]
        }
      }
    })
  }
}

export const Latex: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  // 사용자 요구: MathJax를 기본값으로 사용
  const engine = opts?.renderEngine ?? "mathjax"
  const macros = opts?.customMacros ?? {}

  return {
    name: "Latex",

    // $ / $$ 토큰을 파싱하고, 코드블록으로 빠진 수식을 구출
    markdownPlugins() {
      return [remarkRescueFencedMath, remarkMath]
    },

    // HTML 변환: MathJax는 서버사이드에서 SVG로 렌더링하여 첫 진입부터 표시
    htmlPlugins() {
      switch (engine) {
        case "katex":
          return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]]
        case "typst":
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        case "mathjax":
        default:
          return [[rehypeMathjax, { tex: { macros }, svg: { fontCache: "none" } }]]
      }
    },

    // MathJax는 서버사이드로 이미 SVG가 만들어지므로 클라이언트 리소스가 불필요
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
        return
      }
    },
  }
}
