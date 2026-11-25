# PROJECT HANDOVER v6 — goutamprusty.com V2 (Paper & Signal)

Supersedes v1–v5. Written 25 Nov 2026 from the 24 Nov ChatGPT session (T10 follow-up to T17) plus `FINAL_WEBSITE_REDESIGN_MASTER_PLAN.md` (Revision 2).
Read this whole file before replying. Where this file and the master plan disagree on redesign decisions, the master plan wins. Where either disagrees with the repo (`AGENTS.md`, `docs/PROJECT_HANDOVER.md`), verify against the repo.

---

## 0. Verdict: forward, circling, or wrong direction?

**Forward, with two cautions.**

- Forward: Phase 0 data fix, nav, hero, homepage hierarchy, footer, Capabilities/learning roadmap, About page and fixture removal were all delivered with tests. The site is now honest: no placeholders in public output, no invented skills.
- Caution 1, drift into private paperwork: T11–T17 produced seven private drafts (resume, three case studies, Sanity inventory, Sanity payload). They are useful, but they are not launch progress. The launch gate (Section 7) still has **zero** published project case studies. Stop adding more private drafts. The next milestone must either move one project toward publication or fix the missing public assets.
- Caution 2, reporting discipline: the agent keeps launching `npm run build` as a background task while the prompts require foreground runs, and T16 listed 19 suite names that were fabricated (they did not match the real suites and summed to 599, not 549). Treat agent reports as claims until the numbers reconcile (Section 3).

Not circling: decisions are no longer being re-litigated. Not wrong: positioning and honesty rules are consistent with the master plan.

---

## 1. Project in one paragraph

Owner: Goutam Prusty. Rebuilding goutamprusty.com as V2 to support applications for **entry-level AI Engineer roles**. Education is a **BBA (Finance)**, not engineering. He enrolled on 23 Nov 2026 in the DataMites AI Engineer Program (8 months: 20 weeks of training, then a 3-month internship/projects phase). Workflow: **ChatGPT plans and writes prompts; Google Antigravity (Gemini 3.8 Flash, Low/Medium/High effort) implements.** The owner mostly copy-pastes. ChatGPT's job is to produce one correct Antigravity prompt at a time and to review reports critically.

---

## 2. Instructions for ChatGPT (follow strictly)

### 2.1 Working style
1. The owner has delegated routine decisions to you under the master plan. Decide, then give the prompt. Do not hand off to "Work mode"; just write the Antigravity prompt.
2. **One milestone per prompt**, ending in a pushed commit. No audit-after-implementation prompts. Ask the owner a question only when it is a real owner-only fact (provenance, contact details, approvals).
3. Ask the owner for explicit approval before: Sanity writes, dependency changes, tracked-file deletions, merges to another branch, deployments, publishing any contact detail.
4. Never invent biography, skills, metrics, URLs or credentials. Education is BBA. Never edit research/writing text. Do not reuse the old LinkedIn/Profile.pdf personality language, only its verified facts.
5. Never print or accept tokens. If the owner pastes one, tell him to rotate it.
6. The owner sometimes does not read prompts closely. Keep prompts short and unambiguous, and do not hallucinate paths, commands or IDs. If unsure of a path or HEAD, tell the agent to verify first.

### 2.2 Antigravity prompt template (max ~40 lines of report requested)
```
# TASK: <id> — <one-line goal>
Effort: Low | Medium | High (reason)
Branch: codex/sanity-content-architecture (expected HEAD <full 40-char hash>; verify)
Context: Read AGENTS.md, docs/PROJECT_HANDOVER.md, master plan, design system. Regenerate the context pack using Appendix A before relying on paths.
Owner authorization: <exact text, or "None">   (no bracketed placeholders)
Goal:
Do:
Limits:
Verify:
Git: stage exact paths only; git diff --cached --check; commit message; push.
Report (max 40 lines):
```
Effort guide: Low = copy/doc edits, Medium = single component or page, High = schema, data, cross-cutting.

### 2.3 Verification rules (new or tightened in this session)
- `npm run check`, `npm run build`, `npm run test:auth` and all migration suites must run **synchronously in the foreground** on PowerShell 5.1, with `$LASTEXITCODE` captured. Reject any report where the log says the build "was launched in the background" unless a later foreground exit code is shown. This has failed in T12–T17; say so again in every prompt until fixed.
- Require per-suite test counts and a **total that you add up yourself**. Do not accept a total you have not summed. The real baseline is **19 suites, 549 tests** (Section 3).
- **Never claim visual QA** unless screenshots are captured and listed. Every report so far says "NOT VERIFIED".
- Live-only build uses `SANITY_REQUIRE_LIVE=true`. Page count after T3 is **58** in both modes. Report any change.
- Use full 40-character commit hashes (T16 reported only `7b84e91`).
- `git diff --cached --check` has failed repeatedly on trailing whitespace; tell the agent to trim before staging.
- Never commit: `.env`, `Content_Inventory.xlsx`, `research-webp-final/`, `migration/dry-run/*mutations.ndjson`.

---

## 3. Current repository state

