// Fonctions pour interagir avec les API de produits
import axios from "axios";

// Configuration de l'URL de l'API avec stratégie de résilience
const isServer = typeof window === 'undefined';

// Déterminer l'URL de base à utiliser
const getApiBaseUrl = () => {
  // En mode serveur, utiliser des URL relatives
  if (isServer) {
    return '/api';
  }
  
  // En mode client, essayer d'utiliser la variable d'environnement
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) {
    const normalizedUrl = envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
    console.log(`🔗 [API] URL configurée via env: ${normalizedUrl}`);
    return normalizedUrl;
  }
  
  // Si aucune URL n'est configurée, utiliser l'URL relative (fallback sécurisé)
  console.log(`🔗 [API] Fallback vers URL relative: /api`);
  return '/api';
};

// Définir l'URL API en fonction du contexte
const API_URL = getApiBaseUrl();

// URL de secours en cas d'échec (toujours relative pour maximiser la compatibilité)
const LOCAL_API_URL = "/api";

// Journaliser l'URL pour déboguer
if (typeof window !== 'undefined') {
  console.log(`🔗 [API] Configuration finale API: ${API_URL}`);
}

/**
 * Fonction améliorée pour effectuer des requêtes API avec gestion d'erreurs robuste
 * et options de fallback
 * 
 * @param {string} url - URL à appeler
 * @param {Object} options - Options fetch
 * @param {Object} fallbackOptions - Options en cas d'échec
 * @param {any} fallbackOptions.defaultValue - Valeur par défaut à retourner en cas d'échec
 * @param {boolean} fallbackOptions.useCache - Utiliser le cache en cas d'échec
 * @param {number} fallbackOptions.retries - Nombre de tentatives (défaut: 1)
 * @param {number} fallbackOptions.retryDelay - Délai entre les tentatives en ms (défaut: 1000)
 * @param {boolean} fallbackOptions.verbose - Afficher des logs détaillés (défaut: false)
 * @returns {Promise<any>} Résultat de la requête ou valeur par défaut
 */
export async function fetchApi(url, options = {}, fallbackOptions = {}) {
  const {
    defaultValue = null,
    useCache = true,
    retries = 1,
    retryDelay = 1000,
    verbose = false,
    timeout = 8000
  } = fallbackOptions;

  // Cache en mémoire pour les requêtes
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const cache = fetchApi.cache || (fetchApi.cache = new Map());
  
  // Vérifier si on a une version en cache
  if (useCache && cache.has(cacheKey)) {
    verbose && console.log(`🔍 [API] Utilisation du cache pour ${url}`);
    return cache.get(cacheKey);
  }

  // Détermine si l'URL est absolue ou relative
  const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://');
  
  // Si l'URL n'est pas absolue et ne commence pas par '/', ajouter la base API_URL
  const requestUrl = isAbsoluteUrl ? url : (url.startsWith('/') ? url : `${LOCAL_API_URL}/${url}`);
  
  verbose && console.log(`🔍 [API] URL finale: ${requestUrl}`);

  // Controller pour le timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Options par défaut pour fetch avec credentials inclus
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin', // Inclure les cookies pour l'authentification
    ...options,
    signal: controller.signal
  };

  verbose && console.log(`🔍 [API] Appel de ${requestUrl}`);
  
  // Tentatives multiples avec délai exponentiel
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        verbose && console.log(`🔄 [API] Tentative ${attempt}/${retries} pour ${requestUrl}`);
        // Attendre avant de réessayer (délai exponentiel)
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1)));
      }

      // Essayer d'abord avec l'URL demandée
      try {
        // Ajouter des options pour éviter les problèmes CORS
        const enhancedOptions = {
          ...fetchOptions,
          // S'assurer que les credentials sont correctement gérés 
          credentials: 'include',
          // Ajouter des headers pour aider à résoudre les problèmes CORS
          headers: {
            ...fetchOptions.headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        };
        
        const response = await fetch(requestUrl, enhancedOptions);
        clearTimeout(timeoutId);
        
        verbose && console.log(`🔍 [API] Réponse reçue: status=${response.status} pour ${requestUrl}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Stocker dans le cache si nécessaire
        if (useCache) {
          cache.set(cacheKey, data);
        }
        
        return data;
      } catch (primaryError) {
        // Logger l'erreur pour déboguer
        verbose && console.error(`🔄 [API] Erreur lors de la requête principale:`, primaryError.message);
        
        // Si l'URL absolue échoue, essayer avec l'URL de fallback si nécessaire
        if (isAbsoluteUrl && attempt === retries - 1) {
          verbose && console.log(`🔄 [API] Échec avec URL absolue, essai avec fallback: ${LOCAL_API_URL}${url}`);
          try {
            const fallbackResponse = await fetch(`${LOCAL_API_URL}${url}`, fetchOptions);
            
            if (fallbackResponse.ok) {
              const data = await fallbackResponse.json();
              if (useCache) {
                cache.set(cacheKey, data);
              }
              return data;
            }
          } catch (fallbackError) {
            verbose && console.error(`🔄 [API] Échec également avec l'URL de fallback:`, fallbackError.message);
          }
        }
        
        if (attempt < retries) {
          verbose && console.log(`🔄 [API] Nouvel essai ${attempt + 1}/${retries} prévu...`);
        }
        
        throw primaryError; // Re-lance l'erreur pour être capturée par le bloc catch externe
      }
      
    } catch (error) {
      if (attempt === retries) {
        // Nettoyer le timeout si c'est la dernière tentative
        clearTimeout(timeoutId);
        
        // Gestion d'erreur finale
        if (error.name === 'AbortError') {
          console.error(`⚠️ [API] Timeout après ${timeout}ms pour ${requestUrl}`);
        } else {
          console.error(`❌ [API] Erreur pour ${requestUrl}:`, error.message);
        }
        
        return defaultValue;
      }
    }
  }
}

