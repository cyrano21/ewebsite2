import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '../LoadingSpinner';

const RecentlyViewedProducts = ({ currentProductId, limit = 4 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProductId) {
      setLoading(false);
      return;
    }

    // Récupérer les produits récemment consultés depuis localStorage
    const fetchRecentlyViewedProducts = async () => {
      setLoading(true);
      
      // Utiliser un timeout plus court (3s)
      const TIMEOUT_DURATION = 3000;
      
      // Assurer que l'ID est une chaîne
      const validProductId = String(currentProductId);
      
      try {
        // Mettre à jour les vues du produit (sans bloquer si ça échoue)
        fetch(`/api/products/${validProductId}/view`)
          .then(() => console.log('Vue de produit enregistrée'))
          .catch((err) => console.warn('Échec d\'enregistrement de vue:', err.message));

        // Récupérer les produits récemment consultés depuis localStorage
        let recentlyViewed = [];
        try {
          recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        } catch (error) {
          console.warn('Erreur de parsing localStorage:', error);
          recentlyViewed = [];
        }

        // Filtrer pour exclure le produit actuel
        const filteredProducts = recentlyViewed
          .filter(id => id !== currentProductId)
          .slice(0, limit);

        if (filteredProducts.length > 0) {
          // Utiliser Promise.race avec un timeout pour chaque requête
          const fetchProductWithTimeout = async (id) => {
            const controller = new AbortController();
            const { signal } = controller;
            
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);
            
            try {
              const response = await fetch(`/api/products/${id}`, { signal });
              clearTimeout(timeoutId);
              
              if (!response.ok) return null;
              return await response.json();
            } catch (error) {
              clearTimeout(timeoutId);
              console.warn(`Échec de récupération du produit ${id}:`, error.message);
              return null;
            }
          };
          
          // Utiliser Promise.allSettled pour continuer même si certaines promesses échouent
          const results = await Promise.allSettled(
            filteredProducts.map(id => fetchProductWithTimeout(id))
          );
          
          // Filtrer les produits valides
          const validProducts = results
            .filter(result => result.status === 'fulfilled' && result.value)
            .map(result => result.value);
          
          if (validProducts.length > 0) {
            setProducts(validProducts);
            setLoading(false);
            return;
          }
        }
        
        // Si aucun produit récemment consulté valide, récupérer des produits aléatoires
        try {
          // Utiliser un AbortController pour gérer le timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);
          
          const response = await fetch(`/api/products?limit=${limit}`, { 
            signal: controller.signal 
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
          }
          
          const data = await response.json();
          const filteredData = data.filter(p => p._id !== currentProductId).slice(0, limit);
          
          if (filteredData.length > 0) {
            setProducts(filteredData);
          } else {
            // Aucun produit trouvé
            setProducts([]);
          }
        } catch (error) {
          console.warn('Échec de récupération des produits alternatifs:', error.message);
          setProducts([]);
        }
      } catch (error) {
        console.error('Erreur générale:', error.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewedProducts();

    // Mettre à jour la liste des produits récemment consultés
    try {
      // S'assurer que currentProductId est valide avant de l'ajouter au localStorage
      if (currentProductId) {
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const filteredList = recentlyViewed.filter(id => id !== currentProductId);
        const updatedList = [currentProductId, ...filteredList].slice(0, 10);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedList));
        console.log('Liste des produits récemment consultés mise à jour');
      }
    } catch (error) {
      console.warn('Erreur localStorage:', error.message);
    }
  }, [currentProductId, limit]);

  if (loading) {
    return (
      <Container className="my-5">
        <h2 className="mb-4">Récemment consultés</h2>
        <div className="text-center py-5">
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <Container className="my-5 recently-viewed-products">
      <h2 className="mb-4">Récemment consultés</h2>
      <Row>
        {products.map((product) => (
          <Col key={product._id} xs={6} md={3} className="mb-4">
            <Card className="h-100 product-card shadow-sm">
              <Link href={`/shop/product/${product._id}`} passHref legacyBehavior>
                <div className="position-relative" style={{ height: '200px' }}>
                  <Image
                    src={product.image || '/assets/images/shop/placeholder.jpg'}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    className="card-img-top p-2"
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
    </Container>
  );
};

export default RecentlyViewedProducts;