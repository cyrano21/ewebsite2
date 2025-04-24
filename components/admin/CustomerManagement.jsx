import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Pagination, Badge, Modal } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';

const CustomerManagement = () => {
  // États pour gérer les clients et la pagination
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  // Données factices pour démonstration
  const customerData = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '01 23 45 67 89',
      registeredDate: '15/01/2025',
      orders: 7,
      totalSpent: 829.50,
      address: {
        street: '123 Rue de Paris',
        city: 'Paris',
        zipCode: '75001',
        country: 'France'
      },
      status: 'Active'
    },
    {
      id: 2,
      name: 'Marie Dubois',
      email: 'marie.dubois@example.com',
      phone: '01 23 45 67 90',
      registeredDate: '22/02/2025',
      orders: 3,
      totalSpent: 249.99,
      address: {
        street: '45 Avenue des Champs',
        city: 'Lyon',
        zipCode: '69000',
        country: 'France'
      },
      status: 'Active'
    },
    {
      id: 3,
      name: 'Pierre Martin',
      email: 'pierre.martin@example.com',
      phone: '01 23 45 67 91',
      registeredDate: '10/03/2025',
      orders: 5,
      totalSpent: 629.95,
      address: {
        street: '67 Boulevard Victor Hugo',
        city: 'Marseille',
        zipCode: '13000',
        country: 'France'
      },
      status: 'Active'
    },
    {
      id: 4,
      name: 'Sophie Petit',
      email: 'sophie.petit@example.com',
      phone: '01 23 45 67 92',
      registeredDate: '05/02/2025',
      orders: 2,
      totalSpent: 159.90,
      address: {
        street: '12 Rue de la République',
        city: 'Lille',
        zipCode: '59000',
        country: 'France'
      },
      status: 'Active'
    },
    {
      id: 5,
      name: 'Luc Richard',
      email: 'luc.richard@example.com',
      phone: '01 23 45 67 93',
      registeredDate: '18/01/2025',
      orders: 0,
      totalSpent: 0,
      address: {
        street: '34 Avenue Foch',
        city: 'Bordeaux',
        zipCode: '33000',
        country: 'France'
      },
      status: 'Inactive'
    },
    {
      id: 6,
      name: 'Nathalie Leroy',
      email: 'nathalie.leroy@example.com',
      phone: '01 23 45 67 94',
      registeredDate: '14/03/2025',
      orders: 9,
      totalSpent: 1125.75,
      address: {
        street: '78 Rue Gambetta',
        city: 'Toulouse',
        zipCode: '31000',
        country: 'France'
      },
      status: 'Active'
    },
    {
      id: 7,
      name: 'Éric Bernard',
      email: 'eric.bernard@example.com',
      phone: '01 23 45 67 95',
      registeredDate: '02/02/2025',
      orders: 1,
      totalSpent: 129.99,
      address: {
        street: '56 Place Bellecour',
        city: 'Lyon',
        zipCode: '69002',
        country: 'France'
      },
      status: 'Active'
    },
    {
      id: 8,
      name: 'Julie Moreau',
      email: 'julie.moreau@example.com',
      phone: '01 23 45 67 96',
      registeredDate: '10/04/2025',
      orders: 3,
      totalSpent: 289.85,
      address: {
        street: '23 Rue du Commerce',
        city: 'Nantes',
        zipCode: '44000',
        country: 'France'
      },
      status: 'Active'
    },
    {
      id: 9,
      name: 'Thomas Lambert',
      email: 'thomas.lambert@example.com',
      phone: '01 23 45 67 97',
      registeredDate: '25/02/2025',
      orders: 4,
      totalSpent: 379.96,
      address: {
        street: '7 Rue de la Paix',
        city: 'Nice',
        zipCode: '06000',
        country: 'France'
      },
      status: 'Active'
    },
    {
      id: 10,
      name: 'Aurélie Rousseau',
      email: 'aurelie.rousseau@example.com',
      phone: '01 23 45 67 98',
      registeredDate: '17/01/2025',
      orders: 0,
      totalSpent: 0,
      address: {
        street: '42 Avenue Jean Jaurès',
        city: 'Strasbourg',
        zipCode: '67000',
        country: 'France'
      },
      status: 'Inactive'
    }
  ];

  // Charger les données des clients
  useEffect(() => {
    setCustomers(customerData);
  }, []);

  // Filtrer les clients en fonction de la recherche
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logique de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Gestionnaires d'événements
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Revenir à la première page lors d'une nouvelle recherche
  };

  const openCustomerDetails = (customer) => {
    setCurrentCustomer(customer);
    setShowModal(true);
  };

  const closeCustomerDetails = () => {
    setShowModal(false);
  };

  const handleUpdateStatus = (customerId, newStatus) => {
    // Dans une application réelle, cela enverrait une requête à votre API
    setCustomers(customers.map(customer => 
      customer.id === customerId ? { ...customer, status: newStatus } : customer
    ));
    
    if (currentCustomer && currentCustomer.id === customerId) {
      setCurrentCustomer({ ...currentCustomer, status: newStatus });
    }
  };

  return (
    <div>
      <PageHeader title="Gestion des Clients" curPage="Admin / Clients" />
      
      <Container fluid className="py-4">
        {/* Entête */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={6} className="mb-3 mb-md-0">
                <h5 className="mb-0">Liste des Clients</h5>
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
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </Col>
              <Col lg={8} className="mb-3">
                <div className="d-flex align-items-center justify-content-lg-end">
                  <span className="text-muted">
                    Affichage de {filteredCustomers.length > 0 ? indexOfFirstItem + 1 : 0} à {Math.min(indexOfLastItem, filteredCustomers.length)} sur {filteredCustomers.length} clients
                  </span>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        {/* Liste des clients */}
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-3">ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Date d'inscription</th>
                  <th>Commandes</th>
                  <th>Total dépensé</th>
                  <th>Statut</th>
                  <th className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((customer) => (
                    <tr key={customer.id}>
                      <td className="ps-3">{customer.id}</td>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.registeredDate}</td>
                      <td>{customer.orders}</td>
                      <td>{customer.totalSpent.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                      <td>
                        <Badge bg={customer.status === 'Active' ? 'success' : 'secondary'} className="rounded-pill">
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="text-end pe-3">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => openCustomerDetails(customer)}
                        >
                          <i className="icofont-eye-alt me-1"></i> Détails
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Aucun client trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
          
          {/* Pagination */}
          {filteredCustomers.length > itemsPerPage && (
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
      
      {/* Modal détails du client */}
      <Modal show={showModal} onHide={closeCustomerDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails du client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCustomer && (
            <>
              <Row className="mb-4">
                <Col md={12} className="mb-4">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{width: '80px', height: '80px'}}>
                      <i className="icofont-user-alt-7 text-primary" style={{fontSize: '40px'}}></i>
                    </div>
                    <div>
                      <h4 className="mb-1">{currentCustomer.name}</h4>
                      <p className="text-muted mb-0">Client depuis {currentCustomer.registeredDate}</p>
                      <Badge bg={currentCustomer.status === 'Active' ? 'success' : 'secondary'} className="mt-2">
                        {currentCustomer.status}
                      </Badge>
                    </div>
                  </div>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Card className="h-100">
                    <Card.Body>
                      <h6 className="text-muted mb-3">Informations de contact</h6>
                      <p className="mb-2"><strong>Email:</strong> {currentCustomer.email}</p>
                      <p className="mb-2"><strong>Téléphone:</strong> {currentCustomer.phone}</p>
                      <p className="mb-0">
                        <strong>Adresse:</strong> {currentCustomer.address.street}, {currentCustomer.address.zipCode} {currentCustomer.address.city}, {currentCustomer.address.country}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Card className="h-100">
                    <Card.Body>
                      <h6 className="text-muted mb-3">Statistiques client</h6>
                      <p className="mb-2"><strong>Nombre de commandes:</strong> {currentCustomer.orders}</p>
                      <p className="mb-2"><strong>Total dépensé:</strong> {currentCustomer.totalSpent.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                      <p className="mb-0">
                        <strong>Panier moyen:</strong> {
                          currentCustomer.orders > 0 
                            ? (currentCustomer.totalSpent / currentCustomer.orders).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
                            : '0,00 €'
                        }
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <h6 className="text-muted mb-3">Actions</h6>
              <div className="d-flex flex-wrap gap-2">
                <Button 
                  variant={currentCustomer.status === 'Active' ? 'outline-secondary' : 'outline-success'}
                  size="sm"
                  onClick={() => handleUpdateStatus(currentCustomer.id, currentCustomer.status === 'Active' ? 'Inactive' : 'Active')}
                >
                  {currentCustomer.status === 'Active' ? 'Désactiver le compte' : 'Activer le compte'}
                </Button>
                <Button variant="outline-primary" size="sm">
                  <i className="icofont-ui-message me-1"></i> Envoyer un email
                </Button>
                <Button variant="outline-info" size="sm">
                  <i className="icofont-history me-1"></i> Historique des commandes
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCustomerDetails}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
