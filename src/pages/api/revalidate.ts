import { NextApiRequest, NextApiResponse } from "next"
import { getPosts } from "../../apis"

// for all path revalidate, https://<your-site.com>/api/revalidate?secret=<token>
// for specific path revalidate, https://<your-site.com>/api/revalidate?secret=<token>&path=<path>
// example, https://<your-site.com>/api/revalidate?secret=이것은_키&path=/
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { secret, path } = req.query
  if (secret !== process.env.TOKEN_FOR_REVALIDATE) {
    return res.status(401).json({ message: "Invalid token" })
  }

  try {
    const revalidatedPaths: string[] = []

    if (path && typeof path === "string") {
      const targetPath = path.startsWith("/") ? path : `/${path}`
      await res.revalidate(targetPath)
      revalidatedPaths.push(targetPath)
    } else {
      await res.revalidate("/")
      revalidatedPaths.push("/")

      const posts = await getPosts()
      const detailPaths = Array.from(
        new Set(posts.map((row) => row.slug).filter(Boolean))
      ).map((slug) => `/${slug}`)
      const revalidateRequests = detailPaths.map((detailPath) =>
        res.revalidate(detailPath)
      )
      await Promise.all(revalidateRequests)
      revalidatedPaths.push(...detailPaths)
    }

    res.json({ revalidated: true, paths: revalidatedPaths })
  } catch (err) {
    return res.status(500).send("Error revalidating")
  }
}
