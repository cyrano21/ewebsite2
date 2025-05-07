
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { FaFilter, FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import PageHeader from '../../components/PageHeader';

const TrafficAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [filterSource, setFilterSource] = useState('all');

  useEffect(() => {
    const fetchTrafficData = async () => {
      setIsLoading(true);
      try {
        // Ici, nous simulons des données pour la démo
        // Dans une implémentation réelle, vous feriez un appel API à
        // /api/admin/traffic-analytics avec les filtres dateRange et filterSource
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées
        const simulatedData = {
          overview: {
            totalVisits: 12458,
            uniqueVisitors: 5823,
            pageViews: 28945,
            bounceRate: 42.3,
            avgSessionDuration: '2m 38s',
            conversionRate: 3.2
          },
          sources: [
            { name: 'Direct', value: 40 },
            { name: 'Organic Search', value: 25 },
            { name: 'Social Media', value: 18 },
            { name: 'Referral', value: 12 },
            { name: 'Email', value: 5 }
          ],
          trends: {
            dates: Array.from({ length: 30 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
            }),
            visits: Array.from({ length: 30 }, () => Math.floor(Math.random() * 500 + 200)),
            pageViews: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1200 + 500))
          },
          topPages: [
            { path: '/', title: 'Page d\'accueil', views: 4852, avgTime: '1m 45s' },
            { path: '/shop', title: 'Boutique', views: 3219, avgTime: '2m 23s' },
            { path: '/shop/product/680d29d470a602604bdeb922', title: 'ULTRABOOST 22 SHOES', views: 2156, avgTime: '3m 12s' },
            { path: '/blog', title: 'Blog', views: 1893, avgTime: '1m 58s' },
            { path: '/contact', title: 'Contact', views: 1245, avgTime: '1m 12s' }
          ],
          deviceStats: [
            { type: 'Mobile', percentage: 62 },
            { type: 'Desktop', percentage: 32 },
            { type: 'Tablet', percentage: 6 }
          ],
          geoData: [
            { country: 'France', visits: 6234 },
            { country: 'États-Unis', visits: 2158 },
            { country: 'Allemagne', visits: 1258 },
            { country: 'Royaume-Uni', visits: 945 },
            { country: 'Canada', visits: 782 }
          ]
        };
        
        setTrafficData(simulatedData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données de trafic:', err);
        setError('Impossible de charger les données d\'analyse de trafic.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrafficData();
  }, [dateRange, filterSource]);

  // Préparer les données pour les graphiques
  const prepareChartData = () => {
    if (!trafficData) return null;

    // Données pour le graphique de tendances
    const trendsChartData = {
      labels: trafficData.trends.dates,
      datasets: [
        {
          label: 'Visites',
          data: trafficData.trends.visits,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Pages vues',
          data: trafficData.trends.pageViews,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3,
          fill: true
        }
      ]
    };

    // Données pour le graphique des sources
    const sourcesChartData = {
      labels: trafficData.sources.map(source => source.name),
      datasets: [
        {
          data: trafficData.sources.map(source => source.value),
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ],
          borderWidth: 1
        }
      ]
    };

    // Données pour le graphique des appareils
    const deviceChartData = {
      labels: trafficData.deviceStats.map(device => device.type),
      datasets: [
        {
          data: trafficData.deviceStats.map(device => device.percentage),
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderWidth: 1
        }
      ]
    };

    return {
      trendsChartData,
      sourcesChartData,
      deviceChartData
    };
  };

  const chartData = trafficData ? prepareChartData() : null;

  const handleExportData = () => {
    alert('Export de données initié (fonctionnalité à implémenter)');
    // Implémentation réelle: générer un CSV/Excel avec les données
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <PageHeader title="Analyse du trafic" curPage="Admin / Analyse du trafic" />
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p className="mt-3">Chargement des données d'analyse de trafic...</p>
        </Container>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <PageHeader title="Analyse du trafic" curPage="Admin / Analyse du trafic" />
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
      <PageHeader title="Analyse du trafic" curPage="Admin / Analyse du trafic" />
      
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
                  <Form.Group className="mb-2 mb-md-0">
                    <Form.Label>Source</Form.Label>
                    <Form.Select 
                      value={filterSource}
                      onChange={(e) => setFilterSource(e.target.value)}
                    >
                      <option value="all">Toutes les sources</option>
                      <option value="direct">Direct</option>
                      <option value="organic">Recherche organique</option>
                      <option value="social">Réseaux sociaux</option>
                      <option value="referral">Référencement</option>
                      <option value="email">Email</option>
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
          <Col lg={2} md={4} sm={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Visites totales</h6>
                <h2 className="mb-0 fw-bold">{trafficData.overview.totalVisits.toLocaleString()}</h2>
                <div className="small text-success">+12.3% vs période précédente</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Visiteurs uniques</h6>
                <h2 className="mb-0 fw-bold">{trafficData.overview.uniqueVisitors.toLocaleString()}</h2>
                <div className="small text-success">+8.7% vs période précédente</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Pages vues</h6>
                <h2 className="mb-0 fw-bold">{trafficData.overview.pageViews.toLocaleString()}</h2>
                <div className="small text-success">+15.1% vs période précédente</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Taux de rebond</h6>
                <h2 className="mb-0 fw-bold">{trafficData.overview.bounceRate}%</h2>
                <div className="small text-danger">+2.5% vs période précédente</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Durée moyenne</h6>
                <h2 className="mb-0 fw-bold">{trafficData.overview.avgSessionDuration}</h2>
                <div className="small text-success">+0.3% vs période précédente</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Conversion</h6>
                <h2 className="mb-0 fw-bold">{trafficData.overview.conversionRate}%</h2>
                <div className="small text-success">+0.8% vs période précédente</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Graphiques */}
        <Row className="mb-4 g-3">
          <Col lg={8}>
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Tendances du trafic</h5>
              </Card.Header>
              <Card.Body>
                {chartData && (
                  <div style={{ height: '300px' }}>
                    <Line 
                      data={chartData.trendsChartData}
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
            <Row className="h-100 g-3">
              <Col md={12} className="h-50">
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Sources de trafic</h5>
                  </Card.Header>
                  <Card.Body className="d-flex justify-content-center align-items-center">
                    {chartData && (
                      <div style={{ height: '130px', width: '100%' }}>
                        <Pie 
                          data={chartData.sourcesChartData}
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
              <Col md={12} className="h-50">
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Appareils</h5>
                  </Card.Header>
                  <Card.Body className="d-flex justify-content-center align-items-center">
                    {chartData && (
                      <div style={{ height: '130px', width: '100%' }}>
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
          </Col>
        </Row>

        {/* Tableaux de données */}
        <Row className="mb-4 g-3">
          <Col md={7}>
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Pages les plus visitées</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Vues</th>
                      <th>Temps moyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficData.topPages.map((page, index) => (
                      <tr key={index}>
                        <td>
                          <div>
                            <div className="fw-bold">{page.title}</div>
                            <small className="text-muted">{page.path}</small>
                          </div>
                        </td>
                        <td>{page.views.toLocaleString()}</td>
                        <td>{page.avgTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Répartition géographique</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Pays</th>
                      <th>Visites</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficData.geoData.map((geo, index) => (
                      <tr key={index}>
                        <td>{geo.country}</td>
                        <td>{geo.visits.toLocaleString()}</td>
                        <td>
                          {((geo.visits / trafficData.overview.totalVisits) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/admin/traffic-analytics',
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

export default TrafficAnalytics;
