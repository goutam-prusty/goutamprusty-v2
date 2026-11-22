# Batch 2 Asset & Content Manifest

**Generated:** 2026-11-22  
**Target Batch:** 6 PASS Documents (`RES-001`, `RES-010`, `RES-021`, `BLG-004`, `BLG-006`, `BLG-007`)  
**Status:** Dry-run validated (0 errors); assets verified on disk in V2 `public/` (0 Sanity writes).

---

## 1. Document Inventory & Construct Counts

| ID | Type | Title | Body Blocks | Tables | Image Blocks | Dividers | Formulas (Inline/Block) | Bibliography / Sources | Dependencies / Cross-Refs |
|---|---|---|---|---|---|---|---|---|---|
| **RES-001** | Research | Empirical Evaluation of India's Economic Structure: Market Competitiveness, Productivity Growth, Firm Scaling, and Resource Allocation | 101 | 4 | 0 | 0 | 3 inline / 0 block | 102 bib / 102 sources | None |
| **RES-010** | Research | Mapping the Current State of AI and Frontier Technologies (2015–2026) | 200 | 1 | 0 | 1 | 0 inline / 0 block | 59 bib / 59 sources | None |
| **RES-021** | Research | The Convergence-Divergence Paradox: A Structural Analysis of the Indian and Chinese Political-Economic Systems (2000–2025) | 81 | 7 | 0 | 0 | 0 inline / 0 block | 0 bib / 41 sources | Target of `BLG-007` (`sourceReport`) |
| **BLG-004** | Writing | The Billionaire Raj: What India's Inequality Actually Costs | 54 | 0 | 0 | 1 | 0 inline / 0 block | 0 bib / 0 sources | None |
| **BLG-006** | Writing | I Used AI to Find the Ceiling | 16 | 0 | 1 | 0 | 0 inline / 0 block | 0 bib / 0 sources | None |
| **BLG-007** | Writing | India Is Borrowing China's Playbook | 27 | 3 | 0 | 0 | 0 inline / 0 block | 0 bib / 0 sources | `sourceReport` -> `research-RES-021` |

**Batch Totals:**
- **Documents:** 6 (3 Research, 3 Writing)
- **Body Blocks:** 479
- **Tables:** 15 (`tableBlock`)
- **Image Blocks:** 1 (`imageBlock`)
- **Dividers:** 2 (`dividerBlock`)
- **Inline Formulas:** 3 (`inlineFormula`)
- **Bibliography Entries:** 161
- **Source Material Entries:** 202
- **Cross-Document References:** 1 (`BLG-007` references `RES-021`, resolved intra-batch)

---

## 2. Asset Manifest Table

**Total Assets:** 10 (7 Copied from V1, 3 Pre-existing WebP Formulas in V2)

