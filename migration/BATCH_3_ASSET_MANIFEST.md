# Batch 3 Asset & Content Manifest

**Generated:** 2026-11-22  
**Target Batch:** 6 PASS Documents (`RES-002`, `RES-005`, `RES-006`, `BLG-008`, `BLG-011`, `BLG-022`)  
**Status:** Dry-run validated (0 errors); assets verified on disk in V2 `public/` (0 Sanity writes).

---

## 1. Document Inventory & Construct Counts

| ID | Type | Title | Body Blocks | Tables | Image Blocks | Dividers | Formulas (Inline/Block) | Bibliography / Sources | Dependencies / Cross-Refs |
|---|---|---|---|---|---|---|---|---|---|
| **RES-002** | Research | Empirical Evaluation of India's Healthcare System | 94 | 3 | 0 | 0 | 0 inline / 0 block | 94 bib / 94 sources | None |
| **RES-005** | Research | India's Education System: An Empirical Evaluation | 80 | 2 | 0 | 0 | 0 inline / 0 block | 82 bib / 82 sources | None |
| **RES-006** | Research | Institutional Analysis of India's Governance Architecture: Political Incentives, Accountability, and Long-Term Welfare | 81 | 3 | 0 | 0 | 0 inline / 0 block | 83 bib / 83 sources | None |
| **BLG-008** | Writing | The Machine-Native Economy, Separated From the Forecast | 53 | 0 | 3 | 0 | 0 inline / 0 block | 0 bib / 0 sources | None |
| **BLG-011** | Writing | Six Months, Twelve Domains, One Uncomfortable Conclusion | 55 | 0 | 1 | 1 | 0 inline / 0 block | 0 bib / 0 sources | None |
| **BLG-022** | Writing | I Built My WordPress Theme to Be Read by Machines | 45 | 3 | 0 | 5 | 0 inline / 0 block | 0 bib / 0 sources | None |

**Batch Totals:**
- **Documents:** 6 (3 Research, 3 Writing)
- **Body Blocks:** 408
- **Tables:** 11 (`tableBlock`)
- **Image Blocks:** 4 (`imageBlock` across `BLG-008` and `BLG-011`)
- **Dividers:** 6 (`dividerBlock` across `BLG-011` and `BLG-022`)
- **Formulas:** 0 (all formula-bearing research reports were migrated in prior batches)
- **Bibliography Entries:** 259
- **Source Material Entries:** 259
- **Cross-Document References:** 0 (independent standalone documents)

---

## 2. Asset Manifest Table

**Total Assets:** 10 (10 Copied from V1, 0 Formulas needed)

| Document | Role | Destination Path | Size (Bytes) | SHA-256 Hash | Status |
|---|---|---|---|---|---|
| **RES-002** | cover | `public/images/research/empirical-evaluation-of-indias-healthcare-system/cover.webp` | 2,79,738 | `c6dfc79c90142a9422b258968563e7080a7812343fe79a56aaecb5424caa61dd` | Copied from V1 |
| **RES-005** | cover | `public/images/research/indias-education-system-an-empirical-evaluation/cover.webp` | 1,06,716 | `1e600e867e9eb3b7c9a501e2f6550238e407d74a19faaa6c6d360b7d2c01acd5` | Copied from V1 |
| **RES-006** | cover | `public/images/research/institutional-analysis-of-indias-governance-architecture/cover.webp` | 2,02,362 | `e6491f2ad54e9c2d6eabe031ea165f6bd43f473515ceb2fad0a92a764c7a57cd` | Copied from V1 |
| **BLG-008** | cover | `public/images/blog/machine-native-economy-explained/cover.webp` | 15,480 | `37724451381f5bad42549ed417f18e227f5c2a60beb96bfcad836d92d0fccd3c` | Copied from V1 |
| **BLG-008** | imageBlock | `public/images/blog/machine-native-economy-explained/VP-01.webp` | 23,284 | `caa0b7142d11bf5088e06b1faefbc2e1f39061d9339e69df5fef44d8c6c157ec` | Copied from V1 |
| **BLG-008** | imageBlock | `public/images/blog/machine-native-economy-explained/VP-02.webp` | 16,890 | `07f90f40c644726f723fc3cce24972bedb1dbd11aa10ae9cea84e2957f30d58b` | Copied from V1 |
| **BLG-008** | imageBlock | `public/images/blog/machine-native-economy-explained/VP-07.webp` | 28,468 | `2efa0a6c1ad29584042bf5090e0dc56a7ab5936419e10d6d2e8dc07d7f290f1f` | Copied from V1 |
| **BLG-011** | cover | `public/images/blog/six-months-twelve-domains-one-uncomfortable-conclusion/cover.webp` | 3,37,336 | `ddd62d105356f70a5ee0c158b396e361eb4a2d307e6e3584286b5d5dc5c9aff5` | Copied from V1 |
| **BLG-011** | imageBlock | `public/images/blog/six-months-twelve-domains-one-uncomfortable-conclusion/image-1.webp` | 29,588 | `350089d40188365ac89e83733fda6ff2c20aba45cbb4a645cb533c7cb0dfe16f` | Copied from V1 |
| **BLG-022** | cover | `public/images/blog/wordpress-theme-read-by-machines/cover.webp` | 15,926 | `31db5e7629da18a248bf483c09dadcbfb38039d0661e46d884c23706692305fe` | Copied from V1 |

---

## 3. Verification Invariants

1. **Zero Missing Assets:** All 10 assets exist on disk in V2 `public/`.
2. **Non-Zero File Sizes:** Every file size is strictly positive (ranging from 15.4 KB to 337.3 KB).
3. **Format Integrity:** All 10 images are verified valid WebP binaries (`RIFF` header + `WEBP` form type).
4. **Byte-for-Byte Fidelity:** All 10 assets copied from V1 match their V1 source SHA-256 hashes exactly.
5. **Zero Unreferenced Assets:** V1 directories for all 6 documents were inspected; no unreferenced images or orphaned files exist.
6. **Zero Duplicate Assets:** Every asset is uniquely addressed by its relative path and hash.

---

## 4. Reference & Dependency Isolation

- **Zero Unresolved Cross-Document References:** All 6 documents are independent of external reports or derived posts.
- **HOLD Document Isolation:**
  - Documents `RES-014` and `RES-015` contain `derivedPosts` pointing to HOLD documents (`BLG-012`, `BLG-013`, `BLG-014`, `BLG-015`, `BLG-021`) and remain strictly excluded.
  - Zero HOLD documents or HOLD-dependent documents are included in Batch 3.

---

## 5. Dry-Run Schema Validation Result

- Executed `node migration/run-vertical-slice-dryrun.cjs RES-002 RES-005 RES-006 BLG-008 BLG-011 BLG-022`.
- **Result:** 6/6 documents parsed and validated cleanly against Sanity schema with **0 errors**.
- **Outputs generated (dry-run only):**
  - `migration/dry-run/dryrun-documents.json` (673,796 bytes)
  - `migration/dry-run/dryrun-import.ndjson` (488,855 bytes)
  - `migration/dry-run/dryrun-mutations.ndjson` (488,975 bytes)
- **Sanity writes:** 0 (read-only verification). Production and development datasets unchanged.
