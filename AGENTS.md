# Today Island Agent Notes

These instructions apply to the whole repository.

## Deployment Invariants

- The homepage `/` must never serve a multipart/RSC boundary as HTML. A valid homepage response starts with `<!DOCTYPE html>` and must not start with `--<boundary>` or include `Next-Router-State-Tree` before the document.
- Keep `src/pages/index.tsx` on Pages Router SSR with `Cache-Control: no-store` unless you have verified the live Vercel response after deployment. Do not casually switch it back to `getStaticProps`, ISR, or an App Router page.
- After any deployment-related change, verify the canonical production URL:
  `curl -sS -D /tmp/today.headers https://www.jaehyuns.com/ -o /tmp/today.body`
  Then confirm `/tmp/today.body` starts with `<!DOCTYPE html>` and does not contain an outer multipart boundary like `--53...`.
- The apex domain redirects to `https://www.jaehyuns.com/`; verify the `www` URL when checking production HTML.

## Notion Build/Runtime Safety

- Notion is an external dependency and may return 429/5xx. Do not let homepage rendering fail just because fresh Notion metadata is unavailable.
- Preserve the homepage last-good fallback in `src/generated/homepage-posts-cache.json`. Refresh it after intentional content updates when possible, but do not replace it with an empty list.
- Keep Notion retry logic bounded and transient-only. Retrying is a cushion, not the primary guarantee.
- Do not restore eager static generation of all detail pages. `src/pages/[slug].tsx` intentionally uses `fallback: "blocking"` to avoid build-time Notion request bursts.

## Visitor Counter

- Visitor counts are social-proof counts, not analytics. Keep the UI/API isolated from Notion data and page rendering.
- The visitor API supports both `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` and Vercel KV names `KV_REST_API_URL`/`KV_REST_API_TOKEN`.
- Do not expose Redis tokens with `NEXT_PUBLIC_`. They must remain server-only.
- Keep persistence behind the `VisitorStore` boundary so Upstash can be replaced by self-hosted Redis or Postgres later.

## Generated Files

- `yarn build` runs `next-sitemap` and may generate or mutate `public/sitemap.xml` and `public/robots.txt`. Do not commit those generated changes unless the task explicitly targets sitemap output.
- `tsconfig.tsbuildinfo`, `.idea/`, and local env files are local artifacts and should not be included in feature commits.

## Verification Checklist

For changes touching routing, build, Notion data, or deployment:

- Run `npx tsc --noEmit --incremental false`.
- Run `yarn lint`; existing hook dependency warnings are known, but new errors must be fixed.
- Run `yarn build`.
- Run `FORCE_HOMEPAGE_POSTS_CACHE=true yarn build` when the homepage or Notion fallback changes.
- Check local build output starts with `<!DOCTYPE html>`:
  `head -c 80 .next/server/pages/index.html` when `/` is static, or verify the SSR response via `next start` when `/` is server-rendered.
- For production fixes, push and then verify `https://www.jaehyuns.com/` with `curl` as described above.
