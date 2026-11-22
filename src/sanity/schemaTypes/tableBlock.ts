import { defineType, defineField, defineArrayMember } from 'sanity';

export const tableCell = defineType({
  name: 'tableCell',
  title: 'Table Cell',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text Content',
      type: 'string',
    }),
  ],
});

export const tableRow = defineType({
  name: 'tableRow',
  title: 'Table Row',
  type: 'object',
  fields: [
    defineField({
      name: 'cells',
      title: 'Cells',
      type: 'array',
      of: [defineArrayMember({ type: 'tableCell' })],
    }),
  ],
});

export const tableBlock = defineType({
  name: 'tableBlock',
  title: 'Table Block',
  type: 'object',
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'headers',
      title: 'Column Headers',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [defineArrayMember({ type: 'tableRow' })],
    }),
  ],
});
