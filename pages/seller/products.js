import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import SellerLayout from '../../components/seller/SellerLayout';
import ClientOnly from '../../utils/ClientOnly';

export default function SellerProducts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérification de l'authentification
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent(router.asPath));
      return;
    }

    // Si authentifié, charger les produits du vendeur
    if (status === 'authenticated') {
      fetchSellerProducts();
    }
  }, [status, router]);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seller/products');

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        throw new Error('Erreur lors du chargement des produits');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    router.push(`/seller/products/${productId}`);
  };

  return (
    <SellerLayout title="Gestion des Produits">
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="h3 mb-0">Gestion des Produits</h1>
            <p className="text-muted">Gérez tous vos produits en vente</p>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={() => router.push('/seller/products/new')}>
              <i className="icofont-plus me-1"></i> Ajouter un produit
            </Button>
          </Col>
        </Row>

        <Card>
          <Card.Body>
            <ClientOnly fallback={
              <div className="text-center py-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </Spinner>
              </div>
            }>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </Spinner>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-4">
                  <p>Vous n'avez pas encore de produits.</p>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => router.push('/seller/products/new')}
                  >
                    Ajouter votre premier produit
                  </Button>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Nom</th>
                      <th>Prix</th>
                      <th>Stock</th>
                      <th>Catégorie</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <img 
                            src={product.img || '/assets/images/shop/placeholder.jpg'} 
                            alt={product.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            onError={(e) => {e.target.src = '/assets/images/shop/placeholder.jpg'}}
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.price.toFixed(2)} €</td>
                        <td>{product.stock || 0}</td>
                        <td>{product.category}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2" 
                            onClick={() => handleEdit(product.id)}
                          >
                            <i className="icofont-edit"></i>
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                          >
                            <i className="icofont-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </ClientOnly>
          </Card.Body>
        </Card>
      </Container>
    </SellerLayout>
  );
}