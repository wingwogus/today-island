import { ExtendedRecordMap } from "notion-types"
import { getPageBlockTree } from "./getPageBlocks"
import { buildRecordMapFromBlocks } from "./blockToRecordMap"

/**
 * 공식 Notion API로 페이지 블록을 가져와 react-notion-x가 소비하는
 * ExtendedRecordMap 형태로 변환한다.
 */
export async function getRecordMap(pageId: string): Promise<ExtendedRecordMap> {
  const blocks = await getPageBlockTree(pageId)
  return buildRecordMapFromBlocks(blocks, { pageId })
}
