// pages/api/admin/start-campaign.js
import dbConnect from "../../../utils/dbConnect";
import Campaign from "../../../models/Campaign";
import auth from "../../../middleware/auth";
import isAdmin from "../../../middleware/isAdmin";

export default async function handler(req, res) {
  try {
    // Vérifier que la méthode est POST
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
    }

    // Connexion à la base de données
    await dbConnect();

    // Vérification des droits d'administrateur
    const user = await auth(req, res);
    if (!user) return;

    const admin = await isAdmin(req, res);
    if (!admin) return;

    const { campaignId } = req.body;

    // Vérification du paramètre requis
    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: 'ID de campagne requis'
      });
    }

    // Récupération de la campagne
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campagne non trouvée'
      });
    }

    // Vérification que la campagne peut être démarrée
    if (campaign.status === 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'La campagne est déjà en cours d\'exécution'
      });
    }

    if (campaign.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de redémarrer une campagne terminée'
      });
    }

    // Mise à jour du statut
    campaign.status = 'in_progress';
    campaign.startedAt = new Date();
    campaign.updatedAt = new Date();
    campaign.updatedBy = user._id;

    await campaign.save();

    // Logique pour déclencher les envois d'emails ici
    // Cette partie dépend de votre implémentation existante
    // Vous pourriez utiliser une fonction asynchrone, une file d'attente, etc.

    return res.status(200).json({
      success: true,
      message: 'Campagne démarrée avec succès',
      updatedCampaign: campaign
    });
  } catch (error) {
    console.error("Erreur lors du démarrage de la campagne:", error);
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors du démarrage de la campagne"
    });
  }
}