import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Alert, Spinner, Modal } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { FaFileExcel, FaFilePdf, FaCalendarAlt, FaChartLine, FaExternalLinkAlt } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/PageHeader';
import { useRouter } from 'next/router';
import { CSVLink } from 'react-csv';

// Enregistrer les composants de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

export default function AdminReportsPage() {
  const router = useRouter();
  const [reportType, setReportType] = useState('ventes');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [csvData, setCsvData] = useState([]);

  // Récupérer les paramètres d'URL
  useEffect(() => {
    if (router.isReady) {
      const { type, start, end } = router.query;
      
      if (type && ['ventes', 'produits', 'clients'].includes(type)) {
        setReportType(type);
      }
      
      if (start && isValidDate(start)) {
        setDateRange(prev => ({ ...prev, start }));
      }
      
      if (end && isValidDate(end)) {
        setDateRange(prev => ({ ...prev, end }));
      }
    }
  }, [router.isReady, router.query]);

  // Fonction pour valider une date
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Charger les données du rapport
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          setError('Authentification requise. Veuillez vous connecter pour accéder aux rapports.');
          setIsLoading(false);
          return;
        }
        
        const response = await fetch(
          `/api/admin/reports?type=${reportType}&start=${dateRange.start}&end=${dateRange.end}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la récupération des données');
        }
        
        if (data.success) {
          setReportData(data);
          
          // Préparer les données pour l'export CSV
          prepareCsvData(data);
        } else {
          throw new Error(data.message || 'Erreur lors de la récupération des données');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des rapports:', error);
        setError(`Erreur: ${error.message || 'Une erreur est survenue'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReportData();
  }, [reportType, dateRange]);

  // Préparer les données pour l'export CSV
  const prepareCsvData = (data) => {
    let csvRows = [];
    
    if (reportType === 'ventes' && data.monthlyDetails) {
      csvRows = [
        ['Mois', 'Ventes (€)', 'Commandes', 'Panier moyen (€)', 'Croissance (%)'],
        ...data.monthlyDetails.map(item => [
          item.month,
          item.total,
          item.count,
          item.averageBasket,
          item.growth
        ])
      ];
    } else if (reportType === 'produits' && data.topProducts) {
      csvRows = [
        ['Produit', 'Quantité vendue', 'Revenu (€)'],
        ...data.topProducts.map(item => [
          item.name,
          item.quantity,
          item.revenue.toFixed(2)
        ])
      ];
    } else if (reportType === 'clients' && data.customerStats) {
      // Préparer les données des nouveaux clients par mois
      const newCustomers = data.newCustomersData?.labels.map((month, index) => [
        month,
        data.newCustomersData.datasets[0].data[index]
      ]) || [];
      
      csvRows = [
        ['Statistiques clients'],
        ['Total clients', data.customerStats.totalCustomers],
        ['Clients fidèles', data.customerStats.repeatCustomers],
        ['Taux de fidélisation (%)', data.customerStats.retentionRate],
        [],
        ['Mois', 'Nouveaux clients'],
        ...newCustomers
      ];
    }
    
    setCsvData(csvRows);
  };

  // Gérer le changement de date
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  // Générer le rapport avec les filtres actuels
  const handleGenerateReport = () => {
    // Mettre à jour l'URL avec les paramètres de filtre
    router.push({
      pathname: router.pathname,
      query: { 
        type: reportType,
        start: dateRange.start,
        end: dateRange.end
      }
    }, undefined, { shallow: true });
    
    // La mise à jour des données sera déclenchée par l'effet useEffect qui surveille les changements de reportType et dateRange
  };

  // Afficher les détails d'un élément
  const handleShowDetail = (data) => {
    setDetailData(data);
    setShowDetailModal(true);
  };

  // Formatter une valeur monétaire
  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    });
  };

  // Rendu du rapport en fonction du type sélectionné
  const renderReport = () => {
    if (isLoading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p className="mt-3">Chargement des données du rapport...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Erreur lors du chargement des données</Alert.Heading>
          <p>{error}</p>
        </Alert>
      );
    }
    
    if (!reportData) {
      return (
        <Alert variant="info">
          <Alert.Heading>Aucune donnée disponible</Alert.Heading>
          <p>Veuillez sélectionner un type de rapport et une plage de dates, puis cliquez sur "Générer".</p>
        </Alert>
      );
    }
    
    switch(reportType) {
      case 'ventes':
        return (
          <Row>
            <Col md={8}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Évolution des ventes</h5>
                  {reportData.salesData && (
                    <CSVLink 
                      data={csvData}
                      filename={`rapport-ventes-${dateRange.start}-${dateRange.end}.csv`}
                      className="btn btn-sm btn-outline-success"
                    >
                      <FaFileExcel className="me-1" /> Exporter
                    </CSVLink>
                  )}
                </Card.Header>
                <Card.Body>
                  {reportData.salesData ? (
                    <Line data={reportData.salesData} options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `Ventes: ${formatCurrency(context.raw)}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          ticks: {
                            callback: function(value) {
                              return formatCurrency(value);
                            }
                          }
                        }
                      }
                    }} />
                  ) : (
                    <p className="text-center">Aucune donnée de vente disponible pour cette période.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">Répartition par catégorie</h5>
                </Card.Header>
                <Card.Body>
                  {reportData.productCategoryData && reportData.productCategoryData.labels.length > 0 ? (
                    <Pie data={reportData.productCategoryData} options={{
                      responsive: true,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }} />
                  ) : (
                    <p className="text-center">Aucune donnée de catégorie disponible.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={12}>
              <Card className="shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Détail des ventes par mois</h5>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Mois</th>
                          <th>Ventes (€)</th>
                          <th>Commandes</th>
                          <th>Panier moyen</th>
                          <th>Croissance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.monthlyDetails && reportData.monthlyDetails.length > 0 ? (
                          reportData.monthlyDetails.map((item, index) => (
                            <tr key={index}>
                              <td>{item.month}</td>
                              <td>{formatCurrency(item.total)}</td>
                              <td>{item.count}</td>
                              <td>{formatCurrency(item.averageBasket)}</td>
                              <td className={item.growth > 0 ? "text-success" : (item.growth < 0 ? "text-danger" : "")}>
                                {item.growth > 0 ? '+' : ''}{item.growth}%
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">Aucune donnée disponible pour cette période</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      
      case 'produits':
        return (
          <Row>
            <Col md={12}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Performance des produits</h5>
                  {reportData.topProducts && (
                    <CSVLink 
                      data={csvData}
                      filename={`rapport-produits-${dateRange.start}-${dateRange.end}.csv`}
                      className="btn btn-sm btn-outline-success"
                    >
                      <FaFileExcel className="me-1" /> Exporter
                    </CSVLink>
                  )}
                </Card.Header>
                <Card.Body>
                  {reportData.productData ? (
                    <Bar 
                      data={reportData.productData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                if (context.dataset.label === 'Revenus (€)') {
                                  return `Revenus: ${formatCurrency(context.raw)}`;
                                }
                                return `${context.dataset.label}: ${context.raw}`;
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            ticks: {
                              autoSkip: false,
                              maxRotation: 45,
                              minRotation: 45
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Quantité vendue'
                            }
                          },
                          revenue: {
                            position: 'right',
                            title: {
                              display: true,
                              text: 'Revenus (€)'
                            },
                            ticks: {
                              callback: function(value) {
                                return formatCurrency(value);
                              }
                            },
                            grid: {
                              drawOnChartArea: false,
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <p className="text-center">Aucune donnée de produit disponible pour cette période.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={12}>
              <Card className="shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Top produits vendus</h5>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Produit</th>
                          <th>Quantité vendue</th>
                          <th>Revenus</th>
                          <th>Prix moyen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.topProducts && reportData.topProducts.length > 0 ? (
                          reportData.topProducts.map((product, index) => (
                            <tr key={product.id}>
                              <td>{index + 1}</td>
                              <td>{product.name}</td>
                              <td>{product.quantity}</td>
                              <td>{formatCurrency(product.revenue)}</td>
                              <td>{formatCurrency(product.revenue / product.quantity)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">Aucun produit vendu durant cette période</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
        
      case 'clients':
        return (
          <Row>
            <Col md={12} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Statistiques clients</h5>
                  {reportData.customerStats && (
                    <CSVLink 
                      data={csvData}
                      filename={`rapport-clients-${dateRange.start}-${dateRange.end}.csv`}
                      className="btn btn-sm btn-outline-success"
                    >
                      <FaFileExcel className="me-1" /> Exporter
                    </CSVLink>
                  )}
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <div className="border rounded p-3 text-center mb-3">
                        <h3>{reportData.customerStats?.totalCustomers || 0}</h3>
                        <p className="text-muted mb-0">Clients uniques</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="border rounded p-3 text-center mb-3">
                        <h3>{reportData.customerStats?.repeatCustomers || 0}</h3>
                        <p className="text-muted mb-0">Clients fidèles (&gt;1 commande)</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="border rounded p-3 text-center mb-3">
                        <h3>{reportData.customerStats?.retentionRate || 0}%</h3>
                        <p className="text-muted mb-0">Taux de fidélisation</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">Nouveaux clients</h5>
                </Card.Header>
                <Card.Body>
                  {reportData.newCustomersData ? (
                    <Line 
                      data={reportData.newCustomersData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        }
                      }}
                    />
                  ) : (
                    <p className="text-center">Aucune donnée disponible pour cette période.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">Taux de fidélisation</h5>
                </Card.Header>
                <Card.Body>
                  {reportData.retentionData ? (
                    <Line 
                      data={reportData.retentionData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.dataset.label}: ${context.raw}%`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            min: 0,
                            max: 100,
                            ticks: {
                              callback: function(value) {
                                return `${value}%`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <p className="text-center">Aucune donnée disponible pour cette période.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
        
      default:
        return (
          <Alert variant="warning">
            <Alert.Heading>Type de rapport non reconnu</Alert.Heading>
            <p>Veuillez sélectionner un type de rapport valide.</p>
          </Alert>
        );
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Rapports d'activité" curPage="Admin / Rapports" />
      
      <Container fluid className="py-4">
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Form>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type de rapport</Form.Label>
                    <Form.Select 
                      value={reportType} 
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option value="ventes">Rapport des ventes</option>
                      <option value="produits">Performance des produits</option>
                      <option value="clients">Analyse clients</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date de début</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="start"
                      value={dateRange.start}
                      onChange={handleDateChange}
                      max={dateRange.end}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date de fin</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="end"
                      value={dateRange.end}
                      onChange={handleDateChange}
                      min={dateRange.start}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Form.Group className="mb-3 w-100">
                    <Button 
                      variant="primary" 
                      className="w-100"
                      onClick={handleGenerateReport}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-1"
                          />
                          Chargement...
                        </>
                      ) : (
                        <>
                          <FaChartLine className="me-1" /> Générer
                        </>
                      )}
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm" onClick={() => {
                      const today = new Date();
                      const lastMonth = new Date();
                      lastMonth.setMonth(today.getMonth() - 1);
                      setDateRange({
                        start: lastMonth.toISOString().split('T')[0],
                        end: today.toISOString().split('T')[0]
                      });
                    }}>
                      <FaCalendarAlt className="me-1" /> 30 derniers jours
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => {
                      const today = new Date();
                      const firstDayYear = new Date(today.getFullYear(), 0, 1);
                      setDateRange({
                        start: firstDayYear.toISOString().split('T')[0],
                        end: today.toISOString().split('T')[0]
                      });
                    }}>
                      <FaCalendarAlt className="me-1" /> Année en cours
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => {
                      const today = new Date();
                      const lastYear = new Date();
                      lastYear.setFullYear(today.getFullYear() - 1);
                      setDateRange({
                        start: lastYear.toISOString().split('T')[0],
                        end: today.toISOString().split('T')[0]
                      });
                    }}>
                      <FaCalendarAlt className="me-1" /> 12 derniers mois
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
        
        {renderReport()}
      </Container>
      
      {/* Modal pour afficher les détails */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails {detailData?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailData && (
            <div>
              <p>Contenu détaillé ici...</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}
