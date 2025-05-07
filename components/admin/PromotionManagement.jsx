import React, { useState, useEffect } from 'react';
// Importations individuelles de react-bootstrap au lieu d'importations groupées
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import PageHeader from '../PageHeader';
import LoadingSpinner from '../LoadingSpinner';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [actionSuccess, setActionSuccess] = useState(null);
  
  // Form States
  const [formState, setFormState] = useState({
    name: '',
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: 0,
    maxDiscount: '',
    buyXGetY: {
      buyQuantity: 1,
      getQuantity: 1,
      getDiscountPercentage: 100
    },
    applicableProducts: [],
    applicableCategories: [],
    excludedProducts: [],
    applicableToAllProducts: true,
    maxUsage: '',
    maxUsagePerUser: 1,
    startDate: '',
    endDate: '',
    isActive: true
  });

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/promotions?active=${activeTab === 'active'}`);
        const data = await response.json();
        
        if (data.success) {
          setPromotions(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des promotions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [activeTab, actionSuccess]);
  
  // Fetch products and categories for form selection
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        
        if (productsData.success) {
          setProducts(productsData.data);
        }
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des produits et catégories:", err);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormState({
        ...formState,
        [name]: checked
      });
    } else if (name.includes('.')) {
      // Handle nested properties (for buyXGetY)
      const [parent, child] = name.split('.');
      setFormState({
        ...formState,
        [parent]: {
          ...formState[parent],
          [child]: type === 'number' ? Number(value) : value
        }
      });
    } else {
      setFormState({
        ...formState,
        [name]: value
      });
    }
  };

  const handleSelectMultiple = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    setFormState({
      ...formState,
      [name]: selectedValues
    });
  };

  const resetForm = () => {
    setFormState({
      name: '',
      code: '',
      type: 'percentage',
      value: '',
      minPurchase: 0,
      maxDiscount: '',
      buyXGetY: {
        buyQuantity: 1,
        getQuantity: 1,
        getDiscountPercentage: 100
      },
      applicableProducts: [],
      applicableCategories: [],
      excludedProducts: [],
      applicableToAllProducts: true,
      maxUsage: '',
      maxUsagePerUser: 1,
      startDate: '',
      endDate: '',
      isActive: true
    });
  };

  const handleShowAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleShowEditModal = (promotion) => {
    // Format dates for input fields
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    
    setFormState({
      name: promotion.name,
      code: promotion.code,
      type: promotion.type,
      value: promotion.value,
      minPurchase: promotion.minPurchase,
      maxDiscount: promotion.maxDiscount || '',
      buyXGetY: promotion.buyXGetY || {
        buyQuantity: 1,
        getQuantity: 1,
        getDiscountPercentage: 100
      },
      applicableProducts: promotion.applicableProducts.map(p => p._id || p),
      applicableCategories: promotion.applicableCategories.map(c => c._id || c),
      excludedProducts: promotion.excludedProducts?.map(p => p._id || p) || [],
      applicableToAllProducts: promotion.applicableToAllProducts,
      maxUsage: promotion.maxUsage || '',
      maxUsagePerUser: promotion.maxUsagePerUser || 1,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      isActive: promotion.isActive
    });
    
    setCurrentPromotion(promotion);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentPromotion(null);
  };

  const handleAddPromotion = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActionSuccess("Promotion créée avec succès");
        handleCloseAddModal();
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setActionSuccess(null);
        }, 5000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erreur lors de la création de la promotion");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePromotion = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/promotions/${currentPromotion._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActionSuccess("Promotion mise à jour avec succès");
        handleCloseEditModal();
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setActionSuccess(null);
        }, 5000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour de la promotion");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromotion = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActionSuccess("Promotion supprimée avec succès");
        
        // Mettre à jour la liste des promotions
        setPromotions(promotions.filter(promo => promo._id !== id));
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setActionSuccess(null);
        }, 5000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erreur lors de la suppression de la promotion");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Render type badge
  const renderTypeBadge = (type) => {
    let variant, label;
    switch (type) {
      case 'percentage':
        variant = 'primary';
        label = 'Pourcentage';
        break;
      case 'fixed_amount':
        variant = 'success';
        label = 'Montant fixe';
        break;
      case 'free_shipping':
        variant = 'info';
        label = 'Livraison gratuite';
        break;
      case 'buy_x_get_y':
        variant = 'warning';
        label = 'Achetez X obtenez Y';
        break;
      default:
        variant = 'secondary';
        label = type;
    }
    
    return <Badge bg={variant}>{label}</Badge>;
  };
  
  // Format value based on promotion type
  const formatPromotionValue = (promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed_amount':
        return `${promotion.value.toFixed(2)} €`;
      case 'free_shipping':
        return 'Gratuit';
      case 'buy_x_get_y':
        return `Achetez ${promotion.buyXGetY.buyQuantity}, obtenez ${promotion.buyXGetY.getQuantity} à ${promotion.buyXGetY.getDiscountPercentage}% de réduction`;
      default:
        return '-';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Check if promotion is expired
  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div>
      <PageHeader title="Gestion des Promotions" curPage="Admin" />
      
      <Container fluid className="py-4">
        {actionSuccess && (
          <Alert variant="success" dismissible onClose={() => setActionSuccess(null)}>
            {actionSuccess}
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Row className="mb-4">
          <Col>
            <Button variant="primary" onClick={handleShowAddModal}>
              Nouvelle Promotion
            </Button>
          </Col>
        </Row>
        
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white py-3">
            <Tabs
              activeKey={activeTab}
              onSelect={handleTabChange}
              className="mb-0"
            >
              <Tab eventKey="active" title="Promotions Actives" />
              <Tab eventKey="inactive" title="Promotions Inactives" />
            </Tabs>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <LoadingSpinner />
            ) : promotions.length === 0 ? (
              <div className="text-center py-5">
                <p className="mb-0">Aucune promotion trouvée</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover bordered>
                  <thead className="bg-light">
                    <tr>
                      <th>Nom</th>
                      <th>Code</th>
                      <th>Type</th>
                      <th>Valeur</th>
                      <th>Période</th>
                      <th>Utilisations</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotions.map((promotion) => (
                      <tr key={promotion._id}>
                        <td>{promotion.name}</td>
                        <td><code>{promotion.code}</code></td>
                        <td>{renderTypeBadge(promotion.type)}</td>
                        <td>{formatPromotionValue(promotion)}</td>
                        <td>
                          <div>{formatDate(promotion.startDate)}</div>
                          <div>au</div>
                          <div>{formatDate(promotion.endDate)}</div>
                        </td>
                        <td>
                          {promotion.usageCount} / {promotion.maxUsage ? promotion.maxUsage : '∞'}
                        </td>
                        <td>
                          {isExpired(promotion.endDate) ? (
                            <Badge bg="danger">Expirée</Badge>
                          ) : promotion.isActive ? (
                            <Badge bg="success">Active</Badge>
                          ) : (
                            <Badge bg="secondary">Inactive</Badge>
                          )}
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleShowEditModal(promotion)}
                          >
                            Modifier
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeletePromotion(promotion._id)}
                          >
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
      
      {/* Modal pour ajouter une promotion */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nouvelle Promotion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddPromotion}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom de la promotion</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="code"
                    value={formState.code}
                    onChange={handleInputChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Le code sera automatiquement converti en majuscules
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type de promotion</Form.Label>
                  <Form.Select 
                    name="type"
                    value={formState.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="percentage">Pourcentage de réduction</option>
                    <option value="fixed_amount">Montant fixe</option>
                    <option value="free_shipping">Livraison gratuite</option>
                    <option value="buy_x_get_y">Achetez X, obtenez Y</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              {(formState.type === 'percentage' || formState.type === 'fixed_amount') && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {formState.type === 'percentage' ? 'Pourcentage (%)' : 'Montant (€)'}
                    </Form.Label>
                    <Form.Control 
                      type="number" 
                      name="value"
                      value={formState.value}
                      onChange={handleInputChange}
                      min="0"
                      max={formState.type === 'percentage' ? "100" : ""}
                      step={formState.type === 'percentage' ? "1" : "0.01"}
                      required
                    />
                  </Form.Group>
                </Col>
              )}
            </Row>
            
            {formState.type === 'buy_x_get_y' && (
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Achetez (quantité)</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="buyXGetY.buyQuantity"
                      value={formState.buyXGetY.buyQuantity}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Obtenez (quantité)</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="buyXGetY.getQuantity"
                      value={formState.buyXGetY.getQuantity}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>% de réduction</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="buyXGetY.getDiscountPercentage"
                      value={formState.buyXGetY.getDiscountPercentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Achat minimum (€)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="minPurchase"
                    value={formState.minPurchase}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              {formState.type === 'percentage' && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Réduction maximale (€)</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="maxDiscount"
                      value={formState.maxDiscount}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                    <Form.Text className="text-muted">
                      Laisser vide pour aucune limite
                    </Form.Text>
                  </Form.Group>
                </Col>
              )}
            </Row>
            
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox" 
                    label="Applicable à tous les produits" 
                    name="applicableToAllProducts"
                    checked={formState.applicableToAllProducts}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {!formState.applicableToAllProducts && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Produits applicables</Form.Label>
                      <Form.Select 
                        multiple
                        name="applicableProducts"
                        value={formState.applicableProducts}
                        onChange={handleSelectMultiple}
                        style={{ height: '150px' }}
                      >
                        {products.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.name} - {product.price.toFixed(2)} €
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Maintenez Ctrl pour sélectionner plusieurs produits
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Catégories applicables</Form.Label>
                      <Form.Select 
                        multiple
                        name="applicableCategories"
                        value={formState.applicableCategories}
                        onChange={handleSelectMultiple}
                        style={{ height: '150px' }}
                      >
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Maintenez Ctrl pour sélectionner plusieurs catégories
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Produits exclus</Form.Label>
                      <Form.Select 
                        multiple
                        name="excludedProducts"
                        value={formState.excludedProducts}
                        onChange={handleSelectMultiple}
                        style={{ height: '150px' }}
                      >
                        {products.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.name} - {product.price.toFixed(2)} €
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Maintenez Ctrl pour sélectionner plusieurs produits à exclure
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre d&apos;utilisations maximum</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="maxUsage"
                    value={formState.maxUsage}
                    onChange={handleInputChange}
                    min="0"
                  />
                  <Form.Text className="text-muted">
                    Laisser vide pour aucune limite
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Utilisations max par client</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="maxUsagePerUser"
                    value={formState.maxUsagePerUser}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de début</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="startDate"
                    value={formState.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de fin</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="endDate"
                    value={formState.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Promotion active" 
                name="isActive"
                checked={formState.isActive}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseAddModal}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Créer la promotion
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Modal pour éditer une promotion */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modifier la Promotion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPromotion && (
            <Form onSubmit={handleUpdatePromotion}>
              {/* Même formulaire que pour l'ajout */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom de la promotion</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Code</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="code"
                      value={formState.code}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      Le code sera automatiquement converti en majuscules
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              {/* ... Reste du formulaire identique à celui d'ajout ... */}
              
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={handleCloseEditModal}>
                  Annuler
                </Button>
                <Button variant="primary" type="submit">
                  Mettre à jour
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
