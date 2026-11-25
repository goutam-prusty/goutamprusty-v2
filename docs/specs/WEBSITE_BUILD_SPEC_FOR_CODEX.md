# goutamprusty.com — Website Rebuild & Codex Build Specification

**Document purpose:** Product, design, content, architecture, migration, and quality specification for rebuilding `goutamprusty.com` with ChatGPT Codex.

**Prepared:** 20 November 2026  
**Status:** Working build specification based on the source master brief and decisions made in the planning conversation.  
**Primary implementation approach:** Astro + Sanity + Cloudflare Pages  
**Primary design principle:** Thoughtful, editorial, mobile-first, responsive, restrained, and easy to navigate.

---

## 1. How Codex should use this document

Treat this document as the project's product and implementation brief. Read it before making architectural or design decisions.

### Instructions for Codex

1. **Inspect before changing.** If a repository, existing site export, content archive, or asset folder is supplied, inspect it first. Do not assume its structure, framework, routes, content count, or deployment configuration.
2. **Preserve content and evidence.** The existing website and its source archive are the source material for migration. Do not invent biography, credentials, clients, project outcomes, metrics, dates, technical ownership, or publication URLs.
3. **Build the agreed product, not an expanded one.** The user wants a beautiful, usable personal website—not a collection of experimental features. Do not add features merely because they are technically interesting.
4. **Design for real devices.** Mobile is the first design constraint because many visitors will arrive from LinkedIn on a phone. Tablet and desktop are also first-class supported experiences, especially for long-form reading. Do not treat desktop as an afterthought.
5. **Prefer simple, maintainable implementation.** Use semantic HTML, reusable templates, clear content schemas, and minimal client-side JavaScript. Avoid unnecessary dependencies and custom interaction systems.
6. **Do not fabricate missing details.** When a required fact, asset, URL, or content decision is unknown, flag it for review and use a safe placeholder only in development—not as published factual copy.
7. **Work in reviewable phases.** First audit the repository and content; then propose/confirm implementation details; then build incrementally. Run tests and responsive checks before declaring work complete.
8. **Keep the site visually coherent.** All page types must feel like parts of one considered publication and personal identity—not disconnected templates.

If instructions in the repository conflict with this brief, report the conflict before making destructive changes. Preserve existing data until the user approves a migration plan.

---

## 2. Project overview

Rebuild `goutamprusty.com` from scratch and migrate its existing content into a maintainable website with a friendly publishing workflow.

The website has three connected roles:

- **Personal identity:** clearly communicate who Goutam is, what he explores, and how he approaches work.
- **Professional portfolio:** make research, writing, and practical projects easy for recruiters and other visitors to discover and evaluate.
- **Research and knowledge library:** preserve long-form reports, articles, topics, and relationships between pieces of work.

The site should be the canonical home for Goutam's work. LinkedIn and Medium are distribution and publication channels; they should be represented as external destinations where appropriate, not indiscriminately duplicated.

### The visitor's desired impression

A visitor—especially a recruiter arriving from LinkedIn—should quickly feel:

> This is a thoughtful, well-presented body of work. The person behind it has taken care with both the substance and the presentation.

The website should feel custom, intentional, and human-designed. It should not look like a generic AI-generated portfolio, a flashy SaaS landing page, or an over-engineered developer demo.

### Guiding philosophy

**Explore. Understand. Build. Explain.**

Use this as a guiding editorial idea, not as a rigid slogan that must be repeated on every page:

- **Explore:** investigate questions across disciplines without prematurely narrowing the subject matter.
- **Understand:** research carefully, evaluate evidence, and develop an informed view.
- **Build:** turn ideas into applications, experiments, or practical solutions where appropriate.
- **Explain:** share what has been learned so others can benefit.

The site must preserve a multidisciplinary identity. Do not position the entire website as exclusively about AI engineering.

---

## 3. Audience and primary user journeys

### Primary audiences

1. **Recruiters and hiring managers** assessing professional identity, evidence of work, communication, and practical projects.
2. **Technical and business peers** exploring projects, research, and ideas.
3. **Readers and curious visitors** arriving through a shared article, search engine, LinkedIn, or an external publication.
4. **Search engines and AI-assisted discovery systems** that need crawlable, well-structured, accurately described pages.

