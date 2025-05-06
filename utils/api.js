// Fonctions pour interagir avec les API de produits
import axios from "axios";

// On récupère la variable d'env NEXT_PUBLIC_API_URL
const HOST = process.env.NEXT_PUBLIC_API_URL || "http://0.0.0.0:5000";
// Garantir que l'URL finit bien par /api
const API_URL = HOST.endsWith("/api") ? HOST : `${HOST}/api`;

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

  // Controller pour le timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Options par défaut pour fetch
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    ...options,
    signal: controller.signal
  };

  verbose && console.log(`🔍 [API] Appel de ${url}`);
  
  // Tentatives multiples avec délai exponentiel
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        verbose && console.log(`🔄 [API] Tentative ${attempt}/${retries} pour ${url}`);
        // Attendre avant de réessayer (délai exponentiel)
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1)));
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      verbose && console.log(`🔍 [API] Réponse reçue: status=${response.status} pour ${url}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // Stocker dans le cache si nécessaire
      if (useCache) {
        cache.set(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      if (attempt === retries) {
        // Nettoyer le timeout si c'est la dernière tentative
        clearTimeout(timeoutId);
        
        // Gestion d'erreur finale
        if (error.name === 'AbortError') {
          console.error(`⚠️ [API] Timeout après ${timeout}ms pour ${url}`);
        } else {
          console.error(`❌ [API] Erreur pour ${url}:`, error.message);
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

  return fetchApi('/api/categories', {}, {
    defaultValue: DEFAULT_CATEGORIES,
    retries: 2,
    verbose: true
  });
}

/**
 * Fonction spécifique pour récupérer les produits avec fallback robuste
 * @param {Object} options - Options de filtrage
 * @returns {Promise<Array>} Liste des produits ou tableau vide
 */
export async function getProductsWithFallback(options = {}) {
  const params = new URLSearchParams();
  if (options.featured) params.append("featured", "true");
  if (options.limit) params.append("limit", options.limit.toString());
  if (options.page) params.append("page", options.page.toString());
  if (options.category) params.append("category", options.category);
  if (options.related) params.append("related", options.related);

  return fetchApi(`/api/products?${params.toString()}`, {}, {
    defaultValue: [],
    retries: 1,
    verbose: true
  });
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

    const { data } = await axios.get(`${API_URL}/products?${params.toString()}`);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
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
