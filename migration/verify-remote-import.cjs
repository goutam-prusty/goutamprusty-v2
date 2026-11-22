const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'l94q5yx8',
  dataset: 'development',
  apiVersion: '2024-03-01',
  useCdn: false,
});

async function verifyRemote() {
  console.log('=== VERIFYING REMOTE SANITY CONTENT LAKE IMPORT ===\n');

  // 1. Fetch all 3 documents with metadata and dereferenced references
  const query = `*[_id in ["research-RES-018", "writing-BLG-001", "writing-BLG-002"]] | order(_id asc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    status,
    editorialStatus,
    workbookId,
    "bibCount": count(bibliography),
    "smCount": count(sourceMaterial),
    "tableBlocksCount": count(body[_type == "tableBlock"]),
    "formulaBlocksCount": count(body[_type == "formulaBlock"]),
    "formulaAssetPaths": body[_type == "formulaBlock"].assetPath,
    "sourceReportRef": sourceReport._ref,
    "sourceReportTitle": sourceReport->title,
    "derivedPosts": derivedPosts[]->{
      _id,
      title,
      "slug": slug.current
    }
  }`;

  try {
    const docs = await client.fetch(query);
    console.log('Retrieved document count:', docs.length);
    console.log(JSON.stringify(docs, null, 2));

    console.log('\n--- VERIFICATION CHECKS ---');

    // Check count and IDs
    const ids = docs.map(d => d._id);
    console.log('1. Exactly 3 documents retrieved:', docs.length === 3, ids);

    const res018 = docs.find(d => d._id === 'research-RES-018');
    const blg001 = docs.find(d => d._id === 'writing-BLG-001');
    const blg002 = docs.find(d => d._id === 'writing-BLG-002');

    console.log('2. Metadata correctness:');
    console.log('   RES-018:', res018 ? {
      _id: res018._id,
      _type: res018._type,
      title: res018.title,
      slug: res018.slug,
      status: res018.status
    } : 'NOT FOUND');

    console.log('   BLG-001:', blg001 ? {
      _id: blg001._id,
      _type: blg001._type,
      title: blg001.title,
      slug: blg001.slug,
      status: blg001.status
    } : 'NOT FOUND');

    console.log('   BLG-002:', blg002 ? {
      _id: blg002._id,
      _type: blg002._type,
      title: blg002.title,
      slug: blg002.slug,
      status: blg002.status
    } : 'NOT FOUND');

    console.log('3. RES-018 Bibliography & Source Material:');
    console.log('   Bibliography count:', res018?.bibCount, '(Expected: 71)');
    console.log('   Source Material count:', res018?.smCount, '(Expected: 71)');

    console.log('4. RES-018 Table & Formula blocks:');
    console.log('   Table blocks count:', res018?.tableBlocksCount, '(Expected: 1)');
    console.log('   Formula blocks count:', res018?.formulaBlocksCount, '(Expected: 1)');
    console.log('   Formula asset path:', res018?.formulaAssetPaths);

    console.log('5. Writing references pointing to RES-018:');
    console.log('   BLG-001 sourceReport._ref:', blg001?.sourceReportRef, '-> dereferenced title:', blg001?.sourceReportTitle);
    console.log('   BLG-002 sourceReport._ref:', blg002?.sourceReportRef, '-> dereferenced title:', blg002?.sourceReportTitle);

    console.log('6. RES-018 dereferenced derived posts:');
    console.log('   Derived posts count:', res018?.derivedPosts?.length, '(Expected: 2)');
    console.log('   Derived posts:', JSON.stringify(res018?.derivedPosts));

  } catch (err) {
    console.error('Remote verification query failed:', err.message);
    process.exit(1);
  }
}

verifyRemote();
