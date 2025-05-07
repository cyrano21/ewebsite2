
// middleware/adminCheck.js
/**
 * Middleware pour vérifier si l'utilisateur est un administrateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante dans la chaîne middleware
 */
export function checkAdminRole(req, res, next) {
  // Vérification que l'utilisateur est un administrateur
  const session = req.session || (req.headers && req.headers.session);
  
  if (!session || !session.user || session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Accès non autorisé' });
  }
  
  // Si l'utilisateur est admin, continuer
  next();
}

/**
 * Middleware pour vérifier l'authentification et le rôle admin en une étape
 * Peut être utilisé directement comme middleware dans les routes API
 */
export default function isAdmin(handler) {
  return async (req, res) => {
    // Vérification que l'utilisateur est un administrateur
    if (!req.session || !req.session.user || req.session.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }
    
    return handler(req, res);
  };
}
