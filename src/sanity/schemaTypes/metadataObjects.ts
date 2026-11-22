import { defineType, defineField } from 'sanity';

export const sourceArchive = defineType({
  name: 'sourceArchive',
  title: 'Source Archive Provenance',
  type: 'object',
  fields: [
    defineField({
      name: 'sourcePath',
      title: 'Original File Path',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'sourceSha256',
      title: 'Source File SHA-256',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'importedAt',
      title: 'Import Timestamp',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'v1Commit',
      title: 'V1 Repository Commit',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'referencedSlugs',
      title: 'Referenced Slugs Mapping',
      type: 'text',
      description: 'JSON serialized record of original frontmatter relationship slugs.',
      readOnly: true,
    }),
  ],
});

export const seo = defineType({
  name: 'seo',
  title: 'SEO & Metadata',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
    }),
  ],
});
