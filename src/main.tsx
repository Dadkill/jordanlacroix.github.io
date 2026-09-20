import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
if (import.meta.env.PROD) {
  hydrateRoot(root, <App />);
} else if (
  ['/mentions-legales.html', '/confidentialite.html'].includes(
    location.pathname,
  )
) {
  void import('./legal-pages').then(({ LegalPage }) => {
    createRoot(root).render(<LegalPage file={location.pathname.slice(1)} />);
  });
} else {
  createRoot(root).render(<App />);
}
