# Milestone 1A — Formula Asset Extraction and WebP Validation Report

**Date:** 2026-11-21
**Milestone:** 1A — Formula Asset Extraction and WebP Validation
**Status:** Completed & Validated (100% Pass)
**Branch:** `codex/sanity-content-architecture`
**Source Baseline:** V1 Commit `71ef2c7c5c6a8995cc6901d350cc29c35d427423` (Read-Only)

---

## 1. Executive Summary & Verification Matrix

| Verification Requirement | Target Invariant | Measured Result | Status |
|---|---|---|---|
| **Source PNG Definitions Extracted** | Exactly 24 unique images | 24 extracted across 5 documents | **PASS** |
| **WebP Output Files Created** | Exactly 24 files | 24 files written to `public/images/research/` | **PASS** |
| **Placements Inventoried** | Exactly 26 placements | 26 placements recorded across 5 documents | **PASS** |
| **WebP Format Integrity** | Format === 'webp' | 24 of 24 verified as valid WebP | **PASS** |
| **Dimension Parity** | 100% width & height match | 24 of 24 match intrinsic pixel dimensions | **PASS** |
| **Transparency / Alpha Preservation** | 100% RGBA alpha preserved | 24 of 24 retain 4-channel alpha transparency | **PASS** |
| **Encoding Quality** | Lossless WebP | 24 of 24 converted with `lossless: true` | **PASS** |
| **V1 Repository Mutability** | Strictly Read-Only | Clean working tree; 0 files modified | **PASS** |
| **Boundary Discipline** | `research-webp-final/` untouched | Untouched; not inspected, moved, or altered | **PASS** |
| **Source Workbook Discipline** | `Content_Inventory.xlsx` untouched | Untouched | **PASS** |

---

## 2. Source Image to WebP Asset Mapping (All 24 Unique Assets)

