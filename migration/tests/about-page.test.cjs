/**
 * About Page Factual Profile Test Suite (T10 & T10 Follow-up)
 * goutamprusty.com v2 Rebuild — Phase 1: T10 Understated About Page
 *
 * Verifies:
 * 1. Source file & layout integration: Paper & Signal shell, title, metadata description.
 * 2. Background section refinement: "AI engineer" identity, Bengaluru location, no subjective self-praise.
 * 3. Current training: DataMites AI Engineer Program, enrolled / in progress, 23 Nov 2026, 20-week training phase,
 *    curriculum summary, explicit in-progress disclaimer, no claims of completion or certification.
 * 4. Learning workspace: AI Engineer Command Center, live link, repo link, Vite/React/TS/Tailwind/Firebase stack,
 *    disclaimer that it is an operational tracker, not an AI model or LLM application.
 * 5. Factual education: New Horizon College of Engineering, BBA in Finance, Sept 2021 – Sept 2024, secondary schooling.
 * 6. Factual work history: DirectorIn, Intugine, Brand Compass with verbatim responsibilities.
 * 7. Concise personal project summaries: Therapist tracker, Instagram behavioral analysis,
 *    Doomscrolling tracker, Hinglish fine-tuned LM, linked to /projects/ library.
 * 8. Negative constraints & task limits: Zero unverified projects (Inkline, Vitaliq, Wharf),
 *    zero promotional puffery, zero resume download links, zero dead links.
 * 9. Semantic structure & TOC: Labeled TOC aside with all 7 section anchors.
 * 10. Built HTML verification.
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
console.log('  FACTUAL UNDERSTATED ABOUT PAGE TEST SUITE (T10 & FOLLOW-UP)');
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
// Suite 2: Refined Background Section
// -------------------------------------------------------------
console.log('\n--- Suite 2: Refined Background Section ---');

test('Contains owner-approved AI engineer identity and Bengaluru location', () => {
  assert(src.includes('AI engineer'), 'Must state AI engineer');
  assert(src.includes('Bengaluru, Karnataka, India'), 'Must include location');
});

test('Does NOT include subjective self-praise or abstract claims in background', () => {
  assert(!src.includes('deliberate and evidence-based'), 'Must remove deliberate and evidence-based');
  assert(!src.includes('chasing transient software trends'), 'Must remove transient software trends claim');
});

// -------------------------------------------------------------
// Suite 3: Current AI Engineering Training Verification
// -------------------------------------------------------------
console.log('\n--- Suite 3: Current Training Verification ---');

test('Contains DataMites AI Engineer Program with enrolled / in progress status', () => {
  assert(src.includes('DataMites AI Engineer Program'), 'Must include programme name');
  assert(src.includes('Enrolled · In progress') || (src.includes('Enrolled') && src.includes('In progress')), 'Must state enrolled and in progress');
  assert(src.includes('23 November 2026'), 'Must include start date 23 November 2026');
});

test('Accurately describes programme structure and published curriculum', () => {
  assert(src.includes('20-week'), 'Must note 20-week training phase');
  assert(src.includes('eight-month'), 'Must note eight-month programme');
  assert(src.includes('three-month internship and projects phase'), 'Must note three-month internship/projects phase');
  assert(src.includes('Python'), 'Curriculum includes Python');
  assert(src.includes('statistics'), 'Curriculum includes statistics');
  assert(src.includes('machine learning'), 'Curriculum includes machine learning');
  assert(src.includes('databases'), 'Curriculum includes databases');
  assert(src.includes('version control'), 'Curriculum includes version control');
  assert(src.includes('big data'), 'Curriculum includes big data');
  assert(src.includes('business intelligence') || src.includes('BI'), 'Curriculum includes BI');
  assert(src.includes('AI foundations'), 'Curriculum includes AI foundations');
  assert(src.includes('deep learning'), 'Curriculum includes deep learning');
  assert(src.includes('computer vision'), 'Curriculum includes computer vision');
  assert(src.includes('natural language processing') || src.includes('NLP'), 'Curriculum includes NLP');
  assert(src.includes('LLM application engineering'), 'Curriculum includes LLM application engineering');
  assert(src.includes('retrieval-augmented generation') || src.includes('RAG'), 'Curriculum includes RAG');
  assert(src.includes('agentic workflows'), 'Curriculum includes agentic workflows');
});

test('Explicitly disclaims completed coursework, certifications, or internship experience', () => {
  assert(src.includes('training is currently in progress'), 'Must state training in progress');
  assert(src.includes('internship and project phase takes place later in the programme'), 'Must state internship/project later');
  assert(src.includes('rather than completed coursework, certifications, internship experience, or project completion'), 'Must disclaim completion');
});

// -------------------------------------------------------------
// Suite 4: Learning Workspace (AI Engineer Command Center)
// -------------------------------------------------------------
console.log('\n--- Suite 4: Learning Workspace Verification ---');

test('Contains AI Engineer Command Center with live and repository links', () => {
  assert(src.includes('AI Engineer Command Center'), 'Must include workspace name');
  assert(src.includes('https://ai-engineer-command-center-seven.vercel.app/'), 'Must include live link');
  assert(src.includes('https://github.com/goutam-prusty/ai-engineer-command-center'), 'Must include source link');
});

test('Accurately describes workspace purpose and documented tech stack', () => {
  assert(src.includes('personal learning tracker'), 'Must describe as personal learning tracker');
  assert(src.includes('curriculum planning'), 'Must mention curriculum planning');
  assert(src.includes('Vite') && src.includes('React') && src.includes('TypeScript') && src.includes('Tailwind') && src.includes('Firebase'), 'Must state full tech stack');
});

test('Links AI Engineer Command Center to internal case study', () => {
  assert(src.includes('href="/projects/ai-engineer-command-center/"'), 'Must link to /projects/ai-engineer-command-center/');
});

test('Explicitly disclaims being an AI model, LLM product, or AI-powered app', () => {
  assert(src.includes('not an AI model, LLM product, or AI-powered application') || src.includes('not an AI model'), 'Must disclaim being an AI model');
});

test('Introduces Grounded Technical Docs RAG Assistant with in-development status and accurate foundation', () => {
  assert(src.includes('Grounded Technical Docs RAG Assistant'), 'Must include exact PRJ-005 name');
  assert(src.includes('href="/projects/grounded-technical-docs-rag-assistant/"'), 'Must link to /projects/grounded-technical-docs-rag-assistant/');
  assert(src.includes('In Development'), 'Must mark as In Development');
  assert(src.includes('Python/FastAPI service foundation stage'), 'Must accurately describe foundation stage');
  assert(src.includes('Retrieval, generation, citation validation, and evaluation components remain planned work') || src.includes('planned work'), 'Must state planned work');
  assert(src.includes('not deployed or publicly available'), 'Must state application is not deployed or publicly available');
});

// -------------------------------------------------------------
// Suite 5: Factual Education Verification
// -------------------------------------------------------------
console.log('\n--- Suite 5: Factual Education Verification ---');

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
// Suite 6: Factual Work History Verification
// -------------------------------------------------------------
console.log('\n--- Suite 6: Factual Work History Verification ---');

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
// Suite 7: Personal Project Explorations Verification
// -------------------------------------------------------------
console.log('\n--- Suite 7: Personal Project Explorations ---');

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

test('Groups four older project explorations under three approved thematic categories', () => {
  assert(src.includes('Natural Language Processing'), 'Must include Natural Language Processing category');
  assert(src.includes('Behavioral & Interaction Systems'), 'Must include Behavioral & Interaction Systems category');
  assert(src.includes('Workflow Utilities'), 'Must include Workflow Utilities category');
});

// -------------------------------------------------------------
// Suite 8: Negative Constraints & Deliberately Omitted Facts
// -------------------------------------------------------------
console.log('\n--- Suite 8: Negative Constraints & Deliberately Omitted Facts ---');

test('Does NOT claim unverified DataMites certification or completed credentials', () => {
  assert(!src.includes('Certified AI Engineer'), 'Must not claim unverified certificate');
  assert(!src.includes('IABAC'), 'Must not claim unverified IABAC credential');
});

test('Does NOT claim completed internship or finished projects from DataMites', () => {
  assert(!src.includes('completed the DataMites internship'), 'Must not claim completed internship');
  assert(!src.includes('DataMites certified'), 'Must not claim certified');
});

test('Does NOT add Inkline, Vitaliq, Wharf, or private repos to this milestone', () => {
  assert(!src.includes('Inkline'), 'Must not mention Inkline');
  assert(!src.includes('Vitaliq'), 'Must not mention Vitaliq');
  assert(!src.includes('Wharf'), 'Must not mention Wharf');
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
  assert(!src.includes('Profile.pdf'), 'Must not link to Profile.pdf');
});

// -------------------------------------------------------------
// Suite 9: Semantic Structure, Accessibility & Styling
// -------------------------------------------------------------
console.log('\n--- Suite 9: Semantic Structure, Accessibility & Styling ---');

const cssSource = fs.readFileSync(CSS_PATH, 'utf8');

test('Page defines table of contents aside navigation with all matching anchor IDs', () => {
  assert(src.includes('<aside class="ps-aside" aria-label="About page sections">'), 'Must have labeled TOC aside');
  assert(src.includes('id="background"'), 'Must have #background section');
  assert(src.includes('id="training"'), 'Must have #training section');
  assert(src.includes('id="workspace"'), 'Must have #workspace section');
  assert(src.includes('id="education"'), 'Must have #education section');
  assert(src.includes('id="experience"'), 'Must have #experience section');
  assert(src.includes('id="projects"'), 'Must have #projects section');
  assert(src.includes('id="ethos"'), 'Must have #ethos section');
});

test('Sections follow approved target order: Background -> Workspace -> Projects -> Training -> Education -> Experience -> Ethos', () => {
  const bgIndex = src.indexOf('id="background"');
  const wsIndex = src.indexOf('id="workspace"');
  const prIndex = src.indexOf('id="projects"');
  const trIndex = src.indexOf('id="training"');
  const edIndex = src.indexOf('id="education"');
  const exIndex = src.indexOf('id="experience"');
  const etIndex = src.indexOf('id="ethos"');

  assert(bgIndex !== -1 && wsIndex !== -1 && prIndex !== -1 && trIndex !== -1 && edIndex !== -1 && exIndex !== -1 && etIndex !== -1, 'All section IDs must exist');
  assert(bgIndex < wsIndex, '#background must appear before #workspace');
  assert(wsIndex < prIndex, '#workspace must appear before #projects');
  assert(prIndex < trIndex, '#projects must appear before #training (Master Plan K7)');
  assert(trIndex < edIndex, '#training must appear before #education');
  assert(edIndex < exIndex, '#education must appear before #experience');
  assert(exIndex < etIndex, '#experience must appear before #ethos');
});

test('Mobile table of contents appears after beginning of article (#background) and before #workspace', () => {
  const bgIndex = src.indexOf('id="background"');
  const mobileTocIndex = src.indexOf('class="ps-toc-mobile"');
  const wsIndex = src.indexOf('id="workspace"');

  assert(mobileTocIndex !== -1, 'Must include ps-toc-mobile');
  assert(bgIndex < mobileTocIndex, '#background must precede mobile TOC');
  assert(mobileTocIndex < wsIndex, 'Mobile TOC must precede #workspace');
});

test('Library ethos section links to research, writing, and contact', () => {
  const ethosSection = src.slice(src.indexOf('id="ethos"'));
  assert(ethosSection.includes('href="/research/"'), 'Ethos must link to /research/');
  assert(ethosSection.includes('href="/writing/"'), 'Ethos must link to /writing/');
  assert(ethosSection.includes('href="/contact/"'), 'Ethos must link to /contact/');
});

test('About page markup scopes body-grid with .ps-body-grid--about', () => {
  assert(src.includes('class="ps-body-grid ps-body-grid--about"'), 'About page must scope body grid with ps-body-grid--about');
});

test('About page mobile TOC disclosure exists and is hidden on desktop', () => {
  assert(src.includes('class="ps-toc-mobile"'), 'About page must include ps-toc-mobile in markup');
  assert(src.includes('class="ps-toc-disclosure"'), 'About page must include ps-toc-disclosure in markup');
  assert(cssSource.includes('.ps-toc-mobile {\n  display: none;\n}') || cssSource.includes('.ps-toc-mobile { display: none; }') || cssSource.includes('.ps-toc-mobile {\r\n  display: none;\r\n}'), 'Must hide mobile TOC disclosure on desktop');
});

test('About page desktop aside is hidden only on mobile via scoped selector, not globally', () => {
  assert(cssSource.includes('.ps-body-grid--about .ps-aside { display: none; }'), 'Must hide aside only when scoped to About page');
  assert(cssSource.includes('.ps-aside { position: static; grid-row: 1; }'), 'Shared .ps-aside must preserve position: static; grid-row: 1 on mobile');
  assert(!cssSource.includes('\n  .ps-aside { display: none; }') && !cssSource.includes('\r\n  .ps-aside { display: none; }'), 'Shared .ps-aside must NOT be globally display: none on mobile');
});

test('Desktop sticky aside styling remains intact', () => {
  assert(cssSource.includes('.ps-aside { position: sticky; top: 1.25rem;'), 'Desktop aside must retain sticky styling');
});

test('CSS defines profile entry layout rules in Paper & Signal design tokens', () => {
  assert(cssSource.includes('.ps-profile-entry'), 'Must define .ps-profile-entry');
  assert(cssSource.includes('.ps-profile-entry-header'), 'Must define .ps-profile-entry-header');
  assert(cssSource.includes('.ps-profile-entry-meta'), 'Must define .ps-profile-entry-meta');
  assert(cssSource.includes('.ps-profile-list'), 'Must define .ps-profile-list');
});

// -------------------------------------------------------------
// Suite 10: Built HTML Invariants
// -------------------------------------------------------------
console.log('\n--- Suite 10: Built HTML Invariants ---');

test('Built dist/about/index.html renders verified facts when build exists', () => {
  if (fs.existsSync(ABOUT_HTML_PATH)) {
    const html = fs.readFileSync(ABOUT_HTML_PATH, 'utf8');
    assert(html.includes('New Horizon College of Engineering'), 'Built HTML contains college');
    assert(html.includes('DirectorIn'), 'Built HTML contains DirectorIn');
    assert(html.includes('Intugine'), 'Built HTML contains Intugine');
    assert(html.includes('Brand Compass'), 'Built HTML contains Brand Compass');
    assert(html.includes('Session-tracking tool for therapists'), 'Built HTML contains project');
    assert(html.includes('class="ps-body-grid ps-body-grid--about"'), 'Built HTML contains scoped body grid');
    assert(html.includes('DataMites AI Engineer Program'), 'Built HTML contains DataMites training');
    assert(html.includes('AI Engineer Command Center'), 'Built HTML contains workspace');
    assert(html.includes('https://ai-engineer-command-center-seven.vercel.app/'), 'Built HTML contains workspace live link');
    assert(html.includes('href="/projects/ai-engineer-command-center/"'), 'Built HTML contains workspace case study link');
    assert(html.includes('Grounded Technical Docs RAG Assistant'), 'Built HTML contains PRJ-005 title');
    assert(html.includes('href="/projects/grounded-technical-docs-rag-assistant/"'), 'Built HTML contains PRJ-005 link');
    assert(html.includes('Natural Language Processing'), 'Built HTML contains NLP category');
    assert(html.includes('Behavioral &amp; Interaction Systems') || html.includes('Behavioral & Interaction Systems'), 'Built HTML contains behavioral category');
    assert(html.includes('Workflow Utilities'), 'Built HTML contains workflow category');
    assert(html.includes('href="/research/"'), 'Built HTML contains research link');
    assert(html.includes('href="/writing/"'), 'Built HTML contains writing link');
    assert(!html.includes('deliberate and evidence-based'), 'Built HTML does not contain deliberate and evidence-based');
    assert(!html.includes('Certified AI Engineer'), 'Built HTML does not claim certificate');
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
