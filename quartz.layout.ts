import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzPluginData } from "./quartz/plugins/vfile"
import { FullSlug, SimpleSlug } from "./quartz/util/path"
import { getDate } from "./quartz/components/Date"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  // ── 본문 위쪽 영역 ────────────────────────────────────────────────────────────
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),

    // 태그 목록은 index 페이지에서는 필요 없으니 제외
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => page.fileData.slug !== "index",
    }),
  ],

  // ── 왼쪽 사이드바 ────────────────────────────────────────────────────────────
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),

    // 일반 노트에는 검색·다크모드·리더모드를 Flex 박스로 묶어 배치
    Component.ConditionalRender({
      component: Component.Flex({
        components: [
          { Component: Component.Search(), grow: true },
          { Component: Component.Darkmode() },
          { Component: Component.ReaderMode() },
        ],
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),

    // index 페이지는 말끔히 나열만
    Component.ConditionalRender({
      component: Component.Search(),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.Darkmode(),
      condition: (page) => page.fileData.slug === "index",
    }),

    Component.Explorer(),
  ],

  // ── 오른쪽 사이드바 ───────────────────────────────────────────────────────────
  right: [
    // 일반 노트용 기본 그래프
    Component.ConditionalRender({
      component: Component.Graph(),
      condition: (page) => page.fileData.slug !== "index",
    }),

    // index 전용, 깊이 제한 없는 전체 그래프
    Component.ConditionalRender({
      component: Component.Graph({
        localGraph: { depth: -1 },
      }),
      condition: (page) => page.fileData.slug === "index",
    }),

    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],

  // ── 본문 아래 영역 ────────────────────────────────────────────────────────────
  afterBody: [
    // index 페이지에만 최근 글 위젯을 붙인다
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "최근 글",
        limit: 15,
        showTags: true,
        linkToMore: false,
        filter: (f: QuartzPluginData) => f.slug !== "index",
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
}
// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
