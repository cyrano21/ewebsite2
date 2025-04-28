import React from 'react';
import { Card, Row, Col, InputGroup, Form, Button, Pagination } from 'react-bootstrap';
import PropTypes from 'prop-types';

const FiltersBar = ({
  filteredCount,
  searchTerm,
  handleSearchChange,
  selectedCategory,
  handleCategoryChange,
  availableCategories,
  currentPage,
  totalPages,
  handlePageChange,
  handleShowAddModal,
  handleShowCategoryModal
}) => (
  <Card className="mb-4 shadow-sm">
    <Card.Body>
      <Row className="gy-3 align-items-center">
        <Col md={6}>
          <h5 className="mb-0">Liste des Produits ({filteredCount})</h5>
        </Col>
        <Col md={6} className="text-md-end">
          <Button variant="primary" onClick={handleShowAddModal} className="me-2">
            <i className="icofont-plus-circle me-1"></i> Ajouter
          </Button>
          <Button variant="secondary" onClick={handleShowCategoryModal}>
            <i className="icofont-tags me-1"></i> Gérer Catégories
          </Button>
        </Col>
        <Col lg={5} md={6}>
          <InputGroup>
            <InputGroup.Text><i className="icofont-search-1"></i></InputGroup.Text>
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
            {availableCategories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={4} className="text-lg-end text-muted small">
          Affichage de { (currentPage-1)*10+1 } - { Math.min(currentPage*10, filteredCount) } sur {filteredCount}
        </Col>
        {totalPages > 1 && (
          <Col xs={12} className="text-center mt-2">
            <Pagination size="sm" className="justify-content-center">
              <Pagination.Prev onClick={() => handlePageChange(currentPage-1)} disabled={currentPage===1} />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i}
                  active={i+1===currentPage}
                  onClick={() => handlePageChange(i+1)}
                >{i+1}</Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage+1)} disabled={currentPage===totalPages} />
            </Pagination>
          </Col>
        )}
      </Row>
    </Card.Body>
  </Card>
);

FiltersBar.propTypes = {
  filteredCount: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  handleCategoryChange: PropTypes.func.isRequired,
  availableCategories: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handleShowAddModal: PropTypes.func.isRequired,
  handleShowCategoryModal: PropTypes.func.isRequired
};

export default FiltersBar;
