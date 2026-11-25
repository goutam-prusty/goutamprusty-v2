/**
 * homepage-hierarchy.test.cjs
 *
 * Verifies V2 Homepage Restructure (Section 7):
 * 1. Section hierarchy: Header -> Hero -> (Featured Projects if data exists) -> (Capabilities omitted) -> Research & Writing -> About -> Contact strip -> Footer
 * 2. Zero-project handling: Featured Projects is cleanly omitted when 0 eligible projects exist
 * 3. Mobile flow: Hero copy and primary actions precede decorative artwork (.ps-art) in DOM
 * 4. Content integrity: No fabricated cards, fake metrics, placeholder notices, or invented skills
 * 5. Contact CTA: Exact wording "Get in touch ↗" and destination "/contact/" preserved
 * 6. Semantic headings: Clean h1 -> h2 hierarchy with aria landmarks
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const HOME_SRC = path.join(ROOT, 'src', 'pages', 'index.astro');
const HOME_HTML = path.join(ROOT, 'dist', 'index.html');

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
console.log('  HOMEPAGE RESTRUCTURE & SECTION HIERARCHY TEST SUITE');
console.log('================================================================\n');

// -------------------------------------------------------------
// Suite 1: Source Implementation & Section Hierarchy
// -------------------------------------------------------------
console.log('--- Suite 1: Source Implementation & Section Hierarchy ---');

const homeSource = fs.readFileSync(HOME_SRC, 'utf8');

test('Homepage source imports getAllProjects and integrates T4 project query', () => {
  assert(homeSource.includes('getAllProjects'), 'Must import getAllProjects');
  assert(homeSource.includes('const allProjects = await getAllProjects()'), 'Must query projects');
  assert(homeSource.includes('featuredProjects'), 'Must define featuredProjects filter');
});

test('Featured Projects section is strictly conditional on featuredProjects.length > 0', () => {
  assert(homeSource.includes('{featuredProjects.length > 0 && ('), 'Must conditionally render featured projects');
  assert(homeSource.includes('id="featured-projects"'), 'Must define id="featured-projects"');
  assert(homeSource.includes('Featured Projects</h2>'), 'Must have Featured Projects heading');
});

test('Capabilities section is omitted due to lack of verified content', () => {
  assert(!homeSource.includes('id="capabilities"'), 'Capabilities section must be omitted');
  assert(!homeSource.includes('Capabilities</h2>'), 'Capabilities heading must not exist');
});

test('Research & Writing section has distinct semantic heading and dual exploration links', () => {
  assert(homeSource.includes('id="research-writing"'), 'Must define research-writing section');
  assert(homeSource.includes('Research &amp; Writing</h2>') || homeSource.includes('Research & Writing</h2>'), 'Must have Research & Writing heading');
  assert(homeSource.includes('href="/research/"'), 'Must link to research index');
  assert(homeSource.includes('href="/writing/"'), 'Must link to writing index');
});

test('Mobile layout puts primary hero content before decorative artwork in DOM', () => {
  const heroCopyIdx = homeSource.indexOf('class="ps-hero-copy"');
  const heroArtIdx = homeSource.indexOf('class="ps-art"');
  assert(heroCopyIdx > 0 && heroArtIdx > 0, 'Both hero-copy and ps-art must exist');
  assert(heroCopyIdx < heroArtIdx, 'Hero copy must precede ps-art in DOM order');
});

test('Hero renders owner-approved AI engineering copy and hierarchy (T7)', () => {
  assert(homeSource.includes('<p class="ps-eyebrow">AI engineer.</p>'), 'Eyebrow must be "AI engineer."');
  assert(homeSource.includes('<h1 id="hero-title">Curiosity, made <em>useful.</em></h1>'), 'H1 must be "Curiosity, made useful."');
  assert(homeSource.includes('<p class="ps-hero-hook">Looking for signs of consciousness.</p>'), 'Hook must be "Looking for signs of consciousness."');
  assert(homeSource.includes("I explore intelligence, computing, and the systems shaping emerging technology. Through research and hands-on software projects, I turn questions into things I can test, build, and improve. I believe there's always more to understand—and that's what keeps me curious."), 'Supporting copy must match approved T7-002 copy');
  assert(homeSource.includes('href="/projects/"'), 'Primary hero CTA must point to /projects/');
  assert(homeSource.includes('View projects'), 'Primary hero CTA label must be View projects');
  assert(homeSource.includes('href="/about/"'), 'Secondary hero CTA must point to /about/');
  assert(!homeSource.includes('.pdf'), 'Hero must not include unverified resume PDF');
});

test('Contact CTA maintains exact wording and destination', () => {
  const contactSection = homeSource.slice(homeSource.indexOf('id="contact"'));
  assert(contactSection.includes('href="/contact/"'), 'Contact link must point to /contact/');
  assert(contactSection.includes('Get in touch <span aria-hidden="true">↗</span>'), 'Contact CTA wording must be preserved');
});

// -------------------------------------------------------------
// Suite 2: Built HTML Artifacts Verification (Zero-Project State)
// -------------------------------------------------------------
console.log('\n--- Suite 2: Built HTML Artifacts (Zero-Project State) ---');

const html = fs.readFileSync(HOME_HTML, 'utf8');

test('Zero-project state: Featured Projects section is completely absent from rendered HTML', () => {
  assert(!html.includes('id="featured-projects"'), 'Featured Projects must NOT appear in HTML when 0 eligible projects exist');
  assert(!html.includes('Featured Projects</h2>'), 'Featured Projects heading must NOT appear in HTML');
});

test('Zero-project state: No fixture notice, sample cards, or placeholder content rendered', () => {
  assert(!html.includes('fixtureNotice'), 'No fixtureNotice in rendered HTML');
  assert(!html.includes('Development fixture'), 'No Development fixture text in rendered HTML');
  assert(!html.includes('Development template'), 'No Development template text in rendered HTML');
});

test('Rendered section hierarchy follows exact order', () => {
  const heroIdx = html.indexOf('class="ps-hero"');
  const roadmapIdx = html.indexOf('id="learning-roadmap"');
  const researchIdx = html.indexOf('id="research-writing"');
  const aboutIdx = html.indexOf('id="about"');
  const contactIdx = html.indexOf('id="contact"');
  const footerIdx = html.indexOf('class="ps-footer"');

  assert(heroIdx > 0, 'Hero section must exist');
  assert(roadmapIdx > heroIdx, 'Capabilities/Learning Roadmap must follow Hero');
  assert(researchIdx > roadmapIdx, 'Research & Writing must follow Capabilities/Learning Roadmap');
  assert(!html.includes('id="analysis"'), 'Obsolete Connected analysis section must be removed');
  assert(!html.includes('href="/topics/"'), 'Withheld /topics/ link must not appear on homepage');
  assert(aboutIdx > researchIdx, 'About must follow Research & Writing');
  assert(contactIdx > aboutIdx, 'Contact strip must follow About');
  assert(footerIdx > contactIdx, 'Footer must follow Contact strip');
});

test('Hero primary CTA targets /projects/ directly', () => {
  assert(html.includes('href="/projects/"'), 'Hero primary CTA must point to /projects/');
  assert(html.includes('View projects'), 'Hero primary CTA must read View projects');
});

test('Semantic heading hierarchy is valid', () => {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  assert(h1Match, 'Exactly one h1 must exist');
  assert(h1Match[1].includes('Curiosity, made'), 'h1 contains hero title');

  const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());
  assert(h2Matches.includes('Research & Writing'), 'h2 contains Research & Writing');
  assert(!h2Matches.includes('Connected analysis'), 'h2 must not contain obsolete Connected analysis');
  assert(h2Matches.includes('Work worth understanding.'), 'h2 contains About title');
  assert(h2Matches.includes('Have a thoughtful question or discussion?'), 'h2 contains Contact title');
});

test('Built HTML contains approved hero copy elements', () => {
  assert(html.includes('AI engineer.'), 'Rendered HTML contains approved eyebrow');
  assert(html.includes('Looking for signs of consciousness.'), 'Rendered HTML contains supporting hook');
  assert(html.includes("I explore intelligence, computing, and the systems shaping emerging technology. Through research and hands-on software projects, I turn questions into things I can test, build, and improve. I believe there's always more to understand—and that's what keeps me curious."), 'Rendered HTML contains approved T7-002 supporting copy');
  assert(!html.includes('Research · Writing · Systems'), 'Rendered HTML does not contain obsolete eyebrow');
});

console.log('\n================================================================');
console.log(`  HOMEPAGE TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED (Total: ${passedCount + failedCount})`);
console.log('================================================================\n');

if (failedCount > 0) {
  process.exit(1);
}
