import { CONFIG } from "site.config"
import Head from "next/head"

export type MetaConfigProps = {
  title: string
  description: string
  type: "Website" | "Post" | "Page" | string
  date?: string
  image?: string
  imageAlt?: string
  canonical?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  robots?: string
  url: string
}

const trimTrailingSlash = (url: string) => url.replace(/\/$/, "")

const toAbsoluteUrl = (url: string) => {
  if (/^https?:\/\//.test(url)) return url

  return `${trimTrailingSlash(CONFIG.link)}${
    url.startsWith("/") ? url : `/${url}`
  }`
}

const getOgType = (type: MetaConfigProps["type"]) => {
  if (["Page", "Paper", "Post"].includes(type)) return "article"
  return "website"
}

const getLocale = () => CONFIG.lang.replace("-", "_")

const serializeJsonLd = (jsonLd: Record<string, unknown>) =>
  JSON.stringify(jsonLd).replace(/</g, "\\u003c")

const MetaConfig: React.FC<MetaConfigProps> = (props) => {
  const canonical = toAbsoluteUrl(props.canonical || props.url)
  const image = toAbsoluteUrl(props.image || CONFIG.seo.defaultOgImage)
  const ogType = getOgType(props.type)
  const jsonLd = props.jsonLd
    ? Array.isArray(props.jsonLd)
      ? props.jsonLd
      : [props.jsonLd]
    : []

  return (
    <Head>
      <title>{props.title}</title>
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={props.robots || "follow, index"} />
      <meta charSet="UTF-8" />
      <meta name="description" content={props.description} />
      <meta name="keywords" content={CONFIG.seo.keywords.join(", ")} />
      {/* og */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={CONFIG.blog.title} />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:url" content={canonical} />
      {CONFIG.lang && <meta property="og:locale" content={getLocale()} />}
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={`${CONFIG.seo.ogImageWidth}`} />
      <meta
        property="og:image:height"
        content={`${CONFIG.seo.ogImageHeight}`}
      />
      {props.imageAlt && (
        <meta property="og:image:alt" content={props.imageAlt} />
      )}
      {/* twitter */}
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={image} />
      {props.imageAlt && (
        <meta name="twitter:image:alt" content={props.imageAlt} />
      )}
      {/* post */}
      {ogType === "article" && (
        <>
          <meta property="article:published_time" content={props.date} />
          <meta property="article:author" content={CONFIG.profile.name} />
        </>
      )}
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
        />
      ))}
    </Head>
  )
}

export default MetaConfig
