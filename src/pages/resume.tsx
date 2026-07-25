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
  links: ResumeLink[]
  details: ReactNode[]
  technologies: string[]
}

type ResumeLink = {
  label: string
  href: string
}

const profileLinks = [
  { label: "Github", value: "https://github.com/wingwogus", href: "https://github.com/wingwogus" },
  { label: "Email", value: "wingwogus@naver.com", href: "mailto:wingwogus@naver.com" },
  { label: "Blog", value: "https://jaehyuns.com", href: "https://jaehyuns.com" },
]

const sideProjects = [
  {
    name: "MiruMiru (1M | 2명) BE/Infra",
    description: "일본 대학 커뮤니티 및 학사 지원 서비스",
    stack: "Kotlin / Spring / PostgreSQL",
    period: "2026.03",
    link: { label: "Github", href: "https://github.com/wingwogus/MiruMiru" },
  },
  {
    name: "Meetny (3M | 5명) BE/Infra",
    description: "잉여 티켓 동행 매칭 서비스",
    stack: "Java / Spring / MySQL",
    period: "2025.03 - 2025.06",
    link: { label: "Github", href: "https://github.com/wingwogus/Meetny-Backend" },
  },
  {
    name: "RamenLog (3M | 3명) BE/Infra",
    description: "전국 라멘 맛집 리뷰 서비스",
    stack: "Java / Spring / MySQL",
    period: "2024.10 - 2024.11",
    link: {
      label: "https://ramenlog.jaehyuns.com",
      href: "https://ramenlog.jaehyuns.com",
    },
  },
]

