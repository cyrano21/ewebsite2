import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import AdminLayout from '../../../components/admin/AdminLayout';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import styles from '../../../styles/AdvertisementAnalytics.module.css';

// Enregistrer les composants nécessaires pour Chart.js
Chart.register(...registerables);

const AdvertisementAnalytics = () => {
  // États pour les données
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    types: '',
    positions: '',
    status: ''
  });
  
  // Récupération des données d'analytics
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = { ...filters };
      
      const response = await axios.get('/api/advertisements/analytics', { params });
      
      if (response.data.success) {
        setAnalytics(response.data.data);
      } else {
        setError('Erreur lors de la récupération des données d\'analytique');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données d\'analytique:', err);
      setError('Une erreur s\'est produite lors de la récupération des données d\'analytique');
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les données au chargement et lorsque les filtres changent
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  // Gérer le changement de filtre
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Appliquer les filtres
  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchAnalytics();
  };
  
  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setFilters({
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      types: '',
      positions: '',
      status: ''
    });
    
    // Récupérer les données après la réinitialisation
    setTimeout(() => {
      fetchAnalytics();
    }, 0);
  };
  
  // Préparer les données pour le graphique d'évolution dans le temps
  const prepareTimeSeriesData = () => {
    if (!analytics || !analytics.dailyTrends) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    const labels = analytics.dailyTrends.map(trend => trend._id);
    
    return {
      labels,
      datasets: [
        {
          label: 'Impressions',
          data: analytics.dailyTrends.map(trend => trend.impressions),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.1
        },
        {
          label: 'Clics',
          data: analytics.dailyTrends.map(trend => trend.clicks),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1
        },
        {
          label: 'Conversions',
          data: analytics.dailyTrends.map(trend => trend.conversions),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1
        }
      ]
    };
  };
  
  // Préparer les données pour le graphique par type
  const prepareTypeData = () => {
    if (!analytics || !analytics.statsByType) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    const labels = analytics.statsByType.map(stat => {
      switch (stat._id) {
        case 'banner': return 'Bannière';
        case 'popup': return 'Popup';
        case 'sidebar': return 'Barre latérale';
        case 'featured': return 'Mis en avant';
        case 'video': return 'Vidéo';
        case 'carousel': return 'Carousel';
        default: return stat._id;
      }
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Impressions',
          data: analytics.statsByType.map(stat => stat.impressions),
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  // Préparer les données pour le graphique par position
  const preparePositionData = () => {
    if (!analytics || !analytics.statsByPosition) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    const labels = analytics.statsByPosition.map(stat => {
      switch (stat._id) {
        case 'home': return 'Accueil';
        case 'shop': return 'Boutique';
        case 'product': return 'Produit';
        case 'checkout': return 'Paiement';
        case 'category': return 'Catégorie';
        case 'blog': return 'Blog';
        case 'global': return 'Global';
        default: return stat._id;
      }
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'CTR (%)',
          data: analytics.statsByPosition.map(stat => stat.ctr),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(201, 203, 207, 0.7)'
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  // Configuration des options pour les graphiques
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Évolution des métriques dans le temps'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Impressions par type de publicité'
      }
    }
  };
  
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: 'CTR (%) par position'
      }
    }
  };
  
  // Fonction pour formater les chiffres (ajouter des séparateurs de milliers)
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };
  
  // Calculer le CTR global
  const calculateGlobalCTR = () => {
    if (!analytics || !analytics.overview) return '0.00';
    
    const { totalImpressions, totalClicks } = analytics.overview;
    
    if (totalImpressions === 0) return '0.00';
    
    return ((totalClicks / totalImpressions) * 100).toFixed(2);
  };
  
  // Calculer le taux de conversion
  const calculateConversionRate = () => {
    if (!analytics || !analytics.overview) return '0.00';
    
    const { totalClicks, totalConversions } = analytics.overview;
    
    if (totalClicks === 0) return '0.00';
    
    return ((totalConversions / totalClicks) * 100).toFixed(2);
  };
  
  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Analytique des Publicités</h1>
        
        {/* Afficher les erreurs s'il y en a */}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        {/* Filtres */}
        <Card className="mb-4">
          <Card.Header>
            <h3 className="mb-0">Filtres</h3>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleApplyFilters}>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date de début</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date de fin</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Types</Form.Label>
                    <Form.Select name="types" value={filters.types} onChange={handleFilterChange}>
                      <option value="">Tous les types</option>
                      <option value="banner">Bannière</option>
                      <option value="popup">Popup</option>
                      <option value="sidebar">Barre latérale</option>
                      <option value="featured">Mis en avant</option>
                      <option value="video">Vidéo</option>
                      <option value="carousel">Carousel</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Positions</Form.Label>
                    <Form.Select name="positions" value={filters.positions} onChange={handleFilterChange}>
                      <option value="">Toutes les positions</option>
                      <option value="home">Accueil</option>
                      <option value="shop">Boutique</option>
                      <option value="product">Produit</option>
                      <option value="checkout">Paiement</option>
                      <option value="category">Catégorie</option>
                      <option value="blog">Blog</option>
                      <option value="global">Global</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Statut</Form.Label>
                    <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
                      <option value="">Tous les statuts</option>
                      <option value="draft">Brouillon</option>
                      <option value="scheduled">Planifié</option>
                      <option value="active">Actif</option>
                      <option value="paused">En pause</option>
                      <option value="completed">Terminé</option>
                      <option value="archived">Archivé</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={handleResetFilters}>
                  <i className="icofont-refresh me-1"></i> Réinitialiser
                </Button>
                <Button variant="primary" type="submit">
                  <i className="icofont-filter me-1"></i> Appliquer les filtres
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        
        {/* Chargement */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
            <p className="mt-3">Chargement des données analytiques...</p>
          </div>
        ) : (
          <>
            {/* Métriques générales */}
            <Row className="mb-4">
              <Col md={3}>
                <Card className={styles.metricCard}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Impressions</h6>
                        <h3 className="mb-0">{formatNumber(analytics?.overview?.totalImpressions || 0)}</h3>
                      </div>
                      <div className={styles.metricIcon}>
                        <i className="icofont-eye-alt text-primary"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={3}>
                <Card className={styles.metricCard}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Clics</h6>
                        <h3 className="mb-0">{formatNumber(analytics?.overview?.totalClicks || 0)}</h3>
                      </div>
                      <div className={styles.metricIcon}>
                        <i className="icofont-click text-success"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={3}>
                <Card className={styles.metricCard}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">CTR Global</h6>
                        <h3 className="mb-0">{calculateGlobalCTR()}%</h3>
                      </div>
                      <div className={styles.metricIcon}>
                        <i className="icofont-chart-bar-graph text-warning"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={3}>
                <Card className={styles.metricCard}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Taux de Conversion</h6>
                        <h3 className="mb-0">{calculateConversionRate()}%</h3>
                      </div>
                      <div className={styles.metricIcon}>
                        <i className="icofont-chart-growth text-danger"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Graphiques */}
            <Row>
              <Col md={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <div className={styles.chartContainer}>
                      <Line data={prepareTimeSeriesData()} options={lineOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <div className={styles.chartContainer}>
                      <Bar data={prepareTypeData()} options={barOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <div className={styles.chartContainer}>
                      <Doughnut data={preparePositionData()} options={doughnutOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Meilleures publicités */}
            <Card>
              <Card.Header>
                <h3 className="mb-0">Meilleures publicités</h3>
              </Card.Header>
              <Card.Body>
                {analytics?.topAds?.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Type</th>
                          <th>Position</th>
                          <th>Impressions</th>
                          <th>Clics</th>
                          <th>CTR</th>
                          <th>Conversions</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topAds.map((ad) => (
                          <tr key={ad._id}>
                            <td>{ad.name}</td>
                            <td>
                              <span className={`badge bg-${
                                ad.type === 'banner' ? 'primary' :
                                ad.type === 'popup' ? 'warning' :
                                ad.type === 'sidebar' ? 'info' :
                                ad.type === 'featured' ? 'success' :
                                ad.type === 'video' ? 'danger' :
                                ad.type === 'carousel' ? 'dark' : 'secondary'
                              }`}>
                                {ad.type}
                              </span>
                            </td>
                            <td>
                              <span className={`badge bg-${
                                ad.position === 'home' ? 'success' :
                                ad.position === 'shop' ? 'primary' :
                                ad.position === 'product' ? 'info' :
                                ad.position === 'checkout' ? 'warning' :
                                ad.position === 'category' ? 'secondary' :
                                ad.position === 'blog' ? 'danger' :
                                ad.position === 'global' ? 'dark' : 'light'
                              }`}>
                                {ad.position}
                              </span>
                            </td>
                            <td>{formatNumber(ad.analytics?.impressions || 0)}</td>
                            <td>{formatNumber(ad.analytics?.clicks || 0)}</td>
                            <td>{(ad.analytics?.ctr || 0).toFixed(2)}%</td>
                            <td>{formatNumber(ad.analytics?.conversions || 0)}</td>
                            <td>
                              <span className={`badge bg-${
                                ad.status === 'draft' ? 'secondary' :
                                ad.status === 'scheduled' ? 'info' :
                                ad.status === 'active' ? 'success' :
                                ad.status === 'paused' ? 'warning' :
                                ad.status === 'completed' ? 'primary' :
                                ad.status === 'archived' ? 'dark' : 'light'
                              }`}>
                                {ad.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Alert variant="info">
                    <i className="icofont-info-circle me-2"></i>
                    Aucune donnée disponible pour afficher les meilleures publicités.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/admin/advertisements/analytics',
        permanent: false,
      },
    };
  }
  
  // Vérifier si l'utilisateur est un administrateur
  if (session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  
  return {
    props: { session },
  };
}

export default AdvertisementAnalytics;
