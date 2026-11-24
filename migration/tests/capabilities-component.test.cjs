/**
 * Reusable Capabilities Component & Learning Roadmap Test Suite (T9 & T9 Follow-up)
 * goutamprusty.com v2 Rebuild — Phase 1: T9 Reusable Capabilities Component & Learning Roadmap
 *
 * Verifies:
 * 1. Component architecture and TypeScript contracts.
 * 2. Tier 1 "Used in projects": strictly requires valid label and real project evidence link.
 * 3. Tier 2 "Currently learning": requires owner-confirmed label; no project link required.
 * 4. Deduplication and URL normalization.
 * 5. Prohibition of skill meters, percentage bars, star ratings, and proficiency numbers.
 * 6. Empty-state integrity: complete omission when 0 verified capabilities exist.
 * 7. Accessibility: keyboard focus states, aria-labels, semantic hierarchy, touch targets.
 * 8. Recruiter-prioritized AI Engineering learning roadmap data contract and presentation.
 * 9. Homepage integration & production invariants: honest roadmap presentation with zero false claims.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const COMPONENT_PATH = path.join(ROOT, 'src', 'components', 'Capabilities.astro');
const LIB_TS_PATH = path.join(ROOT, 'src', 'lib', 'capabilities.ts');
const DATA_ROADMAP_PATH = path.join(ROOT, 'src', 'data', 'learningRoadmap.ts');
const CSS_PATH = path.join(ROOT, 'src', 'styles', 'paper-signal.css');
const HOME_SRC_PATH = path.join(ROOT, 'src', 'pages', 'index.astro');
const HOME_HTML_PATH = path.join(ROOT, 'dist', 'index.html');

const {
  formatProjectUrl,
  extractSlug,
  validateProjectCapability,
  validateLearningCapability,
  validateCapabilitiesData,
  hasValidCapabilities,
  validateLearningRoadmap,
  hasValidRoadmap,
} = require('../lib/capabilities.cjs');

const { learningRoadmap } = require('../lib/learning-roadmap.cjs');

let passedCount = 0;
let failedCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passedCount++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    failedCount++;
  }
}

console.log('================================================================');
console.log('  REUSABLE CAPABILITIES & LEARNING ROADMAP TEST SUITE (T9)');
console.log('================================================================\n');

// -------------------------------------------------------------
// Suite 1: Component File & Module Architecture
// -------------------------------------------------------------
console.log('--- Suite 1: Component Architecture & TypeScript Contract ---');

const compSource = fs.readFileSync(COMPONENT_PATH, 'utf8');
const libTsSource = fs.readFileSync(LIB_TS_PATH, 'utf8');

test('Capabilities.astro exists in src/components/', () => {
  assert(fs.existsSync(COMPONENT_PATH), 'Component must exist');
});

test('capabilities.ts exists in src/lib/ with typed contracts', () => {
  assert(fs.existsSync(LIB_TS_PATH), 'capabilities.ts must exist');
  assert(libTsSource.includes('export interface ValidatedProjectCapability'), 'Must export ValidatedProjectCapability');
  assert(libTsSource.includes('export interface ValidatedLearningCapability'), 'Must export ValidatedLearningCapability');
  assert(libTsSource.includes('export interface CapabilitiesInput'), 'Must export CapabilitiesInput');
  assert(libTsSource.includes('export interface LearningRoadmapData'), 'Must export LearningRoadmapData');
  assert(libTsSource.includes('export interface RoadmapSubgroup'), 'Must export RoadmapSubgroup');
});

test('Capabilities.astro imports and uses validation functions', () => {
  assert(compSource.includes('validateCapabilitiesData'), 'Must import validateCapabilitiesData');
  assert(compSource.includes('validateLearningRoadmap'), 'Must import validateLearningRoadmap');
  assert(compSource.includes('hasValidCapabilities'), 'Must import hasValidCapabilities');
  assert(compSource.includes('export interface Props'), 'Must define Props interface');
});

// -------------------------------------------------------------
// Suite 2: Tier 1 Data Contract — "Used in projects"
// -------------------------------------------------------------
console.log('\n--- Suite 2: Tier 1 Data Contract — "Used in projects" ---');

test('Valid capability with project slug string passes validation', () => {
  const result = validateProjectCapability({
    name: 'TypeScript',
    project: 'goutamprusty-v2',
  });
  assert(result !== null, 'Must validate');
  assert.strictEqual(result.name, 'TypeScript');
  assert.strictEqual(result.projectSlug, 'goutamprusty-v2');
  assert.strictEqual(result.projectUrl, '/projects/goutamprusty-v2/');
});

test('Valid capability with project object and title passes validation', () => {
  const result = validateProjectCapability({
    name: 'Sanity CMS',
    project: {
      slug: 'content-platform',
      title: 'Content Platform Case Study',
    },
  });
  assert(result !== null, 'Must validate');
  assert.strictEqual(result.name, 'Sanity CMS');
  assert.strictEqual(result.projectTitle, 'Content Platform Case Study');
  assert.strictEqual(result.projectUrl, '/projects/content-platform/');
});

test('Handles Sanity { current: string } slug objects', () => {
  assert.strictEqual(formatProjectUrl('my-proj'), '/projects/my-proj/');
  assert.strictEqual(extractSlug({ current: 'v2-rebuild' }), 'v2-rebuild');
  const result = validateProjectCapability({
    name: 'Astro',
    project: {
      slug: { current: 'v2-rebuild' },
      title: 'V2 Rebuild',
    },
  });
  assert(result !== null, 'Must validate');
  assert.strictEqual(result.projectSlug, 'v2-rebuild');
  assert.strictEqual(result.projectUrl, '/projects/v2-rebuild/');
});

test('Rejects capability with missing or empty name', () => {
  assert.strictEqual(validateProjectCapability({ project: 'some-slug' }), null);
  assert.strictEqual(validateProjectCapability({ name: '   ', project: 'some-slug' }), null);
});

test('Rejects capability with missing project evidence reference', () => {
  assert.strictEqual(validateProjectCapability({ name: 'Python' }), null);
  assert.strictEqual(validateProjectCapability({ name: 'Python', project: '' }), null);
  assert.strictEqual(validateProjectCapability({ name: 'Python', project: { slug: '' } }), null);
  assert.strictEqual(validateProjectCapability({ name: 'Python', project: '   ' }), null);
});

test('Enforces catalog matching when eligibleProjects catalog is supplied', () => {
  const catalog = [
    { slug: 'real-project-alpha', title: 'Real Project Alpha' },
    { slug: { current: 'real-project-beta' }, title: 'Real Project Beta' },
  ];

  // Matched project passes
  const valid = validateProjectCapability(
    { name: 'GraphQL', project: 'real-project-alpha' },
    catalog
  );
  assert(valid !== null, 'Should match catalog project');
  assert.strictEqual(valid.projectTitle, 'Real Project Alpha');

  // Unmatched project is rejected
  const invalid = validateProjectCapability(
    { name: 'GraphQL', project: 'fictional-unverified-project' },
    catalog
  );
  assert.strictEqual(invalid, null, 'Unmatched project must be rejected');
});

// -------------------------------------------------------------
// Suite 3: Tier 2 Data Contract — "Currently learning"
// -------------------------------------------------------------
console.log('\n--- Suite 3: Tier 2 Data Contract — "Currently learning" ---');

test('Valid string capability passes validation without requiring project link', () => {
  const result = validateLearningCapability('Distributed Systems');
  assert(result !== null, 'Must validate string input');
  assert.strictEqual(result.name, 'Distributed Systems');
});

test('Valid object capability passes validation with optional status', () => {
  const result = validateLearningCapability({
    name: 'Rust Systems Programming',
    status: 'In progress',
  });
  assert(result !== null, 'Must validate object input');
  assert.strictEqual(result.name, 'Rust Systems Programming');
  assert.strictEqual(result.status, 'In progress');
});

test('Rejects empty or whitespace-only learning capability', () => {
  assert.strictEqual(validateLearningCapability(''), null);
  assert.strictEqual(validateLearningCapability('   '), null);
  assert.strictEqual(validateLearningCapability({ name: '' }), null);
  assert.strictEqual(validateLearningCapability({ name: '   ' }), null);
  assert.strictEqual(validateLearningCapability(null), null);
});

// -------------------------------------------------------------
// Suite 4: Deduplication & Full Input Normalization
// -------------------------------------------------------------
console.log('\n--- Suite 4: Deduplication & Full Input Normalization ---');

test('Deduplicates entries case-insensitively within both tiers', () => {
  const input = {
    usedInProjects: [
      { name: 'TypeScript', project: 'proj-1' },
      { name: 'typescript', project: 'proj-2' },
      { name: 'Node.js', project: 'proj-1' },
    ],
    currentlyLearning: [
      'Rust',
      'rust',
      { name: 'RUST' },
      'Go',
    ],
  };

  const validated = validateCapabilitiesData(input);
  assert.strictEqual(validated.usedInProjects.length, 2, 'Should deduplicate TypeScript');
  assert.strictEqual(validated.usedInProjects[0].name, 'TypeScript');
  assert.strictEqual(validated.usedInProjects[1].name, 'Node.js');

  assert.strictEqual(validated.currentlyLearning.length, 2, 'Should deduplicate Rust');
  assert.strictEqual(validated.currentlyLearning[0].name, 'Rust');
  assert.strictEqual(validated.currentlyLearning[1].name, 'Go');
});

test('Gracefully ignores invalid items within arrays', () => {
  const input = {
    usedInProjects: [
      null,
      undefined,
      { name: '' },
      { name: 'No Project Reference' },
      { name: 'Valid Item', project: 'valid-slug' },
    ],
    currentlyLearning: [
      null,
      '',
      '   ',
      { name: '' },
      'Valid Learning Item',
    ],
  };

  const validated = validateCapabilitiesData(input);
  assert.strictEqual(validated.usedInProjects.length, 1);
  assert.strictEqual(validated.usedInProjects[0].name, 'Valid Item');
  assert.strictEqual(validated.currentlyLearning.length, 1);
  assert.strictEqual(validated.currentlyLearning[0].name, 'Valid Learning Item');
});

// -------------------------------------------------------------
// Suite 5: Design Standards & Prohibition of Skill Meters
// -------------------------------------------------------------
console.log('\n--- Suite 5: Design Standards & Prohibition of Skill Meters ---');

const cssSource = fs.readFileSync(CSS_PATH, 'utf8');

test('No progress bars, percentage bars, or star ratings in component or CSS', () => {
  assert(!compSource.includes('<progress'), 'Must not have <progress> element');
  assert(!compSource.includes('percentage'), 'Must not display percentages');
  assert(!compSource.includes('meter'), 'Must not have skill meters');
  assert(!compSource.includes('stars'), 'Must not have star ratings');
  assert(!compSource.includes('rating'), 'Must not have ratings');

  assert(!cssSource.includes('.ps-skill-bar'), 'No skill bar CSS');
  assert(!cssSource.includes('.ps-progress-bar'), 'No progress bar CSS');
  assert(!cssSource.includes('.ps-skill-meter'), 'No skill meter CSS');
});

test('Capabilities CSS defines responsive grid and Paper & Signal tokens', () => {
  assert(cssSource.includes('.ps-capabilities-grid'), 'Must define .ps-capabilities-grid');
  assert(cssSource.includes('.ps-capability-tag'), 'Must define .ps-capability-tag');
  assert(cssSource.includes('.ps-capability-tag--linked'), 'Must define .ps-capability-tag--linked');
  assert(cssSource.includes('.ps-capability-tag--learning'), 'Must define .ps-capability-tag--learning');
  assert(cssSource.includes('overflow-wrap: break-word'), 'Must wrap words to prevent overflow');
});

// -------------------------------------------------------------
// Suite 6: Empty State & Zero-Capability Integrity
// -------------------------------------------------------------
console.log('\n--- Suite 6: Empty State & Zero-Capability Integrity ---');

test('hasValidCapabilities returns false for empty or null input', () => {
  assert.strictEqual(hasValidCapabilities(null), false);
  assert.strictEqual(hasValidCapabilities({ usedInProjects: [], currentlyLearning: [] }), false);
  assert.strictEqual(hasValidCapabilities(validateCapabilitiesData({})), false);
});

test('Component strictly gates rendering on renderable flag', () => {
  assert(compSource.includes('{renderable && ('), 'Must conditionally render on renderable flag');
  assert(compSource.includes('const renderable = isRoadmapMode || hasCaps'), 'Must check renderable condition');
});

test('Does NOT output empty section or "coming soon" message when 0 capabilities exist', () => {
  assert(!compSource.includes('Coming soon'), 'Must not output coming soon');
  assert(!compSource.includes('No capabilities yet'), 'Must not output placeholder text');
});

// -------------------------------------------------------------
// Suite 7: Accessibility & Keyboard Navigation
// -------------------------------------------------------------
console.log('\n--- Suite 7: Accessibility & Keyboard Navigation ---');

test('Project links have accessible aria-labels with project attribution in project mode', () => {
  assert(compSource.includes('aria-label={`${cap.name} (demonstrated in ${cap.projectTitle})`}'), 'Must have descriptive aria-label');
  assert(compSource.includes('aria-hidden="true"'), 'Decorative arrow and project details must be marked aria-hidden');
});

test('CSS defines visible focus states and mobile touch targets', () => {
  assert(cssSource.includes('.ps-capability-tag--linked:focus-visible'), 'Must define focus-visible');
  assert(cssSource.includes('outline: 2px solid var(--color-ink)'), 'Must have high-contrast outline');
  assert(cssSource.includes('min-height: 2.65rem'), 'Must have accessible touch target on mobile');
});

test('Semantic heading hierarchy and list landmarks are preserved', () => {
  assert(compSource.includes('<h2 id={`${sectionId}-title`}>{sectionTitle}</h2>'), 'Section must have h2 title');
  assert(compSource.includes('role="list"'), 'Must use semantic list landmarks');
  assert(compSource.includes('<li class="ps-roadmap-item">'), 'Must use semantic roadmap list items');
});

// -------------------------------------------------------------
// Suite 8: Recruiter-Prioritized AI Engineering Learning Roadmap (T9 Follow-up)
// -------------------------------------------------------------
console.log('\n--- Suite 8: Recruiter-Prioritized Learning Roadmap Contract & Content ---');

test('learningRoadmap data file exists and exports valid structured roadmap', () => {
  assert(fs.existsSync(DATA_ROADMAP_PATH), 'learningRoadmap.ts must exist');
  assert(hasValidRoadmap(learningRoadmap), 'Roadmap must be valid');
});

test('Validates exact 16 core AI engineering learning priorities', () => {
  const expectedCore = [
    'Python',
    'SQL',
    'Machine Learning Fundamentals',
    'Data Preprocessing',
    'Model Training and Evaluation',
    'LLM APIs',
    'Prompt Engineering',
    'Embeddings',
    'Retrieval-Augmented Generation (RAG)',
    'Vector Databases',
    'FastAPI',
    'REST APIs',
    'Git and GitHub',
    'AI/LLM Evaluation',
    'Docker',
    'Cloud Deployment',
  ];

  assert.strictEqual(learningRoadmap.corePriorities.length, 16, 'Must contain exactly 16 core priorities');
  for (const item of expectedCore) {
    assert(learningRoadmap.corePriorities.includes(item), `Core priorities must include ${item}`);
  }
});

test('Validates supporting foundations organized into 5 concise domain subgroups', () => {
  assert.strictEqual(learningRoadmap.supportingSubgroups.length, 5, 'Must contain exactly 5 subgroups');

  const expectedSubgroups = {
    'Programming and data': [
      'Object-Oriented Programming',
      'Data Structures and Algorithms',
      'NumPy',
      'Pandas',
      'Linux',
      'Debugging',
      'Software Testing',
      'PostgreSQL',
    ],
    'Machine learning and NLP': [
      'Scikit-learn',
      'Supervised Learning',
      'Unsupervised Learning',
      'Neural Networks',
      'PyTorch',
      'TensorFlow',
      'Natural Language Processing',
      'Transformers',
      'Hugging Face',
    ],
    'Generative AI and application development': [
      'Large Language Models',
      'Structured Outputs',
      'Function Calling',
      'Tokenization',
      'Fine-tuning',
      'LangChain',
      'LangGraph',
      'LlamaIndex',
    ],
    'RAG and agentic systems': [
      'Semantic Search',
      'Hybrid Search',
      'Reranking',
      'AI Agents',
      'Tool Calling',
      'Agent Workflows',
      'Model Context Protocol (MCP)',
    ],
    'Deployment and production engineering': [
      'AWS / Azure / Google Cloud',
      'CI/CD',
      'Model Monitoring',
      'LLM Observability',
      'Model Deployment',
      'LoRA / QLoRA',
      'Kubernetes',
    ],
  };

  for (const [title, items] of Object.entries(expectedSubgroups)) {
    const found = learningRoadmap.supportingSubgroups.find((sg) => sg.title === title);
    assert(found, `Subgroup "${title}" must exist`);
    assert.strictEqual(found.items.length, items.length, `Subgroup "${title}" item count mismatch`);
    for (const item of items) {
      assert(found.items.includes(item), `Subgroup "${title}" must include ${item}`);
    }
  }
});

test('Roadmap validation normalizes and rejects invalid roadmap inputs', () => {
  assert.strictEqual(validateLearningRoadmap(null), null);
  assert.strictEqual(validateLearningRoadmap({}), null);
  assert.strictEqual(validateLearningRoadmap({ corePriorities: [] }), null);

  const validated = validateLearningRoadmap({
    corePriorities: ['  Python  ', '', 'SQL'],
    supportingSubgroups: [
      { title: 'Data', items: ['Pandas', ''] },
      { title: '', items: [] },
    ],
  });
  assert(validated !== null);
  assert.strictEqual(validated.corePriorities.length, 2);
  assert.strictEqual(validated.corePriorities[0], 'Python');
  assert.strictEqual(validated.corePriorities[1], 'SQL');
  assert.strictEqual(validated.supportingSubgroups.length, 1);
  assert.strictEqual(validated.supportingSubgroups[0].items.length, 1);
});

test('Roadmap presentation defines prominent visual hierarchy for core priorities', () => {
  assert(cssSource.includes('.ps-roadmap-tier-badge'), 'CSS must define High Priority badge');
  assert(cssSource.includes('.ps-roadmap-tag--core'), 'CSS must define .ps-roadmap-tag--core');
  assert(cssSource.includes('.ps-roadmap-tag--supporting'), 'CSS must define .ps-roadmap-tag--supporting');
  assert(cssSource.includes('.ps-roadmap-subgroups-grid'), 'CSS must define responsive subgroups grid');
  assert(compSource.includes('class="ps-roadmap-tag ps-roadmap-tag--core"'), 'Component must render core tags');
  assert(compSource.includes('class="ps-roadmap-tag ps-roadmap-tag--supporting"'), 'Component must render supporting tags');
});

test('Prohibits misleading claims and false representations in roadmap text', () => {
  const allRoadmapText = [
    learningRoadmap.title,
    learningRoadmap.description,
    learningRoadmap.corePrioritiesTitle,
    learningRoadmap.corePrioritiesDescription,
    learningRoadmap.supportingTitle,
    learningRoadmap.supportingDescription,
    ...learningRoadmap.corePriorities,
    ...learningRoadmap.supportingSubgroups.flatMap((sg) => [sg.title, ...sg.items]),
  ].join(' ');

  // Must not claim expertise, production-readiness, or mastery
  assert(!allRoadmapText.includes('expert'), 'Must not claim expert');
  assert(!allRoadmapText.includes('proficient'), 'Must not claim proficient');
  assert(!allRoadmapText.includes('mastered'), 'Must not claim mastered');
  assert(!allRoadmapText.includes('production-ready'), 'Must not claim production-ready');
  assert(!allRoadmapText.includes('years of experience'), 'Must not claim years of experience');
  // Must be framed honestly as planned learning areas
  assert(learningRoadmap.description.includes('planned'), 'Must explicitly state planned learning');
  assert(learningRoadmap.description.includes('rather than claimed project credentials'), 'Must disclaim claimed credentials');
});

// -------------------------------------------------------------
// Suite 9: Homepage Integration & Production HTML Invariants
// -------------------------------------------------------------
console.log('\n--- Suite 9: Homepage Integration & Production Invariants ---');

const homeSrc = fs.readFileSync(HOME_SRC_PATH, 'utf8');

test('Homepage source imports and integrates Capabilities with learningRoadmap', () => {
  assert(homeSrc.includes("import Capabilities from '../components/Capabilities.astro'"), 'Must import Capabilities component');
  assert(homeSrc.includes("import { learningRoadmap } from '../data/learningRoadmap'"), 'Must import learningRoadmap data');
  assert(homeSrc.includes('<Capabilities roadmap={learningRoadmap} id="learning-roadmap" />'), 'Must render Capabilities with roadmap prop');
});

test('Homepage source cleanly avoids id="capabilities" and Capabilities</h2>', () => {
  assert(!homeSrc.includes('id="capabilities"'), 'Homepage source must not render id="capabilities"');
  assert(!homeSrc.includes('Capabilities</h2>'), 'Homepage source must not render Capabilities</h2>');
});

test('Zero project links or "Used in projects" claims in roadmap markup', () => {
  // In roadmap mode, no project links are rendered
  const roadmapSlice = compSource.slice(compSource.indexOf('isRoadmapMode && validatedRoadmap'));
  const roadmapModeOnly = roadmapSlice.slice(0, roadmapSlice.indexOf('!isRoadmapMode && hasCaps'));
  assert(!roadmapModeOnly.includes('Used in projects'), 'Roadmap mode must not include Used in projects');
  assert(!roadmapModeOnly.includes('href={cap.projectUrl}'), 'Roadmap mode must not render project links');
});

test('dist/index.html verification when built HTML exists', () => {
  if (fs.existsSync(HOME_HTML_PATH)) {
    const html = fs.readFileSync(HOME_HTML_PATH, 'utf8');
    assert(!html.includes('id="capabilities"'), 'dist/index.html must not contain id="capabilities"');
    assert(!html.includes('Capabilities</h2>'), 'dist/index.html must not contain Capabilities</h2>');
  }
});

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`  CAPABILITIES TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED (Total: ${passedCount + failedCount})`);
console.log('================================================================');

if (failedCount > 0) {
  process.exit(1);
}
