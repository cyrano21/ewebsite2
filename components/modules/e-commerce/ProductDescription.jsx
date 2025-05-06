import React, { useState } from 'react';
import { Row, Col, Card, Nav, Button, Badge } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Image from 'next/image';

const ProductDescription = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  const router = useRouter();

  if (!product) {
    return (
      <Card className="mb-3">
        <Card.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement des détails du produit...</p>
        </Card.Body>
      </Card>
    );
  }

  const handleAddToCart = () => {
    // Logique pour ajouter au panier
    console.log(`Ajouter au panier: ${product.name}`);
  };

  const handleAddToWishlist = () => {
    // Logique pour ajouter à la liste de souhaits
    console.log(`Ajouter à la liste de souhaits: ${product.name}`);
  };

  const handleBuyNow = () => {
    // Rediriger vers la page de paiement
    router.push('/customer/checkout');
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden mb-4">
      <Card.Body>
        <Row>
          {/* Images du produit */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="product-gallery">
              {product.images && product.images.length > 0 ? (
                <div className="main-image-container position-relative" style={{ height: '400px' }}>
                  <Image 
                    src={product.images[0]} 
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    className="main-product-image"
                    priority
                  />
                </div>
              ) : (
                <div className="main-image-container bg-light d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                  <span className="text-muted">Image non disponible</span>
                </div>
              )}
              
              {/* Miniatures */}
              {product.images && product.images.length > 1 && (
                <div className="thumbnails d-flex mt-3 overflow-auto">
                  {product.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="thumbnail-container me-2"
                      style={{ width: '70px', height: '70px', position: 'relative' }}
                    >
                      <Image 
                        src={image} 
                        alt={`${product.name} - ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="thumbnail"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
          
          {/* Détails du produit */}
          <Col lg={6}>
            <div className="product-info">
              <h2 className="product-title mb-2">{product.name}</h2>
              
              {/* Évaluation */}
              <div className="product-rating d-flex align-items-center mb-3">
                <div className="rating-stars me-2">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`icofont-star ${i < Math.floor(product.rating || 0) ? 'text-warning' : 'text-muted'}`}
                    ></i>
                  ))}
                </div>
                <span className="text-muted small">
                  {product.rating || '0'} ({product.reviews?.length || 0} avis)
                </span>
              </div>
              
              {/* Prix */}
              <div className="product-price mb-3">
                {product.discountPrice !== undefined && product.discountPrice < product.price ? (
                  <>
                    <span className="new-price fw-bold fs-4 me-2">
                      {product.discountPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                    <span className="old-price text-muted text-decoration-line-through">
                      {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                    <Badge bg="danger" className="ms-2">
                      -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                    </Badge>
                  </>
                ) : (
                  <span className="price fw-bold fs-4">
                    {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                )}
              </div>
              
              {/* Disponibilité */}
              <div className="product-availability mb-3">
                <span className="fw-bold me-2">Disponibilité:</span>
                {product.stock > 0 ? (
                  <Badge bg="success">En stock</Badge>
                ) : (
                  <Badge bg="danger">Épuisé</Badge>
                )}
                {product.stock > 0 && product.stock < 10 && (
                  <span className="text-warning ms-2 small">
                    <i className="icofont-info-circle"></i> Plus que {product.stock} disponibles
                  </span>
                )}
              </div>
              
              {/* Catégorie */}
              {product.category && (
                <div className="product-category mb-3">
                  <span className="fw-bold me-2">Catégorie:</span>
                  <span>{product.category}</span>
                </div>
              )}
              
              {/* Actions */}
              <div className="product-actions d-flex flex-wrap gap-2 mt-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <i className="icofont-cart me-2"></i>
                  Ajouter au panier
                </Button>
                
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                >
                  Acheter maintenant
                </Button>
                
                <Button 
                  variant="outline-secondary" 
                  size="lg" 
                  onClick={handleAddToWishlist}
                >
                  <i className="icofont-heart"></i>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Onglets d'information */}
        <div className="product-tabs mt-5">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link 
                href="#description" 
                active={activeTab === 'description'}
                onClick={() => setActiveTab('description')}
              >
                Description
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                href="#specifications" 
                active={activeTab === 'specifications'}
                onClick={() => setActiveTab('specifications')}
              >
                Spécifications
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                href="#reviews" 
                active={activeTab === 'reviews'}
                onClick={() => setActiveTab('reviews')}
              >
                Avis ({product.reviews?.length || 0})
              </Nav.Link>
            </Nav.Item>
          </Nav>
          
          <div className="tab-content p-3">
            {activeTab === 'description' && (
              <div className="product-description">
                <p>{product.description || 'Aucune description disponible pour ce produit.'}</p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="product-specifications">
                {product.specifications && product.specifications.length > 0 ? (
                  <table className="table table-bordered">
                    <tbody>
                      {product.specifications.map((spec, index) => (
                        <tr key={index}>
                          <th style={{ width: '30%' }}>{spec.name}</th>
                          <td>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted">Aucune spécification disponible pour ce produit.</p>
                )}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="product-reviews">
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="review-item mb-4 pb-4 border-bottom">
                        <div className="d-flex justify-content-between mb-2">
                          <div className="reviewer-info">
                            <h6 className="mb-0">{review.userName || 'Utilisateur anonyme'}</h6>
                            <small className="text-muted">
                              {new Date(review.date).toLocaleDateString('fr-FR')}
                            </small>
                          </div>
                          <div className="rating-stars">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`icofont-star ${i < review.rating ? 'text-warning' : 'text-muted'}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <p className="review-text mb-0">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="mb-2">Aucun avis pour le moment.</p>
                    <Button variant="outline-primary">Soyez le premier à donner votre avis</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductDescription;