const fs = require("fs/promises")
const path = require("path")
const { NotionAPI } = require("notion-client")
const { getDateValue, getTextContent, idToUuid } = require("notion-utils")
const { CONFIG } = require("../site.config")

const CACHE_PATH = path.join(
  process.cwd(),
  "src/generated/homepage-posts-cache.json"
)
const RETRYABLE_STATUS_CODES = new Set([408, 409, 425, 429, 500, 502, 503, 504])

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function withNotionRetry(label, task) {
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await task()
    } catch (error) {
      const statusCode = error?.statusCode || error?.response?.status
      const shouldRetry =
        attempt < maxAttempts && RETRYABLE_STATUS_CODES.has(statusCode)

      if (!shouldRetry) {
        error.message = `${label} failed: ${error.message}`
        throw error
      }

      await sleep(500 * attempt)
    }
  }
}

function mapNotionImageUrl(url, block) {
  if (!url) return undefined
  if (url.startsWith("data:")) return url
  if (url.startsWith("https://images.unsplash.com")) return url

  try {
    const parsedUrl = new URL(url)

    if (
      parsedUrl.pathname.startsWith("/secure.notion-static.com") &&
      parsedUrl.hostname.endsWith(".amazonaws.com") &&
      parsedUrl.searchParams.has("X-Amz-Credential") &&
      parsedUrl.searchParams.has("X-Amz-Signature") &&
      parsedUrl.searchParams.has("X-Amz-Algorithm")
    ) {
      url = parsedUrl.origin + parsedUrl.pathname
    }
  } catch {
    // Keep invalid URLs on the same Notion mapping path as runtime rendering.
  }

  if (url.startsWith("/images")) {
    url = `https://www.notion.so${url}`
  }

  const notionImageUrl = new URL(
    `https://www.notion.so${
      url.startsWith("/image") ? url : `/image/${encodeURIComponent(url)}`
    }`
  )
  let table = block.parent_table === "space" ? "block" : block.parent_table
  if (table === "collection" || table === "team") {
    table = "block"
  }
  notionImageUrl.searchParams.set("table", table)
  notionImageUrl.searchParams.set("id", block.id)
  notionImageUrl.searchParams.set("cache", "v2")

  return notionImageUrl.toString()
}

async function getPageProperties(api, id, block, schema) {
  const blockValue = block?.[id]?.value?.value
  const rawProperties = Object.entries(blockValue?.properties || [])
  const excludeProperties = ["date", "select", "multi_select", "person", "file"]
  const properties = {}

  for (const [key, val] of rawProperties) {
    properties.id = id
    const propertySchema = schema[key]

    if (propertySchema?.type && !excludeProperties.includes(propertySchema.type)) {
      properties[propertySchema.name] = getTextContent(val)
      continue
    }

    switch (propertySchema?.type) {
      case "file": {
        try {
          const url = val[0][1][0][1]
          properties[propertySchema.name] = mapNotionImageUrl(url, blockValue)
        } catch {
          properties[propertySchema.name] = undefined
        }
        break
      }
      case "date": {
        const dateProperty = getDateValue(val)
        delete dateProperty.type
        properties[propertySchema.name] = dateProperty
        break
      }
      case "select":
      case "multi_select": {
        const selects = getTextContent(val)
        if (selects[0]?.length) {
          properties[propertySchema.name] = selects.split(",")
        }
        break
      }
      case "person": {
        const users = []

        for (const rawUser of val.flat()) {
          if (!rawUser[0]?.[1]) continue

          const userId = rawUser[0]
          const response = await withNotionRetry(
            "getPageProperties:getUsers",
            () => api.getUsers(userId)
          )
          const userValue =
            response?.recordMapWithRoles?.notion_user?.[userId[1]]?.value

          users.push({
            id: userValue?.id,
            name:
              userValue?.name ||
              `${userValue?.family_name}${userValue?.given_name}` ||
              undefined,
            profile_photo: userValue?.profile_photo || null,
          })
        }

        properties[propertySchema.name] = users
        break
      }
      default:
        break
    }
  }

  return properties
}

function filterHomepagePosts(posts) {
  const current = new Date()
  const tomorrow = new Date(current)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  return posts.filter((post) => {
    const postDate = new Date(post?.date?.start_date || post.createdTime)

    return (
      post.title &&
      post.slug &&
      postDate <= tomorrow &&
      post.status?.[0] === "Public" &&
      post.type?.[0] === "Post"
    )
  })
}

async function getPosts() {
  const api = new NotionAPI()
  const pageId = CONFIG.notionConfig.pageId
  const response = await withNotionRetry("getPosts:getPage", () =>
    api.getPage(pageId)
  )
  const uuid = idToUuid(pageId)
  const collection = Object.values(response.collection)[0]?.value?.value
  const block = response.block
  const schema = collection?.schema
  const rawMetadata = block[uuid]?.value?.value

  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    return []
  }

  const rawCollectionId = rawMetadata?.collection_id
  const rawViewId = rawMetadata?.view_ids?.[0]

  if (!rawCollectionId || !rawViewId || !schema) {
    return []
  }

  const collectionData = await withNotionRetry("getPosts:getCollectionData", () =>
    api.getCollectionData(
      rawCollectionId,
      rawViewId,
      response.collection_view?.[rawViewId]?.value
    )
  )
  const pageIds =
    collectionData.result?.reducerResults?.collection_group_results?.blockIds ||
    []

  if (!pageIds.length) {
    return []
  }

  const tempBlock = (
    await withNotionRetry("getPosts:getBlocks", () => api.getBlocks(pageIds))
  ).recordMap.block
  const data = []

  for (const id of pageIds) {
    const blockValue = tempBlock[id]?.value?.value
    if (!blockValue) continue

    const properties = await getPageProperties(api, id, tempBlock, schema)
    properties.createdTime = new Date(blockValue?.created_time).toString()
    properties.fullWidth = blockValue?.format?.page_full_width ?? false

    data.push(properties)
  }

  data.sort((a, b) => {
    const dateA = new Date(a?.date?.start_date || a.createdTime)
    const dateB = new Date(b?.date?.start_date || b.createdTime)
    return dateB - dateA
  })

  return data
}

async function main() {
  const posts = filterHomepagePosts(await getPosts())

  if (!posts.length) {
    throw new Error("Refusing to replace homepage posts cache with an empty list")
  }

  await fs.writeFile(CACHE_PATH, `${JSON.stringify(posts, null, 2)}\n`)

  console.log(
    `Updated ${path.relative(process.cwd(), CACHE_PATH)} with ${posts.length} posts`
  )
  console.log(`Latest: ${posts[0].date?.start_date || "unknown"} ${posts[0].title}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
