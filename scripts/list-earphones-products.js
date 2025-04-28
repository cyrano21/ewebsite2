// Usage : node scripts/list-earphones-products.js

const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://louiscyrano:Figoro21@cluster0.6tx8gwm.mongodb.net/ecommerce-website';

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connecté à MongoDB');

  // 1. Trouver la catégorie "Earphones" (par slug ou nom)
  const cat = await Category.findOne({
    $or: [
      { slug: 'earphones' },
      { name: /earphones/i }
    ]
  });
  if (!cat) {
    console.log('Catégorie "Earphones" non trouvée.');
    return;
  }
  console.log('Catégorie Earphones _id:', cat._id);

  // 2. Lister les produits de cette catégorie
  const products = await Product.find({ category: cat._id });
  if (products.length === 0) {
    console.log('Aucun produit lié à la catégorie Earphones.');
  } else {
    console.log(`Produits trouvés (${products.length}) :`);
    products.forEach(p => console.log(`- ${p.name} (${p._id})`));
  }

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
