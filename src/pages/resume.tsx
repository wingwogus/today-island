import { ReactNode } from "react"
import Image from "next/image"
import styled from "@emotion/styled"
import MetaConfig from "src/components/MetaConfig"
import { NextPageWithLayout } from "src/types"
import { CONFIG } from "site.config"

type ResumeSectionProps = {
  title: string
  children: ReactNode
  className?: string
}

type ProjectProps = {
  name: string
  period: string
  description: string
  href?: string
  details: string[]
  technologies: string[]
}

const profileLinks = [
  { label: "Github", value: "github.com/wingwogus", href: "https://github.com/wingwogus" },
  { label: "Email", value: "wingwogus@naver.com", href: "mailto:wingwogus@naver.com" },
  { label: "Blog", value: "jaehyuns.com", href: "https://jaehyuns.com" },
]

const sideProjects = [
  {
    name: "NuguSauce",
    description: "훠궈 소스 공유 커뮤니티",
    stack: "iOS / Kotlin / Spring",
    period: "2026.04",
  },
  {
    name: "Meetny",
    description: "잉여 티켓 동행 매칭 서비스",
    stack: "Java / Spring / MySQL",
    period: "2025.03 - 2025.06",
    href: "http://meetny.kro.kr",
  },
  {
    name: "RamenLog",
    description: "전국 라멘 맛집 리뷰 서비스",
    stack: "Java / Spring / MySQL",
    period: "2024.10 - 2024.11",
    href: "https://ramenlog.jaehyuns.com",
  },
]

const representativeProjects: ProjectProps[] = [
  {
    name: "MiruMiru (3M | 2명) BE/Infra",
    period: "2026.03 - 진행 중",
    description: "일본 대학 커뮤니티 및 학사 지원 서비스",
    href: "https://github.com/wingwogus/mirumiru",
    details: [
      "대학 이메일 인증, 닉네임 검증, 전공 선택, JWT 재발급(Access/Refresh 분리)을 포함한 인증·회원가입 백엔드를 구현하고 서비스·API 검증 테스트로 가입 흐름의 예외 케이스를 회귀 방지했습니다.",
      "게시판·댓글·좋아요·게시글 기반 1:1 채팅·읽음 처리·차단/신고 기능을 구축해 게시글 상호작용부터 대화·제재까지 이어지는 end-to-end 커뮤니티 도메인을 단일 서비스로 설계했습니다.",
      "강의평 검색·CRUD와 학기별 시간표 조회·수정 API를 구현해 수강 정보 탐색 및 개인 학사 관리 기능을 제공했습니다.",
      "APNS 푸시 토큰 등록·갱신·만료 처리와 댓글/채팅 이벤트 기반 알림 발송을 연동해 디바이스 단위 토큰 라이프사이클을 관리했습니다.",
      "서비스 단위 테스트 17개, API·통합 테스트 18개(총 35개)를 작성해 알림 흐름과 핵심 도메인 로직의 회귀 안정성을 강화했습니다.",
    ],
    technologies: [
      "Kotlin / Spring / PostgreSQL / Redis / Kubernetes / Docker",
      "Nginx / OCI / GitHub Actions / Argo CD",
    ],
  },
  {
    name: "TRI-BE (3M | 5명) BE/Infra",
    period: "2025.08 - 2025.11",
    description: "AI 기반 그룹 여행 협업 자동화 플랫폼",
    href: "https://github.com/wingwogus/tri-be",
    details: [
      "STOMP WebSocket 및 이벤트 기반 아키텍처로 일정 공동 편집·채팅을 구현하고, 동시 편집 충돌 방지 및 메시지 순서 보장 로직을 적용했습니다.",
      "초대 검증 API에서 매 요청마다 발생하던 DB 조회를 Redis TTL 7일 토큰 캐시로 전환해 평균 응답 시간을 38ms에서 3ms로 92% 단축하고, 초대 트래픽 부하를 완화했습니다.",
      "메시지 10만 건 구간에서 offset 기반 조회 병목을 JMeter로 재현한 뒤 messageId 기준 cursor pagination으로 전환해 p95 latency를 1.6s에서 290ms로 81% 개선했습니다.",
      "Greedy 기반 채무 관계 분석 알고리즘을 설계해 N명 정산 시 송금 횟수를 최대 (N-1)회까지 최소화하고 사용자 정산 액션 수를 구조적으로 줄였습니다.",
      "거리 계산 결과를 Redis read-through cache로 저장해 외부 API 호출량을 68% 절감하고 평균 응답 시간을 420ms에서 120ms로 71% 단축했습니다.",
    ],
    technologies: [
      "Java / Spring / PostgreSQL / Redis / Kubernetes / Docker",
      "Nginx / OCI / GitHub Actions / Argo CD",
    ],
  },
]

