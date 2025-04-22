"use client";

import React, { useState, useEffect } from 'react';
import { Container, Spinner, Row, Col, Card, Badge, Alert, OverlayTrigger, Tooltip, Button, Dropdown, Table } from 'react-bootstrap';
import app from '../../firebase/firebase.config';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';

// Import Sub Components
import BlogListHeader from "../../components/blog/BlogListHeader";
import BlogTable from "../../components/blog/BlogTable";
import BlogEditModal from "../../components/blog/BlogEditModal";

// Import Data & Styles
import './BlogManagement.css';
import existingBlogList from '../../utilis/blogdata.js';
import { blog01, blog02, blog03, blog04, blog05, blog06, blog07, blog08, blog09 } from "../../utilis/imageImports";

// Enregistrer les composants Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const db = getFirestore(app);
const storage = getStorage(app);

// Map local images
const blogImagesMap = { 1: blog01, 2: blog02, 3: blog03, 4: blog04, 5: blog05, 6: blog06, 7: blog07, 8: blog08, 9: blog09 };

// Fonction utilitaire pour convertir le format de date
const convertDateFormat = (dateStr) => {
  if (!dateStr) return '';
  
  // Si c'est déjà au format ISO (yyyy-MM-dd), le retourner
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Si c'est au format français (ex: 05 juin 2022), le convertir en ISO
  try {
    // Les noms des mois en français
    const frMonths = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    // Extraire jour, mois et année
    const parts = dateStr.split(' ');
    if (parts.length !== 3) return new Date().toISOString().split('T')[0]; // Fallback à la date du jour
    
    const day = parseInt(parts[0], 10);
    const monthIndex = frMonths.findIndex(m => m === parts[1].toLowerCase());
    const year = parseInt(parts[2], 10);
    
    if (monthIndex === -1 || isNaN(day) || isNaN(year)) {
      return new Date().toISOString().split('T')[0]; // Fallback à la date du jour
    }
    
    // Créer une date et retourner au format ISO
    const date = new Date(year, monthIndex, day);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error("Erreur de conversion de date:", error);
    return new Date().toISOString().split('T')[0]; // Fallback à la date du jour
  }
};

// Fonction utilitaire pour formater la date en français
const formatDateToFrench = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Si la date n'est pas valide, retourner la chaîne originale
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return dateStr;
  }
};

