# Project Case Study Draft: Inkline (Resume Builder)

> **Status:** Private Review Draft â€” Owner Confirmation Required
> **Storage Location:** `docs/drafts/inkline-case-study.md` (Internal only; strictly excluded from public site build and deployment)
> **Source Repository:** [github.com/goutam-prusty/inkline](https://github.com/goutam-prusty/inkline)
> **Inspection Date:** 24 November 2026

---

## 1. Project Overview & Intended Use

Inkline is a client-side, keyboard-driven resume builder built with Next.js 15, React 18, TypeScript, and Zustand. The application allows users to draft, preview, score, and export structured professional resumes entirely within the browser without requiring user account registration or a server-side database.

All resume data is persisted locally in browser `localStorage`. Network requests are limited to optional AI writing routes (`/api/ai/*`) and local asset handling.

- **Intended Use:** Rapid authoring and formatting of professional resumes with real-time visual feedback, rule-based ATS alignment checks, client-side PDF export, and text-run PDF import.
- **Live Deployment Status:** None verified from repository evidence. The repository documents local execution (`next dev`) and standard Next.js hosting configuration, but does not specify a live public production URL.

---

## 2. User Need & Problem Definition

Based strictly on repository documentation and architectural evidence:

1. **Format Disconnect:** Resume authors frequently encounter discrepancies between web-based form editors and downloaded PDF outputs. Inkline addresses this via a unified data model that feeds both an on-screen HTML preview and a matching vector PDF document.
2. **Opaque ATS Scoring:** Many commercial resume utilities present black-box "scores" without actionable explanations. Inkline implements a transparent, rule-based scoring engine with explicit findings and weighted criteria.
3. **Data Privacy:** Users often hesitate to upload sensitive career histories to third-party databases. Inkline defaults to local-first browser storage (`localStorage`) with zero server persistence.
4. **Writing Assistance Availability:** Traditional AI resume tools fail completely when unconfigured or offline. Inkline pairs optional LLM generation with deterministic heuristic fallbacks so all writing utilities function without an API key.

---

## 3. Verified Features Present in Source Code

The following features were demonstrably verified through direct inspection of the repository source code:

### A. Structured Resume Editor (`src/components/editor/`)
- **Core Sections:** Comprehensive schema and form controls for Personal Information / Basics (name, email, phone, location, headline), Professional Summary, Work Experience, Education, Technical Projects, Grouped Skills, Certifications, Languages, Awards, and Interests.
- **Drag-and-Drop Reordering:** Interactive section reordering implemented via `@hello-pangea/dnd` (`section-reorder-panel.tsx`).
- **Section Visibility:** Toggle switches permitting individual sections to be hidden from preview and export without deleting data.

### B. Dual-Target Rendering Engine
- **Live HTML Preview (`src/components/preview/resume-preview.tsx`):** Instant re-renders driven by Tailwind CSS and client-side Zustand state subscriptions.
- **Vector PDF Export (`src/components/pdf/resume-document.tsx`):** Native PDF generation using `@react-pdf/renderer` ensuring typography, colors, and layout match the on-screen view.
- **Three Selectable Templates:**
  - `aurora`: Clean single-column layout with accented headers.
  - `slate`: Two-column layout featuring a dark sidebar for skills, languages, and secondary sections.
  - `monogram`: Editorial header layout featuring a monogram initials badge.
- **Design Token Customization (`theme-panel.tsx`):**
  - Font families: Inter, Source Serif 4, JetBrains Mono.
  - Spacing density: Compact (`gap-2.5`), Comfortable (`gap-4`), Spacious (`gap-6`).
  - Accent colors: Configurable color presets mapped to headings and borders.

### C. State Management & Undo Architecture (`src/lib/store/`)
- **Zustand Store (`use-resume-store.ts`):** Single normalized resume state map with `persist` middleware saving to `localStorage`.
- **Temporal Middleware (`temporal.ts`):** Custom-built history tracking with time-window edit coalescing (merges rapid keystrokes into discrete undo/redo steps).
- **Keyboard Navigation:** Command palette (`cmdk`) providing keyboard shortcuts (`âŒ˜K`) for section jumping, template switching, and export triggers (`builder-shell.tsx`).

### D. Client-Side PDF Import Pipeline (`src/lib/parse/`)
- Four-stage client-side PDF ingestion pipeline:
  1. `read-pdf.ts`: Extracts positioned text items and coordinates using `pdfjs-dist`.
  2. `lines.ts`: Merges items on shared coordinates into lines and groups lines into sections via heading heuristics.
  3. `extract.ts`: Maps section lines to resume fields using conservative regex pattern matching (dates, contact tokens, bullet points).
  4. `index.ts`: Orchestrates file reading into structured resume imports.

### E. Explainable Resume & ATS Scoring (`src/lib/scoring/analyze-resume.ts`)
- Fixed, weighted rule-based analysis returning a 0â€“100 score and explicit human-readable findings:
  - **Contact completeness (Weight: 8):** Verifies email and phone presence.
  - **Summary length (Weight: 10):** Checks for optimal 20â€“80 word count.
  - **Quantified achievements (Weight: 20):** Measures percentage of bullets containing numeric metrics or percentages.
  - **Strong action verbs (Weight: 15):** Checks bullets starting with designated action verbs (Led, Built, Designed, Shipped, Scaled, etc.).
  - **Passive phrasing detection (Weight: 10):** Flags weak phrases ("responsible for", "duties included", "helped with").
  - **Bullet length sanity (Weight: 7):** Flags excessively long bullets (>32 words).
  - **Work experience presence (Weight: 10):** Ensures at least one role is documented.
  - **Section coverage (Weight: 10):** Evaluates presence across experience, education, and skills.
  - **Job Description Keyword Alignment:** Tokenizes pasted job descriptions and computes matched and missing keyword lists.

### F. AI Writing Assistance with Deterministic Fallback (`src/app/api/ai/`, `src/lib/ai/`)
- **API Endpoints:**
  - `POST /api/ai/bullet`: Tightens bullet points and leads with action verbs.
  - `POST /api/ai/summary`: Generates a professional summary from structured resume data.
  - `POST /api/ai/cover-letter`: Generates a tailored cover letter given target company and role names.
- **Provider & Fallback Architecture:**
  - Primary: Calls OpenAI API (`gpt-4o-mini`, temperature 0.6) via `completeWithFallback` (`src/lib/ai/client.ts`).
  - Fallback: When `OPENAI_API_KEY` is unset or an API call fails, seamlessly falls back to `src/lib/ai/heuristics.ts`.

---

## 4. Architecture & Technology Stack

Verified directly against `package.json` and configuration files:

| Layer | Technologies | Verification Source |
|---|---|---|
| **Framework** | Next.js 15.5.20 (App Router), React 18.3.1, TypeScript 5.6.3 | `package.json` |
| **Styling & UI** | Tailwind CSS 3.4.14, Radix UI Primitives, Lucide React, Framer Motion 11.11.17 | `package.json`, `tailwind.config.ts` |
| **Command Palette** | `cmdk` 1.0.4 | `package.json`, `command-palette.tsx` |
| **State & Storage** | Zustand 5.0.1, custom temporal undo middleware, `localStorage` | `src/lib/store/` |
| **Form Validation** | React Hook Form 7.53.2, Zod 3.23.8 (`resumeSchema`) | `src/lib/schema/resume.ts` |
| **Drag & Drop** | `@hello-pangea/dnd` 17.0.0 | `package.json`, `section-reorder-panel.tsx` |
| **PDF Generation** | `@react-pdf/renderer` 4.1.5 | `src/components/pdf/resume-document.tsx` |
| **PDF Extraction** | `pdfjs-dist` 4.9.155 | `src/lib/parse/read-pdf.ts` |
| **AI / Heuristics** | `openai` 4.71.1, deterministic TypeScript heuristic engine | `src/lib/ai/client.ts`, `heuristics.ts` |
| **Testing** | Vitest 2.1.5, React Testing Library 16.0.1, Playwright 1.48.2 | `package.json`, `tests/` |

---

## 5. AI/LLM Integration vs. Deterministic Fallback Flow

Inkline establishes a strict dual-path architecture for all AI-assisted capabilities:

```
[User Trigger: Rewrite Bullet / Generate Summary / Cover Letter]
                           â”‚
                           â–¼
              [Next.js API Route Handler]
              (src/app/api/ai/*/route.ts)
                           â”‚
             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
             â–¼                           â–¼
[OPENAI_API_KEY Present?]     [No Key / API Error]
             â”‚                           â”‚
    (Yes)    â–¼                           â–¼
  [OpenAI API Call]              [Deterministic Heuristic]
  Model: gpt-4o-mini             (src/lib/ai/heuristics.ts)
  Temp: 0.6, Max tokens: 400     â€¢ Regex stripping of filler phrases
  System prompt constrained      â€¢ Action verb injection from static list
             â”‚                   â€¢ Template-driven field assembly
             â”‚                   â€¢ Zero network calls, zero hallucination
             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                           â–¼
       [JSON Response: { text, source: "openai" | "heuristic" }]
```

- **Deterministic Fallback Behavior:** The heuristic engine in `src/lib/ai/heuristics.ts` executes pure rule-based logic without any machine learning runtime. For bullet rewriting, it strips weak openers ("responsible for", "duties included") via regular expressions and prefixes an action verb selected deterministically. For summaries and cover letters, it maps existing structured fields into structured sentence templates.

---

## 6. Testing & Quality Assurance

### Tests Found in Repository
- **Unit Tests (`vitest`):**
  - `tests/unit/analyze-resume.test.ts` (4 test cases): Scores blank resumes, scores sample resumes, detects passive phrasing, matches target keywords.
  - `tests/unit/resume-schema.test.ts` (3 test cases): Validates default schema values, verifies email validation rejections, checks sample data consistency.
  - `tests/unit/parse-lines.test.ts` (3 test cases): Verifies row merging, line break detection, and section header splitting.
- **End-to-End Tests (`@playwright/test`):**
  - `tests/e2e/smoke.spec.ts` (2 test cases): Tests landing page navigation to `/builder` and verifies builder section switching.

### Testing Execution Status in Review Environment
- The test specifications above were inspected and verified statically from the repository source code.
- Unit and end-to-end tests were **not executed** within this audit environment because npm dependencies were not installed in the read-only inspection sandbox.

---

## 7. Omitted & Unverified Claims

To preserve strict content integrity:
- **No User or Adoption Metrics:** No user counts, traffic metrics, resume export statistics, or performance benchmarks are claimed.
- **No Commercial Claims:** No customer satisfaction ratings, conversion rates, or commercial claims are made.
- **No Live Public URL:** No live hosted website is cited as verified.

---

## 8. Owner Confirmation Required (Decisions Needed)

Before this project can be considered for inclusion in public portfolio case studies, the owner must confirm:

1. **Project Provenance:**
   - [ ] Independent personal project
   - [ ] Built during training / coursework
   - [ ] Guided exercise / tutorial adaptation
   - [ ] Collaborative project
2. **Personal Design & Implementation Ownership:**
   - Clarification of which architectural layers, components, algorithms (scoring, PDF parsing), and styling the owner personally wrote from scratch.
3. **AI Assistance Disclosure:**
   - Whether and how AI coding tools (e.g., Cursor, Claude, ChatGPT, GitHub Copilot) were utilized during the design, coding, or testing of Inkline.
4. **Public Deployment & Demonstration:**
   - Whether a live deployment on Vercel or Cloudflare should be established and verified for the portfolio.
