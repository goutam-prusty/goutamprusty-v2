/**
 * Milestone 2: Sanity Content Schema Implementation and Offline Validation Test Suite
 * goutamprusty.com v2 Rebuild — Milestone 2
 *
 * Verifies that all Sanity schema definitions load correctly, map losslessly
 * to the parser AST outputs, validate the representative fixtures, preserve rich table
 * and formula structures, and maintain strict provenance and editorial invariants.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  schemaTypes,
  documentTypes,
  objectTypes,
  schemasByName,
  research,
  writing,
  project,
  topic,
  author
} = require('../schema/index.cjs');
const { validateDocument } = require('../lib/schema-validator.cjs');
const { transformMdxToSanity } = require('../lib/mdx-to-sanity-parser.cjs');

let totalTests = 0;
let passedTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${description}`);
  } catch (err) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

console.log('================================================================');
console.log('  MILESTONE 2: SANITY CONTENT SCHEMA OFFLINE VALIDATION SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// Suite 1: Schema Definitions Loading and Registry Integrity
// -----------------------------------------------------------------------------
console.log('--- Suite 1: Schema Definitions Loading and Registry Integrity ---');

test('All 5 document schemas load with correct types and names', () => {
  assert.strictEqual(documentTypes.length, 5, 'Must have exactly 5 document schemas');
  const expectedDocNames = ['research', 'writing', 'project', 'topic', 'author'];
  expectedDocNames.forEach(name => {
    assert(schemasByName[name], `Schema for '${name}' must be registered`);
    assert.strictEqual(schemasByName[name].type, 'document', `'${name}' must be type document`);
    assert(schemasByName[name].title, `'${name}' must have a human-readable title`);
    assert(Array.isArray(schemasByName[name].fields), `'${name}' must have fields array`);
  });
});

test('All 16 object and block schemas load with correct types and names', () => {
  assert.strictEqual(objectTypes.length, 16, 'Must have exactly 16 object/block schemas');
  const expectedObjectNames = [
    'citationMarker',
    'inlineFormula',
    'formulaBlock',
    'inlineImage',
    'imageBlock',
    'tableCell',
    'tableRow',
    'tableBlock',
    'mermaidBlock',
    'codeBlock',
    'dividerBlock',
    'bibliographyEntry',
    'sourceMaterialEntry',
    'sourceArchive',
    'seo',
    'portableTextBody'
  ];
  expectedObjectNames.forEach(name => {
    assert(schemasByName[name], `Object schema '${name}' must be registered`);
    assert(schemasByName[name].title, `Object schema '${name}' must have a title`);
  });
});

test('Combined schemaTypes array contains all 21 schemas in standard order', () => {
  assert.strictEqual(schemaTypes.length, 21, 'Must have exactly 21 total registered schemas');
});

// -----------------------------------------------------------------------------
// Suite 2: Schema-to-Parser Compatibility Coverage
// -----------------------------------------------------------------------------
console.log('\n--- Suite 2: Schema-to-Parser Compatibility Coverage ---');

test('Every parser block output type has a corresponding schema definition', () => {
  const parserBlockTypes = [
    'block',
    'formulaBlock',
    'imageBlock',
    'tableBlock',
    'mermaidBlock',
    'codeBlock',
    'dividerBlock'
  ];
  const portableTextOf = schemasByName.portableTextBody.of.map(m => m.type);
  parserBlockTypes.forEach(type => {
    assert(portableTextOf.includes(type), `portableTextBody must allow block type '${type}'`);
  });
});

test('Every parser inline token type has a corresponding schema definition', () => {
  const blockDef = schemasByName.portableTextBody.of.find(m => m.type === 'block');
  assert(blockDef, 'portableTextBody must include standard block');
  const inlineTypes = blockDef.of.map(m => m.type);
  assert(inlineTypes.includes('citationMarker'), 'Block must allow citationMarker inline');
  assert(inlineTypes.includes('inlineFormula'), 'Block must allow inlineFormula inline');
  assert(inlineTypes.includes('inlineImage'), 'Block must allow inlineImage inline');
});

// -----------------------------------------------------------------------------
// Suite 3: Representative Fixture Validation Against Schemas
// -----------------------------------------------------------------------------
console.log('\n--- Suite 3: Representative Fixture Validation Against Schemas ---');

const representativeFixtures = [
  'RES-001',
  'RES-004',
  'RES-015',
  'RES-018',
  'RES-019',
  'RES-020',
  'RES-022'
];

representativeFixtures.forEach(id => {
  test(`Representative fixture ${id} validates 100% against research schema with 0 errors`, () => {
    const fixturePath = path.join(__dirname, '..', 'output', `${id}.json`);
    assert(fs.existsSync(fixturePath), `Fixture file must exist at ${fixturePath}`);
    const doc = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    const result = validateDocument(doc, research);
    if (!result.isValid) {
      console.error(`Validation errors for ${id}:`, result.errors);
    }
    assert.strictEqual(result.isValid, true, `${id} must pass schema validation`);
    assert.strictEqual(result.errors.length, 0, `${id} must have 0 validation errors`);
  });
});

test('Representative Writing document (BLG-001) validates against writing schema', () => {
  const doc = transformMdxToSanity('BLG-001', 'content/blog/agentic-inflection-point.mdx');
  const result = validateDocument(doc, writing);
  assert.strictEqual(result.isValid, true, 'BLG-001 must pass writing schema validation');
  assert.strictEqual(result.errors.length, 0, 'BLG-001 must have 0 errors');
});

test('Representative Writing document with figures (BLG-003) validates against writing schema', () => {
  const doc = transformMdxToSanity('BLG-003', 'content/blog/baliyatra-arithmetic-disappearing-craft.mdx');
  const result = validateDocument(doc, writing);
  assert.strictEqual(result.isValid, true, 'BLG-003 must pass writing schema validation');
  assert.strictEqual(result.errors.length, 0, 'BLG-003 must have 0 errors');
  const imageBlocks = doc.body.filter(b => b._type === 'imageBlock');
  assert.strictEqual(imageBlocks.length, 4, 'BLG-003 must contain 4 imageBlock elements');
});

test('Representative Project document (PRJ-001: Inkline) validates against project schema', () => {
  const doc = transformMdxToSanity('PRJ-001', 'content/projects/inkline.mdx');
  const result = validateDocument(doc, project);
  assert.strictEqual(result.isValid, true, 'Inkline must pass project schema validation');
  assert.strictEqual(result.errors.length, 0, 'Inkline must have 0 errors');
  assert.strictEqual(doc.workbookId, 'PRJ-001');
  assert.strictEqual(doc.slug.current, 'inkline');
  assert(doc.techStack.length > 5, 'Inkline must retain tech stack items');
});

test('Representative Topic document instance validates against topic schema', () => {
  const topicDoc = {
    _id: 'topic-india-political-economy',
    _type: 'topic',
    title: "India's Political Economy & Institutional Architecture",
    slug: { _type: 'slug', current: 'indias-political-economy' },
    domain: 'Economics & Governance',
    description: 'Analysis of Indian economic policy, fiscal federalism, and public administration capacity.',
    featured: false
  };
  const result = validateDocument(topicDoc, topic);
  assert.strictEqual(result.isValid, true, 'Topic document must pass validation');
  assert.strictEqual(result.errors.length, 0, 'Topic must have 0 errors');
});

test('Representative Author document instance validates against author schema', () => {
  const authorDoc = {
    _id: 'author-goutam-prusty',
    _type: 'author',
    authorId: 'goutam-prusty',
    name: 'Goutam Prusty',
    slug: { _type: 'slug', current: 'goutam-prusty' },
    bio: 'Independent researcher and developer working on political economy, institutional architecture, and technology.',
    url: 'https://goutamprusty.com'
  };
  const result = validateDocument(authorDoc, author);
  assert.strictEqual(result.isValid, true, 'Author document must pass validation');
  assert.strictEqual(result.errors.length, 0, 'Author must have 0 errors');
});

// -----------------------------------------------------------------------------
// Suite 4: Rich Table Cells Structure & Preservation
// -----------------------------------------------------------------------------
console.log('\n--- Suite 4: Rich Table Cells Structure & Preservation ---');

test('Tables in RES-001 preserve structured rows and rich cell content blocks', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-001.json'), 'utf8'));
  const tables = doc.body.filter(b => b._type === 'tableBlock');
  assert(tables.length >= 4, 'RES-001 must have at least 4 tables');
  tables.forEach((t, tIdx) => {
    assert(Array.isArray(t.rows), `Table ${tIdx} must have rows array`);
    assert(t.rows.length > 0, `Table ${tIdx} must have at least 1 row`);
    assert.strictEqual(t.rows[0].isHeader, true, `Table ${tIdx} first row must be isHeader=true`);
    t.rows.forEach(r => {
      r.cells.forEach(c => {
        assert(typeof c.plainText === 'string', 'Cell must have plainText');
        assert(Array.isArray(c.content), 'Cell must have content array');
        assert(c.content.length > 0, 'Cell content must not be empty');
        assert.strictEqual(c.content[0]._type, 'block', 'Cell content item must be block');
      });
    });
  });
});

test('RES-004 table preserves rich inline formula inside cell', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-004.json'), 'utf8'));
  const tables = doc.body.filter(b => b._type === 'tableBlock');
  let foundCellFormula = false;
  tables.forEach(t => {
    t.rows.forEach(r => {
      r.cells.forEach(c => {
        c.content.forEach(b => {
          const formulas = b.children.filter(ch => ch._type === 'inlineFormula');
          if (formulas.length > 0) {
            foundCellFormula = true;
            assert.strictEqual(formulas[0].formulaId, 'image1');
            assert.strictEqual(formulas[0].dimensions.width, 234);
            assert.strictEqual(formulas[0].dimensions.height, 22);
            assert.strictEqual(formulas[0].assetPath, '/images/research/indias-digital-governance-ecosystem-evaluation/formula-1.webp');
          }
        });
      });
    });
  });
  assert(foundCellFormula, 'Must locate inlineFormula inside RES-004 table cell');
});

// -----------------------------------------------------------------------------
// Suite 5: Inline Formulas Syntactic Containment
// -----------------------------------------------------------------------------
console.log('\n--- Suite 5: Inline Formulas Syntactic Containment ---');

test('Inline formulas in prose paragraphs retain dimensions and WebP presentation path', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-020.json'), 'utf8'));
  const proseFormulas = [];
  doc.body.forEach(b => {
    if (b._type === 'block' && !b.listItem) {
      b.children.forEach(ch => {
        if (ch._type === 'inlineFormula') proseFormulas.push(ch);
      });
    }
  });
  assert.strictEqual(proseFormulas.length, 14, 'RES-020 must have exactly 14 prose inline formulas');
  proseFormulas.forEach(f => {
    assert(f.dimensions.width > 0, 'Width must be > 0');
    assert(f.dimensions.height > 0, 'Height must be > 0');
    assert(f.assetPath.endsWith('.webp'), 'Must point to WebP asset');
    assert.strictEqual(f.sha256.length, 64, 'Must have 64-character SHA-256');
  });
});

test('Inline formulas in list items are preserved inside block.listItem', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-022.json'), 'utf8'));
  const listFormulas = [];
  doc.body.forEach(b => {
    if (b._type === 'block' && b.listItem) {
      b.children.forEach(ch => {
        if (ch._type === 'inlineFormula') listFormulas.push(ch);
      });
    }
  });
  assert.strictEqual(listFormulas.length, 4, 'RES-022 must have exactly 4 inline formulas inside list items');
});

test('Standalone formula blocks are preserved as formulaBlock at root level', () => {
  const doc18 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-018.json'), 'utf8'));
  const fb18 = doc18.body.filter(b => b._type === 'formulaBlock');
  assert.strictEqual(fb18.length, 1, 'RES-018 must have 1 standalone formulaBlock');
  assert.strictEqual(fb18[0].dimensions.width, 620);
  assert.strictEqual(fb18[0].dimensions.height, 63);

  const doc22 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-022.json'), 'utf8'));
  const fb22 = doc22.body.filter(b => b._type === 'formulaBlock');
  assert.strictEqual(fb22.length, 1, 'RES-022 must have 1 standalone formulaBlock');
  assert.strictEqual(fb22[0].dimensions.width, 620);
  assert.strictEqual(fb22[0].dimensions.height, 60);
});

// -----------------------------------------------------------------------------
// Suite 6: Lossless Citation Markers & Bibliography Data
// -----------------------------------------------------------------------------
console.log('\n--- Suite 6: Lossless Citation Markers & Bibliography Data ---');

test('Citation markers in RES-015 preserve numerical order and raw marker strings', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-015.json'), 'utf8'));
  const markers = [];
  doc.body.forEach(b => {
    if (b.children) {
      b.children.forEach(ch => {
        if (ch._type === 'citationMarker') markers.push(ch);
      });
    }
  });
  assert.strictEqual(markers.length, 194, 'RES-015 must contain exactly 194 inline citation markers');
  markers.forEach(m => {
    assert(m.citationNumber > 0, 'Citation number must be positive');
    assert(m.rawMarker.length > 0, 'Raw marker string must not be empty');
  });
});

test('Bibliography entries in RES-001 retain exact sequential order and titles', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-001.json'), 'utf8'));
  assert.strictEqual(doc.bibliography.length, 102, 'RES-001 must have 102 bibliography entries');
  for (let i = 0; i < doc.bibliography.length; i++) {
    assert.strictEqual(doc.bibliography[i].order, i + 1, `Bibliography order must be sequential (${i + 1})`);
    assert(doc.bibliography[i].rawText.length > 0, 'rawText must not be empty');
    assert(doc.bibliography[i].title.length > 0, 'title must not be empty');
  }
});

// -----------------------------------------------------------------------------
// Suite 7: Verbatim Mermaid & JSON Code Blocks
// -----------------------------------------------------------------------------
console.log('\n--- Suite 7: Verbatim Mermaid & JSON Code Blocks ---');

test('RES-019 retains verbatim multi-line Mermaid diagram syntax', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-019.json'), 'utf8'));
  const mermaidBlocks = doc.body.filter(b => b._type === 'mermaidBlock');
  assert.strictEqual(mermaidBlocks.length, 2, 'RES-019 must contain 2 Mermaid diagram blocks');
  assert(mermaidBlocks[0].code.includes('erDiagram'), 'First diagram must be erDiagram');
  assert(mermaidBlocks[0].code.includes('USER ||--o{ RESUME : owns'), 'Must contain exact relationship line');
});

test('RES-019 retains verbatim JSON code block without corruption', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-019.json'), 'utf8'));
  const jsonBlocks = doc.body.filter(b => b._type === 'codeBlock' && b.language === 'json');
  assert.strictEqual(jsonBlocks.length, 1, 'RES-019 must contain 1 JSON code block');
  assert(jsonBlocks[0].code.includes('"id": "e8b9f1a2-4c3d-4e5f-8a9b-1c2d3e4f5a6b"'), 'Must contain exact resume UUID in JSON');
  assert(jsonBlocks[0].code.includes('"metadata"'), 'Must contain metadata object in JSON');
});

// -----------------------------------------------------------------------------
// Suite 8: Document References & Relationship Typing
// -----------------------------------------------------------------------------
console.log('\n--- Suite 8: Document References & Relationship Typing ---');

test('RES-015 retains derivedPosts relationship references to writing documents', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-015.json'), 'utf8'));
  assert.strictEqual(doc.derivedPosts.length, 5, 'RES-015 must have 5 derivedPosts');
  assert(doc.derivedPosts.includes('structure-not-conspiracy'));
  assert(doc.derivedPosts.includes('the-billionaire-raj'));
});

test('Writing document references its parent research document in sourceReport', () => {
  const doc = transformMdxToSanity('BLG-001', 'content/blog/agentic-inflection-point.mdx');
  assert.strictEqual(
    doc.sourceReport,
    'strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026',
    'BLG-001 sourceReport must retain original V1 research report slug reference'
  );
});

// -----------------------------------------------------------------------------
// Suite 9: Required Fields, Optional Fields & Default Values
// -----------------------------------------------------------------------------
console.log('\n--- Suite 9: Required Fields, Optional Fields & Default Values ---');

test('Validator catches missing required fields and rejects invalid types', () => {
  const invalidDoc = {
    _id: 'research-INVALID',
    _type: 'research',
    // Missing title, slug, summary, status, publishedAt, category, body, sourceArchive
  };
  const result = validateDocument(invalidDoc, research);
  assert.strictEqual(result.isValid, false, 'Invalid document must fail validation');
  const errorCodes = result.errors.map(e => e.code);
  assert(errorCodes.includes('REQUIRED_FIELD_MISSING'), 'Must report REQUIRED_FIELD_MISSING');
});

test('Editorial featured field defaults strictly to false in all schema definitions', () => {
  [research, writing, project, topic].forEach(s => {
    const featuredField = s.fields.find(f => f.name === 'featured');
    assert(featuredField, `${s.name} must have featured field`);
    assert.strictEqual(featuredField.initialValue, false, `${s.name} featured must default to false`);
  });
});

test('Validator rejects document marked approved without authorization', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-001.json'), 'utf8'));
  const approvedDoc = { ...doc, editorialStatus: 'approved' };
  const result = validateDocument(approvedDoc, research);
  assert.strictEqual(result.isValid, false, 'Pre-approved document must fail validation');
  assert(result.errors.some(e => e.code === 'UNAUTHORIZED_APPROVAL'), 'Must report UNAUTHORIZED_APPROVAL');
});

// -----------------------------------------------------------------------------
// Suite 10: Source Archive Provenance Metadata Retention
// -----------------------------------------------------------------------------
console.log('\n--- Suite 10: Source Archive Provenance Metadata Retention ---');

representativeFixtures.forEach(id => {
  test(`Fixture ${id} retains immutable sourceArchive provenance metadata`, () => {
    const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', `${id}.json`), 'utf8'));
    assert(doc.sourceArchive, `${id} must contain sourceArchive`);
    assert.strictEqual(doc.sourceArchive.v1GitCommit, '71ef2c7c5c6a8995cc6901d350cc29c35d427423', 'Commit must match baseline');
    assert.strictEqual(doc.sourceArchive.archiveVersion, 'v1.0.0-baseline', 'Archive version must match');
    assert.strictEqual(doc.sourceArchive.sourceSha256.length, 64, 'SHA-256 must be 64 characters');
    assert(doc.sourceArchive.rawMdxBytes > 0, 'Byte count must be positive');
  });
});

console.log('================================================================');
console.log(`  TEST RESULTS: ${passedTests} PASSED, 0 FAILED (Total: ${totalTests})`);
console.log('================================================================');
console.log('\nALL 10 VALIDATION SUITES PASSED WITH ZERO ERRORS.\n');
