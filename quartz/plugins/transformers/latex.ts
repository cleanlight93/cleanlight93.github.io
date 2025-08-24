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
        case "mathjax": {
          // 내부 파이프라인은 기존 그대로 유지
          return [[rehypeMathjax, { macros, ...(opts?.mathJaxOptions ?? {}) }]]
        }
        default: {
          return [[rehypeMathjax, { macros, ...(opts?.mathJaxOptions ?? {}) }]]
        }
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
            // 처음 진입 시 회색 SVG를 방지하기 위한 최소 CSS 오버라이드
            css: [
              {
                content: `
                  svg[data-mml-node] { background: transparent !important; }
                  svg[data-mml-node] path,
                  svg[data-mml-node] rect,
                  svg[data-mml-node] circle,
                  svg[data-mml-node] polygon,
                  svg[data-mml-node] polyline,
                  svg[data-mml-node] line {
                    fill: currentColor !important;
                    stroke: currentColor !important;
                  }
                `,
              },
            ],
            js: [
              {
                // MathJax v3 전역 설정: 내부 렌더와 충돌 피하려고 자동 typeset 비활성화
                content: `
                  window.MathJax = {
                    startup: { typeset: false },
                    tex: {
                      inlineMath: [['\\\$begin:math:text$','\\\\\\$end:math:text$']],
                      displayMath: [['$$','$$']],
                      packages: {'[+]': ['base','ams','newcommand','textmacros']},
                      macros: ${JSON.stringify(macros)}
                    },
                    svg: { fontCache: 'none' }
                  };
                `,
                loadTime: "beforeDOMReady",
                contentType: "inline",
              },
              {
                // 외부 MathJax TeX→SVG 로더
                src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js",
                loadTime: "afterDOMReady",
                contentType: "external",
              },
              {
                // 첫 진입 시 즉시 재도색/재배치가 되도록 보장 (새로고침 없이)
                content: `
                  (function () {
                    function onceReady(fn) {
                      if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', fn, { once: true });
                      } else {
                        fn();
                      }
                    }
                    onceReady(function () {
                      if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
                        MathJax.typesetPromise().catch(function(){});
                      }
                    });
                  })();
                `,
                loadTime: "afterDOMReady",
                contentType: "inline",
              },
            ],
          }
      }
    },
  }
}
