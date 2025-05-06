
import { getSession } from 'next-auth/react';
import jwt from 'jsonwebtoken';

/**
 * API pour générer et récupérer un token JWT à partir d'une session NextAuth
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Récupérer la session NextAuth
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // Générer un token JWT avec les informations de l'utilisateur
    const token = jwt.sign(
      { 
        id: session.user.id,
        email: session.user.email,
        role: session.user.role || 'user' 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Erreur de génération du token:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
