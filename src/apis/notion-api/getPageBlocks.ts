import { CONFIG } from "site.config"

const NOTION_VERSION = "2022-06-28"
const MAX_DEPTH = 6

function getHeaders(): Record<string, string> {
  const token = process.env.NOTION_TOKEN
  if (!token) {
    throw new Error("NOTION_TOKEN environment variable is required")
  }
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  }
}

export async function notionFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) },
  })
  const body = await response.json()
  if (!response.ok) {
    throw new Error(`${response.status} ${JSON.stringify(body)}`)
  }
  return body as T
}

interface ListResponse<T> {
  results: T[]
  has_more: boolean
  next_cursor: string | null
}

async function listAll<T>(path: string): Promise<T[]> {
  const all: T[] = []
  let cursor: string | undefined

  do {
    const separator = path.includes("?") ? "&" : "?"
    const cursorPart = cursor
      ? `&start_cursor=${encodeURIComponent(cursor)}`
      : ""
    const result = await notionFetch<ListResponse<T>>(
      `${path}${separator}page_size=100${cursorPart}`
    )
    all.push(...result.results)
    cursor = result.has_more ? result.next_cursor || undefined : undefined
  } while (cursor)

  return all
}

/**
 * 페이지의 모든 블록을 트리 구조로 가져온다.
 * 각 블록에 children(하위 블록 배열)을 붙여 반환한다.
 */
export async function getPageBlockTree(pageId: string): Promise<any[]> {
  const topLevel = await listAll<any>(`/blocks/${pageId}/children`)

  async function attachChildren(blocks: any[], depth: number): Promise<any[]> {
    if (depth > MAX_DEPTH) return blocks

    const withChildren: any[] = []
    for (const block of blocks) {
      const next = { ...block }
      if (block.has_children) {
        const children = await listAll<any>(`/blocks/${block.id}/children`)
        next.children = await attachChildren(children, depth + 1)
      }
      withChildren.push(next)
    }
    return withChildren
  }

  return attachChildren(topLevel, 0)
}

export { CONFIG }
