/**
 * MDX-to-Sanity Portable Text Transformation Engine
 * goutamprusty.com v2 Rebuild — Milestone 1C Parser Hardening
 *
 * Deterministically parses read-only V1 MDX files into Sanity-compatible
 * JSON documents conforming to the approved Portable Text content architecture.
 * Supports both Research Reports and Editorial Writing / Blog Documents.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('yaml');
const satteri = require('satteri');
const { makeKey } = require('./key-generator.cjs');

// Load formula manifests and inventory
const V2_ROOT = path.resolve(__dirname, '../../');
const MANIFEST_PATH = path.join(V2_ROOT, 'migration', 'formula-assets-manifest.json');
const INVENTORY_PATH = path.join(V2_ROOT, 'migration', 'formula-placement-inventory.json');

let formulaManifest = null;
let formulaInventory = null;
let formulaMap = null;
let standaloneDefs = null;

function initManifests() {
  if (!formulaManifest) {
    formulaManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    formulaInventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));

    formulaMap = new Map();
    formulaManifest.assets.forEach(a => {
      const key = `${a.documentId}:${a.formulaDefinitionId}`;
      formulaMap.set(key, a);
    });

    standaloneDefs = new Set();
    formulaInventory.placements.forEach(p => {
      if (p.context === 'standalone block') {
        standaloneDefs.add(`${p.documentId}:${p.formulaDefinitionId}`);
      }
    });
  }
}

/**
 * Extract plain text from heading node children.
 */
function getHeadingPlainText(node) {
  let text = '';
  function walk(n) {
    if (n.type === 'text') text += n.value;
    if (n.children) n.children.forEach(walk);
  }
  walk(node);
  return text.trim();
}

/**
 * Process inline mdast children into Portable Text spans, citationMarkers, inlineFormulas, and inlineImages.
 */
