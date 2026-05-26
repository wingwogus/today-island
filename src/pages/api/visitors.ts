import type { NextApiRequest, NextApiResponse } from "next"
import { getVisitorDateKey } from "src/libs/visitors/date"
import { createUpstashVisitorStoreFromEnv } from "src/libs/visitors/upstashVisitorStore"

type VisitorCounterResponse = {
  enabled: boolean
  total: number
  today: number
  message?: string
}

const disabledResponse: VisitorCounterResponse = {
  enabled: false,
  total: 0,
  today: 0,
}

const botUserAgentPattern =
  /bot|crawler|spider|crawling|facebookexternalhit|slurp|bingpreview|preview|monitoring|uptime/i

const isBotRequest = (req: NextApiRequest) => {
  const userAgent = req.headers["user-agent"]
  return typeof userAgent === "string" && botUserAgentPattern.test(userAgent)
}

const hasAllowedOrigin = (req: NextApiRequest) => {
  const origin = req.headers.origin
  const host = req.headers.host

  if (!origin || !host) return true

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

const shouldIncrementVisit = (req: NextApiRequest) => {
  if (process.env.VISITOR_COUNTER_DISABLED === "true") return false
  if (process.env.NODE_ENV !== "production") return false
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return false
  }

  return !isBotRequest(req)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VisitorCounterResponse>
) {
  res.setHeader("Cache-Control", "no-store")

  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST")
    return res.status(405).json({
      ...disabledResponse,
      message: "Method not allowed",
    })
  }

  if (req.method === "POST" && !hasAllowedOrigin(req)) {
    return res.status(403).json({
      ...disabledResponse,
      message: "Invalid origin",
    })
  }

  const store = createUpstashVisitorStoreFromEnv()
  if (!store || process.env.VISITOR_COUNTER_DISABLED === "true") {
    return res.status(200).json(disabledResponse)
  }

  try {
    const dateKey = getVisitorDateKey()
    const counts =
      req.method === "POST" && shouldIncrementVisit(req)
        ? await store.incrementAndGetCounts(dateKey)
        : await store.getCounts(dateKey)

    return res.status(200).json({
      enabled: true,
      total: counts.total,
      today: counts.today,
    })
  } catch (error) {
    console.error("Visitor counter unavailable", error)

    return res.status(502).json({
      ...disabledResponse,
      message: "Visitor counter unavailable",
    })
  }
}
