import { createClient } from '@sanity/client';
import localVerticalSliceDocs from '../data/verticalSliceData.json';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || import.meta.env.SANITY_DATASET || 'development';

function resolveSanityToken(): string | undefined {
  const proc = (globalThis as any).process;
  const envToken =
    proc?.env?.SANITY_API_READ_TOKEN ||
    proc?.env?.SANITY_AUTH_TOKEN ||
    import.meta.env.SANITY_API_READ_TOKEN ||
    import.meta.env.SANITY_AUTH_TOKEN;
  if (envToken) return envToken;

  try {
    const fs = proc?.getBuiltinModule ? proc.getBuiltinModule('fs') : null;
    const path = proc?.getBuiltinModule ? proc.getBuiltinModule('path') : null;
    const os = proc?.getBuiltinModule ? proc.getBuiltinModule('os') : null;

    if (fs && path && os) {
      const configPath = path.join(os.homedir(), '.config', 'sanity', 'config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config?.authToken) return config.authToken;
      }
    }
  } catch {
    // Ignore error in non-Node or restricted environments
  }
  return undefined;
}

const token = resolveSanityToken();

export const isSanityConfigured = Boolean(
  projectId && projectId !== 'unconfigured-local-project'
);

export const requireLiveSanity = Boolean(
  (globalThis as any).process?.env?.SANITY_REQUIRE_LIVE === 'true' ||
  import.meta.env.SANITY_REQUIRE_LIVE === 'true'
);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-03-01',
      token,
      useCdn: false,
    })
  : null;

/**
 * Fetch a Research report by slug using GROQ (or local vertical slice data when offline).
 */
export async function getResearchReportBySlug(slug: string) {
  if (sanityClient) {
    try {
      const query = `*[_type == "research" && slug.current == $slug][0]{
        ...,
        "derivedPosts": derivedPosts[]->{
          _id,
          title,
          slug,
          summary
        }
      }`;
      const result = await sanityClient.fetch(query, { slug });
      if (result) return result;
      if (requireLiveSanity) {
        throw new Error(`[LIVE SANITY ERROR] Document 'research' with slug '${slug}' was not found in remote dataset.`);
      }
    } catch (err: any) {
      if (requireLiveSanity) {
        throw new Error(`[LIVE SANITY ERROR] ${err.message || err}`);
      }
      console.warn(`[Sanity Warning] Remote fetch for research slug '${slug}' failed (${err.message}). Using local fallback.`);
    }
  }

  if (requireLiveSanity) {
    throw new Error('[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled but Sanity Content Lake client is not configured.');
  }

  // Local fallback: dereference references deterministically
  const doc = (localVerticalSliceDocs as any[]).find(
    (d) => d._type === 'research' && d.slug?.current === slug
  );
  if (!doc) return null;

  const cloned = JSON.parse(JSON.stringify(doc));
  if (Array.isArray(cloned.derivedPosts)) {
    cloned.derivedPosts = cloned.derivedPosts.map((ref: any) => {
      const match = (localVerticalSliceDocs as any[]).find((d) => d._id === ref._ref);
      return match ? { _id: match._id, title: match.title, slug: match.slug, summary: match.summary } : ref;
    });
  }
  return cloned;
}

/**
 * Fetch a Writing article by slug using GROQ (or local vertical slice data when offline).
 */
export async function getWritingArticleBySlug(slug: string) {
  if (sanityClient) {
    try {
      const query = `*[_type == "writing" && slug.current == $slug][0]{
        ...,
        "sourceReport": sourceReport->{
          _id,
          title,
          slug
        }
      }`;
      const result = await sanityClient.fetch(query, { slug });
      if (result) return result;
      if (requireLiveSanity) {
        throw new Error(`[LIVE SANITY ERROR] Document 'writing' with slug '${slug}' was not found in remote dataset.`);
      }
    } catch (err: any) {
      if (requireLiveSanity) {
        throw new Error(`[LIVE SANITY ERROR] ${err.message || err}`);
      }
      console.warn(`[Sanity Warning] Remote fetch for writing slug '${slug}' failed (${err.message}). Using local fallback.`);
    }
  }

  if (requireLiveSanity) {
    throw new Error('[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled but Sanity Content Lake client is not configured.');
  }

  // Local fallback: dereference sourceReport deterministically
  const doc = (localVerticalSliceDocs as any[]).find(
    (d) => d._type === 'writing' && d.slug?.current === slug
  );
  if (!doc) return null;

  const cloned = JSON.parse(JSON.stringify(doc));
  if (cloned.sourceReport?._ref) {
    const parent = (localVerticalSliceDocs as any[]).find((d) => d._id === cloned.sourceReport._ref);
    cloned.sourceReport = parent
      ? { _id: parent._id, title: parent.title, slug: parent.slug }
      : null;
  }
  return cloned;
}

/**
 * Retrieve all research slugs for Astro getStaticPaths().
 */
export async function getAllResearchSlugs(): Promise<string[]> {
  if (sanityClient) {
    try {
      const slugs = await sanityClient.fetch(`*[_type == "research" && defined(slug.current)][].slug.current`);
      if (Array.isArray(slugs) && slugs.length > 0) {
        return slugs;
      }
      if (requireLiveSanity) {
        throw new Error('[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled but no research slugs returned from remote Content Lake.');
      }
    } catch (err: any) {
      if (requireLiveSanity) {
        throw new Error(`[LIVE SANITY ERROR] ${err.message || err}`);
      }
      console.warn(`[Sanity Warning] Remote fetch for research slugs failed (${err.message}). Using local fallback.`);
    }
  }

  if (requireLiveSanity) {
    throw new Error('[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled but Sanity Content Lake client is not configured.');
  }

  return (localVerticalSliceDocs as any[])
    .filter((d) => d._type === 'research' && d.slug?.current)
    .map((d) => d.slug.current);
}

/**
 * Retrieve all writing slugs for Astro getStaticPaths().
 */
export async function getAllWritingSlugs(): Promise<string[]> {
  if (sanityClient) {
    try {
      const slugs = await sanityClient.fetch(`*[_type == "writing" && defined(slug.current)][].slug.current`);
      if (Array.isArray(slugs) && slugs.length > 0) {
        return slugs;
      }
      if (requireLiveSanity) {
        throw new Error('[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled but no writing slugs returned from remote Content Lake.');
      }
    } catch (err: any) {
      if (requireLiveSanity) {
        throw new Error(`[LIVE SANITY ERROR] ${err.message || err}`);
      }
      console.warn(`[Sanity Warning] Remote fetch for writing slugs failed (${err.message}). Using local fallback.`);
    }
  }

  if (requireLiveSanity) {
    throw new Error('[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled but Sanity Content Lake client is not configured.');
  }

  return (localVerticalSliceDocs as any[])
    .filter((d) => d._type === 'writing' && d.slug?.current)
    .map((d) => d.slug.current);
}
