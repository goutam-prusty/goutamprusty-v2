# Milestone 2B — Sanity Serialization Contract Remediation Report

**Date:** 2026-11-21  
**Working Directory:** `D:\goutamprusty-v2`  
**Current Branch:** `codex/sanity-content-architecture`  
**V1 Source Repository:** `D:\goutamprusty-v1` (Strictly Read-Only, Baseline Commit: `71ef2c7c5c6a8995cc6901d350cc29c35d427423`)  
**Status:** Complete & Fully Verified  

---

## Executive Summary

Milestone 2B resolves the two critical ingestion blockers (**F-01** Array Object Typing and **F-02** Reference Normalization) and four technical warnings (**F-03**, **F-04**, **F-05**, **F-06**, with **F-07** documented) identified during the Milestone 2A Schema Integrity and Contract Audit.

By introducing a dedicated, deterministic serialization and normalization engine (`migration/lib/serialization-contract.cjs`), the migration pipeline now transforms raw AST parser outputs into valid, ingestion-ready Sanity Content Lake document representations. All array items carry exact registered schema types and collision-free deterministic keys, document cross-references are normalized from raw strings into `{ _type: 'reference', _ref: '<docId>', _sourceSlug: '<slug>' }` objects, local image paths are cleanly decoupled from native Sanity asset IDs, legacy V1 project metadata is preserved without violating V2 editorial defaults, and a mandatory migration eligibility gate strictly blocks documents with known unresolved anomalies.

All remediations were validated offline through 23 comprehensive tests in `migration/tests/milestone-2b-remediation.test.cjs`. Zero network calls were made, no Sanity projects or credentials were created or required, the V1 repository remained strictly read-only, and `Content_Inventory.xlsx` and `research-webp-final/` remained untouched.

---

## Audit Resolution Matrix

| Audit Item | Severity | Finding Summary | Resolution Strategy | Verification Method | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **F-01** | **BLOCKER** | Array member objects omit `_type` | Injected registered types (`sourceMaterialEntry`, `bibliographyEntry`, `tableRow`, `tableCell`) with deterministic `_key` | Suite 1 & 6 (res001, res004, res015, prj001) | **RESOLVED** |
| **F-02** | **BLOCKER** | References emitted as raw slugs | Implemented pure slug-to-ID lookup producing `{ _type: 'reference', _ref, _sourceSlug }` | Suite 2 & 6 (res015 -> blg012, blg001 -> res018) | **RESOLVED** |
| **F-03** | **WARNING** | Disk asset existence blindspot | Independent eligibility gate failing closed on `HOLD` status in `full-corpus-compatibility.json` | Suite 4 (blg012-015, blg021 strictly blocked) | **RESOLVED** |
| **F-04** | **WARNING** | `coverImage` type discrepancy | Standardized as anonymous object `{ assetPath, alt }`; no misleading `_type: 'image'` | Suite 3 (blg001, res001, prj001) | **RESOLVED** |
| **F-05** | **WARNING** | Reference integrity dependency | 45-document authoritative lookup table; closed-failure on missing or colliding slugs | Suite 2 (45 unique mappings verified) | **RESOLVED** |
| **F-06** | **WARNING** | Project `featured: true` override | Preserved V1 flag as `legacyFeatured: true`; enforced V2 editorial `featured: false` | Suite 5 & 6 (prj001 Inkline, prj002 Vitaliq) | **RESOLVED** |
| **F-07** | **INFO** | Taxonomy & author contracts | Defined formal mapping specifications for `authors.yml` and workbook topics | Contract specification JSON & Section 6 | **DOCUMENTED** |

---

## Detailed Technical Resolutions

### 1. F-01: Array Object Typing (`serializeArrayMembers`)

#### The Problem
Sanity Studio Form Builder and the Sanity Content Lake mutation endpoint require every object within an array field to specify a valid, registered `_type` string—even when the array's schema definition permits only a single member type. Without `_type`, Sanity Studio v3 renders an unrecognized member error and blocks editing. The parser previously emitted plain JavaScript objects lacking `_type` for `sourceMaterial`, `bibliography`, `tableBlock.rows`, and `tableRow.cells`.

#### The Resolution
`serializeArrayMembers(doc)` traverses the document AST and recursively injects exact registered schema types and deterministic, collision-free `_key` attributes:
- `research.sourceMaterial` $\rightarrow$ `_type: 'sourceMaterialEntry'`, `_key: makeKey('<docId>:sm:<index>:<title>')`
- `research.bibliography` $\rightarrow$ `_type: 'bibliographyEntry'`, `_key: makeKey('<docId>:bib:<order>:<index>')`
- `tableBlock.rows` $\rightarrow$ `_type: 'tableRow'`, `_key: makeKey('<docId>:table:<blockIdx>:row:<rowIdx>')`
- `tableRow.cells` $\rightarrow$ `_type: 'tableCell'`, `_key: makeKey('<docId>:table:<blockIdx>:row:<rowIdx>:cell:<cellIdx>')`

