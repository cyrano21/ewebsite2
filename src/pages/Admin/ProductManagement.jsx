import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Pagination, Badge, Modal, OverlayTrigger, Tooltip, Tabs, Tab, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Importer PropTypes pour la validation des props
import PageHeader from '../../components/PageHeader';
// Supposons que productImages n'est plus utilisé directement ici si les images viennent des données
// import { productImages } from '../../utilis/imageImports';
import productsData from '../../products.json'; // Importation des données réelles de produits

// Placeholder image URL
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300/f8f9fa/6c757d?text=Aper%C3%A7u';

const ProductManagement = () => {
  // États pour gérer les produits et la pagination
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // États pour le modal d'ajout/modification de produit
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    img: '', // Garde l'URL de l'image existante ou la nouvelle URL après upload
    imgPreview: PLACEHOLDER_IMAGE, // Pour l'aperçu dans le modal
    imgFile: null, // Pour stocker le fichier image sélectionné
    ratings: 0,
    ratingsCount: 0,
    seller: ''
  });
  const [lastModified, setLastModified] = useState(null); // Pour afficher la date de dernière modif dans le modal

  // État pour le modal de prévisualisation rapide
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);

  // Historique des modifications
  const [productHistory, setProductHistory] = useState({});

  // État pour les statistiques des produits
  const [productStats, setProductStats] = useState({});

  // État pour les statistiques globales de la boutique
  const [shopStats, setShopStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
    lowStockProducts: 0,
    categoriesDistribution: {},
    mostViewedProducts: [],
    bestSellingProducts: [],
    revenueByCategory: {},
    salesTrend: []
  });

  // Utilisation de useLocation pour récupérer les paramètres d'URL
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const editProductId = queryParams.get('edit');

  // Référence pour le champ de fichier caché
  const fileInputRef = useRef(null);

  // Obtenir les catégories uniques à partir des données de produits et du localStorage
  const [availableCategories, setAvailableCategories] = useState(['Tous']);

  useEffect(() => {
    const loadCategories = () => {
      const savedCategories = localStorage.getItem('productCategories');
      let uniqueCategories;
      if (savedCategories) {
        uniqueCategories = JSON.parse(savedCategories);
      } else {
        uniqueCategories = [...new Set(productsData.map(product => product.category))];
        localStorage.setItem('productCategories', JSON.stringify(uniqueCategories));
      }
      // Assurer que 'Non classé' est toujours une option si nécessaire
      if (!uniqueCategories.includes('Non classé')) {
         uniqueCategories.push('Non classé');
      }
      setAvailableCategories(['Tous', ...uniqueCategories.sort()]);
    };
    loadCategories();
  }, []); // Charger une seule fois au montage


  // Filtrer les produits en fonction de la recherche et de la catégorie
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Logique de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Gestionnaires d'événements
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Revenir à la première page lors d'une nouvelle recherche
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Revenir à la première page lors d'un changement de catégorie
  };

  const resetCurrentProduct = () => {
    setCurrentProduct({
      id: null,
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      img: '',
      imgPreview: PLACEHOLDER_IMAGE,
      imgFile: null,
      ratings: 0,
      ratingsCount: 0,
      seller: ''
    });
     setLastModified(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetCurrentProduct(); // Réinitialiser le formulaire à la fermeture

    // Effacer le paramètre d'URL si présent
    if (editProductId) {
      navigate('/admin/products');
    }
  };

  const handleShowAddModal = () => {
    resetCurrentProduct(); // Assurer un état propre
    setModalTitle('Ajouter un nouveau produit');
    setShowModal(true);
  };

  const handleShowEditModal = (product) => {
    setModalTitle('Modifier le produit');
    setCurrentProduct({
      ...product,
      imgPreview: product.img || PLACEHOLDER_IMAGE, // Utiliser l'image existante pour l'aperçu
      imgFile: null // Réinitialiser le fichier sélectionné
    });
    // Trouver la dernière modif dans l'historique
    const history = productHistory[product.id];
    const lastMod = history && history.length > 0 ? history[0].date : null;
    setLastModified(lastMod);

    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Traiter les nombres spécifiquement
    if (name === 'price' || name === 'stock' || name === 'ratings' || name === 'ratingsCount') {
      processedValue = value === '' ? '' : Number(value); // Permet de vider le champ, sinon le convertit en nombre
    }

    setCurrentProduct(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      const productToDelete = products.find(product => product.id === id);
      if (!productToDelete) return;

      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);

      // Ajouter une entrée à l'historique
      const now = new Date();
      const changeDate = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR');

      const newHistory = { ...productHistory };
      if (!newHistory[id]) {
        newHistory[id] = [];
      }
      newHistory[id].unshift({
        date: changeDate,
        action: 'Suppression',
        details: `Produit "${productToDelete.name}" supprimé`
      });
      setProductHistory(newHistory);
      localStorage.setItem('productHistory', JSON.stringify(newHistory));

      // Supprimer les stats associées
      const newStats = { ...productStats };
      delete newStats[id];
      setProductStats(newStats);
      localStorage.setItem('productStats', JSON.stringify(newStats));

      alert('Produit supprimé avec succès!');

      // Mettre à jour les statistiques globales de la boutique
      calculateShopStats(updatedProducts);
    }
  };

  // Fonction pour voir le produit sur la boutique
  const handleViewOnShop = (productId) => {
    // Rediriger vers la page de détail du produit dans la boutique
    window.open(`/shop/${productId}`, '_blank');
  };

  // Gestionnaires pour la prévisualisation rapide
  const handleShowPreviewModal = (product) => {
    setPreviewProduct(product);
    setShowPreviewModal(true);
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewProduct(null);
  };

  // Charger les données initiales
  useEffect(() => {
    // Simuler le chargement depuis une source de données (JSON ici)
    const formattedProducts = productsData.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category || 'Non classé', // Assigner 'Non classé' si catégorie vide
      price: parseFloat(product.price) || 0,
      stock: parseInt(product.stock, 10) || 0,
      img: product.img || '',
      ratings: parseFloat(product.ratings) || 0,
      ratingsCount: parseInt(product.ratingsCount, 10) || 0,
      seller: product.seller || 'Inconnu',
      description: product.description || ''
    }));
    setProducts(formattedProducts);

    // Charger l'historique et les stats
    const savedHistory = localStorage.getItem('productHistory');
    const savedStats = localStorage.getItem('productStats');

    const initialHistory = {};
    const initialStats = {};

    formattedProducts.forEach(product => {
        // Initialiser l'historique si non trouvé dans localStorage
        if (!savedHistory || !JSON.parse(savedHistory)[product.id]) {
            initialHistory[product.id] = [];
        }
        // Initialiser les stats si non trouvées dans localStorage
        if (!savedStats || !JSON.parse(savedStats)[product.id]) {
            initialStats[product.id] = generateProductStats(product);
        }
    });

    // Fusionner avec les données sauvegardées
    setProductHistory(savedHistory ? { ...initialHistory, ...JSON.parse(savedHistory) } : initialHistory);
    setProductStats(savedStats ? { ...initialStats, ...JSON.parse(savedStats) } : initialStats);

     // Sauvegarder les stats initiales si elles n'existaient pas
    if (!savedStats) {
        localStorage.setItem('productStats', JSON.stringify(initialStats));
    }


    // Si un ID de produit à éditer est dans l'URL, ouvrir le modal d'édition
    if (editProductId) {
      const productToEdit = formattedProducts.find(p => p.id.toString() === editProductId.toString());
      if (productToEdit) {
        handleShowEditModal(productToEdit);
      } else {
        console.warn(`Produit avec ID ${editProductId} non trouvé pour l'édition.`);
        navigate('/admin/products'); // Rediriger si l'ID n'est pas valide
      }
    }

    // Calculer les statistiques globales
    calculateShopStats(formattedProducts);

  }, [editProductId, navigate]); // Dépendance ajoutée pour réagir aux changements d'URL

  // Sauvegarder les produits dans localStorage à chaque modification (pour la persistance de démo)
  useEffect(() => {
      // On ne sauvegarde pas les produits ici car ils viennent de products.json
      // Mais on pourrait le faire si c'était une vraie appli CRUD sans backend
      // localStorage.setItem('products', JSON.stringify(products));
  }, [products]);


  // Calculer les statistiques globales de la boutique
  const calculateShopStats = (productList) => {
    const totalProducts = productList.length;
    const totalStock = productList.reduce((sum, product) => sum + (product.stock || 0), 0);
    const totalValue = productList.reduce((sum, product) => sum + ((product.price || 0) * (product.stock || 0)), 0).toFixed(2);
    const lowStockProducts = productList.filter(product => (product.stock || 0) <= 10).length;

    const categoriesDistribution = {};
    productList.forEach(product => {
        const category = product.category || 'Non classé';
        categoriesDistribution[category] = (categoriesDistribution[category] || 0) + 1;
    });

    const mostViewedProducts = [...productList]
      .sort((a, b) => (b.ratingsCount || 0) - (a.ratingsCount || 0))
      .slice(0, 5)
      .map(product => ({
        id: product.id,
        name: product.name,
        img: product.img,
        views: Math.floor((product.ratingsCount || 0) * 10 + Math.random() * 100)
      }));

    const bestSellingProducts = [...productList]
      .sort((a, b) => ((b.ratingsCount || 0) * (b.ratings || 0)) - ((a.ratingsCount || 0) * (a.ratings || 0)))
      .slice(0, 5)
      .map(product => ({
        id: product.id,
        name: product.name,
        img: product.img,
        sales: Math.floor((product.ratingsCount || 0) * 0.7 + Math.random() * 20)
      }));

    const revenueByCategory = {};
    productList.forEach(product => {
        const category = product.category || 'Non classé';
        const productRevenue = (product.price || 0) * Math.floor((product.ratingsCount || 0) * 0.7);
        revenueByCategory[category] = (revenueByCategory[category] || 0) + productRevenue;
    });

    const salesTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        ventes: Math.floor(50 + Math.random() * 30),
        revenus: Math.floor(2000 + Math.random() * 1000)
      };
    });

    setShopStats({
      totalProducts,
      totalStock,
      totalValue,
      lowStockProducts,
      categoriesDistribution,
      mostViewedProducts,
      bestSellingProducts,
      revenueByCategory,
      salesTrend
    });
  };

  // Fonction pour générer des statistiques plus réalistes pour un produit
  const generateProductStats = (product) => {
    const ratings = product.ratings || 0;
    const ratingsCount = product.ratingsCount || 0;
    const price = product.price || 1; // Eviter division par zéro
    const stock = product.stock || 0;

    const popularityFactor = (ratings * ratingsCount) / 5;
    const categoryMultiplier = getCategoryMultiplier(product.category || 'Non classé');
    const baseViews = Math.max(10, Math.floor(popularityFactor * 50 * categoryMultiplier + Math.random() * 50)); // Min 10 vues

    const priceConversionFactor = Math.max(0.3, 1.5 - (price / 100));
    const baseSales = Math.max(1, Math.floor(baseViews * 0.05 * priceConversionFactor + Math.random() * 5)); // Min 1 vente

    const conversionRate = baseViews > 0 ? ((baseSales / baseViews) * 100).toFixed(1) : '0.0';

    let viewsBase = baseViews / 30;
    let salesBase = baseSales / 30;

    const lastWeekData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const trendFactor = 1 + (i * 0.03);
      const dailyVariation = 0.8 + (Math.random() * 0.4);
      const dailyViews = Math.max(0, Math.floor(viewsBase * trendFactor * dailyVariation));
      const dailySales = Math.max(0, Math.floor(dailyViews * (baseSales / Math.max(1, baseViews)) * dailyVariation));
      return {
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        vues: dailyViews,
        ventes: dailySales,
        revenus: dailySales * price
      };
    });

    const viewsStartPeriod = lastWeekData[0].vues;
    const viewsEndPeriod = lastWeekData[6].vues;
    const viewsTrend = viewsStartPeriod > 0 ? (((viewsEndPeriod - viewsStartPeriod) / viewsStartPeriod) * 100).toFixed(1) : '0.0';

    const salesStartPeriod = lastWeekData[0].ventes;
    const salesEndPeriod = lastWeekData[6].ventes;
    const salesTrend = salesStartPeriod > 0 ? (((salesEndPeriod - salesStartPeriod) / salesStartPeriod) * 100).toFixed(1) : '0.0';

    const stockTurnoverBase = stock + baseSales;
    const stockTurnover = stockTurnoverBase > 0 ? Math.min(99.9, (baseSales / stockTurnoverBase * 100)).toFixed(1) : '0.0';

    return {
      totalViews: baseViews,
      totalSales: baseSales,
      conversionRate: conversionRate,
      revenue: (baseSales * price).toFixed(2),
      lastWeekData: lastWeekData,
      viewsTrend: viewsTrend,
      salesTrend: salesTrend,
      popularityScore: Math.min(10, (popularityFactor * 2 + Math.random())).toFixed(1), // Plafonner à 10
      stockTurnover: stockTurnover,
      lastUpdated: new Date().toISOString(),
      competitionRank: Math.floor(Math.random() * 20) + 1,
      categoryAvgPrice: (price * (0.8 + Math.random() * 0.4)).toFixed(2),
      categoryAvgConversion: Math.max(1, (3 + Math.random() * 2)).toFixed(1) // Min 1%
    };
  };

  // Obtenir un multiplicateur pour chaque catégorie (certaines catégories sont plus populaires)
  const getCategoryMultiplier = (category) => {
    const multipliers = {
      'Électronique': 1.5,
      'Vêtements': 1.3,
      'Maison': 1.0,
      'Sports': 1.2,
      'Livres': 0.8,
      'Jouets': 1.1,
      'Non classé': 0.7
    };
    return multipliers[category] || 1;
  };

  // Fonction pour mettre à jour les statistiques quand un produit est modifié
  const updateProductStats = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const updatedStats = generateProductStats(product);
      const newStats = { ...productStats, [productId]: updatedStats };
      setProductStats(newStats);
      localStorage.setItem('productStats', JSON.stringify(newStats));
    }
  };

  // Soumission du formulaire d'ajout/modification
  const handleSubmitProduct = (e) => {
    e.preventDefault();
    const now = new Date();
    const changeDate = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR');

    // Validation simple (champs requis)
    if (!currentProduct.name || !currentProduct.category || currentProduct.price === '' || currentProduct.stock === '') {
        alert('Veuillez remplir tous les champs obligatoires (*)');
        return;
    }

    // Logique d'upload d'image (simulation)
    // Dans une vraie app, on uploaderait currentProduct.imgFile ici
    // et on mettrait à jour currentProduct.img avec l'URL retournée par le serveur.
    // Pour la démo, si imgFile existe, on utilise son URL objet, sinon l'URL existante.
    const finalImageUrl = currentProduct.imgFile ? currentProduct.imgPreview : (currentProduct.img || '');

    const productDataToSave = {
        ...currentProduct,
        img: finalImageUrl, // Utiliser l'URL finale
        // Nettoyer les propriétés temporaires
        imgPreview: undefined,
        imgFile: undefined,
    };
    // Assurer que les nombres sont bien des nombres
    productDataToSave.price = parseFloat(productDataToSave.price) || 0;
    productDataToSave.stock = parseInt(productDataToSave.stock, 10) || 0;
    productDataToSave.ratings = parseFloat(productDataToSave.ratings) || 0;
    productDataToSave.ratingsCount = parseInt(productDataToSave.ratingsCount, 10) || 0;


    if (currentProduct.id) {
      // Mise à jour
      const updatedProducts = products.map(product =>
        product.id === currentProduct.id ? productDataToSave : product
      );
      setProducts(updatedProducts);

      const newHistory = { ...productHistory };
      if (!newHistory[currentProduct.id]) newHistory[currentProduct.id] = [];
      newHistory[currentProduct.id].unshift({
        date: changeDate,
        action: 'Modification',
        details: 'Mise à jour des informations'
      });
      setProductHistory(newHistory);
      localStorage.setItem('productHistory', JSON.stringify(newHistory));

      updateProductStats(currentProduct.id);
      alert('Produit mis à jour avec succès!');
    } else {
      // Ajout
      const newProduct = {
        ...productDataToSave,
        id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, // ID unique plus robuste
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);

      const newHistory = { ...productHistory };
      newHistory[newProduct.id] = [{
        date: changeDate,
        action: 'Création',
        details: 'Produit ajouté'
      }];
      setProductHistory(newHistory);
      localStorage.setItem('productHistory', JSON.stringify(newHistory));

      const newStats = { ...productStats };
      newStats[newProduct.id] = generateProductStats(newProduct);
      setProductStats(newStats);
      localStorage.setItem('productStats', JSON.stringify(newStats));

      alert('Produit ajouté avec succès!');
    }

    // Mettre à jour les stats globales après ajout/modif
    calculateShopStats(currentProduct.id ? products.map(p => p.id === currentProduct.id ? productDataToSave : p) : [...products, { ...productDataToSave, id: 'temp' }]); // Recalculer avec les nouvelles données

    handleCloseModal();
  };


  // Fonction pour formater les nombres
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Composant Indicateur de Variation
  const VariationIndicator = ({ value, suffix = '%' }) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return <span className="text-muted">-</span>;

    if (numValue > 0) {
      return <span className="text-success small"><i className="icofont-arrow-up"></i> {value}{suffix}</span>;
    } else if (numValue < 0) {
      return <span className="text-danger small"><i className="icofont-arrow-down"></i> {Math.abs(numValue)}{suffix}</span>;
    } else {
      return <span className="text-muted small">0{suffix}</span>;
    }
  };
  VariationIndicator.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    suffix: PropTypes.string
  };

  // Composant Barre de Progression
  const ProgressBar = ({ value, max, title }) => {
    const numValue = parseFloat(value) || 0;
    const numMax = parseFloat(max) || 100;
    const percentage = numMax > 0 ? Math.min(Math.max((numValue / numMax) * 100, 0), 100) : 0;
    let barColor = 'bg-success';
    if (percentage < 30) barColor = 'bg-danger';
    else if (percentage < 70) barColor = 'bg-warning';

    return (
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1 small">
          <span>{title}</span>
          <span>{formatNumber(numValue)} / {formatNumber(numMax)}</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div
            className={`progress-bar ${barColor}`}
            role="progressbar"
            style={{ width: `${percentage}%` }}
            aria-valuenow={numValue}
            aria-valuemin="0"
            aria-valuemax={numMax}
          ></div>
        </div>
      </div>
    );
  };
  ProgressBar.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired
  };

  // --- Gestion des Catégories ---
  const [categoryModal, setCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [editingCategory, setEditingCategory] = useState({ oldName: null, name: '' });

  const handleShowCategoryModal = () => {
    setCategoryModal(true);
    setNewCategory('');
    setCategoryError('');
    setEditingCategory({ oldName: null, name: '' });
  };

  const handleCloseCategoryModal = () => setCategoryModal(false);

  const updateCategoriesStateAndStorage = (newCategoriesList) => {
      const sortedUniqueCategories = [...new Set(newCategoriesList)].sort();
      setAvailableCategories(['Tous', ...sortedUniqueCategories]);
      localStorage.setItem('productCategories', JSON.stringify(sortedUniqueCategories));
  };

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();
    if (!trimmedCategory) {
      setCategoryError('Le nom ne peut pas être vide.');
      return;
    }
    const currentCategories = availableCategories.filter(cat => cat !== 'Tous');
    if (currentCategories.map(c => c.toLowerCase()).includes(trimmedCategory.toLowerCase())) {
      setCategoryError('Cette catégorie existe déjà.');
      return;
    }
    updateCategoriesStateAndStorage([...currentCategories, trimmedCategory]);
    setNewCategory('');
    setCategoryError('');
    // alert('Catégorie ajoutée!'); // Peut-être un peu intrusif, la fermeture suffit
  };

  const handleEditCategory = (categoryName) => {
    setEditingCategory({ oldName: categoryName, name: categoryName });
    setNewCategory('');
    setCategoryError('');
  };

  const handleCancelEditCategory = () => {
      setEditingCategory({ oldName: null, name: '' });
      setCategoryError('');
  };

  const handleUpdateCategory = () => {
    const trimmedNewName = editingCategory.name.trim();
    if (!trimmedNewName) {
      setCategoryError('Le nom ne peut pas être vide.');
      return;
    }
    const currentCategories = availableCategories.filter(cat => cat !== 'Tous');
    // Vérifier si le nouveau nom existe déjà (en ignorant l'ancien nom)
    if (trimmedNewName.toLowerCase() !== editingCategory.oldName.toLowerCase() &&
        currentCategories.map(c => c.toLowerCase()).includes(trimmedNewName.toLowerCase())) {
      setCategoryError('Ce nom de catégorie existe déjà.');
      return;
    }

    // Mettre à jour la liste
    const updatedCategoriesList = currentCategories.map(cat =>
      cat === editingCategory.oldName ? trimmedNewName : cat
    );
    updateCategoriesStateAndStorage(updatedCategoriesList);

    // Mettre à jour les produits concernés
    const updatedProducts = products.map(product => {
      if (product.category === editingCategory.oldName) {
        return { ...product, category: trimmedNewName };
      }
      return product;
    });
    setProducts(updatedProducts);

    // Mettre à jour la catégorie sélectionnée si elle était éditée
    if (selectedCategory === editingCategory.oldName) {
        setSelectedCategory(trimmedNewName);
    }
    // Mettre à jour la catégorie dans le produit en cours d'édition dans le modal principal
    if (showModal && currentProduct.category === editingCategory.oldName) {
        setCurrentProduct(prev => ({ ...prev, category: trimmedNewName }));
    }


    handleCancelEditCategory(); // Réinitialiser l'édition
    // alert('Catégorie mise à jour!');
  };


  const handleDeleteCategory = (categoryName) => {
    if (categoryName === 'Non classé') {
        alert('La catégorie "Non classé" ne peut pas être supprimée.');
        return;
    }
    const productsUsingCategory = products.filter(p => p.category === categoryName);
    let confirmMessage = `Supprimer la catégorie "${categoryName}" ?`;
    if (productsUsingCategory.length > 0) {
      confirmMessage += `\n\n${productsUsingCategory.length} produit(s) utilise(nt) cette catégorie. Ils seront assignés à "Non classé".`;
    }

    if (window.confirm(confirmMessage)) {
      // Mettre à jour les produits vers 'Non classé'
      const updatedProducts = products.map(product => {
        if (product.category === categoryName) {
          return { ...product, category: 'Non classé' };
        }
        return product;
      });
      setProducts(updatedProducts);

      // Supprimer la catégorie de la liste
      const updatedCategoriesList = availableCategories.filter(cat => cat !== 'Tous' && cat !== categoryName);
      updateCategoriesStateAndStorage(updatedCategoriesList);

      // Si la catégorie supprimée était sélectionnée, passer à 'Tous'
      if (selectedCategory === categoryName) {
          setSelectedCategory('Tous');
      }
       // Si la catégorie supprimée était dans le produit en cours d'édition, changer pour 'Non classé'
      if (showModal && currentProduct.category === categoryName) {
        setCurrentProduct(prev => ({ ...prev, category: 'Non classé' }));
      }

      // alert('Catégorie supprimée!');
    }
  };


  // --- Gestion Image Upload ---
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validImageTypes.includes(file.type)) {
      alert('Format d\'image non valide. Utilisez JPG, PNG, GIF ou WEBP.');
      e.target.value = ''; // Réinitialiser l'input file
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5 MB
      alert('L\'image est trop volumineuse (max 5 MB).');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentProduct(prev => ({
        ...prev,
        imgPreview: reader.result, // Mettre à jour l'aperçu avec le Data URL
        imgFile: file, // Stocker le fichier pour la soumission
        img: '' // Optionnel: Vider l'ancienne URL texte si on upload une nouvelle image
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
      setCurrentProduct(prev => ({
        ...prev,
        imgPreview: PLACEHOLDER_IMAGE,
        imgFile: null,
        img: '' // Supprimer aussi l'URL texte
      }));
      // Réinitialiser l'input file au cas où
      if(fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // Fonction pour obtenir une couleur pour la catégorie (pour stats globales)
  const getCategoryColor = (index) => {
    const colors = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#d63384'];
    return colors[index % colors.length];
  };


  return (
    <div>
      <PageHeader title="Gestion des Produits" curPage="Admin / Produits" />

      {/* Section Statistiques Globales */}
      <Container fluid className="py-4">
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            {/* ... (code des stats globales inchangé) ... */}
             <h5 className="mb-3">Aperçu de la boutique</h5>
            <Row>
              <Col md={3} sm={6} className="mb-3">
                <div className="stat-card p-3 rounded bg-light-primary border">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="mb-1">{shopStats.totalProducts}</h3>
                      <p className="text-muted mb-0 small">Produits Actifs</p>
                    </div>
                    <div className="stat-icon">
                      <i className="icofont-box fs-2 text-primary opacity-75"></i>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <div className="stat-card p-3 rounded bg-light-success border">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="mb-1">{formatNumber(shopStats.totalStock)}</h3>
                      <p className="text-muted mb-0 small">Articles en Stock</p>
                    </div>
                    <div className="stat-icon">
                      <i className="icofont-cubes fs-2 text-success opacity-75"></i>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <div className="stat-card p-3 rounded bg-light-warning border">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="mb-1">{formatNumber(shopStats.totalValue)}€</h3>
                      <p className="text-muted mb-0 small">Valeur du Stock</p>
                    </div>
                    <div className="stat-icon">
                      <i className="icofont-euro fs-2 text-warning opacity-75"></i>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <div className="stat-card p-3 rounded bg-light-danger border">
                   <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="mb-1">{shopStats.lowStockProducts}</h3>
                      <p className="text-muted mb-0 small">Stock Faible (&lt;10)</p>
                    </div>
                    <div className="stat-icon">
                      <i className="icofont-warning-alt fs-2 text-danger opacity-75"></i>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={8} className="mb-3 mb-md-0">
                <Card className="h-100 border-light shadow-sm">
                 <Card.Header className="bg-light py-2">
                    <h6 className="mb-0 fw-normal">Tendance des ventes - 7 derniers jours</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="sales-trend-chart" style={{ height: '180px' }}>
                      <div className="simple-chart">
                        {shopStats.salesTrend.map((day, index) => (
                           <OverlayTrigger
                            key={index}
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-sales-${index}`}>
                                <strong>{day.date}:</strong> {day.ventes} ventes ({formatNumber(day.revenus)}€)
                              </Tooltip>
                            }
                          >
                            <div className="chart-column">
                              <div
                                className="bar-revenue bg-primary"
                                style={{ height: `${Math.min(100, (day.revenus / 3000) * 100)}%`, marginBottom: '2px' }}
                              ></div>
                              <div
                                className="bar-sales bg-info opacity-75"
                                style={{ height: `${Math.min(60, (day.ventes / 80) * 60)}%`}}
                              ></div>
                              <div className="day-label">{day.date}</div>
                            </div>
                          </OverlayTrigger>
                        ))}
                      </div>
                       <div className="chart-legend d-flex justify-content-center small mt-2">
                          <div className="me-3"><span className="legend-indicator bg-primary"></span> Revenus</div>
                          <div><span className="legend-indicator bg-info"></span> Ventes</div>
                        </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                 <Card className="h-100 border-light shadow-sm">
                   <Card.Header className="bg-light py-2">
                    <h6 className="mb-0 fw-normal">Produits par catégorie</h6>
                  </Card.Header>
                  <Card.Body className="pt-2">
                    <div className="category-distribution">
                      {Object.entries(shopStats.categoriesDistribution)
                        .sort(([, countA], [, countB]) => countB - countA) // Trier par nombre de produits
                        .map(([category, count], index) => (
                        <div key={index} className="mb-2">
                          <div className="d-flex justify-content-between small mb-1">
                            <span>{category}</span>
                            <span>{count} ({((count / shopStats.totalProducts) * 100).toFixed(0)}%)</span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${(count / shopStats.totalProducts) * 100}%`,
                                backgroundColor: getCategoryColor(index)
                              }}
                              aria-valuenow={count}
                              aria-valuemin="0"
                              aria-valuemax={shopStats.totalProducts}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

             {/* Removed "Most Viewed" and "Best Selling" for brevity, can be added back if needed */}

          </Card.Body>
        </Card>

        {/* Entête Actions et Filtres */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row className="gy-3 align-items-center">
              {/* Titre et Boutons d'action */}
              <Col md={6}>
                <h5 className="mb-0">Liste des Produits ({filteredProducts.length})</h5>
              </Col>
              <Col md={6}>
                <div className="d-flex justify-content-md-end gap-2">
                  <Button variant="primary" onClick={handleShowAddModal}>
                    <i className="icofont-plus-circle me-1"></i> Ajouter
                  </Button>
                  <Button variant="secondary" onClick={handleShowCategoryModal}>
                    <i className="icofont-tags me-1"></i> Gérer Catégories
                  </Button>
                  {/* <Button variant="outline-secondary" disabled>
                    <i className="icofont-download me-1"></i> Exporter
                  </Button> */}
                </div>
              </Col>

              {/* Filtres */}
              <Col lg={5} md={6}>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="icofont-search-1"></i>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Rechercher par nom..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </Col>
              <Col lg={3} md={6}>
                <Form.Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  aria-label="Filtrer par catégorie"
                >
                  {availableCategories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Col>
               <Col lg={4} className="text-lg-end text-muted small">
                    Affichage de {filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredProducts.length)} sur {filteredProducts.length} produit(s)
               </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tableau des Produits */}
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="ps-3" style={{ width: '50px' }}>#</th>
                  <th style={{ width: '70px' }}>Image</th>
                  <th>Nom du produit</th>
                  <th>Catégorie</th>
                  <th className='text-end'>Prix</th>
                  <th className='text-center'>Stock</th>
                  <th className='text-center'>Évaluations</th>
                  <th className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((product, index) => (
                    <tr key={product.id}>
                      <td className="ps-3 text-muted">{indexOfFirstItem + index + 1}</td>
                      <td>
                        <img
                            src={product.img || PLACEHOLDER_IMAGE}
                            alt={product.name}
                            className="img-thumbnail"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                        />
                      </td>
                      <td className='fw-bold'>{product.name}</td>
                      <td>
                        <Badge bg="secondary" className="fw-normal">{product.category || 'Non classé'}</Badge>
                      </td>
                      <td className='text-end'>{product.price?.toFixed(2)} €</td>
                       <td className='text-center'>
                        <Badge
                          bg={product.stock <= 0 ? 'danger' : product.stock <= 10 ? 'warning' : 'success'}
                          className="px-2 py-1 fw-normal"
                        >
                          {product.stock}
                        </Badge>
                      </td>
                      <td className='text-center'>
                        <div className="d-inline-flex align-items-center">
                            <span className="text-warning me-1">
                             {[...Array(5)].map((_, i) => (
                                <i key={i} className={`icofont-star ${i < Math.round(product.ratings || 0) ? '' : 'text-muted'}`}></i>
                            ))}
                            </span>
                          <small className="text-muted">({product.ratingsCount || 0})</small>
                        </div>
                      </td>
                      <td className="text-end pe-3">
                         <OverlayTrigger placement="top" overlay={<Tooltip>Voir sur la boutique</Tooltip>}>
                            <Button
                            variant="link"
                            className="btn-icon text-info p-1 me-1"
                            onClick={() => handleViewOnShop(product.id)}
                            >
                            <i className="icofont-external-link fs-5"></i>
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Prévisualiser</Tooltip>}>
                            <Button
                            variant="link"
                            className="btn-icon text-secondary p-1 me-1"
                            onClick={() => handleShowPreviewModal(product)}
                            >
                            <i className="icofont-eye-alt fs-5"></i>
                            </Button>
                        </OverlayTrigger>
                         <OverlayTrigger placement="top" overlay={<Tooltip>Modifier</Tooltip>}>
                            <Button
                            variant="link"
                            className="btn-icon text-primary p-1 me-1"
                            onClick={() => handleShowEditModal(product)}
                            >
                            <i className="icofont-ui-edit fs-5"></i>
                            </Button>
                         </OverlayTrigger>
                         <OverlayTrigger placement="top" overlay={<Tooltip>Supprimer</Tooltip>}>
                            <Button
                            variant="link"
                            className="btn-icon text-danger p-1"
                            onClick={() => handleDeleteProduct(product.id)}
                            >
                            <i className="icofont-ui-delete fs-5"></i>
                            </Button>
                         </OverlayTrigger>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      <i className="icofont-ban fs-1 d-block mb-2"></i>
                      Aucun produit ne correspond à vos critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card.Footer className="bg-white border-top-0 pt-0">
              <div className="d-flex justify-content-center">
                <Pagination size="sm">
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {/* Simplification pour beaucoup de pages */}
                   {currentPage > 2 && <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>}
                   {currentPage > 3 && <Pagination.Ellipsis disabled />}

                   {currentPage > 1 && <Pagination.Item onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</Pagination.Item>}
                   <Pagination.Item active>{currentPage}</Pagination.Item>
                   {currentPage < totalPages && <Pagination.Item onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</Pagination.Item>}

                   {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}
                   {currentPage < totalPages - 1 && <Pagination.Item onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>}

                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            </Card.Footer>
          )}
        </Card>
      </Container>

      {/* ============================================================ */}
      {/* ============ MODAL AJOUT/MODIFICATION (REFONTE) ============ */}
      {/* ============================================================ */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl" backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`icofont-${currentProduct.id ? 'edit' : 'plus-circle'} me-2`}></i>
            {modalTitle}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitProduct} noValidate> {/* Ajout de noValidate pour gérer la validation manuellement si besoin */}
          <Modal.Body className="p-0"> {/* Enlever padding pour coller les colonnes */}
             <Row className="g-0"> {/* g-0 pour enlever les gouttières */}

                {/* Colonne Gauche: Image Preview */}
                <Col md={4} className="bg-light border-end p-4 d-flex flex-column">
                    <h5 className="mb-3 text-center"><i className="icofont-image me-2"></i>Image du produit</h5>
                    <div className="image-preview-container text-center mb-3 flex-grow-1 d-flex align-items-center justify-content-center">
                         <img
                            src={currentProduct.imgPreview || PLACEHOLDER_IMAGE}
                            alt="Aperçu"
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: '300px', maxWidth: '100%' }}
                            onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                         />
                    </div>
                    <div className="d-grid gap-2">
                         <Button variant="primary" onClick={triggerImageUpload} className="rounded-pill">
                            <i className="icofont-upload-alt me-2"></i> Télécharger une image
                         </Button>
                         {/* Input caché */}
                         <Form.Control
                            type="file"
                            ref={fileInputRef}
                            className="d-none"
                            accept={validImageTypes.join(', ')}
                            onChange={handleImageUpload}
                         />
                         {currentProduct.imgPreview !== PLACEHOLDER_IMAGE && (
                            <Button variant="outline-danger" onClick={handleImageRemove} size="sm" className="rounded-pill mt-2">
                                <i className="icofont-ui-delete me-1"></i> Supprimer l'image
                            </Button>
                         )}
                    </div>
                    <Form.Text className="text-muted text-center mt-2 small">
                       JPG, PNG, GIF, WEBP acceptés (Max 5MB)
                    </Form.Text>

                     {/* Affichage de la date de dernière modification */}
                     {lastModified && (
                        <div className="mt-auto pt-3 text-center text-muted small">
                            <i className="icofont-ui-calendar me-1"></i>Dernière modif: {lastModified}
                        </div>
                    )}
                </Col>

                {/* Colonne Droite: Tabs d'informations */}
                <Col md={8} className="p-4">
                    <Tabs defaultActiveKey="infos" id="product-edit-tabs" className="mb-4 nav-tabs-modern">
                        {/* --- Onglet Informations Générales --- */}
                        <Tab eventKey="infos" title={<><i className="icofont-info-square me-2"></i> Informations</>}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <i className="icofont-label me-2"></i>Nom du produit <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={currentProduct.name}
                                            onChange={handleInputChange}
                                            className="rounded-pill"
                                            required
                                            placeholder="Ex: T-shirt en coton bio"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <i className="icofont-tags me-2"></i>Catégorie <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="category"
                                            value={currentProduct.category}
                                            onChange={handleInputChange}
                                            className="rounded-pill"
                                            required
                                        >
                                            <option value="">-- Sélectionner --</option>
                                            {availableCategories.filter(cat => cat !== 'Tous').map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                             <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <i className="icofont-price me-2"></i>Prix (€) <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={currentProduct.price}
                                            onChange={handleInputChange}
                                            min="0.01"
                                            step="0.01"
                                            className="rounded-pill"
                                            required
                                            placeholder="Ex: 19.99"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <i className="icofont-cubes me-2"></i>Stock <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="stock"
                                            value={currentProduct.stock}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="1"
                                            className="rounded-pill"
                                            required
                                            placeholder="Ex: 50"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                     <Form.Group className="mb-3">
                                        <Form.Label>
                                            <i className="icofont-user-alt-7 me-2"></i>Vendeur
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="seller"
                                            value={currentProduct.seller}
                                            onChange={handleInputChange}
                                            className="rounded-pill"
                                            placeholder="Ex: Marque XYZ"
                                        />
                                    </Form.Group>
                                </Col>
                                 <Col md={6}>
                                    <Form.Group className="mb-3">
                                      <Form.Label><i className="icofont-star me-2"></i>Évaluations (Optionnel)</Form.Label>
                                      <InputGroup>
                                         <Form.Control
                                          type="number"
                                          name="ratings"
                                          value={currentProduct.ratings}
                                          onChange={handleInputChange}
                                          min="0"
                                          max="5"
                                          step="0.1"
                                          className="rounded-pill-start" // Spécifique pour InputGroup
                                          placeholder="Note /5"
                                        />
                                         <InputGroup.Text>/</InputGroup.Text>
                                         <Form.Control
                                          type="number"
                                          name="ratingsCount"
                                          value={currentProduct.ratingsCount}
                                          onChange={handleInputChange}
                                          min="0"
                                          className="rounded-pill-end" // Spécifique pour InputGroup
                                          placeholder="Nb avis"
                                        />
                                      </InputGroup>
                                    </Form.Group>
                                  </Col>
                            </Row>

                             {/* Champ URL Image (gardé pour référence mais l'upload est prioritaire) */}
                             <Form.Group className="mb-3">
                                <Form.Label><i className="icofont-link me-2"></i>URL de l'image (si pas d'upload)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="img"
                                    value={currentProduct.img}
                                    onChange={handleInputChange}
                                    className="rounded-pill"
                                    placeholder="Coller une URL ou utiliser le bouton d'upload"
                                    disabled={!!currentProduct.imgFile} // Désactiver si un fichier est sélectionné
                                />
                                <Form.Text className="text-muted small ms-2">
                                    Utilisez le bouton à gauche pour téléverser une image (recommandé).
                                </Form.Text>
                            </Form.Group>

                             <Form.Group className="mb-3">
                                <Form.Label><i className="icofont-align-left me-2"></i>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="description"
                                    value={currentProduct.description}
                                    onChange={handleInputChange}
                                    placeholder="Décrivez votre produit..."
                                    style={{ resize: 'vertical' }} // Permet le redimensionnement vertical
                                />
                            </Form.Group>
                             <Alert variant="light" className="small text-muted">
                                <i className="icofont-warning-alt me-1"></i> Les champs marqués d'un <span className="text-danger">*</span> sont obligatoires.
                            </Alert>

                        </Tab>

                         {/* --- Onglet Historique (si édition) --- */}
                         {currentProduct.id && (
                            <Tab eventKey="historique" title={<><i className="icofont-history me-2"></i> Historique</>}>
                                <div className="product-history mt-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {productHistory[currentProduct.id] && productHistory[currentProduct.id].length > 0 ? (
                                    <Table striped bordered hover size="sm">
                                        <thead className="table-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Action</th>
                                            <th>Détails</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {productHistory[currentProduct.id].map((entry, index) => (
                                            <tr key={index}>
                                            <td><small>{entry.date}</small></td>
                                            <td>
                                                <Badge pill bg={entry.action === 'Création' ? 'success' : entry.action === 'Modification' ? 'primary' : entry.action === 'Suppression' ? 'danger' : 'info'}>
                                                {entry.action}
                                                </Badge>
                                            </td>
                                            <td><small>{entry.details}</small></td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                    ) : (
                                    <div className="text-center py-5 text-muted">
                                        <i className="icofont-ghost fs-1 mb-2 d-block"></i>
                                        <p>Aucun historique disponible pour ce produit.</p>
                                    </div>
                                    )}
                                </div>
                            </Tab>
                         )}

                        {/* --- Onglet Statistiques (si édition) --- */}
                        {currentProduct.id && (
                            <Tab eventKey="statistiques" title={<><i className="icofont-chart-bar-graph me-2"></i> Statistiques</>}>
                                {productStats[currentProduct.id] ? (
                                    <div className="product-statistics mt-2">
                                       {/* ... (Contenu des statistiques, potentiellement à styliser aussi) ... */}
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Card className="h-100 border-light shadow-sm">
                                                <Card.Header className="bg-light py-2 d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-0 fw-normal small">Aperçu Performances</h6>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="p-0 text-muted"
                                                        onClick={() => updateProductStats(currentProduct.id)}
                                                        title="Rafraîchir les stats"
                                                    >
                                                    <i className="icofont-refresh"></i>
                                                    </Button>
                                                </Card.Header>
                                                <Card.Body className="pt-2">
                                                     {/* ... Contenu des stats (Vues, Ventes, Taux Conv, CA) ... */}
                                                      <Row>
                                                        <Col xs={6} className="mb-2">
                                                        <div className="stat-box p-2 rounded bg-light text-center small">
                                                            <div className="text-muted mb-1">Vues totales</div>
                                                            <h5 className="mb-0">{formatNumber(productStats[currentProduct.id].totalViews)}</h5>
                                                            <VariationIndicator value={productStats[currentProduct.id].viewsTrend} />
                                                        </div>
                                                        </Col>
                                                        <Col xs={6} className="mb-2">
                                                        <div className="stat-box p-2 rounded bg-light text-center small">
                                                             <div className="text-muted mb-1">Ventes</div>
                                                            <h5 className="mb-0">{formatNumber(productStats[currentProduct.id].totalSales)}</h5>
                                                            <VariationIndicator value={productStats[currentProduct.id].salesTrend} />
                                                        </div>
                                                        </Col>
                                                        <Col xs={6} className="mb-2">
                                                        <div className="stat-box p-2 rounded bg-light text-center small">
                                                            <div className="text-muted mb-1">Taux Conv.</div>
                                                            <h5 className="mb-0">{productStats[currentProduct.id].conversionRate}%</h5>
                                                              <small className='text-muted'>Rank: {productStats[currentProduct.id].competitionRank}/20</small>
                                                        </div>
                                                        </Col>
                                                        <Col xs={6} className="mb-2">
                                                        <div className="stat-box p-2 rounded bg-light text-center small">
                                                            <div className="text-muted mb-1">Revenus</div>
                                                            <h5 className="mb-0">{formatNumber(productStats[currentProduct.id].revenue)}€</h5>
                                                               <small className='text-muted'>Prix: {currentProduct.price?.toFixed(2)}€</small>
                                                        </div>
                                                        </Col>
                                                    </Row>
                                                     <ProgressBar
                                                        title="Rotation Stock"
                                                        value={productStats[currentProduct.id].stockTurnover}
                                                        max="100"
                                                    />
                                                    {/* ... Autres indicateurs ... */}
                                                </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                 <Card className="h-100 border-light shadow-sm">
                                                    <Card.Header className="bg-light py-2">
                                                        <h6 className="mb-0 fw-normal small">Performance Hebdomadaire</h6>
                                                    </Card.Header>
                                                    <Card.Body className="pt-2">
                                                        {/* ... Graphique semaine ... */}
                                                        <div className="simple-chart" style={{height: '150px'}}>
                                                            {productStats[currentProduct.id].lastWeekData.map((day, index) => (
                                                                 <OverlayTrigger
                                                                    key={index}
                                                                    placement="top"
                                                                    overlay={
                                                                    <Tooltip id={`tooltip-prod-${index}`}>
                                                                        <strong>{day.date}:</strong> {day.vues} vues / {day.ventes} ventes
                                                                    </Tooltip>
                                                                    }
                                                                >
                                                                    <div className="chart-column">
                                                                    <div
                                                                        className="bar-views bg-primary opacity-75"
                                                                        style={{ height: `${Math.min(100, (day.vues / (productStats[currentProduct.id].totalViews / 4 || 1)) * 100)}%`, marginBottom: '2px' }}
                                                                    ></div>
                                                                    <div
                                                                        className="bar-sales bg-success"
                                                                        style={{ height: `${Math.min(100, (day.ventes / (productStats[currentProduct.id].totalSales / 4 || 1)) * 100)}%` }}
                                                                    ></div>
                                                                    <div className="day-label">{day.date}</div>
                                                                    </div>
                                                                </OverlayTrigger>
                                                            ))}
                                                            </div>
                                                            <div className="chart-legend d-flex justify-content-center small mt-2">
                                                                <div className="me-3"><span className="legend-indicator bg-primary"></span> Vues</div>
                                                                <div><span className="legend-indicator bg-success"></span> Ventes</div>
                                                            </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        {/* ... (Comparaison & Recommandations si besoin) ... */}
                                        <div className="text-center mt-2">
                                            <p className="text-muted small">
                                            <i className="icofont-info-circle me-1"></i>
                                            Stats mises à jour le: {new Date(productStats[currentProduct.id].lastUpdated).toLocaleString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <i className="icofont-chart-pie-alt fs-1 mb-3 d-block"></i>
                                        <p>Les statistiques seront disponibles après la création du produit.</p>
                                    </div>
                                )}
                            </Tab>
                        )}

                         {/* --- Onglet Prévisualisation --- */}
                        <Tab eventKey="preview" title={<><i className="icofont-eye me-2"></i> Prévisualisation</>}>
                             <div className="shop-preview border rounded p-4 bg-white mt-2 shadow-sm">
                                <Row>
                                    <Col md={5} className="text-center mb-3 mb-md-0">
                                        <img
                                            src={currentProduct.imgPreview || PLACEHOLDER_IMAGE}
                                            alt={currentProduct.name || 'Aperçu'}
                                            className="img-fluid rounded"
                                            style={{maxHeight: '200px'}}
                                            onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                                        />
                                    </Col>
                                    <Col md={7}>
                                        <h4 className="product-name mb-1">{currentProduct.name || '[Nom du produit]'}</h4>
                                         <div className="mb-2">
                                            <span className="text-warning">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`icofont-star ${i < Math.round(currentProduct.ratings || 0) ? '' : 'text-muted opacity-50'}`}></i>
                                            ))}
                                            </span>
                                            <span className="ms-2 text-muted small">({currentProduct.ratingsCount || 0} avis)</span>
                                        </div>
                                        <h5 className="price text-primary mb-2">{(currentProduct.price || 0).toFixed(2)} €</h5>
                                        <p className="seller small text-muted mb-2">Vendu par: {currentProduct.seller || '[Vendeur]'}</p>

                                        <div className="mb-3">
                                             <Badge pill bg={currentProduct.stock > 10 ? 'success' : currentProduct.stock > 0 ? 'warning' : 'danger'}>
                                                {currentProduct.stock > 10 ? 'En stock' : currentProduct.stock > 0 ? 'Stock faible' : 'Épuisé'}
                                            </Badge>
                                        </div>

                                        <p className="description small text-muted mb-3">
                                            {currentProduct.description ? (currentProduct.description.length > 150 ? currentProduct.description.substring(0, 147) + '...' : currentProduct.description) : '[Description du produit...]'}
                                        </p>

                                        <div className="d-flex gap-2">
                                            <Button variant="primary" className="rounded-pill" disabled>
                                                <i className="icofont-cart-alt me-1"></i> Ajouter
                                            </Button>
                                            <Button variant="outline-secondary" className="rounded-pill" disabled>
                                                <i className="icofont-heart me-1"></i> Favoris
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                                 {currentProduct.id && (
                                    <div className="text-center mt-3 pt-3 border-top">
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            className="rounded-pill"
                                            onClick={() => handleViewOnShop(currentProduct.id)}
                                        >
                                            <i className="icofont-external-link me-1"></i> Voir la page réelle du produit
                                        </Button>
                                    </div>
                                )}
                             </div>
                        </Tab>
                    </Tabs>
                </Col>
             </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light border-top p-3">
            <Button variant="secondary" onClick={handleCloseModal} className="rounded-pill">
              <i className="icofont-close-line me-1"></i> Annuler
            </Button>
            <Button variant="primary" type="submit" className="rounded-pill">
              <i className={`icofont-${currentProduct.id ? 'save' : 'plus'} me-1`}></i>
              {currentProduct.id ? 'Enregistrer les modifications' : 'Ajouter le produit'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>


      {/* Modal Gestion Catégories */}
      <Modal show={categoryModal} onHide={handleCloseCategoryModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="icofont-tags me-2"></i>
            {editingCategory.oldName ? `Modifier "${editingCategory.oldName}"` : 'Gestion des Catégories'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
           {/* Formulaire d'édition */}
           {editingCategory.oldName && (
             <Form onSubmit={(e) => { e.preventDefault(); handleUpdateCategory(); }}>
                <Form.Group className="mb-3">
                    <Form.Label>Nouveau nom</Form.Label>
                    <Form.Control
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    isInvalid={!!categoryError}
                    autoFocus
                    />
                    <Form.Control.Feedback type="invalid">
                    {categoryError}
                    </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={handleCancelEditCategory}>Annuler</Button>
                    <Button variant="primary" type="submit">Mettre à jour</Button>
                </div>
             </Form>
           )}

           {/* Formulaire d'ajout et liste */}
           {!editingCategory.oldName && (
             <>
                <Form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }}>
                    <Form.Group className="mb-3">
                    <Form.Label>Ajouter une catégorie</Form.Label>
                    <InputGroup>
                        <Form.Control
                        type="text"
                        value={newCategory}
                        onChange={(e) => { setNewCategory(e.target.value); setCategoryError(''); }}
                        placeholder="Nom de la nouvelle catégorie"
                        isInvalid={!!categoryError}
                        />
                        <Button variant="primary" type="submit">
                          <i className="icofont-plus"></i>
                        </Button>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className={categoryError ? 'd-block' : ''}>
                        {categoryError}
                    </Form.Control.Feedback>
                    </Form.Group>
                </Form>
                <hr />
                <h6 className="mb-3">Catégories existantes</h6>
                <div className="categories-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {availableCategories.filter(cat => cat !== 'Tous').length > 0 ? (
                         availableCategories.filter(cat => cat !== 'Tous').map((category, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded bg-light">
                            <span>{category}</span>
                            <div>
                            <Button
                                variant="link"
                                size="sm"
                                className="text-primary p-1 me-1"
                                onClick={() => handleEditCategory(category)}
                                disabled={category === 'Non classé'}
                                title="Modifier"
                            >
                                <i className="icofont-ui-edit"></i>
                            </Button>
                            <Button
                                variant="link"
                                size="sm"
                                className="text-danger p-1"
                                onClick={() => handleDeleteCategory(category)}
                                disabled={category === 'Non classé'}
                                title="Supprimer"
                            >
                                <i className="icofont-ui-delete"></i>
                            </Button>
                            </div>
                        </div>
                        ))
                    ) : (
                        <p className="text-muted text-center">Aucune catégorie personnalisée.</p>
                    )}
                </div>
             </>
           )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCategoryModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Modal Prévisualisation Rapide */}
      <Modal show={showPreviewModal} onHide={handleClosePreviewModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="icofont-eye-alt me-2"></i>Prévisualisation Rapide</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewProduct && (
            <Row>
                <Col md={5} className="text-center">
                     <img
                        src={previewProduct.img || PLACEHOLDER_IMAGE}
                        alt={previewProduct.name}
                        className="img-fluid rounded shadow-sm mb-3"
                        style={{ maxHeight: '250px'}}
                        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                    />
                </Col>
                <Col md={7}>
                     <h4 className="mb-1">{previewProduct.name}</h4>
                      <div className="mb-2">
                        <Badge bg="secondary" className="fw-normal me-2">{previewProduct.category}</Badge>
                         <span className="text-warning me-1">
                             {[...Array(5)].map((_, i) => (
                                <i key={i} className={`icofont-star ${i < Math.round(previewProduct.ratings || 0) ? '' : 'text-muted opacity-50'}`}></i>
                            ))}
                        </span>
                        <small className="text-muted">({previewProduct.ratingsCount || 0} avis)</small>
                      </div>
                      <h5 className="text-primary mb-3">{previewProduct.price?.toFixed(2)} €</h5>
                      <p className="mb-1"><strong className='fw-normal'>Stock:</strong> <Badge bg={previewProduct.stock <= 0 ? 'danger' : previewProduct.stock <= 10 ? 'warning' : 'success'}>{previewProduct.stock}</Badge></p>
                      <p className="mb-1"><strong className='fw-normal'>Vendeur:</strong> {previewProduct.seller}</p>
                      <hr />
                      <p className="small text-muted">{previewProduct.description || 'Aucune description fournie.'}</p>
                </Col>
            </Row>
          )}
        </Modal.Body>
         <Modal.Footer>
          <Button variant="primary" onClick={() => handleShowEditModal(previewProduct)}>
              <i className="icofont-edit me-1"></i> Modifier ce produit
          </Button>
          <Button variant="secondary" onClick={handleClosePreviewModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Styles CSS Additionnels */}
      <style jsx global>{`
        /* Amélioration visuelle légère des stats globales */
        .stat-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .bg-light-primary { background-color: #e7f1ff; }
        .bg-light-success { background-color: #e1f3e9; }
        .bg-light-info { background-color: #e0f7fa; }
        .bg-light-warning { background-color: #fff8e1; }
        .bg-light-danger { background-color: #fdecea; }

        /* Style pour les graphiques simples */
        .simple-chart {
            display: flex;
            align-items: flex-end;
            justify-content: space-around; /* Espace équitable */
            height: 100%; /* Utiliser la hauteur du parent */
            padding: 10px 0 0 0; /* Espace pour le label */
            gap: 4px; /* Espace entre les colonnes */
          }
          .chart-column {
            display: flex;
            flex-direction: column-reverse; /* Barres vers le haut */
            align-items: center;
            flex-grow: 1; /* Occuper l'espace */
            position: relative; /* Pour le tooltip */
            text-align: center;
          }
          .bar-views, .bar-sales, .bar-revenue {
            width: 60%; /* Largeur des barres */
            min-height: 2px; /* Hauteur minimale visible */
            border-radius: 3px 3px 0 0;
            transition: height 0.3s ease;
            cursor: pointer; /* Indique qu'on peut survoler */
          }
           .bar-revenue {
            max-height: 100%; /* Limite la hauteur */
           }
           .bar-sales {
             max-height: 60%; /* Limite la hauteur */
           }
          .day-label {
            font-size: 0.65rem; /* Très petite étiquette */
            color: #6c757d;
            margin-top: 4px;
            white-space: nowrap;
          }
          .legend-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-right: 4px;
            border-radius: 2px;
            vertical-align: middle;
           }

        /* Style pour les boutons icônes dans le tableau */
        .btn-icon {
          line-height: 1;
          padding: 0.2rem 0.4rem; /* Ajuster le padding */
        }
        .btn-icon i {
          vertical-align: middle;
        }

        /* Style pour les champs arrondis dans InputGroup */
        .input-group .form-control.rounded-pill-start {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .input-group .form-control.rounded-pill-end {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        .input-group > :not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback) {
            margin-left: -1px; /* Compense la double bordure */
        }

        /* Style pour les onglets modernes */
        .nav-tabs-modern .nav-link {
            border: none;
            border-bottom: 3px solid transparent;
            color: #6c757d;
            padding: 0.75rem 1rem;
            transition: border-color 0.2s ease, color 0.2s ease;
        }
        .nav-tabs-modern .nav-link:hover {
            border-bottom-color: #dee2e6;
            color: #495057;
        }
        .nav-tabs-modern .nav-link.active {
            border-bottom-color: var(--bs-primary);
            color: var(--bs-primary);
            font-weight: 500;
        }
        .nav-tabs-modern {
            border-bottom: 1px solid #dee2e6;
        }

         /* Placeholder pour l'image */
        .image-preview-container img[src*="via.placeholder.com"] {
            filter: grayscale(80%);
            opacity: 0.6;
        }
        .image-preview-container {
            min-height: 200px; /* Assure une hauteur minimale */
        }

        /* Ajustement pour les tooltips dans les graphiques */
         .chart-column .tooltip {
            pointer-events: none; /* Empêche le tooltip de bloquer le survol */
         }

      `}</style>
    </div>
  );
};

export default ProductManagement;