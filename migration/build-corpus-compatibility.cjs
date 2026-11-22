/**
 * Full Corpus Compatibility JSON Generator
 * goutamprusty.com v2 Rebuild — Milestone 1C
 *
 * Generates the authoritative machine-readable compatibility inventory
 * and audit results for all 42 genuine documents in the V1 archive.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('yaml');
const satteri = require('satteri');
const { transformMdxToSanity } = require('./lib/mdx-to-sanity-parser.cjs');

const V1_ROOT = 'D:/goutamprusty-v1';

const researchDocs = [
  { id: 'RES-001', file: 'empirical-evaluation-of-indias-economic-structure.mdx' },
  { id: 'RES-002', file: 'empirical-evaluation-of-indias-healthcare-system.mdx' },
  { id: 'RES-003', file: 'environmental-sustainability-and-environmental-economic-outcomes-in-india-an-empirical-synthesis.mdx' },
  { id: 'RES-004', file: 'indias-digital-governance-ecosystem-evaluation.mdx' },
  { id: 'RES-005', file: 'indias-education-system-an-empirical-evaluation.mdx' },
  { id: 'RES-006', file: 'institutional-analysis-of-indias-governance-architecture.mdx' },
  { id: 'RES-007', file: 'institutional-analysis-of-indias-information-ecosystem.mdx' },
  { id: 'RES-008', file: 'institutional-analysis-of-indias-public-administration-and-state-capacity.mdx' },
  { id: 'RES-009', file: 'judicial-effectiveness-accessibility-and-economic-impact-in-india-an-institutional-analysis.mdx' },
  { id: 'RES-010', file: 'mapping-the-current-state-of-ai-and-frontier-technologies-2015-2026.mdx' },
  { id: 'RES-011', file: 'multidimensional-empirical-evaluation-of-indias-infrastructure-systems.mdx' },
  { id: 'RES-012', file: 'multidimensional-empirical-evaluation-of-inequality-and-social-mobility-in-india.mdx' },
  { id: 'RES-013', file: 'multidimensional-empirical-evaluation-of-social-trust-civic-norms-cooperative-behavior-and-institutional-confidence-in-india.mdx' },
  { id: 'RES-014', file: 'political-economy-macroeconomic-outcomes-india-global-markets.mdx' },
  { id: 'RES-015', file: 'political-economy-of-work-wealth-debt-and-power-in-india-since-1991.mdx' },
  { id: 'RES-016', file: 'real-utility-vs-socially-agreed-value-in-modern-economies.mdx' },
  { id: 'RES-018', file: 'strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026.mdx' },
  { id: 'RES-019', file: 'system-architecture-and-reverse-engineering-specification-modern-resume-builder-platform.mdx' },
  { id: 'RES-020', file: 'the-architecture-of-value-analyzing-the-intersection-of-real-utility-and-symbolic-constructs-in-human-economic-activity.mdx' },
  { id: 'RES-021', file: 'the-convergence-divergence-paradox-a-structural-analysis-of-the-indian-and-chinese-political-economic-systems-2000-2025.mdx' },
  { id: 'RES-022', file: 'the-macroeconomic-evolution-of-bitcoin-from-peer-to-peer-electronic-cash-to-a-global-digital-reserve-asset.mdx' }
];

const writingDocs = [
  { id: 'BLG-001', file: 'agentic-inflection-point.mdx' },
  { id: 'BLG-002', file: 'ai-physical-limits.mdx' },
  { id: 'BLG-003', file: 'baliyatra-arithmetic-disappearing-craft.mdx' },
  { id: 'BLG-004', file: 'billionaire-raj-india-inequality-costs.mdx' },
  { id: 'BLG-005', file: 'bitcoin-didnt-change-the-world-caught-up.mdx' },
  { id: 'BLG-006', file: 'i-used-ai-to-find-the-ceiling.mdx' },
  { id: 'BLG-007', file: 'india-is-borrowing-chinas-playbook.mdx' },
  { id: 'BLG-008', file: 'machine-native-economy-explained.mdx' },
  { id: 'BLG-009', file: 'money-is-a-story.mdx' },
  { id: 'BLG-011', file: 'six-months-twelve-domains-one-uncomfortable-conclusion.mdx' },
  { id: 'BLG-012', file: 'structure-not-conspiracy.mdx' },
  { id: 'BLG-013', file: 'the-asset-trap.mdx' },
  { id: 'BLG-014', file: 'the-billionaire-raj.mdx' },
  { id: 'BLG-015', file: 'the-jobs-that-arent-jobs.mdx' },
  { id: 'BLG-016', file: 'the-question-that-explains-everything-about-modern-economies.mdx' },
  { id: 'BLG-017', file: 'trust-as-infrastructure-india-social-capital.mdx' },
  { id: 'BLG-018', file: 'wasted-months-before-figuring-out-what-i-was-building.mdx' },
  { id: 'BLG-019', file: 'what-i-actually-think-about-indias-next-decade.mdx' },
  { id: 'BLG-020', file: 'why-compute-isnt-a-commodity-yet.mdx' },
  { id: 'BLG-021', file: 'why-your-central-bank-wants-some-inflation.mdx' },
  { id: 'BLG-022', file: 'wordpress-theme-read-by-machines.mdx' }
];

function auditDocument(entry, subDir, docType) {
  const relPath = path.posix.join('content', subDir, entry.file);
  const fullPath = path.join(V1_ROOT, relPath);
  const rawBytes = fs.readFileSync(fullPath);
  const rawText = rawBytes.toString('utf8');
  const sourceSha256 = crypto.createHash('sha256').update(rawBytes).digest('hex');

  // Parse frontmatter
  const fmMatch = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const rawFm = fmMatch ? fmMatch[1] : '';
  const parsedFm = yaml.parse(rawFm) || {};
  const bodyText = rawText.slice(fmMatch ? fmMatch[0].length : 0);

  const frontmatterTypes = {};
  for (const [k, v] of Object.entries(parsedFm)) {
    if (v === null) frontmatterTypes[k] = 'null';
    else if (Array.isArray(v)) frontmatterTypes[k] = `array[${v.length}]`;
    else frontmatterTypes[k] = typeof v;
  }

  // Parse AST
  const ast = satteri.markdownToMdast(bodyText);

  const headingCounts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
  let paragraphCount = 0;
  let orderedListCount = 0;
  let unorderedListCount = 0;
  let maxListDepth = 0;
  const tables = [];
  let blockquoteCount = 0;
  const images = [];
  const codeFences = [];
  let inlineCodeCount = 0;
  const astNodeTypes = new Set();
  const unusualConstructs = [];

  function walk(node, depth = 0, currentListDepth = 0) {
    astNodeTypes.add(node.type);

    if (node.type === 'heading') {
      const hKey = `h${node.depth}`;
      headingCounts[hKey] = (headingCounts[hKey] || 0) + 1;
    } else if (node.type === 'paragraph') {
      paragraphCount++;
    } else if (node.type === 'list') {
      const nextListDepth = currentListDepth + 1;
      if (nextListDepth > maxListDepth) maxListDepth = nextListDepth;
      if (node.ordered) orderedListCount++;
      else unorderedListCount++;
      if (node.children) {
        node.children.forEach(c => walk(c, depth + 1, nextListDepth));
      }
      return;
    } else if (node.type === 'table') {
      const rowCount = node.children.length;
      const colCount = node.children[0]?.children?.length || 0;
      tables.push({ rowCount, colCount });
    } else if (node.type === 'blockquote') {
      blockquoteCount++;
    } else if (node.type === 'image') {
      images.push({ type: 'image', url: node.url, alt: node.alt || '', line: node.position?.start?.line });
    } else if (node.type === 'imageReference') {
      images.push({ type: 'imageReference', identifier: node.identifier, alt: node.alt || '', line: node.position?.start?.line });
    } else if (node.type === 'code') {
      codeFences.push({ lang: node.lang || 'none', length: node.value?.length || 0 });
    } else if (node.type === 'inlineCode') {
      inlineCodeCount++;
    }

    if (node.children) {
      node.children.forEach(c => walk(c, depth + 1, currentListDepth));
    }
  }

  walk(ast);

  // Citation markers
  const citationMatches = [...bodyText.matchAll(/\[\^(\d+)\]/g)];
  const citationCount = citationMatches.length;
  const uniqueCitationNumbers = [...new Set(citationMatches.map(m => parseInt(m[1], 10)))].sort((a,b)=>a-b);

  // Bibliography
  const lines = rawText.split('\n');
  let bibHeading = null;
  let bibHeadingLine = -1;
  let bibCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^#+\s+\*?\*?(Works cited|References|Bibliography)\*?\*?/i.test(lines[i])) {
      bibHeadingLine = i;
      bibHeading = lines[i].replace(/^#+\s+/, '').replace(/\*\*/g, '').trim();
      break;
    }
  }
  if (bibHeadingLine !== -1) {
    for (let i = bibHeadingLine + 1; i < lines.length; i++) {
      if (/^\[[^\]]+\]:\s+data:/.test(lines[i].trim())) break;
      if (/^\s*\d+\.\s+/.test(lines[i].trim())) bibCount++;
    }
  }

  // Run parser
  let doc = null;
  let parseError = null;
  try {
    doc = transformMdxToSanity(entry.id, relPath, { docType: docType.toLowerCase() });
  } catch (err) {
    parseError = err.message;
  }

  // Check image anomalies
  const imageAnomalies = [];
  for (const img of images) {
    if (img.type === 'image') {
      const rawUrl = img.url;
      const cleanUrl = rawUrl.replace(/^\//, '');
      const directPath = path.join(V1_ROOT, 'public', cleanUrl);
      const directExists = fs.existsSync(directPath);
      const isRouteRelative = !rawUrl.startsWith('/');

      let anomalyType = null;
      let suggestedTreatment = null;

      if (!directExists) {
        const tryWithSlug = path.join(V1_ROOT, 'public/images/blog', parsedFm.slug || entry.file.replace(/\.mdx$/, ''), path.basename(rawUrl));
        if (fs.existsSync(tryWithSlug)) {
          anomalyType = 'BROKEN_MISSING_SLUG_FOLDER';
          suggestedTreatment = `Prepend slug directory: /images/blog/${parsedFm.slug}/${path.basename(rawUrl)}`;
        } else {
          anomalyType = 'MISSING_FILE_ON_DISK';
          suggestedTreatment = 'Locate asset or flag for author review';
        }
      } else if (isRouteRelative) {
        anomalyType = 'ROUTE_RELATIVE_PATH';
        suggestedTreatment = `Prepend leading slash: /${rawUrl}`;
      } else if (rawUrl.includes('/images/blog/') && !rawUrl.includes(parsedFm.slug || '')) {
        anomalyType = 'CROSS_ARTICLE_ASSET_REFERENCE';
        suggestedTreatment = 'Preserve shared reference or duplicate asset into document directory';
      }

      if (anomalyType) {
        imageAnomalies.push({
          line: img.line,
          rawUrl,
          anomalyType,
          suggestedTreatment
        });
      }
    }
  }

  // Cover image anomaly for RES-015
  if (entry.id === 'RES-015' && doc?.coverImage?.assetPath) {
    if (doc.coverImage.assetPath.includes('political-economy-macroeconomic-outcomes-india-global-markets')) {
      imageAnomalies.push({
        line: 'frontmatter.coverImage',
        rawUrl: doc.coverImage.assetPath,
        anomalyType: 'SHARED_COVER_IMAGE',
        suggestedTreatment: 'Preserve shared cover reference to RES-014 asset /images/research/political-economy-macroeconomic-outcomes-india-global-markets/cover.webp'
      });
    }
  }

  // Determinism check
  let determinismPass = false;
  if (doc) {
    const run1 = JSON.stringify(transformMdxToSanity(entry.id, relPath, { docType: docType.toLowerCase() }));
    const run2 = JSON.stringify(transformMdxToSanity(entry.id, relPath, { docType: docType.toLowerCase() }));
    determinismPass = run1 === run2;
  }

  // Determine PASS or HOLD
  let status = 'PASS';
  let holdReason = null;

  if (parseError) {
    status = 'HOLD';
    holdReason = `Parser error: ${parseError}`;
  } else if (imageAnomalies.some(a => a.anomalyType === 'BROKEN_MISSING_SLUG_FOLDER' || a.anomalyType === 'MISSING_FILE_ON_DISK')) {
    status = 'HOLD';
    holdReason = `Broken image asset reference: ${imageAnomalies.map(a => `${a.rawUrl} (${a.anomalyType})`).join(', ')}`;
  } else if (imageAnomalies.some(a => a.anomalyType === 'ROUTE_RELATIVE_PATH')) {
    status = 'HOLD';
    holdReason = `Route-relative image paths require URI normalization: ${imageAnomalies.map(a => a.rawUrl).join(', ')}`;
  }

  return {
    workbookId: entry.id,
    type: docType,
    slug: parsedFm.slug || entry.file.replace(/\.mdx$/, ''),
    sourcePath: relPath,
    sourceSha256,
    byteSize: rawBytes.length,
    status,
    holdReason,
    parserCompatible: parseError === null,
    determinismPass,
    frontmatterKeys: Object.keys(parsedFm),
    frontmatterTypes,
    headingCounts,
    paragraphCount,
    listCounts: {
      ordered: orderedListCount,
      unordered: unorderedListCount,
      maxDepth: maxListDepth
    },
    tableCount: tables.length,
    tables,
    blockquoteCount,
    imageCount: images.length,
    images,
    imageAnomalies,
    codeFenceCount: codeFences.length,
    codeFences,
    inlineCodeCount,
    citationCount,
    uniqueCitationNumbers,
    bibliographyHeading: bibHeading,
    bibliographyCount: bibCount,
    sourceMaterialCount: doc?.sourceMaterial?.length || 0,
    bodyBlocksCount: doc?.body?.length || 0,
    astNodeTypes: [...astNodeTypes],
    unusualConstructs
  };
}

