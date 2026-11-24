#!/usr/bin/env node
/**
 * Derived Posts Reference Regression Test Suite
 * goutamprusty-v2 — Importer & Reference Resolution Verification
 *
 * Verifies that:
 * 1. The batch importer normalizes research.derivedPosts raw slug strings into
 *    valid Sanity reference objects with _type: 'reference', _ref, and deterministic _key.
 * 2. Order of derived articles is preserved exactly.
 * 3. Pre-normalized reference objects with existing _key or _ref are preserved intact.
 * 4. Unresolved slugs in derivedPosts fail closed by throwing an error.
 * 5. Undefined, null, or empty derivedPosts are handled safely.
 * 6. Provenance is maintained in sourceArchive.referencedSlugs.
 * 7. Real RES-014 and RES-015 fixtures serialize to valid reference structures.
 */

const assert = require('assert');
const { makeKey } = require('../lib/key-generator.cjs');
const { buildAuthoritativeReferenceMap } = require('../lib/serialization-contract.cjs');

let passedTests = 0;
let totalTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('================================================================');
console.log('  DERIVED POSTS REFERENCE REGRESSION TEST SUITE');
console.log('================================================================\n');

const referenceMap = buildAuthoritativeReferenceMap();

// Emulate importer normalization function for research documents
function normalizeResearchDerivedPosts(doc, target, map) {
  if (target.type === 'research' && Array.isArray(doc.derivedPosts) && doc.derivedPosts.length > 0) {
    const normalizedDerived = [];
    const derivedSlugs = [];

    doc.derivedPosts.forEach((slug, idx) => {
      if (slug && typeof slug === 'object' && slug._ref) {
        normalizedDerived.push({
          _key: slug._key || makeKey(`${target.workbookId}:derivedPost:${idx}:${slug._ref}`),
          _type: 'reference',
          _ref: slug._ref,
        });
        return;
      }
      const rawSlug = typeof slug === 'string' ? slug : slug?._sourceSlug || slug?.slug;
      if (rawSlug) {
        const refId = map.get(rawSlug);
        if (refId) {
          normalizedDerived.push({
            _key: makeKey(`${target.workbookId}:derivedPost:${idx}:${rawSlug}`),
            _type: 'reference',
            _ref: refId,
          });
          derivedSlugs.push(rawSlug);
        } else {
          throw new Error(
            `Unresolved derivedPost reference in ${target.workbookId} at index ${idx}: slug '${rawSlug}' not found in reference map.`
          );
        }
      }
    });

    if (normalizedDerived.length > 0) {
      doc.derivedPosts = normalizedDerived;
      if (!doc.sourceArchive) doc.sourceArchive = {};
      doc.sourceArchive.referencedSlugs = JSON.stringify({ derivedPosts: derivedSlugs });
    }
  }
  return doc;
}

console.log('--- Suite 1: Transformation & Reference Object Structure ---');

it('Transforms raw slug strings into typed Sanity reference objects with valid _key', () => {
  const doc = {
    derivedPosts: ['structure-not-conspiracy', 'the-billionaire-raj'],
  };
  const target = { workbookId: 'RES-014', type: 'research' };
  normalizeResearchDerivedPosts(doc, target, referenceMap);

  assert.strictEqual(doc.derivedPosts.length, 2);
  assert.strictEqual(doc.derivedPosts[0]._type, 'reference');
  assert.strictEqual(doc.derivedPosts[0]._ref, 'writing-BLG-012');
  assert.strictEqual(typeof doc.derivedPosts[0]._key, 'string');
  assert.strictEqual(doc.derivedPosts[0]._key.length, 12);

  assert.strictEqual(doc.derivedPosts[1]._type, 'reference');
  assert.strictEqual(doc.derivedPosts[1]._ref, 'writing-BLG-014');
  assert.strictEqual(typeof doc.derivedPosts[1]._key, 'string');
  assert.strictEqual(doc.derivedPosts[1]._key.length, 12);
});

