import { defineType, defineArrayMember } from 'sanity';

export const portableTextBlock = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Heading 2', value: 'h2' },
    { title: 'Heading 3', value: 'h3' },
    { title: 'Heading 4', value: 'h4' },
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
        title: 'URL',
        fields: [
          {
            title: 'URL',
            name: 'href',
            type: 'url',
          },
        ],
      },
      {
        name: 'citation',
        type: 'object',
        title: 'Citation Link',
        fields: [
          {
            title: 'Citation Number',
            name: 'citationNumber',
            type: 'number',
          },
        ],
      },
    ],
  },
  of: [
    defineArrayMember({ type: 'citationMarker' }),
  ],
});

export const portableTextBody = defineType({
  name: 'portableTextBody',
  title: 'Portable Text Body',
  type: 'array',
  of: [
    portableTextBlock,
    defineArrayMember({ type: 'tableBlock' }),
    defineArrayMember({ type: 'formulaBlock' }),
  ],
});
