export class NotionHttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "NotionHttpError"
    this.status = status
  }
}
