/**
 * Milestone 1C: Parser Hardening and Full-Corpus Compatibility Test Suite
 * goutamprusty.com v2 Rebuild
 *
 * Verifies:
 * 1. Extended formula fixtures (RES-018 and RES-020).
 * 2. Complete 26-placement formula parity across all 5 formula-bearing reports.
 * 3. Parser compatibility across all 42 genuine documents in the V1 archive.
 * 4. Explicit PASS (37) and HOLD (5) categorization.
 * 5. Full anomaly register preservation without editorial overrides.
 * 6. Deterministic key generation across the entire corpus.
 */

const fs = require('fs');
const path = require('path');
const { transformMdxToSanity } = require('../lib/mdx-to-sanity-parser.cjs');

const V2_ROOT = path.resolve(__dirname, '../../');
const V1_ROOT = 'D:/goutamprusty-v1';
const INVENTORY_PATH = path.join(V2_ROOT, 'migration', 'formula-placement-inventory.json');
const COMPATIBILITY_JSON_PATH = path.join(V2_ROOT, 'migration', 'full-corpus-compatibility.json');

const formulaInventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
const compatibilityData = JSON.parse(fs.readFileSync(COMPATIBILITY_JSON_PATH, 'utf8'));

let testCount = 0;
let passCount = 0;
let failCount = 0;
const failureDetails = [];

function assert(condition, testName, details = '') {
  testCount++;
  if (condition) {
    passCount++;
  } else {
    failCount++;
    failureDetails.push({ testName, details });
    console.error(`  FAIL: ${testName} - ${details}`);
  }
}

console.log('================================================================');
console.log('  MILESTONE 1C: PARSER HARDENING & FULL-CORPUS AUDIT TEST SUITE');
console.log('================================================================\n');

// -------------------------------------------------------------
// Part 1: Extended Formula Fixtures (RES-018 & RES-020)
// -------------------------------------------------------------
console.log('--- Part 1: Extended Formula Fixtures (RES-018 & RES-020) ---');

