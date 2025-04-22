// src/components/ProductManagement/ProductListHeader.jsx
import React from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ProductListHeader = ({
  filteredProductsCount,
  searchTerm,
  selectedCategory,
  availableCategories,
  onSearchChange,
  onCategoryChange,
  onAddProduct,
  onManageCategories,
  itemsPerPage,
  currentPage,
  totalItems
}) => {
  return (
    <div className="bg-white p-3 mb-4 rounded shadow-sm">
      <Row className="align-items-center mb-3">
        <Col>
          <h5 className="mb-0">Liste des produits ({filteredProductsCount})</h5>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={onAddProduct}>
            <i className="fa fa-plus me-2"></i>Ajouter un produit
          </Button>
        </Col>
      </Row>
      
      <Row className="g-3">
        <Col lg={4} md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="fa fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={onSearchChange}
            />
          </InputGroup>
        </Col>
        
        <Col lg={3} md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="fa fa-filter"></i>
            </InputGroup.Text>
            <Form.Select
              value={selectedCategory}
              onChange={onCategoryChange}
            >
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
            <Button 
              variant="outline-secondary" 
              onClick={onManageCategories}
              title="Gérer les catégories"
            >
              <i className="fa fa-cog"></i>
            </Button>
          </InputGroup>
        </Col>
        
        <Col>
          <div className="text-muted mt-2">
            Affichage de {Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage)} produits sur {totalItems}
            {searchTerm && ` (Filtre: "${searchTerm}")`}
          </div>
        </Col>
      </Row>
    </div>
  );
};

ProductListHeader.propTypes = {
  filteredProductsCount: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  availableCategories: PropTypes.array.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onAddProduct: PropTypes.func.isRequired,
  onManageCategories: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired
};

export default ProductListHeader;