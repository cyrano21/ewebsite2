// Ce fichier désactive temporairement le HMR (Hot Module Replacement) pour éviter
// les rechargements constants dans Next.js 15

if (typeof window !== 'undefined') {
  // Désactiver le HMR en définissant une fonction vide pour webpackHotUpdate
  window.__NEXT_HMR_CB = () => {};
  
  // Intercepter les demandes de mises à jour webpack
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    // Bloquer les requêtes webpack-hmr et hot-update.json
    if (
      typeof url === 'string' && 
      (url.includes('webpack-hmr') || url.includes('hot-update.json'))
    ) {
      // Retourner une promesse résolue avec une réponse vide
      return Promise.resolve(new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    // Continuer normalement pour toutes les autres requêtes
    return originalFetch(url, options);
  };
  
  console.log('✓ HMR désactivé temporairement pour éviter les rechargements constants');
}
/**
 * Ce fichier permet de désactiver temporairement le Hot Module Replacement (HMR)
 * quand il cause des problèmes de rechargement en boucle.
 */

// Ne s'exécute que côté client
if (typeof window !== 'undefined') {
  // Désactiver la fonction d'acceptation des mises à jour du HMR
  window.__NEXT_HMR_CB = {};
  
  // Stocker la méthode originale
  const originalFetch = window.fetch;
  
  // Empêcher les requêtes HMR d'être exécutées
  window.fetch = function(url, options) {
    if (typeof url === 'string' && 
        (url.includes('.hot-update.') || url.includes('webpack-hmr') || url.includes('_next/webpack-hmr'))) {
      console.log('🛑 HMR-DISABLED: Requête HMR bloquée:', url);
      
      // Retourner une promesse qui ne fait rien
      return new Promise(() => {});
    }
    return originalFetch.apply(window, arguments);
  };
  
  console.log('🛑 HMR-DISABLED: Le rechargement à chaud est temporairement désactivé.');
}

export default function disableHmr() {
  // Cette fonction peut être importée pour désactiver le HMR
  return null;
}
