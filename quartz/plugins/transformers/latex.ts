import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
// 내부 렌더러는 KaTeX/Typst만 사용. MathJax는 외부 스크립트가 담당
import rehypeMathjax from "rehype-mathjax/svg"
//@ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst"
import { QuartzTransformerPlugin } from "../types"
import { KatexOptions } from "katex"
//@ts-ignore
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
  const engine = opts?.renderEngine ?? "katex"
  const macros = opts?.customMacros ?? {}
  return {
    name: "Latex",
    markdownPlugins() {
      return [remarkMath]
    },
    htmlPlugins() {
      switch (engine) {
        case "katex":
          return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]]
        case "typst":
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        case "mathjax":
          // 내부 렌더링은 하지 않음. 외부 MathJax가 직접 처리.
          return []
        default:
          return []
      }
    },
    externalResources() {
      switch (engine) {
        case "katex":
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
        case "mathjax":
          return {
            js: [
              {
                // 전역 MathJax 설정: 첫 진입부터 typeset 실행
                content: `
                  window.MathJax = {
                    tex: {
                      inlineMath: [['\\\$begin:math:text$','\\\\\\$end:math:text$']],
                      displayMath: [['$$','$$']],
                      packages: {'[+]': ['base','ams','newcommand','textmacros']},
                      macros: ${JSON.stringify(macros)}
                    },
                    svg: { fontCache: 'none' },
                    startup: {
                      typeset: true   // 페이지 로드시 바로 렌더
                    }
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
