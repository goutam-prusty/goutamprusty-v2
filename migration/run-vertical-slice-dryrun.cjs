/**
 * Vertical Slice 3-Document Sanity Migration Dry-Run
 * Target Documents: RES-018, BLG-001, BLG-002
 *
 * Implements clean reference serialization (no reserved _sourceSlug),
 * full schema validation, deterministic keying, and dual output (JSON + NDJSON).
 */

const fs = require('fs');
const path = require('path');
const { transformMdxToSanity } = require('./lib/mdx-to-sanity-parser.cjs');
const { validateDocument } = require('./lib/schema-validator.cjs');
const { research: researchSchema, writing: writingSchema } = require('./schema/index.cjs');
const { makeKey } = require('./lib/key-generator.cjs');

const V1_ROOT = 'D:/goutamprusty-v1';
const DRY_RUN_DIR = path.join(__dirname, 'dry-run');
const SRC_DATA_DIR = path.resolve(__dirname, '../src/data');

if (!fs.existsSync(DRY_RUN_DIR)) {
  fs.mkdirSync(DRY_RUN_DIR, { recursive: true });
}

const targets = [
  {
    workbookId: 'RES-018',
    type: 'research',
    relativePath: 'content/research/strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026.mdx',
  },
  {
    workbookId: 'BLG-001',
    type: 'writing',
    relativePath: 'content/blog/agentic-inflection-point.mdx',
  },
  {
    workbookId: 'BLG-002',
    type: 'writing',
    relativePath: 'content/blog/ai-physical-limits.mdx',
  },
];

console.log('================================================================');
console.log('  SANITY VERTICAL SLICE: 3-DOCUMENT MIGRATION DRY RUN');
console.log('================================================================\n');

// Phase 1: Parse AST
const parsedDocs = {};
for (const target of targets) {
  console.log(`Parsing ${target.workbookId} (${target.relativePath})...`);
  const doc = transformMdxToSanity(target.workbookId, target.relativePath, { v1Root: V1_ROOT, docType: target.type });
  parsedDocs[target.workbookId] = doc;
}

// Phase 2: Serialize with Clean Sanity References (Resolve _sourceSlug)
const serializedDocs = [];

for (const target of targets) {
  const doc = JSON.parse(JSON.stringify(parsedDocs[target.workbookId]));

  // Ensure deterministic _id and _type
  doc._id = `${target.type}-${target.workbookId}`;
  doc._type = target.type;

  // Clean Reference Normalization
  if (target.type === 'writing') {
    // sourceReport references RES-018
    const rawReportSlug = doc.sourceReport;
    if (rawReportSlug) {
      // Clean Sanity reference: strictly _type and _ref
      doc.sourceReport = {
        _type: 'reference',
        _ref: 'research-RES-018',
      };
      // Preserve provenance in sourceArchive.referencedSlugs without polluting the reference object
      if (!doc.sourceArchive) doc.sourceArchive = {};
      doc.sourceArchive.referencedSlugs = JSON.stringify({ sourceReport: rawReportSlug });
    }
  } else if (target.type === 'research') {
    // derivedPosts references BLG-001 and BLG-002
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
  }

  // Array member typing
  if (Array.isArray(doc.sourceMaterial)) {
    doc.sourceMaterial = doc.sourceMaterial.map((entry, idx) => ({
      _key: makeKey(`${target.workbookId}:sm:${idx}:${entry.title || idx}`),
      _type: 'sourceMaterialEntry',
      ...entry,
    }));
  }

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
  }

  // Editorial defaults
  doc.featured = false;
  doc.editorialStatus = 'draft';

  // Source archive provenance
  if (doc.sourceArchive) {
    doc.sourceArchive._type = 'sourceArchive';
    doc.sourceArchive.importedAt = new Date().toISOString();
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

console.log('\n================================================================');
console.log('  VERTICAL SLICE DRY RUN COMPLETE: 3/3 DOCUMENTS READY');
console.log('================================================================');
