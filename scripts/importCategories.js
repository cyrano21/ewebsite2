// scripts/importCategories.js
// Script pour importer les catégories depuis categories.json dans MongoDB

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

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

async function importCategories() {
  await connectDB();

  const filePath = path.resolve(__dirname, '../categories.json');
  const rawData = fs.readFileSync(filePath);
  const categories = JSON.parse(rawData);

  let count = 0;
  for (const cat of categories) {
    const slug = cat.slug || slugify(cat.name, { lower: true, strict: true });
    const existing = await Category.findOne({ slug });
    if (existing) {
      console.log(`↪️  Déjà présent : ${cat.name}`);
      continue;
    }
    const newCat = new Category({
      name: cat.name,
      slug,
      description: cat.description || '',
      isActive: true,
      order: 0
    });
    await newCat.save();
    console.log(`✔ Catégorie importée : ${cat.name}`);
    count++;
  }
  console.log(`\n✅ Import terminé. ${count} nouvelles catégories ajoutées.`);
  process.exit(0);
}

importCategories();
