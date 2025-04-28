// Script pour corriger automatiquement les catégories de tous les produits
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const Product = require('../models/Product');
const Category = require('../models/Category');

// Mapping mots-clés -> slug catégorie (utilise les slugs réels de la base)
const categoryMap = [
  { slug: 'mens-sneaker', keywords: ['Sneaker', 'SHOES'] },
  { slug: 'mens-pants', keywords: ['PANTS'] },
  { slug: 'mens-boot', keywords: ['Boot'] },
  { slug: 'bag', keywords: ['Bag', 'Backpack', 'Sackpack'] },
  { slug: 'cap', keywords: ['Cap', 'Hat', 'Bucket'] },
  { slug: 'bottle', keywords: ['Bottle', 'Glass', 'Straw'] },
  { slug: 'earphones', keywords: ['Earbuds', 'Headphones', 'Earphones', 'FWD', 'RPT'] },
  // { slug: 'sacs-colores', keywords: ['Sacs'] }, // décommenter si tu veux gérer cette catégorie
  // { slug: 'deco-maison', keywords: ['Déco', 'Maison'] }, // décommenter si tu veux gérer cette catégorie
];

async function fixAllProductCategories() {
  await mongoose.connect(MONGODB_URI);
  const categories = await Category.find({});
  const slugToId = {};
  categories.forEach(cat => { slugToId[cat.slug] = cat._id; });

  const products = await Product.find({});
  let count = 0;
  for (const prod of products) {
    let found = false;
    for (const map of categoryMap) {
      for (const kw of map.keywords) {
        if (prod.name && prod.name.toUpperCase().includes(kw.toUpperCase())) {
          const catId = slugToId[map.slug];
          if (catId) {
            const oldCat = prod.category;
            prod.category = catId;
            await prod.save();
            console.log(`Corrigé : ${prod.name} | Ancienne catégorie : ${oldCat} -> Nouvelle catégorie : ${map.slug} (${catId})`);
            count++;
            found = true;
          } else {
            console.log(`Catégorie '${map.slug}' introuvable pour ${prod.name} !`);
          }
          break;
        }
      }
      if (found) break;
    }
    if (!found) {
      // Ne pas modifier le produit si aucune catégorie trouvée
      console.log(`Aucune catégorie trouvée pour : ${prod.name} (id: ${prod._id}) | Catégorie actuelle conservée : ${prod.category}`);
    }
  }
  console.log(`Total de produits corrigés : ${count}`);
  await mongoose.disconnect();
}

fixAllProductCategories().catch(console.error);
