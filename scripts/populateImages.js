// scripts/populateImages.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');
const Product  = require('../models/Product');

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ connecté à MongoDB');
}

async function run() {
  await connectDB();

  const data = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../src/products.json'), 'utf-8')
  );

  for (const p of data) {
    // Construis ta galerie
    const gallery = p.images || p.thumbnails || [ p.img ];
    // Choisis l'image principale
    const mainImg = gallery[0] || p.img;

    // Mets à jour à la fois imageUrl et images[]
    const res = await Product.updateOne(
      { legacyId: p.id },
      { $set: {
          images:   gallery,
          imageUrl: mainImg
      }}
    );
    console.log(`→ ${p.name} : ${res.modifiedCount ? 'OK' : 'déjà à jour'}`);
  }

  console.log('🏁 images importées et imageUrl synchronisé');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
