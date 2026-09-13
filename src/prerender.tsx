import { renderToString } from 'react-dom/server';
import App from './App';

// Executed only during the build. GitHub Pages runs no application server.
export function render() {
  return renderToString(<App />);
}
