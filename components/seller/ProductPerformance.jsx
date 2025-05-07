
import React from 'react';
import { ListGroup, ProgressBar, Badge } from 'react-bootstrap';
import Link from 'next/link';

const ProductPerformance = ({ products = [] }) => {
  // Message si aucun produit n'est disponible
  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="icofont-box fs-1 text-muted"></i>
        <p className="mt-3 text-muted">Aucun produit à afficher</p>
      </div>
    );
  }

  // Trouver la valeur maximale pour calculer le pourcentage
  const maxValue = Math.max(...products.map(product => product.sales));

  return (
    <ListGroup variant="flush">
      {products.map((product, index) => {
        // Calculer le pourcentage de ventes par rapport au max
        const percentage = maxValue > 0 ? (product.sales / maxValue) * 100 : 0;
        
        // Déterminer la couleur de la barre de progression
        let variantColor = 'primary';
        if (percentage > 75) variantColor = 'success';
        else if (percentage > 50) variantColor = 'info';
        else if (percentage > 25) variantColor = 'warning';
        
        return (
          <ListGroup.Item key={index} className="py-3 px-0 border-bottom">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Link href={`/seller/products/${product._id}`}>
                <a className="fw-medium text-truncate" style={{ maxWidth: '70%' }}>
                  {product.name}
                </a>
              </Link>
              <Badge bg="light" text="dark">
                {product.sales} ventes
              </Badge>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="text-muted">
                Stock: {product.stock} | Vues: {product.views}
              </small>
              <small className={`text-${product.stock > 5 ? 'success' : 'danger'}`}>
                {product.stock > 5 ? 'En stock' : 'Stock faible'}
              </small>
            </div>
            <ProgressBar 
              now={percentage} 
              variant={variantColor}
              style={{ height: '6px' }}
            />
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default ProductPerformance;
