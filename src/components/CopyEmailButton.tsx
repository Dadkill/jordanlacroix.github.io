import { useState } from 'react';
import { Copy } from 'lucide-react';
import { useHydrated } from '../lib/useHydrated';

export default function CopyEmailButton() {
  const ready = useHydrated();
  const [status, setStatus] = useState('');

  async function copyAddress() {
    setStatus('');
    try {
      await navigator.clipboard.writeText('contact@jordanlacroix.fr');
      setStatus('Adresse copiée.');
    } catch {
      setStatus('Copie indisponible. Sélectionnez l’adresse ci-dessus.');
    }
  }

  return (
    <div className="copy-email">
      {ready && (
        <button
          type="button"
          className="copy-email-button"
          onClick={copyAddress}
        >
          <Copy size={17} aria-hidden="true" /> Copier l’adresse
        </button>
      )}
      <output
        className="copy-email-status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status}
      </output>
    </div>
  );
}
