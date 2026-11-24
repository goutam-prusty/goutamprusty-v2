# Sanity CMS Project Document Inventory & Publication Readiness Report

> **Status:** Private Discovery Report â€” For Owner Content Planning
> **Storage Location:** `docs/drafts/sanity-project-inventory.md` (Internal only; strictly excluded from public site build and deployment)
> **Evaluation Date:** 24 November 2026
> **Target Dataset:** `development` (Project: `l94q5yx8`)
> **Audit Mode:** Strictly Read-Only (Zero content writes, zero mutations)

---

## 1. Executive Summary

This inventory audits the current state of engineering project documents in Sanity CMS, reviews the existing schema definitions and query constraints in the codebase, and evaluates the publication readiness of three candidate projects based on their private case-study review drafts:
- **Inkline:** Client-side resume builder and ATS analyzer (`docs/drafts/inkline-case-study.md`)
- **AI Engineer Command Center:** Personal curriculum and learning management workspace (`docs/drafts/command-center-case-study.md`)
- **Vitaliq:** Full-stack biometric ledger and longitudinal data analytics platform (`docs/drafts/vitaliq-case-study.md`)

### Key Findings
1. **Zero Project Documents in Sanity:** A live read-only query to the configured `development` dataset confirmed that **0 project documents** exist (0 published, 0 drafts).
2. **Zero Project Documents in Local Fallback:** The local migration fixture (`src/data/verticalSliceData.json`) similarly contains 0 project documents.
3. **Empty Projects Page Invariant:** The current public `/projects/` page accurately displays an honest empty state ("No engineering projects are currently published").
4. **Three Viable Candidates:** All three candidates possess verified public codebases and working technical architectures. However, none can be published yet because essential owner decisions regarding **provenance**, **personal implementation scope**, and **AI-assistance attribution** remain unconfirmed.

---

## 2. Query Approach & Authentication Method

- **Target Project:** `l94q5yx8`
- **Configured Dataset:** `development`
- **Authentication Pattern:** Evaluated using the repository's established server-side resolution hierarchy (`src/lib/sanityClient.ts` via `resolveSanityAuth()`). Authenticated using the local developer CLI configuration (`~/.config/sanity/config.json`) with zero credentials or tokens exposed or printed.
- **Draft Inclusion:** The GROQ query requested all documents matching `_type == "project"` without draft filtering (`*[_type == "project"] | order(_id asc)`), alongside an explicit check for draft IDs (`*[string::startsWith(_id, "drafts.") && _type == "project"]`). Both queries returned 0 results.
- **Dataset Context:** Overall document counts in `development`:
  - `project`: **0**
  - `research`: **21**
  - `writing`: **21**
  - `topic`: **0**
  - `author`: **0**

---

## 3. Schema Structure & Rendering Constraints

Inspected from `src/sanity/schemaTypes/project.ts` and `src/lib/sanityClient.ts`:

### A. Document Type: `project`
- **Required Fields:**
  - `workbookId` (string, e.g., `PRJ-001`, read-only, authoritative inventory key)
  - `title` (string, verbatim project name)
  - `slug` (slug, max length 96)
  - `summary` (text, 3 rows, executive summary)
  - `status` (string enum: `completed`, `published`, `in_progress`, `in-progress`, `archived`, `draft`)
  - `category` (string, e.g., `web-application`, `technology`)
  - `role` (string, exact personal engineering contribution and scope)
  - `techStack` (array of strings, specific tools/libraries)
  - `featured` (boolean, defaults strictly to `false`)
- **Key Optional / Editorial Fields:**
  - `provenance` (enum: `Independent`, `Built during training`, `Guided exercise`, `Collaborative`)
  - `startDate`, `endDate`, `completedDate` (date)
  - `tags` (array of strings)
  - `links` (object with `repo`, `live`, `demo` URLs)
  - `aiAttribution` (text, detailing AI-assisted vs. personal implementation)
  - `evaluationNotes` (text, audit annotations or verification findings)
  - `coverImage` (object with `assetPath` and `alt`)
  - `body` (PortableText, structured case study body)
  - `editorialStatus` (enum: `draft`, `in_review`, `approved`, defaults to `draft`)
  - `editorialNotes` (text)

