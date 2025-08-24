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
  // 요구에 따라 기본 엔진은 MathJax로 둡니다.
  const engine = opts?.renderEngine ?? "mathjax"
  const macros = opts?.customMacros ?? {}

  return {
    name: "Latex",

    // $ / $$ 구문을 파싱하기 위한 remark 플러그인
    markdownPlugins() {
      return [remarkMath]
    },

    // MathJax는 런타임 렌더링이므로 빌드 시 변환 없음
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

    // 외부 리소스 및 러너 주입: 코드블록 안의 $$ … $$를 풀어낸 뒤 즉시 typeset
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
        const configInline = `
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\$begin:math:text$', '\\\\\\$end:math:text$']],
              displayMath: [['$$', '$$'], ['\\\$begin:math:display$', '\\\\\\$end:math:display$']],
              processEscapes: true,
              packages: { '[+]': ['base','ams','newcommand','textmacros'] },
              macros: ${JSON.stringify(macros)}
            },
            // pre/code는 기본적으로 스킵하지만, 아래 러너에서 코드블록을 해제한 뒤 typeset합니다.
            options: { skipHtmlTags: ['script','noscript','style','textarea','pre','code'] },
            svg: { fontCache: 'none' },
            startup: { typeset: false }
          };
        `

        const runnerInline = `
          (function () {
            function unwrapCodeMath(root) {
              var pres = (root || document).querySelectorAll('pre');
              for (var i = 0; i < pres.length; i++) {
                var pre = pres[i];
                var code = pre.firstElementChild && pre.firstElementChild.tagName === 'CODE' ? pre.firstElementChild : null;
                if (!code) continue;
                var txt = code.textContent || '';
                // 코드블록 전체가 $$ … $$ 한 덩어리인 경우만 해제
                var m = txt.match(/^\\s*\\$\\$([\\s\\S]*?)\\$\\$\\s*$/);
                if (!m) continue;
                var tex = m[1];
                var div = document.createElement('div');
                div.className = 'mathjax-block';
                // pre/code가 아닌 일반 블록으로 옮긴 뒤, 텍스트로 $$ … $$를 넣어 MathJax 스캐너가 보게 함
                div.textContent = '$$\\n' + tex + '\\n$$';
                pre.replaceWith(div);
              }
            }

            var queue = Promise.resolve();
            var scheduled = false;
            function safeTypeset(root) {
              if (!window.MathJax || !window.MathJax.typesetPromise) return;
              if (scheduled) return;
              scheduled = true;
              queue = queue.then(function () {
                scheduled = false;
                // 먼저 코드블록에 갇힌 수식을 해제
                unwrapCodeMath(root || document);
                return window.MathJax.typesetPromise(root ? [root] : undefined)
                  .catch(function (e) { console && console.warn && console.warn('[MathJax] typeset error:', e); });
              });
            }

            function boot() {
              // 최초 1회
              safeTypeset(document);

              // 동적 콘텐츠 유입 대비
              var target = document.querySelector('main') || document.body;
              try {
                var mo = new MutationObserver(function (mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    var m = mutations[i];
                    if (m.addedNodes && m.addedNodes.length) { safeTypeset(document); break; }
                  }
                });
                mo.observe(target, { childList: true, subtree: true });
              } catch (_) {
                // 폴백 훅
                document.addEventListener('quartz:navigation', function () { safeTypeset(document); });
              }

              window.addEventListener('hashchange', function () { safeTypeset(document); });
              document.addEventListener('visibilitychange', function () {
                if (!document.hidden) safeTypeset(document);
              });
            }

            function start() {
              if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
                window.MathJax.startup.promise.then(boot);
              } else {
                boot();
              }
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', start);
            } else {
              start();
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
