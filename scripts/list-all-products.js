// Script pour lister tous les produits avec leur nom, _id et catégorie actuelle
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const Product = require('../models/Product');
const Category = require('../models/Category');

async function listAllProducts() {
  await mongoose.connect(MONGODB_URI);
  const categories = await Category.find({});
  const catMap = {};
  categories.forEach(cat => {
    catMap[cat._id.toString()] = cat.slug;
  });

  const products = await Product.find({});
  console.log('Liste de tous les produits :');
  products.forEach(p => {
    let cat = p.category;
    let catDisplay = '';
    if (cat && cat._id) cat = cat._id; // population
    if (cat && catMap[cat.toString()]) catDisplay = catMap[cat.toString()];
    else if (typeof cat === 'string') catDisplay = cat;
    else catDisplay = 'Aucune';
    console.log(`- ${p.name} | _id: ${p._id} | category: ${catDisplay}`);
  });
  await mongoose.disconnect();
}

listAllProducts().catch(console.error);
