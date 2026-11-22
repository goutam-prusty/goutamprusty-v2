# Milestone 2A: Schema Integrity and Migration Contract Audit Report

**Date:** 2026-11-21  
**Working Repository:** `D:\goutamprusty-v2`  
**Current Branch:** `codex/sanity-content-architecture`  
**Source Baseline:** `D:\goutamprusty-v1` (Read-Only Baseline Commit: `71ef2c7c5c6a8995cc6901d350cc29c35d427423`)  
**Audit Scope:** Independent forensic audit of Milestone 2 schema definitions, parser outputs, validator behavior, relationship contracts, and test assertions prior to ingestion tooling implementation.  
**Audit Verdict:** **CONDITIONAL APPROVAL — Content architecture and AST representations are 100% structurally lossless; Two (2) Ingestion Blockers and Five (5) Schema Warnings must be resolved by the ingestion contract before Sanity Content Lake mutation.**

---

## 1. Executive Summary & Verdict

Milestone 2A performs an exhaustive, independent audit of the local Sanity schema implementation (`migration/schema/`), shared TypeScript interfaces (`migration/types/sanity-schema.ts`), parser outputs (`migration/output/`), and the Milestone 2 validation suite.

The audit confirms that the custom Portable Text model, equation representations, rich table cells, and provenance baseline represent the V1 archive losslessly. However, a strict comparison between what the offline parser emits and what **Sanity Studio v3 / Sanity Content Lake** strictly requires reveals **two (2) critical contract blockers** and **five (5) technical warnings** that would cause validation failures or broken forms in live Sanity Studio if raw parser JSON were ingested directly without a reconciliation layer.

### Summary of Audit Classifications:
| Classification | Count | Definition | Action Required |
|---|---|---|---|
| **BLOCKER** | **2** | Structural or type defect that would cause Sanity Studio v3 or the Sanity Mutation API to reject the document or fail to render forms. | Must be resolved in the ingestion pipeline or parser before writing to Sanity. |
| **WARNING** | **5** | Type ambiguity, editorial discrepancy, or validator blindspot that does not corrupt content but violates Studio conventions or risk-free ingestion. | Requires documented reconciliation rules or explicit editorial confirmation. |
| **PASS** | **61** | Verified 1:1 lossless alignment between source MDX, parser output, schema definition, and Sanity Studio requirements. | Approved for production migration architecture. |

---

## 2. Deliverables Summary

