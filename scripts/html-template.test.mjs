import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { escapeHtml, withContent, withPageMetadata } from './html-template.mjs';

test('metadata cannot break out of title or quoted attributes', async () => {
  const template = await readFile(
    new URL('../index.html', import.meta.url),
    'utf8',
  );
  const attack =
    '</title><script>alert(1)</script> " onload="alert(2) & $& $1 $\' $`';
  const html = withPageMetadata(template, {
    title: attack,
    description: attack,
    file: 'confidentialite.html',
  });
  assert(!html.includes('<script>alert(1)</script>'));
  assert(!html.includes(' onload="'));
  assert(html.includes('&lt;/title&gt;&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert(html.includes('&quot; onload=&quot;alert(2) &amp; $&amp; $1 $&#39; $`'));
  assert.equal((html.match(/<title>/g) ?? []).length, 1);
  assert.equal((html.match(/<meta name="description"/g) ?? []).length, 1);
  assert(html.includes('href="https://jordanlacroix.fr/confidentialite.html"'));
  assert.throws(() =>
    withPageMetadata(template, {
      title: '',
      description: '',
      file: '../escape.html',
    }),
  );
});

test('rendered content keeps dollar tokens intact', () => {
  const content = "<p>$& $1 $' $`</p>";
  const result = withContent(
    '<!-- PRODUCTION_CSP --><main><!-- APP_HTML --></main>',
    content,
  );
  assert(result.endsWith('<main>' + content + '</main>'));
  assert.throws(() => withContent('<!-- APP_HTML -->', content));
  assert.throws(() =>
    withContent(
      '<!-- APP_HTML --><!-- APP_HTML --><!-- PRODUCTION_CSP -->',
      content,
    ),
  );
  assert.equal(escapeHtml(`"'<>&`), '&quot;&#39;&lt;&gt;&amp;');
});
