import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Pagination, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import productsData from '../../products.json'; // Import des données de produits

const OrderManagement = () => {
  // États pour gérer les commandes et la pagination
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [cartOrders, setCartOrders] = useState([]);

  // Données factices pour démonstration
  const orderData = [
    { 
      id: 'ORD-1234', 
      customer: 'Jean Dupont', 
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
      email: 'pierre.martin@example.com',
      date: '17/04/2025', 
      amount: 249.99, 
      status: 'En attente',
      paymentMethod: 'Virement bancaire',
      items: [
        { name: 'iPhone 12', quantity: 1, price: 249.99 }
      ],
      address: {
        street: '67 Boulevard Victor Hugo',
        city: 'Marseille',
        zipCode: '13000',
        country: 'France'
      }
    },
    { 
      id: 'ORD-1237', 
      customer: 'Sophie Petit', 
      email: 'sophie.petit@example.com',
      date: '17/04/2025', 
      amount: 59.95, 
      status: 'Livré',
      paymentMethod: 'Carte de crédit',
      items: [
        { name: 'Casual Sneakers', quantity: 1, price: 59.95 }
      ],
      address: {
        street: '12 Rue de la République',
        city: 'Lille',
        zipCode: '59000',
        country: 'France'
      }
    },
    { 
      id: 'ORD-1238', 
      customer: 'Luc Richard', 
      email: 'luc.richard@example.com',
      date: '16/04/2025', 
      amount: 199.00, 
      status: 'Annulé',
      paymentMethod: 'Carte de crédit',
      items: [
        { name: 'Outdoor Sports Shoes', quantity: 1, price: 79.99 },
        { name: 'COSRX Snail Mucin', quantity: 2, price: 59.98 }
      ],
      address: {
        street: '34 Avenue Foch',
        city: 'Bordeaux',
        zipCode: '33000',
        country: 'France'
      }
    },
    { 
      id: 'ORD-1239', 
      customer: 'Nathalie Leroy', 
      email: 'nathalie.leroy@example.com',
      date: '15/04/2025', 
      amount: 358.50, 
      status: 'Livré',
      paymentMethod: 'PayPal',
      items: [
        { name: 'Look Less Chanel Bag', quantity: 1, price: 259.00 },
        { name: 'L\'Oréal Paris Revitalift', quantity: 2, price: 49.98 },
        { name: 'COSRX Snail Mucin', quantity: 1, price: 19.99 }
      ],
      address: {
        street: '78 Rue Gambetta',
        city: 'Toulouse',
        zipCode: '31000',
        country: 'France'
      }
    },
    { 
      id: 'ORD-1240', 
      customer: 'Éric Bernard', 
      email: 'eric.bernard@example.com',
      date: '14/04/2025', 
      amount: 129.99, 
      status: 'Remboursé',
      paymentMethod: 'Carte de crédit',
      items: [
        { name: 'Adidas Running Shoes', quantity: 1, price: 129.99 }
      ],
      address: {
        street: '56 Place Bellecour',
        city: 'Lyon',
        zipCode: '69002',
        country: 'France'
      }
    },
  ];

  const statusOptions = ['All', 'En attente', 'En cours', 'Livré', 'Annulé', 'Remboursé'];

  // Charger les données des commandes et les commandes du panier
  useEffect(() => {
    // Charger les commandes de démonstration
    setOrders(orderData);
    
    // Charger les commandes du panier depuis localStorage
    try {
      // Récupérer les données du panier
      const cartData = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Si le panier n'est pas vide, créer une commande pour l'administration
      if (cartData.length > 0) {
        // Calculer le montant total
        const totalAmount = cartData.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Formater la date actuelle
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        // Créer un objet de commande à partir du panier
        const cartOrder = {
          id: `CART-${Date.now().toString().slice(-4)}`,
          customer: 'Client de la boutique',
          email: 'client@example.com',
          date: formattedDate,
          amount: totalAmount,
          status: 'En attente',
          paymentMethod: 'En attente',
          items: cartData.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          address: {
            street: 'Adresse non spécifiée',
            city: 'Ville non spécifiée',
            zipCode: '00000',
            country: 'France'
          },
          fromCart: true // Marquer cette commande comme provenant du panier
        };
        
        // Ajouter cette commande à notre état local
        setCartOrders([cartOrder]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données du panier:", error);
    }
  }, []);

  // Combiner les commandes de démonstration et celles du panier
  const allOrders = [...orders, ...cartOrders];

  // Filtrer les commandes
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Logique de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Gestionnaires d'événements
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const openOrderDetails = (order) => {
    setCurrentOrder(order);
    setShowModal(true);
  };

  const closeOrderDetails = () => {
    setShowModal(false);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    // Dans une application réelle, cela enverrait une requête à votre API
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    // Mettre à jour également les commandes du panier si nécessaire
    setCartOrders(cartOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({ ...currentOrder, status: newStatus });
    }
  };

  // Fonction pour obtenir la couleur selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'Livré': return 'success';
      case 'En cours': return 'primary';
      case 'En attente': return 'warning';
      case 'Annulé': return 'danger';
      case 'Remboursé': return 'secondary';
      default: return 'secondary';
    }
  };

  // Fonction pour voir les détails d'un produit dans l'interface d'administration
  const viewProductInAdmin = (productName) => {
    // Trouver le produit correspondant dans les données de produits
    const product = productsData.find(p => p.name.toLowerCase() === productName.toLowerCase());
    
    if (product) {
      // Rediriger vers la page de gestion des produits avec l'ID du produit
      window.open(`/admin/products?edit=${product.id}`, '_blank');
    } else {
      alert(`Produit "${productName}" non trouvé dans la base de données.`);
    }
  };

  return (
    <div>
      <PageHeader title="Gestion des Commandes" curPage="Admin / Commandes" />
      
      <Container fluid className="py-4">
        {/* Entête */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={6} className="mb-3 mb-md-0">
                <h5 className="mb-0">Liste des Commandes ({filteredOrders.length})</h5>
              </Col>
              <Col md={6}>
                <div className="d-flex justify-content-md-end">
                  <Button variant="outline-secondary">
                    <i className="icofont-download me-1"></i> Exporter
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        {/* Filtres et recherche */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={6} lg={4} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="icofont-search-1"></i>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Rechercher par ID ou client..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </Col>
              <Col md={6} lg={3} className="mb-3">
                <Form.Select 
                  value={selectedStatus} 
                  onChange={handleStatusChange}
                >
                  {statusOptions.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={5} className="mb-3">
                <div className="d-flex align-items-center justify-content-lg-end">
                  <span className="text-muted">
                    Affichage de {filteredOrders.length > 0 ? indexOfFirstItem + 1 : 0} à {Math.min(indexOfLastItem, filteredOrders.length)} sur {filteredOrders.length} commandes
                  </span>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        {/* Liste des commandes */}
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-3">N° Commande</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((order) => (
                    <tr key={order.id} className={order.fromCart ? 'bg-light-warning' : ''}>
                      <td className="ps-3">
                        {order.id}
                        {order.fromCart && <Badge bg="info" className="ms-2">Nouveau</Badge>}
                      </td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                      <td>
                        <Badge bg={getStatusColor(order.status)} className="rounded-pill">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="text-end pe-3">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => openOrderDetails(order)}
                        >
                          <i className="icofont-eye-alt me-1"></i> Détails
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Aucune commande trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
          
          {/* Pagination */}
          {filteredOrders.length > itemsPerPage && (
            <Card.Footer className="bg-white">
              <div className="d-flex justify-content-center">
                <Pagination>
                  <Pagination.Prev 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item 
                      key={i + 1} 
                      active={i + 1 === currentPage}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  
                  <Pagination.Next 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            </Card.Footer>
          )}
        </Card>
      </Container>
      
      {/* Modal détails de commande */}
      <Modal show={showModal} onHide={closeOrderDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Détails de la commande {currentOrder?.id}
            {currentOrder?.fromCart && <Badge bg="info" className="ms-2">Commande de la boutique</Badge>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scrollable">
          {currentOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="text-muted mb-2">Informations client</h6>
                  <p className="mb-1"><strong>Nom:</strong> {currentOrder.customer}</p>
                  <p className="mb-1"><strong>Email:</strong> {currentOrder.email}</p>
                  <p className="mb-1">
                    <strong>Adresse:</strong> {currentOrder.address.street}, {currentOrder.address.zipCode} {currentOrder.address.city}, {currentOrder.address.country}
                  </p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted mb-2">Informations commande</h6>
                  <p className="mb-1"><strong>Date:</strong> {currentOrder.date}</p>
                  <p className="mb-1"><strong>Méthode de paiement:</strong> {currentOrder.paymentMethod}</p>
                  <p className="mb-1">
                    <strong>Statut:</strong> 
                    <Badge bg={getStatusColor(currentOrder.status)} className="ms-2">
                      {currentOrder.status}
                    </Badge>
                  </p>
                </Col>
              </Row>
              
              <h6 className="text-muted mb-3">Articles commandés</h6>
              <Table responsive bordered className="mb-4">
                <thead className="bg-light">
                  <tr>
                    <th>Produit</th>
                    <th className="text-center">Quantité</th>
                    <th className="text-end">Prix unitaire</th>
                    <th className="text-end">Total</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">{item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                      <td className="text-end">{(item.price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                      <td className="text-center">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => viewProductInAdmin(item.name)}
                        >
                          <i className="icofont-edit me-1"></i> Gérer
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr className="fw-bold">
                    <td colSpan="3" className="text-end">Total</td>
                    <td className="text-end">{currentOrder.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
              
              <h6 className="text-muted mb-3">Mettre à jour le statut</h6>
              <div className="d-flex flex-wrap gap-2">
                {statusOptions.filter(status => status !== 'All' && status !== currentOrder.status).map((status, index) => (
                  <Button 
                    key={index}
                    variant={getStatusColor(status)} 
                    size="sm"
                    onClick={() => handleUpdateStatus(currentOrder.id, status)}
                  >
                    Marquer comme {status}
                  </Button>
                ))}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top">
          <Button variant="secondary" onClick={closeOrderDetails}>
            Fermer
          </Button>
          {currentOrder?.fromCart && (
            <Button 
              variant="success" 
              onClick={() => {
                // Dans une application réelle, vous enverriez ces données à une API
                alert("La commande a été traitée.");
                closeOrderDetails();
                // Supprimer cette commande du panier si nécessaire
                localStorage.removeItem('cart');
                setCartOrders([]);
              }}
            >
              Traiter la commande
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Styles pour corriger les problèmes d'affichage des modals */}
      <style>
        {`
          .modal-body-scrollable {
            max-height: 70vh;
            overflow-y: auto;
          }
          
          .modal-footer {
            position: sticky;
            bottom: 0;
            background-color: white;
            z-index: 10;
          }
          
          /* Style pour mettre en évidence les commandes du panier */
          .bg-light-warning {
            background-color: rgba(255, 193, 7, 0.1);
          }
        `}
      </style>
    </div>
  );
};

export default OrderManagement;