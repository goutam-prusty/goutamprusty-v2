# V1-to-V2 Redirect Audit

**Status:** Approved T3 redirects implemented; unapproved V1 redirects withheld for owner review (Master Plan T15).  
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
  - Changed/removed paths: `/blog`, `/blog/[slug]`, `/blog/tag/[tag]`, `/now`, `/resume`, `/uses`, `/projects/inkline`, `/projects/vitaliq`, `/projects/wharf`

## 2. Approved Redirects Implemented

| Source | Destination | Status / Mechanism | Authority |
|---|---|---|---|
| `/elsewhere`, `/elsewhere/` | `/contact/` | `301` in `public/_redirects` + `src/pages/elsewhere.astro` | Master Plan C4, T3 (`0f84c48`) |
| `/now/` | `/404` | `Astro.redirect('/404')` in `src/pages/now.astro` | Master Plan T2/T3 (`0f84c48`) |
| `/search/` | `/404` | `Astro.redirect('/404')` in `src/pages/search.astro` | Master Plan T3 (`0f84c48`) |
| `/collections/` | `/404` | `Astro.redirect('/404')` in `src/pages/collections/index.astro` | Master Plan T3 (`0f84c48`) |

## 3. Withheld Mappings (Awaiting Explicit Owner Approval per Master Plan T15)

| Proposed Source | Proposed Destination | Reason Withheld |
|---|---|---|
| `/blog`, `/blog/` | `/writing/` | Marked `PROPOSED, NOT APPROVED` in `PROJECT_HANDOVER.md` §5 |
| `/blog/:slug`, `/blog/:slug/` | `/writing/:slug/` | Requires owner approval of T15 redirect list before building |
| `/blog/tag/:tag` | `/writing/` or `/topics/` | No approved V2 tag/topic destination |
| `/uses` | `/about/` or `410`/`404` | V1-only route; no approved V2 destination |
| `/resume` | `/resume` (deferred) or `/about/` | Public Resume deferred to final release milestone |
| `/projects/inkline`, `/projects/vitaliq`, `/projects/wharf` | `/projects/` or `404` | V1 project slugs held pending provenance/publication |