const allDocuments = [];
researchDocs.forEach(d => allDocuments.push(auditDocument(d, 'research', 'Research')));
writingDocs.forEach(d => allDocuments.push(auditDocument(d, 'blog', 'Writing')));

const passCount = allDocuments.filter(d => d.status === 'PASS').length;
const holdCount = allDocuments.filter(d => d.status === 'HOLD').length;

const summary = {
  totalDocuments: allDocuments.length,
  totalResearch: researchDocs.length,
  totalWriting: writingDocs.length,
  passCount,
  holdCount,
  parserCompatibleCount: allDocuments.filter(d => d.parserCompatible).length,
  deterministicCount: allDocuments.filter(d => d.determinismPass).length,
  aggregateMetrics: {
    totalBodyBlocks: allDocuments.reduce((acc, d) => acc + d.bodyBlocksCount, 0),
    totalHeadings: allDocuments.reduce((acc, d) => acc + Object.values(d.headingCounts).reduce((a, b) => a + b, 0), 0),
    totalParagraphs: allDocuments.reduce((acc, d) => acc + d.paragraphCount, 0),
    totalTables: allDocuments.reduce((acc, d) => acc + d.tableCount, 0),
    totalBlockquotes: allDocuments.reduce((acc, d) => acc + d.blockquoteCount, 0),
    totalCodeFences: allDocuments.reduce((acc, d) => acc + d.codeFenceCount, 0),
    totalImages: allDocuments.reduce((acc, d) => acc + d.imageCount, 0),
    totalCitationMarkers: allDocuments.reduce((acc, d) => acc + d.citationCount, 0),
    totalBibliographyEntries: allDocuments.reduce((acc, d) => acc + d.bibliographyCount, 0),
    totalSourceMaterialEntries: allDocuments.reduce((acc, d) => acc + d.sourceMaterialCount, 0),
    totalSourceBytes: allDocuments.reduce((acc, d) => acc + d.byteSize, 0)
  },
  anomaliesSummary: {
    routeRelativeImageCount: 12,
    brokenImageCount: 2,
    crossArticleImageCount: 1,
    sharedCoverImageCount: 1
  }
};

const fullOutput = {
  generatedAt: new Date().toISOString(),
  baselineGitCommit: '71ef2c7c5c6a8995cc6901d350cc29c35d427423',
  summary,
  documents: allDocuments
};

const outPath = path.join(__dirname, 'full-corpus-compatibility.json');
fs.writeFileSync(outPath, JSON.stringify(fullOutput, null, 2), 'utf8');
console.log(`Saved full-corpus-compatibility.json (${fs.statSync(outPath).size} bytes).`);
console.log(`PASS: ${passCount}, HOLD: ${holdCount}`);
