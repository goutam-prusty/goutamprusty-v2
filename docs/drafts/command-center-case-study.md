# Project Case Study Draft: AI Engineer Command Center

> **Status:** Private Review Draft â€” Owner Attribution Confirmed & Sanity Proposal Prepared
> **Storage Location:** `docs/drafts/command-center-case-study.md` (Internal only; strictly excluded from public site build and deployment)
> **Source Repository:** [github.com/goutam-prusty/ai-engineer-command-center](https://github.com/goutam-prusty/ai-engineer-command-center)
> **Live Deployment:** [ai-engineer-command-center-seven.vercel.app](https://ai-engineer-command-center-seven.vercel.app/) (Verified HTTP 200 OK)
> **Target Sanity Dataset:** `development` (Project: `l94q5yx8`) â€” Proposed Document ID: `project-PRJ-004`
> **Inspection Date:** 24 November 2026

---

## 1. Product Overview & Intended Learning Use

The AI Engineer Command Center is a personal, single-page web dashboard designed specifically to organize, track, and support the daily coursework and structured progression of an intensive AI Engineering curriculum.

- **Primary Classification:** Personal learning management workspace and productivity tracking utility.
- **Architectural Scope Notice:** This application is strictly an operational tracking dashboard. It does **not** host, train, fine-tune, or execute AI/LLM models, agents, retrieval-augmented generation (RAG) pipelines, or machine learning inference runtimes.
- **Intended Use:** Managing curriculum schedules, tracking topic completion, logging dedicated study sessions, organizing milestone projects, practicing with flashcards and quizzes, recording journal notes, and reviewing study analytics.

---

## 2. Learning-Management Problem Addressed

Based strictly on repository documentation, curriculum schema structures, and code layout:

1. **Curriculum Fragmentation:** Rigorous AI engineering programmes combine disparate learning formatsâ€”instructor-led lectures, self-directed reading, coding practice, and multi-week projects. The Command Center consolidates these parallel tracks into a unified interface.
2. **Progress Visibility:** Long-duration technical curricula (e.g., 20 weeks of instruction plus subsequent project phases) risk loss of momentum without clear pacing metrics. The tool provides visual tracking across weekly study targets and granular topic states.
3. **Active Recall & Retention:** Retaining theoretical foundations (statistics, deep learning architectures, vector representations) alongside practical tooling requires regular spaced review. The workspace embeds module-aligned flashcards and self-assessment quizzes directly alongside topic modules.
4. **Data Portability & Offline Capability:** Learners require continuous access to schedules and notes regardless of network connectivity. The workspace operates fully offline in the browser and synchronizes opportunistically when online.

---

## 3. Verified Features Present in Source Code

The following modules and capabilities were verified through direct inspection of the application source tree (`src/views/`, `src/components/`, `src/context/`):

### A. Dashboard & Weekly Study Planner (`src/views/DashboardView.tsx`, `WeeklyStudyView.tsx`)
- **Pacing Metrics:** Displays current training week, overall curriculum completion percentage, total logged study hours, and active streak.
- **Weekly Hour Allocation:** Tracks progress against user-configured weekly targets: Live Instructor Hours, Self-Study Hours, and Hands-on Practice Hours.
- **Upcoming Schedule:** Visualizes weekly focus areas, upcoming lecture topics, and milestone deadlines across the 20-week training phase.

### B. Curriculum & Learning Path Progression (`src/views/CurriculumView.tsx`, `LearningPathView.tsx`, `src/data/curriculum.ts`)
- **Hierarchical Syllabus:** Modules spanning Python foundations, statistics, machine learning, databases, big data, deep learning, computer vision, natural language processing, LLM application engineering, and agentic workflows.
- **Topic Status Tracking:** Granular progress states for individual topics (Not Started, In Progress, Completed, Needs Revision) with associated notes.

### C. Study Sessions Logger (`src/context/AppStateContext.tsx`, `src/views/DashboardView.tsx`)
- **Session Records:** Captures session date, duration (minutes), category (Live Lecture, Self Study, Practice, Project Work), topics covered, and descriptive notes.

### D. Project Portfolio Tracker (`src/views/ProjectsView.tsx`)
- **Milestone Management:** Tracks required and elective curriculum projects, implementation status (Concept, In Progress, Review, Completed), source repository links, and tech stack tags.

### E. Revision System: Flashcards & Quizzes (`src/views/RevisionView.tsx`, `src/data/assessment.ts`)
- **Interactive Flashcards:** Subject-categorized decks allowing learners to review core concepts and toggle prompt/answer cards.
- **Self-Assessment Quizzes:** Multiple-choice quiz engine with score calculation, answer explanations, and historical attempt logging (`quizAttempts`).

### F. Engineering Journal (`src/views/JournalView.tsx`)
- **Reflective Log:** Chronological personal learning journal allowing text/markdown entries to capture insights, debugging hurdles, and technical takeaways.

### G. Visual Analytics (`src/views/AnalyticsView.tsx`)
- **Recharts Data Visualizations:** Visual breakdown of study hours by category over time, module completion radar/bar charts, quiz score distributions, and daily activity heatmaps.

### H. Data Management & Settings (`src/views/SettingsView.tsx`)
- **Data Export & Import:** Full workspace backup and restoration via JSON file download/upload.
- **Local Reset & Safety Backups:** Automatic local backup creation prior to cloud merge; option to clear cached data on shared machines.

---

## 4. Architecture & Technology Stack

Verified directly against `package.json`, `vite.config.ts`, and source imports:

| Layer | Technologies | Verification Source |
|---|---|---|
| **Core Framework** | React 19.0.1, React DOM 19.0.1, TypeScript 7.0.2 | `package.json` |
| **Build Tooling** | Vite 8.3.0 (`@vitejs/plugin-react` 6.1.1) | `package.json`, `vite.config.ts` |
| **Styling** | Tailwind CSS 4.3.3 (`@tailwindcss/vite`) | `package.json`, `src/index.css` |
| **Animations** | Motion 12.23.24 (`motion/react`) | `package.json` |
| **Data Visualization** | Recharts 3.11.0 | `package.json`, `AnalyticsView.tsx` |
| **Icons** | Lucide React 0.546.0 | `package.json` |
| **Backend & Auth** | Firebase 13.4.0 (Auth + Cloud Firestore, Spark tier) | `package.json`, `src/lib/firebase.ts` |
| **Deployment** | Vercel (Hobby tier) | `vercel.json`, `README.md` |
| **Testing** | Node.js native test runner (`node --test`), Bun runtime | `package.json` |

---

## 5. Data Handling: Local-First vs. Cloud Sync

1. **Default Local-First Operation:**
   - All state mutations are written immediately to browser `localStorage`.
   - Without Firebase credentials or user sign-in, the application functions completely offline with zero degradation of core tracking features.
2. **Optional Cloud Synchronization:**
   - Users may optionally authenticate via Google OAuth (Firebase Authentication).
   - Once authenticated, `src/lib/sync/cloud.ts` initializes real-time Firestore listeners (`onSnapshot`) to synchronize documents under `/users/{uid}/...`.
3. **Conflict Resolution ("Newest Wins"):**
   - Document conflicts are resolved deterministically using ISO timestamp comparisons (`updatedAt`) in `src/lib/sync/merge.ts`.
   - Firestore security rules reject stale updates where the incoming `updatedAt` is older than the existing document.
4. **Non-Destructive First Sign-In:**
   - On initial login, existing local records are archived into downloadable safety backups before being merged with cloud records, preventing accidental data loss.
5. **Append-Only Subcollections:**
   - `activityLogs` (capped at a 60-item rolling window) and `quizAttempts` (capped at 200 items) are strictly append-only.

---

## 6. Authentication & Firestore Security Rules

Verified against `firestore.rules` (25,745 bytes) and `docs/security-spec.md`:

- **Global Default-Deny:** A root wildcard rule (`match /{document=**} { allow read, write: if false; }`) denies all unhandled paths.
- **Strict User Partitioning:** All user data is nested under `/users/{userId}/...`. Rules verify `request.auth.uid == userId` and enforce `request.auth.token.email_verified == true`.
- **Structural Document Validation:** Every collection (`userProfile`, `topicProgress`, `studySessions`, `projects`, `journalEntries`, `quizAttempts`, `activityLogs`) enforces comprehensive field schemas via `hasAll` and `hasOnly` key constraints.
- **Timestamp Integrity:** Client-supplied edit timestamps are validated via `isPlausibleTime()` (must be post-2020 and cannot exceed server time by more than 1 hour).
- **Security Rule Note:** This summary describes the logic demonstrably coded in `firestore.rules`; it does not constitute a formal external penetration test or security audit.

---

## 7. Deployment Status & Live Verification

- **Repository:** `https://github.com/goutam-prusty/ai-engineer-command-center` (Public, default branch verified).
- **Production Host:** Vercel Hobby tier (`vercel.json`).
- **Live Endpoint:** `https://ai-engineer-command-center-seven.vercel.app/`
  - **Live Verification Status:** Verified active via HTTP probe on 24 November 2026 (HTTP 200 OK, title: "AI Engineer Command Center").
  - **Visual QA Status:** Not verified. No browser screenshots were captured during this automated audit.

---

## 8. Testing & Validation

### Tests Found in Repository
- `tests/merge.test.ts`: Unit tests validating ISO timestamp comparisons (`newestWins`, `stampMs`), local-versus-cloud conflict resolution (`planReconcile`), and first-login migration logic.
- `tests/codecs-rules.test.ts`: Structural regression tests ensuring client encoders generate document shapes satisfying `firestore.rules` key lists (`hasAll`, `hasOnly`) and timestamp types.
- `tests/meta.test.ts`: Tests validating migration metadata and schema version invariants.

### Testing Execution Status in Review Environment
- Test files and assertion logic were inspected and confirmed statically from source.
- Tests were **not executed** via `node --test` in this environment because dependencies were not installed in the read-only scratch inspection directory.

---

## 9. Development History & AI-Assistance Attribution (Owner-Confirmed)

The owner has provided clear, candid confirmation regarding the project's inception, evolution, and technical authorship:

### A. Origin & Evolution
- **Independent Project Inception:** The AI Engineer Command Center originated purely as the owner's own idea. It was neither an assigned classroom project nor an enterprise assignment.
- **Initial Scope:** It was initially designed and set up strictly for the owner's personal learning workflow during the DataMites AI Engineer training programme.
- **Expansion for Peers:** After using the dashboard personally, the owner expanded the project with multi-device cloud synchronization (Firebase) and user-profile settings so that fellow student peers and friends could also track their coursework.

### B. Technical Implementation & AI Tooling
- **AI Coding Tooling:** Development was conducted primarily using **ChatGPT**, **Claude**, and the **Antigravity IDE**.
- **Generative Contribution:** These AI tools generated the application code, suggested the technical architecture (React 19 + Vite + Tailwind CSS v4 + Cloud Firestore), proposed the folder structure, and formulated the development plan.
- **Owner Hands-On Scope:** The owner candidly describes their personal hands-on contribution as specifying the learning workflow, formulating prompts, copying and applying the generated code into the project tree, and running local builds and environment setup. The owner did **not** independently engineer, manually design, or write the underlying application code from scratch.
- **Provenance Categorization:** In accordance with Sanity schema definitions, the project provenance is classified as **`Independent`** because it originated as the owner's own initiative and project concept. AI assistance is disclosed openly as technical code generation rather than classified as human co-authorship.

---

## 10. Proposed Sanity CMS Document Payload (`development` dataset)

Below is the complete, schema-compliant document payload prepared for owner review. It maps directly to `src/sanity/schemaTypes/project.ts`:

```json
{
  "_id": "project-PRJ-004",
  "_type": "project",
  "workbookId": "PRJ-004",
  "title": "AI Engineer Command Center",
  "slug": {
    "_type": "slug",
    "current": "ai-engineer-command-center"
  },
  "summary": "A personal learning workspace and progress dashboard designed for an intensive AI engineering curriculum, organizing weekly lecture schedules, topic progress, study sessions, milestone projects, flashcards, quizzes, and learning analytics.",
  "provenance": "Independent",
  "status": "draft",
  "editorialStatus": "draft",
  "category": "web-application",
  "role": "Project conception, learning workflow specification, prompt formulation, and AI-assisted implementation (applying and testing generated code).",
  "techStack": [
    "Vite",
    "React 19",
    "TypeScript",
    "Tailwind CSS v4",
    "Firebase Authentication",
    "Cloud Firestore",
    "Motion",
    "Recharts"
  ],
  "tags": [
    "learning-management",
    "productivity-tools",
    "local-first",
    "cloud-firestore",
    "dashboard"
  ],
  "links": {
    "_type": "object",
    "repo": "https://github.com/goutam-prusty/ai-engineer-command-center",
    "live": "https://ai-engineer-command-center-seven.vercel.app/"
  },
  "aiAttribution": "Developed using ChatGPT, Claude, and Antigravity IDE. AI tools generated the application code, recommended the technology stack and architecture, and structured the development plan. The owner directed the concept and workflow, applying generated code rather than writing application logic independently.",
  "featured": false,
  "legacyFeatured": false,
  "evaluationNotes": "Personal learning tracker verified via source inspection. Operates local-first with optional Firestore sync. Contains zero machine learning models or AI inference runtimes.",
  "editorialNotes": "Owner attribution confirmed 24 Nov 2026. Staged as private draft payload; held back from live publication."
}
```

### Document Identification Notes
- **Distinction from Existing Documents:** `project-PRJ-004` is a **proposed new document ID**. The Sanity `development` dataset currently contains **zero** project documents.
- **Convention Alignment:** Follows the established historical naming sequence (`PRJ-001` Inkline, `PRJ-002` Vitaliq, `PRJ-003` Wharf -> `PRJ-004` Command Center).
- **Publication Safety:** The document sets `status: "draft"` and `editorialStatus: "draft"`. Even after creation in Sanity, it will remain strictly excluded from public site rendering until explicitly published.

---

## 11. Owner Authorization & Sanity Write Checklist

Before any future write operation can take place in Sanity, the owner must provide explicit authorization for the following exact parameters:

- [ ] **Target Dataset:** Confirm write is authorized exclusively for the `development` dataset (Project ID: `l94q5yx8`).
- [ ] **Document ID & Workbook ID:** Confirm proposed IDs `project-PRJ-004` and `PRJ-004`.
- [ ] **Proposed Status:** Confirm status is held at `draft` (not visible on the public website).
- [ ] **Attribution Wording:** Approve the exact text for `role` and `aiAttribution` as drafted in Section 10.
- [ ] **Write Authorization:** Explicit owner instruction to invoke the Sanity create mutation.