/**
 * Fonction spécifique pour récupérer les catégories avec fallback robuste
 * @returns {Promise<Array>} Liste des catégories ou catégories par défaut
 */
export async function getCategoriesWithFallback() {
  // Catégories par défaut si l'API échoue
  const DEFAULT_CATEGORIES = [
    { name: "Électronique", slug: "electronique", imageUrl: "/assets/images/category/01.jpg" },
    { name: "Mode", slug: "mode", imageUrl: "/assets/images/category/02.jpg" },
    { name: "Maison", slug: "maison", imageUrl: "/assets/images/category/03.jpg" },
    { name: "Sport", slug: "sport", imageUrl: "/assets/images/category/04.jpg" },
    { name: "Beauté", slug: "beaute", imageUrl: "/assets/images/category/05.jpg" },
    { name: "Livres", slug: "livres", imageUrl: "/assets/images/category/06.jpg" }
  ];

  try {
    // Déterminer si nous sommes côté client ou serveur
    const isServer = typeof window === 'undefined';
    
    // Pendant le rendu serveur (SSR/SSG), retourner simplement les catégories par défaut
    // pour éviter les redirections en boucle et les problèmes de génération
    if (isServer) {
      console.log('🔍 [API] Rendu serveur détecté, utilisation des catégories par défaut');
      return DEFAULT_CATEGORIES;
    }
    
    // Vérifier si nous avons des catégories en cache local (pour utilisation immédiate)
    const localCacheKey = 'app_categories_cache';
    const cachedCategories = sessionStorage.getItem(localCacheKey);
    
    if (cachedCategories) {
      try {
        const parsed = JSON.parse(cachedCategories);
        console.log('🔍 [API] Utilisation des catégories du cache local (temporaire)');
        
        // Rafraîchir le cache en arrière-plan
        setTimeout(() => {
          refreshCategoriesCache(localCacheKey);
        }, 2000);
        
        return parsed;
      } catch (e) {
        // Erreur de parsing, ignorer le cache
        console.warn('⚠️ [API] Erreur de parsing du cache local, ignorer');
      }
    }
    
    // Côté client seulement, tenter l'appel API complet
    const categories = await fetchApi('/api/categories', {}, {
      defaultValue: DEFAULT_CATEGORIES,
      retries: 2, // Augmenter légèrement pour améliorer les chances de succès
      retryDelay: 500, // Délai plus court pour une meilleure réactivité
      verbose: true,
      timeout: 5000 // Timeout plus court pour éviter des attentes trop longues
    });
    
    // Mettre en cache les résultats dans le stockage local
    if (categories && categories.length && categories !== DEFAULT_CATEGORIES) {
      try {
        sessionStorage.setItem(localCacheKey, JSON.stringify(categories));
      } catch (e) {
        console.warn('⚠️ [API] Impossible de mettre en cache les catégories:', e);
      }
    }
    
    return categories;
  } catch (error) {
    console.error("Erreur dans getCategoriesWithFallback:", error);
    return DEFAULT_CATEGORIES;
  }
}

