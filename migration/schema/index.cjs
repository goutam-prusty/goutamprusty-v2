/**
 * Sanity Content Architecture Schema Definitions (CommonJS Runtime)
 * goutamprusty.com v2 Rebuild — Milestone 2 Schema Implementation
 *
 * Provides CommonJS exports for local offline validation test runners
 * and Node.js ingestion utilities.
 */

// Helper to mimic Sanity rule builder
function createRule() {
  const rule = {
    _required: false,
    _min: null,
    _max: null,
    _uriOptions: null,
    _customFns: [],
    _warning: null,
    _error: null,
    required() {
      rule._required = true;
      return rule;
    },
    min(val) {
      rule._min = val;
      return rule;
    },
    max(val) {
      rule._max = val;
      return rule;
    },
    uri(opts) {
      rule._uriOptions = opts;
      return rule;
    },
    custom(fn) {
      rule._customFns.push(fn);
      return rule;
    },
    warning(msg) {
      rule._warning = msg;
      return rule;
    },
    error(msg) {
      rule._error = msg;
      return rule;
    }
  };
  return rule;
}

// Objects & Blocks

const citationMarker = {
  name: 'citationMarker',
  title: 'Citation Marker',
  type: 'object',
  fields: [
    {
      name: 'citationNumber',
      title: 'Citation Number',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
      description: 'Numerical citation index matching the corresponding bibliography entry.'
    },
    {
      name: 'rawMarker',
      title: 'Raw Citation Marker',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Verbatim original markdown citation string (e.g. "15" or "[^15]").'
    }
  ]
};

const inlineFormula = {
  name: 'inlineFormula',
  title: 'Inline Formula',
  type: 'object',
  fields: [
    {
      name: 'formulaId',
      title: 'Formula ID',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'alt',
      title: 'Alternative Text',
      type: 'string'
    },
    {
      name: 'assetPath',
      title: 'Presentation Asset Path',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'manifestRef',
      title: 'Manifest Reference',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'dimensions',
      title: 'Pixel Dimensions',
      type: 'object',
      fields: [
        { name: 'width', title: 'Width (px)', type: 'number', validation: (Rule) => Rule.required() },
        { name: 'height', title: 'Height (px)', type: 'number', validation: (Rule) => Rule.required() }
      ],
      validation: (Rule) => Rule.required()
    },
    {
      name: 'sha256',
      title: 'WebP SHA-256',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'originalPngSha256',
      title: 'Original PNG SHA-256',
      type: 'string',
      validation: (Rule) => Rule.required()
    }
  ]
};

const formulaBlock = {
  name: 'formulaBlock',
  title: 'Formula Block (Standalone Equation)',
  type: 'object',
  fields: [
    {
      name: 'formulaId',
      title: 'Formula ID',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'alt',
      title: 'Alternative Text',
      type: 'string'
    },
    {
      name: 'assetPath',
      title: 'Presentation Asset Path',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'manifestRef',
      title: 'Manifest Reference',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'dimensions',
      title: 'Pixel Dimensions',
      type: 'object',
      fields: [
        { name: 'width', title: 'Width (px)', type: 'number', validation: (Rule) => Rule.required() },
        { name: 'height', title: 'Height (px)', type: 'number', validation: (Rule) => Rule.required() }
      ],
      validation: (Rule) => Rule.required()
    },
    {
      name: 'sha256',
      title: 'WebP SHA-256',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'originalPngSha256',
      title: 'Original PNG SHA-256',
      type: 'string',
      validation: (Rule) => Rule.required()
    }
  ]
};

const inlineImage = {
  name: 'inlineImage',
  title: 'Inline Image',
  type: 'object',
  fields: [
    {
      name: 'assetPath',
      title: 'Asset Path',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'alt',
      title: 'Alternative Text',
      type: 'string'
    }
  ]
};

