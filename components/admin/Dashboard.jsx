"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, ProgressBar } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import axios from 'axios';
import { useNotifications, NOTIFICATION_TYPES } from '../../contexts/NotificationContext';

const AdminDashboard = () => {
  const { addNotification } = useNotifications();

  // États pour les données dynamiques
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    outOfStockProducts: 0
  });

  const [popularProducts, setPopularProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [cartOrders, setCartOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Données pour les graphiques - on les initialisera avec des données réelles
  const [pieData, setPieData] = useState({
    labels: ['Chargement...'],
    datasets: [
      {
        data: [100],
        backgroundColor: ['rgba(200, 200, 200, 0.7)'],
        borderColor: ['rgba(200, 200, 200, 1)'],
        borderWidth: 1,
      },
    ],
  });

  const [barData, setBarData] = useState({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Ventes mensuelles',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  });

  // Options pour le graphique en barres
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventes mensuelles (2025)',
      },
    },
  };

  // Récupérer les données statistiques
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Récupérer les statistiques générales
        const statsPromise = axios.get('/api/admin/stats');

        // Récupérer les produits populaires
        const popularProductsPromise = axios.get('/api/products/best-selling');

        // Récupérer les commandes récentes
        const recentOrdersPromise = axios.get('/api/orders?limit=5&sort=-createdAt');

        // Récupérer les données pour les graphiques
        const categoryStatsPromise = axios.get('/api/admin/category-stats');
        const monthlySalesPromise = axios.get('/api/admin/monthly-sales');

        // Attendre toutes les requêtes
        const [
          statsResponse, 
          popularProductsResponse, 
          recentOrdersResponse,
          categoryStatsResponse,
          monthlySalesResponse
        ] = await Promise.all([
          statsPromise,
          popularProductsPromise,
          recentOrdersPromise,
          categoryStatsPromise,
          monthlySalesPromise
        ]).catch(error => {
          console.error("Erreur lors de la récupération des données:", error);
          addNotification(`Impossible de charger les données du tableau de bord: ${error.message}`, NOTIFICATION_TYPES.ERROR);
          throw error;
        });

        // Mettre à jour les statistiques
        if (statsResponse?.data) {
          setStats({
            totalOrders: statsResponse.data.totalOrders || 0,
            totalProducts: statsResponse.data.totalProducts || 0,
            totalCustomers: statsResponse.data.totalCustomers || 0,
            totalRevenue: statsResponse.data.totalRevenue || 0,
            pendingOrders: statsResponse.data.pendingOrders || 0,
            outOfStockProducts: statsResponse.data.outOfStockProducts || 0
          });
        }

        // Mettre à jour les produits populaires
        if (popularProductsResponse?.data) {
          setPopularProducts(popularProductsResponse.data.slice(0, 5));
        }

        // Mettre à jour les commandes récentes
        if (recentOrdersResponse?.data) {
          // Vérifier si l'API renvoie un tableau ou un objet avec une propriété 'orders'
          const ordersArray = Array.isArray(recentOrdersResponse.data) 
            ? recentOrdersResponse.data 
            : (recentOrdersResponse.data.orders || []);

          setRecentOrders(ordersArray.map(order => ({
            id: order._id,
            customer: order.user?.name || 'Client anonyme',
            date: new Date(order.createdAt).toLocaleDateString('fr-FR'),
            amount: `${(order.totalAmount || order.total || 0).toFixed(2)} €`,
            status: order.status
          })));
        }

        // Mettre à jour les données du graphique en camembert
        if (categoryStatsResponse?.data) {
          setPieData({
            labels: categoryStatsResponse.data.map(cat => cat.name),
            datasets: [
              {
                data: categoryStatsResponse.data.map(cat => cat.salesPercentage),
                backgroundColor: [
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                  'rgba(153, 102, 255, 0.7)',
                  'rgba(255, 159, 64, 0.7)',
                  'rgba(199, 199, 199, 0.7)',
                  'rgba(83, 102, 255, 0.7)',
                  'rgba(78, 52, 199, 0.7)',
                  'rgba(173, 216, 230, 0.7)',
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(199, 199, 199, 1)',
                  'rgba(83, 102, 255, 1)',
                  'rgba(78, 52, 199, 1)',
                  'rgba(173, 216, 230, 1)',
                ],
                borderWidth: 1,
              },
            ],
          });
        }

        // Mettre à jour les données du graphique en barres
        if (monthlySalesResponse?.data) {
          setBarData({
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: [
              {
                label: 'Ventes mensuelles',
                data: monthlySalesResponse.data.monthlySales,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          });
        }

        // Récupérer les articles du panier
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Si des articles sont présents dans le panier
        if (cartItems.length > 0) {
          const totalAmount = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
          }, 0);

          const newCartOrder = {
            id: '#PANIER-ACTIF',
            customer: 'Client actuel',
            date: new Date().toLocaleDateString('fr-FR'),
            amount: `${totalAmount.toFixed(2)} €`,
            status: 'En attente',
            isCart: true,
            items: cartItems
          };

          setCartOrders([newCartOrder]);
        }

      } catch (err) {
        console.error("Erreur de chargement des données:", err);
        setError("Impossible de charger les données du tableau de bord. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [addNotification]);

  // Fonction pour obtenir la couleur selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'Livré': return 'success';
      case 'En cours': return 'primary';
      case 'En attente': return 'warning';
      case 'Annulé': return 'danger';
      default: return 'secondary';
    }
  };

  // Fonction pour naviguer vers les détails de la commande du panier
  const handleViewCartOrder = () => {
    // Rediriger vers la page de gestion des commandes
    window.location.href = '/admin/orders';
  };

  // Fonction pour calculer le pourcentage de stock
  const calculateStockPercentage = (current, max = 100) => {
    return Math.min(100, Math.max(0, (current / max) * 100));
  };

  // Fonction pour déterminer la couleur de la barre de progression du stock
  const getStockBarVariant = (percentage) => {
    if (percentage < 20) return 'danger';
    if (percentage < 50) return 'warning';
    return 'success';
  };

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div>
        <PageHeader title="Tableau de bord administrateur" curPage="Admin" />
        <Container className="py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement des données du tableau de bord...</p>
        </Container>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div>
        <PageHeader title="Tableau de bord administrateur" curPage="Admin" />
        <Container className="py-5">
          <div className="alert alert-danger" role="alert">
            <i className="icofont-warning-alt me-2"></i>
            {error}
          </div>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Tableau de bord administrateur" curPage="Admin" />

      <Container fluid className="py-4">
        {/* Statistiques principales */}
        <Row className="mb-4 gx-3 gy-4"> {/* Modification ici */}
          <Col lg={3} md={6} sm={12} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Commandes totales</h6>
                    <h3 className="fw-bold">{stats.totalOrders}</h3>
                  </div>
                  <div className="icon-box bg-light rounded p-3">
                    <i className="icofont-shopping-cart fs-4 text-primary"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} sm={12} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Produits</h6>
                    <h3 className="fw-bold">{stats.totalProducts}</h3>
                  </div>
                  <div className="icon-box bg-light rounded p-3">
                    <i className="icofont-box fs-4 text-success"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} sm={12} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Clients</h6>
                    <h3 className="fw-bold">{stats.totalCustomers}</h3>
                  </div>
                  <div className="icon-box bg-light rounded p-3">
                    <i className="icofont-users-alt-4 fs-4 text-info"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} sm={12} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Revenu total</h6>
                    <h3 className="fw-bold">{stats.totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</h3>
                  </div>
                  <div className="icon-box bg-light rounded p-3">
                    <i className="icofont-money fs-4 text-warning"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Nouveau widget: Statistiques et graphiques */}
        <Row className="mb-4">
          <Col lg={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <h6 className="mb-0">Catégories populaires</h6>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '250px' }} className="d-flex justify-content-center align-items-center">
                  <div className="text-center">
                    <i className="bi bi-pie-chart-fill fs-2 text-muted mb-3"></i>
                    <p>Graphique temporairement indisponible</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <h6 className="mb-0">Ventes mensuelles</h6>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '250px' }} className="d-flex justify-content-center align-items-center">
                  <div className="text-center">
                    <i className="bi bi-bar-chart-fill fs-2 text-muted mb-3"></i>
                    <p>Graphique temporairement indisponible</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Widget des produits populaires */}
        <Row className="mb-4 gx-3 gy-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Produits les plus populaires</h5>
                <Button variant="outline-primary" size="sm" as={Link} href="/admin/products">Voir tous les produits</Button>
              </Card.Header>
              <Card.Body>
                {popularProducts.length > 0 ? (
                  <Table responsive hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Catégorie</th>
                        <th>Prix</th>
                        <th>Ventes</th>
                        <th>Stock</th>
                        <th>Évaluation</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popularProducts.map((product) => (
                        <tr key={product.id || product._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="product-icon bg-light rounded p-2 me-2">
                                <i className="icofont-box text-primary"></i>
                              </div>
                              <span>{product.name}</span>
                            </div>
                          </td>
                          <td>{product.category}</td>
                          <td>{product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                          <td>
                            <span className="badge bg-success">{product.sales || product.ratingsCount || 0}</span>
                          </td>
                          <td style={{ width: '150px' }}>
                            <div className="d-flex align-items-center">
                              <span className="me-2" style={{ minWidth: '30px' }}>{product.stock}</span>
                              <ProgressBar 
                                now={calculateStockPercentage(product.stock)} 
                                variant={getStockBarVariant(calculateStockPercentage(product.stock))}
                                style={{ width: '100%', height: '8px' }} 
                              />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="me-2">{product.ratings || 0}</span>
                              <div className="rating-stars">
                                {[...Array(5)].map((_, index) => (
                                  <i 
                                    key={index} 
                                    className={`icofont-star ${index < Math.floor(product.ratings || 0) ? 'text-warning' : 'text-muted'}`}
                                    style={{ fontSize: '14px' }}
                                  ></i>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-2" as={Link} href={`/admin/products/edit/${product.id || product._id}`}>
                              <i className="icofont-ui-edit"></i>
                            </Button>
                            <Button variant="outline-info" size="sm" as={Link} href={`/shop/product/${product.id || product._id}`}>
                              <i className="icofont-eye-alt"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">Aucun produit populaire trouvé</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alertes */}
        <Row className="mb-4 gx-3 gy-4">
          <Col md={6} className="mb-4">
            <Card className="border-warning h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Commandes en attente</h5>
                  <span className="badge bg-warning">{stats.pendingOrders}</span>
                </div>
                <p className="text-muted">Vous avez {stats.pendingOrders} commandes en attente de traitement.</p>
                <Button variant="outline-warning" size="sm" as={Link} href="/admin/orders">Voir les commandes</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="border-danger h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Produits en rupture</h5>
                  <span className="badge bg-danger">{stats.outOfStockProducts}</span>
                </div>
                <p className="text-muted">{stats.outOfStockProducts} produits sont actuellement en rupture de stock.</p>
                <Button variant="outline-danger" size="sm" as={Link} href="/admin/products">Gérer le stock</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Commandes récentes */}
        <Row className="mb-4 gx-3 gy-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Commandes récentes</h5>
                <Button variant="outline-primary" size="sm" as={Link} href="/admin/orders">Voir toutes</Button>
              </Card.Header>
              <Card.Body>
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th>N° Commande</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Afficher d'abord les commandes du panier avec un style distinct */}
                    {cartOrders.map((order, index) => (
                      <tr key={`cart-${index}`} className="table-warning">
                        <td>
                          <strong>{order.id}</strong>
                          <span className="badge bg-info ms-2">Panier</span>
                        </td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td>{order.amount}</td>
                        <td>
                          <span className={`badge bg-${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <Button variant="link" size="sm" className="p-0 me-2" onClick={handleViewCartOrder}>
                            <i className="icofont-eye-alt text-primary"></i>
                          </Button>
                          <Button variant="link" size="sm" className="p-0" as={Link} href="/admin/orders">
                            <i className="icofont-ui-edit text-success"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {/* Afficher ensuite les commandes régulières */}
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order, index) => (
                        <tr key={index}>
                          <td>{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.date}</td>
                          <td>{order.amount}</td>
                          <td>
                            <span className={`badge bg-${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <Button variant="link" size="sm" className="p-0 me-2" as={Link} href={`/admin/orders/${order.id}`}>
                              <i className="icofont-eye-alt text-primary"></i>
                            </Button>
                            <Button variant="link" size="sm" className="p-0" as={Link} href={`/admin/orders/edit/${order.id}`}>
                              <i className="icofont-ui-edit text-success"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-3">
                          <p className="text-muted mb-0">Aucune commande récente</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Navigation rapide */}
        <Row className="gx-3 gy-4">
          <Col>
            <h5 className="mb-4">Gestion rapide</h5>
          </Col>
        </Row>
        <Row className="mb-4 gx-3 gy-4">
          <Col md={3} sm={6} className="mb-4">
            <Card className="text-center shadow-sm h-100">
              <Card.Body>
                <div className="icon-box bg-light rounded-circle mx-auto mb-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <i className="icofont-box fs-4 text-primary"></i>
                </div>
                <h5>Produits</h5>
                <p className="text-muted small">Gérer les produits, catégories et stocks</p>
                <Button variant="primary" size="sm" onClick={() => router.push('/admin/products')}>Accéder</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} className="mb-4">
            <Card className="text-center shadow-sm h-100">
              <Card.Body>
                <div className="icon-box bg-light rounded-circle mx-auto mb-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <i className="icofont-users-alt-4 fs-4 text-success"></i>
                </div>
                <h5>Clients</h5>
                <p className="text-muted small">Gérer les comptes clients et leurs informations</p>
                <Button variant="success" size="sm" onClick={() => router.push('/admin/customers')}>Accéder</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} className="mb-4">
            <Card className="text-center shadow-sm h-100">
              <Card.Body>
                <div className="icon-box bg-light rounded-circle mx-auto mb-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <i className="icofont-chart-bar-graph fs-4 text-info"></i>
                </div>
                <h5>Rapports</h5>
                <p className="text-muted small">Consulter les rapports de ventes et statistiques</p>
                <Button variant="info" size="sm" onClick={() => router.push('/admin/reports')}>Accéder</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} className="mb-4">
            <Card className="text-center shadow-sm h-100 border-primary">
              <Card.Body>
                <div className="icon-box bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <i className="icofont-eye-alt fs-4 text-primary"></i>
                </div>
                <h5>Moniteur d'activité</h5>
                <p className="text-muted small">Surveillez toutes les activités de la plateforme en temps réel</p>
                <Button variant="primary" size="sm" onClick={() => router.push('/admin/activity-monitor')}>Accéder</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} className="mb-4">
            <Card className="text-center shadow-sm h-100">
              <Card.Body>
                <div className="icon-box bg-light rounded-circle mx-auto mb-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <i className="icofont-gear fs-4 text-warning"></i>
                </div>
                <h5>Paramètres</h5>
                <p className="text-muted small">Configuration du site et options générales</p>
                <Button variant="warning" size="sm" onClick={() => router.push('/admin/settings')}>Accéder</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;