| Doc ID | Slug | Formula ID | Source Line | PNG Size (WxH, Bytes) | WebP Size (WxH, Bytes) | PNG SHA-256 (Prefix) | WebP SHA-256 (Prefix) | Output Path |
|---|---|---|---|---|---|---|---|---|
| **RES-001** | `empirical-evaluation-of-...` | `image1` | L557 | 91×25 (1007 B) | 91×25 (616 B) | `bf599eb2ec26...` | `e3e351b88824...` | `public/images/research/empirical-evaluation-of-indias-economic-structure/formula-1.webp` |
| **RES-001** | `empirical-evaluation-of-...` | `image2` | L558 | 95×25 (1008 B) | 95×25 (604 B) | `08c181e3ec3f...` | `05530573e5dc...` | `public/images/research/empirical-evaluation-of-indias-economic-structure/formula-2.webp` |
| **RES-001** | `empirical-evaluation-of-...` | `image3` | L559 | 192×25 (2266 B) | 192×25 (1490 B) | `f5a9402fa65b...` | `56212ec3fcfa...` | `public/images/research/empirical-evaluation-of-indias-economic-structure/formula-3.webp` |
| **RES-004** | `indias-digital-governanc...` | `image1` | L571 | 234×22 (2967 B) | 234×22 (1942 B) | `23d448bc764d...` | `f195795dc7f0...` | `public/images/research/indias-digital-governance-ecosystem-evaluation/formula-1.webp` |
| **RES-018** | `strategic-intelligence-r...` | `image1` | L439 | 620×63 (2967 B) | 620×63 (1592 B) | `f67169031e3b...` | `299e20c89e3f...` | `public/images/research/strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026/formula-1.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image1` | L408 | 80×25 (759 B) | 80×25 (474 B) | `5cdfa8e69d13...` | `8d0bef50084d...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-1.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image2` | L409 | 15×26 (287 B) | 15×26 (178 B) | `3b53429c3675...` | `97b15428121a...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-2.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image3` | L410 | 15×27 (301 B) | 15×27 (190 B) | `25240d0894d6...` | `63f169991e4e...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-3.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image4` | L411 | 14×26 (250 B) | 14×26 (162 B) | `5cc273030609...` | `a752403c0462...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-4.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image5` | L412 | 16×24 (280 B) | 16×24 (174 B) | `cccaa81e5ae6...` | `8310d4846a2d...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-5.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image6` | L413 | 12×24 (239 B) | 12×24 (150 B) | `25c18e5467a4...` | `346f61df2a0d...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-6.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image7` | L414 | 61×25 (716 B) | 61×25 (438 B) | `237b874ea4c0...` | `574f109e8c33...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-7.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image8` | L415 | 49×26 (578 B) | 49×26 (354 B) | `c63c43d6a880...` | `a939204e53d8...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-8.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image9` | L416 | 128×25 (1397 B) | 128×25 (882 B) | `dbcfa0804e25...` | `7128d29d72f9...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-9.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image10` | L417 | 26×25 (464 B) | 26×25 (292 B) | `833d7a6ddd96...` | `7e7ea68cc277...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-10.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image11` | L418 | 29×25 (450 B) | 29×25 (284 B) | `ace29a4fff19...` | `78d728e28f0e...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-11.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image12` | L419 | 46×25 (773 B) | 46×25 (476 B) | `41dc3b86a8d3...` | `8f31cf4151ac...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-12.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image13` | L420 | 150×25 (1608 B) | 150×25 (1012 B) | `b0f10253530f...` | `1cd921a52e99...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-13.webp` |
| **RES-020** | `the-architecture-of-valu...` | `image14` | L421 | 145×25 (1549 B) | 145×25 (974 B) | `3cb527362c40...` | `4c457fe8b6e4...` | `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-14.webp` |
| **RES-022** | `the-macroeconomic-evolut...` | `image1` | L414 | 620×60 (2339 B) | 620×60 (1220 B) | `8f1b71240186...` | `7f47a27861ac...` | `public/images/research/the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset/formula-1.webp` |
| **RES-022** | `the-macroeconomic-evolut...` | `image2` | L415 | 21×25 (387 B) | 21×25 (240 B) | `cd84eb4e9a96...` | `80995c79a501...` | `public/images/research/the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset/formula-2.webp` |
| **RES-022** | `the-macroeconomic-evolut...` | `image3` | L416 | 18×25 (279 B) | 18×25 (186 B) | `7cf335911942...` | `7e1cdb25534c...` | `public/images/research/the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset/formula-3.webp` |
| **RES-022** | `the-macroeconomic-evolut...` | `image4` | L417 | 16×24 (294 B) | 16×24 (186 B) | `114278846248...` | `3ea8ba037a31...` | `public/images/research/the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset/formula-4.webp` |
| **RES-022** | `the-macroeconomic-evolut...` | `image5` | L418 | 13×25 (312 B) | 13×25 (184 B) | `3631796bc5f1...` | `517b51d9eb20...` | `public/images/research/the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset/formula-5.webp` |

**Aggregate Metrics:**
- Total Original PNG Bytes: **23,477 bytes**
- Total Output WebP Bytes: **14,300 bytes**
- Byte Reduction: **9,177 bytes** (Lossless compression ratio: **60.9%** of original)

---

## 3. Placement Inventory (All 26 Placements)

### Context Breakdown
- **Inline Prose:** 19 placements
- **Table Cell:** 1 placement
- **List Item:** 4 placements
- **Standalone Block:** 2 placements
- **Total:** 26 placements

