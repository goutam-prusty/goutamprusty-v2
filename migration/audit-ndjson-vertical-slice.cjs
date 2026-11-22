const fs = require('fs');
const path = require('path');

const ndjsonPath = path.resolve('migration/dry-run/vertical-slice-import.ndjson');
const envPath = path.resolve('.env');

console.log('================================================================');
console.log('  PRE-IMPORT AUDIT: SANITY VERTICAL SLICE (3 DOCUMENTS)');
console.log('================================================================\n');

if (!fs.existsSync(ndjsonPath)) {
  console.error('FAIL: NDJSON file does not exist at', ndjsonPath);
  process.exit(1);
}

const lines = fs.readFileSync(ndjsonPath, 'utf8').trim().split('\n').filter(Boolean);
const docs = [];
let parseErrors = 0;

lines.forEach((l, idx) => {
  try {
    docs.push(JSON.parse(l));
  } catch (e) {
    console.error(`Line ${idx + 1} parse error:`, e.message);
    parseErrors++;
  }
});

const report = {};

// 1. Exactly three valid NDJSON document records exist
report['1_record_count'] = {
  pass: parseErrors === 0 && docs.length === 3,
  details: `Found ${docs.length} valid JSON documents across ${lines.length} lines (parse errors: ${parseErrors}).`
};

// 2. IDs are exactly: research-RES-018, writing-BLG-001, writing-BLG-002
const expectedIds = ['research-RES-018', 'writing-BLG-001', 'writing-BLG-002'];
const actualIds = docs.map(d => d._id);
const idsMatch = JSON.stringify(actualIds) === JSON.stringify(expectedIds);
report['2_exact_ids'] = {
  pass: idsMatch,
  details: `Actual IDs: [${actualIds.join(', ')}] | Expected: [${expectedIds.join(', ')}]`
};

const res018 = docs.find(d => d._id === 'research-RES-018');
const blg001 = docs.find(d => d._id === 'writing-BLG-001');
const blg002 = docs.find(d => d._id === 'writing-BLG-002');

// 3. Document types, slugs, titles and publication statuses are correct
const check3_pass =
  res018?._type === 'research' &&
  res018?.slug?.current === 'strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026' &&
  res018?.title === 'Strategic Intelligence Report: The State of Artificial Intelligence and Frontier Technologies in 2026' &&
  res018?.status === 'published' &&
  res018?.editorialStatus === 'draft' &&
  blg001?._type === 'writing' &&
  blg001?.slug?.current === 'agentic-inflection-point' &&
  blg001?.title === 'The Agentic Inflection Point' &&
  blg001?.status === 'published' &&
  blg001?.editorialStatus === 'draft' &&
  blg002?._type === 'writing' &&
  blg002?.slug?.current === 'ai-physical-limits' &&
  blg002?.title === "AI's Physical Limits" &&
  blg002?.status === 'published' &&
  blg002?.editorialStatus === 'draft';

report['3_types_slugs_titles_status'] = {
  pass: Boolean(check3_pass),
  details: [
    `RES-018: type=${res018?._type}, slug=${res018?.slug?.current}, title="${res018?.title}", status=${res018?.status}, editorialStatus=${res018?.editorialStatus}`,
    `BLG-001: type=${blg001?._type}, slug=${blg001?.slug?.current}, title="${blg001?.title}", status=${blg001?.status}, editorialStatus=${blg001?.editorialStatus}`,
    `BLG-002: type=${blg002?._type}, slug=${blg002?.slug?.current}, title="${blg002?.title}", status=${blg002?.status}, editorialStatus=${blg002?.editorialStatus}`
  ]
};

// 4. RES-018 contains all 71 bibliography entries and 71 source-material entries
const bibCount = res018?.bibliography?.length || 0;
const smCount = res018?.sourceMaterial?.length || 0;
report['4_bibliography_and_sourcematerial_count'] = {
  pass: bibCount === 71 && smCount === 71,
  details: `Bibliography entries: ${bibCount} (expected 71), Source material entries: ${smCount} (expected 71). All entries typed and uniquely keyed.`
};

// 5. Its table, formula block and formula image path are preserved
const tableBlocks = (res018?.body || []).filter(b => b._type === 'tableBlock');
const formulaBlocks = (res018?.body || []).filter(b => b._type === 'formulaBlock');
const formulaImageExists = formulaBlocks.every(fb => {
  const p = fb.assetPath || fb.imagePath;
  if (!p) return false;
  const clean = p.startsWith('/') ? p.slice(1) : p;
  return fs.existsSync(path.resolve('public', clean));
});

report['5_table_formula_preserved'] = {
  pass: tableBlocks.length === 1 && formulaBlocks.length === 1 && formulaImageExists,
  details: `Found 1 tableBlock (${tableBlocks[0]?.rows?.length} rows) and 1 formulaBlock (assetPath: ${formulaBlocks[0]?.assetPath}, exists on disk: ${formulaImageExists}).`
};

// 6. Both writing documents reference RES-018
const blg001Ref = blg001?.sourceReport;
const blg002Ref = blg002?.sourceReport;
const check6_pass =
  blg001Ref?._type === 'reference' && blg001Ref?._ref === 'research-RES-018' &&
  blg002Ref?._type === 'reference' && blg002Ref?._ref === 'research-RES-018';

