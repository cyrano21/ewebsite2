import React, { useState, useEffect, useCallback } from 'react';
import { Button, Row, Col, Card, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import { debounce } from 'lodash';
import axios from 'axios';
import Link from 'next/link'; // ✅ Ajout de Link
import AdvertisementForm from './advertisements/AdvertisementForm';
import AdvertisementPreview from './advertisements/AdvertisementPreview';
import AdvertisementFilters from './advertisements/AdvertisementFilters';
import AdvertisementList from './advertisements/AdvertisementList';
import styles from './AdvertisementManagement.module.css';

const AdvertisementManagement = () => {
  // États pour gérer les données
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAd, setCurrentAd] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  
  // États pour la pagination et les filtres
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    position: '',
    isActive: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Récupération des publicités avec gestion des filtres et de la pagination
  const fetchAdvertisements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construire les paramètres de la requête
      const params = {
        page,
        ...filters
      };
      
      // Filtrer les paramètres vides
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      // Utilisez la session NextAuth pour l'authentification
      const { data: session } = await axios.get('/api/auth/session');
      
      if (!session || !session.user) {
        throw new Error('Session non trouvée. Veuillez vous connecter.');
      }
      
      // Récupérer le token de la session NextAuth ET du localStorage (pour la compatibilité)
      let token = '';
      
      // D'abord essayer de récupérer le token de NextAuth de la session
      if (session && session.user) {
        // Si la session inclut un token JWT, l'utiliser
        if (session.accessToken) {
          token = session.accessToken;
        } else if (session.jwt) {
          token = session.jwt;
        }
      }
      
      // Si aucun token n'est trouvé dans la session, essayer localStorage
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth-token');
      }
      
      // Si on a toujours pas de token, essayer de le récupérer depuis l'API
      if (!token) {
        try {
          const tokenResponse = await axios.get('/api/auth/token');
          if (tokenResponse.data && tokenResponse.data.token) {
            token = tokenResponse.data.token;
            // Sauvegarder le token pour les futures requêtes
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-token', token);
            }
          }
        } catch (tokenError) {
          console.error("Erreur lors de la récupération du token:", tokenError);
        }
      }
      
      if (!token) {
        console.error("Token d'authentification manquant");
        throw new Error("Token d'authentification manquant. Veuillez vous reconnecter.");
      }
      
      // Configuration avec le token JWT
      const config = {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Faire la requête à l'API
      let response;
      try {
        response = await axios.get('/api/advertisements', config);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Erreur d'authentification: Token invalide ou expiré");
          // Rediriger vers la page de connexion si nécessaire
          // window.location.href = '/login?callbackUrl=/admin/advertisements';
        }
        throw error;
      }
      
      if (response.data.success) {
        setAdvertisements(response.data.data);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError('Erreur lors de la récupération des publicités');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des publicités:', err);
      setError('Une erreur s\'est produite lors de la récupération des publicités');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);
  
  // Charger les publicités au chargement et lors des changements de filtre/pagination
  useEffect(() => {
    fetchAdvertisements();
  }, [fetchAdvertisements, refreshData]);
  
  // Gérer le changement de filtre avec debounce pour la recherche
  const handleFilterChange = useCallback(
    (name, value) => {
      debounce((name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1); // Réinitialiser à la première page lors d'un changement de filtre
      }, 300)(name, value);
    },
    []
  );
  
  // Sélectionner une publicité pour édition
  const handleEditAdvertisement = (advertisement) => {
    setCurrentAd(advertisement);
    setIsEditing(true);
  };
  
  // Supprimer une publicité
  const handleDeleteAdvertisement = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publicité?')) {
      try {
        const response = await axios.delete(`/api/advertisements/${id}`);
        
        if (response.data.success) {
          // Réinitialiser si la publicité en cours d'édition est celle qui a été supprimée
          if (currentAd && currentAd._id === id) {
            setCurrentAd(null);
            setIsEditing(false);
          }
          
          // Actualiser la liste
          setRefreshData(prev => prev + 1);
        } else {
          setError('Erreur lors de la suppression de la publicité');
        }
      } catch (err) {
        console.error('Erreur lors de la suppression de la publicité:', err);
        setError('Une erreur s\'est produite lors de la suppression de la publicité');
      }
    }
  };
  
  // Créer ou mettre à jour une publicité
  const handleSaveAdvertisement = async (formData) => {
    try {
      if (isEditing && currentAd) {
        // Mise à jour
        await axios.put(`/api/advertisements/${currentAd._id}`, formData);
      } else {
        // Création
        await axios.post('/api/advertisements', formData);
      }
      
      // Réinitialiser les états et actualiser la liste
      setCurrentAd(null);
      setIsEditing(false);
      setRefreshData(prev => prev + 1);
      
      return true;
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la publicité:', err);
      setError('Une erreur s\'est produite lors de la sauvegarde de la publicité');
      return false;
    }
  };
  
  // Annuler l'édition
  const handleCancelEdit = () => {
    setCurrentAd(null);
    setIsEditing(false);
  };
  
  // Créer une nouvelle publicité
  const handleNewAdvertisement = () => {
    setCurrentAd(null);
    setIsEditing(true);
  };
  
  // Gérer la pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestion des Publicités</h1>
      {/* Afficher les erreurs s'il y en a */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      <Tabs activeKey={isEditing ? "edit" : "list"} id="advertisement-tabs" className="mb-4" onSelect={(k) => {
        if (k === "list" && isEditing) {
          setIsEditing(false);
          setCurrentAd(null);
        }
      }}>
        <Tab eventKey="list" title="Liste des Publicités">
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Publicités</h3>
              <Button 
                variant="primary" 
                onClick={handleNewAdvertisement} 
                disabled={isEditing}
                className="btn-lg"
                style={{ fontWeight: 'bold' }}
              >
                <i className="icofont-plus me-1"></i> Nouvelle Publicité
              </Button>
            </Card.Header>
            <Card.Body>
              {/* Filtres */}
              <AdvertisementFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
              />
              
              {/* Liste des publicités */}
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </Spinner>
                </div>
              ) : (
                <AdvertisementList 
                  advertisements={advertisements}
                  onEdit={handleEditAdvertisement}
                  onDelete={handleDeleteAdvertisement}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        {/* Onglet d'édition qui n'apparaît que lorsqu'on édite */}
        {isEditing && (
          <Tab eventKey="edit" title={currentAd ? "Modifier la Publicité" : "Nouvelle Publicité"} active>
            <Row>
              <Col md={8}>
                <Card className="mb-4">
                  <Card.Header>
                    <h3 className="mb-0">{currentAd ? "Modifier la Publicité" : "Nouvelle Publicité"}</h3>
                  </Card.Header>
                  <Card.Body>
                    <AdvertisementForm 
                      advertisement={currentAd} 
                      onSave={handleSaveAdvertisement} 
                      onCancel={handleCancelEdit} 
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-4">
                  <Card.Header>
                    <h3 className="mb-0">Aperçu</h3>
                  </Card.Header>
                  <Card.Body>
                    <AdvertisementPreview advertisement={currentAd} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        )}
        
        <Tab eventKey="analytics" title="Analytique">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Analytique des Publicités</h3>
              <Link href="/admin/advertisements/analytics" legacyBehavior>
                <Button variant="primary">
                  <i className="icofont-chart-bar-graph me-2"></i>
                  Voir les statistiques détaillées
                </Button>
              </Link>
            </Card.Header>
            <Card.Body>
              <Alert variant="info">
                <i className="icofont-info-circle me-2"></i>
                Pour des analyses détaillées et complètes, consultez la <Link href="/admin/advertisements/analytics" className="text-decoration-underline fw-bold">section dédiée à l&apos;analytique des publicités</Link>.
              </Alert>
              <div className="text-center mt-4">
                <Link href="/admin/advertisements/analytics" passHref legacyBehavior>
                  <Button as="a" variant="outline-primary" size="lg">
                    <i className="icofont-chart-histogram me-2"></i>
                    Accéder à l'analytique complète
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdvertisementManagement;
