import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const AdvertisementFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };
  
  const handleReset = () => {
    const defaultFilters = {
      status: '',
      type: '',
      position: '',
      isActive: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    // Appliquer chaque filtre par défaut
    Object.entries(defaultFilters).forEach(([name, value]) => {
      onFilterChange(name, value);
    });
  };
  
  return (
    <div className="mb-4 p-3 border rounded bg-light">
      <h5 className="mb-3">Filtres</h5>
      <Form>
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Recherche</Form.Label>
              <Form.Control
                type="text"
                name="search"
                placeholder="Nom, tags, titre..."
                value={filters.search}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={filters.type} onChange={handleChange}>
                <option value="">Tous les types</option>
                <option value="banner">Bannière</option>
                <option value="popup">Popup</option>
                <option value="sidebar">Barre latérale</option>
                <option value="featured">Mis en avant</option>
                <option value="video">Vidéo</option>
                <option value="carousel">Carousel</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Select name="position" value={filters.position} onChange={handleChange}>
                <option value="">Toutes les positions</option>
                <option value="home">Accueil</option>
                <option value="shop">Boutique</option>
                <option value="product">Produit</option>
                <option value="checkout">Paiement</option>
                <option value="category">Catégorie</option>
                <option value="blog">Blog</option>
                <option value="global">Global</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select name="status" value={filters.status} onChange={handleChange}>
                <option value="">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="scheduled">Planifié</option>
                <option value="active">Actif</option>
                <option value="paused">En pause</option>
                <option value="completed">Terminé</option>
                <option value="archived">Archivé</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Actif</Form.Label>
              <Form.Select name="isActive" value={filters.isActive} onChange={handleChange}>
                <option value="">Tous</option>
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={1} className="d-flex align-items-end mb-3">
            <Button variant="secondary" onClick={handleReset}>
              <i className="icofont-refresh me-1"></i> Reset
            </Button>
          </Col>
        </Row>
        
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Trier par</Form.Label>
              <Form.Select name="sortBy" value={filters.sortBy} onChange={handleChange}>
                <option value="createdAt">Date de création</option>
                <option value="updatedAt">Date de mise à jour</option>
                <option value="name">Nom</option>
                <option value="startDate">Date de début</option>
                <option value="endDate">Date de fin</option>
                <option value="analytics.impressions">Impressions</option>
                <option value="analytics.clicks">Clics</option>
                <option value="analytics.ctr">Taux de clic</option>
                <option value="analytics.conversions">Conversions</option>
                <option value="budget.total">Budget</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Ordre</Form.Label>
              <Form.Select name="sortOrder" value={filters.sortOrder} onChange={handleChange}>
                <option value="desc">Décroissant</option>
                <option value="asc">Croissant</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AdvertisementFilters;
