import { defineType, defineField } from 'sanity';

export const mermaidBlock = defineType({
  name: 'mermaidBlock',
  title: 'Mermaid Diagram',
  type: 'object',
  fields: [
    defineField({
      name: 'code',
      title: 'Diagram Definition',
      type: 'text',
      validation: (Rule) => Rule.required(),
      description: 'Verbatim Mermaid diagram syntax.',
    }),
  ],
  preview: {
    select: {
      code: 'code',
    },
    prepare({ code }) {
      const firstLine = (code || '').split('\n')[0] || 'Mermaid Diagram';
      return {
        title: 'Mermaid Diagram',
        subtitle: firstLine,
      };
    },
  },
});
