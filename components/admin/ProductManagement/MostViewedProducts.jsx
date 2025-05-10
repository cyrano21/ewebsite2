import React from 'react';
import PropTypes from 'prop-types';
import { Card, ListGroup, Badge, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { formatNumber } from './utils/statsUtils'; // Importer formatNumber
import styles from './ProductWidgets.module.css'; // Créer ce fichier CSS Module

const MostViewedProducts = ({ products, loading, error }) => {
  if (loading) {
    return (
      <Card className="h-100 border-light shadow-sm">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <Spinner animation="border" size="sm" />
        </Card.Body>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="h-100 border-light shadow-sm">
        <Card.Body className="text-center text-danger">
          Erreur: {error.message || 'Impossible de charger'}
        </Card.Body>
      </Card>
    );
  }
  if (!products || products.length === 0) {
    return (
       <Card className="h-100 border-light shadow-sm">
         <Card.Header className="bg-light py-2"><h6 className="mb-0 fw-normal">Produits les Plus Vus</h6></Card.Header>
         <Card.Body className="d-flex align-items-center justify-content-center text-muted">
           <small>Pas de données</small>
         </Card.Body>
       </Card>
     );
  }

  return (
    <Card className="h-100 border-light shadow-sm">
      <Card.Header className="bg-light py-2">
        <h6 className="mb-0 fw-normal">Produits les Plus Vus</h6>
      </Card.Header>
      <ListGroup variant="flush" className={styles.productList}>
        {products.map((product) => (
          <ListGroup.Item key={product.id} className={`${styles.productItem} d-flex align-items-center`}>
            <Link href={`/shop/product/${product.id}`} className={styles.productImageLink} legacyBehavior>
              <a>
                <Image
                  src={product.img}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded me-2"
                  objectFit="cover"
                  onError={(e) => { e.target.onerror = null; e.target.src='/assets/placeholder.jpg';}} // Fallback générique
                />
              </a>
            </Link>
            <div className={`${styles.productInfo} flex-grow-1 text-truncate me-2`}>
              <Link
                href={`/shop/product/${product.id}`}
                className={`${styles.productName} text-decoration-none text-dark`}
                title={product.name}
                legacyBehavior>
                {product.name}
              </Link>
            </div>
            <Badge pill bg="light" text="dark" className={styles.productMetric}>
              {formatNumber(product.metricValue)} {product.metricLabel}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

MostViewedProducts.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    img: PropTypes.string,
    metricValue: PropTypes.number,
    metricLabel: PropTypes.string,
  })),
  loading: PropTypes.bool,
  error: PropTypes.object
};

MostViewedProducts.defaultProps = {
    products: [],
    loading: false,
    error: null
};

export default MostViewedProducts;