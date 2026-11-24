/**
 * Capabilities Data Contract & Evidence-Based Normalization
 * goutamprusty.com v2 Rebuild — Phase 1: T9 Reusable Capabilities Component
 *
 * Enforces a strict, evidence-based two-tier data contract:
 * Tier 1: "Used in projects" — requires a valid, non-empty capability label and a verifiable link/reference to an eligible project.
 * Tier 2: "Currently learning" — requires owner-confirmed active learning topics (non-empty label).
 *
 * Rules:
 * - Reject/omit entries missing required labels or project evidence.
 * - Deduplicate entries case-insensitively.
 * - Absolutely no skill meters, percentages, star ratings, or arbitrary proficiency numbers.
 */

export interface ProjectEvidenceRef {
  title?: string;
  slug?: string | { current: string };
  url?: string;
  href?: string;
}

export interface RawProjectCapability {
  name?: string;
  label?: string;
  project?: string | ProjectEvidenceRef;
  projectTitle?: string;
  projectSlug?: string;
  url?: string;
  href?: string;
  description?: string;
}

export interface ValidatedProjectCapability {
  name: string;
  projectSlug: string;
  projectTitle: string;
  projectUrl: string;
  description?: string;
}

export interface RawLearningCapability {
  name?: string;
  label?: string;
  status?: string;
  notes?: string;
}

export interface ValidatedLearningCapability {
  name: string;
  status?: string;
  notes?: string;
}

export interface CapabilitiesInput {
  usedInProjects?: (RawProjectCapability | null | undefined)[];
  projectCapabilities?: (RawProjectCapability | null | undefined)[];
  currentlyLearning?: (RawLearningCapability | string | null | undefined)[];
  learningCapabilities?: (RawLearningCapability | string | null | undefined)[];
}

export interface ValidatedCapabilities {
  usedInProjects: ValidatedProjectCapability[];
  currentlyLearning: ValidatedLearningCapability[];
}

export interface EligibleProjectSummary {
  _id?: string;
  workbookId?: string;
  title?: string;
  slug?: string | { current: string };
}

/**
 * Normalizes a slug or path string into a canonical /projects/[slug]/ URL.
 */
export function formatProjectUrl(slugOrUrl: string): string {
  const trimmed = slugOrUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const clean = trimmed.replace(/^\/+|\/+$/g, '');
  if (clean.startsWith('projects/')) {
    return `/${clean}/`;
  }
  return `/projects/${clean}/`;
}

/**
 * Extracts a slug string from string or Sanity slug object.
 */
function extractSlug(slugVal?: string | { current?: string } | null): string | undefined {
  if (!slugVal) return undefined;
  if (typeof slugVal === 'string') {
    const s = slugVal.trim().replace(/^\/+|\/+$/g, '');
    return s || undefined;
  }
  if (typeof slugVal === 'object' && typeof slugVal.current === 'string') {
    const s = slugVal.current.trim().replace(/^\/+|\/+$/g, '');
    return s || undefined;
  }
  return undefined;
}

/**
 * Validates a single "Used in projects" capability entry against the evidence requirement.
 * Returns null if the entry lacks a name or valid project reference.
 */
