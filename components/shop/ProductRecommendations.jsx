import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';

const ProductRecommendations = ({ 
  title = "Produits recommandés pour vous", 
  productId = null,
  categoryId = null,
  limit = 4,
  visible = true
}) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendedProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let products = [];
      
      // Si nous n'avons pas d'ID de produit ou de catégorie, charger des produits populaires
      if (!productId && !categoryId) {
        try {
          // Utiliser l'API d'origine pour les produits populaires
          const response = await axios.get('/api/products/popular');
          if (response.data && Array.isArray(response.data)) {
            products = response.data;
          } else if (response.data && Array.isArray(response.data.products)) {
            products = response.data.products;
          } else if (response.data && Array.isArray(response.data.data)) {
            products = response.data.data;
          }
        } catch (popularError) {
          console.warn('Impossible de charger les produits populaires, fallback vers des produits récents', popularError);
          // Fallback vers des produits récents
          try {
            const fallbackResponse = await axios.get('/api/products?limit=4&sort=newest');
            if (fallbackResponse.data && Array.isArray(fallbackResponse.data)) {
              products = fallbackResponse.data;
            } else if (fallbackResponse.data && Array.isArray(fallbackResponse.data.products)) {
              products = fallbackResponse.data.products;
            } else if (fallbackResponse.data && Array.isArray(fallbackResponse.data.data)) {
              products = fallbackResponse.data.data;
            }
          } catch (fallbackError) {
            console.error('Erreur lors du chargement des produits de secours:', fallbackError);
            throw new Error('Impossible de charger les produits recommandés');
          }
        }
      } else {
        // Construire l'URL de l'API en fonction des paramètres disponibles
        try {
          let apiUrl = '/api/products?';
          const params = [];
          
          if (productId) {
            params.push(`relatedTo=${productId}`);
          }
          
          if (categoryId) {
            params.push(`category=${categoryId}`);
          }
          
          if (limit && limit > 0) {
            params.push(`limit=${limit}`);
          }
          
          apiUrl += params.join('&');
          
          console.log('Chargement des recommandations depuis:', apiUrl);
          
          const response = await axios.get(apiUrl);
          
          if (response.data) {
            if (Array.isArray(response.data)) {
              products = response.data;
            } else if (response.data.products && Array.isArray(response.data.products)) {
              products = response.data.products;
            } else if (response.data.data && Array.isArray(response.data.data)) {
              products = response.data.data;
            }
          }
          
          // Si aucun produit n'est trouvé avec les filtres, charger des produits aléatoires
          if (products.length === 0) {
            console.log('Aucun produit trouvé avec les filtres, chargement de produits aléatoires');
            const randomResponse = await axios.get(`/api/products?limit=${limit || 4}&random=true`);
            
            if (randomResponse.data) {
              if (Array.isArray(randomResponse.data)) {
                products = randomResponse.data;
              } else if (randomResponse.data.products && Array.isArray(randomResponse.data.products)) {
                products = randomResponse.data.products;
              } else if (randomResponse.data.data && Array.isArray(randomResponse.data.data)) {
                products = randomResponse.data.data;
              }
            }
          }
        } catch (apiError) {
          console.error('Erreur lors de la requête principale:', apiError);
          
          // Essayer de charger des produits de secours
          try {
            const fallbackResponse = await axios.get('/api/products?limit=4');
            if (fallbackResponse.data && Array.isArray(fallbackResponse.data)) {
              products = fallbackResponse.data;
            } else if (fallbackResponse.data && Array.isArray(fallbackResponse.data.products)) {
              products = fallbackResponse.data.products;
            } else if (fallbackResponse.data && Array.isArray(fallbackResponse.data.data)) {
              products = fallbackResponse.data.data;
            }
          } catch (fallbackError) {
            console.error('Erreur lors du chargement des produits de secours:', fallbackError);
            throw new Error('Impossible de charger les produits recommandés');
          }
        }
      }
      
      // Filtrer pour éviter d'inclure le produit actuel dans les recommandations
      if (productId) {
        products = products.filter(product => 
          product._id !== productId && 
          product.id !== productId
        );
      }
      
      // Limiter le nombre de produits affichés
      const limitedProducts = products.slice(0, limit || 4);
      setRecommendedProducts(limitedProducts);
      
    } catch (error) {
      console.error('Erreur lors du chargement des produits recommandés:', error);
      setError('Impossible de charger les produits recommandés. Veuillez réessayer plus tard.');
      setRecommendedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const loadProducts = async () => {
      if (!visible) return;
      
      try {
        await fetchRecommendedProducts();
      } catch (err) {
        console.error("Erreur lors du chargement des recommandations:", err);
        if (mounted) {
          setError('Impossible de charger les produits recommandés');
          setRecommendedProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    loadProducts();
    
    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, categoryId, limit, visible]);

  if (loading) {
    return (
      <Container className="my-5">
        <h2 className="mb-4">{title}</h2>
        <div className="text-center py-5">
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <h2 className="mb-4">{title}</h2>
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!recommendedProducts.length) {
    return (
      <Container className="my-5">
        <h2 className="mb-4">{title}</h2>
        <Alert variant="info">
          Aucun produit recommandé pour le moment. Veuillez réessayer plus tard.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">{title}</h2>
      <Row>
        {recommendedProducts.map((product) => (
          <Col key={product._id || product.id} xs={12} sm={6} md={3} className="mb-4">
            <Card className="h-100 product-card">
              <Link href={`/shop/product/${product._id || product.id}`} passHref legacyBehavior>
                <a className="text-decoration-none">
                  <div className="position-relative" style={{ height: '180px' }}>
                    <Image
                      src={product.image || product.img || '/assets/images/shop/placeholder.jpg'}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="card-img-top"
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="text-dark">{product.name}</Card.Title>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-dark fw-bold">{(product.price || 0).toFixed(2)} €</span>
                      {product.relevanceScore && (
                        <span className="badge bg-info">
                          Score: {product.relevanceScore}%
                        </span>
                      )}
                    </div>
                  </Card.Body>
                </a>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductRecommendations;
