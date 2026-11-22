import { defineCliConfig } from 'sanity/cli';

const projectId = (globalThis as any).process?.env?.PUBLIC_SANITY_PROJECT_ID || (globalThis as any).process?.env?.SANITY_PROJECT_ID;
const dataset = (globalThis as any).process?.env?.PUBLIC_SANITY_DATASET || (globalThis as any).process?.env?.SANITY_DATASET || 'development';

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
