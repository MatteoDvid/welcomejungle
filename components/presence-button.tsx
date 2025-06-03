'use client';

import { useState } from 'react';

export default function PresenceButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handlePresence() {
    setStatus('loading');
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwnOLnrmwfDTuH0O1nKtNH0FQ34-Y4JTEiZCtHllxGp-DoSPbqPEOjBjupepO0DiQo/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: 'Alice',
          nom: 'Martin',
          email: 'alice@company.com',
          role: 'Employée',
        }),
      });

      const data = await response.json();
      console.log('✅ Réponse :', data);
      setStatus('success');
    } catch (error) {
      console.error('❌ Erreur :', error);
      setStatus('error');
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handlePresence}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Marquer comme présent
      </button>

      {status === 'loading' && <p>⏳ Envoi en cours...</p>}
      {status === 'success' && <p className="text-green-600">✅ Présence enregistrée !</p>}
      {status === 'error' && <p className="text-red-600">❌ Une erreur est survenue.</p>}
    </div>
  );
}