### Important user journeys

**Journey A — Recruiter from LinkedIn, on a phone**
1. Opens the homepage.
2. Understands who Goutam is and what kind of work is represented.
3. Finds selected projects and strongest research/writing.
4. Opens a project or About page.
5. Can reach LinkedIn, GitHub, or Contact without hunting.

**Journey B — Reader opening a research report**
1. Opens a report from a search result or shared link.
2. Understands the title, summary, publication date, and scope.
3. Uses a contents list to navigate a long document.
4. Reads comfortably on a phone, tablet, or desktop.
5. Follows citations and related work.

**Journey C — Reader exploring a topic**
1. Opens Topics.
2. Selects a subject.
3. Sees a clear explanation and related research, writing, and projects.
4. Moves between connected pieces of work.

**Journey D — Site owner publishing**
1. Opens the CMS dashboard.
2. Creates or edits a content item in a comfortable rich-text interface.
3. Adds metadata, topics, and relationships using clear fields.
4. Previews the page.
5. Publishes without manually editing MDX files or uploading content through Git.

---

## 4. Approved information architecture and sitemap

The user approved the proposed sitemap and overall layout. Keep the main navigation concise.

### Main navigation

- **Home**
- **Research**
- **Writing**
- **Projects**
- **Topics**
- **About**

### Supporting pages and destinations

- **Now** — current focus and what is being worked on.
- **Elsewhere** — selected external publications and profiles, including Medium and LinkedIn.
- **Contact**
- **Search**
- **Collections / Series** — for curated groups of related work where the content data supports them.
- **404 page**

### Page templates

| Template | Purpose |
|---|---|
| Home | Introduce identity, highlight selected work, guide visitors into the site |
| Research listing | Browse research reports |
| Research detail | Long-form report with metadata, contents, citations, and related work |
| Writing listing | Browse essays, articles, and shorter writing |
| Writing detail | Comfortable editorial reading experience |
| Projects listing | Browse practical work and case studies |
| Project detail | Explain problem, approach, implementation, evidence, contribution, and lessons |
| Topics index | Browse the site's subject taxonomy |
| Topic detail | Explain a topic and collect related content |
| About | Honest professional and intellectual background |
| Now | Current interests, learning, and work in progress |
| Elsewhere | Links to external profiles and publication destinations |
| Contact | Simple ways to make contact |
| Search results | Search the site's published content |
| Collection / Series | Curated path through related works |
| 404 | Helpful recovery and navigation |

### Homepage content hierarchy

The homepage should be focused and readable, not a dashboard. Suggested order:

1. **Identity hero**
   - Name.
   - A concise, accurate introduction.
   - Optional guiding line: “Explore. Understand. Build. Explain.”
   - Clear routes to selected work and About.
2. **Short introduction**
   - What the site contains and how Goutam approaches research, writing, and building.
3. **Selected work**
   - A small, curated selection across research, writing, and projects.
   - Do not imply that a project is more complete or successful than the evidence supports.
4. **Current focus**
   - A concise excerpt or link to Now.
5. **Topics**
   - A small set of meaningful topic entry points, not all taxonomy terms crowded onto the homepage.
6. **Latest work**
   - Recent published items with clear type and date labels.
7. **Connect**
   - Relevant external profiles and contact route.

Do not force every section above the fold. The first screen should establish identity and visual quality; the rest of the homepage should invite exploration.

---

## 5. Visual design direction

### 5.1 Overall aesthetic

**Understated, thoughtful, editorial, and professional.**

The design should feel like a carefully art-directed personal publication. It should be visually distinctive through typography, spacing, hierarchy, alignment, and restrained details—not through visual effects.

The user does not want excessive customization, elaborate animation, or novelty features. The aim is a beautiful, clear website that feels intentionally designed.

### 5.2 Visual principles

