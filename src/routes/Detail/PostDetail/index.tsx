import React from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"
import TableOfContents from "../components/TableOfContents"
import { getPostTableOfContents } from "../utils/getPostTableOfContents"
import type { TPostType } from "src/types"

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined
  const type = data.type[0]
  const shouldShowTableOfContents = isNormalArticleType(type)
  const tableOfContents = shouldShowTableOfContents
    ? getPostTableOfContents(data.recordMap, data.id)
    : []

  return (
    <StyledWrapper>
      <StyledArticleCard>
        <article>
          {category && (
            <div css={{ marginBottom: "0.5rem" }}>
              <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
                {category}
              </Category>
            </div>
          )}
          {type === "Post" && <PostHeader data={data} />}
          <div>
            <NotionRenderer recordMap={data.recordMap} />
          </div>
          {type === "Post" && (
            <>
              <Footer />
              <CommentBox data={data} />
            </>
          )}
        </article>
      </StyledArticleCard>
      <TableOfContents items={tableOfContents} />
    </StyledWrapper>
  )
}

export default PostDetail

const isNormalArticleType = (type: TPostType) => {
  return type === "Post" || type === "Paper"
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 1.25rem;
  max-width: 70rem;
  margin: 0 auto;

  @media (max-width: 1100px) {
    max-width: 56rem;
  }
`

const StyledArticleCard = styled.div`
  flex: 1 1 0;
  min-width: 0;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
  border-radius: 1.5rem;
  max-width: 56rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  > article {
    margin: 0 auto;
    max-width: 42rem;
  }
`
