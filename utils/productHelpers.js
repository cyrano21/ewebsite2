import { connectToDatabase } from './db';

/**
 * Fonction utilitaire pour récupérer des produits avec gestion d'erreur robuste
 * @param {Object} options - Options de récupération
 * @param {String} options.type - Type de récupération: 'popular', 'latest', etc.
 * @param {Number} options.limit - Nombre de produits à récupérer
 * @param {String} options.category - ID de la catégorie pour filtrer
 * @param {String} options.productId - ID du produit à exclure (pour les recommandations)
 * @returns {Array} - Liste des produits récupérés
 */
export async function fetchProducts(options = {}) {
  const { 
    type = 'latest', 
    limit = 8, 
    category = null, 
    productId = null,
    search = null
  } = options;
  
  try {
    const { db } = await connectToDatabase();
    
    // Vérifier si la collection products existe
    const collections = await db.listCollections().toArray();
    const productsCollectionExists = collections.some(c => c.name === 'products');
    
    if (!productsCollectionExists) {
      console.error("Collection 'products' introuvable dans la base de données");
      return [];
    }
    
    // Construire la requête de recherche
    let query = { active: { $ne: false } };
    
    // Ajouter des filtres si nécessaire
    if (category) {
      // Essayer plusieurs formats possibles de catégorie
      query.$or = [
        { categoryId: category },
        { category: category },
        { 'category._id': category },
        { categories: category }
      ];
    }
    
    // Ajouter une recherche textuelle si nécessaire
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Définir l'ordre de tri en fonction du type
    let sortCriteria = { _id: -1 }; // Par défaut, tri par ID décroissant
    
    // Essayer de récupérer un produit pour vérifier les champs disponibles
    const sampleProduct = await db.collection('products').findOne({});
    
    if (type === 'popular') {
      if (sampleProduct && 'popularity' in sampleProduct) sortCriteria.popularity = -1;
      if (sampleProduct && 'viewCount' in sampleProduct) sortCriteria.viewCount = -1;
      if (sampleProduct && 'salesCount' in sampleProduct) sortCriteria.salesCount = -1;
    } else if (type === 'latest') {
      if (sampleProduct && 'createdAt' in sampleProduct) sortCriteria.createdAt = -1;
      if (sampleProduct && 'date' in sampleProduct) sortCriteria.date = -1;
    } else if (type === 'rating') {
      if (sampleProduct && 'rating' in sampleProduct) sortCriteria.rating = -1;
      if (sampleProduct && 'averageRating' in sampleProduct) sortCriteria.averageRating = -1;
    }
    
    // Exécuter la requête
    let products = await db.collection('products')
      .find(query)
      .sort(sortCriteria)
      .limit(limit)
      .toArray();
    
    // Filtrer le produit actuel si nécessaire
    if (productId) {
      products = products.filter(p => 
        String(p._id) !== String(productId) &&
        String(p.id || '') !== String(productId)
      );
    }
    
    return products;
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits (${type}):`, error);
    return []; // Retourner un tableau vide en cas d'erreur
  }
}