- Strong, readable typography with a clear hierarchy.
- A restrained colour palette with one subtle accent at most.
- Generous but purposeful whitespace.
- Consistent spacing, alignment, and content widths.
- Carefully composed headings and metadata.
- Simple, recognizable navigation.
- Editorial layouts that make titles, summaries, dates, and content types easy to scan.
- Subtle borders or separators where they improve structure.
- Images only where they add context or meaning; do not add decorative stock imagery to fill space.
- Consistent visual language across every page template.

### 5.3 Explicitly avoid

- Generic AI-generated portfolio aesthetics.
- Excessive gradients, neon glows, glassmorphism, and ornamental blur effects.
- Huge animated text or distracting motion.
- Unnecessary parallax, scroll-jacking, cursor effects, and entrance animations.
- Auto-rotating carousels.
- Pop-ups, intrusive prompts, or newsletter modals.
- Dense dashboard-like homepage layouts.
- Too many colours, typefaces, cards, shadows, pills, or decorative icons.
- Overly rounded UI on every element.
- A template-like grid of identical cards with no editorial hierarchy.
- Fake testimonials, invented social proof, fake metrics, or fabricated client logos.

### 5.4 Typography

Choose a small, deliberate type system:
- A distinctive but highly readable display/heading face.
- A highly legible body face for long-form reading.
- Optional mono face only for code or technical metadata.

Use a restrained number of font families and weights. Ensure fonts load efficiently and have sensible system fallbacks. Avoid very thin weights for body text.

### 5.5 Colour

The exact palette may be selected during implementation, but it must be restrained and accessible. A warm neutral or clean neutral foundation with dark readable text and one muted accent is a suitable direction. Do not commit to a loud colour scheme without showing the user a reasoned preview.

Support a coherent light theme first. Do not add a dark-mode toggle unless requested; it is not a v1 requirement.

### 5.6 Layout and components

Create a small design system with reusable components, for example:
- Site header and navigation.
- Mobile navigation.
- Footer.
- Page heading / introduction.
- Content list item.
- Featured work item.
- Metadata row.
- Topic label/link.
- Related work section.
- Table of contents.
- Citation/reference treatment.
- Pagination or “load more” only if genuinely needed.
- Call-to-action link.

Components should support editorial variation. Avoid making every content type look identical.

---

## 6. Responsive and mobile-first requirements

Mobile is the first design constraint because many visitors will arrive from LinkedIn on a phone. However, mobile-first does **not** mean mobile-only. Tablet and desktop must also be polished, particularly for long-form reading.

### 6.1 Required behaviour

- No horizontal page scrolling at supported viewport widths.
- No clipped headings, overflowing cards, or content wider than the viewport.
- Navigation is usable on small screens and keyboard-accessible.
- Touch targets are comfortably sized and spaced.
- Body text is readable without zooming.
- Images scale within their containers and preserve appropriate aspect ratios.
- Tables have a deliberate narrow-screen treatment; they must not silently force the entire page wider than the viewport.
- Code blocks can scroll internally when necessary, without creating page-level horizontal overflow.
- Long URLs and unbroken strings wrap safely.
- Layouts reflow naturally rather than merely shrinking desktop columns.
- Sticky elements must not consume too much mobile screen space or obscure content.
- No essential content or navigation is hidden only on mobile.

### 6.2 Design across screen sizes

**Mobile**
- Prioritize clear identity, a compact navigation pattern, readable text, and simple vertical flow.
- Use one-column layouts for most content.
- Keep content previews concise and scannable.
- Ensure controls and links are comfortable to tap.

**Tablet**
- Use the available width intelligently; do not stretch body text excessively.
- Introduce two-column layouts only where they improve hierarchy.
- Maintain comfortable reading measure and spacing.

**Desktop**
- Use a considered maximum content width.
- Use multi-column layouts selectively for listings and homepage composition.
- Long-form article text should remain at a readable measure rather than spanning the entire monitor.
- Use whitespace and hierarchy to make the experience feel composed, not sparse or oversized.

### 6.3 Responsive QA

Test at minimum:
- 320px and 360px narrow mobile widths.
- 375px / 390px common phone widths.
- 430px larger phone width.
- 768px tablet portrait.
- 1024px tablet / small laptop.
- 1280px and 1440px desktop.
- A wide desktop viewport.

