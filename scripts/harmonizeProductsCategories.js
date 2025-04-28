// scripts/harmonizeProductsCategories.js
// Harmonise les catégories des produits dans MongoDB à partir du fichier products.json et des catégories existantes

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
}

async function harmonize() {
  await connectDB();

  // Charger le mapping produit -> catégorie depuis products.json
  const productsJsonPath = path.resolve(__dirname, '../products.json');
  const productsJson = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
  // Créer un mapping id produit => nom catégorie
  const prodIdToCategory = {};
  for (const p of productsJson) {
    prodIdToCategory[p.id] = p.category;
  }

  // Charger toutes les catégories MongoDB (mapping nom -> ObjectId)
  const categories = await Category.find({});
  const nameToCat = {};
  const slugToCat = {};
  for (const c of categories) {
    nameToCat[c.name] = c;
    slugToCat[c.slug] = c;
  }

  // Harmoniser chaque produit MongoDB
  const products = await Product.find({});
  let updated = 0;
  let notFound = 0;
  for (const prod of products) {
    // Retrouver la catégorie d'origine via products.json (legacyId ou id custom)
    let catName = prodIdToCategory[prod.legacyId] || prodIdToCategory[prod.id];
    if (!catName && prod.name) {
      // Fallback : chercher par nom dans products.json
      for (const p of productsJson) {
        if (p.name === prod.name) {
          catName = p.category;
          break;
        }
      }
    }
    if (!catName) {
      console.warn(`❌ Catégorie non trouvée pour produit: ${prod.name}`);
      notFound++;
      continue;
    }
    // Chercher la catégorie MongoDB correspondante
    let cat = nameToCat[catName];
    if (!cat) {
      // Fallback : slug
      const slug = catName.toLowerCase().replace(/\s+/g, '-');
      cat = slugToCat[slug];
    }
    if (!cat) {
      console.warn(`❌ Catégorie MongoDB non trouvée pour: ${catName} (produit: ${prod.name})`);
      notFound++;
      continue;
    }
    // Mettre à jour le champ category (ObjectId)
    prod.category = cat._id;
    await prod.save();
    console.log(`✔ Produit harmonisé: ${prod.name} → ${cat.name}`);
    updated++;
  }
  console.log(`\n✅ Harmonisation terminée. ${updated} produits mis à jour, ${notFound} sans correspondance.`);
  process.exit(0);
}

harmonize();
