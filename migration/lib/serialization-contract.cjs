/**
 * Sanity Serialization Contract & Normalization Engine
 * goutamprusty.com v2 Rebuild — Milestone 2B Remediation
 *
 * Implements pure, deterministic serialization and reference normalization
 * that resolves Milestone 2A blockers F-01 (array typing) and F-02 (references),
 * enforces F-05 (mandatory eligibility gate), decouples F-06 (legacy featured),
 * and standardizes F-03/F-04 (object serialization).
 */

const fs = require('fs');
const path = require('path');
const { makeKey } = require('./key-generator.cjs');
const {
  EXPLICIT_IMAGE_PATH_MAP,
  normalizeAssetPath,
  normalizeDocumentAssetPaths,
} = require('./path-normalizer.cjs');

/**
 * Custom Error classes for closed-failure modes.
 */
class ReferenceResolutionError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ReferenceResolutionError';
    this.details = details;
  }
}

class MigrationEligibilityError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'MigrationEligibilityError';
    this.details = details;
  }
}

/**
 * Authoritative Sanity Document ID Scheme.
 *
 * Pattern: `<type>-<workbookId>`
 * Examples:
 *   Research: 'research-RES-001'
 *   Writing:  'writing-BLG-001'
 *   Project:  'project-PRJ-001'
 *   Topic:    'topic-<slug>'
 *   Author:   'author-<authorId>'
 */
function getSanityDocumentId(docType, id) {
  if (!docType || !id) {
    throw new Error(`getSanityDocumentId requires docType and id, got: docType=${docType}, id=${id}`);
  }
  return `${docType}-${id}`;
}

/**
 * Build the authoritative, deterministic slug-to-document-ID reference map.
 * Reads full-corpus-compatibility.json and project files.
 *
 * Fails closed if any duplicate or ambiguous slug is detected.
 */
function buildAuthoritativeReferenceMap(options = {}) {
  const rootDir = options.rootDir || path.join(__dirname, '..', '..');
  const compatPath = path.join(rootDir, 'migration', 'full-corpus-compatibility.json');

  if (!fs.existsSync(compatPath)) {
    throw new Error(`Compatibility inventory not found at: ${compatPath}`);
  }

  const compatData = JSON.parse(fs.readFileSync(compatPath, 'utf8'));
  const map = new Map();
  const slugCollisions = new Map();

  function register(slug, docId, docType) {
    if (!slug || typeof slug !== 'string') return;
    const sanityId = getSanityDocumentId(docType, docId);

    if (map.has(slug)) {
      const existing = map.get(slug);
      if (existing !== sanityId) {
        if (!slugCollisions.has(slug)) {
          slugCollisions.set(slug, [existing]);
        }
        slugCollisions.get(slug).push(sanityId);
      }
    } else {
      map.set(slug, sanityId);
    }
  }

  // Register Research and Writing documents
  for (const doc of compatData.documents) {
    const docType = doc.type.toLowerCase();
    register(doc.slug, doc.workbookId, docType);
  }

  // Register Project documents from V1
  const v1ProjectsDir = path.join('D:/goutamprusty-v1', 'content', 'projects');
  if (fs.existsSync(v1ProjectsDir)) {
    const projectFiles = [
      { file: 'inkline.mdx', id: 'PRJ-001', slug: 'inkline' },
      { file: 'vitaliq.mdx', id: 'PRJ-002', slug: 'vitaliq' },
      { file: 'wharf.mdx', id: 'PRJ-003', slug: 'wharf' }
    ];
    for (const prj of projectFiles) {
      register(prj.slug, prj.id, 'project');
    }
  }

  // Fail closed if any slug collision exists
  if (slugCollisions.size > 0) {
    const details = Array.from(slugCollisions.entries())
      .map(([s, ids]) => `Slug '${s}' maps to multiple IDs: ${ids.join(', ')}`)
      .join('; ');
    throw new ReferenceResolutionError(`Ambiguous slugs detected in corpus: ${details}`, { collisions: slugCollisions });
  }

  return map;
}

