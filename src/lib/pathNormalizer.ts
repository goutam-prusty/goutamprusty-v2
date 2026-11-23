/**
 * Presentation Layer Asset Path Normalizer
 * goutamprusty-v2 — Safe, Deterministic Asset Path Normalization
 *
 * Provides narrowly scoped normalization for:
 * 1. BLG-014 broken image references missing the slug subfolder.
 * 2. Route-relative image references missing a leading slash ('images/...').
 */

export const EXPLICIT_IMAGE_PATH_MAP: Readonly<Record<string, string>> = Object.freeze({
  'images/blog/GST-incidence-by-fractile-chart.webp': '/images/blog/the-billionaire-raj/GST-incidence-by-fractile-chart.webp',
  '/images/blog/GST-incidence-by-fractile-chart.webp': '/images/blog/the-billionaire-raj/GST-incidence-by-fractile-chart.webp',
  'images/blog/Household-debt-growth-timeline.webp': '/images/blog/the-billionaire-raj/Household-debt-growth-timeline.webp',
  '/images/blog/Household-debt-growth-timeline.webp': '/images/blog/the-billionaire-raj/Household-debt-growth-timeline.webp',
});

/**
 * Normalizes a single asset path string for presentation.
 *
 * @param rawPath - The raw asset path from Sanity document or block
 * @returns The normalized root-relative path
 */
export function normalizeAssetPath(rawPath?: string | null): string {
  if (!rawPath || typeof rawPath !== 'string') return rawPath || '';
  const trimmed = rawPath.trim();
  if (!trimmed) return rawPath;

  // 1. Explicit replacement mapping for verified intended assets
  if (EXPLICIT_IMAGE_PATH_MAP[trimmed]) {
    return EXPLICIT_IMAGE_PATH_MAP[trimmed];
  }

  // 2. Route-relative image path (prepend leading slash)
  if (trimmed.startsWith('images/')) {
    return `/${trimmed}`;
  }

  return trimmed;
}
