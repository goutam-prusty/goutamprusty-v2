import { defineType, defineField } from '../types';

export const sourceArchive = defineType({
  name: 'sourceArchive',
  title: 'Source Archive & Provenance Baseline',
  type: 'object',
  description: 'Immutable source provenance tracking the original V1 repository file baseline.',
  fields: [
    defineField({
      name: 'v1GitCommit',
      title: 'V1 Git Commit Hash',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description: 'Authoritative V1 repository commit hash (71ef2c7c5c6a8995cc6901d350cc29c35d427423).',
    }),
    defineField({
      name: 'v1RelativePath',
      title: 'V1 Relative File Path',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description: 'Original MDX source path within the V1 archive.',
    }),
    defineField({
      name: 'sourceSha256',
      title: 'Source MDX SHA-256',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description: 'Cryptographic hash of the raw original MDX file content.',
    }),
    defineField({
      name: 'rawMdxBytes',
      title: 'Raw MDX Byte Count',
      type: 'number',
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description: 'Exact byte length of the source MDX file.',
    }),
    defineField({
      name: 'archiveVersion',
      title: 'Archive Baseline Version',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description: 'Version tag of the migration baseline (e.g. v1.0.0-baseline).',
    }),
  ],
});
