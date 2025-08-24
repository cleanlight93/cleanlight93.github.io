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
  // 요구사항에 따라 기본값은 MathJax로 둔다.
  const engine = opts?.renderEngine ?? "mathjax"
  const macros = opts?.customMacros ?? {}

  // 공통: 마크다운에서 $ / $$ 블록을 인식시킨다.
  const mdPlugins = [remarkMath]

  return {
    name: "Latex",

    markdownPlugins() {
      return mdPlugins
    },

    htmlPlugins() {
      switch (engine) {
        case "katex":
          return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]]
        case "typst":
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        case "mathjax":
        default:
          // MathJax는 런타임 렌더링을 사용하므로 빌드 단계 변환은 하지 않는다.
          return []
      }
    },

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
        // 초기 진입과 클라이언트 사이드 내비게이션 모두에서 typeset을 확실히 돌리기 위해
        // 1) 설정에서 startup.typeset:false로 두고
        // 2) tex-svg 로드 이후에 안정적인 러너를 주입한다.
        const configInline = `
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\$begin:math:text$', '\\\\\\$end:math:text$']],
              displayMath: [['$$', '$$'], ['\\\$begin:math:display$', '\\\\\\$end:math:display$']],
              processEscapes: true,
              packages: { '[+]': ['base','ams','newcommand','textmacros'] },
              macros: ${JSON.stringify(macros)}
            },
            options: { skipHtmlTags: ['script','noscript','style','textarea','pre','code'] },
            svg: { fontCache: 'none' },
            startup: { typeset: false } // 우리가 수동으로 제어
          };
        `

        // MathJax 로드가 끝난 뒤와 문서 교체/갱신 시점마다 typesetPromise를 호출한다.
        // Quartz의 라우팅/갱신 이벤트 유무와 무관하게 MutationObserver로 보강한다.
        const runnerInline = `
          (function () {
            var queue = Promise.resolve();
            var scheduled = false;

            function safeTypeset(root) {
              if (!window.MathJax || !window.MathJax.typesetPromise) return;
              // 과도 호출 방지를 위해 작업을 직렬화하고 디바운스한다.
              if (scheduled) return;
              scheduled = true;
              queue = queue.then(function () {
                scheduled = false;
                return window.MathJax.typesetPromise(root ? [root] : undefined).catch(function (e) {
                  console && console.warn && console.warn('[MathJax] typeset error:', e);
                });
              });
            }

            function init() {
              // 첫 진입에서 1회 보장
              safeTypeset(document);

              // DOM 변화를 감지해 새로 유입된 컨텐츠에 대해 재렌더링
              var target = document.querySelector('main') || document.body;
              try {
                var mo = new MutationObserver(function (mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    var m = mutations[i];
                    if (m.addedNodes && m.addedNodes.length) {
                      // 성능을 위해 추가된 노드들에만 한정해도 되지만,
                      // 안전을 위해 루트 기준 재렌더링(디바운스됨).
                      safeTypeset(document);
                      break;
                    }
                  }
                });
                mo.observe(target, { childList: true, subtree: true });
              } catch (e) {
                // 일부 환경에서 observer가 실패하면 폴백으로 단순 이벤트 훅을 쓴다.
                document.addEventListener('quartz:navigation', function () { safeTypeset(document); });
                document.addEventListener('DOMContentLoaded', function () { safeTypeset(document); });
              }

              // 혹시 프레임워크/테마가 커스텀 이벤트를 쏘면 추가 훅
              window.addEventListener('hashchange', function () { safeTypeset(document); });
              document.addEventListener('visibilitychange', function () {
                if (!document.hidden) safeTypeset(document);
              });
            }

            // MathJax가 완전히 로드된 뒤 초기화
            function afterMathJaxReady() {
              if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
                window.MathJax.startup.promise.then(init);
              } else {
                // 드물게 startup.promise가 없는 빌드에서의 폴백
                init();
              }
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', afterMathJaxReady);
            } else {
              afterMathJaxReady();
            }
          })();
        `

        return {
          js: [
            {
              content: configInline,
              loadTime: "beforeDOMReady",
              contentType: "inline",
            },
            {
              src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js",
              loadTime: "afterDOMReady",
              contentType: "external",
            },
            {
              content: runnerInline,
              loadTime: "afterDOMReady",
              contentType: "inline",
            },
          ],
        }
      }
    },
  }
}
