/* eslint-disable react/prop-types */
import React from 'react';
import Link from 'next/link';
import Rating from '../../components/Sidebar/Rating';
import { useWishlist } from '../../contexts/WishlistContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useRouter } from 'next/router';

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
      category: product.category || 'Catégorie non spécifiée'
    };

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = existingCart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
      existingCart[existingProductIndex].quantity += 1;
    } else {
      existingCart.push(productToAdd);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('storage:update'));

    addNotification({
      title: 'Produit ajouté au panier',
      message: `${product.name} a été ajouté à votre panier.`,
      type: 'success',
      actions: [
        {
          label: 'Voir le panier',
          onClick: () => router.push('/panier')
        }
      ],
      autoClose: 5000
    });
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
  };

  return (
    <>
      <div className={`shop-product-wrap row justify-content-center ${GridList ? 'grid' : 'list'}`}>
        {products.map((product, i) => (
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4" key={i}>
            <div className="product-item modern product-card">
              <div className="product-thumb position-relative">
                <div className="pro-thumb overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="img-fluid rounded w-100"
                    style={{ maxHeight: '180px', objectFit: 'contain' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/180x180?text=Image'; }}
                  />
                  <div className="product-action-link d-flex gap-2">
                    <Link href={`/shop/${product.id}`} legacyBehavior><i className="icofont-eye" /></Link>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToWishlist(product);
                      }}
                      className={isInWishlist(product.id) ? 'active' : ''}
                    >
                      <i className="icofont-heart" />
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      <i className="icofont-cart-alt" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="product-content mt-3">
                <h5>
                  <Link href={`/shop/${product.id}`} legacyBehavior>{product.name}</Link>
                </h5>
                <div className="product-rating-row d-flex align-items-center mb-2">
                  <Rating value={product.rating} />
                  <span className="num-reviews ms-2">({product.numReviews || 0})</span>
                </div>
                <h6 className="text-primary fw-bold">${product.price}</h6>
                {product.seller && <p className="text-muted">{product.seller}</p>}
              </div>
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
          background: rgba(255,255,255,0.8);
          border-radius: 50px;
          padding: 6px 12px;
        }
        .product-thumb:hover .product-action-link {
          opacity: 1;
        }
        .product-action-link a {
          font-size: 1.1rem;
          padding: 4px 8px;
          color: #333;
        }
        .product-content h5 a {
          font-size: 1rem;
          font-weight: 600;
          color: #000;
          text-decoration: none;
        }
        .product-content h5 a:hover {
          color: #007bff;
        }
        .product-rating-row .num-reviews {
          color: #888;
          font-size: 1em;
        }
        .product-rating-row :global(.star) {
          color: #ff9800;
          font-size: 1.3em;
          margin-right: 2px;
        }
      `}</style>
    </>
  );
};

export default ProductCards;