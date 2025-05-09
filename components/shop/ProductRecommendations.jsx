import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Rating from '../common/Rating';

const ProductRecommendations = ({ productId, limit = 4, title = "Recommandations personnalisées pour vous" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les produits recommandés
  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);
      console.log(`Récupération des produits recommandés pour le produit: ${productId}`);

      // URL de base pour les produits
      let apiUrl = `/api/products?limit=${limit}`;

      // Ajouter le paramètre related seulement si productId existe
      if (productId) {
        apiUrl += `&related=${productId}`;
      }

      console.log(`URL de requête : ${apiUrl}`);
      let response = await fetch(apiUrl);

      if (!response.ok) {
        console.error(`Erreur HTTP! Statut: ${response.status}, message: ${response.statusText}`);
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }

      // Traiter la réponse
      let data = await response.json();
      console.log("Données brutes reçues:", data);

      // Si nous n'avons pas assez de produits, compléter avec des produits populaires
      if (!data || !Array.isArray(data) || data.length < limit) {
        console.log("Pas assez de produits, tentative avec produits populaires");
        try {
          const backupResponse = await fetch(`/api/products/popular?limit=${limit}`);
          console.log(`URL de requête backup : /api/products/popular?limit=${limit}`);

          if (backupResponse.ok) {
            const backupData = await backupResponse.json();
            console.log("Données de backup reçues:", backupData);

            // Si nous avons des données de recommandation, les fusionner avec les produits populaires
            if (data && Array.isArray(data) && data.length > 0) {
              // Obtenir uniquement les IDs des produits déjà dans nos recommandations
              const existingIds = data.map(product => product.id || product._id);

              // Filtrer les produits de sauvegarde pour éviter les doublons
              const additionalProducts = backupData.filter(product => {
                const productId = product.id || product._id;
                return !existingIds.includes(productId);
              });

              // Ajouter les produits supplémentaires jusqu'à atteindre la limite
              if (additionalProducts.length > 0) {
                let productsNeeded = limit - data.length;
                data = [...data, ...additionalProducts.slice(0, productsNeeded)];
                console.log("Produits fusionnés:", data.length);
              }
            } else {
              // Si aucune recommandation, utiliser directement les produits populaires
              data = backupData;
              console.log("Utilisation des produits populaires:", data.length);
            }
          } else {
            console.error(`Erreur lors de la récupération des produits populaires: Status ${backupResponse.status}, message: ${backupResponse.statusText}`);
          }
        } catch (backupError) {
          console.error("Erreur lors de la récupération des produits populaires:", backupError);
        }
      }

      // Standardiser le format des produits pour l'affichage
      if (data && Array.isArray(data)) {
          // Vérification de débogage pour chaque produit
          const processedProducts = data.map(product => {
            // Détails plus précis sur les propriétés d'avis du produit
            console.log(`ProductRecommendations - Détails du produit ${product.id || product._id}:`, {
              hasRating: product.rating !== undefined || product.ratings !== undefined,
              ratingValue: product.rating || product.ratings,
              ratingType: product.rating !== undefined ? typeof product.rating : (product.ratings !== undefined ? typeof product.ratings : 'undefined'),
              hasReviews: product.reviews !== undefined,
              reviewCount: product.reviews ? product.reviews.length : (product.ratingsCount || 0),
              reviewsType: product.reviews ? typeof product.reviews : 'undefined',
              isArrayReviews: product.reviews ? Array.isArray(product.reviews) : false
            });

            // S'assurer que chaque produit a les propriétés nécessaires
            return {
              id: product.id || product._id || '',
              name: product.name || 'Produit sans nom',
              price: product.price || 0,
              salePrice: product.salePrice || product.discountPrice || 0,
              img: product.img || product.imageUrl || product.images?.[0] || '/images/placeholder.png',
              ratings: product.rating || product.ratings || 0,
              ratingsCount: product.ratingsCount || (product.reviews ? product.reviews.length : 0) || 0,
              reviewsData: product.reviews || []
            };
          });

          console.log("Produits traités avant setState:", processedProducts.length, processedProducts);
          if (processedProducts.length > 0) {
            setProducts(processedProducts);
          } else {
            console.warn("Aucun produit traité disponible");
            setProducts([]);
          }
      } else {
        // Si aucune donnée ou format inapproprié
        console.warn("Format de données inapproprié:", data);
        setProducts([]);
      }

    } catch (error) {
      console.error("Erreur lors de la récupération des produits recommandés:", error);
      setError("Impossible de charger les recommandations. Veuillez réessayer plus tard.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      // Toujours tenter de charger des produits, même sans ID on peut avoir des recommandations populaires
      await fetchRecommendedProducts();
    };

    loadProducts();

    // Debug: Surveiller les changements dans les produits
    console.log("ProductRecommendations - Début chargement, ID:", productId);
  }, [productId, limit]);

  // Enregistrer les changements d'état des produits
  useEffect(() => {
    console.log("ProductRecommendations - Produits chargés:", products.length, products);
  }, [products]);

  if (loading) {
    return (
      <div className="product-recommendations p-3 mb-4">
        <h4 className="mb-4">{title}</h4>
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-recommendations p-3 mb-4">
        <h4 className="mb-4">{title}</h4>
        <div className="alert alert-warning">{error}</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="product-recommendations p-3 mb-4">
      <h4 className="mb-4">{title}</h4>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-3 col-6 mb-3" key={product.id}>
            <div className="product-card h-100 border rounded p-2">
              <Link
                href={`/shop/product/${product.id}`}
                className="d-block text-decoration-none"
                legacyBehavior>
                <div className="product-image-container mb-2">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="img-fluid product-image mx-auto d-block"
                    style={{ height: "120px", objectFit: "contain" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>
                <h6 className="product-title text-truncate mb-1" style={{ fontSize: "0.9rem" }}>
                  {product.name}
                </h6>
                <div className="d-flex flex-column">
                  {typeof product.ratings !== 'undefined' && (
                    <Rating 
                      value={product.ratings !== null ? product.ratings : 0} 
                      count={product.ratingsCount !== null ? product.ratingsCount : 0} 
                      showCount={true} 
                      size="small" 
                    />
                  )}
                  <div className="product-price mt-1">
                    {product.salePrice > 0 && product.salePrice < product.price ? (
                      <>
                        <span className="text-primary fw-bold me-2">{product.salePrice} €</span>
                        <small className="text-muted text-decoration-line-through">{product.price} €</small>
                      </>
                    ) : (
                      <span className="text-primary fw-bold">{product.price} €</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;