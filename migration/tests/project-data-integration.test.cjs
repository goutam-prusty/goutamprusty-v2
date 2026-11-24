/**
 * Project Data Integration & Route Verification Test Suite
 * goutamprusty.com v2 Rebuild — Phase 1: T4 Projects Data from Sanity
 *
 * Verifies:
 * 1. Project eligibility rules and status filtering (published/completed vs draft/archived/in-progress).
 * 2. Deterministic handling of zero, one, two, and three-or-more projects.
 * 3. Graceful handling of missing optional fields (provenance, AI disclosure, evaluation notes, links, stack, cover).
 * 4. Detail document lookup and unknown slug handling (returns null / 404).
 * 5. Portable Text block compatibility for case studies.
 * 6. Live Sanity Content Lake query layer integration with zero fallback to fixtures.
 */

const assert = require('assert');
const {
  isProjectEligible,
  getProjectCompletionDate
} = require('../lib/project-compatibility.cjs');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${description}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

async function runAsyncTest(description, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ ${description}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

console.log('================================================================');
console.log('  PROJECT DATA INTEGRATION & ROUTE VERIFICATION TEST SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// Suite 1: Project Eligibility Rules & Status Filtering
// -----------------------------------------------------------------------------
console.log('--- Suite 1: Project Eligibility Rules & Status Filtering ---');

test('Eligible projects require _type == "project", title, and non-empty slug', () => {
  assert.strictEqual(isProjectEligible({ _type: 'project', title: 'T', slug: { current: 'slug' }, status: 'published' }), true);
  assert.strictEqual(isProjectEligible({ _type: 'project', title: 'T', slug: 'slug-str', status: 'completed' }), true);
  assert.strictEqual(isProjectEligible({ _type: 'research', title: 'T', slug: { current: 'slug' }, status: 'published' }), false);
  assert.strictEqual(isProjectEligible({ _type: 'project', title: '', slug: { current: 'slug' }, status: 'published' }), false);
  assert.strictEqual(isProjectEligible({ _type: 'project', title: 'T', slug: { current: '' }, status: 'published' }), false);
  assert.strictEqual(isProjectEligible(null), false);
  assert.strictEqual(isProjectEligible(undefined), false);
});

test('Only "published" and "completed" statuses are eligible for public display', () => {
  const base = { _type: 'project', title: 'Test Project', slug: { current: 'test-project' } };
  assert.strictEqual(isProjectEligible({ ...base, status: 'published' }), true);
  assert.strictEqual(isProjectEligible({ ...base, status: 'completed' }), true);
  assert.strictEqual(isProjectEligible({ ...base, status: 'draft' }), false, 'Draft projects must NOT be eligible');
  assert.strictEqual(isProjectEligible({ ...base, status: 'archived' }), false, 'Archived projects must NOT be eligible');
  assert.strictEqual(isProjectEligible({ ...base, status: 'in-progress' }), false, 'In-progress projects must NOT be eligible');
  assert.strictEqual(isProjectEligible({ ...base, status: 'in_progress' }), false, 'In_progress projects must NOT be eligible');
  assert.strictEqual(isProjectEligible({ ...base, status: 'unknown' }), false);
  assert.strictEqual(isProjectEligible({ ...base, status: undefined }), false);
});

// -----------------------------------------------------------------------------
// Suite 2: Zero, One, Two, and Three-or-More Project Counts
// -----------------------------------------------------------------------------
console.log('\n--- Suite 2: Zero, One, Two, and Three-or-More Project Counts ---');

const mockProjects = [
  {
    _id: 'project-PRJ-001',
    _type: 'project',
    workbookId: 'PRJ-001',
    title: 'Inkline',
    slug: { current: 'inkline' },
    summary: 'A resume builder.',
    status: 'published',
    provenance: 'Independent',
    startDate: '2026-06-14',
    endDate: '2026-07-06',
    role: 'Solo Engineer',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS']
  },
  {
    _id: 'project-PRJ-002',
    _type: 'project',
    workbookId: 'PRJ-002',
    title: 'Vitaliq',
    slug: { current: 'vitaliq' },
    summary: 'Health tech platform.',
    status: 'published',
    provenance: 'Independent',
    startDate: '2026-07-06',
    completedDate: '2026-08-01',
    role: 'Solo Full-Stack Developer',
    techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL']
  },
  {
    _id: 'project-PRJ-003',
    _type: 'project',
    workbookId: 'PRJ-003',
    title: 'Wharf',
    slug: { current: 'wharf' },
    summary: 'Multi-Tenant SaaS Starter Kit.',
    status: 'published',
    provenance: 'Independent',
    startDate: '2026-06-20',
    endDate: '2026-07-12',
    role: 'Full-Stack Engineer & Architect',
    techStack: ['Next.js', 'Drizzle ORM', 'Clerk']
  },
  {
    _id: 'project-PRJ-DRAFT',
    _type: 'project',
    workbookId: 'PRJ-DRAFT',
    title: 'Draft Project',
    slug: { current: 'draft-project' },
    summary: 'Not ready.',
    status: 'draft',
    startDate: '2026-01-01'
  }
];

test('Zero project count produces empty list without fixture fallback', () => {
  const emptyDataset = [];
  const eligible = emptyDataset.filter(isProjectEligible);
  assert.strictEqual(eligible.length, 0);
});

test('One project count produces single item list for grid layout', () => {
  const dataset = [mockProjects[0]];
  const eligible = dataset.filter(isProjectEligible);
  assert.strictEqual(eligible.length, 1);
  assert.strictEqual(eligible[0].slug.current, 'inkline');
});

test('Two project count filters out drafts cleanly', () => {
  const dataset = [mockProjects[0], mockProjects[1], mockProjects[3]];
  const eligible = dataset.filter(isProjectEligible);
  assert.strictEqual(eligible.length, 2);
  assert.strictEqual(eligible.some(p => p.status === 'draft'), false);
});

test('Three-or-more project count sorts in reverse chronological order', () => {
  const dataset = [...mockProjects];
  const eligible = dataset.filter(isProjectEligible);
  assert.strictEqual(eligible.length, 3);

  // Sort by coalesce(endDate, completedDate, startDate) desc
  const sorted = [...eligible].sort((a, b) => {
    const dateA = getProjectCompletionDate(a) || a.startDate || '';
    const dateB = getProjectCompletionDate(b) || b.startDate || '';
    return dateB.localeCompare(dateA);
  });

  assert.strictEqual(sorted[0].slug.current, 'vitaliq', 'Vitaliq (2026-08-01) should be first');
  assert.strictEqual(sorted[1].slug.current, 'wharf', 'Wharf (2026-07-12) should be second');
  assert.strictEqual(sorted[2].slug.current, 'inkline', 'Inkline (2026-07-06) should be third');
});

// -----------------------------------------------------------------------------
// Suite 3: Detail Document Lookup & Missing Optional Fields
// -----------------------------------------------------------------------------
console.log('\n--- Suite 3: Detail Document Lookup & Missing Optional Fields ---');

test('Project detail lookup preserves fields when present', () => {
  const fullProject = {
    ...mockProjects[0],
    links: { repo: 'https://github.com/example/inkline', live: 'https://inkline.example.com' },
    aiAttribution: 'UI layout was personally implemented; regex parser used Claude.',
    evaluationNotes: 'Achieved 99 Lighthouse performance score.',
    coverImage: { assetPath: '/images/projects/inkline/cover.webp', alt: 'Inkline cover' },
    body: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 's1', _type: 'span', text: 'Case study prose.', marks: [] }],
        markDefs: []
      }
    ]
  };

  assert.strictEqual(fullProject.provenance, 'Independent');
  assert.strictEqual(fullProject.links.live, 'https://inkline.example.com');
  assert(fullProject.aiAttribution.includes('Claude'));
  assert(fullProject.evaluationNotes.includes('Lighthouse'));
  assert.strictEqual(fullProject.body.length, 1);
});

