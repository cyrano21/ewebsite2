import connectDB from '../../../src/config/db';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Schéma User pour MongoDB (même que dans users/index.js)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profileImage: {
    type: String,
    default: ''
  },
  cloudinaryId: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  phone: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req, res) {
  // Vérifier si la méthode est GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  
  try {
    console.log('API /api/auth/me: Authorization header reçu:', req.headers.authorization);
    // Récupérer le token d'authentification
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Non autorisé. Token manquant.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Connexion à MongoDB
    const conn = await connectDB();
    
    if (!conn) {
      return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
    
    // Récupérer l'utilsateur à partir de l'ID dans le token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'utilsateur non trouvé' });
    }
    
    // Vérifier si l'utilsateur est actif
    if (!user.isActive) {
      return res.status(401).json({ error: 'Compte désactivé. Contactez l\'administrateur.' });
    }
    
    // Renvoyer les informations de l'utilsateur
    return res.status(200).json(user);
    
  } catch (error) {
    console.error('Erreur API me:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