function processInlineChildren(children, docId, blockPath, activeMarks = [], markDefs = []) {
  initManifests();
  const result = [];
  let childIdx = 0;

  for (const node of children) {
    const currentPath = `${blockPath}.c${childIdx++}`;
    if (node.type === 'text') {
      const textVal = node.value;
      const regex = /\[\^(\d+)\]/g;
      let lastIndex = 0;
      let match;
      let splitIdx = 0;

      while ((match = regex.exec(textVal)) !== null) {
        if (match.index > lastIndex) {
          const spanText = textVal.slice(lastIndex, match.index);
          result.push({
            _key: makeKey(`${docId}:${currentPath}:s${splitIdx++}:${spanText}`),
            _type: 'span',
            text: spanText,
            marks: [...activeMarks]
          });
        }
        const num = parseInt(match[1], 10);
        result.push({
          _key: makeKey(`${docId}:${currentPath}:cm${splitIdx++}:${match[0]}`),
          _type: 'citationMarker',
          citationNumber: num,
          rawMarker: match[0]
        });
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < textVal.length) {
        const remaining = textVal.slice(lastIndex);
        result.push({
          _key: makeKey(`${docId}:${currentPath}:s${splitIdx++}:${remaining}`),
          _type: 'span',
          text: remaining,
          marks: [...activeMarks]
        });
      }
    } else if (node.type === 'strong') {
      const nextMarks = [...activeMarks, 'strong'];
      const sub = processInlineChildren(node.children, docId, `${currentPath}:strong`, nextMarks, markDefs);
      result.push(...sub);
    } else if (node.type === 'emphasis') {
      const nextMarks = [...activeMarks, 'em'];
      const sub = processInlineChildren(node.children, docId, `${currentPath}:em`, nextMarks, markDefs);
      result.push(...sub);
    } else if (node.type === 'inlineCode') {
      result.push({
        _key: makeKey(`${docId}:${currentPath}:code:${node.value}`),
        _type: 'span',
        text: node.value,
        marks: [...activeMarks, 'code']
      });
    } else if (node.type === 'link') {
      const linkKey = makeKey(`${docId}:${currentPath}:link:${node.url}`);
      markDefs.push({
        _key: linkKey,
        _type: 'link',
        href: node.url
      });
      const nextMarks = [...activeMarks, linkKey];
      const sub = processInlineChildren(node.children, docId, `${currentPath}:link`, nextMarks, markDefs);
      result.push(...sub);
    } else if (node.type === 'imageReference') {
      const formulaKey = `${docId}:${node.identifier}`;
      const asset = formulaMap.get(formulaKey);
      if (asset) {
        result.push({
          _key: makeKey(`${docId}:${currentPath}:formula:${node.identifier}`),
          _type: 'inlineFormula',
          formulaId: node.identifier,
          alt: node.alt || '',
          assetPath: '/' + asset.outputWebp.relativePath.replace(/\\/g, '/').replace(/^public\//, ''),
          manifestRef: `${asset.slug}/${asset.outputWebp.fileName.replace(/\.webp$/, '')}`,
          dimensions: {
            width: asset.outputWebp.width,
            height: asset.outputWebp.height
          },
          sha256: asset.outputWebp.sha256,
          originalPngSha256: asset.originalPng.sha256
        });
      } else {
        throw new Error(`Formula definition not found in manifest: ${formulaKey} at ${currentPath}`);
      }
    } else if (node.type === 'image') {
      result.push({
        _key: makeKey(`${docId}:${currentPath}:inlineImg:${node.url}`),
        _type: 'inlineImage',
        alt: node.alt || '',
        assetPath: node.url
      });
    } else if (node.type === 'break') {
      result.push({
        _key: makeKey(`${docId}:${currentPath}:br`),
        _type: 'span',
        text: '\n',
        marks: [...activeMarks]
      });
    } else {
      throw new Error(`Unsupported inline node type: ${node.type} at ${currentPath}`);
    }
  }

  return result;
}

/**
 * Process a list AST node into sequential Portable Text blocks with listItem and level.
 */
function processList(listNode, docId, listPath, level = 1) {
  const blocks = [];
  let itemIdx = 0;

  for (const item of listNode.children) {
    const itemPath = `${listPath}.i${itemIdx++}`;
    for (const child of item.children) {
      if (child.type === 'paragraph') {
        const markDefs = [];
        const spans = processInlineChildren(child.children, docId, `${itemPath}:p`, [], markDefs);
        blocks.push({
          _key: makeKey(`${docId}:${itemPath}:p`),
          _type: 'block',
          style: 'normal',
          listItem: listNode.ordered ? 'number' : 'bullet',
          level,
          children: spans,
          markDefs
        });
      } else if (child.type === 'list') {
        const nestedBlocks = processList(child, docId, `${itemPath}:sublist`, level + 1);
        blocks.push(...nestedBlocks);
      } else {
        throw new Error(`Unsupported node in listItem: ${child.type} at ${itemPath}`);
      }
    }
  }

  return blocks;
}

/**
 * Process a table AST node into a rich tableBlock preserving headers, rows, columns, and rich cells.
 */
function processTable(tableNode, docId, tablePath) {
  const rows = [];
  let rowIdx = 0;

  for (const row of tableNode.children) {
    const rowPath = `${tablePath}.r${rowIdx}`;
    const isHeader = rowIdx === 0;
    const cells = [];
    let cellIdx = 0;

    for (const cell of row.children) {
      const cellPath = `${rowPath}.c${cellIdx++}`;
      const markDefs = [];
      const spans = processInlineChildren(cell.children, docId, cellPath, [], markDefs);
      let plainText = '';
      function walkPlainText(n) {
        if (n.type === 'text') plainText += n.value;
        if (n.children) n.children.forEach(walkPlainText);
      }
      walkPlainText(cell);

      cells.push({
        _key: makeKey(`${docId}:${cellPath}`),
        plainText: plainText.trim(),
        content: [
          {
            _key: makeKey(`${docId}:${cellPath}:block`),
            _type: 'block',
            style: 'normal',
            children: spans,
            markDefs
          }
        ]
      });
    }

    rows.push({
      _key: makeKey(`${docId}:${rowPath}`),
      isHeader,
      cells
    });
    rowIdx++;
  }

  return {
    _key: makeKey(`${docId}:${tablePath}`),
    _type: 'tableBlock',
    rows
  };
}

/**
 * Extract verbatim bibliography lines from markdown source text.
 */
function extractRawBibliography(content) {
  const lines = content.split('\n');
  let refHeadingLine = -1;
  let refHeadingText = '';
  for (let i = 0; i < lines.length; i++) {
    if (/^#+\s+\*?\*?(Works cited|References|Bibliography)\*?\*?/i.test(lines[i])) {
      refHeadingLine = i;
      refHeadingText = lines[i].replace(/^#+\s+/, '').replace(/\*\*/g, '').trim();
      break;
    }
  }
  if (refHeadingLine === -1) return { heading: null, entries: [] };

  const entries = [];
  let currentEntry = null;

  for (let i = refHeadingLine + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (/^\[[^\]]+\]:\s+data:/.test(line)) {
      break;
    }
    const match = line.match(/^(\d+)\.\s+(.*)$/);
    if (match) {
      if (currentEntry) entries.push(currentEntry);
      const order = parseInt(match[1], 10);
      const itemBody = match[2];
      
      let url = null;
      const urlMatch = itemBody.match(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/) || itemBody.match(/(https?:\/\/[^\s\)]+)/);
      if (urlMatch) {
        url = urlMatch[2] || urlMatch[1];
      }
      
      let title = null;
      const titleMatch = itemBody.match(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/);
      if (titleMatch) {
        title = titleMatch[1];
      } else {
        const plainTitleMatch = itemBody.match(/^([^,\-]+)/);
        if (plainTitleMatch) title = plainTitleMatch[1].trim();
      }

      currentEntry = {
        order,
        rawText: line,
        title: title || itemBody,
        url: url || null
      };
    } else if (currentEntry) {
      currentEntry.rawText += ' ' + line;
    }
  }
  if (currentEntry) entries.push(currentEntry);

  return { heading: refHeadingText, entries };
}

