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
