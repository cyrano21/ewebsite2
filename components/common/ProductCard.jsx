import React from 'react';
// Correction des imports react-bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Link from 'next/link';
import Image from 'next/image'; // Utilisation de next/image
import { useRouter } from 'next/router';

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  className = '',
  layout = 'grid' // grid ou list
}) => {
  const router = useRouter();

  // Rendu conditionnel si le produit n'est pas valide
  if (!product || (!product.id && !product._id)) {
    console.warn("ProductCard: Produit invalide ou sans ID reçu");
    // Vous pourriez retourner un composant placeholder ici
    return (
         <Card className={`product-card h-100 border-0 shadow-sm skeleton-loader ${className} ${layout === 'grid' ? '' : 'flex-row'}`} aria-hidden="true">
             <div className={`product-image-container position-relative ${layout === 'grid' ? '' : 'flex-shrink-0'}`} style={{ height: '200px', width: layout === 'grid' ? '100%' : '200px', backgroundColor: '#e0e0e0' }}></div>
             <Card.Body className="d-flex flex-column p-2">
                 <div className="h-25 bg-secondary rounded w-75 mb-2 skeleton-loader"></div>
                 <div className="h-25 bg-secondary rounded w-50 mb-3 skeleton-loader"></div>
                 <div className="h-50 bg-secondary rounded w-100 mt-auto skeleton-loader"></div>
             </Card.Body>
         </Card>
     );
  }

  // Utiliser product.id ou product._id comme identifiant fiable
  const productId = product.id || product._id?.toString(); // Convertir ObjectId en string si nécessaire

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && product.stock > 0) {
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
    if (productId) {
      router.push(`/customer/ProductDetails?id=${productId}`);
    } else {
      console.error("ID de produit manquant pour la navigation", product);
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(Number(price))) {
      return 'N/A'; // Retourner N/A ou une chaîne vide
    }
    try {
      return Number(price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    } catch (error) {
      console.error('Erreur de formatage du prix:', price, error);
      return `${Number(price).toFixed(2)} €`; // Fallback simple
    }
  };

  // Vérification plus robuste pour le prix réduit
  const hasDiscount = product.discountPrice !== undefined &&
                     product.discountPrice !== null &&
                     product.price !== undefined &&
                     product.price !== null &&
                     Number(product.discountPrice) < Number(product.price);

  const discountPercentage = hasDiscount
    ? Math.round((1 - Number(product.discountPrice) / Number(product.price)) * 100)
    : 0;

  const isGridLayout = layout === 'grid';
  const hasImage = product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0];

  // Utilisation du champ renommé isNewlyAdded, avec fallback sur isNew si nécessaire
  const isProductNew = product.isNewlyAdded || product.isNew || false;

  return (
    <Card
      className={`product-card h-100 border-0 shadow-sm ${className} ${isGridLayout ? '' : 'd-flex flex-row'}`} // flex-row pour la vue liste
      onClick={navigateToProduct}
      style={{ cursor: 'pointer', overflow: 'hidden' }} // Empêche le contenu de déborder
    >
      {/* Conteneur d'image avec ratio */}
      <div
        className={`product-image-wrapper position-relative ${isGridLayout ? 'w-100' : 'flex-shrink-0'}`}
        style={{
          paddingTop: isGridLayout ? '100%' : '0', // Ratio 1:1 pour grid
          height: isGridLayout ? '0' : '150px',    // Hauteur fixe pour list
          width: isGridLayout ? '100%' : '150px',   // Largeur fixe pour list
          backgroundColor: '#f8f9fa' // Couleur de fond pendant le chargement
        }}
      >
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name || 'Image produit'}
            layout="fill"
            objectFit="cover"
            className="product-card-image" // Classe spécifique si besoin
            onError={(e) => { e.target.src = '/assets/images/placeholder.png'; }} // Image de fallback
            priority={className.includes('priority-load')} // Charger en priorité si nécessaire
          />
        ) : (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light">
            <i className="icofont-image text-muted fs-2"></i>
          </div>
        )}

        {/* Badges positionnés correctement */}
        <div className="position-absolute top-0 start-0 p-2 d-flex flex-column align-items-start" style={{ zIndex: 2 }}>
            {discountPercentage > 0 && (
                <Badge bg="danger" pill className="mb-1">-{discountPercentage}%</Badge>
            )}
            {isProductNew && (
                <Badge bg="success" pill>Nouveau</Badge>
            )}
        </div>

         {/* Bouton Wishlist (positionné en haut à droite) */}
         {onAddToWishlist && (
             <Button
                variant="light"
                size="sm"
                className="position-absolute top-0 end-0 m-2 rounded-circle p-1 d-flex align-items-center justify-content-center wishlist-btn"
                style={{ width: '30px', height: '30px', zIndex: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                onClick={handleAddToWishlist}
                aria-label="Ajouter à la liste de souhaits"
             >
                <i className="icofont-heart text-danger" style={{ fontSize: '0.9rem' }}></i>
             </Button>
         )}
      </div>

      <Card.Body className={`d-flex flex-column p-2 p-sm-3 ${isGridLayout ? '' : 'flex-grow-1'}`}>
        {product.category && (
          <small className="text-muted mb-1 d-block text-truncate">{product.category}</small>
        )}
        <Card.Title className="h6 product-title mb-1 text-truncate-2-lines"> {/* Limite à 2 lignes */}
           {product.name || 'Produit sans nom'}
        </Card.Title>

        <div className="product-rating mb-2 d-flex align-items-center flex-wrap">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`icofont-star small ${i < Math.floor(product.rating || 0) ? 'text-warning' : 'text-muted'}`}
              style={{ marginRight: '1px' }}
            ></i>
          ))}
          <span className="ms-1 small text-muted">({product.ratingsCount || 0})</span>
        </div>

        {/* Description courte (si layout liste) */}
        {!isGridLayout && product.shortDescription && (
          <p className="product-description small text-muted mb-2 flex-grow-1 text-truncate-3-lines"> {/* Limite à 3 lignes */}
            {product.shortDescription}
          </p>
        )}

        <div className="product-price mb-2">
           {hasDiscount ? (
              <div className={`${isGridLayout ? '' : 'd-flex align-items-baseline'}`}>
                <span className="new-price fw-bold me-2">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="old-price text-muted text-decoration-line-through small">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="price fw-bold">
                {formatPrice(product.price)}
              </span>
            )}
        </div>

        <div className={`product-availability mb-2 ${isGridLayout ? 'mt-auto' : ''}`}> {/* mt-auto pousse le bouton en bas en grid */}
          {(product.stock > 0) ? (
            <Badge bg="success-light" text="success" className="small p-1 px-2">
              <i className="icofont-check-circled me-1"></i>
              En stock
            </Badge>
          ) : (
            <Badge bg="danger-light" text="danger" className="small p-1 px-2">
              <i className="icofont-close-circled me-1"></i>
              Épuisé
            </Badge>
          )}
        </div>

        {/* Bouton Ajouter au panier (toujours visible mais désactivé si hors stock) */}
        <Button
          variant="primary"
          size="sm"
          className="w-100 add-to-cart-btn" // Classe spécifique pour ciblage CSS/JS
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          aria-label="Ajouter au panier"
        >
          <i className="icofont-cart me-1"></i>
          Ajouter
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

// Ajoutez ce CSS (ou adaptez-le dans vos fichiers CSS globaux)
/*
.text-truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.4em; // Ajustez selon votre line-height
  max-height: 2.4em; // Ajustez selon votre line-height
}

.text-truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 3.6em; // Ajustez
  max-height: 3.6em; // Ajustez
}

.product-card-image {
  transition: transform 0.3s ease;
}
.product-card:hover .product-card-image {
  transform: scale(1.05);
}

.wishlist-btn, .add-to-cart-btn {
  transition: all 0.2s ease-in-out;
}
.wishlist-btn:hover {
    background-color: rgba(220, 53, 69, 0.1) !important; // Léger fond rouge au survol
}
.add-to-cart-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
}

// Styles pour les badges light (exemple)
.badge.bg-success-light { background-color: #d1e7dd; }
.badge.bg-danger-light { background-color: #f8d7da; }
*/