"use client";

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Tags from "./Tags";
import { productImages } from "../../utils/imageImports";
import { AuthContext } from "../../contexts/AuthProvider";
import { Row, Col, Card, Button } from "react-bootstrap";

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";

// import required modules
import { Autoplay } from "swiper/modules";
import Review from "../../components/Review";
import MostPopularPost from "../../components/Sidebar/MostPopularPost";
import ProductDisplay from "./ProductDisplay";
//const reviwtitle = "Add a Review";

const SingleProduct = () => {
  const [product, setProduct] = useState([]);
  const [productStats, setProductStats] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  // Pour simuler un rôle administrateur, normalement cela viendrait d'une vérification de rôle côté serveur
  const isAdmin = user ? true : false; // Pour la démo, tout utilsateur connecté est considéré comme admin

  useEffect(() => {
    // utilsation d'un chemin relatif pour accéder au fichier JSON
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des produits:", error)
      );

    // Simuler la récupération des statistiques du produit
    // Dans une vraie application, ces données viendraient d'une API
    if (isAdmin) {
      // Générer des statistiques simulées pour le produit
      const stats = {
        viewsLast7Days: Math.floor(Math.random() * 500) + 100,
        viewsLast30Days: Math.floor(Math.random() * 2000) + 500,
        addToCartRate: (Math.random() * 0.3 + 0.1).toFixed(2),
        conversionRate: (Math.random() * 0.15 + 0.05).toFixed(2),
        averageRating: (Math.random() * 2 + 3).toFixed(1),
        totalReviews: Math.floor(Math.random() * 100) + 5,
        lastModified: new Date().toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };
      setProductStats(stats);
    }
  }, [id, isAdmin]);

  const result = product
    .map((p) => ({
      ...p,
      img: productImages[p.img] || p.img,
    }))
    .filter((p) => p.id === id);

  return (
    <div>
      <PageHeader title={"OUR SHOP SINGLE"} curPage={"Shop / Single Product"} />
      <div className="shop-single padding-tb aside-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12">
              <article>
                <div className="product-details">
                  <div className="row align-items-center">
                    <div className="col-md-6 col-12">
                      <div className="product-thumb">
                        <div className="swiper-container pro-single-top">
                          <Swiper
                            spaceBetween={30}
                            slidesPerView={1}
                            loop={"true"}
                            autoplay={{
                              delay: 2000,
                              disableOnInteraction: false,
                            }}
                            modules={[Autoplay]}
                            navigation={{
                              prevEl: ".pro-single-prev",
                              nextEl: ".pro-single-next",
                            }}
                          >
                            {result.map((item, i) => (
                              <SwiperSlide key={i}>
                                <div className="single-thumb">
                                  <img src={item.img} alt="" />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div className="pro-single-next">
                            <i className="icofont-rounded-left"></i>
                          </div>
                          <div className="pro-single-prev">
                            <i className="icofont-rounded-right"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="post-content">
                        <div>
                          {result.map((item) => (
                            <ProductDisplay item={item} key={item.id} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panneau de statistiques pour les administrateurs */}
                {isAdmin && productStats && (
                  <div className="admin-product-stats my-4">
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">
                          <i className="icofont-chart-bar-graph me-2"></i>{" "}
                          Statistiques du produit (Admin)
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={6} className="mb-3">
                            <Card className="h-100 border-0 shadow-sm">
                              <Card.Body>
                                <h6 className="text-muted mb-2">
                                  Vues récentes
                                </h6>
                                <Row>
                                  <Col xs={6}>
                                    <div className="text-center mb-2">
                                      <h3 className="fw-bold text-primary">
                                        {productStats.viewsLast7Days}
                                      </h3>
                                      <small className="text-muted">
                                        7 derniers jours
                                      </small>
                                    </div>
                                  </Col>
                                  <Col xs={6}>
                                    <div className="text-center">
                                      <h3 className="fw-bold text-info">
                                        {productStats.viewsLast30Days}
                                      </h3>
                                      <small className="text-muted">
                                        30 derniers jours
                                      </small>
                                    </div>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={6} className="mb-3">
                            <Card className="h-100 border-0 shadow-sm">
                              <Card.Body>
                                <h6 className="text-muted mb-2">
                                  Taux de conversion
                                </h6>
                                <Row>
                                  <Col xs={6}>
                                    <div className="text-center mb-2">
                                      <h3 className="fw-bold text-warning">
                                        {productStats.addToCartRate * 100}%
                                      </h3>
                                      <small className="text-muted">
                                        Ajout au panier
                                      </small>
                                    </div>
                                  </Col>
                                  <Col xs={6}>
                                    <div className="text-center">
                                      <h3 className="fw-bold text-success">
                                        {productStats.conversionRate * 100}%
                                      </h3>
                                      <small className="text-muted">
                                        Achat final
                                      </small>
                                    </div>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6} className="mb-3">
                            <Card className="h-100 border-0 shadow-sm">
                              <Card.Body>
                                <h6 className="text-muted mb-2">Évaluations</h6>
                                <div className="d-flex align-items-center mb-1">
                                  <div className="stars me-2">
                                    {[...Array(5)].map((_, i) => (
                                      <i
                                        key={i}
                                        className={`icofont-star ${
                                          i <
                                          Math.floor(
                                            productStats.averageRating
                                          )
                                            ? "text-warning"
                                            : "text-muted"
                                        }`}
                                      ></i>
                                    ))}
                                  </div>
                                  <h4 className="fw-bold mb-0">
                                    {productStats.averageRating}
                                  </h4>
                                  <span className="text-muted ms-2">
                                    ({productStats.totalReviews} avis)
                                  </span>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={6} className="mb-3">
                            <Card className="h-100 border-0 shadow-sm">
                              <Card.Body>
                                <h6 className="text-muted mb-2">
                                  Dernière modification
                                </h6>
                                <p className="mb-0 fs-5">
                                  {productStats.lastModified}
                                </p>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="mt-2"
                                  href={`/admin/products?edit=${id}`}
                                >
                                  <i className="icofont-ui-edit me-1"></i>{" "}
                                  Modifier
                                </Button>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </div>
                )}

                <div className="review">
                  <Review />
                </div>
              </article>
            </div>
            <div className="col-lg-4 col-md-7 col-12">
              <aside className="ps-lg-4">
                <MostPopularPost />
                <Tags />
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
