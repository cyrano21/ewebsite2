import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal, Alert, Tab, Tabs, InputGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Image from 'next/image';
import PageHeader from '../PageHeader';
import LoadingSpinner from '../LoadingSpinner';

const ShopManagement = () => {
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentShop, setCurrentShop] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  // Form States
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    seller: '',
    logo: '',
    coverImage: '',
    categories: [],
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    contactEmail: '',
    contactPhone: '',
    website: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    isPhysicalStore: false,
    isActive: true,
    isFeatured: false,
    isVerified: false
  });

  // Fetch shops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shops?active=${activeTab === 'active'}`);
        const data = await response.json();
        
        if (data.success) {
          setShops(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des boutiques");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [activeTab, actionSuccess]);
  
  // Fetch sellers and categories
  useEffect(() => {
    const fetchSellersAndCategories = async () => {
      try {
        // Fetch approved sellers
        const sellersResponse = await fetch('/api/sellers?status=approved');
        const sellersData = await sellersResponse.json();
        
        if (sellersData.success) {
          setSellers(sellersData.data);
        }
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des vendeurs et catégories:", err);
      }
    };

    fetchSellersAndCategories();
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
      // Handle nested properties
      const [parent, child] = name.split('.');
      setFormState({
        ...formState,
        [parent]: {
          ...formState[parent],
          [child]: value
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
      description: '',
      seller: '',
      logo: '',
      coverImage: '',
      categories: [],
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      contactEmail: '',
      contactPhone: '',
      website: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: ''
      },
      isPhysicalStore: false,
      isActive: true,
      isFeatured: false,
      isVerified: false
    });
  };

  const handleShowAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleShowEditModal = (shop) => {
    setFormState({
      name: shop.name,
      description: shop.description,
      seller: shop.seller._id,
      logo: shop.logo || '',
      coverImage: shop.coverImage || '',
      categories: shop.categories.map(c => c._id),
      address: {
        street: shop.address?.street || '',
        city: shop.address?.city || '',
        state: shop.address?.state || '',
        zipCode: shop.address?.zipCode || '',
        country: shop.address?.country || ''
      },
      contactEmail: shop.contactEmail || '',
      contactPhone: shop.contactPhone || '',
      website: shop.website || '',
      socialMedia: {
        facebook: shop.socialMedia?.facebook || '',
        instagram: shop.socialMedia?.instagram || '',
        twitter: shop.socialMedia?.twitter || '',
        linkedin: shop.socialMedia?.linkedin || ''
      },
      isPhysicalStore: shop.isPhysicalStore || false,
      isActive: shop.isActive,
      isFeatured: shop.isFeatured || false,
      isVerified: shop.isVerified || false
    });
    
    setCurrentShop(shop);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentShop(null);
  };

  const handleShowDetailsModal = (shop) => {
    setCurrentShop(shop);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setCurrentShop(null);
  };

  const handleAddShop = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActionSuccess("Boutique créée avec succès");
        handleCloseAddModal();
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setActionSuccess(null);
        }, 5000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erreur lors de la création de la boutique");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShop = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/shops/${currentShop._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActionSuccess("Boutique mise à jour avec succès");
        handleCloseEditModal();
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setActionSuccess(null);
        }, 5000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour de la boutique");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShop = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette boutique ?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/shops/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActionSuccess("Boutique supprimée avec succès");
        
        // Mettre à jour la liste des boutiques
        setShops(shops.filter(shop => shop._id !== id));
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setActionSuccess(null);
        }, 5000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erreur lors de la suppression de la boutique");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Gestion des Boutiques" curPage="Admin" />
      
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
              Nouvelle Boutique
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
              <Tab eventKey="active" title="Boutiques Actives" />
              <Tab eventKey="inactive" title="Boutiques Inactives" />
            </Tabs>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <LoadingSpinner />
            ) : shops.length === 0 ? (
              <div className="text-center py-5">
                <p className="mb-0">Aucune boutique trouvée</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover bordered>
                  <thead className="bg-light">
                    <tr>
                      <th>Boutique</th>
                      <th>Vendeur</th>
                      <th>Contact</th>
                      <th>Produits</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shops.map((shop) => (
                      <tr key={shop._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-3" style={{ width: '50px', height: '50px' }}>
                              {shop.logo ? (
                                <Image 
                                  src={shop.logo} 
                                  alt={shop.name}
                                  width={50}
                                  height={50}
                                  className="rounded"
                                />
                              ) : (
                                <div className="bg-light border rounded d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                  <span className="text-muted">Logo</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="fw-bold mb-0">{shop.name}</p>
                              <p className="text-muted mb-0">{shop.categories.map(c => c.name).join(', ')}</p>
                            </div>
                          </div>
                        </td>
                        <td>{shop.seller?.businessName || 'N/A'}</td>
                        <td>
                          <p className="mb-0">{shop.contactEmail || 'N/A'}</p>
                          <p className="mb-0">{shop.contactPhone || 'N/A'}</p>
                        </td>
                        <td>{shop.productsCount || 0}</td>
                        <td>
                          <div>
                            {shop.isActive ? (
                              <Badge bg="success" className="me-1">Active</Badge>
                            ) : (
                              <Badge bg="secondary" className="me-1">Inactive</Badge>
                            )}
                          </div>
                          <div className="mt-1">
                            {shop.isVerified && <Badge bg="info" className="me-1">Vérifiée</Badge>}
                            {shop.isFeatured && <Badge bg="warning">En vedette</Badge>}
                          </div>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2 mb-1"
                            onClick={() => handleShowDetailsModal(shop)}
                          >
                            Détails
                          </Button>
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            className="me-2 mb-1"
                            onClick={() => handleShowEditModal(shop)}
                          >
                            Modifier
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            className="mb-1"
                            onClick={() => handleDeleteShop(shop._id)}
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
      
      {/* Modals pour ajouter, éditer et voir les détails d'une boutique */}
      {/* Ces modals contiendraient des formulaires similaires à ceux de la gestion des promotions */}
      
      {/* Modal pour voir les détails d'une boutique */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la Boutique</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentShop && (
            <div>
              <div className="text-center mb-4">
                {currentShop.coverImage && (
                  <div className="mb-3" style={{ height: '150px', position: 'relative' }}>
                    <Image 
                      src={currentShop.coverImage} 
                      alt="Couverture"
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                )}
                
                <div className="d-flex align-items-center justify-content-center mb-2">
                  {currentShop.logo ? (
                    <Image 
                      src={currentShop.logo} 
                      alt={currentShop.name}
                      width={80}
                      height={80}
                      className="rounded-circle me-3"
                    />
                  ) : (
                    <div className="bg-light border rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '80px', height: '80px' }}>
                      <span className="text-muted">Logo</span>
                    </div>
                  )}
                  <h3 className="mb-0">{currentShop.name}</h3>
                </div>
                
                <div className="mb-3">
                  {currentShop.isActive ? (
                    <Badge bg="success" className="me-1">Active</Badge>
                  ) : (
                    <Badge bg="secondary" className="me-1">Inactive</Badge>
                  )}
                  {currentShop.isVerified && <Badge bg="info" className="me-1">Vérifiée</Badge>}
                  {currentShop.isFeatured && <Badge bg="warning">En vedette</Badge>}
                </div>
              </div>
              
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Informations Générales</h5>
                  <dl className="row">
                    <dt className="col-sm-4">Description</dt>
                    <dd className="col-sm-8">{currentShop.description}</dd>
                    
                    <dt className="col-sm-4">Vendeur</dt>
                    <dd className="col-sm-8">{currentShop.seller?.businessName || 'N/A'}</dd>
                    
                    <dt className="col-sm-4">Catégories</dt>
                    <dd className="col-sm-8">{currentShop.categories.map(c => c.name).join(', ')}</dd>
                    
                    <dt className="col-sm-4">Site Web</dt>
                    <dd className="col-sm-8">
                      {currentShop.website ? (
                        <a href={currentShop.website} target="_blank" rel="noopener noreferrer">
                          {currentShop.website}
                        </a>
                      ) : (
                        'Non spécifié'
                      )}
                    </dd>
                  </dl>
                </Col>
                <Col md={6}>
                  <h5>Contact et Adresse</h5>
                  <dl className="row">
                    <dt className="col-sm-4">Email</dt>
                    <dd className="col-sm-8">{currentShop.contactEmail || 'Non spécifié'}</dd>
                    
                    <dt className="col-sm-4">Téléphone</dt>
                    <dd className="col-sm-8">{currentShop.contactPhone || 'Non spécifié'}</dd>
                    
                    <dt className="col-sm-4">Adresse</dt>
                    <dd className="col-sm-8">
                      {currentShop.address?.street && (
                        <>
                          {currentShop.address.street}<br />
                          {currentShop.address.city}, {currentShop.address.zipCode}<br />
                          {currentShop.address.state}, {currentShop.address.country}
                        </>
                      ) || 'Non spécifiée'}
                    </dd>
                    
                    <dt className="col-sm-4">Boutique physique</dt>
                    <dd className="col-sm-8">{currentShop.isPhysicalStore ? 'Oui' : 'Non'}</dd>
                  </dl>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <h5>Statistiques</h5>
                  <dl className="row">
                    <dt className="col-sm-4">Produits</dt>
                    <dd className="col-sm-8">{currentShop.productsCount || 0}</dd>
                    
                    <dt className="col-sm-4">Commandes</dt>
                    <dd className="col-sm-8">{currentShop.ordersCount || 0}</dd>
                    
                    <dt className="col-sm-4">Ventes totales</dt>
                    <dd className="col-sm-8">{currentShop.totalSales ? `${currentShop.totalSales.toFixed(2)} €` : '0.00 €'}</dd>
                    
                    <dt className="col-sm-4">Évaluation</dt>
                    <dd className="col-sm-8">{currentShop.rating || 0} / 5 ({currentShop.reviewsCount || 0} avis)</dd>
                    
                    <dt className="col-sm-4">En favoris</dt>
                    <dd className="col-sm-8">{currentShop.favoritesCount || 0} utilisateurs</dd>
                  </dl>
                </Col>
                <Col md={6}>
                  <h5>Réseaux Sociaux</h5>
                  <dl className="row">
                    <dt className="col-sm-4">Facebook</dt>
                    <dd className="col-sm-8">
                      {currentShop.socialMedia?.facebook ? (
                        <a href={currentShop.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                          {currentShop.socialMedia.facebook}
                        </a>
                      ) : 'Non spécifié'}
                    </dd>
                    
                    <dt className="col-sm-4">Instagram</dt>
                    <dd className="col-sm-8">
                      {currentShop.socialMedia?.instagram ? (
                        <a href={currentShop.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                          {currentShop.socialMedia.instagram}
                        </a>
                      ) : 'Non spécifié'}
                    </dd>
                    
                    <dt className="col-sm-4">Twitter</dt>
                    <dd className="col-sm-8">
                      {currentShop.socialMedia?.twitter ? (
                        <a href={currentShop.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                          {currentShop.socialMedia.twitter}
                        </a>
                      ) : 'Non spécifié'}
                    </dd>
                    
                    <dt className="col-sm-4">LinkedIn</dt>
                    <dd className="col-sm-8">
                      {currentShop.socialMedia?.linkedin ? (
                        <a href={currentShop.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                          {currentShop.socialMedia.linkedin}
                        </a>
                      ) : 'Non spécifié'}
                    </dd>
                  </dl>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Fermer
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              handleCloseDetailsModal();
              handleShowEditModal(currentShop);
            }}
          >
            Modifier
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShopManagement;