Within each array, a local `Set` tracks emitted keys and throws an error immediately if a duplicate key is encountered. Source order, numbers, titles, and text values are preserved with 100% fidelity.

---

### 2. F-02 & F-05: Reference Normalization (`normalizeReferences`)

#### The Problem
The offline parser extracted frontmatter relationship fields (`derivedPosts`, `sourceReport`, `relatedProjects`) as bare string slugs (e.g. `"structure-not-conspiracy"`). Sanity requires document references to be structured objects: `{ _type: 'reference', _ref: '<targetDocumentId>' }`. Bare strings cause schema validation failures and cannot create graph edges in the Content Lake.

#### The Resolution
1. **Authoritative ID Scheme:** Documents follow the deterministic pattern `<docType>-<workbookId>`:
   - Research: `research-RES-001` through `research-RES-022`
   - Writing: `writing-BLG-001` through `writing-BLG-022`
   - Projects: `project-PRJ-001` through `project-PRJ-003`
2. **Deterministic Lookup Mapping:** `buildAuthoritativeReferenceMap()` constructs an offline lookup table indexing all 42 corpus documents from `migration/full-corpus-compatibility.json` plus the 3 projects from `content/projects/`. Exactly 45 unique slug-to-ID mappings are registered with zero collisions.
3. **Reference Object Construction:** References are transformed into:
   ```json
   {
     "_type": "reference",
     "_ref": "writing-BLG-012",
     "_sourceSlug": "structure-not-conspiracy"
   }
   ```
   When contained in an array (e.g., `derivedPosts`), a deterministic `_key` is additionally attached.
4. **Closed Failure Mode:** If an input slug is missing from the authoritative map or maps ambiguously, the engine throws a `ReferenceResolutionError` containing the document ID, field name, and offending slug. It never guesses or fabricates a target ID.

---

### 3. F-03: Mandatory Migration Eligibility Gate (`checkMigrationEligibility`)

#### The Problem
The Milestone 2A audit revealed that schema validation alone cannot verify disk asset integrity. For example, `BLG-012` passed syntactic schema validation 100% despite containing broken route-relative figure asset paths lacking leading slashes. Ingestion tools relying solely on schema checks would ingest corrupted documents.

#### The Resolution
The eligibility gate `checkMigrationEligibility(docId)` decouples data validity from migration eligibility:
- It inspects `migration/full-corpus-compatibility.json`, which records the authoritative asset path and parser audit results.
- Only documents with explicit `status === 'PASS'` are permitted to proceed.
- Documents with `status === 'HOLD'` (`BLG-012`, `BLG-013`, `BLG-014`, `BLG-015`, `BLG-021`) trigger a `MigrationEligibilityError` and are completely halted.
- Documents with unknown, missing, or malformed statuses fail closed with status `'NOT_FOUND'` or `'UNKNOWN_STATUS'`.
- Schema validator checks remain pure structural tests; they cannot override the eligibility gate.

---

### 4. F-04: Object Typing & Cover Image Normalization (`serializeObjects`)

#### The Problem
The parser previously attached `_type: 'image'` to `coverImage` objects pointing to local WebP paths (e.g. `/images/blog/...`). However, Sanity Studio v3 reserves `_type: 'image'` for native asset references containing an `asset: { _type: 'reference', _ref: 'image-<id>-<dim>-<ext>' }` structure. Applying `_type: 'image'` to a local relative path causes Studio to render broken asset widgets.

#### The Resolution
1. **Anonymous Cover Image Object:** Standardized `coverImage` across `research`, `writing`, and `project` schemas as an anonymous object:
   ```json
   {
     "assetPath": "/images/research/empirical-evaluation-of-indias-economic-structure/cover.webp",
     "alt": ""
   }
   ```
   Local paths are preserved cleanly without synthesizing non-existent Sanity asset IDs.
2. **Explicit Object Types:** For standalone metadata objects, explicit typing is ensured:
   - `seo` $\rightarrow$ `_type: 'seo'`
   - `sourceArchive` $\rightarrow$ `_type: 'sourceArchive'`

---

### 5. F-06: Legacy Featured Metadata Decoupling (`normalizeFeatured`)

#### The Problem
V1 project frontmatter files (`content/projects/inkline.mdx` and `vitaliq.mdx`) contained `featured: true`. Merging this directly into Sanity's `featured` field would violate the project's strict editorial governance rule that all migrated content must default to `featured: false` and `editorialStatus: 'draft'` pending human editorial review. However, silently discarding `featured: true` would violate content integrity and provenance rules.

