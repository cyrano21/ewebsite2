import { useState, useEffect, useContext, useCallback } from 'react';
import { Table, Button, Badge, Container, Row, Col, Card, Form, Tabs, Tab, Alert, Modal, Pagination } from 'react-bootstrap';
import AdminLayout from '../../components/admin/AdminLayout';
import Head from 'next/head';
import { AuthContext } from '../../contexts/AuthProvider';
import { FaStar, FaSearch, FaCheck, FaTimes, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrer les composants requis pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ITEMS_PER_PAGE = 10;

const AdminReviews = () => {
  // États pour toutes les catégories d'avis
  const [allReviews, setAllReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [rejectedReviews, setRejectedReviews] = useState([]);
  
  // État pour le chargement et les erreurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // États pour le filtrage et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  
  // État pour les modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // Statistiques
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingCounts: [0, 0, 0, 0, 0],
    recentActivity: []
  });
  
  const { user } = useContext(AuthContext);

  // Fonction pour récupérer le token
  const getToken = () => {
    return localStorage.getItem('auth-token');
  };

  // Fonction pour afficher une notification
  const showNotification = (message, type = 'success') => {
    if (type === 'success') {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Fonction pour récupérer tous les avis
  const fetchAllReviews = useCallback(async () => {
    try {
      setLoading(true);
      
      const token = getToken();
      
      if (!token) {
        setError('Authentification requise');
        setLoading(false);
        return;
      }
      
      const res = await fetch('/api/admin/reviews', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setAllReviews(data.data);
        
        // Filtrer les avis par statut
        setPendingReviews(data.data.filter(review => !review.approved && !review.rejected));
        setApprovedReviews(data.data.filter(review => review.approved));
        setRejectedReviews(data.data.filter(review => review.rejected));
        
        // Mettre à jour les statistiques
        updateStats(data.data);
        
        // Calculer le nombre total de pages
        setTotalPages(Math.ceil(data.data.length / ITEMS_PER_PAGE));
      } else {
        setError(data.message || 'Erreur lors de la récupération des avis');
      }
    } catch (error) {
      setError('Erreur lors de la récupération des avis');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour mettre à jour les statistiques
  const updateStats = (reviews) => {
    if (!reviews || reviews.length === 0) return;
    
    // Calculer les statistiques
    const totalReviews = reviews.length;
    const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (ratingSum / totalReviews).toFixed(1);
    
    // Compter les avis par note
    const ratingCounts = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++;
      }
    });
    
    // Activité récente (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = reviews
      .filter(review => new Date(review.date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
    
    setStats({
      totalReviews,
      averageRating,
      ratingCounts,
      recentActivity
    });
  };

  // Effet pour charger les avis au chargement de la page
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAllReviews();
    } else {
      setError('Accès réservé aux administrateurs');
      setLoading(false);
    }
  }, [user, fetchAllReviews]);

  // Fonction pour approuver un avis
  const handleApproveReview = async (productId, reviewId) => {
    try {
      const token = getToken();
      
      if (!token) {
        showNotification('Authentification requise pour approuver les avis', 'error');
        return;
      }
      
      const res = await fetch(`/api/products/${productId}/reviews/${reviewId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Mettre à jour les listes d'avis
        const updatedAllReviews = allReviews.map(review => 
          review._id === reviewId 
            ? { ...review, approved: true, rejected: false } 
            : review
        );
        
        setAllReviews(updatedAllReviews);
        setPendingReviews(pendingReviews.filter(review => review._id !== reviewId));
        setApprovedReviews([...approvedReviews, allReviews.find(review => review._id === reviewId)]);
        
        showNotification('L\'avis a été approuvé avec succès');
      } else {
        showNotification(data.message || 'Erreur lors de l\'approbation de l\'avis', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation de l\'avis:', error);
      showNotification('Une erreur est survenue lors de l\'approbation de l\'avis', 'error');
    }
  };

  // Fonction pour ouvrir la modale de rejet
  const openRejectModal = (review) => {
    setSelectedReview(review);
    setShowRejectModal(true);
  };

  // Fonction pour rejeter un avis
  const handleRejectReview = async () => {
    if (!selectedReview) return;
    
    try {
      const token = getToken();
      
      if (!token) {
        showNotification('Authentification requise pour rejeter les avis', 'error');
        return;
      }
      
      const res = await fetch(`/api/products/${selectedReview.productId}/reviews/${selectedReview._id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Mettre à jour les listes d'avis
        const updatedAllReviews = allReviews.map(review => 
          review._id === selectedReview._id 
            ? { ...review, approved: false, rejected: true, rejectReason } 
            : review
        );
        
        setAllReviews(updatedAllReviews);
        setPendingReviews(pendingReviews.filter(review => review._id !== selectedReview._id));
        setRejectedReviews([...rejectedReviews, { ...selectedReview, rejected: true, rejectReason }]);
        
        // Fermer la modale et réinitialiser les champs
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedReview(null);
        
        showNotification('L\'avis a été rejeté avec succès');
      } else {
        showNotification(data.message || 'Erreur lors du rejet de l\'avis', 'error');
      }
    } catch (error) {
      console.error('Erreur lors du rejet de l\'avis:', error);
      showNotification('Une erreur est survenue lors du rejet de l\'avis', 'error');
    }
  };

  // Fonction pour ouvrir la modale de suppression
  const openDeleteModal = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  // Fonction pour supprimer un avis
  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    
    try {
      const token = getToken();
      
      if (!token) {
        showNotification('Authentification requise pour supprimer les avis', 'error');
        return;
      }
      
      const res = await fetch(`/api/products/${selectedReview.productId}/reviews/${selectedReview._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Mettre à jour les listes d'avis
        const updatedAllReviews = allReviews.filter(review => review._id !== selectedReview._id);
        setAllReviews(updatedAllReviews);
        
        setPendingReviews(pendingReviews.filter(review => review._id !== selectedReview._id));
        setApprovedReviews(approvedReviews.filter(review => review._id !== selectedReview._id));
        setRejectedReviews(rejectedReviews.filter(review => review._id !== selectedReview._id));
        
        // Fermer la modale
        setShowDeleteModal(false);
        setSelectedReview(null);
        
        showNotification('L\'avis a été supprimé avec succès');
      } else {
        showNotification(data.message || 'Erreur lors de la suppression de l\'avis', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avis:', error);
      showNotification('Une erreur est survenue lors de la suppression de l\'avis', 'error');
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour filtrer les avis en fonction des critères de recherche
  const filterReviews = (reviews) => {
    if (!reviews) return [];
    
    return reviews.filter(review => {
      // Filtre de recherche textuelle
      const searchMatch = searchTerm === '' || 
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        review.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtre par produit
      const productMatch = filterProduct === '' || 
        review.productName?.toLowerCase().includes(filterProduct.toLowerCase());
      
      // Filtre par note
      const ratingMatch = filterRating === '' || 
        review.rating === parseInt(filterRating);
      
      return searchMatch && productMatch && ratingMatch;
    });
  };

  // Récupérer les avis à afficher en fonction de l'onglet actif
  const getReviewsToDisplay = () => {
    let reviewsToDisplay;
    
    switch(activeTab) {
      case 'all':
        reviewsToDisplay = filterReviews(allReviews);
        break;
      case 'approved':
        reviewsToDisplay = filterReviews(approvedReviews);
        break;
      case 'rejected':
        reviewsToDisplay = filterReviews(rejectedReviews);
        break;
      case 'pending':
      default:
        reviewsToDisplay = filterReviews(pendingReviews);
        break;
    }
    
    // Appliquer la pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return reviewsToDisplay.slice(startIndex, endIndex);
  };

  // Calculer le nombre total de pages après filtrage
  const calculateTotalPages = () => {
    let totalItems;
    
    switch(activeTab) {
      case 'all':
        totalItems = filterReviews(allReviews).length;
        break;
      case 'approved':
        totalItems = filterReviews(approvedReviews).length;
        break;
      case 'rejected':
        totalItems = filterReviews(rejectedReviews).length;
        break;
      case 'pending':
      default:
        totalItems = filterReviews(pendingReviews).length;
        break;
    }
    
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  };

  // Données pour le graphique des notes
  const ratingChartData = {
    labels: ['1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'],
    datasets: [
      {
        label: 'Nombre d\'avis',
        data: stats.ratingCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
      },
    ],
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
        text: 'Distribution des notes',
      },
    },
  };

  // Fonction pour générer la pagination
  const renderPagination = () => {
    const paginationItems = [];
    const totalPagesCount = calculateTotalPages();
    
    // Première page
    paginationItems.push(
      <Pagination.First
        key="first"
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
      />
    );
    
    // Page précédente
    paginationItems.push(
      <Pagination.Prev
        key="prev"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );
    
    // Pages numérotées
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPagesCount, startPage + 4);
    
    if (endPage - startPage < 4 && totalPagesCount > 5) {
      startPage = Math.max(1, endPage - 4);
    }
    
    // Ellipsis avant les pages
    if (startPage > 1) {
      paginationItems.push(<Pagination.Item key={1} onClick={() => setCurrentPage(1)}>{1}</Pagination.Item>);
      if (startPage > 2) {
        paginationItems.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
      }
    }
    
    // Pages centrales
    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    
    // Ellipsis après les pages
    if (endPage < totalPagesCount) {
      if (endPage < totalPagesCount - 1) {
        paginationItems.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
      }
      paginationItems.push(
        <Pagination.Item
          key={totalPagesCount}
          onClick={() => setCurrentPage(totalPagesCount)}
        >
          {totalPagesCount}
        </Pagination.Item>
      );
    }
    
    // Page suivante
    paginationItems.push(
      <Pagination.Next
        key="next"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPagesCount}
      />
    );
    
    // Dernière page
    paginationItems.push(
      <Pagination.Last
        key="last"
        onClick={() => setCurrentPage(totalPagesCount)}
        disabled={currentPage === totalPagesCount}
      />
    );
    
    return (
      <Pagination className="mt-3 justify-content-center">
        {paginationItems}
      </Pagination>
    );
  };

  // Fonction pour afficher les étoiles
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'text-warning' : 'text-muted'}
        />
      );
    }
    return stars;
  };

  // Fonction pour afficher une évaluation plus détaillée
  const renderDetailedRating = (rating) => {
    const color = rating >= 4 ? 'success' : rating >= 3 ? 'warning' : 'danger';
    return (
      <div className="d-flex align-items-center">
        <Badge bg={color} className="me-2">
          {rating}/5
        </Badge>
        <span>{renderStars(rating)}</span>
      </div>
    );
  };

  return (
    <AdminLayout>
      <Head>
        <title>Gestion des avis | Administration</title>
      </Head>
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h1>Gestion des avis clients</h1>
            <p className="text-muted">
              Gérez les avis clients, approuvez ou rejetez les nouveaux avis, et consultez les statistiques.
            </p>
          </Col>
        </Row>

        {/* Alertes de succès ou d'erreur */}
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {/* Statistiques */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Aperçu des avis</Card.Title>
                <div className="d-flex justify-content-between mt-3 mb-2">
                  <div className="text-center">
                    <h2>{stats.totalReviews}</h2>
                    <p className="text-muted">Total des avis</p>
                  </div>
                  <div className="text-center">
                    <h2>{pendingReviews.length}</h2>
                    <p className="text-muted">En attente</p>
                  </div>
                  <div className="text-center">
                    <h2>{stats.averageRating}</h2>
                    <p className="text-muted">Note moyenne</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Distribution des notes</Card.Title>
                <div style={{ height: '200px' }}>
                  <Bar data={ratingChartData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filtres et recherche */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rechercher</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Rechercher par produit, utilisateur ou commentaire..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Filtrer par produit</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nom du produit..."
                    value={filterProduct}
                    onChange={(e) => setFilterProduct(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Filtrer par note</Form.Label>
                  <Form.Select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                  >
                    <option value="">Toutes les notes</option>
                    <option value="5">5 étoiles</option>
                    <option value="4">4 étoiles</option>
                    <option value="3">3 étoiles</option>
                    <option value="2">2 étoiles</option>
                    <option value="1">1 étoile</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Onglets des avis */}
        <Card>
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(key) => {
                setActiveTab(key);
                setCurrentPage(1); // Réinitialiser la pagination lors du changement d'onglet
              }}
              className="mb-3"
            >
              <Tab 
                eventKey="pending" 
                title={
                  <span>
                    En attente <Badge bg="warning">{pendingReviews.length}</Badge>
                  </span>
                }
              />
              <Tab 
                eventKey="approved" 
                title={
                  <span>
                    Approuvés <Badge bg="success">{approvedReviews.length}</Badge>
                  </span>
                }
              />
              <Tab 
                eventKey="rejected" 
                title={
                  <span>
                    Rejetés <Badge bg="danger">{rejectedReviews.length}</Badge>
                  </span>
                }
              />
              <Tab 
                eventKey="all" 
                title={
                  <span>
                    Tous <Badge bg="primary">{allReviews.length}</Badge>
                  </span>
                }
              />
            </Tabs>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : getReviewsToDisplay().length === 0 ? (
              <Alert variant="info">
                Aucun avis trouvé pour ces critères.
              </Alert>
            ) : (
              <>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Note</th>
                      <th>Commentaire</th>
                      <th>Utilisateur</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getReviewsToDisplay().map(review => (
                      <tr key={review._id}>
                        <td>
                          <a href={`/shop/product/${review.productSlug}`} target="_blank" rel="noopener noreferrer">
                            {review.productName}
                          </a>
                        </td>
                        <td>
                          {renderDetailedRating(review.rating)}
                        </td>
                        <td>
                          {review.comment && review.comment.length > 100
                            ? `${review.comment.substring(0, 100)}...`
                            : review.comment}
                        </td>
                        <td>{review.user?.name || 'Utilisateur inconnu'}</td>
                        <td>{formatDate(review.date)}</td>
                        <td>
                          {review.approved ? (
                            <Badge bg="success">Approuvé</Badge>
                          ) : review.rejected ? (
                            <Badge bg="danger">Rejeté</Badge>
                          ) : (
                            <Badge bg="warning">En attente</Badge>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {!review.approved && !review.rejected && (
                              <>
                                <Button 
                                  variant="success" 
                                  size="sm"
                                  title="Approuver"
                                  onClick={() => handleApproveReview(review.productId, review._id)}
                                >
                                  <FaCheck />
                                </Button>
                                <Button 
                                  variant="warning" 
                                  size="sm"
                                  title="Rejeter"
                                  onClick={() => openRejectModal(review)}
                                >
                                  <FaTimes />
                                </Button>
                              </>
                            )}
                            <Button 
                              variant="danger" 
                              size="sm"
                              title="Supprimer"
                              onClick={() => openDeleteModal(review)}
                            >
                              <FaTrashAlt />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                
                {/* Pagination */}
                {calculateTotalPages() > 1 && renderPagination()}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modale de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer définitivement cet avis ?</p>
          {selectedReview && (
            <div className="p-3 bg-light rounded">
              <p><strong>Produit :</strong> {selectedReview.productName}</p>
              <p>
                <strong>Note :</strong> {' '}
                {renderStars(selectedReview.rating)}
              </p>
              <p><strong>Commentaire :</strong> {selectedReview.comment}</p>
            </div>
          )}
          <Alert variant="warning" className="mt-3">
            <FaExclamationTriangle className="me-2" />
            Cette action est irréversible.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteReview}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modale de rejet */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rejeter l'avis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Veuillez indiquer la raison du rejet de cet avis :</p>
          {selectedReview && (
            <div className="p-3 bg-light rounded mb-3">
              <p><strong>Produit :</strong> {selectedReview.productName}</p>
              <p>
                <strong>Note :</strong> {' '}
                {renderStars(selectedReview.rating)}
              </p>
              <p><strong>Commentaire :</strong> {selectedReview.comment}</p>
            </div>
          )}
          <Form.Group>
            <Form.Label>Raison du rejet</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ex : Contenu inapproprié, langage offensant, etc."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="warning" 
            onClick={handleRejectReview}
            disabled={rejectReason.trim() === ''}
          >
            Rejeter
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default AdminReviews;