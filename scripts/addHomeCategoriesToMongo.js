// scripts/addHomeCategoriesToMongo.js
// Ajoute les catégories "front" (vignettes Home) dans MongoDB et upload les images sur Cloudinary si besoin

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const homeCategories = [
  {
    name: "Sacs colorés",
    slug: "sacs-colores",
    description: "Sacs et accessoires colorés",
    imgLocal: path.resolve(__dirname, '../public/categories/bag-color.jpg')
  },
  {
    name: "Déco maison",
    slug: "deco-maison",
    description: "Décoration pour la maison",
    imgLocal: path.resolve(__dirname, '../public/categories/home-deco.jpg')
  }
  // Ajoute ici d'autres catégories si besoin
];

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

async function uploadAndSave() {
  await connectDB();
  for (const cat of homeCategories) {
    // Upload image sur Cloudinary
    let secureUrl = '';
    try {
      const uploadRes = await cloudinary.uploader.upload(cat.imgLocal, {
        folder: 'categories',
        use_filename: true,
        unique_filename: false,
        overwrite: true
      });
      secureUrl = uploadRes.secure_url;
      console.log(`✔ Image uploadée pour ${cat.name}`);
    } catch (err) {
      console.error(`❌ Upload échoué pour ${cat.name}:`, err.message);
      continue;
    }
    // Création ou update de la catégorie
    let dbCat = await Category.findOne({ slug: cat.slug });
    if (!dbCat) {
      dbCat = new Category({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: secureUrl,
        isActive: true,
        order: 0
      });
    } else {
      dbCat.imageUrl = secureUrl;
      dbCat.description = cat.description;
    }
    await dbCat.save();
    console.log(`✔ Catégorie MongoDB à jour: ${cat.name}`);
  }
  process.exit(0);
}

uploadAndSave();
