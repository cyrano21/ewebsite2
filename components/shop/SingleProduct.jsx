"use client";

import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import PageHeader from "../../components/PageHeader";
import Tags from "./Tags";
import { productImages } from "../../utils/imageImports";
import { Card, Container, Row, Col, Button, Tabs, Tab, Table } from 'react-bootstrap';
import Ratings from '../Sidebar/Rating';
import Review from "../Review";
import toast from 'react-hot-toast';
import RecentlyViewedProducts from './RecentlyViewedProducts';
import Link from 'next/link';
import Image from 'next/image';
import SocialShareButtons from './SocialShareButtons';
import { AuthContext } from '../../contexts/AuthProvider'; // Correct import path

const SingleProduct = ({ product, related = [] }) => {
  const router = useRouter();
  const [count, setCount] = useState(1);
  const [color, setColor] = useState(product?.colors?.[0] || '');
  const [size, setSize] = useState(product?.sizes?.[0] || '');
  const { user, isSignedIn } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  useEffect(() => {
    // Réinitialiser les états si le produit change
    if (product) {
      setCount(1);
      setColor(product.colors?.[0] || '');
      setSize(product.sizes?.[0] || '');
    }
  }, [product]);

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isSignedIn) {
      toast.error("Veuillez vous connecter pour ajouter au panier");
      router.push(`/login?redirect=/shop/product/${product._id}`);
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: product._id,
          quantity: count,
          color,
          size,
        }),
      });

      if (response.ok) {
        toast.success('Produit ajouté au panier');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de l\'ajout au panier');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isSignedIn) {
      toast.error("Veuillez vous connecter pour ajouter aux favoris");
      router.push(`/login?redirect=/shop/product/${product._id}`);
      return;
    }

    setIsAddingToWishlist(true);
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
        }),
      });

      if (response.ok) {
        toast.success('Produit ajouté aux favoris');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de l\'ajout aux favoris');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'ajout aux favoris');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Calculer l'économie en pourcentage si le produit est en solde
  const calculateDiscount = () => {
    if (product.salePrice && product.price) {
      const discount = ((product.price - product.salePrice) / product.price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div className="shop-single padding-tb">
      <PageHeader title="Détails du produit" curPage="Détails" />
      <Container>
        <Row className="mb-5">
          {/* Image du produit */}
          <Col lg={6}>
            <div className="product-thumb position-relative">
              {discount > 0 && (
                <span className="product-discount-tag position-absolute top-0 start-0 bg-danger text-white p-2 m-3 rounded">
                  -{discount}%
                </span>
              )}
              <div className="position-relative" style={{ height: '500px' }}>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name || 'Image produit'}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="w-100 h-100"
                    onError={(e) => {
                      console.warn("Erreur de chargement d'image produit:", product.image);
                      // Utiliser un placeholder local plutôt qu'une redirection d'image
                      e.target.src = '/assets/images/shop/placeholder.jpg';
                      e.target.onerror = null; // Éviter les boucles infinies
                    }}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  // Si pas d'image, utiliser directement le placeholder sans essayer de charger une image
                  (<Image
                    src="/assets/images/shop/placeholder.jpg"
                    alt={product.name || 'Image produit non disponible'}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="w-100 h-100"
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />)
                )}
              </div>

              {/* Gallerie d'images supplémentaires */}
              <Row className="mt-3">
                {product.gallery && product.gallery.slice(0, 4).map((img, i) => (
                  <Col xs={3} key={i}>
                    <div className="position-relative" style={{ height: '80px' }}>
                      <Image
                        src={img || '/assets/images/shop/placeholder.jpg'}
                        alt={`${product.name} - image ${i+1}`}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="w-100 h-100 border rounded p-1"
                        onError={(e) => {
                          console.warn("Erreur de chargement d'image galerie:", img);
                          e.target.onerror = null;
                          e.target.src = '/assets/images/shop/placeholder.jpg';
                        }}
                        unoptimized={true} // Éviter l'optimisation qui peut parfois causer des problèmes
                        sizes="(max-width: 768px) 100px, 80px"
                      />
                    </div>
                  </Col>
                ))}
                {(!product.gallery || product.gallery.length === 0) && (
                  <Col xs={12} className="text-center text-muted">
                    <small>Aucune image supplémentaire disponible</small>
                  </Col>
                )}
              </Row>
            </div>
          </Col>

          {/* Détails du produit */}
          <Col lg={6}>
            <div className="product-details">
              <h4 className="mb-2">{product.name}</h4>

              <div className="rating-stars d-flex align-items-center mb-3">
                <Ratings ratings={product.rating || 4} />
                <span className="rating-count ms-2">({product.reviews?.length || 0} avis)</span>
              </div>

              <div className="product-price mb-4">
                {product.salePrice > 0 ? (
                  <>
                    <span className="text-danger fs-3">{product.salePrice.toFixed(2)} €</span>
                    <span className="text-muted text-decoration-line-through ms-3">
                      {product.price.toFixed(2)} €
                    </span>
                  </>
                ) : (
                  <span className="fs-3">{product.price.toFixed(2)} €</span>
                )}
              </div>

              <p className="mb-4">{product.description}</p>

              {/* Sélection des couleurs */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <h6>Couleur:</h6>
                  <div className="d-flex">
                    {product.colors.map((clr, i) => (
                      <div
                        key={i}
                        className={`color-option me-2 p-2 border rounded ${color === clr ? 'border-primary' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setColor(clr)}
                      >
                        <span
                          className="d-inline-block rounded"
                          style={{
                            width: '25px',
                            height: '25px',
                            backgroundColor: clr,
                            border: '1px solid #ddd'
                          }}
                        ></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sélection des tailles */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <h6>Taille:</h6>
                  <div className="d-flex">
                    {product.sizes.map((sz, i) => (
                      <div
                        key={i}
                        className={`size-option me-2 p-2 border rounded ${size === sz ? 'border-primary' : ''}`}
                        style={{ cursor: 'pointer', minWidth: '40px', textAlign: 'center' }}
                        onClick={() => setSize(sz)}
                      >
                        {sz}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sélection de la quantité */}
              <div className="mb-4">
                <h6>Quantité:</h6>
                <div className="d-flex align-items-center">
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setCount(prev => Math.max(prev - 1, 1))}
                  >
                    -
                  </Button>
                  <span className="mx-3">{count}</span>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setCount(prev => prev + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* État du stock */}
              <div className="mb-4">
                <span className={`stock-badge ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                  {product.stock > 0 ? (
                    <><i className="fas fa-check-circle me-1"></i> En stock</>
                  ) : (
                    <><i className="fas fa-times-circle me-1"></i> Épuisé</>
                  )}
                </span>
                {product.stock > 0 && product.stock < 10 && (
                  <span className="text-warning ms-3">
                    <i className="fas fa-exclamation-triangle me-1"></i>
                    Il ne reste que {product.stock} en stock
                  </span>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="product-action-buttons d-flex flex-wrap mb-4">
                <Button
                  variant="primary"
                  className="me-3 mb-2"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock <= 0}
                >
                  {isAddingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-cart me-2"></i>
                      Ajouter au panier
                    </>
                  )}
                </Button>

                <Button
                  variant="outline-danger"
                  className="mb-2"
                  onClick={handleAddToWishlist}
                  disabled={isAddingToWishlist}
                >
                  {isAddingToWishlist ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-heart me-2"></i>
                      Ajouter aux favoris
                    </>
                  )}
                </Button>
                {user?.role === 'admin' && (
                  <Button
                    className="admin-manage-btn"
                    variant="warning"
                    onClick={() => {
                      // Préparer les données du produit pour l'édition
                      const productForEdit = {
                        id: product._id || product.id,
                        name: product.name || '',
                        category: product.category || '',
                        price: product.price || 0,
                        stock: product.stock || 0,
                        img: product.image || product.img || '',
                        vendor: product.vendor || '',
                        ratings: product.rating || product.ratings || 0,
                        ratingsCount: product.reviewCount || product.ratingsCount || 0,
                        description: product.description || '',
                        isEditMode: true // Flag explicite pour le mode édition
                      };
                      
                      // Stocker temporairement les données dans sessionStorage
                      sessionStorage.setItem('editProductData', JSON.stringify(productForEdit));
                      
                      // Rediriger vers la page d'admin avec indication d'édition
                      router.push(`/admin/products/${product._id || product.id}?edit=true`);
                    }}
                  >
                    Gérer ce produit
                  </Button>
                )}
              </div>

              {/* Partage sur les réseaux sociaux */}
              <SocialShareButtons 
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={product.name}
                description={product.description}
              />

              {/* Informations supplémentaires */}
              <div className="product-additional-info mt-4">
                <p className="mb-1"><strong>SKU:</strong> {product.sku || 'N/A'}</p>
                <p className="mb-1"><strong>Catégorie:</strong> {product.category?.name || 'Non catégorisé'}</p>
                <p className="mb-1"><strong>Marque:</strong> {product.brand || 'N/A'}</p>
                <p className="mb-1"><strong>Livraison:</strong> Livraison gratuite pour les commandes supérieures à 50€</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Onglets d'informations supplémentaires */}
        <Row className="mb-5">
          <Col>
            <Card>
              <Card.Body>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4"
                >
                  <Tab eventKey="description" title="Description">
                    <div className="product-description pb-3">
                      {product.longDescription ? (
                        <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                      ) : (
                        <p>{product.description}</p>
                      )}
                    </div>
                  </Tab>

                  <Tab eventKey="specifications" title="Spécifications">
                    <div className="product-specifications pb-3">
                      <Table striped hover>
                        <tbody>
                          {product.specifications ? (
                            Array.isArray(product.specifications) ? (
                              // Si c'est un tableau d'objets avec propriétés key et value
                              (product.specifications.map((spec, i) => (
                                <tr key={i}>
                                  <th>{spec.key}</th>
                                  <td>{spec.value}</td>
                                </tr>
                              )))
                            ) : (
                              // Si c'est un objet avec des paires clé-valeur
                              (Object.entries(product.specifications).map(([key, value], i) => (
                                <tr key={i}>
                                  <th>{key}</th>
                                  <td>
                                    {typeof value === 'object' && value !== null
                                      ? JSON.stringify(value)
                                      : value}
                                  </td>
                                </tr>
                              )))
                            )
                          ) : (
                            <tr>
                              <td colSpan={2} className="text-center">Aucune spécification disponible</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>

                  {/* Section avis supprimée pour éviter la duplication avec ProductTabs */}
                  {/* Les avis sont maintenant uniquement gérés par le composant ProductTabs */}
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Produits souvent achetés ensemble - COMMENTÉ POUR ÉVITER DUPLICATION */}
        {/* <BoughtTogether currentProduct={product} /> */}

        {/* Produits récemment consultés */}
        <RecentlyViewedProducts currentProductId={product._id} />

        {/* Produits similaires */}
        {related && related.length > 0 && (
          <Row className="my-5">
            <Col>
              <h2 className="mb-4">Produits similaires</h2>
              <Row>
                {related.slice(0, 4).map((item) => (
                  <Col key={item._id} md={3} sm={6} className="mb-4">
                    <Card className="h-100 product-card shadow-sm">
                      <Link href={`/shop/product/${item._id}`} passHref legacyBehavior>
                        <div className="position-relative" style={{ height: '200px' }}>
                          <Image
                            src={item.image || '/assets/images/shop/placeholder.jpg'}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="card-img-top p-2"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        </div>
                        <Card.Body className="text-center">
                          <Card.Title className="fs-6 text-truncate">{item.name}</Card.Title>
                          <div className="fw-bold mt-2">
                            {item.salePrice > 0 ? (
                              <>
                                <span className="text-danger">{item.salePrice.toFixed(2)} €</span>
                                <span className="text-muted text-decoration-line-through ms-2">
                                  {item.price.toFixed(2)} €
                                </span>
                              </>
                            ) : (
                              <span>{item.price.toFixed(2)} €</span>
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
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <Row className="my-5">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Tags</Card.Title>
                  <Tags tags={product.tags} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default SingleProduct;