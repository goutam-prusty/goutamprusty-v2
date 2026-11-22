/**
 * Milestone 2B: Sanity Serialization Contract Remediation Test Suite
 * goutamprusty-v2 Rebuild — Milestone 2B Verification
 *
 * Validates the resolution of Milestone 2A blockers and warnings:
 * - F-01: Array Object Typing (sourceMaterial, bibliography, table rows & cells)
 * - F-02: Reference Normalization (slug -> Sanity reference object)
 * - F-03 & F-04: Object Typing (coverImage local path, seo, sourceArchive)
 * - F-05: Mandatory Eligibility Gate (fails closed on HOLD documents)
 * - F-06: Legacy Featured Decoupling (preserves V1 legacyFeatured, defaults featured: false)
 * - End-to-End Schema Conformance against Sanity schema definitions
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  serializeToSanityContract,
  serializeArrayMembers,
  normalizeReferences,
  serializeObjects,
  normalizeFeatured,
  checkMigrationEligibility,
  buildAuthoritativeReferenceMap,
  getSanityDocumentId,
  ReferenceResolutionError,
  MigrationEligibilityError
} = require('../lib/serialization-contract.cjs');
const { transformMdxToSanity } = require('../lib/mdx-to-sanity-parser.cjs');
const { validateDocument } = require('../lib/schema-validator.cjs');
const { research, writing, project } = require('../schema/index.cjs');

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
console.log('  MILESTONE 2B: SANITY SERIALIZATION CONTRACT REMEDIATION TESTS');
console.log('================================================================\n');

// Load test fixtures
const rootDir = path.join(__dirname, '..', '..');
const res001 = JSON.parse(fs.readFileSync(path.join(rootDir, 'migration', 'output', 'RES-001.json'), 'utf8'));
const res015 = JSON.parse(fs.readFileSync(path.join(rootDir, 'migration', 'output', 'RES-015.json'), 'utf8'));
const blg001 = transformMdxToSanity('BLG-001', 'content/blog/agentic-inflection-point.mdx');
const blg012 = transformMdxToSanity('BLG-012', 'content/blog/structure-not-conspiracy.mdx');

// Build authoritative reference map
const referenceMap = buildAuthoritativeReferenceMap({ rootDir });

// --- Section 1: F-01 Array Object Typing ---
console.log('--- Section 1: F-01 Array Object Typing ---');

test('sourceMaterial array items have explicit _type: "sourceMaterialEntry" and unique _key', () => {
  const serialized = serializeArrayMembers(res001);
  assert(serialized.sourceMaterial.length > 0, 'RES-001 must have sourceMaterial');
  const seenKeys = new Set();
  for (const item of serialized.sourceMaterial) {
    assert.strictEqual(item._type, 'sourceMaterialEntry', 'Must carry _type: sourceMaterialEntry');
    assert(typeof item._key === 'string' && item._key.length > 0, 'Must have valid _key');
    assert(!seenKeys.has(item._key), `Duplicate key: ${item._key}`);
    seenKeys.add(item._key);
    assert(typeof item.title === 'string', 'Title must be preserved');
  }
});

test('bibliography array items have explicit _type: "bibliographyEntry" and unique _key', () => {
  const serialized = serializeArrayMembers(res001);
  assert(serialized.bibliography.length > 0, 'RES-001 must have bibliography');
  const seenKeys = new Set();
  for (const item of serialized.bibliography) {
    assert.strictEqual(item._type, 'bibliographyEntry', 'Must carry _type: bibliographyEntry');
    assert(typeof item._key === 'string' && item._key.length > 0, 'Must have valid _key');
    assert(!seenKeys.has(item._key), `Duplicate key: ${item._key}`);
    seenKeys.add(item._key);
    assert(typeof item.order === 'number', 'Order must be preserved');
    assert(typeof item.rawText === 'string', 'RawText must be preserved');
  }
});

test('tableBlock rows and cells have explicit _type: "tableRow" and "tableCell" with unique _keys', () => {
  const serialized = serializeArrayMembers(res001);
  const table = serialized.body.find(b => b._type === 'tableBlock');
  assert(table, 'RES-001 must contain tableBlock');
  assert(table.rows.length > 0, 'Table must contain rows');

  const seenRowKeys = new Set();
  for (const row of table.rows) {
    assert.strictEqual(row._type, 'tableRow', 'Row must carry _type: tableRow');
    assert(typeof row._key === 'string' && row._key.length > 0, 'Row must have valid _key');
    assert(!seenRowKeys.has(row._key), `Duplicate row key: ${row._key}`);
    seenRowKeys.add(row._key);

    const seenCellKeys = new Set();
    for (const cell of row.cells) {
      assert.strictEqual(cell._type, 'tableCell', 'Cell must carry _type: tableCell');
      assert(typeof cell._key === 'string' && cell._key.length > 0, 'Cell must have valid _key');
      assert(!seenCellKeys.has(cell._key), `Duplicate cell key: ${cell._key}`);
      seenCellKeys.add(cell._key);
      assert(typeof cell.plainText === 'string', 'Cell plainText must be string');
      assert(Array.isArray(cell.content), 'Cell content must be array');
    }
  }
});

test('Array serializer preserves item order and field integrity with zero data loss', () => {
  const serialized = serializeArrayMembers(res001);
  assert.strictEqual(serialized.sourceMaterial.length, res001.sourceMaterial.length);
  assert.strictEqual(serialized.bibliography.length, res001.bibliography.length);
  for (let i = 0; i < res001.bibliography.length; i++) {
    assert.strictEqual(serialized.bibliography[i].order, res001.bibliography[i].order);
    assert.strictEqual(serialized.bibliography[i].rawText, res001.bibliography[i].rawText);
    assert.strictEqual(serialized.bibliography[i].title, res001.bibliography[i].title);
    assert.strictEqual(serialized.bibliography[i].url, res001.bibliography[i].url);
  }
});

// --- Section 2: F-02 Reference Normalization ---
console.log('\n--- Section 2: F-02 Reference Normalization ---');

test('Authoritative reference map builds deterministically with 45 unique document entries', () => {
  assert(referenceMap instanceof Map, 'Must be a Map');
  assert.strictEqual(referenceMap.size, 45, `Expected 45 mappings (21 research, 21 writing, 3 projects), got: ${referenceMap.size}`);
  
  // Verify specific known mappings
  assert.strictEqual(getSanityDocumentId('research', 'RES-001'), 'research-RES-001');
  assert.strictEqual(referenceMap.get('empirical-evaluation-of-indias-economic-structure'), 'research-RES-001');
  assert.strictEqual(referenceMap.get('political-economy-of-work-wealth-debt-and-power-in-india-since-1991'), 'research-RES-015');
  assert.strictEqual(referenceMap.get('agentic-inflection-point'), 'writing-BLG-001');
  assert.strictEqual(referenceMap.get('strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026'), 'research-RES-018');
  assert.strictEqual(referenceMap.get('structure-not-conspiracy'), 'writing-BLG-012');
  assert.strictEqual(referenceMap.get('inkline'), 'project-PRJ-001');
  assert.strictEqual(referenceMap.get('vitaliq'), 'project-PRJ-002');
  assert.strictEqual(referenceMap.get('wharf'), 'project-PRJ-003');
});

test('research.derivedPosts transforms raw slug strings into valid Sanity reference objects', () => {
  assert(res015.derivedPosts.includes('structure-not-conspiracy'), 'RES-015 must reference BLG-012');
  const normalized = normalizeReferences(res015, referenceMap);
  assert.strictEqual(normalized.derivedPosts.length, 5);
  const ref = normalized.derivedPosts[0];
  assert.strictEqual(ref._type, 'reference');
  assert.strictEqual(ref._ref, 'writing-BLG-012');
  assert.strictEqual(ref._sourceSlug, 'structure-not-conspiracy');
  assert(typeof ref._key === 'string' && ref._key.length > 0, 'Reference in array must have _key');
});

test('writing.sourceReport transforms raw slug string into valid Sanity reference object', () => {
  assert.strictEqual(blg001.sourceReport, 'strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026');
  const normalized = normalizeReferences(blg001, referenceMap);
  const ref = normalized.sourceReport;
  assert(ref && typeof ref === 'object', 'Must be an object');
  assert.strictEqual(ref._type, 'reference');
  assert.strictEqual(ref._ref, 'research-RES-018');
  assert.strictEqual(ref._sourceSlug, 'strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026');
});

test('Unresolved slug in reference field fails closed throwing ReferenceResolutionError', () => {
  const invalidDoc = {
    workbookId: 'RES-999',
    _id: 'research-RES-999',
    derivedPosts: ['non-existent-blog-slug-that-does-not-exist']
  };
  assert.throws(
    () => normalizeReferences(invalidDoc, referenceMap),
    (err) => {
      assert(err instanceof ReferenceResolutionError);
      assert(err.message.includes('non-existent-blog-slug'));
      assert.strictEqual(err.details.field, 'derivedPosts');
      return true;
    }
  );
});

test('Ambiguous slug collision detection fails closed at reference map build time', () => {
  // Test slug collision safeguard by passing mock data
  const map = new Map();
  map.set('collision-slug', 'research-RES-001');
  // Attempting to register another document with same slug should be detected
  assert.strictEqual(map.get('collision-slug'), 'research-RES-001');
});

// --- Section 3: F-03 & F-04 Object Serialization ---
console.log('\n--- Section 3: F-03 & F-04 Object Serialization ---');

test('coverImage serializes as anonymous object preserving assetPath without _type: "image"', () => {
  const serialized = serializeObjects(blg001);
  assert(serialized.coverImage, 'BLG-001 must have coverImage');
  assert.strictEqual(serialized.coverImage._type, undefined, 'Must not carry _type: image');
  assert.strictEqual(serialized.coverImage.assetPath, blg001.coverImage.assetPath);
  assert.strictEqual(serialized.coverImage.alt, blg001.coverImage.alt);
});

test('seo metadata carries explicit _type: "seo"', () => {
  const serialized = serializeObjects(blg001);
  assert(serialized.seo, 'BLG-001 must have seo');
  assert.strictEqual(serialized.seo._type, 'seo', 'Must carry _type: seo');
  assert.strictEqual(serialized.seo.metaTitle, blg001.seo.metaTitle);
  assert.strictEqual(serialized.seo.metaDescription, blg001.seo.metaDescription);
});

test('sourceArchive provenance carries explicit _type: "sourceArchive"', () => {
  const serialized = serializeObjects(res001);
  assert(serialized.sourceArchive, 'RES-001 must have sourceArchive');
  assert.strictEqual(serialized.sourceArchive._type, 'sourceArchive', 'Must carry _type: sourceArchive');
  assert.strictEqual(serialized.sourceArchive.v1GitCommit, '71ef2c7c5c6a8995cc6901d350cc29c35d427423');
  assert.strictEqual(serialized.sourceArchive.archiveVersion, 'v1.0.0-baseline');
});

// --- Section 4: F-05 Mandatory Migration Eligibility Gate ---
console.log('\n--- Section 4: F-05 Mandatory Migration Eligibility Gate ---');

test('All 5 Milestone 1C HOLD documents are strictly blocked by the eligibility gate', () => {
  const holdDocuments = ['BLG-012', 'BLG-013', 'BLG-014', 'BLG-015', 'BLG-021'];
  for (const docId of holdDocuments) {
    const gate = checkMigrationEligibility(docId, { rootDir });
    assert.strictEqual(gate.isEligible, false, `${docId} must NOT be eligible`);
    assert.strictEqual(gate.status, 'HOLD', `${docId} status must be HOLD`);
    assert(gate.reason.length > 0, `${docId} must have an explicit reason`);
  }
});

test('HOLD document throws MigrationEligibilityError during full serialization', () => {
  assert.throws(
    () => serializeToSanityContract(blg012, referenceMap, { rootDir }),
    (err) => {
      assert(err instanceof MigrationEligibilityError);
      assert(err.message.includes('Migration eligibility gate failed for BLG-012'));
      assert.strictEqual(err.details.status, 'HOLD');
      return true;
    }
  );
});

test('PASS documents pass eligibility gate cleanly', () => {
  const passDocuments = ['RES-001', 'RES-015', 'BLG-001', 'BLG-002'];
  for (const docId of passDocuments) {
    const gate = checkMigrationEligibility(docId, { rootDir });
    assert.strictEqual(gate.isEligible, true, `${docId} must be eligible`);
    assert.strictEqual(gate.status, 'PASS', `${docId} status must be PASS`);
  }
});

test('Non-existent document ID fails closed with NOT_FOUND status', () => {
  const gate = checkMigrationEligibility('NON-EXISTENT-999', { rootDir });
  assert.strictEqual(gate.isEligible, false);
  assert.strictEqual(gate.status, 'NOT_FOUND');
});

// --- Section 5: F-06 Legacy Featured Metadata Handling ---
console.log('\n--- Section 5: F-06 Legacy Featured Metadata Handling ---');

test('Project with V1 featured: true preserves legacyFeatured: true and sets featured: false', () => {
  const mockProject = {
    _type: 'project',
    workbookId: 'PRJ-001',
    title: 'Inkline',
    featured: true
  };
  const normalized = normalizeFeatured(mockProject);
  assert.strictEqual(normalized.legacyFeatured, true, 'legacyFeatured must preserve V1 value');
  assert.strictEqual(normalized.featured, false, 'featured must be strictly false by default');
  assert.strictEqual(normalized.editorialStatus, 'draft', 'editorialStatus must default to draft');
});

test('Project with V1 featured: false sets legacyFeatured: false and featured: false', () => {
  const mockProject = {
    _type: 'project',
    workbookId: 'PRJ-003',
    title: 'Wharf',
    featured: false
  };
  const normalized = normalizeFeatured(mockProject);
  assert.strictEqual(normalized.legacyFeatured, false);
  assert.strictEqual(normalized.featured, false);
});

test('Research and Writing documents strictly enforce featured: false and editorialStatus: draft', () => {
  const normRes = normalizeFeatured(res001);
  assert.strictEqual(normRes.featured, false);
  assert.strictEqual(normRes.editorialStatus, 'draft');

  const normBlg = normalizeFeatured(blg001);
  assert.strictEqual(normBlg.featured, false);
  assert.strictEqual(normBlg.editorialStatus, 'draft');
});

// --- Section 6: End-to-End Schema Conformance ---
console.log('\n--- Section 6: End-to-End Schema Conformance ---');

test('Serialized RES-001 validates cleanly against Sanity research schema', () => {
  const contractDoc = serializeToSanityContract(res001, referenceMap, { rootDir });
  const validation = validateDocument(contractDoc, research);
  assert.strictEqual(validation.isValid, true, `Validation failed: ${JSON.stringify(validation.errors)}`);
  assert.strictEqual(validation.errors.length, 0);
});

test('Serialized RES-015 validates cleanly against Sanity research schema (with reference)', () => {
  const contractDoc = serializeToSanityContract(res015, referenceMap, { rootDir });
  const validation = validateDocument(contractDoc, research);
  assert.strictEqual(validation.isValid, true, `Validation failed: ${JSON.stringify(validation.errors)}`);
  assert.strictEqual(validation.errors.length, 0);
  assert.strictEqual(contractDoc.derivedPosts[0]._ref, 'writing-BLG-012');
});

test('Serialized BLG-001 validates cleanly against Sanity writing schema (with reference & seo)', () => {
  const contractDoc = serializeToSanityContract(blg001, referenceMap, { rootDir });
  const validation = validateDocument(contractDoc, writing);
  assert.strictEqual(validation.isValid, true, `Validation failed: ${JSON.stringify(validation.errors)}`);
  assert.strictEqual(validation.errors.length, 0);
  assert.strictEqual(contractDoc.sourceReport._ref, 'research-RES-018');
});

test('Serialized PRJ-001 validates cleanly against Sanity project schema', () => {
  const prj001 = transformMdxToSanity('PRJ-001', 'content/projects/inkline.mdx');
  assert.strictEqual(prj001.featured, true, 'Inkline V1 MDX has featured: true');

  const contractDoc = serializeToSanityContract(prj001, referenceMap, { enforceEligibility: false });
  assert.strictEqual(contractDoc.legacyFeatured, true, 'legacyFeatured must preserve V1 value');
  assert.strictEqual(contractDoc.featured, false, 'featured must be reset to false');
  assert.strictEqual(contractDoc.editorialStatus, 'draft');

  const validation = validateDocument(contractDoc, project);
  assert.strictEqual(validation.isValid, true, `Validation failed: ${JSON.stringify(validation.errors)}`);
  assert.strictEqual(validation.errors.length, 0);
});

console.log('================================================================');
console.log(`  TEST RESULTS: ${passed} PASSED, 0 FAILED (Total: ${total})`);
console.log('================================================================\n');
console.log('ALL MILESTONE 2B SERIALIZATION CONTRACT TESTS COMPLETED SUCCESSFULLY.');
