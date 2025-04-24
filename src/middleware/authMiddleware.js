import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import connectDB from '../config/db';

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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const User = mongoose.models.User || mongoose.model('User', UserSchema);

/**
 * Middleware d'authentification pour les routes API Next.js
 * @param {Function} handler - Gestionnaire de route API Next.js
 * @returns {Function} - Gestionnaire de route avec authentification
 */
export const withAuth = (handler) => {
  return async (req, res) => {
    try {
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
      
      // Ajouter l'utilsateur à la requête
      req.user = user;
      
      // Appeler le gestionnaire de route
      return handler(req, res);
      
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token invalide' });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expiré' });
      }
      
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };
};

/**
 * Middleware d'authentification pour les routes API Next.js qui nécessitent un rôle admin
 * @param {Function} handler - Gestionnaire de route API Next.js
 * @returns {Function} - Gestionnaire de route avec authentification admin
 */
export const withAdminAuth = (handler) => {
  return async (req, res) => {
    try {
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
      
      // Vérifier si l'utilsateur est admin
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé. Vous n\'êtes pas administrateur.' });
      }
      
      // Ajouter l'utilsateur à la requête
      req.user = user;
      
      // Appeler le gestionnaire de route
      return handler(req, res);
      
    } catch (error) {
      console.error('Erreur d\'authentification admin:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token invalide' });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expiré' });
      }
      
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };
};
