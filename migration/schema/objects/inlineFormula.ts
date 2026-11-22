import { defineType, defineField } from '../types';

export const inlineFormula = defineType({
  name: 'inlineFormula',
  title: 'Inline Formula',
  type: 'object',
  fields: [
    defineField({
      name: 'formulaId',
      title: 'Formula ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Source markdown reference identifier (e.g. "image1").',
    }),
    defineField({
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
      description: 'Accessible mathematical formula text or description.',
    }),
    defineField({
      name: 'assetPath',
      title: 'Presentation Asset Path',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Relative public path to verified WebP presentation asset on disk.',
    }),
    defineField({
      name: 'manifestRef',
      title: 'Manifest Reference',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Unique reference key in formula-assets-manifest.json.',
    }),
    defineField({
      name: 'dimensions',
      title: 'Pixel Dimensions',
      type: 'object',
      fields: [
        defineField({ name: 'width', title: 'Width (px)', type: 'number', validation: (Rule) => Rule.required() }),
        defineField({ name: 'height', title: 'Height (px)', type: 'number', validation: (Rule) => Rule.required() }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sha256',
      title: 'WebP SHA-256',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'originalPngSha256',
      title: 'Original PNG SHA-256',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      formulaId: 'formulaId',
      assetPath: 'assetPath',
    },
    prepare({ formulaId, assetPath }) {
      return {
        title: `Inline Formula: ${formulaId}`,
        subtitle: assetPath,
      };
    },
  },
});
