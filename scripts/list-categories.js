// Script pour lister toutes les catégories (slug, nom, _id)
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const Category = require('../models/Category');

async function listCategories() {
  await mongoose.connect(MONGODB_URI);
  const categories = await Category.find({});
  console.log('Liste des catégories existantes :');
  categories.forEach(cat => {
    console.log(`- slug: ${cat.slug} | nom: ${cat.name} | _id: ${cat._id}`);
  });
  await mongoose.disconnect();
}

listCategories().catch(console.error);
