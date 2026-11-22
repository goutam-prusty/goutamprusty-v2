import { defineType, defineField } from '../types';

export const bibliographyEntry = defineType({
  name: 'bibliographyEntry',
  title: 'Bibliography Entry',
  type: 'object',
  fields: [
    defineField({
      name: 'order',
      title: 'Sequence Order',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
      description: '1-based sequential order matching the numbered reference section in V1.',
    }),
    defineField({
      name: 'rawText',
      title: 'Raw Reference Text',
      type: 'text',
      validation: (Rule) => Rule.required(),
      description: 'Verbatim reference citation string from the original source.',
    }),
    defineField({
      name: 'title',
      title: 'Parsed Reference Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Extracted title or citation label.',
    }),
    defineField({
      name: 'url',
      title: 'Source URL',
      type: 'url',
      description: 'External destination link where verified and present in source.',
    }),
  ],
  preview: {
    select: {
      order: 'order',
      title: 'title',
      url: 'url',
    },
    prepare({ order, title, url }) {
      return {
        title: `[${order}] ${title}`,
        subtitle: url || 'No URL',
      };
    },
  },
});
