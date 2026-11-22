/**
 * Sanity Content Architecture Schema Definitions
 * goutamprusty.com v2 Rebuild — Milestone 2 Schema Implementation
 *
 * Authoritative schema definitions for Sanity Studio v3.
 * Exports document types, custom Portable Text block objects,
 * inline components, and provenance/source archive structures.
 */

// Document schemas
import { research } from './documents/research';
import { writing } from './documents/writing';
import { project } from './documents/project';
import { topic } from './documents/topic';
import { author } from './documents/author';

// Object & block schemas
import { citationMarker } from './objects/citationMarker';
import { inlineFormula } from './objects/inlineFormula';
import { formulaBlock } from './objects/formulaBlock';
import { inlineImage } from './objects/inlineImage';
import { imageBlock } from './objects/imageBlock';
import { tableCell, tableRow, tableBlock } from './objects/tableBlock';
import { mermaidBlock } from './objects/mermaidBlock';
import { codeBlock } from './objects/codeBlock';
import { dividerBlock } from './objects/dividerBlock';
import { bibliographyEntry } from './objects/bibliographyEntry';
import { sourceMaterialEntry } from './objects/sourceMaterialEntry';
import { sourceArchive } from './objects/sourceArchive';
import { seo } from './objects/seo';
import { portableTextBody } from './objects/portableText';

export {
  // Documents
  research,
  writing,
  project,
  topic,
  author,
  // Objects & Blocks
  citationMarker,
  inlineFormula,
  formulaBlock,
  inlineImage,
  imageBlock,
  tableCell,
  tableRow,
  tableBlock,
  mermaidBlock,
  codeBlock,
  dividerBlock,
  bibliographyEntry,
  sourceMaterialEntry,
  sourceArchive,
  seo,
  portableTextBody,
};

export const documentTypes = [
  research,
  writing,
  project,
  topic,
  author,
];

export const objectTypes = [
  citationMarker,
  inlineFormula,
  formulaBlock,
  inlineImage,
  imageBlock,
  tableCell,
  tableRow,
  tableBlock,
  mermaidBlock,
  codeBlock,
  dividerBlock,
  bibliographyEntry,
  sourceMaterialEntry,
  sourceArchive,
  seo,
  portableTextBody,
];

/**
 * Full schema array for Sanity Studio v3 configuration.
 * import { schemaTypes } from './migration/schema';
 * export default defineConfig({ schema: { types: schemaTypes } });
 */
export const schemaTypes = [
  ...documentTypes,
  ...objectTypes,
];

export default schemaTypes;
