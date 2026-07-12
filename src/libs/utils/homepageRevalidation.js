const HOMEPAGE_REVALIDATE_SECONDS = 600

/**
 * Returns whether the homepage may load fresh posts from Notion.
 *
 * @param {NodeJS.ProcessEnv} [environment]
 * @returns {boolean}
 */
function shouldFetchFreshHomepagePosts(environment = process.env) {
  return (
    environment.HOMEPAGE_POSTS_SOURCE === "notion" &&
    environment.FORCE_HOMEPAGE_POSTS_CACHE !== "true"
  )
}

/**
 * Returns the homepage ISR interval when fresh Notion loading is enabled.
 *
 * @param {NodeJS.ProcessEnv} [environment]
 * @returns {number | false}
 */
function getHomepageRevalidateSeconds(environment = process.env) {
  return shouldFetchFreshHomepagePosts(environment)
    ? HOMEPAGE_REVALIDATE_SECONDS
    : false
}

module.exports = {
  getHomepageRevalidateSeconds,
  shouldFetchFreshHomepagePosts,
}
