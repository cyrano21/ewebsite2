
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Alert, Spinner, Dropdown } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { FaFilter, FaDownload, FaExclamationTriangle, FaEye, FaFilePdf } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';

const TransactionsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        // Ici, nous simulons des données pour la démo
        // Dans une implémentation réelle, vous feriez un appel API à
        // /api/admin/transactions avec les filtres dateRange et statusFilter
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées
        const statuses = ['Complétée', 'En attente', 'Échouée', 'Remboursée'];
        const paymentMethods = ['Carte de crédit', 'PayPal', 'Virement bancaire', 'Paiement à la livraison'];
        
        const simulatedTransactions = Array.from({ length: 50 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));
          
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const amount = (Math.random() * 500 + 20).toFixed(2);
          
          return {
            id: `TRX-${(1000 + i).toString().padStart(6, '0')}`,
            date: date.toISOString(),
            customer: {
              id: `USR-${(2000 + i).toString().padStart(4, '0')}`,
              name: `Client ${i + 1}`,
              email: `client${i + 1}@example.com`
            },
            amount: parseFloat(amount),
            status,
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            orderId: `ORD-${(3000 + i).toString().padStart(6, '0')}`,
            items: Math.floor(Math.random() * 5) + 1,
            fees: parseFloat((amount * 0.029).toFixed(2)),
            net: parseFloat((amount * 0.971).toFixed(2))
          };
        });
        
        // Filtrer par statut si nécessaire
        const filteredTransactions = statusFilter === 'all' 
          ? simulatedTransactions 
          : simulatedTransactions.filter(t => t.status.toLowerCase() === statusFilter.toLowerCase());
        
        // Trier par date (plus récente en premier)
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setTransactions(filteredTransactions);
        
        // Calculer les statistiques
        const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
        const completedTransactions = filteredTransactions.filter(t => t.status === 'Complétée');
        const totalCompleted = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        // Données pour le graphique de tendances
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 29 + i);
          return date.toISOString().split('T')[0];
        });
        
        const dailyAmounts = last30Days.map(day => {
          const dayTransactions = filteredTransactions.filter(t => 
            t.date.split('T')[0] === day && t.status === 'Complétée'
          );
          return dayTransactions.reduce((sum, t) => sum + t.amount, 0);
        });
        
        setStats({
          totalTransactions: filteredTransactions.length,
          totalAmount,
          totalCompleted,
          successRate: completedTransactions.length / filteredTransactions.length * 100,
          averageAmount: totalAmount / filteredTransactions.length,
          chartData: {
            labels: last30Days.map(day => {
              const date = new Date(day);
              return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
            }),
            data: dailyAmounts
          }
        });
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des transactions:', err);
        setError('Impossible de charger les données de transactions.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [dateRange, statusFilter]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Complétée': return 'success';
      case 'En attente': return 'warning';
      case 'Échouée': return 'danger';
      case 'Remboursée': return 'info';
      default: return 'secondary';
    }
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
  };

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

  const handleExportData = () => {
    alert('Export de données initié (fonctionnalité à implémenter)');
    // Implémentation réelle: générer un CSV/Excel avec les données
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(2)} €`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' €';
          }
        }
      }
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <PageHeader title="Transactions" curPage="Admin / Transactions" />
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p className="mt-3">Chargement des données de transactions...</p>
        </Container>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <PageHeader title="Transactions" curPage="Admin / Transactions" />
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
      <PageHeader title="Transactions" curPage="Admin / Transactions" />
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
                    <Form.Label>Statut</Form.Label>
                    <Form.Select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="complétée">Complétée</option>
                      <option value="en attente">En attente</option>
                      <option value="échouée">Échouée</option>
                      <option value="remboursée">Remboursée</option>
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
              <Card.Body className="text-center">
                <h6 className="text-muted">Total des transactions</h6>
                <h2 className="mb-0 fw-bold">{stats.totalTransactions}</h2>
                <div className="small text-success">+5.2% vs période précédente</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Montant total</h6>
                <h2 className="mb-0 fw-bold">{stats.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</h2>
                <div className="small text-success">+8.7% vs période précédente</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Taux de réussite</h6>
                <h2 className="mb-0 fw-bold">{stats.successRate.toFixed(1)}%</h2>
                <div className="small text-success">+1.3% vs période précédente</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Montant moyen</h6>
                <h2 className="mb-0 fw-bold">{stats.averageAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</h2>
                <div className="small text-success">+3.5% vs période précédente</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Graphique de tendances */}
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white">
            <h5 className="mb-0">Tendance des transactions</h5>
          </Card.Header>
          <Card.Body>
            <div style={{ height: '300px' }}>
              <Line
                data={{
                  labels: stats.chartData.labels,
                  datasets: [
                    {
                      data: stats.chartData.data,
                      borderColor: 'rgba(54, 162, 235, 1)',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      tension: 0.3,
                      fill: true
                    }
                  ]
                }}
                options={chartOptions}
              />
            </div>
          </Card.Body>
        </Card>

        {/* Liste des transactions */}
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Liste des transactions</h5>
            <span className="text-muted">Total: {transactions.length} transactions</span>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Commande</th>
                  <th>Montant</th>
                  <th>Méthode</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 15).map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="text-nowrap">
                      <span className="fw-bold">{transaction.id}</span>
                    </td>
                    <td className="text-nowrap">{formatDate(transaction.date)}</td>
                    <td>
                      <div className="text-nowrap">
                        <span className="fw-bold">{transaction.customer.name}</span><br />
                        <small>{transaction.customer.email}</small>
                      </div>
                    </td>
                    <td>
                      <Link
                        href={`/admin/orders#${transaction.orderId}`}
                        className="text-decoration-none"
                        legacyBehavior>
                        {transaction.orderId}
                      </Link>
                      <small className="text-muted d-block">{transaction.items} article(s)</small>
                    </td>
                    <td className="text-nowrap">
                      <div>
                        <span className="fw-bold">{transaction.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                        <small className="text-muted d-block">Net: {transaction.net.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</small>
                      </div>
                    </td>
                    <td className="text-nowrap">{transaction.paymentMethod}</td>
                    <td>
                      <Badge bg={getStatusBadgeVariant(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${transaction.id}`}>
                          Actions
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleViewTransaction(transaction)}>
                            <FaEye className="me-2" /> Voir détails
                          </Dropdown.Item>
                          <Dropdown.Item href={`/admin/orders#${transaction.orderId}`}>
                            <FaEye className="me-2" /> Voir commande
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <FaFilePdf className="me-2" /> Facture
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
          <Card.Footer className="bg-white text-center">
            <Button variant="outline-primary" size="sm">
              Voir toutes les transactions
            </Button>
          </Card.Footer>
        </Card>
      </Container>
      {/* Modal de détails de transaction */}
      {selectedTransaction && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedTransaction(null)}
        >
          <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails de la transaction {selectedTransaction.id}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedTransaction(null)}
                ></button>
              </div>
              <div className="modal-body">
                <Row>
                  <Col md={6}>
                    <h6>Informations de transaction</h6>
                    <Table>
                      <tbody>
                        <tr>
                          <td className="fw-bold">ID</td>
                          <td>{selectedTransaction.id}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Date</td>
                          <td>{formatDate(selectedTransaction.date)}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Statut</td>
                          <td>
                            <Badge bg={getStatusBadgeVariant(selectedTransaction.status)}>
                              {selectedTransaction.status}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Méthode</td>
                          <td>{selectedTransaction.paymentMethod}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Commande</td>
                          <td>{selectedTransaction.orderId}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <h6>Détails financiers</h6>
                    <Table>
                      <tbody>
                        <tr>
                          <td className="fw-bold">Montant</td>
                          <td>{selectedTransaction.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Frais</td>
                          <td>{selectedTransaction.fees.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Net</td>
                          <td>{selectedTransaction.net.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                        </tr>
                      </tbody>
                    </Table>

                    <h6 className="mt-4">Informations client</h6>
                    <Table>
                      <tbody>
                        <tr>
                          <td className="fw-bold">Nom</td>
                          <td>{selectedTransaction.customer.name}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Email</td>
                          <td>{selectedTransaction.customer.email}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">ID Client</td>
                          <td>{selectedTransaction.customer.id}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setSelectedTransaction(null)}>
                  Fermer
                </Button>
                <Button variant="primary">
                  <FaFilePdf className="me-2" /> Télécharger la facture
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/admin/transactions',
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

export default TransactionsPage;
