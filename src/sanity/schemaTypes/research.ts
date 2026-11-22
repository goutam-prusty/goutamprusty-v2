import { defineType, defineField, defineArrayMember } from 'sanity';

export const research = defineType({
  name: 'research',
  title: 'Research Report',
  type: 'document',
  fields: [
    defineField({
      name: 'workbookId',
      title: 'Workbook ID',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description: 'Authoritative inventory ID (e.g. RES-018).',
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
      name: 'derivedPosts',
      title: 'Derived Articles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'writing' }],
        }),
      ],
      description: 'Articles derived from this research report (clean Sanity reference).',
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'portableTextBody',
    }),
    defineField({
      name: 'bibliography',
      title: 'Bibliography / Works Cited',
      type: 'array',
      of: [defineArrayMember({ type: 'bibliographyEntry' })],
    }),
    defineField({
      name: 'sourceMaterial',
      title: 'Source Material Index',
      type: 'array',
      of: [defineArrayMember({ type: 'sourceMaterialEntry' })],
    }),
    defineField({
      name: 'sourceArchive',
      title: 'Source Archive Provenance',
      type: 'sourceArchive',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    }),
  ],
});
