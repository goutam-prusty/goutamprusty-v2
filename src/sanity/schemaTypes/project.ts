import { defineType, defineField, defineArrayMember } from 'sanity';

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
      name: 'status',
      title: 'Project Status',
      type: 'string',
      initialValue: 'completed',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'In Progress', value: 'in_progress' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'completedDate',
      title: 'Completion Date',
      type: 'date',
      description: 'Verified project completion or deployment date.',
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