const imageBlock = {
  name: 'imageBlock',
  title: 'Image Block',
  type: 'object',
  fields: [
    {
      name: 'assetPath',
      title: 'Asset Path',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'alt',
      title: 'Alternative Text',
      type: 'string'
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string'
    }
  ]
};

const tableCell = {
  name: 'tableCell',
  title: 'Table Cell',
  type: 'object',
  fields: [
    {
      name: 'plainText',
      title: 'Plain Text Representation',
      type: 'string'
    },
    {
      name: 'content',
      title: 'Rich Cell Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }]
              }
            ]
          },
          of: [
            { type: 'inlineFormula' },
            { type: 'citationMarker' },
            { type: 'inlineImage' }
          ]
        }
      ]
    }
  ]
};

const tableRow = {
  name: 'tableRow',
  title: 'Table Row',
  type: 'object',
  fields: [
    {
      name: 'isHeader',
      title: 'Header Row',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'cells',
      title: 'Row Cells',
      type: 'array',
      of: [{ type: 'tableCell' }],
      validation: (Rule) => Rule.required()
    }
  ]
};

const tableBlock = {
  name: 'tableBlock',
  title: 'Table Block',
  type: 'object',
  fields: [
    {
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [{ type: 'tableRow' }],
      validation: (Rule) => Rule.required()
    }
  ]
};

const mermaidBlock = {
  name: 'mermaidBlock',
  title: 'Mermaid Diagram',
  type: 'object',
  fields: [
    {
      name: 'code',
      title: 'Diagram Definition',
      type: 'text',
      validation: (Rule) => Rule.required()
    }
  ]
};

const codeBlock = {
  name: 'codeBlock',
  title: 'Code Block',
  type: 'object',
  fields: [
    {
      name: 'language',
      title: 'Programming Language',
      type: 'string',
      initialValue: 'text',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'code',
      title: 'Code Snippet',
      type: 'text',
      validation: (Rule) => Rule.required()
    }
  ]
};

const dividerBlock = {
  name: 'dividerBlock',
  title: 'Thematic Break / Divider',
  type: 'object',
  fields: [
    {
      name: 'style',
      title: 'Divider Style',
      type: 'string',
      initialValue: 'line'
    }
  ]
};

const bibliographyEntry = {
  name: 'bibliographyEntry',
  title: 'Bibliography Entry',
  type: 'object',
  fields: [
    {
      name: 'order',
      title: 'Sequence Order',
      type: 'number',
      validation: (Rule) => Rule.required().min(1)
    },
    {
      name: 'rawText',
      title: 'Raw Reference Text',
      type: 'text',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'title',
      title: 'Parsed Reference Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'url',
      title: 'Source URL',
      type: 'url'
    }
  ]
};

const sourceMaterialEntry = {
  name: 'sourceMaterialEntry',
  title: 'Source Material Entry',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Source Material Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'url',
      title: 'Source URL',
      type: 'url'
    }
  ]
};

const sourceArchive = {
  name: 'sourceArchive',
  title: 'Source Archive & Provenance Baseline',
  type: 'object',
  fields: [
    {
      name: 'v1GitCommit',
      title: 'V1 Git Commit Hash',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'v1RelativePath',
      title: 'V1 Relative File Path',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'sourceSha256',
      title: 'Source MDX SHA-256',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'rawMdxBytes',
      title: 'Raw MDX Byte Count',
      type: 'number',
      readOnly: true,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'archiveVersion',
      title: 'Archive Baseline Version',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required()
    }
  ]
};

const seo = {
  name: 'seo',
  title: 'SEO & Metadata',
  type: 'object',
  fields: [
    { name: 'metaTitle', title: 'Meta Title', type: 'string' },
    { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3 }
  ]
};

