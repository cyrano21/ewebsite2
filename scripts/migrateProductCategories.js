// scripts/migrateProductCategories.js
// Met à jour le champ category des produits pour référencer l'ObjectId de la bonne catégorie

require('dotenv').config();
const mongoose = require('mongoose');
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

async function migrateCategories() {
  await connectDB();

  const products = await Product.find({});
  let updated = 0;
  let notFound = 0;

  for (const prod of products) {
    // Si déjà un ObjectId, on saute
    if (prod.category && typeof prod.category === 'object' && prod.category._bsontype === 'ObjectID') {
      continue;
    }
    // Cherche la catégorie par nom ou slug
    const cat = await Category.findOne({
      $or: [
        { name: prod.category },
        { slug: (typeof prod.category === 'string' ? prod.category.toLowerCase().replace(/\s+/g, '-') : undefined) }
      ]
    });
    if (!cat) {
      console.warn(`❌ Catégorie non trouvée pour produit: ${prod.name} (cat: ${prod.category})`);
      notFound++;
      continue;
    }
    prod.category = cat._id;
    await prod.save();
    console.log(`✔ Produit mis à jour: ${prod.name} → ${cat.name}`);
    updated++;
  }
  console.log(`\n✅ Migration terminée. ${updated} produits mis à jour, ${notFound} sans correspondance.`);
  process.exit(0);
}

migrateCategories();
