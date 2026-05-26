import { randomUUID } from "crypto"
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
const VISITOR_COOKIE_NAME = "today_island_visitor_id"
const VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365
const visitorIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

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

const shouldTrackVisitor = (req: NextApiRequest) => {
  if (process.env.VISITOR_COUNTER_DISABLED === "true") return false
  if (process.env.NODE_ENV !== "production") return false
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return false
  }

  return !isBotRequest(req)
}

const getCookieValue = (req: NextApiRequest, name: string) => {
  const cookie = req.headers.cookie
  if (!cookie) return null

  const prefix = `${name}=`
  const match = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  if (!match) return null

  try {
    return decodeURIComponent(match.slice(prefix.length))
  } catch {
    return null
  }
}

const isSecureRequest = (req: NextApiRequest) => {
  const forwardedProto = req.headers["x-forwarded-proto"]
  const proto = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto

  return proto?.split(",")[0]?.trim() === "https"
}

const appendSetCookie = (
  res: NextApiResponse<VisitorCounterResponse>,
  cookie: string
) => {
  const current = res.getHeader("Set-Cookie")
  const cookies = Array.isArray(current)
    ? current.map(String)
    : current
    ? [String(current)]
    : []

  res.setHeader("Set-Cookie", [...cookies, cookie])
}

const setVisitorCookie = (
  req: NextApiRequest,
  res: NextApiResponse<VisitorCounterResponse>,
  visitorId: string
) => {
  const secure = isSecureRequest(req) ? "; Secure" : ""

  appendSetCookie(
    res,
    [
      `${VISITOR_COOKIE_NAME}=${encodeURIComponent(visitorId)}`,
      "Path=/",
      `Max-Age=${VISITOR_COOKIE_MAX_AGE_SECONDS}`,
      "SameSite=Lax",
      "HttpOnly",
    ].join("; ") + secure
  )
}

const getOrCreateVisitorId = (
  req: NextApiRequest,
  res: NextApiResponse<VisitorCounterResponse>
) => {
  const existingVisitorId = getCookieValue(req, VISITOR_COOKIE_NAME)

  if (existingVisitorId && visitorIdPattern.test(existingVisitorId)) {
    return existingVisitorId
  }

  const visitorId = randomUUID()
  setVisitorCookie(req, res, visitorId)

  return visitorId
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
      req.method === "POST" && shouldTrackVisitor(req)
        ? await store.trackVisitor(dateKey, getOrCreateVisitorId(req, res))
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
