import connectDB from '../../../config/db';
import Product from '../../../models/Product';
import { formatProduct } from '../../../utils/formatProduct';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  try {
    await connectDB();
    const limitNum = parseInt(req.query.limit, 10) || 5;
    const products = await Product.find({})
      .sort({ totalSold: -1 })
      .limit(limitNum)
      .lean();
    return res.status(200).json(products.map(formatProduct));
  } catch (error) {
    console.error('Erreur API Best Selling:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
