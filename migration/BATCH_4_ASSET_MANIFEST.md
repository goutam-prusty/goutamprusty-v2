# Batch 4 Asset & Content Manifest

**Generated:** 2026-11-22
**Target Batch:** 6 PASS Documents (`RES-011`, `RES-012`, `RES-013`, `BLG-016`, `BLG-017`, `BLG-020`)
**Status:** Dry-run validated (0 errors); assets verified on disk in V2 `public/` (0 Sanity writes).

---

## 1. Document Inventory & Construct Counts

| ID | Type | Title | Body Blocks | Tables | Image Blocks | Dividers | Formulas (Inline/Block) | Bibliography / Sources | Dependencies / Cross-Refs |
|---|---|---|---|---|---|---|---|---|---|
| **RES-011** | Research | Multidimensional Empirical Evaluation of India's Infrastructure Systems | 45 | 3 | 0 | 0 | 0 inline / 0 block | 96 bib / 96 sources | None |
| **RES-012** | Research | Multidimensional Empirical Evaluation of Inequality and Social Mobility in India | 109 | 3 | 0 | 0 | 0 inline / 0 block | 80 bib / 80 sources | None |
| **RES-013** | Research | Multidimensional Empirical Evaluation of Social Trust, Civic Norms, Cooperative Behavior, and Institutional Confidence in India | 70 | 4 | 0 | 0 | 0 inline / 0 block | 78 bib / 78 sources | None |
| **BLG-016** | Writing | The Question That Explains Everything About Modern Economies | 85 | 0 | 3 | 0 | 0 inline / 0 block | 0 bib / 0 sources | None |
| **BLG-017** | Writing | Trust as Infrastructure: Why India's Low Social Capital Is an Economic Problem | 52 | 0 | 0 | 1 | 0 inline / 0 block | 0 bib / 0 sources | None |
| **BLG-020** | Writing | Why Compute Isn't a Commodity Yet | 56 | 0 | 2 | 0 | 0 inline / 0 block | 0 bib / 0 sources | None |

**Batch Totals:**
- **Documents:** 6 (3 Research, 3 Writing)
- **Body Blocks:** 417
- **Tables:** 10 (`tableBlock`)
- **Image Blocks:** 5 (`imageBlock` across `BLG-016` and `BLG-020`)
- **Dividers:** 1 (`dividerBlock` in `BLG-017`)
- **Formulas:** 0
- **Bibliography Entries:** 254
- **Source Material Entries:** 254
- **Cross-Document References:** 0 (independent standalone documents)

---

## 2. Asset Manifest Table

**Total Unique Assets:** 11 (10 Copied from V1, 1 Pre-existing in V2 from Batch 3)