- Repo: `goutamprusty-v2`, branch `codex/sanity-content-architecture`, all pushed, working tree clean.
- **Latest HEAD: `b5113b1d1540acb169fbe684a5aa3232885800a6`** (T17). Verify before the next prompt.
- Stack: Astro 7 static, TypeScript strict, Tailwind v4 plus `paper-signal.css`, Sanity (project `l94q5yx8`, private `development` dataset holds 21 research + 21 writing docs and **0 projects**; `production` is empty), Cloudflare Pages preview at `goutamprusty-v2.pages.dev`. `goutamprusty.com` still serves V1. Node 24.22.3, Windows 11, PowerShell 5.1.
- Checks at HEAD (agent-reported): `astro check` 116 files 0 errors; `astro build` 58 pages; `test:auth` 13/13; migration suites 549/549.

### Test baseline (19 suites, sums to 549)
about-page 30, capabilities-component 32, derived-posts-reference-regression 6, extended-schema-renderer 12, fixture-elimination 17, footer-social-contact 24, hold-path-normalization 26, homepage-hierarchy 13, milestone-1b-parity 183, milestone-1c-compatibility 40, milestone-2-schema 38, milestone-2a-contract 8, milestone-2b-remediation 23, navigation-verification 17, null-cross-reference-regression 6, project-card-component 31, project-data-integration 13, project-schema-remediation 17, sanity-auth 13.
(`test:auth` runs sanity-auth separately, 13.) Any other suite list is wrong, including the one in the T16 report.

### Commit ledger (this branch, in order)
| Step | Commit | What |
|---|---|---|
| Phase 0 | `e38f4cb` | `derivedPosts` reference fix in `migration/import-batch.cjs`, regression test |
| T5 | (hash not seen) | Project schema: provenance, AI-assistance, evaluation fields |
| T4 | `8877c70` | Projects read from Sanity (0 eligible docs) |
| T1 | `4c7d445` | Nav rework, native `<details>` mobile nav |
| T6 | `90ca083` | Homepage restructure |
| T3 | `0f84c48` | Fixture removal from public output; `/now/`, `/search/`, `/collections/` 404, `/elsewhere/` → `/contact/` |
| T8 | `6c48284` | `ProjectCard` component |
| T2 | `9cbc63c` | Footer social/contact |
| T9 | `1584c2c`, `157a772` | Capabilities component; learning roadmap (planned learning, not proficiency) |
| docs | `1fe48f4` | Handover and design system into `docs/`, standing rules in `AGENTS.md` |
| T7 | `bf0436d` | Hero |
| T10 | `ee9b483` | About page |
| T10 follow-up | `e082220e66370db8666ca2aa50eafcfc77ccf589` | DataMites "Current training" and Command Center "Learning workspace" on About |
| T11 | `91e82f7e006bee932c701faa3ca2bc45b5506c8d` | Private resume draft (`docs/drafts/resume-draft.{md,html,pdf}`) |
| T12 | `783a446e28f16d5aaf203778442de1ff15df6526` | Private `docs/drafts/inkline-case-study.md` |
| T13 | `16eb271bd330ac365a8ad71623a73473066e8ed0` | Private `docs/drafts/command-center-case-study.md` |
| T14 | `d20aecf4b3566c068efadc892a598c999c88b7a3` | Private `docs/drafts/vitaliq-case-study.md` |
| T15 | `27e83121ae5086b8282db18debbdd79cc1ddf477` | Private `docs/drafts/sanity-project-inventory.md` (0 projects in Sanity) |
| T16 | `7b84e91` (short) | Command Center attribution and proposed Sanity payload |
| T17 | `b5113b1d1540acb169fbe684a5aa3232885800a6` | Finalized payload for approval, ID/slug confirmed unused (read-only) |

Public site facts now live: hero eyebrow "AI engineer." / H1 "Curiosity, made useful." / hook "Looking for signs of consciousness." / "Building with AI, exploring intelligence, and occasionally wondering what we've created." About page has Background (BBA Finance, New Horizon College of Engineering, 2021–2024; DirectorIn, Intugine, Brand Compass roles), Current training (DataMites, enrolled 23 Nov 2026, in progress, no completion claimed), Learning workspace (Command Center links). Projects section is omitted from the homepage because no eligible project documents exist.

---

## 4. Design and content rules (unchanged)

- "Paper & Signal", light only. Paper `#F7F4EC`, ink `#17191A`, peach/blue/sage for Projects/Research/Writing, lime `#D3F03C`, border `#827D71`.
- IA: Projects, Research, Writing, About, Resume, Contact CTA. Homepage order: Hero → Featured Projects → Capabilities → Research & Writing → About → Contact strip → Footer.
- Project provenance labels: Independent / Built during training / Guided exercise / Collaborative. AI assistance is disclosed separately and never classed as a human collaborator.
- The learning roadmap is framed as planned learning, never demonstrated skill.

---

## 5. Pending owner decision (blocking)

