
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, InputGroup, Spinner, Alert, Pagination, Dropdown } from 'react-bootstrap';
import SellerLayout from '../../components/seller/SellerLayout';
import Link from 'next/link';

const SellerOrders = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    // Vérifier l'authentification et le statut de vendeur
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/seller/orders');
      return;
    }

    if (session && session.user && session.user.sellerStatus !== 'approved') {
      router.push('/seller/dashboard');
      return;
    }

    // Charger les commandes
    fetchOrders();
  }, [session, status, currentPage, filter, sortBy, sortOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: ordersPerPage,
        filter,
        sort: sortBy,
        order: sortOrder,
        search: searchTerm
      });

      const response = await fetch(`/api/seller/orders?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data.orders);
        setTotalPages(data.data.totalPages);
      } else {
        setError(data.message || 'Erreur lors du chargement des commandes');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/seller/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour l'état local des commandes
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        setError(data.message || 'Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir la variante de badge en fonction du statut
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'refunded':
        return 'secondary';
      default:
        return 'light';
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Pagination
  const renderPagination = () => {
    const pages = [];
    
    // Première page
    pages.push(
      <Pagination.Item 
        key="first" 
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );
    
    // Ellipsis si nécessaire
    if (currentPage > 3) {
      pages.push(<Pagination.Ellipsis key="ellipsis1" />);
    }
    
    // Pages autour de la page courante
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        pages.push(
          <Pagination.Item 
            key={i} 
            active={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }
    
    // Ellipsis si nécessaire
    if (currentPage < totalPages - 2) {
      pages.push(<Pagination.Ellipsis key="ellipsis2" />);
    }
    
    // Dernière page si plus d'une page
    if (totalPages > 1) {
      pages.push(
        <Pagination.Item 
          key="last" 
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    return (
      <Pagination>
        <Pagination.Prev 
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Next 
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  // État de chargement pendant la vérification de la session
  if (status === 'loading') {
    return (
      <SellerLayout title="Commandes">
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </Container>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title="Gestion des Commandes">
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="mb-0">Gestion des Commandes</h2>
            <p className="text-muted">Suivez et gérez les commandes de vos clients</p>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white py-3">
            <Row className="align-items-center">
              <Col md={4}>
                <Form onSubmit={handleSearch}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Rechercher une commande..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-secondary" type="submit">
                      <i className="icofont-search"></i>
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
              <Col md={8}>
                <div className="d-flex justify-content-md-end mt-3 mt-md-0">
                  <Form.Select 
                    className="me-2" 
                    style={{ width: 'auto' }}
                    value={filter}
                    onChange={handleFilterChange}
                  >
                    <option value="all">Toutes les commandes</option>
                    <option value="pending">En attente</option>
                    <option value="processing">En traitement</option>
                    <option value="shipped">Expédiées</option>
                    <option value="delivered">Livrées</option>
                    <option value="cancelled">Annulées</option>
                  </Form.Select>
                  <div className="d-flex align-items-center">
                    <Form.Select 
                      style={{ width: 'auto' }}
                      value={sortBy}
                      onChange={handleSortChange}
                    >
                      <option value="createdAt">Date de commande</option>
                      <option value="totalAmount">Montant</option>
                      <option value="customerName">Client</option>
                    </Form.Select>
                    <Button 
                      variant="link" 
                      className="p-0 ms-2"
                      onClick={handleSortOrderToggle}
                    >
                      <i className={`icofont-arrow-${sortOrder === 'asc' ? 'up' : 'down'} fs-5`}></i>
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </Spinner>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5">
                <i className="icofont-shopping-cart fs-1 text-muted"></i>
                <p className="mt-3 text-muted">Aucune commande trouvée</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID Commande</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th>Produits</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="fw-medium">#{order.orderNumber || order._id.substring(0, 8)}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle p-2 me-2">
                              <i className="icofont-user"></i>
                            </div>
                            <div>
                              <p className="mb-0 fw-medium">{order.customerName}</p>
                              <small className="text-muted">{order.customerEmail}</small>
                            </div>
                          </div>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{order.itemCount} articles</td>
                        <td className="fw-medium">{order.totalAmount.toLocaleString()} €</td>
                        <td>
                          <Badge bg={getStatusBadge(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex">
                            <Link href={`/seller/orders/${order._id}`} passHref legacyBehavior>
                              <Button variant="outline-primary" size="sm" className="me-2">
                                <i className="icofont-eye me-1"></i> Détails
                              </Button>
                            </Link>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm" id={`dropdown-${order._id}`}>
                                Statut
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => updateOrderStatus(order._id, 'processing')}>
                                  <Badge bg="info" className="me-2">En traitement</Badge>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => updateOrderStatus(order._id, 'shipped')}>
                                  <Badge bg="primary" className="me-2">Expédiée</Badge>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => updateOrderStatus(order._id, 'delivered')}>
                                  <Badge bg="success" className="me-2">Livrée</Badge>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => updateOrderStatus(order._id, 'cancelled')}>
                                  <Badge bg="danger" className="me-2">Annulée</Badge>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
          {!loading && orders.length > 0 && (
            <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
              <div>
                Affichage de {orders.length} sur {Math.min(ordersPerPage, orders.length)} commandes
              </div>
              <div className="d-flex align-items-center">
                {renderPagination()}
              </div>
            </Card.Footer>
          )}
        </Card>
      </Container>
    </SellerLayout>
  );
};

export default SellerOrders;
