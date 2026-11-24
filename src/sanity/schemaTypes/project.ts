import { defineType, defineField, defineArrayMember } from 'sanity';

export const PROVENANCE_OPTIONS = [
  { title: 'Independent', value: 'Independent' },
  { title: 'Built during training', value: 'Built during training' },
  { title: 'Guided exercise', value: 'Guided exercise' },
  { title: 'Collaborative', value: 'Collaborative' },
] as const;

export const PROJECT_STATUS_OPTIONS = [
  { title: 'Completed', value: 'completed' },
  { title: 'Published', value: 'published' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'In Progress (Legacy)', value: 'in-progress' },
  { title: 'Archived', value: 'archived' },
  { title: 'Draft', value: 'draft' },
] as const;

export const project = defineType({
  name: 'project',
  title: 'Engineering Project',
  type: 'document',
  fields: [
    defineField({
      name: 'workbookId',
      title: 'Workbook ID',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description: 'Authoritative inventory ID (e.g. PRJ-001).',
    }),
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Verbatim project name.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'URL-safe project slug matching V1 path.',
    }),
    defineField({
      name: 'summary',
      title: 'Executive Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
      description: 'Clear statement of problem solved, architecture, and engineering results.',
    }),
    defineField({
      name: 'provenance',
      title: 'Project Provenance',
      type: 'string',
      options: {
        list: [
          { title: 'Independent', value: 'Independent' },
          { title: 'Built during training', value: 'Built during training' },
          { title: 'Guided exercise', value: 'Guided exercise' },
          { title: 'Collaborative', value: 'Collaborative' },
        ],
      },
      description: 'Public-facing project provenance categorization.',
    }),
    defineField({
      name: 'status',
      title: 'Project Status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'Published', value: 'published' },
          { title: 'In Progress', value: 'in_progress' },
          { title: 'In Progress (Legacy)', value: 'in-progress' },
          { title: 'Archived', value: 'archived' },
          { title: 'Draft', value: 'draft' },
        ],
      },
      validation: (Rule) => Rule.required(),
      description: 'Project delivery and publication status.',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      description: 'Project inception date (YYYY-MM-DD).',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date / Completion Date',
      type: 'date',
      description: 'Completion date, or leave empty if ongoing.',
    }),
    defineField({
      name: 'completedDate',
      title: 'Completion Date (Legacy)',
      type: 'date',
      description: 'Legacy completion date field preserved for backward compatibility.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Project type (e.g. web-application, technology, software).',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags',
      },
      description: 'Architectural and technological keywords.',
    }),
    defineField({
      name: 'role',
      title: 'Engineering Role & Scope',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Exact personal engineering contribution and scope.',
    }),
    defineField({
      name: 'links',
      title: 'Project Links',
      type: 'object',
      fields: [
        defineField({ name: 'repo', title: 'Repository URL', type: 'url' }),
        defineField({ name: 'live', title: 'Live Deployment URL', type: 'url' }),
        defineField({ name: 'demo', title: 'Demo URL', type: 'url' }),
      ],
      description: 'Verifiable external links to codebase and live application.',
    }),
    defineField({
      name: 'techStack',
      title: 'Technology Stack',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required(),
      description: 'Specific libraries, frameworks, languages, and testing tools.',
    }),
    defineField({
      name: 'aiAttribution',
      title: 'AI-Assistance Attribution',
      type: 'text',
      rows: 3,
      description: 'Optional attribution detailing what was AI-assisted versus personally implemented.',
    }),
    defineField({
      name: 'evaluationNotes',
      title: 'Project Evaluation Notes',
      type: 'text',
      rows: 3,
      description: 'Technical evaluation notes, assessment observations, or verification findings.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'object',
      fields: [
        defineField({ name: 'assetPath', title: 'Asset Path', type: 'string' }),
        defineField({ name: 'alt', title: 'Alternative Text', type: 'string' }),
      ],
      description: 'Lead screenshot, architectural diagram, or interface capture.',
    }),
    defineField({
      name: 'relatedResearch',
      title: 'Related Research Reports',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'research' }] })],
      description: 'Formal research documents informing this project architecture.',
    }),
    defineField({
      name: 'relatedWriting',
      title: 'Related Writing / Articles',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'writing' }] })],
      description: 'Essays detailing aspects of this project.',
    }),
    defineField({
      name: 'topics',
      title: 'Taxonomy Topics',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'topic' }] })],
      description: 'Curated topics associated with this project.',
    }),
    defineField({
      name: 'body',
      title: 'Case Study Body',
      type: 'portableTextBody',
      description: 'Detailed case study: Problem, Architecture, Implementation, Outcomes, Lessons.',
    }),
    defineField({
      name: 'sourceArchive',
      title: 'Source Archive Provenance',
      type: 'sourceArchive',
      readOnly: true,
      description: 'Immutable V1 repository baseline metadata.',
    }),
    defineField({
      name: 'legacyFeatured',
      title: 'Legacy V1 Featured Flag',
      type: 'boolean',
      readOnly: true,
      description: 'Historical frontmatter flag from V1 archive. Preserved for provenance.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required(),
      description: 'Editorial flag for homepage or portfolio showcase. Defaults strictly to false.',
    }),
    defineField({
      name: 'editorialStatus',
      title: 'Editorial Lifecycle Status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'in_review' },
          { title: 'Approved', value: 'approved' },
        ],
        layout: 'radio',
      },
      description: 'Content review state. Content is never automatically marked approved.',
    }),
    defineField({
      name: 'editorialNotes',
      title: 'Editorial Notes',
      type: 'text',
      description: 'Audit annotations or editorial review remarks.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      role: 'role',
      category: 'category',
    },
    prepare({ title, role, category }) {
      return {
        title: title || 'Untitled Project',
        subtitle: `${role || 'Engineer'} · ${category || 'Project'}`,
      };
    },
  },
});
