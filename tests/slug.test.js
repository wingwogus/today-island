const test = require("node:test")
const assert = require("node:assert/strict")

const { applyTitleSlug, createSlugFromTitle } = require("../src/libs/utils/slug")

test("creates URL slug from a weekly retrospective title", () => {
  assert.equal(
    createSlugFromTitle("[주간 회고] 2026.06.15 ~ 2026.06.21"),
    "주간-회고-2026-06-15-2026-06-21"
  )
})

test("collapses consecutive separators and trims generated hyphens", () => {
  assert.equal(
    createSlugFromTitle("  [Spring] MDC 로깅: 왜 userId가 GUEST?  "),
    "Spring-MDC-로깅-왜-userId가-GUEST"
  )
})

test("uses the title slug instead of a manually entered Notion slug", () => {
  const post = {
    title: "[주간 회고] 2026.06.15 ~ 2026.06.21",
    slug: "manual-weekly-slug",
    type: ["Post"],
  }

  assert.equal(
    applyTitleSlug(post).slug,
    "주간-회고-2026-06-15-2026-06-21"
  )
})

test("keeps manually configured slugs for static pages", () => {
  const page = {
    title: "About Me",
    slug: "about",
    type: ["Page"],
  }

  assert.equal(applyTitleSlug(page).slug, "about")
})

test("keeps manually configured slugs for public-on-detail posts", () => {
  const pageLikePost = {
    title: "Welcome!",
    slug: "about",
    type: ["Post"],
    status: ["PublicOnDetail"],
  }

  assert.equal(applyTitleSlug(pageLikePost).slug, "about")
})
