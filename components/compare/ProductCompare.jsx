import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Badge, CloseButton } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Rating from '../Sidebar/Rating';
import styles from './ProductCompare.module.css';

const ProductCompare = ({ 
  products = [], 
  maxProducts = 4,
  onAddToCart,
  onRemoveProduct 
}) => {
  const router = useRouter();
  const [compareProducts, setCompareProducts] = useState([]);
  
  useEffect(() => {
    // Filtrer les produits non valides et limiter au nombre maximum
    const validProducts = products
      .filter(product => product && product.id)
      .slice(0, maxProducts);
    
    setCompareProducts(validProducts);
  }, [products, maxProducts]);

  const handleRemoveProduct = (productId) => {
    if (onRemoveProduct) {
      onRemoveProduct(productId);
    } else {
      setCompareProducts(prevProducts => 
        prevProducts.filter(product => product.id !== productId)
      );
    }
  };

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const navigateToProduct = (productId) => {
    router.push(`/customer/ProductDetails?id=${productId}`);
  };

  if (compareProducts.length === 0) {
    return (
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="text-center py-5">
          <div className={styles.emptyState}>
            <i className="icofont-exchange fs-1 text-muted mb-3"></i>
            <h5>Aucun produit à comparer</h5>
            <p className="text-muted">Ajoutez des produits à la comparaison pour voir leurs caractéristiques côte à côte.</p>
            <Button 
              variant="primary" 
              onClick={() => router.push('/customer/ProductsFilter')}
            >
              Parcourir les produits
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  // Regrouper toutes les spécifications disponibles
  const allSpecifications = {};
  compareProducts.forEach(product => {
    if (product.specifications) {
      product.specifications.forEach(spec => {
        allSpecifications[spec.name] = true;
      });
    }
  });
  const specificationNames = Object.keys(allSpecifications).sort();

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Comparaison de produits</h5>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={() => setCompareProducts([])}
          >
            <i className="icofont-trash me-1"></i>
            Effacer tout
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className={styles.compareContainer}>
          <Table responsive className={styles.compareTable}>
            <thead>
              <tr>
                <th className={styles.labelCol}>Produit</th>
                {compareProducts.map(product => (
                  <th key={product.id} className={styles.productCol}>
                    <div className="position-relative">
                      <CloseButton 
                        className={styles.removeProduct}
                        onClick={() => handleRemoveProduct(product.id)}
                      />
                      <div 
                        className={styles.productImage}
                        onClick={() => navigateToProduct(product.id)}
                      >
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={120}
                            height={120}
                            className="mx-auto d-block"
                            objectFit="contain"
                          />
                        ) : (
                          <div className="bg-light d-flex align-items-center justify-content-center h-100">
                            <span className="text-muted">Photo indisponible</span>
                          </div>
                        )}
                      </div>
                      <h6 
                        className={styles.productName}
                        onClick={() => navigateToProduct(product.id)}
                      >
                        {product.name}
                      </h6>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Prix */}
              <tr>
                <td className={styles.labelCol}>Prix</td>
                {compareProducts.map(product => (
                  <td key={`${product.id}-price`} className={styles.productCol}>
                    <div className={styles.priceContainer}>
                      {product.discountPrice !== undefined && product.discountPrice < product.price ? (
                        <>
                          <div className={styles.discountPrice}>
                            {product.discountPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </div>
                          <div className={styles.originalPrice}>
                            {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </div>
                          <Badge bg="danger" className={styles.discountBadge}>
                            -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                          </Badge>
                        </>
                      ) : (
                        <div className={styles.price}>
                          {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Note */}
              <tr>
                <td className={styles.labelCol}>Note</td>
                {compareProducts.map(product => (
                  <td key={`${product.id}-rating`} className={styles.productCol}>
                    <Rating 
                      ratings={product.rating || 0}
                      showCount={true}
                      count={product.ratingsCount || 0}
                    />
                  </td>
                ))}
              </tr>

              {/* Disponibilité */}
              <tr>
                <td className={styles.labelCol}>Disponibilité</td>
                {compareProducts.map(product => (
                  <td key={`${product.id}-stock`} className={styles.productCol}>
                    {product.stock > 0 ? (
                      <span className="text-success">
                        <i className="icofont-check-circled me-1"></i>
                        En stock
                      </span>
                    ) : (
                      <span className="text-danger">
                        <i className="icofont-close-circled me-1"></i>
                        Épuisé
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Marque */}
              <tr>
                <td className={styles.labelCol}>Marque</td>
                {compareProducts.map(product => (
                  <td key={`${product.id}-brand`} className={styles.productCol}>
                    {product.brand || "-"}
                  </td>
                ))}
              </tr>

              {/* Catégorie */}
              <tr>
                <td className={styles.labelCol}>Catégorie</td>
                {compareProducts.map(product => (
                  <td key={`${product.id}-category`} className={styles.productCol}>
                    {product.category || "-"}
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr>
                <td className={styles.labelCol}>Description</td>
                {compareProducts.map(product => (
                  <td key={`${product.id}-description`} className={styles.productCol}>
                    <div className={styles.description}>
                      {product.shortDescription || product.description || "-"}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Spécifications */}
              {specificationNames.map(specName => (
                <tr key={`spec-${specName}`}>
                  <td className={styles.labelCol}>{specName}</td>
                  {compareProducts.map(product => {
                    const spec = product.specifications
                      ? product.specifications.find(s => s.name === specName)
                      : null;
                    return (
                      <td key={`${product.id}-${specName}`} className={styles.productCol}>
                        {spec ? spec.value : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
      <Card.Footer className="bg-white">
        <Row>
          {compareProducts.map(product => (
            <Col key={`${product.id}-action`} className="text-center">
              <Button 
                variant="primary" 
                size="sm" 
                className="me-2"
                disabled={product.stock <= 0}
                onClick={() => handleAddToCart(product)}
              >
                <i className="icofont-cart me-1"></i>
                Ajouter
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => navigateToProduct(product.id)}
              >
                Détails
              </Button>
            </Col>
          ))}
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default ProductCompare;