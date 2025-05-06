// utils/deviceDetect.js
import { useState, useEffect } from 'react';

// Définition des tailles d'écran pour la détection de l'appareil
const SIZE_MOBILE = 576;
const SIZE_TABLET = 992;

/**
 * Détecte le type d'appareil basé sur l'agent utilisateur
 */
export const getDeviceTypeFromUA = () => {
  const ua = typeof window !== 'undefined' ? navigator.userAgent : '';

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }

  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
};

/**
 * Détecte le type d'appareil basé sur la largeur de l'écran
 */
export const getDeviceTypeFromWidth = (width) => {
  if (width < SIZE_MOBILE) {
    return 'mobile';
  } else if (width < SIZE_TABLET) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

/**
 * Hook personnalisé pour obtenir et surveiller le type d'appareil
 */
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState(() => {
    if (typeof window === 'undefined') return 'desktop'; // Valeur par défaut côté serveur
    return getDeviceTypeFromWidth(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceTypeFromWidth(window.innerWidth));
    };

    // S'assurer que la valeur initiale est correcte lors du premier rendu côté client
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return deviceType;
};

/**
 * Vérifie si l'appareil actuel est un mobile
 */
export const isMobile = (deviceType) => deviceType === 'mobile';

/**
 * Vérifie si l'appareil actuel est une tablette
 */
export const isTablet = (deviceType) => deviceType === 'tablet';

/**
 * Vérifie si l'appareil actuel est un ordinateur de bureau
 */
export const isDesktop = (deviceType) => deviceType === 'desktop';

/**
 * Obtient les classes CSS appropriées en fonction du type d'appareil
 */
export const getResponsiveClasses = (
  baseClasses = '',
  mobileClasses = '',
  tabletClasses = '',
  desktopClasses = ''
) => {
  const deviceType = useDeviceType();

  let responsiveClasses = baseClasses;

  if (isMobile(deviceType) && mobileClasses) {
    responsiveClasses += ` ${mobileClasses}`;
  } else if (isTablet(deviceType) && tabletClasses) {
    responsiveClasses += ` ${tabletClasses}`;
  } else if (isDesktop(deviceType) && desktopClasses) {
    responsiveClasses += ` ${desktopClasses}`;
  }

  return responsiveClasses.trim();
};

/**
 * Hook personnalisé pour obtenir la taille actuelle de la fenêtre
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return windowSize;
};

/**
 * Hook pour détecter les interactions tactiles
 */
export const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const touchDevice = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 ||
                          navigator.msMaxTouchPoints > 0;
      setIsTouch(touchDevice);
    }
  }, []);

  return isTouch;
};