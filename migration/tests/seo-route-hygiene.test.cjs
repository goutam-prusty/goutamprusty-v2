/**
 * seo-route-hygiene.test.cjs
 *
 * Verifies SEO metadata, preview-host noindex headers, sitemap hygiene,
 * robots.txt, legacy redirects, and JSON-LD structured data in dist/.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DIST = path.join(ROOT, 'dist');

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
console.log('  SEO, ROUTE HYGIENE & PREVIEW INDEXING REGRESSION TEST SUITE');
console.log('================================================================\n');

test('dist/_headers blocks indexing on *.pages.dev preview hosts without blocking production', () => {
  const headersPath = path.join(DIST, '_headers');
  assert(fs.existsSync(headersPath), 'dist/_headers must exist');
  const content = fs.readFileSync(headersPath, 'utf8');
  assert(content.includes('https://goutamprusty-v2.pages.dev/*'), 'Must scope rule to pages.dev host');
  assert(content.includes('https://:version.goutamprusty-v2.pages.dev/*'), 'Must scope rule to branch/version pages.dev hosts');
  assert(content.includes('X-Robots-Tag: noindex, nofollow'), 'Must set X-Robots-Tag: noindex, nofollow');
  assert(!content.includes('https://goutamprusty.com/*'), 'Must not apply noindex to production apex host');
});

test('dist/robots.txt allows crawling, disallows prototype/404, and references production sitemap', () => {
  const robotsPath = path.join(DIST, 'robots.txt');
  assert(fs.existsSync(robotsPath), 'dist/robots.txt must exist');
  const content = fs.readFileSync(robotsPath, 'utf8');
  assert(content.includes('Allow: /'), 'Must allow /');
  assert(content.includes('Disallow: /design-exploration/'), 'Must disallow /design-exploration/');
  assert(content.includes('Disallow: /404'), 'Must disallow /404');
  assert(content.includes('Sitemap: https://goutamprusty.com/sitemap.xml'), 'Must point to production sitemap.xml');
});

test('dist/sitemap.xml contains only production apex indexable routes', () => {
  const sitemapPath = path.join(DIST, 'sitemap.xml');
  assert(fs.existsSync(sitemapPath), 'dist/sitemap.xml must exist');
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert(locs.length >= 48, `Expected at least 48 sitemap URLs, got ${locs.length}`);
  for (const url of locs) {
    assert(url.startsWith('https://goutamprusty.com/'), `Sitemap URL must use apex domain: ${url}`);
    assert(!url.includes('/design-exploration/'), `Sitemap must exclude design-exploration: ${url}`);
    assert(!url.includes('/404'), `Sitemap must exclude 404: ${url}`);
    assert(!url.includes('/topics/'), `Sitemap must exclude noindex /topics/: ${url}`);
    assert(!url.includes('/now/'), `Sitemap must exclude /now/: ${url}`);
    assert(!url.includes('/search/'), `Sitemap must exclude /search/: ${url}`);
    assert(!url.includes('/collections/'), `Sitemap must exclude /collections/: ${url}`);
    assert(!url.includes('/elsewhere'), `Sitemap must exclude /elsewhere: ${url}`);
    assert(!url.includes('/resume'), `Sitemap must exclude /resume: ${url}`);
  }
});

test('dist/_redirects preserves /elsewhere and legacy /blog/* 301 rules', () => {
  const redirectsPath = path.join(DIST, '_redirects');
  assert(fs.existsSync(redirectsPath), 'dist/_redirects must exist');
  const content = fs.readFileSync(redirectsPath, 'utf8');
  assert(content.includes('/elsewhere /contact/ 301'), 'Must preserve /elsewhere 301 redirect');
  assert(content.includes('/blog /writing/ 301'), 'Must preserve /blog 301 redirect');
  assert(content.includes('/blog/agentic-inflection-point /writing/agentic-inflection-point/ 301'), 'Must preserve legacy post 301 redirect');
});

test('Core indexable pages emit canonical, description, Open Graph, and no noindex', () => {
  const coreRoutes = [
    { file: path.join(DIST, 'index.html'), canonical: 'https://goutamprusty.com/' },
    { file: path.join(DIST, 'projects', 'index.html'), canonical: 'https://goutamprusty.com/projects/' },
    { file: path.join(DIST, 'research', 'index.html'), canonical: 'https://goutamprusty.com/research/' },
    { file: path.join(DIST, 'writing', 'index.html'), canonical: 'https://goutamprusty.com/writing/' },
    { file: path.join(DIST, 'about', 'index.html'), canonical: 'https://goutamprusty.com/about/' },
    { file: path.join(DIST, 'contact', 'index.html'), canonical: 'https://goutamprusty.com/contact/' },
  ];

  for (const route of coreRoutes) {
    assert(fs.existsSync(route.file), `Built file must exist: ${route.file}`);
    const html = fs.readFileSync(route.file, 'utf8');
    assert(html.includes(`<link rel="canonical" href="${route.canonical}"`), `Canonical mismatch on ${route.file}`);
    assert(html.includes('name="description"'), `Missing meta description on ${route.file}`);
    assert(html.includes('property="og:title"'), `Missing og:title on ${route.file}`);
    assert(html.includes('property="og:description"'), `Missing og:description on ${route.file}`);
    assert(html.includes(`property="og:url" content="${route.canonical}"`), `Missing/mismatched og:url on ${route.file}`);
    assert(!html.includes('noindex'), `Core page must not be noindex: ${route.file}`);
  }
});

test('Noindex routes (404, topics, design-exploration) omit canonical and include noindex', () => {
  const noindexFiles = [
    path.join(DIST, '404.html'),
    path.join(DIST, 'topics', 'index.html'),
    path.join(DIST, 'design-exploration', 'paper-signal', 'index.html'),
  ];
  for (const file of noindexFiles) {
    assert(fs.existsSync(file), `Built file must exist: ${file}`);
    const html = fs.readFileSync(file, 'utf8');
    assert(html.includes('noindex, nofollow'), `Expected noindex, nofollow on ${file}`);
    assert(!html.includes('rel="canonical"'), `Noindex page must not emit canonical: ${file}`);
  }
});

test('Detail pages with cover images include image in JSON-LD structured data', () => {
  const detailFiles = [
    path.join(DIST, 'research', 'strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026', 'index.html'),
    path.join(DIST, 'writing', 'why-compute-isnt-a-commodity-yet', 'index.html'),
  ];
  for (const file of detailFiles) {
    assert(fs.existsSync(file), `Detail file must exist: ${file}`);
    const html = fs.readFileSync(file, 'utf8');
    const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert(ldMatch, `JSON-LD script missing on ${file}`);
    const ld = JSON.parse(ldMatch[1]);
    assert(typeof ld.image === 'string' && ld.image.startsWith('https://goutamprusty.com/'), `JSON-LD image missing or not absolute on ${file}`);
  }
});

console.log(`\nSummary: ${passedCount} passed, ${failedCount} failed`);
if (failedCount > 0) {
  process.exit(1);
}
