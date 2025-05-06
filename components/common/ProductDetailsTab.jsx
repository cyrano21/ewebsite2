import React, { useState, useEffect } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import Rating from 'components/common/Rating';
import { useRouter } from 'next/router';

const ProductDetailsTab = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Utiliser l'ID passé en prop ou celui de l'URL
  const id = productId || router.query.id;

  // Protéger contre les erreurs côté serveur (SSR)
  const isClient = typeof window !== 'undefined';

  useEffect(() => {
    // Ne s'exécute que côté client et si ID existe
    if (!isClient || !id) return;
    
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${id}/reviews`);
        const data = await response.json();
        
        if (data.success) {
          // Filtre côté client pour garantir que seuls les avis approuvés sont affichés
          const filteredReviews = data.data.filter(r => r.approved);
          setReviews(filteredReviews);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des avis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id, isClient]);

  return (
    <Tab.Container defaultActiveKey="description">
      <Nav className="nav-tabs mb-4">
        <Nav.Item>
          <Nav.Link eventKey="description">Description</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="specifications">Spécifications</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="reviews">
            Avis ({reviews.length})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Tab.Content>
        <Tab.Pane eventKey="description">
          <div className="mb-4">
            <h4>Description du produit</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </Tab.Pane>
        
        <Tab.Pane eventKey="specifications">
          <div className="mb-4">
            <h4>Spécifications techniques</h4>
            <table className="table">
              <tbody>
                <tr>
                  <th style={{ width: '30%' }}>Dimensions</th>
                  <td>30 x 20 x 10 cm</td>
                </tr>
                <tr>
                  <th>Poids</th>
                  <td>1.5 kg</td>
                </tr>
                <tr>
                  <th>Couleur</th>
                  <td>Noir / Blanc / Rouge</td>
                </tr>
                <tr>
                  <th>Matériaux</th>
                  <td>Aluminium, Plastique</td>
                </tr>
                <tr>
                  <th>Garantie</th>
                  <td>2 ans</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Tab.Pane>
        
        <Tab.Pane eventKey="reviews">
          <div className="mb-4">
            <h4>Avis clients</h4>
            
            {loading ? (
              <p>Chargement des avis...</p>
            ) : reviews.length === 0 ? (
              <p>Aucun avis pour ce produit.</p>
            ) : (
              <div>
                {reviews.map(review => (
                  <div key={review._id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <strong>{review.user ? review.user.name : 'Anonyme'}</strong>
                      <span className="ms-2 text-muted">
                        {new Date(review.date || review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mb-2">
                      <Rating value={review.rating} />
                    </div>
                    <p>{review.comment || review.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
};

export default ProductDetailsTab;