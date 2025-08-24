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

    // 설치 없이 런타임 MathJax 스캔을 쓰기 위해 markdown 단계에서는 아무 것도 하지 않음
    markdownPlugins() {
      return []
    },

    // KaTeX/Typst만 빌드 변환, MathJax는 런타임 렌더링
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
            options: { skipHtmlTags: ['script','noscript','style','textarea'] },
            svg: { fontCache: 'none' },
            startup: { typeset: false }
          };
        `

        const runnerInline = `
          (function () {
            function unwrapCodeBlockMath(root) {
              var pres = (root || document).querySelectorAll('pre');
              for (var i = 0; i < pres.length; i++) {
                var pre = pres[i];
                if (!pre.firstElementChild || pre.firstElementChild.tagName !== 'CODE') continue;
                var code = pre.firstElementChild;
                var txt = code.textContent || '';
                var m = txt.match(/^\\s*\\$\\$([\\s\\S]*?)\\$\\$\\s*$/);
                if (!m) continue;
                var div = document.createElement('div');
                div.className = 'mathjax-block';
                div.textContent = '$$\\n' + m[1] + '\\n$$';
                pre.replaceWith(div);
              }
            }

            function typesetNow(root) {
              if (!window.MathJax || !window.MathJax.typesetPromise) return;
              unwrapCodeBlockMath(root || document);
              return window.MathJax.typesetPromise(root ? [root] : undefined).catch(function (e) {
                try { console.warn('[MathJax] typeset error:', e); } catch (_) {}
              });
            }

            function bootAfterMJ() {
              typesetNow(document);
              var target = document.querySelector('main') || document.body;
              try {
                var mo = new MutationObserver(function (muts) {
                  for (var i = 0; i < muts.length; i++) {
                    if (muts[i].addedNodes && muts[i].addedNodes.length) {
                      typesetNow(document);
                      break;
                    }
                  }
                });
                mo.observe(target, { childList: true, subtree: true });
              } catch (_) {
                document.addEventListener('quartz:navigation', function () { typesetNow(document); });
              }
              window.addEventListener('hashchange', function () { typesetNow(document); });
              document.addEventListener('visibilitychange', function () { if (!document.hidden) typesetNow(document); });
            }

            function start() {
              if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
                window.MathJax.startup.promise.then(bootAfterMJ);
              } else {
                // 로더가 startup을 노출하지 않는 드문 케이스 폴백
                setTimeout(bootAfterMJ, 0);
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
