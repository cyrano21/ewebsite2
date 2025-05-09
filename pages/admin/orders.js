import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Pagination, Badge, Modal } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/PageHeader';

export default function OrderManagementPage() {
  const router = useRouter();
  // États pour gérer les commandes et la pagination
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    customer: '',
    email: '',
    itemsJson: '[]',
    total: '',
    status: 'En attente',
    paymentMethod: 'Carte de crédit',
    shippingAddress: ''
  });
  
  // États pour filtres avancés
  const [filterData, setFilterData] = useState({ dateFrom: '', dateTo: '', minTotal: '', maxTotal: '', paymentMethod: 'All', clientId: '' });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Récupérer le paramètre customer de l'URL si présent
  useEffect(() => {
    if (router.query.customer) {
      setSearchTerm(router.query.customer);
    }
  }, [router.query]);

  // Fonction pour charger les commandes avec filtres dynamiques
  const fetchOrders = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedStatus && selectedStatus !== 'All') params.append('status', selectedStatus);
    if (filterData.dateFrom) params.append('dateFrom', filterData.dateFrom);
    if (filterData.dateTo) params.append('dateTo', filterData.dateTo);
    if (filterData.minTotal) params.append('minTotal', filterData.minTotal);
    if (filterData.maxTotal) params.append('maxTotal', filterData.maxTotal);
    if (filterData.paymentMethod && filterData.paymentMethod !== 'All') params.append('paymentMethod', filterData.paymentMethod);
    if (filterData.clientId) params.append('clientId', filterData.clientId);
    params.append('page', currentPage);
    params.append('limit', itemsPerPage);
    fetch(`/api/orders?${params.toString()}`)
      .then(response => response.json())
      .then(data => {
        setOrders(data.orders);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des commandes:', error);
        setOrders([]);
        setIsLoading(false);
      });
  };

  // Rechargement à chaque changement de filtre/page
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterData, currentPage]);

  // Données factices pour démonstration
  const orderData = [
    { 
      id: 'ORD-1234', 
      customer: 'Jean Dupont', 
      customerId: 1,
      email: 'jean.dupont@example.com',
      date: '19/04/2025', 
      amount: 129.99, 
      status: 'Livré',
      paymentMethod: 'Carte de crédit',
      items: [
        { name: 'Nike Premier X', quantity: 1, price: 129.99 }
      ],
      address: {
        street: '123 Rue de Paris',
        city: 'Paris',
        zipCode: '75001',
        country: 'France'
      }
    },
    { 
      id: 'ORD-1235', 
      customer: 'Marie Dubois', 
      customerId: 2,
      email: 'marie.dubois@example.com',
      date: '18/04/2025', 
      amount: 89.50, 
      status: 'En cours',
      paymentMethod: 'PayPal',
      items: [
        { name: 'Asthetic Bags', quantity: 1, price: 89.50 }
      ],
      address: {
        street: '45 Avenue des Champs',
        city: 'Lyon',
        zipCode: '69000',
        country: 'France'
      }
    },
    { 
      id: 'ORD-1236', 
      customer: 'Pierre Martin', 
      customerId: 3,
      email: 'pierre.martin@example.com',
      date: '17/04/2025', 
      amount: 45.00, 
      status: 'Annulé',
      paymentMethod: 'Carte de crédit',
      items: [
        { name: 'Woolen T-shirt', quantity: 1, price: 45.00 }
      ],
      address: {
        street: '78 Boulevard des Fleurs',
        city: 'Marseille',
        zipCode: '13000',
        country: 'France'
      }
    },
    { 
      id: 'ORD-1237', 
      customer: 'Sophie Bernard', 
      customerId: 4,
      email: 'sophie.bernard@example.com',
      date: '16/04/2025', 
      amount: 245.80, 
      status: 'Expédié',
      paymentMethod: 'PayPal',
      items: [
        { name: 'Nike Air Force 1', quantity: 1, price: 149.99 },
        { name: 'Cotton T-shirt', quantity: 2, price: 47.90 }
      ],
      address: {
        street: '12 Rue du Commerce',
        city: 'Bordeaux',
        zipCode: '33000',
        country: 'France'
      }
    },
    { 
      id: 'ORD-1238', 
      customer: 'Lucas Petit', 
      customerId: 5,
      email: 'lucas.petit@example.com',
      date: '15/04/2025', 
      amount: 75.50, 
      status: 'En attente',
      paymentMethod: 'Carte de crédit',
      items: [
        { name: 'Sac à dos Aventure', quantity: 1, price: 75.50 }
      ],
      address: {
        street: '3 Avenue République',
        city: 'Toulouse',
        zipCode: '31000',
        country: 'France'
      }
    }
  ];

  // Filtrer les commandes pour n'afficher que celles qui ont un client ET le statut sélectionné
  const filteredOrders = orders
    .filter(order => order.user || order.customer)
    .filter(order => selectedStatus === 'All' || order.status === selectedStatus);

  // Calculer les indices pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders;

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Ouvrir le modal avec les détails de la commande
  const openOrderDetails = (order) => {
    setCurrentOrder(order);
    setShowModal(true);
  };

  // Gestionnaire de recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams({
      search: searchTerm,
      dateFrom: filterData.dateFrom,
      dateTo: filterData.dateTo,
      minTotal: filterData.minTotal,
      maxTotal: filterData.maxTotal,
      export: "csv"
    });
    window.open(`/api/orders?${params.toString()}`, '_blank');
  };

  // Gestionnaire de changement de statut
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page lors d'un changement de statut
  };

  // Conversion des statuts front → API
  function mapStatusToApi(status) {
    switch (status) {
      case 'En attente': return 'pending';
      case 'En cours': return 'processing';
      case 'Expédié': return 'shipped';
      case 'Livré': return 'delivered';
      case 'Annulé': return 'cancelled';
      default: return 'pending';
    }
  }

  // Mise à jour du statut d'une commande
  const updateOrderStatus = async (orderId, newStatus) => {
  if (!orderId) {
    alert('ID de commande manquant !');
    return;
  }
    try {
      const apiStatus = mapStatusToApi(newStatus);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: apiStatus }),
      });
      
      if (response.ok) {
        // Mettre à jour l'état local
        const updatedOrders = orders.map(order => {
          const oid = order._id || order.id;
          return oid === orderId ? { ...order, status: newStatus } : order;
        });
        setOrders(updatedOrders);
        
        // Si la commande en cours de visualisation est celle qui a été mise à jour, mettre à jour également
        if (currentOrder && (currentOrder._id === orderId || currentOrder.id === orderId)) {
          setCurrentOrder({ ...currentOrder, status: newStatus });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
      console.error('Erreur API:', errorData);
      alert('Erreur lors de la mise à jour du statut de la commande' + (errorData && errorData.error ? (': ' + errorData.error) : ''));
      }
    } catch (error) {
      console.error('Erreur JS front:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  // Annuler une commande
  const cancelOrder = async (order) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      await updateOrderStatus(order._id || order.id, 'Annulé');
    }
  };

  // Gestion création commande
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewOrderData(prev => ({ ...prev, [name]: value }));
  };
  const submitNewOrder = async (e) => {
    // Vérifier qu'un client est bien sélectionné (user obligatoire)
    if (!newOrderData.customer || newOrderData.customer.trim() === "") {
      alert("Le champ 'Client' est obligatoire pour chaque commande.");
      return;
    }
    e.preventDefault();
    if (!newOrderData.shippingAddress || newOrderData.shippingAddress.trim() === "") {
      alert("Le champ 'Adresse de livraison' (Nom complet) est obligatoire.");
      return;
    }
    e.preventDefault();
    try {
      const orderPayload = {
        items: JSON.parse(newOrderData.itemsJson || '[]'),
        total: parseFloat(newOrderData.total) || 0,
        status: newOrderData.status,
        shippingAddress: newOrderData.shippingAddress,
        paymentMethod: newOrderData.paymentMethod
      };
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const created = await response.json();
      setOrders(prev => [created, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erreur création commande:', error);
    }
  };

  // Couleur du badge en fonction du statut
  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'Livré': return 'success';
      case 'Expédié': return 'info';
      case 'En cours': return 'primary';
      case 'En attente': return 'warning';
      case 'Annulé': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Gestion des commandes" curPage="Admin / Commandes" />
      
      <Container fluid className="py-4">
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row className="align-items-center mb-3">
              <Col>
                <h5 className="mb-0">Liste des commandes</h5>
              </Col>
              <Col xs="auto">
                <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
                  <i className="icofont-plus-circle me-1"></i> Créer une commande
                </Button>
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col md={6}>
                <InputGroup>
                  <Form.Control
                    placeholder="Rechercher par ID, client ou email..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <Button variant="outline-secondary">
                    <i className="icofont-search-1"></i>
                  </Button>
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select value={selectedStatus} onChange={handleStatusChange}>
                  <option value="All">Tous les statuts</option>
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours</option>
                  <option value="Expédié">Expédié</option>
                  <option value="Livré">Livré</option>
                  <option value="Annulé">Annulé</option>
                </Form.Select>
              </Col>
            </Row>
            
            {/* Filtres avancés */}
            <Form className="mb-3" onSubmit={handleFilterSubmit}>
              <Row>
                <Col md={3}><Form.Control type="text" placeholder="Recherche..." value={searchTerm} onChange={handleSearch} /></Col>
                <Col md={2}><Form.Control type="date" name="dateFrom" value={filterData.dateFrom} onChange={handleFilterChange} /></Col>
                <Col md={2}><Form.Control type="date" name="dateTo" value={filterData.dateTo} onChange={handleFilterChange} /></Col>
                <Col md={2}><Form.Control type="number" name="minTotal" placeholder="Montant min" value={filterData.minTotal} onChange={handleFilterChange} /></Col>
                <Col md={2}><Form.Control type="number" name="maxTotal" placeholder="Montant max" value={filterData.maxTotal} onChange={handleFilterChange} /></Col>
                <Col md={2}>
                  <Form.Select name="paymentMethod" value={filterData.paymentMethod} onChange={handleFilterChange}>
                    <option value="All">Tous moyens de paiement</option>
                    <option value="Carte de crédit">Carte de crédit</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Virement">Virement</option>
                  </Form.Select>
                </Col>
                <Col md={2}><Form.Control type="text" name="clientId" placeholder="ID client" value={filterData.clientId} onChange={handleFilterChange} /></Col>
                <Col md={1}><Button type="submit" variant="primary">Filtrer</Button></Col>
              </Row>
            </Form>
            <Button variant="outline-success" size="sm" className="mb-3" onClick={handleExportCSV}>Exporter CSV</Button>
            <div className="mb-2 text-end">
              <small>{totalCount} résultat(s) • {totalPages} page(s)</small>
            </div>
            
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Commande</th>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((order) => (
                          <tr key={order.id}>
                            <td>{order.orderNumber || order.id || '—'}</td>
                            <td>
                              <div>{order.user?.name || order.shippingAddress?.fullName || order.customer || '—'}</div>
                              <small className="text-muted">{order.user?.email || order.email || '—'}</small>
                            </td>
                            <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : (order.date || '—')}</td>
                            <td>{(typeof order.amount === 'number' && !isNaN(order.amount) ? order.amount : 0).toFixed(2)} €</td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(order.status)}>
                                {order.status}
                              </Badge>
                            </td>
                            <td>
                              <Button 
                                variant="link" 
                                className="p-0 me-2" 
                                onClick={() => openOrderDetails(order)}
                              >
                                <i className="icofont-eye-alt text-primary"></i>
                              </Button>
                              <Button 
                                variant="link" 
                                className="p-0 me-2"
                              >
                                <i className="icofont-edit text-secondary"></i>
                              </Button>
                              {order.status !== 'Annulé' && order.status !== 'Livré' && (
                                <Button 
                                  variant="link" 
                                  className="p-0"
                                  onClick={() => cancelOrder(order._id || order.id)}
                                >
                                  <i className="icofont-ui-delete text-danger"></i>
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            Aucune commande trouvée correspondant à votre recherche.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredOrders.length)} sur {filteredOrders.length} commandes
                  </div>
                  
                  <Pagination>
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(current => Math.max(current - 1, 1))}
                      disabled={currentPage === 1}
                    />
                    
                    {[...Array(Math.ceil(filteredOrders.length / itemsPerPage)).keys()].map(number => (
                      <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => paginate(number + 1)}
                      >
                        {number + 1}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next 
                      onClick={() => setCurrentPage(current => 
                        Math.min(current + 1, Math.ceil(filteredOrders.length / itemsPerPage))
                      )}
                      disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
      
      {/* Modal de détails de la commande */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la commande {currentOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentOrder && (
            <>
              <Row className="mb-4">
                <Col>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Résumé</h5>
                    <Badge bg={getStatusBadgeVariant(currentOrder.status)} className="fs-6">
                      {currentOrder.status}
                    </Badge>
                  </div>
                  <p className="mb-1">
                    <strong>Date de commande:</strong> {currentOrder.date}
                  </p>
                  <p className="mb-1">
                    <strong>Méthode de paiement:</strong> {currentOrder.paymentMethod}
                  </p>
                  <p className="mb-1">
                    <strong>Total:</strong> {(typeof currentOrder.amount === 'number' && !isNaN(currentOrder.amount) ? currentOrder.amount : 0).toFixed(2)} €
                  </p>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Informations client</h6>
                  <p className="mb-1">{currentOrder.customer}</p>
                  <p className="mb-1">{currentOrder.email}</p>
                </Col>
                <Col md={6}>
                  <h6>Adresse de livraison</h6>
                  <p className="mb-1">{currentOrder.address.street}</p>
                  <p className="mb-1">
                    {currentOrder.address.zipCode} {currentOrder.address.city}
                  </p>
                  <p>{currentOrder.address.country}</p>
                </Col>
              </Row>
              
              <h6 className="mb-3">Articles</h6>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th className="text-center">Quantité</th>
                    <th className="text-end">Prix unitaire</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">{(typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0).toFixed(2)} €</td>
                      <td className="text-end">{(typeof item.quantity === 'number' && typeof item.price === 'number' && !isNaN(item.quantity * item.price) ? (item.quantity * item.price) : 0).toFixed(2)} €</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="text-end fw-bold">Total</td>
                    <td className="text-end fw-bold">{(typeof currentOrder.amount === 'number' && !isNaN(currentOrder.amount) ? currentOrder.amount : 0).toFixed(2)} €</td>
                  </tr>
                </tbody>
              </Table>
              
              {currentOrder.status !== 'Annulé' && currentOrder.status !== 'Livré' && (
                <div className="mt-4">
                  <h6 className="mb-3">Mettre à jour le statut</h6>
                  <div className="d-flex">
                    <Form.Select 
                      className="me-2" 
                      value={currentOrder.status}
                      onChange={(e) => setCurrentOrder({...currentOrder, status: e.target.value})}
                    >
                      <option value="En attente">En attente</option>
                      <option value="En cours">En cours</option>
                      <option value="Expédié">Expédié</option>
                      <option value="Livré">Livré</option>
                      <option value="Annulé">Annulé</option>
                    </Form.Select>
                    <Button 
                      variant="primary"
                      onClick={() => updateOrderStatus(currentOrder.id, currentOrder.status)}
                    >
                      Mettre à jour
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          {currentOrder && currentOrder.status !== 'Annulé' && currentOrder.status !== 'Livré' && (
            <Button variant="danger" onClick={() => {
              cancelOrder(currentOrder.id);
              setShowModal(false);
            }}>
              Annuler la commande
            </Button>
          )}
          <Button variant="primary" onClick={() => {
            // Logique d'impression de la facture
            alert('Fonctionnalité d\'impression de facture à implémenter');
          }}>
            Imprimer la facture
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal création commande */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered contentClassName="shadow-lg rounded-3 bg-white" backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary text-white border-0 text-center">
          <Modal.Title>Nouvelle commande</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light p-4">
          <Form onSubmit={submitNewOrder}>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group controlId="newOrderCustomer">
                  <Form.Label>Client</Form.Label>
                  <Form.Control type="text" size="lg" name="customer" placeholder="Nom du client" value={newOrderData.customer} onChange={handleCreateChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="newOrderEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" size="lg" name="email" placeholder="Adresse email" value={newOrderData.email} onChange={handleCreateChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-3 mb-3">
              <Col md={4}>
                <Form.Group controlId="newOrderTotal">
                  <Form.Label>Total (€)</Form.Label>
                  <Form.Control type="number" size="lg" step="0.01" name="total" placeholder="0.00" value={newOrderData.total} onChange={handleCreateChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="newOrderStatus">
                  <Form.Label>Statut</Form.Label>
                  <Form.Select size="lg" name="status" value={newOrderData.status} onChange={handleCreateChange}>
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Expédié">Expédié</option>
                    <option value="Livré">Livré</option>
                    <option value="Annulé">Annulé</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="newOrderPaymentMethod">
                  <Form.Label>Méthode paiement</Form.Label>
                  <Form.Select size="lg" name="paymentMethod" value={newOrderData.paymentMethod} onChange={handleCreateChange}>
                    <option value="Carte de crédit">Carte de crédit</option>
                    <option value="PayPal">PayPal</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Items</Form.Label>
              <Form.Control as="textarea" size="lg" rows={4} name="itemsJson" value={newOrderData.itemsJson} onChange={handleCreateChange} className="bg-light font-monospace" placeholder='Ex: [{"name":"Produit","quantity":1,"price":9.99}]' required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adresse de livraison</Form.Label>
              <Form.Control type="text" size="lg" name="shippingAddress" placeholder="Adresse complète" value={newOrderData.shippingAddress} onChange={handleCreateChange} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-end bg-white">
          <Button variant="outline-secondary" onClick={() => setShowCreateModal(false)}>Annuler</Button>
          <Button variant="success" onClick={submitNewOrder} className="ms-2">
            <i className="icofont-check-circle me-1"></i>Créer
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}
