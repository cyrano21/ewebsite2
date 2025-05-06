
import dbConnect from '../../../utils/dbConnect';
import Category from '../../../models/Category';
import Order from '../../../models/Order';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: `Méthode ${req.method} non autorisée` });
  }

  try {
    await dbConnect();

    // Récupérer toutes les catégories
    const categories = await Category.find({ isActive: true });
    
    // Calculer les statistiques des ventes par catégorie
    // Pour l'exemple, nous allons générer des données fictives
    // En production, cette partie devrait être remplacée par une vraie requête agrégée
    
    // Simuler des pourcentages de vente pour chaque catégorie
    const totalCategories = categories.length;
    const categoriesWithStats = categories.map((category, index) => {
      // Générer un pourcentage aléatoire mais en s'assurant que la somme fait 100%
      const basePercentage = 100 / totalCategories;
      const variation = Math.random() * 5 - 2.5; // variation entre -2.5 et +2.5
      
      return {
        _id: category._id,
        name: category.name,
        salesPercentage: Math.max(1, basePercentage + variation)
      };
    });
    
    // Normaliser pour s'assurer que la somme fait exactement 100%
    const totalPercentage = categoriesWithStats.reduce((sum, cat) => sum + cat.salesPercentage, 0);
    const normalizedCategories = categoriesWithStats.map(cat => ({
      ...cat,
      salesPercentage: Math.round((cat.salesPercentage / totalPercentage) * 100)
    }));

    res.status(200).json(normalizedCategories);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques par catégorie:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}
