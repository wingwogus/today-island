import {
  Decoration,
  ExtendedRecordMap,
  ID,
  SubDecoration,
} from "notion-types"

type NotionBlock = any

const BLOCK_TYPE_MAP: Record<string, string> = {
  paragraph: "text",
  heading_1: "header",
  heading_2: "sub_header",
  heading_3: "sub_sub_header",
  bulleted_list_item: "bulleted_list",
  numbered_list_item: "numbered_list",
  to_do: "to_do",
  toggle: "toggle",
  quote: "quote",
  code: "code",
  image: "image",
  video: "video",
  divider: "divider",
  callout: "callout",
  bookmark: "bookmark",
  table: "table",
  table_row: "table_row",
  column_list: "column_list",
  column: "column",
  embed: "embed",
  file: "file",
  pdf: "pdf",
  equation: "equation",
  breadcrumb: "breadcrumb",
}

function mapAnnotations(
  annotations: NotionBlock["annotations"]
): SubDecoration[] {
  const result: SubDecoration[] = []
  if (annotations?.bold) result.push(["b"])
  if (annotations?.italic) result.push(["i"])
  if (annotations?.strikethrough) result.push(["s"])
  if (annotations?.underline) result.push(["_"])
  if (annotations?.code) result.push(["c"])
  if (annotations?.color && annotations.color !== "default") {
    result.push(["h", annotations.color])
  }
  return result
}

function mapRichText(richText: NotionBlock["rich_text"]): Decoration[] {
  if (!richText?.length) return [[""]]
  return richText.map((rt: NotionBlock) => {
    const content = rt.plain_text || rt.text?.content || ""
    const href = rt.href || rt.text?.link?.url
    const annotations = mapAnnotations(rt.annotations)

    if (href) {
      return [content, [["a", href]]]
    }
    if (annotations.length) {
      return [content, annotations]
    }
    return [content]
  })
}

function toTimestamp(iso: string): number {
  return new Date(iso).getTime()
}

function buildBlockValue(block: NotionBlock): any {
  const type = BLOCK_TYPE_MAP[block.type] || block.type
  const blockValue: any = {
    id: block.id,
    type,
    parent_id: block.parent?.page_id || block.parent?.block_id || "",
    parent_table: "block",
    created_time: toTimestamp(block.created_time),
    last_edited_time: toTimestamp(block.last_edited_time),
    alive: !block.in_trash,
    created_by_table: "user",
    created_by_id: block.created_by?.id || "",
    last_edited_by_table: "user",
    last_edited_by_id: block.last_edited_by?.id || "",
    version: 1,
    space_id: block.parent?.page_id || "",
    properties: {},
    format: {},
    content: [],
  }

  const data = block[block.type]
  if (!data) return blockValue

  if (data.rich_text) {
    blockValue.properties.title = mapRichText(data.rich_text)
  }

  switch (block.type) {
    case "to_do":
      blockValue.properties.checked = data.checked ? [["Yes"]] : [["No"]]
      break
    case "code":
      blockValue.properties.language = data.language
        ? [[data.language]]
        : [["plain text"]]
      if (data.caption?.length) {
        blockValue.properties.caption = mapRichText(data.caption)
      }
      break
    case "image":
    case "video":
    case "file":
    case "pdf":
    case "embed":
      blockValue.properties.source = data.external?.url
        ? [[data.external.url]]
        : data.file?.url
        ? [[data.file.url]]
        : [[""]]
      if (data.caption?.length) {
        blockValue.properties.caption = mapRichText(data.caption)
      }
      break
    case "callout":
      if (data.icon?.emoji) {
        blockValue.format = { ...blockValue.format, page_icon: data.icon.emoji }
      }
      break
    case "table":
      blockValue.format = {
        ...blockValue.format,
        table_width: data.table_width,
        table_column_format: data.has_column_header
          ? [{ column: 0 }]
          : [],
      }
      break
    case "bookmark":
      blockValue.properties.link = [[data.url || ""]]
      blockValue.properties.title = mapRichText(data.caption || [])
      blockValue.properties.description = [[""]]
      break
  }

  if (data.color && data.color !== "default") {
    blockValue.format.block_color = data.color
  }

  return blockValue
}

export function buildRecordMapFromBlocks(
  blocks: NotionBlock[],
  options: { pageId?: string } = {}
): ExtendedRecordMap {
  const blockMap: Record<ID, any> = {}
  const visited = new Set<string>()

  function collect(block: NotionBlock) {
    if (visited.has(block.id)) return
    visited.add(block.id)

    const childIds: ID[] = []
    const children = block.children || []
    for (const child of children) {
      childIds.push(child.id)
      collect(child)
    }

    const value = buildBlockValue(block)
    value.content = childIds
    blockMap[block.id] = { value }
  }

  const recordMap: any = {
    block: {},
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
    saved_session: {},
    space: {},
    user: {},
  }

  // react-notion-x는 recordMap.block의 첫 번째 키를 페이지 루트로 사용한다.
  // 따라서 page 블록을 반드시 첫 키로 배치해야 본문이 렌더링된다.
  if (options.pageId) {
    const pageValue: any = {
      id: options.pageId,
      type: "page",
      parent_id: "",
      parent_table: "space",
      created_time: Date.now(),
      last_edited_time: Date.now(),
      alive: true,
      version: 1,
      space_id: "",
      properties: {},
      format: { page_full_width: false },
      permissions: [{ role: "reader", type: "user_permission" }],
      content: blocks.map((b) => b.id),
    }
    recordMap.block[options.pageId] = { value: pageValue }
  }

  for (const block of blocks) {
    collect(block)
  }

  return recordMap as ExtendedRecordMap
}