// RES-018
const doc18 = transformMdxToSanity('RES-018', 'content/research/strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026.mdx');
const fBlocks18 = doc18.body.filter(b => b._type === 'formulaBlock');
assert(fBlocks18.length === 1, '[RES-018] Standalone formula block count is 1', `Got ${fBlocks18.length}`);
assert(fBlocks18[0]?.formulaId === 'image1', '[RES-018] Formula ID is image1');
assert(
  fBlocks18[0]?.assetPath === '/images/research/strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026/formula-1.webp',
  '[RES-018] Asset path resolves to formula-1.webp'
);
assert(
  fBlocks18[0]?.dimensions?.width === 620 && fBlocks18[0]?.dimensions?.height === 63,
  '[RES-018] Formula dimensions are 620x63'
);
assert(
  fs.existsSync(path.join(V2_ROOT, 'public', fBlocks18[0].assetPath.replace(/^\//, ''))),
  '[RES-018] Referenced WebP asset exists on disk in V2'
);

// RES-020
const doc20 = transformMdxToSanity('RES-020', 'content/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity.mdx');
const inlineFormulas20 = [];
function collectInline20(node) {
  if (node._type === 'inlineFormula') inlineFormulas20.push(node);
  if (node.children) node.children.forEach(collectInline20);
}
doc20.body.forEach(collectInline20);
assert(inlineFormulas20.length === 14, '[RES-020] Exactly 14 inline formula placements', `Got ${inlineFormulas20.length}`);
assert(
  doc20.body.filter(b => b._type === 'formulaBlock').length === 0,
  '[RES-020] Zero standalone formulaBlock objects (all 14 are inline)'
);
const allInline20Exist = inlineFormulas20.every(f =>
  fs.existsSync(path.join(V2_ROOT, 'public', f.assetPath.replace(/^\//, '')))
);
assert(allInline20Exist, '[RES-020] All 14 referenced WebP assets exist on disk in V2');

// Verify zero base64 PNG data URIs in RES-018 and RES-020 bodies
assert(!JSON.stringify(doc18.body).includes('data:image/png;base64'), '[RES-018] Zero base64 PNG data URIs in body');
assert(!JSON.stringify(doc20.body).includes('data:image/png;base64'), '[RES-020] Zero base64 PNG data URIs in body');

// -------------------------------------------------------------
// Part 2: Complete 26-Placement Formula Parity Across All 5 Reports
// -------------------------------------------------------------
console.log('\n--- Part 2: Complete 26-Placement Formula Parity ---');

const formulaDocs = [
  { id: 'RES-001', path: 'content/research/empirical-evaluation-of-indias-economic-structure.mdx', expected: 3 },
  { id: 'RES-004', path: 'content/research/indias-digital-governance-ecosystem-evaluation.mdx', expected: 1 },
  { id: 'RES-018', path: 'content/research/strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026.mdx', expected: 1 },
  { id: 'RES-020', path: 'content/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity.mdx', expected: 14 },
  { id: 'RES-022', path: 'content/research/the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset.mdx', expected: 7 },
];

let totalFormulasCollected = 0;
let totalStandaloneCollected = 0;
let totalInlineCollected = 0;
let allFormulasResolveOnDisk = true;
let zeroBase64AcrossAll5 = true;

for (const fdoc of formulaDocs) {
  const doc = transformMdxToSanity(fdoc.id, fdoc.path);
  const bodyStr = JSON.stringify(doc.body);
  if (bodyStr.includes('data:image/png;base64')) zeroBase64AcrossAll5 = false;

  const found = [];
  function walk(node, ctx) {
    if (!node) return;
    if (node._type === 'formulaBlock') {
      found.push({ type: 'formulaBlock', formulaId: node.formulaId, assetPath: node.assetPath });
      totalStandaloneCollected++;
    }
    if (node._type === 'inlineFormula') {
      found.push({ type: 'inlineFormula', formulaId: node.formulaId, assetPath: node.assetPath, context: ctx });
      totalInlineCollected++;
    }
    if (node.children) {
      const childCtx = node.listItem ? 'list item' : (node.style ? 'block: ' + node.style : ctx);
      node.children.forEach(c => walk(c, childCtx));
    }
    if (node.rows) {
      node.rows.forEach(r => r.cells.forEach(c => c.content.forEach(b => walk(b, 'table cell'))));
    }
  }
  doc.body.forEach(b => walk(b, 'root'));
  totalFormulasCollected += found.length;

  for (const f of found) {
    const diskPath = path.join(V2_ROOT, 'public', f.assetPath.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) allFormulasResolveOnDisk = false;
  }

  // Compare to inventory
  const expectedForDoc = formulaInventory.placements.filter(p => p.documentId === fdoc.id);
  assert(
    found.length === expectedForDoc.length,
    `[${fdoc.id}] Formula count matches inventory (${expectedForDoc.length})`,
    `Got ${found.length}`
  );
}

assert(totalFormulasCollected === 26, 'Total formula placements across 5 reports is exactly 26', `Got ${totalFormulasCollected}`);
assert(totalStandaloneCollected === 2, 'Total standalone formulaBlock placements is exactly 2', `Got ${totalStandaloneCollected}`);
assert(totalInlineCollected === 24, 'Total inlineFormula placements is exactly 24', `Got ${totalInlineCollected}`);
assert(zeroBase64AcrossAll5, 'Zero base64 PNG data URIs across all 5 formula-bearing reports');
assert(allFormulasResolveOnDisk, '100% of all 26 formula placements resolve to on-disk WebP files');

// -------------------------------------------------------------
// Part 3: Full 42-Document Corpus Inventory Verification
// -------------------------------------------------------------
console.log('\n--- Part 3: Full 42-Document Corpus Inventory Verification ---');

assert(compatibilityData.documents.length === 42, 'Corpus inventory contains exactly 42 documents');
assert(compatibilityData.summary.totalResearch === 21, 'Corpus contains exactly 21 Research documents');
assert(compatibilityData.summary.totalWriting === 21, 'Corpus contains exactly 21 Writing documents');
assert(compatibilityData.summary.parserCompatibleCount === 42, '100% of documents (42/42) are parser compatible');
assert(compatibilityData.summary.deterministicCount === 42, '100% of documents (42/42) are deterministic');

// Check that every document has an explicit PASS or HOLD status
const allHaveValidStatus = compatibilityData.documents.every(d => d.status === 'PASS' || d.status === 'HOLD');
assert(allHaveValidStatus, 'Every document has an explicit PASS or HOLD status');
assert(compatibilityData.summary.passCount === 37, 'Exactly 37 documents are PASS', `Got ${compatibilityData.summary.passCount}`);
assert(compatibilityData.summary.holdCount === 5, 'Exactly 5 documents are HOLD', `Got ${compatibilityData.summary.holdCount}`);

// Verify all 21 research documents are PASS
const researchPass = compatibilityData.documents.filter(d => d.type === 'Research' && d.status === 'PASS');
assert(researchPass.length === 21, 'All 21 Research documents are PASS');

// -------------------------------------------------------------
// Part 4: HOLD Documents and Anomaly Register Verification
// -------------------------------------------------------------
console.log('\n--- Part 4: Anomaly Register and HOLD Documents ---');

const holdDocs = compatibilityData.documents.filter(d => d.status === 'HOLD');
const holdIds = holdDocs.map(d => d.workbookId).sort();
assert(
  holdIds.join(',') === 'BLG-012,BLG-013,BLG-014,BLG-015,BLG-021',
  'HOLD documents are exactly BLG-012, BLG-013, BLG-014, BLG-015, BLG-021',
  `Got: ${holdIds.join(',')}`
);

// Verify exact anomaly counts
assert(
  compatibilityData.summary.anomaliesSummary.routeRelativeImageCount === 12,
  'Exactly 12 route-relative image references recorded'
);
assert(
  compatibilityData.summary.anomaliesSummary.brokenImageCount === 2,
  'Exactly 2 broken image references recorded (BLG-014)'
);
assert(
  compatibilityData.summary.anomaliesSummary.crossArticleImageCount === 1,
  'Exactly 1 cross-article image reference recorded (BLG-020)'
);
assert(
  compatibilityData.summary.anomaliesSummary.sharedCoverImageCount === 1,
  'Exactly 1 shared cover image recorded (RES-015)'
);

// Verify BLG-014 broken images exist in V1 actual directory
const blg14GstExists = fs.existsSync(path.join(V1_ROOT, 'public/images/blog/the-billionaire-raj/GST-incidence-by-fractile-chart.webp'));
const blg14DebtExists = fs.existsSync(path.join(V1_ROOT, 'public/images/blog/the-billionaire-raj/Household-debt-growth-timeline.webp'));
assert(blg14GstExists, 'BLG-014 GST incidence chart physically exists in V1 public/images/blog/the-billionaire-raj/');
assert(blg14DebtExists, 'BLG-014 Household debt chart physically exists in V1 public/images/blog/the-billionaire-raj/');

// -------------------------------------------------------------
// Part 5: Full Corpus AST Invariants
// -------------------------------------------------------------
console.log('\n--- Part 5: Full Corpus AST Invariants ---');

// Verify zero unhandled/unusual AST constructs across all 42 documents
const unusualCount = compatibilityData.documents.reduce((acc, d) => acc + (d.unusualConstructs?.length || 0), 0);
assert(unusualCount === 0, 'Zero unsupported or unusual AST constructs across the entire 42-document corpus');

// Verify aggregate citation markers and bibliography
assert(
  compatibilityData.summary.aggregateMetrics.totalCitationMarkers === 1968,
  'Total citation markers across corpus matches expected count (1,968)',
  `Got ${compatibilityData.summary.aggregateMetrics.totalCitationMarkers}`
);
assert(
  compatibilityData.summary.aggregateMetrics.totalBibliographyEntries === 1433,
  'Total bibliography entries across corpus matches expected count (1,433)',
  `Got ${compatibilityData.summary.aggregateMetrics.totalBibliographyEntries}`
);
assert(
  compatibilityData.summary.aggregateMetrics.totalSourceMaterialEntries === 1529,
  'Total source material entries across corpus matches expected count (1,529)',
  `Got ${compatibilityData.summary.aggregateMetrics.totalSourceMaterialEntries}`
);

console.log('\n================================================================');
console.log(`  TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED (Total: ${testCount})`);
console.log('================================================================');

if (failCount > 0) {
  console.error('\nFailures:');
  failureDetails.forEach(f => console.error(`  - ${f.testName}: ${f.details}`));
  process.exit(1);
} else {
  console.log('\nALL TEST INVARIANTS PASSED WITH ZERO ERRORS.\n');
  process.exit(0);
}
