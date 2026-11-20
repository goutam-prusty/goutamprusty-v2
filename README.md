# goutamprusty.com — Version 2.0

Rebuilding the personal website, professional portfolio, research
library, and editorial publishing platform.

## Technology

- Astro
- TypeScript
- Tailwind CSS
- Sanity CMS
- Cloudflare Pages
- GitHub

## Project specification

Read `WEBSITE_BUILD_SPEC_FOR_CODEX.md` before making architectural
or implementation decisions.

## Development principles

- Mobile-first, editorial design.
- Semantic HTML and accessible interfaces.
- Minimal client-side JavaScript.
- Preserve historical content, IDs, citations, and URLs.
- Never fabricate biography, credentials, research, or project results.
- Prefer maintainable solutions over unnecessary complexity.

## Project status

Application foundation established. Content migration, Sanity Studio, and
Cloudflare Pages configuration are deliberately deferred to later approved
phases.

## Local development

Requires Node.js 22.23.4 or later.

```sh
npm install
npm run dev
```

Run `npm run check` for Astro and TypeScript validation, and `npm run build`
to create the static production output in `dist/`.

## Environment variables

No environment variables are required for the application foundation. Future
public build-time values must use Astro's `PUBLIC_` prefix; private credentials
must remain in untracked `.env` files. Never commit real values. An
`.env.example` will be added only when a required non-secret variable exists.

See `AGENTS.md` for project-specific development instructions.
