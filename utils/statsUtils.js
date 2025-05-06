// components/admin/ProductManagement/utils/statsUtils.js

// Fonction pour obtenir une couleur pour la catégorie
export const getCategoryColor = (index, availableColors = null) => {
    const defaultColors = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#d63384'];
    const colors = availableColors || defaultColors;
    return colors[index % colors.length];
};

// Fonction pour formater les nombres
export const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    // Ajoute des espaces comme séparateurs de milliers
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};


// Fonction pour générer des statistiques réalistes pour UN produit
export const generateProductStats = (product) => {
    if (!product) return {};

    const ratings = product.ratings || 0;
    const ratingsCount = product.ratingsCount || 0;
    const price = product.price || 1;
    const stock = product.stock || 0;

    // Facteurs pour simuler des variations
    const getCategoryMultiplier = (category) => {
        const multipliers = { 'Électronique': 1.5, 'Vêtements': 1.3, 'Maison': 1.2, /* ... autres */ 'Non classé': 0.8 };
        return multipliers[category] || 1.0;
    };
    const categoryMultiplier = getCategoryMultiplier(product.category || 'Non classé');
    const popularityFactor = (ratings * ratingsCount) / 5; // Basé sur les notes

    // Calculs Stats Principales
    const baseViews = Math.max(10, Math.floor(popularityFactor * 50 * categoryMultiplier + Math.random() * 50));
    const priceConversionFactor = Math.max(0.1, 1.2 - (price / 150)); // Ajuster la sensibilité au prix
    const baseSales = Math.max(1, Math.floor(baseViews * 0.03 * priceConversionFactor * categoryMultiplier + Math.random() * 5)); // Taux de conversion de base ~3%
    const conversionRate = baseViews > 0 ? ((baseSales / baseViews) * 100).toFixed(1) : '0.0';
    const revenue = (baseSales * price);
    // Marge brute simulée (ajuster le multiplicateur si nécessaire)
    const profitMargin = (revenue * 0.35);
    // Rotation = Ventes sur une période / Stock moyen sur la période. Ici, on simplifie.
    const stockTurnover = stock > 0 ? ((baseSales * 12) / (stock + baseSales)).toFixed(2) : 'N/A'; // Rotation annuelle estimée grossièrement

    // Données Hebdomadaires
    const viewsBaseWeek = baseViews / 4.3; // Vues moyennes par semaine
    const salesBaseWeek = baseSales / 4.3; // Ventes moyennes par semaine
    const lastWeekData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dailyVariation = 0.7 + Math.random() * 0.6;
      const views = Math.max(0, Math.floor(viewsBaseWeek / 7 * dailyVariation));
      const sales = Math.max(0, Math.floor(salesBaseWeek / 7 * dailyVariation));
      return {
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), // Format date plus court
        views,
        sales,
        revenue: (sales * price).toFixed(2) // Revenu journalier
      };
    });

    // Tendance (simple comparaison semaine vs semaine précédente simulée)
    const viewsTrend = ((Math.random() - 0.4) * 15).toFixed(1); // +/- 15% simulé
    const salesTrend = ((Math.random() - 0.5) * 20).toFixed(1); // +/- 20% simulé

    // Rang compétitif simulé
    const competitionRank = Math.floor(1 + Math.random() * 19);

    return {
      totalViews: baseViews,
      totalSales: baseSales,
      conversionRate,
      revenue: revenue.toFixed(2),
      profitMargin: profitMargin.toFixed(2),
      stockTurnover,
      lastWeekData,
      viewsTrend,
      salesTrend,
      competitionRank,
      lastUpdated: new Date().toISOString() // Date de génération/mise à jour
    };
};


// Calculer les statistiques globales de la boutique
export const calculateShopStats = (productList) => {
  if (!Array.isArray(productList)) productList = [];

  const totalProducts = productList.length;
  const totalStock = productList.reduce((sum, product) => sum + (product.stock || 0), 0);
  // Calcul de la valeur: prend en compte le prix de vente si disponible, sinon le prix normal
  const totalValue = productList.reduce((sum, product) => {
       const priceToUse = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
       return sum + ((priceToUse || 0) * (product.stock || 0));
   }, 0);
  const lowStockProducts = productList.filter(product => (product.stock || 0) <= 10).length; // Seuil configurable

  // Distribution Catégories
  const categoriesDistribution = {};
  productList.forEach(product => {
    const category = product.category || 'Non classé';
    categoriesDistribution[category] = (categoriesDistribution[category] || 0) + 1;
  });

  // Revenus par Catégorie (Basé sur une estimation de ventes)
  const revenueByCategory = {};
  productList.forEach(product => {
    const category = product.category || 'Non classé';
    const stats = generateProductStats(product); // Utiliser les stats générées pour estimer les ventes
    const productRevenue = parseFloat(stats.revenue || 0);
    revenueByCategory[category] = (revenueByCategory[category] || 0) + productRevenue;
  });

   // Tendance des Ventes Globales (simulation sur 7 jours)
   // Somme des ventes simulées de tous les produits pour chaque jour
   const salesTrend = Array.from({ length: 7 }).map((_, i) => {
       const date = new Date();
       date.setDate(date.getDate() - (6 - i));
       let dailySales = 0;
       let dailyRevenue = 0;
       productList.forEach(product => {
           const stats = generateProductStats(product); // Recalculer les stats individuelles
           const dayData = stats.lastWeekData.find(d => d.date === date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short'}));
           if (dayData) {
               dailySales += dayData.sales;
               dailyRevenue += parseFloat(dayData.revenue);
           }
       });
       return {
           date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
           ventes: dailySales,
           revenus: dailyRevenue
       };
   });


  return {
    totalProducts,
    totalStock,
    totalValue: totalValue.toFixed(2),
    lowStockProducts,
    categoriesDistribution,
    // mostViewed/bestSelling sont complexes à calculer sans vraies données, on les omet pour l'instant
    // mostViewedProducts: [],
    // bestSellingProducts: [],
    revenueByCategory,
    salesTrend
  };
};