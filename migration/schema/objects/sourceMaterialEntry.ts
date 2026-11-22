import { defineType, defineField } from '../types';

export const sourceMaterialEntry = defineType({
  name: 'sourceMaterialEntry',
  title: 'Source Material Entry',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Source Material Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Primary or secondary source documentation title.',
    }),
    defineField({
      name: 'url',
      title: 'Source URL',
      type: 'url',
      description: 'Canonical link to verified research source material.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      url: 'url',
    },
    prepare({ title, url }) {
      return {
        title,
        subtitle: url || 'No URL',
      };
    },
  },
});
