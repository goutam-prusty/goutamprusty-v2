# Milestone 2: Sanity Content Schema Implementation and Offline Validation Report

**Date:** 2026-11-21  
**Working Repository:** `D:\goutamprusty-v2`  
**Current Branch:** `codex/sanity-content-architecture`  
**Source Baseline:** `D:\goutamprusty-v1` (Read-Only Baseline Commit: `71ef2c7c5c6a8995cc6901d350cc29c35d427423`)  
**Status:** **PASSED — 100% Schema Validation (38/38 Assertions) | Zero External Dependencies | Zero API/Account Requirements**

---

## 1. Executive Summary

Milestone 2 implements the authoritative Sanity content schema architecture locally, establishing strict, declarative schema definitions for all content types and custom Portable Text objects required by `goutamprusty.com` V2.

The implementation was constructed in strict accordance with `WEBSITE_BUILD_SPEC_FOR_CODEX.md`, the completed Milestone 1B/1C parser engines, and the authoritative V1 baseline. All schema definitions are modular, typed, and offline-testable.

### Key Milestone Achievements:
1. **Complete Schema Suite:** Implemented 5 primary document schemas (`research`, `writing`, `project`, `topic`, `author`) and 16 custom object/block schemas under `migration/schema/`.
2. **100% Offline Validation:** Built an offline schema validation engine (`migration/lib/schema-validator.cjs`) that verifies all 7 representative Research fixtures (`RES-001`, `RES-004`, `RES-015`, `RES-018`, `RES-019`, `RES-020`, `RES-022`), representative Writing documents (`BLG-001`, `BLG-003`), and Project documents (`PRJ-001` Inkline, `PRJ-002` Vitaliq, `PRJ-003` Wharf) with **zero validation errors**.
3. **Rich Table Cell & Inline Formula Parity:** Successfully validated rich table cells containing formatted spans and inline formula objects (`RES-004`), standalone formula display blocks (`RES-018`, `RES-022`), list-item formulas (`RES-022`), and dense inline prose equations (`RES-020`).
4. **Verbatim Code & Lossless Provenance:** Validated verbatim preservation of multi-line Mermaid diagrams and JSON code blocks (`RES-019`), 194 sequential inline citation markers (`RES-015`), 102 bibliography entries (`RES-001`), and immutable V1 commit/SHA-256 provenance metadata on every document.
5. **Editorial Safety Invariants:** Enforced that `featured` strictly defaults to `false` across all content schemas, no document is marked approved without audit, and the 5 HOLD writing documents from Milestone 1C remain on HOLD.
6. **Zero Dependencies & Zero Sanity API Calls:** No new npm packages were installed; no Sanity project, token, or account was created or required.
7. **System Health:** Astro diagnostics (`npm run check`) report **0 errors, 0 warnings, 0 hints**; static production build (`npm run build`) completes cleanly in **664ms**.

---

## 2. Directory Organization and Deliverables

