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
  mathJaxOptions: Omit<MathjaxOptions, "macros">
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
        case "katex": {
          return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]]
        }
        case "typst": {
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        }
        case "mathjax": 
        default: 
          return  []
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
            // MathJax v3 설정을 먼저 주입(인라인)
            js: [
              {
                content: `
                  window.MathJax = {
                    tex: {
                      // \$begin:math:text$ \\$end:math:text$ / $$ $$ 지원 + \\text 등 보장
                      inlineMath: [['\\\$begin:math:text$','\\\\\\$end:math:text$']],
                      displayMath: [['$$','$$']],
                      packages: {'[+]': ['base','ams','newcommand','textmacros']},
                      macros: ${JSON.stringify(macros)}
                    },
                    svg: {
                      // 깃헙 페이지/정화 이슈 회피용
                      fontCache: 'none'
                    },
                    options: {
                      renderActions: {
                        addMenu: []
                      }
                    }
                  };
                `,
                loadTime: "beforeDOMReady",
                contentType: "inline",
              },
              {
                // 외부 MathJax: TeX → SVG 렌더러
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
