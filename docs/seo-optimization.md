# SEO 최적화 산출물

대상: `https://jaehyuns.com`
타겟: 한국 사용자, 한국어
스택 판단: Next.js Pages Router, Notion 기반 블로그, `next/head`, `next-sitemap`

## 1. 메타데이터

### 복사·붙여넣기 가능한 코드/텍스트

```js
blog: {
  title: "기술 블로그 | 이재현의 백엔드 개발 회고와 실전 기록",
  description:
    "백엔드 개발과 기술 선택, 프로젝트 회고를 기록하는 이재현의 기술 블로그입니다. 실전 경험을 바탕으로 문제 해결 과정을 확인하세요.",
  scheme: "light",
},
seo: {
  keywords: [
    "블로그",
    "기술 블로그",
    "회고",
    "기술",
    "백엔드",
    "백엔드 개발",
    "개발 회고",
    "프로젝트 회고",
  ],
  defaultOgImage:
    "https://og-image-korean.vercel.app/%EA%B8%B0%EC%88%A0%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%7C%20%EC%9D%B4%EC%9E%AC%ED%98%84%EC%9D%98%20%EB%B0%B1%EC%97%94%EB%93%9C%20%EA%B0%9C%EB%B0%9C%20%ED%9A%8C%EA%B3%A0.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
},
link: "https://jaehyuns.com",
```

공통 Head에는 다음 항목이 출력됩니다.

```tsx
<link rel="canonical" href={canonical} />
<meta name="description" content={description} />
<meta property="og:type" content={ogType} />
<meta property="og:site_name" content={CONFIG.blog.title} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={image} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content={image} />
```

네이버 소유확인 메타 태그:

```html
<meta
  name="naver-site-verification"
  content="58e6f8045df8a0ecbec8edc9af55d625de10eb8e"
/>
```

### 적용 위치

- `/Users/wingwogus/IdeaProjects/today-island/site.config.js`
- `/Users/wingwogus/IdeaProjects/today-island/src/components/MetaConfig/index.tsx`
- `/Users/wingwogus/IdeaProjects/today-island/src/pages/_document.tsx`
- `/Users/wingwogus/IdeaProjects/today-island/src/pages/index.tsx`
- `/Users/wingwogus/IdeaProjects/today-island/src/pages/[slug].tsx`

### 선택 근거

- 홈 타이틀은 30자, 메인 키워드인 `기술 블로그`를 앞쪽에 배치했습니다.
- 홈 description은 73자로 검색 의도인 백엔드 개발 기록, 기술 선택, 회고 탐색을 반영했습니다.
- canonical은 중복 URL 신호를 줄이고, OG/Twitter 이미지는 공유 미리보기 품질을 위해 1200x630 메타를 명시했습니다.

## 2. 구조화 데이터 JSON-LD

### 복사·붙여넣기 가능한 코드/텍스트

홈:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://jaehyuns.com/#website",
      "name": "기술 블로그 | 이재현의 백엔드 개발 회고와 실전 기록",
      "url": "https://jaehyuns.com",
      "inLanguage": "ko-KR"
    },
    {
      "@type": "Blog",
      "@id": "https://jaehyuns.com/#blog",
      "name": "기술 블로그 | 이재현의 백엔드 개발 회고와 실전 기록",
      "url": "https://jaehyuns.com",
      "inLanguage": "ko-KR",
      "author": {
        "@type": "Person",
        "name": "이재현",
        "url": "https://jaehyuns.com"
      }
    }
  ]
}
```

상세 글:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": "https://jaehyuns.com/{slug}#article",
      "headline": "{post.title}",
      "description": "{post.summary}",
      "image": "{post.thumbnail 또는 og image}",
      "url": "https://jaehyuns.com/{slug}",
      "mainEntityOfPage": "https://jaehyuns.com/{slug}",
      "datePublished": "{ISO date}",
      "dateModified": "{ISO date}",
      "inLanguage": "ko-KR",
      "author": {
        "@type": "Person",
        "name": "이재현",
        "url": "https://jaehyuns.com"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "홈",
          "item": "https://jaehyuns.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "{post.title}",
          "item": "https://jaehyuns.com/{slug}"
        }
      ]
    }
  ]
}
```

### 적용 위치

- `/Users/wingwogus/IdeaProjects/today-island/src/pages/index.tsx`
- `/Users/wingwogus/IdeaProjects/today-island/src/pages/[slug].tsx`
- `/Users/wingwogus/IdeaProjects/today-island/src/components/MetaConfig/index.tsx`

### 선택 근거

- 홈은 개인 기술 블로그 성격이므로 `WebSite`와 `Blog`를 사용했습니다.
- 상세 글은 일반 글은 `BlogPosting`, 논문형 글은 `ScholarlyArticle`, 정적 페이지는 `Article`로 나눴습니다.
- 상세 글에는 검색 결과 경로 이해를 돕는 `BreadcrumbList`를 포함했습니다.

