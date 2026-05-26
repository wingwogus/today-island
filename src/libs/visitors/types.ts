export type VisitorCounts = {
  total: number
  today: number
}

export type VisitorStore = {
  getCounts: (dateKey: string) => Promise<VisitorCounts>
  trackVisitor: (
    dateKey: string,
    visitorId: string
  ) => Promise<VisitorCounts>
}