const standardBlock = {
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Heading 1', value: 'h1' },
    { title: 'Heading 2', value: 'h2' },
    { title: 'Heading 3', value: 'h3' },
    { title: 'Heading 4', value: 'h4' },
    { title: 'Heading 5', value: 'h5' },
    { title: 'Heading 6', value: 'h6' },
    { title: 'Quote', value: 'blockquote' }
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Numbered', value: 'number' }
  ],
  marks: {
    decorators: [
      { title: 'Strong', value: 'strong' },
      { title: 'Emphasis', value: 'em' },
      { title: 'Code', value: 'code' }
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [{ name: 'href', type: 'url', title: 'URL' }]
      }
    ]
  },
  of: [
    { type: 'citationMarker' },
    { type: 'inlineFormula' },
    { type: 'inlineImage' }
  ]
};

const portableTextBody = {
  name: 'portableTextBody',
  title: 'Portable Text Body Content',
  type: 'array',
  of: [
    standardBlock,
    { type: 'formulaBlock' },
    { type: 'imageBlock' },
    { type: 'tableBlock' },
    { type: 'mermaidBlock' },
    { type: 'codeBlock' },
    { type: 'dividerBlock' }
  ]
};

// Document Schemas

const research = {
  name: 'research',
  title: 'Research Report',
  type: 'document',
  fields: [
    {
      name: 'workbookId',
      title: 'Workbook ID',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: { source: 'title', maxLength: 96 }
    },
    {
      name: 'summary',
      title: 'Executive Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Completed', value: 'Completed' },
          { title: 'In Progress', value: 'In Progress' },
          { title: 'Published', value: 'Published' },
          { title: 'Draft', value: 'Draft' }
        ]
      }
    },
    {
      name: 'publishedAt',
      title: 'Publication Date',
      type: 'datetime',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'updatedAt',
      title: 'Last Updated Date',
      type: 'datetime'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    },
    {
      name: 'researchMethod',
      title: 'Research Methodology',
      type: 'string'
    },
    {
      name: 'lengthEstimateMinutes',
      title: 'Estimated Reading Time (Minutes)',
      type: 'number'
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'object',
      fields: [
        { name: 'assetPath', title: 'Asset Path', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'alt', title: 'Alternative Text', type: 'string' }
      ]
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }]
    },
    {
      name: 'topics',
      title: 'Taxonomy Topics',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }]
    },
    {
      name: 'derivedPosts',
      title: 'Derived Writing / Essays',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'writing' }] }]
    },
    {
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }]
    },
    {
      name: 'sourceMaterial',
      title: 'Source Material References',
      type: 'array',
      of: [{ type: 'sourceMaterialEntry' }]
    },
    {
      name: 'bibliographyHeading',
      title: 'Bibliography Section Heading',
      type: 'string'
    },
    {
      name: 'bibliography',
      title: 'Bibliography & References',
      type: 'array',
      of: [{ type: 'bibliographyEntry' }]
    },
    {
      name: 'body',
      title: 'Body Content',
      type: 'array',
      validation: (Rule) => Rule.required(),
      of: [
        standardBlock,
        { type: 'formulaBlock' },
        { type: 'imageBlock' },
        { type: 'tableBlock' },
        { type: 'mermaidBlock' },
        { type: 'codeBlock' },
        { type: 'dividerBlock' }
      ]
    },
    {
      name: 'sourceArchive',
      title: 'Source Archive Provenance',
      type: 'sourceArchive',
      readOnly: true,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required(),
      description: 'Editorial flag for homepage or showcase promotion. Defaults strictly to false.'
    },
    {
      name: 'editorialStatus',
      title: 'Editorial Lifecycle Status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'in_review' },
          { title: 'Approved', value: 'approved' }
        ],
        layout: 'radio'
      },
      description: 'Content review state. Content is never automatically marked approved.'
    },
    {
      name: 'editorialNotes',
      title: 'Editorial Notes',
      type: 'text'
    }
  ]
};

