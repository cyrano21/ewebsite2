import connectDB from '../../../src/config/db';
import mongoose from 'mongoose';
import { withAuth } from '../../../src/middleware/authMiddleware';

// Définition du schéma Review pour MongoDB
const ReviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

async function handler(req, res) {
  try {
    // Connexion à MongoDB
    const conn = await connectDB();
    
    if (!conn) {
      return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
    
    switch (req.method) {
      case 'GET':
        // Récupérer tous les avis ou filtrer par produit
        const { productId, approved } = req.query;
        let query = {};
        
        if (productId) {
          query.product = productId;
        }
        
        if (approved === 'true') {
          query.isApproved = true;
        } else if (approved === 'false') {
          query.isApproved = false;
        }
        
        const reviews = await Review.find(query)
          .populate('user', 'name profileImage')
          .sort({ createdAt: -1 });
          
        return res.status(200).json(reviews);
        
      case 'POST':
        // Créer un nouvel avis
        const { product, rating, comment } = req.body;
        
        // Vérifier si l'utilsateur a déjà laissé un avis pour ce produit
        const existingReview = await Review.findOne({
          product,
          user: req.user._id
        });
        
        if (existingReview) {
          return res.status(400).json({ error: 'Vous avez déjà laissé un avis pour ce produit' });
        }
        
        const newReview = new Review({
          product,
          user: req.user._id,
          rating,
          comment,
          isApproved: false // Par défaut, les avis doivent être approuvés
        });
        
        await newReview.save();
        
        // Mettre à jour la note moyenne du produit
        await updateProductRating(product);
        
        return res.status(201).json(newReview);
        
      default:
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur API avis:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Fonction pour mettre à jour la note moyenne d'un produit
async function updateProductRating(productId) {
  try {
    // Récupérer tous les avis approuvés pour ce produit
    const reviews = await Review.find({
      product: productId,
      isApproved: true
    });
    
    if (reviews.length === 0) {
      return;
    }
    
    // Calculer la note moyenne
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Mettre à jour la note du produit
    const Product = mongoose.models.Product;
    if (Product) {
      await Product.findByIdAndUpdate(productId, {
        rating: averageRating
      });
    }
  } catch (error) {
    console.error('Erreur de mise à jour de la note du produit:', error);
  }
}

// Appliquer le middleware d'authentification pour les méthodes POST
export default function(req, res) {
  if (req.method === 'POST') {
    return withAuth(handler)(req, res);
  } else {
    return handler(req, res);
  }
}
