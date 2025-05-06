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
  "https://via.placeholder.com/300x300/f8f9fa/6c757d?text=Aper%C3%A9cu";

function ProductModal({
  show,
  onHide,
  modalTitle,
  productData,
  isEditMode,
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
  availableSuppliers,
}) {
  // Initialiser l'état avec des valeurs par défaut pour éviter les erreurs
  const [currentProduct, setCurrentProduct] = useState({});
  const [modalLastModified, setModalLastModified] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  // Effet pour initialiser les données du produit
  useEffect(() => {
    console.log("=== MODAL DEBUG ===");
    console.log("Données productData reçues:", productData);
    console.log("modalTitle:", modalTitle);
    console.log("Mode édition déterminé:", isEditMode);

    // Vérifier que productData existe avant toute opération
    const safeProductData = productData || {};

    // Créer l'objet avec ID toujours défini
    const productToSet = {
      ...safeProductData,
      id: safeProductData.id || safeProductData._id || null,
      imgPreview: safeProductData.img || safeProductData.image || PLACEHOLDER_IMAGE,
      imgFile: null,
      isDropshipping: safeProductData.isDropshipping || false,
    };

    console.log("Objet product à appliquer:", productToSet);
    setCurrentProduct(productToSet);

    if (productHistory?.length > 0) setModalLastModified(productHistory[0].date);
  }, [productData, productHistory, modalTitle, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
    onFormChange && onFormChange({ ...currentProduct, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: checked }));
    onFormChange && onFormChange({ target: { name, value: checked } });
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

  // Handler pour le formulaire soumis avec validation approfondie
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // S'assurer que currentProduct existe
    if (!currentProduct) {
      console.error("Données du produit invalides lors de la soumission");
      return;
    }

    // Validation de base
    if (!currentProduct.name) {
      console.warn("Tentative de soumission sans nom de produit");
      return; // Empêcher la soumission si le nom est manquant
    }

    // S'assurer que toutes les valeurs numériques sont bien des nombres
    const validatedProductData = {
      ...currentProduct,
      price: parseFloat(currentProduct.price) || 0,
      stock: parseInt(currentProduct.stock) || 0,
      ratings: parseFloat(currentProduct.ratings) || 0,
      ratingsCount: parseInt(currentProduct.ratingsCount) || 0
    };

    onSubmit(validatedProductData);
  };

  // Pour garantir la sécurité de l'accès aux données
  const safeCurrentProduct = currentProduct || {};
  const safeProductStats = productStats || { totalViews: 0, totalSales: 0 };

  return (
    <Modal show={show} onHide={onHide} size="xl" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className={`icofont-${isEditMode ? "edit" : "plus-circle"} me-2`} />
          {isEditMode ? "Modifier le produit" : "Ajouter un produit"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body className="p-0">
          <Row className="g-0">
            <Col md={4} className="bg-light border-end p-4 d-flex flex-column">
              {/* Image upload section (unchanged) */}
              <h5 className="mb-3 text-center">
                <i className="icofont-image me-2" />
                Image du produit
              </h5>
              <div className="flex-grow-1 d-flex align-items-center justify-content-center mb-3">
                <img
                  src={safeCurrentProduct.imgPreview || PLACEHOLDER_IMAGE}
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
                {safeCurrentProduct.imgFile && (
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
                          value={safeCurrentProduct.name || ''}
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
                          value={safeCurrentProduct.category || ''}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Sélectionner</option>
                          {(availableCategories || []).map((cat) => (
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
                            value={safeCurrentProduct.price || ''}
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
                            value={safeCurrentProduct.stock || ''}
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
                            value={safeCurrentProduct.vendor || ''}
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
                            value={safeCurrentProduct.ratings || ''}
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
                            value={safeCurrentProduct.ratingsCount || ''}
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
                          value={safeCurrentProduct.description || ''}
                          onChange={handleInputChange}
                          placeholder="Description courte du produit…"
                          style={{ height: 60 }}
                        />
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Produit en dropshipping"
                        name="isDropshipping"
                        checked={safeCurrentProduct.isDropshipping || false}
                        onChange={handleCheckboxChange}
                      />
                    </Form.Group>
                    {safeCurrentProduct.isDropshipping && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>Fournisseur</Form.Label>
                          <Form.Select
                            name="supplier"
                            value={safeCurrentProduct.supplier || ''}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Sélectionner un fournisseur</option>
                            {(availableSuppliers || []).map((sup) => (
                              <option key={sup?._id || 'default'} value={sup?._id || ''}>{sup?.company || 'Non spécifié'}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>SKU Fournisseur</Form.Label>
                              <Form.Control
                                type="text"
                                name="supplierSku"
                                value={safeCurrentProduct.supplierSku || ''}
                                onChange={handleInputChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Prix d'achat</Form.Label>
                              <Form.Control
                                type="number"
                                name="supplierPrice"
                                value={safeCurrentProduct.supplierPrice || ''}
                                onChange={handleInputChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>Marge (%)</Form.Label>
                          <Form.Control
                            type="number"
                            name="dropshipMargin"
                            value={safeCurrentProduct.dropshipMargin || 30}
                            onChange={handleInputChange}
                            min="0"
                            max="1000"
                          />
                          {safeCurrentProduct.supplierPrice && safeCurrentProduct.dropshipMargin && (
                            <Form.Text className="text-muted">
                              Prix de vente suggéré: {(parseFloat(safeCurrentProduct.supplierPrice) * (1 + parseFloat(safeCurrentProduct.dropshipMargin) / 100)).toFixed(2)} €
                            </Form.Text>
                          )}
                        </Form.Group>
                      </>
                    )}
                    <div className="small text-muted mb-1">
                      <span className="text-danger">*</span> Champs obligatoires
                    </div>
                  </div>
                </Tab>
                {isEditMode && safeCurrentProduct.id && (
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
                      {productHistory && productHistory.length > 0 ? (
                        <Table size="sm" striped bordered hover>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Action</th>
                              <th>Détails</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(productHistory || []).map((entry, idx) => (
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
                {isEditMode && safeCurrentProduct.id && (
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
                        Vues totales: {safeProductStats.totalViews} / Ventes: {safeProductStats.totalSales}
                      </p>
                      <Button onClick={onRefreshStats} size="sm" variant="outline-primary">Rafraichir</Button>
                    </div>
                  </Tab>
                )}
                <Tab eventKey="preview" title={<><i className="icofont-eye-alt me-2"/>Aperçu</>}>
                  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 350 }}>
                    <Card className="shadow-sm border-0 p-2" style={{ maxWidth: 320, minWidth: 260, fontSize: '0.92rem' }}>
                      <div className="position-relative">
                        <Card.Img 
                          variant="top" 
                          src={safeCurrentProduct.imgPreview || PLACEHOLDER_IMAGE} 
                          style={{ height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} 
                          onError={e => (e.target.src = PLACEHOLDER_IMAGE)} 
                        />
                        {parseInt(safeCurrentProduct.stock || 0) === 0 && (
                          <Badge bg="danger" className="position-absolute top-0 end-0 m-1" style={{ fontSize: '0.70rem' }}>Épuisé</Badge>
                        )}
                      </div>
                      <Card.Body className="py-2 px-1">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="fw-bold text-truncate" title={safeCurrentProduct.name}>{safeCurrentProduct.name || '[Nom du produit]'}</span>
                          <span className="text-primary fw-bold" style={{ fontSize: '1.05em' }}>{Number(safeCurrentProduct.price || 0).toFixed(2)} €</span>
                        </div>
                        <div className="mb-1">
                          <Badge bg="secondary" className="me-1" style={{ fontSize: '0.72em' }}>{safeCurrentProduct.category || 'Non classé'}</Badge>
                          <Badge bg={parseInt(safeCurrentProduct.stock || 0) === 0 ? 'danger' : 'success'} style={{ fontSize: '0.72em' }}>
                            {parseInt(safeCurrentProduct.stock || 0) === 0 ? 'Épuisé' : `${safeCurrentProduct.stock ?? '-'} en stock`}
                          </Badge>
                        </div>
                        <div className="mb-1 text-muted" style={{ fontSize: '0.85em' }}>
                          <i className="icofont-businessman me-1" />
                          {safeCurrentProduct.vendor || '[Vendeur]'}
                        </div>
                        <div className="mb-1">
                          <span className="text-warning">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`icofont-star ${i < Math.round(safeCurrentProduct.ratings || 0) ? '' : 'text-muted'}`} style={{ fontSize: '1em' }}></i>
                            ))}
                          </span>
                          <small className="text-muted ms-1">({safeCurrentProduct.ratingsCount || 0} avis)</small>
                        </div>
                        <div className="mb-2 text-truncate" style={{ fontSize: '0.93em', maxWidth: 250 }}>
                          {safeCurrentProduct.description || '[Description du produit…]'}
                        </div>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            disabled={parseInt(safeCurrentProduct.stock || 0) === 0}
                            className="flex-fill"
                            style={{ fontSize: '0.95em', minWidth: 0 }}
                          >
                            <i className="icofont-cart me-1" /> Ajouter
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            disabled={parseInt(safeCurrentProduct.stock || 0) === 0}
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
  show: PropTypes.bool,
  onHide: PropTypes.func,
  productData: PropTypes.object,
  onSubmit: PropTypes.func,
  isEditMode: PropTypes.bool,
  availableCategories: PropTypes.array,
  availableSuppliers: PropTypes.array,
  modalTitle: PropTypes.string,
  modalAction: PropTypes.string,
  productHistory: PropTypes.array,
  productStats: PropTypes.object,
  onViewOnShop: PropTypes.func,
  onRefreshStats: PropTypes.func,
  onFormChange: PropTypes.func,
  onImageUpload: PropTypes.func,
  onImageRemove: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

ProductModal.defaultProps = {
  show: false,
  onHide: () => {},
  productData: null,
  onSubmit: () => {},
  isEditMode: false,
  availableCategories: [],
  availableSuppliers: [],
  modalTitle: 'Produit',
  modalAction: 'view',
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