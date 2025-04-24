import connectDB from '../../../src/config/db';
import Product from '../../../src/models/Product';

export default async function handler(req, res) {
  try {
    // Connexion à MongoDB
    const conn = await connectDB();
    
    if (!conn) {
      return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
    
    switch (req.method) {
      case 'GET':
        // Récupérer tous les produits ou filtrer par catégorie
        const { category } = req.query;
        let query = {};
        
        if (category && category !== 'all') {
          query.category = category;
        }
        
        const products = await Product.find(query).sort({ createdAt: -1 });
        return res.status(200).json(products);
        
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
