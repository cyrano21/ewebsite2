/**
 * Utilitaire de ciblage avancé pour les publicités
 * Ce module fournit des outils pour améliorer le ciblage des publicités
 * en fonction du comportement de l'utilisateur et du contexte de navigation.
 */

import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

/**
 * Types de pages pour le ciblage contextuel
 */
export const PAGE_CONTEXTS = {
  HOME: 'home',
  SHOP: 'shop',
  PRODUCT: 'product',
  CATEGORY: 'category',
  BLOG: 'blog',
  BLOG_POST: 'blog_post',
  CART: 'cart',
  CHECKOUT: 'checkout',
  ACCOUNT: 'account',
  SHIPPING: 'shipping',
  OTHER: 'other'
};

/**
 * Hook personnalisé pour déterminer le contexte de page actuel
 * @returns {string} - Type de contexte de page
 */
export const usePageContext = () => {
  const router = useRouter();
  const [pageContext, setPageContext] = useState(PAGE_CONTEXTS.OTHER);

  useEffect(() => {
    const path = router.pathname;

    if (path === '/') {
      setPageContext(PAGE_CONTEXTS.HOME);
    } else if (path === '/shop' || path.startsWith('/shop/')) {
      setPageContext(PAGE_CONTEXTS.SHOP);
    } else if (path.match(/\/product\/[^/]+$/)) {
      setPageContext(PAGE_CONTEXTS.PRODUCT);
    } else if (path.match(/\/category\/[^/]+$/)) {
      setPageContext(PAGE_CONTEXTS.CATEGORY);
    } else if (path === '/blog') {
      setPageContext(PAGE_CONTEXTS.BLOG);
    } else if (path.match(/\/blog\/[^/]+$/)) {
      setPageContext(PAGE_CONTEXTS.BLOG_POST);
    } else if (path === '/cart') {
      setPageContext(PAGE_CONTEXTS.CART);
    } else if (path === '/checkout') {
      setPageContext(PAGE_CONTEXTS.CHECKOUT);
    } else if (path.startsWith('/account')) {
      setPageContext(PAGE_CONTEXTS.ACCOUNT);
    } else if (path === '/shipping-info') {
      setPageContext(PAGE_CONTEXTS.SHIPPING);
    } else {
      setPageContext(PAGE_CONTEXTS.OTHER);
    }
  }, [router.pathname]);

  return pageContext;
};

/**
 * Récupère les catégories de produits ou les tags consultés récemment
 * @returns {Array} - Liste des catégories/tags récents
 */
export const getRecentInterests = () => {
  if (typeof window === 'undefined') return [];

  try {
    const recentInterests = localStorage.getItem('recentInterests');
    return recentInterests ? JSON.parse(recentInterests) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des intérêts récents:', error);
    return [];
  }
};

/**
 * Enregistre une catégorie ou un tag d'intérêt
 * @param {string} interest - Catégorie ou tag d'intérêt
 */
export const trackInterest = (interest) => {
  if (typeof window === 'undefined' || !interest) return;

  try {
    let recentInterests = getRecentInterests();
    
    // Éviter les doublons
    if (!recentInterests.includes(interest)) {
      recentInterests.unshift(interest);
      
      // Limiter le nombre d'intérêts stockés
      if (recentInterests.length > 10) {
        recentInterests = recentInterests.slice(0, 10);
      }
      
      localStorage.setItem('recentInterests', JSON.stringify(recentInterests));
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'intérêt:', error);
  }
};

/**
 * Calcule la pertinence d'une publicité pour l'utilisateur
 * @param {Object} ad - Objet publicité
 * @param {string} pageContext - Contexte de page actuel
 * @param {Array} userInterests - Intérêts de l'utilisateur
 * @returns {number} - Score de pertinence (0-100)
 */
