# goutamprusty.com: Website Theme & UI/UX Design System

**Document date:** 22 November 2026
**Purpose:** a standalone design-system handoff, so another AI coding assistant or team can build a separate project (for example on a subdomain) that looks and feels like it belongs to the same product ecosystem.
**Author's note:** this document records the design as it was actually decided and built in conversation. It does not propose a new theme. Where a value was never specified, the document says so instead of guessing.

---

## 0. Read this first

### 0.1 Which "existing website" this describes

This document describes the **V2 rebuild** of goutamprusty.com. V2 is still in development. It is **not launched**. The live site today is the older V1 (a Next.js site), and **V1's look is not documented here**.

V2 currently contains two visual layers:

| Layer | Where | Status |
|---|---|---|
| **"Paper & Signal"** | `/design-exploration/paper-signal/` (home, project, research, about prototypes) | **The approved target identity.** This is what the new project should follow. |
| **Phase 2 "editorial design system"** | The real routes (`/`, `/research/`, `/writing/` and so on) | The earlier look: warm paper, dark ink, muted gray and a restrained green accent. It is **being superseded** by Paper & Signal. |

Applying Paper & Signal to the real routes is planned but not yet done. Once that happens, re-verify this document against the code.

### 0.2 Evidence labels

| Label | Meaning |
|---|---|
| **CONFIRMED** | Explicitly decided by the owner, stated in the build specification, or reported from the implemented code |
| **REPORTED** | Stated in an agent's summary of the code. The code itself was not seen while writing this document |
| **INFERRED** | A reasonable deduction from confirmed information. Treat as a default, not a rule |
| **NOT SPECIFIED** | No value exists in the conversation. Do not invent one; verify from source (section 0.3) |

### 0.3 Where the exact values live (verify before building)

The codebase is the final authority for exact values. Everything below is confirmed to exist at commit **`97f3a16`** on branch `codex/paper-signal-prototype` of the private repository `goutam-prusty/goutamprusty-v2`:

- `src/styles/paper-signal.css` (about 150 lines; the isolated Paper & Signal tokens and styles)
- `src/styles/global.css` (Phase 2 global typography, focus and link states)
- `src/layouts/PaperSignalLayout.astro` (Paper & Signal shell and navigation)
- `src/components/SiteHeader.astro` (production header and mobile navigation)
- `src/components/VisualFigure.astro`, `ContentPreview.astro`, `ContentList.astro`, `RelatedWork.astro`, `TableOfContents.astro`
- `src/layouts/DetailLayout.astro`, `ListingLayout.astro`
- `src/pages/design-exploration/paper-signal/*.astro` (the four prototype pages)

**First task for whoever builds the new project:** read those files and fill every **NOT SPECIFIED** value in this document. A ready-to-use prompt is in section M.4.

### 0.4 Largest gaps (details in each section)

- **Exact font-family stacks** and the **type scale** (sizes, weights, line heights, letter spacing)
- **Border radius, shadows and transitions**
- **Container widths and the spacing scale**
- **State colors** (hover, active, disabled, success, warning, error)
- Button and form specifics, plus all components that were never built (modals, tabs, dropdowns and others)

---

## A. Design Philosophy & Visual Identity

### A.1 Philosophy

- **Understated, thoughtful, editorial and professional.** The look comes from typography, spacing, hierarchy and restrained details, not from visual effects (CONFIRMED, spec 5.1).
- **Distinctive but not loud, professional but not corporate, visually interesting but not distracting** (CONFIRMED, the brief that defined Paper & Signal).
- **Subtle impact.** A visitor should be intrigued, never feel marketed to. The owner: "We are not going to do that [marketing]… It should be subtle, and it should capture attention."
- **Minimalism is not an excuse for being boring.** The first version felt like "a simple newspaper" or a 90s text site. The owner asked for more personality and discovery without making the site "fancy" (CONFIRMED).
- **The homepage is a front door, not a different website.** The hero may carry more personality, but the whole site must stay one coherent identity, and reading pages must stay calm (CONFIRMED).

