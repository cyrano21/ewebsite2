
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Tabs, Tab, Badge, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { FaUsers, FaStore, FaEye, FaShoppingCart, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import PageHeader from '../../components/PageHeader';

const ActivityMonitor = () => {
  // États pour gérer les données et les filtres
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [activityFilter, setActivityFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');

  useEffect(() => {
    const fetchActivityData = async () => {
      setIsLoading(true);
      try {
        // Dans une implémentation réelle, vous feriez un appel à l'API
        // /api/admin/activity avec les filtres dateRange, activityFilter et userTypeFilter
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées pour la démo
        const simulatedData = {
          summary: {
            totalUsers: 5823,
            totalSellers: 124,
            totalVisitors: 12458,
            totalOrders: 3569,
            recentRegistrations: 215,
            newSellerApplications: 28,
            pendingReviews: 47,
            pendingOrders: 156,
          },
          userActivity: {
            dates: Array.from({ length: 30 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
            }),
            visitors: Array.from({ length: 30 }, () => Math.floor(Math.random() * 500 + 200)),
            customers: Array.from({ length: 30 }, () => Math.floor(Math.random() * 300 + 100)),
            sellers: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20 + 5)),
          },
          sellerPerformance: [
            { id: 'SEL001', name: 'Boutique Premium', sales: 156, revenue: 12850, products: 32, rating: 4.8 },
            { id: 'SEL002', name: 'Fashion Store', sales: 118, revenue: 9240, products: 45, rating: 4.5 },
            { id: 'SEL003', name: 'Tech World', sales: 143, revenue: 18720, products: 28, rating: 4.7 },
            { id: 'SEL004', name: 'Home Essentials', sales: 98, revenue: 7650, products: 36, rating: 4.2 },
            { id: 'SEL005', name: 'Sports Unlimited', sales: 87, revenue: 6890, products: 29, rating: 4.4 },
          ],
          recentUserActivities: [
            { id: 'ACT001', user: 'Jean Dupont', userType: 'customer', action: 'Achat', details: 'Commande #ORD-12345', date: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString() },
            { id: 'ACT002', user: 'Marie Martin', userType: 'customer', action: 'Inscription', details: 'Nouveau compte', date: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString() },
            { id: 'ACT003', user: 'Tech World', userType: 'seller', action: 'Ajout produit', details: 'Casque Bluetooth XYZ', date: new Date(new Date().setHours(new Date().getHours() - 6)).toISOString() },
            { id: 'ACT004', user: 'Pierre Leblanc', userType: 'customer', action: 'Avis', details: 'Produit #PRD-5678', date: new Date(new Date().setHours(new Date().getHours() - 8)).toISOString() },
            { id: 'ACT005', user: 'Fashion Store', userType: 'seller', action: 'Modification', details: 'Mise à jour prix', date: new Date(new Date().setHours(new Date().getHours() - 10)).toISOString() },
            { id: 'ACT006', user: 'Anonymous', userType: 'visitor', action: 'Consultation', details: 'Page produit #PRD-9012', date: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString() },
            { id: 'ACT007', user: 'Sophie Petit', userType: 'customer', action: 'Panier', details: 'Ajout article', date: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString() },
            { id: 'ACT008', user: 'Home Essentials', userType: 'seller', action: 'Commande', details: 'Préparation #ORD-3456', date: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString() },
            { id: 'ACT009', user: 'Boutique Premium', userType: 'seller', action: 'Promotion', details: 'Création remise 20%', date: new Date(new Date().setHours(new Date().getHours() - 7)).toISOString() },
            { id: 'ACT010', user: 'Lucas Roux', userType: 'customer', action: 'Retour', details: 'Demande #RTN-789', date: new Date(new Date().setHours(new Date().getHours() - 9)).toISOString() },
          ],
          popularProducts: [
            { id: 'PRD001', name: 'Smartphone XYZ Pro', views: 1245, sales: 186, conversionRate: 14.9 },
            { id: 'PRD002', name: 'Écouteurs sans fil', views: 980, sales: 142, conversionRate: 14.5 },
            { id: 'PRD003', name: 'Veste imperméable', views: 875, sales: 98, conversionRate: 11.2 },
            { id: 'PRD004', name: 'Chaussures de course', views: 750, sales: 76, conversionRate: 10.1 },
            { id: 'PRD005', name: 'Sac à dos voyage', views: 680, sales: 58, conversionRate: 8.5 },
          ],
          activityByDevice: [
            { device: 'Mobile', percentage: 65 },
            { device: 'Desktop', percentage: 28 },
            { device: 'Tablet', percentage: 7 }
          ],
          geoData: [
            { country: 'France', visits: 6234, orders: 845 },
            { country: 'États-Unis', visits: 2158, orders: 246 },
            { country: 'Allemagne', visits: 1258, orders: 178 },
            { country: 'Royaume-Uni', visits: 945, orders: 134 },
            { country: 'Canada', visits: 782, orders: 98 }
          ]
        };
        
        setActivityData(simulatedData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données d\'activité:', err);
        setError('Impossible de charger les données d\'activité. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityData();
  }, [dateRange, activityFilter, userTypeFilter]);

  // Préparer les données pour les graphiques
  const prepareChartData = () => {
    if (!activityData) return null;

    // Données pour le graphique d'activité des utilisateurs
    const userActivityChartData = {
      labels: activityData.userActivity.dates,
      datasets: [
        {
          label: 'Visiteurs',
          data: activityData.userActivity.visitors,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Clients',
          data: activityData.userActivity.customers,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Vendeurs',
          data: activityData.userActivity.sellers,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3,
          fill: true
        }
      ]
    };

    // Données pour le graphique des appareils
    const deviceChartData = {
      labels: activityData.activityByDevice.map(device => device.device),
      datasets: [
        {
          data: activityData.activityByDevice.map(device => device.percentage),
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderWidth: 1
        }
      ]
    };

    // Données pour le graphique des pays
    const geoChartData = {
      labels: activityData.geoData.map(geo => geo.country),
      datasets: [
        {
          label: 'Visites',
          data: activityData.geoData.map(geo => geo.visits),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Commandes',
          data: activityData.geoData.map(geo => geo.orders),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };

    return {
      userActivityChartData,
      deviceChartData,
      geoChartData
    };
  };

  const chartData = activityData ? prepareChartData() : null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityBadgeColor = (action) => {
    switch (action.toLowerCase()) {
      case 'achat':
      case 'commande':
        return 'success';
      case 'inscription':
      case 'ajout produit':
        return 'primary';
      case 'modification':
      case 'promotion':
        return 'info';
      case 'avis':
      case 'consultation':
        return 'secondary';
      case 'panier':
        return 'warning';
      case 'retour':
        return 'danger';
      default:
        return 'light';
    }
  };

  const getUserTypeBadgeColor = (userType) => {
    switch (userType.toLowerCase()) {
      case 'customer':
        return 'info';
      case 'seller':
        return 'success';
      case 'visitor':
        return 'secondary';
      default:
        return 'light';
    }
  };

  const handleExportData = () => {
    alert('Export de données initié (fonctionnalité à implémenter)');
    // Implémentation réelle: générer un CSV/Excel avec les données
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <PageHeader title="Moniteur d'activité" curPage="Admin / Moniteur d'activité" />
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p className="mt-3">Chargement des données d'activité...</p>
        </Container>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <PageHeader title="Moniteur d'activité" curPage="Admin / Moniteur d'activité" />
        <Container className="py-5">
          <Alert variant="danger">
            <FaExclamationTriangle className="me-2" />
            {error}
          </Alert>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader title="Moniteur d'activité" curPage="Admin / Moniteur d'activité" />
      
      <Container fluid className="py-4">
        {/* Filtres */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={8}>
                <div className="d-flex flex-wrap">
                  <Form.Group className="me-3 mb-2 mb-md-0">
                    <Form.Label>Date de début</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    />
                  </Form.Group>
                  <Form.Group className="me-3 mb-2 mb-md-0">
                    <Form.Label>Date de fin</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    />
                  </Form.Group>
                  <Form.Group className="me-3 mb-2 mb-md-0">
                    <Form.Label>Type d'activité</Form.Label>
                    <Form.Select 
                      value={activityFilter}
                      onChange={(e) => setActivityFilter(e.target.value)}
                    >
                      <option value="all">Toutes les activités</option>
                      <option value="purchase">Achats</option>
                      <option value="view">Consultations</option>
                      <option value="registration">Inscriptions</option>
                      <option value="review">Avis</option>
                      <option value="product">Gestion produits</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2 mb-md-0">
                    <Form.Label>Type d'utilisateur</Form.Label>
                    <Form.Select 
                      value={userTypeFilter}
                      onChange={(e) => setUserTypeFilter(e.target.value)}
                    >
                      <option value="all">Tous les utilisateurs</option>
                      <option value="customer">Clients</option>
                      <option value="seller">Vendeurs</option>
                      <option value="visitor">Visiteurs</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </Col>
              <Col md={4} className="text-md-end mt-3 mt-md-0">
                <Button variant="primary" className="me-2">
                  <FaFilter className="me-2" />
                  Appliquer les filtres
                </Button>
                <Button variant="outline-secondary" onClick={handleExportData}>
                  <FaDownload className="me-2" />
                  Exporter
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Cartes de statistiques */}
        <Row className="mb-4 g-3">
          <Col lg={3} md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-primary bg-opacity-10 me-3">
                  <FaUsers className="text-primary fs-4" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Utilisateurs</h6>
                  <h3 className="mb-0 fw-bold">{activityData.summary.totalUsers.toLocaleString()}</h3>
                  <div className="small text-success">+{activityData.summary.recentRegistrations} nouvelles inscriptions</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-success bg-opacity-10 me-3">
                  <FaStore className="text-success fs-4" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Vendeurs</h6>
                  <h3 className="mb-0 fw-bold">{activityData.summary.totalSellers.toLocaleString()}</h3>
                  <div className="small text-warning">+{activityData.summary.newSellerApplications} demandes en attente</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-info bg-opacity-10 me-3">
                  <FaEye className="text-info fs-4" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Visiteurs</h6>
                  <h3 className="mb-0 fw-bold">{activityData.summary.totalVisitors.toLocaleString()}</h3>
                  <div className="small text-success">+8.7% vs période précédente</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-warning bg-opacity-10 me-3">
                  <FaShoppingCart className="text-warning fs-4" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Commandes</h6>
                  <h3 className="mb-0 fw-bold">{activityData.summary.totalOrders.toLocaleString()}</h3>
                  <div className="small text-warning">{activityData.summary.pendingOrders} en attente</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Graphiques et données */}
        <Tabs defaultActiveKey="activite" className="mb-4">
          <Tab eventKey="activite" title="Activité utilisateurs">
            <Row className="g-3 mt-2">
              <Col lg={8}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Tendances d'activité</h5>
                  </Card.Header>
                  <Card.Body>
                    {chartData && (
                      <div style={{ height: '300px' }}>
                        <Line 
                          data={chartData.userActivityChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'top',
                              },
                              tooltip: {
                                mode: 'index',
                                intersect: false,
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Répartition par appareil</h5>
                  </Card.Header>
                  <Card.Body className="d-flex justify-content-center align-items-center">
                    {chartData && (
                      <div style={{ height: '300px', width: '100%' }}>
                        <Pie 
                          data={chartData.deviceChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'right',
                                labels: {
                                  boxWidth: 12
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-3 mt-3">
              <Col>
                <Card className="shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Activités récentes</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>ID</th>
                          <th>Utilisateur</th>
                          <th>Type</th>
                          <th>Action</th>
                          <th>Détails</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityData.recentUserActivities.map((activity) => (
                          <tr key={activity.id}>
                            <td>{activity.id}</td>
                            <td>{activity.user}</td>
                            <td>
                              <Badge bg={getUserTypeBadgeColor(activity.userType)}>
                                {activity.userType === 'customer' ? 'Client' : 
                                 activity.userType === 'seller' ? 'Vendeur' : 'Visiteur'}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getActivityBadgeColor(activity.action)}>
                                {activity.action}
                              </Badge>
                            </td>
                            <td>{activity.details}</td>
                            <td>{formatDate(activity.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                  <Card.Footer className="bg-white text-center">
                    <Button variant="outline-primary" size="sm">
                      Voir toutes les activités
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </Tab>
          
          <Tab eventKey="vendeurs" title="Performance vendeurs">
            <Row className="g-3 mt-2">
              <Col>
                <Card className="shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Performance des vendeurs</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>ID</th>
                          <th>Boutique</th>
                          <th>Ventes</th>
                          <th>Chiffre d'affaires</th>
                          <th>Produits</th>
                          <th>Évaluation</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityData.sellerPerformance.map((seller) => (
                          <tr key={seller.id}>
                            <td>{seller.id}</td>
                            <td>{seller.name}</td>
                            <td>{seller.sales}</td>
                            <td>{seller.revenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                            <td>{seller.products}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="me-2">{seller.rating}</span>
                                <div className="rating-stars">
                                  {[...Array(5)].map((_, index) => (
                                    <i 
                                      key={index} 
                                      className={`icofont-star ${index < Math.floor(seller.rating) ? 'text-warning' : 'text-muted'}`}
                                      style={{ fontSize: '14px' }}
                                    ></i>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-2">
                                <FaEye className="me-1" /> Voir
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="produits" title="Produits populaires">
            <Row className="g-3 mt-2">
              <Col>
                <Card className="shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Produits les plus populaires</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>ID</th>
                          <th>Produit</th>
                          <th>Vues</th>
                          <th>Ventes</th>
                          <th>Taux de conversion</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityData.popularProducts.map((product) => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.views.toLocaleString()}</td>
                            <td>{product.sales.toLocaleString()}</td>
                            <td>
                              <Badge bg={
                                product.conversionRate > 12 ? 'success' : 
                                product.conversionRate > 8 ? 'primary' : 'warning'
                              }>
                                {product.conversionRate.toFixed(1)}%
                              </Badge>
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-2">
                                <FaEye className="me-1" /> Voir
                              </Button>
                              <Button variant="outline-secondary" size="sm">
                                <FaSearch className="me-1" /> Analyser
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="geo" title="Données géographiques">
            <Row className="g-3 mt-2">
              <Col lg={7}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Répartition géographique</h5>
                  </Card.Header>
                  <Card.Body>
                    {chartData && (
                      <div style={{ height: '300px' }}>
                        <Bar 
                          data={chartData.geoChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'top',
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={5}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Détail par pays</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Pays</th>
                          <th>Visites</th>
                          <th>Commandes</th>
                          <th>Taux conversion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityData.geoData.map((geo, index) => (
                          <tr key={index}>
                            <td>
                              <strong>{geo.country}</strong>
                            </td>
                            <td>{geo.visits.toLocaleString()}</td>
                            <td>{geo.orders.toLocaleString()}</td>
                            <td>
                              <Badge bg={
                                ((geo.orders / geo.visits) * 100) > 12 ? 'success' : 
                                ((geo.orders / geo.visits) * 100) > 8 ? 'primary' : 'warning'
                              }>
                                {((geo.orders / geo.visits) * 100).toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Container>
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/admin/activity-monitor',
        permanent: false,
      },
    };
  }
  
  if (session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  
  return {
    props: {}
  };
}

export default ActivityMonitor;
