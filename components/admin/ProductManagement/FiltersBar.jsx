// components/admin/ProductManagement/FiltersBar.jsx
import React from 'react';
import { Card, Row, Col, InputGroup, Form, Button } from 'react-bootstrap'; // Pagination supprimée d'ici
import PropTypes from 'prop-types';

const FiltersBar = ({
  filteredCount, // Garder pour info si besoin
  searchTerm,
  onSearchChange, // Renommer depuis handleSearchChange pour clarté
  onSearchSubmit, // << NOUVELLE PROP
  selectedCategory,
  onCategoryChange, // Renommer depuis handleCategoryChange
  availableCategories,
  sortOption, // << NOUVELLE PROP pour le tri
  onSortChange, // << NOUVELLE PROP pour le tri
  // priceRange, // Props pour le prix si géré ici
  // onPriceRangeChange,
  // onApplyPriceFilter,
  // onResetPriceFilter,
  onAddProduct, // Renommer depuis handleShowAddModal
  onManageCategories // Renommer depuis handleShowCategoryModal
  // Props de pagination supprimées d'ici
}) => (
  <Card className="mb-4 shadow-sm">
    <Card.Body>
      <Row className="gy-3 align-items-center">
        {/* Titre et Boutons */}
        <Col md={6}>
           {/* Optionnel: Afficher le nombre total ici si on veut */}
           {/* <h5 className="mb-0">Produits ({filteredCount})</h5> */}
        </Col>
        <Col md={6} className="text-md-end">
          <Button variant="primary" onClick={onAddProduct} className="me-2">
            <i className="icofont-plus-circle me-1"></i> Ajouter
          </Button>
          <Button variant="secondary" onClick={onManageCategories}>
            <i className="icofont-tags me-1"></i> Gérer Catégories
          </Button>
        </Col>

        {/* Filtres et Tri */}
        <Col lg={5} md={6}>
          {/* --- AJOUT DU FORMULAIRE --- */}
          <Form onSubmit={onSearchSubmit}>
            <InputGroup>
              <InputGroup.Text><i className="icofont-search-1"></i></InputGroup.Text>
              <Form.Control
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={onSearchChange} // Appelle handleSearchChange dans le parent
                aria-label="Rechercher des produits"
              />
               {/* Optionnel: Bouton submit si l'utilisateur préfère cliquer */}
               {/* <Button type="submit" variant="outline-secondary">OK</Button> */}
            </InputGroup>
          </Form>
          {/* --- FIN DU FORMULAIRE --- */}
        </Col>
        <Col lg={4} md={6}> {/* Ajuster taille pour le tri */}
          <Form.Select
            value={selectedCategory}
            onChange={onCategoryChange} // Appelle handleCategoryChange
            aria-label="Filtrer par catégorie"
          >
            {availableCategories && availableCategories.length > 0 ? (
              availableCategories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))
            ) : (
              <option value="Tous">Chargement des catégories...</option>
            )}
          </Form.Select>
        </Col>
         <Col lg={3} md={12}> {/* Colonne pour le tri */}
             <Form.Select
               value={sortOption}
               onChange={onSortChange} // Appelle handleSortChange
               size="sm" // Harmoniser taille si besoin
               aria-label="Trier par"
             >
               <option value="default">Tri par défaut</option>
               <option value="newest">Plus récents</option>
               <option value="popularity">Popularité</option>
               <option value="rating">Avis</option>
               <option value="price-asc">Prix croissant</option>
               <option value="price-desc">Prix décroissant</option>
             </Form.Select>
           </Col>

        {/* Texte d'info sur les résultats (déplacé potentiellement vers ProductsTable ou ProductManagement) */}
        {/* <Col lg={4} className="text-lg-end text-muted small">...</Col> */}

        {/* Pagination (Supprimée d'ici - à mettre sous le tableau) */}
        {/* {totalPages > 1 && ( ... )} */}
      </Row>
    </Card.Body>
  </Card>
);

// Mettre à jour les PropTypes
FiltersBar.propTypes = {
  filteredCount: PropTypes.number,
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func,
  onSearchSubmit: PropTypes.func,
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func,
  availableCategories: PropTypes.array,
  sortOption: PropTypes.string,
  onSortChange: PropTypes.func,
  stockFilter: PropTypes.string,
  onStockFilterChange: PropTypes.func,
  onAddProduct: PropTypes.func,
  onManageCategories: PropTypes.func,
  resetFilters: PropTypes.func,
};

FiltersBar.defaultProps = {
  searchTerm: '',
  onSearchChange: () => {},
  onSearchSubmit: () => {},
  selectedCategory: 'all',
  onCategoryChange: () => {},
  availableCategories: [],
  sortOption: 'default',
  onSortChange: () => {},
  stockFilter: 'all',
  onStockFilterChange: () => {},
  onAddProduct: () => {},
  onManageCategories: () => {},
  filteredCount: 0,
  resetFilters: () => {},
};

export default FiltersBar;