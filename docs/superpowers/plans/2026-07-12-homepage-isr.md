# Homepage ISR Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the Notion-backed homepage through Vercel ISR every ten minutes without removing the repository JSON fallback.

**Architecture:** Keep `src/pages/index.tsx` as a Pages Router static page. Put the environment gating and interval in a small tested utility, then return the interval from `getStaticProps` only when live Notion loading is enabled.

**Tech Stack:** Next.js 13 Pages Router, TypeScript, Node.js built-in test runner, Vercel ISR.

## Global Constraints

- Homepage must remain Pages Router SSG and return document HTML.
- Live Notion remains opt-in through `HOMEPAGE_POSTS_SOURCE=notion`.
- The generated JSON feed remains the fallback for failed Notion reads.
- Revalidation interval is 600 seconds.
- No new dependencies.

---

### Task 1: Isolate and test homepage revalidation policy

**Files:**
- Create: `tests/homepageRevalidation.test.js`
- Create: `src/libs/utils/homepageRevalidation.js`

**Interfaces:**
- Produces: `shouldFetchFreshHomepagePosts(environment)` and `getHomepageRevalidateSeconds(environment)`.
- Consumes: An environment-like object with `HOMEPAGE_POSTS_SOURCE` and `FORCE_HOMEPAGE_POSTS_CACHE` string properties.

- [x] **Step 1: Write the failing test**

```js
assert.equal(
  getHomepageRevalidateSeconds({ HOMEPAGE_POSTS_SOURCE: "notion" }),
  600
)
assert.equal(getHomepageRevalidateSeconds({}), false)
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/homepageRevalidation.test.js`
Expected: FAIL because `homepageRevalidation` does not exist.

- [x] **Step 3: Write minimal implementation**

```js
const HOMEPAGE_REVALIDATE_SECONDS = 600

function shouldFetchFreshHomepagePosts(environment = process.env) {
  return environment.HOMEPAGE_POSTS_SOURCE === "notion" &&
    environment.FORCE_HOMEPAGE_POSTS_CACHE !== "true"
}

function getHomepageRevalidateSeconds(environment = process.env) {
  return shouldFetchFreshHomepagePosts(environment)
    ? HOMEPAGE_REVALIDATE_SECONDS
    : false
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/homepageRevalidation.test.js`
Expected: PASS.

### Task 2: Enable conditional homepage ISR

**Files:**
- Modify: `src/pages/index.tsx`
- Test: `tests/homepageRevalidation.test.js`

**Interfaces:**
- Consumes: `shouldFetchFreshHomepagePosts(process.env)` and `getHomepageRevalidateSeconds(process.env)`.
- Produces: A Pages Router `getStaticProps` result with `revalidate: 600` only for the explicit live-Notion mode.

- [x] **Step 1: Import the policy functions**

```ts
import {
  getHomepageRevalidateSeconds,
  shouldFetchFreshHomepagePosts,
} from "src/libs/utils/homepageRevalidation"
```

- [x] **Step 2: Replace the local environment check**

```ts
if (!shouldFetchFreshHomepagePosts()) {
  return withTitleSlugs(cachedFeedPosts as TPosts)
}
```

- [x] **Step 3: Return the conditional revalidation interval**

```ts
return {
  props: { dehydratedState: dehydrate(serverQueryClient) },
  revalidate: getHomepageRevalidateSeconds(),
}
```

- [x] **Step 4: Run focused and project verification**

Run: `node --test tests/homepageRevalidation.test.js tests/filterPosts.test.js tests/slug.test.js tests/giscus.test.js`
Expected: PASS.

Run: `npx tsc --noEmit --incremental false && yarn lint && FORCE_HOMEPAGE_POSTS_CACHE=true yarn build`
Expected: exit code 0, with only the known lint warnings.

### Task 3: Validate production behavior

**Files:**
- No source changes.

- [ ] **Step 1: Configure Vercel Production**

Set `HOMEPAGE_POSTS_SOURCE=notion` in Vercel Project Settings -> Environment Variables for Production, then redeploy from the committed revision.

- [ ] **Step 2: Verify canonical homepage output**

Run: `curl -sS -D /tmp/today.headers https://www.jaehyuns.com/ -o /tmp/today.body`
Expected: HTTP 200 and `/tmp/today.body` starts with `<!DOCTYPE html>`.

- [x] **Step 3: Verify ISR response metadata after deployment**

Run: `curl -sSI https://www.jaehyuns.com/`
Expected: a normal Vercel cache response; no multipart boundary is present in the body check from Step 2.
