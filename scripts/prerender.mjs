import { readFile, writeFile } from 'node:fs/promises';
import { render } from '../.cache/prerender/prerender.js';

const path = new URL('../dist/index.html', import.meta.url);
let html = await readFile(path, 'utf8');
if (!html.includes('<!-- APP_HTML -->'))
  throw new Error('Missing prerender marker');
html = html.replace('<!-- APP_HTML -->', render());
// Pages cannot run the previous server's nonce middleware. No inline JavaScript
// is emitted: a static meta CSP can restrict execution to local modules.
const policy =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'";
html = html.replace(
  '<!-- PRODUCTION_CSP -->',
  `<meta http-equiv="Content-Security-Policy" content="${policy}" />`,
);
await writeFile(path, html);
console.log(
  'Prerendered dist/index.html with complete content and static CSP.',
);
