
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Spinner, Container, Row, Col, Card } from 'react-bootstrap';
import SellerLayout from '../../components/seller/SellerLayout';
import Link from 'next/link';

export default function SellerIndex() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seulement rediriger les utilisateurs normaux, pas les administrateurs
    if (status === 'authenticated') {
      // Si c'est un admin, on le laisse accéder directement à cette page
      if (session?.user?.role === 'admin') {
        setLoading(false);
      } else {
        // Sinon on redirige vers le dashboard vendeur
        router.push('/seller/dashboard');
      }
    } else if (status === 'unauthenticated') {
      router.push('/login?redirect=/seller/dashboard');
    }
  }, [status, router, session]);

  return (
    <SellerLayout title="Espace Vendeur">
      {loading ? (
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </Container>
      ) : (
        <Container className="py-5">
          <h2 className="mb-4">Espace Vendeur - Accès Administrateur</h2>
          <p className="text-muted mb-4">En tant qu'administrateur, vous avez accès à toutes les fonctionnalités de l'espace vendeur.</p>
          
          <Row className="g-4">
            <Col lg={4} md={6}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-box bg-primary bg-opacity-10 rounded p-3 me-3">
                      <i className="icofont-dashboard-web fs-4 text-primary"></i>
                    </div>
                    <h5 className="mb-0">Tableau de bord</h5>
                  </div>
                  <p className="text-muted">Accédez aux statistiques de vente, performances et indicateurs clés.</p>
                  <Link href="/seller/dashboard" className="mt-auto btn btn-primary">
                    Accéder
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-box bg-success bg-opacity-10 rounded p-3 me-3">
                      <i className="icofont-shopping-cart fs-4 text-success"></i>
                    </div>
                    <h5 className="mb-0">Produits</h5>
                  </div>
                  <p className="text-muted">Gérez le catalogue de produits, ajoutez et modifiez les informations.</p>
                  <Link href="/seller/products" className="mt-auto btn btn-success">
                    Accéder
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-box bg-info bg-opacity-10 rounded p-3 me-3">
                      <i className="icofont-delivery-time fs-4 text-info"></i>
                    </div>
                    <h5 className="mb-0">Commandes</h5>
                  </div>
                  <p className="text-muted">Suivez et gérez les commandes, expéditions et remboursements.</p>
                  <Link href="/seller/orders" className="mt-auto btn btn-info">
                    Accéder
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-box bg-warning bg-opacity-10 rounded p-3 me-3">
                      <i className="icofont-users-alt-5 fs-4 text-warning"></i>
                    </div>
                    <h5 className="mb-0">Clients</h5>
                  </div>
                  <p className="text-muted">Consultez la base clients, gérez les retours et le service après-vente.</p>
                  <Link href="/seller/customers" className="mt-auto btn btn-warning">
                    Accéder
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-box bg-danger bg-opacity-10 rounded p-3 me-3">
                      <i className="icofont-chart-bar-graph fs-4 text-danger"></i>
                    </div>
                    <h5 className="mb-0">Analyses</h5>
                  </div>
                  <p className="text-muted">Explorez les analyses détaillées et rapports de performance.</p>
                  <Link href="/seller/analytics" className="mt-auto btn btn-danger">
                    Accéder
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-box bg-secondary bg-opacity-10 rounded p-3 me-3">
                      <i className="icofont-settings fs-4 text-secondary"></i>
                    </div>
                    <h5 className="mb-0">Paramètres</h5>
                  </div>
                  <p className="text-muted">Configurez les préférences du compte vendeur et options de paiement.</p>
                  <Link href="/seller/settings" className="mt-auto btn btn-secondary">
                    Accéder
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <div className="mt-5 text-center">
            <Link href="/admin" className="btn btn-outline-primary">
              Retour au tableau de bord administrateur
            </Link>
          </div>
        </Container>
      )}
    </SellerLayout>
  );
}
