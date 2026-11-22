# PASS Document Content Construct & Coverage Matrix

**Date:** 2026-11-22
**Corpus Summary:** 37 PASS documents (21 Research, 16 Writing) + 5 HOLD Writing documents.
**Schema Status:** Real Sanity schema and Astro `PortableText.astro` renderer extended and 100% verified.

## 1. Summary of Supported Constructs

| Construct | Sanity Schema Type | Astro Renderer Support | Verified Examples |
|---|---|---|---|
| **Standalone Formula** | `formulaBlock` | `<figure class="ps-figure"><img .../></figure>` | RES-018, RES-022 |
| **Inline Formula (Prose & Lists)** | `inlineFormula` | `<img ... class="inline-block align-middle"/>` | RES-001, RES-020, RES-022 |
| **Inline Formula (Table Cell)** | `inlineFormula` inside `tableCell.content` | Rich cell rendering with `<img>` | RES-004 (Table 1, Row 3) |
| **Standalone Content Image** | `imageBlock` | `<figure class="ps-figure"><img .../></figure>` | BLG-003, BLG-006, BLG-008, BLG-011, BLG-016, BLG-020 |
| **Inline Image** | `inlineImage` | `<img ... class="inline-block align-middle"/>` | Portable text inline image tokens |
| **Tables & Rich Cells** | `tableBlock`, `tableRow`, `tableCell` | `<table class="w-full ...">...</table>` | 74 tables across 20+ documents |
| **Code Block** | `codeBlock` | `<div class="ps-code-wrap"><pre><code>...</code></pre></div>` | RES-019 (JSON spec) |
| **Mermaid Diagram** | `mermaidBlock` | `<figure class="ps-figure"><pre class="mermaid">...</pre></figure>` | RES-019 (ERD & Architecture) |
| **Divider / Thematic Break** | `dividerBlock` | `<hr class="my-8 border-stone-300"/>` | RES-019, editorial breaks |
| **Citation Markers** | `citationMarker` | `<sup><a href="#cite-N">[N]</a></sup>` | 1,968 markers across 20 documents |
| **Bibliography & Works Cited** | `bibliographyEntry` | Structured ordered list with canonical URLs | 1,433 citations across 20 documents |
| **Source Material Index** | `sourceMaterialEntry` | Structured dataset / primary sources | 1,529 entries across 21 documents |
| **Taxonomy & Entity Documents** | `author`, `topic`, `project` | Clean document schemas & bidirectional references | authors.yml, topic tags, projects |

---

## 2. Document-by-Document Coverage Matrix (37 PASS Documents)

