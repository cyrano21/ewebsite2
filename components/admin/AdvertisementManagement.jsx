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
      
      const response = await axios.get('/api/advertisements', { params });
      
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
      
      <Tabs defaultActiveKey="list" id="advertisement-tabs" className="mb-4">
        <Tab eventKey="list" title="Liste des Publicités">
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Publicités</h3>
                <Button 
                  variant="primary" 
                  onClick={handleNewAdvertisement} 
                  disabled={isEditing}
                >
                  <i className="icofont-plus me-1"></i> Nouvelle Publicité
                </Button>
              </div>
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
        
        <Tab eventKey="analytics" title="Analytique" disabled={isEditing}>
          <Card>
            <Card.Header>
              <h3 className="mb-0">Analytique des Publicités</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="info">
                <i className="icofont-info-circle me-2"></i>
                Pour des analyses détaillées, consultez la <Link href="/admin/advertisements/analytics" className="text-decoration-underline">section dédiée à l&apos;analytique des publicités</Link>.
              </Alert>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdvertisementManagement;
