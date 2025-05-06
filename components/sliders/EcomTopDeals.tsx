import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

// Composant temporaire pour résoudre l'erreur de build
const EcomTopDeals = ({ products = [] }) => {
  return (
    <Card className="h-100">
      <Card.Header>
        <h3 className="mb-0">Meilleures offres</h3>
      </Card.Header>
      <Card.Body>
        {products.length > 0 ? (
          <Row className="g-3">
            {products.map((product, index) => (
              <Col key={index} xs={6} md={4} lg={3}>
                <Card className="h-100 product-card">
                  <div className="text-center p-2">
                    <div style={{ height: '120px', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="text-muted">Image du produit</span>
                    </div>
                    <Card.Body className="p-2">
                      <h5 className="fs-6 text-truncate">{product.name || `Produit ${index + 1}`}</h5>
                      <p className="fs-5 mb-0 fw-bold text-primary">{product.price || '€19.99'}</p>
                    </Card.Body>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center my-5">Aucune offre disponible pour le moment.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default EcomTopDeals;