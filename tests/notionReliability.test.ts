import assert from "node:assert/strict"
import test, { afterEach } from "node:test"
import { getPosts } from "../src/apis/notion-api/getPosts"
import { notionFetch } from "../src/apis/notion-api/getPageBlocks"
import { NotionHttpError } from "../src/apis/notion-api/notionHttpError"
import { withNotionRetry } from "../src/libs/utils/notion/withNotionRetry"

const originalFetch = global.fetch
const originalToken = process.env.NOTION_TOKEN

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })

const page = (id: string, lastEditedTime = "2026-01-01T00:00:00.000Z") => ({
  id,
  properties: {
    date: { type: "date", date: { start: "2026-01-01" } },
    type: { type: "select", select: { name: "Post" } },
    category: { type: "select", select: { name: "Tech" } },
    tags: { type: "multi_select", multi_select: [] },
    summary: { type: "rich_text", rich_text: [] },
    title: { type: "title", title: [{ plain_text: id }] },
    status: { type: "select", select: { name: "Public" } },
    slug: { type: "rich_text", rich_text: [{ plain_text: id }] },
    thumbnail: { type: "files", files: [] },
  },
  created_time: "2026-01-01T00:00:00.000Z",
  last_edited_time: lastEditedTime,
})

afterEach(() => {
  global.fetch = originalFetch
  if (originalToken === undefined) delete process.env.NOTION_TOKEN
  else process.env.NOTION_TOKEN = originalToken
})

test("retries a transient Notion error and preserves HTTP status", async () => {
  let calls = 0
  const result = await withNotionRetry(
    "test",
    async () => {
      calls += 1
      if (calls === 1) throw new NotionHttpError(429, "rate limited")
      return "recovered"
    },
    { attempts: 2, delayMs: 0 }
  )

  assert.equal(result, "recovered")
  assert.equal(calls, 2)
})

test("stops after the bounded retry budget and does not retry other errors", async () => {
  let retryableCalls = 0
  await assert.rejects(
    withNotionRetry(
      "test",
      async () => {
        retryableCalls += 1
        throw new NotionHttpError(503, "unavailable")
      },
      { attempts: 3, delayMs: 0 }
    ),
    (error: unknown) => error instanceof NotionHttpError && error.status === 503
  )
  assert.equal(retryableCalls, 3)

  let nonRetryableCalls = 0
  await assert.rejects(
    withNotionRetry(
      "test",
      async () => {
        nonRetryableCalls += 1
        throw new NotionHttpError(401, "unauthorized")
      },
      { attempts: 3, delayMs: 0 }
    )
  )
  assert.equal(nonRetryableCalls, 1)
})

test("notionFetch retains a non-JSON HTTP failure status", async () => {
  process.env.NOTION_TOKEN = "test-token"
  global.fetch = async () => new Response("bad request", { status: 400 })

  await assert.rejects(
    notionFetch("/test"),
    (error: unknown) => error instanceof NotionHttpError && error.status === 400
  )
})

test("getPosts follows cursors and includes a changed post after the first 100", async () => {
  process.env.NOTION_TOKEN = "test-token"
  const firstPage = Array.from({ length: 100 }, (_, index) => page(`post-${index}`))
  const changedPost = page("changed-after-100", "2026-08-18T00:00:00.000Z")
  const requestBodies: Record<string, unknown>[] = []

  global.fetch = async (_input, init) => {
    requestBodies.push(JSON.parse(String(init?.body)))
    return requestBodies.length === 1
      ? response({ results: firstPage, has_more: true, next_cursor: "next-page" })
      : response({ results: [changedPost], has_more: false, next_cursor: null })
  }

  const posts = await getPosts()

  assert.equal(posts.length, 101)
  assert.deepEqual(requestBodies[1].start_cursor, "next-page")
  assert.equal(posts.at(-1)?.id, "changed-after-100")
  assert.equal(
    (posts.at(-1) as { lastEditedTime?: string } | undefined)?.lastEditedTime,
    "2026-08-18T00:00:00.000Z"
  )
})

test("getPosts rejects instead of exposing a partial result after a later page fails", async () => {
  process.env.NOTION_TOKEN = "test-token"
  let calls = 0
  global.fetch = async () => {
    calls += 1
    return calls === 1
      ? response({ results: [page("first")], has_more: true, next_cursor: "next-page" })
      : response({ message: "bad request" }, 400)
  }

  await assert.rejects(getPosts(), NotionHttpError)
  assert.equal(calls, 2)
})

test("getPosts rejects a malformed cursor continuation without returning a prefix", async () => {
  process.env.NOTION_TOKEN = "test-token"
  let calls = 0
  global.fetch = async () => {
    calls += 1
    return response({ results: [page("first")], has_more: true, next_cursor: null })
  }

  await assert.rejects(getPosts(), /has_more without next_cursor/)
  assert.equal(calls, 1)
})

test("getPosts discards accumulated pages after later transient retries exhaust", async () => {
  process.env.NOTION_TOKEN = "test-token"
  let calls = 0
  global.fetch = async () => {
    calls += 1
    return calls === 1
      ? response({ results: [page("first")], has_more: true, next_cursor: "next-page" })
      : response({ message: "unavailable" }, 503)
  }

  await assert.rejects(
    getPosts(),
    (error: unknown) => error instanceof NotionHttpError && error.status === 503
  )
  assert.equal(calls, 5)
})
