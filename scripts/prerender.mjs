import { readFile, writeFile } from 'node:fs/promises';
import {
  render,
  renderLegal,
  legalPages,
} from '../.cache/prerender/prerender.js';

const root = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', root), 'utf8');
if (!template.includes('<!-- APP_HTML -->'))
  throw new Error('Missing prerender marker');

const policy =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'";
const withContent = (html, content) =>
  html
    .replace('<!-- APP_HTML -->', content)
    .replace(
      '<!-- PRODUCTION_CSP -->',
      '<meta http-equiv="Content-Security-Policy" content="' + policy + '" />',
    );

await writeFile(new URL('index.html', root), withContent(template, render()));
for (const page of legalPages) {
  // These pages are static documents; they do not need React hydration.
  let html = template
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, '')
    .replace(
      /<title>[^<]*<\/title>/,
      '<title>' + page.title + ' | Jordan Lacroix</title>',
    )
    .replace(
      /(<meta name="description" content=")[^"]*/,
      '$1' + page.description,
    )
    .replace(
      /(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*/g,
      '$1' + page.title + ' | Jordan Lacroix',
    )
    .replace(
      /(<meta (?:property="og:description"|name="twitter:description") content=")[^"]*/g,
      '$1' + page.description,
    )
    .replace(
      /(<link rel="canonical" href=")[^"]*/,
      '$1https://jordanlacroix.fr/' + page.file,
    )
    .replace(
      /(<meta property="og:url" content=")[^"]*/,
      '$1https://jordanlacroix.fr/' + page.file,
    );
  html = withContent(html, renderLegal(page.file));
  await writeFile(new URL(page.file, root), html);
}
console.log('Prerendered home and legal pages with local assets and CSP.');
