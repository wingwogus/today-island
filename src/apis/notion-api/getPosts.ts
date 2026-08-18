import { CONFIG } from "site.config"
import { applyTitleSlug } from "src/libs/utils/slug"
import { notionFetch } from "./getPageBlocks"
import { TPosts } from "src/types"

interface DatabaseQueryResponse {
  results?: any[]
  has_more?: boolean
  next_cursor?: string | null
}

const textContent = (richText: any) =>
  richText?.map((t: any) => t.plain_text).join("") ?? ""

function mapPage(page: any): any {
  const props = page.properties
  const getRich = (name: string) =>
    textContent(props[name]?.[props[name]?.type] ?? [])
  const getSelect = (name: string) => props[name]?.[props[name]?.type]?.name
  const getMulti = (name: string) =>
    (props[name]?.[props[name]?.type] ?? []).map((o: any) => o.name)
  const getFiles = (name: string) =>
    (props[name]?.[props[name]?.type] ?? [])[0]?.file?.url ||
    (props[name]?.[props[name]?.type] ?? [])[0]?.external?.url

  const toNotionProxyUrl = (url: string | undefined, blockId: string) => {
    if (!url) return undefined
    if (!url.includes("X-Amz-") && !url.includes("prod-files-secure")) return url
    try {
      const parsed = new URL(url)
      const segments = parsed.pathname.split("/").filter(Boolean)
      const filename = segments[segments.length - 1]
      const fileId = segments[segments.length - 2]
      return `https://www.notion.so/image/attachment%3A${fileId}%3A${encodeURIComponent(
        filename
      )}?table=block&id=${encodeURIComponent(blockId)}&cache=v2`
    } catch {
      return url
    }
  }

  return {
    id: page.id,
    date: { start_date: props.date?.date?.start ?? null },
    type: getSelect("type") ? [getSelect("type")] : [],
    category: getSelect("category") ? [getSelect("category")] : [],
    tags: getMulti("tags"),
    summary: getRich("summary"),
    title: getRich("title"),
    status: getSelect("status") ? [getSelect("status")] : [],
    slug: getRich("slug"),
    thumbnail: toNotionProxyUrl(getFiles("thumbnail"), page.id),
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
    fullWidth: false,
  }
}

export async function getPosts(): Promise<TPosts> {
  const dbId = CONFIG.notionConfig.pageId
  const pages: any[] = []
  let cursor: string | undefined

  do {
    const body: Record<string, unknown> = {
      page_size: 100,
      sorts: [{ property: "date", direction: "descending" }],
    }
    if (cursor) body.start_cursor = cursor

    const result = await notionFetch<DatabaseQueryResponse>(
      `/databases/${dbId}/query`,
      { method: "POST", body: JSON.stringify(body) }
    )
    pages.push(...(result.results || []))

    if (result.has_more && !result.next_cursor) {
      throw new Error("Notion returned has_more without next_cursor")
    }
    cursor = result.has_more ? result.next_cursor || undefined : undefined
  } while (cursor)

  return pages
    .map(mapPage)
    .map((post: any) => applyTitleSlug({ ...post })) as TPosts
}
