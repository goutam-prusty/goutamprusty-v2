# goutamprusty.com V2: Project Handover (v5)

**Prepared:** Monday 23 November 2026, midday
**Supersedes:** v1–v4. **Do not attach older handovers.** This file is self-contained.
**Covers:** the fifth working session (22 Nov 22:50 → 23 Nov 12:10).
**Execution tool:** **Google Antigravity IDE with Gemini 3.8 Flash** (Low / Medium / High effort). ChatGPT writes the prompts; the owner pastes them into Antigravity.

### Evidence labels

| Label | Meaning |
|---|---|
| **[U]** | Shown by the owner directly (pasted Cloudflare build logs, screenshots, explicit statements) |
| **[R]** | Reported by the Antigravity agent. Not independently seen |
| **[A]** | Claimed by ChatGPT. Unverified unless also [U] or [R] |
| **[I]** | Inferred by the author of this handover from the evidence. Check before relying on it |

---

## 1. How to use this document in a new ChatGPT chat

**Files to attach**

| File | Need | Why |
|---|---|---|
| `PROJECT_HANDOVER_v5.md` | **Required** | State, rules, next step |
| `WEBSITE_THEME_AND_UI_UX_DESIGN_SYSTEM.md` | **Strongly recommended** | The next work is real page content, copy and UI polish, and the design values live there |
| `WEBSITE_BUILD_SPEC_FOR_CODEX.md` | **Recommended** | The remaining phases (SEO, redirects, accessibility, search, launch) are defined there |
| `context-pack.txt` (Appendix A, **regenerate now**) | **Strongly recommended** | Real paths and git state, so ChatGPT does not invent files, routes or slugs |

**Paste as needed (not as attachments):** the newest Antigravity report and any Cloudflare build log.

**Do not attach:** v1–v4 handovers, `Content_Inventory.xlsx` (private data), `.env`, any token, the Sanity CLI config file, old ChatGPT exports, or screenshots (unless you want a visual review). The Antigravity audit file `visual_consistency_architecture_audit.md` is **not needed**; its findings are in section 7.

**First message to send:** *"Read the handover. Follow section 2 exactly. Check section 11 for what I must answer, ask me at most one question, and then give me the next Antigravity prompt. No plan, no menu of options, no audit first."*

---

## 2. Instructions for ChatGPT: how to write Antigravity prompts

**Read this before every answer.** The aim is to finish the site in as few round trips as possible without losing safety.

### 2.1 The tool

- **Gemini 3.8 Flash in Antigravity** runs on the owner's Windows 11 machine with **PowerShell 5.1**.
  - It has network access and a browser subagent.
  - It **cannot sign in to the Cloudflare dashboard.** Never ask it to inspect Cloudflare settings. Ask the owner to paste the build log.
  - It creates scratch scripts, polls long commands, sometimes loses its API connection (just retry), and **sometimes asserts things it did not verify.**
  - **Its browser-subagent QA reports can contain invented detail** (see section 8, item 1). Trust HTTP codes and build logs over its prose.
- PowerShell syntax only: no `&&`; set variables with `$env:NAME='value'; command; Remove-Item Env:NAME`.
- Never mention Codex, GPT model names or "Work mode." Do not offer to hand off work to other tools. Your job is to write the next prompt.

### 2.2 Effort level: always state it with a one-line reason

| Effort | Use for |
|---|---|
| **Low** | Git with an explicit file list, running checks, browser-only QA, simple text or CSS edits, docs |
| **Medium (default)** | Page builds and restyles, migration batches, small refactors, SEO plumbing |
| **High** | First-time integrations, schema or data-model changes, security-sensitive changes, debugging that failed at Medium |

If a task fails at one level, re-run it one level up. Do not add a separate diagnose prompt first.

### 2.3 Prompt rules (anti-circling)

1. **One prompt = one milestone that ends in a pushed commit.** It includes build, verify, commit and push.
2. **No audit prompt after an implementation prompt.** Verification belongs inside the implementation prompt.
3. **No "inspect and plan, then wait" prompts** for reversible work on a feature branch.
4. **Standing authorizations beat per-step approvals** (section 2.5).
5. **Do not restate standing rules** in every prompt. They live in `AGENTS.md`. Aim for 60 lines or fewer.
6. **Outcomes, not keystrokes.** Exact commands only for git staging, verification and destructive operations.
7. **Merge related fixes** into one prompt. Put "reconcile X against Y" inside the next implementation prompt.
8. **No polish prompts.** Typing, naming and duplication go into the next prompt that touches the file.
9. **Never leave a bracketed authorization placeholder in a prompt** (for example "[Proceed only after owner approval]"). On 22 Nov the agent treated it as approval and performed a remote import. Either the owner has approved, and the prompt states it plainly, or the prompt has no write step.

