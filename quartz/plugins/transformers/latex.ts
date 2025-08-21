import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeMathjax from "rehype-mathjax/svg"
// @ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst"
import { QuartzTransformerPlugin } from "../types"
import { KatexOptions } from "katex"
import { Options as MathjaxOptions } from "rehype-mathjax/svg"
// @ts-ignore
import { Options as TypstOptions } from "@myriaddreamin/rehype-typst"

interface Options {
  renderEngine: "katex" | "mathjax" | "typst"
  customMacros: MacroType
  katexOptions: Omit<KatexOptions, "macros" | "output">
  mathJaxOptions: Omit<MathjaxOptions, "macros">
  typstOptions: TypstOptions
  /** 단일 $ … $ 인라인 수학 허용(Obsidian 호환) */
  allowSingleDollarInline?: boolean
}

interface MacroType {
  [key: string]: string
}

export const Latex: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  const engine = opts?.renderEngine ?? "katex"
  const macros = opts?.customMacros ?? {}

  return {
    name: "Latex",
    /** 수학 구문 인식을 코드 하이라이트보다 먼저 적용 */
    markdownPlugins() {
      return [
        [
          remarkMath,
          {
            singleDollarTextMath: opts?.allowSingleDollarInline ?? true,
          },
        ] as any,
      ]
    },
    htmlPlugins() {
      switch (engine) {
        case "katex": {
          /** KaTeX는 서버사이드로 HTML을 뱉어냄 */
          return [
            [
              rehypeKatex,
              {
                output: "html",
                macros,
                /** 표/배열·\hline 등에서 경고로 렌더링이 멈추지 않도록 */
                throwOnError: false,
                strict: "ignore",
                trust: true,
                ...(opts?.katexOptions ?? {}),
              } as any,
            ],
          ]
        }
        case "typst": {
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        }
        case "mathjax": {
          return [[rehypeMathjax, { macros, ...(opts?.mathJaxOptions ?? {}) }]]
        }
        default: {
          return [[rehypeMathjax, { macros, ...(opts?.mathJaxOptions ?? {}) }]]
        }
      }
    },
    /** 정적 렌더링은 CSS만으로 충분하지만, copy-tex는 katex.js를 필요로 함 */
    externalResources() {
      switch (engine) {
        case "katex":
          return {
            css: [
              {
                content:
                  "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",
              },
            ],
            js: [
              {
                /** copy-tex가 window.katex에 의존하므로 katex 본체를 먼저 로드 */
                src: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js",
                loadTime: "afterDOMReady",
                contentType: "external",
              },
              {
                /** 복사 동작 개선: 수식 블록 복사 시 TeX 유지 */
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
                /** MathJax v3 SVG 어댑터(옵션) – 사이트 크기 최적화 시 유용 */
                src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js",
                loadTime: "afterDOMReady",
                contentType: "external",
              },
            ],
          }
        case "typst":
          /** rehype-typst는 서버에서 SVG를 생성하므로 외부 리소스 불필요 */
          return {}
      }
    },
  }
}
