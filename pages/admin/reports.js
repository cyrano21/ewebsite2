import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/PageHeader';

// Enregistrer les composants de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState('ventes');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données depuis l'API
    setIsLoading(true);
    
    // Remplacer ceci par un appel réel à votre API Next.js
    setTimeout(() => {
      const salesData = {
        labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Ventes mensuelles (€)',
          data: [1200, 1900, 3000, 5060, 4080, 6120],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
      
      const productCategoryData = {
        labels: ['Électronique', 'Mode', 'Livres', 'Sports'],
        datasets: [{
          data: [300, 50, 100, 200],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'
          ]
        }]
      };
      
      setReportData({ salesData, productCategoryData });
      setIsLoading(false);
    }, 1000);
    
    // Idéalement, vous feriez un appel API comme ceci:
    // fetch(`/api/reports?type=${reportType}&start=${dateRange.start}&end=${dateRange.end}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setReportData(data);
    //     setIsLoading(false);
    //   })
    //   .catch(error => {
    //     console.error('Erreur lors du chargement des rapports:', error);
    //     setIsLoading(false);
    //   });
    
  }, [reportType, dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  const renderReport = () => {
    if (isLoading || !reportData) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      );
    }
    
    const { salesData, productCategoryData } = reportData;
    
    switch(reportType) {
      case 'ventes':
        return (
          <Row>
            <Col md={8}>
              <Card className="shadow-sm mb-4">
                <Card.Header>Évolution des ventes</Card.Header>
                <Card.Body>
                  <Line data={salesData} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm mb-4">
                <Card.Header>Répartition par catégorie</Card.Header>
                <Card.Body>
                  <Pie data={productCategoryData} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={12}>
              <Card className="shadow-sm">
                <Card.Header>Détail des ventes par mois</Card.Header>
                <Card.Body>
                  <Table striped hover responsive>
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
                      <tr>
                        <td>Janvier</td>
                        <td>1200 €</td>
                        <td>48</td>
                        <td>25 €</td>
                        <td className="text-success">+5%</td>
                      </tr>
                      <tr>
                        <td>Février</td>
                        <td>1900 €</td>
                        <td>76</td>
                        <td>25 €</td>
                        <td className="text-success">+58%</td>
                      </tr>
                      <tr>
                        <td>Mars</td>
                        <td>3000 €</td>
                        <td>120</td>
                        <td>25 €</td>
                        <td className="text-success">+58%</td>
                      </tr>
                      <tr>
                        <td>Avril</td>
                        <td>5060 €</td>
                        <td>202</td>
                        <td>25 €</td>
                        <td className="text-success">+69%</td>
                      </tr>
                      <tr>
                        <td>Mai</td>
                        <td>4080 €</td>
                        <td>163</td>
                        <td>25 €</td>
                        <td className="text-danger">-19%</td>
                      </tr>
                      <tr>
                        <td>Juin</td>
                        <td>6120 €</td>
                        <td>244</td>
                        <td>25 €</td>
                        <td className="text-success">+50%</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      
      case 'produits':
        return (
          <Card className="shadow-sm">
            <Card.Header>Performance des produits</Card.Header>
            <Card.Body>
              <Bar 
                data={{
                  labels: ['Produit A', 'Produit B', 'Produit C', 'Produit D', 'Produit E'],
                  datasets: [{
                    label: 'Ventes unitaires',
                    data: [65, 59, 80, 81, 56],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  }]
                }} 
              />
            </Card.Body>
          </Card>
        );
        
      case 'clients':
        return (
          <Row>
            <Col md={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header>Nouveaux clients</Card.Header>
                <Card.Body>
                  <Line 
                    data={{
                      labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin'],
                      datasets: [{
                        label: 'Nouveaux clients',
                        data: [25, 36, 42, 51, 48, 62],
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1
                      }]
                    }} 
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header>Taux de fidélisation</Card.Header>
                <Card.Body>
                  <Line 
                    data={{
                      labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin'],
                      datasets: [{
                        label: 'Taux de fidélisation (%)',
                        data: [75, 72, 78, 82, 85, 83],
                        borderColor: 'rgb(153, 102, 255)',
                        tension: 0.1
                      }]
                    }} 
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
        
      default:
        return <div>Sélectionnez un type de rapport</div>;
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Rapports" curPage="Admin / Rapports" />
      
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
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Form.Group className="mb-3 w-100">
                    <Button variant="primary" className="w-100">
                      Générer
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
        
        {renderReport()}
      </Container>
    </AdminLayout>
  );
}
