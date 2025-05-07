import React from 'react';
// Importations directes des composants react-bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Composant pour afficher des produits similaires sur la page de détail d'un produit
 * @param {Array} products - Liste des produits similaires à afficher
 * @param {string} categorySlug - Slug de la catégorie pour le lien "Voir plus"
 * @param {number} limit - Nombre maximum de produits à afficher
 */
const SimilarProducts = ({ products = [], categorySlug = 'all', limit = 4 }) => {
  // Si aucun produit n'est fourni ou si la liste est vide, ne rien afficher
  if (!Array.isArray(products) || products.length === 0) {
    console.log('Aucun produit similaire à afficher');
    return null;
  }

  // Limiter le nombre de produits à afficher
  const displayProducts = products.slice(0, limit);
  
  console.log(`Affichage de ${displayProducts.length} produits similaires sur ${products.length} disponibles`);

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Produits similaires</h2>
        <Link href={`/shop/category/${categorySlug}`} passHref legacyBehavior={false}>
          <span className="text-primary cursor-pointer">Voir plus &rarr;</span>
        </Link>
      </div>
      
      <Row>
        {displayProducts.map((product) => (
          <Col key={product._id || product.id} xs={12} sm={6} md={3} className="mb-4">
            <Card className="h-100 product-card-similar shadow-sm">
              <Link href={`/shop/product/${product._id || product.id}`} legacyBehavior={false}>
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
                <Card.Body className="p-3">
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
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SimilarProducts;