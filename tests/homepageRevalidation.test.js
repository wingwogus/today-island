const test = require("node:test")
const assert = require("node:assert/strict")

const {
  getHomepageRevalidateSeconds,
  shouldForceHomepagePostsCache,
} = require("../src/libs/utils/homepageRevalidation")

test("always enables ten-minute homepage ISR", () => {
  assert.equal(getHomepageRevalidateSeconds(), 600)
})

test("allows the homepage cache to be explicitly forced for safe builds", () => {
  assert.equal(shouldForceHomepagePostsCache({}), false)
  assert.equal(
    shouldForceHomepagePostsCache({ FORCE_HOMEPAGE_POSTS_CACHE: "true" }),
    true
  )
})
