import styled from "@emotion/styled"
import type { FC } from "react"
import { getTableOfContentsHash } from "src/routes/Detail/utils/getPostTableOfContents"
import type { PostTableOfContentsItem } from "src/routes/Detail/utils/getPostTableOfContents"

type Props = {
  items: PostTableOfContentsItem[]
}

const TableOfContents: FC<Props> = ({ items }) => {
  if (!items.length) return null

  return (
    <StyledAside aria-label="Table of contents">
      <div className="tocTitle">목차</div>
      <nav>
        {items.map((item) => (
          <a
            key={item.id}
            className={`tocItem tocIndent${item.indentLevel}`}
            href={getTableOfContentsHash(item.id)}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </StyledAside>
  )
}

export default TableOfContents

const StyledAside = styled.aside`
  position: sticky;
  top: ${({ theme }) => theme.variables.headerHeight + 24}px;
  flex: 0 0 13rem;
  max-height: calc(100vh - ${({ theme }) => theme.variables.headerHeight + 48}px);
  overflow-y: auto;
  padding: 0.875rem;
  border: 1px solid
    ${({ theme }) =>
      theme.scheme === "light" ? theme.colors.gray6 : theme.colors.gray7};
  border-radius: 8px;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

  .tocTitle {
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.gray11};
    font-size: 0.8125rem;
    font-weight: 700;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .tocItem {
    display: block;
    padding: 0.3125rem 0;
    color: ${({ theme }) => theme.colors.gray11};
    font-size: 0.875rem;
    line-height: 1.35;
    text-decoration: none;
    overflow-wrap: anywhere;
  }

  .tocItem:hover {
    color: ${({ theme }) => theme.colors.blue11};
  }

  .tocIndent1 {
    padding-left: 0.75rem;
  }

  .tocIndent2 {
    padding-left: 1.5rem;
    color: ${({ theme }) => theme.colors.gray10};
  }

  @media (max-width: 1100px) {
    display: none;
  }
`
