import dbConnect from '../../utils/dbConnect';
import Sponsor from '../../models/Sponsor';
import { isAuthenticated, isAdmin } from '../../middleware/auth';

// Fonction pour vérifier si une requête doit être protégée par authentification
const shouldBeProtected = (method) => {
  return method === 'POST' || method === 'PUT' || method === 'DELETE';
};

// Handler principal pour les différentes méthodes HTTP
const handler = async (req, res) => {
  const { method } = req;

  try {
    // Envelopper la connexion à la base de données dans un try-catch
    await dbConnect();

    switch (method) {
      case 'GET':
        try {
          const sponsors = await Sponsor.find({});
          return res.status(200).json(sponsors);
        } catch (error) {
          console.error('Erreur lors de la récupération des sponsors:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération des sponsors', 
            error: error.message 
          });
        }

      case 'POST':
        try {
          // Vérifier si l'utilisateur est admin
          if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ 
              success: false, 
              message: 'Accès non autorisé. Seuls les administrateurs peuvent ajouter des sponsors.' 
            });
          }

          const sponsor = await Sponsor.create(req.body);
          return res.status(201).json({ success: true, data: sponsor });
        } catch (error) {
          if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ 
              success: false, 
              message: messages.join(', ') 
            });
          }
          console.error('Erreur lors de la création du sponsor:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la création du sponsor', 
            error: error.message 
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ 
          success: false, 
          message: `Méthode ${method} non autorisée` 
        });
    }
  } catch (error) {
    // Gestion des erreurs de connexion à la base de données
    console.error('Erreur de connexion à la base de données:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur de connexion à la base de données', 
      error: error.message 
    });
  }
};

// Wrapper conditionnel pour l'authentification
export default function apiHandler(req, res) {
  const { method } = req;
  
  // Pour les méthodes qui modifient les données, exiger une authentification
  if (shouldBeProtected(method)) {
    return isAuthenticated(handler)(req, res);
  }
  
  // Sinon, permettre l'accès public
  return handler(req, res);
}
