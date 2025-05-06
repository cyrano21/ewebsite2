// scripts/migrateAddColors.js

require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('../models/Product');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const res = await Product.updateMany(
      { colors: { $exists: false } },
      { $set: { colors: [] } }
    );
    console.log(`🚀 Produits mis à jour : ${res.modifiedCount}`);

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

migrate();
