import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../../components/Layout"; // conservé pour getLayout
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(AuthContext);

  // Vérifier si l'utilisateur est admin (à adapter selon votre logique d'authentification)
  const isAdmin = user && (user.email === "admin@example.com" || user.roles?.includes("admin"));

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Essayer d'abord l'API
        const response = await fetch(`/api/products/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          // Si l'API échoue, essayer de charger depuis le fichier products.json
          const productsResponse = await fetch('/products.json');
          if (!productsResponse.ok) {
            throw new Error("Impossible de charger les produits");
          }
          
          const allProducts = await productsResponse.json();
          const foundProduct = allProducts.find(p => p.id === id);
          
          if (!foundProduct) {
            throw new Error("Produit non trouvé");
          }
          
          setProduct(foundProduct);
        }
      } catch (err) {
        console.error("Erreur lors du chargement du produit:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Gestion de l'ajout au panier
  const handleAddToCart = () => {
    if (!product) return;
    
    // Préparer le produit pour le panier
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      img: product.img,
      quantity: quantity
    };
    
    // Récupérer le panier existant ou initialiser un tableau vide
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Vérifier si le produit est déjà dans le panier
    const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Mettre à jour la quantité si le produit existe déjà
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Ajouter le nouveau produit
      existingCart.push(cartItem);
    }
    
    // Sauvegarder le panier mis à jour
    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    // Message de confirmation
    alert("Produit ajouté au panier !");
    
    // Option: rediriger vers le panier
    // router.push('/panier');
  };

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-3">Chargement du produit...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 mt-5">
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <i className="icofont-warning-alt text-warning display-1"></i>
            <h2 className="mt-3">Produit non trouvé</h2>
            <p className="text-muted">Nous n&apos;avons pas pu trouver le produit que vous recherchez.</p>
            <p className="small text- danger">{error}</p>
            <Link href="/shop">
              <Button variant="primary" className="mt-3">
                <i className="icofont-shopping-cart me-2"></i>
                Retour à la boutique
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{product.name} | Votre Boutique</title>
        <meta name="description" content={`${product.name} - ${product.description?.substring(0, 160) || 'Détails du produit'}`} />
      </Head>

      <Container className="py-5 mt-5">
        <Row>
          <Col lg={7}>
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="position-relative">
                <Image 
                  src={product.img || "/assets/images/placeholder.jpg"} 
                  alt={product.name}
                  width={800}
                  height={600}
                  layout="responsive"
                  className="product-main-image"
                />
                {product.stock <= 0 && (
                  <div className="out-of-stock-overlay">
                    <span>Rupture de stock</span>
                  </div>
                )}
                {product.salePrice && (
                  <Badge bg="danger" className="position-absolute top-0 end-0 m-3 py-2 px-3">
                    -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </Badge>
                )}
              </div>

              {/* Informations supplémentaires du produit */}
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h4>Description</h4>
                  <p>{product.description || "Aucune description disponible pour ce produit."}</p>
                </div>

                {product.features && product.features.length > 0 && (
                  <div className="mb-4">
                    <h4>Caractéristiques</h4>
                    <ul className="features-list">
                      {product.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Évaluations */}
                <div className="product-ratings mb-4">
                  <h4>Évaluations</h4>
                  <div className="d-flex align-items-center mb-3">
                    <div className="stars me-3">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`icofont-star ${i < Math.round(product.ratings || 0) ? "text-warning" : "text-muted"}`}
                        ></i>
                      ))}
                    </div>
                    <span className="rating-value">{product.ratings || 0}/5</span>
                    <span className="text-muted ms-2">({product.ratingsCount || 0} avis)</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card
              className="border-0 shadow-sm"
              style={{ position: 'sticky', top: '80px', zIndex: 0 }}
            >
              <Card.Body className="p-4">
                <h2 className="product-title mb-1">{product.name}</h2>
                
                <div className="product-meta mb-3">
                  <span className="text-muted me-3">Vendeur: {product.seller || "Non spécifié"}</span>
                  <span className="text-muted">Catégorie: {product.category || "Non spécifié"}</span>
                </div>
                
                <div className="product-price-block mb-4">
                  {product.salePrice ? (
                    <>
                      <span className="regular-price text-decoration-line-through text-muted me-2">
                        {product.price}€
                      </span>
                      <span className="sale-price h3 text-danger fw-bold">
                        {product.salePrice}€
                      </span>
                    </>
                  ) : (
                    <span className="price h3 fw-bold">{product.price}€</span>
                  )}
                </div>
                
                <div className="stock-info mb-4">
                  {product.stock > 0 ? (
                    <p className="text-success mb-0">
                      <i className="icofont-check-circled me-1"></i>
                      En stock ({product.stock} disponibles)
                    </p>
                  ) : (
                    <p className="text-danger mb-0">
                      <i className="icofont-close-circled me-1"></i>
                      Rupture de stock
                    </p>
                  )}
                </div>

                {product.stock > 0 && (
                  <div className="add-to-cart-section mb-4">
                    <div className="quantity-selector d-flex align-items-center mb-3">
                      <span className="me-3">Quantité:</span>
                      <div className="d-flex border rounded">
                        <Button 
                          variant="light" 
                          className="border-0"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <i className="icofont-minus"></i>
                        </Button>
                        <div className="px-3 py-2">{quantity}</div>
                        <Button 
                          variant="light" 
                          className="border-0"
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        >
                          <i className="icofont-plus"></i>
                        </Button>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                      >
                        <i className="icofont-shopping-cart me-2"></i>
                        Ajouter au panier
                      </Button>
                      
                      <Button variant="outline-primary" size="lg">
                        <i className="icofont-heart me-2"></i>
                        Ajouter aux favoris
                      </Button>
                    </div>
                  </div>
                )}

                {isAdmin && (
                  <div className="admin-actions mt-4 pt-3 border-top">
                    <h5 className="mb-3">Actions administrateur</h5>
                    <div className="d-grid gap-2">
                      <Link href={`/admin/products?edit=${product.id}`}>
                        <Button variant="warning" className="w-100">
                          <i className="icofont-ui-edit me-2"></i>
                          Modifier ce produit
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Produits connexes */}
        <div className="related-products mt-5 pt-4 border-top">
          <h3 className="mb-4">Produits similaires</h3>
          <div className="d-flex justify-content-center">
            <Link href="/shop">
              <Button variant="primary" className="mt-3">
                Voir tous les produits
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .product-main-image {
          max-height: 500px;
          object-fit: contain;
          background-color: #f8f9fa;
        }
        .out-of-stock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.5);
        }
        .out-of-stock-overlay span {
          background-color: #dc3545;
          color: white;
          padding: 10px 20px;
          font-weight: bold;
          text-transform: uppercase;
          transform: rotate(-15deg);
        }
        .features-list {
          list-style-type: none;
          padding-left: 0;
        }
        .features-list li {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .features-list li:last-child {
          border-bottom: none;
        }
      `}</style>
    </>
  );
};

// Wrap page with Layout via getLayout to avoid double navbar/footer
ProductPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ProductPage;
