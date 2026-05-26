export type VisitorCounts = {
  total: number
  today: number
}

export type VisitorStore = {
  getCounts: (dateKey: string) => Promise<VisitorCounts>
  incrementAndGetCounts: (dateKey: string) => Promise<VisitorCounts>
}