| ID | Doc ID | Formula ID | Source Line | Context | WebP Asset Reference | Markdown Source Snippet |
|---|---|---|---|---|---|---|
| **PL-01** | RES-001 | `image1` | L262 | **inline prose** | `formula-1.webp` | `A central impediment to aggregate productivity growth in India is the systemic misallocation of resources across heterog...` |
| **PL-02** | RES-001 | `image2` | L262 | **inline prose** | `formula-2.webp` | `A central impediment to aggregate productivity growth in India is the systemic misallocation of resources across heterog...` |
| **PL-03** | RES-001 | `image3` | L306 | **inline prose** | `formula-3.webp` | `The empirical impact of the PLI scheme has been substantial. As of August 2024, actual investments totaling ₹1.46 lakh c...` |
| **PL-04** | RES-004 | `image1` | L264 | **table cell** | `formula-1.webp` | `\| **MeitY (2018 Assessment)**           \| Sector-Specific Aggregation (IT-BPM, telecom, e-commerce, electronics) 13     ...` |
| **PL-05** | RES-018 | `image1` | L247 | **standalone block** | `formula-1.webp` | `![][image1]` |
| **PL-06** | RES-020 | `image1` | L218 | **inline prose** | `formula-1.webp` | `The Industrial Revolution represented a massive expansion of functional value. Through the exploitation of fossil fuels,...` |
| **PL-07** | RES-020 | `image2` | L218 | **inline prose** | `formula-2.webp` | `The Industrial Revolution represented a massive expansion of functional value. Through the exploitation of fossil fuels,...` |
| **PL-08** | RES-020 | `image3` | L218 | **inline prose** | `formula-3.webp` | `The Industrial Revolution represented a massive expansion of functional value. Through the exploitation of fossil fuels,...` |
| **PL-09** | RES-020 | `image4` | L218 | **inline prose** | `formula-4.webp` | `The Industrial Revolution represented a massive expansion of functional value. Through the exploitation of fossil fuels,...` |
| **PL-10** | RES-020 | `image5` | L250 | **inline prose** | `formula-5.webp` | `The valuation of digital assets, social media networks, and cryptocurrencies is deeply intertwined with network effects,...` |
| **PL-11** | RES-020 | `image6` | L250 | **inline prose** | `formula-6.webp` | `The valuation of digital assets, social media networks, and cryptocurrencies is deeply intertwined with network effects,...` |
| **PL-12** | RES-020 | `image7` | L250 | **inline prose** | `formula-7.webp` | `The valuation of digital assets, social media networks, and cryptocurrencies is deeply intertwined with network effects,...` |
| **PL-13** | RES-020 | `image8` | L250 | **inline prose** | `formula-8.webp` | `The valuation of digital assets, social media networks, and cryptocurrencies is deeply intertwined with network effects,...` |
| **PL-14** | RES-020 | `image9` | L272 | **inline prose** | `formula-9.webp` | `Viewing human history through the lens of non-equilibrium thermodynamics, the rapid anthropogenic evolution of the past ...` |
| **PL-15** | RES-020 | `image10` | L320 | **inline prose** | `formula-10.webp` | `Let the wage of a worker without a degree be ![][image10] and the wage of a degree holder be ![][image11]. If the cost o...` |
| **PL-16** | RES-020 | `image11` | L320 | **inline prose** | `formula-11.webp` | `Let the wage of a worker without a degree be ![][image10] and the wage of a degree holder be ![][image11]. If the cost o...` |
| **PL-17** | RES-020 | `image12` | L320 | **inline prose** | `formula-12.webp` | `Let the wage of a worker without a degree be ![][image10] and the wage of a degree holder be ![][image11]. If the cost o...` |
| **PL-18** | RES-020 | `image13` | L320 | **inline prose** | `formula-13.webp` | `Let the wage of a worker without a degree be ![][image10] and the wage of a degree holder be ![][image11]. If the cost o...` |
| **PL-19** | RES-020 | `image14` | L320 | **inline prose** | `formula-14.webp` | `Let the wage of a worker without a degree be ![][image10] and the wage of a degree holder be ![][image11]. If the cost o...` |
| **PL-20** | RES-022 | `image1` | L246 | **standalone block** | `formula-1.webp` | `![][image1]` |
| **PL-21** | RES-022 | `image2` | L249 | **list item** | `formula-2.webp` | `- ![][image2] \= Global M2 Money Supply` |
| **PL-22** | RES-022 | `image3` | L250 | **list item** | `formula-3.webp` | `- ![][image3] \= Hard-asset share of money supply (historically 10-40%)` |
| **PL-23** | RES-022 | `image4` | L251 | **list item** | `formula-4.webp` | `- ![][image4] \= Bitcoin’s share of the hard-asset pool` |
| **PL-24** | RES-022 | `image5` | L252 | **list item** | `formula-5.webp` | `- ![][image5] \= Circulating supply of Bitcoin 10` |
| **PL-25** | RES-022 | `image3` | L254 | **inline prose** | `formula-3.webp` | `As of early 2025, the global "hard money" share (![][image3]) stood at an elevated 29% ($30 trillion), reflecting broad ...` |
| **PL-26** | RES-022 | `image4` | L254 | **inline prose** | `formula-4.webp` | `As of early 2025, the global "hard money" share (![][image3]) stood at an elevated 29% ($30 trillion), reflecting broad ...` |

