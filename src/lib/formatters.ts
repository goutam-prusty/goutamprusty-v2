/**
 * Formatters & Display Helpers
 * goutamprusty.com v2 — Visual Upgrade
 */

const CATEGORY_LABEL_MAP: Record<string, string> = {
  'ai-engineering': 'AI Engineering',
  'artificial-intelligence': 'Artificial Intelligence',
  'business-strategy': 'Business Strategy',
  'political-economy': 'Political Economy',
  'philosophy-psychology': 'Philosophy & Psychology',
  'systems-architecture': 'Systems Architecture',
  'macroeconomics': 'Macroeconomics',
  'technology': 'Technology',
  'learning-systems': 'Learning Systems',
  'web-development': 'Web Development',
  'data-systems': 'Data Systems',
};

/**
 * Converts raw category slugs (e.g. 'ai-engineering', 'business-strategy')
 * into human-readable editorial labels ('AI Engineering', 'Business Strategy').
 */
export function formatCategoryLabel(cat?: string | null, fallback = ''): string {
  if (!cat || typeof cat !== 'string') return fallback;
  const trimmed = cat.trim();
  const lower = trimmed.toLowerCase();
  if (CATEGORY_LABEL_MAP[lower]) {
    return CATEGORY_LABEL_MAP[lower];
  }
  return trimmed
    .split(/[-_]+/)
    .map((word) => {
      const lowerWord = word.toLowerCase();
      if (['ai', 'nlp', 'rag', 'llm', 'api', 'bba', 'bi'].includes(lowerWord)) {
        return lowerWord.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
