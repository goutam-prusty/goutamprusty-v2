/**
 * About Page Factual Profile Test Suite (T10)
 * goutamprusty.com v2 Rebuild — Phase 1: T10 Understated About Page
 *
 * Verifies:
 * 1. Factual education: New Horizon College of Engineering, BBA in Finance, Sept 2021 – Sept 2024.
 * 2. Factual work history: DirectorIn, Intugine, Brand Compass with verbatim responsibilities.
 * 3. Concise personal project summaries: Therapist tracker, Instagram behavioral analysis,
 *    Doomscrolling tracker, Hinglish fine-tuned LM.
 * 4. Negative constraints: Zero DataMites enrollment claims, zero promotional adjectives/self-praise,
 *    zero invented metrics, zero broken links.
 * 5. Layout and accessibility: Paper & Signal shell, semantic landmarks, TOC aside with anchor targets.
 * 6. Built HTML verification.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const ABOUT_SRC_PATH = path.join(ROOT, 'src', 'pages', 'about.astro');
const ABOUT_HTML_PATH = path.join(ROOT, 'dist', 'about', 'index.html');
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
console.log('  FACTUAL UNDERSTATED ABOUT PAGE TEST SUITE (T10)');
console.log('================================================================\n');

// -------------------------------------------------------------
// Suite 1: Source File & Layout Integration
// -------------------------------------------------------------
console.log('--- Suite 1: Source File & Layout Integration ---');

test('about.astro exists at src/pages/about.astro', () => {
  assert(fs.existsSync(ABOUT_SRC_PATH), 'about.astro must exist');
});

const src = fs.readFileSync(ABOUT_SRC_PATH, 'utf8');

test('Imports and uses ProductionPaperSignalLayout', () => {
  assert(src.includes("import ProductionPaperSignalLayout from '../layouts/ProductionPaperSignalLayout.astro'"), 'Must import ProductionPaperSignalLayout');
  assert(src.includes('<ProductionPaperSignalLayout'), 'Must render ProductionPaperSignalLayout');
});

test('Defines honest title and metadata description', () => {
  assert(src.includes("title={pageTitle}"), 'Must pass title');
  assert(src.includes("description={pageDescription}"), 'Must pass description');
  assert(src.includes('About — Goutam Prusty'), 'Title contains About');
});

// -------------------------------------------------------------
// Suite 2: Factual Education Verification
// -------------------------------------------------------------
console.log('\n--- Suite 2: Factual Education Verification ---');

test('Contains New Horizon College of Engineering BBA degree', () => {
  assert(src.includes('New Horizon College of Engineering'), 'Must include college name');
  assert(src.includes('Bachelor of Business Administration (BBA) — Finance'), 'Must include exact degree and major');
  assert(src.includes('September 2021 – September 2024') || src.includes('September 2021'), 'Must include dates');
  assert(src.includes('Bengaluru'), 'Must include location');
});

test('Secondary education matches source records', () => {
  assert(src.includes('Christ College, Cuttack'), 'Must include Christ College');
  assert(src.includes('S.C.B. Medical Public School'), 'Must include school');
});

// -------------------------------------------------------------
// Suite 3: Factual Work History Verification
// -------------------------------------------------------------
console.log('\n--- Suite 3: Factual Work History Verification ---');

test('Contains DirectorIn with accurate trainee role and dates', () => {
  assert(src.includes('DirectorIn'), 'Must include DirectorIn');
  assert(src.includes('Business Consultant Trainee'), 'Must include exact role');
  assert(src.includes('September 2023 – November 2023'), 'Must include exact dates');
  assert(src.includes('Supported senior consultants with appointment scheduling and client outreach.'), 'Must include responsibility 1');
  assert(src.includes('Helped revamp the company website and set up initial social media presence.'), 'Must include responsibility 2');
});

test('Contains Intugine with accurate bills accounting assistant role and dates', () => {
  assert(src.includes('Intugine'), 'Must include Intugine');
  assert(src.includes('Bills Accounting Assistant'), 'Must include exact role');
  assert(src.includes('May 2023 – August 2023'), 'Must include exact dates');
  assert(src.includes('Processed and validated expense reports and bills in a logistics-tech company.'), 'Must include responsibility 1');
  assert(src.includes('Coordinated between sales and finance teams on reimbursements.'), 'Must include responsibility 2');
});

test('Contains Brand Compass with accurate junior web developer role and dates', () => {
  assert(src.includes('Brand Compass'), 'Must include Brand Compass');
  assert(src.includes('Jr. Web Developer'), 'Must include exact role');
  assert(src.includes('December 2021'), 'Must include exact date');
  assert(src.includes('Improved page load performance and mobile responsiveness for client websites.'), 'Must include responsibility 1');
  assert(src.includes('Worked on SEO basics and image optimization.'), 'Must include responsibility 2');
});

// -------------------------------------------------------------
// Suite 4: Personal Project Explorations Verification
// -------------------------------------------------------------
console.log('\n--- Suite 4: Personal Project Explorations ---');

test('Contains therapist session-tracking tool summary', () => {
  assert(src.includes('Session-tracking tool for therapists'), 'Must include therapist project title');
  assert(src.includes('session scheduling') || src.includes('tracking utility'), 'Must describe scope without invention');
});

test('Contains Instagram behavioural analysis platform summary', () => {
  assert(src.includes('Behavioural analysis platform using Instagram data'), 'Must include Instagram project title');
});

test('Contains doomscrolling pattern tracker summary', () => {
  assert(src.includes('Doomscrolling pattern tracker'), 'Must include doomscrolling project title');
});

test('Contains Hinglish forum conversation fine-tuned language model summary', () => {
  assert(src.includes('Language model fine-tuned on Hinglish forum conversations'), 'Must include Hinglish LM project title');
});

test('Explicitly references the Projects library without pretending summaries are case studies', () => {
  assert(src.includes('href="/projects/"'), 'Must link to /projects/ library');
  assert(src.includes('represent targeted software and data experiments rather than complete production case studies'), 'Must disclaim complete case studies');
});

// -------------------------------------------------------------
// Suite 5: Negative Constraints & Deliberately Omitted Facts
// -------------------------------------------------------------
console.log('\n--- Suite 5: Negative Constraints & Deliberately Omitted Facts ---');

test('Does NOT claim DataMites enrollment, completion, or certification', () => {
  assert(!src.includes('DataMites'), 'Must not claim DataMites enrollment or certification');
  assert(!src.includes('Certified AI Engineer'), 'Must not claim unverified certificate');
  assert(!src.includes('IABAC'), 'Must not claim unverified IABAC credential');
});

test('Does NOT include self-praise or promotional puffery from original LinkedIn profile', () => {
  assert(!src.includes('Aspiring consultant with strong research'), 'Must omit profile headline puffery');
  assert(!src.includes('expert'), 'Must not claim expert');
  assert(!src.includes('mastered'), 'Must not claim mastered');
  assert(!src.includes('proven track record'), 'Must not claim proven track record');
  assert(!src.includes('visionary'), 'Must not use self-praise');
});

test('Does NOT invent employment status or current employee claims', () => {
  assert(!src.includes('currently employed as'), 'Must not claim unverified employment');
  assert(!src.includes('Senior Developer'), 'Must not inflate titles');
  assert(!src.includes('Lead Engineer'), 'Must not inflate titles');
});

test('Does NOT include broken resume link or placeholder links', () => {
  assert(!src.includes('href="#"'), 'Must not have dead anchor links');
  assert(!src.includes('resume.pdf'), 'Must not link to unverified resume');
});

// -------------------------------------------------------------
// Suite 6: Semantic Structure, Accessibility & Styling
// -------------------------------------------------------------
console.log('\n--- Suite 6: Semantic Structure, Accessibility & Styling ---');

const cssSource = fs.readFileSync(CSS_PATH, 'utf8');

test('Page defines table of contents aside navigation with matching anchor IDs', () => {
  assert(src.includes('<aside class="ps-aside" aria-label="About page sections">'), 'Must have labeled TOC aside');
  assert(src.includes('id="background"'), 'Must have #background section');
  assert(src.includes('id="education"'), 'Must have #education section');
  assert(src.includes('id="experience"'), 'Must have #experience section');
  assert(src.includes('id="projects"'), 'Must have #projects section');
  assert(src.includes('id="ethos"'), 'Must have #ethos section');
});

test('CSS defines profile entry layout rules in Paper & Signal design tokens', () => {
  assert(cssSource.includes('.ps-profile-entry'), 'Must define .ps-profile-entry');
  assert(cssSource.includes('.ps-profile-entry-header'), 'Must define .ps-profile-entry-header');
  assert(cssSource.includes('.ps-profile-entry-meta'), 'Must define .ps-profile-entry-meta');
  assert(cssSource.includes('.ps-profile-list'), 'Must define .ps-profile-list');
});

// -------------------------------------------------------------
// Suite 7: Built HTML Invariants
// -------------------------------------------------------------
console.log('\n--- Suite 7: Built HTML Invariants ---');

test('Built dist/about/index.html renders verified facts when build exists', () => {
  if (fs.existsSync(ABOUT_HTML_PATH)) {
    const html = fs.readFileSync(ABOUT_HTML_PATH, 'utf8');
    assert(html.includes('New Horizon College of Engineering'), 'Built HTML contains college');
    assert(html.includes('DirectorIn'), 'Built HTML contains DirectorIn');
    assert(html.includes('Intugine'), 'Built HTML contains Intugine');
    assert(html.includes('Brand Compass'), 'Built HTML contains Brand Compass');
    assert(html.includes('Session-tracking tool for therapists'), 'Built HTML contains project');
    assert(!html.includes('DataMites'), 'Built HTML does not claim DataMites');
  }
});

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`  ABOUT PAGE TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED (Total: ${passedCount + failedCount})`);
console.log('================================================================');

if (failedCount > 0) {
  process.exit(1);
}