const ResumeSection = ({ title, children, className }: ResumeSectionProps) => (
  <section className={`resume-section ${className || ""}`.trim()}>
    <h2>{title}</h2>
    {children}
  </section>
)

const ExternalLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
)

const RepresentativeProject = ({
  name,
  period,
  description,
  href,
  details,
  technologies,
}: ProjectProps) => (
  <article className="timeline-item">
    <span className="timeline-dot" aria-hidden="true" />
    <div className="project-heading">
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="project-meta">
        <span>{period}</span>
        {href && <ExternalLink href={href}>{href.replace(/^https?:\/\//, "")}</ExternalLink>}
      </div>
    </div>
    <h4>담당</h4>
    <ul className="project-details">
      {details.map((detail) => (
        <li key={detail}>{detail}</li>
      ))}
    </ul>
    <div className="technologies">
      <h4>사용 기술</h4>
      {technologies.map((technology) => (
        <p key={technology}>{technology}</p>
      ))}
    </div>
  </article>
)

const ResumePage: NextPageWithLayout = () => {
  const url = `${CONFIG.link}/resume`

  return (
    <>
      <MetaConfig
        title="이재현 | Backend Developer Resume"
        description="실시간 협업과 GitOps 기반 배포 자동화 경험으로 Latency, DB I/O, Deployment Lead Time을 개선하는 백엔드 개발자 이재현의 이력서입니다."
        type="Website"
        imageAlt="백엔드 개발자 이재현 이력서"
        url={url}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "이재현",
          jobTitle: "Backend Developer",
          url,
          email: "mailto:wingwogus@naver.com",
          sameAs: ["https://github.com/wingwogus", "https://jaehyuns.com"],
          knowsAbout: [
            "Java",
            "Kotlin",
            "Spring",
            "Kubernetes",
            "GitOps",
            "Redis",
          ],
        }}
      />
      <StyledResume>
        <p className="eyebrow">Resume / Backend Developer</p>
        <div className="resume-sheet">
          <aside className="identity-column">
            <div className="photo-frame">
              <Image
                src="/resume/jaehyun-profile.png"
                alt="백엔드 개발자 이재현 프로필 사진"
                width={620}
                height={797}
                priority
              />
            </div>
            <h1>
              <span>BACK-END</span>
              이재현
            </h1>
            <div className="identity-rule" />
            <div className="profile-links">
              {profileLinks.map(({ label, value, href }) => (
                <div key={label}>
                  <strong>{label}</strong>
                  <ExternalLink href={href}>{value}</ExternalLink>
                </div>
              ))}
            </div>

            <ResumeSection title="Projects" className="support-projects">
              {sideProjects.map(({ name, description, stack, period, href }) => (
                <article key={name}>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <small>{stack}</small>
                  <div className="support-project-meta">
                    <span>{period}</span>
                    {href && <ExternalLink href={href}>서비스 보기</ExternalLink>}
                  </div>
                </article>
              ))}
            </ResumeSection>
          </aside>

          <div className="resume-content">
            <ResumeSection title="Profile" className="profile">
              <p>
                실시간 협업 기능과 GitOps 기반 배포 자동화 경험을 바탕으로, 기능 구현을 넘어
                Latency·DB I/O·Deployment Lead Time을 수치로 개선하는 백엔드 개발자입니다.
              </p>
              <p>
                Kotlin/Spring 기반 서비스에서 Redis 캐싱, Cursor Pagination, 이벤트 기반 구조를
                적용했고, Kubernetes/Argo CD/GitOps 환경에서 안정적인 배포 체계를 설계했습니다.
              </p>
            </ResumeSection>

            <div className="content-columns">
              <main>
                <ResumeSection title="Representative Projects" className="representative-projects">
                  {representativeProjects.map((project) => (
                    <RepresentativeProject key={project.name} {...project} />
                  ))}
                </ResumeSection>
              </main>

              <aside className="details-column">
                <ResumeSection title="Awards">
                  <article className="compact-entry">
                    <h3>캡스톤 경진대회</h3>
                    <p>25.12 / 금상 / 명지전문대학</p>
                  </article>
                </ResumeSection>

                <ResumeSection title="OpenSource">
                  <article className="compact-entry">
                    <h3>LitmusChaos 오탈자 및 중복 단어 문서 수정</h3>
                    <p>26.06</p>
                  </article>
                </ResumeSection>

                <ResumeSection title="Skills" className="skills">
                  <div>
                    <h3>Strong</h3>
                    <p>Java / Kotlin / Spring / MySQL / PostgreSQL</p>
                    <p>Kubernetes / Docker</p>
                  </div>
                  <div>
                    <h3>Knowledgeable</h3>
                    <p>Python / JS / React / Redis</p>
                  </div>
                </ResumeSection>

                <ResumeSection title="Certifications">
                  <article className="compact-entry">
                    <h3>정보처리산업기사</h3>
                    <p>25.06.20 / 25201022390G / 한국산업인력공단</p>
                  </article>
                  <article className="compact-entry">
                    <h3>SQLD</h3>
                    <p>25.09.11 / SQLD-058003038 / 한국데이터산업진흥원</p>
                  </article>
                </ResumeSection>

                <ResumeSection title="Papers">
                  <article className="compact-entry">
                    <h3>AI 기반의 올인원 여행 플랫폼 ‘Tribe’ 설계 및 구현</h3>
                    <p>26.01 / 2026 KSCI 동계학술대회 57p</p>
                  </article>
                  <article className="compact-entry">
                    <h3>문화활동 참여 촉진을 위한 신뢰도 및 취향 기반 동행자 매칭 시스템 개발, ‘MEETNY’</h3>
                    <p>25.07 / 2025 KMAA 추계학술대회 67p</p>
                  </article>
                </ResumeSection>

                <ResumeSection title="Communities">
                  <article className="compact-entry">
                    <h3>신한 스퀘어브릿지 청년 해커톤</h3>
                    <p>26.06 - / 백엔드 / 3기</p>
                  </article>
                  <article className="compact-entry">
                    <h3>2026 오픈소스 컨트리뷰션 아카데미</h3>
                    <p>26.04 - 26.06 / LitmusChaos / 멘티</p>
                  </article>
                  <article className="compact-entry">
                    <h3>구름톤 유니브 연합동아리</h3>
                    <p>25.03 - 25.12 / 백엔드 / 교내 부대표</p>
                  </article>
                </ResumeSection>
              </aside>
            </div>
          </div>
        </div>
      </StyledResume>
    </>
  )
}

export default ResumePage

const StyledResume = styled.article`
  --ink: #0b2548;
  --text: #252628;
  --muted: #6b6d70;
  --rule: #3d4147;

  color: var(--text);
  margin: 0 auto;
  max-width: 1160px;
  padding: 2rem 0 4rem;

  .eyebrow {
    color: var(--muted);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin: 0 0 0.75rem;
    text-transform: uppercase;
  }

  .resume-sheet {
    animation: sheet-enter 520ms ease-out both;
    background: #fff;
    border: 1px solid #e5e5e5;
    box-shadow: 0 18px 42px rgba(10, 20, 35, 0.08);
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    min-height: 100%;
  }

  .identity-column {
    border-right: 1px solid #d8dadd;
    display: flex;
    flex-direction: column;
    padding: 2.5rem 1.5rem;
  }

  .photo-frame {
    animation: photo-enter 680ms 90ms ease-out both;
    background: #f4f3f5;
    overflow: hidden;
  }

  .photo-frame img {
    display: block;
    height: auto;
    transition: transform 260ms ease;
    width: 100%;
  }

  .photo-frame:hover img {
    transform: scale(1.025);
  }

  h1 {
    color: #383838;
    font-size: clamp(2.4rem, 5vw, 3.15rem);
    font-weight: 800;
    letter-spacing: -0.09em;
    line-height: 0.86;
    margin: 1rem 0 1.2rem;
  }

  h1 span {
    display: block;
    font-size: 0.64em;
    letter-spacing: -0.06em;
    margin-bottom: 0.15em;
  }

  .identity-rule {
    background: var(--rule);
    height: 4px;
    margin-bottom: 1.85rem;
    width: 100%;
  }

  .profile-links {
    display: grid;
    gap: 1.35rem;
  }

  .profile-links div {
    display: grid;
    gap: 0.25rem;
  }

  .profile-links strong,
  .profile-links a {
    overflow-wrap: anywhere;
  }

  .profile-links strong {
    color: var(--ink);
    font-size: 1.05rem;
  }

  a {
    color: inherit;
    text-decoration-color: transparent;
    text-decoration-line: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
    transition: color 160ms ease, text-decoration-color 160ms ease;
  }

  a:hover,
  a:focus-visible {
    color: #1769aa;
    outline: none;
    text-decoration-color: currentColor;
  }

  .resume-content {
    min-width: 0;
    padding: 2.5rem 3rem 3rem;
  }

  .resume-section {
    animation: content-enter 440ms ease-out both;
  }

  .resume-section + .resume-section {
    margin-top: 2rem;
  }

  .resume-section h2 {
    border-bottom: 2px solid var(--rule);
    color: var(--ink);
    font-size: 1.7rem;
    font-weight: 700;
    letter-spacing: -0.055em;
    line-height: 1;
    margin: 0 0 0.8rem;
    padding-bottom: 0.4rem;
  }

  .profile {
    animation-delay: 80ms;
  }

  .profile p {
    font-size: 0.95rem;
    letter-spacing: -0.025em;
    line-height: 1.45;
    margin: 0;
  }

  .profile p + p {
    margin-top: 0.15rem;
  }

  .content-columns {
    display: grid;
    gap: 2.75rem;
    grid-template-columns: minmax(0, 1.5fr) minmax(220px, 0.75fr);
    margin-top: 2.5rem;
  }

  .representative-projects {
    animation-delay: 150ms;
  }

  .representative-projects > h2 {
    font-size: 1.72rem;
  }

  .timeline-item {
    border-left: 2px solid #3e4144;
    padding: 0 0 2.25rem 1.1rem;
    position: relative;
  }

  .timeline-item:last-child {
    padding-bottom: 0;
  }

  .timeline-item + .timeline-item {
    padding-top: 2rem;
  }

  .timeline-dot {
    background: #3e4144;
    border-radius: 50%;
    height: 0.65rem;
    left: -0.4rem;
    position: absolute;
    top: 0.16rem;
    width: 0.65rem;
  }

  .timeline-item + .timeline-item .timeline-dot {
    top: 2.15rem;
  }

  .project-heading h3,
  .compact-entry h3,
  .skills h3,
  .support-projects h3 {
    color: #111;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 1.25;
    margin: 0;
  }

  .project-heading > p {
    font-size: 0.9rem;
    font-weight: 650;
    letter-spacing: -0.03em;
    line-height: 1.4;
    margin: 0.35rem 0 0;
  }

  .project-meta,
  .support-project-meta {
    display: flex;
    flex-wrap: wrap;
    font-size: 0.67rem;
    gap: 0.45rem 0.75rem;
    line-height: 1.35;
    margin-top: 0.5rem;
  }

  .project-meta a {
    text-decoration-color: #a5a7aa;
  }

  .timeline-item h4,
  .technologies h4 {
    color: #333;
    font-size: 0.78rem;
    font-weight: 700;
    margin: 0.8rem 0 0.35rem;
  }

  .project-details {
    display: grid;
    gap: 0.35rem;
    margin: 0;
    padding-left: 1rem;
  }

  .project-details li {
    font-size: 0.8rem;
    letter-spacing: -0.026em;
    line-height: 1.45;
    padding-left: 0.08rem;
  }

  .technologies {
    margin-top: 0.8rem;
  }

  .technologies h4 {
    margin-top: 0;
  }

  .technologies p {
    font-size: 0.62rem;
    line-height: 1.5;
    margin: 0;
    text-transform: uppercase;
  }

  .details-column {
    animation: content-enter 460ms 200ms ease-out both;
  }

  .details-column .resume-section + .resume-section {
    margin-top: 2rem;
  }

  .details-column .resume-section h2 {
    font-size: 1.45rem;
  }

  .compact-entry + .compact-entry {
    margin-top: 1rem;
  }

  .compact-entry p,
  .skills p {
    font-size: 0.7rem;
    letter-spacing: -0.025em;
    line-height: 1.4;
    margin: 0.28rem 0 0;
  }

  .skills > div + div {
    margin-top: 0.9rem;
  }

  .support-projects {
    margin-top: auto;
    padding-top: 3.5rem;
  }

  .support-projects article + article {
    border-top: 1px solid #d1d3d5;
    margin-top: 1rem;
    padding-top: 1rem;
  }

  .support-projects h3 {
    font-size: 0.88rem;
  }

  .support-projects p,
  .support-projects small {
    display: block;
    font-size: 0.68rem;
    line-height: 1.35;
    margin: 0.32rem 0 0;
  }

  .support-projects small {
    font-size: 0.58rem;
    text-transform: uppercase;
  }

  .support-project-meta {
    font-size: 0.58rem;
  }

  @keyframes sheet-enter {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes photo-enter {
    from {
      opacity: 0;
      transform: scale(0.97);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes content-enter {
    from {
      opacity: 0;
      transform: translateY(7px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 900px) {
    .resume-sheet {
      grid-template-columns: 210px minmax(0, 1fr);
    }

    .resume-content {
      padding: 2.25rem;
    }

    .content-columns {
      gap: 2rem;
      grid-template-columns: minmax(0, 1fr);
    }

    .details-column {
      display: grid;
      gap: 1.5rem 2rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .details-column .resume-section,
    .details-column .resume-section + .resume-section {
      margin-top: 0;
    }
  }

  @media (max-width: 640px) {
    margin: 0 -1rem;
    padding: 0;

    .eyebrow {
      margin: 1.25rem 1rem 0.65rem;
    }

    .resume-sheet {
      border-left: 0;
      border-right: 0;
      box-shadow: none;
      display: block;
    }

    .identity-column {
      border-bottom: 1px solid #d8dadd;
      border-right: 0;
      display: grid;
      gap: 1.5rem;
      grid-template-columns: minmax(0, 132px) minmax(0, 1fr);
      padding: 1.5rem;
    }

    .photo-frame {
      align-self: start;
      grid-row: span 2;
    }

    h1 {
      align-self: end;
      font-size: 2.75rem;
      margin: 0;
    }

    .identity-rule {
      display: none;
    }

    .profile-links {
      gap: 0.85rem;
      grid-column: 2;
    }

    .profile-links strong {
      font-size: 0.9rem;
    }

    .profile-links a {
      font-size: 0.78rem;
    }

    .support-projects {
      border-top: 1px solid #d1d3d5;
      grid-column: 1 / -1;
      margin-top: 0;
      padding-top: 1.5rem;
    }

    .resume-content {
      padding: 2rem 1.5rem 2.75rem;
    }

    .resume-section h2,
    .representative-projects > h2 {
      font-size: 1.5rem;
    }

    .profile p {
      font-size: 0.88rem;
    }

    .content-columns {
      margin-top: 2rem;
    }

    .timeline-item {
      padding-left: 0.9rem;
    }

    .details-column {
      display: block;
    }

    .details-column .resume-section + .resume-section {
      margin-top: 1.75rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 1ms !important;
      scroll-behavior: auto !important;
      transition-duration: 1ms !important;
    }
  }
`
