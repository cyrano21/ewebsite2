/* eslint-disable react/prop-types */
import React from "react";
import Link from "next/link";
import Rating from "../../components/Sidebar/Rating";
import { useWishlist } from "../../contexts/WishlistContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useRouter } from "next/router";

const ProductCards = ({ products, GridList }) => {
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addNotification } = useNotifications();
  const router = useRouter();

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

  return (
    <>
      <div className="shop-product-wrap row justify-content-center">
        {products.map((product, i) => (
          <div className={GridList ? "col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4" : "col-12 mb-4"} key={i}>
            <div className={`product-item modern ${GridList ? "product-card" : "list-view"}`}>
              {GridList ? (
                // Mode Grille
                <>
                  <div className="product-thumb position-relative">
                    <div className="pro-thumb overflow-hidden">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="img-fluid rounded w-100"
                        style={{ maxHeight: "180px", objectFit: "contain" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder.png";
                        }}
                      />
                      <div className="product-action-link">
                        <Link href={`/shop/${product.id}`}>
                          <i className="icofont-eye" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAddToWishlist(product)}
                          className={isInWishlist(product.id) ? "active" : ""}
                          style={{ background: 'none', border: 'none', padding: '3px' }}
                          aria-label="Ajouter à la liste de souhaits"
                        >
                          <i className="icofont-heart" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="btn btn-link cart-icon-visible"
                          aria-label="Ajouter au panier"
                        >
                          <i className="icofont-cart-alt" style={{ fontSize: "16px", color: "#28a745" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="product-content mt-3">
                    <Link href={`/shop/${product.id}`}>
                      <h6>
                        {product.name}
                      </h6>
                    </Link>
                    <div className="product-rating-row d-flex align-items-center mb-2">
                      <Rating value={product.rating} />
                      <span className="num-reviews ms-2">
                        ({product.numReviews || 0})
                      </span>
                    </div>
                    <h6 className="text-primary fw-bold">${product.price}</h6>
                    {product.seller && (
                      <p className="text-muted">{product.seller}</p>
                    )}
                  </div>
                </>
              ) : (
                // Mode Liste
                <div className="row align-items-center w-100">
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
                      <Link href={`/shop/${product.id}`}>
                        <h5 className="product-title mb-2">{product.name}</h5>
                      </Link>
                      <div className="product-rating-row d-flex align-items-center mb-2">
                        <Rating value={product.rating} />
                        <span className="num-reviews ms-2">({product.numReviews || 0})</span>
                      </div>
                      <p className="product-desc mb-2">{product.description ? product.description.substring(0, 100) + '...' : 'Aucune description disponible'}</p>
                      {product.seller && <p className="text-muted mb-2 small">Vendeur: {product.seller}</p>}
                    </div>
                  </div>
                  <div className="col-md-3 text-end">
                    <h5 className="text-primary fw-bold mb-3">${product.price}</h5>
                    <div className="product-action-buttons d-flex flex-column gap-2">
                      <Link href={`/shop/${product.id}`} className="btn btn-outline-primary btn-sm">
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
                        className="btn btn-success btn-sm"
                      >
                        <i className="icofont-cart-alt me-1"></i> Panier
                      </button>
                    </div>
                  </div>
                </div>
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
      `}</style>
    </>
  );
};

export default ProductCards;