Check both the top of each page and long-page states (tables, images, code, footer, navigation open). Use browser automation or responsive browser tooling when available. Do not claim responsive success based only on CSS inspection.

---

## 7. Content strategy and editorial integrity

### 7.1 Content identity

The website should represent a multidisciplinary body of work across research, writing, projects, and topics. Existing subject areas include:

- India's political economy and institutional architecture.
- India's macroeconomy, wealth, and labour.
- AI frontier technology and agentic commerce.
- Economics of value, money, and symbolic systems.
- AI-assisted building and solo development.
- Other topics represented in the source taxonomy.

Use the actual taxonomy and source content to establish the final public topic labels. Do not invent additional topic records or pretend the topic list is final until it has been audited.

### 7.2 Honest professional positioning

The source brief describes a BBA completed in 2024, project-based work involving web development, WordPress, and machine-learning pipeline work, and an AI engineering learning programme in progress. It also explicitly cautions against presenting training as employment or claiming expertise that has not been established.

Therefore:
- Do not call Goutam a currently employed AI engineer or ML engineer unless later confirmed.
- Do not claim independent coding proficiency, professional experience, certifications, or expertise without evidence.
- Do not invent employers, clients, users, revenue, scale, performance metrics, or project outcomes.
- Do not inflate the scope of personal contribution to a project.
- Where AI tools materially assisted research, writing, or implementation, use a clear and proportionate disclosure policy once the user approves the exact wording.
- Content should be something the author can explain and defend.

### 7.3 Research and writing quality

Research reports are long-form and cited. The reading experience must support:
- Clear title, summary, content type, date, and relevant metadata.
- Table of contents for long pieces.
- Stable section anchors.
- Legible citations and references.
- Responsive tables, figures, and code blocks.
- Related reports, essays, topics, and projects where relationships are verified.
- Clear distinction between source findings, the author's interpretation, hypotheses, and personal opinion when the content provides that distinction.

Do not rewrite or simplify existing research in a way that changes its meaning during migration.

### 7.4 Project case-study structure

Use this structure where the evidence exists:

1. Problem.
2. Context and constraints.
3. Approach and alternatives considered.
4. Architecture.
5. Technology used.
6. Implementation and what was AI-assisted versus personally done.
7. Challenges.
8. Outcomes and verifiable evidence.
9. Lessons learned.
10. Personal contribution.
11. Links to real repositories, demos, or related work.

Omit sections for which no reliable information exists. Do not fill gaps with generic claims.

---

## 8. Content inventory, IDs, relationships, and migration rules

### 8.1 Archive baseline — must be verified

The source master brief records a production archive baseline of **47 works**:
- 21 research reports.
- 21 blog/writing items.
- 3 projects.
- 2 pages.

It also notes that **3 sample/test records are excluded**. The source brief flags contradictory earlier audit data and an ID discrepancy. Treat 47 as the current audit baseline, **not as a count to hard-code without verification**. Reconcile against the original website repository, MDX files, archives, and PCIS records before migration.

### 8.2 Preserve stable IDs

Preserve existing IDs and prefixes (including RES, BLG, PRJ, PAG and any other IDs actually present). Do not renumber, reuse, or silently replace IDs. Keep the source ID available in the CMS schema even if it is not shown publicly.

### 8.3 Preserve relationships

Important known relationships include:
- Research report to derived blog post (`sourceReport`).
- Related content relationships.
- Topic associations.
- Collection / series membership where verified.
- External platform publication records.

The source brief reports approximately 32 topics across 5 domains and approximately 44 content relationships, with some relationships flagged for review. These are audit figures, not unquestionable final counts. Verify the underlying records.

Do not automatically publish relationships marked pending or requiring review. In particular, inspect the source brief's flagged relationship records and resolve them with the user before exposing them publicly.

### 8.4 Canonical work versus platform publication

