# Homepage ISR Design

## Goal

Reflect newly published Notion posts on the homepage without a manual cache refresh and deployment, while retaining the generated JSON feed as the failure fallback.

## Decision

When `HOMEPAGE_POSTS_SOURCE=notion` is set in Vercel Production, the homepage will use Pages Router ISR with a 600-second revalidation interval. The initial build and any failed Notion fetch continue to use `src/generated/homepage-posts-cache.json`.

## Data Flow

1. Vercel builds and serves the homepage through Pages Router static generation.
2. With live Notion explicitly enabled, the first request after the 10-minute revalidation window regenerates the homepage from Notion.
3. A transient Notion failure retains the existing JSON fallback behavior instead of failing the homepage response.
4. Without the production environment variable, local builds and preview deployments remain cache-only.

## Constraints

- Keep the homepage on Pages Router and retain valid document HTML output.
- Do not add dependencies or Vercel Cron; Hobby Cron cannot run every 10 minutes.
- Keep `src/generated/homepage-posts-cache.json` as the repository fallback.
- Preserve detail-page revalidation at its existing interval.

## Required Vercel Configuration

Set `HOMEPAGE_POSTS_SOURCE=notion` for the Production environment, then redeploy. No secret is involved in this value.
