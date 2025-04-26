import connectDB from '../../../config/db';
import Product from '../../../models/Product';
import { topDealsProducts, topElectronicProducts, bestOfferProducts, allProducts } from '../../../data/e-commerce/products';

export default async function handler(req, res) {
  try {
    // Connexion à MongoDB
    const conn = await connectDB();
    
    if (!conn) {
      return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
    
    switch (req.method) {
      case 'GET':
        // Retourner les produits mock
        const { category } = req.query;
        let productsList = [
          ...topDealsProducts,
          ...topElectronicProducts,
          ...bestOfferProducts,
          ...allProducts
        ];
        if (category && category !== 'all') {
          productsList = productsList.filter((p) => p.category === category);
        }
        return res.status(200).json(productsList);
        
      case 'POST':
        // Créer un nouveau produit
        const newProduct = new Product(req.body);
        await newProduct.save();
        return res.status(201).json(newProduct);
        
      default:
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur API produits:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