Keep intellectual works separate from their publication instances:
- A canonical work belongs to the website's content library.
- A platform publication is an instance or adaptation on Medium, LinkedIn, or another platform.
- Keep `Canonical_URL` distinct from `Publication_URL`.
- Do not invent external publication URLs.
- Do not duplicate LinkedIn posts or external articles as separate website articles by default.
- Link to external versions where useful and where the URL is verified.

### 8.5 Migration source of truth

- Migrate from the original MDX / repository / archives and verify against the PCIS.
- Do **not** migrate solely from the PCIS workbook; the source brief records prior data-quality problems.
- Keep the original archive untouched during migration.
- Build a field mapping and migration report.
- Preserve content IDs, slugs, dates, citations, image assets, source links, and relationships where verified.
- Record missing or ambiguous metadata for review instead of guessing.
- Inventory all existing URLs and generate an old-to-new URL mapping.
- Preserve existing URL paths when practical. If paths change, implement permanent redirects.
- Validate internal links, external links, images, tables, footnotes, and citations after import.

### 8.6 Content scope still requiring verification

The source brief identifies a question about historical 2024 LinkedIn equity research and some pre-cutoff content. Do not silently include or exclude ambiguous material. Audit it and present a migration decision list.

---

## 9. CMS and publishing experience

### 9.1 User requirement

The existing Git-as-CMS / manual MDX workflow has been difficult because it requires editing Markdown/MDX, managing frontmatter, organizing files, and uploading through Git. The new workflow should provide a familiar admin dashboard and rich-text content editor.

### 9.2 Recommended CMS: Sanity

Use **Sanity Studio** as the content-management interface, subject to confirming current account setup and plan limits during implementation.

The intent is a clean dashboard with structured fields and a comfortable rich-text editor. Sanity's editor is customizable and block-based; it is not literally the WordPress Gutenberg editor. Configure it to be approachable and avoid exposing unnecessary technical complexity.

Suggested content types:
- Research Report.
- Writing / Article.
- Project.
- Topic.
- Publication (external platform instance).
- Page (About, Now, Elsewhere, Contact or other editorial pages).
- Collection / Series if needed by verified content.

Shared fields may include:
- Stable source ID.
- Title.
- Slug.
- Summary / excerpt.
- Content body.
- Content type.
- Publication / update dates.
- Topics.
- Related works.
- Source report / derived-from relationship.
- Canonical URL.
- External publication URLs.
- Featured image / media where appropriate.
- Draft / published state.

Use validation, sensible defaults, clear field descriptions, and editor previews. Do not expose every internal PCIS field in the editor unless it has a real publishing purpose.

### 9.3 Preview and publishing

Provide a practical preview workflow. Start with a reliable draft preview and enhance visual editing only if it is straightforward and useful. Do not delay the whole project for advanced visual editing.

Publishing should trigger the static site build and deployment. The editor should not need to edit code or manually run Git commands to publish an ordinary article.

### 9.4 Content export and backups

Keep regular exports/backups of Sanity content in a portable format such as JSON. Document how to export and restore content to reduce vendor lock-in. PCIS remains a separate internal content-intelligence system; no bidirectional sync is required for v1.

---

## 10. Technical architecture

### 10.1 Agreed working stack

| Layer | Choice | Rationale |
|---|---|---|
| Site framework | **Astro** | Content-first, static output, fast pages, minimal JavaScript |
| CMS | **Sanity** | Hosted structured content and rich editing dashboard |
| Hosting / deployment | **Cloudflare Pages** | Fits existing Cloudflare usage and supports static deployment |
| DNS / CDN | **Cloudflare** | Existing infrastructure |
| Styling | **Tailwind CSS plus a small custom design system** | Consistent responsive styling without a heavy UI framework |
| Language | **TypeScript** | Safer reusable components and content handling |
| Public site data | Static HTML generated at build time | No public-site database required for v1 |
| Contact | Simple email link initially | Avoid unnecessary form backend and paused database operations |

These are the agreed working choices from the planning conversation. Codex should verify current framework versions, integration compatibility, free-tier constraints, and deployment requirements before implementation. Do not silently substitute another stack.

### 10.2 Rendering and deployment model

Expected flow:

