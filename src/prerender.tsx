import { renderToString } from 'react-dom/server';
import App from './App';
import { LegalPage, legalPages } from './legal-pages';
export { legalPages };

// Executed only during the build. GitHub Pages runs no application server.
export function render() {
  return renderToString(<App />);
}

export function renderLegal(file: string) {
  return renderToString(<LegalPage file={file} />);
}
