import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeMathjax from "rehype-mathjax/cthml"
import { QuartzTransformerPlugin } from "../types"

interface Options {
  renderEngine: "katex" | "mathjax"
}

export const Latex: QuartzTransformerPlugin<Options> = (opts?: Options) => {
  const engine = opts?.renderEngine ?? "mathjax"
  return {
    name: "Latex",
    markdownPlugins() {
      return [remarkMath]
    },
    htmlPlugins() {
      if (engine === "katex") {
        return [[rehypeKatex, { output: "html" }]]
      } else {
        return [[rehypeMathjax, {}]] 
      }
    },
    externalResources() {
      if (engine === "katex") {
        return {
          css: [
            {
              // base css
              src: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css",
              loadTime: "beforeDOMReady",
              contentType: "external",
            },
          ],
          js: [
            {
              // fix copy behaviour: https://github.com/KaTeX/KaTeX/blob/main/contrib/copy-tex/README.md
              src: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/copy-tex.min.js",
              loadTime: "afterDOMReady",
              contentType: "external",
            },
          ],
       }
    }
    if (engine === "mathjax") {
      return {
        css: [
            {
              // CHTML 출력 전용 폰트/스타일 시트(인라인 스타일이 CSP로 막힐 때 사용)
              src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/tex.css",
              loadTime: "beforeDOMReady",
              contentType: "external",
            },
          ],
        }
      }
    },
  }
}
