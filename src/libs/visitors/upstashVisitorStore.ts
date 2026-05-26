import type { VisitorCounts, VisitorStore } from "./types"

type UpstashCommand = (string | number)[]

type UpstashResult = {
  result?: unknown
  error?: string
}

type Options = {
  restUrl: string
  restToken: string
  keyPrefix?: string
}

const DEFAULT_KEY_PREFIX = "today-island"
const TOTAL_VISITORS_KEY = "visitors:unique:total"
const DAILY_VISITORS_TTL_SECONDS = 60 * 60 * 24 * 2

export const createUpstashVisitorStoreFromEnv = (): VisitorStore | null => {
  const restUrl =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const restToken =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

  if (!restUrl || !restToken) return null

  return createUpstashVisitorStore({
    restUrl,
    restToken,
    keyPrefix: process.env.VISITOR_COUNTER_KEY_PREFIX,
  })
}

export const createUpstashVisitorStore = ({
  restUrl,
  restToken,
  keyPrefix = DEFAULT_KEY_PREFIX,
}: Options): VisitorStore => {
  const baseUrl = restUrl.replace(/\/+$/, "")
  const prefix = (keyPrefix || DEFAULT_KEY_PREFIX).replace(/:+$/, "")

  const key = (name: string) => `${prefix}:${name}`
  const todayVisitorsKey = (dateKey: string) =>
    key(`visitors:unique:daily:${dateKey}`)

  const execute = async (commands: UpstashCommand[]) => {
    const response = await fetch(`${baseUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${restToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
    })

    const payload = (await response.json()) as UpstashResult[] | UpstashResult

    if (!response.ok) {
      const message = Array.isArray(payload)
        ? response.statusText
        : payload.error
      throw new Error(message || "Upstash request failed")
    }

    if (!Array.isArray(payload)) {
      throw new Error(payload.error || "Unexpected Upstash response")
    }

    return payload.map((item) => {
      if (item.error) throw new Error(item.error)
      return item.result
    })
  }

  const toCount = (value: unknown) => {
    if (value === null || value === undefined) return 0
    if (typeof value === "number" && Number.isFinite(value)) return value
    if (typeof value === "string") {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) return parsed
    }

    throw new Error("Visitor count is not numeric")
  }

  const toCounts = ([total, today]: unknown[]): VisitorCounts => ({
    total: toCount(total),
    today: toCount(today),
  })

  return {
    async getCounts(dateKey) {
      const results = await execute([
        ["SCARD", key(TOTAL_VISITORS_KEY)],
        ["SCARD", todayVisitorsKey(dateKey)],
      ])

      return toCounts(results)
    },

    async trackVisitor(dateKey, visitorId) {
      const todayKey = todayVisitorsKey(dateKey)
      const results = await execute([
        ["SADD", key(TOTAL_VISITORS_KEY), visitorId],
        ["SADD", todayKey, visitorId],
        ["EXPIRE", todayKey, DAILY_VISITORS_TTL_SECONDS],
        ["SCARD", key(TOTAL_VISITORS_KEY)],
        ["SCARD", todayKey],
      ])

      return toCounts(results.slice(3))
    },
  }
}