### 2.4 No hallucinated prompts

- **Never state a path, route, slug, ID, count, version, package or code detail** that is not in this handover, the context pack, a build log or the latest agent report. If unknown, write "locate X".
  - Use the slug table in section 6.3. Never invent slugs.
- **Reconcile numbers across reports.** Examples of mismatches found so far: a test total that did not equal the sum of its suites (351 vs 341), and "18 research / 20 writing" where the build log shows 21 / 21.
- **Never present an agent claim as verified.** Write "agent-reported." Where a person can check cheaply (a page on a phone, Sanity Studio), ask the owner to look.
- **Read-backs must test what matters.** An import read-back once reported `derivedPosts` as "-> 5 writing posts" when they were raw strings that dereferenced to `null` (section 8, item 2). Ask for the actual dereferenced result (for example a GROQ count of non-null `derivedPosts[]->`).
- **Secrets:** never ask for, display or accept a token. If the owner pastes one, say so in the first line and tell them to revoke and replace it.
- Never invent facts about the owner (title, experience, clients, metrics).

### 2.5 Standing policy (owner-confirmed practice; the owner can edit)

**Pre-authorized, no separate approval:**
- stage exact paths, commit and push to the named feature branch **after checks pass**
- read-only Sanity queries
- deleting the agent's own untracked scratch files

**Ask the owner for, in one up-front question per release:**
- any Sanity write (name the IDs, the dataset and the exact change). One approval can cover a named set, with stop-on-failure.
- adding or upgrading a dependency
- deleting a tracked file (unless the owner has delegated the decision, as in the legacy cleanup)
- anything on `main`, merges, deployments, DNS or domains
- changing content text, or any decision recorded in this handover

### 2.6 Verification rules

- Use **`git diff --cached --check` after staging.** Plain `git diff --check` ignores staged and untracked files.
- Every build prompt runs `npm run check`, `npm run build`, and the **live-only build** when Sanity data is involved.
- Run long commands **synchronously, to completion,** and do not narrate waiting.
- A listed HTTP error does not prove its cause. Ask for evidence.

### 2.7 Deployment rules

- **Cloudflare builds read Sanity at build time.** A build that ran before an import will not contain the new documents. After any import, deploy the **latest commit**.
- **"Retry deployment" re-runs the same old commit.** Check the log's `HEAD is now at <hash>` and `N page(s) built`.
- **Page counts:** a normal local build includes two fixture routes (`/research/sample-report/`, `/writing/sample-article/`), so it makes **65** pages. Cloudflare builds with `SANITY_REQUIRE_LIVE=true`, which excludes them, so it makes **63** (42 documents + 21 other routes). This difference is expected. Do not spend a prompt on it again.
- When a deployment surprises you, **ask the owner for the build log first.**
- Prefer a **Cloudflare deploy hook** (owner creates once, stores the URL in the local `.env`, never in git). It is still not created, so each deployment is a manual dashboard action.

### 2.8 Prompt template

```
# TASK: <one line>
Effort: Low | Medium | High (<why>)
Branch: codex/sanity-content-architecture (expected HEAD <hash>; verify)
Context: read AGENTS.md and the handover; standing rules apply.
Owner authorization: <explicit, or "none: no Sanity writes">
Goal: <1–3 sentences, user-visible outcome>
Do: 1. <outcome> 2. <outcome> ...
Task-specific limits: <only what is unique here>
Verify: <commands> and <what must be true>
Git: stage exact paths, `git diff --cached --check`, commit "<msg>", push.
Report (max 40 lines): changed files, exit codes, defects, anything NOT verified,
  numbers that differ between steps, decisions needed from me.
```

### 2.9 How to answer a pasted report

1. A 3–6 line verdict that separates agent-reported from verified.
2. Contradictions or suspicious numbers.
3. The next prompt. Do not retell the report, and do not end with a menu.
4. If an owner decision is needed, ask one question and still give the prompt that does not depend on it.

---

## 3. Assessment: forward, circling, or wrong direction?

**Forward, and more efficient than previous sessions. The site is functionally and visually consolidated. What is left is mostly owner content decisions and launch plumbing, not engineering.**

**Forward (evidence in sections 6 and 7):**
- **All 42 documents are in Sanity `development`, and live on the Cloudflare site** (63 pages built) [U/R].
- **Every production route now uses one layout and one stylesheet** (Paper & Signal). The 13 legacy files are gone. The old Phase 2 look no longer exists on any page [R].
- The reusable, safe importer, the path-normalization rule and the citation fix are all committed.

