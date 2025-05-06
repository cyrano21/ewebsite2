import { useState, useEffect, useContext } from 'react';
import { Table, Button, Badge, Container, Row, Col, Card } from 'react-bootstrap';
import AdminLayout from '../../components/admin/AdminLayout';
import Head from 'next/head';
import { AuthContext } from '../../contexts/AuthProvider';

const AdminReviews = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        setLoading(true);
        
        // Récupérer le token JWT du localStorage
        const token = localStorage.getItem('auth-token');
        
        if (!token) {
          setError('Authentification requise');
          setLoading(false);
          return;
        }
        
        const res = await fetch('/api/admin/pending-reviews', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await res.json();
        
        if (data.success) {
          setPendingReviews(data.data);
        } else {
          setError(data.message || 'Erreur lors de la récupération des avis');
        }
      } catch (error) {
        setError('Erreur lors de la récupération des avis');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    // Vérifier si l'utilisateur est connecté avant de faire l'appel API
    if (user && user.role === 'admin') {
      fetchPendingReviews();
    } else {
      setError('Accès réservé aux administrateurs');
      setLoading(false);
    }
  }, [user]);

  const handleApproveReview = async (productId, reviewId) => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews/${reviewId}/approve`, {
        method: 'PUT'
      });
      
      if (res.ok) {
        // Mettre à jour la liste des avis après approbation
        setPendingReviews(pendingReviews.filter(review => review._id !== reviewId));
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation de l\'avis:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Avis en attente | Administration</title>
      </Head>
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h1>Avis en attente de validation</h1>
            <p className="text-muted">
              Gérez ici les avis clients qui nécessitent une validation avant publication.
            </p>
          </Col>
        </Row>

        <Card>
          <Card.Body>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : pendingReviews.length === 0 ? (
              <div className="alert alert-info">Aucun avis en attente de validation</div>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Note</th>
                    <th>Commentaire</th>
                    <th>Utilisateur</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingReviews.map(review => (
                    <tr key={review._id}>
                      <td>
                        <a href={`/shop/product/${review.productSlug}`} target="_blank" rel="noopener noreferrer">
                          {review.productName}
                        </a>
                      </td>
                      <td>
                        <Badge bg={
                          review.rating >= 4 ? 'success' : 
                          review.rating >= 3 ? 'warning' : 'danger'
                        }>
                          {review.rating}/5
                        </Badge>
                      </td>
                      <td>{review.comment}</td>
                      <td>{review.user?.name || 'Utilisateur inconnu'}</td>
                      <td>{formatDate(review.date)}</td>
                      <td>
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleApproveReview(review.productId, review._id)}
                        >
                          Approuver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </AdminLayout>
  );
};

export default AdminReviews;