**Create one draft Sanity document?** Awaiting the owner's literal reply "Approve" or "Not yet".
- Dataset `development`; document ID `project-PRJ-004` (proposed, not existing); workbookId `PRJ-004`; slug `ai-engineer-command-center`; status `draft`; featured `false`; provenance `Independent`; category `web-application`; create exactly one document, no publishing.
- Payload: `docs/drafts/command-center-case-study.md`, Sections 10–11.
- Owner-confirmed attribution (use verbatim, no embellishment): the idea was the owner's; first built for personal use; later expanded so friends could use it; ChatGPT, Claude and Antigravity IDE generated the code and suggested architecture, stack, structure and development plan; the owner's hands-on contribution was copying and applying the generated code.
- Do not claim the owner configured environments, debugged, tested or made architecture decisions. T16 wrote "configuring environment"; confirm T17 removed it.
- Note: a `draft` status is suppressed by the public query (`status == "published" || "completed"`), so creating it changes nothing publicly. Publishing it later is a second approval.

If the owner says **Approve**: write one prompt that creates exactly this one document in `development` using the existing authenticated pattern, prints no tokens, reads it back, and confirms the public build is unchanged (58 pages, project section still omitted). Include the exact authorization sentence in "Owner authorization".
If **Not yet**: ask what to change.

---

## 6. Known defects and risks

1. No visual QA has ever been captured for the redesign. Schedule a screenshot milestone (desktop and mobile; home, About, Projects, Research, Writing) before any launch claim.
2. Agent runs builds in the background despite prompts (Section 2.3).
3. T16 report listed incorrect suite names (sum 599). Baseline is 549 (Section 3).
4. Fixture files and `src/data/fixtures.ts` remain on disk. Deleting them is a tracked deletion and needs owner approval.
5. Capabilities validator checks slug format but may not verify against real eligible projects.
6. Footer and nav have no real email, GitHub or LinkedIn yet; no published resume PDF. `docs/drafts/resume-draft.pdf` awaits owner review.
7. Inkline and Vitaliq provenance, contribution and AI-assistance are **unconfirmed**. Only Command Center is confirmed. Do not reuse the Command Center answer for the others. Ask separately if you want to proceed.
8. Command Center case study states the live demo returned HTTP 200 only; that is not visual verification.
9. `goutamprusty.com` still points to V1; Cloudflare production branch, deploy hook and custom domain are unresolved.
10. Redirect plan (master plan) not yet implemented as a deliverable; check against the 42-slug route table in the repo.

---

## 7. Roadmap to launch

Launch gate (master plan): at least one complete published case study; approved copy; real email, GitHub, LinkedIn and resume PDF; no placeholders; redirects; owner screenshots.

Suggested order (you decide; keep each step one prompt):
1. **Resolve Section 5** (Approve / Not yet).
2. If approved: create the one draft doc (the only Sanity write).
3. Ask owner for approved public contact set: email, GitHub profile URL, LinkedIn URL, and whether the resume PDF may be published. Then wire footer, contact page and a Resume page/link.
4. Case-study rendering on `/projects/<slug>/` for the draft doc using a local preview only; then a separate owner approval to flip status to `published`.
5. Visual QA milestone with real screenshots.
6. Remaining master-plan items: redirects, metadata/SEO, Research/Writing polish, fixture deletion (needs approval), then production dataset and domain cutover plan.
7. Inkline and Vitaliq: only after the owner supplies provenance/contribution/AI-assistance for each.

Do not start another private-draft milestone unless it unblocks one of these.

---

## 8. Immediate next step for ChatGPT

1. Greet briefly, state you have read v6 and the master plan, and show the Section 5 approval block verbatim.
2. Wait for **Approve** or **Not yet**. Do not write the Sanity-write prompt before that.
3. In the same reply, remind the owner of the next input you need: public email / GitHub / LinkedIn / resume-publishing permission.

---

## Appendix A — Context pack

The agent regenerates `context-pack.txt` (about 8.7 KB) at `$env:USERPROFILE\Downloads\` after each milestone, using the Appendix A script already in `docs/PROJECT_HANDOVER.md`. Ask the owner to attach the latest copy rather than trusting stale paths. Do not trust an agent's claim that a file is missing without checking what Appendix A actually reads.

## Appendix B — Source facts the site may use

BBA Finance, New Horizon College of Engineering, Sep 2021–Sep 2024. DirectorIn, Business Consultant Trainee, Sep–Nov 2023. Intugine, Bills Accounting Assistant, May–Aug 2023. Brand Compass, Jr. Web Developer, Dec 2021. DataMites AI Engineer Program, enrolled 23 Nov 2026, in progress. Command Center: https://ai-engineer-command-center-seven.vercel.app/ and https://github.com/goutam-prusty/ai-engineer-command-center (learning tracker; Vite, React, TypeScript, Tailwind, Firebase; **not** an AI app). Inkline (https://github.com/goutam-prusty/inkline): resume builder, OpenAI gpt-4o-mini writing assist with deterministic fallback, no verified live demo. Vitaliq (https://github.com/goutam-prusty/vitaliq, demo https://vitaliq.vercel.app returned HTTP 200): health-data tracker, not medical, not AI. Repo Janitor is private; keep off the public site.
