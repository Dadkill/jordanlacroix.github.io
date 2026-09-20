import assert from 'node:assert/strict';
import { escapeHtml, productionCsp } from './html-template.mjs';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const read = (name) => readFile(path.join(root, name), 'utf8');
const html = await read('index.html');
assert(html.includes('<html lang="fr">'));
assert(
  html.includes('Data Team Lead') && html.toLowerCase().includes('googlesql'),
);
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
assert(!html.includes('APP_HTML') && !html.includes('PRODUCTION_CSP'));
function checkPolicy(document, name) {
  assert(
    document.includes('content="' + escapeHtml(productionCsp) + '"'),
    name + ': production CSP missing',
  );
  assert(
    !/unsafe-(?:inline|eval)/.test(document),
    name + ': unsafe CSP directive',
  );
  assert(
    !/\s(?:style|on[a-z]+)\s*=/i.test(document),
    name + ': inline styles or event handlers',
  );
  assert(!/<style\b/i.test(document), name + ': inline style element');
}
checkPolicy(html, 'index.html');
assert(!html.includes('chatgpt.site') && !html.includes('/src/main.tsx'));
assert(html.includes('https://jordanlacroix.fr/'));
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
for (const [, href] of html.matchAll(/\bhref="#([^"]+)"/g)) {
  assert(ids.has(href), `Missing anchor: ${href}`);
}
for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
  assert(
    /\bsrc="\/assets\//.test(script[1]),
    'Only local compiled modules may execute',
  );
  assert.equal(script[2].trim(), '', 'No inline JavaScript in production');
}
async function checkAsset(url) {
  if (/^(#|https?:|mailto:|data:)/.test(url)) return;
  const asset = path.resolve(
    root,
    '.' + (url.startsWith('/') ? url : '/' + url),
  );
  const relative = path.relative(root, asset);
  assert(
    relative !== '..' &&
      !relative.startsWith('..' + path.sep) &&
      !path.isAbsolute(relative),
    'Asset escapes output',
  );
  assert((await stat(asset)).isFile(), `Missing asset: ${url}`);
}
for (const [, url] of html.matchAll(/\b(?:src|href)="([^"]+)"/g))
  await checkAsset(url);
for (const name of await readdir(path.join(root, 'assets'))) {
  if (name.endsWith('.css')) {
    const css = await read('assets/' + name);
    for (const [, url] of css.matchAll(/url\(["']?([^"')]+)["']?\)/g))
      await checkAsset(url);
  }
}
async function scan(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    assert(!/^\.(env|git|openai|local-archive)/.test(item.name));
    assert(!/\.(ts|tsx|py|map|pem|key|docx)$/.test(item.name));
    if (item.isDirectory()) await scan(path.join(dir, item.name));
  }
}
await scan(root);
assert.equal((await read('CNAME')).trim(), 'jordanlacroix.fr');
await stat(path.join(root, '.nojekyll'));
const pdf = await readFile(path.join(root, 'CV-Jordan-Lacroix.pdf'));
assert(pdf.subarray(0, 5).toString() === '%PDF-');
assert.equal(
  (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length,
  1,
);
console.log(
  'PASS: complete static HTML, local assets, anchors, CSP, no server/secret files, custom domain and one-page CV.',
);

// Legal documents must be independently readable without application JavaScript.
for (const name of ['mentions-legales.html', 'confidentialite.html']) {
  const page = await read(name);
  assert.equal(
    (page.match(/<h1\b/g) ?? []).length,
    1,
    name + ': one main title',
  );
  assert(!/<script\b/.test(page), name + ': static page, no hydration');
  checkPolicy(page, name);
  assert(
    page.includes('href="https://jordanlacroix.fr/' + name + '"'),
    name + ': canonical URL missing',
  );
  assert(!page.includes('APP_HTML') && !page.includes('PRODUCTION_CSP'));
  const pageIds = new Set(
    [...page.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]),
  );
  for (const [, url] of page.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    if (url.startsWith('#'))
      assert(pageIds.has(url.slice(1)), name + ': missing anchor ' + url);
    else if (url !== '/') await checkAsset(url);
  }
}
assert(
  html.includes(
    'property="og:image" content="https://jordanlacroix.fr/social-card.png"',
  ),
);
assert(html.includes('name="twitter:card" content="summary_large_image"'));
const shareImage = await readFile(path.join(root, 'social-card.png'));
assert.equal(shareImage.subarray(1, 4).toString(), 'PNG');
assert.equal(shareImage.readUInt32BE(16), 1200);
assert.equal(shareImage.readUInt32BE(20), 630);
console.log(
  'PASS: standalone legal pages, canonical URLs and 1200 × 630 social card.',
);
