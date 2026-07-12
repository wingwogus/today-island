const HOMEPAGE_REVALIDATE_SECONDS = 600

/**
 * Returns the homepage ISR interval.
 *
 * @returns {number}
 */
function getHomepageRevalidateSeconds() {
  return HOMEPAGE_REVALIDATE_SECONDS
}

/**
 * Returns whether a build explicitly requests the generated homepage cache.
 *
 * @param {NodeJS.ProcessEnv} [environment]
 * @returns {boolean}
 */
function shouldForceHomepagePostsCache(environment = process.env) {
  return environment.FORCE_HOMEPAGE_POSTS_CACHE === "true"
}

module.exports = {
  getHomepageRevalidateSeconds,
  shouldForceHomepagePostsCache,
}
