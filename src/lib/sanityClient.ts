import { createClient } from '@sanity/client';
import localVerticalSliceDocs from '../data/verticalSliceData.json' with { type: 'json' };

const proc = (globalThis as any).process;
const env = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env : {};

const projectId =
  env.PUBLIC_SANITY_PROJECT_ID ||
  env.SANITY_PROJECT_ID ||
  proc?.env?.PUBLIC_SANITY_PROJECT_ID ||
  proc?.env?.SANITY_PROJECT_ID;

const dataset =
  env.PUBLIC_SANITY_DATASET ||
  env.SANITY_DATASET ||
  proc?.env?.PUBLIC_SANITY_DATASET ||
  proc?.env?.SANITY_DATASET ||
  'development';

export interface SanityAuthResolution {
  token?: string;
  source: 'env' | 'cli-config' | 'none';
  variableName?: string;
}

export interface ResolveAuthOptions {
  env?: Record<string, string | undefined>;
  allowLocalConfigFallback?: boolean;
  fsModule?: any;
  pathModule?: any;
  osModule?: any;
  customConfigPath?: string;
}

/**
 * Resolves the Sanity authentication token in order of precedence:
 * 1. Dedicated read-only API token (SANITY_API_READ_TOKEN)
 * 2. Fallback environment aliases (SANITY_READ_TOKEN, SANITY_API_TOKEN, SANITY_AUTH_TOKEN)
 * 3. Local Sanity CLI configuration file (~/.config/sanity/config.json) for developer convenience
 *    (disabled in deployment environments such as Cloudflare Pages or CI)
 *
 * Never accepts PUBLIC_ variables; never exposes or logs token values.
 */
export function resolveSanityAuth(options?: ResolveAuthOptions): SanityAuthResolution {
  const p = (globalThis as any).process;
  const metaEnv = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env : {};

  const envSource = options?.env || {
    ...p?.env,
    SANITY_API_READ_TOKEN: p?.env?.SANITY_API_READ_TOKEN || metaEnv.SANITY_API_READ_TOKEN,
    SANITY_READ_TOKEN: p?.env?.SANITY_READ_TOKEN || metaEnv.SANITY_READ_TOKEN,
    SANITY_API_TOKEN: p?.env?.SANITY_API_TOKEN || metaEnv.SANITY_API_TOKEN,
    SANITY_AUTH_TOKEN: p?.env?.SANITY_AUTH_TOKEN || metaEnv.SANITY_AUTH_TOKEN,
    CF_PAGES: p?.env?.CF_PAGES || metaEnv.CF_PAGES,
    CI: p?.env?.CI || metaEnv.CI,
  };

  // 1. Check server-only environment variables in precedence order
  const envVarCandidates = [
    'SANITY_API_READ_TOKEN',
    'SANITY_READ_TOKEN',
    'SANITY_API_TOKEN',
    'SANITY_AUTH_TOKEN',
  ] as const;

  for (const varName of envVarCandidates) {
    const candidate = envSource[varName];
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return {
        token: candidate.trim(),
        source: 'env',
        variableName: varName,
      };
    }
  }

  // 2. Local CLI configuration fallback (permitted only outside deployment environments)
  const isDeployment = Boolean(envSource.CF_PAGES || envSource.CI);
  const allowCliFallback = options?.allowLocalConfigFallback ?? !isDeployment;

  if (allowCliFallback) {
    try {
      const fs = options?.fsModule || (p?.getBuiltinModule ? p.getBuiltinModule('fs') : null);
      const path = options?.pathModule || (p?.getBuiltinModule ? p.getBuiltinModule('path') : null);
      const os = options?.osModule || (p?.getBuiltinModule ? p.getBuiltinModule('os') : null);

      if (fs && path && os) {
        const configPath = options?.customConfigPath || path.join(os.homedir(), '.config', 'sanity', 'config.json');
        if (fs.existsSync(configPath)) {
          const raw = fs.readFileSync(configPath, 'utf8');
          const config = JSON.parse(raw);
          if (typeof config?.authToken === 'string' && config.authToken.trim().length > 0) {
            return {
              token: config.authToken.trim(),
              source: 'cli-config',
            };
          }
        }
      }
    } catch {
      // Ignore error in non-Node or restricted sandbox environments
    }
  }

  return {
    token: undefined,
    source: 'none',
  };
}