### A.2 Personality

Curious, calm, credible, a little playful in shape and color, never salesy. Thoughtful and editorial, like an independent publication crossed with a personal studio.

### A.3 Core principles

1. **Light theme only.** No dark mode and no theme toggle (CONFIRMED, owner and spec).
2. **Pastel foundation with one selective bright accent.** The owner asked for pastels as the base and a neon or brighter accent on top, but "not too much contrast."
3. **Reading comes first on content pages.** Long-form pages use a controlled reading measure and minimal decoration.
4. **Restraint.** Few colors, few type families, few shadows, few shapes.
5. **Mobile-first and responsive.** Many visitors arrive from LinkedIn on a phone.
6. **Minimal JavaScript.** Native browser behavior wherever possible.
7. **Accessibility is a requirement,** not a polish step (target WCAG 2.2 AA).
8. **Honesty.** Placeholder content is always labeled as such. No fake testimonials, metrics or engagement numbers.

### A.4 What the design must not become (CONFIRMED)

Spec 5.3 and the owner's feedback rule out:

- generic AI-portfolio aesthetics or a SaaS-landing-page look
- excessive gradients, neon glows, glassmorphism and blur effects
- huge animated text, parallax, scroll-jacking, cursor effects, entrance animations
- auto-rotating carousels, pop-ups and newsletter modals
- dense, dashboard-like homepages
- too many colors, typefaces, cards, shadows, pills or decorative icons
- overly rounded UI on every element
- identical card grids with no editorial hierarchy
- random stock imagery

The owner also rejected, as "too fancy," dark hero sections, heavy 3D or interaction effects and strongly high-contrast schemes.

---

## B. Color System

### B.1 Paper & Signal palette (CONFIRMED values; tokens were specified in the implementation brief and reported as implemented)

| Role | Name | HEX | RGB |
|---|---|---|---|
| Page background | Warm paper | `#F7F4EC` | 247, 244, 236 |
| Surface (cards, panels) | Surface | `#FDFCF8` | 253, 252, 248 |
| Sunken surface (code, table header areas, wells) | Sunken | `#EFEBDF` | 239, 235, 223 |
| Primary text / ink | Ink | `#17191A` | 23, 25, 26 |
| Secondary text | Secondary ink | `#4A4F4C` | 74, 79, 76 |
| Border (as brief) | Border | `#DDD8CB` | 221, 216, 203 |
| Border (as implemented) | Border, darkened | `#827D71` | 130, 125, 113 |
| Projects | Peach | `#F4D9C6` | 244, 217, 198 |
| Research | Blue | `#D2E0EA` | 210, 224, 234 |
| Writing | Sage | `#D5E2D0` | 213, 226, 208 |
| Accent ("Signal") | Lime | `#D3F03C` | 211, 240, 60 |

**Border:** the original `#DDD8CB` was **darkened to `#827D71`** during implementation so that borders reach about 3:1 against paper and pastel surfaces (REPORTED: at least 3.04:1). Use `#827D71` for borders that must be visible. The lighter value is only for non-essential, decorative dividers (INFERRED).

### B.2 How the colors are used

- **Paper `#F7F4EC`:** the dominant background everywhere. "Keep the paper background as the dominant colour."
- **Surface `#FDFCF8`:** raised content containers.
- **Sunken `#EFEBDF`:** recessed areas such as code and quiet wells (INFERRED from the name and role).
- **Ink and secondary ink:** all text. Never place pale colors on essential text.
- **Pastels as content-type colors (CONFIRMED semantics):**
  - peach = Projects
  - blue = Research
  - sage = Writing

  They tint panels, cards and section bands. They are **backgrounds, never text colors.**
- **Lime `#D3F03C`:** "punctuation, not wallpaper." Use it **selectively as a fill or highlight with dark text and an appropriate border.** It is also part of the keyboard focus treatment (section H). Do not use lime as text on light backgrounds.
- **Dark ink as a surface:** the prototype homepage closes with a **dark contact section** (REPORTED from the review). The exact background value was not stated. Ink `#17191A` is the likely value (INFERRED). This is a single closing band, not a dark theme.