/**
 * F-05: Mandatory Migration Eligibility Gate.
 * Evaluates whether a document is eligible for migration based on full-corpus-compatibility.json.
 *
 * Rules:
 * - Only documents explicitly marked 'PASS' are eligible.
 * - 'HOLD', missing, unknown or malformed statuses fail closed.
 * - Schema validity must never override compatibility status.
 *
 * @param {string} docId - The workbook document ID (e.g. 'RES-001', 'BLG-012')
 * @param {object} options - Configuration options
 * @returns {object} { isEligible: boolean, status: string, documentId: string, slug: string, reason: string }
 */
function checkMigrationEligibility(docId, options = {}) {
  const rootDir = options.rootDir || path.join(__dirname, '..', '..');
  const compatPath = path.join(rootDir, 'migration', 'full-corpus-compatibility.json');

  if (!fs.existsSync(compatPath)) {
    throw new MigrationEligibilityError(`Compatibility inventory file missing: ${compatPath}`);
  }

  const compatData = JSON.parse(fs.readFileSync(compatPath, 'utf8'));

  const entry = compatData.documents.find(d => d.workbookId === docId || d.slug === docId);

  if (!entry) {
    return {
      isEligible: false,
      status: 'NOT_FOUND',
      documentId: docId,
      slug: null,
      reason: `Document ID '${docId}' not found in authoritative compatibility inventory`
    };
  }

  if (entry.status === 'PASS') {
    return {
      isEligible: true,
      status: 'PASS',
      documentId: entry.workbookId,
      slug: entry.slug,
      reason: 'All compatibility and asset path verification gates passed'
    };
  }

  if (entry.status === 'HOLD') {
    return {
      isEligible: false,
      status: 'HOLD',
      documentId: entry.workbookId,
      slug: entry.slug,
      reason: entry.holdReason || 'Flagged on HOLD in compatibility inventory'
    };
  }

  // Unknown or malformed status
  return {
    isEligible: false,
    status: 'UNKNOWN_STATUS',
    documentId: entry.workbookId,
    slug: entry.slug,
    reason: `Invalid compatibility status '${entry.status}' in inventory`
  };
}

/**
 * F-01: Resolve Array Object Typing.
 * Recursively inspects and injects exact registered _type and deterministic _key
 * into all Sanity array members:
 * - research.sourceMaterial -> _type: 'sourceMaterialEntry'
 * - research.bibliography -> _type: 'bibliographyEntry'
 * - tableBlock.rows -> _type: 'tableRow'
 * - tableRow.cells -> _type: 'tableCell'
 *
 * Verifies key uniqueness within each array.
 */
function serializeArrayMembers(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const cloned = JSON.parse(JSON.stringify(doc));
  const docId = cloned.workbookId || cloned._id;

  // 1. sourceMaterial
  if (Array.isArray(cloned.sourceMaterial)) {
    const seenKeys = new Set();
    cloned.sourceMaterial = cloned.sourceMaterial.map((item, idx) => {
      const key = item._key || makeKey(`${docId}:sm:${idx}:${item.title || ''}`);
      if (seenKeys.has(key)) {
        throw new Error(`Duplicate key '${key}' detected in sourceMaterial array of ${docId}`);
      }
      seenKeys.add(key);
      return {
        _key: key,
        _type: 'sourceMaterialEntry',
        title: item.title,
        url: item.url || null
      };
    });
  }

  // 2. bibliography
  if (Array.isArray(cloned.bibliography)) {
    const seenKeys = new Set();
    cloned.bibliography = cloned.bibliography.map((item, idx) => {
      const key = item._key || makeKey(`${docId}:bib:${item.order || idx}:${idx}`);
      if (seenKeys.has(key)) {
        throw new Error(`Duplicate key '${key}' detected in bibliography array of ${docId}`);
      }
      seenKeys.add(key);
      return {
        _key: key,
        _type: 'bibliographyEntry',
        order: item.order,
        rawText: item.rawText,
        title: item.title,
        url: item.url || null
      };
    });
  }

  // 3. body blocks (including tableBlock rows and cells)
  if (Array.isArray(cloned.body)) {
    const seenBlockKeys = new Set();
    cloned.body = cloned.body.map((block, bIdx) => {
      const bKey = block._key || makeKey(`${docId}:block:${bIdx}`);
      if (seenBlockKeys.has(bKey)) {
        throw new Error(`Duplicate block key '${bKey}' detected in body of ${docId}`);
      }
      seenBlockKeys.add(bKey);

      if (block._type === 'tableBlock' && Array.isArray(block.rows)) {
        const seenRowKeys = new Set();
        const rows = block.rows.map((row, rIdx) => {
          const rKey = row._key || makeKey(`${docId}:table:${bIdx}:row:${rIdx}`);
          if (seenRowKeys.has(rKey)) {
            throw new Error(`Duplicate row key '${rKey}' in tableBlock at index ${bIdx}`);
          }
          seenRowKeys.add(rKey);

          const seenCellKeys = new Set();
          const cells = Array.isArray(row.cells)
            ? row.cells.map((cell, cIdx) => {
                const cKey = cell._key || makeKey(`${docId}:table:${bIdx}:row:${rIdx}:cell:${cIdx}`);
                if (seenCellKeys.has(cKey)) {
                  throw new Error(`Duplicate cell key '${cKey}' in row ${rIdx}`);
                }
                seenCellKeys.add(cKey);

                return {
                  _key: cKey,
                  _type: 'tableCell',
                  plainText: cell.plainText || '',
                  content: Array.isArray(cell.content) ? cell.content : []
                };
              })
            : [];

          return {
            _key: rKey,
            _type: 'tableRow',
            isHeader: Boolean(row.isHeader),
            cells
          };
        });

        return {
          ...block,
          _key: bKey,
          rows
        };
      }

      return block;
    });
  }

  return cloned;
}