## 3. robots.txt / sitemap.xml

### 복사·붙여넣기 가능한 코드/텍스트

`robots.txt`:

```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /404

Sitemap: https://jaehyuns.com/sitemap.xml
```

동적 sitemap 필드:

```ts
{
  loc: `${CONFIG.link}/${post.slug}`,
  lastmod: new Date(post.date?.start_date || post.createdTime).toISOString(),
  priority: 0.7,
  changefreq: "weekly",
}
```

### 적용 위치

- `/Users/wingwogus/IdeaProjects/today-island/public/robots.txt`
- `/Users/wingwogus/IdeaProjects/today-island/src/pages/sitemap.xml.tsx`
- `/Users/wingwogus/IdeaProjects/today-island/next-sitemap.config.js`

### 선택 근거

- 정적 리소스 수집은 허용하고, API와 404 라우트만 제외했습니다.
- sitemap은 절대 URL, `lastmod`, `changefreq`, `priority`를 포함하도록 유지했습니다.
- 블로그 글은 매일 바뀌는 성격이 아니므로 `weekly`가 `daily`보다 자연스럽습니다.

## 4. 키워드 리서치

자동완성 항목은 네이버·구글의 실제 볼륨 데이터가 아니라, 한국어 검색 패턴 기반 추정안입니다. 배포 후 Search Console과 네이버 서치어드바이저 유입 쿼리로 보정하세요.

### 복사·붙여넣기 가능한 코드/텍스트

| 구분        | 키워드                       | 검색 의도 |
| ----------- | ---------------------------- | --------- |
| 메인        | 블로그                       | 탐색형    |
| 메인        | 기술 블로그                  | 탐색형    |
| 메인        | 회고                         | 정보형    |
| 메인        | 기술                         | 정보형    |
| 메인        | 백엔드                       | 정보형    |
| LSI         | 개발 블로그                  | 탐색형    |
| LSI         | 백엔드 개발                  | 정보형    |
| LSI         | 서버 개발                    | 정보형    |
| LSI         | API 설계                     | 정보형    |
| LSI         | 데이터베이스 설계            | 정보형    |
| LSI         | 시스템 설계                  | 정보형    |
| LSI         | 장애 회고                    | 정보형    |
| LSI         | 프로젝트 회고                | 정보형    |
| LSI         | 개발자 성장                  | 정보형    |
| LSI         | 개발 기록                    | 탐색형    |
| LSI         | 기술 선택                    | 정보형    |
| 롱테일      | 백엔드 개발자 기술 블로그    | 탐색형    |
| 롱테일      | 기술 블로그 시작하는 방법    | 정보형    |
| 롱테일      | 백엔드 프로젝트 회고 작성법  | 정보형    |
| 롱테일      | 개발자 회고 예시             | 정보형    |
| 롱테일      | API 설계 회고                | 정보형    |
| 롱테일      | 서버 장애 회고 사례          | 정보형    |
| 롱테일      | 개발 프로젝트 문제 해결 기록 | 정보형    |
| 롱테일      | 백엔드 포트폴리오 블로그     | 탐색형    |
| 롱테일      | 주니어 백엔드 성장 회고      | 정보형    |
| 롱테일      | 기술 선택 기준 정리          | 정보형    |
| 연관 검색어 | 기술 블로그 추천             | 탐색형    |
| 연관 검색어 | 개발 블로그 추천             | 탐색형    |
| 연관 검색어 | 백엔드 로드맵                | 정보형    |
| 연관 검색어 | 백엔드 공부법                | 정보형    |
| 연관 검색어 | 개발자 회고                  | 정보형    |
| 연관 검색어 | 프로젝트 회고 템플릿         | 정보형    |
| 연관 검색어 | 서버 개발 블로그             | 탐색형    |
| 연관 검색어 | 개발자 포트폴리오 블로그     | 탐색형    |
| 연관 검색어 | 백엔드 면접 회고             | 정보형    |
| 연관 검색어 | 기술 면접 회고               | 정보형    |

### 적용 위치

- 글 제목, H2/H3, 태그, Notion summary
- `/Users/wingwogus/IdeaProjects/today-island/site.config.js`의 `seo.keywords`

### 선택 근거

- 메인 키워드는 사이트 정체성에 맞는 넓은 탐색형 키워드로 두었습니다.
- 롱테일은 개별 글이 노릴 수 있는 정보형 쿼리 중심으로 구성했습니다.
- 거래형 키워드는 개인 기술 블로그와 맞지 않아 의도적으로 제외했습니다.

## 5. 콘텐츠 SEO

### 복사·붙여넣기 가능한 코드/텍스트