**Circling (my estimate):**
- Roughly 25 prompts in this session. About 6 were avoidable:
  - a 63-vs-65 page-count investigation that was already explained by the build config
  - a "final verification" re-run that existed only because of one dropped API connection
  - a separate "final checkpoint review" after a full validation had already been reported
  - several reports that needed the owner to paste the same Cloudflare log by hand
- The efficient parts: Release 5, the HOLD import and the three-phase visual migration were each **one prompt → one report → one commit.**

**Honest remaining risk:** every visible page still contains **development placeholder copy** (About, Contact, Topics, Projects, Now, Elsewhere, Collections, Search), and notices such as "Development fixture — placeholder content" show on the live site. The code is ready for real content. The owner's decisions and copy are now the long pole.

**How much is left (rough, mine; not measured):** content migration is done (42/42). Page content, topics, search, SEO, redirects, release plumbing and the domain cut-over remain. Expect **10–18 agent prompts** after the owner supplies the decisions in section 11.

---

## 4. The project in one page

**Goal.** Rebuild `goutamprusty.com` (same domain) as a calm, light, personality-led site. It is a research and writing library plus a portfolio, and the homepage should make a recruiter curious. It must be honest: no invented title, experience or outcomes. The owner is a **BBA** graduate. Old project case studies are **not published as written.**

**Stack.** Astro 7 + TypeScript (strict) + Tailwind v4, static output. **Sanity** is the content home (project **`l94q5yx8`**, lowercase L, private dataset **`development`**, empty `production`). **Cloudflare Pages** hosts it at `goutamprusty-v2.pages.dev`. Node 24.22.3. Windows 11 / PowerShell 5.1. Repo `goutam-prusty/goutamprusty-v2` (private) at `D:\goutamprusty-v2`. No Supabase, no database, no backend.

**Design.** "Paper & Signal": paper `#F7F4EC`, ink `#17191A`, pastel peach / blue / sage, lime `#D3F03C` sparingly, serif display, system sans, mono labels, geometric motif, light only. Full detail is in `WEBSITE_THEME_AND_UI_UX_DESIGN_SYSTEM.md`.

**Content.** All 21 Research + 21 Writing are in Sanity `development`, text unedited (owner-approved exceptions in section 5). Excluded: Medium and LinkedIn items, samples, drafts.

**State.** Branch `codex/sanity-content-architecture`, HEAD **`ad8779b`**, pushed, clean [R]. Deployed and live at `goutamprusty-v2.pages.dev` (Cloudflare log [U]).

**Next.** Fix the `derivedPosts` links on two research reports, re-verify the Batch 4 images on the live site, then replace placeholder pages with real copy, then SEO, redirects, search, and launch.

---

## 5. Standing decisions (unchanged unless noted)

| Decision | Status |
|---|---|
| Rebuild from scratch. V1 (`D:\goutamprusty-v1`, commit `71ef2c7`) is **read-only** | CONFIRMED |
| Astro + TypeScript + Tailwind v4 + Sanity + Cloudflare Pages + GitHub. `@sanity/client` with a standalone Studio | CONFIRMED |
| Light theme only. Paper & Signal. One layout (`ProductionPaperSignalLayout`) and one stylesheet (`paper-signal.css`) for production | CONFIRMED |
| All 21 + 21 documents in scope. Text never edited. `featured` is a separate field, default false | CONFIRMED |
| IDs from the private workbook. `RES-017` and `BLG-010` are intentional gaps | CONFIRMED |
| Medium, LinkedIn, samples and drafts excluded. Projects held | CONFIRMED |
| Work only in the `development` dataset. Never write to `production` without a new explicit decision | CONFIRMED |
| Read access in builds uses `SANITY_API_READ_TOKEN` (Viewer role, Cloudflare encrypted secret, never `PUBLIC_`) | CONFIRMED |
| **Legacy URL fix:** `https://beige-chamois-455581.hostingersite.com/research` → `https://goutamprusty.com/research` (applied to the `href` in `writing-BLG-022`) | CONFIRMED |
| **Image-path normalization (owner "yes", 22 Nov):** 12 route-relative image paths (no leading `/`) across `BLG-012/013/014/015/021` become root-relative, and the 2 broken `BLG-014` paths map to the files that exist under `/images/blog/the-billionaire-raj/`. Source MDX untouched; the corrected paths are what Sanity stores | CONFIRMED |
| **Collections:** hidden from navigation, routes kept. The agent's audit found it was already absent from the nav. The owner delegated the decision | CONFIRMED |
| **Legacy cleanup (owner delegated):** 3 layouts, 9 components and `global.css` deleted. Kept: `PortableText.astro`, `VisualFigure.astro`, `PaperSignalLayout.astro` and the 4 prototype routes | CONFIRMED |
| Redirects such as `/blog` → `/writing` | PROPOSED, NOT APPROVED |
| Hero headline "Curiosity, made useful." and all agent-written copy | NOT APPROVED by the owner |
| BLG-022 visible link text (still shows the old domain) | UNRESOLVED (Q2) |
| Domain cut-over, production dataset strategy, AI-disclosure wording, topic taxonomy, Projects in the nav, search implementation | UNRESOLVED |