const writing = {
  name: 'writing',
  title: 'Writing / Essay',
  type: 'document',
  fields: [
    {
      name: 'workbookId',
      title: 'Workbook ID',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: { source: 'title', maxLength: 96 }
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Published', value: 'Published' },
          { title: 'Draft', value: 'Draft' }
        ]
      }
    },
    {
      name: 'publishedAt',
      title: 'Publication Date',
      type: 'datetime',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'updatedAt',
      title: 'Last Updated Date',
      type: 'datetime'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    },
    {
      name: 'sourceReport',
      title: 'Derived From Research Report',
      type: 'reference',
      to: [{ type: 'research' }]
    },
    {
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }]
    },
    {
      name: 'topics',
      title: 'Taxonomy Topics',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }]
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }]
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'object',
      fields: [
        { name: 'assetPath', title: 'Asset Path', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'alt', title: 'Alternative Text', type: 'string' }
      ]
    },
    {
      name: 'readingTimeOverride',
      title: 'Reading Time Override (Minutes)',
      type: 'number'
    },
    {
      name: 'seo',
      title: 'SEO Metadata',
      type: 'seo'
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url'
    },
    {
      name: 'bibliographyHeading',
      title: 'Bibliography Heading',
      type: 'string'
    },
    {
      name: 'bibliography',
      title: 'Bibliography & References',
      type: 'array',
      of: [{ type: 'bibliographyEntry' }]
    },
    {
      name: 'body',
      title: 'Body Content',
      type: 'array',
      validation: (Rule) => Rule.required(),
      of: [
        standardBlock,
        { type: 'imageBlock' },
        { type: 'tableBlock' },
        { type: 'dividerBlock' },
        { type: 'codeBlock' }
      ]
    },
    {
      name: 'sourceArchive',
      title: 'Source Archive Provenance',
      type: 'sourceArchive',
      readOnly: true,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required(),
      description: 'Editorial flag for homepage or selected showcase. Defaults strictly to false.'
    },
    {
      name: 'editorialStatus',
      title: 'Editorial Lifecycle Status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'in_review' },
          { title: 'Approved', value: 'approved' }
        ],
        layout: 'radio'
      },
      description: 'Content review state. Content is never automatically marked approved.'
    },
    {
      name: 'editorialNotes',
      title: 'Editorial Notes',
      type: 'text'
    }
  ]
};

