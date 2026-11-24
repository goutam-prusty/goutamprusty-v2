/**
 * Capabilities Data Contract & Evidence-Based Normalization (CommonJS)
 * goutamprusty.com v2 Rebuild — Phase 1: T9 Reusable Capabilities Component
 */

function formatProjectUrl(slugOrUrl) {
  if (!slugOrUrl || typeof slugOrUrl !== 'string') return '';
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

function extractSlug(slugVal) {
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

function validateProjectCapability(raw, eligibleProjects) {
  if (!raw || typeof raw !== 'object') return null;

  const item = raw;
  const name = (item.name || item.label || '').trim();
  if (!name) return null;

  let rawSlug;
  let rawTitle = item.projectTitle ? item.projectTitle.trim() : undefined;

  if (typeof item.project === 'string') {
    rawSlug = extractSlug(item.project);
  } else if (item.project && typeof item.project === 'object') {
    rawSlug = extractSlug(item.project.slug) || (typeof item.project.url === 'string' ? item.project.url.trim() : undefined) || (typeof item.project.href === 'string' ? item.project.href.trim() : undefined);
    if (!rawTitle && item.project.title && typeof item.project.title === 'string') {
      rawTitle = item.project.title.trim();
    }
  }

  if (!rawSlug) {
    rawSlug = extractSlug(item.projectSlug) || extractSlug(item.url) || extractSlug(item.href);
  }

  if (!rawSlug) {
    return null;
  }

  if (Array.isArray(eligibleProjects) && eligibleProjects.length > 0) {
    const matched = eligibleProjects.find((p) => {
      const pSlug = extractSlug(p.slug);
      return pSlug === rawSlug || p._id === rawSlug || p.workbookId === rawSlug;
    });

    if (!matched) {
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

function validateLearningCapability(raw) {
  if (!raw) return null;

  if (typeof raw === 'string') {
    const name = raw.trim();
    return name ? { name } : null;
  }

  if (typeof raw === 'object') {
    const item = raw;
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

function validateCapabilitiesData(input, eligibleProjects) {
  if (!input || typeof input !== 'object') {
    return { usedInProjects: [], currentlyLearning: [] };
  }

  const data = input;

  const rawProjectCaps = Array.isArray(data.usedInProjects)
    ? data.usedInProjects
    : Array.isArray(data.projectCapabilities)
    ? data.projectCapabilities
    : [];

  const seenProjectNames = new Set();
  const usedInProjects = [];

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

  const rawLearningCaps = Array.isArray(data.currentlyLearning)
    ? data.currentlyLearning
    : Array.isArray(data.learningCapabilities)
    ? data.learningCapabilities
    : [];

  const seenLearningNames = new Set();
  const currentlyLearning = [];

  for (const raw of rawLearningCaps) {
    const validated = validateLearningCapability(raw);
    if (validated) {
      const key = validated.name.toLowerCase();
      if (!seenLearningNames.has(key)) {
        seenLearningNames.add(key);
        currentlyLearning.push(validated);
      }
    }
  }

  return { usedInProjects, currentlyLearning };
}

function hasValidCapabilities(data) {
  if (!data) return false;
  return (Array.isArray(data.usedInProjects) && data.usedInProjects.length > 0) ||
         (Array.isArray(data.currentlyLearning) && data.currentlyLearning.length > 0);
}

module.exports = {
  formatProjectUrl,
  extractSlug,
  validateProjectCapability,
  validateLearningCapability,
  validateCapabilitiesData,
  hasValidCapabilities,
};
