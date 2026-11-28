/**
 * Skills & Evidence Resolver
 * goutamprusty.com v2 — Recruiter-First Homepage & Evidence-Driven Skills Architecture
 *
 * Terminology rule:
 * "55 technologies, frameworks and engineering concepts across projects, active development, research and structured learning."
 */

import {
  CANONICAL_SKILLS,
  SKILL_CATEGORIES,
  type CanonicalSkill,
  type SkillCategory,
  type EvidenceRecord,
  type EvidenceClassification,
} from '../data/skillsEvidenceRegistry';

export type {
  CanonicalSkill,
  SkillCategory,
  EvidenceRecord,
  EvidenceClassification,
};

export interface CategoryWithSkills extends SkillCategory {
  skills: CanonicalSkill[];
}

/**
 * Returns all 55 canonical skills in an array.
 */
export function getAllSkills(): CanonicalSkill[] {
  return Object.values(CANONICAL_SKILLS);
}

/**
 * Returns a specific canonical skill by slug/ID, or null if not found.
 */
export function getSkillById(id: string): CanonicalSkill | null {
  if (!id || typeof id !== 'string') return null;
  const cleanId = id.trim().toLowerCase();
  return CANONICAL_SKILLS[cleanId] ?? null;
}

/**
 * Returns ONLY skills that possess verified qualifying evidence.
 * CRITICAL: This is used by getStaticPaths() to generate dynamic pages.
 * Any skill without evidence is NEVER generated, preventing empty pages and 404 dead ends.
 */
export function getEvidenceBackedSkills(): CanonicalSkill[] {
  return getAllSkills().filter((skill) => skill.evidence && skill.evidence.length > 0);
}

/**
 * Returns all 6 categories with their child skills populated.
 */
export function getCategoriesWithSkills(): CategoryWithSkills[] {
  return SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    skills: cat.skillIds
      .map((id) => CANONICAL_SKILLS[id])
      .filter((s): s is CanonicalSkill => Boolean(s)),
  }));
}

/**
 * Returns representative skills for the compact recruiter-first homepage overview.
 * 3 selected skills per category (18 total).
 */
export function getHomepageOverviewData(): Array<{
  category: SkillCategory;
  representativeSkills: CanonicalSkill[];
}> {
  return SKILL_CATEGORIES.map((cat) => {
    const allCatSkills = cat.skillIds
      .map((id) => CANONICAL_SKILLS[id])
      .filter((s): s is CanonicalSkill => Boolean(s));

    // Prefer skills marked isRepresentative; fallback to first 3
    const representative = allCatSkills.filter((s) => s.isRepresentative);
    const chosen = representative.length >= 3 ? representative.slice(0, 3) : allCatSkills.slice(0, 3);

    return {
      category: cat,
      representativeSkills: chosen,
    };
  });
}

/**
 * Returns human-readable label for an evidence classification.
 */
export function formatEvidenceClassification(type: EvidenceClassification): string {
  switch (type) {
    case 'project_implementation':
      return 'Published Project Implementation';
    case 'active_development':
      return 'Active Development (Foundation)';
    case 'research_evidence':
      return 'Empirical Research';
    case 'technical_writing':
      return 'Technical Writing';
    default:
      return 'Supporting Evidence';
  }
}

/**
 * Derives unique qualifying project count for a skill.
 * Canonical data integrity rules:
 * - Only counts explicit evidence where contentType === 'project' with a valid contentId
 * - Counts UNIQUE project IDs, not evidence records
 * - Never counts research reports or technical writing articles
 * - Never counts planned architecture
 */
export function getSkillProjectCount(skill: CanonicalSkill): number {
  if (!skill.evidence || skill.evidence.length === 0) return 0;
  const projectIds = new Set<string>();
  for (const item of skill.evidence) {
    if (item.contentType === 'project' && item.contentId) {
      projectIds.add(item.contentId);
    }
  }
  return projectIds.size;
}

/**
 * Returns formatted project count string:
 * - Exactly 1 project: '1 project'
 * - Multiple projects: 'X projects'
 * - Zero projects: null (strictly never renders '0 projects' or empty badge)
 */
export function formatSkillProjectCount(skill: CanonicalSkill): string | null {
  const count = getSkillProjectCount(skill);
  if (count === 1) return '1 project';
  if (count > 1) return `${count} projects`;
  return null;
}

/**
 * Returns the badge label for skill tag badges.
 * Replaces individual project names/codes (e.g. PRJ-004, PRJ-005) with project counts:
 * - Skills linked to projects: '1 project' (or 'X projects')
 * - Skills linked to research: 'Research'
 * - Skills linked to technical writing: 'Analysis'
 * - Display-only skills: null
 */
export function getSkillBadgeLabel(skill: CanonicalSkill): string | null {
  if (!skill.evidence || skill.evidence.length === 0) return null;
  const projectCount = formatSkillProjectCount(skill);
  if (projectCount) {
    return projectCount;
  }
  const primary = skill.evidence[0];
  if (primary.classification === 'research_evidence') {
    return 'Research';
  }
  if (primary.classification === 'technical_writing') {
    return 'Analysis';
  }
  return null;
}
