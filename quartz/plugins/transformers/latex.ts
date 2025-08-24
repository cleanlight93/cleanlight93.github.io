import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
// @ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst"
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
  const engine = opts?.renderEngine ?? "mathjax"
  const macros = opts?.customMacros ?? {}

  return {
    name: "Latex",

    // Markdown 단계에서 $/$$ 블록을 인식시키기 위한 플러그인
    markdownPlugins() {
      return [remarkMath]
    },

    // HTML 변환 단계: KaTeX/Typst는 빌드 타임 렌더링, MathJax는 런타임 렌더링
    htmlPlugins() {
      switch (engine) {
        case "katex":
          return [[
            rehypeKatex,
            {
              output: "html",
              macros,
              ...(opts?.katexOptions ?? {}),
            },
          ]]
        case "typst":
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        case "mathjax":
        default:
          // MathJax는 런타임에서 렌더링하므로 빌드 단계에서는 변환하지 않음
          return []
      }
    },

    // 외부 리소스 로드: 각 엔진별로 필요한 CSS/JS를 주입
    externalResources() {
      if (engine === "katex") {
        return {
          css: [
            { content: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" },
          ],
          js: [
            // 선택 사항: copy-tex를 쓰고 싶을 때만 유지
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
            // MathJax v3 권장 구성: 표준 구분자 및 안전 옵션
            {
              content: `
                window.MathJax = {
                  tex: {
                    inlineMath: [['$', '$'], ['\\\$begin:math:text$', '\\\\\\$end:math:text$']],
                    displayMath: [['$$', '$$'], ['\\\$begin:math:display$', '\\\\\\$end:math:display$']],
                    processEscapes: true,
                    packages: { '[+]': ['base','ams','newcommand','textmacros'] },
                    macros: ${JSON.stringify(macros)}
                  },
                  // 코드/프리 포맷 영역은 스캔하지 않도록 하여 오탐 방지
                  options: { skipHtmlTags: ['script','noscript','style','textarea','pre','code'] },
                  // 캐시 폰트 대신 문서 내 SVG 글리프를 사용해 깔끔한 출력
                  svg: { fontCache: 'none' }
                };
              `,
              loadTime: "beforeDOMReady",
              contentType: "inline",
            },
            {
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
