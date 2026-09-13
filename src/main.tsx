import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
if (import.meta.env.PROD) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
