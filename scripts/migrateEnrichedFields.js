// scripts/migrateEnrichedFields.js
// Script pour mettre à jour tous les produits existants
// et ajouter les nouveaux champs enrichis avec des valeurs par défaut

require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('../models/Product');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
  } catch (err) {
    console.error('❌ Erreur de connexion à MongoDB:', err);
    process.exit(1);
  }
}

async function migrate() {
  await connectDB();

  const updates = [
    { filter: { images: { $exists: false } },       update: { $set: { images: [] } } },
    { filter: { sizes: { $exists: false } },        update: { $set: { sizes: [] } } },
    { filter: { colors: { $exists: false } },       update: { $set: { colors: [] } } },
    { filter: { specifications: { $exists: false } },update: { $set: { specifications: [] } } },
    { filter: { reviews: { $exists: false } },       update: { $set: { reviews: [] } } },
    { filter: { boughtTogether: { $exists: false } },update: { $set: { boughtTogether: [] } } },
    { filter: { similarProducts: { $exists: false } },update: { $set: { similarProducts: [] } } },
    { filter: { ratingsCount: { $exists: false } },  update: { $set: { ratingsCount: 0 } } },
    { filter: { totalSold: { $exists: false } },     update: { $set: { totalSold: 0 } } },
  ];

  for (const { filter, update } of updates) {
    const res = await Product.updateMany(filter, update);
    console.log(`🔄 Mises à jour effectuées pour ${JSON.stringify(filter)} : ${res.modifiedCount}`);
  }

  console.log('🏁 Migration des champs enrichis terminée');
  process.exit(0);
}

migrate();
