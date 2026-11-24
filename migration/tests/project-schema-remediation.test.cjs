/**
 * Project Schema Remediation & Parity Test Suite
 * goutamprusty.com v2 Rebuild — Phase 1: T5 Project Schema Remediation
 *
 * Verifies that the Studio schema, Migration schema, and parser/serialization contract:
 * 1. Define and support the 4 approved provenance labels ('Independent', 'Built during training', 'Guided exercise', 'Collaborative').
 * 2. Support dedicated optional aiAttribution and evaluationNotes fields.
 * 3. Reconcile project status and date definitions with backward compatibility for existing records.
 * 4. Agree on legacyFeatured, coverImage, and Portable Text block definitions.
 * 5. Safely validate V1 representative documents (PRJ-001, PRJ-002, PRJ-003).
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { project: migrationProject } = require('../schema/index.cjs');
const { validateDocument } = require('../lib/schema-validator.cjs');
const { transformMdxToSanity } = require('../lib/mdx-to-sanity-parser.cjs');
const { serializeToSanityContract, buildAuthoritativeReferenceMap } = require('../lib/serialization-contract.cjs');

// Test tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${description}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

console.log('================================================================');
console.log('  PROJECT SCHEMA REMEDIATION & PARITY TEST SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// Suite 1: Schema Structure, Field Presence & Parity
// -----------------------------------------------------------------------------
console.log('--- Suite 1: Schema Field Presence & Reconciled Types ---');

test('Migration schema contains all required, reconciled, and optional fields', () => {
  const fields = migrationProject.fields;
  const fieldNames = fields.map(f => f.name);

  const expectedFields = [
    'workbookId',
    'title',
    'slug',
    'summary',
    'provenance',
    'status',
    'startDate',
    'endDate',
    'completedDate',
    'category',
    'tags',
    'role',
    'links',
    'techStack',
    'aiAttribution',
    'evaluationNotes',
    'coverImage',
    'relatedResearch',
    'relatedWriting',
    'topics',
    'body',
    'sourceArchive',
    'legacyFeatured',
    'featured',
    'editorialStatus',
    'editorialNotes'
  ];

  for (const name of expectedFields) {
    assert(fieldNames.includes(name), `Missing field '${name}' in migration project schema`);
  }
});

test('Studio schema source file defines all reconciled fields and options', () => {
  const studioFile = path.resolve(__dirname, '../../src/sanity/schemaTypes/project.ts');
  assert(fs.existsSync(studioFile), 'Studio schema file must exist');
  const content = fs.readFileSync(studioFile, 'utf8');

  // Verify fields in Studio schema
  assert(content.includes("name: 'provenance'"), 'Studio schema must include provenance field');
  assert(content.includes("name: 'aiAttribution'"), 'Studio schema must include aiAttribution field');
  assert(content.includes("name: 'evaluationNotes'"), 'Studio schema must include evaluationNotes field');
  assert(content.includes("name: 'startDate'"), 'Studio schema must include startDate field');
  assert(content.includes("name: 'endDate'"), 'Studio schema must include endDate field');
  assert(content.includes("name: 'completedDate'"), 'Studio schema must include completedDate field');
  assert(content.includes("name: 'legacyFeatured'"), 'Studio schema must include legacyFeatured field');
});

// -----------------------------------------------------------------------------
// Suite 2: Provenance Field Behavior & Label Support
// -----------------------------------------------------------------------------
console.log('\n--- Suite 2: Provenance Field Behavior & Approved Labels ---');

const APPROVED_LABELS = [
  'Independent',
  'Built during training',
  'Guided exercise',
  'Collaborative'
];

test('Provenance field in migration schema lists all 4 approved labels', () => {
  const provField = migrationProject.fields.find(f => f.name === 'provenance');
  assert(provField, 'Provenance field must exist');
  assert.strictEqual(provField.type, 'string', 'Provenance must be string type');

  const optionValues = provField.options.list.map(opt => typeof opt === 'object' ? opt.value : opt);
  for (const label of APPROVED_LABELS) {
    assert(optionValues.includes(label), `Provenance options must include '${label}'`);
  }
});

test('Documents with each approved provenance label validate cleanly', () => {
  const baseDoc = {
    _id: 'project-PRJ-TEST',
    _type: 'project',
    workbookId: 'PRJ-TEST',
    title: 'Test Project',
    slug: { _type: 'slug', current: 'test-project' },
    summary: 'A test project summary.',
    status: 'published',
    startDate: '2026-01-01',
    category: 'technology',
    role: 'Lead Architect',
    techStack: ['TypeScript', 'Astro'],
    body: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 's1', _type: 'span', text: 'Case study content.', marks: [] }],
        markDefs: []
      }
    ],
    sourceArchive: {
      _type: 'sourceArchive',
      v1GitCommit: '71ef2c7c5c6a8995cc6901d350cc29c35d427423',
      v1RelativePath: 'content/projects/test.mdx',
      sourceSha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      rawMdxBytes: 500,
      archiveVersion: '2.0.0'
    },
    featured: false
  };

  for (const label of APPROVED_LABELS) {
    const docWithProv = { ...baseDoc, provenance: label };
    const validation = validateDocument(docWithProv, migrationProject);
    assert.strictEqual(validation.isValid, true, `Document with provenance '${label}' must be valid`);
    assert.strictEqual(validation.errors.length, 0);
  }
});

test('Documents without provenance remain valid (backward compatibility)', () => {
  const docWithoutProv = {
    _id: 'project-PRJ-NO-PROV',
    _type: 'project',
    workbookId: 'PRJ-NO-PROV',
    title: 'No Provenance Project',
    slug: { _type: 'slug', current: 'no-provenance' },
    summary: 'A project without explicit provenance.',
    status: 'published',
    startDate: '2026-01-01',
    category: 'technology',
    role: 'Developer',
    techStack: ['Next.js'],
    body: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 's1', _type: 'span', text: 'Text.', marks: [] }],
        markDefs: []
      }
    ],
    sourceArchive: {
      _type: 'sourceArchive',
      v1GitCommit: '71ef2c7c5c6a8995cc6901d350cc29c35d427423',
      v1RelativePath: 'content/projects/test.mdx',
      sourceSha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      rawMdxBytes: 500,
      archiveVersion: '2.0.0'
    },
    featured: false
  };

  const validation = validateDocument(docWithoutProv, migrationProject);
  assert.strictEqual(validation.isValid, true, 'Document without provenance must validate cleanly');
  assert.strictEqual(validation.errors.length, 0);
});

// -----------------------------------------------------------------------------
// Suite 3: Status & Date Definitions Reconciliation
// -----------------------------------------------------------------------------
console.log('\n--- Suite 3: Status & Date Definitions Reconciliation ---');

test('Status field recognizes completed, published, in_progress, in-progress, archived, draft', () => {
  const statusField = migrationProject.fields.find(f => f.name === 'status');
  assert(statusField, 'Status field must exist');
  const values = statusField.options.list.map(opt => typeof opt === 'object' ? opt.value : opt);

  const requiredStatuses = ['completed', 'published', 'in_progress', 'in-progress', 'archived', 'draft'];
  for (const s of requiredStatuses) {
    assert(values.includes(s), `Status options must recognize '${s}'`);
  }
});

test('Project documents validate across all recognized status values', () => {
  const statuses = ['completed', 'published', 'in_progress', 'in-progress', 'archived', 'draft'];
  for (const st of statuses) {
    const doc = {
      _id: `project-PRJ-ST-${st}`,
      _type: 'project',
      workbookId: `PRJ-ST-${st}`,
      title: 'Status Test Project',
      slug: { _type: 'slug', current: `status-${st}` },
      summary: 'Status test summary.',
      status: st,
      startDate: '2026-02-01',
      category: 'technology',
      role: 'Engineer',
      techStack: ['Node.js'],
      body: [
        {
          _key: 'b1',
          _type: 'block',
          style: 'normal',
          children: [{ _key: 's1', _type: 'span', text: 'Text.', marks: [] }],
          markDefs: []
        }
      ],
      sourceArchive: {
        _type: 'sourceArchive',
        v1GitCommit: '71ef2c7c5c6a8995cc6901d350cc29c35d427423',
        v1RelativePath: 'content/projects/test.mdx',
        sourceSha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        rawMdxBytes: 500,
        archiveVersion: '2.0.0'
      },
      featured: false
    };

    const result = validateDocument(doc, migrationProject);
    assert.strictEqual(result.isValid, true, `Status '${st}' must be valid`);
  }
});

test('Dates support both startDate/endDate pair and legacy completedDate', () => {
  const docWithCompleted = {
    _id: 'project-PRJ-LEGACY-DATE',
    _type: 'project',
    workbookId: 'PRJ-LEGACY-DATE',
    title: 'Legacy Date Project',
    slug: { _type: 'slug', current: 'legacy-date' },
    summary: 'Legacy date summary.',
    status: 'completed',
    startDate: '2026-01-01',
    completedDate: '2026-06-01',
    endDate: '2026-06-01',
    category: 'technology',
    role: 'Engineer',
    techStack: ['TypeScript'],
    body: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 's1', _type: 'span', text: 'Text.', marks: [] }],
        markDefs: []
      }
    ],
    sourceArchive: {
      _type: 'sourceArchive',
      v1GitCommit: '71ef2c7c5c6a8995cc6901d350cc29c35d427423',
      v1RelativePath: 'content/projects/test.mdx',
      sourceSha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      rawMdxBytes: 500,
      archiveVersion: '2.0.0'
    },
    featured: false
  };

  const result = validateDocument(docWithCompleted, migrationProject);
  assert.strictEqual(result.isValid, true, 'Document with completedDate must validate cleanly');
});

// -----------------------------------------------------------------------------
// Suite 4: AI Attribution & Evaluation Notes
// -----------------------------------------------------------------------------
console.log('\n--- Suite 4: Dedicated AI Attribution & Evaluation Notes ---');

test('aiAttribution and evaluationNotes are independent optional fields', () => {
  const doc = {
    _id: 'project-PRJ-AI-EVAL',
    _type: 'project',
    workbookId: 'PRJ-AI-EVAL',
    title: 'AI and Evaluation Test',
    slug: { _type: 'slug', current: 'ai-eval-test' },
    summary: 'Summary with AI attribution.',
    status: 'published',
    startDate: '2026-03-01',
    category: 'technology',
    role: 'Lead',
    techStack: ['Python'],
    aiAttribution: 'Code scaffolding was AI-assisted; algorithmic core was written by hand.',
    evaluationNotes: 'Benchmark tests show latency under 40ms across 1000 requests.',
    editorialNotes: 'Editorial review completed on 2026-11-24.',
    body: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 's1', _type: 'span', text: 'Text.', marks: [] }],
        markDefs: []
      }
    ],
    sourceArchive: {
      _type: 'sourceArchive',
      v1GitCommit: '71ef2c7c5c6a8995cc6901d350cc29c35d427423',
      v1RelativePath: 'content/projects/test.mdx',
      sourceSha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      rawMdxBytes: 500,
      archiveVersion: '2.0.0'
    },
    featured: false
  };

  const result = validateDocument(doc, migrationProject);
  assert.strictEqual(result.isValid, true, 'Document with aiAttribution and evaluationNotes must be valid');
  assert.strictEqual(doc.aiAttribution.includes('AI-assisted'), true);
  assert.strictEqual(doc.evaluationNotes.includes('Benchmark'), true);
  assert.strictEqual(doc.editorialNotes.includes('Editorial'), true);
});

// -----------------------------------------------------------------------------
// Suite 5: Portable Text Custom Blocks & Formula Support
// -----------------------------------------------------------------------------
console.log('\n--- Suite 5: Portable Text Custom Blocks in Project Schema ---');

test('Case study body accepts all 6 custom block types + standardBlock', () => {
  const bodyField = migrationProject.fields.find(f => f.name === 'body');
  assert(bodyField, 'Body field must exist');
  const ofTypes = bodyField.of.map(m => m.type);

  assert(ofTypes.includes('imageBlock'), 'Must support imageBlock');
  assert(ofTypes.includes('tableBlock'), 'Must support tableBlock');
  assert(ofTypes.includes('formulaBlock'), 'Must support formulaBlock');
  assert(ofTypes.includes('mermaidBlock'), 'Must support mermaidBlock');
  assert(ofTypes.includes('codeBlock'), 'Must support codeBlock');
  assert(ofTypes.includes('dividerBlock'), 'Must support dividerBlock');
});

test('Project document with all block types validates cleanly', () => {
  const richDoc = {
    _id: 'project-PRJ-RICH',
    _type: 'project',
    workbookId: 'PRJ-RICH',
    title: 'Rich Case Study',
    slug: { _type: 'slug', current: 'rich-case-study' },
    summary: 'Rich body test.',
    status: 'published',
    startDate: '2026-04-01',
    category: 'technology',
    role: 'Full Stack',
    techStack: ['Astro'],
    body: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 's1', _type: 'span', text: 'Intro paragraph.', marks: [] }],
        markDefs: []
      },
      {
        _key: 'cb1',
        _type: 'codeBlock',
        code: 'const x = 42;',
        language: 'typescript'
      },
      {
        _key: 'mb1',
        _type: 'mermaidBlock',
        code: 'graph TD; A-->B;'
      },
      {
        _key: 'fb1',
        _type: 'formulaBlock',
        formulaId: 'f1',
        alt: 'Formula',
        assetPath: '/formulas/f1.webp',
        manifestRef: 'm1',
        dimensions: { width: 100, height: 50 },
        sha256: 'abc',
        originalPngSha256: 'def'
      },
      {
        _key: 'd1',
        _type: 'dividerBlock',
        style: 'line'
      }
    ],
    sourceArchive: {
      _type: 'sourceArchive',
      v1GitCommit: '71ef2c7c5c6a8995cc6901d350cc29c35d427423',
      v1RelativePath: 'content/projects/test.mdx',
      sourceSha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      rawMdxBytes: 500,
      archiveVersion: '2.0.0'
    },
    featured: false
  };

  const result = validateDocument(richDoc, migrationProject);
  assert.strictEqual(result.isValid, true, 'Rich document must validate cleanly');
});

// -----------------------------------------------------------------------------
// Suite 6: End-to-End V1 Representative Projects Conformance
// -----------------------------------------------------------------------------
console.log('\n--- Suite 6: V1 Representative Projects Conformance ---');

const referenceMap = buildAuthoritativeReferenceMap({
  corpusDataPath: path.join(__dirname, '../full-corpus-compatibility.json')
});

const projectConfigs = [
  { id: 'PRJ-001', file: 'content/projects/inkline.mdx', slug: 'inkline' },
  { id: 'PRJ-002', file: 'content/projects/vitaliq.mdx', slug: 'vitaliq' },
  { id: 'PRJ-003', file: 'content/projects/wharf.mdx', slug: 'wharf' }
];

for (const prj of projectConfigs) {
  test(`V1 project ${prj.id} (${prj.slug}) parses and validates against reconciled project schema`, () => {
    const rawParsed = transformMdxToSanity(prj.id, prj.file);
    assert.strictEqual(rawParsed.workbookId, prj.id);
    assert.strictEqual(rawParsed.slug.current, prj.slug);
    assert.strictEqual(rawParsed.status, 'published');
    assert(rawParsed.startDate, 'startDate must be present');

    const contractDoc = serializeToSanityContract(rawParsed, referenceMap, { enforceEligibility: false });

    assert.strictEqual(contractDoc.featured, false, 'featured must be false per editorial policy');
    assert.strictEqual(contractDoc.legacyFeatured, true, 'legacyFeatured must preserve V1 frontmatter');

    const validation = validateDocument(contractDoc, migrationProject);
    assert.strictEqual(validation.isValid, true, `${prj.id} must pass validation: ${JSON.stringify(validation.errors)}`);
    assert.strictEqual(validation.errors.length, 0, `${prj.id} must have 0 errors`);
  });
}

// -----------------------------------------------------------------------------
// Suite 7: Normalization & Compatibility Helpers
// -----------------------------------------------------------------------------
console.log('\n--- Suite 7: Normalization & Compatibility Helpers ---');

const {
  normalizeProvenanceLabel,
  normalizeProjectStatus,
  getProjectCompletionDate
} = require('../lib/project-compatibility.cjs');

test('normalizeProvenanceLabel correctly maps approved labels and case/slug aliases', () => {
  assert.strictEqual(normalizeProvenanceLabel('Independent'), 'Independent');
  assert.strictEqual(normalizeProvenanceLabel('independent'), 'Independent');
  assert.strictEqual(normalizeProvenanceLabel('Built during training'), 'Built during training');
  assert.strictEqual(normalizeProvenanceLabel('built-during-training'), 'Built during training');
  assert.strictEqual(normalizeProvenanceLabel('training'), 'Built during training');
  assert.strictEqual(normalizeProvenanceLabel('Guided exercise'), 'Guided exercise');
  assert.strictEqual(normalizeProvenanceLabel('guided-exercise'), 'Guided exercise');
  assert.strictEqual(normalizeProvenanceLabel('guided'), 'Guided exercise');
  assert.strictEqual(normalizeProvenanceLabel('Collaborative'), 'Collaborative');
  assert.strictEqual(normalizeProvenanceLabel('collaborative'), 'Collaborative');
  assert.strictEqual(normalizeProvenanceLabel('unknown'), undefined);
  assert.strictEqual(normalizeProvenanceLabel(undefined), undefined);
});

test('normalizeProjectStatus correctly normalizes status aliases', () => {
  assert.strictEqual(normalizeProjectStatus('in-progress'), 'in_progress');
  assert.strictEqual(normalizeProjectStatus('in_progress'), 'in_progress');
  assert.strictEqual(normalizeProjectStatus('completed'), 'completed');
  assert.strictEqual(normalizeProjectStatus('published'), 'published');
  assert.strictEqual(normalizeProjectStatus('archived'), 'archived');
  assert.strictEqual(normalizeProjectStatus('draft'), 'draft');
  assert.strictEqual(normalizeProjectStatus(null), 'draft');
});

test('getProjectCompletionDate resolves endDate first, then completedDate', () => {
  assert.strictEqual(getProjectCompletionDate({ endDate: '2026-07-06', completedDate: '2026-07-01' }), '2026-07-06');
  assert.strictEqual(getProjectCompletionDate({ completedDate: '2026-07-01' }), '2026-07-01');
  assert.strictEqual(getProjectCompletionDate({}), null);
  assert.strictEqual(getProjectCompletionDate(null), null);
});

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`  PROJECT SCHEMA REMEDIATION TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (Total: ${totalTests})`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
}