### B. Public Rendering Query Filter (`src/lib/sanityClient.ts`)
The production query for project listing and detail pages strictly filters for:
```groq
*[_type == "project" && defined(slug.current) && (status == "published" || status == "completed")]
```
Any project document with `status: 'draft'`, `status: 'in_progress'`, or `status: 'archived'` is automatically omitted from public `/projects/` listings and individual routes.

---

## 4. Live Sanity Project Inventory

| Document ID | Workbook ID | Title | Slug | Sanity Status | Editorial Status | Provenance | Featured | Repo URL | Live URL | Body Complete? |
|---|---|---|---|---|---|---|---|---|---|---|
| *(None)* | â€” | â€” | â€” | â€” | â€” | â€” | â€” | â€” | â€” | â€” |

*Current live count: 0 project documents found in Sanity Content Lake (`development` dataset).*

---

## 5. Candidate Projects & Case-Study Readiness Mapping

Three technical projects have been audited and drafted in private review files:

### Candidate 1: Inkline (`docs/drafts/inkline-case-study.md`)
- **Historical Baseline ID:** `PRJ-001` (referenced in migration serialization contracts)
- **Proposed Slug:** `inkline`
- **Application Nature:** Fast, keyboard-driven resume builder with explainable ATS scoring, dual-target rendering (HTML preview and vector PDF export via `@react-pdf/renderer`), client-side PDF ingestion (`pdfjs-dist`), and OpenAI (`gpt-4o-mini`) integration with deterministic regex fallback.
- **Verified Tech Stack:** Next.js 15, React 18, TypeScript, Tailwind CSS, Zustand, `@react-pdf/renderer`, `pdfjs-dist`, Vitest, Playwright.
- **Repository:** `https://github.com/goutam-prusty/inkline` (Public, verified)
- **Live URL:** None verified in repository evidence (documented for local execution / standard Vercel deployment).
- **Missing Owner Decisions:**
  1. Provenance selection (`Independent` vs. `Built during training` vs. `Guided exercise` vs. `Collaborative`).
  2. Personal role description (which components/algorithms were authored personally).
  3. AI-assistance disclosure (extent of Cursor/Claude/ChatGPT/Copilot assistance).

### Candidate 2: AI Engineer Command Center (`docs/drafts/command-center-case-study.md`)
- **Historical Baseline ID:** None in V1 (developed in late 2026; proposed `PRJ-004`)
- **Proposed Slug:** `ai-engineer-command-center`
- **Application Nature:** Personal learning management workspace for tracking AI engineering curriculum progress (20 training weeks), study hours (live, study, practice), project milestones, flashcards, multiple-choice quizzes, journal logs, and Recharts progress analytics. Operates local-first (`localStorage`) with optional Firebase Auth and Cloud Firestore sync on the free Spark tier.
- **Verified Tech Stack:** Vite 8, React 19, TypeScript, Tailwind CSS 4, Motion, Recharts, Firebase, Lucide React.
- **Repository:** `https://github.com/goutam-prusty/ai-engineer-command-center` (Public, verified)
- **Live URL:** `https://ai-engineer-command-center-seven.vercel.app/` (Verified HTTP 200 OK)
- **Missing Owner Decisions:**
  1. Provenance selection.
  2. Personal role description.
  3. AI-assistance disclosure.
  4. Assignment of authoritative workbook ID (`PRJ-004`).

