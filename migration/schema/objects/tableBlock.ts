import { defineType, defineField, defineArrayMember } from '../types';

export const tableCell = defineType({
  name: 'tableCell',
  title: 'Table Cell',
  type: 'object',
  fields: [
    defineField({
      name: 'plainText',
      title: 'Plain Text Representation',
      type: 'string',
      description: 'Normalized plain text content of the cell for search and accessibility.',
    }),
    defineField({
      name: 'content',
      title: 'Rich Cell Content',
      type: 'array',
      description: 'Portable Text blocks supporting inline formatting, formulas, citation markers, and links inside table cells.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                ],
              },
            ],
          },
          of: [
            defineArrayMember({ type: 'inlineFormula' }),
            defineArrayMember({ type: 'citationMarker' }),
            defineArrayMember({ type: 'inlineImage' }),
          ],
        }),
      ],
    }),
  ],
});

export const tableRow = defineType({
  name: 'tableRow',
  title: 'Table Row',
  type: 'object',
  fields: [
    defineField({
      name: 'isHeader',
      title: 'Header Row',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'cells',
      title: 'Row Cells',
      type: 'array',
      of: [defineArrayMember({ type: 'tableCell' })],
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const tableBlock = defineType({
  name: 'tableBlock',
  title: 'Table Block',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [defineArrayMember({ type: 'tableRow' })],
      validation: (Rule) => Rule.required(),
      description: 'Structured GFM table rows with rich formatted cells.',
    }),
  ],
  preview: {
    select: {
      rows: 'rows',
    },
    prepare({ rows }) {
      const rowCount = Array.isArray(rows) ? rows.length : 0;
      return {
        title: `Table (${rowCount} rows)`,
      };
    },
  },
});
