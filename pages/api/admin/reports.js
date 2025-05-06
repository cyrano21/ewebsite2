// pages/api/admin/reports.js
import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/User';
import { isAuthenticated, isAdmin } from '../../../middleware/auth';

// Helper pour formater les données par mois
const formatMonthlyData = (data, startDate, endDate) => {
  const months = [];
  const currentDate = new Date(startDate);
  
  // Créer un tableau de tous les mois dans la plage de dates
  while (currentDate <= new Date(endDate)) {
    months.push(new Date(currentDate).toISOString().split('T')[0].substring(0, 7)); // Format YYYY-MM
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  // Initialiser le tableau de résultats avec des zéros
  const result = months.map(month => ({
    month,
    total: 0,
    count: 0,
    averageBasket: 0,
    growth: 0
  }));
  
  // Calculer les totaux par mois
  data.forEach(item => {
    const monthKey = new Date(item.createdAt).toISOString().split('T')[0].substring(0, 7);
    const monthIndex = months.indexOf(monthKey);
    
    if (monthIndex !== -1) {
      result[monthIndex].total += item.total;
      result[monthIndex].count += 1;
    }
  });
  
  // Calculer les moyennes et les taux de croissance
  for (let i = 0; i < result.length; i++) {
    // Calculer le panier moyen
    if (result[i].count > 0) {
      result[i].averageBasket = +(result[i].total / result[i].count).toFixed(2);
    }
    
    // Calculer le taux de croissance par rapport au mois précédent
    if (i > 0 && result[i-1].total > 0) {
      result[i].growth = +((result[i].total - result[i-1].total) / result[i-1].total * 100).toFixed(2);
    }
  }
  
  return result;
};

// Helper pour formater les noms des mois en français
const getMonthName = (monthNum) => {
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return months[monthNum];
};

// Fonction principale pour générer les rapports
const generateReports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }
  
  try {
    await dbConnect();
    
    // Récupérer les paramètres de requête
    const { type, start, end } = req.query;
    
    // Valider les dates
    const startDate = start ? new Date(start) : new Date(new Date().getFullYear(), 0, 1);
    const endDate = end ? new Date(end) : new Date();
    
    // S'assurer que endDate inclut la fin de la journée
    endDate.setHours(23, 59, 59, 999);
    
    // Préparer l'objet de réponse
    const response = {
      success: true,
      type,
      dateRange: { start: startDate, end: endDate },
    };
    
    // Générer les rapports en fonction du type demandé
    switch (type) {
      case 'ventes': {
        // Récupérer les commandes dans la plage de dates
        const orders = await Order.find({
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $ne: 'cancelled' }
        }).populate('items.product', 'category');
        
        // Formater les données mensuelles
        const monthlyData = formatMonthlyData(orders, startDate, endDate);
        
        // Préparer les données pour le graphique d'évolution des ventes
        const salesData = {
          labels: monthlyData.map(m => getMonthName(new Date(m.month + '-01').getMonth())),
          datasets: [{
            label: 'Ventes mensuelles (€)',
            data: monthlyData.map(m => m.total),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        };
        
        // Calculer les ventes par catégorie
        const salesByCategory = {};
        let totalProcessed = 0;
        
        orders.forEach(order => {
          order.items.forEach(item => {
            if (item.product && item.product.category) {
              const categoryId = item.product.category.toString();
              if (!salesByCategory[categoryId]) {
                salesByCategory[categoryId] = 0;
              }
              salesByCategory[categoryId] += item.price * item.quantity;
              totalProcessed += item.price * item.quantity;
            }
          });
        });
        
        // Récupérer les noms des catégories
        const categoryIds = Object.keys(salesByCategory);
        const categories = await Product.find(
          { 'category': { $in: categoryIds } },
          { 'category': 1 }
        ).populate('category', 'name');
        
        // Créer un mapping des IDs de catégories vers les noms
        const categoryMap = {};
        categories.forEach(product => {
          if (product.category && product.category._id) {
            categoryMap[product.category._id.toString()] = product.category.name;
          }
        });
        
        // Préparer les données pour le graphique de répartition par catégorie
        const productCategoryData = {
          labels: Object.keys(salesByCategory).map(catId => categoryMap[catId] || 'Catégorie inconnue'),
          datasets: [{
            data: Object.values(salesByCategory),
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)'
            ]
          }]
        };
        
        response.salesData = salesData;
        response.productCategoryData = productCategoryData;
        response.monthlyDetails = monthlyData.map(m => ({
          month: getMonthName(new Date(m.month + '-01').getMonth()),
          total: m.total.toFixed(2),
          count: m.count,
          averageBasket: m.averageBasket.toFixed(2),
          growth: m.growth
        }));
        
        break;
      }
      
      case 'produits': {
        // Récupérer les commandes pour cette période
        const orders = await Order.find({
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $ne: 'cancelled' }
        }).populate('items.product', 'name');
        
        // Calculer les ventes par produit
        const productSales = {};
        
        orders.forEach(order => {
          order.items.forEach(item => {
            const productId = item.product ? item.product._id.toString() : item.id;
            const productName = item.product ? item.product.name : item.name;
            
            if (!productSales[productId]) {
              productSales[productId] = {
                id: productId,
                name: productName,
                quantity: 0,
                revenue: 0
              };
            }
            
            productSales[productId].quantity += item.quantity;
            productSales[productId].revenue += item.price * item.quantity;
          });
        });
        
        // Convertir en tableau et trier par quantité vendue
        const topProducts = Object.values(productSales)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 10);
        
        // Préparer les données pour le graphique des produits
        const productData = {
          labels: topProducts.map(p => p.name),
          datasets: [{
            label: 'Ventes unitaires',
            data: topProducts.map(p => p.quantity),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          }, {
            label: 'Revenus (€)',
            data: topProducts.map(p => p.revenue),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            yAxisID: 'revenue'
          }]
        };
        
        response.productData = productData;
        response.topProducts = topProducts;
        
        break;
      }
      
      case 'clients': {
        // Récupérer les données des clients par mois
        const userRegistrations = await User.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" }
              },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { "_id.year": 1, "_id.month": 1 }
          }
        ]);
        
        // Récupérer les commandes pour calculer les commandes par client
        const orders = await Order.find({
          createdAt: { $gte: startDate, $lte: endDate },
          user: { $exists: true, $ne: null }
        });
        
        // Calculer les commandes par client et le taux de fidélisation
        const customerOrders = {};
        
        orders.forEach(order => {
          const userId = order.user.toString();
          
          if (!customerOrders[userId]) {
            customerOrders[userId] = [];
          }
          
          customerOrders[userId].push({
            date: order.createdAt,
            total: order.total
          });
        });
        
        // Calculer le nombre de clients ayant fait plus d'une commande
        const totalCustomers = Object.keys(customerOrders).length;
        const repeatCustomers = Object.values(customerOrders).filter(orders => orders.length > 1).length;
        
        // Calculer le taux de fidélisation mois par mois
        const months = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          months.push(new Date(currentDate).toISOString().split('T')[0].substring(0, 7));
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        const retentionRates = months.map(month => {
          const monthStart = new Date(month + '-01');
          const monthEnd = new Date(new Date(monthStart).setMonth(monthStart.getMonth() + 1) - 1);
          
          // Trouver les commandes pour ce mois
          const monthlyOrders = orders.filter(order => 
            order.createdAt >= monthStart && order.createdAt <= monthEnd
          );
          
          // Compter les clients uniques pour ce mois
          const uniqueCustomers = new Set(monthlyOrders.map(order => order.user.toString()));
          
          // Compter les clients qui ont déjà commandé avant
          let repeatCustomersCount = 0;
          uniqueCustomers.forEach(userId => {
            const customerOrderDates = customerOrders[userId].map(order => order.date);
            const previousOrders = customerOrderDates.filter(date => date < monthStart);
            if (previousOrders.length > 0) {
              repeatCustomersCount++;
            }
          });
          
          // Calculer le taux de fidélisation (ou 0 si pas de clients)
          const retentionRate = uniqueCustomers.size > 0 
            ? (repeatCustomersCount / uniqueCustomers.size) * 100
            : 0;
          
          return {
            month: getMonthName(monthStart.getMonth()),
            retentionRate: Math.round(retentionRate)
          };
        });
        
        // Formater les données pour les graphiques
        const newCustomersData = {
          labels: userRegistrations.map(item => getMonthName(item._id.month - 1)),
          datasets: [{
            label: 'Nouveaux clients',
            data: userRegistrations.map(item => item.count),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }]
        };
        
        const retentionData = {
          labels: retentionRates.map(item => item.month),
          datasets: [{
            label: 'Taux de fidélisation (%)',
            data: retentionRates.map(item => item.retentionRate),
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1
          }]
        };
        
        response.newCustomersData = newCustomersData;
        response.retentionData = retentionData;
        response.customerStats = {
          totalCustomers,
          repeatCustomers,
          retentionRate: totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0
        };
        
        break;
      }
      
      default:
        return res.status(400).json({ success: false, message: 'Type de rapport non valide' });
    }
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Erreur lors de la génération des rapports:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la génération des rapports', error: error.message });
  }
};

export default isAuthenticated(isAdmin(generateReports));