const project = {
  name: 'project',
  title: 'Project Case Study',
  type: 'document',
  fields: [
    {
      name: 'workbookId',
      title: 'Workbook ID',
      type: 'string',
      readOnly: true
    },
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: { source: 'title', maxLength: 96 }
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'provenance',
      title: 'Project Provenance',
      type: 'string',
      options: {
        list: [
          { title: 'Independent', value: 'Independent' },
          { title: 'Built during training', value: 'Built during training' },
          { title: 'Guided exercise', value: 'Guided exercise' },
          { title: 'Collaborative', value: 'Collaborative' }
        ]
      },
      description: 'Public-facing project provenance categorization.'
    },
    {
      name: 'status',
      title: 'Project Status',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'Published', value: 'published' },
          { title: 'In Progress', value: 'in_progress' },
          { title: 'In Progress (Legacy)', value: 'in-progress' },
          { title: 'Archived', value: 'archived' },
          { title: 'Draft', value: 'draft' }
        ]
      }
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'endDate',
      title: 'End Date / Completion Date',
      type: 'date'
    },
    {
      name: 'completedDate',
      title: 'Completion Date (Legacy)',
      type: 'date',
      description: 'Legacy completion date field preserved for backward compatibility.'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    },
    {
      name: 'role',
      title: 'Engineering Role & Scope',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'links',
      title: 'Project Links',
      type: 'object',
      fields: [
        { name: 'repo', title: 'Repository URL', type: 'url' },
        { name: 'live', title: 'Live Deployment URL', type: 'url' },
        { name: 'demo', title: 'Demo URL', type: 'url' }
      ]
    },
    {
      name: 'techStack',
      title: 'Technology Stack',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required()
    },
    {
      name: 'aiAttribution',
      title: 'AI-Assistance Attribution',
      type: 'text',
      rows: 3,
      description: 'Optional attribution detailing what was AI-assisted versus personally implemented.'
    },
    {
      name: 'evaluationNotes',
      title: 'Project Evaluation Notes',
      type: 'text',
      rows: 3,
      description: 'Technical evaluation notes, assessment observations, or verification findings.'
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'object',
      fields: [
        { name: 'assetPath', title: 'Asset Path', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'alt', title: 'Alternative Text', type: 'string' }
      ]
    },
    {
      name: 'relatedResearch',
      title: 'Related Research Reports',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'research' }] }]
    },
    {
      name: 'relatedWriting',
      title: 'Related Writing / Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'writing' }] }]
    },
    {
      name: 'topics',
      title: 'Taxonomy Topics',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }]
    },
    {
      name: 'body',
      title: 'Case Study Body',
      type: 'array',
      validation: (Rule) => Rule.required(),
      of: [
        standardBlock,
        { type: 'imageBlock' },
        { type: 'tableBlock' },
        { type: 'formulaBlock' },
        { type: 'mermaidBlock' },
        { type: 'codeBlock' },
        { type: 'dividerBlock' }
      ]
    },
    {
      name: 'sourceArchive',
      title: 'Source Archive Provenance',
      type: 'sourceArchive',
      readOnly: true,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'legacyFeatured',
      title: 'Legacy V1 Featured Flag',
      type: 'boolean',
      readOnly: true,
      description: 'Historical frontmatter flag from V1 archive. Preserved for provenance.'
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required(),
      description: 'Editorial flag for homepage or portfolio showcase. Defaults strictly to false.'
    },
    {
      name: 'editorialStatus',
      title: 'Editorial Lifecycle Status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'in_review' },
          { title: 'Approved', value: 'approved' }
        ],
        layout: 'radio'
      },
      description: 'Content review state. Content is never automatically marked approved.'
    },
    {
      name: 'editorialNotes',
      title: 'Editorial Notes',
      type: 'text'
    }
  ]
};

const topic = {
  name: 'topic',
  title: 'Taxonomy Topic',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Topic Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: { source: 'title', maxLength: 96 }
    },
    {
      name: 'domain',
      title: 'Subject Domain',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'description',
      title: 'Topic Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'relatedResearch',
      title: 'Related Research Reports',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'research' }] }]
    },
    {
      name: 'relatedWriting',
      title: 'Related Writing / Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'writing' }] }]
    },
    {
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }]
    },
    {
      name: 'featured',
      title: 'Featured Topic',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number'
    }
  ]
};

const author = {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'authorId',
      title: 'Author ID',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: { source: 'name', maxLength: 96 }
    },
    {
      name: 'bio',
      title: 'Short Biography',
      type: 'text',
      rows: 3
    },
    {
      name: 'url',
      title: 'Canonical Website URL',
      type: 'url'
    },
    {
      name: 'avatar',
      title: 'Avatar / Profile Image',
      type: 'object',
      fields: [
        { name: 'assetPath', title: 'Asset Path', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'alt', title: 'Alternative Text', type: 'string' }
      ]
    },
    {
      name: 'socialLinks',
      title: 'Social & Profile Links',
      type: 'object',
      fields: [
        { name: 'linkedin', title: 'LinkedIn Profile URL', type: 'url' },
        { name: 'github', title: 'GitHub Profile URL', type: 'url' },
        { name: 'twitter', title: 'X / Twitter Profile URL', type: 'url' }
      ]
    }
  ]
};

const documentTypes = [research, writing, project, topic, author];
const objectTypes = [
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
  portableTextBody
];

const schemaTypes = [...documentTypes, ...objectTypes];

const schemasByName = {};
for (const s of schemaTypes) {
  schemasByName[s.name] = s;
}

module.exports = {
  // Document Schemas
  research,
  writing,
  project,
  topic,
  author,
  // Object Schemas
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
  standardBlock,
  // Collections
  documentTypes,
  objectTypes,
  schemaTypes,
  schemasByName,
  createRule
};
