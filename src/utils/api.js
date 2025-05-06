// Fonctions pour interagir avec les API de produits
import axios from "axios";

// On récupère la variable d'env NEXT_PUBLIC_API_URL
const HOST = process.env.NEXT_PUBLIC_API_URL || "";
// Garantir que l'URL finit bien par /api
const API_URL = HOST ? (HOST.endsWith("/api") ? HOST : `${HOST}/api`) : "/api";

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
