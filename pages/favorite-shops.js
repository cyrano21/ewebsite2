import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Link from "next/link";
import PageHeader from "../components/PageHeader";

const FavoriteShops = () => {
  // Données factices des boutiques préférées
  const favoriteShops = [
    {
      id: 1,
      name: "Électronique Premium",
      image: "/assets/images/shop/shop01.jpg",
      description: "Produits électroniques haut de gamme, smartphones et accessoires",
      rating: 4.8,
      productsCount: 245,
    },
    {
      id: 2,
      name: "Mode Élégance",
      image: "/assets/images/shop/shop02.jpg",
      description: "Vêtements de haute qualité pour hommes et femmes",
      rating: 4.5,
      productsCount: 387,
    },
    {
      id: 3,
      name: "Déco & Maison",
      image: "/assets/images/shop/shop03.jpg",
      description: "Décoration d'intérieur et accessoires pour la maison",
      rating: 4.7,
      productsCount: 178,
    },
    {
      id: 4,
      name: "Sport & Fitness",
      image: "/assets/images/shop/shop04.jpg",
      description: "Équipements sportifs et vêtements pour tous les sports",
      rating: 4.6,
      productsCount: 215,
    },
  ];

  return (
    <div>
      <PageHeader title="Mes Boutiques Préférées" curPage="Boutiques Préférées" />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold mb-4">Mes Boutiques Préférées</h2>
            <p className="text-muted">
              Retrouvez ici toutes les boutiques que vous avez ajoutées à vos favoris.
              Suivez leurs nouveautés et promotions en exclusivité.
            </p>
          </Col>
        </Row>

        {favoriteShops.length > 0 ? (
          <Row>
            {favoriteShops.map((shop) => (
              <Col lg={6} className="mb-4" key={shop.id}>
                <Card className="h-100 shop-card">
                  <div className="d-flex h-100">
                    <div className="shop-image" style={{ width: "40%" }}>
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="img-fluid h-100 w-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="fs-5 fw-bold">{shop.name}</Card.Title>
                      <div className="d-flex align-items-center mb-3">
                        <div className="shop-rating me-2">
                          <i className="icofont-star text-warning"></i> {shop.rating}
                        </div>
                        <span className="text-muted small">
                          ({shop.productsCount} produits)
                        </span>
                      </div>
                      <Card.Text className="mb-3">{shop.description}</Card.Text>
                      <div className="d-flex gap-2">
                        <Link href={`/shop?seller=${shop.id}`} passHref legacyBehavior>
                          <Button variant="outline-primary" size="sm">
                            <i className="icofont-shopping-cart me-1"></i> Voir les produits
                          </Button>
                        </Link>
                        <Button variant="danger" size="sm">
                          <i className="icofont-heart-alt me-1"></i> Retirer
                        </Button>
                      </div>
                    </Card.Body>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5 my-5">
            <div className="mb-4">
              <i className="icofont-heart-alt" style={{ fontSize: "5rem", color: "#dee2e6" }}></i>
            </div>
            <h3>Vous n'avez pas encore de boutiques préférées</h3>
            <p className="text-muted mb-4">
              Explorez notre marketplace et ajoutez vos boutiques préférées à cette liste.
            </p>
            <Link href="/shop" passHref legacyBehavior>
              <Button variant="primary">
                Parcourir les boutiques
              </Button>
            </Link>
          </div>
        )}
      </Container>
      <style jsx>{`
        .shop-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #eee;
          overflow: hidden;
        }
        .shop-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
        }
        .shop-image {
          overflow: hidden;
        }
        .shop-rating {
          background: rgba(255, 193, 7, 0.1);
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default FavoriteShops;
