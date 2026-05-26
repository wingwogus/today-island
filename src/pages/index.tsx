import Feed from "src/routes/Feed"
import { CONFIG } from "../../site.config"
import { NextPageWithLayout } from "../types"
import { getPosts } from "../apis"
import MetaConfig from "src/components/MetaConfig"
import { queryKey } from "src/constants/queryKey"
import { GetStaticProps } from "next"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { filterPosts } from "src/libs/utils/notion"
import cachedFeedPosts from "src/generated/homepage-posts-cache.json"
import { TPosts } from "src/types"

const shouldFetchFreshHomepagePosts = () =>
  process.env.HOMEPAGE_POSTS_SOURCE === "notion" &&
  process.env.FORCE_HOMEPAGE_POSTS_CACHE !== "true"

const getFeedPosts = async () => {
  if (!shouldFetchFreshHomepagePosts()) {
    return cachedFeedPosts as TPosts
  }

  try {
    return filterPosts(await getPosts())
  } catch (error) {
    console.warn(
      "Using cached homepage posts after Notion fetch failure",
      error
    )
    return cachedFeedPosts as TPosts
  }
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getFeedPosts()
  const serverQueryClient = new QueryClient()
  await serverQueryClient.prefetchQuery(queryKey.posts(), () => posts)

  return {
    props: {
      dehydratedState: dehydrate(serverQueryClient),
    },
  }
}

const FeedPage: NextPageWithLayout = () => {
  const url = CONFIG.link

  const meta = {
    title: CONFIG.seo.title,
    description: CONFIG.seo.description,
    type: "website",
    imageAlt: `${CONFIG.blog.title} 기술 블로그 대표 이미지`,
    url,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${url}/#website`,
          name: CONFIG.blog.title,
          url,
          inLanguage: CONFIG.lang,
          description: CONFIG.seo.description,
        },
        {
          "@type": "Blog",
          "@id": `${url}/#blog`,
          name: CONFIG.blog.title,
          url,
          inLanguage: CONFIG.lang,
          description: CONFIG.seo.description,
          keywords: CONFIG.seo.keywords,
          author: {
            "@type": "Person",
            name: CONFIG.profile.name,
            url,
          },
        },
      ],
    },
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Feed />
    </>
  )
}

export default FeedPage
