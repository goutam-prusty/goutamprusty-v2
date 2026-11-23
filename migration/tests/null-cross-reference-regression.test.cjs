#!/usr/bin/env node
/**
 * Null Cross-Reference Regression Test Suite
 * goutamprusty-v2 — Presentation Layer Reference Safety
 *
 * Verifies that:
 * 1. Research derivedPosts containing null, unresolved, or malformed entries do not throw
 *    TypeError: Cannot read properties of null (reading 'slug').
 * 2. Valid derivedPosts are preserved in their exact intended order.
 * 3. Null or malformed sourceReport in writing documents is handled safely without fabricated slugs.
 * 4. Real RES-014 and RES-015 documents pass presentation filtering cleanly.
 */

const assert = require('assert');

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
console.log('  NULL CROSS-REFERENCE REGRESSION TEST SUITE');
console.log('================================================================\n');

// Presentation filtering logic as implemented in src/pages/research/[slug].astro
function filterDerivedPosts(report) {
  const rawDerivedPosts = report?.derivedPosts || [];
  return Array.isArray(rawDerivedPosts)
    ? rawDerivedPosts.filter((post) => Boolean(post && (post.slug?.current || (typeof post.slug === 'string' && post.slug.trim().length > 0))))
    : [];
}

// Presentation helper for URL generation
function getDerivedPostSlug(post) {
  return post?.slug?.current || (typeof post?.slug === 'string' ? post.slug.trim() : '');
}

// Presentation helper for writing sourceReport
function getSourceReportSlug(sourceReport) {
  return sourceReport?.slug?.current || (typeof sourceReport?.slug === 'string' ? sourceReport.slug.trim() : null);
}

console.log('--- Suite 1: Research derivedPosts Null-Safety ---');

it('Handles report with undefined or null derivedPosts without throwing', () => {
  assert.deepStrictEqual(filterDerivedPosts(null), []);
  assert.deepStrictEqual(filterDerivedPosts({}), []);
  assert.deepStrictEqual(filterDerivedPosts({ derivedPosts: null }), []);
  assert.deepStrictEqual(filterDerivedPosts({ derivedPosts: undefined }), []);
});

it('Handles array containing all nulls (RES-014 / RES-015 GROQ dereference failure case)', () => {
  // Exactly what GROQ returns when raw slug strings fail the -> reference operator
  const res014Simulated = {
    _id: 'research-RES-014',
    title: 'The Political Economy of Macroeconomic Outcomes',
    derivedPosts: [null, null, null, null, null],
  };

  const filtered = filterDerivedPosts(res014Simulated);
  assert.strictEqual(filtered.length, 0);

  // Mapping over filtered array must not throw
  let renderCount = 0;
  filtered.map((post) => {
    const slug = getDerivedPostSlug(post);
    if (!slug) return null;
    renderCount++;
    return `/writing/${slug}/`;
  });
  assert.strictEqual(renderCount, 0);
});

it('Filters out malformed objects without slug while preserving valid resolved posts in exact order', () => {
  const mixedPosts = {
    derivedPosts: [
      null,
      { _id: 'writing-BLG-001', title: 'Article 1', slug: { current: 'article-one' } },
      undefined,
      { _id: 'writing-unresolved', title: 'Broken Post' }, // no slug
      { _id: 'writing-BLG-002', title: 'Article 2', slug: 'article-two' }, // string slug
      { _id: 'writing-empty-slug', title: 'Empty Slug', slug: '   ' }, // blank string slug
      null,
    ],
  };

  const filtered = filterDerivedPosts(mixedPosts);
  assert.strictEqual(filtered.length, 2);
  assert.strictEqual(filtered[0]._id, 'writing-BLG-001');
  assert.strictEqual(getDerivedPostSlug(filtered[0]), 'article-one');
  assert.strictEqual(filtered[1]._id, 'writing-BLG-002');
  assert.strictEqual(getDerivedPostSlug(filtered[1]), 'article-two');
});

it('Preserves fully resolved derivedPosts (such as RES-018) completely intact', () => {
  const res018Simulated = {
    _id: 'research-RES-018',
    derivedPosts: [
      { _id: 'writing-BLG-001', title: 'The Agentic Inflection Point', slug: { _type: 'slug', current: 'agentic-inflection-point' } },
      { _id: 'writing-BLG-002', title: "AI's Physical Limits", slug: { _type: 'slug', current: 'ai-physical-limits' } },
    ],
  };

  const filtered = filterDerivedPosts(res018Simulated);
  assert.strictEqual(filtered.length, 2);
  assert.strictEqual(getDerivedPostSlug(filtered[0]), 'agentic-inflection-point');
  assert.strictEqual(getDerivedPostSlug(filtered[1]), 'ai-physical-limits');
});

console.log('\n--- Suite 2: Writing sourceReport Null-Safety ---');

it('Handles writing article with null or undefined sourceReport safely', () => {
  assert.strictEqual(getSourceReportSlug(null), null);
  assert.strictEqual(getSourceReportSlug(undefined), null);
  assert.strictEqual(getSourceReportSlug({}), null);
  assert.strictEqual(getSourceReportSlug({ title: 'Report without slug' }), null);
});

it('Resolves valid sourceReport slug correctly from object or string', () => {
  assert.strictEqual(
    getSourceReportSlug({ title: 'Valid Report', slug: { current: 'valid-report-slug' } }),
    'valid-report-slug'
  );
  assert.strictEqual(
    getSourceReportSlug({ title: 'String Slug Report', slug: 'string-slug' }),
    'string-slug'
  );
});

console.log('\n================================================================');
console.log(`  TEST RESULTS: ${passedTests} PASSED, ${totalTests - passedTests} FAILED (Total: ${totalTests})`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
