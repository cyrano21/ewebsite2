import connectDB from '../../../config/db';
import Product   from '../../../models/Product';
import Category from '../../../models/Category';
import mongoose from 'mongoose';
import { formatProduct } from '../../../utils/formatProduct';
import {
  topDealsProducts,
  topElectronicProducts,
  bestOfferProducts,
  allProducts
} from '../../../data/e-commerce/products';

export default async function handler(req, res) {
  await connectDB();
  const { method, query } = req;

  if (method === 'GET') {
    const { category, limit, exclude, featured } = query;
    // Construire le filtre pour MongoDB
    const filter = {};
    // Correction : gestion du filtre catégorie par ObjectId ou slug/nom
    if (category && category !== 'all') {
      console.log('[API products] Param category reçu:', category);
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = new mongoose.Types.ObjectId(category);
      } else {
        // Cherche la catégorie par slug OU nom (insensible à la casse)
        const categorySlug = (typeof category === 'string') ? category.toLowerCase() : category;
        console.log('[API products] Recherche catégorie par slug:', categorySlug);
        const catDoc = await Category.findOne({
          $or: [
            { slug: categorySlug },
            { name: new RegExp('^' + category + '$', 'i') }
          ]
        }).lean();
        console.log('[API products] Résultat recherche catégorie:', catDoc);
        if (catDoc && catDoc._id) {
          filter.category = catDoc._id;
        } else {
          // Si pas trouvé, aucun produit ne sera retourné
          filter.category = '__notfound__';
        }
      }
    }
    if (featured === 'true') filter.isFeatured = true;
    if (exclude) {
      if (mongoose.Types.ObjectId.isValid(exclude)) filter._id = { $ne: exclude };
      else filter.legacyId = { $ne: exclude };
    }
    const limitNum = parseInt(limit, 10) || 0;
    // Requête en base
    console.log('[API products] Filtre final utilisé pour Product.find:', filter);
    let rawProducts = await Product.find(filter).populate('category', 'name').limit(limitNum).lean();
    console.log('[API products] Nombre de produits trouvés:', rawProducts.length);

    // Fallback statique si nécessaire
    if (!rawProducts.length) {
      let staticProducts = [
        ...topDealsProducts,
        ...topElectronicProducts,
        ...bestOfferProducts,
        ...allProducts
      ].filter(p => {
        if (category && category !== 'all' && p.category !== category) return false;
        if (exclude && String(p.id) === String(exclude)) return false;
        return true;
      });
      if (limitNum > 0) staticProducts = staticProducts.slice(0, limitNum);
      rawProducts = staticProducts;
    }

    return res.status(200).json(rawProducts.map(formatProduct));
  }

  if (method === 'POST') {
    const newProd = new Product(req.body);
    // Copie l’ancien id si présent
    if (req.body.id) newProd.legacyId = req.body.id;
    const saved = await newProd.save();
    return res
      .status(201)
      .json(formatProduct(saved.toObject()));
  }

  res.status(405).json({ error: 'Méthode non autorisée' });
}