권장 홈 헤딩 구조:

```md
# 기술 블로그

## 백엔드 개발과 기술 선택 기록

### API, 데이터베이스, 시스템 설계

### 문제 해결과 장애 회고

## 프로젝트 회고

### 의사결정 배경

### 배운 점과 다음 개선점

## 최근 개발 글

### 백엔드

### 기술 회고

### 프로젝트 기록
```

인트로 문구:

```txt
이 블로그는 백엔드 개발 과정에서 마주한 기술 선택, 문제 해결, 프로젝트 회고를 기록합니다. 단순한 정답보다 왜 그렇게 판단했는지, 어떤 제약이 있었는지, 다음에는 무엇을 바꿀지를 중심으로 정리합니다.
```

FAQ 본문 샘플:

```md
### 기술 블로그에는 어떤 글을 다루나요?

백엔드 개발, API 설계, 데이터베이스, 운영 이슈, 프로젝트 회고처럼 실제 개발 과정에서 남길 가치가 있는 내용을 다룹니다.

### 회고 글은 어떤 기준으로 작성하나요?

문제 상황, 선택지, 결정 이유, 결과, 다음 개선점을 기준으로 정리합니다. 결과만 나열하지 않고 의사결정 과정을 함께 남깁니다.

### 백엔드 개발 글은 누구에게 적합한가요?

백엔드 개발을 공부하는 사람, 실무 문제 해결 사례를 찾는 개발자, 기술 선택의 근거를 비교하고 싶은 독자에게 적합합니다.

### 글에서 사용하는 기술은 고정되어 있나요?

고정된 기술보다 문제에 맞는 선택을 우선합니다. 서버, 데이터베이스, 인프라, 개발 생산성 도구를 필요에 따라 다룹니다.

### 프로젝트 회고를 읽으면 무엇을 얻을 수 있나요?

구현 결과뿐 아니라 제약 조건, 실패한 접근, 개선 방향을 함께 볼 수 있어 비슷한 상황의 의사결정에 참고할 수 있습니다.
```

### 적용 위치

- Notion 블로그 홈 또는 소개 영역
- 개별 글의 H2/H3 구조와 FAQ 섹션

### 선택 근거

- 키워드 밀도는 본문 기준 1~2% 수준으로 유지하고, 제목과 첫 문단에만 자연스럽게 배치합니다.
- FAQPage JSON-LD는 화면에 실제 FAQ가 보이는 글에만 추가하는 편이 안전합니다.

## 6. 기술 SEO 체크포인트

### 복사·붙여넣기 가능한 코드/텍스트

```txt
Core Web Vitals 목표
- LCP: 2.5초 미만
- INP: 200ms 미만
- CLS: 0.1 미만

이미지
- 프로필, 썸네일 alt를 사람이 읽을 수 있는 한국어로 작성
- 썸네일은 가능하면 고정 aspect-ratio 유지
- LCP 후보 이미지는 과도한 리다이렉트가 없는 URL 사용

내부 링크
- 홈에서 최신 글, 태그, 카테고리 링크를 유지
- 상세 글 하단에 관련 글 또는 같은 태그 글 링크 추가 권장

등록
- Google Search Console: URL Prefix 속성 등록 → 메타 태그 또는 DNS 검증 → sitemap 제출
- 네이버 서치어드바이저: 사이트 등록 → 소유확인 메타 태그 설정 → robots.txt 확인 → sitemap 제출
```

### 적용 위치

- `/Users/wingwogus/IdeaProjects/today-island/src/routes/Feed/ProfileCard.tsx`
- `/Users/wingwogus/IdeaProjects/today-island/src/routes/Feed/MobileProfileCard.tsx`
- `/Users/wingwogus/IdeaProjects/today-island/src/routes/Detail/PostDetail/PostHeader.tsx`
- Search Console, 네이버 서치어드바이저 관리자 화면

### 선택 근거

- 현재 코드에 비어 있거나 기계적인 alt가 있어 한국어 설명으로 바꿨습니다.
- Google과 네이버 모두 robots, sitemap, 중복 title/description, 접근 가능한 링크 구조를 기본 신호로 봅니다.

## 참고한 공식 자료

- Schema.org Blog: https://schema.org/Blog
- Schema.org BreadcrumbList: https://schema.org/BreadcrumbList
- Google Search Central structured data: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google canonical guide: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google robots.txt reference: https://developers.google.com/search/reference/robots_txt
- Google Search Console Core Web Vitals report: https://support.google.com/webmasters/answer/9205520
- 네이버 서치어드바이저 robots.txt 설정: https://searchadvisor.naver.com/guide/seo-basic-robots
- 네이버 서치어드바이저 SEO 기본 가이드: https://searchadvisor.naver.com/guide/seo-help
