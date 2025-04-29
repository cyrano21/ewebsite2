// components/admin/ProductManagement/hooks/useProductData.js
import { useState, useEffect, useCallback } from 'react';
// Import shop stats utilities from global utils
import { calculateShopStats, generateProductStats } from '../../../../utils/statsUtils';

export const useProductData = () => {
  const [products, setProducts] = useState([]);
  const [productHistory, setProductHistory] = useState({});
  const [productStats, setProductStats] = useState({});
  const [shopStats, setShopStats] = useState({
    totalProducts: 0, totalStock: 0, totalValue: '0.00', lowStockProducts: 0,
    categoriesDistribution: {}, revenueByCategory: {}, salesTrend: [],
    mostViewedProducts: [], bestSellingProducts: [] // Initialiser les tableaux
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // --- UTILISATION DE FETCH API (CORRIGÉ) ---
      const response = await fetch('/api/products'); // Utiliser votre endpoint API réel
      if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Essayer lire détails erreur
          throw new Error(errorData.message || `Erreur API ${response.status} lors du chargement des produits`);
      }
      const data = await response.json();
      // ------------------------------------------

      if (!Array.isArray(data)) {
          // Si l'API ne retourne pas directement un tableau (ex: { products: [...] })
          // Adaptez cette ligne : const actualData = data.products || [];
          // if (!Array.isArray(actualData)) throw new Error(...)
          // setProducts(actualData);
           throw new Error("Les données reçues de l'API ne sont pas un tableau.");
      }

      setProducts(data); // Mettre à jour avec les données de l'API

      // --- Initialisation Historique et Stats (Logique conservée) ---
      const savedHistory = localStorage.getItem('productHistory');
      const savedStats = localStorage.getItem('productStats');
      const initialHistory = {};
      const initialStats = {};
      data.forEach(product => {
        const id = product.id || product._id; // Utiliser l'ID correct (_id si MongoDB)
        if (id) {
          // Initialiser l'historique du produit
          const historyJson = savedHistory ? JSON.parse(savedHistory) : {};
          initialHistory[id] = historyJson[id] || [];

          // Initialiser les stats du produit
          const statsJson = savedStats ? JSON.parse(savedStats) : {};
          initialStats[id] = statsJson[id] || generateProductStats(product); // Générer si non sauvegardé
        }
      });
      setProductHistory(initialHistory); // Utiliser l'historique chargé/initialisé
      setProductStats(initialStats); // Utiliser les stats chargées/générées
      // Sauvegarder les stats initiales si elles n'existaient pas
      if (!savedStats && Object.keys(initialStats).length > 0) {
        localStorage.setItem('productStats', JSON.stringify(initialStats));
      }
      // --- Fin Initialisation ---

      // Calculer les stats globales de la boutique une fois les données chargées
      setShopStats(calculateShopStats(data));

    } catch (err) {
      console.error('Erreur chargement données produits via API:', err);
      setError(err.message || 'Erreur lors du chargement des données.');
      setProducts([]); // Vider en cas d'erreur
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback sans dépendances pour fetch initial une seule fois

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData est stable grâce à useCallback([])

  // --- Fonctions de mise à jour de l'état local (conservées) ---
  const updateSingleProductState = useCallback((updatedProduct) => {
    setProducts(prevProducts => {
        const newList = prevProducts.map(p => (p.id || p._id) === (updatedProduct.id || updatedProduct._id) ? updatedProduct : p);
        setShopStats(calculateShopStats(newList)); // Recalculer stats globales après MAJ
        return newList;
    });
  }, []); // Pas de dépendances externes nécessaires si calculateShopStats est pur

  const addSingleProductState = useCallback((newProduct) => {
    setProducts(prevProducts => {
        const newList = [...prevProducts, newProduct];
        setShopStats(calculateShopStats(newList)); // Recalculer stats globales après ajout
        return newList;
    });
  }, []);

  const removeSingleProductState = useCallback((productId) => {
    setProducts(prevProducts => {
        const newList = prevProducts.filter(p => (p.id || p._id) !== productId);
        setShopStats(calculateShopStats(newList)); // Recalculer stats globales après suppression
        return newList;
    });
  }, []);

  // --- Mise à jour Historique et Stats (conservée mais avec dépendances correctes) ---
  const updateHistoryAndStats = useCallback((productId, action, details, productDataForStats = null) => {
    setProductHistory(prevHistory => {
        const now = new Date();
        const changeDate = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR');
        const newHistory = { ...prevHistory };
        if (!newHistory[productId]) newHistory[productId] = [];
        newHistory[productId].unshift({ date: changeDate, action, details });
        localStorage.setItem('productHistory', JSON.stringify(newHistory)); // Sauvegarder
        return newHistory;
    });

    setProductStats(prevStats => {
        const newStats = { ...prevStats };
        if (action === 'Suppression') {
            delete newStats[productId];
        } else if (productDataForStats) {
            newStats[productId] = generateProductStats(productDataForStats);
        }
        localStorage.setItem('productStats', JSON.stringify(newStats)); // Sauvegarder
        return newStats;
    });

  }, []); // Ce hook ne dépend plus de l'état externe history/stats directement


  return {
      products,
      setProducts, // Toujours utile pour des opérations spécifiques si besoin
      productHistory,
      productStats,
      shopStats,
      isLoading,
      error,
      fetchData, // Pour re-fetch manuel
      // Fonctions de mise à jour pour le hook de mutation
      updateSingleProductState,
      addSingleProductState,
      removeSingleProductState,
      updateHistoryAndStats
  };
};