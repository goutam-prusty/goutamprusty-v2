import { defineType, defineField } from 'sanity';

export const formulaBlock = defineType({
  name: 'formulaBlock',
  title: 'Formula Block',
  type: 'object',
  fields: [
    defineField({
      name: 'formulaId',
      title: 'Formula ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'assetPath',
      title: 'WebP Presentation Asset Path',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Static URI path served from public/images/research/...',
    }),
    defineField({
      name: 'width',
      title: 'Pixel Width',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'height',
      title: 'Pixel Height',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'label',
      title: 'Formula Label / Equation Name',
      type: 'string',
    }),
  ],
});
