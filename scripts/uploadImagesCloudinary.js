// scripts/uploadImagesCloudinary.js
require('dotenv').config();
const mongoose    = require('mongoose');
const axios       = require('axios');
const Product     = require('../models/Product');
const { uploadImage } = require('../config/cloudinary');

const PLACEHOLDER_URL = 'https://res.cloudinary.com/votre-cloud-name/image/upload/v1740000000/products/placeholder.jpg';

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
  } catch (err) {
    console.error('❌ Erreur de connexion à MongoDB:', err);
    process.exit(1);
  }
}

async function main() {
  await connectDB();

  // Ne traiter que les produits sans cloudinaryId et avec une URL externe
  const prods = await Product.find({
    cloudinaryId: { $in: [null, '', undefined] },
    imageUrl:     { $regex: '^https?://' }
  });

  for (const prod of prods) {
    try {
      // 1) Vérifier que l’URL existe
      const head = await axios.head(prod.imageUrl, { timeout: 5000 });
      if (head.status !== 200) throw new Error(`HTTP ${head.status}`);

      // 2) Upload sur Cloudinary (uploadImage retourne { publicId, url, ... })
      const result = await uploadImage(prod.imageUrl, {
        folder:       'products',
        public_id:    prod.legacyId,
        overwrite:    false,
        resource_type:'auto',
      });

      // 3) Mettre à jour avec les bonnes propriétés
      prod.imageUrl     = result.url;
      prod.cloudinaryId = result.publicId;
      console.log(`✔ Upload réussi pour ${prod.name}`);
    } catch (err) {
      // Fallback sur placeholder si URL invalide / timeout / 404
      console.warn(`⚠️  ${prod.name} : ${err.message}. Utilisation du placeholder.`);
      prod.imageUrl     = PLACEHOLDER_URL;
      prod.cloudinaryId = 'products/placeholder';
    }

    // 4) Sauvegarde du document (placeholder ou URL Cloudinary)
    try {
      await prod.save();
      console.log(`→ Enregistré: ${prod.name}`);
    } catch (saveErr) {
      console.error(`❌ Échec save ${prod.name}:`, saveErr.message);
    }
  }

  console.log('🏁 Migration images terminée');
  process.exit(0);
}

main();
