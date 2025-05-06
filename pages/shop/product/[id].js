import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import { useRouter } from "next/router";
import Head from "next/head";
import { Container, Row, Col, Spinner, Button, Card } from "react-bootstrap";
import Link from "next/link";
import SingleProduct from '../../../components/shop/SingleProduct';
import ProductRecommendations from '../../../components/shop/ProductRecommendations';
import BoughtTogether from '../../../components/shop/BoughtTogether';
import RecentlyViewedProducts from '../../../components/shop/RecentlyViewedProducts';
import SEOHead from '../../../components/SEOHead';
import ProductTabs from '../../../components/shop/ProductTabs';
import SimilarProducts from '../../../components/shop/SimilarProducts';
import Tags from '../../../components/shop/Tags';

// --- IMPORT YOUR ACTUAL PRODUCT DATA ---
import {
  topDealsProducts,
  topElectronicProducts,
  bestOfferProducts,
  allProducts,
  suggestedProducts,
} from "../../../data/e-commerce/products";

// --- UPDATED DATA FETCH FUNCTION ---
const fetchProductData = async (id, baseUrl = '') => {
  try {
    // Vérifier si l'id est valide
    if (!id) {
      throw new Error('ID de produit invalide');
    }
    
    // Fallback data (utilisé en cas d'échec de l'API)
    const fallbackProduct = {
      _id: id,
      id: id,
      name: "Produit temporaire",
      description: "Les détails du produit sont temporairement indisponibles. Veuillez réessayer ultérieurement.",
      price: 99.99,
      salePrice: 0,
      image: "/assets/images/shop/placeholder.jpg",
      category: "uncategorized",
      stock: 10,
      similarProducts: [],
      boughtTogether: []
    };
    
    // 1) le produit principal
    try {
      const res = await fetch(`${baseUrl}/api/products/${id}`);
      
      if (!res.ok) {
        const errorStatus = res.status;
        const errorText = await res.text().catch(() => 'Erreur inconnue');
        console.error(`Erreur API (${errorStatus}):`, errorText);
        
        // Si l'erreur est un problème de base de données (500), utiliser des données statiques
        if (errorStatus === 500) {
          console.log("Problème de serveur détecté, utilisation de données de secours");
          
          // Essayer de récupérer le produit depuis les données locales importées
          try {
            const localProduct = allProducts.find(p => String(p.id) === String(id) || String(p._id) === String(id));
            if (localProduct) {
              console.log("Produit trouvé dans les données locales");
              return { ...localProduct, similarProducts: suggestedProducts.slice(0, 4), boughtTogether: suggestedProducts.slice(4, 7) };
            }
          } catch (localErr) {
            console.warn("Échec de la récupération locale:", localErr);
          }
          
          // Utiliser un produit de secours générique
          console.log("Utilisation du produit de secours générique");
          return fallbackProduct;
        }
        
        throw new Error(`Erreur produit: ${errorStatus}`);
      }
      
      const productData = await res.json();
      
      // Vérifier si nous avons bien reçu un objet produit
      if (!productData || (typeof productData === 'object' && Object.keys(productData).length === 0)) {
        throw new Error('Données de produit invalides');
      }
      
      // Extraire le produit si l'API retourne un wrapper
      const product = productData.data || productData;
      
      // Vérifier si le produit a une catégorie
      if (!product.category) {
        console.warn('Produit sans catégorie:', id);
        product.category = 'uncategorized';
      }

      // 2) produits similaires
      let similarProducts = [];
      try {
        // Essayer d'abord l'API qui utilise la catégorie
        console.log(`Récupération des produits similaires pour la catégorie: ${product.category}`);
        const simRes = await fetch(
          `${baseUrl}/api/products?category=${encodeURIComponent(
            product.category
          )}&limit=4&exclude=${id}`
        );
        
        if (simRes.ok) {
          const simData = await simRes.json();
          console.log("Réponse API produits similaires:", simData);
          
          // Gérer différents formats de réponse possibles
          if (Array.isArray(simData)) {
            similarProducts = simData;
            console.log(`✅ ${similarProducts.length} produits similaires trouvés (format tableau)`);
          } else if (simData.data && Array.isArray(simData.data)) {
            similarProducts = simData.data;
            console.log(`✅ ${similarProducts.length} produits similaires trouvés (format data)`);
          } else if (simData.products && Array.isArray(simData.products)) {
            similarProducts = simData.products;
            console.log(`✅ ${similarProducts.length} produits similaires trouvés (format products)`);
          } else {
            console.log("❌ Format de réponse inattendu pour les produits similaires:", simData);
          }
        } else {
          console.log(`❌ Erreur API produits similaires: ${simRes.status}`);
          
          // En cas d'erreur serveur, utiliser des données statiques
          if (simRes.status === 500) {
            similarProducts = suggestedProducts.slice(0, 4);
            console.log("Utilisation de produits similaires statiques");
          }
        }
        
        // Si aucun produit similaire n'a été trouvé, essayer une API de secours ou utiliser des statiques
        if (similarProducts.length === 0) {
          try {
            console.log("Tentative de récupération de produits aléatoires...");
            const fallbackRes = await fetch(`${baseUrl}/api/products?limit=4&random=true&exclude=${id}`);
            
            if (fallbackRes.ok) {
              const fbData = await fallbackRes.json();
              
              // Gérer différents formats de réponse possibles
              if (Array.isArray(fbData)) {
                similarProducts = fbData;
              } else if (fbData.data && Array.isArray(fbData.data)) {
                similarProducts = fbData.data;
              } else if (fbData.products && Array.isArray(fbData.products)) {
                similarProducts = fbData.products;
              }
              
              console.log(`✅ ${similarProducts.length} produits aléatoires trouvés comme alternative`);
            } else if (fallbackRes.status === 500) {
              // En cas d'erreur serveur, utiliser des données statiques
              similarProducts = suggestedProducts.slice(0, 4);
              console.log("Utilisation de produits similaires statiques (API aléatoire 500)");
            }
          } catch (randomErr) {
            console.warn("Erreur lors de la récupération de produits aléatoires:", randomErr);
            similarProducts = suggestedProducts.slice(0, 4);
            console.log("Utilisation de produits similaires statiques après erreur");
          }
        }
      } catch (e) {
        console.warn("Impossible de charger produits similaires:", e);
        // En cas d'erreur, utiliser des produits de secours importés
        similarProducts = suggestedProducts.slice(0, 4);
        console.log("Utilisation de produits similaires de secours après exception");
      }

      // 3) produits achetés ensemble
      let boughtTogether = [];
      try {
        const btRes = await fetch(
          `${baseUrl}/api/products?featured=true&limit=3&exclude=${id}`
        );
        if (btRes.ok) {
          const btData = await btRes.json();
          boughtTogether = Array.isArray(btData) ? btData : 
                          (btData.data && Array.isArray(btData.data)) ? btData.data : 
                          (btData.products && Array.isArray(btData.products)) ? btData.products : [];
        } else if (btRes.status === 500) {
          // En cas d'erreur serveur, utiliser des données statiques
          boughtTogether = suggestedProducts.slice(4, 7);
          console.log("Utilisation de produits 'achetés ensemble' statiques");
        }
      } catch (e) {
        console.warn("Impossible de charger produits achetés ensemble:", e);
        boughtTogether = suggestedProducts.slice(4, 7);
      }

      // 4) injection dans l'objet final
      return { ...product, similarProducts, boughtTogether };
      
    } catch (fetchError) {
      console.error('Erreur lors de la récupération du produit principal:', fetchError);
      // Utiliser des données locales en cas d'erreur
      const localProduct = allProducts.find(p => String(p.id) === String(id) || String(p._id) === String(id));
      
      if (localProduct) {
        console.log("Produit trouvé dans les données locales après erreur");
        return { 
          ...localProduct,
          similarProducts: suggestedProducts.slice(0, 4),
          boughtTogether: suggestedProducts.slice(4, 7)
        };
      }
      
      // Si rien ne fonctionne, renvoyer l'erreur originale
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Erreur dans fetchProductData:', error);
    throw error; // Propagation de l'erreur pour traitement dans le composant
  }
};

// --- SSR: récupération du produit côté serveur ---
export async function getServerSideProps(context) {
  const { id } = context.params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
    : 'http://localhost:4000';
  try {
    const product = await fetchProductData(id, baseUrl);
    return { props: { ssrProduct: product } };
  } catch (err) {
    return { props: { ssrProduct: null, ssrError: err.message || 'Erreur inconnue' } };
  }
}

// --- DÉFINITION DU COMPOSANT ProductPage ---
const ProductPage = ({ ssrProduct, ssrError }) => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(ssrProduct || null);
  const [recentlyViewed, setRecentlyViewed] = useState([]); // Added state for recently viewed products
  const [loading, setLoading] = useState(!ssrProduct && !ssrError);
  const [error, setError] = useState(ssrError || null);
  const { user } = useContext(AuthContext); // Contexte d'authentification


  // Enregistrer la visite du produit dans le localStorage
  const trackProductView = (productData) => {
    if (!productData) return;

    try {
      // Enregistrer l'intérêt pour ce type de produit (placeholder)
      if (productData.category) {
        trackInterest(productData.category);
      }

      if (productData.tags && productData.tags.length > 0) {
        productData.tags.forEach(tag => trackInterest(tag));
      }

      // Enregistrer le produit dans les récemment vus
      const recentlyViewedProducts = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');

      // Vérifier si le produit est déjà dans la liste
      const existingIndex = recentlyViewedProducts.findIndex(p => p._id === productData._id);
      if (existingIndex !== -1) {
        // Supprimer pour le remettre en premier
        recentlyViewedProducts.splice(existingIndex, 1);
      }

      // Ajouter le produit au début de la liste
      recentlyViewedProducts.unshift({
        _id: productData._id,
        name: productData.name,
        image: productData.image,
        price: productData.price,
        salePrice: productData.salePrice,
        category: productData.category,
        timestamp: new Date().toISOString()
      });

      // Limiter à 10 produits maximum
      const limitedList = recentlyViewedProducts.slice(0, 10);
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(limitedList));

      // Mettre à jour l'état
      setRecentlyViewed(limitedList);

    } catch (error) {
      console.error('Erreur lors du suivi de la vue du produit:', error);
    }
  };


  useEffect(() => {
    // Ne rien faire si l'ID n'est pas encore disponible
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);
      // Réinitialiser les états d'interaction
      setQuantity(1);
      setSelectedColor(null);
      setSelectedSize(null);
      setSelectedImage(null);
      setBoughtTogetherChecked({});

      try {
        const data = await fetchProductData(id); // Appel de la fonction mise à jour
        if (data) {
          setProduct(data);
          trackProductView(data); // Track product view after successful fetch
          // Initialiser les sélections par défaut
          // Déterminer la meilleure image à afficher
          let selectedImg =
            data.colors?.[0]?.img && typeof data.colors[0].img === "string"
              ? data.colors[0].img
              : typeof data.img === "string" && data.img
              ? data.img
              : (Array.isArray(data.thumbnails) && data.thumbnails.length > 0
                  ? data.thumbnails[0]
                  : null) || "/images/placeholder.png";
          setSelectedImage(selectedImg);
          if (data.colors?.length > 0) {
            setSelectedColor(data.colors[0]);
            // Mettre à jour l'image si la couleur a une image spécifique
            if (data.colors[0].img && typeof data.colors[0].img === "string")
              setSelectedImage(data.colors[0].img);
          }
          if (data.sizes?.length > 0) {
            setSelectedSize(data.sizes[0]);
          }
          // Initialiser l'état des checkboxes "Bought Together"
          const initialBoughtTogether = { [data.id]: true }; // L'article principal est coché
          data.boughtTogether?.forEach((item) => {
            if (item && item.id) {
              initialBoughtTogether[item.id] = false; // Les autres non cochés par défaut
            }
          });
          setBoughtTogetherChecked(initialBoughtTogether);
        } else {
          setError("Product not found."); // Définir l'erreur si aucune donnée n'est retournée
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(err.message || "Failed to load product."); // Gérer les erreurs de fetch
      } finally {
        setLoading(false); // Arrêter le chargement dans tous les cas
      }
    };

    loadProduct();
  }, [id]); // Ré-exécuter l'effet si l'ID change

  // --- États pour les interactions utilisateur ---
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [boughtTogetherChecked, setBoughtTogetherChecked] = useState({});

  // --- Calculs mémorisés pour éviter les re-calculs inutiles ---
  const discount = useMemo(() => {
    if (!product || !product.salePrice || !product.price || product.price <= 0)
      return 0;
    const priceNum = Number(product.price);
    const salePriceNum = Number(product.salePrice);
    if (isNaN(priceNum) || isNaN(salePriceNum) || priceNum <= 0) return 0;
    return Math.round(((priceNum - salePriceNum) / priceNum) * 100);
  }, [product]);

  const totalBoughtTogetherPrice = useMemo(() => {
    if (!product || !product.id) return "0.00";
    let total = 0;
    const mainPrice = Number(product.salePrice || product.price || 0);
    if (boughtTogetherChecked[product.id] && !isNaN(mainPrice)) {
      total += mainPrice;
    }
    product.boughtTogether?.forEach((item) => {
      if (item && item.id && boughtTogetherChecked[item.id]) {
        const itemPrice = Number(item.price || 0);
        if (!isNaN(itemPrice)) {
          total += itemPrice;
        }
      }
    });
    return total.toFixed(2);
  }, [product, boughtTogetherChecked]);

  // --- Fonctions de rappel pour les interactions utilisateur ---
  const handleThumbnailSelect = useCallback((url) => {
    setSelectedImage(url);
  }, []);

  const handleColorSelect = useCallback(
    (color) => {
      setSelectedColor(color);
      if (color?.img) {
        setSelectedImage(color.img);
      } else if (product?.img) {
        setSelectedImage(product.img);
      }
    },
    [product]
  ); // Dépend de product pour l'image par défaut

  const handleSizeSelect = useCallback((size) => {
    setSelectedSize(size);
  }, []);

  const handleQuantityChange = useCallback(
    (newQuantity) => {
      const maxQty = typeof product?.stock === "number" ? product.stock : 1;
      const validQuantity = Math.max(1, Math.min(newQuantity, maxQty));
      setQuantity(validQuantity);
    },
    [product?.stock]
  ); // Dépend du stock du produit

  const handleToggleBoughtTogether = useCallback((itemId) => {
    if (!itemId) return;
    setBoughtTogetherChecked((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  // --- Fonctions pour Ajouter au Panier / Wishlist (Logique à implémenter) ---
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    // TODO: Remplacer alert par la vraie logique (contexte panier, API, etc.)
    alert(
      `Ajouté ${quantity} x ${product.name} (Couleur: ${
        selectedColor?.name || "N/A"
      }, Taille: ${selectedSize || "N/A"}) au panier.`
    );
    // Exemple: dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, selectedColor, selectedSize } });
  }, [product, quantity, selectedColor, selectedSize]);

  const handleAddToWishlist = useCallback(() => {
    if (!product) return;
    // TODO: Remplacer alert par la vraie logique (contexte wishlist, API, etc.)
    alert(`Ajouté ${product.name} à la wishlist.`);
    // Exemple: addToWishlist(product);
  }, [product]);

  // --- Logique de Rendu ---

  useEffect(() => {
    if (id) {
      // Sauvegarder le produit consulté dans localStorage
      const trackRecentlyViewedProduct = async () => {
        try {
          // Récupérer les informations du produit
          const response = await fetch(`/api/products/${id}`);
          if (response.ok) {
            const productData = await response.json();

            if (productData.success && productData.data) {
              const product = productData.data;

              // Récupérer la liste existante
              const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

              // Vérifier si le produit est déjà dans la liste
              const existingIndex = recentlyViewed.findIndex(item => item.id === id);

              // Si oui, le supprimer pour le remettre en tête de liste
              if (existingIndex !== -1) {
                recentlyViewed.splice(existingIndex, 1);
              }

              // Ajouter le produit en tête de liste
              recentlyViewed.unshift({
                id: product._id || product.id,
                name: product.name,
                price: product.price,
                discountPrice: product.discountPrice,
                img: product.imageUrl || product.img,
                rating: product.rating,
                numReviews: product.ratingsCount || product.numReviews || 0,
                category: product.category?.name || product.category
              });

              // Limiter à 10 produits maximum
              const limitedList = recentlyViewed.slice(0, 10);

              // Sauvegarder la liste mise à jour
              localStorage.setItem('recentlyViewed', JSON.stringify(limitedList));

              // Déclencher un événement pour notifier les composants intéressés
              window.dispatchEvent(new Event('recentProducts:update'));
            }
          }
        } catch (error) {
          console.error('Erreur lors du suivi du produit consulté:', error);
        }
      };

      trackRecentlyViewedProduct();
    }
  }, [id]);


  // Affichage pendant le chargement
  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <Container className="text-center py-5 mt-5">
        <p className="text-danger fs-5 mb-4">{error}</p>
        <Link href="/shop" passHref legacyBehavior>
          <a>
            <Button variant="primary">Retour à la boutique</Button>
          </a>
        </Link>
      </Container>
    );
  }

  // Affichage si le produit n'est pas trouvé (après chargement)
  if (!product || !product.id) {
    return (
      <Container className="text-center py-5 mt-5">
        <p className="text-danger fs-5 mb-4">Produit introuvable.</p>
        <Link href="/shop" passHref legacyBehavior>
          <a>
            <Button variant="primary">Retour à la boutique</Button>
          </a>
        </Link>
      </Container>
    );
  }

  // Affichage si le produit est trouvé
  return (
    <>
      <SEOHead title={product.name} description={product.description?.substring(0, 160) || `Détails pour ${product.name || "Product"}`} />
      <Container className="product-page-container pt-4 pb-5">
        {/* DEBUG: Affichage temporaire de l'objet user pour vérifier le contexte et le rôle */}

        {/* --- Bouton d'administration (admin only) --- */}
        {user?.role === 'admin' && (
          <Button
            className="admin-manage-btn"
            variant="warning"
            onClick={() => router.push(`/admin/products/${product.id}`)}
          >
            ⚙️ Gérer ce produit
          </Button>
        )}

        {/* --- Section Statistiques (admin only, exemple) --- */}
        {user?.role === 'admin' && (
          <div className="admin-stats">
            <h5>Statistiques du produit (Admin)</h5>
            <Row>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Vues récentes</Card.Title>
                    <Card.Text>{product.views7d ?? 0} (7 jours)</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              {/* Ajoute ici d'autres cards statistiques si besoin */}
            </Row>
          </div>
        )}
        {/* Fil d'Ariane (Breadcrumbs) */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small text-muted mb-0">
            <li className="breadcrumb-item">
              <Link href="/" passHref legacyBehavior>
                <a>Accueil</a>
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/shop" passHref legacyBehavior>
                <a>Boutique</a>
              </Link>
            </li>
            {/* Utilisation des données formatées */}
            {product.categoryBreadcrumbs?.map((crumb, index, arr) => (
              <li
                key={index}
                className={`breadcrumb-item ${
                  index === arr.length - 1 ? "active" : ""
                }`}
                aria-current={index === arr.length - 1 ? "page" : undefined}
              >
                {index === arr.length - 1 ? (
                  crumb
                ) : (
                  <Link
                    href={`/category/${String(crumb)
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                    passHref
                    legacyBehavior
                  >
                    <a>{crumb}</a>
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Section Principale Produit (Image + Infos) */}
        <Row className="mb-4 main-product-section">
          <SingleProduct product={product} handleThumbnailSelect={handleThumbnailSelect} handleColorSelect={handleColorSelect} handleSizeSelect={handleSizeSelect} handleQuantityChange={handleQuantityChange} /> {/* Composant principal pour l'affichage du produit */}
        </Row>

        {/* Produits souvent achetés ensemble */}
        <BoughtTogether currentProduct={product} checkedItems={boughtTogetherChecked} onToggleItem={handleToggleBoughtTogether} total={totalBoughtTogetherPrice}/>

        {/* Recommandations personnalisées basées sur les intérêts de l'utilisateur */}
        <ProductRecommendations 
          title="Recommandations personnalisées pour vous" 
          currentProduct={product} 
          limit={4} 
        />

        {/* Produits récemment consultés */}
        {recentlyViewed.length > 1 && (
          <RecentlyViewedProducts 
            products={recentlyViewed.filter(p => p._id !== product._id)}
            limit={4}
          />
        )}


        {/* Boutons d'Action (Ajout Panier / Wishlist) */}
        <Row className="mb-5 action-buttons-row">
          <Col md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
            <div className="d-grid gap-3 d-sm-flex">
              <Button
                variant="outline-secondary"
                size="lg"
                className="flex-fill py-2"
                onClick={handleAddToWishlist}
                aria-label="Ajouter à la liste de souhaits"
              >
                <i className="icofont-heart me-2" />
                Liste de souhaits
              </Button>
              <Button
                variant="warning"
                size="lg"
                className="flex-fill py-2 fw-bold"
                onClick={handleAddToCart}
                disabled={
                  !product ||
                  typeof product.stock !== "number" ||
                  product.stock <= 0
                }
                aria-label="Ajouter au panier"
              >
                <i className="icofont-shopping-cart me-2" />
                {!product ||
                typeof product.stock !== "number" ||
                product.stock <= 0
                  ? "Rupture de stock"
                  : "Ajouter au panier"}
              </Button>
            </div>
          </Col>
        </Row>

        {/* Section Tabs unique - contient Description, Spécifications et Avis */}
        <Row className="mt-4">
          <Col>
            <ProductTabs
              description={product.description}
              specifications={product.specifications}
              reviews={product.reviews}
              productId={product.id || product._id}
            />
          </Col>
        </Row>

        {/* Section Produits Similaires */}
        {console.log("Debug similarProducts:", product.similarProducts)}
        <SimilarProducts
          products={product.similarProducts || []}
          categorySlug={
            product.categoryBreadcrumbs?.[1]
              ?.toLowerCase()
              .replace(/ /g, "-") || product.category?.toLowerCase().replace(/ /g, "-") || "all"
          }
        />
      </Container>
      {/* Styles Globaux pour la page */}
      <style jsx global>{`
        /* 1) Bouton “Gérer ce produit” */
        .admin-manage-btn {
          margin-bottom: 1.5rem;
          background-color: #ffc107;
          border-color: #ffc107;
          color: #212529;
        }
        .admin-manage-btn:hover {
          background-color: #e0a800;
          border-color: #d39e00;
        }
        /* 2) Section Statistiques (Admin) */
        .admin-stats {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: .5rem;
          margin-bottom: 2rem;
        }
        .admin-stats h5 {
          background-color: #0d6efd;
          color: white;
          padding: .5rem 1rem;
          border-radius: .25rem;
          margin-bottom: 1rem;
        }
        .admin-stats .card {
          box-shadow: 0 0 .5rem rgba(0,0,0,.1);
        }

        /* --- Styles Généraux --- */
        .pointer {
          cursor: pointer;
        }

        /* --- Gallerie Image --- */
        .thumbnail-column .img-thumbnail {
          width: 60px;
          height: 60px;
          object-fit: contain;
          border-width: 1px;
          padding: 2px;
          transition: border-color 0.2s ease;
        }
        .mobile-thumbnails .img-thumbnail {
          width: 50px;
          height: 50px;
          object-fit: contain;
          border-width: 1px;
          padding: 2px;
          transition: border-color 0.2s ease;
        }
        .active-thumbnail,
        .thumbnail-column .img-thumbnail:hover,
        .mobile-thumbnails .img-thumbnail:hover {
          border-color: var(--bs-primary) !important;
        }
        .main-product-image {
          max-height: 450px;
          width: 100%;
          object-fit: contain;
          background-color: #f8f9fa;
          border-radius: var(--bs-border-radius);
        }
        .main-image-card {
          border: none;
        }
        .discount-badge {
          font-size: 0.8rem;
          padding: 0.3em 0.6em;
          font-weight: 500;
        }
        .out-of-stock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: var(--bs-danger);
          border-radius: var(--bs-border-radius);
        }

        /* --- Infos Produit --- */
        .color-swatch {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #dee2e6;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease-in-out;
        }
        .color-swatch:hover {
          transform: scale(1.1);
          border-color: #aaa;
        }
        .color-swatch.selected {
          box-shadow: 0 0 0 3px var(--bs-primary);
          border-color: #fff;
          transform: scale(1.1);
        }
        .product-title {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
        }
        .badge-custom {
          background-color: var(--bs-success-bg-subtle) !important;
          color: var(--bs-success-text-emphasis) !important;
          border: 1px solid var(--bs-success-border-subtle) !important;
          font-weight: 500;
        }
        .quantity-input {
          max-width: 50px;
          -moz-appearance: textfield;
        }
        .quantity-input::-webkit-outer-spin-button,
        .quantity-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .rating-section i {
          font-size: 1.1em;
        } /* Etoiles un peu plus grandes */
        .price-section .h3 {
          font-size: 1.8rem;
        } /* Prix principal plus grand */

        /* --- Bought Together --- */
        .bought-together-card {
          background: #f8f9fa;
          border: none;
          border-radius: var(--bs-card-border-radius);
        }
        .object-fit-contain {
          object-fit: contain;
        }
        .text-truncate-2-lines {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3em;
          max-height: 2.6em;
        }

        /* --- Onglets (Tabs) --- */
        #product-details-tabs .nav-link {
          flex: 1 1 auto;
          text-align: center;
          color: var(--bs-gray-600);
          font-weight: 500;
        }
        #product-details-tabs .nav-link.active {
          color: var(--bs-primary);
          border-bottom-color: var(--bs-primary) !important;
        }
        .tab-content > .tab-pane {
          padding: 1.5rem 0.5rem;
        } /* Padding ajusté */

        /* --- Breadcrumbs --- */
        .breadcrumb-item + .breadcrumb-item::before {
          content: ">";
          padding-right: var(--bs-breadcrumb-item-padding-x);
          padding-left: var(--bs-breadcrumb-item-padding-x);
          color: var(--bs-gray-500);
        }
        .breadcrumb a {
          color: var(--bs-primary);
          text-decoration: none;
        }
        .breadcrumb a:hover {
          text-decoration: underline;
        }
        .breadcrumb-item.active {
          color: var(--bs-gray-700);
          font-weight: 500;
        }

        /* --- Styles Carousel (déplacés depuis ProductCarousel.js pour centralisation) --- */
        .product-carousel-container::-webkit-scrollbar {
          display: none;
        }
        .product-carousel-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .product-card-similar {
          border-radius: 0.5rem; /* Bords arrondis */
          border-color: var(--bs-border-color-translucent);
          transition: all 0.2s ease-in-out;
          background-color: var(--bs-body-bg); /* Assure fond blanc/thème */
          box-shadow: var(--bs-box-shadow-sm); /* Ombre légère par défaut */
        }

        .product-card-similar:hover {
          transform: translateY(-4px); /* Effet de lévitation */
          box-shadow: var(--bs-box-shadow); /* Ombre plus prononcée */
          border-color: var(--bs-border-color);
        }

        .product-card-img-container {
          height: 160px; /* Hauteur fixe pour l'image */
          background-color: #f8f9fa; /* Fond léger pour l'image */
          overflow: hidden; /* Cache ce qui dépasse */
          position: relative; /* Pour positionner les éléments absolus */
          border-top-left-radius: 0.5rem; /* Arrondi haut */
          border-top-right-radius: 0.5rem;
        }
        /* Centrage pour layout fill de next/image */
        .product-card-img-container > span {
          display: block !important;
        }

        .similar-product-title {
          font-size: 0.9rem;
          font-weight: 500;
          line-height: 1.3;
          height: 2.6em; /* Approx 2 lignes */
          color: var(--bs-body-color); /* Assure couleur texte correcte */
        }
        .fs-xs {
          font-size: 0.75rem;
        }

        /* Actions qui apparaissent au survol */
        .product-card-actions {
          position: absolute;
          bottom: 8px;
          right: 8px;
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        }
        .product-card-similar:hover .product-card-actions {
          opacity: 1;
        }
        .add-to-cart-btn {
          font-size: 0.8rem;
          padding: 0.25rem 0.6rem;
        }
      `}</style>
    </>
  );
};

// --- Exportation du Composant Page ---
export default ProductPage;

// Fonctions helper externes
const trackInterest = (item) => {
  console.log("Tracking interest in:", item);
};