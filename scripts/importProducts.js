// scripts/importProducts.js
// Script pour importer les produits statiques de src/products.json dans MongoDB

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Charger le modèle Product
const Product = require('../models/Product');

// Fonction de connexion à MongoDB
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

// Importer et insérer les produits
async function importProducts() {
  await connectDB();
  
  // Lire products.json
  const filePath = path.resolve(__dirname, '../Nouveau dossier/src/products.json');
  const rawData = fs.readFileSync(filePath);
  const products = JSON.parse(rawData);

  // Vider la collection si besoin
  // await Product.deleteMany();

  for (const prod of products) {
    // Préparer l'objet pour Mongo
    const newProd = new Product({
        name: prod.name,
        description: prod.description || prod.name,    // ← Ici, on importe (ou génère) la description
        price: prod.price,
        discountPrice: prod.discountPrice || null,     // ← Ici, l’import (ou défaut) du discountPrice
        category: prod.category,
        imageUrl: prod.img,
        cloudinaryId: null,
        seller: prod.seller,
        shipping: prod.shipping,
        quantity: prod.quantity,
        rating: prod.ratings,
        ratingsCount: prod.ratingsCount,               // ← Ici, l’import de ratingsCount
        stock: prod.stock,
        tags: prod.tags || [],
        legacyId: prod.id,                              // ← L’import de ton UUID en legacyId
        // slug est généré automatiquement par le hook pre('save')
      });
      

    try {
      const saved = await newProd.save();
      console.log(`✔ Importé: ${saved.name} (legacyId: ${saved.legacyId})`);
    } catch (err) {
      console.error(`❌ Erreur pour ${prod.id}:`, err.message);
    }
  }

  console.log('✅ Import terminé');
  process.exit();
}

importProducts();