const BlogManagement = () => {
  // --- STATES ---
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [activeView, setActiveView] = useState('table'); // 'table', 'cards', ou 'stats'
  const [notification, setNotification] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    categoryDistribution: {},
    monthlyPublications: {}
  });
  
  // Ajout des états pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [availableCategories, setAvailableCategories] = useState(['Tous']);

  // --- EFFECTS ---
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Effect pour extraire les catégories uniques des blogs
  useEffect(() => {
    if (blogs.length > 0) {
      // Extraire les catégories uniques des blogs
      const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))].sort();
      setAvailableCategories(['Tous', ...categories]);
      
      // Calculer les statistiques
      calculateStats(blogs);
    }
  }, [blogs]);

  // --- DATA PROCESSING ---
  const calculateStats = (blogData) => {
    // Nombre total d'articles
    const totalBlogs = blogData.length;
    
    // Distribution par catégorie
    const categoryDistribution = blogData.reduce((acc, blog) => {
      const category = blog.category || 'Non classé';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    // Publications par mois (pour les 12 derniers mois)
    const monthlyPublications = blogData.reduce((acc, blog) => {
      if (blog.date) {
        // Utiliser la fonction de formatage pour obtenir une date cohérente
        let date;
        try {
          date = new Date(convertDateFormat(blog.date));
          if (isNaN(date.getTime())) {
            date = new Date(); // Fallback à la date actuelle
          }
        } catch (e) {
          date = new Date(); // Fallback à la date actuelle
        }
        
        const monthYear = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      }
      return acc;
    }, {});
    
    setStats({
      totalBlogs,
      categoryDistribution,
      monthlyPublications
    });
  };

  // --- DATA FETCHING ---
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let firestoreBlogs = [];
      try {
        const blogCollection = collection(db, 'blogs');
        const blogSnapshot = await getDocs(blogCollection);
        firestoreBlogs = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          source: 'firebase',
          ...doc.data()
        }));
        
        // Create example if firestore is accessible but empty
        if (firestoreBlogs.length === 0) {
          await createExampleBlogIfNotExists(blogCollection);
          // Re-fetch après création de l'exemple
          const newSnapshot = await getDocs(blogCollection);
          firestoreBlogs = newSnapshot.docs.map(doc => ({
            id: doc.id,
            source: 'firebase',
            ...doc.data()
          }));
        }
      } catch (firestoreError) {
        console.warn("Firestore inaccessible. Utilisation données locales.", firestoreError);
        // Afficher une notification pour l'utilisateur
        showNotification("Impossible de se connecter à la base de données. Mode hors-ligne activé.", "warning");
      }

      // Adapt local data
      const adaptedExistingBlogs = existingBlogList.map(blog => {
        const author = blog.metaList?.find(meta => meta.iconName === 'icofont-ui-user')?.text || 'Auteur inconnu';
        const date = blog.metaList?.find(meta => meta.iconName === 'icofont-calendar')?.text || '';
        const blogId = blog.id;
        
        // Conversion de la date au format ISO pour le stockage interne
        const isoDate = convertDateFormat(date);
        
        return {
          id: `existing-${blog.id}`,
          title: blog.title, 
          author, 
          date: isoDate, // Stocker la date au format ISO
          displayDate: date, // Garder la date d'affichage d'origine
          category: blog.category || 'Blog', 
          content: blog.desc,
          image: blogImagesMap[blogId] || 'https://via.placeholder.com/300x200?text=Image+locale+manquante',
          source: 'predefined', 
          original: blog
        };
      });

      // Combine and set state - prioritize Firestore blogs
      const firestoreOriginalIds = new Set(firestoreBlogs.filter(fb => fb.isModifiedFromPredefined).map(fb => fb.originalId));
      const uniqueAdaptedExisting = adaptedExistingBlogs.filter(ab => !firestoreOriginalIds.has(ab.id));

      // Ensemble combiné des blogs
      const combinedBlogs = [...firestoreBlogs, ...uniqueAdaptedExisting];
      
      // Tri par date (plus récent en premier)
      combinedBlogs.sort((a, b) => {
        // Utiliser les dates ISO pour le tri
        const dateA = a.date ? new Date(convertDateFormat(a.date)) : new Date(0);
        const dateB = b.date ? new Date(convertDateFormat(b.date)) : new Date(0);
        return dateB - dateA;
      });
      
      setBlogs(combinedBlogs);
      showNotification(`${combinedBlogs.length} articles de blog chargés avec succès.`, "success");

    } catch (error) {
      console.error("Erreur chargement blogs:", error);
      showNotification("Erreur lors du chargement des articles de blog.", "danger");
      
      // Fallback to only local data on error
      const adaptedExistingBlogs = existingBlogList.map(blog => {
        const author = blog.metaList?.find(meta => meta.iconName === 'icofont-ui-user')?.text || 'Inconnu';
        const date = blog.metaList?.find(meta => meta.iconName === 'icofont-calendar')?.text || '';
        const isoDate = convertDateFormat(date);
        
        return {
          id: `existing-${blog.id}`, 
          title: blog.title,
          author,
          date: isoDate,
          displayDate: date,
          category: 'Blog', 
          content: blog.desc,
          image: blogImagesMap[blog.id] || 'https://via.placeholder.com/300x200?text=Manquante',
          source: 'predefined', 
          original: blog
        };
      });
      setBlogs(adaptedExistingBlogs);
    } finally {
      setLoading(false);
    }
  };

  // Helper to create example blog only if needed
  const createExampleBlogIfNotExists = async (blogCollectionRef) => {
    // Check again inside function to be sure
    const querySnapshot = await getDocs(blogCollectionRef);
    if (querySnapshot.empty) {
      console.log("Création article exemple...");
      const today = new Date().toISOString().split('T')[0];
      const exampleBlog = {
        title: "Bienvenue sur votre blog",
        author: "Administrateur",
        date: today,
        category: "Général",
        content: "Ceci est un article exemple pour vous aider à démarrer avec votre blog. Vous pouvez le modifier ou le supprimer à tout moment. Pour créer un nouvel article, cliquez sur le bouton 'Nouvel article' ci-dessus.",
        image: "https://via.placeholder.com/800x400?text=Article+Blog+Exemple"
      };
      
      try {
        await addDoc(blogCollectionRef, exampleBlog);
        console.log("Article exemple créé.");
        showNotification("Un article exemple a été créé pour vous aider à démarrer.", "info");
      } catch (error) {
        console.error("Erreur lors de la création de l'article exemple:", error);
        // Ne pas propager l'erreur - continuer sans exemple
      }
    }
  };

  // Afficher une notification temporaire
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handlers pour le filtrage et la recherche
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handler pour le tri
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtrage et tri des blogs
  const getSortedAndFilteredBlogs = () => {
    // Filtrer d'abord
    let filteredResults = blogs.filter(blog => {
      const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          blog.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tous' || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Puis trier
    return filteredResults.sort((a, b) => {
      if (sortConfig.key === 'date') {
        // Tri spécial pour les dates
        const dateA = a.date ? new Date(convertDateFormat(a.date)) : new Date(0);
        const dateB = b.date ? new Date(convertDateFormat(b.date)) : new Date(0);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // Tri standard pour les autres champs
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // --- MODAL HANDLERS ---
  const handleShow = (blog = null) => {
    if (blog) {
      // S'assurer que la date est au format ISO pour le formulaire
      const blogToEdit = {
        ...blog,
        date: convertDateFormat(blog.date) // Convertir au format ISO pour l'input date
      };
      setCurrentBlog(blogToEdit);
      setIsEditing(true);
    } else {
      setCurrentBlog({
        title: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        content: '',
        image: ''
      });
      setIsEditing(false);
    }
    setShowModal(true);
    setFileInputKey(Date.now());
    setIsUploading(false);
    setUploadProgress(0);
    
    // Force le body à permettre le défilement même avec le modal ouvert
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentBlog(null);
    
    // Restaurer les styles par défaut
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  };

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    const timestamp = new Date().getTime();
    const fileName = `blog_images/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload Error:", error);
        showNotification(`Erreur lors de l'upload de l'image: ${error.code}`, "danger");
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setCurrentBlog(prev => ({ ...prev, image: downloadURL }));
          showNotification("Image téléchargée avec succès", "success");
        } catch (error) {
          console.error("Erreur récupération URL:", error);
          showNotification("Erreur lors de la récupération de l'URL de l'image", "danger");
        }
        setIsUploading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) {
      showNotification("Veuillez attendre la fin du téléchargement de l'image", "warning");
      return;
    }

    try {
      // Prepare data (remove temp/local fields)
      const { id, source, original, displayDate, ...blogData } = currentBlog;

      // Si en mode hors-ligne (erreur Firebase), simuler le succès
      if (!db || !collection) {
        showNotification("Mode hors-ligne: Les modifications seront temporaires", "warning");
        // Mettre à jour l'état local
        const updatedBlogs = blogs.map(blog => 
          blog.id === id ? { ...blog, ...blogData } : blog
        );
        setBlogs(updatedBlogs);
        handleClose();
        return;
      }

      if (isEditing && source === 'predefined') {
        try {
          // Create a new Firebase doc from predefined source
          await addDoc(collection(db, 'blogs'), {
            ...blogData,
            isModifiedFromPredefined: true,
            originalId: id
          });
          showNotification("Une copie modifiée de l'article prédéfini a été créée", "success");
        } catch (error) {
          console.error("Erreur sauvegarde (prédéfini):", error);
          showNotification("Mode hors-ligne: Les modifications seront temporaires", "warning");
          // Simuler la mise à jour en local
          const updatedBlogs = [...blogs, { ...blogData, id: `temp-${Date.now()}`, source: 'temp' }];
          setBlogs(updatedBlogs);
        }
      } else if (isEditing) {
        try {
          // Update existing Firebase doc
          const blogRef = doc(db, 'blogs', id);
          await updateDoc(blogRef, blogData);
          showNotification("Article mis à jour avec succès", "success");
        } catch (error) {
          console.error("Erreur mise à jour:", error);
          showNotification("Mode hors-ligne: Les modifications seront temporaires", "warning");
          // Simuler la mise à jour en local
          const updatedBlogs = blogs.map(blog => 
            blog.id === id ? { ...blog, ...blogData } : blog
          );
          setBlogs(updatedBlogs);
        }
      } else {
        try {
          // Add new Firebase doc
          await addDoc(collection(db, 'blogs'), blogData);
          showNotification("Nouvel article créé avec succès", "success");
        } catch (error) {
          console.error("Erreur création:", error);
          showNotification("Mode hors-ligne: Les modifications seront temporaires", "warning");
          // Simuler l'ajout en local
          const newBlog = { ...blogData, id: `temp-${Date.now()}`, source: 'temp' };
          setBlogs([newBlog, ...blogs]);
        }
      }
      fetchBlogs(); // Refresh list
      handleClose(); // Close modal
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      showNotification(`Erreur lors de la sauvegarde: ${error.message}`, "danger");
    }
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (id) => {
    if (id.startsWith('existing-')) {
      showNotification("Les articles prédéfinis ne peuvent pas être supprimés directement", "warning");
      return;
    }
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.")) {
      try {
        // Récupérer l'article pour obtenir l'URL de l'image
        const blogToDelete = blogs.find(blog => blog.id === id);
        
        // Si en mode hors-ligne, simuler la suppression
        if (!db || !deleteDoc) {
          showNotification("Mode hors-ligne: Suppression temporaire", "warning");
          const updatedBlogs = blogs.filter(blog => blog.id !== id);
          setBlogs(updatedBlogs);
          return;
        }
        
        // Supprimer l'article de Firestore
        try {
          await deleteDoc(doc(db, 'blogs', id));
        } catch (error) {
          console.error("Erreur suppression Firestore:", error);
          showNotification("Mode hors-ligne: Suppression temporaire", "warning");
          const updatedBlogs = blogs.filter(blog => blog.id !== id);
          setBlogs(updatedBlogs);
          return;
        }
        
        // Si l'article a une image dans Firebase Storage, la supprimer aussi
        if (blogToDelete && blogToDelete.image && blogToDelete.image.includes('firebase')) {
          try {
            const imageRef = ref(storage, blogToDelete.image);
            await deleteObject(imageRef);
          } catch (imageError) {
            console.warn("Impossible de supprimer l'image:", imageError);
          }
        }
        
        showNotification("Article supprimé avec succès", "success");
        fetchBlogs(); // Refresh list
      } catch (error) {
        console.error("Erreur suppression:", error);
        showNotification(`Erreur lors de la suppression: ${error.message}`, "danger");
      }
    }
  };

  // Gestion des sélections multiples
  const handleSelectBlog = (id) => {
    setSelectedBlogs(prev => {
      if (prev.includes(id)) {
        return prev.filter(blogId => blogId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllBlogs = (isSelected) => {
    if (isSelected) {
      const filteredBlogIds = getSortedAndFilteredBlogs().map(blog => blog.id);
      setSelectedBlogs(filteredBlogIds);
    } else {
      setSelectedBlogs([]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBlogs.length === 0) return;
    
    const predefinedCount = selectedBlogs.filter(id => id.startsWith('existing-')).length;
    const deletableCount = selectedBlogs.length - predefinedCount;
    
    if (deletableCount === 0) {
      showNotification("Aucun des articles sélectionnés ne peut être supprimé", "warning");
      return;
    }
    
    const confirmMessage = predefinedCount > 0
      ? `Confirmez-vous la suppression de ${deletableCount} article(s) ? (${predefinedCount} article(s) prédéfini(s) ne sera/seront pas supprimé(s))`
      : `Confirmez-vous la suppression de ${deletableCount} article(s) ?`;
    
    if (window.confirm(confirmMessage)) {
      let deleteCount = 0;
      let errorCount = 0;
      
      // Si en mode hors-ligne, simuler la suppression en masse
      if (!db || !deleteDoc) {
        showNotification("Mode hors-ligne: Suppression temporaire", "warning");
        const updatedBlogs = blogs.filter(blog => !selectedBlogs.includes(blog.id) || blog.id.startsWith('existing-'));
        setBlogs(updatedBlogs);
        setSelectedBlogs([]);
        return;
      }
      
      for (const id of selectedBlogs) {
        if (!id.startsWith('existing-')) {
          try {
            await deleteDoc(doc(db, 'blogs', id));
            deleteCount++;
          } catch (error) {
            console.error(`Erreur suppression ${id}:`, error);
            errorCount++;
          }
        }
      }
      
      const resultMessage = errorCount > 0
        ? `${deleteCount} article(s) supprimé(s), ${errorCount} erreur(s)`
        : `${deleteCount} article(s) supprimé(s) avec succès`;
      
      showNotification(resultMessage, errorCount > 0 ? "warning" : "success");
      setSelectedBlogs([]);
      fetchBlogs();
    }
  };

  // Préparation des données pour le graphique
  const prepareChartData = () => {
    // Obtenir les 12 derniers mois dans l'ordre chronologique
    const months = [];
    const data = [];
    
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(d.getMonth() - i);
      const monthYear = d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      months.unshift(monthYear);
      data.unshift(stats.monthlyPublications[monthYear] || 0);
    }
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Articles publiés',
          data: data,
          borderColor: 'rgba(106, 17, 203, 1)',
          backgroundColor: 'rgba(106, 17, 203, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  // Options pour le graphique
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Publications mensuelles'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  // --- RENDER ---
  const filteredBlogs = getSortedAndFilteredBlogs();
  
  return (
    <div className="blog-management-modern fade-in">
      {/* Notification */}
      {notification && (
        <Alert 
          variant={notification.type} 
          dismissible 
          onClose={() => setNotification(null)}
          className="notification-toast"
        >
          {notification.message}
        </Alert>
      )}
      
      {/* En-tête et boutons de vue */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-3 mb-sm-0">
          <i className="icofont-page me-2"></i>
          Gestion des articles de blog
        </h2>
        
        <div className="view-toggle-buttons">
          <Button 
            variant={activeView === 'table' ? 'primary' : 'outline-primary'} 
            className="me-2"
            onClick={() => setActiveView('table')}
          >
            <i className="icofont-listing-box me-1"></i> Tableau
          </Button>
          <Button 
            variant={activeView === 'cards' ? 'primary' : 'outline-primary'}
            className="me-2" 
            onClick={() => setActiveView('cards')}
          >
            <i className="icofont-ui-grid me-1"></i> Cartes
          </Button>
          <Button 
            variant={activeView === 'stats' ? 'primary' : 'outline-primary'} 
            onClick={() => setActiveView('stats')}
          >
            <i className="icofont-chart-bar-graph me-1"></i> Statistiques
          </Button>
        </div>
      </div>
      
      {/* Dashboard Cards */}
      <Row className="stats-cards mb-4">
        <Col md={4} className="mb-3">
          <Card className="dashboard-card shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="card-icon-bg primary">
                <i className="icofont-newspaper"></i>
              </div>
              <div className="ms-3">
                <Card.Title className="card-value">{stats.totalBlogs}</Card.Title>
                <Card.Text className="card-label">Articles au total</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="dashboard-card shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="card-icon-bg success">
                <i className="icofont-tag"></i>
              </div>
              <div className="ms-3">
                <Card.Title className="card-value">{Object.keys(stats.categoryDistribution).length}</Card.Title>
                <Card.Text className="card-label">Catégories</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="dashboard-card shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="card-icon-bg warning">
                <i className="icofont-ui-calendar"></i>
              </div>
              <div className="ms-3">
                <Card.Title className="card-value">
                  {/* Calculer les articles du mois courant */}
                  {stats.monthlyPublications[new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })] || 0}
                </Card.Title>
                <Card.Text className="card-label">Articles ce mois-ci</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Section principale */}
      <Card className="main-content-card shadow-sm">
        <Card.Body>
          {/* Header avec recherche et filtres */}
          <BlogListHeader 
            filteredPostsCount={filteredBlogs.length}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            availableCategories={availableCategories}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onAddPost={() => handleShow()}
            onSelectAll={handleSelectAllBlogs}
            selectedCount={selectedBlogs.length}
            onBulkDelete={handleBulkDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
            activeView={activeView}
          />
          
          {/* Contenu principal - change selon la vue active */}
          {activeView === 'table' && (
            <BlogTable
              blogs={filteredBlogs}
              loading={loading}
              onEdit={handleShow}
              onDelete={handleDelete}
              onAddFirstBlog={() => handleShow()}
              selectedBlogs={selectedBlogs}
              onSelectBlog={handleSelectBlog}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          )}
          
          {activeView === 'cards' && (
            <>
              {loading ? (
                <div className="text-center p-5">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Chargement...</span>
                  </Spinner>
                  <p className="mt-2">Chargement des articles...</p>
                </div>
              ) : filteredBlogs.length === 0 ? (
                <Card className="text-center p-5 shadow-sm">
                  <Card.Body>
                    <i className="icofont-newspaper icofont-3x text-muted mb-3"></i>
                    <h3>Aucun article disponible</h3>
                    <p className="text-muted">Créez votre premier article pour commencer à gérer votre blog.</p>
                    <Button variant="primary" onClick={() => handleShow()}>
                      <i className="icofont-plus me-2"></i> Créer un article
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <Row className="blog-cards">
                  {filteredBlogs.map(blog => (
                    <Col key={blog.id} lg={4} md={6} className="mb-4">
                      <Card className="blog-card h-100 shadow-sm">
                        <div className="blog-card-img-container">
                          <Card.Img 
                            variant="top" 
                            src={blog.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                            className="blog-card-img" 
                          />
                          {blog.source === 'predefined' && (
                            <Badge pill bg="secondary" className="predefined-badge">
                              Prédéfini
                            </Badge>
                          )}
                        </div>
                        <Card.Body>
                          <Card.Title className="blog-card-title">{blog.title}</Card.Title>
                          <div className="blog-card-meta">
                            <span className="me-3">
                              <i className="icofont-ui-user me-1"></i> {blog.author}
                            </span>
                            <span>
                              <i className="icofont-calendar me-1"></i> {blog.displayDate || formatDateToFrench(blog.date)}
                            </span>
                          </div>
                          <Badge bg="primary" className="mt-2 mb-2">
                            {blog.category || 'Non classé'}
                          </Badge>
                          <Card.Text className="blog-card-excerpt">
                            {blog.content.substring(0, 100)}...
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer className="blog-card-footer">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleShow(blog)}
                          >
                            <i className="icofont-edit me-1"></i> Modifier
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(blog.id)}
                            disabled={blog.source === 'predefined'}
                          >
                            <i className="icofont-trash me-1"></i> Supprimer
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
          
          {activeView === 'stats' && (
            <div className="blog-stats-container">
              <Row>
                <Col lg={7} className="mb-4">
                  <Card className="chart-card shadow-sm">
                    <Card.Body>
                      <Card.Title>Publications au fil du temps</Card.Title>
                      <div className="chart-container">
                        <Line data={prepareChartData()} options={chartOptions} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col lg={5}>
                  <Card className="category-stats-card shadow-sm">
                    <Card.Body>
                      <Card.Title>Distribution par catégorie</Card.Title>
                      <div className="category-stats">
                        {Object.entries(stats.categoryDistribution).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
                          <div key={category} className="category-stat-item">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span>{category}</span>
                              <Badge bg="primary" pill>{count}</Badge>
                            </div>
                            <div className="progress">
                              <div 
                                className="progress-bar" 
                                role="progressbar" 
                                style={{ 
                                  width: `${(count / stats.totalBlogs) * 100}%`,
                                  background: `linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)`
                                }} 
                                aria-valuenow={(count / stats.totalBlogs) * 100} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                  
                  <Card className="mt-4 shadow-sm">
                    <Card.Body>
                      <Card.Title>Actions rapides</Card.Title>
                      <div className="quick-actions d-grid gap-2">
                        <Button variant="primary" onClick={() => handleShow()}>
                          <i className="icofont-plus-circle me-2"></i> Nouvel article
                        </Button>
                        <Button variant="outline-primary" onClick={() => setActiveView('table')}>
                          <i className="icofont-listing-box me-2"></i> Gérer les articles
                        </Button>
                        <Button 
                          variant="outline-success" 
                          as="a" 
                          href="/blog" 
                          target="_blank"
                        >
                          <i className="icofont-eye me-2"></i> Voir le blog
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Row className="mt-4">
                <Col md={12}>
                  <Card className="recent-blogs-card shadow-sm">
                    <Card.Body>
                      <Card.Title>Articles récents</Card.Title>
                      <Table className="recent-blogs-table">
                        <thead>
                          <tr>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>Date</th>
                            <th>Catégorie</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBlogs.slice(0, 5).map(blog => (
                            <tr key={blog.id}>
                              <td>{blog.title}</td>
                              <td>{blog.author}</td>
                              <td>{blog.displayDate || formatDateToFrench(blog.date)}</td>
                              <td>
                                <Badge bg="primary" pill>
                                  {blog.category || 'Non classé'}
                                </Badge>
                              </td>
                              <td>
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="p-0 me-2"
                                  onClick={() => handleShow(blog)}
                                >
                                  <i className="icofont-edit text-primary"></i>
                                </Button>
                                <Button 
                                  variant="link" 
                                  size="sm"
                                  className="p-0"
                                  onClick={() => handleDelete(blog.id)}
                                  disabled={blog.source === 'predefined'}
                                >
                                  <i className="icofont-trash text-danger"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal d'édition */}
      <BlogEditModal
        show={showModal}
        onHide={handleClose}
        blogData={currentBlog}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onImageUpload={handleImageUpload}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        fileInputKey={fileInputKey}
      />
    </div>
  );
};

export default BlogManagement;