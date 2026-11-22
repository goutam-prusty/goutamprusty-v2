import { defineType, defineField } from 'sanity';

export const codeBlock = defineType({
  name: 'codeBlock',
  title: 'Code Block',
  type: 'object',
  fields: [
    defineField({
      name: 'language',
      title: 'Programming Language',
      type: 'string',
      initialValue: 'text',
      validation: (Rule) => Rule.required(),
      description: 'Syntax highlighting identifier (e.g. json, typescript, bash, text).',
    }),
    defineField({
      name: 'code',
      title: 'Code Snippet',
      type: 'text',
      validation: (Rule) => Rule.required(),
      description: 'Verbatim code content without alteration.',
    }),
  ],
  preview: {
    select: {
      language: 'language',
      code: 'code',
    },
    prepare({ language, code }) {
      const firstLine = (code || '').split('\n')[0] || '';
      return {
        title: `Code (${language})`,
        subtitle: firstLine,
      };
    },
  },
});