### Candidate 3: Vitaliq (`docs/drafts/vitaliq-case-study.md`)
- **Historical Baseline ID:** `PRJ-002` (referenced in migration serialization contracts)
- **Proposed Slug:** `vitaliq`
- **Application Nature:** Full-stack personal biometric ledger and analytics dashboard for longitudinal tracking of body composition, blood pressure, and blood glucose. Features Domain-Driven Design (DDD) separating domain logic from database persistence, 7-day rolling moving averages, deterministic threshold alerts, and Clerk authentication.
- **Verified Tech Stack:** Next.js 15.1, React 19, TypeScript, Tailwind CSS 4, Neon PostgreSQL, Drizzle ORM, Clerk Auth, Recharts, Vitest, Playwright.
- **Repository:** `https://github.com/goutam-prusty/vitaliq` (Public, verified)
- **Live URL:** `https://vitaliq.vercel.app` (Verified HTTP 200 OK)
- **Safety Boundary Note:** Strictly non-clinical tracking software. Zero diagnostic, clinical treatment, or health advice claims permitted. Zero real patient data.
- **Missing Owner Decisions:**
  1. Provenance selection.
  2. Personal role description.
  3. AI-assistance disclosure.

---

## 6. Assessment Against Master Plan Requirements (Spec Â§7.4)

The build specification defines 11 required structural sections for project case studies where evidence exists:

| Spec Section (Â§7.4) | Inkline (`docs/drafts/inkline-case-study.md`) | Command Center (`docs/drafts/command-center-case-study.md`) | Vitaliq (`docs/drafts/vitaliq-case-study.md`) | Status |
|---|---|---|---|---|
| **1. Problem** | Fully documented from repo | Fully documented from repo | Fully documented from repo | Ready |
| **2. Context & Constraints** | Documented (local-first, no account) | Documented (Spark tier, 20-wk plan) | Documented (relational data, Neon) | Ready |
| **3. Approach & Alternatives** | Inferred from architecture | Inferred from architecture | Inferred from DDD layers | Partial (needs owner input) |
| **4. Architecture** | Fully documented | Fully documented | Fully documented | Ready |
| **5. Technology Used** | Verified in `package.json` | Verified in `package.json` | Verified in `package.json` | Ready |
| **6. Implementation & AI-Assistance** | Omitted pending owner disclosure | Omitted pending owner disclosure | Omitted pending owner disclosure | **BLOCKED (Owner Decision)** |
| **7. Challenges** | Partial (PDF coordinate parsing) | Partial (offline/online sync skew) | Partial (time-series noise smoothing) | Partial (needs owner input) |
| **8. Outcomes & Verifiable Evidence** | Limited to codebase functionality | Limited to codebase functionality | Limited to codebase functionality | Ready (zero metrics invented) |
| **9. Lessons Learned** | Omitted | Omitted | Omitted | Needs owner reflection |
| **10. Personal Contribution** | Omitted pending owner disclosure | Omitted pending owner disclosure | Omitted pending owner disclosure | **BLOCKED (Owner Decision)** |
| **11. Verified Links** | Repo verified; no live URL | Repo & live demo verified (200 OK) | Repo & live demo verified (200 OK) | Ready |

---

## 7. Schema Limitations & Implementation Observations

1. **Required Fields on Schema Ingestion:** The `project` schema requires `role` (string) and `summary` (text) on every document. A project cannot be published without a clear statement of engineering role and scope.
2. **Safe Staging via Draft Status:** When documents are eventually created in Sanity, setting `status: 'draft'` and `editorialStatus: 'draft'` guarantees they remain completely invisible on the public website until full case-study review is complete.
3. **Provenance Enum Enforcement:** The schema enforces one of four exact values: `Independent`, `Built during training`, `Guided exercise`, or `Collaborative`. Custom free-form strings are rejected by validation.

---

## 8. Recommended Next Content Milestone

**Smallest Coherent Next Step:**
Do **not** perform bulk Sanity creation across all three projects simultaneously.

1. **Request Owner Decision on Candidate #1:** Present the owner with the 3 required questions for a single candidateâ€”recommended: **AI Engineer Command Center** (which has an active live demo, recent commits, and ties directly to the current training narrative on the About page) or **Inkline**.
2. **Author Explicit Sanity Draft Document:** Once the owner provides the provenance, role scope, and AI-attribution answers, create a single document in Sanity with `status: 'draft'` (holding it back from public publication).
3. **Verify Rendering Pipeline in Staging:** Test that the Astro project query safely detects the draft without breaking the public empty state, preparing the pipeline for eventual authorized publication.