export function validateProjectCapability(
  raw: unknown,
  eligibleProjects?: EligibleProjectSummary[]
): ValidatedProjectCapability | null {
  if (!raw || typeof raw !== 'object') return null;

  const item = raw as RawProjectCapability;
  const name = (item.name || item.label || '').trim();
  if (!name) return null;

  // Resolve project reference / slug
  let rawSlug: string | undefined;
  let rawTitle: string | undefined = item.projectTitle?.trim();

  if (typeof item.project === 'string') {
    rawSlug = extractSlug(item.project);
  } else if (item.project && typeof item.project === 'object') {
    rawSlug = extractSlug(item.project.slug) || (typeof item.project.url === 'string' ? item.project.url.trim() : undefined) || (typeof item.project.href === 'string' ? item.project.href.trim() : undefined);
    if (!rawTitle && item.project.title && typeof item.project.title === 'string') {
      rawTitle = item.project.title.trim();
    }
  }

  // Fallback to explicit item properties if item.project was not set
  if (!rawSlug) {
    rawSlug = extractSlug(item.projectSlug) || extractSlug(item.url) || extractSlug(item.href);
  }

  if (!rawSlug) {
    // Missing required project evidence link -> reject
    return null;
  }

  // If eligible projects are provided, verify the project exists
  if (Array.isArray(eligibleProjects) && eligibleProjects.length > 0) {
    const matched = eligibleProjects.find((p) => {
      const pSlug = extractSlug(p.slug);
      return pSlug === rawSlug || p._id === rawSlug || p.workbookId === rawSlug;
    });

    if (!matched) {
      // Evidence link does not match any eligible project -> reject
      return null;
    }

    if (!rawTitle && matched.title) {
      rawTitle = matched.title.trim();
    }
    if (matched.slug) {
      rawSlug = extractSlug(matched.slug) || rawSlug;
    }
  }

  const projectUrl = formatProjectUrl(rawSlug);
  const projectTitle = rawTitle || rawSlug.replace(/^projects\//, '').replace(/-/g, ' ');

  return {
    name,
    projectSlug: rawSlug,
    projectTitle,
    projectUrl,
    description: typeof item.description === 'string' ? item.description.trim() : undefined,
  };
}

/**
 * Validates a single "Currently learning" capability entry.
 * Returns null if name is empty or missing.
 */
export function validateLearningCapability(raw: unknown): ValidatedLearningCapability | null {
  if (!raw) return null;

  if (typeof raw === 'string') {
    const name = raw.trim();
    return name ? { name } : null;
  }

  if (typeof raw === 'object') {
    const item = raw as RawLearningCapability;
    const name = (item.name || item.label || '').trim();
    if (!name) return null;

    return {
      name,
      status: typeof item.status === 'string' ? item.status.trim() : undefined,
      notes: typeof item.notes === 'string' ? item.notes.trim() : undefined,
    };
  }

  return null;
}

/**
 * Normalizes, validates, and deduplicates two-tier capabilities data.
 */
export function validateCapabilitiesData(
  input: unknown,
  eligibleProjects?: EligibleProjectSummary[]
): ValidatedCapabilities {
  if (!input || typeof input !== 'object') {
    return { usedInProjects: [], currentlyLearning: [] };
  }

  const data = input as CapabilitiesInput;

  // Process "Used in projects"
  const rawProjectCaps = Array.isArray(data.usedInProjects)
    ? data.usedInProjects
    : Array.isArray(data.projectCapabilities)
    ? data.projectCapabilities
    : [];

  const seenProjectNames = new Set<string>();
  const usedInProjects: ValidatedProjectCapability[] = [];

  for (const raw of rawProjectCaps) {
    const validated = validateProjectCapability(raw, eligibleProjects);
    if (validated) {
      const key = validated.name.toLowerCase();
      if (!seenProjectNames.has(key)) {
        seenProjectNames.add(key);
        usedInProjects.push(validated);
      }
    }
  }

  // Process "Currently learning"
  const rawLearningCaps = Array.isArray(data.currentlyLearning)
    ? data.currentlyLearning
    : Array.isArray(data.learningCapabilities)
    ? data.learningCapabilities
    : [];

  const seenLearningNames = new Set<string>();
  const currentlyLearning: ValidatedLearningCapability[] = [];

  for (const raw of rawLearningCaps) {
    const validated = validateLearningCapability(raw);
    if (validated) {
      const key = validated.name.toLowerCase();
      // Also prevent duplicates within learning list
      if (!seenLearningNames.has(key)) {
        seenLearningNames.add(key);
        currentlyLearning.push(validated);
      }
    }
  }

  return { usedInProjects, currentlyLearning };
}

/**
 * Returns true if the capabilities container has at least one valid capability in either tier.
 */
export function hasValidCapabilities(data?: ValidatedCapabilities | null): boolean {
  if (!data) return false;
  return (data.usedInProjects && data.usedInProjects.length > 0) || (data.currentlyLearning && data.currentlyLearning.length > 0);
}

// --------------------------------------------------------------------------
// AI Engineering Learning Roadmap Contracts & Normalization (T9 Follow-up)
// --------------------------------------------------------------------------

export interface RoadmapSubgroup {
  title: string;
  items: string[];
}

export interface LearningRoadmapData {
  title?: string;
  eyebrow?: string;
  description?: string;
  corePrioritiesTitle?: string;
  corePrioritiesDescription?: string;
  corePriorities: string[];
  supportingTitle?: string;
  supportingDescription?: string;
  supportingSubgroups: RoadmapSubgroup[];
}

/**
 * Validates and normalizes learning roadmap data.
 * Rejects entries with empty core priorities.
 */
export function validateLearningRoadmap(data: unknown): LearningRoadmapData | null {
  if (!data || typeof data !== 'object') return null;
  const raw = data as Partial<LearningRoadmapData>;

  if (!Array.isArray(raw.corePriorities) || raw.corePriorities.length === 0) {
    return null;
  }

  const corePriorities = raw.corePriorities
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((s) => s.length > 0);

  if (corePriorities.length === 0) {
    return null;
  }

  const supportingSubgroups: RoadmapSubgroup[] = [];
  if (Array.isArray(raw.supportingSubgroups)) {
    for (const sg of raw.supportingSubgroups) {
      if (sg && typeof sg.title === 'string' && Array.isArray(sg.items)) {
        const cleanItems = sg.items
          .map((i) => (typeof i === 'string' ? i.trim() : ''))
          .filter((s) => s.length > 0);
        if (cleanItems.length > 0) {
          supportingSubgroups.push({
            title: sg.title.trim(),
            items: cleanItems,
          });
        }
      }
    }
  }

  return {
    title: raw.title?.trim() || 'AI Engineering Learning Roadmap',
    eyebrow: raw.eyebrow?.trim() || 'Planned Learning · Structured Progression',
    description: raw.description?.trim() || '',
    corePrioritiesTitle: raw.corePrioritiesTitle?.trim() || 'Core AI Engineering learning priorities',
    corePrioritiesDescription: raw.corePrioritiesDescription?.trim() || '',
    corePriorities,
    supportingTitle: raw.supportingTitle?.trim() || 'Supporting foundations and advanced learning areas',
    supportingDescription: raw.supportingDescription?.trim() || '',
    supportingSubgroups,
  };
}

export function hasValidRoadmap(data?: LearningRoadmapData | null): boolean {
  return Boolean(data && Array.isArray(data.corePriorities) && data.corePriorities.length > 0);
}
