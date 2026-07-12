const test = require("node:test")
const assert = require("node:assert/strict")

const {
  getHomepageRevalidateSeconds,
  shouldFetchFreshHomepagePosts,
} = require("../src/libs/utils/homepageRevalidation")

test("enables ten-minute homepage ISR only for live Notion posts", () => {
  const environment = { HOMEPAGE_POSTS_SOURCE: "notion" }

  assert.equal(shouldFetchFreshHomepagePosts(environment), true)
  assert.equal(getHomepageRevalidateSeconds(environment), 600)
})

test("keeps cache-only homepage builds outside live Notion mode", () => {
  assert.equal(shouldFetchFreshHomepagePosts({}), false)
  assert.equal(getHomepageRevalidateSeconds({}), false)
})

test("disables fresh Notion reads when the cache is explicitly forced", () => {
  const environment = {
    HOMEPAGE_POSTS_SOURCE: "notion",
    FORCE_HOMEPAGE_POSTS_CACHE: "true",
  }

  assert.equal(shouldFetchFreshHomepagePosts(environment), false)
  assert.equal(getHomepageRevalidateSeconds(environment), false)
})
