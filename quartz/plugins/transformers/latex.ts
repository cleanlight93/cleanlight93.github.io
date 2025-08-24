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
  // 요구사항에 따라 MathJax를 기본값으로 유지
  const engine = opts?.renderEngine ?? "mathjax"
  const macros = opts?.customMacros ?? {}

  return {
    name: "Latex",

    // Markdown 단계에서 $ / $$ 토큰을 수식 노드로 파싱
    markdownPlugins() {
      return [remarkMath]
    },

    // HTML 단계 변환: MathJax는 빌드 타임에 SVG로 렌더링
    htmlPlugins() {
      switch (engine) {
        case "katex":
          return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]]
        case "typst":
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        case "mathjax":
        default:
          // rehype-mathjax/svg로 서버사이드 렌더링
          // macros는 MathJax TeX 매크로 그대로 전달
          return [[rehypeMathjax, { tex: { macros }, svg: { fontCache: "none" } }]]
      }
    },

    // 외부 리소스 주입
    // MathJax는 서버사이드로 이미 SVG를 생성했으므로 클라이언트 JS가 필요 없다.
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
        // 서버사이드 렌더링이므로 아무것도 주입하지 않음
        return
      }
    },
  }
}
