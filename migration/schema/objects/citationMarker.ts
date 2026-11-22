import { defineType, defineField } from '../types';

export const citationMarker = defineType({
  name: 'citationMarker',
  title: 'Citation Marker',
  type: 'object',
  fields: [
    defineField({
      name: 'citationNumber',
      title: 'Citation Number',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
      description: 'Numerical citation index matching the corresponding bibliography entry.',
    }),
    defineField({
      name: 'rawMarker',
      title: 'Raw Citation Marker',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Verbatim original markdown citation string (e.g. "15" or "[^15]").',
    }),
  ],
  preview: {
    select: {
      number: 'citationNumber',
      marker: 'rawMarker',
    },
    prepare({ number, marker }) {
      return {
        title: `Citation [${number}]`,
        subtitle: `Raw marker: ${marker}`,
      };
    },
  },
});
