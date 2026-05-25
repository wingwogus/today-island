import Feed from "src/routes/Feed"
import { CONFIG } from "../../site.config"
import { NextPageWithLayout } from "../types"
import { getPosts } from "../apis"
import MetaConfig from "src/components/MetaConfig"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { GetStaticProps } from "next"
import { dehydrate } from "@tanstack/react-query"
import { filterPosts } from "src/libs/utils/notion"

export const getStaticProps: GetStaticProps = async () => {
  const posts = filterPosts(await getPosts())
  await queryClient.prefetchQuery(queryKey.posts(), () => posts)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
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
