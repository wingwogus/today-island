const test = require("node:test")
const assert = require("node:assert/strict")

const {
  getHomepageRevalidateSeconds,
  getSharedRouteCacheControl,
  shouldForceHomepagePostsCache,
} = require("../src/libs/utils/homepageRevalidation")

test("always enables ten-minute homepage ISR", () => {
  assert.equal(getHomepageRevalidateSeconds(), 600)
})

test("shares SSR route responses briefly while serving stale content during refresh", () => {
  assert.equal(
    getSharedRouteCacheControl(),
    "public, s-maxage=60, stale-while-revalidate=600"
  )
})

test("allows the homepage cache to be explicitly forced for safe builds", () => {
  assert.equal(shouldForceHomepagePostsCache({}), false)
  assert.equal(
    shouldForceHomepagePostsCache({ FORCE_HOMEPAGE_POSTS_CACHE: "true" }),
    true
  )
})
