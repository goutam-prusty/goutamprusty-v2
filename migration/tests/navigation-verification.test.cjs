/**
 * navigation-verification.test.cjs
 *
 * Verifies V2 primary navigation implementation:
 * - Desktop nav order: Projects, Research, Writing, About, (Resume omitted), Contact CTA
 * - Mobile nav order: Projects, Research, Writing, About, (Resume omitted), Contact CTA
 * - Topics absent from primary navigation; Topics route preserved and working
 * - Resume link omitted (verified no real PDF exists)
 * - Wordmark serves as Home link (no separate Home nav item)
 * - Native <details>/<summary> mobile disclosure preserved
 * - Touch-target requirements satisfied (min-height 2.75rem / 44px)
 * - aria-current="page" accurate across routes (home, projects, research, writing, about, contact)
 * - Contact CTA wording ("Get in touch ↗") and destination ("/contact/") preserved
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LAYOUT_PATH = path.join(ROOT, 'src', 'layouts', 'ProductionPaperSignalLayout.astro');
const CSS_PATH = path.join(ROOT, 'src', 'styles', 'paper-signal.css');

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
console.log('  NAVIGATION REWORK & ACCESSIBILITY VERIFICATION TEST SUITE');
console.log('================================================================\n');

// -------------------------------------------------------------
// Suite 1: Source Implementation & Contract
// -------------------------------------------------------------
console.log('--- Suite 1: Navigation Source & IA Contract ---');

const layoutSource = fs.readFileSync(LAYOUT_PATH, 'utf8');

test('Primary nav array defines exact approved order: Projects, Research, Writing, About', () => {
  const navMatch = layoutSource.match(/const\s+nav\s*=\s*\[([\s\S]*?)\];/);
  assert(navMatch, 'nav array must be defined in layout');
  const items = [...navMatch[1].matchAll(/label:\s*'([^']+)',\s*href:\s*'([^']+)'/g)].map(m => ({
    label: m[1],
    href: m[2]
  }));

  assert.strictEqual(items.length, 4, 'nav array must contain exactly 4 items (Resume omitted)');
  assert.strictEqual(items[0].label, 'Projects');
  assert.strictEqual(items[0].href, '/projects/');
  assert.strictEqual(items[1].label, 'Research');
  assert.strictEqual(items[1].href, '/research/');
  assert.strictEqual(items[2].label, 'Writing');
  assert.strictEqual(items[2].href, '/writing/');
  assert.strictEqual(items[3].label, 'About');
  assert.strictEqual(items[3].href, '/about/');
});

test('Topics is absent from primary navigation array', () => {
  assert(!layoutSource.includes("{ label: 'Topics'"), 'Topics must not be in primary nav');
});

test('Wordmark serves as Home link and no separate Home navigation item exists', () => {
  assert(layoutSource.includes('class="ps-wordmark" href="/"'), 'Wordmark must link to /');
  assert(!layoutSource.includes("{ label: 'Home'"), 'No separate Home item in nav array');
  assert(!layoutSource.includes('>Home</a>'), 'No separate Home text link in mobile nav list');
});

test('Resume PDF verification: no PDF exists, resume link is omitted', () => {
  // Check public directory for any resume PDF
  const publicDir = path.join(ROOT, 'public');
  function findPdfs(dir) {
    if (!fs.existsSync(dir)) return [];
    let pdfs = [];
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, f.name);
      if (f.isDirectory()) pdfs.push(...findPdfs(full));
      else if (f.name.toLowerCase().endsWith('.pdf')) pdfs.push(full);
    }
    return pdfs;
  }
  const pdfs = findPdfs(publicDir);
  assert.strictEqual(pdfs.length, 0, 'No resume PDF must exist in public/');
  assert(!layoutSource.includes("{ label: 'Resume'"), 'Resume link must be omitted from nav array');
  assert(!layoutSource.includes('Resume'), 'Resume must not be present in layout source');
});

test('Contact CTA wording ("Get in touch ↗") and destination ("/contact/") are preserved', () => {
  assert(layoutSource.includes('href="/contact/"'), 'Contact link must point to /contact/');
  assert(layoutSource.includes('Get in touch <span aria-hidden="true">↗</span>'), 'Contact CTA wording must be preserved');
  assert(layoutSource.includes('class="ps-contact-link"'), 'Contact CTA styling class preserved');
});

test('Mobile navigation disclosure uses native <details>/<summary> structure', () => {
  assert(layoutSource.includes('<details class="ps-nav-menu ps-mobile-nav">'), 'Must use native <details>');
  assert(layoutSource.includes('<summary><span>Menu</span><span class="ps-menu-icon" aria-hidden="true">☰</span></summary>'), 'Must use native <summary>');
});

test('Mobile menu contains Contact CTA inside <nav aria-label="Mobile navigation">', () => {
  const mobileNavMatch = layoutSource.match(/<nav aria-label="Mobile navigation">([\s\S]*?)<\/nav>/);
  assert(mobileNavMatch, 'Mobile nav element must exist');
  const mobileNavContent = mobileNavMatch[1];
  assert(mobileNavContent.includes('href="/contact/"'), 'Contact link must be inside mobile nav');
  assert(mobileNavContent.includes('Get in touch <span aria-hidden="true">↗</span>'), 'Contact wording in mobile nav');
});

// -------------------------------------------------------------
// Suite 2: Built HTML Artifacts & aria-current Verification
// -------------------------------------------------------------
console.log('\n--- Suite 2: Built HTML Artifacts & Route States ---');

function parseHeaderLinks(html) {
  const headerMatch = html.match(/<header class="ps-header">([\s\S]*?)<\/header>/);
  assert(headerMatch, 'Header must exist in built HTML');
  const headerHtml = headerMatch[1];

  const desktopMatch = headerHtml.match(/<nav class="ps-desktop-nav"[^>]*>([\s\S]*?)<\/nav>/);
  const mobileMatch = headerHtml.match(/<nav aria-label="Mobile navigation"[^>]*>([\s\S]*?)<\/nav>/);
  assert(desktopMatch, 'Desktop nav must exist');
  assert(mobileMatch, 'Mobile nav must exist');

  function extractLinks(navHtml) {
    const linkMatches = [...navHtml.matchAll(/<a\s+([^>]*?)>([\s\S]*?)<\/a>/g)];
    return linkMatches.map(m => {
      const attrs = m[1];
      const text = m[2].replace(/<[^>]+>/g, '').trim();
      const href = (attrs.match(/href="([^"]+)"/) || [])[1];
      const ariaCurrent = (attrs.match(/aria-current="([^"]+)"/) || [])[1] || null;
      return { text, href, ariaCurrent };
    });
  }

  return {
    desktopLinks: extractLinks(desktopMatch[1]),
    mobileLinks: extractLinks(mobileMatch[1]),
    headerHtml
  };
}

test('dist/index.html: Correct link order, no active link for sub-pages, wordmark links to home', () => {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const { desktopLinks, mobileLinks, headerHtml } = parseHeaderLinks(html);

  assert(headerHtml.includes('class="ps-wordmark" href="/"'), 'Wordmark links to /');

  // Desktop links: Projects, Research, Writing, About
  assert.deepStrictEqual(desktopLinks.map(l => l.text), ['Projects', 'Research', 'Writing', 'About']);
  assert.deepStrictEqual(desktopLinks.map(l => l.href), ['/projects/', '/research/', '/writing/', '/about/']);
  assert(desktopLinks.every(l => l.ariaCurrent === null), 'No desktop link active on home');

  // Mobile links: Projects, Research, Writing, About, Get in touch ↗
  assert.deepStrictEqual(mobileLinks.map(l => l.text), ['Projects', 'Research', 'Writing', 'About', 'Get in touch ↗']);
  assert.deepStrictEqual(mobileLinks.map(l => l.href), ['/projects/', '/research/', '/writing/', '/about/', '/contact/']);
  assert(mobileLinks.every(l => l.ariaCurrent === null), 'No mobile link active on home');
});

test('dist/projects/index.html: Projects link has aria-current="page"', () => {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'projects', 'index.html'), 'utf8');
  const { desktopLinks, mobileLinks } = parseHeaderLinks(html);

  const activeDesktop = desktopLinks.filter(l => l.ariaCurrent === 'page');
  assert.strictEqual(activeDesktop.length, 1);
  assert.strictEqual(activeDesktop[0].href, '/projects/');

  const activeMobile = mobileLinks.filter(l => l.ariaCurrent === 'page');
  assert.strictEqual(activeMobile.length, 1);
  assert.strictEqual(activeMobile[0].href, '/projects/');
});

test('dist/research/index.html: Research link has aria-current="page"', () => {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'research', 'index.html'), 'utf8');
  const { desktopLinks, mobileLinks } = parseHeaderLinks(html);

  const activeDesktop = desktopLinks.filter(l => l.ariaCurrent === 'page');
  assert.strictEqual(activeDesktop.length, 1);
  assert.strictEqual(activeDesktop[0].href, '/research/');

  const activeMobile = mobileLinks.filter(l => l.ariaCurrent === 'page');
  assert.strictEqual(activeMobile.length, 1);
  assert.strictEqual(activeMobile[0].href, '/research/');
});

test('dist/writing/index.html: Writing link has aria-current="page"', () => {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'writing', 'index.html'), 'utf8');
  const { desktopLinks, mobileLinks } = parseHeaderLinks(html);

  const activeDesktop = desktopLinks.filter(l => l.ariaCurrent === 'page');
  assert.strictEqual(activeDesktop.length, 1);
  assert.strictEqual(activeDesktop[0].href, '/writing/');

  const activeMobile = mobileLinks.filter(l => l.ariaCurrent === 'page');
  assert.strictEqual(activeMobile.length, 1);
  assert.strictEqual(activeMobile[0].href, '/writing/');
});

test('dist/about/index.html: About link has aria-current="page"', () => {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'about', 'index.html'), 'utf8');
  const { desktopLinks, mobileLinks } = parseHeaderLinks(html);

  const activeDesktop = desktopLinks.filter(l => l.ariaCurrent === 'page');
  assert.strictEqual(activeDesktop.length, 1);
  assert.strictEqual(activeDesktop[0].href, '/about/');

  const activeMobile = mobileLinks.filter(l => l.ariaCurrent === 'page');
  assert.strictEqual(activeMobile.length, 1);
  assert.strictEqual(activeMobile[0].href, '/about/');
});

test('dist/contact/index.html: Contact link has aria-current="page"', () => {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'contact', 'index.html'), 'utf8');
  const { desktopLinks, mobileLinks, headerHtml } = parseHeaderLinks(html);

  // Desktop nav items should not be active
  assert(desktopLinks.every(l => l.ariaCurrent === null));

  // Desktop contact button should have aria-current="page"
  const contactBtnMatch = headerHtml.match(/<a[^>]*class="ps-contact-link"[^>]*>/);
  assert(contactBtnMatch, 'Contact button exists in header');
  assert(contactBtnMatch[0].includes('aria-current="page"'), 'Desktop contact button has aria-current="page"');

  // Mobile contact link inside <nav> has aria-current="page"
  const activeMobile = mobileLinks.filter(l => l.ariaCurrent === 'page');
  assert.strictEqual(activeMobile.length, 1);
  assert.strictEqual(activeMobile[0].href, '/contact/');
});

test('dist/topics/index.html: Topics page builds cleanly and is absent from primary nav', () => {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'topics', 'index.html'), 'utf8');
  const { desktopLinks, mobileLinks } = parseHeaderLinks(html);

  assert(!desktopLinks.some(l => l.text === 'Topics' || l.href.includes('/topics/')));
  assert(!mobileLinks.some(l => l.text === 'Topics' || l.href.includes('/topics/')));
  assert(html.includes('<title>Topics'), 'Topics page content remains intact');
});

// -------------------------------------------------------------
// Suite 3: Touch Targets & Accessibility CSS
// -------------------------------------------------------------
console.log('\n--- Suite 3: Touch Usability & Accessibility CSS ---');

const cssSource = fs.readFileSync(CSS_PATH, 'utf8');

test('Mobile nav links satisfy minimum touch-target requirement (min-height: 2.75rem / 44px)', () => {
  assert(cssSource.includes('.ps-nav-menu nav a { display: flex; min-height: 2.75rem;'), 'Mobile nav links must have min-height 2.75rem');
});

test('Focus-visible styles exist with high contrast outline and offset', () => {
  assert(cssSource.includes('.ps :focus-visible { outline: 3px solid var(--color-ink); outline-offset: 4px;'), 'Focus-visible must be defined');
});

test('aria-current styling defined for both desktop and mobile menu links', () => {
  assert(cssSource.includes('.ps-header nav a[aria-current="page"]'), 'Desktop aria-current style defined');
  assert(cssSource.includes('.ps-nav-menu nav a[aria-current="page"]'), 'Mobile aria-current style defined');
});

console.log('\n================================================================');
console.log(`  NAVIGATION TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED (Total: ${passedCount + failedCount})`);
console.log('================================================================\n');

if (failedCount > 0) {
  process.exit(1);
}
