// src/components/product/ProductEditModal.jsx
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Row, Col, Tabs, Tab, InputGroup, Alert, Badge, Table } from 'react-bootstrap';
import { PLACEHOLDER_IMAGE, VariationIndicator, ProgressBar, formatNumber } from '../SharedUtils'; // Adjust path

const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const ProductEditModal = ({
  show,
  onHide,
  productData, // This is the 'currentProduct' from the parent
  availableCategories,
  productHistory,
  productStats,
  onSubmit,
  onInputChange,
  onImageUpload, // Pass the handler function
  onImageRemove, // Pass the handler function
  lastModified,
  onViewOnShop,
  onUpdateStats // Function to trigger stat refresh
}) => {

  const fileInputRef = useRef(null);
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const isEditing = !!productData?.id;
  const modalTitle = isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit';

  // Default values if productData is null/undefined during add
  const currentProduct = productData || {
    id: null, name: '', category: '', price: '', stock: '', description: '',
    img: '', imgPreview: PLACEHOLDER_IMAGE, imgFile: null, ratings: 0, ratingsCount: 0, seller: ''
  };

   const currentStats = isEditing && productStats ? productStats[currentProduct.id] : null;


  return (
    <Modal show={show} onHide={onHide} size="xl" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className={`icofont-${isEditing ? 'edit' : 'plus-circle'} me-2`}></i>
          {modalTitle}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit} noValidate>
        <Modal.Body className="p-0">
          <Row className="g-0">
            {/* --- Image Column --- */}
            <Col md={4} className="bg-light border-end p-4 d-flex flex-column">
              <h5 className="mb-3 text-center"><i className="icofont-image me-2"></i>Image du produit</h5>
              <div className="image-preview-container text-center mb-3 flex-grow-1 d-flex align-items-center justify-content-center">
                 <img
                    src={currentProduct.imgPreview || PLACEHOLDER_IMAGE}
                    alt="Aperçu"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: '300px', maxWidth: '100%' }}
                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                 />
              </div>
              <div className="d-grid gap-2">
                 <Button variant="primary" onClick={triggerImageUpload} className="rounded-pill">
                    <i className="icofont-upload-alt me-2"></i> Télécharger une image
                 </Button>
                 <Form.Control
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept={validImageTypes.join(', ')}
                    onChange={onImageUpload} // Use the passed handler
                 />
                 {currentProduct.imgPreview !== PLACEHOLDER_IMAGE && (
                    <Button variant="outline-danger" onClick={onImageRemove} size="sm" className="rounded-pill mt-2">
                        <i className="icofont-ui-delete me-1"></i> Supprimer l&aposimage
                    </Button>
                 )}
              </div>
              <Form.Text className="text-muted text-center mt-2 small">
                 JPG, PNG, GIF, WEBP acceptés (Max 5MB)
              </Form.Text>
              {isEditing && lastModified && (
                <div className="mt-auto pt-3 text-center text-muted small">
                    <i className="icofont-ui-calendar me-1"></i>Dernière modif: {lastModified}
                </div>
              )}
            </Col>

            {/* --- Info Tabs Column --- */}
            <Col md={8} className="p-4">
                <Tabs defaultActiveKey="infos" id="product-edit-tabs" className="mb-4 nav-tabs-modern">
                   {/* --- Info Tab --- */}
                   <Tab eventKey="infos" title={<><i className="icofont-info-square me-2"></i> Informations</>}>
                       {/* Form fields using onInputChange */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="icofont-label me-2"></i>Nom du produit <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text" name="name" value={currentProduct.name}
                                        onChange={onInputChange} className="rounded-pill" required
                                        placeholder="Ex: T-shirt en coton bio"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="icofont-tags me-2"></i>Catégorie <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="category" value={currentProduct.category}
                                        onChange={onInputChange} className="rounded-pill" required
                                    >
                                        <option value="">-- Sélectionner --</option>
                                        {availableCategories.filter(cat => cat !== 'Tous').map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                         <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="icofont-price me-2"></i>Prix (€) <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="number" name="price" value={currentProduct.price}
                                        onChange={onInputChange} min="0.01" step="0.01"
                                        className="rounded-pill" required placeholder="Ex: 19.99"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="icofont-cubes me-2"></i>Stock <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="number" name="stock" value={currentProduct.stock}
                                        onChange={onInputChange} min="0" step="1"
                                        className="rounded-pill" required placeholder="Ex: 50"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                             <Col md={6}>
                                    <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="icofont-user-alt-7 me-2"></i>Vendeur
                                    </Form.Label>
                                    <Form.Control
                                        type="text" name="seller" value={currentProduct.seller}
                                        onChange={onInputChange} className="rounded-pill"
                                        placeholder="Ex: Marque XYZ"
                                    />
                                </Form.Group>
                            </Col>
                             <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label><i className="icofont-star me-2"></i>Évaluations (Optionnel)</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                        type="number" name="ratings" value={currentProduct.ratings}
                                        onChange={onInputChange} min="0" max="5" step="0.1"
                                        className="rounded-pill-start" placeholder="Note /5"
                                        />
                                        <InputGroup.Text>/</InputGroup.Text>
                                        <Form.Control
                                        type="number" name="ratingsCount" value={currentProduct.ratingsCount}
                                        onChange={onInputChange} min="0"
                                        className="rounded-pill-end" placeholder="Nb avis"
                                        />
                                    </InputGroup>
                                </Form.Group>
                                </Col>
                        </Row>
                         {/* Image URL Field (less priority now) */}
                         <Form.Group className="mb-3">
                            <Form.Label><i className="icofont-link me-2"></i>URL de l&apos;image (si pas d&apos;upload)</Form.Label>
                            <Form.Control
                                type="text" name="img" value={currentProduct.img}
                                onChange={onInputChange} className="rounded-pill"
                                placeholder="Coller une URL ou utiliser le bouton d'upload"
                                disabled={!!currentProduct.imgFile}
                            />
                             <Form.Text className="text-muted small ms-2">
                                Utilisez le bouton à gauche pour téléverser une image (recommandé).
                            </Form.Text>
                        </Form.Group>

                         <Form.Group className="mb-3">
                            <Form.Label><i className="icofont-align-left me-2"></i>Description</Form.Label>
                            <Form.Control
                                as="textarea" rows={4} name="description"
                                value={currentProduct.description} onChange={onInputChange}
                                placeholder="Décrivez votre produit..." style={{ resize: 'vertical' }}
                            />
                        </Form.Group>
                        <Alert variant="light" className="small text-muted">
                           <i className="icofont-warning-alt me-1"></i> Les champs marqués d&aposun <span className="text-danger">*</span> sont obligatoires.
                        </Alert>
                   </Tab>

                   {/* --- History Tab (Edit only) --- */}
                   {isEditing && (
                      <Tab eventKey="historique" title={<><i className="icofont-history me-2"></i> Historique</>}>
                          <div className="product-history mt-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {productHistory && productHistory[currentProduct.id] && productHistory[currentProduct.id].length > 0 ? (
                              <Table striped bordered hover size="sm">
                                  <thead className="table-light">
                                    <tr><th>Date</th><th>Action</th><th>Détails</th></tr>
                                  </thead>
                                  <tbody>
                                  {productHistory[currentProduct.id].map((entry, index) => (
                                      <tr key={index}>
                                      <td><small>{entry.date}</small></td>
                                      <td>
                                          <Badge pill bg={entry.action === 'Création' ? 'success' : entry.action === 'Modification' ? 'primary' : entry.action === 'Suppression' ? 'danger' : 'info'}>
                                          {entry.action}
                                          </Badge>
                                      </td>
                                      <td><small>{entry.details}</small></td>
                                      </tr>
                                  ))}
                                  </tbody>
                              </Table>
                            ) : (
                              <div className="text-center py-5 text-muted">
                                  <i className="icofont-ghost fs-1 mb-2 d-block"></i>
                                  <p>Aucun historique disponible.</p>
                              </div>
                            )}
                          </div>
                      </Tab>
                   )}

                   {/* --- Stats Tab (Edit only) --- */}
                    {isEditing && (
                            <Tab eventKey="statistiques" title={<><i className="icofont-chart-bar-graph me-2"></i> Statistiques</>}>
                                {currentStats ? (
                                    <div className="product-statistics mt-2">
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Card className="h-100 border-light shadow-sm">
                                                <Card.Header className="bg-light py-2 d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-0 fw-normal small">Aperçu Performances</h6>
                                                    <Button
                                                        variant="link" size="sm" className="p-0 text-muted"
                                                        onClick={() => onUpdateStats(currentProduct.id)} // Use passed handler
                                                        title="Rafraîchir les stats">
                                                      <i className="icofont-refresh"></i>
                                                    </Button>
                                                </Card.Header>
                                                <Card.Body className="pt-2">
                                                      <Row>
                                                        <Col xs={6} className="mb-2">
                                                          <div className="stat-box p-2 rounded bg-light text-center small">
                                                            <div className="text-muted mb-1">Vues</div>
                                                            <h5 className="mb-0">{formatNumber(currentStats.totalViews)}</h5>
                                                            <VariationIndicator value={currentStats.viewsTrend} />
                                                          </div>
                                                        </Col>
                                                         <Col xs={6} className="mb-2">
                                                          <div className="stat-box p-2 rounded bg-light text-center small">
                                                            <div className="text-muted mb-1">Ventes</div>
                                                            <h5 className="mb-0">{formatNumber(currentStats.totalSales)}</h5>
                                                            <VariationIndicator value={currentStats.salesTrend} />
                                                          </div>
                                                        </Col>
                                                        <Col xs={6} className="mb-2">
                                                          <div className="stat-box p-2 rounded bg-light text-center small">
                                                            <div className="text-muted mb-1">Taux Conv.</div>
                                                            <h5 className="mb-0">{currentStats.conversionRate}%</h5>
                                                            <small className='text-muted'>Rank: {currentStats.competitionRank}/20</small>
                                                          </div>
                                                        </Col>
                                                        <Col xs={6} className="mb-2">
                                                          <div className="stat-box p-2 rounded bg-light text-center small">
                                                            <div className="text-muted mb-1">Revenus</div>
                                                            <h5 className="mb-0">{formatNumber(currentStats.revenue)}€</h5>
                                                            <small className='text-muted'>Prix: {currentProduct.price?.toFixed(2)}€</small>
                                                          </div>
                                                        </Col>
                                                    </Row>
                                                     <ProgressBar
                                                        title="Rotation Stock" value={currentStats.stockTurnover} max="100"
                                                    />
                                                </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                 <Card className="h-100 border-light shadow-sm">
                                                    <Card.Header className="bg-light py-2">
                                                        <h6 className="mb-0 fw-normal small">Performance Hebdo</h6>
                                                    </Card.Header>
                                                    <Card.Body className="pt-2">
                                                         {currentStats.lastWeekData && currentStats.lastWeekData.length > 0 ? (
                                                            <>
                                                                <div className="simple-chart" style={{height: '150px'}}>
                                                                {currentStats.lastWeekData.map((day, index) => (
                                                                    // ... (OverlayTrigger + chart bars) ...
                                                                     <div key={index} className="chart-column" title={`${day.date}: ${day.vues} vues / ${day.ventes} ventes`}>
                                                                        <div
                                                                            className="bar-views bg-primary opacity-75"
                                                                            style={{ height: `${Math.min(100, (day.vues / (currentStats.totalViews / 4 || 1)) * 100)}%`, marginBottom: '2px' }}
                                                                        ></div>
                                                                        <div
                                                                            className="bar-sales bg-success"
                                                                            style={{ height: `${Math.min(100, (day.ventes / (currentStats.totalSales / 4 || 1)) * 100)}%` }}
                                                                        ></div>
                                                                        <div className="day-label">{day.date}</div>
                                                                    </div>
                                                                ))}
                                                                </div>
                                                                <div className="chart-legend d-flex justify-content-center small mt-2">
                                                                    <div className="me-3"><span className="legend-indicator bg-primary"></span> Vues</div>
                                                                    <div><span className="legend-indicator bg-success"></span> Ventes</div>
                                                                </div>
                                                            </>
                                                         ) : (
                                                              <p className='text-muted text-center pt-5'>Données hebdo non disponibles.</p>
                                                         )}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <div className="text-center mt-2">
                                            <p className="text-muted small">
                                            <i className="icofont-info-circle me-1"></i>
                                             M.à.j: {new Date(currentStats.lastUpdated).toLocaleString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <i className="icofont-chart-pie-alt fs-1 mb-3 d-block"></i>
                                        <p>Stats indisponibles.</p>
                                    </div>
                                )}
                            </Tab>
                    )}

                   {/* --- Preview Tab --- */}
                   <Tab eventKey="preview" title={<><i className="icofont-eye me-2"></i> Prévisualisation</>}>
                        <div className="shop-preview border rounded p-4 bg-white mt-2 shadow-sm">
                            <Row>
                                <Col md={5} className="text-center mb-3 mb-md-0">
                                    <img
                                        src={currentProduct.imgPreview || PLACEHOLDER_IMAGE}
                                        alt={currentProduct.name || 'Aperçu'}
                                        className="img-fluid rounded" style={{maxHeight: '200px'}}
                                        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                                    />
                                </Col>
                                <Col md={7}>
                                    <h4 className="product-name mb-1">{currentProduct.name || '[Nom]'}</h4>
                                     <div className="mb-2">
                                        <span className="text-warning">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`icofont-star ${i < Math.round(currentProduct.ratings || 0) ? '' : 'text-muted opacity-50'}`}></i>
                                        ))}
                                        </span>
                                        <span className="ms-2 text-muted small">({currentProduct.ratingsCount || 0} avis)</span>
                                    </div>
                                    <h5 className="price text-primary mb-2">{(currentProduct.price || 0).toFixed(2)} €</h5>
                                    <p className="seller small text-muted mb-2">Vendu par: {currentProduct.seller || '[Vendeur]'}</p>
                                    <div className="mb-3">
                                        <Badge pill bg={currentProduct.stock > 10 ? 'success' : currentProduct.stock > 0 ? 'warning' : 'danger'}>
                                            {currentProduct.stock > 10 ? 'En stock' : currentProduct.stock > 0 ? 'Stock faible' : 'Épuisé'}
                                        </Badge>
                                    </div>
                                    <p className="description small text-muted mb-3">
                                        {currentProduct.description ? (currentProduct.description.length > 150 ? currentProduct.description.substring(0, 147) + '...' : currentProduct.description) : '[Description...]'}
                                    </p>
                                    <div className="d-flex gap-2">
                                        <Button variant="primary" className="rounded-pill" disabled>
                                            <i className="icofont-cart-alt me-1"></i> Ajouter
                                        </Button>
                                        <Button variant="outline-secondary" className="rounded-pill" disabled>
                                            <i className="icofont-heart me-1"></i> Favoris
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                             {isEditing && (
                                <div className="text-center mt-3 pt-3 border-top">
                                    <Button variant="outline-info" size="sm" className="rounded-pill" onClick={() => onViewOnShop(currentProduct.id)}>
                                        <i className="icofont-external-link me-1"></i> Voir la page réelle
                                    </Button>
                                </div>
                            )}
                        </div>
                   </Tab>
                </Tabs>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top p-3">
          <Button variant="secondary" onClick={onHide} className="rounded-pill">
            <i className="icofont-close-line me-1"></i> Annuler
          </Button>
          <Button variant="primary" type="submit" className="rounded-pill">
            <i className={`icofont-${isEditing ? 'save' : 'plus'} me-1`}></i>
            {isEditing ? 'Enregistrer les modifications' : 'Ajouter le produit'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

ProductEditModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  productData: PropTypes.object, // Can be null for 'add' mode
  availableCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  productHistory: PropTypes.object,
  productStats: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onImageRemove: PropTypes.func.isRequired,
  lastModified: PropTypes.string,
  onViewOnShop: PropTypes.func.isRequired,
  onUpdateStats: PropTypes.func.isRequired,
};

export default ProductEditModal;