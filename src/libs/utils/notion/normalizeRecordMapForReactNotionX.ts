import { ExtendedRecordMap } from "notion-types"

const unwrapNestedValue = (entry: any) => {
  if (!entry || typeof entry !== "object") return entry

  const wrapper = entry.value
  if (!wrapper || typeof wrapper !== "object" || Array.isArray(wrapper)) {
    return entry
  }

  const nestedValue = wrapper.value
  if (
    !nestedValue ||
    typeof nestedValue !== "object" ||
    Array.isArray(nestedValue)
  ) {
    return entry
  }

  const wrapperKeys = Object.keys(wrapper)
  const isNestedWrapper =
    "value" in wrapper &&
    wrapperKeys.every((key) => key === "value" || key === "role")
  const looksLikeRecord =
    "id" in nestedValue ||
    "type" in nestedValue ||
    "schema" in nestedValue ||
    "name" in nestedValue

  if (!isNestedWrapper || !looksLikeRecord) {
    return entry
  }

  return {
    ...entry,
    role: entry.role ?? wrapper.role,
    value: nestedValue,
  }
}

const normalizeRecordTable = (table?: Record<string, any>) => {
  if (!table) return table

  return Object.fromEntries(
    Object.entries(table).map(([key, entry]) => [key, unwrapNestedValue(entry)])
  )
}

export const normalizeRecordMapForReactNotionX = (
  recordMap: ExtendedRecordMap
): ExtendedRecordMap => {
  return {
    ...recordMap,
    block: normalizeRecordTable(recordMap.block),
    collection: normalizeRecordTable(recordMap.collection),
    collection_view: normalizeRecordTable(recordMap.collection_view),
  } as ExtendedRecordMap
}