### B.3 Verified contrast (REPORTED)

| Pair | Ratio |
|---|---|
| Ink on lime | 13.69:1 |
| Primary and secondary text on paper and tested pastel surfaces | above 6:1 |
| Border `#827D71` on those surfaces | at least 3.04:1 |

Run a fresh contrast audit for any new color pairing.

### B.4 State colors

| State | Value |
|---|---|
| Hover | **NOT SPECIFIED** |
| Active | **NOT SPECIFIED** |
| Focus | Dark outline plus lime shadow (REPORTED; exact widths **NOT SPECIFIED**) |
| Disabled | **NOT SPECIFIED** (disabled action-link styling exists in Phase 2 code) |
| Success | **NOT SPECIFIED** |
| Warning | **NOT SPECIFIED** |
| Error | **NOT SPECIFIED** |
| Link color and visited state | **NOT SPECIFIED** |

If the new project needs success, warning or error colors, define them with the owner and keep them within the muted, accessible character of this palette. Never use color alone to communicate state.

### B.5 Phase 2 palette (legacy in the repo)

Warm off-white paper, dark ink, muted gray and **one restrained green accent**. The demo page showed five swatches. **Exact values are NOT SPECIFIED in the conversation.** Paper & Signal supersedes this. The owner liked the earlier color combination but wanted pastels with a brighter accent.

---

## C. Typography System

### C.1 Families (CONFIRMED direction, exact stacks NOT SPECIFIED)

| Role | Direction |
|---|---|
| Display and headings | A **serif** (system stack) |
| Body and interface | A **sans-serif** (system stack) |
| Metadata and code | **Monospace** only for code or short technical metadata labels (spec 5.4; the Paper & Signal brief proposed "a restrained monospace treatment for short metadata labels." Whether it was implemented is **NOT SPECIFIED**.) |

- Both families use **operating-system stacks. No fonts are downloaded and there is no font dependency.** (REPORTED, Phase 2 and the prototype.)
- The exact `font-family` strings are **NOT SPECIFIED. Copy them from the CSS files in section 0.3 and do not substitute web fonts without the owner's approval.**
- Spec rules: a restrained number of families and weights, sensible fallbacks, and **no very thin weights for body text.**

### C.2 Hierarchy and scale

| Element | Direction | Exact values |
|---|---|---|
| Hero headline | Large serif. The prototype headline is "Curiosity, made useful." | **NOT SPECIFIED** |
| H1–H6 | Serif headings, clear hierarchy, comfortable rhythm | **NOT SPECIFIED** |
| Body | Sans, comfortable for long reading | **NOT SPECIFIED** |
| Secondary text, captions, labels | Secondary ink `#4A4F4C` | **NOT SPECIFIED** |
| Buttons and links | Not specified beyond the above | **NOT SPECIFIED** |
| Line height, letter spacing, text-transform | Not specified | **NOT SPECIFIED** |

**Conventions that are confirmed:**

- Long-form text sits at a **controlled maximum width, not full width** (spec 12).
- Comfortable body size, line height, paragraph spacing and heading rhythm are required.
- Headings have stable anchors on long reports.
- Source H1 headings in migrated articles are preserved as written. The page title hierarchy is handled by the presentation layer.

---

## D. Layout & Spacing System

### D.1 Confirmed layout principles

- A **considered maximum content width** on desktop. The numeric value is **NOT SPECIFIED.**
- Long-form article text stays at a readable measure, never the full monitor width.
- Whitespace is "generous but purposeful." Consistent spacing, alignment and widths throughout.
- Layouts **reflow** instead of shrinking desktop columns.
- No page-level horizontal overflow at any supported width.

### D.2 Known dimensions (REPORTED)

