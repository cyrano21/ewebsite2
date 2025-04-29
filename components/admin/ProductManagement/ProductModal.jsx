/* stylelint-disable */
/* eslint-disable react/no-unknown-property */

"use client";

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Form,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  Tabs,
  Tab,
  Alert,
  Table,
  ListGroup,
  Badge,
} from "react-bootstrap";

// Placeholder image
const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/300x300/f8f9fa/6c757d?text=Aper%C3%A9u";

function ProductModal({
  show,
  onHide,
  modalTitle,
  productData,
  availableCategories,
  productHistory,
  productStats,
  onViewOnShop,
  onRefreshStats,
  onFormChange,
  onSubmit,
  onImageUpload,
  onImageRemove,
  isSubmitting,
}) {
  const [currentProduct, setCurrentProduct] = useState(productData);
  const [modalLastModified, setModalLastModified] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setCurrentProduct({
      ...productData,
      imgPreview: productData?.img || PLACEHOLDER_IMAGE,
      imgFile: null,
    });
    if (productHistory?.length > 0) setModalLastModified(productHistory[0].date);
  }, [productData, productHistory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
    onFormChange && onFormChange({ ...prev, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentProduct((prev) => ({
        ...prev,
        imgFile: file,
        imgPreview: reader.result,
      }));
      onImageUpload && onImageUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setCurrentProduct((prev) => ({
      ...prev,
      imgFile: null,
      imgPreview: PLACEHOLDER_IMAGE,
    }));
    onImageRemove && onImageRemove();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const toSave = {
      ...currentProduct,
      img: currentProduct.imgFile ? currentProduct.imgPreview : currentProduct.img,
    };
    delete toSave.imgPreview;
    delete toSave.imgFile;
    onSubmit(toSave);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className={`icofont-${currentProduct.id ? "edit" : "plus-circle"} me-2`} />
          {modalTitle}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body className="p-0">
          <Row className="g-0">
            <Col md={4} className="bg-light border-end p-4 d-flex flex-column">
              <h5 className="mb-3 text-center">
                <i className="icofont-image me-2" />
                Image du produit
              </h5>
              <div className="flex-grow-1 d-flex align-items-center justify-content-center mb-3">
                <img
                  src={currentProduct.imgPreview}
                  alt="Aperçu"
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: 300, maxWidth: "100%" }}
                  onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                />
              </div>
              <div className="d-grid gap-2">
  <Button
    variant="primary"
    onClick={() => fileInputRef.current?.click()}
    className="rounded-pill"
    style={{ fontSize: '0.95em', padding: '0.35em 1em' }}
  >
    <i className="icofont-upload-alt me-2" /> Télécharger une image
  </Button>
  <Form.Control
    type="file"
    accept="image/*"
    ref={fileInputRef}
    className="d-none"
    onChange={handleImageUpload}
  />
  {currentProduct.imgFile && (
    <Button
      variant="outline-danger"
      size="sm"
      onClick={handleImageRemove}
      className="rounded-pill mt-2"
      style={{ fontSize: '0.92em', padding: '0.25em 0.8em' }}
    >
      <i className="icofont-ui-delete me-1" /> Supprimer l'image
    </Button>
  )}
  <div className="small text-muted text-center mt-1">Formats acceptés : JPG, PNG • Taille max : 2 Mo</div>
</div>
              {modalLastModified && (
                <div className="mt-auto pt-3 text-center text-muted small">
                  <i className="icofont-ui-calendar me-1" />
                  Dernière modif: {modalLastModified}
                </div>
              )}
            </Col>

            <Col md={8} className="p-4">
              <Tabs defaultActiveKey="infos" id="product-modal-tabs">
                <Tab
                  eventKey="infos"
                  title={
                    <>
                      <i className="icofont-info-square me-2" />
                      Informations
                    </>
                  }
                >
                  <div className="p-1">
                    <Row className="gx-2 gy-2 align-items-center mb-2">
                      <Col xs={7} sm={7} md={7} lg={7} xl={7} className="pe-1">
                        <Form.Label htmlFor="prod-name" className="mb-1 small fw-bold">
                          Nom <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          id="prod-name"
                          size="sm"
                          type="text"
                          name="name"
                          value={currentProduct.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Nom du produit"
                        />
                      </Col>
                      <Col xs={5} sm={5} md={5} lg={5} xl={5} className="ps-1">
                        <Form.Label htmlFor="prod-cat" className="mb-1 small fw-bold">
                          Catégorie <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          id="prod-cat"
                          size="sm"
                          name="category"
                          value={currentProduct.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Sélectionner</option>
                          {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                    <Row className="gx-2 gy-2 align-items-center mb-2">
  <Col xs={6} className="pe-1">
    <Form.Label htmlFor="prod-price" className="mb-1 small fw-bold d-flex align-items-center">
      <i className="icofont-euro me-1" style={{ fontSize: '1em' }} /> Prix (€) <span className="text-danger ms-1">*</span>
    </Form.Label>
    <InputGroup size="sm">
      <InputGroup.Text><i className="icofont-euro" /></InputGroup.Text>
      <Form.Control
        id="prod-price"
        type="number"
        name="price"
        value={currentProduct.price}
        onChange={handleInputChange}
        min="0.01"
        step="0.01"
        required
        placeholder="Prix"
      />
    </InputGroup>
  </Col>
  <Col xs={6} className="ps-1">
    <Form.Label htmlFor="prod-stock" className="mb-1 small fw-bold d-flex align-items-center">
      <i className="icofont-box me-1" style={{ fontSize: '1em' }} /> Stock <span className="text-danger ms-1">*</span>
    </Form.Label>
    <InputGroup size="sm">
      <InputGroup.Text><i className="icofont-box" /></InputGroup.Text>
      <Form.Control
        id="prod-stock"
        type="number"
        name="stock"
        value={currentProduct.stock}
        onChange={handleInputChange}
        min="0"
        step="1"
        required
        placeholder="Stock"
      />
    </InputGroup>
  </Col>
</Row>
<Row className="gx-2 gy-2 align-items-center mb-2">
  <Col xs={6} className="pe-1">
    <Form.Label htmlFor="prod-vendor" className="mb-1 small fw-bold d-flex align-items-center">
      <i className="icofont-businessman me-1" style={{ fontSize: '1em' }} /> Vendeur
    </Form.Label>
    <InputGroup size="sm">
      <InputGroup.Text><i className="icofont-businessman" /></InputGroup.Text>
      <Form.Control
        id="prod-vendor"
        type="text"
        name="vendor"
        value={currentProduct.vendor || ''}
        onChange={handleInputChange}
        placeholder="Nom du vendeur"
      />
    </InputGroup>
  </Col>
  <Col xs={6} className="ps-1">
    <Form.Label htmlFor="prod-ratings" className="mb-1 small fw-bold d-flex align-items-center">
      <i className="icofont-star me-1" style={{ fontSize: '1em', color: '#ffc107' }} /> Évaluations
    </Form.Label>
    <InputGroup size="sm">
      <InputGroup.Text><i className="icofont-star" style={{ color: '#ffc107' }} /></InputGroup.Text>
      <Form.Control
        id="prod-ratings"
        type="number"
        name="ratings"
        value={currentProduct.ratings || ''}
        onChange={handleInputChange}
        min="0"
        max="5"
        step="0.1"
        placeholder="Note (0-5)"
      />
      <InputGroup.Text><i className="icofont-users-alt" /></InputGroup.Text>
      <Form.Control
        id="prod-ratingsCount"
        type="number"
        name="ratingsCount"
        value={currentProduct.ratingsCount || ''}
        onChange={handleInputChange}
        min="0"
        step="1"
        placeholder="Nb avis"
      />
    </InputGroup>
  </Col>
</Row>
                    <Row className="gx-2 gy-2 mb-2">
                      <Col xs={12}>
                        <Form.Label htmlFor="prod-desc" className="mb-1 small fw-bold">
                          Description
                        </Form.Label>
                        <Form.Control
                          id="prod-desc"
                          size="sm"
                          as="textarea"
                          name="description"
                          rows={2}
                          value={currentProduct.description}
                          onChange={handleInputChange}
                          placeholder="Description courte du produit…"
                          style={{ height: 60 }}
                        />
                      </Col>
                    </Row>
                    <div className="small text-muted mb-1">
                      <span className="text-danger">*</span> Champs obligatoires
                    </div>
                  </div>
                </Tab>
                {currentProduct.id && (
                  <Tab
                    eventKey="historique"
                    title={
                      <>
                        <i className="icofont-history me-2" />
                        Historique
                      </>
                    }
                  >
                    <div className="mt-3" style={{ maxHeight: 300, overflowY: "auto" }}>
                      {productHistory.length > 0 ? (
                        <Table size="sm" striped bordered hover>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Action</th>
                              <th>Détails</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productHistory.map((entry, idx) => (
                              <tr key={idx}>
                                <td>{entry.date}</td>
                                <td>
                                  <Badge
                                    bg={
                                      entry.action === "Création"
                                        ? "success"
                                        : entry.action === "Modification"
                                        ? "primary"
                                        : "danger"
                                    }
                                  >
                                    {entry.action}
                                  </Badge>
                                </td>
                                <td>{entry.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p className="text-center text-muted py-4">Aucun historique</p>
                      )}
                    </div>
                  </Tab>
                )}
                {currentProduct.id && (
                  <Tab
                    eventKey="statistiques"
                    title={
                      <>
                        <i className="icofont-chart-bar-graph me-2" />
                        Statistiques
                      </>
                    }
                  >
                    <div className="mt-3">
                      <p className="small text-muted">
                        Vues totales: {productStats.totalViews} / Ventes: {productStats.totalSales}
                      </p>
                    </div>
                  </Tab>
                )}
                <Tab eventKey="preview" title={<><i className="icofont-eye-alt me-2"/>Aperçu</>}>
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 350 }}>
    <Card className="shadow-sm border-0 p-2" style={{ maxWidth: 320, minWidth: 260, fontSize: '0.92rem' }}>
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={currentProduct.imgPreview} 
          style={{ height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} 
          onError={e => (e.target.src = PLACEHOLDER_IMAGE)} 
        />
        {parseInt(currentProduct.stock) === 0 && (
          <Badge bg="danger" className="position-absolute top-0 end-0 m-1" style={{ fontSize: '0.70rem' }}>Épuisé</Badge>
        )}
      </div>
      <Card.Body className="py-2 px-1">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="fw-bold text-truncate" title={currentProduct.name}>{currentProduct.name || '[Nom du produit]'}</span>
          <span className="text-primary fw-bold" style={{ fontSize: '1.05em' }}>{Number(currentProduct.price || 0).toFixed(2)} €</span>
        </div>
        <div className="mb-1">
          <Badge bg="secondary" className="me-1" style={{ fontSize: '0.72em' }}>{currentProduct.category || 'Non classé'}</Badge>
          <Badge bg={parseInt(currentProduct.stock) === 0 ? 'danger' : 'success'} style={{ fontSize: '0.72em' }}>
            {parseInt(currentProduct.stock) === 0 ? 'Épuisé' : `${currentProduct.stock ?? '-'} en stock`}
          </Badge>
        </div>
        <div className="mb-1 text-muted" style={{ fontSize: '0.85em' }}>
          <i className="icofont-businessman me-1" />
          {currentProduct.vendor || '[Vendeur]'}
        </div>
        <div className="mb-1">
          <span className="text-warning">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`icofont-star ${i < Math.round(currentProduct.ratings || 0) ? '' : 'text-muted'}`} style={{ fontSize: '1em' }}></i>
            ))}
          </span>
          <small className="text-muted ms-1">({currentProduct.ratingsCount || 0} avis)</small>
        </div>
        <div className="mb-2 text-truncate" style={{ fontSize: '0.93em', maxWidth: 250 }}>
          {currentProduct.description || '[Description du produit…]'}
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            disabled={parseInt(currentProduct.stock) === 0}
            className="flex-fill"
            style={{ fontSize: '0.95em', minWidth: 0 }}
          >
            <i className="icofont-cart me-1" /> Ajouter
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            disabled={parseInt(currentProduct.stock) === 0}
            className="flex-fill"
            style={{ fontSize: '0.95em', minWidth: 0 }}
          >
            <i className="icofont-heart" /> Favoris
          </Button>
        </div>
      </Card.Body>
    </Card>
  </div>
</Tab>
               </Tabs>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

ProductModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  modalTitle: PropTypes.string,
  productData: PropTypes.object.isRequired,
  availableCategories: PropTypes.array.isRequired,
  productHistory: PropTypes.array,
  productStats: PropTypes.object,
  onViewOnShop: PropTypes.func,
  onRefreshStats: PropTypes.func,
  onFormChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func,
  onImageRemove: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

ProductModal.defaultProps = {
  modalTitle: '',
  productHistory: [],
  productStats: null,
  onViewOnShop: () => {},
  onRefreshStats: () => {},
  onFormChange: () => {},
  onImageUpload: () => {},
  onImageRemove: () => {},
  isSubmitting: false,
};

export default ProductModal;