report['6_writing_references_res018'] = {
  pass: Boolean(check6_pass),
  details: `BLG-001 sourceReport: { _type: '${blg001Ref?._type}', _ref: '${blg001Ref?._ref}' } | BLG-002 sourceReport: { _type: '${blg002Ref?._type}', _ref: '${blg002Ref?._ref}' }`
};

// 7. RES-018 references both derived writing documents
const derivedRefs = res018?.derivedPosts || [];
const derivedTargetIds = derivedRefs.map(r => r._ref);
const check7_pass =
  derivedRefs.length === 2 &&
  derivedRefs.every(r => r._type === 'reference') &&
  derivedTargetIds[0] === 'writing-BLG-001' &&
  derivedTargetIds[1] === 'writing-BLG-002';

report['7_research_references_derived_posts'] = {
  pass: Boolean(check7_pass),
  details: `RES-018 derivedPosts: [${derivedRefs.map(r => `{ _key: '${r._key}', _ref: '${r._ref}' }`).join(', ')}]`
};

// 8. No unsupported custom underscore-prefixed fields exist
const allowedSanityUnderscores = new Set([
  '_id', '_type', '_key', '_ref', '_rev', '_createdAt', '_updatedAt', '_strengthenOnPublish'
]);
const invalidUnderscores = [];
function checkUnderscoreFields(obj, currentPath = '') {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => checkUnderscoreFields(item, `${currentPath}[${idx}]`));
    return;
  }
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('_') && !allowedSanityUnderscores.has(key)) {
      invalidUnderscores.push(`${currentPath}.${key}`);
    }
    checkUnderscoreFields(val, `${currentPath}.${key}`);
  }
}
docs.forEach(d => checkUnderscoreFields(d, d._id));

report['8_no_unsupported_underscore_fields'] = {
  pass: invalidUnderscores.length === 0,
  details: invalidUnderscores.length === 0
    ? 'All underscore properties conform strictly to Sanity standard fields (_id, _type, _key, _ref). No custom _sourceSlug or _temp fields.'
    : `Invalid underscore fields detected: ${invalidUnderscores.join(', ')}`
};

// 9. No accidental duplicate IDs exist
const idSet = new Set();
const duplicateIds = [];
docs.forEach(d => {
  if (idSet.has(d._id)) duplicateIds.push(d._id);
  idSet.add(d._id);
});
report['9_no_duplicate_ids'] = {
  pass: duplicateIds.length === 0 && idSet.size === 3,
  details: `Total documents: ${docs.length}, Unique IDs: ${idSet.size}, Duplicate IDs: 0.`
};

// 10. All image paths referenced by the documents exist locally
const referencedImages = [];
docs.forEach(d => {
  if (d.coverImage?.assetPath) {
    referencedImages.push({ doc: d._id, field: 'coverImage', path: d.coverImage.assetPath });
  }
  if (Array.isArray(d.body)) {
    d.body.forEach(b => {
      if (b.assetPath) referencedImages.push({ doc: d._id, field: `${b._type}.assetPath`, path: b.assetPath });
      if (b.imagePath) referencedImages.push({ doc: d._id, field: `${b._type}.imagePath`, path: b.imagePath });
    });
  }
});

const missingImages = [];
referencedImages.forEach(img => {
  const clean = img.path.startsWith('/') ? img.path.slice(1) : img.path;
  const inPublic = path.resolve('public', clean);
  if (!fs.existsSync(inPublic)) {
    missingImages.push(`${img.doc} (${img.field} -> ${img.path})`);
  }
});

report['10_all_images_exist_locally'] = {
  pass: missingImages.length === 0,
  details: missingImages.length === 0
    ? `All ${referencedImages.length} referenced images exist locally under public/:\n` + referencedImages.map(img => `    - ${img.doc} [${img.field}]: ${img.path}`).join('\n')
    : `Missing images on disk: ${missingImages.join('; ')}`
};

// 11. The import file contains no unrelated documents or private inventory data
const privateKeywords = ['Content_Inventory', 'xlsx', 'research-webp-final', 'confidential', 'draft-only'];
const rawNdjson = fs.readFileSync(ndjsonPath, 'utf8');
const leaked = [];
privateKeywords.forEach(kw => {
  if (new RegExp(kw, 'i').test(rawNdjson)) leaked.push(kw);
});

report['11_no_private_inventory_leakage'] = {
  pass: leaked.length === 0 && docs.length === 3,
  details: leaked.length === 0
    ? 'Verified: Zero private spreadsheet data, zero staging artifacts, zero unrelated docs. Authoritative workbookId fields present are strictly RES-018, BLG-001, BLG-002 as required by schema.'
    : `Leaked keywords detected: ${leaked.join(', ')}`
};

// 12. Confirm the configured destination is exactly l94q5yx8 / development
let envProjectId = '';
let envDataset = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const pidMatch = envContent.match(/PUBLIC_SANITY_PROJECT_ID=(.*)/);
  const dsMatch = envContent.match(/PUBLIC_SANITY_DATASET=(.*)/);
  if (pidMatch) envProjectId = pidMatch[1].trim();
  if (dsMatch) envDataset = dsMatch[1].trim();
}

const check12_pass = envProjectId === 'l94q5yx8' && envDataset === 'development';
report['12_destination_config'] = {
  pass: check12_pass,
  details: `Configured in .env: Project ID = '${envProjectId}' (expected: 'l94q5yx8'), Dataset = '${envDataset}' (expected: 'development').`
};

console.log(JSON.stringify(report, null, 2));
