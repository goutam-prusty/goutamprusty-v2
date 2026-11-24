/**
 * Reusable Social/Contact Footer Verification Test Suite
 * goutamprusty.com v2 Rebuild — Phase 2: T2 Footer Social/Contact Block
 *
 * Verifies:
 * 1. Shared production footer component exists and is integrated into ProductionPaperSignalLayout.
 * 2. Footer structure per Master Plan sections 6.3 and 7.8:
 *    Wordmark, primary links, conditional social/contact links, copyright, back-to-top.
 * 3. Conditional rendering of GitHub, LinkedIn, email, and Resume links:
 *    Omitted when unverified; rendered with secure attributes and accessible names when verified.
 * 4. Zero dead links, zero placeholder strings, and zero guessed/invented URLs.
 * 5. Resume PDF verification gate (link omitted when no verified PDF exists).
 * 6. AI-assistance disclosure strictly gated on approved wording.
 * 7. Responsive CSS grid tokens: stacked on mobile, 2 columns on tablet, multi-column row on desktop.
 * 8. Production build HTML artifacts verification across representative pages.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const V2_ROOT = path.resolve(__dirname, '../../');
const FOOTER_PATH = path.join(V2_ROOT, 'src/components/SiteFooter.astro');
const LAYOUT_PATH = path.join(V2_ROOT, 'src/layouts/ProductionPaperSignalLayout.astro');
const CSS_PATH = path.join(V2_ROOT, 'src/styles/paper-signal.css');
const DIST_INDEX_HTML = path.join(V2_ROOT, 'dist/index.html');
const DIST_ABOUT_HTML = path.join(V2_ROOT, 'dist/about/index.html');
const DIST_CONTACT_HTML = path.join(V2_ROOT, 'dist/contact/index.html');
const DIST_PROJECTS_HTML = path.join(V2_ROOT, 'dist/projects/index.html');
const PUBLIC_DIR = path.join(V2_ROOT, 'public');

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
console.log('  REUSABLE SOCIAL/CONTACT FOOTER TEST SUITE (T2)');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// Suite 1: Component File & Shared Layout Integration
// -----------------------------------------------------------------------------
console.log('--- Suite 1: Component Architecture & Shared Layout Integration ---');

test('SiteFooter.astro exists at src/components/SiteFooter.astro', () => {
  assert(fs.existsSync(FOOTER_PATH), 'SiteFooter.astro must exist');
});

const footerSource = fs.readFileSync(FOOTER_PATH, 'utf8');
const layoutSource = fs.readFileSync(LAYOUT_PATH, 'utf8');

test('ProductionPaperSignalLayout.astro imports and renders SiteFooter', () => {
  assert(layoutSource.includes("import SiteFooter"), 'Layout must import SiteFooter');
  assert(layoutSource.includes('<SiteFooter'), 'Layout must render SiteFooter');
});

test('SiteFooter defines TypeScript Props and SocialContactLinks interface', () => {
  assert(footerSource.includes('export interface Props'), 'Must export Props interface');
  assert(footerSource.includes('export interface SocialContactLinks'), 'Must export SocialContactLinks interface');
  assert(footerSource.includes('github?: string | null;'), 'socialLinks must support github');
  assert(footerSource.includes('linkedin?: string | null;'), 'socialLinks must support linkedin');
  assert(footerSource.includes('email?: string | null;'), 'socialLinks must support email');
  assert(footerSource.includes('resume?: string | null;'), 'socialLinks must support resume');
});

// -----------------------------------------------------------------------------
// Suite 2: Footer Structure per Master Plan 6.3 & 7.8
// -----------------------------------------------------------------------------
console.log('\n--- Suite 2: Footer Structure per Master Plan 6.3 & 7.8 ---');

test('Footer contains wordmark linking to home', () => {
  assert(footerSource.includes('class="ps-wordmark"'), 'Must have .ps-wordmark');
  assert(footerSource.includes('href="/"'), 'Wordmark must link to home');
  assert(footerSource.includes('aria-label="goutamprusty.com home"'), 'Wordmark must have accessible label');
});

test('Footer contains all 5 primary navigation links', () => {
  const expectedLinks = ['Projects', 'Research', 'Writing', 'About', 'Contact'];
  for (const label of expectedLinks) {
    assert(footerSource.includes(`label: '${label}'`), `Footer must include primary link: ${label}`);
  }
  assert(footerSource.includes('href: \'/projects/\''), 'Must link to /projects/');
  assert(footerSource.includes('href: \'/research/\''), 'Must link to /research/');
  assert(footerSource.includes('href: \'/writing/\''), 'Must link to /writing/');
  assert(footerSource.includes('href: \'/about/\''), 'Must link to /about/');
  assert(footerSource.includes('href: \'/contact/\''), 'Must link to /contact/');
});

test('Footer contains Back to top link targeting #top', () => {
  assert(footerSource.includes('href="#top"'), 'Must have back-to-top anchor link to #top');
  assert(footerSource.includes('class="ps-footer-back-to-top"'), 'Must use .ps-footer-back-to-top class');
});

test('Footer contains copyright notice and brand attribution', () => {
  assert(footerSource.includes('© {currentYear} Goutam Prusty'), 'Must include copyright with year');
  assert(footerSource.includes('goutamprusty.com'), 'Must include domain attribution');
});

// -----------------------------------------------------------------------------
// Suite 3: Conditional Social & Contact Link Rendering
// -----------------------------------------------------------------------------
console.log('\n--- Suite 3: Conditional Social & Contact Link Rendering ---');

test('Social / Connect column is completely omitted when no verified links exist', () => {
  assert(footerSource.includes('{hasSocialLinks && ('), 'Must guard connect column with hasSocialLinks');
});

test('GitHub link is rendered conditionally with secure attributes and meaningful label', () => {
  assert(footerSource.includes('{githubUrl && ('), 'Must conditionally render GitHub link');
  assert(footerSource.includes('target="_blank"'), 'GitHub link must open in new tab');
  assert(footerSource.includes('rel="noopener noreferrer"'), 'GitHub link must include secure rel attributes');
  assert(footerSource.includes('aria-label="Goutam Prusty on GitHub (opens in new tab)"'), 'GitHub must have meaningful aria-label');
});

test('LinkedIn link is rendered conditionally with secure attributes and meaningful label', () => {
  assert(footerSource.includes('{linkedinUrl && ('), 'Must conditionally render LinkedIn link');
  assert(footerSource.includes('target="_blank"'), 'LinkedIn link must open in new tab');
  assert(footerSource.includes('rel="noopener noreferrer"'), 'LinkedIn link must include secure rel attributes');
  assert(footerSource.includes('aria-label="Goutam Prusty on LinkedIn (opens in new tab)"'), 'LinkedIn must have meaningful aria-label');
});

test('Email link is rendered conditionally with mailto: prefix and clean display text', () => {
  assert(footerSource.includes('{emailUrl && ('), 'Must conditionally render email link');
  assert(footerSource.includes('cleanEmail.startsWith(\'mailto:\')'), 'Must normalize mailto: scheme');
  assert(footerSource.includes('{emailDisplay}'), 'Must render clean email display text');
});

test('Resume link is rendered conditionally with PDF indicator', () => {
  assert(footerSource.includes('{resumeUrl && ('), 'Must conditionally render resume link');
  assert(footerSource.includes('target="_blank"'), 'Resume link must open in new tab');
  assert(footerSource.includes('(PDF)'), 'Must indicate PDF format in link text');
});

test('Prohibits dead links (#, empty href) or placeholder strings in footer source', () => {
  assert(!footerSource.match(/href=["']#["']/), 'Must not use dead href="#" (except #top)');
  assert(!footerSource.match(/href=["']["']/), 'Must not use empty href=""');
  assert(!footerSource.includes('placeholder'), 'Must not include placeholder token');
  assert(!footerSource.includes('example.com'), 'Must not include example.com');
});

// -----------------------------------------------------------------------------
// Suite 4: Resume PDF Verification Gate
// -----------------------------------------------------------------------------
console.log('\n--- Suite 4: Resume PDF Verification Gate ---');

test('No resume PDF currently exists in public/ directory (verified gate)', () => {
  const findPdfs = (dir) => {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let pdfs = [];
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) pdfs = pdfs.concat(findPdfs(full));
      else if (e.name.toLowerCase().endsWith('.pdf')) pdfs.push(full);
    }
    return pdfs;
  };
  const pdfs = findPdfs(PUBLIC_DIR);
  assert.strictEqual(pdfs.length, 0, 'No PDF must exist in public/ until owner provides verified resume');
});

// -----------------------------------------------------------------------------
// Suite 5: AI-Assistance Disclosure Gating
// -----------------------------------------------------------------------------
console.log('\n--- Suite 5: AI-Assistance Disclosure Gating ---');

test('AI disclosure line is rendered strictly when non-empty text is supplied', () => {
  assert(footerSource.includes('{disclosureText && ('), 'Must guard disclosure rendering');
  assert(footerSource.includes('class="ps-footer-disclosure"'), 'Must define .ps-footer-disclosure element');
  assert(footerSource.includes('{disclosureText}'), 'Must bind {disclosureText}');
});

// -----------------------------------------------------------------------------
// Suite 6: Responsive Styles & Design System Tokens
// -----------------------------------------------------------------------------
console.log('\n--- Suite 6: Responsive Styles & Design System Tokens ---');

const cssSource = fs.readFileSync(CSS_PATH, 'utf8');

test('Footer CSS defines .ps-footer-grid container', () => {
  assert(cssSource.includes('.ps-footer-grid {'), 'Must define .ps-footer-grid');
});

test('Footer responsive behavior: stacked on mobile (< 37.5rem / 600px)', () => {
  assert(cssSource.includes('@media (max-width: 37.49rem)'), 'Must define mobile breakpoint');
  assert(cssSource.includes('grid-template-columns: 1fr;'), 'Must stack in 1 column on mobile');
});

test('Footer responsive behavior: 2 columns on tablet (37.5rem - 56.25rem / 600px - 900px)', () => {
  assert(cssSource.includes('@media (min-width: 37.5rem) and (max-width: 56.24rem)'), 'Must define tablet breakpoint');
  assert(cssSource.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'Must use 2 columns on tablet');
});

test('Footer responsive behavior: multi-column row on desktop (> 56.25rem / 900px)', () => {
  assert(cssSource.includes('@media (min-width: 56.25rem)'), 'Must define desktop breakpoint');
  assert(cssSource.includes('grid-template-columns: minmax(14rem, 1.4fr) repeat(auto-fit, minmax(9rem, 1fr)) auto'),
    'Must define multi-column desktop layout');
});

test('Long URLs and text wrap to prevent page-level horizontal overflow', () => {
  assert(cssSource.includes('overflow-wrap: break-word;'), 'Must define overflow-wrap: break-word');
  assert(cssSource.includes('word-break: break-word;'), 'Must define word-break: break-word');
});

test('Footer links define accessible touch targets (min-height: 2.75rem on mobile)', () => {
  assert(cssSource.includes('.ps-footer-link {'), 'Must style .ps-footer-link');
  assert(cssSource.includes('min-height: 2.75rem;'), 'Mobile links must have min-height 2.75rem');
});

// -----------------------------------------------------------------------------
// Suite 7: Built HTML Invariants & Production Verification
// -----------------------------------------------------------------------------
console.log('\n--- Suite 7: Built HTML Invariants & Production Verification ---');

test('dist/index.html contains rendered footer with wordmark and primary links', () => {
  if (fs.existsSync(DIST_INDEX_HTML)) {
    const html = fs.readFileSync(DIST_INDEX_HTML, 'utf8');
    assert(html.includes('class="ps-footer"'), 'Must contain .ps-footer');
    assert(html.includes('class="ps-footer-grid"'), 'Must contain .ps-footer-grid');
    assert(html.includes('class="ps-wordmark"'), 'Must contain .ps-wordmark');
    assert(html.includes('href="/projects/"'), 'Must contain Projects link');
    assert(html.includes('href="/research/"'), 'Must contain Research link');
    assert(html.includes('href="/writing/"'), 'Must contain Writing link');
    assert(html.includes('href="/about/"'), 'Must contain About link');
    assert(html.includes('href="/contact/"'), 'Must contain Contact link');
    assert(html.includes('href="#top"'), 'Must contain Back to top link');
  }
});

test('dist/index.html contains zero unverified social links, dead links, or placeholders in footer', () => {
  if (fs.existsSync(DIST_INDEX_HTML)) {
    const html = fs.readFileSync(DIST_INDEX_HTML, 'utf8');
    const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
    assert(footerMatch, 'Footer must exist in dist/index.html');
    const footerHtml = footerMatch[0];

    // Connect column must be omitted since no links are verified
    assert(!footerHtml.includes('class="ps-footer-social-col"'), 'Connect column must not render without verified links');
    assert(!footerHtml.includes('github.com'), 'Must not render unverified GitHub link');
    assert(!footerHtml.includes('linkedin.com'), 'Must not render unverified LinkedIn link');
    assert(!footerHtml.includes('mailto:'), 'Must not render unverified email link');
    assert(!footerHtml.includes('.pdf'), 'Must not render unverified PDF link');
    assert(!footerHtml.includes('placeholder'), 'Must not contain placeholder text');
    assert(!footerHtml.includes('TBD'), 'Must not contain TBD text');
  }
});

test('Representative production pages all inherit the shared footer', () => {
  const pages = [DIST_ABOUT_HTML, DIST_CONTACT_HTML, DIST_PROJECTS_HTML];
  for (const p of pages) {
    if (fs.existsSync(p)) {
      const html = fs.readFileSync(p, 'utf8');
      assert(html.includes('class="ps-footer"'), `${path.basename(p)} must include .ps-footer`);
      assert(html.includes('class="ps-footer-grid"'), `${path.basename(p)} must include .ps-footer-grid`);
      assert(html.includes('href="#top"'), `${path.basename(p)} must include Back to top link`);
    }
  }
});

console.log('================================================================');
console.log(`  FOOTER TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (Total: ${totalTests})`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
}
