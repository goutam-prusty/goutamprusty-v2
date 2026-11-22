import { defineType, defineArrayMember, defineField } from '../types';

export const standardBlock = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Heading 1', value: 'h1' },
    { title: 'Heading 2', value: 'h2' },
    { title: 'Heading 3', value: 'h3' },
    { title: 'Heading 4', value: 'h4' },
    { title: 'Heading 5', value: 'h5' },
    { title: 'Heading 6', value: 'h6' },
    { title: 'Quote', value: 'blockquote' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Numbered', value: 'number' },
  ],
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
    defineArrayMember({ type: 'citationMarker' }),
    defineArrayMember({ type: 'inlineFormula' }),
    defineArrayMember({ type: 'inlineImage' }),
  ],
});

export const portableTextBody = defineType({
  name: 'portableTextBody',
  title: 'Portable Text Body Content',
  type: 'array',
  of: [
    standardBlock,
    defineArrayMember({ type: 'formulaBlock' }),
    defineArrayMember({ type: 'imageBlock' }),
    defineArrayMember({ type: 'tableBlock' }),
    defineArrayMember({ type: 'mermaidBlock' }),
    defineArrayMember({ type: 'codeBlock' }),
    defineArrayMember({ type: 'dividerBlock' }),
  ],
});
