/**
 * HOLD Batch Presentation & Import Layer Path Normalization Test Suite
 * goutamprusty-v2 — Safe, Deterministic Asset Path Normalization Tests
 *
 * Verifies:
 * 1. normalizeAssetPath unit mappings and leading slash prepending.
 * 2. Deterministic normalization of BLG-014 broken image references.
 * 3. End-to-end normalization of all 7 HOLD / dependent documents during serialization.
 * 4. Physical existence of all normalized assets in V1 repository.
 * 5. Preservation of the mandatory HOLD eligibility gate.
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

const {
  EXPLICIT_IMAGE_PATH_MAP,
  normalizeAssetPath,
  normalizeDocumentAssetPaths,
} = require('../lib/path-normalizer.cjs');
const {
  serializeToSanityContract,
  checkMigrationEligibility,
  buildAuthoritativeReferenceMap,
  MigrationEligibilityError,
} = require('../lib/serialization-contract.cjs');
const { transformMdxToSanity } = require('../lib/mdx-to-sanity-parser.cjs');

const V1_ROOT = 'D:/goutamprusty-v1';
const ROOT_DIR = path.resolve(__dirname, '../..');

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
console.log('  HOLD BATCH PATH NORMALIZATION TEST SUITE');
console.log('================================================================\n');

// Group 1: Unit Normalization Rules
console.log('--- 1. normalizeAssetPath Unit Rules ---');

test('EXPLICIT_IMAGE_PATH_MAP exports immutable frozen mappings', () => {
  assert(Object.isFrozen(EXPLICIT_IMAGE_PATH_MAP));
  assert.strictEqual(
    EXPLICIT_IMAGE_PATH_MAP['images/blog/GST-incidence-by-fractile-chart.webp'],
    '/images/blog/the-billionaire-raj/GST-incidence-by-fractile-chart.webp'
  );
});

test('normalizeDocumentAssetPaths normalizes all image paths in a document', () => {
  const dummyDoc = {
    coverImage: { assetPath: 'images/blog/the-asset-trap/cover.webp' },
    body: [
      { _type: 'imageBlock', assetPath: 'images/blog/the-asset-trap/Household-wealth-composition-chart.webp' },
      { _type: 'block', children: [{ _type: 'inlineImage', assetPath: 'images/blog/the-asset-trap/Real-return-by-asset-class-chart.webp' }] },
    ],
  };
  const normalized = normalizeDocumentAssetPaths(dummyDoc);
  assert.strictEqual(normalized.coverImage.assetPath, '/images/blog/the-asset-trap/cover.webp');
  assert.strictEqual(normalized.body[0].assetPath, '/images/blog/the-asset-trap/Household-wealth-composition-chart.webp');
  assert.strictEqual(normalized.body[1].children[0].assetPath, '/images/blog/the-asset-trap/Real-return-by-asset-class-chart.webp');
});

test('Maps BLG-014 GST incidence chart from route-relative path to verified subfolder', () => {
  const result = normalizeAssetPath('images/blog/GST-incidence-by-fractile-chart.webp');
  assert.strictEqual(result, '/images/blog/the-billionaire-raj/GST-incidence-by-fractile-chart.webp');
});

test('Maps BLG-014 Household debt chart from route-relative path to verified subfolder', () => {
  const result = normalizeAssetPath('images/blog/Household-debt-growth-timeline.webp');
  assert.strictEqual(result, '/images/blog/the-billionaire-raj/Household-debt-growth-timeline.webp');
});

test('Maps BLG-014 GST incidence chart from root-relative path to verified subfolder', () => {
  const result = normalizeAssetPath('/images/blog/GST-incidence-by-fractile-chart.webp');
  assert.strictEqual(result, '/images/blog/the-billionaire-raj/GST-incidence-by-fractile-chart.webp');
});

test('Maps BLG-014 Household debt chart from root-relative path to verified subfolder', () => {
  const result = normalizeAssetPath('/images/blog/Household-debt-growth-timeline.webp');
  assert.strictEqual(result, '/images/blog/the-billionaire-raj/Household-debt-growth-timeline.webp');
});

test('Prepends leading slash to route-relative images/ paths', () => {
  assert.strictEqual(
    normalizeAssetPath('images/blog/structure-not-conspiracy/cover.webp'),
    '/images/blog/structure-not-conspiracy/cover.webp'
  );
  assert.strictEqual(
    normalizeAssetPath('images/blog/the-asset-trap/Household-wealth-composition-chart.webp'),
    '/images/blog/the-asset-trap/Household-wealth-composition-chart.webp'
  );
  assert.strictEqual(
    normalizeAssetPath('images/blog/the-jobs-that-arent-jobs/The_Wrong_Direction.webp'),
    '/images/blog/the-jobs-that-arent-jobs/The_Wrong_Direction.webp'
  );
  assert.strictEqual(
    normalizeAssetPath('images/blog/why-your-central-bank-wants-some-inflation/Inflation-target-rationale-diagram.webp'),
    '/images/blog/why-your-central-bank-wants-some-inflation/Inflation-target-rationale-diagram.webp'
  );
});

test('Preserves already root-relative paths without modification', () => {
  const path1 = '/images/research/political-economy-macroeconomic-outcomes-india-global-markets/cover.webp';
  assert.strictEqual(normalizeAssetPath(path1), path1);
  const path2 = '/images/blog/structure-not-conspiracy/cover.webp';
  assert.strictEqual(normalizeAssetPath(path2), path2);
});

test('Preserves external URLs and empty/null values', () => {
  assert.strictEqual(normalizeAssetPath('https://example.com/image.png'), 'https://example.com/image.png');
  assert.strictEqual(normalizeAssetPath(''), '');
  assert.strictEqual(normalizeAssetPath(null), null);
});

// Group 2: Document Serialization Normalization for 7 Held Documents
console.log('\n--- 2. Document Serialization Normalization (7 Held Docs) ---');

const referenceMap = buildAuthoritativeReferenceMap();

const heldDocs = [
  { id: 'BLG-012', path: 'content/blog/structure-not-conspiracy.mdx', type: 'writing' },
  { id: 'BLG-013', path: 'content/blog/the-asset-trap.mdx', type: 'writing' },
  { id: 'BLG-014', path: 'content/blog/the-billionaire-raj.mdx', type: 'writing' },
  { id: 'BLG-015', path: 'content/blog/the-jobs-that-arent-jobs.mdx', type: 'writing' },
  { id: 'BLG-021', path: 'content/blog/why-your-central-bank-wants-some-inflation.mdx', type: 'writing' },
  { id: 'RES-014', path: 'content/research/political-economy-macroeconomic-outcomes-india-global-markets.mdx', type: 'research' },
  { id: 'RES-015', path: 'content/research/political-economy-of-work-wealth-debt-and-power-in-india-since-1991.mdx', type: 'research' },
];

for (const d of heldDocs) {
  test(`Serializes ${d.id} with 100% root-relative and verified asset paths`, () => {
    const rawDoc = transformMdxToSanity(d.id, d.path, { v1Root: V1_ROOT, docType: d.type });
    // Serialize with enforceEligibility: false to verify normalization without clearing gate
    const serialized = serializeToSanityContract(rawDoc, referenceMap, {
      rootDir: ROOT_DIR,
      enforceEligibility: false,
    });

    // Check coverImage
    if (serialized.coverImage && serialized.coverImage.assetPath) {
      assert(
        serialized.coverImage.assetPath.startsWith('/'),
        `${d.id} coverImage must be root-relative: ${serialized.coverImage.assetPath}`
      );
    }

    // Check all body image blocks and inline images
    if (Array.isArray(serialized.body)) {
      for (const block of serialized.body) {
        if (block._type === 'imageBlock' && block.assetPath) {
          assert(
            block.assetPath.startsWith('/'),
            `${d.id} imageBlock must be root-relative: ${block.assetPath}`
          );
          assert(
            !block.assetPath.startsWith('images/'),
            `${d.id} imageBlock must not be route-relative: ${block.assetPath}`
          );
        }
        if (Array.isArray(block.children)) {
          for (const child of block.children) {
            if ((child._type === 'inlineImage' || child._type === 'imageBlock') && child.assetPath) {
              assert(
                child.assetPath.startsWith('/'),
                `${d.id} inlineImage must be root-relative: ${child.assetPath}`
              );
            }
          }
        }
      }
    }
  });
}

test('BLG-014 specifically resolves the two broken paths to verified subfolder in serialized output', () => {
  const rawDoc = transformMdxToSanity('BLG-014', 'content/blog/the-billionaire-raj.mdx', { v1Root: V1_ROOT, docType: 'writing' });
  const serialized = serializeToSanityContract(rawDoc, referenceMap, {
    rootDir: ROOT_DIR,
    enforceEligibility: false,
  });

  const imagePaths = serialized.body.filter(b => b._type === 'imageBlock').map(b => b.assetPath);
  assert(
    imagePaths.includes('/images/blog/the-billionaire-raj/GST-incidence-by-fractile-chart.webp'),
    'Serialized BLG-014 must contain mapped GST chart'
  );
  assert(
    imagePaths.includes('/images/blog/the-billionaire-raj/Household-debt-growth-timeline.webp'),
    'Serialized BLG-014 must contain mapped Household debt chart'
  );
  assert(
    imagePaths.includes('/images/blog/the-billionaire-raj/Wealth-pyramid-infographic.webp'),
    'Serialized BLG-014 must contain root-relative Wealth pyramid infographic'
  );
});

// Group 3: Physical Existence of All Normalized Assets in V1 Repository
console.log('\n--- 3. Physical Asset Verification in V1 Repository ---');

for (const d of heldDocs) {
  test(`All normalized assets in ${d.id} physically exist in V1 public/`, () => {
    const rawDoc = transformMdxToSanity(d.id, d.path, { v1Root: V1_ROOT, docType: d.type });
    const serialized = serializeToSanityContract(rawDoc, referenceMap, {
      rootDir: ROOT_DIR,
      enforceEligibility: false,
    });

    const referencedPaths = [];
    if (serialized.coverImage?.assetPath) {
      referencedPaths.push(serialized.coverImage.assetPath);
    }
    if (Array.isArray(serialized.body)) {
      for (const block of serialized.body) {
        if (block._type === 'imageBlock' && block.assetPath) {
          referencedPaths.push(block.assetPath);
        }
      }
    }

    for (const relPath of referencedPaths) {
      const cleanRel = relPath.replace(/^\//, '');
      const diskPath = path.join(V1_ROOT, 'public', cleanRel);
      assert(
        fs.existsSync(diskPath),
        `Asset file must exist at ${diskPath} for ${d.id}`
      );
      const stat = fs.statSync(diskPath);
      assert(stat.size > 0, `Asset file at ${diskPath} must be non-zero in size`);
    }
  });
}

// Group 4: HOLD Gate Preservation Invariants
console.log('\n--- 4. HOLD Gate Preservation Invariants ---');

test('HOLD gate remains strictly active for all 5 held writing documents', () => {
  const holdDocuments = ['BLG-012', 'BLG-013', 'BLG-014', 'BLG-015', 'BLG-021'];
  for (const docId of holdDocuments) {
    const gate = checkMigrationEligibility(docId, { rootDir: ROOT_DIR });
    assert.strictEqual(gate.isEligible, false, `${docId} must NOT be eligible`);
    assert.strictEqual(gate.status, 'HOLD', `${docId} status must be HOLD`);
    assert(gate.reason.length > 0, `${docId} must have an explicit reason`);
  }
});

test('serializeToSanityContract rejects held documents by default (without enforceEligibility: false)', () => {
  const holdDocuments = ['BLG-012', 'BLG-013', 'BLG-014', 'BLG-015', 'BLG-021'];
  for (const docId of holdDocuments) {
    const meta = heldDocs.find(d => d.id === docId);
    const rawDoc = transformMdxToSanity(meta.id, meta.path, { v1Root: V1_ROOT, docType: meta.type });
    assert.throws(
      () => serializeToSanityContract(rawDoc, referenceMap, { rootDir: ROOT_DIR }),
      (err) => {
        assert(err instanceof MigrationEligibilityError);
        assert(err.message.includes(`Migration eligibility gate failed for ${docId}`));
        assert.strictEqual(err.details.status, 'HOLD');
        return true;
      }
    );
  }
});

console.log('================================================================');
console.log(`  TEST RESULTS: ${passed} PASSED, 0 FAILED (Total: ${total})`);
console.log('================================================================');
