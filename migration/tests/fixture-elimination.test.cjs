/**
 * fixture-elimination.test.cjs
 *
 * Verifies Task T3: Remove Fixture and Placeholder Content from the Public V2 Site.
 * 1. Exclusion of sample detail pages (/research/sample-report/, /writing/sample-article/, /collections/sample-series/, /topics/sample-*)
 * 2. Presence of 42 real Sanity documents (21 research, 21 writing) in production build
 * 3. Proper redirects and noindex meta tags for held/folded routes (/now/, /elsewhere/, /search/, /collections/)
 * 4. Elimination of fixture notices, placeholder labels, and development template strings across public pages
 * 5. Clean static paths contracts in dynamic route frontmatter
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'src');

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
console.log('  FIXTURE AND PLACEHOLDER ELIMINATION TEST SUITE');
console.log('================================================================\n');

// -------------------------------------------------------------
// Suite 1: Excluded Sample Routes in Build Output
// -------------------------------------------------------------
console.log('--- Suite 1: Excluded Sample Routes in Build Output ---');

test('dist/research/sample-report does not exist', () => {
  const p = path.join(DIST, 'research', 'sample-report', 'index.html');
  assert(!fs.existsSync(p), `Found unexpected built sample report: ${p}`);
});

test('dist/writing/sample-article does not exist', () => {
  const p = path.join(DIST, 'writing', 'sample-article', 'index.html');
  assert(!fs.existsSync(p), `Found unexpected built sample article: ${p}`);
});

test('dist/collections/sample-series does not exist', () => {
  const p = path.join(DIST, 'collections', 'sample-series', 'index.html');
  assert(!fs.existsSync(p), `Found unexpected built sample series: ${p}`);
});

test('No sample-topic pages exist under dist/topics/', () => {
  const topicsDir = path.join(DIST, 'topics');
  if (fs.existsSync(topicsDir)) {
    const entries = fs.readdirSync(topicsDir);
    const sampleTopics = entries.filter(e => e.startsWith('sample-'));
    assert.strictEqual(sampleTopics.length, 0, `Found sample topic directories: ${sampleTopics.join(', ')}`);
  }
});

// -------------------------------------------------------------
// Suite 2: Real Sanity Content Preservation
// -------------------------------------------------------------
console.log('\n--- Suite 2: Real Sanity Content Preservation ---');

test('All 21 Sanity research reports are built in dist/research/', () => {
  const researchDir = path.join(DIST, 'research');
  assert(fs.existsSync(researchDir), 'dist/research directory must exist');
  const items = fs.readdirSync(researchDir).filter(name => {
    return fs.statSync(path.join(researchDir, name)).isDirectory() && name !== 'sample-report';
  });
  assert.strictEqual(items.length, 21, `Expected 21 research report pages, found ${items.length}: ${items.join(', ')}`);
});

test('All 21 Sanity writing articles are built in dist/writing/', () => {
  const writingDir = path.join(DIST, 'writing');
  assert(fs.existsSync(writingDir), 'dist/writing directory must exist');
  const items = fs.readdirSync(writingDir).filter(name => {
    return fs.statSync(path.join(writingDir, name)).isDirectory() && name !== 'sample-article';
  });
  assert.strictEqual(items.length, 21, `Expected 21 writing article pages, found ${items.length}: ${items.join(', ')}`);
});

// -------------------------------------------------------------
// Suite 3: Held and Folded Route Redirects
// -------------------------------------------------------------
console.log('\n--- Suite 3: Held and Folded Route Redirects ---');

test('dist/now/index.html redirects to /404 and has noindex', () => {
  const file = path.join(DIST, 'now', 'index.html');
  assert(fs.existsSync(file), 'dist/now/index.html must exist');
  const html = fs.readFileSync(file, 'utf8');
  assert(html.includes('url=/404'), 'Must redirect to /404');
  assert(html.includes('content="noindex"'), 'Must have noindex robots tag');
});

test('dist/elsewhere/index.html redirects to /contact/ and has noindex', () => {
  const file = path.join(DIST, 'elsewhere', 'index.html');
  assert(fs.existsSync(file), 'dist/elsewhere/index.html must exist');
  const html = fs.readFileSync(file, 'utf8');
  assert(html.includes('url=/contact/'), 'Must redirect to /contact/');
  assert(html.includes('content="noindex"'), 'Must have noindex robots tag');
});

test('dist/search/index.html redirects to /404 and has noindex', () => {
  const file = path.join(DIST, 'search', 'index.html');
  assert(fs.existsSync(file), 'dist/search/index.html must exist');
  const html = fs.readFileSync(file, 'utf8');
  assert(html.includes('url=/404'), 'Must redirect to /404');
  assert(html.includes('content="noindex"'), 'Must have noindex robots tag');
});

test('dist/collections/index.html redirects to /404 and has noindex', () => {
  const file = path.join(DIST, 'collections', 'index.html');
  assert(fs.existsSync(file), 'dist/collections/index.html must exist');
  const html = fs.readFileSync(file, 'utf8');
  assert(html.includes('url=/404'), 'Must redirect to /404');
  assert(html.includes('content="noindex"'), 'Must have noindex robots tag');
});

// -------------------------------------------------------------
// Suite 4: Public Pages Clean of Fixture Tokens
// -------------------------------------------------------------
console.log('\n--- Suite 4: Public Pages Clean of Fixture Tokens ---');

test('About page contains no fixture notice or template markers', () => {
  const html = fs.readFileSync(path.join(DIST, 'about', 'index.html'), 'utf8');
  assert(!html.includes('Development fixture'), 'About page must not contain "Development fixture"');
  assert(!html.includes('Development template'), 'About page must not contain "Development template"');
  assert(!html.includes('fixtureNotice'), 'About page must not contain fixtureNotice identifier');
});

test('Contact page contains no development template markers', () => {
  const html = fs.readFileSync(path.join(DIST, 'contact', 'index.html'), 'utf8');
  assert(!html.includes('Development template'), 'Contact page must not contain "Development template"');
});

test('Topics index page contains honest empty state without fixture notices', () => {
  const html = fs.readFileSync(path.join(DIST, 'topics', 'index.html'), 'utf8');
  assert(!html.includes('Development fixture'), 'Topics page must not contain "Development fixture"');
  assert(!html.includes('Sample topic'), 'Topics page must not contain "Sample topic"');
  assert(html.includes('Topic taxonomy is currently being structured'), 'Topics page must have honest holding note');
});

test('Projects index page has no sample project cards', () => {
  const html = fs.readFileSync(path.join(DIST, 'projects', 'index.html'), 'utf8');
  assert(!html.includes('Sample project'), 'Projects page must not contain "Sample project"');
  assert(!html.includes('sample-project'), 'Projects page must not contain sample project slug');
  assert(html.includes('No projects are currently published'), 'Must have honest empty state');
});

test('Full dist directory scan for forbidden fixture strings (excluding design-exploration)', () => {
  const forbiddenStrings = [
    'Development fixture',
    'Development template',
    'sample-report',
    'sample-article',
    'sample-series',
    'sample-topic'
  ];

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Skip prototype exploration routes as per task spec
        if (fullPath.includes('design-exploration')) continue;
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const forbidden of forbiddenStrings) {
          assert(!content.includes(forbidden), `File ${path.relative(ROOT, fullPath)} contains forbidden string "${forbidden}"`);
        }
      }
    }
  }

  scanDir(DIST);
});

// -------------------------------------------------------------
// Suite 5: Source Contract Integrity
// -------------------------------------------------------------
console.log('\n--- Suite 5: Source Contract Integrity ---');

test('sanityClient.ts does not include sample fallback objects in getAllResearchReports/getAllWritingArticles', () => {
  const clientSrc = fs.readFileSync(path.join(SRC, 'lib', 'sanityClient.ts'), 'utf8');
  assert(!clientSrc.includes("'sample-report'"), 'sanityClient.ts must not mention sample-report');
  assert(!clientSrc.includes("'sample-article'"), 'sanityClient.ts must not mention sample-article');
});

test('Dynamic route templates do not inject sample slugs into getStaticPaths', () => {
  const researchSlugSrc = fs.readFileSync(path.join(SRC, 'pages', 'research', '[slug].astro'), 'utf8');
  assert(!researchSlugSrc.includes("'sample-report'"), 'research/[slug].astro must not inject sample-report');

  const writingSlugSrc = fs.readFileSync(path.join(SRC, 'pages', 'writing', '[slug].astro'), 'utf8');
  assert(!writingSlugSrc.includes("'sample-article'"), 'writing/[slug].astro must not inject sample-article');

  const collectionsSlugSrc = fs.readFileSync(path.join(SRC, 'pages', 'collections', '[slug].astro'), 'utf8');
  assert(collectionsSlugSrc.includes('return []'), 'collections/[slug].astro getStaticPaths must return []');

  const topicsSlugSrc = fs.readFileSync(path.join(SRC, 'pages', 'topics', '[slug].astro'), 'utf8');
  assert(topicsSlugSrc.includes('return []'), 'topics/[slug].astro getStaticPaths must return []');
});

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`  RESULTS: ${passedCount} passed, ${failedCount} failed`);
console.log('================================================================\n');

if (failedCount > 0) {
  process.exit(1);
}
