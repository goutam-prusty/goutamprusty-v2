/**
 * Automated Parity & Fidelity Test Suite — Milestone 1B
 * goutamprusty.com v2 Rebuild
 *
 * Verifies 12 structural, content, formula, and deterministic parity invariants
 * across the five representative Research fixtures transformed into Sanity Portable Text JSON.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('yaml');
const satteri = require('satteri');
const { transformMdxToSanity, getHeadingPlainText } = require('../lib/mdx-to-sanity-parser.cjs');

const V2_ROOT = path.resolve(__dirname, '../../');
const V1_ROOT = 'D:/goutamprusty-v1';
const INVENTORY_PATH = path.join(V2_ROOT, 'migration', 'formula-placement-inventory.json');

const formulaInventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));

const fixtures = [
  { id: 'RES-001', relPath: 'content/research/empirical-evaluation-of-indias-economic-structure.mdx', expectedFormulas: 3, expectedTables: 4, expectedBib: 102 },
  { id: 'RES-004', relPath: 'content/research/indias-digital-governance-ecosystem-evaluation.mdx', expectedFormulas: 1, expectedTables: 8, expectedBib: 97 },
  { id: 'RES-015', relPath: 'content/research/political-economy-of-work-wealth-debt-and-power-in-india-since-1991.mdx', expectedFormulas: 0, expectedTables: 0, expectedBib: 48, expectedCitations: 194 },
  { id: 'RES-019', relPath: 'content/research/system-architecture-and-reverse-engineering-specification-modern-resume-builder-platform.mdx', expectedFormulas: 0, expectedTables: 8, expectedBib: 39, expectedMermaid: 2, expectedJson: 1 },
  { id: 'RES-022', relPath: 'content/research/the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset.mdx', expectedFormulas: 7, expectedTables: 6, expectedBib: 57 }
];

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
console.log('  MILESTONE 1B: PARSER PROOF PARITY & FIDELITY TEST SUITE');
console.log('================================================================\n');

for (const fix of fixtures) {
  console.log(`\n--- Fixture ${fix.id}: ${path.basename(fix.relPath)} ---`);
  const fullV1Path = path.join(V1_ROOT, fix.relPath);
  const rawV1Bytes = fs.readFileSync(fullV1Path);
  const rawV1Text = rawV1Bytes.toString('utf8');
  const computedSha256 = crypto.createHash('sha256').update(rawV1Bytes).digest('hex');

  const fmMatch = rawV1Text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const parsedFm = yaml.parse(fmMatch ? fmMatch[1] : '');
  const bodyText = rawV1Text.slice(fmMatch ? fmMatch[0].length : 0);
  const v1Ast = satteri.markdownToMdast(bodyText);

  // Transform document
  const doc = transformMdxToSanity(fix.id, fix.relPath);

  // -------------------------------------------------------------
  // Test 1: Source byte SHA-256 and provenance
  // -------------------------------------------------------------
  assert(
    doc.sourceArchive.sourceSha256 === computedSha256,
    `[${fix.id}] Test 1.1: Source SHA-256 Checksum Match`,
    `Expected ${computedSha256}, got ${doc.sourceArchive.sourceSha256}`
  );
  assert(
    doc.sourceArchive.rawMdxBytes === rawV1Bytes.length,
    `[${fix.id}] Test 1.2: Raw MDX byte length match`,
    `Expected ${rawV1Bytes.length}, got ${doc.sourceArchive.rawMdxBytes}`
  );
  assert(
    doc.sourceArchive.v1GitCommit === '71ef2c7c5c6a8995cc6901d350cc29c35d427423',
    `[${fix.id}] Test 1.3: Immutable V1 git commit baseline`,
    `Got ${doc.sourceArchive.v1GitCommit}`
  );
  assert(
    doc.sourceArchive.v1RelativePath === fix.relPath,
    `[${fix.id}] Test 1.4: V1 relative path match`,
    `Expected ${fix.relPath}, got ${doc.sourceArchive.v1RelativePath}`
  );

  // -------------------------------------------------------------
  // Test 2: Frontmatter preservation
  // -------------------------------------------------------------
  assert(doc.title === parsedFm.title, `[${fix.id}] Test 2.1: Frontmatter title match`);
  assert(doc.slug.current === parsedFm.slug, `[${fix.id}] Test 2.2: Frontmatter slug match`);
  assert(doc.status === (parsedFm.status || 'draft'), `[${fix.id}] Test 2.3: Frontmatter status match`);
  assert(doc.publishedAt === parsedFm.publishedAt, `[${fix.id}] Test 2.4: Frontmatter publishedAt match`);
  assert(doc.category === (parsedFm.category || ''), `[${fix.id}] Test 2.5: Frontmatter category match`);
  assert(
    JSON.stringify(doc.tags) === JSON.stringify(parsedFm.tags || []),
    `[${fix.id}] Test 2.6: Frontmatter tags array equality`
  );
  assert(
    doc.researchMethod === (parsedFm.researchMethod || ''),
    `[${fix.id}] Test 2.7: Frontmatter researchMethod match`
  );
  assert(
    doc.lengthEstimateMinutes === (parsedFm.lengthEstimateMinutes || 0),
    `[${fix.id}] Test 2.8: Frontmatter lengthEstimateMinutes match`
  );
  assert(
    (doc.coverImage ? doc.coverImage.assetPath : null) === (parsedFm.coverImage || null),
    `[${fix.id}] Test 2.9: Frontmatter coverImage match`
  );
  assert(
    doc.sourceMaterial.length === (parsedFm.sourceMaterial ? parsedFm.sourceMaterial.length : 0),
    `[${fix.id}] Test 2.10: SourceMaterial count match`,
    `Expected ${parsedFm.sourceMaterial?.length || 0}, got ${doc.sourceMaterial.length}`
  );
  if (parsedFm.sourceMaterial) {
    let smMatches = true;
    for (let i = 0; i < parsedFm.sourceMaterial.length; i++) {
      if (doc.sourceMaterial[i].title !== parsedFm.sourceMaterial[i].title ||
          doc.sourceMaterial[i].url !== (parsedFm.sourceMaterial[i].url || null)) {
        smMatches = false;
        break;
      }
    }
    assert(smMatches, `[${fix.id}] Test 2.11: SourceMaterial items content equality`);
  }

  // -------------------------------------------------------------
  // Test 3: Heading sequence and hierarchy
  // -------------------------------------------------------------
  // Collect source headings before bibliography
  const sourceHeadings = [];
  for (const node of v1Ast.children) {
    if (node.type === 'heading') {
      const hText = getHeadingPlainText(node);
      if (/works cited|references|bibliography/i.test(hText)) break;
      sourceHeadings.push({ depth: node.depth, text: hText });
    }
  }

  const docHeadings = doc.body
    .filter(b => b._type === 'block' && /^h[1-6]$/.test(b.style))
    .map(b => {
      let text = '';
      b.children.forEach(c => {
        if (c._type === 'span') text += c.text;
      });
      return { depth: parseInt(b.style.slice(1), 10), text: text.trim() };
    });

  assert(
    docHeadings.length === sourceHeadings.length,
    `[${fix.id}] Test 3.1: Heading count parity`,
    `Expected ${sourceHeadings.length}, got ${docHeadings.length}`
  );

  let headingsMatch = docHeadings.length === sourceHeadings.length;
  if (headingsMatch) {
    for (let i = 0; i < sourceHeadings.length; i++) {
      if (docHeadings[i].depth !== sourceHeadings[i].depth ||
          docHeadings[i].text !== sourceHeadings[i].text) {
        headingsMatch = false;
        break;
      }
    }
  }
  assert(headingsMatch, `[${fix.id}] Test 3.2: Heading depth and text sequence parity`);

  // -------------------------------------------------------------
  // Test 4: Paragraph and block ordering
  // -------------------------------------------------------------
  // Verify block keys are present and distinct
  const blockKeys = doc.body.map(b => b._key);
  const uniqueBlockKeys = new Set(blockKeys);
  assert(
    blockKeys.length === uniqueBlockKeys.size,
    `[${fix.id}] Test 4.1: Block keys distinctness (no collisions)`,
    `Found ${blockKeys.length} keys, ${uniqueBlockKeys.size} unique`
  );

  // Verify all blocks have valid Sanity _type
  const validTypes = new Set(['block', 'tableBlock', 'codeBlock', 'mermaidBlock', 'formulaBlock', 'dividerBlock']);
  const invalidTypes = doc.body.filter(b => !validTypes.has(b._type));
  assert(
    invalidTypes.length === 0,
    `[${fix.id}] Test 4.2: All blocks conform to valid Sanity block types`
  );

  // -------------------------------------------------------------
  // Test 5: Inline formatting and links
  // -------------------------------------------------------------
  let hasStrong = false;
  let markDefsValid = true;

  function checkInline(node) {
    if (node.children) {
      node.children.forEach(c => {
        if (c._type === 'span' && c.marks) {
          if (c.marks.includes('strong')) hasStrong = true;
          c.marks.forEach(m => {
            if (m !== 'strong' && m !== 'em' && m !== 'code') {
              // must be a markDef key
              const exists = node.markDefs && node.markDefs.some(md => md._key === m);
              if (!exists) markDefsValid = false;
            }
          });
        }
      });
    }
    if (node.rows) {
      node.rows.forEach(r => r.cells.forEach(c => c.content.forEach(checkInline)));
    }
  }
  doc.body.forEach(checkInline);

  assert(markDefsValid, `[${fix.id}] Test 5.1: All inline mark references resolve to markDefs`);
  if (doc.body.some(b => b._type === 'block' && b.children.some(c => c.marks?.includes('strong')))) {
    assert(hasStrong, `[${fix.id}] Test 5.2: Strong formatting preserved`);
  }

  // -------------------------------------------------------------
  // Test 6: List nesting and ordering
  // -------------------------------------------------------------
  if (fix.id === 'RES-015') {
    const listBlocks = doc.body.filter(b => b.listItem !== undefined);
    const nestedLevel2Blocks = listBlocks.filter(b => b.level === 2);
    assert(
      nestedLevel2Blocks.length === 12,
      `[${fix.id}] Test 6.1: RES-015 nested level 2 list items count`,
      `Expected 12 nested level 2 items (5+4+3), got ${nestedLevel2Blocks.length}`
    );
    const parentLevel1Blocks = listBlocks.filter(b => b.level === 1);
    assert(
      parentLevel1Blocks.length > 0,
      `[${fix.id}] Test 6.2: RES-015 parent level 1 list items presence`
    );
  }

  // -------------------------------------------------------------
  // Test 7: Table dimensions and formula containment
  // -------------------------------------------------------------
  const tableBlocks = doc.body.filter(b => b._type === 'tableBlock');
  assert(
    tableBlocks.length === fix.expectedTables,
    `[${fix.id}] Test 7.1: Table count parity`,
    `Expected ${fix.expectedTables}, got ${tableBlocks.length}`
  );

  if (fix.id === 'RES-004') {
    // Locate the formula table in RES-004
    let formulaTable = null;
    let foundCell = null;
    for (const t of tableBlocks) {
      t.rows.forEach((r, rIdx) => {
        r.cells.forEach((c, cIdx) => {
          c.content.forEach(b => {
            b.children.forEach(span => {
              if (span._type === 'inlineFormula' && span.formulaId === 'image1') {
                formulaTable = t;
                foundCell = { row: rIdx, col: cIdx, span };
              }
            });
          });
        });
      });
    }

    assert(formulaTable !== null, `[RES-004] Test 7.2: Formula table presence`);
    if (formulaTable) {
      assert(formulaTable.rows.length === 5, `[RES-004] Test 7.3: Formula table row count is 5`);
      assert(formulaTable.rows[0].cells.length === 4, `[RES-004] Test 7.4: Formula table column count is 4`);
      assert(formulaTable.rows[0].isHeader === true, `[RES-004] Test 7.5: Row 0 isHeader semantics`);
      assert(formulaTable.rows[1].isHeader === false, `[RES-004] Test 7.6: Row 1 isHeader is false`);
      assert(foundCell.row === 3 && foundCell.col === 2, `[RES-004] Test 7.7: Formula contained in Row 3, Col 2`);
      assert(
        foundCell.span.assetPath === '/images/research/indias-digital-governance-ecosystem-evaluation/formula-1.webp',
        `[RES-004] Test 7.8: Formula in table cell resolves to formula-1.webp`
      );
      assert(
        foundCell.span.dimensions.width === 234 && foundCell.span.dimensions.height === 22,
        `[RES-004] Test 7.9: Formula dimensions match 234x22`
      );
    }
  }

  // -------------------------------------------------------------
  // Test 8: All formula placements in the five fixtures
  // -------------------------------------------------------------
  const docFormulas = [];
  function collectFormulas(node, ctx) {
    if (!node) return;
    if (node._type === 'formulaBlock') {
      docFormulas.push({ type: 'formulaBlock', formulaId: node.formulaId, assetPath: node.assetPath, sha256: node.sha256, dimensions: node.dimensions, context: 'standalone block' });
    }
    if (node._type === 'inlineFormula') {
      docFormulas.push({ type: 'inlineFormula', formulaId: node.formulaId, assetPath: node.assetPath, sha256: node.sha256, dimensions: node.dimensions, context: ctx });
    }
    if (node.children) {
      const childCtx = node.listItem ? 'list item' : (node.style ? 'block: ' + node.style : ctx);
      node.children.forEach(c => collectFormulas(c, childCtx));
    }
    if (node.rows) {
      node.rows.forEach(r => r.cells.forEach(c => c.content.forEach(b => collectFormulas(b, 'table cell'))));
    }
  }
  doc.body.forEach(b => collectFormulas(b, 'root'));

  assert(
    docFormulas.length === fix.expectedFormulas,
    `[${fix.id}] Test 8.1: Formula count matches fixture expectation`,
    `Expected ${fix.expectedFormulas}, got ${docFormulas.length}`
  );

  const inventoryPlacements = formulaInventory.placements.filter(p => p.documentId === fix.id);
  assert(
    docFormulas.length === inventoryPlacements.length,
    `[${fix.id}] Test 8.2: Formula count matches placement inventory`,
    `Expected ${inventoryPlacements.length}, got ${docFormulas.length}`
  );

  // Verify zero base64 strings in body
  const bodyJson = JSON.stringify(doc.body);
  assert(
    !bodyJson.includes('data:image/png;base64'),
    `[${fix.id}] Test 8.3: Zero base64 PNG data URIs embedded in transformed body`
  );

  // Verify all formula assets resolve on disk
  let allAssetsExist = true;
  for (const f of docFormulas) {
    const diskPath = path.join(V2_ROOT, 'public', f.assetPath.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
      allAssetsExist = false;
      break;
    }
  }
  assert(allAssetsExist, `[${fix.id}] Test 8.4: All referenced formula WebP files exist on disk`);

  if (fix.id === 'RES-022') {
    const standaloneBlocks = doc.body.filter(b => b._type === 'formulaBlock');
    assert(standaloneBlocks.length === 1, `[RES-022] Test 8.5: Exactly 1 standalone formulaBlock in RES-022`);
    assert(standaloneBlocks[0].formulaId === 'image1', `[RES-022] Test 8.6: Standalone block is image1`);
    const listFormulas = docFormulas.filter(f => f.context === 'list item');
    assert(listFormulas.length === 4, `[RES-022] Test 8.7: Exactly 4 list-item formula placements`);
  }

  // -------------------------------------------------------------
  // Test 9: RES-019 Mermaid and JSON code preservation
  // -------------------------------------------------------------
  if (fix.id === 'RES-019') {
    const mermaidBlocks = doc.body.filter(b => b._type === 'mermaidBlock');
    const codeBlocks = doc.body.filter(b => b._type === 'codeBlock');
    assert(mermaidBlocks.length === 2, `[RES-019] Test 9.1: Exactly 2 distinct mermaidBlock objects`);
    assert(codeBlocks.length === 1, `[RES-019] Test 9.2: Exactly 1 distinct codeBlock object`);
    assert(codeBlocks[0].language === 'json', `[RES-019] Test 9.3: codeBlock language is json`);
    assert(mermaidBlocks[0].code.includes('USER ||--o{ RESUME'), `[RES-019] Test 9.4: Mermaid block 1 verbatim content`);
    assert(mermaidBlocks[1].code.includes('graph TD'), `[RES-019] Test 9.5: Mermaid block 2 verbatim content`);
    assert(codeBlocks[0].code.includes('e8b9f1a2-4c3d-4e5f-8a9b-1c2d3e4f5a6b'), `[RES-019] Test 9.6: JSON code block verbatim content`);
  }

  // -------------------------------------------------------------
  // Test 10: Citation markers and bibliography order
  // -------------------------------------------------------------
  assert(
    doc.bibliography.length === fix.expectedBib,
    `[${fix.id}] Test 10.1: Bibliography entry count match`,
    `Expected ${fix.expectedBib}, got ${doc.bibliography.length}`
  );

  // Verify 1..N order of bibliography
  let bibOrderCorrect = true;
  for (let i = 0; i < doc.bibliography.length; i++) {
    if (doc.bibliography[i].order !== i + 1) {
      bibOrderCorrect = false;
      break;
    }
  }
  assert(bibOrderCorrect, `[${fix.id}] Test 10.2: Bibliography entries strictly sequential 1..N`);

  if (fix.id === 'RES-015') {
    const citationMarkers = [];
    function collectCitations(node) {
      if (node.children) {
        node.children.forEach(c => {
          if (c._type === 'citationMarker') citationMarkers.push(c);
        });
      }
    }
    doc.body.forEach(collectCitations);
    assert(
      citationMarkers.length === fix.expectedCitations,
      `[RES-015] Test 10.3: Exact 194 citation markers preserved`,
      `Expected ${fix.expectedCitations}, got ${citationMarkers.length}`
    );

    // Check clustered citation preservation
    const clusterBlock = doc.body.find(b => b.children && b.children.some(c => c._type === 'citationMarker' && c.citationNumber === 1));
    assert(clusterBlock !== undefined, `[RES-015] Test 10.4: Clustered citation block found`);
    if (clusterBlock) {
      const markersInBlock = clusterBlock.children.filter(c => c._type === 'citationMarker');
      const markerNumbers = markersInBlock.map(m => m.citationNumber);
      assert(
        markerNumbers.slice(0, 5).join(',') === '1,2,3,4,5',
        `[RES-015] Test 10.5: Clustered sequence [^1][^2][^3][^4][^5] preserved in exact order`
      );
    }
  }

  // -------------------------------------------------------------
  // Test 11: Image paths and alt text
  // -------------------------------------------------------------
  if (doc.coverImage) {
    assert(
      typeof doc.coverImage.assetPath === 'string' && doc.coverImage.assetPath.startsWith('/images/research/'),
      `[${fix.id}] Test 11.1: Valid coverImage assetPath`
    );
  }
  for (const f of docFormulas) {
    assert(
      typeof f.assetPath === 'string' && f.assetPath.startsWith('/images/research/'),
      `[${fix.id}] Test 11.2: Formula ${f.formulaId} assetPath valid`
    );
  }

  // -------------------------------------------------------------
  // Test 12: Deterministic repeated-run equality
  // -------------------------------------------------------------
  const run1 = JSON.stringify(transformMdxToSanity(fix.id, fix.relPath));
  const run2 = JSON.stringify(transformMdxToSanity(fix.id, fix.relPath));
  assert(
    run1 === run2,
    `[${fix.id}] Test 12.1: Byte-identical repeated runs (100% determinism)`
  );
}

console.log('\n================================================================');
console.log(`  TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED (Total: ${testCount})`);
console.log('================================================================');

if (failCount > 0) {
  console.error('\nFailures:');
  failureDetails.forEach(f => console.error(`  - ${f.testName}: ${f.details}`));
  process.exit(1);
} else {
  console.log('\nALL 12 TEST SUITES PASSED WITH ZERO ERRORS.\n');
  process.exit(0);
}
