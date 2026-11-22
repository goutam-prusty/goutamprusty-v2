const fs = require('fs');
const path = require('path');

const distDir = path.resolve('dist');

const researchPath = path.join(
  distDir,
  'research',
  'strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026',
  'index.html'
);

const writing1Path = path.join(
  distDir,
  'writing',
  'agentic-inflection-point',
  'index.html'
);

const writing2Path = path.join(
  distDir,
  'writing',
  'ai-physical-limits',
  'index.html'
);

console.log('=== STEP 3: VERIFY GENERATED HTML ===\n');

// 1. Check file existence
console.log('1. Generated HTML files exist:');
console.log('   Research:', fs.existsSync(researchPath), `(${fs.statSync(researchPath).size} bytes)`);
console.log('   Writing 1:', fs.existsSync(writing1Path), `(${fs.statSync(writing1Path).size} bytes)`);
console.log('   Writing 2:', fs.existsSync(writing2Path), `(${fs.statSync(writing2Path).size} bytes)`);

const researchHtml = fs.readFileSync(researchPath, 'utf8');
const writing1Html = fs.readFileSync(writing1Path, 'utf8');
const writing2Html = fs.readFileSync(writing2Path, 'utf8');

// 2. Titles & Leade
console.log('\n2. Titles and content:');
const resTitleMatch = researchHtml.match(/<h1[^>]*>([^<]+)<\/h1>/);
console.log('   Research <h1>:', resTitleMatch ? resTitleMatch[1] : 'NOT FOUND');

const w1TitleMatch = writing1Html.match(/<h1[^>]*>([^<]+)<\/h1>/);
console.log('   Writing 1 <h1>:', w1TitleMatch ? w1TitleMatch[1] : 'NOT FOUND');

const w2TitleMatch = writing2Html.match(/<h1[^>]*>([^<]+)<\/h1>/);
console.log('   Writing 2 <h1>:', w2TitleMatch ? w2TitleMatch[1] : 'NOT FOUND');

// 3. Research Headings (h2, h3)
const h2Matches = [...researchHtml.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(m => m[1]);
console.log(`\n3. Research Headings (found ${h2Matches.length} <h2> elements):`);
h2Matches.slice(0, 5).forEach(h => console.log('   - <h2>', h));

// 4. 71 Bibliography References and anchors
const citeAnchors = [...researchHtml.matchAll(/id="cite-(\d+)"/g)].map(m => parseInt(m[1], 10));
console.log(`\n4. Bibliography references:`);
console.log(`   Found ${citeAnchors.length} citation targets (id="cite-N").`);
console.log(`   Min cite: ${Math.min(...citeAnchors)}, Max cite: ${Math.max(...citeAnchors)}.`);
const hasAll71 = citeAnchors.length === 71 && Math.min(...citeAnchors) === 1 && Math.max(...citeAnchors) === 71;
console.log(`   Has all 71 sequential citations: ${hasAll71}`);

// 5. Table rows
const tableRows = [...researchHtml.matchAll(/<tr[^>]*>/g)];
console.log(`\n5. Table rows in Research HTML:`);
console.log(`   Found ${tableRows.length} <tr> elements in document (Expected: 6 rows in humanoid comparison table).`);

// 6. Formula Image Path & Local Resolution
const formulaImgMatch = researchHtml.match(/<img[^>]*src="([^"]*formula-1\.webp)"[^>]*>/);
console.log(`\n6. Formula block:`);
if (formulaImgMatch) {
  const src = formulaImgMatch[1];
  const diskPath = path.join('public', src.startsWith('/') ? src.slice(1) : src);
  console.log(`   Found formula image src: ${src}`);
  console.log(`   Local disk file exists: ${fs.existsSync(diskPath)} (${fs.statSync(diskPath).size} bytes)`);
} else {
  console.log('   Formula image NOT FOUND in HTML!');
}

// 7. Writing pages display parent research relationship
console.log(`\n7. Writing pages parent relationship:`);
const w1ParentLink = writing1Html.includes('/research/strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026/');
const w2ParentLink = writing2Html.includes('/research/strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026/');
console.log(`   Writing 1 links to parent research: ${w1ParentLink}`);
console.log(`   Writing 2 links to parent research: ${w2ParentLink}`);

// 8. Research page links to both derived posts
console.log(`\n8. Research page links to derived posts:`);
const resLinksW1 = researchHtml.includes('/writing/agentic-inflection-point/');
const resLinksW2 = researchHtml.includes('/writing/ai-physical-limits/');
console.log(`   Links to /writing/agentic-inflection-point/: ${resLinksW1}`);
console.log(`   Links to /writing/ai-physical-limits/: ${resLinksW2}`);

// 9. Cover images
console.log(`\n9. Cover images:`);
const resCover = researchHtml.match(/<img[^>]*src="([^"]*cover\.webp)"/);
const w1Cover = writing1Html.match(/<img[^>]*src="([^"]*cover\.webp)"/);
const w2Cover = writing2Html.match(/<img[^>]*src="([^"]*cover\.webp)"/);
console.log(`   Research cover: ${resCover ? resCover[1] : 'NONE'} (disk exists: ${resCover ? fs.existsSync(path.join('public', resCover[1])) : false})`);
console.log(`   Writing 1 cover: ${w1Cover ? w1Cover[1] : 'NONE'} (disk exists: ${w1Cover ? fs.existsSync(path.join('public', w1Cover[1])) : false})`);
console.log(`   Writing 2 cover: ${w2Cover ? w2Cover[1] : 'NONE'} (disk exists: ${w2Cover ? fs.existsSync(path.join('public', w2Cover[1])) : false})`);
