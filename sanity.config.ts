import { defineConfig } from 'sanity';
import { schemaTypes } from './src/sanity/schemaTypes/index';

const projectId = (globalThis as any).process?.env?.PUBLIC_SANITY_PROJECT_ID || (globalThis as any).process?.env?.SANITY_PROJECT_ID;
const dataset = (globalThis as any).process?.env?.PUBLIC_SANITY_DATASET || (globalThis as any).process?.env?.SANITY_DATASET || 'development';

export default defineConfig({
  name: 'default',
  title: 'Goutam Prusty Content Studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
});
