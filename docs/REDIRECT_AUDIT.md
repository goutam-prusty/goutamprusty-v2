# V1-to-V2 Redirect Audit & Owner Decision Table

**Status:** Approved T3 redirects implemented; unapproved V1 redirects withheld for owner decision (Master Plan T15).
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

## 2. Already Implemented and Approved Redirects

| Legacy / V2 Source | Destination | Status / Mechanism | Authority |
|---|---|---|---|
| `/elsewhere`, `/elsewhere/` | `/contact/` | `301` in `public/_redirects` + `src/pages/elsewhere.astro` | Master Plan C4, T3 (`0f84c48`) |
| `/now/` | `/404` | `Astro.redirect('/404')` in `src/pages/now.astro` | Master Plan T2/T3 (`0f84c48`) |
| `/search/` | `/404` | `Astro.redirect('/404')` in `src/pages/search.astro` | Master Plan T3 (`0f84c48`) |
| `/collections/` | `/404` | `Astro.redirect('/404')` in `src/pages/collections/index.astro` | Master Plan T3 (`0f84c48`) |

## 3. Proposed Mappings Awaiting Owner Approval

| Legacy Source | Proposed Destination | Dest Exists & Appropriate? | Evidence / Rationale | Wrong-Content Risk | Required Owner Decision |
|---|---|---|---|---|---|
| `/blog`, `/blog/` | `/writing/` (`301`) | Yes (`/writing/` lists all 21 migrated posts) | Master Plan T15; `PROJECT_HANDOVER.md` §5 (`PROPOSED, NOT APPROVED`) | Low — direct 1:1 replacement for V1 blog index | **Approve** or **Reject** |
| `/blog/:slug` (21 published V1 slugs) | `/writing/:slug/` (`301`) | Yes (1:1 parity for all 21 migrated slugs; `sample-blog-post` was V1 draft and excluded) | `D:\goutamprusty-v1\content\blog\*.mdx` matches V2 `/writing/<slug>/` 1:1 (`BLG-001`–`BLG-009`, `BLG-011`–`BLG-022`) | Low if scoped to the 21 migrated slugs (avoid catching `/blog/tag/*` or `/blog/sample-blog-post`) | **Approve** (21 migrated slugs) or **Reject** |

## 4. Mappings Requiring Clarification (`CLARIFICATION REQUIRED`)

| Legacy Source | Candidate Destination | Dest Exists & Appropriate? | Evidence / Rationale | Wrong-Content Risk | Required Owner Decision |
|---|---|---|---|---|---|
| `/blog/tag/:tag` | `CLARIFICATION REQUIRED` (`/writing/` vs `404`/`410`) | `/writing/` exists (unfiltered); `/topics/` is an empty `noindex` placeholder; no V2 tag pages exist | V1 `blog/tag/[tag]/page.tsx` filtered posts by tag; V2 has no tag archive routes yet | Medium — `/topics/` is an empty placeholder; `/writing/` drops tag filter | **Clarify** (`/writing/` vs `404`/`410`) |
| `/uses`, `/uses/` | `CLARIFICATION REQUIRED` (`/about/` vs `404`/`410`) | `/about/` exists, but does not contain V1's tools/hardware/editor list (`Next.js`, `Cursor`, `Ghostty`, etc.) | V1 `uses/page.tsx` is a standalone workflow/tools page with no V2 equivalent | Medium — `/about/` covers background, education, and training, not tools | **Clarify** (`/about/` vs `404`/`410`) |
| `/projects/inkline`, `/projects/vitaliq`, `/projects/wharf` | `CLARIFICATION REQUIRED` (`404` while held vs `302` to `/projects/`) | `/projects/` exists (`PRJ-004` only in `development`); held slugs have no V2 pages | `PROJECT_HANDOVER_v6.md` §6.7: Inkline/Vitaliq provenance unconfirmed; Wharf excluded | High — `301` to `/projects/` caches permanently and sends visitors to Command Center instead | **Clarify** (leave `404` while held vs temporary `302`) |
| `/projects/sample-project` | `404` (fixture removed in T3) | No — fixture deliberately removed in T3 (`0f84c48`) | V1 `sample-project.mdx` was a UI validation fixture, excluded from V2 | High if redirected to real projects | **Approve** `404` (or **Reject**) |

## 5. Explicitly Deferred Mappings

| Legacy Source | Current V2 Behavior | Evidence / Rationale | Wrong-Content Risk | Required Owner Decision |
|---|---|---|---|---|
| `/resume`, `/resume/` | Returns `404` (no V2 route or public PDF yet) | Owner deferred public Resume page and `docs/drafts/resume-draft.pdf` release to final release milestone (`CONTACT-001`) | Low while deferred; avoid premature `301` before final `/resume` URL is chosen | **Confirm** deferred (`404` until final release) or **Clarify** |
