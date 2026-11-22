import { defineType, defineField } from 'sanity';

export const bibliographyEntry = defineType({
  name: 'bibliographyEntry',
  title: 'Bibliography Entry',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Citation Number',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
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
      name: 'publication',
      title: 'Publication / Venue',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Publication Date',
      type: 'string',
    }),
    defineField({
      name: 'rawText',
      title: 'Raw Reference Text',
      type: 'text',
      rows: 2,
    }),
  ],
});