---

## 6. Current state

### 6.1 Repository (HEAD `ad8779b`, pushed, clean) [R]

Commits this session (all on `codex/sanity-content-architecture`):

| Hash | What |
|---|---|
| `0eb42f2` | Release 5: citation-anchor fix (`PortableText.astro`, `citationMarker.ts`), reusable importer `migration/import-batch.cjs`, Batch 5 assets and manifest (12 files) |
| `9b862dc` | Path normalization (`migration/lib/path-normalizer.cjs`, `src/lib/pathNormalizer.ts`), HOLD asset manifest, HOLD-batch ingestion changes |
| `238ff41` | fix(presentation): null-safe cross-references in research and writing templates; regression test |
| `ad8779b` | refactor(site): consolidate Paper & Signal architecture (25 files: 12 pages moved to the production layout, 13 legacy files deleted) |

Earlier session commits `fef57e7` … `bc88fbd` are described in v4. **Cloudflare note:** `main` is still `d5210a0`. Earlier feature branches are unchanged.

`package.json` scripts: `dev`, `check`, `build`, `preview`, `test:auth`. No dependencies were added this session. Last reported tests: **349 migration assertions across 9 suites + 13 auth** (the migration count includes the auth suite).

### 6.2 Sanity `development`: 42 documents (21 Research + 21 Writing); `production`: 0 [R]

| Release | Documents | Transaction |
|---|---|---|
| Release 5 | `RES-003`, `RES-007`, `RES-008`, `RES-009`, `RES-016`, `BLG-009`, `BLG-018`, `BLG-019` | `s3IrDu2QxGBUO0yG1J91MP` |
| HOLD import | `BLG-012`, `BLG-013`, `BLG-014`, `BLG-015`, `BLG-021`, `RES-014`, `RES-015` | `T2LMLuHMQrooqvjrfuyGrT` |

Earlier transactions are in v4's ledger (the totals before this session were 27 documents).

- Document IDs are `research-RES-NNN` and `writing-BLG-NNN`. Imports are one atomic `createIfNotExists` transaction per release, never `--replace`.
- **`migration/import-batch.cjs`** [R]: dry-run by default, explicit ID list, `--write` required, development dataset only, refuses existing IDs, never prints tokens. **Its allowed-ID list was edited to the seven HOLD IDs** for that release, so a new release must update the list deliberately.
- `author`, `topic` and `project` schemas exist, but **no documents of those types have been created.**

### 6.3 Slugs (all 42; routes are `/research/<slug>/` and `/writing/<slug>/`)

**Research**
`RES-001` empirical-evaluation-of-indias-economic-structure · `RES-002` empirical-evaluation-of-indias-healthcare-system · `RES-003` environmental-sustainability-and-environmental-economic-outcomes-in-india-an-empirical-synthesis · `RES-004` indias-digital-governance-ecosystem-evaluation · `RES-005` indias-education-system-an-empirical-evaluation · `RES-006` institutional-analysis-of-indias-governance-architecture · `RES-007` institutional-analysis-of-indias-information-ecosystem · `RES-008` institutional-analysis-of-indias-public-administration-and-state-capacity · `RES-009` judicial-effectiveness-accessibility-and-economic-impact-in-india-an-institutional-analysis · `RES-010` mapping-the-current-state-of-ai-and-frontier-technologies-2015-2026 · `RES-011` multidimensional-empirical-evaluation-of-indias-infrastructure-systems · `RES-012` multidimensional-empirical-evaluation-of-inequality-and-social-mobility-in-india · `RES-013` multidimensional-empirical-evaluation-of-social-trust-civic-norms-cooperative-behavior-and-institutional-confidence-in-india · `RES-014` political-economy-macroeconomic-outcomes-india-global-markets · `RES-015` political-economy-of-work-wealth-debt-and-power-in-india-since-1991 · `RES-016` real-utility-vs-socially-agreed-value-in-modern-economies · `RES-018` strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026 · `RES-019` system-architecture-and-reverse-engineering-specification-modern-resume-builder-platform · `RES-020` the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity · `RES-021` the-convergence-divergence-paradox-a-structural-analysis-of-the-indian-and-chinese-political-economic-systems-2000-2025 · `RES-022` the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset

