// Utilitaire de débogage pour les problèmes de HMR (Hot Module Replacement)
// Capture l'état précis avant et pendant les rechargements

// Vérifie si nous sommes dans un environnement navigateur
if (typeof window !== 'undefined') {
  console.log('🔍 HMR-DEBUG: Initialisation de l\'outil de diagnostic des rechargements');

  // Structure de données pour le suivi des rechargements
  if (!window.__hmrDebug) {
    window.__hmrDebug = {
      lastReload: null,
      reloadCount: 0,
      reloadHistory: [],
      maxHistoryLength: 20,
      lastErrors: [],
      lastWarnings: [],
      networkRequests: [],
      domMutationCount: 0,
      eventSource: null,
      webpackHotUpdates: [],
      failedModules: []
    };
  }

  // Test spécifique de connexion WebSocket pour Next.js
  try {
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
      const socket = new originalWebSocket(url, protocols);
      
      if (url.includes('webpack-hmr') || url.includes('_next/webpack-hmr')) {
        console.log(`🔌 HMR-DEBUG: WebSocket connexion établie à ${url}`);
        
        socket.addEventListener('open', () => {
          console.log('🔌 HMR-DEBUG: WebSocket connexion ouverte');
        });
        
        socket.addEventListener('error', (error) => {
          console.error('🔌 HMR-DEBUG: Erreur WebSocket', error);
          window.__hmrDebug.lastErrors.push({
            time: new Date().toISOString(),
            type: 'websocket-error',
            message: 'Erreur de WebSocket HMR'
          });
        });
        
        socket.addEventListener('close', (event) => {
          console.log(`🔌 HMR-DEBUG: WebSocket fermée (code: ${event.code}, reason: ${event.reason})`);
        });
      }
      
      return socket;
    };
  } catch (e) {
    console.warn('⚠️ HMR-DEBUG: Impossible de surveiller les WebSockets', e);
  }

  // =========== CAPTURE DES ERREURS CONSOLE ==========
  // Intercepter les logs pour capturer les erreurs
  const originalConsole = {};
  ['error', 'warn', 'info', 'log'].forEach(method => {
    originalConsole[method] = console[method];
    console[method] = function(...args) {
      // Convertir en texte pour analyse
      const text = args.map(arg => {
        try {
          return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
        } catch (e) {
          return String(arg);
        }
      }).join(' ');
      
      // Stocker les erreurs et avertissements
      if (method === 'error') {
        window.__hmrDebug.lastErrors.push({
          time: new Date().toISOString(),
          message: text.slice(0, 800) // Limiter la taille
        });
        // Garder les 10 dernières erreurs
        if (window.__hmrDebug.lastErrors.length > 10) {
          window.__hmrDebug.lastErrors.shift();
        }
        
        // Analyser les erreurs Next.js et React spécifiques
        if (
          text.includes('Hydration') || 
          text.includes('Expected server HTML') ||
          text.includes('<Link>') ||
          text.includes('Minified React error') ||
          text.includes('call') ||
          text.includes('ChunkLoadError') ||
          text.includes('webpack-hmr') ||
          text.includes('webpack.hot') ||
          text.includes('Failed to fetch')
        ) {
          originalConsole.warn('⚠️ ERREUR CRITIQUE DÉTECTÉE:', text);
          
          // Sauvegarder cette erreur comme cause potentielle du rechargement
          try {
            localStorage.setItem('hmr-debug-last-error', text.slice(0, 1000));
          } catch (e) {}
        }
        
        // Capturer spécifiquement les erreurs de chargement webpack
        if (text.includes('ChunkLoadError') || text.includes('webpack') || text.includes('hot-update.json')) {
          window.__hmrDebug.failedModules.push({
            time: new Date().toISOString(),
            message: text
          });
          
          // Stocker dans LocalStorage pour vérification après rechargement
          try {
            localStorage.setItem('hmr-debug-failed-modules', JSON.stringify(window.__hmrDebug.failedModules.slice(-5)));
          } catch (e) {}
        }
      } else if (method === 'warn') {
        window.__hmrDebug.lastWarnings.push({
          time: new Date().toISOString(),
          message: text.slice(0, 500)
        });
        if (window.__hmrDebug.lastWarnings.length > 10) {
          window.__hmrDebug.lastWarnings.shift();
        }
      }
      
      // Log des messages liés au HMR avec analyse améliorée
      if (
        text.includes('Fast Refresh') || 
        text.includes('HMR') || 
        text.includes('webpack') || 
        text.includes('refresh') ||
        text.includes('hot-update') ||
        text.includes('had to perform a full reload')
      ) {
        originalConsole.warn('🔄 EVENT HMR:', text);
        
        // Stocker les webpack hot updates spécifiquement
        if (text.includes('hot-update') || text.includes('webpack.hot')) {
          window.__hmrDebug.webpackHotUpdates.push({
            time: new Date().toISOString(),
            message: text.slice(0, 500)
          });
          
          // Limiter la liste à 30 entrées
          if (window.__hmrDebug.webpackHotUpdates.length > 30) {
            window.__hmrDebug.webpackHotUpdates.shift();
          }
        }
        
        // Sauvegarder le message HMR avec timestamp
        try {
          const hmrMsgs = JSON.parse(localStorage.getItem('hmr-debug-hmr-messages') || '[]');
          hmrMsgs.push({ time: new Date().toISOString(), message: text.slice(0, 500) });
          if (hmrMsgs.length > 20) hmrMsgs.shift();
          localStorage.setItem('hmr-debug-hmr-messages', JSON.stringify(hmrMsgs));
        } catch (e) {}
      }

      // Appeler la fonction d'origine
      return originalConsole[method].apply(console, args);
    };
  });

  // =========== CAPTURE DES RECHARGEMENTS ==========
  // Intercepte les événements de rechargement sans modifier l'objet natif
  const originalReload = window.location.reload.bind(window.location);
  
  // Créer une fonction wrapper au lieu de remplacer la méthode native
  const reloadInterceptor = function(...args) {
    const now = new Date();
    const lastReload = window.__hmrDebug.lastReload;
    const path = window.location.pathname;
    const stack = new Error().stack || '';
    
    // Vérifier l'état des ressources webpack
    const hotUpdateErrors = [];
    try {
      const networkEntries = window.performance.getEntriesByType('resource');
      for (const entry of networkEntries) {
        if (entry.name && (
            entry.name.includes('.hot-update.') || 
            entry.name.includes('webpack-hmr') ||
            entry.name.includes('webpack.hot') ||
            entry.name.includes('_next/webpack-hmr')
          )) {
          hotUpdateErrors.push({
            resource: entry.name,
            duration: entry.duration,
            status: entry.responseStatus
          });
        }
      }
    } catch (e) {
      originalConsole.warn('⚠️ Impossible d\'analyser les ressources réseau:', e);
    }
    
    // Collecter des infos sur l'état actuel
    const diagnosticInfo = {
      url: window.location.href,
      timestamp: now.toISOString(),
      timeSinceLastReloadMs: lastReload ? (now - lastReload) : null,
      stackTrace: stack.split('\n').slice(0, 10).map(line => line.trim()),
      recentErrors: window.__hmrDebug.lastErrors.slice(-3),
      recentWarnings: window.__hmrDebug.lastWarnings.slice(-2),
      domElementCount: document.querySelectorAll('*').length,
      activeElementInfo: document.activeElement ? {
        tagName: document.activeElement.tagName,
        id: document.activeElement.id,
        className: document.activeElement.className
      } : null,
      visibleRoute: window.location.pathname,
      webpackHotUpdates: window.__hmrDebug.webpackHotUpdates.slice(-5),
      failedModules: window.__hmrDebug.failedModules.slice(-3),
      hotUpdateResources: hotUpdateErrors
    };
    
    // Détecter les boucles de rechargement
    if (lastReload) {
      const diffMs = now - lastReload;
      const diffSeconds = diffMs / 1000;

      // Si < 3 secondes entre rechargements = potentielle boucle
      if (diffSeconds < 3) {
        window.__hmrDebug.reloadCount++;
        
        if (window.__hmrDebug.reloadCount >= 2) {
          // Analyser pourquoi on est dans une boucle
          const reloadLoopInfo = {
            loopCount: window.__hmrDebug.reloadCount,
            averageIntervalMs: window.__hmrDebug.reloadHistory.length > 1 ? 
              window.__hmrDebug.reloadHistory.slice(-3).reduce((sum, item) => sum + (item.timeSinceLastReloadMs || 0), 0) / 3 : 
              null,
            routeInLoop: path,
            latestErrors: window.__hmrDebug.lastErrors.slice(-5),
            webpackHotUpdates: window.__hmrDebug.webpackHotUpdates.slice(-5),
            failedModules: window.__hmrDebug.failedModules.slice(-3),
            lastComponentRendered: document.querySelector('[data-last-rendered]')?.getAttribute('data-component') || 'unknown',
            hotUpdateResources: hotUpdateErrors
          };
          
          originalConsole.error(`⚠️ BOUCLE DE RECHARGEMENT DÉTECTÉE: ${window.__hmrDebug.reloadCount} rechargements en moins de 3 secondes.`);
          originalConsole.warn('📊 ANALYSE DE LA BOUCLE:', reloadLoopInfo);
          
          // Sauvegarder pour après le rechargement
          try {
            localStorage.setItem('hmr-debug-loop-info', JSON.stringify(reloadLoopInfo));
          } catch (e) {}
          
          // Enregistrer les problèmes détectés
          const potentialIssues = [];
          
          if (window.__hmrDebug.failedModules.length > 0) {
            potentialIssues.push({
              type: 'failed-modules',
              description: 'Modules webpack qui ont échoué à charger',
              count: window.__hmrDebug.failedModules.length
            });
          }
          
          if (hotUpdateErrors.length > 0) {
            potentialIssues.push({
              type: 'hot-update-errors',
              description: 'Erreurs de ressources Hot Update',
              count: hotUpdateErrors.length
            });
          }
          
          try {
            localStorage.setItem('hmr-debug-potential-issues', JSON.stringify(potentialIssues));
          } catch (e) {}
        }
      } else {
        // Pas une boucle - réinitialiser le compteur
        window.__hmrDebug.reloadCount = 1;
      }
    } else {
      window.__hmrDebug.reloadCount = 1;
    }

    // Enregistrer l'historique des rechargements
    window.__hmrDebug.reloadHistory.push({
      time: now.toISOString(),
      pathname: path,
      timeSinceLastReloadMs: lastReload ? now - lastReload : null,
      info: diagnosticInfo
    });

    // Limiter l'historique
    if (window.__hmrDebug.reloadHistory.length > window.__hmrDebug.maxHistoryLength) {
      window.__hmrDebug.reloadHistory.shift();
    }

    // Mettre à jour timestamp
    window.__hmrDebug.lastReload = now;

    // Log le rechargement avec plus d'informations
    originalConsole.log(`🔄 RECHARGEMENT à ${now.toISOString()} sur ${path}`);
    originalConsole.info(`📊 Infos de rechargement: ${hotUpdateErrors.length} ressources HMR, ${window.__hmrDebug.failedModules.length} modules en échec`);
    
    // Sauvegarder état pour après rechargement
    try {
      localStorage.setItem('hmr-debug-data', JSON.stringify(window.__hmrDebug));
      localStorage.setItem('hmr-debug-last-reload-time', now.toISOString());
      localStorage.setItem('hmr-debug-last-reload-path', path);
      localStorage.setItem('hmr-debug-reload-diagnostic', JSON.stringify(diagnosticInfo));
    } catch (e) {}

    // Appeler la fonction originale
    return originalReload(...args);
  };
  
  // Observer les rechargements via la méthode addEventListener
  if (typeof window.performance !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      // Pour Next.js, on voudrait être plus proactif dans la détection des rechargements
      reloadInterceptor();
    });
  }
  
  // Patch history API pour détecter les changements de route qui peuvent déclencher des rechargements
  try {
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      const result = originalPushState.apply(this, arguments);
      
      // Enregistrer le changement de route qui pourrait déclencher des rechargements
      console.log(`🔍 HMR-DEBUG: Navigation détectée vers ${arguments[2]}`);
      
      return result;
    };
  } catch (e) {
    console.warn('⚠️ HMR-DEBUG: Impossible de surveiller history API', e);
  }
  // Stockage de l'original fetch
  const originalFetch = window.fetch;
  
  // Patch sans assigner directement à window.fetch
  const fetchInterceptor = function(url, options) {
    // Si c'est une requête liée au HMR
    if (typeof url === 'string') {
      // Surveiller toutes les requêtes HMR et webpack
      if (url.includes('webpack-hmr') || 
          url.includes('.hot-update.') || 
          url.includes('_next/webpack-hmr') ||
          url.includes('webpack.hot') ||
          url.includes('__webpack_hmr')) {
        
        console.log(`🌐 HMR-DEBUG: Requête fetch HMR interceptée: ${url}`);
        
        // Stocker cette requête pour analyse
        window.__hmrDebug.networkRequests.push({
          time: new Date().toISOString(),
          type: 'hmr-fetch',
          url: url,
          method: options?.method || 'GET'
        });
        
        // Limiter la taille des requêtes stockées
        if (window.__hmrDebug.networkRequests.length > 30) {
          window.__hmrDebug.networkRequests.shift();
        }
        
        // Surveiller le résultat de la requête HMR
        return originalFetch.apply(window, arguments)
          .then(response => {
            // Vérifier si la requête a échoué
            if (!response.ok) {
              console.warn(`⚠️ HMR-DEBUG: Échec de requête HMR (${response.status}): ${url}`);
              window.__hmrDebug.lastErrors.push({
                time: new Date().toISOString(),
                type: 'hmr-fetch-error',
                url: url,
                status: response.status
              });
            }
            return response;
          })
          .catch(error => {
            console.error(`❌ HMR-DEBUG: Erreur de fetch HMR: ${url}`, error);
            window.__hmrDebug.lastErrors.push({
              time: new Date().toISOString(),
              type: 'hmr-fetch-exception',
              url: url,
              message: error.message
            });
            throw error;
          });
      }
    }
    
    // Comportement normal pour les requêtes non-HMR
    return originalFetch.apply(window, arguments);
  };
  
  // Utiliser un proxy pour intercepter fetch sans remplacer la méthode native
  try {
    // Intercepter fetch pour toutes les requêtes HMR
    window.fetch = function() {
      return fetchInterceptor.apply(this, arguments);
    };
    console.log("✅ HMR-DEBUG: Surveillance fetch configurée");
  } catch (e) {
    console.warn("⚠️ HMR-DEBUG: Erreur lors de la configuration de la surveillance fetch:", e);
  }
  
  // Utiliser aussi l'API Performance pour surveiller les requêtes réseau
  if (window.PerformanceObserver) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.name && (
              entry.name.includes('.hot-update.') || 
              entry.name.includes('webpack-hmr') ||
              entry.name.includes('_next/webpack-hmr')
            )) {
            
            const initiatorType = entry.initiatorType || 'unknown';
            
            // Analyser les requêtes hot-update
            console.log(`📊 HMR-DEBUG: Ressource HMR chargée (${initiatorType}): ${entry.name}`);
            
            // Vérifier si l'entrée a un statut HTTP pour détecter les erreurs 404
            if ('responseStatus' in entry && entry.responseStatus !== 200) {
              console.warn(`⚠️ HMR-DEBUG: Statut HTTP ${entry.responseStatus} pour ${entry.name}`);
              
              window.__hmrDebug.lastErrors.push({
                time: new Date().toISOString(),
                type: 'resource-error',
                url: entry.name,
                status: entry.responseStatus
              });
            }
          }
        });
      });
      
      // Observer les ressources réseau
      observer.observe({ entryTypes: ['resource'] });
      console.log("✅ HMR-DEBUG: Surveillance des ressources réseau configurée");
    } catch (e) {
      console.warn("⚠️ HMR-DEBUG: Erreur lors de la configuration de PerformanceObserver:", e);
    }
  }

  // Surveillons également les messages webSocket (utilisés par le HMR)
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (type === 'message') {
      const wrappedListener = function(event) {
        if (event.data && typeof event.data === 'string') {
          try {
            // Essayer de parser le JSON
            let data;
            try {
              data = JSON.parse(event.data);
            } catch (e) {
              // Si ce n'est pas un JSON, vérifier simplement si c'est lié au HMR
              if (event.data.includes('webpack') || 
                  event.data.includes('hot') || 
                  event.data.includes('hmr') || 
                  event.data.includes('update')) {
                console.log('📶 HMR-DEBUG: Message WebSocket non-JSON:', event.data.slice(0, 200));
              }
              return listener.apply(this, arguments);
            }
            
            // Analyser les données JSON WebSocket
            if (data.type && (
                data.type.includes('webpack') || 
                data.action === 'built' || 
                data.action === 'building' ||
                data.type === 'hash' ||
                data.type === 'invalid' ||
                data.type === 'still-ok' ||
                data.type === 'hmr'
              )) {
              console.log('📶 HMR-DEBUG: Événement WebSocket HMR:', data);
              
              // Stocker cet événement pour analyse
              window.__hmrDebug.webpackHotUpdates.push({
                time: new Date().toISOString(),
                type: data.type || data.action,
                data: data
              });
              
              // Limiter la taille
              if (window.__hmrDebug.webpackHotUpdates.length > 30) {
                window.__hmrDebug.webpackHotUpdates.shift();
              }
              
              // Vérifier les erreurs HMR
              if (data.errors && data.errors.length > 0) {
                console.error('❌ HMR-DEBUG: Erreurs webpack détectées:', data.errors);
                
                window.__hmrDebug.failedModules.push({
                  time: new Date().toISOString(),
                  type: 'webpack-errors',
                  errors: data.errors
                });
                
                // Stocker les erreurs pour analyse après rechargement
                try {
                  localStorage.setItem('hmr-debug-webpack-errors', JSON.stringify(data.errors));
                } catch (e) {}
              }
            }
          } catch (e) {
            // Erreur de traitement, ignorer
          }
        }
        return listener.apply(this, arguments);
      };
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    return originalAddEventListener.apply(this, arguments);
  };
  
  // Afficher un résumé après le chargement de la page
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Vérifier s'il y a des données de débogage du chargement précédent
      try {
        const lastReloadTime = localStorage.getItem('hmr-debug-last-reload-time');
        if (lastReloadTime) {
          const lastReloadPath = localStorage.getItem('hmr-debug-last-reload-path') || 'unknown';
          console.log(`📊 HMR-DEBUG: Dernier rechargement à ${lastReloadTime} sur ${lastReloadPath}`);
          
          // Vérifier s'il y avait des problèmes
          const potentialIssues = JSON.parse(localStorage.getItem('hmr-debug-potential-issues') || '[]');
          if (potentialIssues.length > 0) {
            console.warn('⚠️ HMR-DEBUG: Problèmes potentiels détectés:', potentialIssues);
          }
          
          // Vérifier les erreurs webpack
          const webpackErrors = JSON.parse(localStorage.getItem('hmr-debug-webpack-errors') || '[]');
          if (webpackErrors.length > 0) {
            console.error('❌ HMR-DEBUG: Erreurs webpack détectées:', webpackErrors);
          }
        }
      } catch (e) {
        console.warn('⚠️ HMR-DEBUG: Erreur lors de la récupération des données de débogage:', e);
      }
    }, 2000);
  });

  console.log('✅ HMR-DEBUG: Surveillance complète du rechargement activée');
}

