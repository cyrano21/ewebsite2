import React from 'react';
import { Row, Col, Form, Button, InputGroup, ButtonGroup, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

const BlogListHeader = ({ 
  filteredPostsCount = 0, 
  searchTerm = '', 
  selectedCategory = 'Tous', 
  availableCategories = ['Tous'], 
  onSearchChange = () => {}, 
  onCategoryChange = () => {}, 
  onAddPost = () => {},
  onSelectAll = () => {},
  selectedCount = 0,
  onBulkDelete = () => {},
  sortConfig = { key: 'date', direction: 'desc' },
  onSort = () => {},
  activeView = 'table'
}) => {
  const handleSelectAll = (e) => {
    onSelectAll(e.target.checked);
  };

  // Fonction pour générer l'icône de tri
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="icofont-sort"></i>;
    return sortConfig.direction === 'asc' 
      ? <i className="icofont-arrow-up"></i>
      : <i className="icofont-arrow-down"></i>;
  };

  return (
    <div className="blog-list-header mb-4">
      {/* Première ligne avec titre et bouton d'ajout */}
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <div className="d-flex align-items-center">
            <h4 className="mb-0 fw-bold">
              Articles de blog 
              <Badge bg="primary" className="ms-2 fw-normal">
                {filteredPostsCount}
              </Badge>
            </h4>
            
            {selectedCount > 0 && (
              <div className="ms-3">
                <Badge bg="info" className="p-2">
                  {selectedCount} sélectionné(s)
                </Badge>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="ms-2" 
                  onClick={onBulkDelete}
                  disabled={selectedCount === 0}
                >
                  <i className="icofont-trash me-1"></i> Supprimer
                </Button>
              </div>
            )}
          </div>
        </Col>
        <Col xs={12} md={6} className="text-md-end">
          <Button 
            variant="primary" 
            onClick={onAddPost}
            className="create-button shadow-sm"
          >
            <i className="icofont-plus-circle me-2"></i> Nouvel article
          </Button>
        </Col>
      </Row>
      
      {/* Deuxième ligne avec filtres */}
      <Row className="mb-3">
        <Col lg={4} md={6} className="mb-3 mb-md-0">
          <InputGroup className="search-input-group shadow-sm">
            <InputGroup.Text className="bg-white border-end-0">
              <i className="icofont-search-1 text-muted"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={onSearchChange}
              className="border-start-0"
            />
          </InputGroup>
        </Col>
        
        <Col lg={4} md={6} className="mb-3 mb-md-0">
          <InputGroup className="shadow-sm">
            <InputGroup.Text className="bg-white border-end-0">
              <i className="icofont-filter text-muted"></i>
            </InputGroup.Text>
            <Form.Select 
              value={selectedCategory} 
              onChange={onCategoryChange}
              className="border-start-0"
            >
              {(availableCategories || []).map(category => (
                <option key={category} value={category}>
                  {category === 'Tous' ? 'Toutes les catégories' : category}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        
        {/* Options supplémentaires pour la vue tableau */}
        {activeView === 'table' && (
          <Col lg={4} md={12} className="d-flex align-items-center">
            <div className="d-flex align-items-center table-controls">
              <Form.Check 
                type="checkbox" 
                id="selectAll" 
                label="Tout sélectionner" 
                onChange={handleSelectAll}
                checked={selectedCount > 0 && selectedCount === filteredPostsCount}
                className="me-3"
              />
              
              <div className="sort-controls d-flex gap-2 ms-auto">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Trier par titre</Tooltip>}
                >
                  <Button 
                    variant={sortConfig.key === 'title' ? 'primary' : 'outline-secondary'} 
                    size="sm"
                    onClick={() => onSort('title')}
                    className="sort-button"
                  >
                    <i className="icofont-alphabetical-sorting me-1"></i>
                    {getSortIcon('title')}
                  </Button>
                </OverlayTrigger>
                
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Trier par date</Tooltip>}
                >
                  <Button 
                    variant={sortConfig.key === 'date' ? 'primary' : 'outline-secondary'} 
                    size="sm"
                    onClick={() => onSort('date')}
                    className="sort-button"
                  >
                    <i className="icofont-calendar me-1"></i>
                    {getSortIcon('date')}
                  </Button>
                </OverlayTrigger>
                
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Trier par auteur</Tooltip>}
                >
                  <Button 
                    variant={sortConfig.key === 'author' ? 'primary' : 'outline-secondary'} 
                    size="sm"
                    onClick={() => onSort('author')}
                    className="sort-button"
                  >
                    <i className="icofont-user me-1"></i>
                    {getSortIcon('author')}
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

BlogListHeader.propTypes = {
  filteredPostsCount: PropTypes.number,
  searchTerm: PropTypes.string,
  selectedCategory: PropTypes.string,
  availableCategories: PropTypes.array,
  onSearchChange: PropTypes.func,
  onCategoryChange: PropTypes.func,
  onAddPost: PropTypes.func,
  onSelectAll: PropTypes.func,
  selectedCount: PropTypes.number,
  onBulkDelete: PropTypes.func,
  sortConfig: PropTypes.object,
  onSort: PropTypes.func,
  activeView: PropTypes.string
};

export default BlogListHeader;