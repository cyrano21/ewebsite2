require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const Product = require('../models/Product');
const Category = require('../models/Category');

async function fixEarphonesProducts() {
  await mongoose.connect(MONGODB_URI);

  const cat = await Category.findOne({ slug: 'earphones' });
  if (!cat) {
    console.error('Catégorie "Earphones" introuvable.');
    return;
  }
  console.log('Catégorie Earphones trouvée :', cat._id);

  // 1. Récupère tous les produits (ou limite à 500 si besoin)
  const allProducts = await Product.find({});
  let count = 0;

  for (const prod of allProducts) {
    if (
      prod.category === 'earphones' ||
      prod.category === 'Earphones' ||
      prod.category === cat.name ||
      prod.category === cat.slug ||
      prod.category === cat._id.toString() ||
      !prod.category ||
      (prod.category && prod.category != cat._id)
    ) {
      prod.category = cat._id;
      await prod.save();
      count++;
      console.log(`Corrigé : ${prod.name} (${prod._id})`);
    }
  }
  console.log(`Total corrigés : ${count}`);

  const fixed = await Product.find({ category: cat._id });
  console.log('Produits désormais liés à Earphones :');
  fixed.forEach(p => console.log(`- ${p.name} (${p._id})`));

  await mongoose.disconnect();
}

fixEarphonesProducts().catch(console.error);