**Writing**
`BLG-001` agentic-inflection-point · `BLG-002` ai-physical-limits · `BLG-003` baliyatra-arithmetic-disappearing-craft · `BLG-004` billionaire-raj-india-inequality-costs · `BLG-005` bitcoin-didnt-change-the-world-caught-up · `BLG-006` i-used-ai-to-find-the-ceiling · `BLG-007` india-is-borrowing-chinas-playbook · `BLG-008` machine-native-economy-explained · `BLG-009` money-is-a-story · `BLG-011` six-months-twelve-domains-one-uncomfortable-conclusion · `BLG-012` structure-not-conspiracy · `BLG-013` the-asset-trap · `BLG-014` the-billionaire-raj · `BLG-015` the-jobs-that-arent-jobs · `BLG-016` the-question-that-explains-everything-about-modern-economies · `BLG-017` trust-as-infrastructure-india-social-capital · `BLG-018` wasted-months-before-figuring-out-what-i-was-building · `BLG-019` what-i-actually-think-about-indias-next-decade · `BLG-020` why-compute-isnt-a-commodity-yet · `BLG-021` why-your-central-bank-wants-some-inflation · `BLG-022` wordpress-theme-read-by-machines

(All 21 + 21 appear in the Cloudflare build log for `ad8779b` [U].)

### 6.4 Cloudflare Pages

- Project `goutamprusty-v2`. URL `https://goutamprusty-v2.pages.dev/`. Preset Astro, `npm run build`, output `dist`, Node 24.22.3 [U].
- Environment variables (build time): `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET=development`, `SANITY_API_READ_TOKEN` (encrypted), `SANITY_REQUIRE_LIVE=true`.
- Latest deployment [U, log]: **`ad8779b`, 63 pages built, success.**
- **The branch chosen at project creation was `codex/sanity-content-architecture`**, and branch-preview aliases return 404, so that branch is probably the Cloudflare **production branch** [I]. Pushes to it trigger builds.
- Sanity writes after a push are not included in that push's build. Deploy after any import.
- **No custom domain, no deploy hook, no Sanity webhook.** `goutamprusty.com` is still V1.
- Build logs warn that Node 24.22.3 is in LTS maintenance mode. This is low priority.

### 6.5 Routes and layouts (65 pages locally, 63 on Cloudflare)

| Group | Routes | Layout | Content status |
|---|---|---|---|
| Real content | `/`, `/research/`, `/research/<slug>/` ×21, `/writing/`, `/writing/<slug>/` ×21 | `ProductionPaperSignalLayout` | Real (homepage copy unreviewed by the owner) |
| Pages moved to the production layout | `/about/`, `/contact/`, `/now/`, `/elsewhere/`, `/search/`, `/topics/`, `/projects/`, `/404.html` | `ProductionPaperSignalLayout` | **Development placeholder copy** |
| Fixture detail routes | `/topics/sample-topic/` (+`-two`, `-three`), `/projects/sample-project/`, `/collections/`, `/collections/sample-series/` | `ProductionPaperSignalLayout` | **Fixtures** (`src/data/fixtures.ts`) |
| Prototype | `/design-exploration/paper-signal/` ×4 | `PaperSignalLayout` | Kept for experiments; **remove or noindex before launch** |
| Local-only | `/research/sample-report/`, `/writing/sample-article/` | n/a | Fixture routes, excluded on Cloudflare |

- **Search** is a deliberately disabled preview (input and button `disabled`).
- **Collections** is not in the header or the mobile menu.
- **Header:** `g.` wordmark, Research, Writing, Topics, Projects, About, and a lime "Get in touch ↗" to `/contact/`.

### 6.6 What the placeholders currently say (so ChatGPT does not guess)

About: "Development placeholder. Replace with author-approved, verified copy." Contact: "Contact destination pending confirmation. No address is published in this preview." Elsewhere: external URLs will be listed only after verification. Topics, Projects and Collections list sample entries ("Sample project", "Sample series", three sample topics). A "Development fixture — placeholder content" notice appears on several pages.

### 6.7 Key files

`src/lib/sanityClient.ts` (queries, auth, live mode) · `src/lib/readingTime.ts` · `src/lib/pathNormalizer.ts` · `src/components/PortableText.astro` · `src/layouts/ProductionPaperSignalLayout.astro` · `src/styles/paper-signal.css` · `src/sanity/schemaTypes/` · `sanity.config.ts`, `sanity.cli.ts` · `migration/import-batch.cjs`, `migration/lib/`, `migration/tests/`, `migration/BATCH_*_ASSET_MANIFEST.md` · `.env.example`. **Auth order:** `SANITY_API_READ_TOKEN` → `SANITY_READ_TOKEN` → `SANITY_API_TOKEN` → `SANITY_AUTH_TOKEN` → local CLI file (disabled when `CF_PAGES=1` or `CI=true`). `PUBLIC_` token variables are rejected.

