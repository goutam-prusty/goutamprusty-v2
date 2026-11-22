import { defineType, defineField } from '../types';

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image Block',
  type: 'object',
  fields: [
    defineField({
      name: 'assetPath',
      title: 'Asset Path',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Relative public path or URL to the presentation image asset.',
    }),
    defineField({
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
      description: 'Descriptive alt text for accessibility.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional editorial caption displayed beneath the figure.',
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'assetPath',
    },
  },
});