| Document | Role | Destination Path | Size (Bytes) | SHA-256 Hash | Status |
|---|---|---|---|---|---|
| **RES-011** | cover | `public/images/research/multidimensional-empirical-evaluation-of-indias-infrastructure-systems/cover.webp` | 4,84,882 | `38a485c26e8db3a73a5c3a9ab8fc58869bcf63848b0c086b4ce7f37c5f75016f` | Copied from V1 |
| **RES-012** | cover | `public/images/research/multidimensional-empirical-evaluation-of-inequality-and-social-mobility-in-india/cover.webp` | 5,06,172 | `49e4b9f8d1f43dc7417888af239568065c8128d9e8b82a02d7b3a9a81552ad8a` | Copied from V1 |
| **RES-013** | cover | `public/images/research/multidimensional-empirical-evaluation-of-social-trust-civic-norms-cooperative-behavior-and-institutional-confidence-in-india/cover.webp` | 4,44,376 | `7def54de057483431a3619f35f5b5d1728441aaa9f1bfe9c80483c00fd4f3ca9` | Copied from V1 |
| **BLG-016** | cover | `public/images/blog/the-question-that-explains-everything-about-modern-economies/cover.webp` | 2,46,036 | `9c154bb3e1fdd7dd5daa780b721d1ed641b7ce2cb105aad618e16766d76f54d7` | Copied from V1 |
| **BLG-016** | imageBlock | `public/images/blog/the-question-that-explains-everything-about-modern-economies/image-1.webp` | 83,878 | `1102cbf02a592e7b68c4662b13953239f6fd04e3c299d087fb136a6037fe61cc` | Copied from V1 |
| **BLG-016** | imageBlock | `public/images/blog/the-question-that-explains-everything-about-modern-economies/image-2.webp` | 1,17,420 | `2dd78e7d6c1047aae9378018d102a2a72f86d39227abc82cbdfebaffa60d88c2` | Copied from V1 |
| **BLG-016** | imageBlock | `public/images/blog/the-question-that-explains-everything-about-modern-economies/image-3.webp` | 65,304 | `0ad09d7fc940c75999e31e4daa66364d714b99db91bedea0e01ded283006e96a` | Copied from V1 |
| **BLG-017** | cover | `public/images/blog/trust-as-infrastructure-india-social-capital/cover.webp` | 30,220 | `6e5425995275b01bafbd9783cf58d2f274fa7d0a40295a3957c8d0359abf9be9` | Copied from V1 |
| **BLG-020** | cover | `public/images/blog/why-compute-isnt-a-commodity-yet/cover.webp` | 59,558 | `c66fa970c241736435dff954c91ee30105ceb692c6f6ccd83ed54723599c0c6c` | Copied from V1 |
| **BLG-020** | imageBlock | `public/images/blog/why-compute-isnt-a-commodity-yet/VP-08.webp` | 41,454 | `32c9649d19a30a87fd37d88dc11e245096a77c36e71f450bc35507dd9a918390` | Copied from V1 |
| **BLG-020** | imageBlock | `public/images/blog/machine-native-economy-explained/VP-07.webp` | 28,468 | `2efa0a6c1ad29584042bf5090e0dc56a7ab5936419e10d6d2e8dc07d7f290f1f` | Pre-existing in V2 (Batch 3) |

---

## 3. Verification Invariants

1. **Zero Missing Assets:** All 11 referenced assets exist on disk in V2 `public/`.
2. **Non-Zero File Sizes:** Every file size is strictly positive (ranging from 28.4 KB to 506.1 KB).
3. **Format Integrity:** All 11 images are verified valid WebP binaries (`RIFF` header + `WEBP` form type).
4. **Byte-for-Byte Fidelity:** All 10 assets copied from V1 match their V1 source SHA-256 hashes exactly.
5. **Zero Unreferenced Assets:** V1 directories for all 6 documents were inspected; no unreferenced images or orphaned files exist.
6. **Zero Duplicate Assets:** Every asset is uniquely addressed by its relative path and hash.

---

## 4. Reference & Dependency Isolation

- **Zero Unresolved Cross-Document References:** All 6 documents are independent of external reports or derived posts.
- **HOLD Document Isolation:**
  - Documents `RES-014` and `RES-015` contain `derivedPosts` pointing to HOLD documents (`BLG-012`, `BLG-013`, `BLG-014`, `BLG-015`, `BLG-021`) and remain strictly excluded.
  - Zero HOLD documents or HOLD-dependent documents are included in Batch 4.

---

## 5. Dry-Run Schema Validation Result

- Executed `node migration/run-vertical-slice-dryrun.cjs RES-011 RES-012 RES-013 BLG-016 BLG-017 BLG-020`.
- **Result:** 6/6 documents parsed and validated cleanly against Sanity schema with **0 errors**.
- **Outputs generated (dry-run only):**
  - `migration/dry-run/dryrun-documents.json` (662,884 bytes)
  - `migration/dry-run/dryrun-import.ndjson` (474,660 bytes)
  - `migration/dry-run/dryrun-mutations.ndjson` (474,780 bytes)
- **Sanity writes:** 0 (read-only verification). Production and development datasets unchanged.
