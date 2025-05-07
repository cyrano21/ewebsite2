import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Composant pour afficher des produits similaires dans une grille
 * @param {Array} products - Liste des produits similaires à afficher
 * @param {string} categorySlug - Slug de la catégorie pour le lien "Voir plus"
 * @param {string} title - Titre de la section
 */
const SimilarProductsGrid = ({ products = [], categorySlug = "all", title = "Produits similaires" }) => {
  // Si aucun produit n'est fourni ou si la liste est vide, ne rien afficher
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <Container className="mt-5 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{title}</h2>
        <Link href={`/shop/category/${categorySlug}`} passHref legacyBehavior>
          <a className="btn btn-outline-primary btn-sm">Voir plus</a>
        </Link>
      </div>
      
      <Row>
        {products.map((product) => (
          <Col xs={12} sm={6} md={3} key={product._id || product.id} className="mb-4">
            <Card className="product-card-similar h-100">
              <Link href={`/shop/product/${product._id || product.id}`} passHref legacyBehavior>
                <a className="text-decoration-none">
                  <div className="product-card-img-container">
                    <Image
                      src={product.imageUrl || product.image || product.img || '/assets/images/shop/placeholder.jpg'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      style={{ objectFit: 'contain' }}
                      className="card-img-top p-2"
                    />
                  </div>
                  <Card.Body>
                    <div className="similar-product-title text-truncate-2-lines">
                      {product.name}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      {product.salePrice ? (
                        <div>
                          <span className="text-danger fw-bold">{product.salePrice.toFixed(2)} €</span>
                          <span className="text-muted text-decoration-line-through ms-2 fs-xs">
                            {product.price.toFixed(2)} €
                          </span>
                        </div>
                      ) : (
                        <span className="fw-bold">{(product.price || 0).toFixed(2)} €</span>
                      )}
                    </div>
                  </Card.Body>
                </a>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SimilarProductsGrid;