/**
 * Project Schema Compatibility & Normalization Utilities
 * goutamprusty.com v2 Rebuild — Phase 1: T5 Project Schema Remediation
 *
 * Provides authoritative definitions, compatibility aliases, and explicit mapping
 * for project provenance, delivery/publication status, and dates across Sanity Studio
 * and Migration schema contracts.
 */

export const APPROVED_PROVENANCE_LABELS = [
  'Independent',
  'Built during training',
  'Guided exercise',
  'Collaborative',
] as const;

export type ProvenanceLabel = (typeof APPROVED_PROVENANCE_LABELS)[number];

const PROVENANCE_ALIAS_MAP: Record<string, ProvenanceLabel> = {
  independent: 'Independent',
  'built-during-training': 'Built during training',
  built_during_training: 'Built during training',
  'built during training': 'Built during training',
  training: 'Built during training',
  'guided-exercise': 'Guided exercise',
  guided_exercise: 'Guided exercise',
  'guided exercise': 'Guided exercise',
  guided: 'Guided exercise',
  collaborative: 'Collaborative',
};

/**
 * Normalizes any recognized provenance alias or verbatim string into one of the 4 approved labels.
 * Returns undefined for unrecognized values or undefined input.
 */
export function normalizeProvenanceLabel(value?: string | null): ProvenanceLabel | undefined {
  if (!value || typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (APPROVED_PROVENANCE_LABELS.includes(trimmed as ProvenanceLabel)) {
    return trimmed as ProvenanceLabel;
  }
  const lower = trimmed.toLowerCase();
  return PROVENANCE_ALIAS_MAP[lower] ?? undefined;
}

export const APPROVED_PROJECT_STATUSES = [
  'completed',
  'published',
  'in_progress',
  'in-progress',
  'archived',
  'draft',
] as const;

export type ProjectStatus = (typeof APPROVED_PROJECT_STATUSES)[number];

const STATUS_ALIAS_MAP: Record<string, string> = {
  'in-progress': 'in_progress',
  'in_progress': 'in_progress',
  completed: 'completed',
  published: 'published',
  archived: 'archived',
  draft: 'draft',
};

/**
 * Normalizes project status, mapping legacy aliases (e.g. 'in-progress' -> 'in_progress')
 * while preserving the distinction between 'completed', 'published', 'archived', and 'draft'.
 */
export function normalizeProjectStatus(status?: string | null): string {
  if (!status || typeof status !== 'string') return 'draft';
  const trimmed = status.trim().toLowerCase();
  return STATUS_ALIAS_MAP[trimmed] ?? trimmed;
}

const STATUS_DISPLAY_MAP: Record<string, string> = {
  completed: 'Completed',
  published: 'Published',
  in_progress: 'In Progress',
  'in-progress': 'In Progress',
  archived: 'Archived',
  draft: 'Draft',
};

const IN_DEVELOPMENT_PROJECT_IDS = new Set(['project-PRJ-005', 'PRJ-005']);
const IN_DEVELOPMENT_PROJECT_SLUGS = new Set(['grounded-technical-docs-rag-assistant']);

/**
 * Returns human-readable display label for project status.
 * Preserves underlying Sanity status/eligibility while displaying PRJ-005 as "In Development"
 * only when its underlying normalized status is "published".
 * Returns undefined if status is missing or not a non-empty string.
 */
export function formatProjectStatus(
  status?: string | null,
  context?: {
    _id?: string | null;
    workbookId?: string | null;
    slug?: string | { current?: string | null } | null;
  } | null
): string | undefined {
  if (!status || typeof status !== 'string') return undefined;
  const trimmed = status.trim();
  if (trimmed.length === 0) return undefined;
  const lower = trimmed.toLowerCase();

  if (lower === 'published' && context) {
    const id = typeof context._id === 'string' ? context._id.trim() : '';
    const workbookId = typeof context.workbookId === 'string' ? context.workbookId.trim() : '';
    const slug =
      typeof context.slug === 'string'
        ? context.slug.trim()
        : context.slug?.current?.trim() || '';

    if (
      IN_DEVELOPMENT_PROJECT_IDS.has(id) ||
      IN_DEVELOPMENT_PROJECT_IDS.has(workbookId) ||
      IN_DEVELOPMENT_PROJECT_SLUGS.has(slug)
    ) {
      return 'In Development';
    }
  }

  return STATUS_DISPLAY_MAP[lower] ?? (trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
}

/**
 * Resolves project completion date from available date fields with backward-compatible fallback.
 * Checks endDate first, then completedDate.
 */
export function getProjectCompletionDate(doc?: {
  endDate?: string | null;
  completedDate?: string | null;
} | null): string | null {
  if (!doc) return null;
  return doc.endDate || doc.completedDate || null;
}

/**
 * Evaluates whether a project document meets all criteria for public display:
 * 1. Has _type === 'project'
 * 2. Has a non-empty slug (slug.current or string)
 * 3. Has a non-empty title
 * 4. Status is explicitly 'published' or 'completed'
 * Excludes drafts, archived projects, in-progress items, and untyped records.
 */
export function isProjectEligible(doc?: any): boolean {
  if (!doc || typeof doc !== 'object') return false;
  if (doc._type !== 'project') return false;
  const slug = typeof doc.slug === 'string' ? doc.slug.trim() : doc.slug?.current?.trim();
  if (!slug) return false;
  if (!doc.title || typeof doc.title !== 'string' || doc.title.trim().length === 0) return false;

  const status = typeof doc.status === 'string' ? doc.status.trim().toLowerCase() : '';
  return status === 'published' || status === 'completed';
}
