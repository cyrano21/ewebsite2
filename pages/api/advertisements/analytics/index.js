import dbConnect from '../../../../utils/dbConnect';
import Advertisement from '../../../../models/Advertisement';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { method } = req;
  
  // Connexion à la base de données
  await dbConnect();
  
  // Vérifier l'authentification et les autorisations
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ success: false, message: 'Non autorisé - Veuillez vous connecter' });
  }
  
  // Vérifier si l'utilisateur est un administrateur
  if (session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Accès refusé - Privilèges administrateur requis' });
  }

  // Seule la méthode GET est autorisée pour cette route
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: `Méthode ${method} non autorisée` });
  }

  try {
    // Paramètres de filtrage
    const { 
      startDate, endDate, types, positions, 
      status, sortBy = 'analytics.impressions', 
      sortOrder = 'desc', limit = 10 
    } = req.query;
    
    // Construire le filtre
    const query = {};
    
    // Filtrer par date
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Filtrer par type
    if (types) {
      const typeArray = types.split(',');
      query.type = { $in: typeArray };
    }
    
    // Filtrer par position
    if (positions) {
      const positionArray = positions.split(',');
      query.position = { $in: positionArray };
    }
    
    // Filtrer par statut
    if (status) {
      query.status = status;
    }
    
    // Déterminant le tri
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // ============================
    // 1. Statistiques générales
    // ============================
    const totalStats = await Advertisement.aggregate([
      { $match: query },
      { $group: {
          _id: null,
          totalImpressions: { $sum: '$analytics.impressions' },
          totalClicks: { $sum: '$analytics.clicks' },
          totalConversions: { $sum: '$analytics.conversions' },
          totalBudget: { $sum: '$budget.total' },
          totalSpent: { $sum: '$budget.spent' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // ============================
    // 2. Statistiques par type de publicité
    // ============================
    const statsByType = await Advertisement.aggregate([
      { $match: query },
      { $group: {
          _id: '$type',
          impressions: { $sum: '$analytics.impressions' },
          clicks: { $sum: '$analytics.clicks' },
          conversions: { $sum: '$analytics.conversions' },
          ctr: { $avg: '$analytics.ctr' },
          count: { $sum: 1 }
        }
      },
      { $sort: { impressions: -1 } }
    ]);
    
    // ============================
    // 3. Statistiques par position
    // ============================
    const statsByPosition = await Advertisement.aggregate([
      { $match: query },
      { $group: {
          _id: '$position',
          impressions: { $sum: '$analytics.impressions' },
          clicks: { $sum: '$analytics.clicks' },
          conversions: { $sum: '$analytics.conversions' },
          ctr: { $avg: '$analytics.ctr' },
          count: { $sum: 1 }
        }
      },
      { $sort: { impressions: -1 } }
    ]);
    
    // ============================
    // 4. Tendances dans le temps
    // ============================
    // Déplier les statistiques quotidiennes pour analyse
    const dailyTrends = await Advertisement.aggregate([
      { $match: query },
      { $unwind: '$analytics.dailyStats' },
      { $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$analytics.dailyStats.date' }
          },
          impressions: { $sum: '$analytics.dailyStats.impressions' },
          clicks: { $sum: '$analytics.dailyStats.clicks' },
          conversions: { $sum: '$analytics.dailyStats.conversions' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // ============================
    // 5. Top publicités
    // ============================
    const topAds = await Advertisement.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .select('name type position analytics budget startDate endDate status');
    
    res.status(200).json({
      success: true,
      data: {
        overview: totalStats.length ? totalStats[0] : {
          totalImpressions: 0,
          totalClicks: 0,
          totalConversions: 0,
          totalBudget: 0,
          totalSpent: 0,
          count: 0
        },
        statsByType,
        statsByPosition,
        dailyTrends,
        topAds
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des analyses:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
}