export function resolveSanityToken(options?: ResolveAuthOptions): string | undefined {
  return resolveSanityAuth(options).token;
}

const auth = resolveSanityAuth();
const token = auth.token;

export const isSanityConfigured = Boolean(
  projectId && projectId !== 'unconfigured-local-project'
);

export const requireLiveSanity = Boolean(
  proc?.env?.SANITY_REQUIRE_LIVE === 'true' ||
  env.SANITY_REQUIRE_LIVE === 'true'
);

export function assertLiveSanityAuthentication(): void {
  if (!requireLiveSanity) return;

  if (!isSanityConfigured) {
    throw new Error(
      '[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled but Sanity Content Lake client is not configured (missing project ID).'
    );
  }

  if (!token && dataset !== 'production') {
    throw new Error(
      `[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled for private dataset "${dataset}", but no valid Sanity authentication token was found. Set SANITY_API_READ_TOKEN in your environment.`
    );
  }
}

// Ensure live authentication requirements are evaluated upfront
assertLiveSanityAuthentication();

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

/**
 * Retrieve all research reports for listings.
 */
export async function getAllResearchReports() {
  if (sanityClient) {
    try {
      const query = `*[_type == "research" && defined(slug.current)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        summary,
        publishedAt,
        lengthEstimateMinutes,
        readingTimeMinutes,
        category,
        workbookId
      }`;
      const reports = await sanityClient.fetch(query);
      if (Array.isArray(reports) && reports.length > 0) {
        return reports;
      }
      if (requireLiveSanity) {
        throw new Error('[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled but no research reports returned from remote Content Lake.');
      }
    } catch (err: any) {
      if (requireLiveSanity) {
        throw new Error(`[LIVE SANITY ERROR] ${err.message || err}`);
      }
      console.warn(`[Sanity Warning] Remote fetch for research reports failed (${err.message}). Using local fallback.`);
    }
  }

  if (requireLiveSanity) {
    throw new Error('[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled but Sanity Content Lake client is not configured.');
  }

  const localItems = (localVerticalSliceDocs as any[]).filter(
    (d) => d._type === 'research' && d.slug?.current
  );
  if (localItems.length > 0) {
    return localItems;
  }

  return [
    {
      _id: 'sample-report',
      title: 'Sample research report',
      slug: { current: 'sample-report' },
      summary: 'Placeholder summary for reviewing a long-form research listing.',
      lengthEstimateMinutes: 15,
      category: 'General Research',
    },
  ];
}

/**
 * Retrieve all writing articles for listings.
 */
export async function getAllWritingArticles() {
  if (sanityClient) {
    try {
      const query = `*[_type == "writing" && defined(slug.current)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        summary,
        publishedAt,
        readingTimeOverride,
        readingTimeMinutes,
        body,
        category,
        workbookId
      }`;
      const articles = await sanityClient.fetch(query);
      if (Array.isArray(articles) && articles.length > 0) {
        return articles;
      }
      if (requireLiveSanity) {
        throw new Error('[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled but no writing articles returned from remote Content Lake.');
      }
    } catch (err: any) {
      if (requireLiveSanity) {
        throw new Error(`[LIVE SANITY ERROR] ${err.message || err}`);
      }
      console.warn(`[Sanity Warning] Remote fetch for writing articles failed (${err.message}). Using local fallback.`);
    }
  }

  if (requireLiveSanity) {
    throw new Error('[LIVE SANITY ERROR] SANITY_REQUIRE_LIVE is enabled but Sanity Content Lake client is not configured.');
  }

  const localItems = (localVerticalSliceDocs as any[]).filter(
    (d) => d._type === 'writing' && d.slug?.current
  );
  if (localItems.length > 0) {
    return localItems;
  }

  return [
    {
      _id: 'sample-article',
      title: 'Sample article',
      slug: { current: 'sample-article' },
      summary: 'Placeholder summary for reviewing an editorial writing listing.',
      readingTimeMinutes: 5,
      category: 'General Writing',
    },
  ];
}