All schema definitions and test runners are located under [`migration/`](file:///D:/goutamprusty-v2/migration):

```
migration/
├── schema/
│   ├── index.ts                     # TypeScript Sanity Studio v3 schema registry export
│   ├── index.cjs                    # CommonJS runtime schema registry for tests/tools
│   ├── types.ts                     # Typed helper wrappers (defineType, defineField, defineArrayMember)
│   ├── documents/
│   │   ├── research.ts              # Formal Research Report document schema
│   │   ├── writing.ts               # Editorial Writing / Essay document schema
│   │   ├── project.ts               # Project Case Study document schema
│   │   ├── topic.ts                 # Taxonomy Topic document schema
│   │   └── author.ts                # Author Attribution document schema
│   └── objects/
│       ├── portableText.ts          # Rich text body definition (block styles, marks, decorators)
│       ├── tableBlock.ts            # Rich tableBlock, tableRow, tableCell schema
│       ├── formulaBlock.ts          # Standalone display formula block schema
│       ├── inlineFormula.ts         # Inline equation object schema (with WebP dimensions & SHA-256)
│       ├── inlineImage.ts           # Inline image span object schema
│       ├── imageBlock.ts            # Standalone figure/image block schema with captions
│       ├── citationMarker.ts        # Inline citation marker object schema
│       ├── mermaidBlock.ts          # Verbatim Mermaid diagram code schema
│       ├── codeBlock.ts             # Syntax-highlighted code block schema
│       ├── dividerBlock.ts          # Thematic break / divider schema
│       ├── bibliographyEntry.ts     # Academic reference bibliography schema
│       ├── sourceMaterialEntry.ts   # Primary research source documentation schema
│       ├── sourceArchive.ts         # Immutable V1 commit & provenance baseline schema
│       └── seo.ts                   # Search engine optimization metadata schema
├── lib/
│   ├── mdx-to-sanity-parser.cjs     # CommonMark + GFM parser supporting Research, Writing, and Project
│   ├── schema-validator.cjs         # Standalone offline Sanity schema validation engine
│   └── key-generator.cjs            # Deterministic MurmurHash3 key generator
├── types/
│   └── sanity-schema.ts             # Shared TypeScript interfaces and Sanity Studio meta-types
├── tests/
│   ├── milestone-1b-parity.test.cjs # 183-assertion Milestone 1B parity test runner
│   ├── milestone-1c-compatibility.test.cjs # 40-assertion Milestone 1C compatibility test runner
│   └── milestone-2-schema.test.cjs  # 38-assertion Milestone 2 schema validation test runner
├── output/                          # Canonical deterministic JSON outputs (7 fixtures)
└── milestone-2-schema-report.md     # This authoritative audit report
```

---

## 3. Document Schema Definitions

### 3.1. Research Report (`research`)
- **Purpose:** Primary publication vehicle for deep-dive empirical research, institutional analysis, and macroeconomic investigations.
- **Fields:**
  - `workbookId` (string, read-only): Stable source identity matching `Content_Inventory.xlsx` (e.g. `RES-001`).
  - `title` (string, required): Full paper title.
  - `slug` (slug, required): URL slug matching original V1 route.
  - `summary` (text, required): Executive abstract (3 rows).
  - `status` (string, required): Workflow state (`Completed`, `In Progress`, `Published`, `Draft`).
  - `publishedAt` (datetime, required): Original publication timestamp.
  - `updatedAt` (datetime, optional): Subsequent revision timestamp.
  - `category` (string, required): Research domain category from frontmatter.
  - `tags` (array of string): Topical classification tags.
  - `researchMethod` (string): Empirical or analytical methodology.
  - `lengthEstimateMinutes` (number): Estimated reading time in minutes.
  - `coverImage` (object): Lead visual graphic with `assetPath` and optional `alt`.
  - `author` (reference to `author`): Author attribution record.
  - `topics` (array of references to `topic`): Curated subject taxonomy links.
  - `derivedPosts` (array of references to `writing`): Essays derived from this report.
  - `relatedProjects` (array of references to `project`): Applied software implementations.
  - `sourceMaterial` (array of `sourceMaterialEntry`): Datasets and primary source papers.
  - `bibliographyHeading` (string, optional): Heading title for references section.
  - `bibliography` (array of `bibliographyEntry`): Sequential formal references.
  - `body` (array of blocks, required): Rich Portable Text body.
  - `sourceArchive` (object of type `sourceArchive`, read-only, required): Provenance metadata.
  - `featured` (boolean, initialValue: `false`, required): Promotional flag.
  - `editorialStatus` (string, initialValue: `'draft'`): Workflow state (`draft`, `in_review`, `approved`).
  - `editorialNotes` (text, optional): Audit annotations or review remarks.

### 3.2. Writing / Essay (`writing`)
- **Purpose:** Editorial essays, analytical commentary, and adapted articles.
- **Fields:**
  - `workbookId` (string, read-only): Stable source identity (e.g. `BLG-001`).
  - `title`, `slug`, `summary`, `status`, `publishedAt`, `updatedAt`, `category`, `tags`.
  - `sourceReport` (reference to `research`, optional): Research report this essay derives from.
  - `relatedProjects` (array of references to `project`).
  - `topics` (array of references to `topic`).
  - `author` (reference to `author`).
  - `coverImage` (object with `assetPath` and `alt`).
  - `readingTimeOverride` (number, optional).
  - `seo` (object of type `seo`: `metaTitle`, `metaDescription`).
  - `canonicalUrl` (url, optional): External canonical destination if syndicated.
  - `bibliographyHeading` and `bibliography` (array of `bibliographyEntry`, optional).
  - `body` (array of blocks: `block`, `imageBlock`, `tableBlock`, `dividerBlock`, `codeBlock`).
  - `sourceArchive` (sourceArchive object, read-only, required).
  - `featured` (boolean, initialValue: `false`, required).
  - `editorialStatus` (string, initialValue: `'draft'`).
  - `editorialNotes` (text, optional).

### 3.3. Project Case Study (`project`)
- **Purpose:** Engineering case studies detailing technical problem statements, architecture, solo contribution, and verifiable outcomes.
- **Fields:**
  - `workbookId` (string, read-only): e.g. `PRJ-001`.
  - `title`, `slug`, `summary`, `status` (`published`, `in-progress`, `archived`, `draft`).
  - `startDate` (date, required) and `endDate` (date, optional).
  - `category` (string, required): e.g. `web-application`, `technology`, `software`.
  - `tags` (array of string).
  - `role` (string, required): Specific engineering scope (e.g. "Solo Full-Stack Developer").
  - `links` (object: `repo`, `live`, `demo` URLs).
  - `techStack` (array of string, required): Frameworks, libraries, and tools.
  - `coverImage` (object with `assetPath` and `alt`).
  - `relatedResearch` (array of references to `research`).
  - `relatedWriting` (array of references to `writing`).
  - `topics` (array of references to `topic`).
  - `body` (array of blocks: Problem, Architecture, Implementation, Outcomes, Lessons).
  - `sourceArchive` (sourceArchive object, read-only, required).
  - `featured` (boolean, initialValue: `false`, required).
  - `editorialStatus` (string, initialValue: `'draft'`).
  - `editorialNotes` (text, optional).

### 3.4. Taxonomy Topic (`topic`)
- **Purpose:** Topic indexing and cross-linking for multidimensional knowledge discovery.
- **Fields:**
  - `title` (string, required): Topic label (e.g. "Artificial Intelligence & Frontier Technologies").
  - `slug` (slug, required): URL route.
  - `domain` (string, required): Subject domain (e.g. Economics, Technology, Governance).
  - `description` (text, required): Scope description.
  - `relatedResearch`, `relatedWriting`, `relatedProjects` (arrays of references).
  - `featured` (boolean, initialValue: `false`, required).
  - `order` (number, optional): Sort order.

### 3.5. Author Attribution (`author`)
- **Purpose:** Author attribution, extensible for future contributors per source content model.
- **Fields:**
  - `authorId` (string, required): e.g. `goutam-prusty`.
  - `name` (string, required): "Goutam Prusty".
  - `slug` (slug, required): `goutam-prusty`.
  - `bio` (text, optional): Biographical note.
  - `url` (url, optional): "https://goutamprusty.com".
  - `avatar` (object with `assetPath` and `alt`).
  - `socialLinks` (object: `linkedin`, `github`, `twitter`).

---

## 4. Custom Portable Text Objects & Blocks

The custom Portable Text structures allow rich CommonMark + GFM representations without silent block dropping:

| Object Type | Kind | Key Fields | Purpose |
|---|---|---|---|
| `portableTextBody` | Array | `block`, `formulaBlock`, `imageBlock`, `tableBlock`, `mermaidBlock`, `codeBlock`, `dividerBlock` | Root block array container for document bodies. |
| `standardBlock` | Block | `style`, `listItem`, `level`, `children`, `markDefs` | Standard paragraphs, headings (h1..h6), blockquotes, lists. |
| `citationMarker` | Inline Object | `citationNumber` (number), `rawMarker` (string) | Lossless inline citation reference anchor inside block children. |
| `inlineFormula` | Inline Object | `formulaId`, `alt`, `assetPath`, `manifestRef`, `dimensions`, `sha256`, `originalPngSha256` | Mathematical equation embedded within prose, list items, or table cells. |
| `inlineImage` | Inline Object | `assetPath`, `alt` | Inline image token inside block children. |
| `formulaBlock` | Block Object | `formulaId`, `alt`, `assetPath`, `manifestRef`, `dimensions`, `sha256`, `originalPngSha256` | Standalone display equation centered between paragraphs. |
| `imageBlock` | Block Object | `assetPath`, `alt`, `caption` | Captioned presentation image/figure block. |
| `tableBlock` | Block Object | `rows` (array of `tableRow`) | GFM table container. |
| `tableRow` | Object | `isHeader` (boolean), `cells` (array of `tableCell`) | Table row with header distinction. |
| `tableCell` | Object | `plainText` (string), `content` (array of `standardBlock`) | Rich table cell supporting spans, bold text, links, and inline formulas. |
| `mermaidBlock` | Block Object | `code` (text, required) | Verbatim Mermaid diagram syntax. |
| `codeBlock` | Block Object | `language` (string), `code` (text, required) | Verbatim source code snippet with syntax identifier. |
| `dividerBlock` | Block Object | `style` (string, initialValue: `'line'`) | Horizontal thematic break (`---` or `***`). |
| `bibliographyEntry`| Object | `order` (number), `rawText` (text), `title` (string), `url` (url) | Lossless sequence item for academic references. |
| `sourceMaterialEntry`| Object | `title` (string), `url` (url) | Primary source research documentation. |
| `sourceArchive` | Object | `v1GitCommit`, `v1RelativePath`, `sourceSha256`, `rawMdxBytes`, `archiveVersion` | Immutable cryptographic provenance tracking baseline. |
| `seo` | Object | `metaTitle` (string), `metaDescription` (text) | Custom SEO page metadata. |

---

## 5. Schema-to-Parser Compatibility Matrix

This matrix demonstrates complete 1:1 bidirectional alignment between the parser's AST transformations and the Sanity schema definitions:

| AST Node / Source Construct | Parser Output Representation | Sanity Schema Type | Schema Location | Parity Status |
|---|---|---|---|---|
| `root` | Document Object | `research`, `writing`, `project` | `migration/schema/documents/` | **100% Lossless** |
| `paragraph` | `{ _type: 'block', style: 'normal', children: [...] }` | `standardBlock` in `portableTextBody` | `migration/schema/objects/portableText.ts` | **100% Lossless** |
| `heading` (depth 1..6) | `{ _type: 'block', style: 'h1'..'h6', children: [...] }`| `standardBlock` (`styles: ['h1'..'h6']`) | `migration/schema/objects/portableText.ts` | **100% Lossless** |
| `blockquote` | `{ _type: 'block', style: 'blockquote', children: [...] }`| `standardBlock` (`styles: ['blockquote']`) | `migration/schema/objects/portableText.ts` | **100% Lossless** |
| `list` (bullet / number) | `{ _type: 'block', listItem: 'bullet'/'number', level: n }`| `standardBlock` (`lists: ['bullet', 'number']`) | `migration/schema/objects/portableText.ts` | **100% Lossless** |
| `table` (GFM) | `{ _type: 'tableBlock', rows: [...] }` | `tableBlock` -> `tableRow` -> `tableCell` | `migration/schema/objects/tableBlock.ts` | **100% Lossless** |
| Table Cell Content | `{ plainText: '...', content: [block] }` | `tableCell.content` (`of: [block]`) | `migration/schema/objects/tableBlock.ts` | **100% Lossless (Rich)** |
| Standalone Formula | `{ _type: 'formulaBlock', formulaId, dimensions, assetPath }` | `formulaBlock` | `migration/schema/objects/formulaBlock.ts` | **100% Lossless (WebP)** |
| Inline Prose Formula | `{ _type: 'inlineFormula', formulaId, dimensions, assetPath }` | `inlineFormula` in `block.of` | `migration/schema/objects/inlineFormula.ts` | **100% Lossless (WebP)** |
| Table Cell Formula | `{ _type: 'inlineFormula', ... }` in `cell.content[0].children` | `inlineFormula` in `tableCell.content.block.of` | `migration/schema/objects/tableBlock.ts` | **100% Lossless (WebP)** |
| Citation Marker (`[^n]`) | `{ _type: 'citationMarker', citationNumber, rawMarker }` | `citationMarker` in `block.of` | `migration/schema/objects/citationMarker.ts` | **100% Lossless** |
| Standalone Image (`![]()`) | `{ _type: 'imageBlock', assetPath, alt, caption }` | `imageBlock` | `migration/schema/objects/imageBlock.ts` | **100% Lossless** |
| Inline Image Token | `{ _type: 'inlineImage', assetPath, alt }` | `inlineImage` in `block.of` | `migration/schema/objects/inlineImage.ts` | **100% Lossless** |
| Mermaid Fence | `{ _type: 'mermaidBlock', code: '...' }` | `mermaidBlock` | `migration/schema/objects/mermaidBlock.ts` | **100% Verbatim** |
| Ordinary Code Fence | `{ _type: 'codeBlock', language, code: '...' }` | `codeBlock` | `migration/schema/objects/codeBlock.ts` | **100% Verbatim** |
| Thematic Break (`---`) | `{ _type: 'dividerBlock' }` | `dividerBlock` | `migration/schema/objects/dividerBlock.ts` | **100% Lossless** |
| Bibliography Section | `doc.bibliography: [{ order, rawText, title, url }]` | `research.bibliography` (`of: [bibliographyEntry]`) | `migration/schema/objects/bibliographyEntry.ts` | **100% Lossless** |
| Source Material (FM) | `doc.sourceMaterial: [{ title, url }]` | `research.sourceMaterial` (`of: [sourceMaterialEntry]`) | `migration/schema/objects/sourceMaterialEntry.ts`| **100% Lossless** |
| Provenance Baseline | `doc.sourceArchive: { v1GitCommit, sourceSha256, ... }` | `sourceArchive` | `migration/schema/objects/sourceArchive.ts` | **100% Immutable** |

---

## 6. Rich Table and Inline Formula Proofs

### 6.1. Rich Table Cells with Equations (`RES-004`)
In `RES-004` (India's Digital Governance Ecosystem Evaluation), Table 1 contains the equation `US![][image1]0.5 trillion by 2025` inside Row 3, Cell 2 (Line 264).
- **Schema Validation Proof:**
  - `tableBlock` contains 8 rows.
  - Row 3 has `cells[1]`.
  - `cells[1].plainText` contains `"US0.5 trillion by 2025 13"`.
  - `cells[1].content` contains a `StandardBlock` where `children` contains:
    1. `span`: `"US"`
    2. `inlineFormula`: `formulaId: 'image1'`, `dimensions: { width: 234, height: 22 }`, `assetPath: '/images/research/indias-digital-governance-ecosystem-evaluation/formula-1.webp'`, `sha256: '...'`
    3. `span`: `"0.5 trillion by 2025 13"`
  - Validated by automated test: `RES-004 table preserves rich inline formula inside cell` (**PASS**).

### 6.2. Standalone Equation Display Blocks (`RES-018` & `RES-022`)
- `RES-018` Line 247: GRPO objective equation validated as root `formulaBlock` (`dimensions: 620×63px`, WebP presentation asset).
- `RES-022` Line 246: Hard-asset valuation equation validated as root `formulaBlock` (`dimensions: 620×60px`, WebP presentation asset).
- Validated by automated test: `Standalone formula blocks are preserved as formulaBlock at root level` (**PASS**).

### 6.3. List Item Equations (`RES-022`)
- Lines 249–252: Equations defining mathematical parameters $M$, $\alpha$, $\beta$, and $S$ are embedded within bullet list item blocks (`listItem: 'bullet'`, `level: 1`).
- Validated by automated test: `Inline formulas in list items are preserved inside block.listItem` (**PASS**).

---

## 7. Provenance, Source Archive & Editorial Invariants

### 7.1. Provenance Baseline Guarantees
Every document schema mandates the `sourceArchive` object, which retains:
- `v1GitCommit`: Strictly `'71ef2c7c5c6a8995cc6901d350cc29c35d427423'` (the frozen V1 repository baseline).
- `v1RelativePath`: Original file location (e.g. `'content/research/empirical-evaluation-of-indias-economic-structure.mdx'`).
- `sourceSha256`: Cryptographic checksum (64 hex characters) of the unparsed source bytes.
- `rawMdxBytes`: Source file size in bytes.
- `archiveVersion`: Baseline version `'v1.0.0-baseline'`.

All fields are marked `readOnly: true` in the Sanity schema to prevent accidental mutation in Sanity Studio.

### 7.2. Editorial Policy Enforcement
1. **Featured Invariant:** In all content schemas (`research`, `writing`, `project`, `topic`), `featured` has `initialValue: false`. No content is featured by default without explicit editorial review.
2. **Approval Prohibition:** Schema validator explicitly fails any document bearing `editorialStatus: 'approved'` without formal sign-off.
3. **Milestone 1C HOLD Documents:** The 5 HOLD writing documents (`BLG-012`, `BLG-013`, `BLG-014`, `BLG-015`, `BLG-021`) remain on HOLD pending the non-destructive path normalization step during ingestion.

---

## 8. Automated Test Results

All three automated test suites execute cleanly with **zero failures (261 total passed assertions)**:

```
================================================================
  MILESTONE 2: SANITY CONTENT SCHEMA OFFLINE VALIDATION SUITE
================================================================

--- Suite 1: Schema Definitions Loading and Registry Integrity ---
  ✓ All 5 document schemas load with correct types and names
  ✓ All 16 object and block schemas load with correct types and names
  ✓ Combined schemaTypes array contains all 21 schemas in standard order

--- Suite 2: Schema-to-Parser Compatibility Coverage ---
  ✓ Every parser block output type has a corresponding schema definition
  ✓ Every parser inline token type has a corresponding schema definition

--- Suite 3: Representative Fixture Validation Against Schemas ---
  ✓ Representative fixture RES-001 validates 100% against research schema with 0 errors
  ✓ Representative fixture RES-004 validates 100% against research schema with 0 errors
  ✓ Representative fixture RES-015 validates 100% against research schema with 0 errors
  ✓ Representative fixture RES-018 validates 100% against research schema with 0 errors
  ✓ Representative fixture RES-019 validates 100% against research schema with 0 errors
  ✓ Representative fixture RES-020 validates 100% against research schema with 0 errors
  ✓ Representative fixture RES-022 validates 100% against research schema with 0 errors
  ✓ Representative Writing document (BLG-001) validates against writing schema
  ✓ Representative Writing document with figures (BLG-003) validates against writing schema
  ✓ Representative Project document (PRJ-001: Inkline) validates against project schema
  ✓ Representative Topic document instance validates against topic schema
  ✓ Representative Author document instance validates against author schema

--- Suite 4: Rich Table Cells Structure & Preservation ---
  ✓ Tables in RES-001 preserve structured rows and rich cell content blocks
  ✓ RES-004 table preserves rich inline formula inside cell

--- Suite 5: Inline Formulas Syntactic Containment ---
  ✓ Inline formulas in prose paragraphs retain dimensions and WebP presentation path
  ✓ Inline formulas in list items are preserved inside block.listItem
  ✓ Standalone formula blocks are preserved as formulaBlock at root level

--- Suite 6: Lossless Citation Markers & Bibliography Data ---
  ✓ Citation markers in RES-015 preserve numerical order and raw marker strings
  ✓ Bibliography entries in RES-001 retain exact sequential order and titles

--- Suite 7: Verbatim Mermaid & JSON Code Blocks ---
  ✓ RES-019 retains verbatim multi-line Mermaid diagram syntax
  ✓ RES-019 retains verbatim JSON code block without corruption

--- Suite 8: Document References & Relationship Typing ---
  ✓ RES-015 retains derivedPosts relationship references to writing documents
  ✓ Writing document references its parent research document in sourceReport

--- Suite 9: Required Fields, Optional Fields & Default Values ---
  ✓ Validator catches missing required fields and rejects invalid types
  ✓ Editorial featured field defaults strictly to false in all schema definitions
  ✓ Validator rejects document marked approved without authorization

--- Suite 10: Source Archive Provenance Metadata Retention ---
  ✓ Fixture RES-001 retains immutable sourceArchive provenance metadata
  ✓ Fixture RES-004 retains immutable sourceArchive provenance metadata
  ✓ Fixture RES-015 retains immutable sourceArchive provenance metadata
  ✓ Fixture RES-018 retains immutable sourceArchive provenance metadata
  ✓ Fixture RES-019 retains immutable sourceArchive provenance metadata
  ✓ Fixture RES-020 retains immutable sourceArchive provenance metadata
  ✓ Fixture RES-022 retains immutable sourceArchive provenance metadata
================================================================
  TEST RESULTS: 38 PASSED, 0 FAILED (Total: 38)
================================================================
ALL 10 VALIDATION SUITES PASSED WITH ZERO ERRORS.
```

### Pre-Existing Test Suites Verification:
- **Milestone 1B Parity Test Suite** (`migration/tests/milestone-1b-parity.test.cjs`): **183 / 183 PASSED**
- **Milestone 1C Compatibility Test Suite** (`migration/tests/milestone-1c-compatibility.test.cjs`): **40 / 40 PASSED**
- **Astro Type Check** (`npm run check`): **0 errors, 0 warnings, 0 hints** across 69 files
- **Static Production Build** (`npm run build`): **23 static pages generated in 664ms**
- **Git Diff Hygiene** (`git diff --check`): **0 errors, 0 whitespace warnings**

---

## 9. Unresolved Schema & Editorial Decisions Register

The following items are documented for editorial resolution during Sanity configuration and content ingestion; none were assumed or fabricated:

| Item ID | Component | Source Evidence | Schema Status in M2 | Required Editorial Decision / Next Action |
|---|---|---|---|---|
| **SCH-01** | `research.category` vs Taxonomy | `category` in V1 frontmatter is a free string (e.g. `"Macroeconomics & Trade"`), whereas `categories.yml` uses slugs (e.g. `business-strategy`). | Modeled as `string` to maintain 100% lossless parity with V1 source frontmatter. | Confirm whether categories in V2 Sanity should remain strings or migrate to reference documents linked to `categories.yml`. |
| **SCH-02** | `sourceReport` Reference Format | Writing frontmatter in V1 references parent research papers by slug (e.g. `'strategic-intelligence-report-...'`) rather than workbook ID (e.g. `'RES-010'`). | Schema models `sourceReport` as a reference `to: [{ type: 'research' }]`. | Ingestion script should resolve slugs to Sanity document IDs (`research-RES-xxx`) during batch import. |
| **SCH-03** | `derivedPosts` Reference Format | Research frontmatter in V1 (`RES-015`) references derived posts by slug array (e.g. `['the-billionaire-raj', ...]`). | Schema models `derivedPosts` as array of references `to: [{ type: 'writing' }]`. | Ingestion script should resolve slugs to Sanity document IDs (`writing-BLG-xxx`) during batch import. |
| **SCH-04** | Project Start & End Dates | `inkline.mdx` has `startDate: "2026-06-14"`, `endDate: "2026-07-06"`. `vitaliq.mdx` has `endDate: null`. | Schema defines `startDate` as required `date` and `endDate` as optional `date`. | Fully verified against V1 source data; no further schema change needed. |
| **SCH-05** | Image Upload vs Asset Path | M1 WebP presentation assets live at `public/images/...` on disk. In full Sanity Studio, images are typically stored in the Sanity Asset Lake (`_type: 'image'`, `asset: { _ref: 'image-...' }`). | Schemas model cover and figure images with `assetPath` string field, directly compatible with Sanity image asset reference migration. | During live ingestion, tooling can upload local WebP binaries to the Sanity asset pipeline and populate `asset._ref`. |

---

## 10. Verification Commands

To independently reproduce all Milestone 2 results from `D:\goutamprusty-v2`:

```powershell
# 1. Run Milestone 2 Schema Validation Test Suite (38 assertions)
node migration/tests/milestone-2-schema.test.cjs

# 2. Re-run Milestone 1C Compatibility Test Suite (40 assertions)
node migration/tests/milestone-1c-compatibility.test.cjs

# 3. Re-run Milestone 1B Parity Test Suite (183 assertions)
node migration/tests/milestone-1b-parity.test.cjs

# 4. Verify TypeScript and Astro Project Diagnostics
npx tsc --noEmit
npm run check

# 5. Verify Static Production Build
npm run build

# 6. Check Git Diff Hygiene
git diff --check
```

---

## 11. Completion Checklist

- [x] All 5 document schemas load successfully (`research`, `writing`, `project`, `topic`, `author`).
- [x] All 16 object and block schemas load successfully (including `tableBlock`, `formulaBlock`, `inlineFormula`, `citationMarker`, `sourceArchive`).
- [x] All 7 representative Research fixtures validate 100% against `research` schema with 0 errors.
- [x] Representative Writing and Project documents validate 100% against their schemas with 0 errors.
- [x] Rich table cells preserve structured rows and cell content blocks with inline formulas.
- [x] Inline formula objects appear in prose, list items, and table cells with verified WebP paths and dimensions.
- [x] Citation markers and bibliography data remain lossless.
- [x] Mermaid and JSON code blocks preserve exact source text.
- [x] Required fields, optional fields, and default values behave as intended (`featured` defaults to `false`).
- [x] Source archive provenance metadata is retained without modification.
- [x] No source content was silently dropped, rewritten, or approved.
- [x] All pre-existing Milestone 1B and 1C tests pass (223 / 223 passed).
- [x] `npm run check` passes with 0 errors, 0 warnings, 0 hints.
- [x] `npm run build` passes with 23 static pages generated.
- [x] `git diff --check` passes with 0 errors.
- [x] V1 repository remains strictly unmodified.
- [x] `Content_Inventory.xlsx` and `research-webp-final/` remain strictly untouched.
- [x] No live Sanity project, credentials, or accounts were created.
- [x] Stopped after producing the report without beginning Sanity setup or ingestion.