/**
 * Transform a V1 MDX document into a deterministic Sanity document object.
 *
 * @param {string} docId - The document identifier (e.g. 'RES-001', 'BLG-001')
 * @param {string} relativePath - The relative path inside V1 (e.g. 'content/research/...mdx', 'content/blog/...mdx')
 * @param {object} options - Optional configuration options ({ v1Root, docType })
 * @returns {object} The transformed Sanity document
 */
function transformMdxToSanity(docId, relativePath, options = {}) {
  initManifests();
  const v1Root = options.v1Root || 'D:/goutamprusty-v1';
  const fullPath = path.join(v1Root, relativePath);
  const rawBytes = fs.readFileSync(fullPath);
  const rawText = rawBytes.toString('utf8');
  const sourceSha256 = crypto.createHash('sha256').update(rawBytes).digest('hex');

  const docType = options.docType || (docId.startsWith('BLG-') ? 'writing' : (docId.startsWith('PRJ-') ? 'project' : 'research'));

  // Parse frontmatter
  const fmMatch = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const rawFm = fmMatch ? fmMatch[1] : '';
  const fm = yaml.parse(rawFm) || {};
  const bodyText = rawText.slice(fmMatch ? fmMatch[0].length : 0);

  // Parse markdown AST
  const ast = satteri.markdownToMdast(bodyText);

  // Extract bibliography
  const { heading: bibHeading, entries: bibEntries } = extractRawBibliography(rawText);

  // Find index of terminal bibliography heading
  let bibHeadingIdx = -1;
  for (let i = 0; i < ast.children.length; i++) {
    const node = ast.children[i];
    if (node.type === 'heading') {
      const headingText = getHeadingPlainText(node);
      if (/works cited|references|bibliography/i.test(headingText)) {
        bibHeadingIdx = i;
        break;
      }
    }
  }

  const bodyNodes = bibHeadingIdx !== -1 ? ast.children.slice(0, bibHeadingIdx) : ast.children;

  // Transform body nodes
  const body = [];
  let blockIdx = 0;

  for (const node of bodyNodes) {
    const blockPath = `b${blockIdx++}`;
    if (node.type === 'heading') {
      const markDefs = [];
      const spans = processInlineChildren(node.children, docId, blockPath, [], markDefs);
      body.push({
        _key: makeKey(`${docId}:${blockPath}:h`),
        _type: 'block',
        style: `h${node.depth}`,
        children: spans,
        markDefs
      });
    } else if (node.type === 'paragraph') {
      // Check if this paragraph contains a standalone formula
      if (node.children[0]?.type === 'imageReference') {
        const refId = node.children[0].identifier;
        const formulaKey = `${docId}:${refId}`;
        if (standaloneDefs.has(formulaKey)) {
          const asset = formulaMap.get(formulaKey);
          body.push({
            _key: makeKey(`${docId}:${blockPath}:formulaBlock:${refId}`),
            _type: 'formulaBlock',
            formulaId: refId,
            alt: node.children[0].alt || '',
            assetPath: '/' + asset.outputWebp.relativePath.replace(/\\/g, '/').replace(/^public\//, ''),
            manifestRef: `${asset.slug}/${asset.outputWebp.fileName.replace(/\.webp$/, '')}`,
            dimensions: {
              width: asset.outputWebp.width,
              height: asset.outputWebp.height
            },
            sha256: asset.outputWebp.sha256,
            originalPngSha256: asset.originalPng.sha256
          });

          // Check if there are remaining children after break
          const remainingChildren = [];
          let afterBreak = false;
          for (let i = 1; i < node.children.length; i++) {
            if (node.children[i].type === 'break' && !afterBreak) {
              afterBreak = true;
              continue;
            }
            if (afterBreak) {
              remainingChildren.push(node.children[i]);
            }
          }

          if (remainingChildren.length > 0) {
            const markDefs = [];
            const spans = processInlineChildren(remainingChildren, docId, `${blockPath}:rem`, [], markDefs);
            body.push({
              _key: makeKey(`${docId}:${blockPath}:p_rem`),
              _type: 'block',
              style: 'normal',
              children: spans,
              markDefs
            });
          }
          continue;
        }
      }

      // Check if this paragraph is a standalone imageBlock
      if (node.children.length === 1 && node.children[0].type === 'image') {
        body.push({
          _key: makeKey(`${docId}:${blockPath}:imageBlock:${node.children[0].url}`),
          _type: 'imageBlock',
          alt: node.children[0].alt || '',
          assetPath: node.children[0].url
        });
        continue;
      }

      // Normal paragraph
      const markDefs = [];
      const spans = processInlineChildren(node.children, docId, blockPath, [], markDefs);
      body.push({
        _key: makeKey(`${docId}:${blockPath}:p`),
        _type: 'block',
        style: 'normal',
        children: spans,
        markDefs
      });
    } else if (node.type === 'blockquote') {
      for (const child of node.children) {
        if (child.type === 'paragraph') {
          const markDefs = [];
          const spans = processInlineChildren(child.children, docId, `${blockPath}:bq`, [], markDefs);
          body.push({
            _key: makeKey(`${docId}:${blockPath}:bq`),
            _type: 'block',
            style: 'blockquote',
            children: spans,
            markDefs
          });
        }
      }
    } else if (node.type === 'list') {
      const listBlocks = processList(node, docId, blockPath, 1);
      body.push(...listBlocks);
    } else if (node.type === 'table') {
      const tableBlock = processTable(node, docId, blockPath);
      body.push(tableBlock);
    } else if (node.type === 'code') {
      if (node.lang === 'mermaid') {
        body.push({
          _key: makeKey(`${docId}:${blockPath}:mermaid`),
          _type: 'mermaidBlock',
          code: node.value
        });
      } else {
        body.push({
          _key: makeKey(`${docId}:${blockPath}:code`),
          _type: 'codeBlock',
          language: node.lang || 'text',
          code: node.value
        });
      }
    } else if (node.type === 'thematicBreak') {
      body.push({
        _key: makeKey(`${docId}:${blockPath}:hr`),
        _type: 'dividerBlock'
      });
    } else if (node.type === 'definition') {
      // Markdown reference definitions are captured in formula asset manifest and source archive
    } else {
      throw new Error(`Unsupported root AST node type: ${node.type} at ${blockPath}`);
    }
  }

  // Construct source archive metadata
  const sourceArchive = {
    v1GitCommit: '71ef2c7c5c6a8995cc6901d350cc29c35d427423',
    v1RelativePath: relativePath,
    sourceSha256,
    rawMdxBytes: rawBytes.length,
    archiveVersion: 'v1.0.0-baseline'
  };

  const parsedBibliography = bibEntries.map((be, beIdx) => ({
    _key: makeKey(`${docId}:bib:${be.order}:${beIdx}`),
    order: be.order,
    rawText: be.rawText,
    title: be.title,
    url: be.url
  }));

  // Construct document by type
  if (docType === 'writing') {
    return {
      _id: `writing-${docId}`,
      _type: 'writing',
      workbookId: docId,
      title: fm.title || '',
      slug: {
        _type: 'slug',
        current: fm.slug || path.basename(relativePath, '.mdx')
      },
      summary: fm.summary || '',
      status: fm.status || 'draft',
      publishedAt: fm.publishedAt || '',
      updatedAt: fm.updatedAt || null,
      category: fm.category || '',
      tags: fm.tags || [],
      sourceReport: fm.sourceReport || null,
      relatedProjects: fm.relatedProjects || [],
      coverImage: fm.coverImage ? {
        _type: 'image',
        assetPath: fm.coverImage,
        alt: fm.coverImageAlt || ''
      } : null,
      readingTimeOverride: fm.readingTimeOverride || null,
      seo: fm.seo ? {
        metaTitle: fm.seo.metaTitle || '',
        metaDescription: fm.seo.metaDescription || ''
      } : null,
      canonicalUrl: fm.canonicalUrl || null,
      bibliographyHeading: bibHeading,
      bibliography: parsedBibliography,
      body,
      sourceArchive
    };
  }

  if (docType === 'project') {
    return {
      _id: `project-${docId}`,
      _type: 'project',
      workbookId: docId,
      title: fm.title || '',
      slug: {
        _type: 'slug',
        current: fm.slug || path.basename(relativePath, '.mdx')
      },
      summary: fm.summary || '',
      status: fm.status || 'draft',
      featured: fm.featured === true,
      startDate: fm.startDate || '',
      endDate: fm.endDate || null,
      category: fm.category || '',
      tags: fm.tags || [],
      role: fm.role || '',
      links: fm.links || {},
      techStack: fm.techStack || [],
      coverImage: fm.coverImage ? {
        _type: 'image',
        assetPath: fm.coverImage,
        alt: fm.coverImageAlt || ''
      } : null,
      relatedResearch: fm.relatedResearch || [],
      relatedWriting: fm.relatedWriting || [],
      body,
      sourceArchive
    };
  }

  // Default: Research document
  return {
    _id: `research-${docId}`,
    _type: 'research',
    workbookId: docId,
    title: fm.title || '',
    slug: {
      _type: 'slug',
      current: fm.slug || path.basename(relativePath, '.mdx')
    },
    summary: fm.summary || '',
    status: fm.status || 'draft',
    publishedAt: fm.publishedAt || '',
    category: fm.category || '',
    tags: fm.tags || [],
    researchMethod: fm.researchMethod || '',
    lengthEstimateMinutes: fm.lengthEstimateMinutes || 0,
    coverImage: fm.coverImage ? {
      _type: 'image',
      assetPath: fm.coverImage
    } : null,
    derivedPosts: fm.derivedPosts || [],
    relatedProjects: fm.relatedProjects || [],
    sourceMaterial: (fm.sourceMaterial || []).map((sm, smIdx) => ({
      _key: makeKey(`${docId}:sm:${smIdx}:${sm.title}`),
      title: sm.title,
      url: sm.url || null
    })),
    bibliographyHeading: bibHeading,
    bibliography: parsedBibliography,
    body,
    sourceArchive
  };
}

module.exports = {
  transformMdxToSanity,
  extractRawBibliography,
  getHeadingPlainText
};
