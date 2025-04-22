// src/components/blog/BlogTable.jsx
import React from 'react';
import { Table, Button, Spinner, Card, Badge, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

const BlogTable = ({ 
  blogs, 
  loading, 
  onEdit, 
  onDelete, 
  onAddFirstBlog,
  selectedBlogs = [],
  onSelectBlog = () => {},
  sortConfig = { key: 'date', direction: 'desc' },
  onSort = () => {}
}) => {
  // Fonction pour gérer le changement d'état des checkboxes
  const handleCheckboxChange = (e, blogId) => {
    onSelectBlog(blogId);
  };

  // Fonction pour générer l'en-tête de colonne triable
  const renderSortableHeader = (title, key, width = null) => {
    const isActive = sortConfig.key === key;
    const direction = isActive ? sortConfig.direction : 'none';
    const icon = direction === 'asc' ? 'icofont-arrow-up' : 'icofont-arrow-down';
    
    return (
      <th 
        style={width ? { width } : {}} 
        className="sortable-header"
        onClick={() => onSort(key)}
      >
        <div className="d-flex align-items-center">
          <span className="me-2">{title}</span>
          <i className={isActive ? `${icon} text-primary` : 'icofont-sort text-muted'} />
        </div>
      </th>
    );
  };

  if (loading) {
    return (
      <div className="text-center p-5 loading-container">
        <Spinner animation="border" role="status" variant="primary" className="mb-3">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="loading-text">Chargement des articles...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <Card className="text-center p-5 shadow-sm empty-state-card">
        <Card.Body>
          <i className="icofont-newspaper icofont-3x text-muted mb-3"></i>
          <h3>Aucun article disponible</h3>
          <p className="text-muted">Créez votre premier article pour commencer à gérer votre blog.</p>
          <Button variant="primary" onClick={onAddFirstBlog} className="mt-3">
            <i className="icofont-plus-circle me-2"></i> Créer un article
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="table-responsive blog-table-container">
      <Table hover className="blog-table align-middle">
        <thead>
          <tr>
            <th style={{ width: '40px' }} className="text-center">
              <div className="select-cell">#</div>
            </th>
            <th style={{ width: '60px' }}>Image</th>
            {renderSortableHeader('Titre', 'title')}
            {renderSortableHeader('Auteur', 'author', '150px')}
            {renderSortableHeader('Date', 'date', '130px')}
            {renderSortableHeader('Catégorie', 'category', '130px')}
            <th style={{ width: '120px' }} className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog.id} className={selectedBlogs.includes(blog.id) ? 'selected-row' : ''}>
              <td className="text-center">
                <Form.Check 
                  type="checkbox" 
                  id={`blog-check-${blog.id}`}
                  onChange={(e) => handleCheckboxChange(e, blog.id)}
                  checked={selectedBlogs.includes(blog.id)}
                  className="blog-checkbox"
                />
              </td>
              <td>
                <div className="blog-image-cell">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="blog-thumbnail"
                    />
                  ) : (
                    <div className="placeholder-image">
                      <i className="icofont-image text-muted"></i>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="blog-title-cell">
                  <span className="blog-title">{blog.title}</span>
                  {blog.source === 'predefined' && (
                    <Badge bg="secondary" pill className="ms-2 predefined-badge">
                      Prédéfini
                    </Badge>
                  )}
                </div>
                <div className="d-block d-md-none mt-2 blog-mobile-meta">
                  <small className="text-muted me-3">
                    <i className="icofont-ui-user me-1"></i> {blog.author}
                  </small>
                  <small className="text-muted">
                    <i className="icofont-calendar me-1"></i> {blog.date}
                  </small>
                </div>
              </td>
              <td className="d-none d-md-table-cell">{blog.author}</td>
              <td className="d-none d-md-table-cell">{blog.date}</td>
              <td>
                <Badge bg="primary" pill className="category-badge">
                  {blog.category || 'Non classé'}
                </Badge>
              </td>
              <td>
                <div className="blog-actions">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Modifier l'article</Tooltip>}
                  >
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => onEdit(blog)}
                      className="action-button edit-button me-2"
                    >
                      <i className="icofont-edit"></i>
                    </Button>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {blog.source === 'predefined' 
                          ? "Les articles prédéfinis ne peuvent pas être supprimés" 
                          : "Supprimer l'article"}
                      </Tooltip>
                    }
                  >
                    <span className="d-inline-block">
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => onDelete(blog.id)}
                        disabled={blog.source === 'predefined'}
                        className="action-button delete-button"
                      >
                        <i className="icofont-trash"></i>
                      </Button>
                    </span>
                  </OverlayTrigger>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

BlogTable.propTypes = {
  blogs: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddFirstBlog: PropTypes.func.isRequired,
  selectedBlogs: PropTypes.array,
  onSelectBlog: PropTypes.func,
  sortConfig: PropTypes.object,
  onSort: PropTypes.func
};

export default BlogTable;