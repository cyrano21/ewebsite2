
import dbConnect from '../../../utils/dbConnect';
import Supplier from '../../../models/Supplier';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  await dbConnect();

  // Vérifier l'authentification pour toutes les routes sauf GET
  if (req.method !== 'GET') {
    if (!session || !session.user.isAdmin) {
      return res.status(401).json({ success: false, message: 'Non autorisé' });
    }
  }

  switch (req.method) {
    case 'GET':
      try {
        const suppliers = await Supplier.find({});
        res.status(200).json(suppliers);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json({ success: true, data: supplier });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Méthode non supportée' });
      break;
  }
}
