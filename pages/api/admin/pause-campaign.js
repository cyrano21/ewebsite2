// pages/api/admin/pause-campaign.js
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

    // Vérification que la campagne est en cours
    if (campaign.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Seules les campagnes en cours peuvent être suspendues'
      });
    }

    // Mise à jour du statut
    campaign.status = 'paused';
    campaign.updatedAt = new Date();
    campaign.updatedBy = user._id;

    await campaign.save();

    return res.status(200).json({
      success: true,
      message: 'Campagne suspendue avec succès',
      updatedCampaign: campaign
    });
  } catch (error) {
    console.error("Erreur lors de la suspension de la campagne:", error);
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la suspension de la campagne"
    });
  }
}