---

## 7. Work completed this session (ledger)

| Step | Outcome |
|---|---|
| Batch 4 live QA | Found 404s on **all Batch 4 cover and body images** [R]. Cause: the retry rebuilt `1a1754c`, so the Batch 4 assets (in `bc88fbd`) were missing. Later deployments include them |
| Release 5 | Done (`0eb42f2`): citation anchors fixed (RES-010 now has working `#cite-1`…`#cite-59` [R]); importer committed; Batch 5 imported |
| Batch 5 live QA | 8 routes OK, listings 19 research / 16 writing, no 404s [R] |
| HOLD decision and import | Done (`9b862dc`) |
| First deployment of the HOLD import | **Failed.** `TypeError … reading 'slug'` at RES-014 [U, log] |
| Null-reference fix | Done (`238ff41`). Cloudflare rebuilt 63 pages OK [U, log] |
| HOLD live QA | 7 routes OK, listings 21 + 21 [R]. The "Derived Writing" section is **absent** on RES-014/015 (section 8, item 2) |
| Visual consistency audit | Two design systems were in use: the established Paper & Signal on the homepage, research and writing, and an old Phase 2 look on 12 routes [R] |
| Phases 1–3 (page migrations) | 12 pages moved to the production layout, content preserved |
| Phase 4A audit and 4B cleanup | 13 legacy files deleted after a reference audit |
| Milestone commit and Cloudflare deploy | `ad8779b` pushed; Cloudflare built it, 63 pages, success [U] |
| Production QA of `ad8779b` | HTTP codes consistent with the build log; **details unreliable** (section 8, item 1) |

---

## 8. Defects, suspicious claims, and unverified items

| # | Item | Action |
|---|---|---|
| 1 | **The final production QA report contains details that contradict known data** [I]. It named colors `#F7F5F0`/`#FBF9F4`/`#1C1B18` (actual tokens are `#F7F4EC`/`#17191A`), a homepage H1 "Goutam Prusty" (the hero is "Curiosity, made useful."), a title for RES-014 ending "(1991–2024)" (the real title does not), and "18 research / 20 writing" (the log shows 21 / 21). The HTTP codes and the 63-page explanation are consistent with the logs; the visual prose is not. | **Owner spot-checks 5–6 pages on a phone and a desktop** and shares screenshots. Do not rely on the agent's visual descriptions. |
| 2 | **`derivedPosts` on `RES-014` and `RES-015` are raw slug strings, not Sanity references.** GROQ `derivedPosts[]->` returns `null` for each, which crashed the build until a template filter was added. The earlier import read-back wrongly reported these as resolved links. Result: **no "Derived Writing" section on those two pages**, and Studio will flag the invalid field. The five writing pages' `sourceReport` links do resolve. | Remote patch (needs owner approval, Q1): convert each array into 5 references to `writing-BLG-012/013/014/015/021` in source order, then verify with GROQ. Also find out why the importer did not convert them. |
| 3 | **Batch 4 images were never re-verified on the live site** after the stale-commit problem. The Batch 5 and HOLD QA only covered their own routes. The agent's Batch 4 report also saw some `BLG-016`/`BLG-020` figures render as empty `<figure>` tags. | Re-check the six Batch 4 routes (`RES-011/012/013`, `BLG-016/017/020`) on the current deployment. |
| 4 | **BLG-022 visible link text** still shows `beige-chamois-455581.hostingersite.com/research`, although the `href` is corrected. The earlier fix replaced only the `https://…` string. | Q2. If approved, patch that one text span in Sanity. |
| 5 | **Placeholder content is visible on live pages** (section 6.6). | Real copy, then remove the fixtures and sample routes. |
| 6 | **Mermaid diagrams may show as source text.** No Mermaid library is installed, and the agent's claim that they "render cleanly" is unverified (carried from v4). | Owner views `RES-019`. Decide: keep the code fallback or approve a dependency. |
| 7 | **Citation styling:** in the research pages, some numeric citations (for example "labor.15") appear as plain trailing digits, not superscript links. This is source formatting; the renderer only links explicit `[^n]` markers. An empty `<img src="">` was also reported on `/writing/the-asset-trap/`. | Low priority polish. Treat as owner-approved only if the text is not altered. |
| 8 | **Migration test total** was misreported once (351 vs the real 341, then 343, then 349 after added tests). | Ask for suite-by-suite counts in reports. |
| 9 | **Agent-written copy** (homepage, listings, notes) has not been reviewed by the owner. | Owner review. |
| 10 | **Handover files are probably not in the repo** [I]. The agent keeps searching `Downloads` for the handover. The `AGENTS.md` standing-rules addendum (v3 Appendix B) was never confirmed. | Run the Low prompt in Appendix B. |
| 11 | **Studio has never been opened by the owner.** | Run `npx sanity dev --port 3333` once and open `RES-018` and `RES-015`. |
| 12 | Carried over: Sanity project name ("astro-cms" vs "GoutamPrusty.com"), user-ID mismatch between `whoami` and `debug`, `PRJ-*` ID mismatch, Windows Smart App Control state. | Low priority. |

