/**
 * Service de suivi des performances des publicités
 */

/**
 * Enregistre une impression de publicité
 * @param {Object} adData - Données de la publicité
 * @param {string} adData.id - Identifiant de la publicité
 * @param {string} adData.position - Position de la publicité
 * @param {string} adData.type - Type de publicité
 * @param {string} adData.page - Page où la publicité est affichée
 * @returns {Promise<void>}
 */
export const trackImpression = async (adData) => {
  try {
    const response = await fetch('/api/advertisements/analytics/impression', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        advertisementId: adData.id,
        position: adData.position,
        type: adData.type,
        page: adData.page,
        timestamp: new Date().toISOString(),
        deviceType: getDeviceType(),
        viewportSize: getViewportSize()
      }),
    });
    
    if (!response.ok) {
      console.error('Erreur lors du suivi de l&apos;impression:', await response.text());
    }
  } catch (error) {
    console.error('Erreur lors du suivi de l&apos;impression:', error);
  }
};

/**
 * Enregistre un clic sur une publicité
 * @param {Object} adData - Données de la publicité
 * @param {string} adData.id - Identifiant de la publicité
 * @param {string} adData.position - Position de la publicité
 * @param {string} adData.type - Type de publicité
 * @param {string} adData.page - Page où la publicité est affichée
 * @returns {Promise<void>}
 */
export const trackClick = async (adData) => {
  try {
    const response = await fetch('/api/advertisements/analytics/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        advertisementId: adData.id,
        position: adData.position,
        type: adData.type,
        page: adData.page,
        timestamp: new Date().toISOString(),
        deviceType: getDeviceType(),
        viewportSize: getViewportSize()
      }),
    });
    
    if (!response.ok) {
      console.error('Erreur lors du suivi du clic:', await response.text());
    }
  } catch (error) {
    console.error('Erreur lors du suivi du clic:', error);
  }
};

/**
 * Détermine le type d'appareil utilisé
 * @returns {string} - 'mobile', 'tablet' ou 'desktop'
 */
const getDeviceType = () => {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(userAgent);
  const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent);
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

/**
 * Récupère la taille de la fenêtre d'affichage
 * @returns {Object} - Largeur et hauteur de la fenêtre
 */
const getViewportSize = () => {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

/**
 * Calcule le temps de visibilité d'une publicité
 * @param {string} adId - Identifiant de la publicité
 * @param {number} startTime - Temps de début de la visibilité
 * @returns {Promise<void>}
 */
export const trackViewDuration = async (adData, startTime) => {
  const viewDuration = Date.now() - startTime;
  
  try {
    const response = await fetch('/api/advertisements/analytics/viewDuration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        advertisementId: adData.id,
        position: adData.position,
        type: adData.type,
        page: adData.page,
        duration: viewDuration,
        timestamp: new Date().toISOString(),
        deviceType: getDeviceType(),
        viewportSize: getViewportSize()
      }),
    });
    
    if (!response.ok) {
      console.error('Erreur lors du suivi de la durée de visibilité:', await response.text());
    }
  } catch (error) {
    console.error('Erreur lors du suivi de la durée de visibilité:', error);
  }
};
