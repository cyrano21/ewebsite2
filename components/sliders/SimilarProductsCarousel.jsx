import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/**
 * Composant pour afficher des produits similaires sur la page de détail d'un produit en utilisant un carousel
 * @param {Array} products - Liste des produits similaires à afficher
 * @param {string} title - Titre de la section
 * @param {number} slidesToShow - Nombre de slides à afficher en même temps
 */
const SimilarProductsCarousel = ({ products = [], title = "Produits similaires", slidesToShow = 4 }) => {
  // Si aucun produit n'est fourni ou si la liste est vide, ne rien afficher
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  // Configuration du slider
  const settings = {
    dots: true,
    infinite: products.length > slidesToShow,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
        }
      }
    ]
  };

  return (
    <Container className="mt-5 mb-4">
      <h2 className="mb-4">{title}</h2>
      
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product._id || product.id} className="px-2">
            <div className="product-card-similar shadow-sm h-100">
              <Link href={`/shop/product/${product._id || product.id}`} passHref legacyBehavior={false}>
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
                <div className="p-3">
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
                </div>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default SimilarProductsCarousel;