1. Content is created or edited in Sanity Studio.
2. Content is published.
3. A Sanity webhook or deploy hook triggers a Cloudflare Pages build.
4. Astro fetches published content from Sanity.
5. Astro generates static pages and assets.
6. Cloudflare Pages deploys the built site.

The public site should not require Supabase or a continuously running application server for ordinary content delivery.

### 10.3 JavaScript policy

- Prefer server/static rendering and native browser behaviour.
- Add client-side JavaScript only where a real interaction requires it (for example, mobile navigation or search).
- Avoid a full React application unless a specific component genuinely requires it.
- Do not add a database or complex backend for features that can be static.

### 10.4 Contact

The user currently dislikes the operational burden of a free Supabase project that pauses and needs reactivation. Do not make Supabase a dependency for v1.

Start with a clear email/contact link. If a form is requested later, choose a low-maintenance form/email delivery solution and include spam protection. Cloudflare Turnstile alone is bot protection; it does not deliver a message.

### 10.5 PCIS relationship

PCIS remains an internal content-intelligence system. For v1:
- Align the site's schema with stable IDs, topics, relationships, and publication records.
- Support a one-way export/import workflow when useful.
- Do not build AI integration, automated content generation, or bidirectional synchronization.
- Do not make the site dependent on the PCIS workbook being perfectly clean.

---

## 11. SEO, discoverability, and machine readability

The website should be straightforward for humans, search engines, and AI-assisted discovery systems to crawl and understand. Do not promise rankings or AI-system inclusion.

Implement:
- Unique, accurate page titles and meta descriptions.
- Descriptive, stable URLs.
- Canonical tags.
- XML sitemap.
- `robots.txt`.
- Semantic HTML and meaningful heading structure.
- Internal links between related content.
- Open Graph and social sharing metadata.
- Accurate structured data / JSON-LD where appropriate.
- Useful alt text for meaningful images.
- Crawlable text content; do not hide core content behind client-only rendering.
- Correct HTTP status codes and redirects.
- RSS as a later low-priority enhancement if practical.

Potential structured data types include `Person`, `WebSite`, `Article` / `BlogPosting`, and appropriate creative-work types. Use only markup that accurately reflects visible page content. Do not add unsupported credentials, job titles, awards, or ratings.

Google's AI search experiences rely on sound crawlability and SEO fundamentals; no special AI markup is a guaranteed shortcut. `llms.txt` may be considered as an optional supplementary file later, but it is not a v1 requirement and should not be represented as a guaranteed discovery mechanism.

If ChatGPT search visibility is desired, evaluate crawler access separately from any training crawler policy. Do not assume that search crawling and model-training crawling are the same permission.

---

## 12. Accessibility, performance, and reading experience

### Accessibility

Aim for **WCAG 2.2 AA** as the quality target.

At minimum:
- Semantic landmarks and heading order.
- Keyboard-operable navigation and controls.
- Visible focus states.
- Sufficient text and interface contrast.
- Labels and accessible names for controls.
- Descriptive link text.
- Alt text for meaningful images; empty alt for decorative images.
- Accessible tables with headers and captions where appropriate.
- Reduced-motion support; avoid unnecessary motion.
- No colour-only communication.
- Logical focus order and no keyboard traps.

### Performance

- Generate static pages where possible.
- Optimize image sizes and formats.
- Use responsive image delivery.
- Avoid shipping large JavaScript bundles.
- Load fonts efficiently.
- Prevent layout shifts by defining image dimensions/aspect ratios.
- Avoid unnecessary third-party scripts.
- Measure actual page performance after implementation.

### Long-form reading

Long reports are a central content type. Treat reading comfort as a core design requirement:
- A calm article column with a controlled maximum width.
- Comfortable body font size, line-height, paragraph spacing, and heading rhythm.
- A clear title / summary / metadata block.
- Contents navigation for long reports.
- Stable heading anchors.
- Readable references and citations.
- Responsive figures, tables, and code.
- Related work placed after the main reading flow.
- No intrusive sticky sidebar on small screens.
- On larger screens, optional supporting navigation may be used only if it improves reading and does not compete with the article.

