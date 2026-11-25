# FINAL WEBSITE REDESIGN MASTER PLAN: goutamprusty.com V2

**Prepared:** Tuesday 24 November 2026 (**Revision 2, same day:** proposals C and D added, see 3.1 and 4.3)
**Status:** Authoritative redesign blueprint for the next development phase. Supersedes all individual LLM redesign proposals.
**Companion documents (read together, see section 18):** `PROJECT_HANDOVER_v5.md`, `WEBSITE_THEME_AND_UI_UX_DESIGN_SYSTEM.md`, `WEBSITE_BUILD_SPEC_FOR_CODEX.md`, `context-pack.txt` (regenerate before use).

### Evidence labels used in this document

| Label | Meaning |
|---|---|
| **[H]** | Stated in the handover v5 |
| **[D]** | Stated in the design system document |
| **[S]** | Stated in the Codex build spec |
| **[C]** | Visible in the context pack (file list, git log, package.json) |
| **[P-A] / [P-B]** | Claimed by redesign proposal A or B. **Unverified**; confirm in the codebase before relying on it |
| **[NEW]** | A new decision made in this plan |
| **[OWNER]** | Needs the owner's input or approval before it can be built or published |

---

## 1. Executive Summary

**The situation.** V2 is a technically sound Astro 7 + Sanity + Cloudflare Pages site with a distinctive, already-consolidated "Paper & Signal" design system, and 42 migrated research and writing documents [H]. It reads as a **research and writing library**. The owner's goal is to be shortlisted for **entry-level AI Engineer** interviews. Both redesign proposals reach the same diagnosis: there is a **positioning gap**. A recruiter sees curiosity and intellectual depth but no evidence of building. The Projects page is fixture-only, About and Contact are placeholders, and there is no resume, GitHub or LinkedIn path.

**The decision.** Do not rebuild and do not change the visual identity. Keep the architecture and Paper & Signal. Change the **information hierarchy and the content**:

1. Homepage order becomes: identity and direction → **engineering projects** → capabilities backed by evidence → compact research and writing → short verified About → contact strip.
2. Navigation becomes **Projects, Research, Writing, About, Resume, Contact (CTA)**. Topics leaves the primary nav until real topic documents exist.
3. Resume, GitHub and LinkedIn become first-class, always-reachable actions.
4. Every placeholder, fixture, disabled feature and unfinished page is removed from public view before launch.
5. **The long pole is content, not code.** The site cannot launch credibly without at least one fully documented, honestly described project, a verified About, a real contact email, a resume PDF, and verified profile links.

**Biggest risks.**
- Writing copy that overstates what the owner has built. The spec forbids this [S 7.2].
- Treating agent-reported visual QA as verified. The handover documents prior invented detail [H 8.1].
- Designing a projects showcase with no projects in it. **Launch is gated on real project content.**

**What was rejected:** dark mode, a chatbot, sticky nav, container-query systems, a three-column project grid, a "technical focus" pill strip with unverified skills, "self-taught" wording, recoloring Writing cards, and any new CMS or database.

---

## 2. Project Context and Objectives

| Item | Fact |
|---|---|
| Owner | Goutam Prusty. BBA graduate (2024). AI engineering training in progress [S 7.2, H 4]. Proposals name **DataMites**; treat the programme name and modules as **[OWNER] unverified** |
| Goal | Be shortlisted for fresher / entry-level AI Engineer roles. Secondary: serve as the canonical home for the research and writing library |
| Audience | Recruiters and hiring managers (primary), technical peers and interviewers, readers arriving via LinkedIn or search |
| Constraint | No invented title, experience, clients, metrics or outcomes. Old project case studies are **not** published as written [H 4]. |
| Stack | Astro 7, TypeScript strict, Tailwind v4 plus custom CSS, Sanity (project `l94q5yx8`, dataset `development`), Cloudflare Pages, static output [H, C] |
| State | Branch `codex/sanity-content-architecture`, HEAD `ad8779b` per handover. 21 Research + 21 Writing in Sanity `development`. 63 pages on Cloudflare (65 locally). All production routes use `ProductionPaperSignalLayout` and `paper-signal.css` [H] |
| Not yet done | Repair release (`derivedPosts` on RES-014/015), real About/Contact/Projects/Now/Elsewhere/Topics content, SEO, redirects, search, deploy hook, domain cut-over [H] |
| Execution | Google Antigravity (Gemini 3.8 Flash), PowerShell 5.1, Windows 11. ChatGPT writes prompts, the owner pastes them [H 2] |

**Objectives of this plan:** a recruiter understands within 30 to 60 seconds who the owner is, what direction they are heading, and what they have actually built, and can reach the resume, GitHub, LinkedIn and email without hunting.

---

## 3. Evaluation Methodology and Decision Principles

### 3.1 What was actually provided

- Four project documents (handover, design system, build spec, context pack).
- **Four distinct redesign proposals.**
  - **A** claims to have inspected the GitHub repo but could not load the live site. (A duplicate copy of A was counted once.)
  - **B** claims to have inspected the live site, with limited repo access.
  - **C** had access to neither the repo nor the live site and worked only from the handover. Its code-level and visual statements are therefore inferences.
  - **D** is a portfolio-reference study: 16 fresher AI portfolios read as page text (no rendered screenshots), plus practitioner articles (opinion, not controlled studies), plus a reading of the DataMites brochure. **The brochure was not supplied to this plan**, so everything D says about its contents is unverified until the owner confirms it.
- No identifiable Gemini or Grok document was among the inputs. If others exist, they were not evaluated.

### 3.2 Reliability rules applied

- Proposal B's live-site observations are **not treated as verified**. The handover records that a previous browser-subagent QA report invented colors, titles and counts [H 8.1]. Where Proposal B's claims matched the handover (placeholders, fixture project, Contact pending) they are corroborated by the handover itself. Visual claims remain **unverified until the owner supplies screenshots**.
- Proposal A's source-file claims (homepage built from three Sanity articles, breakpoints `52rem/48rem/34rem`, max width `76rem`, serif/sans/mono stack names, a prototype-only comment in `@theme`) are **plausible but unverified here**. Only `34rem` is in the project documents. They are marked **verify in codebase**.

### 3.3 Decision hierarchy (applied to every conflict)

1. Explicit project requirements and constraints [S, H].
2. Existing architecture and handover state.
3. Established design system and build spec.
4. Evidence-backed recommendations from the proposals.
5. This plan's own judgment where documents are silent.

Every changed established decision is listed in section 5.3 with the documentation change it requires.

---

## 4. Consolidated Findings from LLM Recommendations

### 4.1 Agreed by both proposals (adopted)

