import dbConnect from '../../../utils/dbConnect';
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

    // Récupérer l'année demandée ou utiliser l'année en cours
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Pour l'exemple, nous allons générer des données fictives
    // En production, cette partie devrait être remplacée par une vraie requête agrégée

    // Créer un tableau des ventes mensuelles
    const monthlySales = Array(12).fill(0).map(() => Math.floor(Math.random() * 100) + 50);

    res.status(200).json({
      success: true,
      year,
      monthlySales
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes mensuelles:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}