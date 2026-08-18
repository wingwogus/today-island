const HOMEPAGE_REVALIDATE_SECONDS = 600
const SHARED_ROUTE_CACHE_SECONDS = 60

/**
 * Returns the homepage ISR interval.
 *
 * @returns {number}
 */
function getHomepageRevalidateSeconds() {
  return HOMEPAGE_REVALIDATE_SECONDS
}

/**
 * Returns the Vercel CDN policy for public SSR routes.
 *
 * @returns {string}
 */
function getSharedRouteCacheControl() {
  return `public, s-maxage=${SHARED_ROUTE_CACHE_SECONDS}, stale-while-revalidate=${HOMEPAGE_REVALIDATE_SECONDS}`
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
  getSharedRouteCacheControl,
  shouldForceHomepagePostsCache,
}
