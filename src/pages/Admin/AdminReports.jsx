import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';

let Line, Bar, Pie;
try {
  const ReactChartJS = require('react-chartjs-2');
  Line = ReactChartJS.Line;
  Bar = ReactChartJS.Bar;
  Pie = ReactChartJS.Pie;
} catch (error) {
  console.warn('Graphiques non disponibles', error);
  Line = function NoLineChart() { return <div>Graphique non chargé</div>; };
  Bar = function NoBarChart() { return <div>Graphique non chargé</div>; };
  Pie = function NoPieChart() { return <div>Graphique non chargé</div>; };
}
import PageHeader from '../../components/PageHeader';

// Enregistrer les composants de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

const AdminReports = () => {
  const [reportType, setReportType] = useState('ventes');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

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

  const renderReport = () => {
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
          </Row>
        );
      case 'clients':
        return (
          <Card className="shadow-sm">
            <Card.Header>Statistiques Clients</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Métrique</th>
                    <th>Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nouveaux clients</td>
                    <td>124</td>
                  </tr>
                  <tr>
                    <td>Clients actifs</td>
                    <td>456</td>
                  </tr>
                  <tr>
                    <td>Taux de rétention</td>
                    <td>68%</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeader title="Rapports" curPage="Admin / Rapports" />
      
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <Form.Select 
                  className="me-3" 
                  style={{width: '200px'}}
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="ventes">Rapport de Ventes</option>
                  <option value="clients">Rapport Clients</option>
                </Form.Select>
                <Form.Control 
                  type="date" 
                  className="me-3" 
                  style={{width: '150px'}}
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                />
                <Form.Control 
                  type="date" 
                  className="me-3" 
                  style={{width: '150px'}}
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                />
                <Button variant="primary">Générer</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {renderReport()}
      </Container>
    </div>
  );
};

export default AdminReports;
