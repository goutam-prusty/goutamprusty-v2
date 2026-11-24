#!/usr/bin/env node
/**
 * Reusable Batch Importer for Sanity Content Lake
 * goutamprusty-v2 — Safe, Atomic Document Ingestion Engine
 *
 * Invariants:
 * 1. Dry-run by default (no mutations submitted unless --write flag is explicitly passed).
 * 2. Explicit document ID list required via CLI positional arguments or --ids=...
 * 3. Strictly targets 'development' dataset; explicitly refuses any other dataset (especially 'production').
 * 4. Refuses already existing document IDs (fails closed to prevent accidental overwrites).
 * 5. Uses ONE atomic createIfNotExists transaction for all documents.
 * 6. Never prints, logs, or leaks Sanity API auth tokens.
 * 7. Prints transaction ID upon successful execution.
 * 8. Writes dry-run output to untracked location (migration/dry-run/), never src/data/verticalSliceData.json.
 *
 * Usage:
 *   node migration/import-batch.cjs RES-003 RES-007 ...           # Dry-run
 *   node migration/import-batch.cjs --ids=RES-003,RES-007 ...     # Dry-run
 *   node migration/import-batch.cjs --write RES-003 RES-007 ...   # Real atomic import
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const { transformMdxToSanity } = require('./lib/mdx-to-sanity-parser.cjs');
const { validateDocument } = require('./lib/schema-validator.cjs');
const { research: researchSchema, writing: writingSchema } = require('./schema/index.cjs');
const { makeKey } = require('./lib/key-generator.cjs');
const { buildAuthoritativeReferenceMap } = require('./lib/serialization-contract.cjs');
const { normalizeAssetPath } = require('./lib/path-normalizer.cjs');

const V1_ROOT = 'D:/goutamprusty-v1';
const DRY_RUN_DIR = path.join(__dirname, 'dry-run');
const CORPUS_PATH = path.join(__dirname, 'full-corpus-compatibility.json');

// Ensure dry-run directory exists
if (!fs.existsSync(DRY_RUN_DIR)) {
  fs.mkdirSync(DRY_RUN_DIR, { recursive: true });
}

// 1. Parse CLI arguments
const args = process.argv.slice(2);
let isWriteMode = false;
let requestedIds = [];

for (const arg of args) {
  if (arg === '--write') {
    isWriteMode = true;
  } else if (arg.startsWith('--ids=')) {
    requestedIds.push(...arg.slice(6).split(',').map((s) => s.trim()).filter(Boolean));
  } else if (!arg.startsWith('--')) {
    requestedIds.push(...arg.split(',').map((s) => s.trim()).filter(Boolean));
  }
}

// Deduplicate IDs
requestedIds = Array.from(new Set(requestedIds));

if (requestedIds.length === 0) {
  console.error('ERROR: No document IDs specified.');
  console.error('Usage: node migration/import-batch.cjs [--write] <ID-1> <ID-2> ...');
  process.exit(1);
}

// Strict safety gate:
// Owner authorization is explicit ONLY for the 7 specified documents:
// BLG-012, BLG-013, BLG-014, BLG-015, BLG-021, RES-014, RES-015.
// Any other document is strictly rejected by this gate.
const AUTHORIZED_HOLD_IDS = new Set(['BLG-012', 'BLG-013', 'BLG-014', 'BLG-015', 'BLG-021', 'RES-014', 'RES-015']);

const unauthorizedFound = requestedIds.filter((id) => !AUTHORIZED_HOLD_IDS.has(id));
if (unauthorizedFound.length > 0) {
  console.error(`ERROR: Requested document list contains unauthorized ID(s): ${unauthorizedFound.join(', ')}`);
  console.error(`This import execution is strictly authorized ONLY for: ${Array.from(AUTHORIZED_HOLD_IDS).join(', ')}`);
  process.exit(1);
}

console.log('================================================================');
console.log(`  SANITY BATCH IMPORTER (${requestedIds.length} DOCUMENTS)`);
console.log(`  MODE: ${isWriteMode ? '*** LIVE WRITE (ATOMIC TRANSACTION) ***' : 'DRY-RUN ONLY (SAFE)'}`);
console.log('================================================================\n');

// 2. Resolve Environment & Credentials
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'l94q5yx8';
const dataset = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'development';

// Invariant 3: Refuse datasets other than 'development'
if (dataset !== 'development') {
  console.error(`SECURITY REFUSAL: Target dataset is "${dataset}". This importer strictly refuses any dataset other than "development".`);
  process.exit(1);
}

// Resolve token safely (never print token value)
function getSanityAuthToken() {
  const envCandidates = [
    'SANITY_API_WRITE_TOKEN',
    'SANITY_AUTH_TOKEN',
    'SANITY_API_TOKEN',
    'SANITY_API_READ_TOKEN',
    'SANITY_READ_TOKEN',
  ];
  for (const varName of envCandidates) {
    const val = process.env[varName];
    if (val && typeof val === 'string' && val.trim().length > 0) {
      return val.trim();
    }
  }

  // Local CLI config fallback for developer convenience outside CI/Cloudflare
  const os = require('os');
  const configPath = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (parsed && typeof parsed.authToken === 'string' && parsed.authToken.trim().length > 0) {
        return parsed.authToken.trim();
      }
    } catch {
      // ignore
    }
  }
  return undefined;
}

const token = getSanityAuthToken();
if (isWriteMode && !token) {
  console.error('ERROR: No Sanity authentication token found for write operation.');
  process.exit(1);
}

// 3. Load Corpus and Resolve Document Targets
const corpus = JSON.parse(fs.readFileSync(CORPUS_PATH, 'utf8'));
const docMetaMap = new Map();
corpus.documents.forEach((d) => docMetaMap.set(d.workbookId, d));

const referenceMap = buildAuthoritativeReferenceMap();

const targets = requestedIds.map((id) => {
  const meta = docMetaMap.get(id);
  if (!meta) {
    throw new Error(`Document ID '${id}' not found in corpus compatibility manifest.`);
  }
  return {
    workbookId: meta.workbookId,
    type: meta.type.toLowerCase(),
    relativePath: meta.sourcePath,
    slug: meta.slug,
  };
});

// 4. Transform and Serialize Documents
const serializedDocs = [];

for (const target of targets) {
  console.log(`Parsing & validating ${target.workbookId} (${target.relativePath})...`);
  const rawDoc = transformMdxToSanity(target.workbookId, target.relativePath, {
    v1Root: V1_ROOT,
    docType: target.type,
  });

  const doc = JSON.parse(JSON.stringify(rawDoc));
  doc._id = `${target.type}-${target.workbookId}`;
  doc._type = target.type;

  // Clean Reference Normalization
  if (target.type === 'writing') {
    const rawReportSlug = doc.sourceReport;
    if (rawReportSlug) {
      const refId = referenceMap.get(rawReportSlug);
      if (refId) {
        doc.sourceReport = {
          _type: 'reference',
          _ref: refId,
        };
        if (!doc.sourceArchive) doc.sourceArchive = {};
        doc.sourceArchive.referencedSlugs = JSON.stringify({ sourceReport: rawReportSlug });
      }
    }
  }

  // Clean Reference Normalization: research derivedPosts
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
        const refId = referenceMap.get(rawSlug);
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

  // Normalize relatedProjects
  if (Array.isArray(doc.relatedProjects)) {
    const normalizedProjects = [];
    doc.relatedProjects.forEach((rawSlug, pIdx) => {
      if (typeof rawSlug === 'string') {
        const refId = referenceMap.get(rawSlug);
        if (refId) {
          normalizedProjects.push({
            _key: makeKey(`${target.workbookId}:relatedProject:${pIdx}:${rawSlug}`),
            _type: 'reference',
            _ref: refId,
          });
        }
      }
    });
    if (normalizedProjects.length > 0) {
      doc.relatedProjects = normalizedProjects;
    }
  }

  // Array member typing: sourceMaterial
  if (Array.isArray(doc.sourceMaterial)) {
    doc.sourceMaterial = doc.sourceMaterial.map((entry, idx) => ({
      _key: makeKey(`${target.workbookId}:sm:${idx}:${entry.title || idx}`),
      _type: 'sourceMaterialEntry',
      ...entry,
    }));
  }

  // Array member typing: bibliography
  if (Array.isArray(doc.bibliography)) {
    doc.bibliography = doc.bibliography.map((entry, idx) => ({
      _key: makeKey(`${target.workbookId}:bib:${entry.number || idx}:${entry.title || idx}`),
      _type: 'bibliographyEntry',
      ...entry,
    }));
  }

  // Cover image normalization
  if (doc.coverImage && typeof doc.coverImage === 'object') {
    delete doc.coverImage._type;
    if (doc.coverImage.assetPath) {
      doc.coverImage.assetPath = normalizeAssetPath(doc.coverImage.assetPath);
    }
  }

  // Normalize body image presentation paths
  if (Array.isArray(doc.body)) {
    for (const block of doc.body) {
      if (block._type === 'imageBlock' && block.assetPath) {
        block.assetPath = normalizeAssetPath(block.assetPath);
      }
      if (Array.isArray(block.children)) {
        for (const child of block.children) {
          if ((child._type === 'inlineImage' || child._type === 'imageBlock') && child.assetPath) {
            child.assetPath = normalizeAssetPath(child.assetPath);
          }
        }
      }
    }
  }

  // Editorial defaults
  doc.featured = false;
  doc.editorialStatus = 'draft';

  // Source archive provenance
  if (doc.sourceArchive) {
    doc.sourceArchive._type = 'sourceArchive';
    if (!doc.sourceArchive.importedAt) {
      doc.sourceArchive.importedAt = new Date().toISOString();
    }
    doc.sourceArchive.v1Commit = '71ef2c7';
  }

  // SEO metadata
  if (!doc.seo) {
    doc.seo = {
      _type: 'seo',
      metaTitle: doc.title,
      metaDescription: doc.summary,
    };
  } else {
    doc.seo._type = 'seo';
  }

  // Validate against Schema
  const schema = target.type === 'research' ? researchSchema : writingSchema;
  const validation = validateDocument(doc, schema);
  if (!validation.isValid) {
    console.error(`Validation failed for ${target.workbookId}:`, validation.errors);
    throw new Error(`Schema validation error in ${target.workbookId}`);
  }

  serializedDocs.push(doc);
}

// 5. Invariant 8: Write Dry-Run Outputs to Untracked Location
const dryrunJsonPath = path.join(DRY_RUN_DIR, 'batch-import-documents.json');
fs.writeFileSync(dryrunJsonPath, JSON.stringify(serializedDocs, null, 2), 'utf8');

const dryrunNdjsonPath = path.join(DRY_RUN_DIR, 'batch-import-mutations.ndjson');
const ndjsonLines = serializedDocs.map((d) => JSON.stringify({ createIfNotExists: d })).join('\n') + '\n';
fs.writeFileSync(dryrunNdjsonPath, ndjsonLines, 'utf8');

console.log(`\nDry-run serialized files written to:`);
console.log(`- ${dryrunJsonPath} (${fs.statSync(dryrunJsonPath).size} bytes)`);
console.log(`- ${dryrunNdjsonPath} (${fs.statSync(dryrunNdjsonPath).size} bytes)`);

// 6. Execute Remote Verification & Import
async function run() {
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-03-01',
    useCdn: false,
    token,
  });

  // Query existing document IDs in dataset
  console.log(`\nConnecting to Sanity Content Lake [project: ${projectId}, dataset: ${dataset}]...`);
  const existingDocs = await client.fetch('*[!(_id in path("_.**"))]._id');
  const existingSet = new Set(existingDocs);

  console.log(`Current document count in "${dataset}": ${existingDocs.length}`);

  // Invariant 4: Refuse existing document IDs
  const collisions = serializedDocs.map((d) => d._id).filter((id) => existingSet.has(id));
  if (collisions.length > 0) {
    console.error(`\nREFUSAL ERROR: The following document IDs already exist in dataset "${dataset}":`);
    collisions.forEach((id) => console.error(`  - ${id}`));
    console.error('To preserve data integrity, the batch importer refuses to overwrite existing documents.');
    process.exit(1);
  }

  console.log(`✓ Pre-import check passed: Zero collision with existing ${existingDocs.length} documents.`);

  if (!isWriteMode) {
    console.log('\n*** DRY-RUN COMPLETE (No changes made to remote dataset) ***');
    console.log('To execute the atomic remote import, re-run with --write flag.');
    return;
  }

  // Invariant 5: Use ONE atomic createIfNotExists transaction
  console.log(`\nExecuting ONE atomic createIfNotExists transaction for ${serializedDocs.length} documents...`);
  let transaction = client.transaction();
  for (const doc of serializedDocs) {
    transaction = transaction.createIfNotExists(doc);
  }

  const commitResult = await transaction.commit();
  console.log('\n================================================================');
  console.log('  TRANSACTION COMMITTED SUCCESSFULLY');
  console.log('================================================================');
  console.log(`Transaction ID: ${commitResult.transactionId}`);
  console.log(`Documents imported: ${serializedDocs.length}`);

  // 7. Post-import Read-back Verification
  console.log('\n--- Post-Import Read-Back Verification ---');
  const importedIds = serializedDocs.map((d) => d._id);
  const readbackDocs = await client.fetch('*[_id in $ids] | order(_id asc)', { ids: importedIds });

  console.log(`Read back ${readbackDocs.length}/${importedIds.length} documents from "${dataset}".`);
  if (readbackDocs.length !== importedIds.length) {
    throw new Error(`Read-back count mismatch: expected ${importedIds.length}, received ${readbackDocs.length}`);
  }

  for (const doc of readbackDocs) {
    const tableBlocks = (doc.body || []).filter((b) => b._type === 'tableBlock').length;
    const imageBlocks = (doc.body || []).filter((b) => b._type === 'imageBlock').length;
    const bibCount = (doc.bibliography || []).length;
    const smCount = (doc.sourceMaterial || []).length;
    let markersCount = 0;
    (doc.body || []).forEach((b) => {
      if (b.children) {
        b.children.forEach((c) => {
          if (c._type === 'citationMarker') markersCount++;
        });
      }
    });

    console.log(`  ✓ ${doc._id}: ${tableBlocks} tables, ${imageBlocks} figures, ${bibCount} bib, ${smCount} sources, ${markersCount} markers`);
  }

  const updatedTotal = await client.fetch('count(*[!(_id in path("_.**"))])');
  console.log(`\nUpdated total document count in "${dataset}": ${updatedTotal}`);
}

run().catch((err) => {
  console.error('\nIMPORT FAILED:', err.message);
  process.exit(1);
});
