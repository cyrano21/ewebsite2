// filepath: g:\ewebsite2\pages\admin\review-analytics.js
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Badge, ProgressBar, Spinner, Alert, Button, Tabs, Tab, Form, Modal } from 'react-bootstrap';
import AdminLayout from '../../components/admin/AdminLayout';
import Head from 'next/head';
import { AuthContext } from '../../contexts/AuthProvider';
import { FaStar, FaUser, FaTag, FaFolder, FaShoppingCart, FaChartBar, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Enregistrer les composants requis pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ReviewAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendingRecommendation, setSendingRecommendation] = useState(false);
  const [recommendationSuccess, setRecommendationSuccess] = useState(null);
  const [recommendationError, setRecommendationError] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [campaignType, setCampaignType] = useState('positive');
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState(null);
  const [campaignError, setCampaignError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("[FRONTEND] Initialisation du hook useEffect, loading:", loading);
    
    const fetchAnalytics = async () => {
      try {
        console.log("[FRONTEND] Début de la récupération des analyses");
        setLoading(true);
        const token = localStorage.getItem('auth-token');
        
        if (!token) {
          console.log("[FRONTEND] Pas de token disponible");
          setError('Authentification requise');
          setLoading(false);
          return;
        }
        
        console.log("[FRONTEND] Envoi de la requête à l'API review-analytics");
        const res = await fetch('/api/admin/review-analytics', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("[FRONTEND] Réponse reçue de l'API, status:", res.status);
        
        const data = await res.json();
        console.log("[FRONTEND] Données JSON reçues:", Object.keys(data));
        
        if (data.success) {
          console.log("[FRONTEND] Succès, mise à jour de l'état avec les données");
          setAnalytics(data);
          setLoading(false);
        } else {
          console.log("[FRONTEND] Erreur reçue de l'API:", data.message);
          setError(data.message || 'Erreur lors de la récupération des analyses');
          setLoading(false);
        }
      } catch (error) {
        console.error('[FRONTEND] Erreur lors de la récupération des analyses:', error);
        setError('Erreur lors de la récupération des analyses: ' + (error.message || 'Erreur inconnue'));
        setLoading(false);
      }
    };
    
    console.log("[FRONTEND] Vérification du token avant de lancer fetchAnalytics");
    const token = localStorage.getItem('auth-token');
    if (!token) {
      console.log("[FRONTEND] Pas de token, affichage de l'erreur");
      setError('Authentification requise');
      setLoading(false);
      return;
    }
    
    console.log("[FRONTEND] Initialisation du chargement, user:", user?.role);
    fetchAnalytics();
    
  }, []);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour afficher les étoiles
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'text-warning' : 'text-muted'}
        />
      );
    }
    return stars;
  };

  // Fonction pour envoyer des recommandations par email
  const sendRecommendations = async (userId, products) => {
    try {
      setSendingRecommendation(true);
      setRecommendationSuccess(null);
      setRecommendationError(null);
      
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        setRecommendationError('Authentification requise');
        setSendingRecommendation(false);
        return;
      }
      
      const res = await fetch('/api/admin/send-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          recommendedProducts: products,
          message: customMessage || null
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setRecommendationSuccess(`Recommandations envoyées avec succès à ${data.email}`);
        // Réinitialiser le formulaire après 3 secondes
        setTimeout(() => {
          setSelectedUser(null);
          setCustomMessage('');
          setRecommendationSuccess(null);
        }, 3000);
      } else {
        setRecommendationError(data.message || 'Erreur lors de l\'envoi des recommandations');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des recommandations:', error);
      setRecommendationError('Une erreur est survenue lors de l\'envoi des recommandations');
    } finally {
      setSendingRecommendation(false);
    }
  };

  // Fonction pour créer une campagne de recommandations
  const createRecommendationCampaign = async () => {
    try {
      setCreatingCampaign(true);
      setCampaignSuccess(null);
      setCampaignError(null);
      
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        setCampaignError('Authentification requise');
        setCreatingCampaign(false);
        return;
      }
      
      // Préparer les données de la campagne
      const campaignData = {
        name: campaignName,
        description: campaignDescription,
        type: campaignType,
        userIds: selectedUserIds.length > 0 ? selectedUserIds : null,
        message: customMessage || null
      };
      
      const res = await fetch('/api/admin/create-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campaignData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setCampaignSuccess(`Campagne "${campaignName}" créée avec succès. ${data.usersCount || 0} utilisateurs ciblés.`);
        // Réinitialiser le formulaire après le succès
        setTimeout(() => {
          setShowCampaignModal(false);
          setCampaignName('');
          setCampaignDescription('');
          setSelectedUserIds([]);
          setCampaignType('positive');
          setCustomMessage('');
          setCampaignSuccess(null);
        }, 3000);
      } else {
        setCampaignError(data.message || 'Erreur lors de la création de la campagne');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la campagne:', error);
      setCampaignError('Une erreur est survenue lors de la création de la campagne');
    } finally {
      setCreatingCampaign(false);
    }
  };

  // Données pour le graphique de distribution des notes
  const ratingDistributionData = analytics ? {
    labels: ['1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'],
    datasets: [
      {
        label: 'Nombre d\'avis',
        data: analytics.globalStats.ratingDistribution,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  // Préparer les données pour les catégories les plus populaires
  const getTopCategoriesData = () => {
    if (!analytics || !analytics.categoryAnalytics) return null;
    
    const sortedCategories = Object.entries(analytics.categoryAnalytics)
      .map(([category, data]) => ({
        category,
        count: data.count,
        averageRating: parseFloat(data.averageRating)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      labels: sortedCategories.map(c => c.category),
      datasets: [
        {
          label: 'Nombre d\'avis',
          data: sortedCategories.map(c => c.count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          order: 1,
        },
        {
          label: 'Note moyenne',
          data: sortedCategories.map(c => c.averageRating),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          type: 'line',
          yAxisID: 'y1',
          order: 0,
        },
      ],
    };
  };

  // Options pour le graphique des catégories
  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Catégories les plus populaires',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre d\'avis'
        }
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        min: 0,
        max: 5,
        title: {
          display: true,
          text: 'Note moyenne'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    },
  };

  // Données pour le graphique des tags les plus populaires
  const getTopTagsData = () => {
    if (!analytics || !analytics.tagAnalytics) return null;
    
    const sortedTags = Object.entries(analytics.tagAnalytics)
      .map(([tag, data]) => ({
        tag,
        count: data.count,
        averageRating: parseFloat(data.averageRating)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      labels: sortedTags.map(t => t.tag),
      datasets: [
        {
          label: 'Nombre d\'avis',
          data: sortedTags.map(t => t.count),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        }
      ],
    };
  };

  // Données pour le graphique radar des utilisateurs positifs
  const getPositiveUsersRadarData = () => {
    if (!analytics || !analytics.positiveReviewers || analytics.positiveReviewers.length === 0) return null;
    
    const topUsers = analytics.positiveReviewers.slice(0, 5);
    
    return {
      labels: ['Avis positifs (%)', 'Nombre d\'avis', 'Note moyenne', 'Diversité de catégories', 'Diversité de produits'],
      datasets: topUsers.map((user, index) => {
        const colors = [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ];
        
        const uniqueCategories = new Set(user.reviewedProducts.map(p => p.category)).size;
        const uniqueProducts = new Set(user.reviewedProducts.map(p => p.productId)).size;
        
        return {
          label: user.name,
          data: [
            (user.highRatingCount / user.totalReviews) * 100,
            Math.min(user.totalReviews / 10, 100), // Normalisation pour l'échelle
            parseFloat(user.averageRating) * 20, // Conversion en pourcentage (1-5 -> 20-100)
            (uniqueCategories / 5) * 100, // Supposant que 5+ catégories = 100%
            (uniqueProducts / 10) * 100, // Supposant que 10+ produits = 100%
          ],
          backgroundColor: colors[index % colors.length].replace('0.7', '0.2'),
          borderColor: colors[index % colors.length],
          borderWidth: 1,
          pointRadius: 4,
          pointHoverRadius: 6,
        };
      }),
    };
  };

  // Options pour le graphique radar
  const radarChartOptions = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false,
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Profil des utilisateurs positifs',
      },
    },
  };

  // Données pour le graphique camembert des paires de catégories
  const getCategoryPairsData = () => {
    if (!analytics || !analytics.popularCategoryPairs || analytics.popularCategoryPairs.length === 0) return null;
    
    return {
      labels: analytics.popularCategoryPairs.map(pair => pair.categories.join(' & ')),
      datasets: [{
        data: analytics.popularCategoryPairs.map(pair => pair.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderWidth: 1,
      }],
    };
  };

  // Options pour le graphique camembert
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Paires de catégories populaires',
      },
    },
  };

  // Afficher un message de chargement
  if (loading) {
    return (
      <AdminLayout>
        <Head>
          <title>Analyses des avis | Administration</title>
        </Head>
        <Container fluid>
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
            <p className="mt-3">Chargement des analyses...</p>
          </div>
        </Container>
      </AdminLayout>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <AdminLayout>
        <Head>
          <title>Analyses des avis | Administration</title>
        </Head>
        <Container fluid>
          <Alert variant="danger">
            <Alert.Heading>Erreur</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </Container>
      </AdminLayout>
    );
  }

  // Si les données sont chargées, afficher les analyses
  return (
    <AdminLayout>
      <Head>
        <title>Analyses des avis | Administration</title>
      </Head>
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h1>Analyses avancées des avis</h1>
            <p className="text-muted">
              Explorez les tendances, identifiez les utilisateurs clés et optimisez vos recommandations produit.
            </p>
          </Col>
        </Row>

        {/* Résumé global - Toujours visible */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <FaChartBar className="fs-1 text-primary mb-2" />
                <h2>{analytics?.globalStats?.totalReviews || 0}</h2>
                <p className="text-muted">Total des avis</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <FaStar className="fs-1 text-warning mb-2" />
                <h2>{analytics?.globalStats?.averageRating || 0}</h2>
                <p className="text-muted">Note moyenne globale</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <FaUser className="fs-1 text-success mb-2" />
                <h2>{analytics?.userAnalytics?.length || 0}</h2>
                <p className="text-muted">Utilisateurs actifs</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <FaFolder className="fs-1 text-info mb-2" />
                <h2>{Object.keys(analytics?.categoryAnalytics || {}).length}</h2>
                <p className="text-muted">Catégories évaluées</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Onglets d'analyse */}
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          className="mb-4"
        >
          <Tab eventKey="overview" title="Vue d'ensemble">
            <Row>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Distribution des notes</Card.Title>
                    {ratingDistributionData && (
                      <Bar 
                        data={ratingDistributionData} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            title: {
                              display: true,
                              text: 'Distribution des notes',
                            },
                          },
                        }} 
                      />
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Paires de catégories</Card.Title>
                    {getCategoryPairsData() && (
                      <Pie data={getCategoryPairsData()} options={pieChartOptions} />
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Catégories les plus populaires</Card.Title>
                    {getTopCategoriesData() && (
                      <Bar data={getTopCategoriesData()} options={categoryChartOptions} />
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Tags les plus populaires</Card.Title>
                    {getTopTagsData() && (
                      <Bar 
                        data={getTopTagsData()} 
                        options={{
                          indexAxis: 'y',
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            title: {
                              display: true,
                              text: 'Tags les plus populaires',
                            },
                          },
                        }} 
                      />
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Profil des utilisateurs positifs</Card.Title>
                    {getPositiveUsersRadarData() && (
                      <Radar data={getPositiveUsersRadarData()} options={radarChartOptions} />
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
          
          <Tab eventKey="users" title="Analyse des utilisateurs">
            <Card>
              <Card.Body>
                <Card.Title>Top des utilisateurs positifs</Card.Title>
                <p className="text-muted">Utilisateurs qui donnent le plus d'avis positifs (4-5 étoiles)</p>
                
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Utilisateur</th>
                      <th>Total avis</th>
                      <th>Avis positifs</th>
                      <th>Note moyenne</th>
                      <th>Catégories préférées</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.positiveReviewers?.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.totalReviews}</td>
                        <td>
                          <span className="text-success fw-bold">
                            {user.highRatingCount} ({Math.round((user.highRatingCount / user.totalReviews) * 100)}%)
                          </span>
                        </td>
                        <td>
                          <span className="d-flex align-items-center">
                            {user.averageRating} {renderStars(Math.round(parseFloat(user.averageRating)))}
                          </span>
                        </td>
                        <td>
                          {user.preferredCategories.map((cat, i) => (
                            <Badge 
                              key={i} 
                              bg="info" 
                              className="me-1"
                            >
                              {cat.category}
                            </Badge>
                          ))}
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <FaEnvelope className="me-1" /> Recommandations
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            
            {/* Modal de recommandations */}
            {selectedUser && (
              <div className="mt-4">
                <Card>
                  <Card.Header>
                    <h5>Envoyer des recommandations personnalisées à {selectedUser.name}</h5>
                  </Card.Header>
                  <Card.Body>
                    {recommendationSuccess && (
                      <Alert variant="success" dismissible onClose={() => setRecommendationSuccess(null)}>
                        {recommendationSuccess}
                      </Alert>
                    )}
                    
                    {recommendationError && (
                      <Alert variant="danger" dismissible onClose={() => setRecommendationError(null)}>
                        {recommendationError}
                      </Alert>
                    )}
                    
                    <h6>Basé sur le profil d'achat et les avis</h6>
                    <p><strong>Catégories préférées :</strong></p>
                    <div className="mb-3">
                      {selectedUser.preferredCategories.map((cat, i) => (
                        <Badge 
                          key={i} 
                          bg="info" 
                          className="me-1 p-2"
                        >
                          {cat.category} ({cat.count} avis)
                        </Badge>
                      ))}
                    </div>
                    
                    <p><strong>Tags préférés :</strong></p>
                    <div className="mb-3">
                      {selectedUser.preferredTags.map((tag, i) => (
                        <Badge 
                          key={i} 
                          bg="secondary" 
                          className="me-1 p-2"
                        >
                          {tag.tag} ({tag.count})
                        </Badge>
                      ))}
                    </div>
                    
                    <h6>Produits recommandés</h6>
                    <Table responsive bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Catégorie</th>
                          <th>Tags</th>
                          <th>Score de match</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUser.recommendedProducts.map((product, i) => (
                          <tr key={i}>
                            <td>
                              <Link 
                                href={`/shop/product/${product.slug}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                {product.name}
                              </Link>
                            </td>
                            <td>{product.category}</td>
                            <td>
                              {product.tags.map((tag, i) => (
                                <Badge 
                                  key={i} 
                                  bg="secondary" 
                                  className="me-1"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </td>
                            <td>
                              <ProgressBar 
                                now={Math.min(product.matchScore * 10, 100)} 
                                variant={product.matchScore > 7 ? 'success' : 'info'} 
                                label={`${Math.round(product.matchScore * 10)}%`}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    
                    <Form className="mt-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Message personnalisé (optionnel)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          placeholder="Ajoutez un message personnalisé à l'email de recommandations..."
                        />
                        <Form.Text className="text-muted">
                          Laissez vide pour utiliser le message par défaut.
                        </Form.Text>
                      </Form.Group>
                    </Form>
                    
                    <div className="mt-4 d-flex justify-content-between">
                      <Button 
                        variant="secondary" 
                        onClick={() => {
                          setSelectedUser(null);
                          setCustomMessage('');
                          setRecommendationSuccess(null);
                          setRecommendationError(null);
                        }}
                      >
                        Annuler
                      </Button>
                      <Button 
                        variant="success" 
                        onClick={() => sendRecommendations(selectedUser._id, selectedUser.recommendedProducts)}
                        disabled={sendingRecommendation || selectedUser.recommendedProducts.length === 0}
                      >
                        {sendingRecommendation ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <FaEnvelope className="me-1" /> Envoyer les recommandations par e-mail
                          </>
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}
          </Tab>
          
          <Tab eventKey="products" title="Analyse des produits">
            <Card>
              <Card.Body>
                <Card.Title>Produits les mieux notés</Card.Title>
                <p className="text-muted">Les produits avec les meilleures évaluations et le nombre d'avis</p>
                
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Produit</th>
                      <th>Catégorie</th>
                      <th>Avis</th>
                      <th>Note moyenne</th>
                      <th>Avis positifs</th>
                      <th>Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.productPopularity?.slice(0, 15).map((product, index) => (
                      <tr key={product.slug || index}>
                        <td>{index + 1}</td>
                        <td>
                          <Link 
                            href={`/shop/product/${product.slug}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {product.name}
                          </Link>
                        </td>
                        <td>{product.category}</td>
                        <td>{product.reviewCount}</td>
                        <td>
                          <span className="d-flex align-items-center">
                            {product.averageRating} {renderStars(Math.round(parseFloat(product.averageRating)))}
                          </span>
                        </td>
                        <td>
                          <span className="text-success fw-bold">
                            {product.positiveReviewsCount} ({Math.round((product.positiveReviewsCount / product.reviewCount) * 100)}%)
                          </span>
                        </td>
                        <td>
                          {product.tags.slice(0, 3).map((tag, i) => (
                            <Badge 
                              key={i} 
                              bg="secondary" 
                              className="me-1"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {product.tags.length > 3 && (
                            <Badge bg="light" text="dark">+{product.tags.length - 3}</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="recommendations" title="Recommandations">
            <Row>
              <Col md={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Génération de campagnes de recommandation</Card.Title>
                    <p>
                      Utilisez les données d'analyse des avis pour créer des campagnes marketing personnalisées 
                      et des recommandations produit ciblées.
                    </p>
                    
                    <div className="mt-4">
                      <h5>Recommandations basées sur les avis positifs</h5>
                      <p>
                        Identifiez les utilisateurs qui ont laissé majoritairement des avis positifs et
                        proposez-leur des produits similaires ou complémentaires.
                      </p>
                      
                      <div className="alert alert-success">
                        <h6>Stratégie de recommandation</h6>
                        <ol>
                          <li>Identifiez les utilisateurs qui ont laissé au moins 3 avis positifs (4-5 étoiles)</li>
                          <li>Analysez leurs préférences en termes de catégories et de tags</li>
                          <li>Recommandez des produits bien notés dans ces catégories qu'ils n'ont pas encore achetés</li>
                          <li>Envoyez des recommandations personnalisées par e-mail ou notifications</li>
                        </ol>
                      </div>
                      
                      <Button variant="primary" className="mt-3" onClick={() => setShowCampaignModal(true)}>
                        <FaEnvelope className="me-2" /> Créer une campagne de recommandations
                      </Button>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="mt-4">
                      <h5>Paires de produits populaires</h5>
                      <p>
                        Basées sur les paires de catégories fréquemment évaluées positivement par les mêmes utilisateurs.
                      </p>
                      
                      <Table responsive bordered>
                        <thead>
                          <tr>
                            <th>Catégories complémentaires</th>
                            <th>Fréquence</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics?.popularCategoryPairs?.map((pair, index) => (
                            <tr key={index}>
                              <td>
                                <Badge bg="info" className="me-2 p-2">{pair.categories[0]}</Badge>
                                <span className="mx-2">+</span>
                                <Badge bg="info" className="p-2">{pair.categories[1]}</Badge>
                              </td>
                              <td>{pair.count} utilisateurs</td>
                              <td>
                                <Button variant="outline-primary" size="sm">
                                  <FaShoppingCart className="me-1" /> Créer des offres groupées
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
        
        {/* Modal de création de campagne */}
        <Modal 
          show={showCampaignModal} 
          onHide={() => setShowCampaignModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Créer une campagne de recommandations</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {campaignSuccess && (
              <Alert variant="success" dismissible onClose={() => setCampaignSuccess(null)}>
                {campaignSuccess}
              </Alert>
            )}
            
            {campaignError && (
              <Alert variant="danger" dismissible onClose={() => setCampaignError(null)}>
                {campaignError}
              </Alert>
            )}
            
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nom de la campagne</Form.Label>
                <Form.Control
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Ex: Recommandations d'été 2025"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  placeholder="Décrivez brièvement l'objectif de cette campagne"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Type de campagne</Form.Label>
                <Form.Select
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value)}
                >
                  <option value="positive">Utilisateurs avec avis positifs (4-5 étoiles)</option>
                  <option value="frequent">Utilisateurs fréquents (3+ avis)</option>
                  <option value="inactive">Réactivation des utilisateurs inactifs</option>
                  <option value="specific">Utilisateurs spécifiques (sélection manuelle)</option>
                </Form.Select>
              </Form.Group>
              
              {campaignType === 'specific' && (
                <Form.Group className="mb-3">
                  <Form.Label>Sélectionner des utilisateurs</Form.Label>
                  <Form.Control
                    as="select"
                    multiple
                    value={selectedUserIds}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedUserIds(values);
                    }}
                  >
                    {analytics?.userAnalytics?.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} - {user.totalReviews} avis - Note moyenne: {user.averageRating}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Text className="text-muted">
                    Maintenez la touche Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs utilisateurs.
                  </Form.Text>
                </Form.Group>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Message personnalisé (optionnel)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Ajoutez un message personnalisé à l'email de recommandations..."
                />
                <Form.Text className="text-muted">
                  Laissez vide pour utiliser le modèle par défaut.
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowCampaignModal(false);
                setCampaignName('');
                setCampaignDescription('');
                setSelectedUserIds([]);
                setCampaignType('positive');
                setCustomMessage('');
                setCampaignSuccess(null);
                setCampaignError(null);
              }}
            >
              Annuler
            </Button>
            <Button 
              variant="success" 
              onClick={createRecommendationCampaign}
              disabled={creatingCampaign || !campaignName}
            >
              {creatingCampaign ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Création en cours...
                </>
              ) : (
                <>
                  <FaEnvelope className="me-1" /> Créer la campagne
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </AdminLayout>
  );
};

export default ReviewAnalytics;