| Finding | Notes |
|---|---|
| Keep Paper & Signal; do not adopt a dark, futuristic AI look | Matches [D A.4]. Adopted |
| Keep Astro + Sanity + Cloudflare; no rebuild | Adopted |
| Positioning gap: hero does not signal an AI Engineer direction | Adopted. Keep headline, change eyebrow and supporting copy |
| Homepage is research-first; projects must lead | Adopted |
| Projects page is fixtures only | Corroborated by [H 6.5, 8.5] |
| About, Contact are placeholders; resume/GitHub/LinkedIn missing | Corroborated by [H 6.6] |
| Research and writing are a real differentiator but secondary evidence | Adopted |
| Remove fixture notices, sample entries; handle prototype routes | Corroborated by [H 8.5, 9] |
| Case study format with honesty about limitations | Adopted, merged with [S 7.4] |
| Don't add features before content | Adopted |
| Real-device mobile testing | Adopted |

### 4.2 Unique ideas, evaluated

| Idea (source) | Verdict | Reason |
|---|---|---|
| Separate "Featured Projects" from "Selected Research & Writing" (A) | **Adopt** | Prevents calling a report an engineering project |
| Skills shown via projects, not as bare lists (B) | **Adopt** | Evidence-first; fits honesty rule |
| Distinguish independent / training / guided / collaborative projects (A) | **Adopt** | Directly supports [S 7.2] |
| One well-documented project beats ten empty cards (A) | **Adopt** as launch principle | |
| Technical focus pill strip under hero (A, B) | **Modify** | Only for areas backed by real work. Folded into the hero focus line and capabilities section |
| Technical capabilities section (A, B) | **Adopt**, evidence-linked, two honest tiers | |
| Resume in nav and hero (A, B) | **Adopt** | Needs a real PDF |
| Sticky navigation (B) | **Reject** | [S 6.1] warns against sticky elements consuming mobile space; not in design system |
| Dark mode (A, optional) | **Reject** | [D A.3] light only |
| Portfolio chatbot as separate demo (A, optional) | **Reject for this site**; may exist as a *project* later | Out of scope [S 14] |
| Container queries (B) | **Reject** | Unneeded; existing media queries plus fluid CSS suffice |
| Neutral "engineering project" card, Writing = peach (A) | **Reject** | Contradicts confirmed semantics: peach = Projects, blue = Research, sage = Writing [D B.2] |
| 2 or 3 columns of project cards on large desktop (A) | **Modify** | Two columns maximum, one card full-width if only one project |
| Move mobile nav breakpoint to about 56rem if crowded (A) | **Adopt conditionally** | Decide by real screenshots |
| "Self-taught path" in bio (B) | **Reject** | Unverified claim |
| Availability note near contact (B) | **Optional**, owner-approved wording only | |
| Smooth scroll, short hover transitions (A, B) | **Adopt minimally** | With `prefers-reduced-motion` honored |
| Search (A optional, B planned) | **Defer** | Hidden at launch; implement after (see 6.4) |
| Project category filtering, technical notes section, downloadable summaries (A); filter tabs (C) | **Reject for v1** | No content to filter |

### 4.3 Proposals C and D (added in Revision 2)

**Proposal C** reaches the same diagnosis and the same section order as A and B, so it strengthens the existing decisions. Its distinct points:

| Idea | Verdict | Reason |
|---|---|---|
| Replace the hero H1 with "Building Practical ML, RAG & AI Systems That Ship to Production" | **Reject** | Overclaims ("ship to production") against [S 7.2]; discards the approved-for-keeping headline and the site's identity; the role is stated in the eyebrow instead |
| Sticky nav (also recommended by B and D) | **Reject for v1; revisit in Phase 4** | See C10 |
| Container `max-width: 1120px`, sizes and spacing in px | **Reject** | The existing container (reported `76rem`, verify) stays; guidance in section 10 and 9 is advisory and defers to existing tokens |
| Email copy button | **Reject** | Needs JavaScript for little value; a plain `mailto:` is the spec [S 10.4] |
| 3 to 4 projects, 2-column grid | **Merge** | Consistent with C2 and C3 |
| Skills grouped by domain | **Merge** | Already adopted, with the evidence-linked two-tier rule |
| Fix content defects (`derivedPosts`, BLG-022 text, Batch 4 images, empty `<img src="">` on `/writing/the-asset-trap/`, Mermaid) | **Already covered** | Phase 0 and T0; the empty `<img>` and BLG-022 text are added to the Phase 0 and Phase 5 checks |

**Proposal D** is the strongest *evidence* about what works for fresher AI portfolios, but its design recommendation conflicts with the design system.

