"use client"; // Important pour les hooks client comme useState, useEffect

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'; // Ajouter useCallback
import { Container, Spinner, Row, Col, Card, Badge, Alert, Modal, Button, Dropdown, Table, Form, InputGroup, Pagination as BootstrapPagination } from 'react-bootstrap'; // Renommer Pagination pour éviter conflit
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'; // Tiptap Image
import Link from '@tiptap/extension-link'; // Tiptap Link
import TiptapTable from '@tiptap/extension-table'; // Renommer pour éviter conflit avec react-bootstrap
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Placeholder from '@tiptap/extension-placeholder';
import NextImage from 'next/image'; // Renommer l'import de next/image
import NextLink from 'next/link'; // Renommer l'import de next/link
import PropTypes from 'prop-types';

// Importer les sous-composants s'ils sont réellement utilisés et définis séparément
// import BlogListHeader from "./BlogListHeader"; // Assumons que ces composants existent ou que leur logique est intégrée
// import BlogTable from "./BlogTable";
// import BlogEditModal from "./BlogEditModal"; // Remplacé par la logique interne ici

// Styles
import styles from './BlogManagement.module.css';

// Enregistrer les composants Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

// --- Fonctions Utilitaires (peuvent être dans un fichier séparé) ---

// Convertir format de date pour input type="date"
const convertDateFormat = (dateStr) => {
  if (!dateStr) return new Date().toISOString().split('T')[0]; // Défaut date du jour
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr; // Déjà ISO
  try {
    const frMonths = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const parts = dateStr.split(' ');
    if (parts.length !== 3) return new Date().toISOString().split('T')[0];
    const day = parseInt(parts[0], 10);
    const monthIndex = frMonths.findIndex(m => m === parts[1]?.toLowerCase());
    const year = parseInt(parts[2], 10);
    if (monthIndex === -1 || isNaN(day) || isNaN(year)) return new Date().toISOString().split('T')[0];
    const date = new Date(year, monthIndex, day);
    return date.toISOString().split('T')[0];
  } catch (error) { console.error("Erreur conversion date:", error); return new Date().toISOString().split('T')[0]; }
};

// Formater date en français
const formatDateToFrench = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (error) { console.error("Erreur formatage date:", error); return dateStr; }
};

