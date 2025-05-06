/**
 * Utilitaires pour la gestion des produits
 */

// Générer un ID unique pour un nouveau produit
export const generateProductId = () => {
  return `product_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Valider les données de produit
export const validateProduct = (product) => {
  const errors = {};

  if (!product.name || product.name.trim() === "") {
    errors.name = "Le nom du produit est requis";
  }

  if (!product.category || product.category.trim() === "") {
    errors.category = "La catégorie est requise";
  }

  if (!product.price || isNaN(product.price) || product.price <= 0) {
    errors.price = "Le prix doit être un nombre positif";
  }

  if (!product.stock || isNaN(product.stock) || product.stock < 0) {
    errors.stock = "Le stock doit être un nombre positif ou zéro";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Formatter les données de produit pour l'affichage
export const formatProductData = (products) => {
  if (!Array.isArray(products)) return [];

  return products.map((product) => ({
    ...product,
    price:
      typeof product.price === "number"
        ? product.price
        : parseFloat(product.price) || 0,
    stock:
      typeof product.stock === "number"
        ? product.stock
        : parseInt(product.stock) || 0,
    ratings:
      typeof product.ratings === "number"
        ? product.ratings
        : parseFloat(product.ratings) || 0,
    ratingsCount:
      typeof product.ratingsCount === "number"
        ? product.ratingsCount
        : parseInt(product.ratingsCount) || 0,
  }));
};

// Créer un nouveau produit
export const createProduct = (productData) => {
  // Récupérer les produits existants
  const existingProducts = JSON.parse(localStorage.getItem("products") || "[]");

  // Créer le nouveau produit avec un ID unique
  const newProduct = {
    ...productData,
    id: generateProductId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Ajouter le produit à la liste
  const updatedProducts = [...existingProducts, newProduct];

  // Sauvegarder dans localStorage
  localStorage.setItem("products", JSON.stringify(updatedProducts));

  return newProduct;
};

// Mettre à jour un produit existant
export const updateProduct = (productId, productData) => {
  // Récupérer les produits existants
  const existingProducts = JSON.parse(localStorage.getItem("products") || "[]");

  // Trouver l'index du produit à mettre à jour
  const productIndex = existingProducts.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    throw new Error(`Produit avec l'ID ${productId} non trouvé`);
  }

  // Mettre à jour le produit
  const updatedProduct = {
    ...existingProducts[productIndex],
    ...productData,
    updatedAt: new Date().toISOString(),
  };

  // Mettre à jour la liste
  existingProducts[productIndex] = updatedProduct;

  // Sauvegarder dans localStorage
  localStorage.setItem("products", JSON.stringify(existingProducts));

  return updatedProduct;
};

// Supprimer un produit
export const deleteProduct = (productId) => {
  // Récupérer les produits existants
  const existingProducts = JSON.parse(localStorage.getItem("products") || "[]");

  // Filtrer le produit à supprimer
  const updatedProducts = existingProducts.filter((p) => p.id !== productId);

  // Sauvegarder dans localStorage
  localStorage.setItem("products", JSON.stringify(updatedProducts));

  return true;
};

// Récupérer toutes les catégories uniques
export const getAllCategories = () => {
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const defaultCategories = ["Non classé"];

  // Récupérer les catégories définies par l'utilsateur
  const savedCategories = JSON.parse(
    localStorage.getItem("productCategories") || "[]"
  );

  // Extraire toutes les catégories uniques des produits
  const productCategories = [
    ...new Set(products.map((product) => product.category)),
  ];

  // Combiner et dédupliquer toutes les catégories
  const allCategories = [
    ...new Set([
      ...defaultCategories,
      ...savedCategories,
      ...productCategories,
    ]),
  ];

  return allCategories;
};

// Calculer les statistiques des produits
export const calculateProductStats = (products) => {
  if (!products || products.length === 0) {
    return {
      totalProducts: 0,
      totalValue: 0,
      avgPrice: 0,
      categoryCounts: {},
    };
  }

  // Valeur totale du stock
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  // Prix moyen
  const avgPrice =
    totalValue / products.reduce((sum, product) => sum + product.stock, 0);

  // Comptage par catégorie
  const categoryCounts = {};
  products.forEach((product) => {
    if (categoryCounts[product.category]) {
      categoryCounts[product.category]++;
    } else {
      categoryCounts[product.category] = 1;
    }
  });

  return {
    totalProducts: products.length,
    totalValue,
    avgPrice,
    categoryCounts,
  };
};
