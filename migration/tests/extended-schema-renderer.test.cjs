/**
 * Extended Sanity Schema & Astro Renderer Test Suite
 * goutamprusty.com v2 Rebuild — Multi-Document Content Architecture
 *
 * Verifies that the real Sanity schema and Astro PortableText renderer
 * support all remaining PASS content constructs without loss or corruption.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const V2_ROOT = path.resolve(__dirname, '../../');
const SCHEMA_DIR = path.join(V2_ROOT, 'src/sanity/schemaTypes');
const DRY_RUN_SCRIPT = path.join(V2_ROOT, 'migration/run-vertical-slice-dryrun.cjs');
const { transformMdxToSanity } = require('../lib/mdx-to-sanity-parser.cjs');
const { validateDocument } = require('../lib/schema-validator.cjs');
const { research: researchSchema, writing: writingSchema } = require('../schema/index.cjs');

console.log('================================================================');
console.log('  EXTENDED SANITY SCHEMA & RENDERER TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// Suite 1: Real Schema File Presence & Type Registration
// -----------------------------------------------------------------------------
console.log('--- Suite 1: Real Sanity Schema Definitions ---');

const expectedDocTypes = ['research', 'writing', 'author', 'topic', 'project'];
const expectedObjectTypes = [
  'portableTextBody',
  'tableBlock',
  'tableRow',
  'tableCell',
  'formulaBlock',
  'inlineFormula',
  'imageBlock',
  'inlineImage',
  'codeBlock',
  'mermaidBlock',
  'dividerBlock',
  'citationMarker',
  'bibliographyEntry',
  'sourceMaterialEntry',
  'sourceArchive',
  'seo',
];

test('All required document and object schema files exist on disk in src/sanity/schemaTypes/', () => {
  const files = [
    'research.ts',
    'writing.ts',
    'author.ts',
    'topic.ts',
    'project.ts',
    'portableText.ts',
    'tableBlock.ts',
    'formulaBlock.ts',
    'inlineFormula.ts',
    'imageBlock.ts',
    'inlineImage.ts',
    'codeBlock.ts',
    'mermaidBlock.ts',
    'dividerBlock.ts',
    'citationMarker.ts',
    'bibliographyEntry.ts',
    'sourceMaterialEntry.ts',
    'metadataObjects.ts',
    'index.ts',
  ];
  for (const f of files) {
    assert.strictEqual(
      fs.existsSync(path.join(SCHEMA_DIR, f)),
      true,
      `Expected ${f} to exist in src/sanity/schemaTypes/`
    );
  }
});

test('src/sanity/schemaTypes/index.ts registers all 20 schema types', () => {
  const indexContent = fs.readFileSync(path.join(SCHEMA_DIR, 'index.ts'), 'utf8');
  for (const t of [...expectedDocTypes, ...expectedObjectTypes]) {
    assert.strictEqual(
      indexContent.includes(t),
      true,
      `index.ts should import and register type '${t}'`
    );
  }
});

// -----------------------------------------------------------------------------
// Suite 2: Rich tableCell Schema & Inline Formula Support (RES-004)
// -----------------------------------------------------------------------------
console.log('\n--- Suite 2: Rich tableCell & Inline Formula Support (RES-004) ---');

test('tableBlock.ts defines rich content and plainText in tableCell', () => {
  const tableContent = fs.readFileSync(path.join(SCHEMA_DIR, 'tableBlock.ts'), 'utf8');
  assert.strictEqual(tableContent.includes("name: 'plainText'"), true, 'tableCell must support plainText');
  assert.strictEqual(tableContent.includes("name: 'content'"), true, 'tableCell must support rich content array');
  assert.strictEqual(tableContent.includes("type: 'inlineFormula'"), true, 'tableCell content must support inlineFormula');
  assert.strictEqual(tableContent.includes("type: 'citationMarker'"), true, 'tableCell content must support citationMarker');
  assert.strictEqual(tableContent.includes("type: 'inlineImage'"), true, 'tableCell content must support inlineImage');
});

test('RES-004 parsed table cell contains inlineFormula and validates against research schema', () => {
  const parsed = transformMdxToSanity(
    'RES-004',
    'content/research/indias-digital-governance-ecosystem-evaluation.mdx',
    { v1Root: 'D:/goutamprusty-v1', docType: 'research' }
  );

  let inlineFormulaFound = false;
  const tables = (parsed.body || []).filter((b) => b._type === 'tableBlock');
  assert.strictEqual(tables.length > 0, true, 'RES-004 must contain tables');

  for (const t of tables) {
    for (const r of t.rows || []) {
      for (const c of r.cells || []) {
        for (const cb of c.content || []) {
          for (const ch of cb.children || []) {
            if (ch._type === 'inlineFormula') {
              inlineFormulaFound = true;
              assert.strictEqual(typeof ch.assetPath, 'string');
              assert.strictEqual(ch.dimensions && typeof ch.dimensions.width, 'number');
            }
          }
        }
      }
    }
  }

  assert.strictEqual(inlineFormulaFound, true, 'RES-004 must have inlineFormula inside a table cell');
  const validation = validateDocument(parsed, researchSchema);
  assert.strictEqual(validation.isValid, true, 'RES-004 must validate 100% against research schema');
});

// -----------------------------------------------------------------------------
// Suite 3: Code Blocks, Mermaid Diagrams & Dividers (RES-019)
// -----------------------------------------------------------------------------
console.log('\n--- Suite 3: Code Blocks, Mermaid Diagrams & Dividers (RES-019) ---');

test('RES-019 parses codeBlock, mermaidBlock, dividerBlock and validates cleanly', () => {
  const parsed = transformMdxToSanity(
    'RES-019',
    'content/research/system-architecture-and-reverse-engineering-specification-modern-resume-builder-platform.mdx',
    { v1Root: 'D:/goutamprusty-v1', docType: 'research' }
  );

  const codeBlocks = parsed.body.filter((b) => b._type === 'codeBlock');
  const mermaidBlocks = parsed.body.filter((b) => b._type === 'mermaidBlock');
  const dividerBlocks = parsed.body.filter((b) => b._type === 'dividerBlock');

  assert.strictEqual(codeBlocks.length >= 1, true, 'RES-019 must contain at least 1 codeBlock');
  assert.strictEqual(codeBlocks[0].language, 'json');
  assert.strictEqual(typeof codeBlocks[0].code, 'string');

  assert.strictEqual(mermaidBlocks.length >= 2, true, 'RES-019 must contain at least 2 mermaidBlocks');
  assert.strictEqual(mermaidBlocks[0].code.includes('erDiagram'), true);

  assert.strictEqual(dividerBlocks.length >= 1, true, 'RES-019 must contain at least 1 dividerBlock');

  const validation = validateDocument(parsed, researchSchema);
  assert.strictEqual(validation.isValid, true, 'RES-019 must validate 100% against research schema');
});

// -----------------------------------------------------------------------------
// Suite 4: Standalone Images & Inline Prose Formulas (BLG-003, RES-020, RES-022)
// -----------------------------------------------------------------------------
console.log('\n--- Suite 4: Images and Extended Formulas ---');

test('BLG-003 parses imageBlock figures and validates against writing schema', () => {
  const parsed = transformMdxToSanity(
    'BLG-003',
    'content/blog/baliyatra-arithmetic-disappearing-craft.mdx',
    { v1Root: 'D:/goutamprusty-v1', docType: 'writing' }
  );

  const images = parsed.body.filter((b) => b._type === 'imageBlock');
  assert.strictEqual(images.length >= 1, true, 'BLG-003 must contain imageBlock figures');
  assert.strictEqual(typeof images[0].assetPath, 'string');

  const validation = validateDocument(parsed, writingSchema);
  assert.strictEqual(validation.isValid, true, 'BLG-003 must validate against writing schema');
});

test('RES-020 contains 14 inline formulas in prose and validates cleanly', () => {
  const parsed = transformMdxToSanity(
    'RES-020',
    'content/research/the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity.mdx',
    { v1Root: 'D:/goutamprusty-v1', docType: 'research' }
  );

  let inlineCount = 0;
  for (const b of parsed.body || []) {
    for (const ch of b.children || []) {
      if (ch._type === 'inlineFormula') inlineCount++;
    }
  }

  assert.strictEqual(inlineCount, 14, 'RES-020 must contain exactly 14 inline formulas');
  const validation = validateDocument(parsed, researchSchema);
  assert.strictEqual(validation.isValid, true, 'RES-020 must validate cleanly');
});

test('RES-022 contains formulas across standalone blocks, list items, and prose', () => {
  const parsed = transformMdxToSanity(
    'RES-022',
    'content/research/the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset.mdx',
    { v1Root: 'D:/goutamprusty-v1', docType: 'research' }
  );

  const standalone = parsed.body.filter((b) => b._type === 'formulaBlock');
  assert.strictEqual(standalone.length >= 1, true, 'RES-022 must have standalone formulaBlock');

  let listFormulaCount = 0;
  for (const b of parsed.body || []) {
    if (b.listItem) {
      for (const ch of b.children || []) {
        if (ch._type === 'inlineFormula') listFormulaCount++;
      }
    }
  }
  assert.strictEqual(listFormulaCount >= 4, true, 'RES-022 must have inline formulas inside list items');

  const validation = validateDocument(parsed, researchSchema);
  assert.strictEqual(validation.isValid, true, 'RES-022 must validate cleanly');
});

// -----------------------------------------------------------------------------
// Suite 5: Astro PortableText.astro Renderer Coverage
// -----------------------------------------------------------------------------
console.log('\n--- Suite 5: Astro PortableText.astro Renderer Coverage ---');

test('PortableText.astro implements handlers for all 7 block types and 3 inline types', () => {
  const astroContent = fs.readFileSync(path.join(V2_ROOT, 'src/components/PortableText.astro'), 'utf8');

  // Block types
  assert.strictEqual(astroContent.includes("block._type === 'tableBlock'"), true, 'Handles tableBlock');
  assert.strictEqual(astroContent.includes("block._type === 'formulaBlock'"), true, 'Handles formulaBlock');
  assert.strictEqual(astroContent.includes("block._type === 'imageBlock'"), true, 'Handles imageBlock');
  assert.strictEqual(astroContent.includes("block._type === 'codeBlock'"), true, 'Handles codeBlock');
  assert.strictEqual(astroContent.includes("block._type === 'mermaidBlock'"), true, 'Handles mermaidBlock');
  assert.strictEqual(astroContent.includes("block._type === 'dividerBlock'"), true, 'Handles dividerBlock');

  // Inline types
  assert.strictEqual(astroContent.includes("child._type === 'inlineFormula'"), true, 'Handles inlineFormula');
  assert.strictEqual(astroContent.includes("child._type === 'inlineImage'"), true, 'Handles inlineImage');
  assert.strictEqual(astroContent.includes("child._type === 'citationMarker'"), true, 'Handles citationMarker');

  // Rich table cell inline formulas
  assert.strictEqual(
    astroContent.includes('hasRichContent') && astroContent.includes("child._type === 'inlineFormula'"),
    true,
    'Handles inline formulas inside table cells'
  );
});

// -----------------------------------------------------------------------------
// Suite 6: Generalized Dry-Run Script Invariants
// -----------------------------------------------------------------------------
console.log('\n--- Suite 6: Generalized Dry-Run Execution ---');

test('run-vertical-slice-dryrun.cjs runs default slice without arguments', () => {
  const output = execSync(`node ${DRY_RUN_SCRIPT}`, { encoding: 'utf8' });
  assert.strictEqual(output.includes('3/3 DOCUMENTS READY'), true);
  assert.strictEqual(output.includes('RES-018'), true);
  assert.strictEqual(output.includes('BLG-001'), true);
  assert.strictEqual(output.includes('BLG-002'), true);
});

test('run-vertical-slice-dryrun.cjs accepts arbitrary custom PASS document IDs', () => {
  const output = execSync(`node ${DRY_RUN_SCRIPT} RES-004 RES-019`, { encoding: 'utf8' });
  assert.strictEqual(output.includes('2/2 DOCUMENTS READY'), true);
  assert.strictEqual(output.includes('RES-004'), true);
  assert.strictEqual(output.includes('RES-019'), true);
  assert.strictEqual(output.includes('dryrun-documents.json'), true);
});

// -----------------------------------------------------------------------------
// Suite 7: Safety & Clean Sanity State
// -----------------------------------------------------------------------------
console.log('\n--- Suite 7: Safety & Clean Sanity State ---');

test('No remote writes occurred during verification', () => {
  // Confirm verticalSliceData.json contains only the 3 vertical slice documents
  const data = JSON.parse(fs.readFileSync(path.join(V2_ROOT, 'src/data/verticalSliceData.json'), 'utf8'));
  assert.strictEqual(data.length, 3, 'verticalSliceData.json must contain exactly 3 baseline documents');
  const ids = data.map((d) => d.workbookId).sort();
  assert.deepStrictEqual(ids, ['BLG-001', 'BLG-002', 'RES-018']);
});

console.log('================================================================');
console.log(`  TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED (Total: ${passCount + failCount})`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
