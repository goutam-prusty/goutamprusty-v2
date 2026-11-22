import { research } from './research';
import { writing } from './writing';
import { author } from './author';
import { topic } from './topic';
import { project } from './project';
import { portableTextBody } from './portableText';
import { tableBlock, tableRow, tableCell } from './tableBlock';
import { formulaBlock } from './formulaBlock';
import { inlineFormula } from './inlineFormula';
import { imageBlock } from './imageBlock';
import { inlineImage } from './inlineImage';
import { codeBlock } from './codeBlock';
import { mermaidBlock } from './mermaidBlock';
import { dividerBlock } from './dividerBlock';
import { citationMarker } from './citationMarker';
import { bibliographyEntry } from './bibliographyEntry';
import { sourceMaterialEntry } from './sourceMaterialEntry';
import { sourceArchive, seo } from './metadataObjects';

export const schemaTypes = [
  // Documents
  research,
  writing,
  author,
  topic,
  project,

  // Objects & Blocks
  portableTextBody,
  tableBlock,
  tableRow,
  tableCell,
  formulaBlock,
  inlineFormula,
  imageBlock,
  inlineImage,
  codeBlock,
  mermaidBlock,
  dividerBlock,
  citationMarker,
  bibliographyEntry,
  sourceMaterialEntry,
  sourceArchive,
  seo,
];