| Value | Meaning |
|---|---|
| `34rem` | Width below which the Paper & Signal navigation becomes a full-width stacked menu |
| `2.75rem` | Minimum mobile tap-target size (44px at a 16px root) |
| `640px` | Width below which the Phase 2 palette grid becomes two columns with the fifth swatch spanning the row |
| `34rem` | Minimum width of a Research comparison table inside its scroll wrapper |

All other widths, padding and margins are **NOT SPECIFIED.**

### D.3 Layout patterns by screen size

- **Mobile:** one column, text-first, content previews concise and scannable.
- **Tablet:** use the width sensibly. Introduce two columns only where hierarchy benefits, and keep a comfortable reading measure.
- **Desktop:** a composed layout, multi-column only selectively (homepage composition and listings).
- **Content density:** airy and editorial, never dashboard-like. The first screen establishes identity. The rest of the homepage invites exploration.

### D.4 Page-level conventions (prototype, REPORTED/observed)

- **Homepage:** compact header, text-first hero, geometry composition, two project cards in a two-column desktop layout, a split Research and Writing section, topics or interests, a short intro, then a dark contact section and the footer.
- **Detail pages (research and project):** a title and metadata block, a **sticky contents panel on desktop that moves above the article on narrow screens**, a narrow reading column, and related work at the end.
- Spacing scale and grid specifics: **NOT SPECIFIED.**

---

## E. Component Design System

Components marked **(built)** exist in the V2 code. Components marked **(not built)** have no design decisions yet. Do not invent one without the owner.

### E.1 Header and navigation (built)

- **Wordmark plus a "Menu" control.**
- **Desktop:** an understated navigation row.
- **Mobile:** a **native `<details>/<summary>` disclosure** with a visible close control. It uses an explicit `aria-controls`, an expanded-state icon treatment, and no JavaScript.
- **Paper & Signal mobile menu:** a full-width stacked list below `34rem`, with `2.75rem` tap targets. The panel overlays the page with comfortable spacing.
- **Links (prototype order):** Home, Projects, Research, Writing, Topics, About, plus **Contact as a separate call to action.** The approved information architecture order is Home, Research, Writing, Projects, Topics, About. Follow the approved order in the new project unless told otherwise.
- **Active link:** `aria-current="page"`, matched by exact path for the prototype. In the production header, section links match their index and nested routes after trailing-slash normalization, and Home matches only `/`. The visible treatment is an **underline** (observed on Home).
- A **skip link** and a labeled navigation landmark.

### E.2 Footer (built)

Simple, stacked on mobile. Exact content, colors and spacing: **NOT SPECIFIED.**

### E.3 Buttons and links (built, partly)

- **Hierarchy:** one primary call to action and one quieter secondary link in the hero ("Explore my work" and "Research" in the prototype).
- Phase 2 includes **action links with a disabled style.**
- Lime is the accent fill (INFERRED for the primary button). Dark text on lime, with a border.
- Radius, padding, font weight, hover and active states: **NOT SPECIFIED.**

### E.4 Cards and content containers (built)

- **Selected-work cards:** pastel-tinted by content type (peach for projects) with a visual area.
- **Content previews:** `ContentPreview` supports an optional image slot. A **metadata row** shows type and date.
- **Lists and related work:** `ContentList`, `RelatedWork`.
- **Topic and collection previews:** more structured than plain lists.
- **Rule:** do not turn every page into the same grid of identical cards. Use hierarchy and variation.
- Border radius, shadow and padding: **NOT SPECIFIED.**

### E.5 Page introduction and metadata (built)

`PageIntro` (title and summary) and a metadata row (content type, date, reading time). The owner explicitly accepts **reading time calculated from real word count**, and does **not** want view counts unless real analytics exist.

### E.6 Figures and images (built)

`VisualFigure` supports a verified image (with alt text) or a clearly labeled **development-only placeholder** (image, figure, diagram or chart). Figures have captions and are optional. Pages without visuals must stay elegant.

### E.7 Tables (built)