| Document ID | Type | Required Constructs | Schema Supported | Renderer Supported | Ingestion Status |
|---|---|---|---|---|---|
| **RES-001** | Research | Inline Formula, Table (4), Citations (102), Sources (102) | YES | YES | Pending Batch Ingestion |
| **RES-002** | Research | Table (3), Citations (94), Sources (94) | YES | YES | Pending Batch Ingestion |
| **RES-003** | Research | Divider, Citations (67), Sources (67) | YES | YES | Pending Batch Ingestion |
| **RES-004** | Research | Inline Formula (Table Cell), Table (8), Citations (97), Sources (97) | YES | YES | Pending Batch Ingestion |
| **RES-005** | Research | Table (2), Citations (82), Sources (82) | YES | YES | Pending Batch Ingestion |
| **RES-006** | Research | Table (3), Citations (83), Sources (83) | YES | YES | Pending Batch Ingestion |
| **RES-007** | Research | Divider, Citations (88), Sources (88) | YES | YES | Pending Batch Ingestion |
| **RES-008** | Research | Divider, Citations (89), Sources (89) | YES | YES | Pending Batch Ingestion |
| **RES-009** | Research | Divider, Citations (98), Sources (98) | YES | YES | Pending Batch Ingestion |
| **RES-010** | Research | Table (1), Divider, Citations (59), Sources (59) | YES | YES | Pending Batch Ingestion |
| **RES-011** | Research | Table (4), Citations (96), Sources (96) | YES | YES | Pending Batch Ingestion |
| **RES-012** | Research | Table (3), Citations (80), Sources (80) | YES | YES | Pending Batch Ingestion |
| **RES-013** | Research | Table (4), Citations (78), Sources (78) | YES | YES | Pending Batch Ingestion |
| **RES-014** | Research | Table (4), Sources (55), Derived Posts | YES | YES | Pending Batch Ingestion |
| **RES-015** | Research | Divider, Citations (48), Sources (48), Derived Posts | YES | YES | Pending Batch Ingestion |
| **RES-016** | Research | Table (4), Divider, Citations (40), Sources (40) | YES | YES | Pending Batch Ingestion |
| **RES-018** | Research | Standalone Formula, Table (1), Citations (71), Sources (71) | YES | YES | Yes (Vertical Slice) |
| **RES-019** | Research | Table (8), Code Block, Mermaid Diagram, Divider, Citations (39), Sources (39) | YES | YES | Pending Batch Ingestion |
| **RES-020** | Research | Inline Formula, Table (2), Citations (65), Sources (65) | YES | YES | Pending Batch Ingestion |
| **RES-021** | Research | Table (7), Sources (41) | YES | YES | Pending Batch Ingestion |
| **RES-022** | Research | Standalone Formula, Inline Formula, Table (6), Citations (57), Sources (57) | YES | YES | Pending Batch Ingestion |
| **BLG-001** | Writing | Divider, Parent Report Ref | YES | YES | Yes (Vertical Slice) |
| **BLG-002** | Writing | Divider, Parent Report Ref | YES | YES | Yes (Vertical Slice) |
| **BLG-003** | Writing | Image Block, Divider | YES | YES | Pending Batch Ingestion |
| **BLG-004** | Writing | Divider | YES | YES | Pending Batch Ingestion |
| **BLG-005** | Writing | Table (3), Divider, Parent Report Ref | YES | YES | Pending Batch Ingestion |
| **BLG-006** | Writing | Image Block | YES | YES | Pending Batch Ingestion |
| **BLG-007** | Writing | Table (3), Parent Report Ref | YES | YES | Pending Batch Ingestion |
| **BLG-008** | Writing | Image Block | YES | YES | Pending Batch Ingestion |
| **BLG-009** | Writing | Prose | YES | YES | Pending Batch Ingestion |
| **BLG-011** | Writing | Image Block, Divider | YES | YES | Pending Batch Ingestion |
| **BLG-016** | Writing | Image Block | YES | YES | Pending Batch Ingestion |
| **BLG-017** | Writing | Divider | YES | YES | Pending Batch Ingestion |
| **BLG-018** | Writing | Prose | YES | YES | Pending Batch Ingestion |
| **BLG-019** | Writing | Divider | YES | YES | Pending Batch Ingestion |
| **BLG-020** | Writing | Image Block | YES | YES | Pending Batch Ingestion |
| **BLG-022** | Writing | Table (3), Divider | YES | YES | Pending Batch Ingestion |

---

## 3. HOLD Documents (Excluded from Migration)

| Document ID | Slug | Hold Reason | Schema Ready | Ingestion Status |
|---|---|---|---|---|
| **BLG-012** | `structure-not-conspiracy` | Route-relative image paths require URI normalization: images/blog/structure-not-conspiracy/Compliance-and-imprisonment-clause-breakdown.webp, images/blog/structure-not-conspiracy/Poverty-vs.-inequality-diverging-lines-chart.webp, images/blog/structure-not-conspiracy/Editorial-illustration-for-protest-precarity-theme.webp | YES | BLOCKED (HOLD) |
| **BLG-013** | `the-asset-trap` | Route-relative image paths require URI normalization: images/blog/the-asset-trap/Household-wealth-composition-chart.webp, images/blog/the-asset-trap/Real-return-by-asset-class-chart.webp | YES | BLOCKED (HOLD) |
| **BLG-014** | `the-billionaire-raj` | Broken image asset reference: images/blog/the-billionaire-raj/Wealth-pyramid-infographic.webp (ROUTE_RELATIVE_PATH), images/blog/GST-incidence-by-fractile-chart.webp (BROKEN_MISSING_SLUG_FOLDER), images/blog/Household-debt-growth-timeline.webp (BROKEN_MISSING_SLUG_FOLDER) | YES | BLOCKED (HOLD) |
| **BLG-015** | `the-jobs-that-arent-jobs` | Route-relative image paths require URI normalization: images/blog/the-jobs-that-arent-jobs/The_Wrong_Direction.webp, images/blog/the-jobs-that-arent-jobs/Falling_Unemployment,_Flat_Wages.webp | YES | BLOCKED (HOLD) |
| **BLG-021** | `why-your-central-bank-wants-some-inflation` | Route-relative image paths require URI normalization: images/blog/why-your-central-bank-wants-some-inflation/Inflation-target-rationale-diagram.webp, images/blog/why-your-central-bank-wants-some-inflation/Inflation-target-rationale-diagram.webp | YES | BLOCKED (HOLD) |
