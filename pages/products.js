import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import PageHeader from "../components/PageHeader";
import Rating from "../components/Sidebar/Rating";
import Link from "next/link";
import { AdvertisementDisplay } from "../components/Advertisement";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    // Simuler le chargement des données (à remplacer par une vraie API)
    const loadProducts = async () => {
      try {
        // Dans un cas réel, vous feriez un fetch à votre API
        const response = await fetch('/products.json');
        const data = await response.json();
        
        setProducts(data || []);
        
        // Extraire les catégories uniques
        // eslint-disable-next-line no-undef
        const uniqueCategories = [...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  // Filtrer et trier les produits
  const filteredProducts = products
    .filter(product => selectedCategory === "all" ? true : product.category === selectedCategory)
    .sort((a, b) => {
      switch(sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        case "newest": return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default: return 0;
      }
    });

  return (
    <div className="products-page">
      <PageHeader title="Tous les Produits" curPage="Produits" />

      <Container className="py-5">
        <Row className="mb-4">
          <Col lg={8}>
            <h2 className="fw-bold">Nos Produits</h2>
            <p className="text-muted">
              Découvrez notre gamme complète de produits de haute qualité à des prix compétitifs.
            </p>
          </Col>
          <Col lg={4} className="d-flex justify-content-lg-end align-items-center">
            <Form.Select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="me-2"
              style={{ maxWidth: "200px" }}
            >
              <option value="default">Tri par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleures évaluations</option>
              <option value="newest">Nouveautés</option>
            </Form.Select>
          </Col>
        </Row>

        <Row>
          <Col lg={3} className="mb-4">
            <div className="filter-sidebar p-3 bg-light rounded">
              <h5 className="fw-bold mb-3">Catégories</h5>
              <div className="category-filter mb-4">
                <Form>
                  <Form.Check 
                    type="radio" 
                    id="category-all" 
                    name="category" 
                    label="Toutes les catégories" 
                    checked={selectedCategory === "all"}
                    onChange={() => setSelectedCategory("all")}
                    className="mb-2"
                  />
                  
                  {categories.map((category, index) => (
                    <Form.Check 
                      key={index}
                      type="radio" 
                      id={`category-${index}`} 
                      name="category" 
                      label={category} 
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="mb-2"
                    />
                  ))}
                </Form>
              </div>

              <h5 className="fw-bold mb-3">Prix</h5>
              <div className="price-filter mb-4">
                <Form.Range 
                  className="mb-2" 
                />
                <div className="d-flex justify-content-between">
                  <span>0 €</span>
                  <span>1000 €</span>
                </div>
              </div>

              <Button variant="primary" className="w-100">
                Appliquer les filtres
              </Button>
            </div>
          </Col>

          <Col lg={9}>
            {/* Publicité en haut de la liste des produits */}
            <div className="mb-4">
              <AdvertisementDisplay position="products" type="banner" />
            </div>
            
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <Row>
                {filteredProducts.map((product, index) => (
                  <Col md={4} sm={6} className="mb-4" key={product.id || index}>
                    <Card className="product-card h-100">
                      <div className="product-img-wrapper">
                        <Card.Img 
                          variant="top" 
                          src={product.img || "/assets/images/placeholder.png"}
                          alt={product.name}
                          style={{ height: "200px", objectFit: "contain" }}
                          onError={e => {
                            e.target.onerror = null;
                            e.target.src = "/assets/images/placeholder.png";
                          }}
                        />
                        <div className="product-actions">
                          <button className="action-btn" title="Aperçu rapide">
                            <i className="icofont-eye"></i>
                          </button>
                          <button className="action-btn" title="Ajouter aux favoris">
                            <i className="icofont-heart"></i>
                          </button>
                          <button className="action-btn" title="Ajouter au panier">
                            <i className="icofont-cart-alt"></i>
                          </button>
                        </div>
                      </div>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-primary">{product.category}</span>
                          <div className="product-rating">
                            <Rating value={product.rating || 0} />
                          </div>
                        </div>
                        <Link href={`/shop/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                          <Card.Title className="product-title">{product.name}</Card.Title>
                        </Link>
                        <Card.Text className="text-primary fw-bold">
                          {product.price} €
                          {product.oldPrice && (
                            <del className="ms-2 text-muted">{product.oldPrice} €</del>
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="icofont-not-found" style={{ fontSize: "5rem", color: "#dee2e6" }}></i>
                </div>
                <h3>Aucun produit trouvé</h3>
                <p className="text-muted mb-4">
                  Essayez de modifier vos filtres ou d&apos;effectuer une nouvelle recherche.
                </p>
              </div>
            )}
            
            {/* Publicité après la liste des produits */}
            <div className="mt-4">
              <AdvertisementDisplay position="products" type="featured" />
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #eee;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .product-img-wrapper {
          position: relative;
          overflow: hidden;
        }
        .product-actions {
          position: absolute;
          bottom: -50px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 10px;
          padding: 10px 0;
          background-color: rgba(255,255,255,0.9);
          transition: bottom 0.3s ease;
        }
        .product-card:hover .product-actions {
          bottom: 0;
        }
        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          border: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .action-btn:hover {
          background: #0d6efd;
          color: white;
          border-color: #0d6efd;
        }
        .product-title {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          cursor: pointer;
        }
        .product-title:hover {
          color: #0d6efd;
        }
      `}</style>
    </div>
  );
};

export default Products;
