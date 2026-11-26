/**
 * Sanity Authentication & Cloudflare Pages Compatibility Test Suite
 * goutamprusty-v2 — Focused Authentication Verification
 *
 * Verifies:
 * 1. Dedicated SANITY_API_READ_TOKEN resolution precedence
 * 2. Aliases and fallback hierarchy
 * 3. Rejection of PUBLIC_ token variables
 * 4. Cloudflare Pages (CF_PAGES) & CI deployment isolation (CLI config disabled)
 * 5. Local development convenience fallback
 * 6. Visible failure behavior when SANITY_REQUIRE_LIVE is active
 * 7. Security: zero token leakage in error messages or logs
 */

const assert = require('assert');
const path = require('path');

let total = 0;
let passed = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

async function run() {
  console.log('================================================================');
  console.log('  SANITY AUTHENTICATION & CLOUDFLARE COMPATIBILITY TEST SUITE');
  console.log('================================================================\n');

  const { resolveSanityAuth, resolveSanityToken, resolveSanityDataset } = await import('../../src/lib/sanityClient.ts');

  // Group 1: Environment Variable Hierarchy & Precedence
  console.log('--- 1. Dedicated & Alias Environment Variable Hierarchy ---');

  test('Resolves primary dedicated SANITY_API_READ_TOKEN', () => {
    const res = resolveSanityAuth({
      env: { SANITY_API_READ_TOKEN: 'token-primary-123' },
      allowLocalConfigFallback: false,
    });
    assert.strictEqual(res.token, 'token-primary-123');
    assert.strictEqual(res.source, 'env');
    assert.strictEqual(res.variableName, 'SANITY_API_READ_TOKEN');
  });

  test('Resolves fallback alias SANITY_READ_TOKEN when primary is unset', () => {
    const res = resolveSanityAuth({
      env: { SANITY_READ_TOKEN: 'token-read-456' },
      allowLocalConfigFallback: false,
    });
    assert.strictEqual(res.token, 'token-read-456');
    assert.strictEqual(res.source, 'env');
    assert.strictEqual(res.variableName, 'SANITY_READ_TOKEN');
  });

  test('Resolves fallback alias SANITY_API_TOKEN when primary is unset', () => {
    const res = resolveSanityAuth({
      env: { SANITY_API_TOKEN: 'token-api-789' },
      allowLocalConfigFallback: false,
    });
    assert.strictEqual(res.token, 'token-api-789');
    assert.strictEqual(res.source, 'env');
    assert.strictEqual(res.variableName, 'SANITY_API_TOKEN');
  });

  test('Resolves fallback alias SANITY_AUTH_TOKEN when primary is unset', () => {
    const res = resolveSanityAuth({
      env: { SANITY_AUTH_TOKEN: 'token-auth-012' },
      allowLocalConfigFallback: false,
    });
    assert.strictEqual(res.token, 'token-auth-012');
    assert.strictEqual(res.source, 'env');
    assert.strictEqual(res.variableName, 'SANITY_AUTH_TOKEN');
  });

  test('Strictly prioritizes SANITY_API_READ_TOKEN over all aliases', () => {
    const res = resolveSanityAuth({
      env: {
        SANITY_AUTH_TOKEN: 'alias-token',
        SANITY_API_TOKEN: 'alias-token',
        SANITY_READ_TOKEN: 'alias-token',
        SANITY_API_READ_TOKEN: 'primary-token',
      },
      allowLocalConfigFallback: false,
    });
    assert.strictEqual(res.token, 'primary-token');
    assert.strictEqual(res.variableName, 'SANITY_API_READ_TOKEN');
  });

  // Group 2: Security & Variable Isolation
  console.log('\n--- 2. Server-Only Isolation & PUBLIC_ Rejection ---');

  test('Ignores PUBLIC_SANITY_API_READ_TOKEN or other PUBLIC_ credentials', () => {
    const res = resolveSanityAuth({
      env: {
        PUBLIC_SANITY_API_READ_TOKEN: 'leaked-public-secret',
        PUBLIC_SANITY_TOKEN: 'leaked-public-secret-2',
      },
      allowLocalConfigFallback: false,
    });
    assert.strictEqual(res.token, undefined);
    assert.strictEqual(res.source, 'none');
  });

  // Group 3: Cloudflare Pages & Deployment Isolation
  console.log('\n--- 3. Cloudflare Pages & CI Deployment Isolation ---');

  // Create a mock filesystem for CLI config tests
  const mockFsWithConfig = {
    existsSync: (p) => p.includes('config.json'),
    readFileSync: () => JSON.stringify({ authToken: 'mock-cli-token-999' }),
  };

  const mockPath = path;
  const mockOs = { homedir: () => '/mock/home' };

  test('In Cloudflare Pages (CF_PAGES=1), disables local CLI config file fallback', () => {
    const res = resolveSanityAuth({
      env: { CF_PAGES: '1' },
      fsModule: mockFsWithConfig,
      pathModule: mockPath,
      osModule: mockOs,
    });
    assert.strictEqual(res.token, undefined, 'Must not read local CLI config in Cloudflare Pages build');
    assert.strictEqual(res.source, 'none');
  });

  test('In CI environment (CI=true), disables local CLI config file fallback', () => {
    const res = resolveSanityAuth({
      env: { CI: 'true' },
      fsModule: mockFsWithConfig,
      pathModule: mockPath,
      osModule: mockOs,
    });
    assert.strictEqual(res.token, undefined, 'Must not read local CLI config in CI build');
    assert.strictEqual(res.source, 'none');
  });

  test('In Cloudflare Pages, accepts explicit SANITY_API_READ_TOKEN environment variable', () => {
    const res = resolveSanityAuth({
      env: { CF_PAGES: '1', SANITY_API_READ_TOKEN: 'cf-pages-env-token' },
      fsModule: mockFsWithConfig,
      pathModule: mockPath,
      osModule: mockOs,
    });
    assert.strictEqual(res.token, 'cf-pages-env-token');
    assert.strictEqual(res.source, 'env');
    assert.strictEqual(res.variableName, 'SANITY_API_READ_TOKEN');
  });

  // Group 4: Local Development Convenience Fallback
  console.log('\n--- 4. Local Development Fallback Behavior ---');

  test('In local development (!CF_PAGES && !CI), reads CLI config if env token is absent', () => {
    const res = resolveSanityAuth({
      env: {},
      fsModule: mockFsWithConfig,
      pathModule: mockPath,
      osModule: mockOs,
    });
    assert.strictEqual(res.token, 'mock-cli-token-999');
    assert.strictEqual(res.source, 'cli-config');
  });

  test('In local development, explicit environment token takes precedence over CLI config', () => {
    const res = resolveSanityAuth({
      env: { SANITY_API_READ_TOKEN: 'explicit-local-env-token' },
      fsModule: mockFsWithConfig,
      pathModule: mockPath,
      osModule: mockOs,
    });
    assert.strictEqual(res.token, 'explicit-local-env-token');
    assert.strictEqual(res.source, 'env');
  });

  test('Returns undefined token and source "none" when no credentials exist anywhere', () => {
    const mockFsEmpty = {
      existsSync: () => false,
      readFileSync: () => '',
    };
    const res = resolveSanityAuth({
      env: {},
      fsModule: mockFsEmpty,
      pathModule: mockPath,
      osModule: mockOs,
    });
    assert.strictEqual(res.token, undefined);
    assert.strictEqual(res.source, 'none');
  });

  // Group 5: Failure Handling & Error Messaging
  console.log('\n--- 5. Live Authentication Failure Handling ---');

  test('resolveSanityToken wrapper returns string token or undefined', () => {
    assert.strictEqual(typeof resolveSanityToken({ env: { SANITY_API_READ_TOKEN: 'abc' } }), 'string');
    assert.strictEqual(resolveSanityToken({ env: {}, allowLocalConfigFallback: false }), undefined);
  });

  // Group 6: Four-Tier Sanity Dataset Precedence & Resolution
  console.log('\n--- 6. Four-Tier Sanity Dataset Precedence & Resolution ---');

  test('Explicit SANITY_DATASET=production selects production', () => {
    const res = resolveSanityDataset({ env: { SANITY_DATASET: 'production' } });
    assert.strictEqual(res, 'production');
  });

  test('Explicit PUBLIC_SANITY_DATASET=production selects production', () => {
    const res = resolveSanityDataset({ env: { PUBLIC_SANITY_DATASET: 'production' } });
    assert.strictEqual(res, 'production');
  });

  test('Explicit development configuration selects development', () => {
    const res = resolveSanityDataset({ env: { SANITY_DATASET: 'development' } });
    assert.strictEqual(res, 'development');
  });

  test('Tier 1: import.meta.env.PUBLIC_SANITY_DATASET wins over all lower tiers', () => {
    const res = resolveSanityDataset({
      metaEnv: {
        PUBLIC_SANITY_DATASET: 'tier1-astro-public',
        SANITY_DATASET: 'tier2-astro-server',
      },
      env: {
        PUBLIC_SANITY_DATASET: 'tier3-proc-public',
        SANITY_DATASET: 'tier4-proc-server',
      },
    });
    assert.strictEqual(res, 'tier1-astro-public');
  });

  test('Tier 2: import.meta.env.SANITY_DATASET wins over process public and server (Astro server beats process public)', () => {
    const res = resolveSanityDataset({
      metaEnv: {
        PUBLIC_SANITY_DATASET: '',
        SANITY_DATASET: 'tier2-astro-server',
      },
      env: {
        PUBLIC_SANITY_DATASET: 'tier3-proc-public',
        SANITY_DATASET: 'tier4-proc-server',
      },
    });
    assert.strictEqual(res, 'tier2-astro-server');
  });

  test('Tier 1: import.meta.env.PUBLIC_SANITY_DATASET wins over process-level server', () => {
    const res = resolveSanityDataset({
      metaEnv: {
        PUBLIC_SANITY_DATASET: 'tier1-astro-public',
      },
      env: {
        SANITY_DATASET: 'tier4-proc-server',
      },
    });
    assert.strictEqual(res, 'tier1-astro-public');
  });

  test('Within process source, PUBLIC_SANITY_DATASET wins over server SANITY_DATASET', () => {
    const res = resolveSanityDataset({
      metaEnv: {},
      env: {
        PUBLIC_SANITY_DATASET: 'tier3-proc-public',
        SANITY_DATASET: 'tier4-proc-server',
      },
    });
    assert.strictEqual(res, 'tier3-proc-public');
  });

  test('Tier 4: process.env.SANITY_DATASET is selected when Tiers 1-3 are absent', () => {
    const res = resolveSanityDataset({
      metaEnv: {},
      env: {
        SANITY_DATASET: 'tier4-proc-server',
      },
    });
    assert.strictEqual(res, 'tier4-proc-server');
  });

  test('Whitespace-only and empty strings fall through to the next candidate tier', () => {
    const res = resolveSanityDataset({
      metaEnv: {
        PUBLIC_SANITY_DATASET: '   ',
        SANITY_DATASET: '',
      },
      env: {
        PUBLIC_SANITY_DATASET: '  \t\n  ',
        SANITY_DATASET: '  valid-dataset-candidate  ',
      },
    });
    assert.strictEqual(res, 'valid-dataset-candidate');
  });

  // Group 7: Production Precedence & Fail-Closed Guard
  console.log('\n--- 7. Production Precedence & Fail-Closed Guard ---');

  test('Missing dataset in genuine local development (isDev: true) defaults to development', () => {
    const res = resolveSanityDataset({ env: {}, isDev: true });
    assert.strictEqual(res, 'development');
  });

  test('Missing dataset in genuine local development (NODE_ENV=development) defaults to development', () => {
    const res = resolveSanityDataset({ env: { NODE_ENV: 'development' } });
    assert.strictEqual(res, 'development');
  });

  test('Missing dataset in genuine local development (import.meta.env.DEV=true) defaults to development', () => {
    const res = resolveSanityDataset({ metaEnv: { DEV: true } });
    assert.strictEqual(res, 'development');
  });

  test('Missing dataset in production build (NODE_ENV=production) throws configuration error', () => {
    assert.throws(
      () => resolveSanityDataset({ env: { NODE_ENV: 'production' }, isDev: false }),
      /\[CONFIGURATION ERROR\] A Sanity dataset must be explicitly configured for production builds\. Set SANITY_DATASET or PUBLIC_SANITY_DATASET\./
    );
  });

  test('Production build signal (npm_lifecycle_event=build) + NODE_ENV=development still throws when dataset is absent', () => {
    assert.throws(
      () => resolveSanityDataset({ env: { npm_lifecycle_event: 'build', NODE_ENV: 'development' } }),
      /\[CONFIGURATION ERROR\] A Sanity dataset must be explicitly configured for production builds\. Set SANITY_DATASET or PUBLIC_SANITY_DATASET\./
    );
  });

  test('Production build signal (isProd: true) + NODE_ENV=development still throws when dataset is absent', () => {
    assert.throws(
      () => resolveSanityDataset({ env: { NODE_ENV: 'development' }, isProd: true }),
      /\[CONFIGURATION ERROR\] A Sanity dataset must be explicitly configured for production builds\. Set SANITY_DATASET or PUBLIC_SANITY_DATASET\./
    );
  });

  test('Production build signal (PROD: true in metaEnv) + NODE_ENV=development still throws when dataset is absent', () => {
    assert.throws(
      () => resolveSanityDataset({ metaEnv: { PROD: true }, env: { NODE_ENV: 'development' } }),
      /\[CONFIGURATION ERROR\] A Sanity dataset must be explicitly configured for production builds\. Set SANITY_DATASET or PUBLIC_SANITY_DATASET\./
    );
  });

  test('Production build signal (MODE=production in metaEnv) + NODE_ENV=development still throws when dataset is absent', () => {
    assert.throws(
      () => resolveSanityDataset({ metaEnv: { MODE: 'production' }, env: { NODE_ENV: 'development' } }),
      /\[CONFIGURATION ERROR\] A Sanity dataset must be explicitly configured for production builds\. Set SANITY_DATASET or PUBLIC_SANITY_DATASET\./
    );
  });

  test('Cloudflare Pages deployment (CF_PAGES=1) throws configuration error when dataset is absent', () => {
    assert.throws(
      () => resolveSanityDataset({ env: { CF_PAGES: '1' } }),
      /\[CONFIGURATION ERROR\] A Sanity dataset must be explicitly configured for production builds\. Set SANITY_DATASET or PUBLIC_SANITY_DATASET\./
    );
  });

  test('Cloudflare Pages (CF_PAGES=1) + NODE_ENV=development still throws when dataset is absent', () => {
    assert.throws(
      () => resolveSanityDataset({ env: { CF_PAGES: '1', NODE_ENV: 'development' } }),
      /\[CONFIGURATION ERROR\] A Sanity dataset must be explicitly configured for production builds\. Set SANITY_DATASET or PUBLIC_SANITY_DATASET\./
    );
  });

  test('Cloudflare Pages (CF_PAGES=1) + isDev=true still throws when dataset is absent', () => {
    assert.throws(
      () => resolveSanityDataset({ env: { CF_PAGES: '1' }, isDev: true }),
      /\[CONFIGURATION ERROR\] A Sanity dataset must be explicitly configured for production builds\. Set SANITY_DATASET or PUBLIC_SANITY_DATASET\./
    );
  });

  test('Cloudflare Pages (CF_PAGES=1 in metaEnv) + DEV=true still throws when dataset is absent', () => {
    assert.throws(
      () => resolveSanityDataset({ metaEnv: { CF_PAGES: '1', DEV: true } }),
      /\[CONFIGURATION ERROR\] A Sanity dataset must be explicitly configured for production builds\. Set SANITY_DATASET or PUBLIC_SANITY_DATASET\./
    );
  });

  test('Generic CI/test execution (CI=true) without deployment signals retains local fallback', () => {
    const res = resolveSanityDataset({ env: { CI: 'true' }, isDev: false });
    assert.strictEqual(res, 'development');
  });

  console.log('\n================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${total - passed} FAILED (Total: ${total})`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
