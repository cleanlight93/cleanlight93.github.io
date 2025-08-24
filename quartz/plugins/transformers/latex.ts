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
  // tex은 내부에서 병합하므로 여기서는 제외
  mathJaxOptions: Omit<MathjaxOptions, "tex">
  typstOptions: TypstOptions
}

interface MacroType {
  [key: string]: string
}

export const Latex: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  const engine = opts?.renderEngine ?? "katex"
  const userMacros = opts?.customMacros ?? {}

  // MathJax 옵션: \text 지원(textmacros) 강제 + 회색 박스 회피(fontCache:none)
  const buildMJ = (): MathjaxOptions => {
    const user = (opts?.mathJaxOptions ?? {}) as any
    const userTex = user.tex ?? {}
    const packages = Array.from(
      new Set([...(userTex.packages ?? []), "base", "ams", "newcommand", "textmacros"]),
    )
    return {
      ...user,
      tex: {
        ...userTex,
        packages,
        macros: { ...(userTex.macros ?? {}), ...userMacros },
      },
      svg: { ...(user.svg ?? {}), fontCache: "none" },
    } as MathjaxOptions
  }

  return {
    name: "Latex",
    markdownPlugins() {
      return [remarkMath]
    },
    htmlPlugins() {
      switch (engine) {
        case "katex": {
          return [[rehypeKatex, { output: "html", macros: userMacros, ...(opts?.katexOptions ?? {}) }]]
        }
        case "typst": {
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        }
        case "mathjax": {
          return [[rehypeMathjax, buildMJ()]]
        }
        default: {
          return [[rehypeMathjax, buildMJ()]]
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
                src: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js",
                loadTime: "afterDOMReady",
                contentType: "external",
              },
            ],
          }
        case "mathjax":
          // 외부 tex-svg.js는 충돌을 일으켜 초기 렌더를 망가뜨리므로 로드하지 않습니다.
          // 대신 전역 테마가 SVG를 회색으로 칠하는 경우를 한 번에 무력화하는 최소 CSS만 주입합니다.
          return {
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
          }
      }
    },
  }
}