---

## 9. Remaining roadmap (dependency order)

1. **Small repair release:** the `derivedPosts` patch (Q1) and the live re-verification of Batch 4 (section 10).
2. **Owner content decisions and copy** (section 11): About, Contact, Elsewhere, Now, Topics, Projects stance, hero wording, AI-disclosure wording.
3. **Real pages:** replace placeholders, remove the notices and fixtures, remove the sample routes, and remove or `noindex` the prototype routes. Decide whether Collections keeps one real entry or is removed.
4. **Topics:** create `topic` documents from an owner-approved taxonomy and link them to the 42 articles. (The taxonomy source is the private workbook, so export only the approved topic list, not the workbook.)
5. **Search:** a simple, dependable, static search of published content (spec section 13). This probably needs one dependency, so ask first.
6. **SEO and redirects:** titles, descriptions, canonical tags, sitemap, robots, structured data, Open Graph, `/blog/*` → `/writing/*` and V1-only routes, RSS (optional).
7. **Quality pass:** accessibility, performance (including image weights), link check, real-device responsive check, citation polish, Mermaid decision.
8. **Release plumbing:** Cloudflare deploy hook, Sanity webhook, dataset export backup, production-dataset strategy and token, repo `docs/` files.
9. **Launch:** owner-approved merge to `main`, switch Cloudflare's production branch to `main`, connect `goutamprusty.com` (keep V1 deployable for rollback), redirects live, post-launch checks.

---

## 10. Immediate next step

**Step 0 (owner, no agent), about 10 minutes:** open the live site on a phone and a desktop: `/`, `/research/` plus one article, `/writing/` plus one article, `/about/`. Share 4–6 screenshots with ChatGPT. This replaces the unreliable agent QA from item 1.

**Milestone (exactly one): "Repair release: derivedPosts links + Batch 4 live check."** Effort: **Medium.**

- **In scope:** investigate why the importer left `derivedPosts` as strings, and fix it so future imports produce references; patch `RES-014` and `RES-015` in Sanity `development` (one atomic transaction, 2 documents); verify with GROQ; confirm the Derived Writing section renders in a local live build; commit and push. Then the owner deploys the latest commit, and a Low-effort browser check covers the six Batch 4 routes and both derived-writing sections.
- **Out of scope:** BLG-022 text, new pages, copy, SEO, dependencies, Cloudflare changes.
- **Needs owner approval first (Q1).**

**Calibration example.** Use this form and length. Verify the HEAD first. **Use only after Q1 = yes.**

```
# TASK: Repair release - derivedPosts references
Effort: Medium (one authorized remote patch, existing patterns)
Branch: codex/sanity-content-architecture (expected HEAD ad8779b or later; verify)
Context: read AGENTS.md and the handover. Standing rules apply.
Owner authorization (explicit): patch exactly research-RES-014 and research-RES-015 in Sanity
  project l94q5yx8, dataset development, in ONE atomic transaction. Set each document's
  derivedPosts to Sanity references (with _key) to writing-BLG-012, writing-BLG-014,
  writing-BLG-013, writing-BLG-021, writing-BLG-015, preserving the order of the current
  slug strings (structure-not-conspiracy, the-billionaire-raj, the-asset-trap,
  why-your-central-bank-wants-some-inflation, the-jobs-that-arent-jobs). Change nothing else.
  No production. Stop on any mismatch.
Do:
 1. Before writing: read both documents, confirm the five strings and their order, confirm the
    five target documents exist, and report the current derivedPosts shape.
 2. Find why the importer/serialization left derivedPosts as strings; fix it so future imports
    emit references (add a regression test). Do not change the allowed-ID list for any import.
 3. Apply the patch. Read back with GROQ and report the count of non-null derivedPosts[]->
    for each document (expected 5 and 5) plus the five dereferenced titles.
 4. Run a live-only local build and confirm both research pages render the Derived Writing
    section with five valid /writing/<slug>/ links. Keep the null-safe filter in the templates.
Limits: no other Sanity writes, no dependency changes, no content edits, no deployment.
Verify: npm run check; npm run build; npm run test:auth; migration tests (give per-suite
  counts); $env:SANITY_REQUIRE_LIVE='true'; npm run build; Remove-Item Env:SANITY_REQUIRE_LIVE.
Git: stage exact paths, git diff --cached --check, commit, push.
Report (max 40 lines): changed files, exit codes, transaction ID, GROQ read-back, per-suite test
  counts, anything NOT verified, decisions needed.
```

