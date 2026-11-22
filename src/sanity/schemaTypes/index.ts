import { research } from './research';
import { writing } from './writing';
import { portableTextBody } from './portableText';
import { tableBlock, tableRow, tableCell } from './tableBlock';
import { formulaBlock } from './formulaBlock';
import { citationMarker } from './citationMarker';
import { bibliographyEntry } from './bibliographyEntry';
import { sourceMaterialEntry } from './sourceMaterialEntry';
import { sourceArchive, seo } from './metadataObjects';

export const schemaTypes = [
  // Documents
  research,
  writing,

  // Objects & Blocks
  portableTextBody,
  tableBlock,
  tableRow,
  tableCell,
  formulaBlock,
  citationMarker,
  bibliographyEntry,
  sourceMaterialEntry,
  sourceArchive,
  seo,
];
