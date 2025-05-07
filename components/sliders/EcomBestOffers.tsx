import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Link from 'next/link';

interface EcomBestOffersProps {
  products: any[];
  className?: string;
}

const EcomBestOffers: React.FC<EcomBestOffersProps> = ({ products = [], className = '' }) => {
  return (
    <Card className={`h-100 ${className}`}>
      <Card.Header className="d-flex justify-content-between align-items-center bg-light">
        <h3 className="mb-0">Meilleures Promotions</h3>
        <Link href="/customer/products/offers" className="btn btn-sm btn-outline-primary">
          Voir tout
        </Link>
      </Card.Header>
      <Card.Body>
        {products.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted mb-0">Aucune promotion disponible pour le moment</p>
          </div>
        ) : (
          <Row className="g-3">
            {products.slice(0, 8).map((product, index) => (
              <Col key={product.id || index} xs={12} sm={6} md={3}>
                <Card className="h-100 product-card">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={product.image || '/assets/img/e-commerce/product-placeholder.png'}
                      alt={product.name}
                      className="product-image"
                    />
                    {product.discount && (
                      <div className="position-absolute top-0 start-0 m-2 badge bg-danger">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <Card.Body>
                    <h6 className="mb-1 text-truncate">{product.name}</h6>
                    <div className="d-flex align-items-center">
                      <span className="fw-bold me-2">
                        {product.price?.toFixed(2)}€
                      </span>
                      {product.originalPrice && (
                        <span className="text-muted text-decoration-line-through fs-7">
                          {product.originalPrice?.toFixed(2)}€
                        </span>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default EcomBestOffers;