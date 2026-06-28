const NON_SLUG_CHARACTER_PATTERN = /[^\p{Letter}\p{Number}]+/gu
const EDGE_HYPHENS_PATTERN = /^-+|-+$/g

/**
 * Creates a stable URL slug from a post title.
 *
 * @param {unknown} title
 * @returns {string}
 */
function createSlugFromTitle(title) {
  if (typeof title !== "string") return ""

  return title
    .normalize("NFKC")
    .replace(NON_SLUG_CHARACTER_PATTERN, "-")
    .replace(EDGE_HYPHENS_PATTERN, "")
}

/**
 * Mutates a post-like object so title-derived routing wins over manual slugs.
 *
 * @template {{ title?: unknown, slug?: string, type?: string[], status?: string[] }} T
 * @param {T} post
 * @returns {T}
 */
function applyTitleSlug(post) {
  if (post?.type?.[0] === "Page" || post?.status?.[0] === "PublicOnDetail") {
    return post
  }

  const titleSlug = createSlugFromTitle(post?.title)

  if (titleSlug) {
    post.slug = titleSlug
  }

  return post
}

module.exports = {
  applyTitleSlug,
  createSlugFromTitle,
}