- Tables **scroll inside their own bordered container** (a keyboard-focusable region with an accessible name, class `.ps-table-wrap`) with touch momentum scrolling and overscroll containment.
- The page body clips horizontal overflow, so a table can never widen the page.
- Table cells can contain rich inline content, including inline formula images.
- Header semantics, captions and header cells are required for accessibility.

### E.8 Code blocks (built)

Scroll inside their own focusable, named region. Monospace. Code is never transformed.

### E.9 Table of contents (built)

A "contents" panel for long reports: sticky on large screens, above the article on small ones. Stable heading anchors.

### E.10 Citations and references (built)

Inline citation markers keep their original text and position. Bibliographies keep their original order and wording. The visual styling is **NOT SPECIFIED.**

### E.11 Icons

No icon library was chosen. The only confirmed icon treatment is the expanded or collapsed indicator on the mobile menu. Spec guidance: avoid "too many… decorative icons." Style, size and stroke: **NOT SPECIFIED.**

### E.12 Components with no design (not built, NOT SPECIFIED)

Forms and inputs, dropdowns, **modals and dialogs, tabs, tooltips, notifications and alerts, breadcrumbs, pagination, loading indicators, sidebars.** Constraints that do exist:

- **No pop-ups, newsletter modals or intrusive prompts** (spec).
- Pagination or "load more" **only if genuinely needed.**
- **Contact is a plain email link in v1.** No form has been designed.
- **Search:** the page structure exists, but the functionality is not implemented. Requirements: clearly distinguish Research, Writing, Projects and Pages; show title, excerpt, content type and date; work by keyboard and on mobile; provide an empty state and a no-results state.
- **404 page (built):** helpful recovery and navigation.
- **Empty and error states:** no visual treatment has been defined.

---

## F. Border Radius, Shadows & Visual Effects

| Aspect | Specification |
|---|---|
| Border radius for cards, buttons, inputs | **NOT SPECIFIED.** Constraint: avoid "overly rounded UI on every element" and excess "pills" (spec 5.3) |
| Shadows | **NOT SPECIFIED.** Constraint: avoid "too many… shadows." The only confirmed shadow is the lime keyboard-focus shadow (section H) |
| Borders | Subtle borders or separators "where they improve structure." Fine, thin lines. Border color `#827D71` for visible boundaries. Width **NOT SPECIFIED** |
| Elevation hierarchy | **NOT SPECIFIED** |
| Gradients | **Avoided.** None are part of the identity |
| Blur, transparency, glass | **Avoided** |
| Distinctive graphics | **Geometric shapes:** arch, circle, half-circle, quarter-circle, ring, composed in pastels with lime accents. Used for recognition and composition, never as random decoration |

---

## G. Iconography & Graphics

- **Icons:** see E.11. No library, size or stroke weight established.
- **Geometric visual language (CONFIRMED):** arch, circle, half-circle, ring, in pastel fills with selective lime. The prototype hero uses an abstract composition of these. A **real portrait in an arch-shaped composition** is the intended future version. **The portrait is optional.** If no portrait is available, use geometry only, and never generate or invent a portrait.
- **Images:** WebP. Meaningful images require alt text. No decorative stock imagery.
- **Placeholders:** always labeled development-only. Never present a placeholder as real content.
- **Formula images:** transparent lossless WebP, shown inline at intrinsic size.
- **Cover images, aspect ratios, image corner radius:** **NOT SPECIFIED.**
- **Illustration style:** none beyond the geometry. **Charts and diagrams:** pastel-tinted sections (the project page uses a blue-tinted architecture section) with captions.

---

## H. Interaction & Micro-interactions

| Aspect | Specification |
|---|---|
| Overall | **Minimal.** "Not too interactive… make it interactive enough" on the homepage only. No elaborate motion |
| Navigation | Native disclosure (`<details>`), no JavaScript |
| Keyboard focus | Visible. **Dark outline plus lime shadow** (REPORTED). Offsets and widths **NOT SPECIFIED** |
| Hover, click, active | **NOT SPECIFIED** beyond defined link states in the shared styles |
| Transitions and durations | **NOT SPECIFIED.** Constraint: no unnecessary motion |
| Reduced motion | Supported. A `prefers-reduced-motion` rule exists (REPORTED) |
| Carousels | **Not used.** A small, **manual** project carousel was discussed. It would need swipe, keyboard buttons and no autoplay. With only a few strong projects, a static layout is preferred. Revisit later |
| Loading, validation, feedback | **NOT SPECIFIED** (no forms exist yet) |
| Disallowed | Autoplay, parallax, scroll-jacking, custom cursors, entrance animations, 3D, background video |

