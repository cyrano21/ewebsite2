
import { useState, useEffect } from 'react';

/**
 * Composant d'utilitaire qui ne rend son contenu que côté client
 * pour éviter les erreurs d'hydratation React
 */
export default function ClientOnly({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return fallback;
  }

  return children;
}
