# AGENTS.md — goutamprusty.com v2

## 1. Project authority

Before making changes, read:
`WEBSITE_BUILD_SPEC_FOR_CODEX.md`

This specification is the primary product, design, content,
architecture, migration, and quality reference.

Do not silently override approved decisions.

## 2. Approved technology

- Astro for the website.
- TypeScript.
- Tailwind CSS with a small custom design system.
- Sanity CMS for structured content and publishing.
- Cloudflare Pages for static deployment.
- GitHub for version control.

Do not substitute the framework or CMS without approval.

Do not introduce Supabase as a v1 dependency.

Avoid unnecessary React, databases, backend servers,
dependencies, animations, and client-side JavaScript.

## 3. Mandatory working procedure

For every substantial task:

1. Inspect the current project.
2. Read relevant documentation.
3. Check Git status and current branch.
4. Understand existing implementation.
5. Prepare a concise implementation plan.
6. Implement in small, coherent steps.
7. Run relevant tests and production builds.
8. Review the complete Git diff.
9. Commit a logical checkpoint.
10. Push tested work to its feature branch.
11. Report results and remaining issues.

Never claim a task is complete without verification.

## 4. Content integrity

Never invent:

- Biography or personal history.
- Educational credentials.
- Employment or professional experience.
- Clients or project ownership.
- Research findings or citations.
- Project outcomes or performance metrics.
- Publication dates or external URLs.

Preserve existing content, IDs, slugs, dates,
citations, relationships, and canonical URLs.

Flag uncertain information for human review.

Never delete original source archives during migration.

## 5. Design standards

The design must be:

- Editorial and understated.
- Mobile-first and fully responsive.
- Accessible and keyboard-friendly.
- Consistent across all page templates.
- Optimised for long-form reading.
- Restrained in colour, animation, and decoration.

Target WCAG 2.2 AA.

Avoid generic AI portfolio designs, excessive gradients,
glassmorphism, distracting animation, pop-ups,
unnecessary carousels, and dashboard-like layouts.

Do not add features outside the approved v1 scope.

## 6. Responsive quality

Test at:

320, 360, 375, 390, 430, 768, 1024,
1280, and 1440 pixels.

Check for:

- Horizontal overflow.
- Broken navigation.
- Unreadable typography.
- Clipped content.
- Oversized images.
- Responsive tables and code blocks.
- Keyboard accessibility.

Use actual browser testing where available.
Do not claim visual testing based only on CSS inspection.

## 7. Technical quality

- Use semantic HTML.
- Keep components reusable.
- Follow TypeScript conventions.
- Validate external data.
- Handle loading and error states.
- Optimise images and fonts.
- Avoid unnecessary dependencies.
- Keep public content statically rendered where possible.
- Implement SEO metadata and structured data accurately.

Never commit credentials, tokens, or real environment secrets.

Keep .env files out of Git.
Maintain .env.example without real secrets.

## 8. Git and GitHub safety

- Main is the stable production branch.
- Create a separate feature branch for each substantial task.
- Use meaningful commit messages.
- Commit after tested milestones.
- Review changes before committing.
- Push tested feature branches to GitHub.
- Never force-push.
- Never rewrite shared Git history.
- Never push experimental work directly to main.
- Never merge into main or deploy production without user approval.
- Never delete branches or repositories without approval.

Before destructive commands, explain the impact and obtain approval.

## 9. Testing and completion

Run applicable checks before declaring work complete:

- TypeScript checks.
- Linting.
- Unit tests.
- Build.
- Browser and responsive tests.
- Link and content validation.

Only run scripts that actually exist in package.json.

Do not hide, suppress, or bypass failing checks.

Report:
- What changed.
- Files affected.
- Tests executed.
- Tests passed or failed.
- Git commit and push status.
- Remaining risks or decisions.

## 10. Autonomous working behaviour

Work independently on clearly authorised tasks.

Do not stop after every small file change.

Complete logical milestones before reporting progress.

Ask the user when a decision affects:
- Architecture.
- Content accuracy.
- Data migration.
- Security.
- Production deployment.
- Irreversible operations.

If blocked, explain the specific blocker and propose
the safest next step.

## Core principle

Build a beautiful, calm, dependable home for the work.

Keep the experience simple.
Make content easy to discover and read.
Preserve evidence.
Do not add complexity for its own sake.
