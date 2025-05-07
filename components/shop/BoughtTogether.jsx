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

const BoughtTogether = ({ currentProduct, checkedItems, onToggleItem, total }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

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
      console.log('BoughtTogether - Produit courant:', currentProduct);

      try {
        // Plusieurs tentatives de récupération avec différents formats d'URL
        let response;
        let data;
        let success = false;
        
        // TENTATIVE 1: API directe des produits reliés
        try {
          console.log('Tentative 1: API des produits reliés...');
          response = await fetchWithTimeout(`/api/products?limit=${limit}&related=${productId}`, {}, 3000);
          
          if (response.ok) {
            data = await response.json();
            success = true;
            console.log('✅ API produits reliés OK');
          } else if (response.status === 500) {
            console.log('⚠️ Erreur 500 sur API produits reliés - problème serveur détecté');
            
            // Vérifier si c'est une erreur MongoDB spécifique
            try {
              const errorText = await response.text();
              if (errorText.includes('MongoNotConnectedError') || errorText.includes('MongoServerError')) {
                console.log('⚠️ Erreur MongoDB confirmée:', errorText.substring(0, 100));
              }
            } catch (parseErr) {
              console.log('Impossible de parser le texte de l\'erreur:', parseErr);
            }
          }
        } catch (e) {
          console.log('Tentative 1 échouée:', e.message);
        }
        
        // TENTATIVE 2: API de la même catégorie
        if (!success && currentProduct.category) {
          try {
            console.log('Tentative 2: API produits par catégorie...');
            const category = encodeURIComponent(currentProduct.category);
            response = await fetchWithTimeout(`/api/products?limit=${limit}&category=${category}`, {}, 3000);
            
            if (response.ok) {
              data = await response.json();
              success = true;
              console.log('✅ API produits par catégorie OK');
            } else if (response.status === 500) {
              console.log('⚠️ Erreur 500 sur API produits par catégorie - problème serveur détecté');
              
              // Vérifier si c'est une erreur MongoDB spécifique
              try {
                const errorText = await response.text();
                if (errorText.includes('MongoNotConnectedError') || errorText.includes('MongoServerError')) {
                  console.log('⚠️ Erreur MongoDB confirmée sur API catégorie');
                }
              } catch (parseErr) {
                console.log('Impossible de parser le texte de l\'erreur catégorie:', parseErr);
              }
            }
          } catch (e) {
            console.log('Tentative 2 échouée:', e.message);
          }
        }
        
        // TENTATIVE 3: API avec tous les produits
        if (!success) {
          try {
            console.log('Tentative 3: API de tous les produits...');
            response = await fetchWithTimeout(`/api/products?limit=${limit}`, {}, 3000);
            
            if (response.ok) {
              data = await response.json();
              success = true;
              console.log('✅ API de tous les produits OK');
            } else if (response.status === 500) {
              console.log('⚠️ Erreur 500 sur API de tous les produits - problème serveur détecté');
              
              // Puisque toutes les API ont échoué avec 500, c'est probablement un problème MongoDB global
              console.log('⚠️ Problème de connexion MongoDB global détecté après 3 tentatives d\'API');
            }
          } catch (e) {
            console.log('Tentative 3 échouée:', e.message);
          }
        }
        
        // TENTATIVE 4: Utiliser des données provenant du produit courant
        if (!success && currentProduct.relatedProducts && Array.isArray(currentProduct.relatedProducts)) {
          try {
            console.log('Tentative 4: Utilisation des relatedProducts du produit courant...');
            data = currentProduct.relatedProducts.slice(0, limit);
            if (data.length > 0) {
              success = true;
              console.log('✅ Produits liés trouvés dans le produit courant');
            }
          } catch (e) {
            console.log('Tentative 4 échouée:', e.message);
          }
        }
        
        // TENTATIVE 5: Utiliser des données provenant du produit courant (similarProducts)
        if (!success && currentProduct.similarProducts && Array.isArray(currentProduct.similarProducts)) {
          try {
            console.log('Tentative 5: Utilisation des similarProducts du produit courant...');
            data = currentProduct.similarProducts.slice(0, limit);
            if (data.length > 0) {
              success = true;
              console.log('✅ Produits similaires trouvés dans le produit courant');
            }
          } catch (e) {
            console.log('Tentative 5 échouée:', e.message);
          }
        }
        
        // TENTATIVE 6: Utiliser des données provenant du produit courant (boughtTogether)
        if (!success && currentProduct.boughtTogether && Array.isArray(currentProduct.boughtTogether)) {
          try {
            console.log('Tentative 6: Utilisation des boughtTogether du produit courant...');
            data = currentProduct.boughtTogether.slice(0, limit);
            if (data.length > 0) {
              success = true;
              console.log('✅ Produits achetés ensemble trouvés dans le produit courant');
            }
          } catch (e) {
            console.log('Tentative 6 échouée:', e.message);
          }
        }
        
        // SOLUTION DE SECOURS: Utiliser les produits de secours statiques
        if (!success) {
          console.log('⚠️ Toutes les tentatives de récupération ont échoué, utilisation des produits de secours');
          setError("Impossible de récupérer les produits associés");
          setProducts(FALLBACK_PRODUCTS);
          setLoading(false);
          return;
        }

        // Parser les données selon leur format
        let productsData = [];
        if (Array.isArray(data)) {
          productsData = data;
          console.log('✅ Format tableau détecté avec', data.length, 'produits');
        } else if (data.products && Array.isArray(data.products)) {
          productsData = data.products;
          console.log('✅ Format data.products détecté avec', data.products.length, 'produits');
        } else if (data.data && Array.isArray(data.data)) {
          productsData = data.data;
          console.log('✅ Format data.data détecté avec', data.data.length, 'produits');
        } else if (data.success && Array.isArray(data.products)) {
          productsData = data.products;
          console.log('✅ Format data.success.products détecté avec', data.products.length, 'produits');
        } else {
          console.error('Format de données inattendu:', data);
          console.log('⚠️ Utilisation des produits de secours en raison du format de données inattendu');
          productsData = FALLBACK_PRODUCTS;
        }
        
        // Filtrer pour exclure le produit actuel
        const filteredProducts = productsData.filter(p => {
          const pId = p._id || p.id || p.legacyId;
          return pId !== productId;
        });
        
        if (filteredProducts.length > 0) {
          console.log(`✅ ${filteredProducts.length} produits associés trouvés`);
          setProducts(filteredProducts.slice(0, limit));
          setError(null);
        } else {
          // Si on n'a pas trouvé de produits, utiliser les produits de secours
          console.log('⚠️ Aucun produit filtré trouvé, utilisation des produits de secours');
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (err) {
        console.error('Erreur finale lors de la récupération des produits achetés ensemble:', err);
        setError(err.message);
        // Utiliser les produits de secours
        setProducts(FALLBACK_PRODUCTS);
        
        // Si nous avons moins de 3 tentatives, essayer à nouveau après un délai
        if (retryCount < 2) {
          console.log(`Nouvelle tentative (${retryCount + 1}/2) dans 3 secondes...`);
          setTimeout(() => {
            setRetryCount(prevCount => prevCount + 1);
            setLoading(true);
          }, 3000);
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBoughtTogetherProducts();
  }, [currentProduct, retryCount]);

  // Si aucun produit n'est trouvé ou s'il y a moins de 1 produit, ne pas afficher la section
  if (!products || !Array.isArray(products) || products.length < 1) {
    console.log('BoughtTogether - Aucun produit à afficher, returning null');
    return null;
  }
  
  console.log('BoughtTogether - Produits à afficher:', products.length);

  if (loading) {
    return (
      <Row className="my-5">
        <Col>
          <h2 className="mb-4">Souvent achetés ensemble</h2>
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            {retryCount > 0 && <p className="mt-2 text-muted">Nouvelle tentative {retryCount}/2...</p>}
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="my-5">
      <Col>
        <h2 className="mb-4">Souvent achetés ensemble</h2>
        {error && (
          <div className="alert alert-warning mb-4">
            Certaines recommandations personnalisées ne sont pas disponibles. Voici des suggestions qui pourraient vous intéresser.
          </div>
        )}
        <Row>
          {products.map((product) => (
            <Col key={product._id || product.id || `product-${Math.random().toString(36).substr(2, 9)}`} md={4} sm={6} className="mb-4">
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