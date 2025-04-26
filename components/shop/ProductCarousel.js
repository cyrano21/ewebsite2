// components/shop/ProductCarousel.js
import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap'; // Ajouter Button
import Link from 'next/link';
import Image from 'next/image';

// --- Composant Carte Produit Amélioré ---
const ProductCarouselCard = ({ product }) => {
    const displayPrice = typeof product.salePrice === 'number'
        ? product.salePrice.toFixed(2)
        : typeof product.price === 'number'
          ? product.price.toFixed(2)
          : 'N/A';
    const originalPrice = typeof product.price === 'number' ? product.price.toFixed(2) : null;
    const isOnSale = typeof product.salePrice === 'number' && typeof product.price === 'number' && product.salePrice < product.price;
    const imageUrl = product.img || "https://via.placeholder.com/150?text=No+Image";

    // Fonction pour ajouter au panier (exemple)
    const handleAddToCart = (e) => {
        e.preventDefault(); // Empêche la navigation si le bouton est dans le Link
        e.stopPropagation(); // Empêche la navigation si le bouton est dans le Link
        alert(`Ajout de ${product.name} au panier !`);
        // Mettez ici votre vraie logique d'ajout au panier
    };

    return (
        <Link href={`/shop/${product.id || '#'}`} passHref legacyBehavior>
             {/* Ajout de classes pour le style et le hover */}
            <Card as="a" className="product-card-similar border h-100 text-decoration-none overflow-hidden">
                    {/* Conteneur pour l'image avec padding et hauteur fixe */}
                    <div className="product-card-img-container position-relative">
                         <Image
                             src={imageUrl}
                             alt={product.name || 'Similar product'}
                             layout="fill" // Remplit le conteneur parent
                             objectFit="contain" // Assure que l'image entière est visible
                             className="product-card-img" // Classe pour cibler si besoin
                             onError={(e) => { console.warn(`Failed to load image: ${imageUrl}`); }}
                         />
                         {/* Optionnel: Badge Promo */}
                         {isOnSale && (
                             <Badge bg="danger" className="position-absolute top-0 end-0 m-2 small">
                                 Promo
                             </Badge>
                         )}
                         {/* Optionnel: Bouton Ajout rapide au panier (apparaît au survol) */}
                         <div className="product-card-actions">
                             <Button
                                 variant="dark"
                                 size="sm"
                                 className="rounded-pill add-to-cart-btn"
                                 onClick={handleAddToCart}
                                 title="Ajouter au panier"
                              >
                                 <i className="icofont-shopping-cart"></i>
                             </Button>
                         </div>
                    </div>
                    <Card.Body className="p-3 d-flex flex-column"> {/* Plus de padding */}
                        <Card.Title as="h6" className="mb-1 similar-product-title text-truncate-2-lines flex-grow-1">
                            {product.name || 'Product Name'}
                        </Card.Title>
                        {/* Rating et Prix regroupés en bas */}
                        <div className="mt-auto pt-2"> {/* Pousse vers le bas */}
                            <div className="d-flex align-items-center mb-1 small">
                                <span className="text-warning me-1">★ {typeof product.ratings === 'number' ? product.ratings.toFixed(1) : 'N/A'}</span>
                                <span className="text-muted fs-xs">({product.ratingsCount || 0})</span> {/* fs-xs pour très petit */}
                            </div>
                            <div className="fw-bold"> {/* Prix plus visible */}
                                {isOnSale ? (
                                    <>
                                        <span className="text-danger me-1">{displayPrice}€</span>
                                        {originalPrice && <span className="text-muted text-decoration-line-through small">{originalPrice}€</span>}
                                    </>
                                ) : (
                                    `${displayPrice}€`
                                )}
                            </div>
                        </div>
                    </Card.Body>
            </Card>
        </Link>
    );
};

// --- Composant Carousel Principal ---
const ProductCarousel = ({ products }) => {
    if (!products || products.length === 0) {
         return null;
    }

    return (
        <div className="d-flex flex-nowrap overflow-auto pb-3 product-carousel-container" style={{ scrollbarWidth: 'none', 'msOverflowStyle': 'none' }}> {/* Cache la scrollbar standard */}
            {/* Ajout d'un peu d'espace négatif pour compenser le padding des cartes si besoin */}
            {/* style={{ marginLeft: '-8px', marginRight: '-8px' }} */}
            {products.map((p) => (
                // Utilisation de padding pour espacer les cartes au lieu de marge sur la carte elle-même
                (<div key={p.id || Math.random()} className="carousel-item-wrapper px-2" style={{ width: '200px', flexShrink: 0 }}> {/* Largeur augmentée, padding */}
                    <ProductCarouselCard product={p} />
                </div>)
            ))}
            {/* Style pour cacher la scrollbar Webkit */}
            <style jsx global>{`
               .product-carousel-container::-webkit-scrollbar {
                   display: none;
               }

               .product-card-similar {
                   border-radius: 0.5rem; /* Bords arrondis */
                   border-color: var(--bs-border-color-translucent);
                   transition: all 0.2s ease-in-out;
                   background-color: var(--bs-body-bg); /* Assure fond blanc/thème */
               }

               .product-card-similar:hover {
                   transform: translateY(-3px);
                   box-shadow: var(--bs-box-shadow-sm);
                   border-color: var(--bs-border-color);
               }

               .product-card-img-container {
                   height: 160px; /* Hauteur fixe pour l'image */
                   background-color: #f8f9fa; /* Fond léger pour l'image */
                   overflow: hidden; /* Cache ce qui dépasse */
               }
                /* Centrage pour layout fill de next/image */
               .product-card-img-container > span {
                   display: block !important; /* Surcharge possible de next/image */
               }

               .similar-product-title {
                   font-size: 0.9rem;
                   font-weight: 500;
                   line-height: 1.3;
                   height: 2.6em; /* Approx 2 lignes */
                   color: var(--bs-body-color); /* Assure couleur texte correcte */
               }
               /* Assure que la troncature fonctionne */
               .text-truncate-2-lines {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .fs-xs { /* Classe utilitaire pour taille extra petite */
                   font-size: 0.75rem;
                }

                /* Actions qui apparaissent au survol */
                .product-card-actions {
                   position: absolute;
                   bottom: 8px; /* Positionne en bas à droite */
                   right: 8px;
                   opacity: 0; /* Caché par défaut */
                   transition: opacity 0.2s ease-in-out;
                }

                .product-card-similar:hover .product-card-actions {
                   opacity: 1; /* Visible au survol de la carte */
                }

                .add-to-cart-btn {
                    font-size: 0.8rem;
                    padding: 0.25rem 0.6rem;
                }

           `}</style>
        </div>
    );
};

export default ProductCarousel;