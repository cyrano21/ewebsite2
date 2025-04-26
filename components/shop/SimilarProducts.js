// components/shop/SimilarProducts.js
import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import ProductCarousel from './ProductCarousel'; // Assurez-vous que ce composant existe

const SimilarProducts = ({ products, categorySlug = "all" }) => {
  if (!products || products.length === 0) {
    return null;
  }

  const categoryLink = `/shop?category=${encodeURIComponent(categorySlug || 'all')}`;

  return (
    // Ajout de my-5 pour plus d'espace vertical
    <Row className="my-5 similar-products-section border-top pt-4"> {/* Ajout bordure et padding */}
      <Col>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2"> {/* Augmentation marge basse */}
          <div>
            {/* Titre plus proéminent */}
            <h3 className="mb-1 fw-bold h4">Produits similaires</h3>
            <p className="text-muted mb-0 small">Vous pourriez aussi aimer</p>
          </div>
          {/* Bouton 'Voir tout' plus subtil */}
          <Link href={categoryLink} passHref legacyBehavior>
              <Button as="a" variant="outline-dark" size="sm" className="py-1 px-3 rounded-pill"> {/* Style de bouton différent */}
                 Voir la catégorie
                 <i className="icofont-long-arrow-right ms-1"></i> {/* Icône ajoutée */}
              </Button>
          </Link>
        </div>
        {/* Le Carousel reste le même ici, le style se fait dans ProductCarouselCard */}
        <ProductCarousel products={products} />
      </Col>
    </Row>
  );
};

export default SimilarProducts;