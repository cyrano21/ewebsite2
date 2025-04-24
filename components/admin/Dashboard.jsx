"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Table, Button, ProgressBar } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Enregistrer les composants ChartJS nécessaires
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  // État pour simuler des données de tableau de bord
  const [stats, setStats] = useState({
    totalOrders: 567,
    totalProducts: 241,
    totalCustomers: 1423,
    totalRevenue: 124579.25,
    pendingOrders: 12,
    outOfStockProducts: 8
  });

  // État pour les produits les plus populaires
  const [popularProducts, setPopularProducts] = useState([
    { id: 1, name: 'Smartphone XYZ Pro', category: 'Électronique', price: 899.99, sales: 145, stock: 78, rating: 4.8 },
    { id: 2, name: 'Casque sans fil Premium', category: 'Audio', price: 249.99, sales: 98, stock: 32, rating: 4.6 },
    { id: 3, name: 'Tablette UltraHD', category: 'Électronique', price: 549.99, sales: 87, stock: 15, rating: 4.5 },
    { id: 4, name: 'Console de jeux Next-Gen', category: 'Gaming', price: 499.99, sales: 76, stock: 8, rating: 4.9 },
    { id: 5, name: 'Enceinte Bluetooth Waterproof', category: 'Audio', price: 129.99, sales: 61, stock: 45, rating: 4.3 },
  ]);
  
  // Données pour le graphique en camembert des ventes par catégorie
  const pieData = {
    labels: ['Électronique', 'Audio', 'Gaming', 'Accessoires', 'Maison connectée'],
    datasets: [
      {
        data: [35, 25, 20, 10, 10],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Données pour le graphique en barres des ventes mensuelles
  const barData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Ventes mensuelles',
        data: [65, 59, 80, 81, 56, 55, 72, 78, 85, 90, 92, 100],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
  
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

  // État pour les commandes récentes (simulées et du panier)
  const [recentOrders, setRecentOrders] = useState([
    { id: '#ORD-1234', customer: 'Jean Dupont', date: '19/04/2025', amount: '129.99 €', status: 'Livré' },
    { id: '#ORD-1235', customer: 'Marie Dubois', date: '18/04/2025', amount: '89.50 €', status: 'En cours' },
    { id: '#ORD-1236', customer: 'Pierre Martin', date: '17/04/2025', amount: '249.99 €', status: 'En attente' },
    { id: '#ORD-1237', customer: 'Sophie Petit', date: '17/04/2025', amount: '59.95 €', status: 'Livré' },
    { id: '#ORD-1238', customer: 'Luc Richard', date: '16/04/2025', amount: '199.00 €', status: 'Annulé' },
  ]);
  
  // État pour les commandes du panier
  const [cartOrders, setCartOrders] = useState([]);

  // Récupérer les commandes du panier au chargement
  useEffect(() => {
    // Récupérer les articles du panier depuis le localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Si des articles sont présents dans le panier
    if (cartItems.length > 0) {
      // Calculer le montant total du panier
      const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      // Créer une commande "En attente" à partir des articles du panier
      const newCartOrder = {
        id: '#PANIER-ACTIF',
        customer: 'Client actuel',
        date: new Date().toLocaleDateString('fr-FR'),
        amount: `${totalAmount.toFixed(2)} €`,
        status: 'En attente',
        isCart: true, // Marquer comme provenant du panier
        items: cartItems
      };
      
      // Mettre à jour l'état avec la nouvelle commande en attente
      setCartOrders([newCartOrder]);
      
      // Mettre à jour les statistiques
      setStats(prevStats => ({
        ...prevStats,
        pendingOrders: prevStats.pendingOrders + 1
      }));
    }
  }, []);

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

  return (
    <div>
      <PageHeader title="Tableau de bord administrateur" curPage="Admin" />
      
      <Container fluid className="py-4">
        {/* Statistiques principales */}
        <Row className="mb-4">
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
          {/* Graphique des ventes par catégorie */}
          <Col lg={4} md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Ventes par catégorie</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                  <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Graphique des ventes mensuelles */}
          <Col lg={8} md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Tendance des ventes</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '250px' }}>
                  <Bar data={barData} options={barOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Widget des produits populaires */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Produits les plus populaires</h5>
                <Button variant="outline-primary" size="sm" as={Link} href="/admin/products">Voir tous les produits</Button>
              </Card.Header>
              <Card.Body>
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
                      <tr key={product.id}>
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
                          <span className="badge bg-success">{product.sales}</span>
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
                            <span className="me-2">{product.rating}</span>
                            <div className="rating-stars">
                              {[...Array(5)].map((_, index) => (
                                <i 
                                  key={index} 
                                  className={`icofont-star ${index < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}`}
                                  style={{ fontSize: '14px' }}
                                ></i>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2" as={Link} href={`/admin/products/edit/${product.id}`}>
                            <i className="icofont-ui-edit"></i>
                          </Button>
                          <Button variant="outline-info" size="sm" as={Link} href={`/shop-single/${product.id}`}>
                            <i className="icofont-eye-alt"></i>
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
        
        {/* Alertes */}
        <Row className="mb-4">
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
        <Row className="mb-4">
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
                    {recentOrders.map((order, index) => (
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
                          <Button variant="link" size="sm" className="p-0 me-2">
                            <i className="icofont-eye-alt text-primary"></i>
                          </Button>
                          <Button variant="link" size="sm" className="p-0">
                            <i className="icofont-ui-edit text-success"></i>
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
        
        {/* Navigation rapide */}
        <Row>
          <Col>
            <h5 className="mb-4">Gestion rapide</h5>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-4">
            <Card className="text-center shadow-sm h-100">
              <Card.Body>
                <div className="icon-box bg-light rounded-circle mx-auto mb-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <i className="icofont-box fs-4 text-primary"></i>
                </div>
                <h5>Produits</h5>
                <p className="text-muted small">Gérer les produits, catégories et stocks</p>
                <Button variant="primary" size="sm" as={Link} href="/admin/products">Accéder</Button>
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
                <Button variant="success" size="sm" as={Link} href="/admin/customers">Accéder</Button>
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
                <Button variant="info" size="sm" as={Link} href="/admin/reports">Accéder</Button>
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
                <Button variant="warning" size="sm" as={Link} href="/admin/settings">Accéder</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