| Idea | Verdict | Reason |
|---|---|---|
| README-style plain site: sans only, blue accent `#2563EB`, `prefers-color-scheme` dark variant, 720 to 960 px single column | **Reject** | Replaces Paper & Signal with a second design language; the owner and handover chose paper/pastel/lime, light only. D's real point (no flourishes, quick to scan) is already satisfied |
| Target title "Junior AI Engineer" | **Reject** | "Junior" implies job experience; keep "Aspiring" or "Entry-level" (Q-4) |
| Separate guided course work from your own extensions ("started from the course scaffold; I changed X, Y, Z") | **Adopt, strengthened** | Strongest credibility lever; added to the case-study template (section 12) |
| Numbers only with dataset, split and baseline; avoid "production-grade" | **Adopt** | Added to section 12 rules |
| Case studies with evaluation table, failure analysis, limitations | **Adopt** | Added to template items 8 to 9 |
| Skills linked to the project that proves them | **Already adopted** | Capabilities section (7.4) |
| Evidence on each project card (one metric, source, live demo) | **Adopt, optional** | One metric line, only with context (7.3) |
| Certificates listed last, under their real issuers; do not imply endorsement the brochure disclaims | **Adopt** | Added to K7 |
| Hosted live demos (for example a free hosted demo space) | **Optional** | Encouraged where real; not a launch gate |
| No preloaders, percentage skill bars, zero-value counters, easter eggs, "ask me" chatbots, terminal themes, inconsistent project counts | **Already aligned** | Matches [D A.4] and the rejections above |
| Keep date of birth, home address and phone number off public pages | **Adopt** | New K15 and Q-16 |
| Availability line ("Open to AI/ML roles") | **Keep as optional** | Owner-approved wording only (K14) |
| "Last updated" date; social-preview image | **Adopt** (low-priority date; OG image in section 14) | Cheap trust signals |
| Minimum of five projects (from the brochure's project areas) | **Reject as a launch gate; keep as a longer-term target** | One real, defensible project beats five weak ones; the five areas (predictive ML with API, RAG, bounded agent workflow, CV/document AI, BI dashboard) are *candidate topics* to document if and when the owner has actually built them |
| List only tools you actually used | **Adopt** | Brochure lists many tools (for example pgvector, LangGraph, FastAPI, Docker, SHAP, XGBoost, PyTorch, Power BI); none may appear unless used in a project |
| DataMites internship as "Experience" | **Hold** | Whether an internship exists and what it was is unverified (K2, Q-5); if real, describe it accurately and not as employment |

D's practitioner claims (live demo plus evaluation beats a polished repo; interviewers probe design choices, especially for AI-assisted code) are consistent opinion, not proof. They reinforce the existing rule that the owner must be able to explain every claim.

---

## 5. Conflicts, Trade-offs and Final Decisions

### 5.1 Decisions between proposals

| # | Conflict | Final decision | Why |
|---|---|---|---|
| C1 | A: separate "technical focus" strip **and** "capabilities" section. B: one compact focus section. | **No separate strip.** One "Capabilities" section after Projects. Hero carries a one-line focus statement | Two skill blocks duplicate each other; skills unsupported by projects hurt credibility |
| C2 | A: two or three project columns on large desktop. B: two columns on tablet and up. | Two columns from `52rem`; one column below. One project renders as a full-width feature card | Project cards carry stack tags and text; three columns squeeze them |
| C3 | Project count: A needs ≥1; B 2 to 3; C 3 to 4; D 4 to 5 (five as a course minimum). | **Launch gate = at least 1 complete case study.** Target 3 before announcing widely; five is a longer-term target, not a gate | Honest minimum without delaying launch indefinitely |
| C4 | A: Elsewhere replaced by footer links. B: keep, verified profiles only. | **Fold profiles into Contact page and footer.** Remove the Elsewhere route from public view unless it gains real content | One place for verified links |
| C5 | A: remove or complete Now. B: optional. | **Not in launch nav.** Hide unless the owner writes real copy | Placeholder pages harm credibility |
| C6 | A: Resume visible; B: Resume as first-class. | **Resume is a nav link and hero secondary CTA** | Agreement; this is the decision |
| C7 | A: reduce Connected Analysis. B: demote research. | Compress to one compact "Research & Writing" section of 2 or 3 items, plus links to both libraries | Keeps the differentiator without crowding projects |
| C8 | B: sticky header. A: silent. | **Static header** | See 4.2 |
| C9 | Hero headline: keep or change? (A, B keep; C proposes "Building Practical ML, RAG & AI Systems That Ship to Production") | **Keep "Curiosity, made useful." as the working headline**, still [OWNER]-approval pending. Add an eyebrow and rewrite the supporting paragraph | Distinctive; the owner has not approved any replacement; C's line overclaims |
| C10 | Sticky header (B, C, D for; A silent) | **Static header for v1.** Revisit in Phase 4: allow a compact sticky header only if it is a single row, does not cover anchored headings, and passes real-device checks | [S 6.1] warns against sticky elements consuming mobile space; unproven benefit; majority vote is not evidence |
| C11 | Design language: D's README-style plain site versus Paper & Signal | **Paper & Signal stays** | Established decision [D, H]; a second language is explicitly forbidden |
| C12 | Role wording: "Aspiring" (A) / "Entry-level" (B, C) / "Junior" (D) | **"Aspiring AI Engineer" by default; "Entry-level AI Engineer" acceptable if the owner prefers; never "Junior"** | [S 7.2] caution against implying employment or established expertise |
| C13 | Project card metrics (D) | **Optional one metric line, only with dataset and baseline context** | Honesty rule; unexplained numbers hurt credibility |

### 5.2 Decisions on established documents' internal tensions

| # | Tension | Decision |
|---|---|---|
| T1 | Design system says the approved IA order is Home, Research, Writing, Projects, Topics, About [D E.1]. The prototype and production header differ. Handover says production header is Research, Writing, Topics, Projects, About, "Get in touch" [H 6.5]. | The **new order is Projects, Research, Writing, About, Resume, Contact CTA** (see 5.3 and section 6) |
| T2 | Spec lists Search, Now, Elsewhere, Collections, Topics as supporting pages [S 4]. Placeholders now exist. | They are **not launch requirements**. Only pages with real content go live |
| T3 | Spec baseline lists 3 projects [S 8.1]. Handover holds Projects and says old case studies are not published as written [H 4]. | **Handover wins.** New project documents are written from currently verified material. Whether to reuse `PRJ-*` IDs is an open question (Q-14) |
| T4 | Design doc was written at commit `97f3a16` on `codex/paper-signal-prototype`; production is now at `ad8779b` [D 0.3, C]. | Design system values are authoritative, but any value marked NOT SPECIFIED must be read from `src/styles/paper-signal.css` during Phase 1 |

### 5.3 Established decisions this plan changes

| Changed decision | From | To | Reason | Documentation to update |
|---|---|---|---|---|
| Navigation order and set | Research, Writing, Topics, Projects, About + Get in touch [H] / approved IA order [D] | Projects, Research, Writing, About, Resume, Contact CTA | Recruiter journey: evidence first | Design system E.1; handover 6.5 |
| Topics in primary nav | Present | Removed from nav until topic documents exist (route and footer link only if real) | No topic taxonomy approved; sample topics are fixtures | Design system E.1; spec 4 |
| Homepage hierarchy | Identity, selected work (research/writing), topics, contact [S 4, D J.1] | Identity, projects, capabilities, research and writing, About, contact | Career objective | Spec 4; design system J.1 |
| Hero eyebrow and copy | Library-style introduction | Role/direction eyebrow (owner approved) | Positioning gap | Design system A.1 |

Everything else in the design system and spec stands.

---

## 6. Final Website Information Architecture

### 6.1 Primary navigation (desktop and mobile)

`g.` wordmark (links to Home) · **Projects** · **Research** · **Writing** · **About** · **Resume** (text/outline style, opens PDF) · **Contact** (existing lime CTA, replaces "Get in touch ↗" wording only if owner approves)

- Home is reached via the wordmark; no separate "Home" link.
- Native `<details>/<summary>` mobile disclosure is retained [D E.1]. Resume and Contact stay inside the opened menu on mobile and remain tap-target compliant (≥ `2.75rem`).
- `aria-current="page"` logic remains as implemented.

### 6.2 Page inventory

| Page | Launch status | Notes |
|---|---|---|
| `/` Home | **Required** | Section 7 |
| `/projects/`, `/projects/<slug>/` | **Required** (≥1 real project) | Sanity `project` documents; honest empty state is a pre-launch fallback only |
| `/research/`, `/research/<slug>/` | Live (21) | Unchanged |
| `/writing/`, `/writing/<slug>/` | Live (21) | Unchanged |
| `/about/` | **Required** | Verified bio; fuller version of homepage About |
| `/contact/` | **Required** | Real email, GitHub, LinkedIn, resume link |
| `/resume.pdf` (path to verify) | **Required** | Static asset, matches site claims |
| `/404` | Live | Keep |
| `/topics/`, `/topics/<slug>/` | **Hold** | Reintroduce when topic documents are created from an owner-approved taxonomy |
| `/now/` | **Hold** | Publish only with real copy |
| `/elsewhere/` | **Remove from public view** | Profiles live in Contact and footer |
| `/collections/*` | **Remove** (fixtures only) | Owner already delegated; keep only if one real series exists |
| `/search/` | **Hide at launch** | Implement post-launch (6.4) |
| `/design-exploration/paper-signal/*`, `/research/sample-report/`, `/writing/sample-article/` | **Exclude from production** | Handover requires removal or noindex before launch |

### 6.3 Footer

Wordmark, primary links, **GitHub, LinkedIn, email, resume**, copyright, optional AI-assistance disclosure line (wording [OWNER]-approved). No newsletter, no widgets.

### 6.4 Search decision

Search stays out of the launch build. Both a disabled input and a half-built feature are rejected. After launch, implement a static search per [S 13]; it likely needs one dependency, so ask first [H 2.5].

---

## 7. Final Homepage Structure and Section-by-Section Specification

**30 to 60 second target:** 0 to 15 s: who and what direction. 15 to 40 s: real projects with stack and links. 40 to 60 s: research depth, background, and how to act (resume, GitHub, LinkedIn, email).

### Section order

| # | Section | Treatment |
|---|---|---|
| 1 | Header | Compact, static |
| 2 | Hero | Full |
| 3 | Featured Projects | Full (primary evidence) |
| 4 | Capabilities | Compact |
| 5 | Research & Writing | Compact |
| 6 | About / Learning path | Short |
| 7 | Contact strip (dark band) | Full-width, closing |
| 8 | Footer | Compact |

### 7.1 Header
- **Purpose:** navigation and instant access to Resume and Contact.
- **Content:** per 6.1.
- **Responsive:** row above the existing disclosure breakpoint; stacked disclosure below. **Test 768 to 900 px for crowding; if crowded, move the switch to about `56rem`** (decide from screenshots).
- **Dependencies:** resume PDF.

### 7.2 Hero (above the fold)
- **Purpose:** state identity and direction honestly.
- **Content:**
  - Eyebrow: **"Aspiring AI Engineer"** (or "Entry-level AI Engineer" if the owner prefers; never "Junior") [OWNER must approve wording, see C12 and Q-4].
  - H1: **"Curiosity, made useful."** (working headline, [OWNER] approval pending).
  - Supporting text (2 to 3 sentences): name, direction (machine learning / generative AI, only areas the owner can evidence), and a clause linking research curiosity to building. **Draft is written by the owner or approved by the owner; no invented claims.**
  - Primary CTA: **View projects** (lime). Secondary: **Resume**. Tertiary text links: GitHub, LinkedIn.
  - Geometric Paper & Signal artwork retained. Portrait optional and never generated [D G].
- **Layout:** desktop two columns (text / artwork). Mobile: single column, order **eyebrow → H1 → text → CTAs → artwork** at reduced size, so CTAs sit in the first screen and the first project preview appears early [D I.3].
- **Interactions:** none beyond links.
- **Dependencies:** approved copy, resume, verified profile URLs.

### 7.3 Featured Projects
- **Purpose:** the main evidence of building ability.
- **Content:** 1 to 3 project cards from Sanity `project` documents flagged featured. Each card: title, one-sentence problem, **provenance label** (independent / training / guided / collaborative), status, stack tags, GitHub link, demo link (only if real), link to case study. Optionally one metric line, shown only when its dataset and baseline are stated on the case-study page. Optional thumbnail only if it is a real screenshot or diagram.
- **Layout:** one column below `52rem`; two columns from `52rem`; a single project spans full width. Cards use the peach content-type tint [D B.2] with the thin `#827D71` border; no shadows.
- **Interactions:** whole-card link plus explicit text links; keyboard focus per design system.
- **Rule:** never place a research report in this section.
- **Dependencies:** real project documents (launch gate), project schema verification (13.3).
- **If zero projects exist:** the section is not rendered. Launch is blocked (section 16).

### 7.4 Capabilities
- **Purpose:** show technical foundations without a laundry list.
- **Content:** grouped, short. Two honest tiers only: **"Used in projects"** (each item links to the project that proves it) and **"Currently learning"**. Items not yet established are **not shown**. Candidate groups from proposals (Python, SQL, ML foundations, NLP, generative AI/RAG, FastAPI, Git, evaluation) are placeholders until the owner confirms each [OWNER].
- **Layout:** wrapping tags or a small two-column list; no bars, percentages or star ratings.
- **Dependencies:** completed projects, owner skill confirmation.

### 7.5 Research & Writing
- **Purpose:** demonstrate analytical depth and communication.
- **Content:** 2 to 3 selected items (one research, one or two writing), with type, date, reading time, and links to `/research/` and `/writing/`. Blue tint for Research, sage tint for Writing [D B.2].
- **Layout:** compact two-column split on desktop, stacked on mobile.
- **Replaces:** the current "Connected Analysis" and "Research topics" homepage sections (verify exact current structure in `src/pages/index.astro`).

### 7.6 About / Learning path
- **Purpose:** short, verified background.
- **Content:** BBA (2024), the AI engineering training in progress (programme name only once verified), the career objective, link to `/about/`. No "self-taught", no experience, no titles beyond verified facts.
- **Layout:** single narrow column; optional small portrait or geometry.

### 7.7 Contact strip
- **Purpose:** convert interest into contact.
- **Content:** real email (plain `mailto:` link, no form [S 10.4]), LinkedIn, GitHub, Resume. Optional availability line only with owner-approved wording.
- **Layout:** keep the existing dark closing band (a single band, not a dark theme [D B.2]).

### 7.8 Footer
Per 6.3.

---

## 8. Components and Sections: Keep, Improve, Remove, Add

### Keep
Paper & Signal tokens; serif/sans/mono system stacks; geometric artwork; `ProductionPaperSignalLayout.astro` and `paper-signal.css` (as the sole production layout and stylesheet [H]); `PortableText.astro`; `VisualFigure.astro`; research and writing templates (with the null-safe cross-reference filter); skip link, focus treatment, reduced-motion support; native disclosure mobile nav; Sanity integration and schemas; the lime Contact CTA; the dark closing contact band; the 404 page.

### Improve
| Item | Change |
|---|---|
| Hero | New eyebrow and supporting copy; Resume/GitHub/LinkedIn access |
| Homepage selected-work query | Split into projects (new) and research/writing (existing) |
| Projects pages | Replace `src/data/fixtures.ts` filtering with Sanity `project` documents |
| About, Contact | Real, verified copy |
| Header, footer | Resume, GitHub, LinkedIn, email; new nav order |
| Homepage `<title>` and meta description | Reflect approved identity |
| CSS comments | Correct any "prototype-only" `@theme` comment the next time `paper-signal.css` is touched [P-A, verify] |

### Remove
Sample project, sample topics, sample collections and their routes; every "Development fixture - placeholder content" notice; the disabled search page and links to it; prototype routes and fixture detail routes from the production build (deleting tracked files needs owner approval [H 2.5]); Topics from primary nav; Elsewhere and Now from public navigation unless real.

### Add
| New | Notes |
|---|---|
| Featured Projects section and project card variant | Within existing card language |
| Capabilities section | Evidence-linked, two tiers |
| Project case-study template | Section 12 |
| Resume asset and links | Location to verify |
| Provenance and AI-assistance fields on projects | Schema verification needed |
| Footer social/contact block | |

---

## 9. Final Visual Design Direction

**Principle:** *Editorial identity, engineering evidence.* The look stays calm and personal; credibility comes from content.

All values below come from the design system [D] unless marked otherwise.

| Area | Decision |
|---|---|
| Philosophy | Understated, editorial, light only. No dark mode, gradients, glass, parallax, entrance animation, carousels, pop-ups [D A.4] |
| Palette | Paper `#F7F4EC`, Surface `#FDFCF8`, Sunken `#EFEBDF`, Ink `#17191A`, Secondary ink `#4A4F4C`, visible border `#827D71`, Peach `#F4D9C6` = Projects, Blue `#D2E0EA` = Research, Sage `#D5E2D0` = Writing, Lime `#D3F03C` = signal only |
| Lime rule | CTAs, small highlights and focus shadow, always with dark text. Never as text or large backgrounds |
| Typography | Serif display, system sans body, mono for short labels (existing stacks; read exact strings from CSS). No thin body weights. Preserve existing `clamp()` headings |
| Suggested type targets (verify against current CSS before changing) | H1 52 to 76 px desktop / 42 to 52 px mobile; H2 34 to 50 / 30 to 36; project H3 24 to 30 / 21 to 25; body 16 to 18 / 16; metadata 12 to 13 [P-A] |
| Reading measure | 60 to 70 characters; unchanged for articles |
| Container | Keep the existing max width (reported `76rem` [P-A], verify). The `1120px` proposed by C is rejected |
| Spacing guidance | Section padding about 72 to 88 px desktop, 52 to 64 px tablet, 40 to 52 px mobile; card padding 28 to 32 px / 20 to 24 px; page gutter 16 to 20 px mobile, 32 to 72 px desktop [P-A, adopt only where existing tokens do not already define it] |
| Buttons | Two styles only: lime filled primary; outlined/text secondary. Consistent height; ≥ `2.75rem` tap target on mobile |
| Cards | Project = peach tint; Research = blue; Writing = sage. Thin border, no shadow, restrained radius (read existing values) |
| Section backgrounds | Paper dominant; tinted bands for content types; one dark closing band |
| Icons | None added. Only the existing menu indicator and the external-link arrow |
| Illustration | Geometric motif. Real screenshots and architecture diagrams inside project pages. **No generic robot/brain/stock imagery** |
| Motion | Short hover/focus transitions, optional smooth anchor scroll, all disabled under `prefers-reduced-motion` |
| Accessibility | WCAG 2.2 AA; re-audit contrast for any new pairing; visible focus; no colour-only meaning |

**No second design language is introduced.** The project card is a new *variant* of existing cards, not a new system.

---

## 10. Responsive Design and Breakpoint Strategy

**Approach: mobile-first**, with fluid type and spacing (`clamp()`), CSS Grid and Flexbox. Reuse the existing small set of media queries (reported `34rem`, `48rem`, `52rem` [P-A, verify]; `34rem` confirmed [D]). **Add at most one new breakpoint** (about `56rem` for navigation) and only if screenshots show header crowding.

### Test matrix (verification targets, not breakpoints)

| Category | Width | Verification viewport |
|---|---|---|
| Small mobile | 320 to 375 | 320, 360 |
| Standard mobile | 375 to 430 | 375, 390 |
| Large mobile | 430 to 600 | 430 |
| Tablet | 600 to 900 | 768 (portrait) |
| Small laptop | 1024 to 1280 | 1024 |
| Desktop | 1280 to 1440 | 1280, 1440 |
| Large desktop | 1440 to 1920 | 1920 |

### Behavior

| Area | Mobile | Tablet | Desktop |
|---|---|---|---|
| Navigation | Disclosure menu, stacked, Resume and Contact inside | Row if it fits, else disclosure (decide by test) | Row |
| Hero | One column; CTAs before artwork; artwork about 65 to 75% width | Stacked or two-column if space | Two columns |
| Project cards | 1 column | 1 column below `52rem`, 2 columns above | 2 columns max; single project full width |
| Capabilities | Wrapping tags | Wrapping, 2 columns | 2 columns |
| Research & Writing | Stacked, compact | Stacked or split | Split two-column |
| Images and diagrams | Scale to container; wide diagrams scroll inside their own container only if labels become unreadable | same | same |
| Tables and code | Scroll inside own container [D E.7] | same | same |
| Buttons | Full width or near, ≥ `2.75rem` | Inline | Inline |
| Footer | Stacked | 2 columns | Multi-column row |

**Hard rules:** no page-level horizontal scroll at any width; no hover-only functionality; long URLs wrap.

---

## 11. Content Strategy and Required Information

Nothing below may be invented. Status is as of this document.

| # | Content | Info needed | Where it appears | Presentation | Exists? | Owner action |
|---|---|---|---|---|---|---|
| K1 | Professional positioning | Approved title wording ("Aspiring AI Engineer"?), target role types, 2 to 3 sentence statement | Hero, meta description, About | Eyebrow and short paragraph | **No** | Approve or write |
| K2 | About | BBA details to publish; training programme name, dates, modules (verified); whether any internship exists and what it was (describe accurately, never as employment); current focus | `/about/`, homepage section | Short prose, no invented history | Only "BBA" confirmed [H] | Provide and verify |
| K3 | Technical skills | Each skill: used in which project, or currently learning. List only tools actually used; a course syllabus lists far more than any project will | Capabilities | Two tiers, linked to projects | **No** | Confirm per skill |
| K4 | Specialization areas | ML, NLP, generative AI, etc. the owner can substantiate | Hero focus line, Capabilities | Short phrases | **No** | Confirm |
| K5 | Featured projects | Names, one-line problems, provenance, status, stack, repo and demo URLs | Home, Projects | Cards plus case studies | **No** (schema exists, zero documents) [H 6.2] | Provide verified material |
| K6 | Case studies | Per section 12 | `/projects/<slug>/` | Long-form Portable Text with diagrams | **No** | Provide material, then approve copy |
| K7 | Certifications and learning journey | Only verified items, each under its real issuer, with date; placed after projects, not above them; no wording that implies endorsement by a third party the course disclaims | About, optionally Capabilities | Short list | **No.** Proposal D read the DataMites brochure; its contents are unverified here | Provide certificates and the brochure |
| K8 | Resume | Current PDF consistent with the site | Header, hero, contact, footer | Download link | **No** | Provide |
| K9 | GitHub | Verified profile URL, which repos are public | Hero, contact, footer, project cards | Link | **Unknown** | Provide |
| K10 | LinkedIn | Verified URL | Hero, contact, footer | Link | **Unknown** | Provide |
| K11 | Contact email | Professional address | Contact, contact strip, footer | `mailto:` link | **No** [H 6.6] | Provide |
| K12 | AI-assistance disclosure | Wording | Footer, project pages, About | One proportionate sentence | **No** (undecided [S 7.2, H 5]) | Approve wording |
| K13 | Research/writing curation | Which 2 to 3 items to feature | Home | Cards | Partly (currently 3 chosen by the agent, unreviewed [H 8.9]) | Review |
| K14 | Availability line | Whether to state availability/location | Contact strip | One line | **No** | Decide; default is omit |
| K15 | Privacy of personal details | Which of phone number, home address, date of birth appear anywhere | Resume PDF only, if at all | Never on web pages; email, LinkedIn and GitHub are the public contact routes | **No** | Decide |

### Skill honesty framework

| Category | May appear on site? | Condition |
|---|---|---|
| **Demonstrated** | Yes | Linked to a project or repository showing it |
| **Learning** | Yes, labeled "Currently learning" | Genuinely in progress |
| **Not established** | **No** | Do not list |

### Project provenance labels (required on every project)
`Independent` · `Built during training` · `Guided exercise` · `Collaborative`. Where AI tools materially assisted, a proportionate disclosure appears using owner-approved wording [S 7.2].

---

## 12. Project Showcase and Case Study Structure

### 12.1 Project card (homepage and listing)
Title · provenance label · status · one-sentence problem · stack tags · GitHub link · demo link (only if live) · "Read case study".

### 12.2 Case study template (merged from [S 7.4] and Proposal A/B)
Omit any section for which there is no reliable information; never pad.

1. **Overview**: title, category, status, provenance, dates.
2. **Problem and context**
3. **Objective and constraints**
4. **Approach and alternatives considered**
5. **Architecture**: diagram as an image with alt text and caption (**not Mermaid**; no Mermaid library is installed [H 8.6])
6. **Technology stack**: what each piece does
7. **Implementation**: key decisions; **what came from a course scaffold or guided exercise versus what the owner built or changed** ("started from the scaffold; I changed X, Y, Z"); what was AI-assisted versus personally done
8. **Evaluation**: dataset, split, baseline, metric and a small results table, only if real; test conditions and method
9. **Failure analysis, challenges and limitations**: two or three real failures found, and what would be fixed with more time
10. **Lessons learned and next improvements**
11. **Personal contribution**
12. **Links**: real repository, demo, documentation

### 12.3 Rules
- Metrics, accuracy figures, user counts or latency numbers appear only if the owner can reproduce and explain them.
- Screenshots must be real. Placeholder figures are labeled development-only and never ship.
- Old project case studies are not reused as written [H 4]; rewrite from currently verified material.
- The owner must be able to explain every claim in an interview.
- Do not use "production-grade", "enterprise" or "deployed at scale" unless the project has tests, monitoring and real users.
- A guided base is labeled as such on the card and the page; a project with no owner-built extension is described as a guided exercise, not an independent project.
- List a tool or library only if it was actually used in that project.
- The five project areas in the DataMites brochure (as reported by proposal D: predictive ML with a tested API, RAG with evaluation, bounded agent workflow, CV or document AI, BI dashboard) are candidate topics only. Document one only if it has really been built.

---

## 13. Technical Implementation Specification

**Verification note:** file paths below come from the context pack [C]. Anything about file *contents* is marked "verify".

### 13.1 Architecture to preserve
Astro 7, TypeScript strict, Tailwind v4 + `paper-signal.css`, Sanity client (`src/lib/sanityClient.ts`), `ProductionPaperSignalLayout.astro`, `PortableText.astro`, `VisualFigure.astro`, static output, Cloudflare Pages build with `SANITY_REQUIRE_LIVE=true`. **No new CMS, database, framework or dependency without approval.**

### 13.2 Task list

| ID | Task | Expected result | Files (verify) | Depends on | Priority | Acceptance criteria |
|---|---|---|---|---|---|---|
| T0 | Repair release: `derivedPosts` fix on RES-014/015, Batch 4 live re-check | Derived Writing sections render; importer emits references | `migration/import-batch.cjs`, `migration/lib/*`, templates; Sanity patch needs owner approval [H 10] | Owner Q1 | **Critical** (carried over) | GROQ count of non-null `derivedPosts[]->` = 5 and 5; live-only build passes |
| T1 | Navigation rework | New order; Resume added; Topics removed from nav | `src/layouts/ProductionPaperSignalLayout.astro` (header component location: verify) | K8 optional (link can be added once PDF exists) | Critical | Links correct on all routes; `aria-current` correct; disclosure works with keyboard |
| T2 | Footer social/contact block | GitHub, LinkedIn, email, resume | layout file (verify) | K9 to K11 | High | No unverified URL present |
| T3 | Remove fixtures and placeholders from public routes | No sample content, no fixture notices | `src/data/fixtures.ts` consumers; `src/pages/{projects,topics,collections,now,elsewhere,search}` | T4, owner approval for deletes | Critical | Production build contains none of: "Sample project", "Development fixture", "placeholder" |
| T4 | Projects data from Sanity | `/projects/` and detail pages from `project` documents | `src/lib/sanityClient.ts`, `src/pages/projects/*`, `src/sanity/schemaTypes/project.ts` | Schema check (T5) | Critical | Page renders from Sanity; handles 0, 1, 2, 3+ items |
| T5 | Project schema review | Fields cover provenance, status, stack, links, AI-assistance, evaluation notes, featured flag, long-form body | `src/sanity/schemaTypes/project.ts`, `migration/schema/documents/project.ts` | None | High | Written gap list; any schema change flagged as High effort and approved first |
| T6 | Homepage restructure | Sections per section 7 | `src/pages/index.astro` | T4 | Critical | Order matches section 7; sections with no data are omitted, not stubbed |
| T7 | Hero rewrite | Eyebrow, copy, CTAs | `src/pages/index.astro`, `paper-signal.css` | K1, K8 to K10 | Critical | Approved copy only; CTAs above artwork on mobile |
| T8 | Project card component | Variant using peach tint | new component under `src/components/` (name to decide) | T4 | High | Matches design tokens; no shadow; keyboard accessible |
| T9 | Capabilities component | Two-tier grouped list | new component | K3 | High | Every "used" item links to a project |
| T10 | About and Contact pages | Real copy | `src/pages/about.astro`, `src/pages/contact.astro` | K2, K11 | Critical | No "pending" or placeholder text |
| T11 | Resume asset | PDF served from site | `public/` path (verify) | K8 | Critical | Link returns 200; content matches site claims |
| T12 | Research & Writing homepage selection | 2 to 3 items, compact | `src/pages/index.astro` | K13 | Medium | Owner-reviewed selection |
| T13 | Prototype and fixture route exclusion | Not in production | `src/pages/design-exploration/*`, sample routes | Owner approval | High | Not reachable on production; if kept, `noindex` and no links |
| T14 | Metadata and SEO | Titles, descriptions, canonical, OG, sitemap, robots, JSON-LD (Person/WebSite/Article) | layout, config (verify) | Approved copy | High | See section 14 |
| T15 | Redirects | `/blog/*` → `/writing/*` and V1-only routes | Cloudflare config (verify mechanism) | V1 URL inventory (`D:\goutamprusty-v1`, read-only) | High | Redirect list approved by owner before building |
| T16 | Responsive pass | All matrix widths clean | `paper-signal.css` | T6 to T10 | High | Owner-supplied screenshots, not agent prose |
| T17 | Accessibility and performance pass | Audit fixed | all | T16 | High | Section 14 criteria |
| T18 | Release plumbing | Deploy hook, Sanity webhook, export backup | external | Owner | Medium | Hook URL in local `.env` only |
| T19 | Launch | Merge to `main` (owner-approved), Cloudflare production branch switched, domain connected, V1 kept deployable for rollback | external | All critical | Critical | Section 16 |

### 13.3 Data model notes
- Content stays in Sanity: `project` documents for projects, existing `research` and `writing` types for the library.
- Homepage featured projects use a `featured` flag (the handover states `featured` exists as a field for research/writing [H 5]; confirm it exists on `project`).
- Resume and profile URLs: store as site configuration (a typed config module or Sanity singleton; decide in T5, prefer the simpler one).
- Sanity writes require explicit owner authorization naming IDs, dataset and change [H 2.5].

### 13.4 Interaction and animation
Only existing native disclosure plus hover/focus transitions. No new JavaScript. Any JavaScript beyond this requires a stated need.

### 13.5 Testing and validation (every implementation prompt)
`npm run check`, `npm run build`, live-only build (`$env:SANITY_REQUIRE_LIVE='true'; npm run build; Remove-Item Env:SANITY_REQUIRE_LIVE`), `npm run test:auth`, migration suites with per-suite counts. **Page counts will change when fixtures and prototypes are removed; report the new expected count, do not flag the change as a defect.** After any Sanity import or content change, deploy the **latest commit** and read `HEAD is now at <hash>` in the build log [H 2.7].

---

## 14. Accessibility, Performance and SEO Requirements

### Accessibility (target WCAG 2.2 AA) [S 12, D K]
- Semantic landmarks and heading order (one H1 per page).
- Skip link, labeled nav, visible focus (dark outline + lime shadow), `aria-current`.
- Contrast audited for every new pairing; lime never used as text.
- Tap targets ≥ `2.75rem`.
- Alt text on meaningful images; diagrams have text alternatives and captions.
- Tables and code scroll in focusable named containers.
- Reduced-motion honored.
- External links descriptive ("GitHub profile", not "click here").
- Verified by keyboard testing and a real check, not by reading CSS.

### Performance [S 12]
Static pages; no new JavaScript; images as WebP with explicit dimensions; check image weights across the 90 existing images [C] and new screenshots; no third-party scripts; measure after build.

### SEO [S 11]
Unique titles/descriptions per page; canonical tags; sitemap; `robots.txt`; Open Graph with a social-preview image so shared links look right (optional low-priority "last updated" date on the About or Projects page); JSON-LD **only for visible, verified facts** (`Person`: name and verified profile URLs; **no `jobTitle` unless owner approves**); `Article`/`BlogPosting` for the library; correct status codes and approved redirects; prototype and fixture routes excluded or `noindex`. No promises about rankings or AI-search inclusion.

---

## 15. Prioritized Development Roadmap

**Parallel track (starts now, no code):** the owner collects and verifies content K1 to K14. Phases below consume it. This is the true critical path.

### Phase 0: Carry-over repair release (Critical)
- **Objective:** close known data defects before redesign work.
- **Tasks:** T0; owner spot-check of live pages on a phone and desktop (handover Step 0).
- **Dependencies:** owner approval Q1.
- **Completion:** per T0 criteria; Cloudflare log shows the new commit.
- **Sequence:** first. Independent of Phases 1 to 5 except that it must not be left unresolved at launch.

### Phase 1: Foundation and structure (Critical)
- **Objectives:** new IA and a clean public surface, with no new copy required.
- **Tasks:** T5 (schema review), T1 (nav), T4 (Projects from Sanity with honest empty state), T3 (remove fixtures and hide search, Now, Elsewhere, Collections, Topics from nav), T13 (prototype exclusion, owner approval), T6 skeleton (section order with data-driven sections).
- **Dependencies:** owner approvals for deletes; T5 before T4.
- **Completion:** no placeholder or fixture string in the production build; nav matches 6.1; build passes.
- **Order:** T5 → T4 → T3/T1 (parallel) → T6 skeleton.

### Phase 2: Homepage and content (Critical)
- **Objectives:** recruiter-ready content on the new structure.
- **Tasks:** T7 hero, T8 project card, T9 capabilities, T10 About/Contact, T11 resume, T2 footer, T12 selection, first project document(s) written in Sanity (owner-authorized).
- **Dependencies:** K1 to K11 supplied and approved; T8 before real projects render.
- **Completion:** all required content live; 7.2 to 7.7 match spec; every claim traceable to owner-supplied facts.
- **Independent within phase:** T8, T9, T11, T2 can proceed in any order once data exists. T7 and T10 wait for copy.

### Phase 3: Visual refinement (High)
- **Objectives:** consistency and hierarchy.
- **Tasks:** type and spacing check against 9; card variants consistent; correct stale CSS comments; project screenshots and architecture diagrams added to case studies.
- **Dependencies:** Phase 2.
- **Completion:** owner reviews desktop and phone screenshots and approves; no second design language.

### Phase 4: Responsive optimization (High)
- **Objectives:** every matrix width clean.
- **Tasks:** T16; decide the `56rem` nav switch from evidence; check tables, code, figures, long titles.
- **Dependencies:** Phase 3.
- **Completion:** screenshots saved and listed per width (320 to 1920); zero page-level horizontal scroll.

### Phase 5: Quality and launch readiness (Critical for launch)
- **Tasks:** T14, T15, T17, link check, cross-browser sanity (Chrome, Safari/iOS, Firefox, Edge), T18, T19.
- **Dependencies:** all prior phases; owner approval for merge to `main`, branch switch, domain.
- **Completion:** section 16 checklist all true.

### Post-launch (Medium/Low)
Search (needs approval for a dependency), Topics taxonomy and `topic` documents, Now page, RSS, more case studies, Mermaid decision, citation polish.

---

## 16. Acceptance Criteria and Definition of Done

### Launch gate (all must be true)
- [ ] At least **1** complete, owner-approved case study (target 2 to 3) with real links; every project carries a provenance label.
- [ ] Hero, About, Contact use **owner-approved** copy only; no invented title, experience, metric, or claim.
- [ ] Real contact email, verified GitHub and LinkedIn, resume PDF downloadable and consistent with the site.
- [ ] No fixture, sample, placeholder, "pending" or disabled-feature text in the production build.
- [ ] Prototype and fixture routes excluded or `noindex`; no links to hidden pages.
- [ ] Nav matches 6.1 and works by keyboard and touch.
- [ ] Capabilities list contains only Demonstrated or Learning items.
- [ ] `derivedPosts` repaired (Phase 0) and Batch 4 images verified on live.
- [ ] Owner-supplied screenshots confirm layout at 320, 375, 768, 1024, 1440 px.
- [ ] No page-level horizontal overflow at any tested width.
- [ ] Titles, descriptions, canonicals, sitemap, robots, OG present; JSON-LD matches visible content.
- [ ] Redirects approved and tested; V1 remains deployable for rollback.
- [ ] Build passes: check, build, live-only build, auth test, migration suites with per-suite counts.
- [ ] Contrast and keyboard checks pass; reduced-motion honored.
- [ ] Cloudflare deploys the **latest** commit (log confirms hash and page count).
- [ ] Merge to `main`, production-branch switch and domain connection owner-approved.

### Per-section criteria
Each section in 7.x is done when it follows its Content, Layout and Dependencies lines, renders correctly at all widths, and omits itself gracefully when data is absent.

---

## 17. Outstanding Questions, Dependencies and Assumptions

### Open questions for the owner (ask only what blocks the next prompt)

| ID | Question | Blocks |
|---|---|---|
| Q-1 | Authorize patching `RES-014` and `RES-015` `derivedPosts` in Sanity `development` (handover Q1)? | Phase 0 |
| Q-2 | Does the old-domain replacement also cover the visible text in `BLG-022`? | Low |
| Q-3 | What projects exist, and what can be honestly shown (name, status, repo, demo, provenance)? | Phase 2 gate |
| Q-4 | Approve hero eyebrow ("Aspiring AI Engineer" by default, or "Entry-level AI Engineer") and headline "Curiosity, made useful."? | T7 |
| Q-5 | Exact training programme name, dates, modules, certificates (documents)? Was there an internship, and what exactly was it? Please share the brochure so the tool and project-area claims can be verified | T10, K7 |
| Q-6 | Professional email, GitHub URL, LinkedIn URL, resume PDF? | T2, T10, T11 |
| Q-7 | Which skills can you demonstrate, and which are in progress? | T9 |
| Q-8 | AI-assistance disclosure wording? | Footer, About, projects |
| Q-9 | Approve deleting fixture and prototype routes (tracked files)? | T3, T13 |
| Q-10 | Approve new nav order and removing Topics from nav? | T1 |
| Q-11 | Keep or drop Now, Elsewhere, Collections at launch (defaults: hold, fold, remove)? | T3 |
| Q-12 | Which research and writing items to feature on the homepage? | T12 |
| Q-13 | Deploy hook created? Production-dataset and domain plan? | Phase 5 |
| Q-14 | Reuse `PRJ-*` IDs for new project documents? | T4 |
| Q-15 | Publish an availability line? | Optional |
| Q-16 | Which personal details (phone, address, date of birth) may appear on the resume PDF? None go on web pages | T11 |
| Q-17 | Are any of your projects already hosted as live demos, or will they be? | Optional |

### Assumptions (revisit if false)
- The owner's goal and "aspiring" framing are correct; wording needs explicit approval.
- Proposal A's file-content claims are unverified until the codebase is read.
- The Sanity `project` schema may need extensions; this is unknown.
- Cloudflare production branch is probably the feature branch [H 6.4].
- The visual state of the live site is unknown until screenshots arrive.
- Proposal C had no repo or live access; D read page text only and relied on practitioner opinion; neither is treated as verification.
- Brochure details (tools, project areas, certificate wording) come from D alone and are unverified.

### Dependencies
Content K1 to K14 → Phase 2. Project schema review → Projects from Sanity. Owner approvals → deletes, Sanity writes, dependencies, merges, deployments, DNS.

---

## 18. Instructions for the Next ChatGPT Development Session

### Role of each document

| Document | Role | Authority |
|---|---|---|
| **This master plan** | The redesign blueprint: what to change, in what order, with what acceptance criteria | Primary for *redesign decisions* |
| `PROJECT_HANDOVER_v5.md` | Current implementation state, process rules, Antigravity prompt rules, defects, approvals policy | Primary for *state and process*; its section 2 rules govern how you write prompts |
| `WEBSITE_THEME_AND_UI_UX_DESIGN_SYSTEM.md` | Visual standards and tokens | Primary for *appearance*, except the changes listed in 5.3 |
| `WEBSITE_BUILD_SPEC_FOR_CODEX.md` | Technical and product constraints, honesty rules, phases | Primary for *constraints* |
| `context-pack.txt` | Real file paths and git state | Source of truth for *what exists*; **regenerate it first** (handover Appendix A) |

If two documents genuinely conflict, say so and ask; do not silently pick one. Section 5.3 of this plan lists the deliberate overrides.

### What to do

1. **Read all five documents** before proposing anything. Check the git state in the fresh context pack against `ad8779b`.
2. **Understand the current code** before changing it. Where this plan says "verify", locate the real file or value first. Use "locate X" in prompts instead of guessing.
3. **Follow this plan's order.** Start with Phase 0 (the repair release), then Phase 1.
4. **Preserve established architecture and design decisions.** No rebuild, no new CMS, no new dependency, no new colors or fonts without approval.
5. **Work incrementally: one prompt, one milestone, ending in a pushed commit** (handover 2.3). Write the prompt in the handover 2.8 template, with an effort level and a one-line reason. Output PowerShell 5.1 syntax. Never leave a bracketed authorization placeholder.
6. **Complete and validate one phase at a time.** Do not start the next phase while the previous phase's completion criteria are unmet.
7. **Ask for clarification only when essential, and at most one question,** while still giving a prompt that does not depend on the answer (handover 2.9). The content questions in 17 gate Phase 2, not Phase 0 or 1.
8. **Never invent content or claim unverified functionality.** No biography, skills, metrics, certifications, URLs, slugs or paths that are not in the documents or an owner-supplied fact. Label agent-reported claims as agent-reported.
9. **Verify before marking complete.** Responsive and visual checks require **owner-supplied screenshots** or saved screenshot files listed by the agent, not prose descriptions (handover section 8). Trust HTTP codes and build logs over agent narration.
10. **Maintain the documentation.** When a decision changes, update the relevant document (design system for nav and homepage changes, handover for state) in the next prompt that touches the files, rather than writing a separate documentation prompt.

### Standing approvals reminder
Pre-authorized: staging exact paths, commit and push to the named feature branch after checks pass, read-only Sanity queries, deleting the agent's own scratch files. **Always ask first:** Sanity writes (name IDs, dataset, change), dependency changes, deleting tracked files, anything on `main`, merges, deployments, DNS, changing content text.

### Suggested first message in the new session
*"Read all five documents. Follow section 18 of the master plan. Tell me in at most one question what blocks the next prompt, then give me the next Antigravity prompt (Phase 0, then Phase 1). No plan, no menu of options, no audit first."*