#### The Resolution
1. **Schema Extension:** Added a read-only field `legacyFeatured` (type: `boolean`) to the `project` schema in both TypeScript (`migration/schema/documents/project.ts`, `migration/types/sanity-schema.ts`) and CommonJS runtime (`migration/schema/index.cjs`).
2. **Normalization Logic:** For project documents:
   - `legacyFeatured` captures `Boolean(doc.featured)` (e.g. `true` for Inkline and Vitaliq, `false` for Wharf).
   - `featured` is strictly reset to `false`.
   - `editorialStatus` defaults to `'draft'`.
3. For Research and Writing documents, `featured` is strictly enforced as `false` and `editorialStatus` as `'draft'`.

---

### 6. F-07: Taxonomy and Author Mapping Specifications

Future ingestion of authors and topics is specified in `migration/milestone-2b-serialization-contract.json`:

1. **Author Documents (`content/_meta/authors.yml`):**
   - Source: YAML dictionary keyed by author identifier (e.g., `goutam-prusty`).
   - Target ID: `author-<authorId>`.
   - Fields: `name`, `slug` (`{ _type: 'slug', current: authorId }`), `bio`, `avatar` (`{ assetPath, alt }`), `socialLinks`.
2. **Topic Documents (`Content_Inventory.xlsx` Topics Sheet):**
   - Source: Curated topics table.
   - Target ID: `topic-<slug>`.
   - Fields: `title`, `slug` (`{ _type: 'slug', current: slug }`), `domain`, `description`, `featured: false`.

Ingestion for both remains deferred until document ingestion tooling is established.

---

## Verification Battery Results

All automated verification commands were executed and passed cleanly:

```powershell
# 1. Milestone 2B Remediation Suite (23 tests)
node migration/tests/milestone-2b-remediation.test.cjs
# Result: 23 PASSED, 0 FAILED

# 2. Milestone 2A Contract Gap Suite (8 tests)
node migration/tests/milestone-2a-contract.test.cjs
# Result: 8 PASSED, 0 FAILED

# 3. Milestone 2 Schema Validation Suite (38 tests)
node migration/tests/milestone-2-schema.test.cjs
# Result: 38 PASSED, 0 FAILED

# 4. Milestone 1C Parser & Corpus Compatibility Suite (40 tests)
node migration/tests/milestone-1c-compatibility.test.cjs
# Result: 40 PASSED, 0 FAILED

# 5. Milestone 1B Parser Proof Parity Suite (183 tests)
node migration/tests/milestone-1b-parity.test.cjs
# Result: 183 PASSED, 0 FAILED

# 6. TypeScript Strict Type-Checking
npx tsc --noEmit
# Result: Code 0 (Zero errors)
```

**Total automated tests passing:** 292 of 292 (100%).

---

## Offline Validation vs. Live Sanity Studio Ingestion

An explicit distinction must be maintained between the offline verification conducted here and actual live Sanity ingestion:

1. **What has been proven offline:**
   - Every serialized document strictly matches the structure, field names, allowed values, and nested block formats defined in Sanity schemas.
   - All object arrays carry required `_type` and deterministic `_key` values.
   - All cross-document references resolve to real, unambiguous corpus document IDs.
   - The eligibility gate reliably blocks corrupted documents without relying on schema parsers.
2. **What remains for live ingestion (Milestone 3+):**
   - Image assets (both covers and inline formulas) must be uploaded via Sanity Asset API or served via static CDN if retained as relative URLs.
   - Sanity Client / CLI credentials and dataset creation must be established with user approval.
   - Transactions / mutations must be submitted to the Sanity Content Lake.

---

## Deliverables Generated in Milestone 2B

1. `migration/lib/serialization-contract.cjs` — Core serialization, reference normalization, and eligibility engine.
2. `migration/schema/documents/project.ts` — Updated TypeScript project schema with `legacyFeatured`.
3. `migration/schema/index.cjs` — Updated CommonJS runtime schema with `legacyFeatured`.
4. `migration/types/sanity-schema.ts` — Updated TypeScript types for `ProjectDocument` and `coverImage`.
5. `migration/tests/milestone-2b-remediation.test.cjs` — 23-test automated regression and remediation suite.
6. `migration/milestone-2b-serialization-contract.json` — Machine-readable contract specification.
7. `migration/milestone-2b-remediation-report.md` — This formal report.

---

## Next Steps

Milestone 2B is complete. In accordance with the non-negotiable safety rules:
- No Sanity project or account has been created.
- No ingestion tooling or live API calls have been initiated.
- No files have been staged or committed.
- The 5 HOLD documents remain safely on HOLD.

The pipeline is now fully prepared for **Milestone 3 (Sanity Ingestion Tooling & CLI Integration)** when authorized.
