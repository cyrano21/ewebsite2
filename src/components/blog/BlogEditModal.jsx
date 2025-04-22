// src/components/blog/BlogEditModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, ProgressBar, Tabs, Tab, ListGroup, Card, Badge, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

const BlogEditModal = ({ 
  show,
  onHide,
  blogData,
  isEditing,
  onSubmit,
  onChange,
  onImageUpload,
  isUploading,
  uploadProgress,
  fileInputKey
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [validationErrors, setValidationErrors] = useState({});
  const [content, setContent] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

  // Force le défilement du modal
  useEffect(() => {
    if (show) {
      // Permettre le défilement même avec le modal ouvert
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    } else {
      // Restaurer les styles par défaut
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      // Nettoyage lors du démontage
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [show]);

  // Mise à jour du contenu quand blogData change
  useEffect(() => {
    if (blogData) {
      setContent(blogData.content || '');
      
      // Formater la date au format yyyy-MM-dd pour le champ date
      if (blogData.date) {
        try {
          // Essayer de détecter si la date est au format français (ex: "05 juin 2022")
          if (typeof blogData.date === 'string' && blogData.date.includes(' ') && !blogData.date.includes('-')) {
            const dateParts = blogData.date.split(' ');
            const frenchMonths = {
              'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04', 'mai': '05', 'juin': '06',
              'juillet': '07', 'août': '08', 'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
            };
            
            if (dateParts.length >= 3) {
              const day = dateParts[0].padStart(2, '0');
              const month = frenchMonths[dateParts[1].toLowerCase()];
              const year = dateParts[2];
              
              if (day && month && year) {
                setFormattedDate(`${year}-${month}-${day}`);
                return;
              }
            }
          }
          
          // Si ce n'est pas une date en français ou si le parsing a échoué, essayer de la convertir normalement
          const date = new Date(blogData.date);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            setFormattedDate(`${year}-${month}-${day}`);
          } else {
            // Si tout échoue, laisser vide
            setFormattedDate('');
          }
        } catch (error) {
          console.error("Erreur lors du formatage de la date:", error);
          setFormattedDate('');
        }
      } else {
        setFormattedDate('');
      }
    }
  }, [blogData]);

  // Gestion de la modification du contenu
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    // Simuler un événement pour la fonction onChange
    onChange({
      target: {
        name: 'content',
        value: newContent
      }
    });
  };

  // Gestion de la modification de la date
  const handleDateChange = (e) => {
    const { value } = e.target;
    setFormattedDate(value);
    
    // Conserver le format original pour le formulaire
    onChange({
      target: {
        name: 'date',
        value: value
      }
    });
  };

  // Empêcher la fermeture du modal lors d'un téléchargement d'image
  const handleClose = () => {
    if (!isUploading) {
      onHide();
      setValidationErrors({});
      // Restaurer les styles par défaut
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    } else {
      alert("Veuillez attendre la fin du téléchargement de l'image.");
    }
  };

  // Validation du formulaire avant soumission
  const validateForm = () => {
    const errors = {};
    
    if (!blogData.title?.trim()) {
      errors.title = 'Le titre est requis';
    }
    
    if (!blogData.author?.trim()) {
      errors.author = 'L\'auteur est requis';
    }
    
    if (!formattedDate) {
      errors.date = 'La date est requise';
    }
    
    if (!blogData.category?.trim()) {
      errors.category = 'La catégorie est requise';
    }
    
    if (!content.trim()) {
      errors.content = 'Le contenu est requis';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gérer la soumission avec validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(e);
    } else {
      // Faire défiler jusqu'à la première erreur
      const firstErrorField = document.querySelector('.is-invalid');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
    }
  };

  if (!blogData) return null;

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg" 
      backdrop="static" 
      dialogClassName="modal-90w"
      scrollable={true}
      className="blog-edit-modal"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="blog-modal-header">
          <Modal.Title className="blog-modal-title">
            {isEditing ? (
              <>
                <i className="icofont-edit me-2"></i>
                Modifier l'article
              </>
            ) : (
              <>
                <i className="icofont-plus-circle me-2"></i>
                Nouvel article
              </>
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="blog-modal-body">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4 blog-tabs"
            id="blog-edit-tabs"
          >
            <Tab eventKey="general" title={<><i className="icofont-gear me-2"></i>Général</>}>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Titre de l'article <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text className="bg-white border-end-0">
                        <i className="icofont-heading text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="title"
                        value={blogData.title || ''}
                        onChange={onChange}
                        className={`border-start-0 ${validationErrors.title ? 'is-invalid' : ''}`}
                        placeholder="Saisissez le titre de l'article"
                        isInvalid={!!validationErrors.title}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.title}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Auteur <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup hasValidation>
                          <InputGroup.Text className="bg-white border-end-0">
                            <i className="icofont-user text-muted"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="author"
                            value={blogData.author || ''}
                            onChange={onChange}
                            className={`border-start-0 ${validationErrors.author ? 'is-invalid' : ''}`}
                            placeholder="Nom de l'auteur"
                            isInvalid={!!validationErrors.author}
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.author}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Date de publication <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup hasValidation>
                          <InputGroup.Text className="bg-white border-end-0">
                            <i className="icofont-calendar text-muted"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="date"
                            name="date"
                            value={formattedDate}
                            onChange={handleDateChange}
                            className={`border-start-0 ${validationErrors.date ? 'is-invalid' : ''}`}
                            isInvalid={!!validationErrors.date}
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.date}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Catégorie <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text className="bg-white border-end-0">
                        <i className="icofont-tag text-muted"></i>
                      </InputGroup.Text>
                      <Form.Select
                        name="category"
                        value={blogData.category || ''}
                        onChange={onChange}
                        className={`border-start-0 ${validationErrors.category ? 'is-invalid' : ''}`}
                        isInvalid={!!validationErrors.category}
                      >
                        <option value="">Sélectionner une catégorie</option>
                        <option value="Actualités">Actualités</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Technologie">Technologie</option>
                        <option value="Design">Design</option>
                        <option value="Business">Business</option>
                        <option value="Conseils">Conseils</option>
                        <option value="Tutoriels">Tutoriels</option>
                        <option value="Événements">Événements</option>
                        <option value="Produits">Produits</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Éducation">Éducation</option>
                        <option value="Général">Général</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.category}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Image principale</Form.Label>
                    <div className="blog-image-upload">
                      <div className="image-preview-container mb-2">
                        {blogData.image ? (
                          <img 
                            src={blogData.image} 
                            alt="Aperçu" 
                            className="preview-image" 
                          />
                        ) : (
                          <div className="placeholder-image">
                            <i className="icofont-image"></i>
                            <p>Ajouter une image</p>
                          </div>
                        )}
                      </div>
                      <div className="image-upload-controls">
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={onImageUpload}
                          key={fileInputKey}
                          disabled={isUploading}
                          className="upload-input"
                        />
                        <Form.Text className="text-muted image-help-text">
                          Format JPG, PNG ou WebP (max. 5 MB)
                        </Form.Text>
                        {isUploading && (
                          <div className="mt-2">
                            <ProgressBar 
                              now={uploadProgress} 
                              label={`${uploadProgress}%`} 
                              variant="primary"
                              animated
                              className="upload-progress"
                            />
                            <small className="d-block text-center mt-1">Téléchargement en cours...</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </Form.Group>

                  {isEditing && blogData.source === 'predefined' && (
                    <Card className="source-info-card bg-light mt-3">
                      <Card.Body>
                        <Card.Title as="h6" className="mb-2">
                          <Badge bg="secondary" className="me-2">
                            <i className="icofont-info-circle me-1"></i> Info
                          </Badge> 
                          Article prédéfini
                        </Card.Title>
                        <Card.Text className="small text-muted mb-0">
                          Cet article est prédéfini. Vos modifications créeront une nouvelle version modifiable dans la base de données sans affecter l'original.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>

              <Form.Group className="mb-3 mt-3">
                <Form.Label className="fw-bold">
                  Contenu de l'article <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="content"
                  value={content}
                  onChange={handleContentChange}
                  className={`content-textarea ${validationErrors.content ? 'is-invalid' : ''}`}
                  placeholder="Rédigez le contenu de votre article ici..."
                  isInvalid={!!validationErrors.content}
                  rows={8}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.content}
                </Form.Control.Feedback>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <Form.Text className="text-muted">
                    <i className="icofont-info-circle me-1"></i> Markdown et formatage HTML basique supportés
                  </Form.Text>
                  <small className="text-muted">
                    {content.length} caractère{content.length !== 1 ? 's' : ''}
                  </small>
                </div>
              </Form.Group>
            </Tab>

            <Tab eventKey="preview" title={<><i className="icofont-eye me-2"></i>Aperçu</>}>
              <div className="blog-preview bg-white p-4 rounded shadow-sm">
                {blogData.image && (
                  <div className="blog-preview-image mb-4">
                    <img 
                      src={blogData.image} 
                      alt={blogData.title} 
                      className="preview-main-image"
                    />
                  </div>
                )}
                
                <div className="blog-preview-meta mb-3">
                  {blogData.category && (
                    <Badge bg="primary" className="me-3 category-badge">
                      {blogData.category}
                    </Badge>
                  )}
                  {blogData.date && (
                    <span className="text-muted me-3">
                      <i className="icofont-calendar me-1"></i>
                      {/* Utiliser formattedDate pour l'affichage */}
                      {formattedDate ? new Date(formattedDate).toLocaleDateString('fr-FR', {
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric'
                      }) : blogData.date}
                    </span>
                  )}
                  {blogData.author && (
                    <span className="text-muted">
                      <i className="icofont-user me-1"></i>
                      {blogData.author}
                    </span>
                  )}
                </div>
                
                <h1 className="blog-preview-title mb-4">
                  {blogData.title || 'Titre de l\'article'}
                </h1>
                
                <div className="blog-preview-content">
                  {content ? (
                    <div className="content-display">
                      {content.split('\n').map((paragraph, idx) => (
                        paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted fst-italic">
                      Aucun contenu saisi. Le contenu de votre article s'affichera ici.
                    </p>
                  )}
                </div>
              </div>
            </Tab>

            {isEditing && blogData.id && (
              <Tab eventKey="history" title={<><i className="icofont-history me-2"></i>Historique</>}>
                <div className="history-container p-4 rounded shadow-sm">
                  <h5 className="mb-3 text-dark">Historique des modifications</h5>
                  <ListGroup variant="flush" className="history-list">
                    <ListGroup.Item className="history-header">
                      <Row>
                        <Col md={3} className="text-dark fw-bold">Date</Col>
                        <Col md={3} className="text-dark fw-bold">Action</Col>
                        <Col md={6} className="text-dark fw-bold">Détails</Col>
                      </Row>
                    </ListGroup.Item>
                    
                    {/* Modification la plus récente */}
                    <ListGroup.Item className="history-item">
                      <Row>
                        <Col md={3} className="text-dark">{new Date().toLocaleDateString('fr-FR')}</Col>
                        <Col md={3}>
                          <Badge bg="primary">Modification</Badge>
                        </Col>
                        <Col md={6} className="text-dark">Modification en cours</Col>
                      </Row>
                    </ListGroup.Item>
                    
                    {/* Création originale (simulé) */}
                    <ListGroup.Item className="history-item">
                      <Row>
                        <Col md={3} className="text-dark">
                          {formattedDate ? new Date(formattedDate).toLocaleDateString('fr-FR') : 'Inconnue'}
                        </Col>
                        <Col md={3}>
                          <Badge bg="success">Création</Badge>
                        </Col>
                        <Col md={6} className="text-dark">Article créé par {blogData.author || 'inconnu'}</Col>
                      </Row>
                    </ListGroup.Item>
                    
                    {/* Message si aucun historique supplémentaire */}
                    <ListGroup.Item className="text-center py-4">
                      <i className="icofont-info-circle me-2"></i>
                      <span className="text-muted">L'historique complet des modifications n'est pas disponible pour cet article.</span>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              </Tab>
            )}
          </Tabs>
        </Modal.Body>

        <Modal.Footer className="blog-modal-footer">
          <Button 
            variant="outline-secondary" 
            onClick={handleClose} 
            disabled={isUploading}
            className="cancel-button"
          >
            <i className="icofont-close me-2"></i>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isUploading}
            className="submit-button"
          >
            {isUploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Téléchargement...
              </>
            ) : isEditing ? (
              <>
                <i className="icofont-save me-2"></i>
                Mettre à jour
              </>
            ) : (
              <>
                <i className="icofont-plus-circle me-2"></i>
                Créer l'article
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

BlogEditModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  blogData: PropTypes.object,
  isEditing: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  uploadProgress: PropTypes.number.isRequired,
  fileInputKey: PropTypes.number.isRequired
};

export default BlogEditModal;