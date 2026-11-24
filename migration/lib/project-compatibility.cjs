/**
 * Project Schema Compatibility & Normalization Utilities (CommonJS)
 * goutamprusty.com v2 Rebuild — Phase 1: T5 Project Schema Remediation
 */

const APPROVED_PROVENANCE_LABELS = [
  'Independent',
  'Built during training',
  'Guided exercise',
  'Collaborative'
];

const PROVENANCE_ALIAS_MAP = {
  independent: 'Independent',
  'built-during-training': 'Built during training',
  built_during_training: 'Built during training',
  'built during training': 'Built during training',
  training: 'Built during training',
  'guided-exercise': 'Guided exercise',
  guided_exercise: 'Guided exercise',
  'guided exercise': 'Guided exercise',
  guided: 'Guided exercise',
  collaborative: 'Collaborative'
};

function normalizeProvenanceLabel(value) {
  if (!value || typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (APPROVED_PROVENANCE_LABELS.includes(trimmed)) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  return PROVENANCE_ALIAS_MAP[lower] ?? undefined;
}

const APPROVED_PROJECT_STATUSES = [
  'completed',
  'published',
  'in_progress',
  'in-progress',
  'archived',
  'draft'
];

const STATUS_ALIAS_MAP = {
  'in-progress': 'in_progress',
  'in_progress': 'in_progress',
  completed: 'completed',
  published: 'published',
  archived: 'archived',
  draft: 'draft'
};

function normalizeProjectStatus(status) {
  if (!status || typeof status !== 'string') return 'draft';
  const trimmed = status.trim().toLowerCase();
  return STATUS_ALIAS_MAP[trimmed] ?? trimmed;
}

const STATUS_DISPLAY_MAP = {
  completed: 'Completed',
  published: 'Published',
  in_progress: 'In Progress',
  'in-progress': 'In Progress',
  archived: 'Archived',
  draft: 'Draft',
};

function formatProjectStatus(status) {
  if (!status || typeof status !== 'string') return undefined;
  const trimmed = status.trim();
  if (trimmed.length === 0) return undefined;
  const lower = trimmed.toLowerCase();
  return STATUS_DISPLAY_MAP[lower] ?? (trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
}

function getProjectCompletionDate(doc) {
  if (!doc) return null;
  return doc.endDate || doc.completedDate || null;
}

function isProjectEligible(doc) {
  if (!doc || typeof doc !== 'object') return false;
  if (doc._type !== 'project') return false;
  const slug = typeof doc.slug === 'string' ? doc.slug.trim() : doc.slug?.current?.trim();
  if (!slug) return false;
  if (!doc.title || typeof doc.title !== 'string' || doc.title.trim().length === 0) return false;

  const status = typeof doc.status === 'string' ? doc.status.trim().toLowerCase() : '';
  return status === 'published' || status === 'completed';
}

module.exports = {
  APPROVED_PROVENANCE_LABELS,
  APPROVED_PROJECT_STATUSES,
  normalizeProvenanceLabel,
  normalizeProjectStatus,
  formatProjectStatus,
  getProjectCompletionDate,
  isProjectEligible
};