JavaScript is allowed only for a real need, for example search or a manually controlled carousel. All essential content must work without it.

---

## I. Responsive Design Guidelines

### I.1 Tested widths (spec 6.3)

320, 360, 375, 390, 430, 768, 1024, 1280, 1440, plus a wide desktop. **Note:** exact-width browser QA has never been fully completed in this project. Only checks at the available viewport and manual checks by the owner have been done.

### I.2 Known breakpoints

- **`34rem`:** Paper & Signal navigation changes to a stacked menu.
- **`640px`:** the Phase 2 palette grid becomes two columns. (Equal to Tailwind's default `sm`. Whether the project uses Tailwind's default scale is **INFERRED**, not confirmed.)
- All other breakpoints: **NOT SPECIFIED.**

### I.3 Behavior (CONFIRMED)

| Area | Mobile | Desktop |
|---|---|---|
| Navigation | Disclosure menu, stacked, 2.75rem targets | Row of links |
| Homepage hero | Text first, geometry or portrait beneath at roughly 65–75% of the screen width (proposal) | Text and composition side by side |
| Work cards | Stacked, one column | Two columns |
| Research and Writing previews | Compact, stacked | Split two-column section |
| Contents panel | **Above** the article, not sticky | **Sticky** beside the article |
| Tables and code | Scroll within their own container | Same |
| Tap targets | At least 2.75rem | n/a |

Rules from the spec: no horizontal page scroll, no clipped headings, sticky elements must not consume much mobile space, long URLs wrap, and no essential content is hidden only on mobile. The first project preview should appear early in the mobile scroll.

---

## J. Page Structure & UI Patterns

### J.1 Recurring layouts

1. **Homepage** (front door): text-first hero, evidence (selected work), exploration (research and writing, topics), a short intro, then a dark contact band.
2. **Listing page** (`ListingLayout`): a page intro, then a list or preview of items with type and date labels.
3. **Detail page** (`DetailLayout`): title, metadata, abstract or summary, contents panel, long-form body, figures, references, then related work.
4. **Project case study:** a prominent visual, metadata (status, role, technology), then problem, approach, architecture diagram, implementation, evaluation, limitations and related work.
5. **Research article:** title, metadata, abstract, contents, narrow reading column with figures and tables, references and related research.
6. **Supporting pages:** About, Now, Elsewhere, Contact, Search, 404, using the shared shell and page introduction.

### J.2 Conventions for new pages

- Same shell (header, footer, skip link), same page-intro pattern, same metadata row.
- Reading pages are calmer than the homepage. Do not bring homepage treatments into long-form body text.
- Use content-type colors consistently (peach, blue, sage). Do not reuse them for unrelated meanings.
- Use a variety of arrangements. Do not repeat one card grid everywhere.

---

## K. Accessibility & Usability Guidelines

### K.1 Existing conventions (CONFIRMED / REPORTED)

- **Target: WCAG 2.2 AA.**
- Semantic landmarks and heading order, a skip link, a labeled nav, `aria-current="page"` on the active link.
- Visible keyboard focus. Native disclosure with `aria-controls`.
- Scrollable tables and code are keyboard focusable and have accessible names.
- Tap targets of at least 2.75rem on mobile.
- Alt text for meaningful images. Placeholders are labeled.
- Reduced-motion support. No color-only communication.
- Verified contrast ratios (section B.3).
- Descriptive link text. Table headers and captions where appropriate.

### K.2 Additional recommendations (not yet confirmed)

