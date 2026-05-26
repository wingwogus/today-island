const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504])
const RETRYABLE_ERROR_CODES = new Set([
  "ECONNRESET",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EAI_AGAIN",
])

type RetryOptions = {
  attempts?: number
  delayMs?: number
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const getRetryStatus = (error: unknown) => {
  const maybeError = error as {
    code?: string
    statusCode?: number
    status?: number
    response?: {
      statusCode?: number
      status?: number
    }
  }

  const statusCode =
    maybeError.response?.statusCode ||
    maybeError.response?.status ||
    maybeError.statusCode ||
    maybeError.status

  return {
    code: maybeError.code,
    statusCode,
  }
}

const shouldRetry = (error: unknown) => {
  const { code, statusCode } = getRetryStatus(error)

  return (
    (typeof statusCode === "number" &&
      RETRYABLE_STATUS_CODES.has(statusCode)) ||
    (typeof code === "string" && RETRYABLE_ERROR_CODES.has(code))
  )
}

export const withNotionRetry = async <T>(
  label: string,
  request: () => Promise<T>,
  { attempts = 4, delayMs = 500 }: RetryOptions = {}
): Promise<T> => {
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await request()
    } catch (error) {
      lastError = error

      if (attempt === attempts || !shouldRetry(error)) {
        throw error
      }

      const { code, statusCode } = getRetryStatus(error)
      const nextDelay = delayMs * 2 ** (attempt - 1)

      console.warn(
        `Retrying Notion request (${label}) after transient failure`,
        {
          attempt,
          attempts,
          statusCode,
          code,
          nextDelay,
        }
      )

      await sleep(nextDelay)
    }
  }

  throw lastError
}
