# Batch 5 Asset & Content Manifest

**Generated:** 2026-11-22
**Target Batch:** 8 PASS Documents (`RES-003`, `RES-007`, `RES-008`, `RES-009`, `RES-016`, `BLG-009`, `BLG-018`, `BLG-019`)
**Status:** Dry-run validated (0 errors); assets copied and verified on disk in V2 `public/`.

---

## 1. Document Inventory & Construct Counts

| ID | Type | Title | Body Blocks | Tables | Image Blocks | Dividers | Citation Markers | Bibliography / Sources | Dependencies / Cross-Refs |
|---|---|---|---|---|---|---|---|---|---|
| **RES-003** | Research | Environmental Sustainability and Environmental-Economic Outcomes in India: An Empirical Synthesis | 49 | 0 | 0 | 1 | 192 | 67 bib / 67 sources | None |
| **RES-007** | Research | Institutional Analysis of India’s Information Ecosystem | 145 | 0 | 0 | 1 | 400 | 88 bib / 88 sources | None |
| **RES-008** | Research | Institutional Analysis of India’s Public Administration and State Capacity | 167 | 0 | 0 | 14 | 240 | 89 bib / 89 sources | None |
| **RES-009** | Research | Judicial Effectiveness, Accessibility, and Economic Impact in India: An Institutional Analysis | 130 | 0 | 0 | 1 | 406 | 98 bib / 98 sources | None |
| **RES-016** | Research | Real Utility vs Socially Agreed Value in Modern Economies | 262 | 4 | 0 | 17 | 213 | 40 bib / 40 sources | None |
| **BLG-009** | Writing | Money Is a Story. Here's Why That Matters. | 61 | 0 | 0 | 0 | 0 | 0 bib / 0 sources | None |
| **BLG-018** | Writing | I Wasted Months Before I Figured Out What I Was Actually Building | 42 | 0 | 0 | 0 | 0 | 0 bib / 0 sources | None |
| **BLG-019** | Writing | What I Actually Think About India's Next Decade | 49 | 0 | 0 | 1 | 0 | 0 bib / 0 sources | None |

**Batch Totals:**
- **Documents:** 8 (5 Research, 3 Writing)
- **Body Blocks:** 905
- **Tables:** 4 (`tableBlock` in `RES-016`)
- **Image Blocks:** 0
- **Dividers:** 34 (`dividerBlock` across `RES-003`, `RES-007`, `RES-008`, `RES-009`, `RES-016`, `BLG-019`)
- **Citation Markers:** 1,451
- **Bibliography Entries:** 382
- **Source Material Entries:** 382
- **Cross-Document References:** 0 (independent standalone documents)

---

## 2. Asset Manifest Table

**Total Unique Assets:** 8 (8 Copied from V1)

| Document | Role | Destination Path | Size (Bytes) | SHA-256 Hash | Status |
|---|---|---|---|---|---|
| **RES-003** | cover | `public/images/research/environmental-sustainability-and-environmental-economic-outcomes-in-india-an-empirical-synthesis/cover.webp` | 5,93,202 | `c35e2e5bae8a2f54fc0dca5f12206331871f4e5656497e6279c0fc4687402ef8` | Copied from V1 |
| **RES-007** | cover | `public/images/research/institutional-analysis-of-indias-information-ecosystem/cover.webp` | 2,18,588 | `0b3da87be6716fce0a18fb6b595b975428200d8b15ae9eb1984da46b5846973e` | Copied from V1 |
| **RES-008** | cover | `public/images/research/institutional-analysis-of-indias-public-administration-and-state-capacity/cover.webp` | 1,54,114 | `3fdfb3ce4110bd22bb2a5aa4829cfb65024ce76cfd671229a4adf63978f93691` | Copied from V1 |
| **RES-009** | cover | `public/images/research/judicial-effectiveness-accessibility-and-economic-impact-in-india-an-institutional-analysis/cover.webp` | 1,65,944 | `d725ae663726650a456334e90bda236b72277230fb618d10e60c1fdd486440ba` | Copied from V1 |
| **RES-016** | cover | `public/images/research/real-utility-vs-socially-agreed-value-in-modern-economies/cover.webp` | 79,038 | `43a5f8fb7678f2858e95331d109e5b24f337d6e2782f8d798a2b3a2fe2e93ab6` | Copied from V1 |
| **BLG-009** | cover | `public/images/blog/money-is-a-story/cover.webp` | 1,91,070 | `a1210fe258d1e8913606d1fbab0e3bb0db89c1e4fd0a8ef606b07e47420ff1f8` | Copied from V1 |
| **BLG-018** | cover | `public/images/blog/wasted-months-before-figuring-out-what-i-was-building/cover.webp` | 83,160 | `6fca6ec3547856b969628670f9942157cd5e1885407aed9a0a8c6541fa0ce3fc` | Copied from V1 |
| **BLG-019** | cover | `public/images/blog/what-i-actually-think-about-indias-next-decade/cover.webp` | 44,254 | `fcec8cd7c9f91e44ddd2bfcbafc5361978dfc7a0c84b9791e7af7e52a42dac15` | Copied from V1 |

---

## 3. Verification Invariants

1. **Zero Missing Assets:** All 8 referenced assets exist on disk in V2 `public/`.
2. **Non-Zero File Sizes:** Every file size is strictly positive (ranging from 44.2 KB to 593.2 KB).
3. **Format Integrity:** All 8 images are verified valid WebP binaries (`RIFF` header + `WEBP` form type).
4. **Byte-for-Byte Fidelity:** All 8 assets copied from V1 match their V1 source SHA-256 hashes exactly.
5. **Zero Unreferenced Assets:** V1 directories for all 8 documents were inspected; no unreferenced images exist.
6. **Zero Duplicate Assets:** Every asset is uniquely addressed by its relative path and hash.

---

## 4. Reference & Dependency Isolation

- **Zero Unresolved Cross-Document References:** All 8 documents are independent of external reports or derived posts.
- **HOLD Document Isolation:**
  - Documents `RES-014` and `RES-015` contain `derivedPosts` pointing to HOLD documents (`BLG-012`, `BLG-013`, `BLG-014`, `BLG-015`, `BLG-021`) and remain strictly excluded.
  - Zero HOLD documents or HOLD-dependent documents are included in Batch 5.

---

## 5. Dry-Run Schema Validation Result

- Executed `node migration/run-vertical-slice-dryrun.cjs RES-003 RES-007 RES-008 RES-009 RES-016 BLG-009 BLG-018 BLG-019`.
- **Result:** 8/8 documents parsed and validated cleanly against Sanity schema with **0 errors**.
- **Outputs generated (dry-run only):**
  - `migration/dry-run/dryrun-documents.json` (1,191,453 bytes)
  - `migration/dry-run/dryrun-import.ndjson` (818,769 bytes)
  - `migration/dry-run/dryrun-mutations.ndjson` (818,929 bytes)
- **Sanity writes:** 0 (read-only verification). Production and development datasets unchanged.
