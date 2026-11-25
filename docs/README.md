# Project Documentation Index

This repository is the single source of truth for all `goutamprusty.com` v2 project documentation. All future project documentation must be stored inside `docs/` (or the repository root for `AGENTS.md`), never in external folders such as Downloads or Desktop.

## Required Reading Before Development

Before making changes, read the canonical documents in `docs/` and `AGENTS.md` in the repository root. Regenerate and read `docs/_generated/context-pack.txt` before relying on repository paths or Git state.

## Document Authority & Precedence

When decisions conflict, resolve them in the following order of precedence:

1. [`PROJECT_HANDOVER_v6.md`](PROJECT_HANDOVER_v6.md) — Current project state, working procedures, and active milestones.
2. [`FINAL_WEBSITE_REDESIGN_MASTER_PLAN.md`](FINAL_WEBSITE_REDESIGN_MASTER_PLAN.md) — Authoritative redesign decisions, architecture, and scope.
3. [`WEBSITE_THEME_AND_UI_UX_DESIGN_SYSTEM.md`](WEBSITE_THEME_AND_UI_UX_DESIGN_SYSTEM.md) — Visual standards, typography, color, and layout tokens.
4. [`WEBSITE_BUILD_SPEC_FOR_CODEX.md`](WEBSITE_BUILD_SPEC_FOR_CODEX.md) — Technical and product constraints (also retained at repository root).
5. [`../AGENTS.md`](../AGENTS.md) — Standing agent instructions, safety, and Git rules.

## Directory Structure

- `docs/` — Canonical project documentation.
- `docs/drafts/` — Private drafts and working notes.
- `docs/_generated/` — Regenerable context files (gitignored), including `context-pack.txt`.

## Context-Pack Generation (Project-Local)

Run the following PowerShell 5.1 snippet from anywhere inside the repository to regenerate `docs/_generated/context-pack.txt`:

```powershell
$repoRoot = (git rev-parse --show-toplevel).Trim()
Push-Location $repoRoot
try {
  $outDir = Join-Path $repoRoot "docs\_generated"
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
  $out = Join-Path $outDir "context-pack.txt"
  $files = git ls-files
  @(
    "## STATUS", (git status --short --branch),
    "## LOG", (git log --oneline -20),
    "## FILES (public/images excluded)", ($files | Where-Object { $_ -notlike 'public/images/*' }),
    "## IMAGE COUNT", (($files | Where-Object { $_ -like 'public/images/*' }).Count),
    "## PACKAGE.JSON", (Get-Content package.json -Raw),
    "## .ENV.EXAMPLE", (Get-Content .env.example -Raw)
  ) | Set-Content -Encoding utf8 $out
} finally {
  Pop-Location
}
```
