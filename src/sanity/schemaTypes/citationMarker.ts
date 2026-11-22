import { defineType, defineField } from 'sanity';

export const citationMarker = defineType({
  name: 'citationMarker',
  title: 'Citation Marker',
  type: 'object',
  fields: [
    defineField({
      name: 'citationNumber',
      title: 'Citation Number',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'number',
      title: 'Citation Number (Alias)',
      type: 'number',
      description: 'Legacy alias for citationNumber to maintain compatibility across schema versions.',
    }),
    defineField({
      name: 'rawMarker',
      title: 'Raw Marker Text',
      type: 'string',
    }),
  ],
});
