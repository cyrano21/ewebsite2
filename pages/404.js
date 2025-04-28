import React from 'react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: '5rem', marginBottom: '1rem', color: '#fa5252' }}>404</h1>
      <h2 style={{ marginBottom: '1rem' }}>Page non trouvée</h2>
      <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link href="/" style={{ marginTop: '2rem', color: '#0d6efd', textDecoration: 'underline' }}>
        Retour à l'accueil
      </Link>
    </div>
  );
}
