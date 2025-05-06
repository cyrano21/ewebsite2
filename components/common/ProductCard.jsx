import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  className = '', 
  layout = 'grid' // grid ou list
}) => {
  const router = useRouter();

  if (!product) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const navigateToProduct = () => {
    router.push(`/customer/ProductDetails?id=${product.id}`);
  };

  // Calcul du pourcentage de réduction
  const discountPercentage = product.discountPrice !== undefined && product.price > 0
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  const isGridLayout = layout === 'grid';

  return (
    <Card 
      className={`product-card h-100 border-0 shadow-sm ${className} ${isGridLayout ? '' : 'flex-row'}`}
      onClick={navigateToProduct}
      style={{ cursor: 'pointer' }}
    >
      {/* Image du produit */}
      <div 
        className={`product-image-container position-relative ${isGridLayout ? '' : 'flex-shrink-0'}`} 
        style={{ 
          height: isGridLayout ? '200px' : '100%',
          width: isGridLayout ? '100%' : '200px'
        }}
      >
        {product.images && product.images.length > 0 ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={product.images[0]}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="product-image"
            />
          </div>
        ) : (
          <div className="bg-light d-flex align-items-center justify-content-center h-100">
            <span className="text-muted">Image non disponible</span>
          </div>
        )}
        
        {/* Badge de réduction */}
        {discountPercentage > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 start-0 m-2"
          >
            -{discountPercentage}%
          </Badge>
        )}
        
        {/* Badge "Nouveau" */}
        {product.isNew && (
          <Badge 
            bg="success" 
            className="position-absolute top-0 end-0 m-2"
          >
            Nouveau
          </Badge>
        )}
        
        {/* Bouton wishlist */}
        <Button
          variant="light"
          size="sm"
          className="position-absolute top-0 end-0 m-2 rounded-circle p-2 d-flex align-items-center justify-content-center"
          style={{ 
            width: '36px', 
            height: '36px',
            right: product.isNew ? '60px' : '0'
          }}
          onClick={handleAddToWishlist}
        >
          <i className="icofont-heart text-danger"></i>
        </Button>
      </div>
      
      <Card.Body className={`d-flex flex-column ${isGridLayout ? '' : 'flex-grow-1'}`}>
        {/* Titre du produit */}
        <Card.Title className="h6 product-title mb-1">
          {product.name}
        </Card.Title>
        
        {/* Catégorie */}
        {product.category && (
          <small className="text-muted mb-2">{product.category}</small>
        )}
        
        {/* Évaluation */}
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
        
        {/* Description (uniquement en mode liste) */}
        {!isGridLayout && product.shortDescription && (
          <p className="product-description small text-muted mb-3">
            {product.shortDescription.length > 150 
              ? `${product.shortDescription.substring(0, 150)}...` 
              : product.shortDescription}
          </p>
        )}
        
        {/* Prix */}
        <div className="product-price mb-2">
          {product.discountPrice !== undefined && product.discountPrice < product.price ? (
            <div className={`${isGridLayout ? '' : 'd-flex align-items-center'}`}>
              <span className="new-price fw-bold me-2">
                {product.discountPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
              <span className="old-price text-muted text-decoration-line-through small">
                {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          ) : (
            <span className="price fw-bold">
              {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          )}
        </div>
        
        {/* Disponibilité */}
        <div className="product-availability mb-3">
          {product.stock > 0 ? (
            <span className="text-success small">
              <i className="icofont-check-circled me-1"></i>
              En stock
            </span>
          ) : (
            <span className="text-danger small">
              <i className="icofont-close-circled me-1"></i>
              Épuisé
            </span>
          )}
        </div>
        
        {/* Bouton Ajouter au panier */}
        <div className="mt-auto">
          <Button 
            variant="primary" 
            size="sm" 
            className={`w-100 ${product.stock <= 0 ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <i className="icofont-cart me-1"></i>
            Ajouter au panier
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;