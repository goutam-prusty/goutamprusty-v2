import { defineType, defineField } from 'sanity';

export const sourceMaterialEntry = defineType({
  name: 'sourceMaterialEntry',
  title: 'Source Material Entry',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Index Number',
      type: 'number',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    }),
    defineField({
      name: 'source',
      title: 'Source / Author',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
    }),
  ],
});
