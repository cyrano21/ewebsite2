import connectDB from '../../../src/config/db';
import mongoose from 'mongoose';

// Définition du schéma Blog pour MongoDB
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  cloudinaryId: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  author: {
    type: String,
    required: false,
    default: 'Admin'
  },
  date: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: [String],
    default: []
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

export default async function handler(req, res) {
  try {
    // Connexion à MongoDB
    const conn = await connectDB();
    
    if (!conn) {
      return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
    
    switch (req.method) {
      case 'GET':
        // Récupérer tous les blogs
        const blogs = await Blog.find({}).sort({ date: -1 });
        return res.status(200).json(blogs);
        
      case 'POST':
        // Créer un nouveau blog
        const newBlog = new Blog(req.body);
        await newBlog.save();
        return res.status(201).json(newBlog);
        
      default:
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur API blogs:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
