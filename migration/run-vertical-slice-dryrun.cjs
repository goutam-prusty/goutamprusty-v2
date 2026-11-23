/**
 * Generalized Sanity Migration Dry-Run Engine
 * goutamprusty.com v2 Rebuild — Multi-Document Content Architecture
 *
 * Supports arbitrary selection of PASS documents via CLI args (e.g. RES-004, RES-019),
 * with pure backwards compatibility for the default 3-document vertical slice.
 *
 * Usage:
 *   node migration/run-vertical-slice-dryrun.cjs                   # Default: RES-018, BLG-001, BLG-002
 *   node migration/run-vertical-slice-dryrun.cjs RES-004 RES-019  # Custom selection
 *   node migration/run-vertical-slice-dryrun.cjs --ids=RES-004,RES-019
 */

const fs = require('fs');
const path = require('path');
const { transformMdxToSanity } = require('./lib/mdx-to-sanity-parser.cjs');
const { validateDocument } = require('./lib/schema-validator.cjs');
const { research: researchSchema, writing: writingSchema } = require('./schema/index.cjs');
const { makeKey } = require('./lib/key-generator.cjs');
const { buildAuthoritativeReferenceMap } = require('./lib/serialization-contract.cjs');
const { normalizeAssetPath } = require('./lib/path-normalizer.cjs');

const V1_ROOT = 'D:/goutamprusty-v1';
const DRY_RUN_DIR = path.join(__dirname, 'dry-run');
const SRC_DATA_DIR = path.resolve(__dirname, '../src/data');
const CORPUS_PATH = path.join(__dirname, 'full-corpus-compatibility.json');

if (!fs.existsSync(DRY_RUN_DIR)) {
  fs.mkdirSync(DRY_RUN_DIR, { recursive: true });
}

// Parse requested IDs from arguments
const args = process.argv.slice(2);
let requestedIds = [];
let forceWriteVerticalSlice = false;

for (const arg of args) {
  if (arg.startsWith('--ids=')) {
    requestedIds.push(...arg.slice(6).split(',').map((s) => s.trim()).filter(Boolean));
  } else if (arg === '--write-vertical-slice') {
    forceWriteVerticalSlice = true;
  } else if (!arg.startsWith('--')) {
    requestedIds.push(...arg.split(',').map((s) => s.trim()).filter(Boolean));
  }
}

const DEFAULT_SLICE = ['RES-018', 'BLG-001', 'BLG-002'];
const isDefaultSlice = requestedIds.length === 0 ||
  (requestedIds.length === DEFAULT_SLICE.length && requestedIds.every((id, idx) => id === DEFAULT_SLICE[idx]));

const targetIds = isDefaultSlice ? DEFAULT_SLICE : requestedIds;

console.log('================================================================');
console.log(`  SANITY MIGRATION DRY RUN (${targetIds.length} DOCUMENTS)`);
console.log('================================================================\n');

// Load corpus metadata
const corpus = JSON.parse(fs.readFileSync(CORPUS_PATH, 'utf8'));
const docMetaMap = new Map();
corpus.documents.forEach((d) => docMetaMap.set(d.workbookId, d));

// Build authoritative slug-to-ID reference map
const referenceMap = buildAuthoritativeReferenceMap();

