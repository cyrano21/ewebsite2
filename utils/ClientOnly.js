
import { useEffect, useState } from 'react';

/**
 * Un composant qui ne rend son contenu que côté client pour éviter les problèmes d'hydratation.
 * À utiliser pour les composants qui utilisent des APIs uniquement disponibles côté client.
 */
export default function ClientOnly({ children, fallback = null, delay = 0 }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Utiliser un petit délai pour s'assurer que l'hydratation est complète
    const timer = setTimeout(() => {
      setIsClient(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);

  // Renvoie fallback (ou null) pendant le rendu côté serveur
  if (!isClient) {
    return fallback;
  }

  return children;
}

/**
 * Un wrapper HOC pour transformer n'importe quel composant en version client-only
 */
export function withClientOnly(Component, fallback = null, delay = 0) {
  return function WithClientOnly(props) {
    return (
      <ClientOnly fallback={fallback} delay={delay}>
        <Component {...props} />
      </ClientOnly>
    );
  };
}
