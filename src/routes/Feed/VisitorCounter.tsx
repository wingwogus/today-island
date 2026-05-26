import styled from "@emotion/styled"
import React, { useEffect, useState } from "react"
import { AiOutlineCalendar, AiOutlineEye } from "react-icons/ai"

type VisitorCounterResponse = {
  enabled: boolean
  total: number
  today: number
}

type Props = {
  className?: string
}

let pendingRequest: Promise<VisitorCounterResponse | null> | null = null

const requestVisitorCounts = () => {
  if (!pendingRequest) {
    pendingRequest = fetch("/api/visitors", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return null
        return (await response.json()) as VisitorCounterResponse
      })
      .catch(() => null)
      .finally(() => {
        window.setTimeout(() => {
          pendingRequest = null
        }, 1000)
      })
  }

  return pendingRequest
}

const formatCount = (count: number) =>
  new Intl.NumberFormat("ko-KR").format(count)

const VisitorCounter: React.FC<Props> = ({ className }) => {
  const [counts, setCounts] = useState<VisitorCounterResponse | null>(null)

  useEffect(() => {
    let ignore = false

    requestVisitorCounts().then((result) => {
      if (!ignore) setCounts(result)
    })

    return () => {
      ignore = true
    }
  }, [])

  if (!counts?.enabled) return null

  return (
    <StyledWrapper className={className} aria-label="방문 횟수">
      <div className="item">
        <AiOutlineEye className="icon" />
        <span className="label">전체</span>
        <strong>{formatCount(counts.total)}</strong>
      </div>
      <div className="divider" />
      <div className="item">
        <AiOutlineCalendar className="icon" />
        <span className="label">오늘</span>
        <strong>{formatCount(counts.today)}</strong>
      </div>
    </StyledWrapper>
  )
}

export default VisitorCounter

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.75rem 0.5rem 0.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray5};
  color: ${({ theme }) => theme.colors.gray11};

  .item {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    gap: 0.125rem 0.375rem;
    min-width: 0;
  }

  .icon {
    width: 1rem;
    height: 1rem;
    align-self: center;
  }

  .label {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  strong {
    grid-column: 1 / -1;
    color: ${({ theme }) => theme.colors.gray12};
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 700;
    text-align: center;
  }

  .divider {
    width: 1px;
    height: 2rem;
    background-color: ${({ theme }) => theme.colors.gray5};
  }
`
