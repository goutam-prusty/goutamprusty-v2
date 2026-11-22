import { defineType, defineField } from '../types';

export const dividerBlock = defineType({
  name: 'dividerBlock',
  title: 'Thematic Break / Divider',
  type: 'object',
  fields: [
    defineField({
      name: 'style',
      title: 'Divider Style',
      type: 'string',
      initialValue: 'line',
      options: {
        list: [
          { title: 'Solid Line', value: 'line' },
          { title: 'Asterisks', value: 'asterisks' },
        ],
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: '——— Thematic Divider ———',
      };
    },
  },
});