// Fonction auxiliaire pour rafraîchir le cache en arrière-plan
async function refreshCategoriesCache(cacheKey) {
  try {
    const freshData = await fetchApi('/categories', {}, {
      retries: 1,
      verbose: false,
      timeout: 8000
    });
    
    if (freshData && freshData.length) {
      sessionStorage.setItem(cacheKey, JSON.stringify(freshData));
      console.log('🔄 [API] Cache des catégories rafraîchi en arrière-plan');
    }
  } catch (error) {
    console.warn('⚠️ [API] Échec du rafraîchissement du cache en arrière-plan:', error);
  }
}

/**
 * Fonction spécifique pour récupérer les produits avec fallback robuste
 * @param {Object} options - Options de filtrage
 * @returns {Promise<Array>} Liste des produits ou tableau vide
 */
export async function getProductsWithFallback(options = {}) {
  try {
    // Déterminer si nous sommes côté client ou serveur
    const isServer = typeof window === 'undefined';
    
    // Pendant le rendu serveur, retourner un tableau vide pour éviter les redirections
    if (isServer) {
      console.log('🔍 [API] Rendu serveur détecté, utilisation d\'un tableau vide pour les produits');
      return [];
    }
    
    const params = new URLSearchParams();
    if (options.featured) params.append("featured", "true");
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.page) params.append("page", options.page.toString());
    if (options.category) params.append("category", options.category);
    if (options.related) params.append("related", options.related);

    // Utiliser l'URL absolue avec API_URL
    const fullUrl = `${API_URL}/products?${params.toString()}`;
    return fetchApi(fullUrl, {}, {
      defaultValue: [],
      retries: 1,
      verbose: true
    });
  } catch (error) {
    console.error("Erreur dans getProductsWithFallback:", error);
    return [];
  }
}

/**
 * Effectue une requête fetch avec un timeout
 * @param {string} url - URL à appeler
 * @param {Object} options - Options fetch
 * @param {number} timeout - Timeout en ms (défaut: 8000ms)
 * @returns {Promise<Response>} Réponse fetch
 */
export async function fetchWithTimeout(url, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Requête abandonnée par timeout');
    }
    throw error;
  }
}

/**
 * Récupère les produits avec filtrage et pagination
 * @param {Object} options - Options de filtrage
 * @param {boolean} options.featured - Produits en vedette uniquement
 * @param {number} options.limit - Nombre de produits à récupérer
 * @param {number} options.page - Page de résultats
 * @param {string} options.category - Catégorie de produits
 * @returns {Promise<Array>} Liste des produits
 */
export async function getProducts(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.featured)   params.append("featured", "true");
    if (options.limit)      params.append("limit", options.limit.toString());
    if (options.page)       params.append("page", options.page.toString());
    if (options.category)   params.append("category", options.category);

    // Déterminer si nous sommes côté client ou serveur
    const isServer = typeof window === 'undefined';
    
    // Pendant le rendu serveur, retourner un tableau vide pour éviter les redirections
    if (isServer) {
      console.log('🔍 [API] Rendu serveur détecté dans getProducts, utilisation d\'un tableau vide');
      return [];
    }

    // Utiliser un try-catch spécifique pour Axios avec un timeout
    try {
      const { data } = await axios.get(`${API_URL}/products?${params.toString()}`, {
        timeout: 5000 // Timeout de 5 secondes pour éviter les attentes trop longues
      });
      return data;
    } catch (axiosError) {
      // Erreur spécifique à Axios - logger et retourner une liste vide
      console.warn(`⚠️ [API] Erreur Axios dans getProducts: ${axiosError.message}`);
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return [];
  }
}

/**
 * Récupère les détails d'un produit par son ID
 * @param {string} id - ID du produit
 * @returns {Promise<Object>} Détails du produit
 */
export async function getProductById(id) {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${id}:`, error);
    return null;
  }
}

/**
 * Récupère les catégories de produits
 * @returns {Promise<Array>} Liste des catégories
 */
export async function getCategories() {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return [];
  }
}

/**
 * Recherche de produits par mot-clé
 * @param {string} query - Terme de recherche
 * @returns {Promise<Array>} Résultats de la recherche
 */
export async function searchProducts(query) {
  try {
    const response = await axios.get(
      `${API_URL}/products/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la recherche de produits:", error);
    return [];
  }
}
