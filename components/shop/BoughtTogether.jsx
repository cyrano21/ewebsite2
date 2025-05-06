import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { fetchWithTimeout } from '../../utils/api';

// Produits de secours en cas d'échec des API - avec des images par défaut
const FALLBACK_PRODUCTS = [
  {
    _id: 'fallback1',
    name: 'ULTRABOOST 22 SHOES',
    price: 420,
    salePrice: 0,
    image: '/assets/images/shop/placeholder.jpg',
    category: 'Men\'s Sneaker'
  },
  {
    _id: 'fallback2',
    name: 'LUNAR NEW YEAR ULTRABOOST DNA SHOES',
    price: 196,
    salePrice: 0,
    image: '/assets/images/shop/placeholder.jpg',
    category: 'Men\'s Sneaker'
  },
  {
    _id: 'fallback3',
    name: 'SUPERNOVA SHOES',
    price: 245,
    salePrice: 0,
    image: '/assets/images/shop/placeholder.jpg',
    category: 'Men\'s Sneaker'
  }
];

const BoughtTogether = ({ currentProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoughtTogetherProducts = async () => {
      if (!currentProduct) {
        // Si pas de produit courant, utiliser les produits de secours
        setProducts(FALLBACK_PRODUCTS);
        setLoading(false);
        return;
      }

      const productId = currentProduct._id || currentProduct.id || currentProduct.legacyId;
      const limit = 3;

      // Tentative de récupération des produits achetés ensemble
      console.log('Récupération des produits achetés ensemble...', productId);

      try {
        // Plusieurs tentatives de récupération avec différents formats d'URL
        let response;
        let data;
        let success = false;
        
        // Tentative 1: API directe des produits reliés
        try {
          response = await fetchWithTimeout(`/api/products?limit=${limit}&related=${productId}`, {}, 3000);
          if (response.ok) {
            data = await response.json();
            success = true;
            console.log('API produits reliés OK');
          }
        } catch (e) {
          console.log('Tentative 1 échouée:', e.message);
        }
        
        // Tentative 2: API de la même catégorie
        if (!success && currentProduct.category) {
          try {
            const category = encodeURIComponent(currentProduct.category);
            response = await fetchWithTimeout(`/api/products?limit=${limit}&category=${category}`, {}, 3000);
            if (response.ok) {
              data = await response.json();
              success = true;
              console.log('API produits par catégorie OK');
            }
          } catch (e) {
            console.log('Tentative 2 échouée:', e.message);
          }
        }
        
        // Tentative 3: API avec tous les produits
        if (!success) {
          try {
            response = await fetchWithTimeout(`/api/products?limit=${limit}`, {}, 3000);
            if (response.ok) {
              data = await response.json();
              success = true;
              console.log('API de tous les produits OK');
            }
          } catch (e) {
            console.log('Tentative 3 échouée:', e.message);
          }
        }
        
        // Si aucune tentative n'a réussi, lancer une erreur
        if (!success) {
          throw new Error("Toutes les tentatives de récupération ont échoué");
        }

        // Parser les données selon leur format
        let productsData = [];
        if (data.products) {
          productsData = data.products;
        } else if (data.success && Array.isArray(data.products)) {
          productsData = data.products;
        } else if (Array.isArray(data)) {
          productsData = data;
        } else {
          console.error('Format de données inattendu:', data);
          productsData = FALLBACK_PRODUCTS;
        }
        
        // Filtrer pour exclure le produit actuel
        const filteredProducts = productsData.filter(p => {
          const pId = p._id || p.id || p.legacyId;
          return pId !== productId;
        });
        
        if (filteredProducts.length > 0) {
          setProducts(filteredProducts.slice(0, limit));
        } else {
          // Si on n'a pas trouvé de produits, utiliser les produits de secours
          console.log('Aucun produit filtré trouvé, utilisation des produits de secours');
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (err) {
        console.error('Erreur finale lors de la récupération des produits achetés ensemble:', err);
        setError(err.message);
        // Utiliser les produits de secours
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchBoughtTogetherProducts();
  }, [currentProduct]);

  if (loading) {
    return (
      <Row className="my-5">
        <Col>
          <h2 className="mb-4">Souvent achetés ensemble</h2>
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  if (error) {
    return (
      <Row className="my-5">
        <Col>
          <h2 className="mb-4">Souvent achetés ensemble</h2>
          <div className="alert alert-warning">
            Impossible de charger les recommandations pour le moment.
          </div>
        </Col>
      </Row>
    );
  }

  // Si aucun produit n'est trouvé ou s'il y a moins de 1 produit, ne pas afficher la section
  if (!products || !Array.isArray(products) || products.length < 1) {
    return null;
  }

  return (
    <Row className="my-5">
      <Col>
        <h2 className="mb-4">Souvent achetés ensemble</h2>
        <Row>
          {products.map((product) => (
            <Col key={product._id} md={4} sm={6} className="mb-4">
              <Card className="h-100 product-card shadow-sm">
                <Link href={`/shop/product/${product._id || product.id || 'fallback'}`} legacyBehavior={false}>
                  <div className="position-relative" style={{ height: '200px' }}>
                    <Image
                      src={product.imageUrl || product.image || '/assets/images/shop/placeholder.jpg'}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="card-img-top p-2"
                      onError={(e) => {
                        console.error("Erreur de chargement d'image:", product.imageUrl || product.image);
                        e.target.src = '/assets/images/shop/placeholder.jpg';
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="fs-6 text-truncate">{product.name}</Card.Title>
                    <div className="fw-bold mt-2">
                      {product.salePrice > 0 ? (
                        <>
                          <span className="text-danger">{product.salePrice.toFixed(2)} €</span>
                          <span className="text-muted text-decoration-line-through ms-2">
                            {product.price.toFixed(2)} €
                          </span>
                        </>
                      ) : (
                        <span>{product.price.toFixed(2)} €</span>
                      )}
                    </div>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default BoughtTogether;