const test = require("node:test")
const assert = require("node:assert/strict")

const { filterPostsCore } = require("../src/libs/utils/notion/filterPostsCore")

const basePost = {
  id: "post-id",
  title: "Published post",
  slug: "published-post",
  date: { start_date: "2026-01-01" },
  status: ["Public"],
  type: ["Post"],
  createdTime: "Thu Jan 01 2026 00:00:00 GMT+0900 (Korean Standard Time)",
  fullWidth: false,
}

test("ignores titled rows that do not have status or type metadata", () => {
  const rows = [
    { ...basePost, id: "missing-status", status: undefined },
    { ...basePost, id: "missing-type", type: undefined },
    basePost,
  ]

  const filtered = filterPostsCore(rows, {
    acceptStatus: ["Public"],
    acceptType: ["Post"],
    now: new Date("2026-01-02T00:00:00+09:00"),
  })

  assert.deepEqual(
    filtered.map((post) => post.id),
    ["post-id"]
  )
})

test("keeps public posts with generated slugs and required metadata", () => {
  const filtered = filterPostsCore([basePost], {
    acceptStatus: ["Public"],
    acceptType: ["Post"],
    now: new Date("2026-01-02T00:00:00+09:00"),
  })

  assert.equal(filtered.length, 1)
  assert.equal(filtered[0].slug, "published-post")
})