---

## 13. Search and discovery

The approved sitemap includes a Search destination. Implement a simple, dependable search experience when practical for the first release or immediately after the core site is stable.

Search should:
- Search published site content only.
- Clearly distinguish Research, Writing, Projects, and Pages.
- Display useful title, excerpt, content type, and date.
- Work on mobile and keyboard.
- Have a useful empty state and no-results state.

Topic pages and verified relationships should provide the main browse/discovery system. Avoid semantic search, AI recommendations, personalization, graph visualizations, or complex filters in v1.

---

## 14. Features explicitly out of scope for v1

Do not add these unless the user later asks:
- Newsletter system or subscriber management.
- User accounts, comments, likes, or social feeds.
- AI chatbot or AI site assistant.
- Semantic / vector search.
- Personalization or recommendation engine.
- Interactive knowledge graph.
- Elaborate animations or custom cursor effects.
- Complex contact-form backend.
- Automated AI publishing.
- Two-way PCIS synchronization.
- Large analytics dashboard.
- Unnecessary dark-mode controls.
- Any feature whose main purpose is to look technically impressive rather than help visitors.

---

## 15. Implementation phases

### Phase 1 — Repository and source audit
- Inspect supplied repository and current live site if access is available.
- Identify current framework, routes, content files, assets, build scripts, deployment setup, and environment variables.
- Locate source MDX, archives, docs, PCIS exports, and existing URL patterns.
- Inventory content IDs, types, counts, dates, topics, relationships, citations, images, and external publication records.
- Produce an audit report with confirmed facts, discrepancies, missing assets, and unresolved decisions.
- Do not delete or overwrite original source material.

**Exit criteria:** The current site and migration sources are understood; content and URL risks are documented.

### Phase 2 — Content schema and migration plan
- Define Sanity schemas for verified content types.
- Map source fields to CMS fields.
- Define ID and slug preservation rules.
- Define canonical work vs. external publication records.
- Create old-to-new URL mapping and redirect plan.
- Identify records needing human review.
- Prepare a test migration and compare source/rendered content.

**Exit criteria:** User can review schema, migration mapping, and flagged data before full import.

### Phase 3 — Design system and page foundations
- Establish typography, colour, spacing, widths, breakpoints, and component rules.
- Build header, navigation, footer, page shell, links, metadata, content previews, and article typography.
- Implement responsive mobile navigation.
- Create representative homepage, listing, detail, project, topic, and About templates.
- Review visual quality at mobile, tablet, and desktop widths.

**Exit criteria:** The core visual system feels intentional and consistent, and representative pages are usable across screen sizes.

### Phase 4 — Astro and Sanity implementation
- Integrate Astro with Sanity.
- Implement data fetching and static generation.
- Implement preview workflow.
- Implement all agreed templates and navigation.
- Add SEO metadata, canonical tags, JSON-LD, sitemap, robots file, and redirects.
- Add search if feasible without destabilizing the core site.

**Exit criteria:** Content can be managed in Sanity and published as a working static site.

### Phase 5 — Content migration
- Run migration from original source files.
- Preserve IDs, slugs, dates, citations, assets, and verified relationships.
- Import topics and external publication references.
- Reconcile record counts and exclusions.
- Render and inspect representative long reports, articles, and project pages.
- Resolve or explicitly withhold records with uncertain metadata.

**Exit criteria:** Migration report reconciles source records to published records; no unexplained losses or invented content.

### Phase 6 — Quality assurance and launch
- Test responsive layouts at required widths.
- Test keyboard navigation and accessibility.
- Check page titles, descriptions, canonical URLs, sitemap, robots, redirects, and structured data.
- Check internal links, external links, images, citations, tables, and code blocks.
- Test build and deployment from a clean environment.
- Confirm contact route.
- Check performance and fix obvious issues.
- Verify the live site after deployment.

**Exit criteria:** No critical content, navigation, responsive, accessibility, or deployment defects remain.

