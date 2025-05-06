// pages/api/products/[id]/reviews/index.js
import dbConnect from '../../../../../utils/dbConnect';
import Product from '../../../../../models/Product';
import { isAuthenticated } from '../../../../../middleware/auth';

const handler = async (req, res) => {
  const { id } = req.query; // ID du produit
  
  // Connexion à la base de données
  await dbConnect();
  
  switch (req.method) {
    case 'GET':
      try {
        // Récupérer le produit avec ses avis
        const product = await Product.findById(id)
          .select('reviews')
          .populate('reviews.user', 'name email avatar');
        
        if (!product) {
          return res.status(404).json({ 
            success: false, 
            message: 'Produit non trouvé' 
          });
        }
        
        // Filtrer les avis pour n'afficher que ceux qui sont approuvés
        const approvedReviews = product.reviews.filter(review => review.approved);
        
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
      
    case 'POST':
      try {
        // Vérifier si l'utilisateur est connecté
        if (!req.user) {
          return res.status(401).json({ 
            success: false, 
            message: 'Vous devez être connecté pour laisser un avis' 
          });
        }
        
        const { rating, comment } = req.body;
        
        // Validation basique
        if (!rating || !comment) {
          return res.status(400).json({ 
            success: false, 
            message: 'La note et le commentaire sont requis' 
          });
        }
        
        // Récupérer le produit
        const product = await Product.findById(id);
        
        if (!product) {
          return res.status(404).json({ 
            success: false, 
            message: 'Produit non trouvé' 
          });
        }
        
        // Vérifier si l'utilisateur a déjà laissé un avis
        const existingReview = product.reviews.find(
          review => review.user.toString() === req.user._id.toString()
        );
        
        if (existingReview) {
          return res.status(400).json({ 
            success: false, 
            message: 'Vous avez déjà laissé un avis pour ce produit' 
          });
        }
        
        // Créer un nouvel avis
        const newReview = {
          user: req.user._id,
          rating: Number(rating),
          comment,
          date: new Date(),
          approved: false // L'avis doit être approuvé par un administrateur
        };
        
        // Ajouter l'avis au produit
        product.reviews.push(newReview);
        
        // Mettre à jour la note moyenne du produit
        const approvedReviews = product.reviews.filter(review => review.approved);
        if (approvedReviews.length > 0) {
          product.rating = approvedReviews.reduce((acc, review) => acc + review.rating, 0) / approvedReviews.length;
        }
        
        // Sauvegarder les modifications
        await product.save();
        
        return res.status(201).json({
          success: true,
          message: 'Votre avis a été soumis avec succès et sera visible après validation'
        });
      } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un avis:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Erreur serveur',
          error: error.message
        });
      }
      
    default:
      return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }
};

// Appliquer le middleware d'authentification
// Nous permettons l'accès même sans authentification, mais req.user sera undefined
export default isAuthenticated(handler);