| Document | Role | Destination Path | Size (Bytes) | SHA-256 Hash | Status |
|---|---|---|---|---|---|
| **RES-001** | cover | `public/images/research/empirical-evaluation-of-indias-economic-structure/cover.webp` | 1,69,080 | `a69ad07f509e6bfc4b34ad00e4b3f7bc301b4570372f1169747fbff61d717b86` | Copied from V1 |
| **RES-001** | inlineFormula | `public/images/research/empirical-evaluation-of-indias-economic-structure/formula-1.webp` | 616 | `e3e351b888247581a6a2e38b0c443dfd37aa432c49378567999264a5e405d6bb` | Pre-existing in V2 |
| **RES-001** | inlineFormula | `public/images/research/empirical-evaluation-of-indias-economic-structure/formula-2.webp` | 604 | `05530573e5dc2e4c97fddb2e4645b777473baf0da8ab2cb2659347c978b737b6` | Pre-existing in V2 |
| **RES-001** | inlineFormula | `public/images/research/empirical-evaluation-of-indias-economic-structure/formula-3.webp` | 1,490 | `56212ec3fcfab1fa1d401da9a4c6cc79372263cac798336af5d7010d86bbc6cf` | Pre-existing in V2 |
| **RES-010** | cover | `public/images/research/mapping-the-current-state-of-ai-and-frontier-technologies-2015-2026/cover.webp` | 1,55,554 | `9eae20430aab163667b2a4f75dded29a4aacb737a126282fc5634812781505a0` | Copied from V1 |
| **RES-021** | cover | `public/images/research/the-convergence-divergence-paradox-a-structural-analysis-of-the-indian-and-chinese-political-economic-systems-2000-2025/cover.webp` | 1,09,992 | `82b2efbb935eb2b4869d537e6dd90c7db715865ffc3c0cc4e3b42f9b346a193e` | Copied from V1 |
| **BLG-004** | cover | `public/images/blog/billionaire-raj-india-inequality-costs/cover.webp` | 2,73,404 | `897331f2a7b7a09a487b2c5ea8d5ab3ee01f11e9a8f8a800f417cd7fdb29a9ac` | Copied from V1 |
| **BLG-006** | cover | `public/images/blog/i-used-ai-to-find-the-ceiling/cover.webp` | 2,56,842 | `a0674ad175efa754c3b62a51f1ce854638a1950b78c82d0ec1e3d0c68d6e9bbc` | Copied from V1 |
| **BLG-006** | imageBlock | `public/images/blog/i-used-ai-to-find-the-ceiling/image-1.webp` | 1,92,502 | `e4c4a1828db7c1eec85503102d4723a163424bea0a6941501b1e4b50bc6ee613` | Copied from V1 |
| **BLG-007** | cover | `public/images/blog/india-is-borrowing-chinas-playbook/cover.webp` | 2,48,484 | `e062542247ef7bc744bcec8a812f3034f0d1e2e5e447f687afd95a69a542198e` | Copied from V1 |

---

## 3. Verification Invariants

1. **Zero Missing Assets:** All 10 assets exist on disk in V2 `public/`.
2. **Non-Zero File Sizes:** Every file size is strictly positive (ranging from 604 B to 273.4 KB).
3. **Format Integrity:** All 10 images are verified valid WebP binaries (`RIFF` header + `WEBP` form type).
4. **Byte-for-Byte Fidelity:** All 7 assets copied from V1 match their V1 source SHA-256 hashes exactly.
5. **Zero Unreferenced Assets:** V1 directories for all 6 documents were inspected; no unreferenced images or orphaned files exist.
6. **Zero Duplicate Assets:** Every asset is uniquely addressed by its relative path and hash.

---

## 4. Cross-Document Reference Validation

- **`BLG-007` -> `RES-021`:**
  - Frontmatter `sourceReport`: `the-convergence-divergence-paradox-a-structural-analysis-of-the-indian-and-chinese-political-economic-systems-2000-2025`
  - Normalized Sanity reference: `{"_type": "reference", "_ref": "research-RES-021"}`
  - Target document `research-RES-021` is included in Batch 2.
  - Provenance: `sourceArchive.referencedSlugs` preserves the raw source slug for auditing.
- **HOLD Document Isolation:**
  - Documents `RES-014` and `RES-015` contain `derivedPosts` pointing to HOLD documents (`BLG-012`, `BLG-013`, `BLG-014`, `BLG-015`, `BLG-021`) and are strictly excluded from Batch 2.
  - No document in Batch 2 references or is referenced by any HOLD document.

---

## 5. Dry-Run Schema Validation Result

- Executed `node migration/run-vertical-slice-dryrun.cjs RES-001 RES-010 RES-021 BLG-004 BLG-006 BLG-007`.
- **Result:** 6/6 documents parsed and validated cleanly against Sanity schema with **0 errors**.
- **Outputs generated (dry-run only):**
  - `migration/dry-run/dryrun-documents.json` (727,230 bytes)
  - `migration/dry-run/dryrun-import.ndjson` (454,843 bytes)
  - `migration/dry-run/dryrun-mutations.ndjson` (454,963 bytes)
- **Sanity writes:** 0 (read-only verification). Production and development datasets unchanged.