- Re-run a contrast audit on any new color pairing, and on state colors once chosen.
- When forms are added, give every control a visible label and an error message that does not rely on color alone.
- Confirm keyboard operation and screen-reader behavior with an actual test, not only by reading CSS.

---

## L. Design Tokens & Implementation Reference

**Naming note:** token names below are **suggested**, because the original token names were not in the conversation. Values marked "confirmed" come from the conversation. Everything else is **NOT SPECIFIED.** Align the names with `src/styles/paper-signal.css` when it is read.

```css
:root {
  /* Color: confirmed values */
  --color-paper:        #F7F4EC;  /* page background */
  --color-surface:      #FDFCF8;  /* raised surfaces */
  --color-sunken:       #EFEBDF;  /* recessed areas */
  --color-ink:          #17191A;  /* primary text */
  --color-ink-muted:    #4A4F4C;  /* secondary text */
  --color-border:       #827D71;  /* visible borders (darkened from #DDD8CB) */
  --color-border-soft:  #DDD8CB;  /* original, lighter border value (use sparingly) */
  --color-project:      #F4D9C6;  /* peach  = Projects */
  --color-research:     #D2E0EA;  /* blue   = Research */
  --color-writing:      #D5E2D0;  /* sage   = Writing  */
  --color-signal:       #D3F03C;  /* lime accent, always with dark text */

  /* Color: states (NOT SPECIFIED) */
  --color-hover:        /* NOT SPECIFIED */;
  --color-active:       /* NOT SPECIFIED */;
  --color-disabled:     /* NOT SPECIFIED */;
  --color-success:      /* NOT SPECIFIED */;
  --color-warning:      /* NOT SPECIFIED */;
  --color-error:        /* NOT SPECIFIED */;

  /* Focus (reported: dark outline + lime shadow; widths NOT SPECIFIED) */
  --focus-outline-color: var(--color-ink);
  --focus-shadow-color:  var(--color-signal);
  --focus-outline-width: /* NOT SPECIFIED */;
  --focus-shadow-size:   /* NOT SPECIFIED */;

  /* Typography */
  --font-display: /* serif system stack: NOT SPECIFIED, copy from source */;
  --font-body:    /* sans system stack:  NOT SPECIFIED, copy from source */;
  --font-mono:    /* NOT SPECIFIED; use only for code and short metadata */;
  /* Type scale, weights, line heights, letter spacing: NOT SPECIFIED */

  /* Layout: confirmed dimensions */
  --tap-target-min:      2.75rem;  /* mobile minimum */
  --nav-stack-breakpoint: 34rem;   /* prototype nav becomes stacked below this */
  --table-min-width:     34rem;    /* research table inside its scroll wrapper */
  --content-max-width:   /* NOT SPECIFIED */;
  --reading-measure:     /* NOT SPECIFIED */;

  /* Spacing scale, radius, shadow, border width: NOT SPECIFIED */
  --radius-card:   /* NOT SPECIFIED */;
  --radius-button: /* NOT SPECIFIED */;
  --radius-input:  /* NOT SPECIFIED */;
  --shadow-card:   /* NOT SPECIFIED (use none unless confirmed) */;
  --border-width:  /* NOT SPECIFIED */;
}
```

**Breakpoint tokens:** only `34rem` (nav) and `640px` (Phase 2 palette grid) are known. The rest are **NOT SPECIFIED.**

**Component tokens:** none specified.

**Tooling:** Tailwind CSS v4 (via `@tailwindcss/vite`) with a small custom design system in plain CSS, on Astro with TypeScript. A new project on a different stack should still use CSS custom properties for the tokens above.

---

## M. Implementation Guidelines for the New Project

### M.1 Must stay consistent with the main site (do not change without approval)

- The **light-only** paper-and-pastel palette, and lime used sparingly with dark text
- Pastel **content-type coloring** (peach, blue, sage)
- Serif display plus sans body, restrained families, no thin body weights
- The geometric shape vocabulary (arch, circle, half-circle, ring)
- Calm, reader-first content layouts with a controlled measure
- Native, accessible navigation with `aria-current`, skip links and visible focus
- Mobile-first reflow, with tables and code scrolling inside their own containers
- Minimal JavaScript and reduced-motion support
- The "avoid" list in section A.4

