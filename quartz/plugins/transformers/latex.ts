// quartz/plugins/transformers/latex.ts
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
// @ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst"
// @ts-ignore
import rehypeMathjax from "rehype-mathjax/svg"
import { QuartzTransformerPlugin } from "../types"
import { KatexOptions } from "katex"
// @ts-ignore
import { Options as TypstOptions } from "@myriaddreamin/rehype-typst"
// 언래퍼 구현용
import { visit } from "unist-util-visit"

interface Options {
  renderEngine: "katex" | "mathjax" | "typst"
  customMacros: MacroType
  katexOptions: Omit<KatexOptions, "macros" | "output">
  typstOptions: TypstOptions
}

interface MacroType {
  [key: string]: string
}

// 코드블록(pre > code) 안에 갇힌 $$ … $$ 수식을 감지해 일반 블록으로 풀어주는 rehype 플러그인
function unwrapCodeMath() {
  return (tree: any) => {
    visit(tree, "element", (node: any, index: number | null, parent: any) => {
      if (!parent || index == null) return
      if (node.tagName !== "pre") return
      if (!node.children || node.children.length !== 1) return
      const code = node.children[0]
      if (!code || code.tagName !== "code") return
      const child = code.children && code.children[0]
      if (!child || child.type !== "text") return
      const txt: string = String(child.value || "")
      // 코드블록 전체가 하나의 $$ … $$ 블록인 경우만 언래핑
      const m = txt.match(/^\s*\$\$([\s\S]*?)\$\$\s*$/)
      if (!m) return
      const body = m[1]
      const replacement = {
        type: "element",
        tagName: "div",
        properties: { className: ["mathjax-block"] },
        children: [{ type: "text", value: "$$\n" + body + "\n$$" }],
      }
      parent.children.splice(index, 1, replacement)
    })
  }
}

export const Latex: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  // 기본값: MathJax
  const engine = opts?.renderEngine ?? "mathjax"
  const macros = opts?.customMacros ?? {}

  return {
    name: "Latex",

    // $ / $$ 파싱
    markdownPlugins() {
      return [[remarkMath, { singleDollar: true }]]
    },

    // HTML 변환: MathJax는 빌드 타임에 SVG로 렌더링
    htmlPlugins() {
      switch (engine) {
        case "katex":
          return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]]
        case "typst":
          return [[rehypeTypst, opts?.typstOptions ?? {}]]
        case "mathjax":
        default:
          // 1) 코드블록에 갇힌 $$ … $$를 먼저 평범한 블록으로 언래핑
          // 2) 이어서 rehype-mathjax/svg로 서버사이드 렌더링
          return [
            [unwrapCodeMath, {}],
            [
              rehypeMathjax,
              {
                tex: {
                  packages: { "[+]": ["base", "ams", "newcommand", "textmacros"] },
                  macros,
                },
                svg: { fontCache: "none" },
              },
            ],
          ]
      }
    },

    // MathJax는 SSR이므로 클라이언트 JS 주입 불필요
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
      // mathjax/typst는 주입 리소스 없음
      return
    },
  }
}
