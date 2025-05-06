
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

const LoyaltyDashboard = () => {
  const { data: session } = useSession();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!session) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/loyalty');
        const data = await response.json();
        
        if (data.success) {
          setLoyaltyData(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Erreur lors du chargement des données de fidélité');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoyaltyData();
  }, [session]);
  
  // Déterminer le niveau de fidélité en fonction des points
  const getLoyaltyTier = (points) => {
    if (points >= 1000) return { name: 'Platine', color: '#e5e4e2', nextThreshold: null, progress: 100 };
    if (points >= 500) return { name: 'Or', color: '#ffd700', nextThreshold: 1000, progress: (points - 500) / 5 };
    if (points >= 200) return { name: 'Argent', color: '#c0c0c0', nextThreshold: 500, progress: (points - 200) / 3 };
    if (points >= 50) return { name: 'Bronze', color: '#cd7f32', nextThreshold: 200, progress: (points - 50) / 1.5 };
    return { name: 'Débutant', color: '#6c757d', nextThreshold: 50, progress: points * 2 };
  };
  
  if (loading) {
    return (
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement de votre programme de fidélité...</p>
        </Card.Body>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Erreur</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }
  
  if (!loyaltyData) {
    return (
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <p>Veuillez vous connecter pour voir votre programme de fidélité.</p>
        </Card.Body>
      </Card>
    );
  }
  
  const loyaltyTier = getLoyaltyTier(loyaltyData.points);
  
  return (
    <div className="loyalty-dashboard">
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-primary text-white py-3">
          <h4 className="mb-0">Programme de Fidélité</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={5} className="mb-3 mb-md-0">
              <div className="tier-card p-4 rounded" style={{ backgroundColor: `${loyaltyTier.color}20` }}>
                <h3 className="mb-1">Niveau: <span style={{ color: loyaltyTier.color }}>{loyaltyTier.name}</span></h3>
                <h2 className="mb-4 display-4 fw-bold text-primary">{loyaltyData.points} points</h2>
                
                {loyaltyTier.nextThreshold && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>Prochain niveau: {loyaltyTier.nextThreshold} points</span>
                      <span>{loyaltyTier.progress.toFixed(0)}%</span>
                    </div>
                    <ProgressBar 
                      now={loyaltyTier.progress} 
                      variant={loyaltyTier.progress > 66 ? "success" : loyaltyTier.progress > 33 ? "info" : "primary"} 
                      className="mb-2" 
                    />
                    <small className="text-muted">
                      Plus que {loyaltyTier.nextThreshold - loyaltyData.points} points pour atteindre le niveau suivant
                    </small>
                  </div>
                )}
                
                <p className="mt-2 mb-0">
                  <i className="icofont-check-circled text-success me-1"></i>
                  Total cumulé: <strong>{loyaltyData.totalEarned} points</strong>
                </p>
                <p className="mb-0">
                  <i className="icofont-money text-warning me-1"></i>
                  Total utilisé: <strong>{loyaltyData.totalSpent} points</strong>
                </p>
              </div>
            </Col>
            <Col md={7}>
              <h5 className="mb-3">Avantages de votre niveau</h5>
              <div className="benefits-list">
                {loyaltyTier.name === 'Débutant' && (
                  <>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-star text-primary me-2"></i>
                      <div>
                        <p className="mb-0">1 point pour chaque euro dépensé</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-gift text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Cadeau d'anniversaire</p>
                      </div>
                    </div>
                  </>
                )}
                
                {loyaltyTier.name === 'Bronze' && (
                  <>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-star text-primary me-2"></i>
                      <div>
                        <p className="mb-0">1,2 points pour chaque euro dépensé</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-gift text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Cadeau d'anniversaire</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-truck text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Livraison offerte une fois par mois</p>
                      </div>
                    </div>
                  </>
                )}
                
                {loyaltyTier.name === 'Argent' && (
                  <>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-star text-primary me-2"></i>
                      <div>
                        <p className="mb-0">1,5 points pour chaque euro dépensé</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-gift text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Cadeau d'anniversaire amélioré</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-truck text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Livraison offerte quatre fois par mois</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-sale-discount text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Remise exclusive de 5% sur les produits sélectionnés</p>
                      </div>
                    </div>
                  </>
                )}
                
                {loyaltyTier.name === 'Or' && (
                  <>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-star text-primary me-2"></i>
                      <div>
                        <p className="mb-0">2 points pour chaque euro dépensé</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-gift text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Cadeau d'anniversaire premium</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-truck text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Livraison offerte illimitée</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-sale-discount text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Remise exclusive de 10% sur les produits sélectionnés</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-headphone-alt text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Service client prioritaire</p>
                      </div>
                    </div>
                  </>
                )}
                
                {loyaltyTier.name === 'Platine' && (
                  <>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-star text-primary me-2"></i>
                      <div>
                        <p className="mb-0">2,5 points pour chaque euro dépensé</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-gift text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Cadeaux exclusifs trimestriels</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-truck text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Livraison express illimitée</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-sale-discount text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Remise exclusive de 15% sur toute la boutique</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-headphone-alt text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Conseiller personnel dédié</p>
                      </div>
                    </div>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="icofont-crown text-primary me-2"></i>
                      <div>
                        <p className="mb-0">Accès aux ventes privées</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
          
          <div className="mt-4">
            <h5 className="mb-3">Historique récent des points</h5>
            <div className="table-responsive">
              <Table hover className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Points</th>
                    <th>Type</th>
                    <th>Détails</th>
                  </tr>
                </thead>
                <tbody>
                  {loyaltyData.history.slice(0, 5).map((item, index) => (
                    <tr key={index}>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className={item.amount > 0 ? 'text-success' : 'text-danger'}>
                        {item.amount > 0 ? `+${item.amount}` : item.amount}
                      </td>
                      <td>
                        {item.type === 'earned' && <Badge bg="success">Gagné</Badge>}
                        {item.type === 'spent' && <Badge bg="warning">Utilisé</Badge>}
                        {item.type === 'expired' && <Badge bg="danger">Expiré</Badge>}
                        {item.type === 'bonus' && <Badge bg="info">Bonus</Badge>}
                      </td>
                      <td>{item.reason}</td>
                    </tr>
                  ))}
                  
                  {loyaltyData.history.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Aucun historique disponible
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            
            {loyaltyData.history.length > 5 && (
              <div className="text-end">
                <Button variant="outline-primary" size="sm">
                  Voir tout l'historique
                </Button>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoyaltyDashboard;
