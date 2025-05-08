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
      eventSource: null
    };
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
        
        // Analyser les erreurs spécifiques
        if (
          text.includes('Hydration') || 
          text.includes('Expected server HTML') ||
          text.includes('<Link>') ||
          text.includes('Minified React error') ||
          text.includes('call')
        ) {
          originalConsole.warn('⚠️ ERREUR CRITIQUE DÉTECTÉE:', text);
          
          // Sauvegarder cette erreur comme cause potentielle du rechargement
          try {
            localStorage.setItem('hmr-debug-last-error', text.slice(0, 1000));
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
      
      // Log des messages liés au HMR
      if (
        text.includes('Fast Refresh') || 
        text.includes('HMR') || 
        text.includes('webpack') || 
        text.includes('refresh')
      ) {
        originalConsole.warn('🔄 EVENT HMR:', text);
        // Sauvegarder le message HMR
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
  // Intercepte les événements de rechargement
  const originalReload = window.location.reload;
  window.location.reload = function(...args) {
    const now = new Date();
    const lastReload = window.__hmrDebug.lastReload;
    const path = window.location.pathname;
    const stack = new Error().stack || '';
    
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
      visibleRoute: window.location.pathname
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
            lastComponentRendered: document.querySelector('[data-last-rendered]')?.getAttribute('data-component') || 'unknown',
          };
          
          originalConsole.error(`⚠️ BOUCLE DE RECHARGEMENT DÉTECTÉE: ${window.__hmrDebug.reloadCount} rechargements en moins de 3 secondes.`);
          originalConsole.warn('📊 ANALYSE DE LA BOUCLE:', reloadLoopInfo);
          
          // Sauvegarder pour après le rechargement
          try {
            localStorage.setItem('hmr-debug-loop-info', JSON.stringify(reloadLoopInfo));
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

    // Log le rechargement
    originalConsole.log(`🔄 RECHARGEMENT à ${now.toISOString()} sur ${path}`);
    
    // Sauvegarder état pour après rechargement
    try {
      localStorage.setItem('hmr-debug-data', JSON.stringify(window.__hmrDebug));
      localStorage.setItem('hmr-debug-last-reload-time', now.toISOString());
      localStorage.setItem('hmr-debug-last-reload-path', path);
    } catch (e) {}

    // Appeler la fonction originale
    return originalReload.apply(this, args);
  };
  window.fetch = function(url, options) {
    // Si c'est une requête liée au HMR
    if (typeof url === 'string' && url.includes('webpack-hmr') || url.includes('.hot-update.')) {
      console.log(`🌐 HMR-DEBUG: Requête fetch interceptée: ${url}`);
    }
    return originalFetch.apply(this, arguments);
  };

  // Surveillons également les messages webSocket (utilisés par le HMR)
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (type === 'message') {
      const wrappedListener = function(event) {
        if (event.data && typeof event.data === 'string') {
          try {
            const data = JSON.parse(event.data);
            if (data.type && (data.type.includes('webpack') || data.action === 'built' || data.action === 'building')) {
              console.log('📶 HMR-DEBUG: Événement WebSocket HMR:', data);
            }
          } catch (e) {
            // Pas un JSON, ignorer
          }
        }
        return listener.apply(this, arguments);
      };
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    return originalAddEventListener.apply(this, arguments);
  };

  console.log('✅ HMR-DEBUG: Surveillance du rechargement activée');
}

export default function setupHMRDebug() {
  // Cette fonction peut être importée dans _app.js
  return null;
}