export const calculateAdRelevance = (ad, pageContext, userInterests = []) => {
  // Si on n'a pas les intérêts de l'utilisateur, les récupérer
  if (!userInterests || userInterests.length === 0) {
    userInterests = getRecentInterests();
  }
  
  // Score de base
  let relevanceScore = 50;
  
  // 1. Pertinence par position (jusqu'à +15 points)
  const positionMatch = ad.position === 'global' || ad.position === pageContext;
  if (positionMatch) {
    relevanceScore += 15;
  }
  
  // 2. Prise en compte du contexte ciblé (jusqu'à +20 points)
  if (ad.targetContext && Array.isArray(ad.targetContext)) {
    if (ad.targetContext.includes('all') || ad.targetContext.includes(pageContext)) {
      relevanceScore += 20;
    }
  }
  
  // 3. Prise en compte de la priorité configurée (jusqu'à +10 points)
  if (ad.priority && ad.priority > 0) {
    relevanceScore += Math.min(10, ad.priority * 2);
  }
  
  // 4. Pertinence des mots-clés (jusqu'à +15 points)
  if (ad.keywords && ad.keywords.length > 0 && userInterests.length > 0) {
    const matchingKeywords = ad.keywords.filter(keyword => 
      userInterests.some(interest => 
        interest.toLowerCase().includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(interest.toLowerCase())
      )
    );
    
    if (matchingKeywords.length > 0) {
      relevanceScore += Math.min(15, matchingKeywords.length * 5);
    }
  }
  
  // 5. Pertinence des intérêts ciblés (jusqu'à +15 points)
  if (ad.targetAudience && ad.targetAudience.interests && ad.targetAudience.interests.length > 0 && userInterests.length > 0) {
    const matchingInterests = ad.targetAudience.interests.filter(interest => 
      userInterests.some(userInterest => 
        userInterest.toLowerCase().includes(interest.toLowerCase()) || 
        interest.toLowerCase().includes(userInterest.toLowerCase())
      )
    );
    
    if (matchingInterests.length > 0) {
      relevanceScore += Math.min(15, matchingInterests.length * 5);
    }
  }
  
  // 6. Fraicheur de la publicité (jusqu'à +5 points) - favorise les nouvelles pubs
  if (ad.createdAt) {
    const adAge = (new Date() - new Date(ad.createdAt)) / (1000 * 60 * 60 * 24); // âge en jours
    const freshnessScore = Math.max(0, 5 - Math.min(5, adAge / 7)); // 5 points pour nouvelles pubs, décroissant sur 5 semaines
    relevanceScore += freshnessScore;
  }
  
  // 7. Stats historiques (CTR) - indique une bonne performance (jusqu'à +10 points)
  if (ad.analytics && ad.analytics.ctr > 0) {
    const ctrBonus = Math.min(10, ad.analytics.ctr / 2);
    relevanceScore += ctrBonus;
  }
  
  // Plafonner à 100
  return Math.min(100, relevanceScore);
};

/**
 * Trie les publicités par pertinence
 * @param {Array} ads - Liste de publicités
 * @param {string} pageContext - Contexte de page actuel
 * @returns {Array} - Liste de publicités triées par pertinence
 */
export const sortAdsByRelevance = (ads, pageContext) => {
  if (!ads || !ads.length) return [];
  
  return [...ads].sort((a, b) => {
    const relevanceA = calculateAdRelevance(a, pageContext);
    const relevanceB = calculateAdRelevance(b, pageContext);
    return relevanceB - relevanceA;
  });
};

/**
 * Hook personnalisé pour obtenir des publicités pertinentes pour le contexte actuel
 * avec rotation automatique
 * @param {string} position - Position de la publicité
 * @param {string} type - Type de publicité
 * @param {number} limit - Nombre maximum de publicités à récupérer
 * @param {string} rotationGroup - Groupe de rotation (default par défaut)
 * @param {boolean} enableRotation - Activer la rotation automatique des publicités
 * @returns {Object} - Publicités pertinentes, état de chargement et fonctions de rotation
 */
// Cache pour les publicités récupérées, évite des appels redondants
const adCache = {};
let adCacheTimestamp = 0;
const CACHE_DURATION = 60000; // 60 secondes de durée de cache

// Fonction pour générer une clé de cache unique pour les paramètres de publicité
const generateCacheKey = (position, type, limit, rotationGroup, pageContext) => {
  return `${position}-${type}-${limit}-${rotationGroup}-${pageContext}`;
};

