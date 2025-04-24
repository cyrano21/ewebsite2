import connectDB from '../../../src/config/db';
import mongoose from 'mongoose';
import { withAdminAuth } from '../../../src/middleware/authMiddleware';

// Définition du schéma Category pour MongoDB
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  cloudinaryId: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function handler(req, res) {
  try {
    // Connexion à MongoDB
    const conn = await connectDB();
    
    if (!conn) {
      return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
    
    switch (req.method) {
      case 'GET':
        // Récupérer toutes les catégories ou filtrer par statut
        const { active } = req.query;
        let query = {};
        
        if (active === 'true') {
          query.isActive = true;
        } else if (active === 'false') {
          query.isActive = false;
        }
        
        const categories = await Category.find(query).sort({ order: 1, name: 1 });
        return res.status(200).json(categories);
        
      case 'POST':
        // Vérifier si la requête vient d'un administrateur (déjà fait par withAdminAuth)
        
        // Créer une nouvelle catégorie
        const { name, slug, description, imageUrl, cloudinaryId, isActive, order } = req.body;
        
        // Vérifier si la catégorie existe déjà
        const existingCategory = await Category.findOne({ 
          $or: [{ name }, { slug }]
        });
        
        if (existingCategory) {
          return res.status(400).json({ error: 'Une catégorie avec ce nom ou ce slug existe déjà' });
        }
        
        const newCategory = new Category({
          name,
          slug,
          description,
          imageUrl,
          cloudinaryId,
          isActive,
          order
        });
        
        await newCategory.save();
        return res.status(201).json(newCategory);
        
      default:
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur API catégories:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Appliquer le middleware d'authentification admin pour les méthodes POST
export default function(req, res) {
  if (req.method === 'POST') {
    return withAdminAuth(handler)(req, res);
  } else {
    return handler(req, res);
  }
}
