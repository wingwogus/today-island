import { getPosts } from "../apis"
import { CONFIG } from "site.config"
import { getServerSideSitemap, ISitemapField } from "next-sitemap"
import { GetServerSideProps } from "next"
import { filterPosts } from "../libs/utils/notion"

const toLastmod = (date?: string) => new Date(date || Date.now()).toISOString()

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const posts = filterPosts(await getPosts())

  const fields: ISitemapField[] = posts.map((post) => ({
    loc: `${CONFIG.link}/${post.slug}`,
    lastmod: toLastmod(post.date?.start_date || post.createdTime),
    priority: 0.7,
    changefreq: "weekly",
  }))

  fields.unshift({
    loc: CONFIG.link,
    lastmod: toLastmod(),
    priority: 1.0,
    changefreq: "weekly",
  })

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
const Sitemap = () => {}

export default Sitemap