/**
 * F-02: Resolve Reference Normalization.
 * Transforms raw string slugs into valid Sanity reference objects:
 * { _type: 'reference', _ref: '<docId>', _sourceSlug: '<slug>' }
 *
 * Fails closed on missing or ambiguous mappings.
 * Preserves relationship direction and array ordering.
 */
function normalizeReferences(doc, referenceMap, _options = {}) {
  if (!doc || typeof doc !== 'object') return doc;
  const cloned = JSON.parse(JSON.stringify(doc));
  const docId = cloned.workbookId || cloned._id;
  const map = referenceMap instanceof Map ? referenceMap : new Map(Object.entries(referenceMap || {}));

  function resolveRef(slug, fieldName, itemIndex = null) {
    if (!slug || typeof slug !== 'string') {
      throw new ReferenceResolutionError(`Expected non-empty string slug for '${fieldName}', got: ${typeof slug}`);
    }

    if (!map.has(slug)) {
      const idxStr = itemIndex !== null ? ` at index ${itemIndex}` : '';
      throw new ReferenceResolutionError(
        `Unresolved reference in ${docId}.${fieldName}${idxStr}: Slug '${slug}' is absent from the authoritative reference mapping. Ingestion must fail closed.`,
        { documentId: docId, field: fieldName, slug, index: itemIndex }
      );
    }

    const targetId = map.get(slug);

    // Build Sanity reference object preserving original slug in provenance field
    return {
      _type: 'reference',
      _ref: targetId,
      _sourceSlug: slug
    };
  }

  // 1. research.derivedPosts
  if (Array.isArray(cloned.derivedPosts)) {
    cloned.derivedPosts = cloned.derivedPosts.map((item, idx) => {
      // If already a normalized reference object
      if (item && typeof item === 'object' && item._ref) {
        return item;
      }
      const refObj = resolveRef(item, 'derivedPosts', idx);
      // Array items in Sanity need _key
      return {
        _key: makeKey(`${docId}:derivedPost:${idx}:${item}`),
        ...refObj
      };
    });
  }

  // 2. writing.sourceReport
  if (cloned.sourceReport !== undefined && cloned.sourceReport !== null) {
    if (typeof cloned.sourceReport === 'string') {
      cloned.sourceReport = resolveRef(cloned.sourceReport, 'sourceReport');
    } else if (typeof cloned.sourceReport === 'object' && cloned.sourceReport._ref) {
      // Already normalized
    } else {
      throw new ReferenceResolutionError(`Invalid sourceReport value in ${docId}: ${JSON.stringify(cloned.sourceReport)}`);
    }
  }

  // 3. relatedProjects
  if (Array.isArray(cloned.relatedProjects)) {
    cloned.relatedProjects = cloned.relatedProjects.map((item, idx) => {
      if (item && typeof item === 'object' && item._ref) return item;
      const refObj = resolveRef(item, 'relatedProjects', idx);
      return {
        _key: makeKey(`${docId}:relatedProject:${idx}:${item}`),
        ...refObj
      };
    });
  }

  return cloned;
}

