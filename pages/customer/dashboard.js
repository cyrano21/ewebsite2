import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Tab, Nav } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import LoyaltyDashboard from '../../components/customer/LoyaltyDashboard'; // Added import for LoyaltyDashboard

// Enregistrer les composants ChartJS nécessaires
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const UserDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Statistiques utilisateur
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    reviewsCount: 0,
    loyaltyPoints: 0
  });

  // Données pour les graphiques
  const [categoryData, setCategoryData] = useState({
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

  // Données pour l'historique d'achats
  const [purchaseHistory, setPurchaseHistory] = useState({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Montant des achats (€)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session && session.user) {
      fetchUserData();
    }
  }, [session, status]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Récupérer les infos utilisateur
      const userResponse = await axios.get('/api/auth/me');

      // Récupérer les commandes
      const ordersResponse = await axios.get('/api/orders');

      // Récupérer les articles en wishlist
      const wishlistResponse = await axios.get('/api/users/wishlist');

      setUserInfo(userResponse.data);
      setOrders(ordersResponse.data.orders || []);
      setWishlist(wishlistResponse.data.wishlist || []);

      // Calculer les statistiques
      const totalOrders = ordersResponse.data.orders?.length || 0;
      const totalSpent = ordersResponse.data.orders?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

      setUserStats({
        totalOrders,
        totalSpent,
        wishlistItems: wishlistResponse.data.wishlist?.length || 0,
        reviewsCount: userResponse.data.reviewsCount || 0,
        loyaltyPoints: userResponse.data.loyaltyPoints || 0
      });

      // Préparer les données pour le graphique en camembert
      if (ordersResponse.data.orders && ordersResponse.data.orders.length > 0) {
        // Regrouper les produits par catégorie
        const categoriesMap = {};
        ordersResponse.data.orders.forEach(order => {
          order.items?.forEach(item => {
            if (item.category) {
              categoriesMap[item.category] = (categoriesMap[item.category] || 0) + 1;
            }
          });
        });

        // Transformer en données pour le graphique
        setCategoryData({
          labels: Object.keys(categoriesMap),
          datasets: [
            {
              data: Object.values(categoriesMap),
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        // Préparer l'historique d'achats mensuel
        const monthlyPurchases = Array(12).fill(0);

        ordersResponse.data.orders.forEach(order => {
          if (order.createdAt) {
            const date = new Date(order.createdAt);
            const month = date.getMonth();
            monthlyPurchases[month] += (order.total || 0);
          }
        });

        setPurchaseHistory({
          ...purchaseHistory,
          datasets: [
            {
              ...purchaseHistory.datasets[0],
              data: monthlyPurchases
            }
          ]
        });
      }

      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      setError("Impossible de charger les données utilisateur. Veuillez réessayer plus tard.");
      setLoading(false);
    }
  };

  // Options pour le graphique
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historique d\'achats mensuel',
      },
    },
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'primary';
      case 'pending': return 'warning';
      default: return 'danger';
    }
  };


  if (loading) {
    return (
      <Layout>
        <PageHeader title="Tableau de bord utilisateur" curPage="Mon tableau de bord" />
        <Container className="py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement de vos données...</p>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageHeader title="Tableau de bord utilisateur" curPage="Mon tableau de bord" />
        <Container className="py-5">
          <div className="alert alert-danger" role="alert">
            <i className="icofont-warning-alt me-2"></i>
            {error}
          </div>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title="Tableau de bord utilisateur" curPage="Mon tableau de bord" />

      <Container className="py-5">
        {/* Carte d'information de l'utilisateur */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={2} className="text-center">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px' }}>
                  {userInfo.profileImage ? (
                    <img 
                      src={userInfo.profileImage} 
                      alt={userInfo.name} 
                      className="rounded-circle img-fluid" 
                      style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                    />
                  ) : (
                    <i className="icofont-user-alt-7 text-primary" style={{ fontSize: '2rem' }}></i>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <h4>{userInfo.name}</h4>
                <p className="text-muted mb-0">{userInfo.email}</p>
                <small className="text-muted">Membre depuis {new Date(userInfo.createdAt).toLocaleDateString('fr-FR')}</small>
              </Col>
              <Col md={4} className="text-md-end d-flex flex-column justify-content-center">
                <div className="mb-2">
                  <Badge bg="primary" className="p-2">
                    <i className="icofont-award me-1"></i>
                    Points de fidélité: {userStats.loyaltyPoints}
                  </Badge>
                </div>
                <Button variant="outline-primary" size="sm" as={Link} href="/customer/Profile">
                  <i className="icofont-ui-edit me-1"></i>
                  Modifier mon profil
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Statistiques utilisateur */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="icofont-shopping-cart text-primary" style={{ fontSize: '1.5rem' }}></i>
                </div>
                <h5>{userStats.totalOrders}</h5>
                <p className="text-muted mb-0">Commandes totales</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="icofont-money text-success" style={{ fontSize: '1.5rem' }}></i>
                </div>
                <h5>{userStats.totalSpent.toFixed(2)} €</h5>
                <p className="text-muted mb-0">Montant total dépensé</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="icofont-heart text-danger" style={{ fontSize: '1.5rem' }}></i>
                </div>
                <h5>{userStats.wishlistItems}</h5>
                <p className="text-muted mb-0">Articles favoris</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="icofont-star text-info" style={{ fontSize: '1.5rem' }}></i>
                </div>
                <h5>{userStats.reviewsCount}</h5>
                <p className="text-muted mb-0">Avis publiés</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Graphiques */}
        <Row className="mb-4">
          <Col lg={5} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Mes achats par catégorie</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                  <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={7} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Historique de mes achats</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Bar data={purchaseHistory} options={barOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Container>
          <h2 className="mb-4">Tableau de bord</h2>

          <Tab.Container id="dashboard-tabs" defaultActiveKey="overview">
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="overview">Aperçu</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="loyalty">Programme de Fidélité</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">Commandes</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="overview">
                {/* ... existing overview content ... */}
                {/* Résumé du programme de fidélité */}
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div className="mb-3 mb-md-0">
                      <h5 className="mb-1">Programme de Fidélité</h5>
                      <p className="mb-0 text-muted">Gagnez des points avec chaque achat et obtenez des récompenses exclusives.</p>
                    </div>
                    <Button variant="primary" onClick={() => document.querySelector('a[href="#loyalty"]').click()}>
                      Voir mes points
                    </Button>
                  </Card.Body>
                </Card>
                {/* ... existing overview content ... */}
              </Tab.Pane>

              <Tab.Pane eventKey="loyalty">
                <LoyaltyDashboard />
              </Tab.Pane>

              <Tab.Pane eventKey="orders">
                {orders && orders.length > 0 ? (
                  <div className="orders-list">
                    <h3 className="mb-3">Toutes mes commandes</h3>
                    <div className="table-responsive">
                      <Table responsive hover className="align-middle">
                        <thead>
                          <tr>
                            <th>N° Commande</th>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Statut</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order._id}>
                              <td>#{order.orderNumber || order._id}</td>
                              <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                              <td>{(order.total || 0).toFixed(2)} €</td>
                              <td>
                                <Badge bg={getStatusBadge(order.status)}>
                                  {order.status === 'delivered' ? 'Livré' :
                                    order.status === 'shipped' ? 'Expédié' :
                                    order.status === 'processing' ? 'En traitement' :
                                    order.status === 'pending' ? 'En attente' :
                                    'Annulé'}
                                </Badge>
                              </td>
                              <td>
                                <Button variant="link" className="btn-sm p-0 me-2" as={Link} href={`/customer/orders/${order._id}`}>
                                  <i className="icofont-eye-alt text-primary"></i>
                                </Button>
                                {order.status === 'delivered' && (
                                  <Button variant="link" className="btn-sm p-0">
                                    <i className="icofont-ui-rating text-warning"></i>
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <Card className="border-light">
                    <Card.Body className="text-center">
                      <p className="mb-3">Vous n'avez pas encore de commande</p>
                      <Button variant="primary" href="/shop">Commencer les achats</Button>
                    </Card.Body>
                  </Card>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>

        {/* Articles favoris */}
        <Card className="shadow-sm">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Mes articles favoris</h5>
            <Button variant="outline-primary" size="sm" as={Link} href="/customer/Wishlist">
              Voir tous mes favoris
            </Button>
          </Card.Header>
          <Card.Body>
            {wishlist.length > 0 ? (
              <Row>
                {wishlist.slice(0, 4).map((item) => (
                  <Col md={3} sm={6} key={item._id} className="mb-3">
                    <Card className="h-100 product-card">
                      <div className="position-relative">
                        <Card.Img
                          variant="top"
                          src={item.imageUrl || '/assets/images/shop/placeholder.jpg'}
                          alt={item.name}
                          style={{ height: '180px', objectFit: 'cover' }}
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          className="position-absolute bottom-0 end-0 m-2"
                          as={Link}
                          href={`/shop/product/${item._id}`}
                        >
                          <i className="icofont-eye-alt"></i>
                        </Button>
                      </div>
                      <Card.Body>
                        <Card.Title className="h6">{item.name}</Card.Title>
                        <Card.Text className="text-primary fw-bold">
                          {item.price?.toFixed(2)} €
                          {item.discountPrice && (
                            <small className="text-muted text-decoration-line-through ms-2">
                              {item.discountPrice.toFixed(2)} €
                            </small>
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-4">
                <i className="icofont-heart text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3">Votre liste de favoris est vide.</p>
                <Button variant="primary" as={Link} href="/shop">
                  Découvrir des produits
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

export default UserDashboard;