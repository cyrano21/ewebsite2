
/**
 * Moteur de recommandation de produits 
 * Utilise les intérêts utilisateur et l'historique pour suggérer des produits pertinents
 */

import { getRecentInterests, calculateAdRelevance } from './targetingUtil';

/**
 * Calcule le score de pertinence d'un produit pour un utilisateur
 * @param {Object} product - Produit à évaluer
 * @param {Array} userInterests - Intérêts de l'utilisateur
 * @param {Array} purchaseHistory - Historique d'achats
 * @returns {number} - Score de pertinence (0-100)
 */
export const calculateProductRelevance = (product, userInterests = [], purchaseHistory = []) => {
  // Score de base
  let relevanceScore = 40;

  // Si pas d'intérêts utilisateur, utiliser ceux stockés en local
  if (!userInterests || userInterests.length === 0) {
    userInterests = getRecentInterests();
  }

  // 1. Pertinence par catégorie (jusqu'à +20 points)
  if (userInterests.some(interest => 
    product.category.toLowerCase().includes(interest.toLowerCase()) ||
    interest.toLowerCase().includes(product.category.toLowerCase())
  )) {
    relevanceScore += 20;
  }

  // 2. Pertinence par tags/mots-clés (jusqu'à +15 points)
  if (product.tags && product.tags.length > 0) {
    const matchingTags = product.tags.filter(tag => 
      userInterests.some(interest => 
        interest.toLowerCase().includes(tag.toLowerCase()) || 
        tag.toLowerCase().includes(interest.toLowerCase())
      )
    );
    
    if (matchingTags.length > 0) {
      relevanceScore += Math.min(15, matchingTags.length * 5);
    }
  }

  // 3. Produits du même vendeur que des achats précédents (jusqu'à +10 points)
  if (purchaseHistory && purchaseHistory.length > 0 && product.seller) {
    const boughtFromSameSeller = purchaseHistory.some(
      item => item.seller && item.seller._id === product.seller._id
    );
    
    if (boughtFromSameSeller) {
      relevanceScore += 10;
    }
  }

  // 4. Produits similaires à ceux achetés précédemment (jusqu'à +15 points)
  if (purchaseHistory && purchaseHistory.length > 0) {
    const similarCategories = purchaseHistory.some(
      item => item.category === product.category
    );
    
    if (similarCategories) {
      relevanceScore += 15;
    }
  }

  // 5. Bonus pour les produits populaires (jusqu'à +5 points)
  if (product.totalSold > 10) {
    relevanceScore += Math.min(5, product.totalSold / 10);
  }

  // 6. Bonus pour les produits bien notés (jusqu'à +5 points)
  if (product.rating && product.rating > 3) {
    relevanceScore += (product.rating - 3) * 2.5; // 1 point pour 4 étoiles, 5 points pour 5 étoiles
  }

  // Plafonner à 100
  return Math.min(100, Math.round(relevanceScore));
};

/**
 * Trie et filtre les produits selon leur pertinence pour l'utilisateur
 * @param {Array} products - Liste des produits
 * @param {Array} userInterests - Intérêts de l'utilisateur
 * @param {Array} purchaseHistory - Historique d'achats
 * @param {number} limit - Nombre maximum de produits à retourner
 * @returns {Array} - Produits recommandés triés par pertinence
 */
export const getRecommendedProducts = (products, userInterests = [], purchaseHistory = [], limit = 6) => {
  if (!products || !products.length) return [];

  // Calculer le score de pertinence pour chaque produit
  const scoredProducts = products.map(product => ({
    ...product,
    relevanceScore: calculateProductRelevance(product, userInterests, purchaseHistory)
  }));

  // Trier par score de pertinence décroissant
  const sortedProducts = [...scoredProducts].sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Retourner les N premiers produits
  return sortedProducts.slice(0, limit);
};

/**
 * Génère des recommandations "Fréquemment achetés ensemble"
 * @param {Object} product - Produit de référence
 * @param {Array} allOrders - Toutes les commandes
 * @param {number} limit - Nombre maximum de produits à retourner
 * @returns {Array} - Produits souvent achetés avec le produit de référence
 */
export const getFrequentlyBoughtTogether = (product, allOrders, limit = 4) => {
  if (!product || !allOrders || !allOrders.length) return [];

  // Map pour compter les occurrences de chaque produit acheté avec le produit de référence
  const productCounts = new Map();
  
  // Parcourir toutes les commandes contenant le produit de référence
  allOrders.forEach(order => {
    const orderProducts = order.items.map(item => item.product._id || item.product);
    
    // Vérifier si la commande contient le produit de référence
    if (orderProducts.includes(product._id)) {
      // Compter les autres produits dans la même commande
      orderProducts.forEach(productId => {
        if (productId !== product._id) {
          productCounts.set(
            productId, 
            (productCounts.get(productId) || 0) + 1
          );
        }
      });
    }
  });

  // Convertir la Map en tableau et trier par nombre d'occurrences
  const sortedProductIds = [...productCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);

  return sortedProductIds;
};

export default {
  calculateProductRelevance,
  getRecommendedProducts,
  getFrequentlyBoughtTogether
};