/**
 * F-03 & F-04: Resolve Object Serialization.
 * - Standardizes coverImage to preserve local WebP assetPath without misleading _type: 'image'.
 * - Injects explicit _type: 'seo' and _type: 'sourceArchive'.
 */
function serializeObjects(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const cloned = JSON.parse(JSON.stringify(doc));

  // 1. coverImage: standardizes object representation for local WebP path with normalized assetPath
  if (cloned.coverImage && typeof cloned.coverImage === 'object') {
    cloned.coverImage = {
      assetPath: normalizeAssetPath(cloned.coverImage.assetPath),
      alt: cloned.coverImage.alt || ''
    };
  }

  // 2. body image blocks & inline images: normalize presentation asset paths
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

  // 2. seo: attach _type: 'seo'
  if (cloned.seo && typeof cloned.seo === 'object') {
    cloned.seo = {
      _type: 'seo',
      metaTitle: cloned.seo.metaTitle || '',
      metaDescription: cloned.seo.metaDescription || ''
    };
  }

  // 3. sourceArchive: attach _type: 'sourceArchive'
  if (cloned.sourceArchive && typeof cloned.sourceArchive === 'object') {
    cloned.sourceArchive = {
      _type: 'sourceArchive',
      ...cloned.sourceArchive
    };
  }

  return cloned;
}

/**
 * F-06: Resolve Legacy Featured Metadata.
 * Preserves V1 source frontmatter featured boolean as 'legacyFeatured'.
 * Strictly enforces V2 editorial 'featured: false' by default.
 */
function normalizeFeatured(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const cloned = JSON.parse(JSON.stringify(doc));

  if (cloned._type === 'project') {
    // Preserve V1 source frontmatter value for provenance
    cloned.legacyFeatured = Boolean(cloned.featured);
    // Enforce V2 editorial default: strictly false until human review
    cloned.featured = false;
  } else {
    // Content documents default strictly to false
    cloned.featured = false;
  }

  // Enforce editorialStatus default: 'draft'
  if (!cloned.editorialStatus) {
    cloned.editorialStatus = 'draft';
  }

  return cloned;
}

/**
 * Master Serialization Function:
 * Applies all remediation steps to produce an implementation-ready Sanity document.
 *
 * @param {object} parsedDoc - The raw document from mdx-to-sanity-parser
 * @param {object} referenceMap - Explicit slug-to-document-ID map
 * @param {object} options - Configuration options
 * @returns {object} The serialized document ready for Sanity Content Lake
 */
function serializeToSanityContract(parsedDoc, referenceMap, options = {}) {
  // Check eligibility gate if enforceEligibility is true (default: true)
  const enforceEligibility = options.enforceEligibility !== false;
  if (enforceEligibility && parsedDoc.workbookId) {
    const gate = checkMigrationEligibility(parsedDoc.workbookId, options);
    if (!gate.isEligible) {
      throw new MigrationEligibilityError(
        `Migration eligibility gate failed for ${parsedDoc.workbookId} (${gate.slug}): ${gate.reason}`,
        gate
      );
    }
  }

  // Step 1: Array object typing (F-01)
  let doc = serializeArrayMembers(parsedDoc);

  // Step 2: Reference normalization (F-02)
  if (referenceMap) {
    doc = normalizeReferences(doc, referenceMap, options);
  }

  // Step 3: Object typing & coverImage normalization (F-03, F-04)
  doc = serializeObjects(doc);

  // Step 4: Legacy featured & editorial default enforcement (F-06)
  doc = normalizeFeatured(doc);

  return doc;
}

module.exports = {
  serializeToSanityContract,
  serializeArrayMembers,
  normalizeReferences,
  serializeObjects,
  normalizeFeatured,
  checkMigrationEligibility,
  buildAuthoritativeReferenceMap,
  getSanityDocumentId,
  ReferenceResolutionError,
  MigrationEligibilityError,
  normalizeAssetPath,
  normalizeDocumentAssetPaths,
  EXPLICIT_IMAGE_PATH_MAP
};
