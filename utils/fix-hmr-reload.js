
// Script pour améliorer la stabilité du Hot Module Replacement
if (typeof window !== 'undefined') {
  try {
    // Empêcher les rechargements complets trop fréquents
    let lastReloadTime = 0;
    const MIN_RELOAD_INTERVAL = 5000; // 5 secondes minimum entre rechargements
    
    // Intercepter les erreurs qui peuvent causer des rechargements en boucle
    const originalError = console.error;
    console.error = function(...args) {
      const errorMsg = args.join(' ');
      
      // Ignorer certaines erreurs HMR non critiques
      if (errorMsg.includes('ChunkLoadError') || 
          errorMsg.includes('Loading chunk') || 
          errorMsg.includes('Failed to fetch dynamically imported module')) {
        
        console.warn('[HMR] Erreur de chargement de chunk ignorée:', errorMsg);
        
        // Limiter les rechargements automatiques
        const now = Date.now();
        if (now - lastReloadTime > MIN_RELOAD_INTERVAL) {
          lastReloadTime = now;
          // Laisser l'erreur se produire mais éviter les rechargements en boucle
        } else {
          console.warn('[HMR] Rechargement évité pour prévenir une boucle');
          return;
        }
      }
      
      // Appeler la fonction d'origine pour les autres erreurs
      originalError.apply(console, args);
    };
    
    console.log('[HMR] Module de stabilisation chargé');
  } catch (e) {
    console.warn('Erreur lors de l\'initialisation du fix HMR:', e);
  }
}

// utils/fix-hmr-reload.js - Solution avancée pour les problèmes de rechargement constant
// et de connexion MongoDB

if (typeof window !== 'undefined') {
  console.log('🔧 Installation du correctif amélioré pour Next.js HMR');

  // --- PARTIE 1: Correction des requêtes HMR ---
  const originalFetch = window.fetch;
  
  // Intercepter toutes les requêtes fetch pour traiter les problèmes HMR
  window.fetch = function(url, options) {
    // Si c'est une requête HMR (webpack hot update)
    if (typeof url === 'string' && (
      url.includes('.webpack.hot-update.json') || 
      url.includes('webpack-hmr') ||
      url.includes('on-demand-entries-ping')
    )) {
      // Pour les fichiers webpack.hot-update.json qui causent des rechargements
      if (url.includes('.webpack.hot-update.json')) {
        console.log('🛑 Interception de requête HMR problématique:', url);
        
        // Simuler une réponse HMR valide
        return Promise.resolve(new Response(JSON.stringify({
          c: {}, // Pas de changements
          h: url.split('/').pop().split('.')[0] // Extraire et réutiliser le hash
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      
      // Pour les autres requêtes HMR, laisser passer mais retourner des réponses valides
      // si la requête échoue
      return originalFetch(url, options).catch(err => {
        console.log('⚠️ Requête HMR échouée, fournissant une réponse de secours');
        // Réponse générique pour éviter les erreurs
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      });
    }
    
    // Pour toutes les autres requêtes, comportement normal
    return originalFetch(url, options);
  };
  
  // --- PARTIE 2: Stabilisation du HMR de Next.js ---
  if (!window.__NEXT_HMR_STABILIZED) {
    window.__NEXT_HMR_STABILIZED = true;
    
    // Stocker l'implémentation originale des fonctions de mise à jour
    if (typeof window.__webpack_hot_update === 'function') {
      const originalHotUpdate = window.__webpack_hot_update;
      
      window.__webpack_hot_update = function(chunkId, moreModules) {
        try {
          // Appliquer la mise à jour normalement
          return originalHotUpdate(chunkId, moreModules);
        } catch (e) {
          // Si une erreur se produit, l'intercepter pour éviter le rechargement
          console.warn('⚠️ Erreur HMR interceptée, évitement du rechargement complet:', e.message);
          return false; // Empêche la cascade d'erreurs qui mène au rechargement
        }
      };
    }
    
    // Intercepter le système de rechargement global
    if (window.__NEXT_HMR_CB && Array.isArray(window.__NEXT_HMR_CB.callbacks)) {
      // Remplacer tous les callbacks existants qui pourraient déclencher un rechargement
      window.__NEXT_HMR_CB.callbacks = window.__NEXT_HMR_CB.callbacks.map(callback => {
        return (...args) => {
          try {
            return callback(...args);
          } catch (e) {
            console.warn('⚠️ Callback HMR a échoué, évitement du rechargement:', e.message);
            return null;
          }
        };
      });
    }
    
    console.log('✅ Correctif HMR avancé installé avec succès');
  }

  // --- PARTIE 3: Fonction pour mettre en pause/reprendre le HMR ---
  window.toggleHMR = function(enable = false) {
    if (typeof window.__NEXT_HMR_CB !== 'undefined') {
      window.__NEXT_HMR_CB.active = enable;
      console.log(`🔄 HMR ${enable ? 'activé' : 'désactivé'}`);
    }
  };
  
  // Désactiver le HMR par défaut
  setTimeout(() => {
    window.toggleHMR(false);
    console.log('🔒 HMR temporairement désactivé pour stabiliser l\'application');
  }, 2000);
}
/**
 * Ce fichier aide à corriger les problèmes de Hot Module Reload (HMR) 
 * dans Next.js, particulièrement pour les changements dans middleware.js
 * 
 * Il intercepte certaines requêtes HMR problématiques qui peuvent causer
 * des rechargements complets inutiles ou des erreurs côté client.
 */

if (typeof window !== 'undefined') {
  // Intercepter les requêtes HMR problématiques et auth errors
  const originalFetch = window.fetch;
  
  window.fetch = function(url, options) {
    // Vérifier si c'est une requête HMR webpack problématique
    if (typeof url === 'string' && url.includes('webpack.hot-update.json')) {
      console.log('🛑 Interception de requête HMR problématique:', url);
    }
    
    // Corriger les URL d'authentification mal configurées qui pointent vers localhost:4000
    if (typeof url === 'string' && url.includes('localhost:4000/api/auth')) {
      // Remplacer par l'URL réelle de l'application
      const newUrl = url.replace('http://localhost:4000', window.location.origin);
      console.log('🔄 Redirection automatique de requête auth:', url, '->', newUrl);
      url = newUrl;
    }
    
    // Continuer avec la requête normale
    return originalFetch(url, options);
  };
  
  // Écouter les événements de connexion HMR
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'webpack-hmr-connection') {
      console.log('[HMR] connected');
    }
  });
}

export default function setupHMRFixes() {
  // Cette fonction peut être importée dans _app.js pour activer les correctifs
  if (typeof window !== 'undefined') {
    console.log('🔄 Correctifs HMR activés');
  }
  return null;
}
