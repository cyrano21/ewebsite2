import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal, Tab, Tabs, Alert } from 'react-bootstrap';
import PageHeader from '../PageHeader';
import LoadingSpinner from '../LoadingSpinner';

const ShippingManagement = () => {
  const [shippings, setShippings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentShipping, setCurrentShipping] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  // États pour le formulaire d'ajout
  const [selectedOrder, setSelectedOrder] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  
  // États pour le formulaire de mise à jour
  const [newStatus, setNewStatus] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // Fetch shipping data
  useEffect(() => {
    const fetchShippings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shipping?status=${activeTab}`);
        const data = await response.json();
        
        if (data.success) {
          setShippings(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des envois");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShippings();
  }, [activeTab, actionSuccess]);
  
  // Fetch available orders for shipping
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders?status=paid');
        const data = await response.json();
        
        if (data.success) {
          setOrders(data.data);
        } else {
          console.error("Erreur lors de la récupération des commandes:", data.message);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setSelectedOrder('');
    setTrackingNumber('');
    setCarrier('');
    setEstimatedDelivery('');
  };

  const handleShowUpdateModal = (shipping) => {
    setCurrentShipping(shipping);
    setNewStatus(shipping.status);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setCurrentShipping(null);
    setNewStatus('');
    setEventLocation('');
    setEventDescription('');
  };

  const handleShowDetailsModal = (shipping) => {
    setCurrentShipping(shipping);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setCurrentShipping(null);
  };

  const handleAddShipping = async (e) => {
    e.preventDefault();
    
    if (!selectedOrder || !trackingNumber || !carrier) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder,
          trackingNumber,
          carrier,
          estimatedDelivery: estimatedDelivery || null
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActionSuccess("Envoi créé avec succès");
        handleCloseAddModal();
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setActionSuccess(null);
        }, 5000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erreur lors de la création de l'envoi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShipping = async (e) => {
    e.preventDefault();
    
    if (!newStatus || !eventLocation || !eventDescription) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/shipping/${currentShipping._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          trackingEvent: {
            eventStatus: newStatus,
            location: eventLocation,
            description: eventDescription
          }
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActionSuccess("Statut de l'envoi mis à jour avec succès");
        handleCloseUpdateModal();
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setActionSuccess(null);
        }, 5000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'envoi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    let variant;
    switch (status) {
      case 'pending':
        variant = 'secondary';
        break;
      case 'processing':
        variant = 'primary';
        break;
      case 'shipped':
        variant = 'info';
        break;
      case 'in_transit':
        variant = 'warning';
        break;
      case 'out_for_delivery':
        variant = 'warning';
        break;
      case 'delivered':
        variant = 'success';
        break;
      case 'failed':
        variant = 'danger';
        break;
      case 'returned':
        variant = 'danger';
        break;
      default:
        variant = 'light';
    }
    
    return <Badge bg={variant}>{status.replace('_', ' ')}</Badge>;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <PageHeader title="Gestion des Livraisons" curPage="Admin" />
      
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
              Nouvelle Expédition
            </Button>
          </Col>
        </Row>
        
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white py-3">
            <h5 className="mb-0">Gestion des Livraisons</h5>
          </Card.Header>
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={handleTabChange}
              className="mb-4"
            >
              <Tab eventKey="pending" title="En attente">
              </Tab>
              <Tab eventKey="processing" title="En traitement">
              </Tab>
              <Tab eventKey="shipped" title="Expédiées">
              </Tab>
              <Tab eventKey="in_transit" title="En transit">
              </Tab>
              <Tab eventKey="out_for_delivery" title="En livraison">
              </Tab>
              <Tab eventKey="delivered" title="Livrées">
              </Tab>
              <Tab eventKey="failed" title="Échouées">
              </Tab>
              <Tab eventKey="returned" title="Retournées">
              </Tab>
            </Tabs>
            
            {loading ? (
              <LoadingSpinner />
            ) : shippings.length === 0 ? (
              <div className="text-center py-5">
                <p className="mb-0">Aucun envoi trouvé avec le statut: {activeTab.replace('_', ' ')}</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover bordered>
                  <thead className="bg-light">
                    <tr>
                      <th>Numéro de commande</th>
                      <th>N° de suivi</th>
                      <th>Transporteur</th>
                      <th>Date d&apos;expédition</th>
                      <th>Livraison estimée</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippings.map((shipping) => (
                      <tr key={shipping._id}>
                        <td>
                          {shipping.order?.orderNumber || 'N/A'}
                        </td>
                        <td>{shipping.trackingNumber}</td>
                        <td>{shipping.carrier}</td>
                        <td>{formatDate(shipping.createdAt)}</td>
                        <td>{formatDate(shipping.estimatedDelivery)}</td>
                        <td>{renderStatusBadge(shipping.status)}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleShowDetailsModal(shipping)}
                          >
                            Détails
                          </Button>
                          
                          {shipping.status !== 'delivered' && shipping.status !== 'returned' && (
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleShowUpdateModal(shipping)}
                            >
                              Mettre à jour
                            </Button>
                          )}
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
      
      {/* Modal pour ajouter un envoi */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nouvelle Expédition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddShipping}>
            <Form.Group className="mb-3">
              <Form.Label>Commande</Form.Label>
              <Form.Select 
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                required
              >
                <option value="">Sélectionner une commande</option>
                {orders.map((order) => (
                  <option key={order._id} value={order._id}>
                    {order.orderNumber} - {order.totalAmount.toFixed(2)} € - {order.user?.name || 'Client'}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Numéro de Suivi</Form.Label>
              <Form.Control 
                type="text" 
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Transporteur</Form.Label>
              <Form.Control 
                type="text" 
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Date de Livraison Estimée</Form.Label>
              <Form.Control 
                type="datetime-local" 
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseAddModal}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Créer
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Modal pour mettre à jour un envoi */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mettre à jour l&apos;Envoi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentShipping && (
            <Form onSubmit={handleUpdateShipping}>
              <Form.Group className="mb-3">
                <Form.Label>Numéro de Suivi</Form.Label>
                <Form.Control 
                  type="text" 
                  value={currentShipping.trackingNumber}
                  disabled
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Nouveau Statut</Form.Label>
                <Form.Select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="processing">En traitement</option>
                  <option value="shipped">Expédiée</option>
                  <option value="in_transit">En transit</option>
                  <option value="out_for_delivery">En livraison</option>
                  <option value="delivered">Livrée</option>
                  <option value="failed">Échouée</option>
                  <option value="returned">Retournée</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Emplacement</Form.Label>
                <Form.Control 
                  type="text" 
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Ex: Centre de tri Paris"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Ex: Colis en cours de traitement au centre de tri"
                  required
                />
              </Form.Group>
              
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={handleCloseUpdateModal}>
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
      
      {/* Modal pour les détails d'un envoi */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de l&apos;Envoi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentShipping && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Informations Générales</h5>
                  <dl className="row">
                    <dt className="col-sm-4">Numéro de commande</dt>
                    <dd className="col-sm-8">{currentShipping.order?.orderNumber || 'N/A'}</dd>
                    
                    <dt className="col-sm-4">Numéro de suivi</dt>
                    <dd className="col-sm-8">{currentShipping.trackingNumber}</dd>
                    
                    <dt className="col-sm-4">Transporteur</dt>
                    <dd className="col-sm-8">{currentShipping.carrier}</dd>
                    
                    <dt className="col-sm-4">Statut</dt>
                    <dd className="col-sm-8">{renderStatusBadge(currentShipping.status)}</dd>
                    
                    <dt className="col-sm-4">Date d&apos;expédition</dt>
                    <dd className="col-sm-8">{formatDate(currentShipping.createdAt)}</dd>
                    
                    <dt className="col-sm-4">Livraison estimée</dt>
                    <dd className="col-sm-8">{formatDate(currentShipping.estimatedDelivery)}</dd>
                    
                    <dt className="col-sm-4">Livraison réelle</dt>
                    <dd className="col-sm-8">{formatDate(currentShipping.actualDelivery)}</dd>
                  </dl>
                </Col>
                <Col md={6}>
                  <h5>Adresse de Livraison</h5>
                  <p>
                    {currentShipping.shippingAddress?.street}<br />
                    {currentShipping.shippingAddress?.city}, {currentShipping.shippingAddress?.zipCode}<br />
                    {currentShipping.shippingAddress?.country}
                  </p>
                </Col>
              </Row>
              
              <h5>Historique de Suivi</h5>
              <div className="tracking-timeline">
                {currentShipping.trackingHistory && currentShipping.trackingHistory.length > 0 ? (
                  <div className="timeline-items">
                    {currentShipping.trackingHistory.map((event, index) => (
                      <div key={index} className="timeline-item mb-3 border-start border-3 border-primary ps-3">
                        <div className="d-flex justify-content-between">
                          <strong>{event.status.replace('_', ' ')}</strong>
                          <span className="text-muted">{formatDate(event.timestamp)}</span>
                        </div>
                        <div>Lieu: {event.location}</div>
                        <div className="text-muted">{event.description}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">Aucun événement de suivi disponible</p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Fermer
          </Button>
          {currentShipping && currentShipping.status !== 'delivered' && currentShipping.status !== 'returned' && (
            <Button variant="primary" onClick={() => {
              handleCloseDetailsModal();
              handleShowUpdateModal(currentShipping);
            }}>
              Mettre à jour
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShippingManagement;