// --- Composant Principal ---
const BlogManagement = () => {

  // --- STATES ---
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null); // Blog en édition
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null); // { message: string, type: 'success'|'danger'|'warning'|'info' }
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [availableCategories, setAvailableCategories] = useState(['Tous']);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' }); // Tri par défaut
  const [activeView, setActiveView] = useState('table'); // 'table', 'cards', 'stats'
  const [stats, setStats] = useState({ totalBlogs: 0, categoryDistribution: {}, monthlyPublications: {} });
  const [selectedBlogs, setSelectedBlogs] = useState([]); // Pour actions de masse

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage] = useState(8); // Nombre d'items par page

  // State pour la galerie d'images et l'upload
  const [galleryImages, setGalleryImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Pour l'upload dans le modal
  const [uploadProgress, setUploadProgress] = useState(0); // Pour l'upload dans le modal
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Pour reset l'input file
  const fileInputRef = useRef(null); // Ref for hidden file input in modal

  // --- TIPTAP EDITOR HOOK ---
  // Doit être DANS le composant fonctionnel
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { class: 'img-fluid rounded my-2' } }),
      Link.configure({ openOnClick: false }), // Ouvrir les liens dans un nouvel onglet (ou false pour comportement par défaut)
      TiptapTable.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: 'Écrivez le contenu de votre article ici...' }),
    ],
    content: '', // Contenu initial vide, sera mis à jour
    editable: true,
  }, []); // Le tableau de dépendances vide est important ici

   // Mettre à jour le contenu de l'éditeur quand currentBlog change
   useEffect(() => {
       if (editor && currentBlog) {
           // Tiptap recommande d'utiliser setContent pour changer le contenu programmatiquement
           const contentToSet = currentBlog.content || '';
           if (editor.getHTML() !== contentToSet) {
              editor.commands.setContent(contentToSet, false); // false pour ne pas émettre d'événement update
           }
       } else if (editor && !currentBlog) {
            // Vider l'éditeur si on crée un nouveau blog
            if(editor.getHTML() !== '') {
                editor.commands.clearContent(false);
            }
       }
   }, [currentBlog, editor]); // Dépend de currentBlog et editor


  // --- DATA FETCHING & PROCESSING ---
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blogs'); // Assurez-vous que cet endpoint existe et fonctionne
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Erreur ${res.status} lors du chargement des articles`);
      }
      const data = await res.json();
      const fetchedBlogs = data.blogs || data || []; // Gérer différentes structures de réponse possibles

      if (!Array.isArray(fetchedBlogs)) {
          throw new Error("Les données reçues de l'API ne sont pas un tableau.");
      }

      // Normaliser les données (ex: s'assurer qu'il y a un _id et une date ISO)
      const normalizedBlogs = fetchedBlogs.map(blog => ({
          ...blog,
          _id: blog._id || blog.id, // Utiliser _id si présent (MongoDB)
          date: convertDateFormat(blog.date || blog.createdAt), // Assurer format ISO
          displayDate: formatDateToFrench(blog.date || blog.createdAt) // Ajouter date formatée
      }));

      // Tri par date par défaut après fetch
      normalizedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));

      setBlogs(normalizedBlogs);
      showNotification(`${normalizedBlogs.length} article(s) chargé(s)`, "success");

    } catch (err) {
      console.error("Erreur fetchBlogs:", err);
      setError(err.message);
      showNotification(`Erreur chargement: ${err.message}`, "danger");
      setBlogs([]); // Vider en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, []); // useCallback sans dépendances pour fetch initial

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]); // Déclencher le fetch au montage

  // Fetch categories for filter and modal
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/article-categories');
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        const cats = Array.isArray(data.categories) ? data.categories : data;
        setAvailableCategories(['Tous', ...cats.map(c => c.name)]);
      } catch (err) {
        console.error('Erreur chargement catégories', err);
      }
    })();
  }, []);

  // Extraire catégories et calculer stats quand les blogs changent
  useEffect(() => {
    if (blogs.length > 0) {
      calculateStats(blogs);
    } else {
        setStats({ totalBlogs: 0, categoryDistribution: {}, monthlyPublications: {} }); // Reset stats si pas de blogs
    }
  }, [blogs]);

   // Calculer les statistiques (déplacé ici pour être dans le scope du composant)
   const calculateStats = (blogData) => {
     const totalBlogs = blogData.length;
     const categoryDistribution = blogData.reduce((acc, blog) => {
       const category = blog.category || 'Non classé';
       acc[category] = (acc[category] || 0) + 1;
       return acc;
     }, {});
     const monthlyPublications = blogData.reduce((acc, blog) => {
       if (blog.date) {
         try {
           const date = new Date(blog.date); // Utiliser directement la date ISO
           if (!isNaN(date.getTime())) {
              const monthYear = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
              acc[monthYear] = (acc[monthYear] || 0) + 1;
           }
         } catch(e) { /* Ignorer date invalide */ }
       }
       return acc;
     }, {});
     setStats({ totalBlogs, categoryDistribution, monthlyPublications });
   };

   // Préparer les données du graphique
   const chartData = useMemo(() => {
       const labels = [];
       const dataPoints = [];
       const today = new Date();
       for (let i = 11; i >= 0; i--) {
         const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
         const monthYear = d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
         labels.push(monthYear);
         dataPoints.push(stats.monthlyPublications[monthYear] || 0);
       }
       return {
         labels,
         datasets: [{ label: 'Articles publiés', data: dataPoints, borderColor: 'rgba(106, 17, 203, 1)', backgroundColor: 'rgba(106, 17, 203, 0.2)', tension: 0.4, fill: true }]
       };
   }, [stats.monthlyPublications]);

   const chartOptions = useMemo(() => ({ // Mettre dans useMemo
    responsive: true, maintainAspectRatio: false, // Important pour le container
    plugins: { legend: { position: 'top' }, title: { display: false } }, // Titre peut être externe
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
   }), []);


  // --- FILTRAGE & TRI ---
  const sortedAndFilteredBlogs = useMemo(() => {
    let filtered = blogs.filter(blog => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
            blog.title?.toLowerCase().includes(lowerSearch) ||
            blog.content?.toLowerCase().includes(lowerSearch) ||
            blog.author?.toLowerCase().includes(lowerSearch) ||
            blog.category?.toLowerCase().includes(lowerSearch);
      const matchesCategory = selectedCategory === 'Tous' || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      let valA = a[key];
      let valB = b[key];

      // Traitement spécial pour les dates
      if (key === 'date') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }
      // Traitement pour les booléens (isPublished)
      else if (typeof valA === 'boolean') {
         valA = valA ? 1 : 0;
         valB = valB ? 1 : 0;
      }
       // Traitement pour les strings (insensible à la casse)
       else if (typeof valA === 'string') {
           valA = valA.toLowerCase();
           valB = valB.toLowerCase();
       }

      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }, [blogs, searchTerm, selectedCategory, sortConfig]);

  // Pagination des résultats filtrés/triés
  const paginatedBlogs = useMemo(() => {
      const startIndex = (page - 1) * perPage;
      return sortedAndFilteredBlogs.slice(startIndex, startIndex + perPage);
  }, [sortedAndFilteredBlogs, page, perPage]);

  const totalPages = useMemo(() => Math.ceil(sortedAndFilteredBlogs.length / perPage), [sortedAndFilteredBlogs, perPage]);

  // --- HANDLERS ---
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // Disparaît après 5s
  };

  const handlePageChange = (newPage) => {
      setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset page on search
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset page on category change
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    // Pas besoin de reset page ici car useMemo recalculera
  };

  // Handlers pour le modal
  const handleOpenModal = (blog = null) => {
    if (blog) {
      setCurrentBlog({ ...blog, date: convertDateFormat(blog.date) }); // Assurer format ISO pour l'input
      setIsEditing(true);
      // Mettre le contenu dans l'éditeur seulement si l'éditeur est prêt
       if (editor) {
          editor.commands.setContent(blog.content || '', false);
       }
    } else {
      setCurrentBlog({ title: '', author: 'Admin', date: new Date().toISOString().split('T')[0], category: '', content: '', image: '', isPublished: true });
      setIsEditing(false);
       if (editor) {
          editor.commands.clearContent(false);
       }
    }
    setShowModal(true);
    setFileInputKey(Date.now()); // Reset input file
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentBlog(null); // Réinitialiser le blog courant
    setIsEditing(false);
     if (editor) {
         editor.commands.clearContent(false); // Optionnel: vider l'éditeur à la fermeture
     }
  };

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentBlog(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler Upload Image (dans le modal)
  const handleModalImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation type/taille (peut être externalisée)
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('Format d\'image invalide (JPG, PNG, GIF, WEBP).', 'warning'); return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
      showNotification('Image trop volumineuse (Max 5MB).', 'warning'); return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    showNotification('Téléversement de l\'image...', 'info');

    try {
        // --- Logique d'Upload vers API Backend ---
        const formData = new FormData();
        formData.append('image', file); // 'image' doit correspondre au nom attendu par l'API

        const res = await fetch('/api/blogs/upload', { // Adapter l'endpoint API
            method: 'POST',
            body: formData,
             // Pas de 'Content-Type' ici, le navigateur le définit pour FormData
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur serveur ${res.status}`);
        }

        const data = await res.json();
        if (!data.url) {
            throw new Error("L'URL de l'image n'a pas été retournée par l'API.");
        }

        // Mettre à jour l'état du blog courant avec la nouvelle URL
        setCurrentBlog(prev => ({ ...prev, image: data.url }));
        showNotification('Image téléversée avec succès !', 'success');

    } catch (error) {
        console.error("Erreur upload image:", error);
        showNotification(`Erreur upload: ${error.message}`, 'danger');
    } finally {
        setIsUploading(false);
        setUploadProgress(0);
        setFileInputKey(Date.now()); // Reset input file pour permettre re-upload même fichier
    }
  };


  // Handler Sauvegarde Blog (depuis modal)
  const handleSaveBlog = async () => {
    if (!currentBlog || !currentBlog.title) {
      showNotification('Le titre est obligatoire.', 'warning');
      return;
    }
     if (!editor) {
       showNotification('L\'éditeur n\'est pas prêt.', 'warning');
       return;
     }

    const blogDataToSave = {
      ...currentBlog,
      content: editor.getHTML(), // Récupérer le contenu HTML de l'éditeur
      date: currentBlog.date || new Date().toISOString().split('T')[0] // Assurer une date valide
    };

    // Retirer les champs non nécessaires pour l'API (comme 'displayDate')
    delete blogDataToSave.displayDate;

    setLoading(true); // Indiquer le chargement global
    try {
      if (isEditing && currentBlog._id) {
        // --- Appel API UPDATE ---
        const res = await fetch(`/api/blogs/${currentBlog._id}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(blogDataToSave)
         });
         if (!res.ok) { const errData = await res.json().catch(() => ({})); throw new Error(errData.message || 'Erreur MAJ'); }
         const updatedBlog = await res.json();
         setBlogs(prev => prev.map(b => b._id === currentBlog._id ? { ...updatedBlog, displayDate: formatDateToFrench(updatedBlog.date) } : b));
         showNotification('Article modifié avec succès !', 'success');
      } else {
        // --- Appel API CREATE ---
         // Retirer _id s'il existe par erreur (pour création)
         delete blogDataToSave._id;
         const res = await fetch('/api/blogs', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(blogDataToSave)
         });
         if (!res.ok) { const errData = await res.json().catch(() => ({})); throw new Error(errData.message || 'Erreur Création'); }
         const newBlog = await res.json();
         // Ajouter à la liste et re-trier
         setBlogs(prev => [...prev, { ...newBlog, displayDate: formatDateToFrench(newBlog.date) }].sort((a, b) => new Date(b.date) - new Date(a.date)));
         showNotification('Article créé avec succès !', 'success');
      }
      handleCloseModal(); // Fermer le modal après succès
    } catch (err) {
      console.error("Erreur sauvegarde blog:", err);
      showNotification(`Erreur sauvegarde: ${err.message}`, 'danger');
    } finally {
       setLoading(false);
    }
  };

  // Handler Suppression Blog
  const handleDeleteBlog = async (id, title) => {
    if (!window.confirm(`Supprimer l'article "${title}" ?`)) return;

    setLoading(true);
    try {
       // --- Appel API DELETE ---
       const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
       if (!res.ok) { const errData = await res.json().catch(() => ({})); throw new Error(errData.message || 'Erreur Suppression'); }
       // Mettre à jour l'état local
       setBlogs(prev => prev.filter(b => b._id !== id));
       setSelectedBlogs(prev => prev.filter(blogId => blogId !== id)); // Désélectionner si supprimé
       showNotification('Article supprimé avec succès.', 'success');

    } catch (err) {
      console.error("Erreur suppression blog:", err);
      showNotification(`Erreur suppression: ${err.message}`, 'danger');
    } finally {
       setLoading(false);
    }
  };

   // --- Handlers Actions de Masse ---
   const handleSelectBlog = (id) => {
       setSelectedBlogs(prev => prev.includes(id) ? prev.filter(blogId => blogId !== id) : [...prev, id]);
   };

   const handleSelectAllBlogs = (event) => {
       if (event.target.checked) {
           // Sélectionner tous les blogs *actuellement affichés* (paginés)
           setSelectedBlogs(paginatedBlogs.map(b => b._id));
       } else {
           setSelectedBlogs([]);
       }
   };

   // Vérifier si tous les blogs visibles sont sélectionnés
   const areAllVisibleSelected = useMemo(() => {
      if (paginatedBlogs.length === 0) return false;
      return paginatedBlogs.every(b => selectedBlogs.includes(b._id));
   }, [paginatedBlogs, selectedBlogs]);


   const handleBulkDelete = async () => {
    if (selectedBlogs.length === 0) { showNotification("Aucun article sélectionné.", "warning"); return; }

    const confirmMessage = `Supprimer ${selectedBlogs.length} article(s) sélectionné(s) ?`;
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedBlogs) {
      try {
          const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error(`Erreur suppression ${id}`);
          successCount++;
      } catch (err) {
          console.error(`Erreur suppression ${id}:`, err);
          errorCount++;
      }
    }

    setLoading(false);
    const resultMessage = errorCount > 0
      ? `${successCount} article(s) supprimé(s), ${errorCount} erreur(s).`
      : `${successCount} article(s) supprimé(s) avec succès.`;
    showNotification(resultMessage, errorCount > 0 ? "warning" : "success");
    setSelectedBlogs([]); // Vider la sélection
    fetchBlogs(); // Recharger la liste
  };

  // --- Rendu ---
  return (
    <div className={`${styles['blog-management-modern']} fade-in`}> {/* Appliquer style module */}

      {/* Notification */}
      {notification && (
        <Alert variant={notification.type} dismissible onClose={() => setNotification(null)} className={styles['notification-toast']}>
          {notification.message}
        </Alert>
      )}

      {/* En-tête */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className={`${styles['page-title']} mb-3 mb-sm-0`}><i className="icofont-page me-2"></i>Gestion du Blog</h2>
        <div className={styles['view-toggle-buttons']}>
          {/* Boutons de vue */}
          <Button variant={activeView === 'table' ? 'primary' : 'outline-primary'} className="me-2" onClick={() => setActiveView('table')}><i className="icofont-listing-box me-1"></i> Tableau</Button>
          <Button variant={activeView === 'cards' ? 'primary' : 'outline-primary'} className="me-2" onClick={() => setActiveView('cards')}><i className="icofont-ui-grid me-1"></i> Cartes</Button>
          <Button variant={activeView === 'stats' ? 'primary' : 'outline-primary'} onClick={() => setActiveView('stats')}><i className="icofont-chart-bar-graph me-1"></i> Stats</Button>
        </div>
      </div>

      {/* Dashboard Cards (Stats globales rapides) */}
      <Row className={`${styles['stats-cards']} mb-4`}>
         {/* ... (colonne total, catégories, mois courant) ... */}
         <Col md={4} className="mb-3"><Card className={`${styles['dashboard-card']} shadow-sm h-100`}><Card.Body className="d-flex align-items-center"><div className={`${styles['card-icon-bg']} ${styles.primary}`}><i className="icofont-newspaper"></i></div><div className="ms-3"><Card.Title className={styles['card-value']}>{stats.totalBlogs}</Card.Title><Card.Text className={styles['card-label']}>Articles au total</Card.Text></div></Card.Body></Card></Col>
         <Col md={4} className="mb-3">
           <Card className={`${styles['dashboard-card']} shadow-sm h-100`}>
             <Card.Body className="d-flex align-items-center">
               <div className={`${styles['card-icon-bg']} ${styles.success}`}><i className="icofont-tag"></i></div>
               <div className="ms-3">
                 <Card.Title className={styles['card-value']}>{availableCategories.length - 1}</Card.Title>
                 <Card.Text className={styles['card-label']}>Catégories</Card.Text>
                 <NextLink href="/admin/categories" passHref legacyBehavior>
                   <Button variant="link" size="sm" className="p-0">Voir catégories</Button>
                 </NextLink>
               </div>
             </Card.Body>
           </Card>
         </Col>
         <Col md={4} className="mb-3"><Card className={`${styles['dashboard-card']} shadow-sm h-100`}><Card.Body className="d-flex align-items-center"><div className={`${styles['card-icon-bg']} ${styles.warning}`}><i className="icofont-ui-calendar"></i></div><div className="ms-3"><Card.Title className={styles['card-value']}>{stats.monthlyPublications[new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })] || 0}</Card.Title><Card.Text className={styles['card-label']}>Articles ce mois</Card.Text></div></Card.Body></Card></Col>
      </Row>

      {/* Contenu Principal (Conditionnel selon la vue) */}
      <Card className={`${styles['main-content-card']} shadow-sm`}>
        <Card.Body>
          {/* Barre d'outils/Filtres - Utilisation du composant BlogListHeader si défini */}
          {/* <BlogListHeader
              filteredPostsCount={sortedAndFilteredBlogs.length}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              availableCategories={availableCategories}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onAddPost={handleOpenModal}
              onSelectAll={handleSelectAllBlogs}
              selectedCount={selectedBlogs.length}
              onBulkDelete={handleBulkDelete}
              sortConfig={sortConfig}
              onSort={handleSort}
              activeView={activeView} // Potentiellement inutile ici
          /> */}
          {/* Barre d'outils/Filtres (Intégrée pour l'exemple) */}
           <div className="blog-list-header mb-4">
               <Row className="g-2 align-items-center">
                  <Col md={5}>
                     <InputGroup size="sm">
                        <InputGroup.Text><i className="icofont-search-1"></i></InputGroup.Text>
                        <Form.Control placeholder="Rechercher titre, contenu, auteur..." value={searchTerm} onChange={handleSearchChange} />
                     </InputGroup>
                  </Col>
                  <Col md={3}>
                     <Form.Select size="sm" value={selectedCategory} onChange={handleCategoryChange}>
                        {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                     </Form.Select>
                  </Col>
                  <Col md={4} className="text-md-end">
                     <Button size="sm" variant="primary" onClick={() => handleOpenModal()}>
                        <i className="icofont-plus me-1"></i> Ajouter Article
                     </Button>
                  </Col>
                  {/* Actions de masse si sélection */}
                  {selectedBlogs.length > 0 && (
                    <Col xs={12} className="mt-2 d-flex justify-content-between align-items-center border-top pt-2">
                       <Form.Check
                           type="checkbox"
                           id="select-all-visible-header"
                           label={`${selectedBlogs.length} sélectionné(s)`}
                           checked={areAllVisibleSelected && selectedBlogs.length > 0} // Cocher si tous visibles le sont
                           onChange={handleSelectAllBlogs} // Va cocher/décocher tous les visibles
                       />
                       <Button variant="outline-danger" size="sm" onClick={handleBulkDelete}>
                           <i className="icofont-trash me-1"></i> Supprimer Sélection
                       </Button>
                    </Col>
                  )}
               </Row>
           </div>

          {/* Affichage conditionnel (Tableau, Cartes, Stats) */}
          {loading ? (
             <div className="text-center p-5"><Spinner animation="border" variant="primary" /><p className="mt-2">Chargement...</p></div>
          ) : error ? (
             <Alert variant="danger">Erreur: {error}</Alert>
          ) : (
            <>
              {activeView === 'table' && (
                  <div className="table-responsive">
                     <Table hover responsive className={`${styles['blog-table']} mb-0`}>
                        <thead className="table-light">
                           <tr>
                             <th style={{ width: '40px' }}>
                                <Form.Check type="checkbox" id="select-all-header" aria-label="Sélectionner tout" onChange={handleSelectAllBlogs} checked={areAllVisibleSelected && paginatedBlogs.length > 0}/>
                             </th>
                             <th onClick={() => handleSort('title')} style={{cursor: 'pointer'}}>Titre {sortConfig.key === 'title' && <i className={`icofont-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>}</th>
                             <th onClick={() => handleSort('category')} style={{cursor: 'pointer'}}>Catégorie {sortConfig.key === 'category' && <i className={`icofont-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>}</th>
                             <th onClick={() => handleSort('author')} style={{cursor: 'pointer'}}>Auteur {sortConfig.key === 'author' && <i className={`icofont-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>}</th>
                             <th onClick={() => handleSort('date')} style={{cursor: 'pointer'}}>Date {sortConfig.key === 'date' && <i className={`icofont-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>}</th>
                             <th onClick={() => handleSort('isPublished')} style={{cursor: 'pointer'}}>Statut {sortConfig.key === 'isPublished' && <i className={`icofont-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>}</th>
                             <th>Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                           {paginatedBlogs.length === 0 ? (
                              <tr><td colSpan="7" className="text-center py-4 text-muted">Aucun article trouvé {searchTerm || selectedCategory !== 'Tous' ? 'pour ces critères' : ''}.</td></tr>
                           ) : (
                              paginatedBlogs.map(blog => (
                                 <tr key={blog._id}>
                                    <td><Form.Check type="checkbox" id={`select-${blog._id}`} aria-label={`Sélectionner ${blog.title}`} checked={selectedBlogs.includes(blog._id)} onChange={() => handleSelectBlog(blog._id)} /></td>
                                    <td className='fw-bold'>{blog.title}</td>
                                    <td><Badge bg="secondary" pill>{blog.category || 'N/A'}</Badge></td>
                                    <td>{blog.author || 'Admin'}</td>
                                    <td>{blog.displayDate || formatDateToFrench(blog.date)}</td>
                                    <td>{blog.isPublished ? <Badge bg="success">Publié</Badge> : <Badge bg="secondary">Brouillon</Badge>}</td>
                                    <td>
                                       <Button size="sm" variant="outline-primary" className="me-1 py-0 px-1" title="Modifier" onClick={() => handleOpenModal(blog)}><i className="icofont-edit" /></Button>
                                       <Button size="sm" variant="outline-danger" className="py-0 px-1" title="Supprimer" onClick={() => handleDeleteBlog(blog._id, blog.title)}><i className="icofont-trash" /></Button>
                                    </td>
                                 </tr>
                              ))
                           )}
                        </tbody>
                     </Table>
                  </div>
              )}

              {activeView === 'cards' && (
                  sortedAndFilteredBlogs.length === 0 ? (
                     <div className="text-center py-5 text-muted">Aucun article trouvé.</div>
                   ) : (
                      <Row className={`${styles['blog-cards']} mt-3`}>
                          {paginatedBlogs.map(blog => ( // Afficher seulement les blogs paginés
                            <Col key={blog._id} lg={4} md={6} className="mb-4">
                               <Card className={`${styles['blog-card']} h-100 shadow-sm`}>
                                   <div className={styles['blog-card-img-container']}>
                                       <NextLink href={`/blog/${blog.slug || blog._id}`} passHref legacyBehavior><a> {/* Ajouter un lien vers la page blog */}
                                          <Card.Img variant="top" src={blog.image || 'https://via.placeholder.com/300x200?text=Image'} className={styles['blog-card-img']} />
                                       </a></NextLink>
                                       {blog.isPublished ? <Badge pill bg="success" className={styles.statusBadge}>Publié</Badge> : <Badge pill bg="secondary" className={styles.statusBadge}>Brouillon</Badge>}
                                   </div>
                                   <Card.Body>
                                      <Badge bg="primary" className="mb-2">{blog.category || 'Non classé'}</Badge>
                                       <Card.Title className={styles['blog-card-title']}>
                                           <NextLink href={`/blog/${blog.slug || blog._id}`} className="text-decoration-none text-dark">{blog.title}</NextLink>
                                       </Card.Title>
                                      <div className={`${styles['blog-card-meta']} small text-muted`}>
                                         <span className="me-3"><i className="icofont-ui-user me-1"></i>{blog.author}</span>
                                         <span><i className="icofont-calendar me-1"></i>{blog.displayDate || formatDateToFrench(blog.date)}</span>
                                      </div>
                                      {/* <Card.Text className={styles['blog-card-excerpt']}>{blog.content?.substring(0, 80)}...</Card.Text> */}
                                   </Card.Body>
                                   <Card.Footer className={`${styles['blog-card-footer']} bg-white border-top-0 pt-0`}>
                                      <Button variant="primary" size="sm" onClick={() => handleOpenModal(blog)}><i className="icofont-edit me-1"></i></Button>
                                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteBlog(blog._id, blog.title)}><i className="icofont-trash"></i></Button>
                                   </Card.Footer>
                               </Card>
                            </Col>
                         ))}
                      </Row>
                   )
              )}

              {activeView === 'stats' && (
                  <div className={`${styles['blog-stats-container']} mt-4`}>
                     <Row>
                        <Col lg={7} className="mb-4">
                           <Card className={`${styles['chart-card']} shadow-sm`}>
                              <Card.Body>
                                 <Card.Title>Publications mensuelles</Card.Title>
                                 <div className={styles['chart-container']} style={{ height: '300px' }}>
                                    <Line data={chartData} options={chartOptions} />
                                 </div>
                              </Card.Body>
                           </Card>
                        </Col>
                        <Col lg={5}>
                           <Card className={`${styles['category-stats-card']} shadow-sm mb-4`}>
                              <Card.Body>
                                 <Card.Title>Articles par catégorie</Card.Title>
                                  <div className={styles['category-stats']}>
                                    {Object.entries(stats.categoryDistribution).sort(([, a], [, b]) => b - a).map(([category, count]) => (
                                       <div key={category} className={styles['category-stat-item']}>
                                          <div className="d-flex justify-content-between align-items-center mb-1"><span className="text-capitalize">{category}</span><Badge bg="primary" pill>{count}</Badge></div>
                                          <div className="progress" style={{height: '6px'}}><div className="progress-bar" role="progressbar" style={{ width: `${(count / stats.totalBlogs) * 100}%`, background: `linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)` }} ></div></div>
                                       </div>
                                     ))}
                                  </div>
                              </Card.Body>
                           </Card>
                           {/* Autres stats ou actions rapides possibles ici */}
                        </Col>
                     </Row>
                  </div>
               )}
            </>
          )}

          {/* Pagination (commune à Table et Cards) */}
          {totalPages > 1 && (activeView === 'table' || activeView === 'cards') && (
             <div className="d-flex justify-content-center mt-4">
                <BootstrapPagination size="sm">
                    <BootstrapPagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                     {/* Logique d'affichage des pages */}
                    {currentPage > 2 && <BootstrapPagination.Item onClick={() => handlePageChange(1)}>1</BootstrapPagination.Item>}
                    {currentPage > 3 && <BootstrapPagination.Ellipsis disabled />}
                    {currentPage > 1 && <BootstrapPagination.Item onClick={() => handlePageChange(page - 1)}>{page - 1}</BootstrapPagination.Item>}
                    <BootstrapPagination.Item active>{page}</BootstrapPagination.Item>
                    {currentPage < totalPages && <BootstrapPagination.Item onClick={() => handlePageChange(page + 1)}>{page + 1}</BootstrapPagination.Item>}
                    {currentPage < totalPages - 2 && <BootstrapPagination.Ellipsis disabled />}
                    {currentPage < totalPages - 1 && <BootstrapPagination.Item onClick={() => handlePageChange(totalPages)}>{totalPages}</BootstrapPagination.Item>}
                    <BootstrapPagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                </BootstrapPagination>
             </div>
          )}

        </Card.Body>
      </Card>

      {/* Modal d'édition/création (Logique interne pour Tiptap) */}
      {showModal && (
         <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
           <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
             <div className="modal-content">
               <Form onSubmit={(e) => { e.preventDefault(); handleSaveBlog(); }}> {/* Form englobant */}
                 <Modal.Header closeButton onHide={handleCloseModal}>
                   <Modal.Title>{isEditing ? 'Modifier' : 'Créer'} un article</Modal.Title>
                 </Modal.Header>
                 <Modal.Body>
                   <Form.Group className="mb-3">
                     <Form.Label>Titre *</Form.Label>
                     <Form.Control name="title" value={currentBlog?.title || ''} onChange={handleModalInputChange} required />
                   </Form.Group>
                   <Row>
                     <Col md={6}>
                       <Form.Group className="mb-3">
                         <Form.Label>Catégorie</Form.Label>
                         <Form.Select name="category" value={currentBlog?.category || ''} onChange={handleModalInputChange}>
                           <option value="">— Sélectionnez —</option>
                           {availableCategories.filter(cat => cat !== 'Tous').map(cat => (
                             <option key={cat} value={cat}>{cat}</option>
                           ))}
                         </Form.Select>
                       </Form.Group>
                     </Col>
                      <Col md={6}>
                       <Form.Group className="mb-3">
                         <Form.Label>Date de publication *</Form.Label>
                         <Form.Control type="date" name="date" value={currentBlog?.date || ''} onChange={handleModalInputChange} required />
                       </Form.Group>
                     </Col>
                   </Row>
                    <Form.Group className="mb-3">
                       <Form.Label>Image Principale (URL ou Upload)</Form.Label>
                       <InputGroup>
                           <Form.Control name="image" placeholder="URL de l'image" value={currentBlog?.image || ''} onChange={handleModalInputChange} />
                           <input type="file" accept="image/*" onChange={handleModalImageUpload} ref={fileInputRef} style={{ display: 'none' }} key={fileInputKey} />
                           <Button variant="outline-secondary" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                               {isUploading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Chargement...</> : 'Upload'}
                           </Button>
                       </InputGroup>
                       {isUploading && <div className="progress mt-2" style={{height: '5px'}}><div className="progress-bar" role="progressbar" style={{width: `${uploadProgress}%`}} ></div></div>}
                       {currentBlog?.image && <img src={currentBlog.image} alt="Aperçu" className="img-thumbnail mt-2" style={{maxHeight: '100px'}}/>}
                   </Form.Group>

                   <a href="/admin/categories" className="btn btn-outline-secondary btn-sm mb-3">Gérer catégories</a>

                   <Form.Group className="mb-3">
                     <Form.Label>Contenu *</Form.Label>
                     {/* Barre d'outils Tiptap */}
                     {editor && (
                        <div className="tip-tap-toolbar border rounded-top p-2 bg-light d-flex flex-wrap gap-1">
                           {/* Boutons de base */}
                            <Button size="sm" variant={editor.isActive('bold') ? 'dark' : 'outline-dark'} onClick={() => editor.chain().focus().toggleBold().run()}><i className="icofont-bold"></i></Button>
                            <Button size="sm" variant={editor.isActive('italic') ? 'dark' : 'outline-dark'} onClick={() => editor.chain().focus().toggleItalic().run()}><i className="icofont-italic"></i></Button>
                            <Button size="sm" variant={editor.isActive('strike') ? 'dark' : 'outline-dark'} onClick={() => editor.chain().focus().toggleStrike().run()}><i className="icofont-strikethrough"></i></Button>
                            <Button size="sm" variant={editor.isActive('heading', { level: 2 }) ? 'dark' : 'outline-dark'} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
                            <Button size="sm" variant={editor.isActive('heading', { level: 3 }) ? 'dark' : 'outline-dark'} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Button>
                            <Button size="sm" variant={editor.isActive('bulletList') ? 'dark' : 'outline-dark'} onClick={() => editor.chain().focus().toggleBulletList().run()}><i className="icofont-listing-box"></i></Button>
                            <Button size="sm" variant={editor.isActive('orderedList') ? 'dark' : 'outline-dark'} onClick={() => editor.chain().focus().toggleOrderedList().run()}><i className="icofont-listing-number"></i></Button>
                            <Button size="sm" variant={editor.isActive('blockquote') ? 'dark' : 'outline-dark'} onClick={() => editor.chain().focus().toggleBlockquote().run()}><i className="icofont-quote-left"></i></Button>
                            {/* Ajouter un bouton pour insérer une image depuis l'upload ou URL */}
                            <Button size="sm" variant="outline-info" onClick={() => {const url = prompt("URL de l'image:"); if(url) editor.chain().focus().setImage({ src: url }).run();}}>Img</Button>
                            {/* Ajouter bouton lien */}
                             <Button size="sm" variant={editor.isActive('link') ? 'dark' : 'outline-dark'} onClick={() => { const url = prompt("URL du lien:"); if(url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();}}>Lien</Button>
                             {editor.isActive('link') && <Button size="sm" variant="outline-danger" onClick={() => editor.chain().focus().unsetLink().run()}>X Lien</Button>}
                            {/* Ajouter boutons table */}
                            <Button size="sm" variant="outline-secondary" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</Button>
                            {editor.can().deleteTable() && <Button size="sm" variant="outline-danger" onClick={() => editor.chain().focus().deleteTable().run()}>X Table</Button>
                            }
                         </div>
                     )}
                     <div className="border border-top-0 rounded-bottom p-2" style={{ minHeight: '250px' }}>
                       <EditorContent editor={editor} />
                     </div>
                   </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check type="switch" id="blog-published" label="Publier cet article" name="isPublished" checked={currentBlog?.isPublished || false} onChange={handleModalInputChange} />
                    </Form.Group>
                 </Modal.Body>
                 <Modal.Footer>
                   <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
                   <Button variant="primary" type="submit" disabled={isUploading || loading}>
                     {isUploading ? 'Upload...' : (isEditing ? 'Enregistrer' : 'Créer')}
                   </Button>
                 </Modal.Footer>
               </Form>
             </div>
           </div>
         </div>
      )}

    </div> // Fin du div principal
  );
}; // Fin du composant BlogManagement

export default BlogManagement;