### M.2 Can adapt to the new project

- Page content, information architecture and navigation items (keep the pattern, not the labels)
- Which content-type colors to use. Add a **new semantic color only through the owner**, and only with a verified contrast check.
- Illustrations and images specific to the product
- Component set. Build new components (forms, tables, dashboards) in the same visual language.
- The wording of the hero, which is placeholder in the main site

### M.3 How to build it

1. Start from the **tokens** in section L, with the exact values filled in from the source files.
2. Build the small set of shared primitives first: shell, header with a native disclosure menu, footer, page intro, metadata row, content preview, action link, figure, table wrapper, code wrapper.
3. Reuse those everywhere. Add a variant only when a real need appears.
4. Check every new color pair for contrast. Test every interactive control by keyboard.
5. Prefer variety in layout over the same card repeated.
6. If a decision is missing here, **ask or document the gap. Do not invent a value.**

**Cross-project sharing (recommendation):** keep the tokens in one file and copy or package them, so changes are made in one place. Do not let the two projects drift.

### M.4 Ready-to-use prompt: fill the gaps from source

> Read these files in `goutam-prusty/goutamprusty-v2` at commit `97f3a16` (branch `codex/paper-signal-prototype`): `src/styles/paper-signal.css`, `src/styles/global.css`, `src/layouts/PaperSignalLayout.astro`, `src/components/SiteHeader.astro`, `src/components/VisualFigure.astro`, `src/components/ContentPreview.astro`, and the four pages under `src/pages/design-exploration/paper-signal/`. For every item marked **NOT SPECIFIED** in `WEBSITE_THEME_AND_UI_UX_DESIGN_SYSTEM.md`, report the exact value found in the code, or state that none exists. Do not change any file. Do not invent values. Report only what the code contains, with file and line references.

---

## N. Quick Reference: Design Rules

**Must follow**

- Light only. Paper `#F7F4EC` is the dominant background.
- Text is ink `#17191A` or secondary ink `#4A4F4C`. Never pale on pale.
- Pastels (peach, blue, sage) are backgrounds, mapped to content types.
- Lime `#D3F03C`: sparingly, as a fill or highlight with dark text.
- Visible borders use `#827D71`.
- Serif for display, sans for body, system stacks, no thin body weights.
- Reading text sits in a controlled-width column.
- Native details/summary navigation, `aria-current`, skip link, visible focus.
- Tap targets of at least `2.75rem` on mobile.
- Tables and code scroll within their own containers. No page-level horizontal scroll.
- Label every placeholder as such.

**Do not**

- No dark mode, toggle or dark hero.
- No gradients, glassmorphism or blur.
- No autoplay carousels, parallax, scroll-jacking or entrance animations.
- No pop-ups or newsletter modals.
- No random stock imagery.
- No invented metrics, view counts or testimonials.
- No new colors, fonts or radii without approval.
- No heavy shadows, no pills and no over-rounding everywhere.
- No dashboard-like density.

**Consistency**

- One shell, one page-intro pattern, one metadata row, one set of tokens.
- Homepage energy stays on the homepage. Reading pages stay calm.

**Responsive**

- Mobile first. Reflow rather than shrink.
- Contents panel above the article on small screens and sticky on large screens.
- Two-column work and preview layouts only on larger screens.

**Component reuse**

- Reuse the shared primitives. Add variants only for real needs.
- Mirror the pastel-by-content-type pattern for new content kinds, after owner approval.

---

## Appendix: Source notes

- Values come from the implementation brief and Paper & Signal token specification, the Codex and Antigravity implementation reports, the project's build specification (sections 5, 6, 12), and the owner's stated preferences.
- The owner's explicit preferences take priority over any other source. The most recent decision wins.
- This document does not describe business content or functionality except where it affects layout.
