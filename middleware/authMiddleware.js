// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import connectDB from '../config/db';

// Schéma User pour MongoDB
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Vérifier si le modèle existe déjà
const User = mongoose.models.User || mongoose.model('User', UserSchema);

/**
 * Middleware d'authentification JWT pour les routes API
 * @param {Function} handler - Gestionnaire de route API
 * @returns {Function} - Gestionnaire avec authentification
 */
export const withAuth = (handler) => {
  return async (req, res) => {
    try {
      // Récupérer le token d'authentification
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant' });
      }
      
      const token = authHeader.split(' ')[1];
      
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Connexion à MongoDB
      await connectDB();
      
      // Récupérer l'utilisateur
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      // Vérifier si l'utilisateur est actif
      if (!user.isActive) {
        return res.status(401).json({ error: 'Compte désactivé' });
      }
      
      // Ajouter l'utilisateur à la requête
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
 * Middleware d'authentification JWT pour les routes API réservées aux administrateurs
 * @param {Function} handler - Gestionnaire de route API
 * @returns {Function} - Gestionnaire avec authentification admin
 */
export const withAdminAuth = (handler) => {
  return async (req, res) => {
    try {
      // Récupérer le token d'authentification
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant' });
      }
      
      const token = authHeader.split(' ')[1];
      
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Connexion à MongoDB
      await connectDB();
      
      // Récupérer l'utilisateur
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      // Vérifier si l'utilisateur est actif
      if (!user.isActive) {
        return res.status(401).json({ error: 'Compte désactivé' });
      }
      
      // Vérifier si l'utilisateur est administrateur
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      }
      
      // Ajouter l'utilisateur à la requête
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