const representativeProjects: ProjectProps[] = [
  {
    name: "ChamChamCham (2M | 5명) BE/Infra",
    period: "2026.06 ~ 2026.07",
    description: "초기 농업인을 위한 AI 기반 영농일지 코칭 플랫폼",
    links: [
      {
        label: "App Store Link",
        href: "https://apps.apple.com/kr/app/%EC%B0%B8%EC%B0%B8%EC%B0%B8-%EC%B0%B8%EB%90%9C-%EB%86%8D%EC%82%AC%EC%9D%98-%EC%8B%9C%EC%9E%91/id6787890539?l=en-GB",
      },
      { label: "Github", href: "https://github.com/wingwogus/ChamChamCham" },
    ],
    details: [
      <>커뮤니티 및 카카오/애플/네이버 <strong>소셜 로그인 구현</strong></>,
      <>
        농업e지 정책 일 1,000건 동기화 및 실패 격리/Upsert/누락 정책 비활성화, SELECT 쿼리{" "}
        <strong>9회→2회로 78% 감소</strong>
      </>,
      "최종 수확 기준 재배 주기 분할 및 8개 영농 작업 통계 리포트 구현",
      <>
        Spring AI/pgvector <strong>RAG 구축</strong> 및 비동기 처리로 기록 저장 응답시간{" "}
        <strong>2.3초→300ms 단축</strong>
      </>,
      <>
        GitHub Actions 및 Docker 배포 자동화로 배포시간 <strong>15분→8분 단축</strong>, Health Check 및 배포 안전 게이트 적용
      </>,
    ],
    technologies: [
      "Kotlin / Spring Boot / Spring AI / PostgreSQL / pgvector / Redis / Docker / GitHub Actions / Ollama",
    ],
  },
  {
    name: "NuguSauce (1M | 1명) 개인프로젝트",
    period: "2026.04",
    description: "훠궈 소스 공유 커뮤니티",
    links: [
      {
        label: "App Store Link",
        href: "https://apps.apple.com/kr/app/%EB%88%84%EA%B5%AC%EC%86%8C%EC%8A%A4-%ED%9B%A0%EA%B6%88-%EC%86%8C%EC%8A%A4-%EA%B3%B5%EC%9C%A0-%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0/id6765720643?l=en-GB",
      },
    ],
    details: [
      <>
        서비스 기획부터 백엔드, iOS 앱, 배포, 운영까지 <strong>전 과정을 1인 개발해</strong> 대한민국 App Store 음식 및 음료 무료 앱{" "}
        <strong>최고 136위</strong>, 최근 30일 활성 기기 <strong>107대</strong> 기록
      </>,
      <>
        Kakao/Apple OIDC <strong>검증과 Redis SETNX 기반 nonce 재사용 방지</strong>, refresh token 재발급/폐기를 구현하고 출시 후{" "}
        <strong>만료 토큰 세션 유지 문제 해결</strong>
      </>,
      <>
        GitHub Actions, Docker, Helm, Argo CD로 <strong>커밋 SHA 단위 Kubernetes 배포 및 롤백 체계</strong> 구축
      </>,
      <>
        이미지 교체 시 DB 트랜잭션과 Cloudinary 삭제를 분리하고 <strong>커밋 후 외부 리소스를 정리해</strong> 외부 삭제 실패가 회원 정보 수정 롤백으로 번지지 않도록 장애 격리
      </>,
    ],
    technologies: [
      "Kotlin / Spring Boot / PostgreSQL / Redis / Docker / Kubernetes / Swift",
    ],
  },
  {
    name: "TRI-BE (3M | 5명) BE/Infra",
    period: "2025.08 - 2025.11",
    description: "AI 기반 그룹 여행 협업 자동화 플랫폼",
    links: [
      { label: "https://tri-be.app", href: "https://tri-be.app" },
      { label: "Github", href: "https://github.com/wingwogus/TRI-BE" },
    ],
    details: [
      <>
        STOMP WebSocket 및 이벤트 기반 아키텍처로 일정 공동 편집·채팅을 구현하고, <strong>동시 편집 충돌 방지 및 채팅방 단위 메시지 순서 보장 로직</strong> 적용
      </>,
      <>
        초대 검증 API에서 매 요청마다 발생하던 DB 조회를 <strong>Redis TTL 7일 토큰 캐시로</strong> 전환, 평균 응답시간{" "}
        <strong>38ms → 3ms(92% 단축)</strong> 및 cache hit 구간의 DB read 제거
      </>,
      <>
        메시지 10만 건 구간에서 offset 기반 조회 병목을 JMeter로 재현한 뒤 messageId 기준 cursor pagination으로 전환해{" "}
        <strong>p95 latency 1.6s → 290ms(81% 개선)</strong>, 페이지 후반부 지연 편차 해소
      </>,
      <>
        Greedy 기반 채무 관계 분석 알고리즘을 설계해 <strong>N명 정산을 최대 N-1회 송금으로 완료하도록 설계</strong>, 사용자 정산 액션 수를 구조적으로 감소
      </>,
      <>
        거리 계산 결과를 Redis read-through cache로 저장해 외부 API 호출량을 <strong>68% 절감</strong>하고, 평균 응답시간을{" "}
        <strong>420ms → 120ms(71% 개선)</strong>로 단축
      </>,
    ],
    technologies: [
      "Kotlin / Spring / PostgreSQL / Redis / Kubernetes / Docker",
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
  links,
  details,
  technologies,
}: ProjectProps) => (
  <article className="timeline-item">
    <div className="project-heading">
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="project-meta">
        <span>{period}</span>
        {links.map((link) => (
          <ExternalLink key={link.href} href={link.href}>
            {link.label}
          </ExternalLink>
        ))}
      </div>
    </div>
    <h4>담당</h4>
    <ul className="project-details">
      {details.map((detail, index) => (
        <li key={`${name}-${index}`}>{detail}</li>
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
                src="/resume/jaehyun-profile.jpg"
                alt="백엔드 개발자 이재현 프로필 사진"
                width={1731}
                height={2072}
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
              {sideProjects.map(({ name, description, stack, period, link }) => (
                <article key={name}>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <small>{stack}</small>
                  <div className="support-project-meta">
                    <span>{period}</span>
                    <ExternalLink href={link.href}>{link.label}</ExternalLink>
                  </div>
                </article>
              ))}
            </ResumeSection>
          </aside>

          <div className="resume-content">
            <ResumeSection title="Profile" className="profile">
              <p>
                실시간 협업 기능과 GitOps 기반 배포 자동화 경험을 바탕으로, 기능 구현을 넘어
                latency, DB I/O, deployment lead time을 수치로 개선하는 백엔드 개발자입니다.
              </p>
              <p>
                Kotlin/Spring 기반 서비스에서 Redis 캐싱, cursor pagination, 이벤트 기반 구조를
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
                    <h3>신한 스퀘어브릿지 청년 해커톤</h3>
                    <p>26.07 / 혁신상 / 신한금융희망재단</p>
                  </article>
                  <article className="compact-entry">
                    <h3>포트폴리오 경진대회</h3>
                    <p>26.07 / 은상 / 명지전문대학</p>
                  </article>
                  <article className="compact-entry">
                    <h3>캡스톤 경진대회</h3>
                    <p>25.12 / 금상 / 명지전문대학</p>
                  </article>
                </ResumeSection>

                <ResumeSection title="OSS Contributions">
                  <article className="compact-entry">
                    <h3>
                      <ExternalLink href="https://github.com/litmuschaos/litmus/pull/5515">
                        LitmusChaos 오탈자 및 중복 단어 문서 수정
                      </ExternalLink>
                    </h3>
                    <p>26.06</p>
                  </article>
                </ResumeSection>

                <ResumeSection title="Skills" className="skills">
                  <div>
                    <h3>Strong</h3>
                    <p>Java / Kotlin / Spring / MySQL / PostgreSQL</p>
                    <p>Kubernetes / docker</p>
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
                    <h3>AI 기반의 올인원 여행 플랫폼 &apos;Tribe&apos; 설계 및 구현</h3>
                    <p>
                      26.01 /{" "}
                      <ExternalLink href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE12582141">
                        2026 KSCI 동계학술대회 577p
                      </ExternalLink>
                    </p>
                  </article>
                  <article className="compact-entry">
                    <h3>문화활동 참여 촉진을 위한 신뢰도 및 취향 기반 동행자 매칭 시스템 개발, ‘MEETNY’</h3>
                    <p>
                      25.07 /{" "}
                      <ExternalLink href="https://www.artntech.or.kr/sub/c01_02.html?idx=202&page=1">
                        2025 KMAIA 국내학술대회 67p
                      </ExternalLink>
                    </p>
                  </article>
                </ResumeSection>

                <ResumeSection title="Communities">
                  <article className="compact-entry">
                    <h3>신한 스퀘어브릿지 청년 해커톤</h3>
                    <p>26.06 ~ 26.07 / 백엔드 / 3기</p>
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

  .project-heading h3 {
    position: relative;
  }

  .project-heading h3::before {
    background: #3e4144;
    border-radius: 50%;
    content: "";
    height: 0.65rem;
    left: calc(-1.1rem - 0.325rem);
    position: absolute;
    top: 0.625em;
    transform: translateY(-50%);
    width: 0.65rem;
  }

  .project-heading > p {
    font-size: 0.9rem;
    font-weight: 700;
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
      width: auto;
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
