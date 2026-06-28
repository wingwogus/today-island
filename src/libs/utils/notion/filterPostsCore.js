function getTomorrowStart(now = new Date()) {
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow
}

/**
 * @param {any[]} posts
 * @param {{ acceptStatus?: string[], acceptType?: string[], now?: Date }} options
 */
function filterPostsCore(posts, options = {}) {
  const {
    acceptStatus = ["Public"],
    acceptType = ["Post"],
    now = new Date(),
  } = options
  const tomorrow = getTomorrowStart(now)

  return posts
    .filter((post) => {
      const postDate = new Date(post?.date?.start_date || post?.createdTime)

      return (
        post?.title &&
        post?.slug &&
        Array.isArray(post?.status) &&
        Array.isArray(post?.type) &&
        postDate <= tomorrow
      )
    })
    .filter((post) => acceptStatus.includes(post.status[0]))
    .filter((post) => acceptType.includes(post.type[0]))
}

module.exports = {
  filterPostsCore,
}
