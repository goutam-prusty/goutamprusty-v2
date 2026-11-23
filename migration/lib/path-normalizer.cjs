/**
 * Presentation and Import Layer Asset Path Normalizer
 * goutamprusty-v2 — Safe, Deterministic Asset Path Normalization
 *
 * Provides narrowly scoped normalization for:
 * 1. BLG-014 broken image references missing the slug subfolder.
 * 2. Route-relative image references missing a leading slash ('images/...').
 *
 * Strict Invariants:
 * - Deterministic, pure functions.
 * - Zero broad URL rewriting or speculative fallbacks.
 * - Leaves absolute URLs, root-relative paths, and other assets untouched.
 */

const EXPLICIT_IMAGE_PATH_MAP = Object.freeze({
  'images/blog/GST-incidence-by-fractile-chart.webp': '/images/blog/the-billionaire-raj/GST-incidence-by-fractile-chart.webp',
  '/images/blog/GST-incidence-by-fractile-chart.webp': '/images/blog/the-billionaire-raj/GST-incidence-by-fractile-chart.webp',
  'images/blog/Household-debt-growth-timeline.webp': '/images/blog/the-billionaire-raj/Household-debt-growth-timeline.webp',
  '/images/blog/Household-debt-growth-timeline.webp': '/images/blog/the-billionaire-raj/Household-debt-growth-timeline.webp',
});

/**
 * Normalizes a single asset path string.
 *
 * @param {string} rawPath - The raw asset path from MDX or Sanity block
 * @returns {string} The normalized, root-relative path
 */
function normalizeAssetPath(rawPath) {
  if (typeof rawPath !== 'string') return rawPath;
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

/**
 * Normalizes all image asset paths within a document object.
 *
 * @param {object} doc - Document object to normalize
 * @returns {object} Cloned document with normalized paths
 */
function normalizeDocumentAssetPaths(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const cloned = JSON.parse(JSON.stringify(doc));

  // Normalize coverImage
  if (cloned.coverImage && typeof cloned.coverImage === 'object' && cloned.coverImage.assetPath) {
    cloned.coverImage.assetPath = normalizeAssetPath(cloned.coverImage.assetPath);
  }

  // Normalize body blocks
  if (Array.isArray(cloned.body)) {
    for (const block of cloned.body) {
      if (block._type === 'imageBlock' && block.assetPath) {
        block.assetPath = normalizeAssetPath(block.assetPath);
      }
      if (Array.isArray(block.children)) {
        for (const child of block.children) {
          if ((child._type === 'inlineImage' || child._type === 'imageBlock') && child.assetPath) {
            child.assetPath = normalizeAssetPath(child.assetPath);
          }
        }
      }
    }
  }

  return cloned;
}

module.exports = {
  EXPLICIT_IMAGE_PATH_MAP,
  normalizeAssetPath,
  normalizeDocumentAssetPaths,
};
