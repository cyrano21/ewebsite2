import { getSession } from 'next-auth/react';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }
    
    // Connecter à la base de données
    await dbConnect();
    
    // Récupérer les informations de l'utilisateur
    const userId = session.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    // Renvoyer les informations de l'utilisateur
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Erreur dans /api/auth/me:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}