export const useRelevantAds = (position, type, limit = 1, rotationGroup = 'default', enableRotation = true) => {
  const [ads, setAds] = useState([]);
  const [displayedAds, setDisplayedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const pageContext = usePageContext();
  
  // Stocker les intérêts dans une ref pour éviter les re-rendus
  const userInterestsRef = useRef(getRecentInterests());
  
  // Utilise un effet pour empêcher les appels trop fréquents
  // const debounceTimeout = useRef(null); // Commenté car non utilisé
  const fetchController = useRef(null);
  
  // Ref pour stocker la clé de cache actuelle
  const currentCacheKey = useRef('');
  
  // Récupérer toutes les publicités pertinentes - Juste au montage et quand position/type changent
  // En retirant les dépendances trop volatiles comme pageContext et userInterests
  useEffect(() => {
    // Générer la clé de cache une seule fois au début
    currentCacheKey.current = generateCacheKey(position, type, limit, rotationGroup, pageContext);
    
    // Fonction de fetch
    const fetchAds = async () => {
      // Si le composant a été démonté ou si trop de tentatives échouées, arrêter
      if (retryCount > 2) return;
      
      // Anti-spam : limiter à un appel maximum toutes les 10 secondes
      const now = Date.now();
      if (now - lastFetchTime < 10000) {
        console.log('Trop d\'appels à l\'API, limitation respectée');
        return;
      }
      
      // Vérifier si on a des données en cache valides
      if (adCache[currentCacheKey.current] && (now - adCacheTimestamp) < CACHE_DURATION) {
        // Utiliser les données mises en cache
        const cachedData = adCache[currentCacheKey.current];
        setAds(cachedData.allAds);
        setDisplayedAds(cachedData.displayedAds);
        setLoading(false);
        return;
      }
      
      // Mise à jour du timestamp du dernier appel
      setLastFetchTime(now);
      
      // Annuler toute requête précédente en cours
      if (fetchController.current) {
        fetchController.current.abort();
      }
      
      // Créer un nouveau contrôleur pour cette requête
      fetchController.current = new AbortController();
      
      setLoading(true);
      
      try {
        const params = {
          position,
          type,
          status: 'active',
          isActive: 'true',
          limit: limit * 3, // Limiter à 3x la rotation pour économiser les ressources
          currentDate: new Date().toISOString()
        };
        
        if (rotationGroup !== 'default') {
          params.rotationGroup = rotationGroup;
        }
        
        // Utiliser le signal d'abandon pour cette requête
        const response = await fetch(
          `/api/public/advertisements?${new URLSearchParams(params)}`,
          { signal: fetchController.current.signal }
        );
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          // Filtrer les publicités par appareil
          const filteredByDevice = filterAdsByDevice(data.data);
          
          // Récupérer les intérêts utilisateur depuis la ref
          const currentInterests = userInterestsRef.current;
          
          // Précalculer les scores de pertinence pour chaque publicité
          const adsWithRelevance = filteredByDevice.map(ad => {
            // Utiliser la méthode du modèle si disponible ou notre fonction utilitaire
            const relevanceScore = ad.calculateRelevanceScore 
              ? ad.calculateRelevanceScore(pageContext, currentInterests)
              : calculateAdRelevance(ad, pageContext, currentInterests);
            
            return {
              ...ad,
              relevanceScore
            };
          });
          
          // Trier par pertinence pour le contexte actuel
          const sortedAds = adsWithRelevance.sort((a, b) => {
            // Tenir compte à la fois de la pertinence et de la priorité de rotation
            const rotationPriorityA = a.rotationSettings?.rotationPriority || 1;
            const rotationPriorityB = b.rotationSettings?.rotationPriority || 1;
            const relevanceA = a.relevanceScore || 0;
            const relevanceB = b.relevanceScore || 0;
            
            // Formule combinée: (pertinence * 0.7) + (priorité de rotation * 0.3)
            const scoreA = (relevanceA * 0.7) + (rotationPriorityA * 10 * 0.3);
            const scoreB = (relevanceB * 0.7) + (rotationPriorityB * 10 * 0.3);
            
            return scoreB - scoreA; // Du plus pertinent au moins pertinent
          });
          
          setAds(sortedAds);
          
          // Définir les publicités à afficher initialement
          if (sortedAds.length > 0) {
            setDisplayedAds(sortedAds.slice(0, limit));
          } else {
            setDisplayedAds([]);
          }
          
          // Mettre à jour le cache
          adCache[currentCacheKey.current] = {
            allAds: sortedAds,
            displayedAds: sortedAds.slice(0, limit)
          };
          adCacheTimestamp = now;
        } else {
          setAds([]);
          setDisplayedAds([]);
        }
      } catch (error) {
        // Ignorer les erreurs d'abandon (normales lors d'un nettoyage)
        if (error.name === 'AbortError') {
          console.log('Requête abandonnée suite à un changement de dépendances');
          return;
        }
        
        console.error('Erreur lors de la récupération des publicités pertinentes:', error);
        setError(error);
        setRetryCount(prev => prev + 1);
        setAds([]);
        setDisplayedAds([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Lancer le fetch immédiatement au chargement
    fetchAds();
    
    // Nettoyage
    return () => {
      if (fetchController.current) {
        fetchController.current.abort();
      }
    };
  }, [position, type, limit, rotationGroup, lastFetchTime, pageContext, retryCount]); // Ajout des dépendances manquantes
  
  // Gérer la rotation automatique des publicités
  useEffect(() => {
    if (!enableRotation || ads.length <= limit || loading) {
      return; // Ne pas faire de rotation si elle n'est pas activée ou s'il n'y a pas assez de publicités
    }
    
    // Trouver la fréquence de rotation moyenne
    const averageFrequency = ads.reduce((sum, ad) => {
      const frequency = ad.rotationSettings?.frequency || 15; // 15 secondes par défaut
      return sum + frequency;
    }, 0) / Math.min(ads.length, 5); // Prendre en compte au maximum 5 publicités
    
    const rotationTimer = setInterval(() => {
      setRotationIndex(prevIndex => {
        // Calculer le nouvel ensemble de publicités à afficher
        const newIndex = (prevIndex + 1) % Math.max(1, ads.length - limit + 1);
        const newDisplayedAds = ads.slice(newIndex, newIndex + limit);
        setDisplayedAds(newDisplayedAds);
        return newIndex;
      });
    }, averageFrequency * 1000);
    
    return () => clearInterval(rotationTimer);
  }, [ads, limit, enableRotation, loading]);
  
  // Fonction pour forcer une rotation manuelle des publicités
  const rotateAds = () => {
    if (ads.length <= limit) return;
    
    setRotationIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % Math.max(1, ads.length - limit + 1);
      const newDisplayedAds = ads.slice(newIndex, newIndex + limit);
      setDisplayedAds(newDisplayedAds);
      return newIndex;
    });
  };
  
  // Mettre à jour le cache lorsque nous avons de nouvelles données
  useEffect(() => {
    if (ads.length > 0 && !loading) {
      const cacheKey = generateCacheKey(position, type, limit, rotationGroup, pageContext);
      adCache[cacheKey] = {
        allAds: ads,
        displayedAds: displayedAds
      };
      adCacheTimestamp = Date.now();
    }
  }, [ads, displayedAds, loading, position, type, limit, rotationGroup, pageContext]);

  return { 
    ads: displayedAds, 
    allAds: ads,
    loading, 
    error,
    pageContext,
    rotateAds, // Fonction pour faire une rotation manuelle
    rotationIndex
  };
};

/**
 * Filtre les publicités en fonction de l'appareil de l'utilisateur
 * @param {Array} ads - Liste de publicités
 * @returns {Array} - Liste filtrée de publicités
 */
export const filterAdsByDevice = (ads) => {
  if (!ads || !Array.isArray(ads) || ads.length === 0) {
    return [];
  }
  
  // Détecter l'appareil de l'utilisateur
  let currentDevice = 'desktop';
  
  if (typeof window !== 'undefined') {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
    const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent);
    
    if (isTablet) {
      currentDevice = 'tablet';
    } else if (isMobile) {
      currentDevice = 'mobile';
    }
  }
  
  // Filtrer les publicités compatible avec l'appareil actuel
  return ads.filter(ad => {
    return !ad.targetDevice || 
           ad.targetDevice.includes('all') || 
           ad.targetDevice.includes(currentDevice);
  });
};

/**
 * Détermine l'appareil actuel de l'utilisateur
 * @returns {string} - Type d'appareil ('desktop', 'tablet', 'mobile')
 */
export const getCurrentDevice = () => {
  if (typeof window === 'undefined') {
    return 'desktop'; // Valeur par défaut pour SSR
  }
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
  const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent);
  
  if (isTablet) {
    return 'tablet';
  } else if (isMobile) {
    return 'mobile';
  }
  
  return 'desktop';
};

/**
 * Obtient les dimensions actuelles de la fenêtre pour l'analyse de la réactivité
 * @returns {Object} - Dimensions {width, height} de la fenêtre
 */
export const getViewportSize = () => {
  if (typeof window === 'undefined') {
    return { width: 1920, height: 1080 }; // Valeurs par défaut pour SSR
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};
