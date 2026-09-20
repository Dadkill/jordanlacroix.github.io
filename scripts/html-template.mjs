// Only trusted React-rendered markup belongs in the content argument.
export const productionCsp =
  "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; require-trusted-types-for 'script'; upgrade-insecure-requests";

export function escapeHtml(value) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

export function withContent(html, content) {
  for (const marker of ['<!-- APP_HTML -->', '<!-- PRODUCTION_CSP -->']) {
    if (html.split(marker).length !== 2)
      throw new Error('Missing or duplicate marker: ' + marker);
  }
  // Callbacks preserve literal replacement tokens such as $& in rendered text.
  return html
    .replace(
      '<!-- PRODUCTION_CSP -->',
      () =>
        '<meta http-equiv="Content-Security-Policy" content="' +
        escapeHtml(productionCsp) +
        '" />',
    )
    .replace('<!-- APP_HTML -->', () => content);
}

export function withPageMetadata(template, page) {
  const title = escapeHtml(page.title + ' | Jordan Lacroix');
  const description = escapeHtml(page.description);
  if (!/^[a-z0-9-]+\.html$/.test(page.file))
    throw new Error('Invalid static page filename');
  const url = 'https://jordanlacroix.fr/' + page.file;
  return template
    .replace(/<title>[^<]*<\/title>/, () => '<title>' + title + '</title>')
    .replace(
      /(<meta name="description" content=")[^"]*/,
      (_, prefix) => prefix + description,
    )
    .replace(
      /(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*/g,
      (_, prefix) => prefix + title,
    )
    .replace(
      /(<meta (?:property="og:description"|name="twitter:description") content=")[^"]*/g,
      (_, prefix) => prefix + description,
    )
    .replace(/(<link rel="canonical" href=")[^"]*/, (_, prefix) => prefix + url)
    .replace(
      /(<meta property="og:url" content=")[^"]*/,
      (_, prefix) => prefix + url,
    );
}
