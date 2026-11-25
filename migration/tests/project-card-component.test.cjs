/**
 * Reusable Project Card Component Verification Test Suite
 * goutamprusty.com v2 Rebuild — Phase 2: T8 Project Card Component
 *
 * Verifies:
 * 1. Component contract and TypeScript Props interface.
 * 2. Required fields and deterministic case-study link generation.
 * 3. Provenance label support strictly reconciling the 4 approved enum values:
 *    Independent, Built during training, Guided exercise, Collaborative.
 * 4. Delivery/publication status normalization and human-readable formatting.
 * 5. One-sentence problem statement rendering and safe omission.
 * 6. Technology stack tags rendering and safe omission.
 * 7. GitHub link and optional real demo link handling (omits dead links/fabricated URLs).
 * 8. Keyboard accessibility: no nested interactive elements, meaningful accessible names, visible focus.
 * 9. Paper & Signal design tokens: peach tint, thin #827D71 border, no shadows.
 * 10. Production route integration and preservation of honest empty state.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const V2_ROOT = path.resolve(__dirname, '../../');
const COMPONENT_PATH = path.join(V2_ROOT, 'src/components/ProjectCard.astro');
const CSS_PATH = path.join(V2_ROOT, 'src/styles/paper-signal.css');
const PROJECTS_INDEX_PATH = path.join(V2_ROOT, 'src/pages/projects/index.astro');
const HOME_INDEX_PATH = path.join(V2_ROOT, 'src/pages/index.astro');
const DIST_PROJECTS_HTML = path.join(V2_ROOT, 'dist/projects/index.html');
const DIST_INDEX_HTML = path.join(V2_ROOT, 'dist/index.html');

const {
  APPROVED_PROVENANCE_LABELS,
  normalizeProvenanceLabel,
  formatProjectStatus
} = require('../lib/project-compatibility.cjs');

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
console.log('  REUSABLE PROJECT CARD COMPONENT TEST SUITE (T8)');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// Suite 1: Component File & API Contract
// -----------------------------------------------------------------------------
console.log('--- Suite 1: Component File & API Contract ---');

test('ProjectCard.astro exists on disk at src/components/ProjectCard.astro', () => {
  assert(fs.existsSync(COMPONENT_PATH), 'Component file must exist at src/components/ProjectCard.astro');
});

const componentSource = fs.readFileSync(COMPONENT_PATH, 'utf8');

test('Component defines TypeScript Props and ProjectCardData interface', () => {
  assert(componentSource.includes('export interface Props'), 'Must export Props interface');
  assert(componentSource.includes('export interface ProjectCardData'), 'Must export ProjectCardData interface');
  assert(componentSource.includes('title: string'), 'title must be part of interface');
  assert(componentSource.includes('slug: string'), 'slug must be part of interface');
});

test('Component supports both single project document prop and direct props', () => {
  assert(componentSource.includes('project?: ProjectCardData'), 'Props must accept optional project object');
  assert(componentSource.includes('title?: string'), 'Props must accept direct title prop');
  assert(componentSource.includes('slug?: string'), 'Props must accept direct slug prop');
  assert(componentSource.includes('provenance?: string'), 'Props must accept direct provenance prop');
  assert(componentSource.includes('status?: string'), 'Props must accept direct status prop');
  assert(componentSource.includes('githubUrl?: string'), 'Props must accept direct githubUrl prop');
  assert(componentSource.includes('demoUrl?: string'), 'Props must accept direct demoUrl prop');
});

// -----------------------------------------------------------------------------
// Suite 2: Required Fields & Case-Study Routing
// -----------------------------------------------------------------------------
console.log('\n--- Suite 2: Required Fields & Case-Study Routing ---');

test('Component binds title inside heading', () => {
  assert(componentSource.includes('class="ps-card-title"'), 'Must have heading with .ps-card-title');
  assert(componentSource.includes('{title}'), 'Must bind {title}');
});

test('Component generates deterministic case-study URL: /projects/${slugString}/', () => {
  assert(componentSource.includes('`/projects/${slugString}/`'), 'Must format case-study URL with leading/trailing slash');
});

test('Case-study link is omitted when slug is absent (no dead link)', () => {
  assert(componentSource.includes('const caseStudyHref = slugString ? `/projects/${slugString}/` : undefined'),
    'Must resolve caseStudyHref to undefined if slugString is empty');
  assert(componentSource.includes('{caseStudyHref ? ('), 'Must conditionally render case study link');
});

// -----------------------------------------------------------------------------
// Suite 3: Provenance Label Model Support
// -----------------------------------------------------------------------------
console.log('\n--- Suite 3: Provenance Label Model Support ---');

test('Recognizes all 4 approved provenance labels from project model', () => {
  assert.deepStrictEqual(
    APPROVED_PROVENANCE_LABELS,
    ['Independent', 'Built during training', 'Guided exercise', 'Collaborative'],
    'Must strictly define the 4 approved provenance labels'
  );

  for (const label of APPROVED_PROVENANCE_LABELS) {
    const normalized = normalizeProvenanceLabel(label);
    assert.strictEqual(normalized, label, `Must accept exact label "${label}"`);
  }
});

test('Normalizes provenance aliases cleanly to approved labels', () => {
  assert.strictEqual(normalizeProvenanceLabel('independent'), 'Independent');
  assert.strictEqual(normalizeProvenanceLabel('built-during-training'), 'Built during training');
  assert.strictEqual(normalizeProvenanceLabel('guided-exercise'), 'Guided exercise');
  assert.strictEqual(normalizeProvenanceLabel('collaborative'), 'Collaborative');
});

test('Rejects and returns undefined for unrecognized provenance strings', () => {
  assert.strictEqual(normalizeProvenanceLabel('Commercial client project'), undefined);
  assert.strictEqual(normalizeProvenanceLabel('Self-taught'), undefined);
  assert.strictEqual(normalizeProvenanceLabel(''), undefined);
  assert.strictEqual(normalizeProvenanceLabel(null), undefined);
});

test('Component binds provenanceLabel to badge element', () => {
  assert(componentSource.includes('normalizeProvenanceLabel(rawProvenance)'), 'Must call normalizeProvenanceLabel');
  assert(componentSource.includes('ps-card-badge--provenance'), 'Must use provenance badge class');
  assert(componentSource.includes('{provenanceLabel}'), 'Must bind {provenanceLabel}');
});

// -----------------------------------------------------------------------------
// Suite 4: Status Normalization & Formatting
// -----------------------------------------------------------------------------
console.log('\n--- Suite 4: Status Normalization & Formatting ---');

test('formatProjectStatus correctly formats project status options', () => {
  assert.strictEqual(formatProjectStatus('completed'), 'Completed');
  assert.strictEqual(formatProjectStatus('published'), 'Published');
  assert.strictEqual(formatProjectStatus('in_progress'), 'In Progress');
  assert.strictEqual(formatProjectStatus('in-progress'), 'In Progress');
  assert.strictEqual(formatProjectStatus('archived'), 'Archived');
  assert.strictEqual(formatProjectStatus('draft'), 'Draft');
  assert.strictEqual(formatProjectStatus(undefined), undefined);
  assert.strictEqual(formatProjectStatus(''), undefined);
});

test('Component renders status badge when status is present', () => {
  assert(componentSource.includes('formatProjectStatus(rawStatus)'), 'Must call formatProjectStatus');
  assert(componentSource.includes('ps-card-badge--status'), 'Must use status badge class');
  assert(componentSource.includes('{statusLabel}'), 'Must bind {statusLabel}');
});

// -----------------------------------------------------------------------------
// Suite 5: One-Sentence Problem Statement & Optional Metric
// -----------------------------------------------------------------------------
console.log('\n--- Suite 5: One-Sentence Problem Statement & Optional Metric ---');

test('Component binds problem statement or summary to .ps-card-problem', () => {
  assert(componentSource.includes('class="ps-card-problem"'), 'Must have .ps-card-problem element');
  assert(componentSource.includes('{problemStatement}'), 'Must bind {problemStatement}');
});

test('Problem statement is omitted when absent or empty', () => {
  assert(componentSource.includes('{problemStatement && ('), 'Must guard problem statement rendering');
});

test('Optional metric line is rendered only when metricText is present', () => {
  assert(componentSource.includes('{metricText && ('), 'Must conditionally render metric');
  assert(componentSource.includes('class="ps-card-metric"'), 'Must define .ps-card-metric container');
});

// -----------------------------------------------------------------------------
// Suite 6: Technology Stack Tags
// -----------------------------------------------------------------------------
console.log('\n--- Suite 6: Technology Stack Tags ---');

test('Component renders technology stack tags in an accessible list', () => {
  assert(componentSource.includes('class="ps-card-stack"'), 'Must render .ps-card-stack');
  assert(componentSource.includes('class="ps-card-stack-tag"'), 'Must render .ps-card-stack-tag');
  assert(componentSource.includes('aria-label="Technologies used"'), 'Must have accessible label for tech stack');
});

test('Stack tags are omitted when array is empty or undefined', () => {
  assert(componentSource.includes('{stackTags.length > 0 && ('), 'Must guard stack rendering with length check');
});

// -----------------------------------------------------------------------------
// Suite 7: External Links (GitHub & Live Demo)
// -----------------------------------------------------------------------------
console.log('\n--- Suite 7: External Links (GitHub & Live Demo) ---');

test('GitHub link is rendered with secure attributes and meaningful label', () => {
  assert(componentSource.includes('{githubUrl && ('), 'Must conditionally render GitHub link');
  assert(componentSource.includes('class="ps-card-action ps-card-action--github"'), 'Must define GitHub action button class');
  assert(componentSource.includes('target="_blank"'), 'Must open in new tab');
  assert(componentSource.includes('rel="noopener noreferrer"'), 'Must include secure rel attributes');
  assert(componentSource.includes('aria-label={`GitHub repository for ${title}`}'), 'Must provide meaningful aria-label');
});

test('Live demo link is rendered only when URL is present', () => {
  assert(componentSource.includes('{demoUrl && ('), 'Must conditionally render demo link');
  assert(componentSource.includes('class="ps-card-action ps-card-action--demo"'), 'Must define demo action button class');
  assert(componentSource.includes('target="_blank"'), 'Must open in new tab');
  assert(componentSource.includes('rel="noopener noreferrer"'), 'Must include secure rel attributes');
  assert(componentSource.includes('aria-label={`Live demo for ${title}`}'), 'Must provide meaningful aria-label');
});

test('Case-study action link is rendered with meaningful label', () => {
  assert(componentSource.includes('{caseStudyHref && ('), 'Must conditionally render case study action');
  assert(componentSource.includes('class="ps-card-action ps-card-action--case-study"'), 'Must define primary case study CTA class');
  assert(componentSource.includes('aria-label={`View case study for ${title}`}'), 'Must have accessible label');
});

// -----------------------------------------------------------------------------
// Suite 8: Keyboard Accessibility & Non-Nested Markup
// -----------------------------------------------------------------------------
console.log('\n--- Suite 8: Keyboard Accessibility & Non-Nested Markup ---');

test('Card root container is semantic <article>, avoiding nested interactive elements', () => {
  assert(componentSource.includes('<article'), 'Card container must be semantic <article>');
  assert(!componentSource.match(/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<a\b/i), 'Must NEVER nest <a> inside another <a> element');
});

test('Decorative directional and external indicators carry aria-hidden="true"', () => {
  const hiddenMatches = componentSource.match(/aria-hidden="true"/g);
  assert(hiddenMatches && hiddenMatches.length >= 3, 'Must mark decorative symbols aria-hidden="true"');
});

test('Focus treatment classes and CSS styles exist for visible focus rings', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');
  assert(css.includes(':focus-visible'), 'CSS must define :focus-visible rules');
  assert(css.includes('var(--color-signal)'), 'Focus ring must use lime signal color token');
  assert(css.includes('var(--color-ink)'), 'Focus ring must include dark ink outline');
});

// -----------------------------------------------------------------------------
// Suite 9: Paper & Signal Design Tokens
// -----------------------------------------------------------------------------
console.log('\n--- Suite 9: Paper & Signal Design Tokens ---');

const css = fs.readFileSync(CSS_PATH, 'utf8');

test('Project card uses peach project tint token', () => {
  assert(css.includes('.ps-card-project'), 'CSS must define .ps-card-project');
  assert(css.includes('var(--color-project)'), 'Project card must use var(--color-project)');
});

test('Project card uses thin #827D71 border token', () => {
  assert(css.includes('border: 1px solid var(--color-line)'), 'Must use 1px solid var(--color-line)');
});

test('Project card has no elevation shadow', () => {
  assert(css.includes('box-shadow: none'), 'Must explicitly enforce no shadow on cards');
});

test('Parent project grid supports responsive 1-column below 52rem and 2-column from 52rem', () => {
  assert(css.includes('.ps-project-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr))'),
    'Must define 2-column desktop grid');
  assert(css.includes('@media (max-width: 52rem)'), 'Must have 52rem responsive breakpoint');
  assert(css.includes('.ps-project-grid--single') || css.includes('.ps-project-grid:has(> :only-child)'),
    'Must support full-width single project layout');
});

// -----------------------------------------------------------------------------
// Suite 10: Production Route Integration & Honest Empty State
// -----------------------------------------------------------------------------
console.log('\n--- Suite 10: Production Route Integration & Honest Empty State ---');

test('src/pages/projects/index.astro imports and integrates ProjectCard component', () => {
  const source = fs.readFileSync(PROJECTS_INDEX_PATH, 'utf8');
  assert(source.includes("import ProjectCard from '../../components/ProjectCard.astro'"),
    'Projects page must import ProjectCard');
  assert(source.includes('<ProjectCard project={project} index={idx} />'),
    'Projects page must map data to ProjectCard');
  assert(source.includes('projects.length === 0 ?'),
    'Projects page must retain honest empty state condition');
});

test('src/pages/index.astro imports and integrates ProjectCard component in featuredProjects branch', () => {
  const source = fs.readFileSync(HOME_INDEX_PATH, 'utf8');
  assert(source.includes("import ProjectCard from '../components/ProjectCard.astro'"),
    'Homepage must import ProjectCard');
  assert(source.includes('<ProjectCard project={project} index={idx} />'),
    'Homepage must map featured projects to ProjectCard');
  assert(source.includes('featuredProjects.length > 0 && ('),
    'Featured projects section must remain strictly conditional');
});

test('dist/projects/index.html renders published project cards or honest empty state without sample fixtures', () => {
  if (fs.existsSync(DIST_PROJECTS_HTML)) {
    const html = fs.readFileSync(DIST_PROJECTS_HTML, 'utf8');
    assert(!html.includes('Sample project'), 'Must not render sample project title');
    assert(!html.includes('sample-project'), 'Must not render sample project slug');
    const hasCard = html.includes('data-project-card');
    const hasEmptyState = html.includes('No projects are currently published');
    assert(hasCard !== hasEmptyState, 'Must render either project cards or honest empty state, never both or neither');
  }
});

test('dist/index.html omits featured projects section completely when zero projects exist', () => {
  if (fs.existsSync(DIST_INDEX_HTML)) {
    const html = fs.readFileSync(DIST_INDEX_HTML, 'utf8');
    assert(!html.includes('id="featured-projects"'), 'Homepage must omit featured projects section in HTML');
    assert(!html.includes('data-project-card'), 'Homepage must omit project cards in HTML');
  }
});

console.log('================================================================');
console.log(`  PROJECT CARD COMPONENT TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (Total: ${totalTests})`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
}
