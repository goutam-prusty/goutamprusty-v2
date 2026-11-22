import { defineType, defineField } from '../types';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'authorId',
      title: 'Author ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Unique stable author identifier from authors.yml (e.g. "goutam-prusty").',
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Display name (e.g. "Goutam Prusty").',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
      description: 'URL-safe author slug.',
    }),
    defineField({
      name: 'bio',
      title: 'Short Biography',
      type: 'text',
      rows: 3,
      description: 'Authoritative biographical summary.',
    }),
    defineField({
      name: 'url',
      title: 'Canonical Website URL',
      type: 'url',
      description: 'Personal domain or portfolio link.',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar / Profile Image',
      type: 'object',
      fields: [
        defineField({ name: 'assetPath', title: 'Asset Path', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'alt', title: 'Alternative Text', type: 'string' }),
      ],
      description: 'Author headshot or portrait asset.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social & Profile Links',
      type: 'object',
      fields: [
        defineField({ name: 'linkedin', title: 'LinkedIn Profile URL', type: 'url' }),
        defineField({ name: 'github', title: 'GitHub Profile URL', type: 'url' }),
        defineField({ name: 'twitter', title: 'X / Twitter Profile URL', type: 'url' }),
      ],
      description: 'Verified public social accounts.',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      authorId: 'authorId',
    },
    prepare({ name, authorId }) {
      return {
        title: name || 'Unnamed Author',
        subtitle: `ID: ${authorId}`,
      };
    },
  },
});
