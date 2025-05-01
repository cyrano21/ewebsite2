/**
 * Utilitaire de test de responsivité pour les publicités
 * Ce module fournit des outils pour tester la responsivité des publicités
 * sur différents types d'appareils et résolutions d'écran.
 */

/**
 * Définitions des tailles d'écran standard pour les tests
 */
export const DEVICE_SIZES = {
  mobile: {
    width: 375,
    height: 667,
    name: 'Mobile (iPhone 8)',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  mobileL: {
    width: 428,
    height: 926,
    name: 'Mobile Large (iPhone 13 Pro Max)',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'Tablet (iPad)',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  laptop: {
    width: 1366,
    height: 768,
    name: 'Laptop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  desktop: {
    width: 1920,
    height: 1080,
    name: 'Desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

/**
 * Vérifie si une publicité est bien positionnée et dimensionnée pour un appareil donné
 * @param {HTMLElement} adElement - Élément DOM de la publicité
 * @param {string} deviceType - Type d'appareil (mobile, tablet, laptop, desktop)
 * @returns {Object} - Résultat du test avec problèmes éventuels
 */
export const testAdResponsiveness = (adElement, deviceType) => {
  if (!adElement || !DEVICE_SIZES[deviceType]) {
    return { 
      success: false, 
      error: !adElement ? 'Élément non trouvé' : 'Type d\'appareil invalide' 
    };
  }

  const result = {
    deviceType,
    deviceName: DEVICE_SIZES[deviceType].name,
    success: true,
    issues: []
  };

  // Récupérer les dimensions actuelles de l'élément
  const rect = adElement.getBoundingClientRect();
  
  // Tester si l'élément est visible
  if (rect.width === 0 || rect.height === 0) {
    result.success = false;
    result.issues.push({
      type: 'visibility',
      message: 'L\'élément n\'est pas visible (largeur ou hauteur à 0)'
    });
  }

  // Tester si l'élément dépasse les limites de l'écran
  const viewportWidth = DEVICE_SIZES[deviceType].width;
  if (rect.width > viewportWidth) {
    result.success = false;
    result.issues.push({
      type: 'overflow',
      message: `L'élément dépasse la largeur de l'écran (${rect.width}px > ${viewportWidth}px)`
    });
  }

  // Tester si les images sont responsives
  const images = adElement.querySelectorAll('img, video');
  images.forEach((img, index) => {
    const imgRect = img.getBoundingClientRect();
    if (imgRect.width > rect.width) {
      result.success = false;
      result.issues.push({
        type: 'image_overflow',
        message: `L'image ${index+1} dépasse la largeur du conteneur`
      });
    }
  });

  // Vérifier si le texte est lisible (estimation basée sur la taille du conteneur)
  if (deviceType === 'mobile' && rect.width < 320) {
    result.success = false;
    result.issues.push({
      type: 'readability',
      message: 'Le conteneur est trop petit pour un affichage optimal sur mobile'
    });
  }

  return result;
};

/**
 * Simule un environnement d'appareil différent
 * @param {string} deviceType - Type d'appareil (mobile, tablet, laptop, desktop)
 * @returns {Object} - Fonctions pour restaurer l'environnement
 */
export const simulateDevice = (deviceType) => {
  if (!DEVICE_SIZES[deviceType]) {
    console.error(`Type d'appareil invalide: ${deviceType}`);
    return null;
  }

  // Sauvegarde des dimensions originales
  const originalWidth = window.innerWidth;
  const originalHeight = window.innerHeight;
  const originalUserAgent = navigator.userAgent;

  // Modifier les dimensions de la fenêtre (simulation)
  Object.defineProperty(window, 'innerWidth', {
    value: DEVICE_SIZES[deviceType].width,
    writable: true
  });
  
  Object.defineProperty(window, 'innerHeight', {
    value: DEVICE_SIZES[deviceType].height,
    writable: true
  });

  // Simuler le user agent (ne fonctionne pas toujours en raison des restrictions de sécurité)
  // Cette étape est optionnelle et pourrait ne pas fonctionner dans tous les navigateurs
  try {
    Object.defineProperty(navigator, 'userAgent', {
      value: DEVICE_SIZES[deviceType].userAgent,
      writable: true
    });
  } catch (e) {
    console.warn('Impossible de modifier le user agent', e);
  }

  // Fonction pour restaurer l'environnement original
  const restore = () => {
    Object.defineProperty(window, 'innerWidth', {
      value: originalWidth,
      writable: true
    });
    
    Object.defineProperty(window, 'innerHeight', {
      value: originalHeight,
      writable: true
    });
    
    try {
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        writable: true
      });
    } catch (e) {
      console.warn('Impossible de restaurer le user agent', e);
    }
  };

  // Retourner des fonctions pour tester et restaurer
  return {
    restore,
    dimensions: {
      width: DEVICE_SIZES[deviceType].width,
      height: DEVICE_SIZES[deviceType].height
    },
    userAgent: DEVICE_SIZES[deviceType].userAgent
  };
};

/**
 * Teste automatiquement la responsivité de toutes les publicités sur la page
 * pour tous les types d'appareils
 * @returns {Object} - Résultats des tests pour chaque publicité et chaque appareil
 */
export const testAllAdsResponsiveness = () => {
  const ads = document.querySelectorAll('.ad-container');
  const results = {};

  ads.forEach((ad, index) => {
    const adId = ad.getAttribute('data-ad-id') || `ad-${index}`;
    const adType = ad.getAttribute('data-ad-type') || 'unknown';
    const adPosition = ad.getAttribute('data-ad-position') || 'unknown';
    
    results[adId] = {
      adType,
      adPosition,
      deviceTests: {}
    };

    // Tester sur chaque type d'appareil
    Object.keys(DEVICE_SIZES).forEach(deviceType => {
      const deviceEnv = simulateDevice(deviceType);
      if (deviceEnv) {
        // Déclencher un redimensionnement pour que les styles responsives s'appliquent
        window.dispatchEvent(new Event('resize'));
        
        // Attendre un petit délai pour que les styles soient appliqués
        setTimeout(() => {
          results[adId].deviceTests[deviceType] = testAdResponsiveness(ad, deviceType);
          
          // Si c'est le dernier test, restaurer l'environnement
          if (deviceType === Object.keys(DEVICE_SIZES)[Object.keys(DEVICE_SIZES).length - 1]) {
            deviceEnv.restore();
            window.dispatchEvent(new Event('resize'));
          }
        }, 100);
      }
    });
  });

  return results;
};

/**
 * Exporte les résultats de test au format JSON
 * @param {Object} results - Résultats des tests
 * @returns {string} - Résultats au format JSON
 */
export const exportTestResults = (results) => {
  return JSON.stringify(results, null, 2);
};
