// pages/api/admin/pending-reviews.js
import dbConnect from '../../../utils/dbConnect';
import Product from '../../../models/Product';
import { isAuthenticated, isAdmin } from '../../../middleware/auth';

const handler = async (req, res) => {
  console.log(
    '[API pending-reviews] Méthode:', req.method,
    'Authorization header:', req.headers.authorization,
    'Cookies:', req.headers.cookie
  );

  if (req.method !== 'GET') {
    console.log('[API pending-reviews] Méthode non autorisée');
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }
  
  try {
    await dbConnect();
    console.log('[API pending-reviews] Connexion DB réussie');

    // Utiliser $elemMatch pour trouver les produits avec au moins un avis non approuvé
    const productsWithPendingReviews = await Product.find({
      'reviews': { $elemMatch: { 'approved': false } }
    })
    .select('name slug reviews')
    .populate('reviews.user', 'name email avatar');

    console.log('[API pending-reviews] Nombre de produits avec avis en attente :', productsWithPendingReviews.length);
    
    // Debug: afficher les détails des produits trouvés
    productsWithPendingReviews.forEach(product => {
      const pendingCount = product.reviews.filter(r => !r.approved).length;
      console.log(`[API pending-reviews] Produit: ${product.name}, ID: ${product._id}, Avis en attente: ${pendingCount}`);
    });

    // Extraction des avis
    let pendingReviews = [];
    productsWithPendingReviews.forEach(product => {
      const productPending = product.reviews
        .filter(r => !r.approved)
        .map(r => ({
          ...r.toObject(),
          productName: product.name,
          productId: product._id,
          productSlug: product.slug
        }));
      pendingReviews.push(...productPending);
    });

    console.log(`[API pending-reviews] ${pendingReviews.length} avis en attente`);
    return res.status(200).json({
      success: true,
      count: pendingReviews.length,
      data: pendingReviews
    });

  } catch (error) {
    console.error('[API pending-reviews] Erreur serveur :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// On applique d’abord isAuthenticated puis isAdmin
export default isAuthenticated(isAdmin(handler));
