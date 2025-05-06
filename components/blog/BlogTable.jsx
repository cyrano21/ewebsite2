// src/components/blog/BlogTable.jsx
import React from 'react';
import { Table, Button, Form, Spinner, Card, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

const BlogTable = ({
  blogs = [],
  loading = false,
  onEdit = () => {},
  onDelete = () => {},
  onAddFirstBlog = () => {},
  selectedBlogs = [],
  onSelectBlog = () => {},
  sortConfig = { key: 'date', direction: 'desc' },
  onSort = () => {}
}) => {
  // Fonction pour formater la date en français
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return dateStr;
    }
  };

  // Fonction pour tronquer le texte
  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Rendu du header de colonne triable
  const renderSortableHeader = (label, key) => (
    <th 
      className={`sortable-header ${sortConfig.key === key ? 'active' : ''}`}
      onClick={() => onSort(key)}
    >
      <div className="d-flex align-items-center">
        {label}
        <span className="sort-icon ms-1">
          {sortConfig.key === key ? (
            sortConfig.direction === 'asc' ? 
              <i className="icofont-arrow-up"></i> : 
              <i className="icofont-arrow-down"></i>
          ) : (
            <i className="icofont-sort text-muted"></i>
          )}
        </span>
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement des articles...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <Card className="text-center p-4 shadow-sm">
        <Card.Body>
          <i className="icofont-newspaper icofont-3x text-muted mb-3"></i>
          <Card.Title className="mb-3">Aucun article de blog</Card.Title>
          <Card.Text className="text-muted mb-4">
            Commencez à créer du contenu pour votre blog dès maintenant !
          </Card.Text>
          <Button variant="primary" onClick={onAddFirstBlog}>
            <i className="icofont-plus-circle me-2"></i> Créer mon premier article
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="blog-table-container">
      <div className="table-responsive">
        <Table hover className="align-middle blog-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <Form.Check
                  type="checkbox"
                  onChange={(e) => onSelectBlog('all', e.target.checked)}
                  checked={blogs.length > 0 && selectedBlogs.length === blogs.length}
                />
              </th>
              {renderSortableHeader('Titre', 'title')}
              {renderSortableHeader('Auteur', 'author')}
              {renderSortableHeader('Catégorie', 'category')}
              {renderSortableHeader('Date', 'date')}
              <th style={{ width: '120px' }} className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog.id} className={selectedBlogs.includes(blog.id) ? 'selected-row' : ''}>
                <td>
                  <Form.Check
                    type="checkbox"
                    onChange={() => onSelectBlog(blog.id)}
                    checked={selectedBlogs.includes(blog.id)}
                  />
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    {blog.image && (
                      <div className="blog-thumbnail me-2">
                        <img 
                          src={blog.image} 
                          alt={blog.title} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </div>
                    )}
                    <div>
                      <div className="fw-medium">{truncateText(blog.title)}</div>
                      <div className="small text-muted">
                        {truncateText(blog.content, 50)}
                      </div>
                      {blog.source === 'predefined' && (
                        <Badge bg="secondary" pill className="mt-1">
                          Prédéfini
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td>{blog.author}</td>
                <td>
                  {blog.category ? (
                    <Badge bg="primary" pill>
                      {blog.category}
                    </Badge>
                  ) : (
                    <Badge bg="light" text="dark" pill>
                      Non classé
                    </Badge>
                  )}
                </td>
                <td>{blog.displayDate || formatDate(blog.date)}</td>
                <td>
                  <div className="d-flex justify-content-end">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Modifier</Tooltip>}
                    >
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        className="me-1 btn-icon"
                        onClick={() => onEdit(blog)}
                      >
                        <i className="icofont-edit"></i>
                      </Button>
                    </OverlayTrigger>
                    
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Supprimer</Tooltip>}
                    >
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        className="btn-icon"
                        onClick={() => onDelete(blog.id)}
                        disabled={blog.source === 'predefined'}
                      >
                        <i className="icofont-trash"></i>
                      </Button>
                    </OverlayTrigger>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

BlogTable.propTypes = {
  blogs: PropTypes.array,
  loading: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAddFirstBlog: PropTypes.func,
  selectedBlogs: PropTypes.array,
  onSelectBlog: PropTypes.func,
  sortConfig: PropTypes.object,
  onSort: PropTypes.func
};

export default BlogTable;