import React, { useState, useEffect } from 'react';
// Importations directes des composants react-bootstrap
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';

// Wrapper pour éviter les erreurs de rendu côté serveur avec Slider
const SliderWrapper = ({ children, settings }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    // Rendu simplifié pour SSR
    return (
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
        {children}
      </div>
    );
  }
  
  return <Slider {...settings}>{children}</Slider>;
};

const SimilarProducts = ({ products, title = "Produits similaires" }) => {
  // Configuration du slider
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          arrows: false,
        }
      }
    ]
  };

  if (!products || products.length === 0) {
    return null;
  }

  // Assurez-vous que tous les produits ont les propriétés nécessaires
  const validProducts = products.map(product => ({
    id: product.id || 'unknown',
    name: product.name || 'Produit sans nom',
    price: product.price || 0,
    category: product.category || '',
    rating: product.rating || 0,
    ratingsCount: product.ratingsCount || 0,
    images: product.images || [],
    stock: product.stock || 0,
    discountPrice: product.discountPrice,
    discount: product.discount,
    isNew: product.isNew
  }));

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-white">
        <h5 className="mb-0">{title}</h5>
      </Card.Header>
      <Card.Body>
        <SliderWrapper settings={settings}>
          {validProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SliderWrapper>
      </Card.Body>
    </Card>
  );
};

const ProductCard = ({ product }) => {
  return (
    <div className="product-card px-2">
      <Card className="h-100 border-0 shadow-sm">
        <Link href={`/customer/ProductDetails?id=${product.id}`} legacyBehavior>
          <div className="product-image-container position-relative" style={{ height: '200px' }}>
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="product-image"
              />
            ) : (
              <div className="bg-light d-flex align-items-center justify-content-center h-100">
                <span className="text-muted">Image non disponible</span>
              </div>
            )}
            
            {product.discount && (
              <span className="discount-badge position-absolute top-0 start-0 bg-danger text-white small p-1 m-2">
                -{product.discount}%
              </span>
            )}
            
            {product.isNew && (
              <span className="new-badge position-absolute top-0 end-0 bg-success text-white small p-1 m-2">
                Nouveau
              </span>
            )}
          </div>
        </Link>
        
        <Card.Body className="d-flex flex-column">
          <Link
            href={`/customer/ProductDetails?id=${product.id}`}
            className="product-title text-decoration-none"
            legacyBehavior>
            <Card.Title className="h6 text-truncate mb-1">{product.name}</Card.Title>
          </Link>
          
          {product.category && (
            <span className="product-category small text-muted mb-2">{product.category}</span>
          )}
          
          <div className="product-rating mb-2">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i} 
                className={`icofont-star ${i < Math.floor(product.rating || 0) ? 'text-warning' : 'text-muted'}`}
                style={{ fontSize: '0.8rem' }}
              ></i>
            ))}
            <span className="ms-1 small text-muted">
              ({product.ratingsCount || 0})
            </span>
          </div>
          
          <div className="product-price mb-2">
            {product.discountPrice !== undefined && product.discountPrice < product.price ? (
              <>
                <span className="new-price fw-bold me-2">
                  {product.discountPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
                <span className="old-price text-muted text-decoration-line-through small">
                  {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              </>
            ) : (
              <span className="price fw-bold">
                {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            )}
          </div>
          
          <div className="product-actions mt-auto">
            <Row className="g-2">
              <Col>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-100"
                  disabled={product.stock <= 0}
                >
                  <i className="icofont-cart me-1"></i>
                  Ajouter
                </Button>
              </Col>
              <Col xs="auto">
                <Button variant="outline-secondary" size="sm">
                  <i className="icofont-heart"></i>
                </Button>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SimilarProducts;