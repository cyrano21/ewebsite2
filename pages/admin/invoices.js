import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Nav, Tab, Alert, Badge } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import { useRouter } from 'next/router';

export default function InvoicesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);

  // Données factices pour l'exemple
  useEffect(() => {
    // Simuler un chargement des données
    const timer = setTimeout(() => {
      try {
        // Données factices pour le prototype
        const mockInvoices = [
          { 
            id: 'FLR978282', 
            orderId: 'A-8934792734', 
            customerName: 'John Doe',
            date: '19/06/2023',
            amount: '1009.97 €',
            status: 'payée',
            items: 3
          },
          { 
            id: 'FLR978283', 
            orderId: 'A-8934792735', 
            customerName: 'Jane Smith',
            date: '20/06/2023',
            amount: '549.98 €',
            status: 'en attente',
            items: 2
          },
          { 
            id: 'FLR978284', 
            orderId: 'A-8934792736', 
            customerName: 'Robert Johnson',
            date: '21/06/2023',
            amount: '129.99 €',
            status: 'payée',
            items: 1
          },
          { 
            id: 'FLR978285', 
            orderId: 'A-8934792737', 
            customerName: 'Maria Garcia',
            date: '22/06/2023',
            amount: '799.97 €',
            status: 'annulée',
            items: 3
          },
          { 
            id: 'FLR978286', 
            orderId: 'A-8934792738', 
            customerName: 'Michael Brown',
            date: '23/06/2023',
            amount: '459.98 €',
            status: 'payée',
            items: 2
          }
        ];
        
        setInvoices(mockInvoices);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des factures: ' + err.message);
        setLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filtrer les factures en fonction de l'onglet actif et du terme de recherche
  const filteredInvoices = invoices.filter(invoice => {
    // Filtre par statut
    if (activeTab !== 'all' && invoice.status !== activeTab) {
      return false;
    }
    
    // Filtre par terme de recherche
    if (searchTerm && !Object.values(invoice).some(
      value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });
  
  // Fonction pour récupérer la couleur du badge de statut
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'payée':
        return 'success';
      case 'en attente':
        return 'warning';
      case 'annulée':
        return 'danger';
      default:
        return 'secondary';
    }
  };
  
  // Gestionnaire de recherche
  const handleSearch = (e) => {
    e.preventDefault();
    // La recherche est déjà gérée par le filtrage réactif
  };
  
  // Accéder à la page de facture client
  const viewInvoice = (invoiceId) => {
    router.push(`/customer/Invoice?id=${invoiceId}`);
  };

  return (
    <AdminLayout>
      <PageHeader title="Gestion des factures" curPage="Factures" />
      
      <Container fluid className="py-4">
        {/* En-tête avec filtres et recherche */}
        <Row className="mb-3 align-items-center">
          <Col lg={6} className="mb-3 mb-lg-0">
            <h2 className="mb-0">Factures</h2>
            <p className="text-muted">Consultez et gérez toutes les factures</p>
          </Col>
          <Col lg={6}>
            <Form onSubmit={handleSearch}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Rechercher une facture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  <i className="icofont-search-1"></i>
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
        
        {error && (
          <Alert variant="danger" className="mb-4">
            <i className="icofont-warning-alt me-2"></i>
            {error}
          </Alert>
        )}
        
        {/* Onglets de filtrage */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Tab.Container id="invoice-tabs" activeKey={activeTab} onSelect={setActiveTab}>
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="all">
                    Toutes <Badge bg="secondary" className="ms-1">{invoices.length}</Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="payée">
                    Payées <Badge bg="success" className="ms-1">{invoices.filter(inv => inv.status === 'payée').length}</Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="en attente">
                    En attente <Badge bg="warning" className="ms-1">{invoices.filter(inv => inv.status === 'en attente').length}</Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="annulée">
                    Annulées <Badge bg="danger" className="ms-1">{invoices.filter(inv => inv.status === 'annulée').length}</Badge>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              
              <Tab.Content>
                <Tab.Pane eventKey={activeTab}>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                      </div>
                      <p className="mt-2">Chargement des factures...</p>
                    </div>
                  ) : filteredInvoices.length > 0 ? (
                    <Table responsive hover className="align-middle">
                      <thead>
                        <tr>
                          <th>N° Facture</th>
                          <th>N° Commande</th>
                          <th>Client</th>
                          <th>Date</th>
                          <th>Montant</th>
                          <th>Articles</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvoices.map((invoice) => (
                          <tr key={invoice.id}>
                            <td><strong>{invoice.id}</strong></td>
                            <td>{invoice.orderId}</td>
                            <td>{invoice.customerName}</td>
                            <td>{invoice.date}</td>
                            <td>{invoice.amount}</td>
                            <td>{invoice.items}</td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => viewInvoice(invoice.id)}
                              >
                                <i className="icofont-eye-alt"></i>
                              </Button>
                              <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => window.open(`/customer/Invoice?id=${invoice.id}`, '_blank')}
                              >
                                <i className="icofont-print"></i>
                              </Button>
                              <Button 
                                variant="outline-success" 
                                size="sm"
                                disabled={invoice.status === 'payée'}
                              >
                                <i className="icofont-check-circled"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">
                      <i className="icofont-paper fs-1 text-muted"></i>
                      <p className="mt-2">Aucune facture trouvée</p>
                    </div>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
        
        {/* Statistiques des factures */}
        <Row className="mb-4 gx-3 gy-4">
          <Col md={3} sm={6}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total des factures</h6>
                    <h3 className="fw-bold">{invoices.length}</h3>
                  </div>
                  <div className="icon-box bg-light rounded p-3">
                    <i className="icofont-paper fs-4 text-primary"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Factures payées</h6>
                    <h3 className="fw-bold">{invoices.filter(inv => inv.status === 'payée').length}</h3>
                  </div>
                  <div className="icon-box bg-light rounded p-3">
                    <i className="icofont-check-circled fs-4 text-success"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">En attente</h6>
                    <h3 className="fw-bold">{invoices.filter(inv => inv.status === 'en attente').length}</h3>
                  </div>
                  <div className="icon-box bg-light rounded p-3">
                    <i className="icofont-clock-time fs-4 text-warning"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Annulées</h6>
                    <h3 className="fw-bold">{invoices.filter(inv => inv.status === 'annulée').length}</h3>
                  </div>
                  <div className="icon-box bg-light rounded p-3">
                    <i className="icofont-close-circled fs-4 text-danger"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Actions rapides */}
        <Card className="shadow-sm">
          <Card.Header className="bg-white">
            <h5 className="mb-0">Actions rapides</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4} className="mb-3 mb-md-0">
                <Button variant="outline-primary" className="w-100">
                  <i className="icofont-plus me-2"></i>
                  Créer une facture
                </Button>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Button variant="outline-success" className="w-100">
                  <i className="icofont-download me-2"></i>
                  Exporter toutes les factures
                </Button>
              </Col>
              <Col md={4}>
                <Button variant="outline-secondary" className="w-100">
                  <i className="icofont-settings me-2"></i>
                  Paramètres de facturation
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </AdminLayout>
  );
}