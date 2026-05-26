import type { ExtendedRecordMap, PageBlock } from "notion-types"
import { getPageTableOfContents, idToUuid, uuidToId } from "notion-utils"

export type PostTableOfContentsItem = {
  id: string
  type: string
  text: string
  indentLevel: number
}

const getBlockValue = (recordMap: ExtendedRecordMap, id?: string) => {
  if (!id) return undefined
  return recordMap.block?.[id]?.value
}

const isPageBlock = (block: unknown): block is PageBlock => {
  return Boolean(
    block &&
      typeof block === "object" &&
      (block as { type?: string }).type === "page"
  )
}

const getPageIdCandidates = (pageId?: string) => {
  if (!pageId) return []

  const compactId = pageId.replace(/-/g, "")
  const uuid = compactId.length === 32 ? idToUuid(compactId) : pageId

  return Array.from(new Set([pageId, compactId, uuid]))
}

const findPageBlock = (recordMap: ExtendedRecordMap, pageId?: string) => {
  return getPageIdCandidates(pageId)
    .map((candidateId) => getBlockValue(recordMap, candidateId))
    .find(isPageBlock)
}

export const getTableOfContentsHash = (blockId: string) =>
  `#${uuidToId(blockId)}`

export const getPostTableOfContents = (
  recordMap: ExtendedRecordMap,
  pageId?: string
): PostTableOfContentsItem[] => {
  const pageBlock = findPageBlock(recordMap, pageId)
  if (!pageBlock) return []

  return getPageTableOfContents(pageBlock, recordMap)
    .map((item) => ({
      id: item.id,
      type: item.type,
      text: item.text.trim(),
      indentLevel: item.indentLevel,
    }))
    .filter((item) => item.text.length > 0)
}
