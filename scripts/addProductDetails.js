// scripts/addProductDetails.js
require('dotenv').config();
const mongoose  = require('mongoose');
const slugify   = require('slugify');
const Product   = require('../models/Product');
const Category  = require('../models/Category');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');
  } catch (err) {
    console.error('❌ Erreur de connexion à MongoDB:', err);
    process.exit(1);
  }
}

async function main() {
  await connectDB();

  // 1) Charger le produit (visez le legacyId pour être sûr)
  const prod = await Product.findOne({ legacyId: '124e13b9-2d54-4b2f-a74d-a77b362d6ead' });
  if (!prod) {
    console.error('❌ ULTRABOOST 22 SHOES introuvable');
    process.exit(1);
  }

  // 2) Récupérer (ou créer) la catégorie ObjectId
  let cat = await Category.findOne({ name: "Men's Sneaker" });
  if (!cat) {
    cat = await Category.create({
      name: "Men's Sneaker",
      slug: slugify("Men's Sneaker", { lower: true, strict: true })
    });
    console.log('ℹ️  Catégorie créée:', cat._id);
  } else {
    console.log('ℹ️  Catégorie trouvée:', cat._id);
  }
  prod.category = cat._id;

  // 3) Mettre à jour la description
  prod.description = 
    'Chaussure ULTRABOOST 22 avec amorti Boost® pour un confort exceptionnel. Parfaite pour la course et la vie quotidienne.';

  // 4) Spécifications (tableau d’objets { key, value })
  prod.specifications = [
    { key: 'Amorti',             value: 'Boost® pour un retour d’énergie supérieur' },
    { key: 'Tige',               value: 'Mesh respirant et léger' },
    { key: 'Semelle extérieure', value: 'Caoutchouc Continental™ pour une adhérence optimale' }
  ];

  // 5) Réinitialiser les avis et compteurs
  prod.reviews      = [];   // 0 avis
  prod.ratingsCount = 0;    // 0 votes
  prod.totalSold    = 0;    // 0 ventes

  // 6) Ajouter la couleur noire
  prod.colors = prod.colors || [];
  // Eviter le doublon si déjà présent
  if (!prod.colors.find(c => c.hex === '#000000')) {
    prod.colors.push({ name: 'Black', hex: '#000000' });
    console.log('ℹ️  Couleur noire ajoutée');
  }

  // 7) Sauvegarder
  await prod.save();
  console.log('✔ Produit mis à jour:', prod._id);

  process.exit(0);
}

main();
