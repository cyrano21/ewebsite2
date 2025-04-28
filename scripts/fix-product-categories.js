// Script pour corriger les références de catégorie dans les produits MongoDB
// Usage : node scripts/fix-product-categories.js

const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// À adapter si besoin
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://louiscyrano:Figoro21@cluster0.6tx8gwm.mongodb.net/ecommerce-website';

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connecté à MongoDB');

  // 1. Récupère toutes les catégories (slug + _id)
  const categories = await Category.find({});
  const slugToId = {};
  categories.forEach(cat => {
    slugToId[cat.slug] = cat._id;
    slugToId[cat.name] = cat._id; // au cas où certains produits référencent par nom
  });

  // 2. Corrige tous les produits
  const products = await Product.find({});
  let modifCount = 0;
  for (const prod of products) {
    if (typeof prod.category === 'string') {
      const catId = slugToId[prod.category.trim().toLowerCase()];
      if (catId && String(prod.category) !== String(catId)) {
        prod.category = catId;
        await prod.save();
        modifCount++;
        console.log(`Corrigé : ${prod.name}`);
      }
    }
  }
  console.log(`Correction terminée. ${modifCount} produit(s) modifié(s).`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });