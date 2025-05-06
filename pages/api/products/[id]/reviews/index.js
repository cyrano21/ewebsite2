import dbConnect from '../../../../utils/dbConnect';
import Product from '../../../../models/Product';
import { isAuthenticated } from '../../../../middleware/auth';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query; // c’est bien “id” (pas productId) :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}

  switch (req.method) {
    case 'GET':
      try {
        const product = await Product.findById(id)
          .select('reviews')
          .populate('reviews.user', 'name email avatar');
        if (!product) {
          return res.status(404).json({
            success: false,
            message: 'Produit non trouvé'
          });
        }

        // **On ne renvoie que les avis approuvés**
        const approvedReviews = product.reviews.filter(r => r.approved);

        return res.status(200).json({
          success: true,
          count: approvedReviews.length,
          data: approvedReviews
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des avis:', error);
        return res.status(500).json({
          success: false,
          message: 'Erreur serveur',
          error: error.message
        });
      }

    default:
      return res.status(405).json({
        success: false,
        message: 'Méthode non autorisée'
      });
  }
}
