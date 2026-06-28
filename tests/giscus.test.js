const test = require("node:test")
const assert = require("node:assert/strict")

const {
  buildGiscusScriptAttributes,
  isGiscusConfigReady,
} = require("../src/routes/Detail/PostDetail/CommentBox/giscusConfig")

const completeConfig = {
  repo: "wingwogus/today-island",
  repoId: "R_kgDOGiscus",
  category: "Announcements",
  categoryId: "DIC_kwDOGiscus4C",
  lang: "ko",
}

test("builds Giscus script attributes with a stable Notion page id term", () => {
  const attrs = buildGiscusScriptAttributes(completeConfig, {
    postId: "3819e2d9-4405-8073-8d8a-c619b54661a9",
    theme: "dark",
  })

  assert.equal(attrs.src, "https://giscus.app/client.js")
  assert.equal(attrs["data-repo"], "wingwogus/today-island")
  assert.equal(attrs["data-repo-id"], "R_kgDOGiscus")
  assert.equal(attrs["data-category"], "Announcements")
  assert.equal(attrs["data-category-id"], "DIC_kwDOGiscus4C")
  assert.equal(attrs["data-mapping"], "specific")
  assert.equal(
    attrs["data-term"],
    "notion:3819e2d9-4405-8073-8d8a-c619b54661a9"
  )
  assert.equal(attrs["data-strict"], "0")
  assert.equal(attrs["data-theme"], "dark")
  assert.equal(attrs["data-lang"], "ko")
})

test("requires all GitHub repository and discussion identifiers", () => {
  assert.equal(isGiscusConfigReady(completeConfig), true)
  assert.equal(isGiscusConfigReady({ ...completeConfig, repoId: "" }), false)
  assert.equal(
    isGiscusConfigReady({ ...completeConfig, categoryId: "" }),
    false
  )
})

test("uses the configured today-island Giscus repository by default", () => {
  delete require.cache[require.resolve("../site.config")]

  const { CONFIG } = require("../site.config")

  assert.equal(CONFIG.giscus.enable, true)
  assert.deepEqual(CONFIG.giscus.config, {
    repo: "wingwogus/today-island",
    repoId: "R_kgDONrt9_w",
    category: "Announcements",
    categoryId: "DIC_kwDONrt9_84DAEy7",
    lang: "ko",
  })
})