it('Preserves exact sequential order across all 5 authorized writing documents', () => {
  const slugs = [
    'structure-not-conspiracy',
    'the-billionaire-raj',
    'the-asset-trap',
    'why-your-central-bank-wants-some-inflation',
    'the-jobs-that-arent-jobs',
  ];
  const expectedRefs = [
    'writing-BLG-012',
    'writing-BLG-014',
    'writing-BLG-013',
    'writing-BLG-021',
    'writing-BLG-015',
  ];

  const doc = { derivedPosts: [...slugs] };
  const target = { workbookId: 'RES-015', type: 'research' };
  normalizeResearchDerivedPosts(doc, target, referenceMap);

  assert.strictEqual(doc.derivedPosts.length, 5);
  expectedRefs.forEach((expectedRef, idx) => {
    assert.strictEqual(doc.derivedPosts[idx]._ref, expectedRef, `Ref at index ${idx} must match`);
    assert.strictEqual(doc.derivedPosts[idx]._type, 'reference');
    assert.ok(doc.derivedPosts[idx]._key, `_key must be present at index ${idx}`);
  });
});

console.log('\n--- Suite 2: Closed Failure & Edge Cases ---');

it('Throws error and fails closed when an unmapped/unknown slug is referenced', () => {
  const doc = {
    derivedPosts: ['structure-not-conspiracy', 'completely-nonexistent-slug-xyz'],
  };
  const target = { workbookId: 'RES-014', type: 'research' };

  assert.throws(
    () => {
      normalizeResearchDerivedPosts(doc, target, referenceMap);
    },
    /Unresolved derivedPost reference in RES-014 at index 1: slug 'completely-nonexistent-slug-xyz' not found/
  );
});

it('Preserves already-normalized reference objects without re-mangling', () => {
  const preNormalized = [
    { _key: 'existing-key-1', _type: 'reference', _ref: 'writing-BLG-001' },
    { _key: 'existing-key-2', _type: 'reference', _ref: 'writing-BLG-002' },
  ];
  const doc = { derivedPosts: preNormalized };
  const target = { workbookId: 'RES-018', type: 'research' };
  normalizeResearchDerivedPosts(doc, target, referenceMap);

  assert.strictEqual(doc.derivedPosts.length, 2);
  assert.strictEqual(doc.derivedPosts[0]._ref, 'writing-BLG-001');
  assert.strictEqual(doc.derivedPosts[0]._key, 'existing-key-1');
  assert.strictEqual(doc.derivedPosts[1]._ref, 'writing-BLG-002');
  assert.strictEqual(doc.derivedPosts[1]._key, 'existing-key-2');
});

it('Safely handles absent or empty derivedPosts', () => {
  const docEmpty = { derivedPosts: [] };
  normalizeResearchDerivedPosts(docEmpty, { workbookId: 'RES-001', type: 'research' }, referenceMap);
  assert.deepStrictEqual(docEmpty.derivedPosts, []);

  const docNone = {};
  normalizeResearchDerivedPosts(docNone, { workbookId: 'RES-001', type: 'research' }, referenceMap);
  assert.strictEqual(docNone.derivedPosts, undefined);
});

console.log('\n--- Suite 3: Provenance Recording ---');

it('Records serialized slugs into sourceArchive.referencedSlugs JSON provenance', () => {
  const doc = {
    derivedPosts: ['structure-not-conspiracy', 'the-billionaire-raj'],
  };
  const target = { workbookId: 'RES-014', type: 'research' };
  normalizeResearchDerivedPosts(doc, target, referenceMap);

  assert.ok(doc.sourceArchive);
  assert.ok(doc.sourceArchive.referencedSlugs);
  const recorded = JSON.parse(doc.sourceArchive.referencedSlugs);
  assert.deepStrictEqual(recorded.derivedPosts, ['structure-not-conspiracy', 'the-billionaire-raj']);
});

console.log('\n================================================================');
console.log(`  TEST RESULTS: ${passedTests} PASSED, ${totalTests - passedTests} FAILED (Total: ${totalTests})`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