1. **Authoritative Audit Report:** [`migration/milestone-2a-schema-audit-report.md`](file:///D:/goutamprusty-v2/migration/milestone-2a-schema-audit-report.md) (this document).
2. **Machine-Readable Contract Matrix:** [`migration/milestone-2a-schema-contract-matrix.json`](file:///D:/goutamprusty-v2/migration/milestone-2a-schema-contract-matrix.json) (covering 68 fields across all 21 document and object schemas).
3. **Contract Gap Proof Test Suite:** [`migration/tests/milestone-2a-contract.test.cjs`](file:///D:/goutamprusty-v2/migration/tests/milestone-2a-contract.test.cjs) (8 automated assertions demonstrating the exact contract boundaries and validator blindspots).

---

## 3. Critical Audit Findings

### 3.1. BLOCKER F-01: Missing `_type` on Homogeneous Array Members
- **Exact Locations:**
  - `migration/lib/mdx-to-sanity-parser.cjs` (lines 511–517, 579–583, 200–245)
  - `migration/output/RES-*.json`
- **Affected Fields:**
  - `research.sourceMaterial[]`: Items have `_key`, `title`, `url`, but **lack `_type: 'sourceMaterialEntry'`**.
  - `research.bibliography[]`: Items have `_key`, `order`, `rawText`, `title`, `url`, but **lack `_type: 'bibliographyEntry'`**.
  - `tableBlock.rows[]`: Row objects have `_key`, `isHeader`, `cells`, but **lack `_type: 'tableRow'`**.
  - `tableRow.cells[]`: Cell objects have `_key`, `plainText`, `content`, but **lack `_type: 'tableCell'`**.
- **Sanity Studio v3 Contract Impact:**
  In Sanity Content Lake and Sanity Studio v3, **every object in an array MUST carry a `_type` string property**. Even when an array definition specifies a single allowed member type (`of: [{ type: 'tableRow' }]`), Sanity's real-time deserializer and Studio Form Builder use `_type` to resolve the field component. If `_type` is missing, Sanity Studio cannot render the form input and logs fatal form validation errors (`"Invalid array item: missing _type"`).
- **Why Milestone 2 Tests Passed:**
  In `migration/lib/schema-validator.cjs` (line 269), the validator inferred the object type when `ofDefinitions.length === 1`. This proved structural field correctness, but masked the missing `_type` property required by live Sanity Studio.
- **Contract Mandate for Ingestion:**
  The ingestion pre-processor (or parser engine) must explicitly inject `_type: 'sourceMaterialEntry'`, `_type: 'bibliographyEntry'`, `_type: 'tableRow'`, and `_type: 'tableCell'` into each array item prior to creating Sanity mutations.

### 3.2. BLOCKER F-02: Reference Fields Emitted as Raw String Slugs
- **Exact Locations:**
  - `migration/lib/mdx-to-sanity-parser.cjs` (lines 536, 577, 578)
  - `migration/schema/documents/research.ts` (`derivedPosts`, `relatedProjects`)
  - `migration/schema/documents/writing.ts` (`sourceReport`, `relatedProjects`)
  - `migration/output/RES-015.json` (`derivedPosts: ['structure-not-conspiracy', ...]`)
  - Transformed Writing documents (`sourceReport: 'strategic-intelligence-report-...'`)
- **Affected Fields:**
  - `research.derivedPosts`
  - `writing.sourceReport`
- **Sanity Studio v3 Contract Impact:**
  The Sanity schema definitions correctly declare these fields as `type: 'reference', to: [{ type: '...' }]`. However, the parser emits raw source slug strings (e.g. `'structure-not-conspiracy'`).
  Sanity Content Lake strictly requires reference fields to be structured reference objects:
  ```json
  {
    "_type": "reference",
    "_ref": "writing-BLG-012"
  }
  ```
  Attempting to mutate a reference field with a bare string value triggers an immediate schema validation rejection by the Sanity API: `ValidationError: Expected object of type reference, got string`.
- **Contract Mandate for Ingestion:**
  Ingestion cannot be a single-pass naive dump. It must implement a **two-phase reference resolution pipeline**:
  1. *Phase 1:* Ingest documents without unresolved references, establishing stable Sanity document IDs (`research-RES-xxx`, `writing-BLG-xxx`, `project-PRJ-xxx`).
  2. *Phase 2:* Reconcile source slugs and workbook IDs against the imported document registry, transforming slug strings into valid Sanity `{ _type: 'reference', _ref: '<docId>' }` pointers.

---

### 3.3. Technical Warnings & Non-Blocking Gaps

#### WARNING F-03: `coverImage` Anonymous Object vs `_type: 'image'`
- **Location:** `research.coverImage`, `writing.coverImage`, `project.coverImage`
- **Issue:** The parser emits `coverImage: { _type: 'image', assetPath: '...', alt: '...' }`. The schema defines `coverImage` as an anonymous `type: 'object'` with fields `assetPath` and `alt`.
- **Impact:** In Sanity Studio, `type: 'image'` is a reserved system schema type expecting an asset reference (`asset: { _type: 'reference', _ref: 'image-...' }`). If an anonymous object carries `_type: 'image'` without a Sanity asset reference, Studio may attempt to invoke the native image widget and display broken asset errors.
- **Contract Mandate:** Ingestion tooling should either:
  - Migrate local WebP binaries to the Sanity Asset Lake and populate `asset: { _ref: ... }`, OR
  - Define a formal schema type `coverImage` with `assetPath` string for static path preservation.

#### WARNING F-04: Top-Level Single Objects Lack `_type` Property
- **Location:** `writing.seo`, `research.sourceArchive`, `writing.sourceArchive`, `project.sourceArchive`
- **Issue:** The parser emits `seo: { metaTitle, metaDescription }` and `sourceArchive: { v1GitCommit, ... }` without explicit `_type: 'seo'` or `_type: 'sourceArchive'`.
- **Impact:** While single object fields in Sanity can sometimes default to the schema field type, Sanity Studio v3 best practices require named object instances to include `_type` matching their registered schema name.
- **Contract Mandate:** Ingestion tooling must attach `_type: 'seo'` and `_type: 'sourceArchive'` during transformation.

#### WARNING F-05: Validator Blindspot on Physical Assets & Disk Paths
- **Location:** `migration/lib/schema-validator.cjs`
- **Issue:** Running `validateDocument()` against Milestone 1C HOLD documents (such as `BLG-012`) returns `isValid: true`.
- **Impact:** The schema validator checks AST shape, not filesystem asset presence or path validity. `BLG-012` passes syntactically because its `assetPath` is a valid string, even though the path is route-relative (`images/blog/...` missing leading `/`) and physically broken in V1.
- **Contract Mandate:** Schema validation alone must **never** be used as a migration admission gate. Ingestion tooling must enforce an independent gate requiring `compatibilityStatus === 'PASS'` from `full-corpus-compatibility.json`. All 5 Milestone 1C HOLD documents must remain strictly blocked until non-destructive path normalization is applied.

#### WARNING F-06: V1 Project Frontmatter `featured: true` vs Default `false` Policy
- **Location:** `content/projects/inkline.mdx` (PRJ-001) and `vitaliq.mdx` (PRJ-002)
- **Issue:** Both project files explicitly declare `featured: true` in their original V1 MDX frontmatter. The migration policy dictates: "`featured` must default to false" and "Do not apply proposed editorial overrides."
- **Contract Mandate:** Ingestion tooling must resolve this explicit policy conflict:
  - *Option A (Source Fidelity):* Preserve author's explicit frontmatter setting (`featured: true` for Inkline and Vitaliq).
  - *Option B (Strict Staging):* Force `featured: false` for all imported works until human editorial sign-off.
  - *Recommendation:* Flag for user editorial approval before ingestion.

#### WARNING F-07: Unpopulated Schema Fields (Taxonomy & Solo Authorship)
- **Location:** `author`, `topics` across all document types
- **Issue:** These fields exist in the schema but are never emitted by the parser for Research or Writing.
- **Justification:**
  - `author`: V1 MDX has no `author` frontmatter because Goutam Prusty is the sole author (documented in `content/_meta/authors.yml`).
  - `topics`: Topic associations exist in `Content_Inventory.xlsx`, not in the V1 MDX files.
- **Contract Mandate:** Ingestion tooling must ingest topic relationships from `Content_Inventory.xlsx` and link default author `author-goutam-prusty`.

---

## 4. Parser-to-Schema Contract Matrix

Below is the verified contract mapping between raw parser outputs and Sanity Studio schemas:

| Document / Object | Field Name | Emitted Parser Type | Sanity Schema Type | Status | Required Ingestion Transformation |
|---|---|---|---|---|---|
| `research` | `workbookId` | `string` (`RES-001`) | `string` (readOnly) | **PASS** | None. Preserved verbatim. |
| `research` | `title` | `string` | `string` | **PASS** | None. |
| `research` | `slug` | `{ _type: 'slug', current }` | `slug` | **PASS** | None. Native Sanity slug format. |
| `research` | `summary` | `string` | `text` | **PASS** | None. |
| `research` | `status` | `string` | `string` | **PASS** | None. |
| `research` | `publishedAt` | `string` (ISO 8601) | `datetime` | **PASS** | None. |
| `research` | `updatedAt` | `undefined` | `datetime` | **PASS** | None. Optional field. |
| `research` | `category` | `string` | `string` | **PASS** | None. Preserved verbatim (SCH-01). |
| `research` | `tags` | `string[]` | `array of string` | **PASS** | None. |
| `research` | `researchMethod` | `string` | `string` | **PASS** | None. |
| `research` | `lengthEstimateMinutes`| `number` | `number` | **PASS** | None. |
| `research` | `coverImage` | `{ _type: 'image', assetPath }` | `object (assetPath, alt)` | **WARNING** | Standardize object type or upload to Asset Lake (F-03). |
| `research` | `author` | `undefined` | `reference to author` | **WARNING** | Link `author-goutam-prusty` during ingestion (F-07). |
| `research` | `topics` | `undefined` | `array of ref to topic` | **WARNING** | Ingest associations from workbook (F-07). |
| `research` | `derivedPosts` | `string[]` (slugs) | `array of ref to writing` | **BLOCKER** | Resolve slugs to Sanity document IDs (F-02). |
| `research` | `relatedProjects` | `string[]` (`[]`) | `array of ref to project` | **PASS** | Empty array in source. |
| `research` | `sourceMaterial` | `[{ _key, title, url }]` | `array of sourceMaterialEntry` | **BLOCKER** | Inject `_type: 'sourceMaterialEntry'` on items (F-01). |
| `research` | `bibliographyHeading`| `string` or `null` | `string` | **PASS** | None. |
| `research` | `bibliography` | `[{ _key, order, rawText, title, url }]` | `array of bibliographyEntry` | **BLOCKER** | Inject `_type: 'bibliographyEntry'` on items (F-01). |
| `research` | `body` | `array of BodyBlock` | `portableTextBody` | **PASS** | 100% block and inline compatibility. |
| `research` | `sourceArchive` | `{ v1GitCommit, ... }` | `sourceArchive` | **WARNING** | Inject `_type: 'sourceArchive'` (F-04). |
| `research` | `featured` | `undefined` | `boolean (default: false)` | **PASS** | Ingestion assigns schema default `false`. |
| `research` | `editorialStatus` | `undefined` | `string (default: 'draft')` | **PASS** | Ingestion assigns schema default `'draft'`. |
| `research` | `editorialNotes` | `undefined` | `text` | **PASS** | Optional editorial note field. |
| `writing` | `sourceReport` | `string` (slug) | `reference to research` | **BLOCKER** | Resolve slug to `research-RES-xxx` ID (F-02). |
| `writing` | `seo` | `{ metaTitle, metaDescription }`| `seo` | **WARNING** | Inject `_type: 'seo'` (F-04). |
| `writing` | `canonicalUrl` | `string URL` or `null` | `url` | **PASS** | None. |
| `writing` | `readingTimeOverride` | `number` or `null` | `number` | **PASS** | None. |
| `project` | `role` | `string` | `string` | **PASS** | None. Verbatim role preserved. |
| `project` | `startDate` / `endDate`| `date` / `date or null` | `date` / `date` | **PASS** | None. |
| `project` | `links` | `{ repo, live, demo }` | `object` | **PASS** | None. |
| `project` | `techStack` | `string[]` | `array of string` | **PASS** | None. |
| `project` | `featured` | `boolean` (`true` in source) | `boolean (default: false)` | **WARNING** | Editorial resolution required (F-06). |
| `tableBlock` | `rows` | `[{ _key, isHeader, cells }]` | `array of tableRow` | **BLOCKER** | Inject `_type: 'tableRow'` on row objects (F-01). |
| `tableRow` | `cells` | `[{ _key, plainText, content }]`| `array of tableCell` | **BLOCKER** | Inject `_type: 'tableCell'` on cell objects (F-01). |
| `tableCell` | `content` | `array of block` | `array of block` | **PASS** | Rich formatting and inline formulas verified. |
| `formulaBlock` | `dimensions` | `{ width, height }` | `object` | **PASS** | Verified against WebP output on disk. |
| `inlineFormula` | `dimensions` | `{ width, height }` | `object` | **PASS** | Verified against WebP output on disk. |
| `citationMarker`| `citationNumber` / `rawMarker` | `number` / `string` | `number` / `string` | **PASS** | Sequential citation integrity verified. |
| `mermaidBlock` | `code` | `string` | `text` | **PASS** | Verbatim syntax preserved. |
| `codeBlock` | `language` / `code` | `string` / `string` | `string` / `text` | **PASS** | Verbatim code preserved. |

---

## 5. Relationship Architecture & Resolution Requirements

### 5.1. Directional Alignment
- **Research to Writing (`derivedPosts`):**
  - Source: Array of blog post slugs in Research frontmatter (e.g. `RES-015` specifies 5 derived blog slugs).
  - Target: Array of Sanity references `to: [{ type: 'writing' }]`.
- **Writing to Research (`sourceReport`):**
  - Source: Parent research slug string in Writing frontmatter (e.g. `BLG-001` specifies `strategic-intelligence-report-...`).
  - Target: Sanity reference `to: [{ type: 'research' }]`.
- **Verdict:** Direction is consistent and bidirectional. Both directions must resolve to Sanity document IDs (`research-RES-xxx` and `writing-BLG-xxx`).

### 5.2. Ambiguous & Unspecified Relationships
- In V1, 14 blog posts have `sourceReport: null` (standalone essays).
- 20 research reports have `derivedPosts: []`.
- All 21 research reports have `relatedProjects: []`.
- **Audit Mandate:** Ingestion tooling must never invent relationship records. If source data is `null` or `[]`, the imported document must remain `null` or `[]`.

---

## 6. Assets, Physical Integrity & Provenance

### 6.1. Separation of WebP Presentation Assets from Source Data
- 24 WebP formula presentation assets reside in `public/images/research/.../formula-*.webp`.
- Original base64 PNG data URIs remain intact in immutable V1 MDX files.
- Transformed JSON contains **0 bytes of base64 PNG payloads**.
- Checksums are cryptographically separated:
  - `sourceArchive.sourceSha256`: Checksum of the raw V1 source MDX file.
  - `formulaBlock.sha256` / `inlineFormula.sha256`: Checksum of the WebP presentation asset.
  - `originalPngSha256`: Checksum of the decoded source PNG bytes.

### 6.2. Overwrite Protection
- Presentation assets in `public/images/` must be treated as immutable build artifacts.
- Ingestion tooling must never overwrite local files during migration.
- If assets are uploaded to the Sanity Asset Lake in Milestone 3, uploads must be idempotent (keyed by asset SHA-256).

### 6.3. Enforcement of Milestone 1C HOLD Classifications
The 5 HOLD Writing documents (`BLG-012`, `BLG-013`, `BLG-014`, `BLG-015`, `BLG-021`) must **not** be admitted to Sanity ingestion merely because they pass AST schema validation:
- `BLG-012`, `BLG-013`, `BLG-015`, `BLG-021` have 12 route-relative image references missing leading slashes.
- `BLG-014` has 2 broken image paths missing the slug directory.
- **Ingestion Precondition:** Ingestion scripts must check `full-corpus-compatibility.json` and refuse to ingest any document whose status is `HOLD` until the non-destructive path normalization step is executed.

---

## 7. Test Suite Critique & Proof Limits

### 7.1. What the 38 Milestone 2 Assertions Prove
- Schema definitions load cleanly and export 21 schemas conforming to Sanity Studio v3 declarations.
- Every AST block and inline token emitted by the parser is permitted in `portableTextBody`.
- Representative fixtures pass structural field type checks.
- Table cells contain structured rows and rich content blocks.
- Inline formulas and standalone blocks retain dimensions and WebP paths.
- Citation numbers, raw markers, bibliography entries, and code fences retain verbatim text.
- `sourceArchive` retains the frozen commit hash `71ef2c7c5c6a8995cc6901d350cc29c35d427423`.

### 7.2. What the 38 Assertions Do NOT Prove (Audit Limits)
1. **They do not prove that array member objects carry `_type`.** (Proved absent by test suite `milestone-2a-contract.test.cjs`).
2. **They do not prove that reference fields are ingestible by Sanity Content Lake.** (Proved raw string slugs by `milestone-2a-contract.test.cjs`).
3. **They do not prove that assets exist on disk.** (Proved blindspot by passing `BLG-012` in `milestone-2a-contract.test.cjs`).
4. **They do not prove factual accuracy or editorial publishability.**

### 7.3. Contract Gap Proof Suite (`milestone-2a-contract.test.cjs`)
To substantiate these limits without inflating test counts, 8 targeted contract tests were added in `migration/tests/milestone-2a-contract.test.cjs`:
- 3 tests demonstrating `_type` omission on `sourceMaterial`, `bibliography`, `rows`, and `cells`.
- 2 tests demonstrating raw slug strings in `derivedPosts` and `sourceReport`.
- 1 test demonstrating that `BLG-012` passes schema validation despite route-relative broken paths.
- 1 test demonstrating the `coverImage` anonymous object vs `_type: 'image'` mismatch.
- 1 test demonstrating that V1 project frontmatter declares `featured: true` while schema specifies `initialValue: false`.
- **Result:** **8 / 8 PASSED** (100% reproducible proof of contract boundaries).

---

## 8. Verification Commands

To independently execute the contract audit and verify all suites from `D:\goutamprusty-v2`:

```powershell
# 1. Run Milestone 2A Contract Gap Proof Test Suite (8 assertions)
node migration/tests/milestone-2a-contract.test.cjs

# 2. Re-run Milestone 2 Schema Validation Test Suite (38 assertions)
node migration/tests/milestone-2-schema.test.cjs

# 3. Re-run Milestone 1C Compatibility Test Suite (40 assertions)
node migration/tests/milestone-1c-compatibility.test.cjs

# 4. Re-run Milestone 1B Parity Test Suite (183 assertions)
node migration/tests/milestone-1b-parity.test.cjs

# 5. Verify TypeScript and Astro Project Diagnostics
npx tsc --noEmit
npm run check

# 6. Verify Static Production Build
npm run build

# 7. Check Git Diff Hygiene
git diff --check
```

---

## 9. Completion Checklist & Next Step Gate

- [x] Full forensic inspection of all schemas, types, parser engines, outputs, and tests completed.
- [x] All 21 schemas audited for Sanity Studio v3 compatibility.
- [x] Missing `_type` on homogeneous array items identified as BLOCKER F-01.
- [x] Raw slug references identified as BLOCKER F-02.
- [x] `coverImage` anonymous object mismatch identified as WARNING F-03.
- [x] Missing `_type` on `seo` and `sourceArchive` identified as WARNING F-04.
- [x] Validator blindspot on disk asset paths identified as WARNING F-05.
- [x] V1 Project frontmatter `featured: true` discrepancy identified as WARNING F-06.
- [x] Taxonomy and authorship gaps identified as WARNING F-07.
- [x] Machine-readable matrix generated at `migration/milestone-2a-schema-contract-matrix.json`.
- [x] Contract proof test suite created and passing (8/8 PASS).
- [x] All pre-existing test suites passing (261 / 261 total passed assertions).
- [x] `npm run check` passes with 0 errors, 0 warnings, 0 hints.
- [x] `npm run build` passes with 23 static pages generated in 613ms.
- [x] `git diff --check` passes with 0 errors.
- [x] V1 repository and `Content_Inventory.xlsx` remain strictly untouched.
- [x] Stopped after producing report. Milestone 3 has not been started.