After that, the owner deploys the **latest commit** and pastes the Cloudflare log. Then run the Low-effort browser check (six Batch 4 routes, both derived-writing sections), asking for **screenshots saved to a folder and listed**, not prose descriptions.

---

## 11. Questions for the owner (ChatGPT: ask only what blocks the next prompt)

1. **Blocks the next prompt.** Do you authorize patching `RES-014` and `RES-015` in Sanity `development` so their five `derivedPosts` become real links to `BLG-012`, `013`, `014`, `015`, `021` (same order, nothing else changed)?
2. Does your earlier instruction to replace the old Hostinger URL also cover the **visible text** of that link in `BLG-022` (so it reads `goutamprusty.com/research`)? (Yes / no.)
3. Did you create a Cloudflare **deploy hook**? Are the handover files in the repo's `docs/`? What is the Windows Smart App Control state?
4. **Content decisions that now gate launch (not blocking the repair release):**
   - hero wording and portrait (or none)
   - About copy and what you are willing to state about yourself, with the BBA wording
   - the contact email
   - Elsewhere: which external profiles to link
   - Now: whether to keep the page and what it says
   - Projects: an honest empty state, or one real item
   - the topic grouping
   - the AI-assistance disclosure wording
   - whether Collections keeps an entry or is removed
   - the production-dataset and domain plan

---

## Appendix A: regenerate the context pack (PowerShell 5.1)

```powershell
cd D:\goutamprusty-v2
$out = "$env:USERPROFILE\Downloads\context-pack.txt"
$files = git ls-files
@(
  "## STATUS", (git status --short --branch),
  "## LOG", (git log --oneline -20),
  "## FILES (public/images excluded)", ($files | Where-Object { $_ -notlike 'public/images/*' }),
  "## IMAGE COUNT", (($files | Where-Object { $_ -like 'public/images/*' }).Count),
  "## PACKAGE.JSON", (Get-Content package.json -Raw),
  "## .ENV.EXAMPLE", (Get-Content .env.example -Raw)
) | Set-Content -Encoding utf8 $out
```

It contains no secrets (`.env` is not tracked; only `.env.example` is included).

## Appendix B: one-time prompt to put the handover in the repo (Effort: Low)

```
# TASK: Add handover and standing rules to the repo
Effort: Low (docs only)
Branch: codex/sanity-content-architecture
Do:
 1. Create docs/ and copy PROJECT_HANDOVER_v5.md to docs/PROJECT_HANDOVER.md and
    WEBSITE_THEME_AND_UI_UX_DESIGN_SYSTEM.md to docs/ (locate both in Downloads).
 2. Append this section to AGENTS.md without changing existing rules:
    "Standing rules: work only on the named feature branch; never touch main, never force-push;
     stage exact paths only; run `git diff --cached --check` after staging; never stage .env*,
     Content_Inventory.xlsx, research-webp-final/, migration/dry-run/*mutations.ndjson, tokens;
     V1 repo is read-only; never edit research/writing text; never invent biography or metrics;
     Sanity: development dataset only, writes only when the task states owner authorization,
     never print tokens; ask before adding dependencies; run checks synchronously;
     reports max 40 lines, mark anything unverified, and give per-suite test counts."
Verify: git diff --cached --check. Git: stage only these paths, commit
  "docs: add handover and standing agent rules", push.
Report: changed files and commit hash.
```

## Appendix C: command cheat sheet (PowerShell 5.1)

| Task | Command |
|---|---|
| Dev server | `npm run dev -- --host 127.0.0.1 --port 4321 --strictPort` |
| Type check / build | `npm run check` · `npm run build` |
| Live-only build | `$env:SANITY_REQUIRE_LIVE='true'; npm run build; Remove-Item Env:SANITY_REQUIRE_LIVE` |
| Auth tests | `npm run test:auth` |
| Migration tests | `node migration/tests/<file>.test.cjs` (9 suites; ask for per-suite counts) |
| Dry-run for chosen IDs | `node migration/run-vertical-slice-dryrun.cjs RES-004 BLG-003` (writes under `migration/dry-run/`; restore `src/data/verticalSliceData.json` if it changes) |
| Importer | `node migration/import-batch.cjs <IDs>` (dry-run by default; `--write` only with explicit owner authorization; development only) |
| Studio | `npx sanity dev --port 3333` |
| Schema validation | `npx sanity schemas validate` |
| Sanity CLI note | The CLI warns that the positional dataset argument is deprecated. Use `--dataset <name>`. |
| Staged whitespace check | `git diff --cached --check` |
