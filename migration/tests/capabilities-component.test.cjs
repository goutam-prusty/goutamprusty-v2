/**
 * Reusable Capabilities Component & Evidence Data Contract Test Suite (T9)
 * goutamprusty.com v2 Rebuild — Phase 1: T9 Reusable Capabilities Component
 *
 * Verifies:
 * 1. Component architecture and TypeScript contracts.
 * 2. Tier 1 "Used in projects": strictly requires valid label and real project evidence link.
 * 3. Tier 2 "Currently learning": requires owner-confirmed label; no project link required.
 * 4. Deduplication and URL normalization.
 * 5. Prohibition of skill meters, percentage bars, star ratings, and proficiency numbers.
 * 6. Empty-state integrity: complete omission when 0 verified capabilities exist.
 * 7. Accessibility: keyboard focus states, aria-labels, semantic hierarchy, touch targets.
 * 8. Production and homepage invariants: no unconfirmed candidate skills in production HTML.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const COMPONENT_PATH = path.join(ROOT, 'src', 'components', 'Capabilities.astro');
const LIB_TS_PATH = path.join(ROOT, 'src', 'lib', 'capabilities.ts');
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
} = require('../lib/capabilities.cjs');

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
console.log('  REUSABLE CAPABILITIES COMPONENT & DATA CONTRACT TEST SUITE (T9)');
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
});

test('Capabilities.astro imports and uses validation functions', () => {
  assert(compSource.includes('validateCapabilitiesData'), 'Must import validateCapabilitiesData');
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
      { name: 'typescript', project: 'proj-2' }, // duplicate
      { name: 'Node.js', project: 'proj-1' },
    ],
    currentlyLearning: [
      'Rust',
      'rust', // duplicate
      { name: 'RUST' }, // duplicate
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
  // Prohibit skill meter conventions
  assert(!compSource.includes('progress'), 'Must not have progress element');
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
  assert(compSource.includes('const renderable = hasValidCapabilities(validated)'), 'Must check hasValidCapabilities');
});

test('Does NOT output empty section or "coming soon" message when 0 capabilities exist', () => {
  assert(!compSource.includes('Coming soon'), 'Must not output coming soon');
  assert(!compSource.includes('No capabilities yet'), 'Must not output placeholder text');
});

// -------------------------------------------------------------
// Suite 7: Accessibility & Keyboard Navigation
// -------------------------------------------------------------
console.log('\n--- Suite 7: Accessibility & Keyboard Navigation ---');

test('Project links have accessible aria-labels with project attribution', () => {
  assert(compSource.includes('aria-label={`${cap.name} (demonstrated in ${cap.projectTitle})`}'), 'Must have descriptive aria-label');
  assert(compSource.includes('aria-hidden="true"'), 'Decorative arrow and project details must be marked aria-hidden');
});

test('CSS defines visible focus states and mobile touch targets', () => {
  assert(cssSource.includes('.ps-capability-tag--linked:focus-visible'), 'Must define focus-visible');
  assert(cssSource.includes('outline: 2px solid var(--color-ink)'), 'Must have high-contrast outline');
  assert(cssSource.includes('min-height: 2.65rem'), 'Must have accessible touch target on mobile');
});

test('Semantic heading hierarchy and list landmarks are preserved', () => {
  assert(compSource.includes('<h2 id={`${id}-title`}>{title}</h2>'), 'Section must have h2 title');
  assert(compSource.includes('<h3 class="ps-capabilities-subhead"'), 'Group subheads must be h3');
  assert(compSource.includes('<ul class="ps-capabilities-list" role="list">'), 'Must use semantic unordered list');
  assert(compSource.includes('<li class="ps-capabilities-item">'), 'Must use semantic list items');
});

// -------------------------------------------------------------
// Suite 8: Homepage & Production Invariants
// -------------------------------------------------------------
console.log('\n--- Suite 8: Homepage & Production Invariants ---');

const homeSrc = fs.readFileSync(HOME_SRC_PATH, 'utf8');
const homeHtml = fs.existsSync(HOME_HTML_PATH) ? fs.readFileSync(HOME_HTML_PATH, 'utf8') : '';

test('Homepage source cleanly omits Capabilities section when K3 data is unsupplied', () => {
  assert(!homeSrc.includes('id="capabilities"'), 'Homepage source must not render id="capabilities"');
  assert(!homeSrc.includes('Capabilities</h2>'), 'Homepage source must not render Capabilities</h2>');
});

test('dist/index.html contains no unverified capabilities, placeholder tags, or empty section', () => {
  if (homeHtml) {
    assert(!homeHtml.includes('id="capabilities"'), 'dist/index.html must not contain id="capabilities"');
    assert(!homeHtml.includes('Used in projects</h3>'), 'dist/index.html must not contain Used in projects');
    assert(!homeHtml.includes('Currently learning</h3>'), 'dist/index.html must not contain Currently learning');
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
