// components/admin/ProductManagement/utils/statsUtils.js

import { getCategoryColor, formatNumber, generateProductStats } from '../../../../utils/statsUtils';

// Calculer les statistiques globales de la boutique
export const calculateShopStats = (productList) => {
    if (!Array.isArray(productList)) productList = [];
  
    const totalProducts = productList.length;
    const totalStock = productList.reduce((sum, product) => sum + (product.stock || 0), 0);
    const totalValue = productList.reduce((sum, product) => {
         const priceToUse = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
         return sum + ((priceToUse || 0) * (product.stock || 0));
     }, 0);
    const lowStockProducts = productList.filter(product => (product.stock || 0) <= 10).length;
  
    const categoriesDistribution = {};
    productList.forEach(product => {
      const category = product.category || 'Non classé';
      categoriesDistribution[category] = (categoriesDistribution[category] || 0) + 1;
    });
  
    const revenueByCategory = {};
    productList.forEach(product => {
      const category = product.category || 'Non classé';
      // Utiliser les stats générées pour une estimation plus cohérente
      const stats = generateProductStats(product);
      const productRevenue = parseFloat(stats.revenue || 0);
      revenueByCategory[category] = (revenueByCategory[category] || 0) + productRevenue;
    });
  
     const salesTrend = Array.from({ length: 7 }).map((_, i) => {
         const date = new Date(); date.setDate(date.getDate() - (6 - i));
         let dailySales = 0; let dailyRevenue = 0;
         productList.forEach(product => {
             const stats = generateProductStats(product);
             const dayData = stats.lastWeekData.find(d => d.date === date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short'}));
             if (dayData) { dailySales += dayData.sales; dailyRevenue += parseFloat(dayData.revenue); }
         });
         return { date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), ventes: dailySales, revenus: dailyRevenue };
     });
  
     // --- AJOUT : Calcul Most Viewed ---
     const mostViewedProducts = [...productList]
       // Trier par une métrique de "vues" (simulée ici par ratingsCount pour l'exemple)
       .sort((a, b) => (b.ratingsCount || 0) - (a.ratingsCount || 0))
       .slice(0, 5) // Top 5
       .map(product => ({
         id: product.id || product._id,
         name: product.name,
         // Utiliser la bonne clé pour l'image
         img: product.imgUrl || product.img || product.image || '/assets/placeholder.jpg',
         // Afficher la métrique utilisée pour le tri (ou une autre simulation)
         metricValue: product.ratingsCount || 0,
         metricLabel: 'avis' // Ou 'vues' si vous simulez différemment
       }));
  
     // --- AJOUT : Calcul Best Selling ---
     const bestSellingProducts = [...productList]
       // Trier par une métrique de "ventes" (simulée ici par score note*nb_avis)
       .sort((a, b) => ((b.ratingsCount || 0) * (b.ratings || 0)) - ((a.ratingsCount || 0) * (a.ratings || 0)))
       .slice(0, 5) // Top 5
       .map(product => {
          // Calculer un nombre de ventes simulé pour l'affichage
          const stats = generateProductStats(product);
          return {
              id: product.id || product._id,
              name: product.name,
              img: product.imgUrl || product.img || product.image || '/assets/placeholder.jpg',
              metricValue: stats.totalSales || 0, // Afficher les ventes simulées
              metricLabel: 'ventes'
          };
        });
  
    return {
      totalProducts,
      totalStock,
      totalValue: totalValue.toFixed(2),
      lowStockProducts,
      categoriesDistribution,
      revenueByCategory,
      salesTrend,
      mostViewedProducts, // << Inclure dans l'objet retourné
      bestSellingProducts, // << Inclure dans l'objet retourné
    };
  };

// Ré-exporter les utilitaires pour les composants
export { getCategoryColor, formatNumber, generateProductStats };