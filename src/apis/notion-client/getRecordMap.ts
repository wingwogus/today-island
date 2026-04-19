import { NotionAPI } from "notion-client"
import { getBlockCollectionId, getPageContentBlockIds } from "notion-utils"

import { normalizeRecordMapForReactNotionX } from "src/libs/utils/notion/normalizeRecordMapForReactNotionX"

const MAX_BACKFILL_ROUNDS = 10
const RECORD_MAP_SECTION_KEYS = [
  "block",
  "collection",
  "collection_view",
  "collection_query",
  "notion_user",
  "signed_urls",
] as const

function mergeRecordMaps(base: any, next: any): any {
  const mergedRecordMap: any = { ...base }

  for (const key of RECORD_MAP_SECTION_KEYS) {
    mergedRecordMap[key] = {
      ...(base[key] || {}),
      ...(next[key] || {}),
    }
  }

  return mergedRecordMap
}

function normalizeWithDefaults(recordMap: any): any {
  const normalizedRecordMap = normalizeRecordMapForReactNotionX(recordMap as any)
  const recordMapWithDefaults: any = { ...normalizedRecordMap }

  for (const key of RECORD_MAP_SECTION_KEYS) {
    recordMapWithDefaults[key] = normalizedRecordMap[key] || {}
  }

  return recordMapWithDefaults
}

function attachDiagnostics(recordMap: any, diagnostics: Record<string, unknown>): any {
  return Object.defineProperty(recordMap, "__omxDiagnostics", {
    value: diagnostics,
    enumerable: false,
    configurable: true,
  })
}

export async function getRecordMap(pageId: string): Promise<any> {
  const api = new NotionAPI()
  const page = await api.getPageRaw(pageId)

  let recordMap = normalizeWithDefaults(page.recordMap)
  let unresolvedBlockIds: string[] = []
  let rounds = 0
  let stoppedBy: "converged" | "max_rounds" | "no_progress" = "converged"

  while (rounds < MAX_BACKFILL_ROUNDS) {
    const pendingBlockIds = getPageContentBlockIds(recordMap).filter(
      (id) => !recordMap.block[id]
    )

    unresolvedBlockIds = pendingBlockIds
    if (!pendingBlockIds.length) {
      stoppedBy = "converged"
      break
    }

    rounds += 1
    const fetchedBlocks = (await api.getBlocks(pendingBlockIds)).recordMap
    const nextRecordMap = normalizeWithDefaults(
      mergeRecordMaps(recordMap, fetchedBlocks)
    )

    const didProgress = pendingBlockIds.some(
      (blockId) => !recordMap.block[blockId] && nextRecordMap.block[blockId]
    )

    recordMap = nextRecordMap

    if (!didProgress) {
      stoppedBy = "no_progress"
      break
    }
  }

  if (unresolvedBlockIds.length && rounds >= MAX_BACKFILL_ROUNDS) {
    stoppedBy = "max_rounds"
  }

  const contentBlockIds = getPageContentBlockIds(recordMap)
  const allCollectionInstances = contentBlockIds.flatMap((blockId) => {
    const block = recordMap.block[blockId]?.value
    const collectionId =
      block &&
      (block.type === "collection_view" || block.type === "collection_view_page") &&
      getBlockCollectionId(block, recordMap)

    if (!collectionId) {
      return []
    }

    return (
      block.view_ids?.map((collectionViewId: string) => ({
        collectionId,
        collectionViewId,
      })) || []
    )
  })

  for (const { collectionId, collectionViewId } of allCollectionInstances) {
    const collectionView = recordMap.collection_view?.[collectionViewId]?.value
    if (!collectionView) continue

    try {
      const collectionData = await api.getCollectionData(
        collectionId,
        collectionViewId,
        collectionView
      )

      recordMap = normalizeWithDefaults(
        mergeRecordMaps(recordMap, collectionData.recordMap)
      )
      recordMap.collection_query[collectionId] = {
        ...(recordMap.collection_query[collectionId] || {}),
        [collectionViewId]: (collectionData.result as any)?.reducerResults,
      }
    } catch (error: any) {
      console.warn(
        "getRecordMap collection hydration error",
        pageId,
        collectionId,
        collectionViewId,
        error?.message || error
      )
    }
  }

  await api.addSignedUrls({ recordMap, contentBlockIds: getPageContentBlockIds(recordMap) })

  const diagnostics = {
    unresolvedBlockIds,
    rounds,
    stoppedBy,
  }

  if (unresolvedBlockIds.length) {
    console.warn("getRecordMap unresolved block ids", pageId, diagnostics)
  }

  return attachDiagnostics(recordMap, diagnostics)
}