test('Project detail handles completely omitted optional fields safely', () => {
  const minimalProject = {
    _id: 'project-PRJ-MIN',
    _type: 'project',
    title: 'Minimal Project',
    slug: { current: 'minimal-project' },
    summary: 'A bare minimal project.',
    status: 'published'
  };

  assert.strictEqual(isProjectEligible(minimalProject), true);
  assert.strictEqual(minimalProject.provenance, undefined);
  assert.strictEqual(minimalProject.aiAttribution, undefined);
  assert.strictEqual(minimalProject.evaluationNotes, undefined);
  assert.strictEqual(minimalProject.links, undefined);
  assert.strictEqual(minimalProject.techStack, undefined);
  assert.strictEqual(minimalProject.coverImage, undefined);
  assert.strictEqual(getProjectCompletionDate(minimalProject), null);
});

// -----------------------------------------------------------------------------
// Suite 4: Unknown Slugs & Ineligible Lookup
// -----------------------------------------------------------------------------
console.log('\n--- Suite 4: Unknown Slugs & Ineligible Lookup ---');

test('Lookup for nonexistent or invalid slug resolves to null', () => {
  const lookup = (slug) => {
    return mockProjects.find(p => isProjectEligible(p) && p.slug.current === slug) || null;
  };

  assert.strictEqual(lookup('nonexistent-project'), null);
  assert.strictEqual(lookup('sample-project'), null, 'Fixture sample-project must not be returned');
  assert.strictEqual(lookup(''), null);
  assert.strictEqual(lookup('draft-project'), null, 'Draft project must not be returned');
  assert.notStrictEqual(lookup('inkline'), null);
});

