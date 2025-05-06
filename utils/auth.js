import jwt from 'jsonwebtoken';
import { connectToDatabase } from './db';
import { ObjectId } from 'mongodb';

/**
 * Vérifie l'authentification d'une requête à partir du token JWT
 * @param {Object} req - Objet requête Express/Next.js
 * @returns {Object} - Résultat de la vérification contenant success, message et user
 */
export async function verifyAuth(req) {
  try {
    // Extraire le token du header Authorization
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return { 
        success: false, 
        message: 'Token d\'authentification manquant' 
      };
    }
    
    // Vérifier le token JWT
    const secret = process.env.JWT_SECRET || 'votre_clé_secrète_par_défaut';
    
    try {
      const decodedToken = jwt.verify(token, secret);
      
      // Optionnel: Vérifier l'utilisateur dans la base de données
      const { db } = await connectToDatabase();
      const userId = decodedToken.id || decodedToken._id;
      
      // Vérifier que l'ID utilisateur est valide
      if (!userId) {
        return { 
          success: false, 
          message: 'Token invalide: ID utilisateur manquant' 
        };
      }
      
      let objectId;
      try {
        objectId = new ObjectId(userId);
      } catch (error) {
        return { 
          success: false, 
          message: 'ID utilisateur invalide' 
        };
      }
      
      const user = await db.collection('users').findOne({ _id: objectId });
      
      if (!user) {
        return { 
          success: false, 
          message: 'Utilisateur non trouvé' 
        };
      }
      
      // Ajouter le rôle de l'utilisateur s'il n'existe pas dans le token
      if (!decodedToken.role && user.role) {
        decodedToken.role = user.role;
      }
      
      return { 
        success: true, 
        user: { ...user, ...decodedToken }
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Token invalide: ${error.message}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `Erreur d'authentification: ${error.message}` 
    };
  }
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 * @param {Object} user - Objet utilisateur
 * @param {String|Array} roles - Rôle(s) requis pour l'accès
 * @returns {Boolean} - True si l'utilisateur a le rôle requis
 */
export function hasRole(user, roles) {
  if (!user || !user.role) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
}

/**
 * Middleware d'authentification pour les API routes
 * @param {Function} handler - Handler de l'API route
 * @returns {Function} - Middleware d'authentification
 */
export function withAuth(handler) {
  return async (req, res) => {
    const authResult = await verifyAuth(req);
    
    if (!authResult.success) {
      return res.status(401).json({ 
        error: authResult.message || 'Non autorisé' 
      });
    }
    
    // Ajouter l'utilisateur à la requête pour les handlers suivants
    req.user = authResult.user;
    
    // Continuer avec le handler de l'API route
    return handler(req, res);
  };
}
