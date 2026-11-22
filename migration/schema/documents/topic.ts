import { defineType, defineField, defineArrayMember } from '../types';

export const topic = defineType({
  name: 'topic',
  title: 'Taxonomy Topic',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Topic Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Human-readable topic title (e.g. "India Political Economy & Institutions").',
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
      description: 'URL-safe slug for topic index and detail routes.',
    }),
    defineField({
      name: 'domain',
      title: 'Subject Domain',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Higher-level knowledge domain (e.g. Economics, Technology, Governance).',
    }),
    defineField({
      name: 'description',
      title: 'Topic Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
      description: 'Concise explanation of the topic scope and questions explored.',
    }),
    defineField({
      name: 'relatedResearch',
      title: 'Related Research Reports',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'research' }] })],
      description: 'Research works classified under this topic.',
    }),
    defineField({
      name: 'relatedWriting',
      title: 'Related Writing / Articles',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'writing' }] })],
      description: 'Articles classified under this topic.',
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
      description: 'Projects classified under this topic.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Topic',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required(),
      description: 'Whether to feature on the homepage topic showcase. Defaults to false.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Optional manual sort order.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      domain: 'domain',
    },
    prepare({ title, domain }) {
      return {
        title: title || 'Untitled Topic',
        subtitle: domain ? `Domain: ${domain}` : undefined,
      };
    },
  },
});
