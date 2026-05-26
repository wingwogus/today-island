import styled from "@emotion/styled"
import React, { useEffect, useState } from "react"
import { AiOutlineCalendar, AiOutlineEye, AiOutlineUser } from "react-icons/ai"

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
      credentials: "same-origin",
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
    <StyledWrapper className={className} aria-label="방문자 수">
      <div className="heading">
        <AiOutlineEye className="headingIcon" />
        <span>Visitors</span>
      </div>
      <dl className="stats">
        <div className="row">
          <dt>
            <AiOutlineUser className="icon" />
            <span>전체 방문자</span>
          </dt>
          <dd>{formatCount(counts.total)}</dd>
        </div>
        <div className="row">
          <dt>
            <AiOutlineCalendar className="icon" />
            <span>오늘 방문자</span>
          </dt>
          <dd>{formatCount(counts.today)}</dd>
        </div>
      </dl>
    </StyledWrapper>
  )
}

export default VisitorCounter

const StyledWrapper = styled.div`
  width: 100%;
  margin-top: 0.875rem;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray5};
  border-radius: 0.75rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? theme.colors.gray2 : theme.colors.gray3};
  color: ${({ theme }) => theme.colors.gray11};

  .heading {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray5};
    font-size: 0.8125rem;
    line-height: 1.25rem;
    font-weight: 600;
  }

  .headingIcon {
    width: 0.9375rem;
    height: 0.9375rem;
    flex: 0 0 auto;
  }

  .stats {
    display: grid;
    gap: 0.125rem;
    margin: 0;
    padding: 0.5rem 0 0;
  }

  .row,
  dt {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .row {
    justify-content: space-between;
    gap: 0.75rem;
    min-height: 1.75rem;
  }

  dt {
    gap: 0.375rem;
    margin: 0;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.colors.gray11};
  }

  .icon {
    width: 0.9375rem;
    height: 0.9375rem;
    flex: 0 0 auto;
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.gray12};
    font-size: 0.9375rem;
    line-height: 1.25rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
`
