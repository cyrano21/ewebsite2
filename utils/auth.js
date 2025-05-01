import { verify } from 'jsonwebtoken';
import User from 'models/User';

/**
 * Middleware d'authentification pour les API routes Next.js
 * Vérifie le JWT du cookie et attache l'utilisateur à la requête
 */
export function withAuth(handler) {
  return async (req, res) => {
    try {
      // Extraire le token du cookie
      const token = req.cookies.token;
      
      if (!token) {
        return res.status(401).json({ error: 'Non authentifié' });
      }
      
      // Vérifier le token JWT
      const decoded = verify(token, process.env.JWT_SECRET);
      
      // Récupérer l'utilisateur depuis la base de données
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }
      
      // Attacher l'utilisateur à la requête pour une utilisation ultérieure
      req.user = user;
      
      // Continuer avec le gestionnaire d'API
      return handler(req, res);
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return res.status(401).json({ error: 'Authentification invalide' });
    }
  };
}

/**
 * Middleware pour les routes d'administration
 * Vérifie que l'utilisateur est authentifié ET a le rôle admin
 */
export function withAdminAuth(handler) {
  return async (req, res) => {
    try {
      // Extraire le token du cookie
      const token = req.cookies.token;
      
      if (!token) {
        return res.status(401).json({ error: 'Non authentifié' });
      }
      
      // Vérifier le token JWT
      const decoded = verify(token, process.env.JWT_SECRET);
      
      // Récupérer l'utilisateur depuis la base de données
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }
      
      // Vérifier si l'utilisateur est un administrateur
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé: droits d\'administrateur requis' });
      }
      
      // Attacher l'utilisateur à la requête pour une utilisation ultérieure
      req.user = user;
      
      // Continuer avec le gestionnaire d'API
      return handler(req, res);
    } catch (error) {
      console.error('Erreur d\'authentification admin:', error);
      return res.status(401).json({ error: 'Authentification invalide' });
    }
  };
}
