import { defineType, defineField } from 'sanity';

export const citationMarker = defineType({
  name: 'citationMarker',
  title: 'Citation Marker',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Citation Number',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'rawMarker',
      title: 'Raw Marker Text',
      type: 'string',
    }),
  ],
});
