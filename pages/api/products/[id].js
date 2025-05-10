// pages/api/products/[id].js
import connectDB from '../../../config/db';
import mongoose from 'mongoose';
import Product from '../../../models/Product';
import { formatProduct } from '../../../utils/formatProduct';
import {
  topDealsProducts,
  topElectronicProducts,
  bestOfferProducts,
  allProducts
} from '../../../data/e-commerce/products';

export default async function handler(req, res) {
  // 405 si autre méthode que GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  try {
    await connectDB();
  } catch (dbErr) {
    console.error('Erreur connexion DB:', dbErr);
    return res.status(500).json({ error: 'Database connection error' });
  }
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'ID du produit manquant' });
  }
  let raw = null;
  // 1) Si c'est un ObjectId valide
  if (mongoose.isValidObjectId(id)) {
    raw = await Product.findById(id).populate('category').lean();
  }
  // 2) Sinon, recherche par legacyId ou slug
  if (!raw) {
    raw = (await Product.findOne({ legacyId: id }).populate('category').lean())
       || (await Product.findOne({ slug: id }).populate('category').lean());
  }
  // 3) Fallback statique
  if (!raw) {
    const all = [
      ...topDealsProducts,
      ...topElectronicProducts,
      ...bestOfferProducts,
      ...allProducts
    ];
    raw = all.find(p => String(p.id) === String(id));
  }
  if (!raw) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }
  // Retourner le produit formaté
  return res.status(200).json(formatProduct(raw));
}
