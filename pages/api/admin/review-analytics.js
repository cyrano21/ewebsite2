// filepath: g:\ewebsite2\pages\api\admin\review-analytics.js
import dbConnect from '../../../utils/dbConnect';
import Product from '../../../models/Product';
import User from '../../../models/User'; // Assurez-vous que ce modèle existe
import { isAuthenticated, isAdmin } from '../../../middleware/auth';

const handler = async (req, res) => {
  console.log(
    '[API review-analytics] Méthode:', req.method,
    'Authorization header:', req.headers.authorization
  );

  if (req.method !== 'GET') {
    console.log('[API review-analytics] Méthode non autorisée');
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }
  
  try {
    await dbConnect();
    console.log('[API review-analytics] Connexion DB réussie');

    // Récupérer tous les produits qui ont des avis
    const productsWithReviews = await Product.find({
      'reviews': { $exists: true, $not: { $size: 0 } }
    })
    .select('name slug reviews category price tags')
    .populate('reviews.user', 'name email avatar purchaseHistory');

    console.log('[API review-analytics] Nombre de produits avec avis :', productsWithReviews.length);
    
    // Statistiques globales des avis
    let totalReviews = 0;
    let totalRatingSum = 0;
    let ratingDistribution = [0, 0, 0, 0, 0]; // Index 0 = 1 étoile, Index 4 = 5 étoiles
    let categoryRatings = {};
    let tagRatings = {};
    
    // Analyses par utilisateur
    let userAnalytics = {};
    
    // Analyse des produits populaires
    let productPopularity = {};
    
    // Traiter tous les produits et leurs avis
    productsWithReviews.forEach(product => {
      // Initialiser les catégories si elles n'existent pas encore
      if (product.category && !categoryRatings[product.category]) {
        categoryRatings[product.category] = {
          totalRating: 0,
          count: 0,
          averageRating: 0
        };
      }
      
      // Initialiser les tags
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach(tag => {
          if (!tagRatings[tag]) {
            tagRatings[tag] = {
              totalRating: 0,
              count: 0,
              averageRating: 0
            };
          }
        });
      }
      
      // Initialiser la popularité du produit
      productPopularity[product._id] = {
        name: product.name,
        slug: product.slug,
        category: product.category,
        tags: product.tags || [],
        price: product.price,
        totalRating: 0,
        reviewCount: 0,
        averageRating: 0,
        positiveReviewsCount: 0, // 4-5 étoiles
        negativeReviewsCount: 0,  // 1-2 étoiles
        neutralReviewsCount: 0    // 3 étoiles
      };
      
      // Traiter chaque avis
      product.reviews.forEach(review => {
        // Mise à jour des compteurs globaux
        totalReviews++;
        totalRatingSum += review.rating;
        
        // Mise à jour de la distribution des notes (tableau indexé à partir de 0)
        if (review.rating >= 1 && review.rating <= 5) {
          ratingDistribution[review.rating - 1]++;
        }
        
        // Mise à jour des statistiques de catégorie
        if (product.category) {
          categoryRatings[product.category].totalRating += review.rating;
          categoryRatings[product.category].count++;
        }
        
        // Mise à jour des statistiques de tags
        if (product.tags && Array.isArray(product.tags)) {
          product.tags.forEach(tag => {
            tagRatings[tag].totalRating += review.rating;
            tagRatings[tag].count++;
          });
        }
        
        // Mise à jour des statistiques de produit
        productPopularity[product._id].totalRating += review.rating;
        productPopularity[product._id].reviewCount++;
        
        if (review.rating >= 4) {
          productPopularity[product._id].positiveReviewsCount++;
        } else if (review.rating <= 2) {
          productPopularity[product._id].negativeReviewsCount++;
        } else {
          productPopularity[product._id].neutralReviewsCount++;
        }
        
        // Si l'avis a un utilisateur, analyser ses préférences
        if (review.user && review.user._id) {
          const userId = review.user._id.toString();
          
          // Initialiser l'utilisateur s'il n'existe pas encore dans nos analyses
          if (!userAnalytics[userId]) {
            userAnalytics[userId] = {
              _id: userId,
              name: review.user.name || 'Utilisateur anonyme',
              email: review.user.email || 'Non disponible',
              totalReviews: 0,
              totalRating: 0,
              averageRating: 0,
              highRatingCount: 0, // Nombre d'avis 4-5 étoiles
              lowRatingCount: 0,  // Nombre d'avis 1-2 étoiles
              preferredCategories: {}, // Catégories les mieux notées
              preferredTags: {},      // Tags les mieux notés
              reviewedProducts: [],   // Produits évalués
              recommendedProducts: [] // Sera rempli plus tard
            };
          }
          
          // Mise à jour des statistiques utilisateur
          userAnalytics[userId].totalReviews++;
          userAnalytics[userId].totalRating += review.rating;
          
          if (review.rating >= 4) {
            userAnalytics[userId].highRatingCount++;
            
            // Ajouter la catégorie aux préférences de l'utilisateur
            if (product.category) {
              if (!userAnalytics[userId].preferredCategories[product.category]) {
                userAnalytics[userId].preferredCategories[product.category] = {
                  count: 0,
                  totalRating: 0
                };
              }
              userAnalytics[userId].preferredCategories[product.category].count++;
              userAnalytics[userId].preferredCategories[product.category].totalRating += review.rating;
            }
            
            // Ajouter les tags aux préférences de l'utilisateur
            if (product.tags && Array.isArray(product.tags)) {
              product.tags.forEach(tag => {
                if (!userAnalytics[userId].preferredTags[tag]) {
                  userAnalytics[userId].preferredTags[tag] = {
                    count: 0,
                    totalRating: 0
                  };
                }
                userAnalytics[userId].preferredTags[tag].count++;
                userAnalytics[userId].preferredTags[tag].totalRating += review.rating;
              });
            }
          } else if (review.rating <= 2) {
            userAnalytics[userId].lowRatingCount++;
          }
          
          // Ajouter ce produit à la liste des produits évalués par l'utilisateur
          userAnalytics[userId].reviewedProducts.push({
            productId: product._id,
            productName: product.name,
            productSlug: product.slug,
            category: product.category,
            tags: product.tags || [],
            rating: review.rating,
            date: review.date
          });
        }
      });
    });
    
    // Calculer les moyennes pour les catégories
    Object.keys(categoryRatings).forEach(category => {
      if (categoryRatings[category].count > 0) {
        categoryRatings[category].averageRating = (
          categoryRatings[category].totalRating / categoryRatings[category].count
        ).toFixed(1);
      }
    });
    
    // Calculer les moyennes pour les tags
    Object.keys(tagRatings).forEach(tag => {
      if (tagRatings[tag].count > 0) {
        tagRatings[tag].averageRating = (
          tagRatings[tag].totalRating / tagRatings[tag].count
        ).toFixed(1);
      }
    });
    
    // Calculer les moyennes pour les produits
    Object.keys(productPopularity).forEach(productId => {
      if (productPopularity[productId].reviewCount > 0) {
        productPopularity[productId].averageRating = (
          productPopularity[productId].totalRating / productPopularity[productId].reviewCount
        ).toFixed(1);
      }
    });
    
    // Calculer les moyennes pour les utilisateurs et générer des recommandations
    Object.keys(userAnalytics).forEach(userId => {
      const user = userAnalytics[userId];
      
      // Calculer la note moyenne donnée par l'utilisateur
      if (user.totalReviews > 0) {
        user.averageRating = (user.totalRating / user.totalReviews).toFixed(1);
      }
      
      // Identifier les catégories préférées (par nombre d'avis positifs)
      const sortedCategories = Object.entries(user.preferredCategories)
        .map(([category, data]) => ({
          category,
          count: data.count,
          averageRating: data.count > 0 ? (data.totalRating / data.count).toFixed(1) : 0
        }))
        .sort((a, b) => b.count - a.count || b.averageRating - a.averageRating)
        .slice(0, 3); // Top 3 catégories
      
      // Identifier les tags préférés (par nombre d'avis positifs)
      const sortedTags = Object.entries(user.preferredTags)
        .map(([tag, data]) => ({
          tag,
          count: data.count,
          averageRating: data.count > 0 ? (data.totalRating / data.count).toFixed(1) : 0
        }))
        .sort((a, b) => b.count - a.count || b.averageRating - a.averageRating)
        .slice(0, 5); // Top 5 tags
      
      // Générer des recommandations de produits basées sur les catégories et tags préférés
      const userReviewedProductIds = new Set(user.reviewedProducts.map(p => p.productId.toString()));
      
      // Trouver des produits similaires bien notés que l'utilisateur n'a pas encore évalués
      const recommendedProducts = Object.entries(productPopularity)
        .filter(([productId, product]) => {
          // Exclure les produits déjà évalués par l'utilisateur
          if (userReviewedProductIds.has(productId.toString())) {
            return false;
          }
          
          // Inclure les produits bien notés (moyenne >= 4)
          if (parseFloat(product.averageRating) < 4) {
            return false;
          }
          
          // Vérifier si le produit appartient à une catégorie préférée
          const matchesCategory = sortedCategories.some(
            cat => product.category === cat.category
          );
          
          // Vérifier si le produit a des tags préférés
          const matchesTags = sortedTags.some(
            tagInfo => product.tags.includes(tagInfo.tag)
          );
          
          // Inclure si le produit correspond à au moins un critère de préférence
          return matchesCategory || matchesTags;
        })
        .map(([productId, product]) => ({
          productId,
          name: product.name,
          slug: product.slug,
          category: product.category,
          tags: product.tags,
          averageRating: product.averageRating,
          matchScore: calculateMatchScore(product, sortedCategories, sortedTags)
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5); // Top 5 recommandations
      
      // Ajouter les recommandations à l'utilisateur
      userAnalytics[userId].recommendedProducts = recommendedProducts;
      
      // Simplifier les objets de préférences pour la réponse API
      userAnalytics[userId].preferredCategories = sortedCategories;
      userAnalytics[userId].preferredTags = sortedTags;
    });
    
    // Convertir les objets en tableaux pour la réponse JSON
    const userAnalyticsArray = Object.values(userAnalytics);
    const productPopularityArray = Object.values(productPopularity)
      .sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));
    
    // Trouver les utilisateurs qui donnent le plus d'avis positifs
    const positiveReviewers = userAnalyticsArray
      .filter(user => user.totalReviews >= 3) // Au moins 3 avis
      .sort((a, b) => {
        // Trier par pourcentage d'avis positifs (4-5 étoiles)
        const aPositivePercent = a.highRatingCount / a.totalReviews;
        const bPositivePercent = b.highRatingCount / b.totalReviews;
        return bPositivePercent - aPositivePercent;
      })
      .slice(0, 10); // Top 10 utilisateurs positifs
    
    // Trouver les combinaisons de catégories populaires
    const categoryPairs = {};
    userAnalyticsArray.forEach(user => {
      const categories = user.preferredCategories.map(c => c.category);
      
      // Créer des paires de catégories
      for (let i = 0; i < categories.length; i++) {
        for (let j = i + 1; j < categories.length; j++) {
          const pair = [categories[i], categories[j]].sort().join('__');
          
          if (!categoryPairs[pair]) {
            categoryPairs[pair] = {
              categories: [categories[i], categories[j]],
              count: 0
            };
          }
          
          categoryPairs[pair].count++;
        }
      }
    });
    
    // Convertir en tableau et trier
    const popularCategoryPairs = Object.values(categoryPairs)
      .filter(pair => pair.count >= 2) // Au moins 2 utilisateurs partagent cette paire
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 paires
    
    // Retourner les données d'analyse
    return res.status(200).json({
      success: true,
      globalStats: {
        totalReviews,
        averageRating: totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : 0,
        ratingDistribution,
      },
      categoryAnalytics: categoryRatings,
      tagAnalytics: tagRatings,
      userAnalytics: userAnalyticsArray,
      positiveReviewers,
      productPopularity: productPopularityArray.slice(0, 20), // Top 20 produits
      popularCategoryPairs,
    });
  } catch (error) {
    console.error('[API review-analytics] Erreur serveur :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Fonction utilitaire pour calculer un score de correspondance
function calculateMatchScore(product, preferredCategories, preferredTags) {
  let score = 0;
  
  // Points pour la correspondance de catégorie
  const categoryMatch = preferredCategories.find(c => c.category === product.category);
  if (categoryMatch) {
    score += 5 * parseFloat(categoryMatch.averageRating); // Plus de points pour les catégories mieux notées
  }
  
  // Points pour les correspondances de tags
  if (product.tags && Array.isArray(product.tags)) {
    product.tags.forEach(productTag => {
      const tagMatch = preferredTags.find(t => t.tag === productTag);
      if (tagMatch) {
        score += 2 * parseFloat(tagMatch.averageRating); // Points pour chaque tag correspondant
      }
    });
  }
  
  // Bonus pour les produits très bien notés
  score += parseFloat(product.averageRating) * 2;
  
  return score;
}

// On applique d'abord isAuthenticated puis isAdmin
export default isAuthenticated(isAdmin(handler));