### Phase 7 — Ongoing maintenance
- Document how to create, preview, publish, edit, and back up content.
- Document deployment and recovery steps.
- Export Sanity content periodically.
- Add new projects and research only with accurate metadata and evidence.
- Revisit PCIS one-way integration only when the data model is stable and the user wants it.

---

## 16. Definition of done / acceptance criteria

The rebuild is not complete merely because the homepage loads.

### Product and navigation
- [ ] All approved main navigation destinations work.
- [ ] Supporting pages are accessible through appropriate navigation/footer links.
- [ ] A visitor can identify the site owner and purpose quickly.
- [ ] Research, Writing, Projects, Topics, and About are easy to find.
- [ ] No dead-end pages or placeholder navigation items remain.

### Design and responsive behaviour
- [ ] The visual language is restrained, custom-feeling, and consistent.
- [ ] The website does not look like a generic AI portfolio template.
- [ ] Mobile layout is polished and easy to navigate.
- [ ] Tablet and desktop layouts are deliberately composed.
- [ ] No page-level horizontal overflow at tested viewport sizes.
- [ ] Long-form content remains readable at all supported widths.
- [ ] No unnecessary animation, pop-up, carousel, or visual gimmick is present.

### Content and migration
- [ ] Existing content has been audited and migrated according to an approved mapping.
- [ ] Stable source IDs are preserved.
- [ ] Canonical URLs and external publication URLs are not conflated.
- [ ] Verified relationships are preserved.
- [ ] Pending/uncertain relationships are not published as facts.
- [ ] Citations, tables, images, and internal links have been checked.
- [ ] No unsupported biography, credentials, outcomes, metrics, or claims have been added.
- [ ] Historical content scope decisions are documented.

### CMS and operations
- [ ] The owner can create and edit content through Sanity Studio without editing MDX manually.
- [ ] Required metadata fields are understandable and validated.
- [ ] Draft preview works.
- [ ] Publishing triggers a successful build/deploy.
- [ ] Content backup/export steps are documented.
- [ ] No Supabase dependency is required for v1.

### Technical quality
- [ ] Static pages are crawlable and have correct metadata.
- [ ] Canonical tags, sitemap, robots file, and redirects are verified.
- [ ] Structured data is accurate and matches visible content.
- [ ] Keyboard navigation and focus states work.
- [ ] No critical console errors or failed requests remain.
- [ ] Build succeeds from a clean checkout with documented environment variables.

---

## 17. Open items — do not silently assume

The following items need inspection or confirmation during implementation:

1. Exact current repository and framework details.
2. Existing URL patterns and the final URL strategy.
3. Exact content inventory and reconciliation of the 47-work baseline.
4. The three sample/test records and any other exclusions.
5. Final public topic list from the 32-topic / 5-domain taxonomy.
6. Status of relationships flagged for review.
7. Treatment of the historical 2024 LinkedIn equity research and any pre-cutoff items.
8. Exact homepage biography and positioning copy.
9. Which projects should be featured first and what evidence, repositories, or demos exist.
10. Exact AI-assistance disclosure wording.
11. Exact colour palette and font pairing, to be evaluated in a working visual preview.
12. Sanity account/project setup, dataset configuration, and current free-tier limits.
13. Cloudflare Pages project and domain configuration.
14. Whether basic search ships with the first release or immediately follows it.
15. Exact contact email or destination; do not invent one.

Where an item blocks implementation, ask one focused question or prepare a short decision note. Otherwise, proceed with a reversible, conservative default and document it.

---

## 18. Important source notes

This specification is based on:
- The uploaded `WEBSITE_REBUILD_MASTER_BRIEF.md`, prepared 20 November 2026.
- The planning conversation in which the user approved the proposed sitemap and overall direction, accepted the Astro + Sanity + Cloudflare Pages working plan, and specified the visual and responsive priorities.

The source master brief itself warns that some facts were reported by prior audit agents rather than independently verified, and that it contains data-quality discrepancies. Therefore, counts and relationships in this document are **audit targets**, not permission to invent or assume records.

### Core principle

**Build a beautiful, calm, dependable home for the work. Keep the experience simple. Make the content easy to discover and read. Preserve the evidence. Do not add complexity for its own sake.**
