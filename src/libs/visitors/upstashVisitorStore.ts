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
const TOTAL_KEY = "visitors:total"

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
  const todayKey = (dateKey: string) => key(`visitors:daily:${dateKey}`)

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

  const toCount = (value: unknown, fallback = 0) => {
    if (value === null || value === undefined) return fallback
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
        ["GET", key(TOTAL_KEY)],
        ["GET", todayKey(dateKey)],
      ])

      return toCounts(results)
    },

    async incrementAndGetCounts(dateKey) {
      const results = await execute([
        ["INCR", key(TOTAL_KEY)],
        ["INCR", todayKey(dateKey)],
      ])

      return toCounts(results)
    },
  }
}
