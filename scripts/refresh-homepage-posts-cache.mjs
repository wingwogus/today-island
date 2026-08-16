import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { CONFIG } from "../site.config.js"
import { applyTitleSlug } from "../src/libs/utils/slug.js"

const TOKEN = process.env.NOTION_TOKEN
if (!TOKEN) {
  console.error(
    "NOTION_TOKEN environment variable is required (Notion internal integration token)"
  )
  process.exit(1)
}

const DB_ID = CONFIG.notionConfig.pageId
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
}

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  })
  const body = await response.json()
  if (!response.ok) {
    throw new Error(`${response.status} ${JSON.stringify(body)}`)
  }
  return body
}

const textContent = (richText) => richText?.map((t) => t.plain_text).join("") ?? ""

function mapPage(page) {
  const props = page.properties
  const getRich = (name) => textContent(props[name]?.[props[name]?.type] ?? [])
  const getSelect = (name) => props[name]?.[props[name]?.type]?.name
  const getMulti = (name) =>
    (props[name]?.[props[name]?.type] ?? []).map((o) => o.name)
  const getFiles = (name) =>
    (props[name]?.[props[name]?.type] ?? [])[0]?.file?.url ||
    (props[name]?.[props[name]?.type] ?? [])[0]?.external?.url

  // Notion 공식 API는 만료 시간이 있는 임시 이미지 URL을 반환한다.
  // 캐시에는 인증 정보가 없는 Notion 이미지 프록시 URL을 저장한다.
  const toNotionProxyUrl = (url) => {
    if (!url) return undefined
    if (!url.includes("X-Amz-") && !url.includes("prod-files-secure")) return url

    try {
      const parsed = new URL(url)
      const segments = parsed.pathname.split("/").filter(Boolean)
      const filename = segments[segments.length - 1]
      const fileId = segments[segments.length - 2]

      return `https://www.notion.so/image/attachment%3A${fileId}%3A${encodeURIComponent(filename)}?table=block&cache=v2`
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
    thumbnail: toNotionProxyUrl(getFiles("thumbnail")),
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
    fullWidth: false,
  }
}

function filterHomepagePosts(posts) {
  const current = new Date()
  const tomorrow = new Date(current)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  return posts
    .filter((post) => {
      const postDate = new Date(post?.date?.start_date || post.createdTime)

      return (
        post.title &&
        (post.slug || post.id) &&
        postDate <= tomorrow &&
        post.status?.[0] === "Public" &&
        post.type?.[0] === "Post"
      )
    })
    .map((post) => applyTitleSlug({ ...post }))
    .sort((a, b) => {
      const dateA = new Date(a?.date?.start_date || a.createdTime)
      const dateB = new Date(b?.date?.start_date || b.createdTime)
      return dateB - dateA
    })
}

async function queryAllPages() {
  const all = []
  let cursor

  do {
    const body = {
      page_size: 100,
      sorts: [{ property: "date", direction: "descending" }],
    }
    if (cursor) body.start_cursor = cursor

    const result = await jsonFetch(
      `https://api.notion.com/v1/databases/${DB_ID}/query`,
      { method: "POST", body: JSON.stringify(body) }
    )
    all.push(...result.results)
    cursor = result.has_more ? result.next_cursor : undefined
  } while (cursor)

  return all
}

async function main() {
  const pages = await queryAllPages()
  const posts = filterHomepagePosts(pages.map(mapPage))

  if (!posts.length) {
    throw new Error("Refusing to replace homepage posts cache with an empty list")
  }

  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  const cachePath = path.join(
    currentDir,
    "..",
    "src/generated/homepage-posts-cache.json"
  )
  await fs.writeFile(cachePath, `${JSON.stringify(posts, null, 2)}\n`)

  console.log(
    `Updated ${path.relative(process.cwd(), cachePath)} with ${posts.length} posts`
  )
  console.log(`Latest: ${posts[0].date?.start_date || "unknown"} ${posts[0].title}`)
  console.log(`Slug: ${posts[0].slug}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
