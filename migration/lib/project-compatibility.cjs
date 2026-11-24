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

function getProjectCompletionDate(doc) {
  if (!doc) return null;
  return doc.endDate || doc.completedDate || null;
}

module.exports = {
  APPROVED_PROVENANCE_LABELS,
  APPROVED_PROJECT_STATUSES,
  normalizeProvenanceLabel,
  normalizeProjectStatus,
  getProjectCompletionDate
};
