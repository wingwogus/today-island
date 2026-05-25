import Detail from "src/routes/Detail"
import { filterPosts } from "src/libs/utils/notion"
import { CONFIG } from "site.config"
import { NextPageWithLayout } from "../types"
import CustomError from "src/routes/Error"
import { getRecordMap, getPosts } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import { GetStaticProps } from "next"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { dehydrate } from "@tanstack/react-query"
import usePostQuery from "src/hooks/usePostQuery"
import { FilterPostsOptions } from "src/libs/utils/notion/filterPosts"
import { normalizeRecordMapForReactNotionX } from "src/libs/utils/notion/normalizeRecordMapForReactNotionX"

const filter: FilterPostsOptions = {
  acceptStatus: ["Public", "PublicOnDetail"],
  acceptType: ["Paper", "Post", "Page"],
}

export const getStaticPaths = async () => {
  const posts = await getPosts()
  const filteredPost = filterPosts(posts, filter)

  return {
    paths: filteredPost.map((row) => `/${row.slug}`),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug

  const posts = await getPosts()
  const feedPosts = filterPosts(posts)
  await queryClient.prefetchQuery(queryKey.posts(), () => feedPosts)

  const detailPosts = filterPosts(posts, filter)
  const postDetail = detailPosts.find((t: any) => t.slug === slug)
  const recordMap = normalizeRecordMapForReactNotionX(
    await getRecordMap(postDetail?.id!)
  )

  await queryClient.prefetchQuery(queryKey.post(`${slug}`), () => ({
    ...postDetail,
    recordMap,
  }))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  }
}

const DetailPage: NextPageWithLayout = () => {
  const post = usePostQuery()

  if (!post) return <CustomError />

  const generatedImage = `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(
    post.title
  )}.png`
  const image = post.thumbnail
    ? post.thumbnail.startsWith("http")
      ? post.thumbnail
      : `${CONFIG.link}${
          post.thumbnail.startsWith("/") ? post.thumbnail : `/${post.thumbnail}`
        }`
    : generatedImage

  const date = post.date?.start_date || post.createdTime || ""
  const publishedDate = new Date(date).toISOString()
  const url = `${CONFIG.link}/${post.slug}`
  const schemaType =
    post.type[0] === "Paper"
      ? "ScholarlyArticle"
      : post.type[0] === "Page"
      ? "Article"
      : "BlogPosting"

  const meta = {
    title: post.title,
    date: publishedDate,
    image: image,
    imageAlt: `${post.title} 대표 이미지`,
    description: post.summary || CONFIG.seo.description,
    type: post.type[0],
    url,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": schemaType,
          "@id": `${url}#article`,
          headline: post.title,
          description: post.summary || CONFIG.seo.description,
          image,
          url,
          mainEntityOfPage: url,
          datePublished: publishedDate,
          dateModified: publishedDate,
          inLanguage: CONFIG.lang,
          author: {
            "@type": "Person",
            name: CONFIG.profile.name,
            url: CONFIG.link,
          },
          publisher: {
            "@type": "Person",
            name: CONFIG.profile.name,
            url: CONFIG.link,
          },
          keywords: post.tags || CONFIG.seo.keywords,
          articleSection: post.category?.[0],
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "홈",
              item: CONFIG.link,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: post.title,
              item: url,
            },
          ],
        },
      ],
    },
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Detail />
    </>
  )
}

DetailPage.getLayout = (page) => {
  return <>{page}</>
}

export default DetailPage
