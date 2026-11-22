const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('=== DIST SECURITY AUDIT ===\n');

const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  console.error('FAIL: dist directory does not exist.');
  process.exit(1);
}

// 1. Load authToken from Sanity CLI config (without printing it)
let token = null;
try {
  const configPath = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  if (fs.existsSync(configPath)) {
    const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (cfg?.authToken) {
      token = cfg.authToken.trim();
    }
  }
} catch (e) {
  console.error('Could not load Sanity CLI config:', e.message);
}

// 2. Gather all files in dist/
function getAllFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allDistFiles = getAllFiles(distDir);
console.log(`Total files inspected in dist/: ${allDistFiles.length}`);

const findings = {
  tokenFoundIn: [],
  credentialPathFoundIn: [],
  privateKeywordsFoundIn: {},
};

const sensitiveKeywords = [
  'Content_Inventory',
  'research-webp-final',
  'config.json',
  '.config/sanity',
  '.config\\sanity',
  'authToken',
];

sensitiveKeywords.forEach(kw => {
  findings.privateKeywordsFoundIn[kw] = [];
});

for (const filePath of allDistFiles) {
  // Read content (text or binary check)
  const relPath = path.relative(distDir, filePath).replace(/\\/g, '/');
  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    continue; // binary file, skip text scan or handle if needed
  }

  // Check 1: Token match (NEVER print token)
  if (token && content.includes(token)) {
    findings.tokenFoundIn.push(relPath);
  }

  // Check 2: Credential paths
  if (content.includes('.config/sanity') || content.includes('.config\\sanity') || content.includes('authToken')) {
    findings.credentialPathFoundIn.push(relPath);
  }

  // Check 3: Keywords
  for (const kw of sensitiveKeywords) {
    if (content.includes(kw)) {
      findings.privateKeywordsFoundIn[kw].push(relPath);
    }
  }
}

console.log('\n--- AUDIT RESULTS ---');
console.log('1. Sanity Authentication Token in dist/:');
if (findings.tokenFoundIn.length === 0) {
  console.log('   [PASS] Zero matches. No authentication token exists in generated dist/ files.');
} else {
  console.log('   [FAIL] Token found in files:', findings.tokenFoundIn);
}

console.log('\n2. CLI Credential Paths / JSON keys in dist/:');
if (findings.credentialPathFoundIn.length === 0) {
  console.log('   [PASS] Zero matches. No credential paths or config keys found in dist/.');
} else {
  console.log('   [FAIL] Found in files:', findings.credentialPathFoundIn);
}

console.log('\n3. Sensitive Migration Keywords in dist/:');
let anyKeywordFound = false;
for (const [kw, matches] of Object.entries(findings.privateKeywordsFoundIn)) {
  if (matches.length > 0) {
    anyKeywordFound = true;
    console.log(`   [FAIL] Keyword "${kw}" found in:`, matches);
  }
}
if (!anyKeywordFound) {
  console.log('   [PASS] Zero matches. No private inventory keywords or staging paths found in dist/.');
}