// Fonctions utilitaires pour aider à résoudre les problèmes HMR courants
window.__hmrDebugGetStatus = function() {
  if (!window.__hmrDebug) return 'Outil de débogage HMR non initialisé';
  
  return {
    rechargements: window.__hmrDebug.reloadCount,
    derniersErreurs: window.__hmrDebug.lastErrors.slice(-5),
    updatesHMR: window.__hmrDebug.webpackHotUpdates.slice(-5),
    modulesFailed: window.__hmrDebug.failedModules.slice(-3),
    requêtesRéseau: window.__hmrDebug.networkRequests.slice(-5)
  };
};

// Fonction pour vérifier si les WebSockets fonctionnent
window.__hmrCheckWebsockets = function() {
  const socketUrl = document.location.origin.replace(/^http/, 'ws') + '/_next/webpack-hmr';
  console.log(`🔍 HMR-DEBUG: Test de connexion WebSocket à ${socketUrl}`);
  
  try {
    const socket = new WebSocket(socketUrl);
    
    socket.onopen = () => {
      console.log('✅ HMR-DEBUG: Connexion WebSocket établie avec succès!');
      setTimeout(() => socket.close(), 2000);
    };
    
    socket.onerror = (error) => {
      console.error('❌ HMR-DEBUG: Erreur lors de la connexion WebSocket:', error);
    };
    
    socket.onclose = (event) => {
      console.log(`🔍 HMR-DEBUG: Connexion WebSocket fermée (code: ${event.code})`);
    };
    
    return 'Test de connexion WebSocket lancé...';
  } catch (e) {
    console.error('❌ HMR-DEBUG: Exception lors du test WebSocket:', e);
    return `Erreur: ${e.message}`;
  }
};

export default function setupHMRDebug() {
  // Cette fonction peut être importée dans _app.js
  if (typeof window !== 'undefined') {
    console.log('🔧 HMR-DEBUG: Configuration active dans _app.js');
    
    // Vérifier si nous venons de recharger
    setTimeout(() => {
      const lastReloadTime = localStorage.getItem('hmr-debug-last-reload-time');
      if (lastReloadTime) {
        const now = new Date();
        const lastReload = new Date(lastReloadTime);
        const diffSeconds = (now - lastReload) / 1000;
        
        if (diffSeconds < 5) {
          console.log(`🔄 HMR-DEBUG: Page rechargée il y a ${diffSeconds.toFixed(2)} secondes`);
        }
      }
    }, 1000);
  }
  return null;
}
