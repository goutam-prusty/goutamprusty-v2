import { defineType, defineField, defineArrayMember } from 'sanity';

export const writing = defineType({
  name: 'writing',
  title: 'Writing / Article',
  type: 'document',
  fields: [
    defineField({
      name: 'workbookId',
      title: 'Workbook ID',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description: 'Authoritative inventory ID (e.g. BLG-001).',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
    }),
    defineField({
      name: 'summary',
      title: 'Executive Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Publication Status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated Date',
      type: 'datetime',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'readingTimeOverride',
      title: 'Reading Time Override (Minutes)',
      type: 'number',
    }),
    defineField({
      name: 'readingTimeMinutes',
      title: 'Reading Time (Minutes)',
      type: 'number',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'editorialStatus',
      title: 'Editorial Review Status',
      type: 'string',
      initialValue: 'draft',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'object',
      fields: [
        defineField({ name: 'assetPath', title: 'Asset Path', type: 'string' }),
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'sourceReport',
      title: 'Source Research Report',
      type: 'reference',
      to: [{ type: 'research' }],
      description: 'Clean Sanity reference to parent research report (e.g. RES-018).',
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
    }),
    defineField({
      name: 'topics',
      title: 'Taxonomy Topics',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'topic' }] })],
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'portableTextBody',
    }),
    defineField({
      name: 'bibliographyHeading',
      title: 'Bibliography Heading',
      type: 'string',
    }),
    defineField({
      name: 'bibliography',
      title: 'Bibliography & References',
      type: 'array',
      of: [defineArrayMember({ type: 'bibliographyEntry' })],
    }),
    defineField({
      name: 'sourceArchive',
      title: 'Source Archive Provenance',
      type: 'sourceArchive',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    }),
  ],
});