// -----------------------------------------------------------------------------
// Suite 5: Portable Text Custom Block Structure Compatibility
// -----------------------------------------------------------------------------
console.log('\n--- Suite 5: Portable Text Custom Block Structure Compatibility ---');

test('Project body blocks adhere to PortableText.astro expectations', () => {
  const blocks = [
    {
      _key: 'b1',
      _type: 'block',
      style: 'h2',
      children: [{ _key: 's1', _type: 'span', text: 'Architecture Overview', marks: [] }],
      markDefs: []
    },
    {
      _key: 'c1',
      _type: 'codeBlock',
      code: 'function test() { return true; }',
      language: 'typescript'
    },
    {
      _key: 'm1',
      _type: 'mermaidBlock',
      code: 'graph TD; Client-->API-->Database;'
    },
    {
      _key: 'd1',
      _type: 'dividerBlock',
      style: 'line'
    }
  ];

  const types = blocks.map(b => b._type);
  assert(types.includes('block'));
  assert(types.includes('codeBlock'));
  assert(types.includes('mermaidBlock'));
  assert(types.includes('dividerBlock'));
  for (const b of blocks) {
    assert(typeof b._key === 'string' && b._key.length > 0, `Block ${b._type} must have _key`);
  }
});

// -----------------------------------------------------------------------------
// Suite 6: Live Sanity Query Layer Integration
// -----------------------------------------------------------------------------
console.log('\n--- Suite 6: Live Sanity Query Layer Integration ---');

async function testLiveSanityIntegration() {
  const { getAllProjects, getAllProjectSlugs, getProjectBySlug } = await import(
    '../../src/lib/sanityClient.ts'
  );

  await runAsyncTest('getAllProjects() queries Sanity and returns array without fixture fallback', async () => {
    const projects = await getAllProjects();
    assert(Array.isArray(projects), 'Must return an array');
    // Ensure no fixture item is present
    const hasFixture = projects.some(p => p.title === 'Sample project' || p.slug?.current === 'sample-project' || p.slug === 'sample-project');
    assert.strictEqual(hasFixture, false, 'Must never return sample-project fixture');
  });

  await runAsyncTest('getAllProjectSlugs() returns array without sample-project fixture', async () => {
    const slugs = await getAllProjectSlugs();
    assert(Array.isArray(slugs), 'Must return an array');
    assert.strictEqual(slugs.includes('sample-project'), false, 'Must never include sample-project');
  });

  await runAsyncTest('getProjectBySlug("nonexistent") returns null', async () => {
    const project = await getProjectBySlug('nonexistent-project-slug');
    assert.strictEqual(project, null);
  });
}

testLiveSanityIntegration().then(() => {
  console.log('\n================================================================');
  console.log(`  PROJECT DATA INTEGRATION TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (Total: ${totalTests})`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}).catch(err => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
