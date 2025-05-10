/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Rating from "../../components/Sidebar/Rating";
import { useWishlist } from "../../contexts/WishlistContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useRouter } from "next/router";

const ProductCards = ({ products, GridList }) => {
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [justAdded, setJustAdded] = useState(null);

  // Charger le panier depuis localStorage au chargement du composant
  useEffect(() => {
    const loadCart = () => {
      try {
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartData);
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        setCart([]);
      }
    };

    loadCart();

    // Écouter les changements de localStorage
    const handleStorageChange = () => loadCart();
    window.addEventListener('storage:update', handleStorageChange);

    return () => {
      window.removeEventListener('storage:update', handleStorageChange);
    };
  }, []);

  // Vérifier si un produit est dans le panier
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  const handleAddToCart = (product) => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      img: product.img,
      category: product.category || "Catégorie non spécifiée",
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = existingCart.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex !== -1) {
      existingCart[existingProductIndex].quantity += 1;
    } else {
      existingCart.push(productToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("storage:update"));

    // Définir le produit qui vient d'être ajouté pour l'animation
    setJustAdded(product.id);
    setTimeout(() => setJustAdded(null), 2000);

    addNotification({
      title: "Produit ajouté au panier",
      message: `${product.name} a été ajouté à votre panier.`,
      type: "success",
      actions: [
        {
          label: "Voir le panier",
          onClick: () => router.push("/panier"),
        },
      ],
      autoClose: 5000,
    });
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
  };

  const handleAddToComparison = (product) => {
    // Placeholder: Replace with actual comparison logic.  This should interact with localStorage as suggested in the changes.
    const existingProductIds = JSON.parse(localStorage.getItem('comparisonProducts') || '[]');
    if (!existingProductIds.includes(product.id)) {
      const updatedProductIds = [...existingProductIds, product.id].slice(-4); // Limit to 4 products
      localStorage.setItem('comparisonProducts', JSON.stringify(updatedProductIds));
      alert('Produit ajouté à la comparaison');
    } else {
      alert('Ce produit est déjà dans votre liste de comparaison');
    }
  };


  return (
    <>
      <div className="shop-product-wrap row justify-content-center">
        {products.map((product, i) => (
          <div className={GridList ? "col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4" : "col-12 mb-4"} key={i}>
            <div className={`product-item modern ${GridList ? "product-card" : "list-view"}`}>
              {GridList ? (
                // Mode Grille
                (<>
                  <div className="product-thumb position-relative hover-lift">
                    <div className="pro-thumb overflow-hidden rounded shine-effect">
                      {product.salePrice > 0 && product.salePrice < product.price && (
                        <div className="product-badge position-absolute bg-danger text-white px-2 py-1 rounded-pill" 
                             style={{ top: '10px', left: '10px', fontSize: '0.75rem', zIndex: 2 }}>
                          -{Math.round((1 - product.salePrice / product.price) * 100)}%
                        </div>
                      )}
                      <img
                        src={product.img}
                        alt={product.name}
                        className="img-fluid w-100 product-image"
                        style={{ 
                          height: "200px", 
                          objectFit: "contain",
                          transition: "transform 0.4s ease, filter 0.4s ease"
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder.png";
                        }}
                      />
                      <div className="product-action-link">
                        <Link
                          href={`/shop/product/${product.id}`}
                          className="action-btn view-btn"
                          legacyBehavior>
                          <i className="icofont-eye" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAddToWishlist(product)}
                          className={`action-btn wishlist-btn ${isInWishlist(product.id) ? "active-wish" : ""}`}
                          aria-label="Ajouter à la liste de souhaits"
                          title={isInWishlist(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                          <i className="icofont-heart" />
                          {isInWishlist(product.id) && <span className="wishlist-badge-label">FAVORIS</span>}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className={`action-btn cart-btn ${justAdded === product.id ? 'add-to-cart-animation' : ''} ${isInCart(product.id) ? 'in-cart' : ''}`}
                          aria-label="Ajouter au panier"
                          title={isInCart(product.id) ? "Déjà dans le panier" : "Ajouter au panier"}
                        >
                          <i className={isInCart(product.id) ? "icofont-shopping-cart" : "icofont-cart-alt"} />
                          {isInCart(product.id) && <span className="cart-badge-label">PANIER</span>}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleAddToComparison(product)} 
                          className="action-btn compare-btn"
                          title="Comparer ce produit"
                        >
                          <i className="icofont-exchange"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="product-content mt-3 pb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <Link
                        href={`/shop/product/${product.id}`}
                        className="product-title"
                        legacyBehavior>
                        <h6 className="product-name text-truncate" style={{ maxWidth: "85%" }}>
                          {product.name}
                        </h6>
                      </Link>
                      {product.availability === "out_of_stock" && (
                        <span className="stock-badge badge bg-danger">Épuisé</span>
                      )}
                    </div>
                    <div className="product-rating-row d-flex align-items-center mb-2">
                      <Rating value={product.rating || 0} count={product.numReviews || 0} showCount={true} />
                      <span className="num-reviews ms-2 text-muted small">
                        ({product.numReviews || 0} avis)
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {product.salePrice > 0 && product.salePrice < product.price ? (
                          <div className="price-block">
                            <h6 className="text-primary fw-bold mb-0">${product.salePrice.toFixed(2)}</h6>
                            <small className="text-muted text-decoration-line-through">${product.price.toFixed(2)}</small>
                          </div>
                        ) : (
                          <h6 className="text-primary fw-bold mb-0">${parseFloat(product.price).toFixed(2)}</h6>
                        )}
                      </div>
                      {product.freeShipping && (
                        <span className="shipping-badge badge bg-success">Livraison gratuite</span>
                      )}
                    </div>
                    {product.seller && (
                      <p className="text-muted small mb-0 mt-1">Vendu par <span className="fw-medium">{product.seller}</span></p>
                    )}
                  </div>
                </>)
              ) : (
                // Mode Liste
                (<div className="row align-items-center w-100">
                  <div className="col-md-3">
                    <div className="product-thumb position-relative">
                      <div className="pro-thumb overflow-hidden">
                        <img
                          src={product.img || "/images/placeholder.png"}
                          alt={product.name}
                          className="img-fluid rounded"
                          style={{ height: "150px", width: "100%", objectFit: "contain" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/placeholder.png";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="product-content ps-md-3">
                      <Link href={`/shop/product/${product.id}`} legacyBehavior>
                        <h5 className="product-title mb-2">{product.name}</h5>
                      </Link>
                      <div className="product-rating-row d-flex align-items-center mb-2">
                        <Rating value={product.rating || 0} count={product.numReviews || 0} showCount={true} />
                        <span className="num-reviews ms-2">({product.numReviews || 0})</span>
                      </div>
                      <p className="product-desc mb-2">{product.description ? product.description.substring(0, 100) + '...' : 'Aucune description disponible'}</p>
                      {product.seller && <p className="text-muted mb-2 small">Vendeur: {product.seller}</p>}
                    </div>
                  </div>
                  <div className="col-md-3 text-end">
                    <h5 className="text-primary fw-bold mb-3">${product.price}</h5>
                    <div className="product-action-buttons d-flex flex-column gap-2">
                      <Link
                        href={`/shop/product/${product.id}`}
                        className="btn btn-outline-primary btn-sm"
                        legacyBehavior>
                        <i className="icofont-eye me-1"></i> Voir détails
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleAddToWishlist(product)}
                        className={`btn btn-sm ${isInWishlist(product.id) ? "btn-danger" : "btn-outline-danger"}`}
                      >
                        <i className="icofont-heart me-1"></i> {isInWishlist(product.id) ? "Favoris" : "Ajouter"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className={`btn ${isInCart(product.id) ? "btn-warning" : "btn-success"} btn-sm ${justAdded === product.id ? 'pulse-animation' : ''}`}
                      >
                        <i className={`${isInCart(product.id) ? "icofont-shopping-cart" : "icofont-cart-alt"} me-1`}></i> 
                        {isInCart(product.id) ? "DÉJÀ DANS LE PANIER ✓" : "AJOUTER AU PANIER"}
                      </button>
                      <button type="button" onClick={() => handleAddToComparison(product)} className="btn btn-outline-secondary btn-sm">
                        <i className="icofont-exchange me-1"></i> Comparer
                      </button>
                    </div>
                  </div>
                </div>)
              )}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .product-card {
          transition: transform 0.2s ease-in-out;
        }
        .product-card:hover {
          transform: scale(1.02);
        }
        .product-thumb {
          position: relative;
          background-color: #f9f9f9;
          border-radius: 10px;
        }
        .product-action-link {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
          background: rgba(255,255,255,0.85);
          padding: 5px 8px;
          border-radius: 4px;
        }
        .cart-badge-label {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #0d6efd;
          color: white;
          border-radius: 4px;
          font-size: 9px;
          font-weight: bold;
          padding: 2px 6px;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 3;
          min-width: 50px;
          text-align: center;
        }

        .wishlist-badge-label {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #dc3545;
          color: white;
          border-radius: 4px;
          font-size: 9px;
          font-weight: bold;
          padding: 2px 6px;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 3;
          min-width: 50px;
          text-align: center;
        }
        .pulse-animation {
          animation: pulse 1s infinite;
        }
        .add-to-cart-animation {
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .product-action-link {
          display: flex;
          gap: 8px;
        }
        .pro-thumb:hover .product-action-link {
          opacity: 1;
        }
        .product-action-link a, .product-action-link button {
          font-size: 1.2rem;
          padding: 2px 4px;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          min-height: 28px;
          flex-shrink: 0;
          line-height: 1;
          background: none;
          border: none;
          cursor: pointer;
        }
        .product-action-link i {
          font-size: 1.2rem;
          line-height: 1;
          vertical-align: middle;
          display: block;
          margin: 0 auto;
          height: 1.2em;
          width: 1.2em;
        }
        .cart-icon-visible i {
          color: #28a745 !important;
        }
        .list-view {
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .list-view:hover {
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        .product-desc {
          color: #666;
          font-size: 0.9rem;
        }
        .product-action-buttons {
          flex-wrap: wrap;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .shine-effect {
          position: relative;
        }
        .shine-effect::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
          transform: skewX(-15deg);
          animation: shine 1.5s linear infinite;
        }
        @keyframes shine {
          to {
            left: 100%;
          }
        }
        .product-image {
          transition: transform 0.3s ease;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .action-btn {
          background: none;
          border: none;
          padding: 5px;
          cursor: pointer;
        }
        .active-wish {
          color: #dc3545;
        }
        .in-cart {
          color: #0d6efd;
        }
        .price-block {
          display: flex;
          align-items: center;
        }
        .price-block small {
          margin-left: 5px;
        }
        .stock-badge {
          margin-left: 10px;
        }
        .shipping-badge {
          margin-left: 10px;
        }
        .product-name{
          font-weight: bold;
        }
      `}</style>
    </>
  );
};

export default ProductCards;