// Resolve targets
const targets = targetIds.map((id) => {
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

// Phase 1: Parse AST
const parsedDocs = {};
for (const target of targets) {
  console.log(`Parsing ${target.workbookId} (${target.relativePath})...`);
  const doc = transformMdxToSanity(target.workbookId, target.relativePath, {
    v1Root: V1_ROOT,
    docType: target.type,
  });
  parsedDocs[target.workbookId] = doc;
}

// Phase 2: Serialize with Clean Sanity References
const serializedDocs = [];

for (const target of targets) {
  const doc = JSON.parse(JSON.stringify(parsedDocs[target.workbookId]));

  // Ensure deterministic _id and _type
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
  } else if (target.type === 'research') {
    if (target.workbookId === 'RES-018') {
      // Preserve vertical slice derivedPosts relationship
      doc.derivedPosts = [
        {
          _key: makeKey(`${target.workbookId}:derivedPost:0:agentic-inflection-point`),
          _type: 'reference',
          _ref: 'writing-BLG-001',
        },
        {
          _key: makeKey(`${target.workbookId}:derivedPost:1:ai-physical-limits`),
          _type: 'reference',
          _ref: 'writing-BLG-002',
        },
      ];
      if (!doc.sourceArchive) doc.sourceArchive = {};
      doc.sourceArchive.referencedSlugs = JSON.stringify({
        derivedPosts: ['agentic-inflection-point', 'ai-physical-limits'],
      });
    } else if (Array.isArray(doc.derivedPosts) && doc.derivedPosts.length > 0) {
      const normalizedDerived = [];
      const derivedSlugs = [];

      doc.derivedPosts.forEach((slug, idx) => {
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
          }
        }
      });

      if (normalizedDerived.length > 0) {
        doc.derivedPosts = normalizedDerived;
        if (!doc.sourceArchive) doc.sourceArchive = {};
        doc.sourceArchive.referencedSlugs = JSON.stringify({ derivedPosts: derivedSlugs });
      }
    }
  }

  // Related projects normalization
  if (Array.isArray(doc.relatedProjects) && doc.relatedProjects.length > 0) {
    const normalizedProjects = [];
    doc.relatedProjects.forEach((slug, idx) => {
      const rawSlug = typeof slug === 'string' ? slug : slug?._sourceSlug || slug?.slug;
      if (rawSlug) {
        const refId = referenceMap.get(rawSlug);
        if (refId) {
          normalizedProjects.push({
            _key: makeKey(`${target.workbookId}:relatedProject:${idx}:${rawSlug}`),
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

  // Phase 3: Validate against Schema
  const schema = target.type === 'research' ? researchSchema : writingSchema;
  const validation = validateDocument(doc, schema);
  if (!validation.isValid) {
    console.error(`Validation failed for ${target.workbookId}:`, validation.errors);
    throw new Error(`Schema validation error in ${target.workbookId}`);
  }

  console.log(`✓ ${target.workbookId} (${target.type}) validated cleanly against Sanity schema (0 errors).`);
  serializedDocs.push(doc);
}

// Phase 4: Write Outputs
if (isDefaultSlice || forceWriteVerticalSlice) {
  // 1. JSON Document Bundle
  const bundlePath = path.join(DRY_RUN_DIR, 'vertical-slice-documents.json');
  fs.writeFileSync(bundlePath, JSON.stringify(serializedDocs, null, 2), 'utf8');
  console.log(`\nSaved dry-run JSON bundle: ${bundlePath} (${fs.statSync(bundlePath).size} bytes)`);

  // 2. NDJSON Import File for Sanity CLI (sanity datasets import)
  const importNdjsonPath = path.join(DRY_RUN_DIR, 'vertical-slice-import.ndjson');
  const importNdjsonLines = serializedDocs.map((d) => JSON.stringify(d)).join('\n') + '\n';
  fs.writeFileSync(importNdjsonPath, importNdjsonLines, 'utf8');
  console.log(`Saved Sanity CLI import NDJSON: ${importNdjsonPath} (${fs.statSync(importNdjsonPath).size} bytes)`);

  // 3. NDJSON Mutation File for Sanity REST API
  const ndjsonPath = path.join(DRY_RUN_DIR, 'vertical-slice-mutations.ndjson');
  const ndjsonLines = serializedDocs.map((d) => JSON.stringify({ createOrReplace: d })).join('\n') + '\n';
  fs.writeFileSync(ndjsonPath, ndjsonLines, 'utf8');
  console.log(`Saved Sanity REST mutations NDJSON: ${ndjsonPath} (${fs.statSync(ndjsonPath).size} bytes)`);

  // 4. Sync to src/data for Astro static generation & GROQ data layer
  const astroDataPath = path.join(SRC_DATA_DIR, 'verticalSliceData.json');
  fs.writeFileSync(astroDataPath, JSON.stringify(serializedDocs, null, 2), 'utf8');
  console.log(`Synced Astro static vertical slice data: ${astroDataPath} (${fs.statSync(astroDataPath).size} bytes)`);
} else {
  // Custom dry-run output (does not overwrite vertical slice production data)
  const bundlePath = path.join(DRY_RUN_DIR, 'dryrun-documents.json');
  fs.writeFileSync(bundlePath, JSON.stringify(serializedDocs, null, 2), 'utf8');
  console.log(`\nSaved custom dry-run JSON bundle: ${bundlePath} (${fs.statSync(bundlePath).size} bytes)`);

  const importNdjsonPath = path.join(DRY_RUN_DIR, 'dryrun-import.ndjson');
  const importNdjsonLines = serializedDocs.map((d) => JSON.stringify(d)).join('\n') + '\n';
  fs.writeFileSync(importNdjsonPath, importNdjsonLines, 'utf8');
  console.log(`Saved custom dry-run import NDJSON: ${importNdjsonPath} (${fs.statSync(importNdjsonPath).size} bytes)`);

  const ndjsonPath = path.join(DRY_RUN_DIR, 'dryrun-mutations.ndjson');
  const ndjsonLines = serializedDocs.map((d) => JSON.stringify({ createOrReplace: d })).join('\n') + '\n';
  fs.writeFileSync(ndjsonPath, ndjsonLines, 'utf8');
  console.log(`Saved custom dry-run mutations NDJSON: ${ndjsonPath} (${fs.statSync(ndjsonPath).size} bytes)`);
}

console.log('\n================================================================');
console.log(`  MIGRATION DRY RUN COMPLETE: ${serializedDocs.length}/${targetIds.length} DOCUMENTS READY`);
console.log('================================================================');
