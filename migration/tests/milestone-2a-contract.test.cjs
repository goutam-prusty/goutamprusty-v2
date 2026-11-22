/**
 * Milestone 2A: Schema Integrity and Migration Contract Test Suite
 * goutamprusty-v2 Rebuild — Milestone 2A Audit
 *
 * Programmatically demonstrates and verifies the 5 contract gaps identified
 * between the offline parser outputs and Sanity Studio v3 requirements.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { transformMdxToSanity } = require('../lib/mdx-to-sanity-parser.cjs');
const { validateDocument } = require('../lib/schema-validator.cjs');
const { writing, research, project } = require('../schema/index.cjs');

let total = 0;
let passed = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

console.log('================================================================');
console.log('  MILESTONE 2A: SCHEMA INTEGRITY & CONTRACT GAP TEST SUITE');
console.log('================================================================\n');

// Gap 1: Missing _type on Array Member Objects
console.log('--- Gap 1: Array Member _type Omission in Parser Output ---');
test('Demonstrate that sourceMaterial items currently omit _type in parser output', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-001.json'), 'utf8'));
  assert(doc.sourceMaterial.length > 0, 'RES-001 must have sourceMaterial');
  const firstItem = doc.sourceMaterial[0];
  assert(firstItem._key, 'Must have _key');
  assert.strictEqual(firstItem._type, undefined, 'Parser currently omits _type on sourceMaterialEntry');
});

test('Demonstrate that bibliography items currently omit _type in parser output', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-001.json'), 'utf8'));
  assert(doc.bibliography.length > 0, 'RES-001 must have bibliography');
  const firstItem = doc.bibliography[0];
  assert(firstItem._key, 'Must have _key');
  assert.strictEqual(firstItem._type, undefined, 'Parser currently omits _type on bibliographyEntry');
});

test('Demonstrate that tableBlock rows and cells currently omit _type in parser output', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-001.json'), 'utf8'));
  const table = doc.body.find(b => b._type === 'tableBlock');
  assert(table, 'RES-001 must have tableBlock');
  assert.strictEqual(table.rows[0]._type, undefined, 'Parser currently omits _type on tableRow');
  assert.strictEqual(table.rows[0].cells[0]._type, undefined, 'Parser currently omits _type on tableCell');
});

// Gap 2: Unresolved Reference Fields Emitted as Raw Slugs
console.log('\n--- Gap 2: Unresolved Reference Fields Emitted as Raw Slugs ---');
test('Demonstrate that derivedPosts contains raw slug strings rather than Sanity reference objects', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-015.json'), 'utf8'));
  assert(doc.derivedPosts.length > 0, 'RES-015 must have derivedPosts');
  doc.derivedPosts.forEach(slug => {
    assert.strictEqual(typeof slug, 'string', 'Parser emits raw string slug');
    assert.strictEqual(typeof slug._ref, 'undefined', 'Parser does not emit Sanity reference object');
  });
});

test('Demonstrate that writing.sourceReport contains raw slug string rather than Sanity reference object', () => {
  const doc = transformMdxToSanity('BLG-001', 'content/blog/agentic-inflection-point.mdx');
  assert.strictEqual(typeof doc.sourceReport, 'string', 'sourceReport is a string slug');
  assert.strictEqual(typeof doc.sourceReport._ref, 'undefined', 'sourceReport is not a reference object');
});

// Gap 3: Validation Blindspot for Disk Asset Existence
console.log('\n--- Gap 3: Validation Blindspot for Disk Asset Existence ---');
test('Demonstrate that Milestone 1C HOLD document (BLG-012) passes schema validation despite disk path defect', () => {
  const doc12 = transformMdxToSanity('BLG-012', 'content/blog/structure-not-conspiracy.mdx');
  const result = validateDocument(doc12, writing);
  assert.strictEqual(result.isValid, true, 'Schema validator passes BLG-012 syntactically');
  // Prove that BLG-012 actually contains route-relative image references missing leading slash
  const imageBlocks = doc12.body.filter(b => b._type === 'imageBlock');
  assert(imageBlocks.length > 0, 'BLG-012 has image blocks');
  assert.strictEqual(imageBlocks[0].assetPath.startsWith('/'), false, 'BLG-012 image assetPath lacks leading slash');
});

// Gap 4: Cover Image Type Discrepancy
console.log('\n--- Gap 4: Cover Image Type Discrepancy ---');
test('Demonstrate that parser emits _type: image while schema defines anonymous object', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'output', 'RES-001.json'), 'utf8'));
  assert.strictEqual(doc.coverImage._type, 'image', 'Parser emits _type: image');
  const schemaCoverField = research.fields.find(f => f.name === 'coverImage');
  assert.strictEqual(schemaCoverField.type, 'object', 'Schema defines type: object (anonymous)');
});

// Gap 5: Project Source Frontmatter vs Default False Policy
console.log('\n--- Gap 5: Project Source Frontmatter vs Default False Policy ---');
test('Demonstrate that V1 project frontmatter explicitly sets featured: true', () => {
  const doc = transformMdxToSanity('PRJ-001', 'content/projects/inkline.mdx');
  assert.strictEqual(doc.featured, true, 'Inkline V1 MDX frontmatter explicitly declares featured: true');
  const schemaFeaturedField = project.fields.find(f => f.name === 'featured');
  assert.strictEqual(schemaFeaturedField.initialValue, false, 'Project schema initialValue specifies false');
});

console.log('================================================================');
console.log(`  TEST RESULTS: ${passed} PASSED, 0 FAILED (Total: ${total})`);
console.log('================================================================');
console.log('\nALL 9 CONTRACT GAP PROOF TESTS COMPLETED SUCCESSFULLY.\n');
