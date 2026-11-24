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
