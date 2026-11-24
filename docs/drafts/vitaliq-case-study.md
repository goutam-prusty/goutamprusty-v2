# Project Case Study Draft: Vitaliq (Health Analytics Platform)

> **Status:** Private Review Draft — Owner Confirmation Required
> **Storage Location:** `docs/drafts/vitaliq-case-study.md` (Internal only; strictly excluded from public site build and deployment)
> **Source Repository:** [github.com/goutam-prusty/vitaliq](https://github.com/goutam-prusty/vitaliq)
> **Live Deployment:** [vitaliq.vercel.app](https://vitaliq.vercel.app) (Verified HTTP 200 OK)
> **Inspection Date:** 24 November 2026

---

## ⚠️ Health-Data Scope & Safety Boundaries

- **Software Classification:** Vitaliq is a personal full-stack software ledger and data visualization utility for logging biometric metrics.
- **Strict Non-Clinical Boundary:** Vitaliq is **not** a medical device, clinical diagnostic product, or clinical decision support system. It does **not** provide medical diagnosis, treatment, clinical advice, or health interventions.
- **No Clinical Claims:** The software does not claim clinical validation, certified accuracy, or improved health outcomes. All analytical indicators, threshold alerts, and statistical trends represent descriptive data visualizations and mathematical rolling averages for personal informational tracking only.
- **Privacy & Anonymity:** This case study contains zero real patient data, medical records, or personal identifying information.

---

## 1. Product Overview & Intended Use

Vitaliq is an authenticated, full-stack web application designed for personal, longitudinal tracking and visualization of core biometric markers: body composition, cardiovascular metrics (blood pressure and pulse), and blood glucose levels.

Built using Next.js 15, React 19, TypeScript, Drizzle ORM, and Neon PostgreSQL, the platform organizes health logging through a Domain-Driven Design (DDD) architecture that separates mathematical analysis and statistical transformations from database persistence.

- **Intended Use:** Logging personal biometric readings over time, visualizing trends through interactive multi-timescale charts, smoothing day-to-day noise via statistical moving averages, tracking personal health milestones, and reviewing rule-based threshold indicators.
- **Architectural Scope Notice:** Vitaliq is a pure full-stack database and analytics application. It does **not** utilize AI models, large language models (LLMs), machine learning inference runtimes, or autonomous agent frameworks. All insights and metrics are computed via deterministic mathematical formulas and explicit rules.

---

## 2. Supported Problem & Use Case

Based strictly on repository documentation, database schemas, and domain code:

1. **Longitudinal Metric Fragmentation:** Personal biometric records are typically scattered across isolated apps, proprietary hardware portals, and paper logs. Vitaliq centralizes core physical markers (body composition, blood pressure, glucose) into a single unified ledger.
2. **Noise in Day-to-Day Measurements:** Daily weight, blood pressure, and glucose measurements exhibit substantial short-term variance driven by hydration, meal timing, and circadian rhythms. Vitaliq addresses this by calculating rolling moving averages (e.g., 7-day rolling means) to surface long-term trajectories.
3. **Transparent Alert Thresholds:** Rather than black-box evaluations, Vitaliq applies transparent, configurable threshold boundaries (e.g., flagging blood pressure readings meeting or exceeding 130/80 mmHg or prolonged logging inactivity) with clear descriptive rationale.
4. **Data Isolation & Relational Integrity:** Personal logs require relational modeling with explicit user scoping, cascading deletions, and timestamp-indexed queries.

---

## 3. Verified Features Present in Source Code

The following capabilities were demonstrably verified through direct inspection of the repository codebase (`app/`, `components/`, `core/`, `db/`):

### A. Biometric Logging Ledgers (`db/schema.ts`, `components/features/`)
- **Body Composition:** Dedicated schema table (`body_composition_logs`) capturing Weight (kg/lbs), BMI, Body Fat %, Muscle Rate %, Body Water %, Bone Mass (kg), BMR (kcal), Metabolic Age, Visceral Fat %, Subcutaneous Fat %, Muscle Mass (kg), and timestamp notes.
- **Cardiovascular Health:** Dedicated schema table (`blood_pressure_logs`) capturing Systolic (mmHg), Diastolic (mmHg), Heart Pulse Rate (bpm), measurement timestamp, and contextual notes.
- **Blood Glucose:** Dedicated schema table (`blood_glucose_logs`) capturing Glucose levels (mg/dL) with timestamps and contextual notes.
- **User Profiles & Goals:** Relational tables (`user_profiles`, `user_goals`, `user_preferences`) storing target weight, target body fat %, target achievement dates, display units, and timezone preferences.

### B. Statistical Analytics Engine (`core/analytics/statistics.ts`, `engine.ts`)
- **Rolling Moving Averages:** Deterministic mathematical smoothing calculating 7-day rolling moving averages across time-series records.
- **Descriptive Statistics:** Calculates min, max, mean, and standard deviation scores across filtered date windows.
- **Target Progress Calculations:** Dynamic computation of remaining metric delta and percentage completion toward user-defined goals.

### C. Deterministic Insights Engine (`core/analytics/insights.ts`)
- Translates raw time-series records into structured insight objects categorized by severity (`info`, `success`, `warning`, `attention`):
  - **Inactivity Warning:** Triggers when elapsed time since the latest record exceeds the configured threshold (default: 14 days).
  - **Significant Weight Shift:** Flags period-over-period weight variance exceeding threshold percentages (default: 3%).
  - **Blood Pressure Threshold Alert:** Evaluates whether systolic (≥130 mmHg) or diastolic (≥80 mmHg) readings meet high-threshold criteria.
  - **Glucose Boundary Alert:** Flags glucose readings exceeding 140 mg/dL or falling below 70 mg/dL.
  - **Logging Streak Milestone:** Acknowledges continuous logging streaks (≥5 days).

### D. User Interface & Data Visualization (`components/charts/`, `components/features/`)
- **Interactive Recharts Containers:** Multi-timescale time-series line and area charts with date-range filters (7D, 30D, 90D, 1Y, All) and metric toggles.
- **Global Logging Modal:** Keyboard-accessible modal drawer (shortcut `L`) enabling quick log entry from any authenticated view.
- **Responsive Navigation:** Desktop slide-over panels and mobile-responsive bottom sheet drawers.
- **Pre-Seeded Demo Sandbox (`core/demo/`):** Simulated authentication mode and synthetic scenario generation enabling full application demonstration without live database credentials.

---

## 4. Architecture & Technology Stack

Verified directly against `package.json`, `drizzle.config.ts`, and source code imports:

| Layer | Technologies | Verification Source |
|---|---|---|
| **Framework** | Next.js 15.1.0 (App Router), React 19.0.0, TypeScript 5.7.2 | `package.json` |
| **Styling** | Tailwind CSS 4.1.0 (`@tailwindcss/postcss`), PostCSS | `package.json`, `postcss.config.mjs` |
| **Icons & UI** | Lucide React 0.468.0, custom accessible Toast notification system | `package.json`, `components/` |
| **Database** | Neon Serverless PostgreSQL (`@neondatabase/serverless` 1.1.0) | `package.json`, `db/client.ts` |
| **ORM** | Drizzle ORM 0.45.2 (`drizzle-kit` 0.31.10) | `package.json`, `drizzle.config.ts`, `db/schema.ts` |
| **Authentication** | Clerk Auth SDK (`@clerk/nextjs` 7.5.20) + simulated demo mock middleware | `package.json`, `middleware.ts` |
| **Data Validation** | Zod 3.24.1 | `package.json`, `lib/validations/` |
| **Date Processing** | `date-fns` 4.1.0, `date-fns-tz` 3.2.0 | `package.json` |
| **Charts** | Recharts 2.15.0 | `package.json`, `components/charts/` |
| **Testing** | Vitest 2.1.8, Playwright 1.61.1, Testing Library Jest-DOM 6.6.3 | `package.json`, `tests/` |
| **Deployment** | Vercel Platform | `README.md` |

---

## 5. Domain-Driven Design & Data Access Architecture

Vitaliq enforces strict separation of concerns via Domain-Driven Design (DDD) layers:

```
[ Client / Browser ]
        │
        ▼ (Page Requests & Server Actions)
[ Next.js App Router (app/(app)/) ]
        │
        ▼ (Input Validation via Zod Schemas)
[ Domain Layer (core/domains/HealthDomain.ts, ProfileDomain.ts) ]
        │
        ▼ (Pure Statistical & Insights Calculation)
[ Analytics Layer (core/analytics/statistics.ts, insights.ts) ]
        │
        ▼ (Data Mapping & SQL Operations)
[ Repository Layer (core/repositories/BodyRepository.ts, PressureRepository.ts, etc.) ]
        │
        ▼ (Type-Safe Query Execution via Drizzle ORM)
[ Database: Neon Serverless PostgreSQL ]
```

---

## 6. Authentication & Access Controls

Verified against `middleware.ts`, `core/repositories/`, and `app/`:

- **Identity Provider:** Clerk Authentication manages user registration, session tokens, and identity routing.
- **Route Protection:** Next.js middleware enforces authentication on all `/dashboard`, `/trends`, `/history`, and `/settings` routes, redirecting unauthenticated traffic to sign-in.
- **Tenant Isolation:** All database repository queries strictly scope reads, insertions, updates, and deletions by the authenticated Clerk `userId` (`WHERE user_id = :userId`).
- **Demo Mode Bypass:** An isolated demo simulation middleware allows sandbox review using synthetic mock profiles without accessing production credentials.
- **Access Control Note:** This description documents the access control patterns implemented in the source code; it does not constitute a formal external penetration test or security audit.

---

## 7. Testing & Quality Assurance

### Tests Found in Repository
- **Unit Tests (`vitest`):**
  - `tests/statistics.test.ts`: Validates rolling moving average algorithms, mean calculations, and edge-case handling on sparse arrays.
  - `tests/insights.test.ts`: Validates deterministic rule triggers for elevated blood pressure, inactivity windows, and goal milestones.
  - `tests/engine.test.ts`: Tests core analytics aggregation and time-bucket calculations.
  - `tests/dates-parsing.test.ts`: Tests date parsing and timezone conversions.
  - `tests/categories.test.ts`: Tests health category mapping and metric normalization.
- **End-to-End Tests (`@playwright/test`):**
  - `tests/e2e/journey.spec.ts`: Tests user onboarding journey, dashboard navigation, and metric submission flows.

### Testing Execution Status in Review Environment
- The test specifications above were inspected and verified statically from the repository source code.
- Unit and end-to-end tests were **not executed** in this audit environment because pnpm dependencies were not installed in the read-only scratch inspection directory.

---

## 8. Deployment Status & Live Verification

- **Repository:** `https://github.com/goutam-prusty/vitaliq` (Public, default branch inspected).
- **Production Host:** Vercel Platform.
- **Live Endpoint:** `https://vitaliq.vercel.app`
  - **Live Verification Status:** Verified active via HTTP probe on 24 November 2026 (HTTP 200 OK, title: "VitalIQ | Understand Your Biology").
  - **Visual QA Status:** Not verified. No browser screenshots were captured during this automated audit.

---

## 9. Omitted & Unverified Claims

To preserve strict content integrity:
- **Zero Medical Outcomes:** No claims of health improvement, clinical diagnosis, or medical accuracy are made.
- **Zero AI / Machine Learning:** No claims of embedded AI models, LLM assistants, or predictive clinical algorithms.
- **Zero Commercial Metrics:** No user adoption figures, active user counts, or commercial claims.

---

## 10. Owner Confirmation Required (Decisions Needed)

Before presenting Vitaliq in any public portfolio context, the owner must confirm:

1. **Project Provenance:**
   - [ ] Independent personal project
   - [ ] Built during training / coursework
   - [ ] Guided exercise / tutorial adaptation
   - [ ] Collaborative project
2. **Personal Design & Implementation Ownership:**
   - Clarification of which architectural layers (DDD repositories, Drizzle schema, analytics engine, UI components) the owner personally designed and authored.
3. **AI Assistance Disclosure:**
   - Whether and how AI coding tools (e.g., Cursor, Claude, ChatGPT, Copilot) assisted with development, schema design, or test generation.
4. **Public Portfolio Presentation:**
   - Whether Vitaliq should eventually be published as a case study on goutamprusty.com, maintaining strict health-data disclaimer boundaries.
