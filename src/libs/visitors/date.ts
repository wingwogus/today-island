const DEFAULT_TIME_ZONE = "Asia/Seoul"

export const getVisitorDateKey = (
  date = new Date(),
  timeZone = process.env.VISITOR_COUNTER_TIME_ZONE || DEFAULT_TIME_ZONE
) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  )

  return `${values.year}-${values.month}-${values.day}`
}
