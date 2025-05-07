
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import SellerLayout from '../../components/seller/SellerLayout';
import StatisticsCards from '../../components/seller/StatisticsCards';
import RecentOrdersTable from '../../components/seller/RecentOrdersTable';
import ProductPerformance from '../../components/seller/ProductPerformance';
import SalesChart from '../../components/seller/SalesChart';

const SellerDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas connecté
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/seller/dashboard');
      return;
    }

    // Vérifier si l'utilisateur est vendeur
    if (session && session.user && session.user.sellerStatus !== 'approved') {
      // Si l'utilisateur a une demande en attente ou rejetée
      if (session.user.sellerStatus === 'pending') {
        setError('Votre demande de compte vendeur est en cours d\'examen. Veuillez patienter.');
      } else if (session.user.sellerStatus === 'rejected') {
        setError('Votre demande de compte vendeur a été rejetée. Consultez votre email pour plus d\'informations.');
      } else if (session.user.sellerStatus === 'suspended') {
        setError('Votre compte vendeur a été suspendu. Contactez l\'administration pour plus d\'informations.');
      } else {
        router.push('/become-seller');
      }
    }

    // Charger les statistiques du vendeur
    if (session && session.user && session.user.sellerStatus === 'approved') {
      fetchSellerStats();
    }
  }, [session, status]);

  const fetchSellerStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seller/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message || 'Erreur lors du chargement des statistiques vendeur');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // État de chargement pendant la vérification de la session
  if (status === 'loading') {
    return (
      <SellerLayout>
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </Container>
      </SellerLayout>
    );
  }

  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <SellerLayout>
        <Container className="py-5">
          <Alert variant="warning">
            <Alert.Heading>Accès limité</Alert.Heading>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button variant="outline-primary" onClick={() => router.push('/')}>
                Retour à l'accueil
              </Button>
            </div>
          </Alert>
        </Container>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="mb-0">Tableau de bord Vendeur</h2>
            <p className="text-muted">Vue d'ensemble de votre boutique</p>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <StatisticsCards stats={stats} />
            
            <Row className="mb-4">
              <Col lg={8}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-white py-3">
                    <h5 className="mb-0">Évolution des ventes</h5>
                  </Card.Header>
                  <Card.Body>
                    <SalesChart data={stats?.salesData || []} />
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-white py-3">
                    <h5 className="mb-0">Performance des produits</h5>
                  </Card.Header>
                  <Card.Body>
                    <ProductPerformance products={stats?.topProducts || []} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col>
                <Card className="shadow-sm">
                  <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Commandes récentes</h5>
                    <Button variant="outline-primary" size="sm" onClick={() => router.push('/seller/orders')}>
                      Voir toutes les commandes
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <RecentOrdersTable orders={stats?.recentOrders || []} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </SellerLayout>
  );
};

export default SellerDashboard;
