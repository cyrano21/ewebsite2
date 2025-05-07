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