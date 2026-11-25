# V1-to-V2 Redirect Audit & Owner Decision Table

**Status:** Approved T3 and legacy `/blog` redirects implemented in `public/_redirects` (exact-path rules only); withheld V1 routes remain `404`.
**V1 Rollback Path:** Preserved (`D:\goutamprusty-v1` read-only at commit `71ef2c7`; `main` branch untouched).

## 1. Route Inventory Examined

- **V2 Canonical Routes (49 sitemap URLs + listing/utility):**
  - Core: `/`, `/projects/`, `/research/`, `/writing/`, `/about/`, `/contact/`
  - Projects: `/projects/ai-engineer-command-center/` (`PRJ-004`, published in `development`)
  - Research (21): `/research/<slug>/` (`RES-001`–`RES-016`, `RES-018`–`RES-022`; `RES-017` is an intentional gap)
  - Writing (21): `/writing/<slug>/` (`BLG-001`–`BLG-009`, `BLG-011`–`BLG-022`; `BLG-010` is an intentional gap)
  - Hidden/noindex: `/topics/` (empty placeholder), `/404`, `/design-exploration/paper-signal/*` (prototype)
- **V1 Routes (`D:\goutamprusty-v1\src\app\(site)\`, read-only):**
  - Preserved paths: `/`, `/about`, `/contact`, `/research`, `/research/[slug]`, `/projects`
  - Changed/removed paths: `/blog`, `/blog/[slug]`, `/blog/tag/[tag]`, `/now`, `/resume`, `/uses`, `/projects/inkline`, `/projects/vitaliq`, `/projects/wharf`, `/projects/sample-project`

## 2. Implemented and Approved Redirects

| Legacy / V2 Source | Destination | Status / Mechanism | Authority |
|---|---|---|---|
| `/elsewhere`, `/elsewhere/` | `/contact/` | `301` in `public/_redirects` + `src/pages/elsewhere.astro` | Master Plan C4, T3 (`0f84c48`) |
| `/now/` | `/404` | `Astro.redirect('/404')` in `src/pages/now.astro` | Master Plan T2/T3 (`0f84c48`) |
| `/search/` | `/404` | `Astro.redirect('/404')` in `src/pages/search.astro` | Master Plan T3 (`0f84c48`) |
| `/collections/` | `/404` | `Astro.redirect('/404')` in `src/pages/collections/index.astro` | Master Plan T3 (`0f84c48`) |
| `/blog`, `/blog/` | `/writing/` | `301` in `public/_redirects` | REDIRECT-003 (Master Plan T15 delegated approval) |
| `/blog/<slug>`, `/blog/<slug>/` (21 verified slugs) | `/writing/<slug>/` | `301` exact-path rules in `public/_redirects` (42 rules) | REDIRECT-003 (verified 21/21 against `dist/writing/<slug>/`) |

### Verified 21-Slug Blog Coverage (Matched 1:1)

`agentic-inflection-point`, `ai-physical-limits`, `baliyatra-arithmetic-disappearing-craft`, `billionaire-raj-india-inequality-costs`, `bitcoin-didnt-change-the-world-caught-up`, `i-used-ai-to-find-the-ceiling`, `india-is-borrowing-chinas-playbook`, `machine-native-economy-explained`, `money-is-a-story`, `six-months-twelve-domains-one-uncomfortable-conclusion`, `structure-not-conspiracy`, `the-asset-trap`, `the-billionaire-raj`, `the-jobs-that-arent-jobs`, `the-question-that-explains-everything-about-modern-economies`, `trust-as-infrastructure-india-social-capital`, `wasted-months-before-figuring-out-what-i-was-building`, `what-i-actually-think-about-indias-next-decade`, `why-compute-isnt-a-commodity-yet`, `why-your-central-bank-wants-some-inflation`, `wordpress-theme-read-by-machines`.

### Unmatched Legacy Blog Source (Not Redirected)

- `/blog/sample-blog-post` (`D:\goutamprusty-v1\content\blog\sample-blog-post.mdx`, `status: "draft"`): Not migrated to V2 (`dist/writing/sample-blog-post/` absent); remains `404`.

## 3. Withheld Routes Remaining Unavailable (`404`)

| Legacy Source | Current V2 Behavior | Evidence / Rationale | Wrong-Content Risk | Decision Status |
|---|---|---|---|---|
| `/blog/tag/:tag` | Returns `404` | No V2 tag archive routes; `/topics/` is an empty `noindex` placeholder | Medium — avoided by omitting wildcards | **Withheld (`404`)** |
| `/uses`, `/uses/` | Returns `404` | V1 workflow/tools page has no V2 equivalent | Medium — `/about/` omits V1 tools list | **Withheld (`404`)** |
| `/projects/inkline`, `/projects/vitaliq`, `/projects/wharf` | Return `404` | Held pending provenance confirmation or excluded | High — avoids caching wrong `301` to Command Center | **Withheld (`404`)** |
| `/projects/sample-project` | Returns `404` | V1 fixture removed in T3 (`0f84c48`) | High if redirected to real projects | **Withheld (`404`)** |
| `/resume`, `/resume/` | Returns `404` | Deferred until final content/release milestone | Low while deferred | **Deferred (`404`)** |
