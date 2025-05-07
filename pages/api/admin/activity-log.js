
import connectDB from '../../../config/db';
import AdminActivityLog from '../../../models/AdminActivityLog';

export default async function handler(req, res) {
  // Accepter uniquement les méthodes POST pour l'enregistrement des logs
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  try {
    // Connexion à la base de données
    await connectDB();

    // Extraire les données de la requête
    const {
      url,
      method,
      userAgent,
      referrer,
      userId,
      userType = 'visitor',
      userName = 'Anonymous',
      activityType = 'view',
      description = 'Visite de page',
      objectType,
      objectId
    } = req.body;

    // Analyser l'URL pour déterminer automatiquement le type d'activité si non spécifié
    let detectedActivityType = activityType;
    let detectedObjectType = objectType;
    let detectedDescription = description;

    if (url) {
      if (url.includes('/shop/product/')) {
        detectedActivityType = 'view';
        detectedObjectType = 'product';
        detectedDescription = 'Consultation de page produit';
        
        // Extraire l'ID du produit de l'URL si possible
        const productIdMatch = url.match(/\/product\/([^\/\?]+)/);
        if (productIdMatch && productIdMatch[1] && !objectId) {
          objectId = productIdMatch[1];
        }
      } else if (url.includes('/checkout')) {
        detectedActivityType = 'purchase';
        detectedDescription = 'Processus de paiement';
      } else if (url.includes('/admin/')) {
        detectedActivityType = 'admin_action';
        detectedDescription = 'Action admin';
      } else if (url.includes('/seller/')) {
        detectedActivityType = 'seller_action';
        detectedDescription = 'Action vendeur';
      }
    }

    // Récupérer l'adresse IP du client
    const ipAddress = req.headers['x-forwarded-for'] || 
                      req.headers['x-real-ip'] || 
                      req.connection.remoteAddress;

    // Créer une nouvelle entrée de log
    const logEntry = new AdminActivityLog({
      userId,
      userType,
      userName,
      activityType: detectedActivityType,
      description: detectedDescription,
      objectType: detectedObjectType,
      objectId,
      ipAddress,
      userAgent,
      referrer,
      url,
      method,
      statusCode: 200, // Par défaut
    });

    // Enregistrer le log
    await logEntry.save();

    // Répondre avec succès
    res.status(200).json({ success: true, message: 'Activité enregistrée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'activité:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement de l\'activité', error: error.message });
  }
}
