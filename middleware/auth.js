// middleware/auth.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cookie from 'cookie';
import connectDB from '../utils/dbConnect';

// Définition du schéma User si nécessaire
const User = mongoose.models.User || mongoose.model('User', {
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'admin', 'seller'], default: 'user' },
  isActive: { type: Boolean, default: true }
});

/**
 * Middleware pour vérifier l'authentification de l'utilisateur
 */
export const isAuthenticated = (handler) => {
  return async (req, res) => {
    try {
      // 1) Récupérer le token dans l'en-tête Authorization OU dans le cookie
      const authHeader = req.headers.authorization;
      let token = null;

      // ** Contrôle : si pas de Bearer token dans le header, on renvoie 401**
      if (!authHeader?.startsWith('Bearer ')) {
        console.log('[Auth] Authorization absent ou mal formé :', authHeader);
        return res.status(401).json({ success: false, message: 'Token manquant' });
      }

      // 2) Extraire le token
      token = authHeader.split(' ')[1];
      console.log('[Auth] Token reçu :', token);

      // 3) Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('[Auth] JWT décodé :', decoded);

      // 4) Connexion à la base et récupération de l’utilisateur
      await connectDB();
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('[Auth] Aucun utilisateur correspondant à cet ID');
        return res.status(401).json({ success: false, message: 'Utilisateur introuvable' });
      }
      if (!user.isActive) {
        console.log('[Auth] Compte désactivé:', user._id);
        return res.status(401).json({ success: false, message: 'Compte désactivé' });
      }

      // 5) Attacher l’utilisateur à la requête et passer au handler
      req.user = user;
      return handler(req, res);

    } catch (error) {
      console.error('[Auth] Erreur d’authentification :', error);
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
      }
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  };
};

/**
 * Middleware pour vérifier le rôle admin
 */
export const isAdmin = (handler) => {
  return async (req, res) => {
    if (!req.user) {
      console.log('[Auth] Tentative d’accès admin sans user');
      return res.status(401).json({ success: false, message: 'Accès non autorisé' });
    }
    if (req.user.role !== 'admin') {
      console.log('[Auth] Privilèges insuffisants pour user:', req.user._id);
      return res.status(403).json({ success: false, message: 'Privilèges insuffisants' });
    }
    return handler(req, res);
  };
};
