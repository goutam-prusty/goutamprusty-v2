import { defineType, defineField } from 'sanity';

export const inlineImage = defineType({
  name: 'inlineImage',
  title: 'Inline Image',
  type: 'object',
  fields: [
    defineField({
      name: 'assetPath',
      title: 'Asset Path',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Path or URL to the inline image asset.',
    }),
    defineField({
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
      description: 'Descriptive alt text for accessibility.',
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'assetPath',
    },
  },
});
