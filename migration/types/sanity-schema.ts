/**
 * Sanity Content Architecture Type Definitions
 * goutamprusty.com v2 Rebuild — Milestone 1C Parser Hardening
 *
 * Defines the Portable Text and document interfaces for both
 * Research reports and Editorial Writing / Blog documents.
 */

export interface SourceArchiveMetadata {
  v1GitCommit: string;
  v1RelativePath: string;
  sourceSha256: string;
  rawMdxBytes: number;
  archiveVersion: string;
}

export interface SourceMaterialEntry {
  _key: string;
  title: string;
  url: string | null;
}

export interface BibliographyEntry {
  _key: string;
  order: number;
  rawText: string;
  title: string;
  url: string | null;
}

export interface SpanObject {
  _key: string;
  _type: 'span';
  text: string;
  marks: string[];
}

export interface CitationMarkerObject {
  _key: string;
  _type: 'citationMarker';
  citationNumber: number;
  rawMarker: string;
}

export interface InlineFormulaObject {
  _key: string;
  _type: 'inlineFormula';
  formulaId: string;
  alt: string;
  assetPath: string;
  manifestRef: string;
  dimensions: {
    width: number;
    height: number;
  };
  sha256: string;
  originalPngSha256: string;
}

export interface InlineImageObject {
  _key: string;
  _type: 'inlineImage';
  alt: string;
  assetPath: string;
}

export interface MarkDefLink {
  _key: string;
  _type: 'link';
  href: string;
}

export type MarkDef = MarkDefLink;

export interface StandardBlock {
  _key: string;
  _type: 'block';
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote';
  listItem?: 'bullet' | 'number';
  level?: number;
  children: Array<SpanObject | CitationMarkerObject | InlineFormulaObject | InlineImageObject>;
  markDefs: MarkDef[];
}

export interface FormulaBlock {
  _key: string;
  _type: 'formulaBlock';
  formulaId: string;
  alt: string;
  assetPath: string;
  manifestRef: string;
  dimensions: {
    width: number;
    height: number;
  };
  sha256: string;
  originalPngSha256: string;
}

export interface ImageBlock {
  _key: string;
  _type: 'imageBlock';
  alt: string;
  assetPath: string;
}

export interface TableCell {
  _key: string;
  plainText: string;
  content: StandardBlock[];
}

export interface TableRow {
  _key: string;
  isHeader: boolean;
  cells: TableCell[];
}

export interface TableBlock {
  _key: string;
  _type: 'tableBlock';
  rows: TableRow[];
}

export interface MermaidBlock {
  _key: string;
  _type: 'mermaidBlock';
  code: string;
}

export interface CodeBlock {
  _key: string;
  _type: 'codeBlock';
  language: string;
  code: string;
}

export interface DividerBlock {
  _key: string;
  _type: 'dividerBlock';
}

export type BodyBlock =
  | StandardBlock
  | FormulaBlock
  | ImageBlock
  | TableBlock
  | MermaidBlock
  | CodeBlock
  | DividerBlock;

export interface ResearchDocument {
  _id: string;
  _type: 'research';
  workbookId: string;
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  summary: string;
  status: string;
  publishedAt: string;
  category: string;
  tags: string[];
  researchMethod: string;
  lengthEstimateMinutes: number;
  coverImage: {
    _type?: string;
    assetPath: string;
    alt?: string;
  } | null;
  derivedPosts: string[];
  relatedProjects: string[];
  sourceMaterial: SourceMaterialEntry[];
  bibliographyHeading: string | null;
  bibliography: BibliographyEntry[];
  body: BodyBlock[];
  sourceArchive: SourceArchiveMetadata;
  featured?: boolean;
  editorialStatus?: 'draft' | 'in_review' | 'approved';
  editorialNotes?: string;
}

export interface WritingDocument {
  _id: string;
  _type: 'writing';
  workbookId: string;
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  summary: string;
  status: string;
  publishedAt: string;
  updatedAt: string | null;
  category: string;
  tags: string[];
  sourceReport: string | null;
  relatedProjects: string[];
  topics?: string[];
  author?: string;
  coverImage: {
    _type?: string;
    assetPath: string;
    alt?: string;
  } | null;
  readingTimeOverride: number | null;
  seo: {
    metaTitle: string;
    metaDescription: string;
  } | null;
  canonicalUrl: string | null;
  bibliographyHeading: string | null;
  bibliography: BibliographyEntry[];
  body: BodyBlock[];
  sourceArchive: SourceArchiveMetadata;
  featured?: boolean;
  editorialStatus?: 'draft' | 'in_review' | 'approved';
  editorialNotes?: string;
}

export interface ProjectLinks {
  repo?: string | null;
  live?: string | null;
  demo?: string | null;
}

export interface ProjectDocument {
  _id: string;
  _type: 'project';
  workbookId: string;
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  summary: string;
  status: string;
  legacyFeatured?: boolean;
  featured: boolean;
  startDate: string;
  endDate: string | null;
  category: string;
  tags: string[];
  role: string;
  links: ProjectLinks;
  techStack: string[];
  coverImage: {
    _type?: string;
    assetPath: string;
    alt?: string;
  } | null;
  relatedResearch: string[];
  relatedWriting?: string[];
  topics?: string[];
  body: BodyBlock[];
  sourceArchive: SourceArchiveMetadata;
  editorialStatus?: 'draft' | 'in_review' | 'approved';
  editorialNotes?: string;
}

export interface TopicDocument {
  _id: string;
  _type: 'topic';
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  domain: string;
  description: string;
  featured?: boolean;
  order?: number;
  relatedResearch?: string[];
  relatedWriting?: string[];
  relatedProjects?: string[];
}

export interface AuthorDocument {
  _id: string;
  _type: 'author';
  authorId: string;
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  bio?: string;
  url?: string;
  avatar?: {
    _type: 'image';
    assetPath: string;
  } | null;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
}

export interface EditorialMetadata {
  featured: boolean;
  editorialStatus: 'draft' | 'in_review' | 'approved';
  editorialNotes?: string;
}

/** Sanity Studio Schema Definition Meta-Types */
export interface SanityValidationRule {
  required: () => SanityValidationRule;
  min: (val: number) => SanityValidationRule;
  max: (val: number) => SanityValidationRule;
  uri: (options?: { allowRelative?: boolean; scheme?: string[] }) => SanityValidationRule;
  custom: (fn: (value: any) => true | string | Promise<true | string>) => SanityValidationRule;
  warning: (message?: string) => SanityValidationRule;
  error: (message?: string) => SanityValidationRule;
  [key: string]: any;
}

export interface SanityFieldDefinition {
  name: string;
  title: string;
  type: string;
  description?: string;
  readOnly?: boolean;
  hidden?: boolean;
  initialValue?: any;
  options?: Record<string, any>;
  of?: Array<{ type: string; [key: string]: any }>;
  to?: Array<{ type: string }>;
  fields?: SanityFieldDefinition[];
  validation?: (rule: SanityValidationRule) => any;
  [key: string]: any;
}

export interface SanitySchemaDefinition {
  name: string;
  title: string;
  type: 'document' | 'object' | 'array' | 'string';
  icon?: any;
  fields?: SanityFieldDefinition[];
  of?: Array<{ type: string; [key: string]: any }>;
  preview?: {
    select?: Record<string, string>;
    prepare?: (selection: Record<string, any>) => { title?: string; subtitle?: string; media?: any };
  };
  [key: string]: any;
}
