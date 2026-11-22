/**
 * Fixture Output Generator
 * goutamprusty.com v2 Rebuild — Milestone 1B
 *
 * Runs the MDX-to-Sanity transformation engine on the five representative
 * fixtures and saves deterministic, formatted JSON outputs.
 */

const fs = require('fs');
const path = require('path');
const { transformMdxToSanity } = require('./lib/mdx-to-sanity-parser.cjs');

const OUTPUT_DIR = path.join(__dirname, 'output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const fixtures = [
  { id: 'RES-001', path: 'content/research/empirical-evaluation-of-indias-economic-structure.mdx' },
  { id: 'RES-004', path: 'content/research/indias-digital-governance-ecosystem-evaluation.mdx' },
  { id: 'RES-015', path: 'content/research/political-economy-of-work-wealth-debt-and-power-in-india-since-1991.mdx' },
  { id: 'RES-019', path: 'content/research/system-architecture-and-reverse-engineering-specification-modern-resume-builder-platform.mdx' },
  { id: 'RES-022', path: 'content/research/the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset.mdx' },
];

console.log('Transforming 5 representative fixtures...\n');

const summary = [];

for (const fix of fixtures) {
  const startTime = Date.now();
  const doc = transformMdxToSanity(fix.id, fix.path);
  const jsonContent = JSON.stringify(doc, null, 2);
  const outPath = path.join(OUTPUT_DIR, `${fix.id}.json`);
  fs.writeFileSync(outPath, jsonContent, 'utf8');
  const elapsed = Date.now() - startTime;

  // Count formulas in document
  let formulaBlockCount = 0;
  let inlineFormulaCount = 0;
  function countFormulas(node) {
    if (!node) return;
    if (node._type === 'formulaBlock') formulaBlockCount++;
    if (node._type === 'inlineFormula') inlineFormulaCount++;
    if (node.children) node.children.forEach(countFormulas);
    if (node.rows) {
      node.rows.forEach(r => r.cells.forEach(c => c.content.forEach(countFormulas)));
    }
  }
  doc.body.forEach(countFormulas);

  const stats = {
    docId: fix.id,
    slug: doc.slug.current,
    bodyBlocks: doc.body.length,
    formulaBlocks: formulaBlockCount,
    inlineFormulas: inlineFormulaCount,
    totalFormulas: formulaBlockCount + inlineFormulaCount,
    bibliographyEntries: doc.bibliography.length,
    sourceMaterialEntries: doc.sourceMaterial.length,
    outputBytes: Buffer.byteLength(jsonContent, 'utf8'),
    durationMs: elapsed
  };
  summary.push(stats);

  console.log(`[${fix.id}] -> ${path.relative(process.cwd(), outPath)} (${stats.outputBytes.toLocaleString()} bytes, ${elapsed}ms)`);
  console.log(`   Blocks: ${stats.bodyBlocks} | Formulas: ${stats.totalFormulas} (${stats.formulaBlocks} block, ${stats.inlineFormulas} inline) | Bibliography: ${stats.bibliographyEntries}`);
}

console.log('\nAll 5 fixtures successfully transformed and written to migration/output/');
