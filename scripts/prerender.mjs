import { readFile, writeFile } from 'node:fs/promises';
import {
  render,
  renderLegal,
  legalPages,
} from '../.cache/prerender/prerender.js';
import { withContent, withPageMetadata } from './html-template.mjs';

const root = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', root), 'utf8');
await writeFile(new URL('index.html', root), withContent(template, render()));
for (const page of legalPages) {
  // These pages are static documents; they do not need React hydration.
  const staticTemplate = template
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, '');
  const html = withContent(
    withPageMetadata(staticTemplate, page),
    renderLegal(page.file),
  );
  await writeFile(new URL(page.file, root), html);
}
console.log('Prerendered home and legal pages with local assets and CSP.');
