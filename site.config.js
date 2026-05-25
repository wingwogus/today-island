const CONFIG = {
  // profile setting (required)
  profile: {
    name: "이재현",
    image: "/avatar.svg", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "BackEnd Developer",
    bio: "I develop to change the world, even if it's just 1 percent.",
    email: "wingwogus@naver.com",
    linkedin: "wingwogus",
    github: "wingwogus",
    instagram: "",
  },
  projects: [
    {
      name: `today-island`,
      href: "https://github.com/wingwogus/today-island",
    },
  ],
  // blog setting (required)
  blog: {
    title: "🏝️오늘도",
    description:
      "오늘도 발전하기 위한 하루가 되기를 바라는 마음으로 백엔드 개발, 기술 선택, 프로젝트 회고를 기록하는 이재현의 기술 블로그입니다.",
    scheme: "light", // 'light' | 'dark' | 'system'
  },
  seo: {
    title: "🏝️오늘도 | 발전을 기록하는 백엔드 기술 블로그와 회고",
    description:
      "오늘도 발전하기 위한 하루가 되기를 바라는 마음으로 백엔드 개발, 기술 선택, 프로젝트 회고를 기록하는 이재현의 기술 블로그입니다.",
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
      "https://og-image-korean.vercel.app/%F0%9F%8F%9D%EF%B8%8F%EC%98%A4%EB%8A%98%EB%8F%84%20%7C%20%EB%B0%9C%EC%A0%84%EC%9D%84%20%EA%B8%B0%EB%A1%9D%ED%95%98%EB%8A%94%20%EB%B0%B1%EC%97%94%EB%93%9C%20%EA%B8%B0%EC%88%A0%20%EB%B8%94%EB%A1%9C%EA%B7%B8%EC%99%80%20%ED%9A%8C%EA%B3%A0.png",
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },

  // CONFIG configration (required)
  link: "https://jaehyuns.com",
  since: 2022, // If leave this empty, current year will be used.
  lang: "ko-KR", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: "17e9e2d9440580389144cec2c2baa077",
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: true,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: true,
    config: {
      siteVerification:
        process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ||
        "58e6f8045df8a0ecbec8edc9af55d625de10eb8e",
    },
  },
  utterances: {
    enable: false,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 300, // revalidate time for [slug], index
}

module.exports = { CONFIG }
