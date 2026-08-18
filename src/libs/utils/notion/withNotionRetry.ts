import { NotionHttpError } from "src/apis/notion-api/notionHttpError"

type RetryOptions = {
  attempts?: number
  delayMs?: number
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const shouldRetry = (error: unknown) =>
  error instanceof NotionHttpError &&
  (error.status === 429 || (error.status >= 500 && error.status <= 599))

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

      const retryError = error as NotionHttpError
      const nextDelay = delayMs * 2 ** (attempt - 1)

      console.warn(
        `Retrying Notion request (${label}) after transient failure`,
        {
          attempt,
          attempts,
          statusCode: retryError.status,
          nextDelay,
        }
      )

      await sleep(nextDelay)
    }
  }

  throw lastError
}
