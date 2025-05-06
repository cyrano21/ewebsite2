
import dbConnect from '../../../utils/dbConnect';
import Supplier from '../../../models/Supplier';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getSession({ req });
  await dbConnect();

  // Vérifier l'authentification
  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const supplier = await Supplier.findById(id);
        
        if (!supplier) {
          return res.status(404).json({ success: false, message: 'Fournisseur non trouvé' });
        }
        
        res.status(200).json({ success: true, data: supplier });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const supplier = await Supplier.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!supplier) {
          return res.status(404).json({ success: false, message: 'Fournisseur non trouvé' });
        }

        res.status(200).json({ success: true, data: supplier });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedSupplier = await Supplier.findByIdAndDelete(id);

        if (!deletedSupplier) {
          return res.status(404).json({ success: false, message: 'Fournisseur non trouvé' });
        }

        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Méthode non supportée' });
      break;
  }
}