---

## 4. Conversion Methodology & Tooling Verification

### Environment & Tooling
- **Conversion Tool:** `sharp` v0.34.x (pre-existing in `D:\goutamprusty-v2\node_modules\sharp`).
- **Dependencies Installed:** None (zero npm install commands executed).
- **Encoding Mode:** Lossless WebP via `sharp(pngBuffer).webp({ lossless: true }).toBuffer()`.
- **Alpha Channel:** 100% of the 24 formula PNGs possess an alpha channel (`channels: 4, hasAlpha: true`). All 24 output WebP files retain full 4-channel alpha transparency.
- **Dimensions:** Exact pixel width and height were read from the source PNG buffers and verified against the output WebP files on disk.

---

## 5. Boundary & File Modifications Log

### Files Created in `D:\goutamprusty-v2`:
1. **24 WebP Presentation Assets:**
   - `public/images/research/empirical-evaluation-of-indias-economic-structure/formula-1.webp`
   - `public/images/research/empirical-evaluation-of-indias-economic-structure/formula-2.webp`
   - `public/images/research/empirical-evaluation-of-indias-economic-structure/formula-3.webp`
   - `public/images/research/indias-digital-governance-ecosystem-evaluation/formula-1.webp`
   - `public/images/research/strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026/formula-1.webp`
   - `public/images/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity/formula-1.webp` through `formula-14.webp` (14 files)
   - `public/images/research/the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset/formula-1.webp` through `formula-5.webp` (5 files)
2. **Migration Manifests:**
   - `migration/formula-assets-manifest.json` (31,986 bytes)
   - `migration/formula-placement-inventory.json` (22,016 bytes)
   - `migration/formula-asset-validation-report.md` (This document)

### Boundary Confirmations:
- **V1 Repository:** Confirmed 100% read-only. Git working tree clean at `71ef2c7c5c6a8995cc6901d350cc29c35d427423`. Zero files created, edited, staged, or deleted.
- **`research-webp-final/`:** Untouched. Not inspected, copied from, moved, staged, or modified.
- **`Content_Inventory.xlsx`:** Untouched. Not opened for write, modified, or staged.
- **Git State:** Working branch remains `codex/sanity-content-architecture`. Zero commits or staging operations performed.

---

## 6. Independent Verification Commands

To verify all outputs independently, execute these commands in PowerShell from `D:\goutamprusty-v2`:

```powershell
# 1. Verify V1 is clean and untouched
git -C D:\goutamprusty-v1 status

# 2. Verify V2 working branch and untracked files
git -C D:\goutamprusty-v2 status

# 3. Count generated WebP files (must be exactly 24)
(Get-ChildItem -Path "D:\goutamprusty-v2\public\images\research" -Recurse -Filter "*.webp").Count

# 4. Inspect generated migration manifests
Get-ChildItem -Path "D:\goutamprusty-v2\migration"

# 5. Run full programmatic integrity validation using Node and sharp
node -e @"
const fs = require('fs');
const sharp = require('./node_modules/sharp');
const manifest = JSON.parse(fs.readFileSync('migration/formula-assets-manifest.json', 'utf8'));
(async () => {
  let pass = true;
  for (const a of manifest.assets) {
    const meta = await sharp(a.outputWebp.relativePath).metadata();
    if (meta.format !== 'webp' || meta.width !== a.originalPng.width || meta.height !== a.originalPng.height || !meta.hasAlpha) {
      console.error('Mismatch:', a.outputWebp.relativePath);
      pass = false;
    }
  }
  console.log('Independent validation result:', pass ? 'ALL 24 ASSETS VALIDATED SUCCESSFULLY' : 'FAILURES DETECTED');
})();
"@
```
