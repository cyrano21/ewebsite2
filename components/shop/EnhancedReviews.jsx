
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ProgressBar, Badge } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import ReactStars from 'react-rating-stars-component';

const EnhancedReviews = ({ productId }) => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [useCase, setUseCase] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingStats, setRatingStats] = useState({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0]
  });

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, filter, sort, page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?productId=${productId}&filter=${filter}&sort=${sort}&page=${page}`);
      if (!response.ok) throw new Error('Erreur lors du chargement des avis');
      
      const data = await response.json();
      setReviews(data.reviews);
      setTotalPages(data.totalPages);
      setRatingStats(data.stats);
      
      // Vérifier si l'utilisateur a déjà publié un avis
      if (session?.user) {
        const userHasReviewed = data.reviews.some(review => 
          review.user && review.user._id === session.user.id
        );
        setHasUserReviewed(userHasReviewed);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de charger les avis.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      toast.warn('Vous ne pouvez télécharger que 3 images maximum.');
      return;
    }

    setSelectedImages(files);

    // Créer des URL pour la prévisualisation
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    
    if (!session) {
      toast.warn('Veuillez vous connecter pour laisser un avis.');
      return;
    }
    
    if (hasUserReviewed) {
      toast.warn('Vous avez déjà publié un avis pour ce produit.');
      return;
    }

    if (rating < 1 || !content.trim()) {
      toast.warn('Veuillez attribuer une note et rédiger un commentaire.');
      return;
    }

    setLoading(true);
    
    try {
      // Créer un FormData pour gérer les fichiers
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('rating', rating);
      formData.append('title', title);
      formData.append('content', content);
      formData.append('pros', pros);
      formData.append('cons', cons);
      formData.append('useCase', useCase);
      
      // Ajouter les images si présentes
      selectedImages.forEach(image => {
        formData.append('images', image);
      });

      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la publication de l\'avis');
      }
      
      toast.success('Votre avis a été publié avec succès !');
      
      // Réinitialiser le formulaire
      setRating(5);
      setContent('');
      setTitle('');
      setPros('');
      setCons('');
      setUseCase('');
      setSelectedImages([]);
      setPreviewImages([]);
      setFormVisible(false);
      
      // Rafraîchir les avis
      fetchReviews();
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la publication de votre avis.');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId, isHelpful) => {
    if (!session) {
      toast.warn('Veuillez vous connecter pour marquer un avis comme utile.');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          isHelpful
        })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'action sur l\'avis');
      
      // Mettre à jour les avis localement
      const updatedReviews = reviews.map(review => {
        if (review._id === reviewId) {
          const helpfulCount = review.helpfulCount || 0;
          return {
            ...review,
            isHelpfulByUser: isHelpful,
            helpfulCount: isHelpful ? helpfulCount + 1 : Math.max(0, helpfulCount - 1)
          };
        }
        return review;
      });
      
      setReviews(updatedReviews);
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Avis clients</h2>
      
      {/* Résumé des avis */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={4} className="text-center border-end">
              <h2 className="display-4 mb-0">{ratingStats.average.toFixed(1)}</h2>
              <ReactStars
                count={5}
                value={ratingStats.average}
                size={24}
                edit={false}
                activeColor="#ffd700"
              />
              <p className="text-muted mb-0">{ratingStats.total} avis</p>
            </Col>
            <Col md={8}>
              <div className="px-md-4 py-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="d-flex align-items-center mb-2">
                    <div className="text-muted" style={{ width: '60px' }}>
                      {star} étoiles
                    </div>
                    <div className="flex-grow-1 mx-3">
                      <ProgressBar 
                        now={ratingStats.total > 0 ? (ratingStats.distribution[5-star] / ratingStats.total) * 100 : 0} 
                        variant={star >= 4 ? "success" : star === 3 ? "info" : "danger"}
                      />
                    </div>
                    <div className="text-muted" style={{ width: '50px', textAlign: 'right' }}>
                      {ratingStats.distribution[5-star]}
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
          
          <hr className="my-3" />
          
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="mb-2 mb-md-0">
              <Button 
                variant={!hasUserReviewed ? "primary" : "outline-secondary"} 
                onClick={() => setFormVisible(!formVisible)}
                disabled={hasUserReviewed || !session}
              >
                {hasUserReviewed ? "Vous avez déjà publié un avis" : "Rédiger un avis"}
              </Button>
              {!session && (
                <small className="text-muted ms-2">
                  Connectez-vous pour laisser un avis
                </small>
              )}
            </div>
            <div className="d-flex">
              <Form.Select 
                className="me-2" 
                style={{ width: 'auto' }}
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Tous les avis</option>
                <option value="5">5 étoiles uniquement</option>
                <option value="4">4 étoiles uniquement</option>
                <option value="3">3 étoiles uniquement</option>
                <option value="2">2 étoiles uniquement</option>
                <option value="1">1 étoile uniquement</option>
                <option value="media">Avis avec photos</option>
              </Form.Select>
              <Form.Select 
                style={{ width: 'auto' }}
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="highest">Meilleures notes</option>
                <option value="lowest">Notes les plus basses</option>
                <option value="most_helpful">Plus utiles</option>
              </Form.Select>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* Formulaire d'avis */}
      {formVisible && (
        <Card className="mb-4 shadow-sm">
          <Card.Header>
            <h5 className="mb-0">Partagez votre expérience</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={submitReview}>
              <Form.Group className="mb-3">
                <Form.Label>Votre note globale *</Form.Label>
                <div>
                  <ReactStars
                    count={5}
                    onChange={setRating}
                    size={36}
                    value={rating}
                    activeColor="#ffd700"
                  />
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Titre de votre avis *</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Résumez votre expérience en une phrase"
                  required
                />
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Points forts</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={pros}
                      onChange={(e) => setPros(e.target.value)}
                      placeholder="Ce que vous avez aimé"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Points faibles</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={cons}
                      onChange={(e) => setCons(e.target.value)}
                      placeholder="Ce qui pourrait être amélioré"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Votre avis détaillé *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Utilisation principale</Form.Label>
                <Form.Control
                  type="text"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  placeholder="Dans quel contexte utilisez-vous ce produit ?"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Ajoutez des photos (max 3)</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                />
                <Form.Text className="text-muted">
                  Partagez des images de votre produit pour aider les autres clients
                </Form.Text>
                
                {previewImages.length > 0 && (
                  <div className="mt-2 d-flex gap-2">
                    {previewImages.map((preview, index) => (
                      <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                        <Image
                          src={preview}
                          alt={`Preview ${index}`}
                          width={100}
                          height={100}
                          objectFit="cover"
                          className="rounded"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          style={{ position: 'absolute', top: '5px', right: '5px', padding: '2px 6px' }}
                          onClick={() => {
                            const newImages = [...selectedImages];
                            newImages.splice(index, 1);
                            setSelectedImages(newImages);
                            
                            const newPreviews = [...previewImages];
                            URL.revokeObjectURL(newPreviews[index]);
                            newPreviews.splice(index, 1);
                            setPreviewImages(newPreviews);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>
              
              <div className="d-flex justify-content-end">
                <Button variant="outline-secondary" className="me-2" onClick={() => setFormVisible(false)}>
                  Annuler
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Publication en cours...' : 'Publier mon avis'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      {/* Liste des avis */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <Card className="text-center py-5 shadow-sm">
          <Card.Body>
            <h4>Aucun avis pour le moment</h4>
            <p className="text-muted">Soyez le premier à partager votre expérience avec ce produit.</p>
          </Card.Body>
        </Card>
      ) : (
        <div>
          {reviews.map((review) => (
            <Card key={review._id} className="mb-3 shadow-sm">
              <Card.Body>
                <Row>
                  <Col lg={3} md={4}>
                    <div className="text-center text-md-start mb-3 mb-md-0">
                      <div className="d-flex align-items-center mb-2">
                        <div className={`avatar bg-light rounded-circle me-2 d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}>
                          {review.user?.name ? (
                            <span className="fw-bold">{review.user.name.charAt(0).toUpperCase()}</span>
                          ) : (
                            <span className="fw-bold">A</span>
                          )}
                        </div>
                        <div>
                          <h6 className="mb-0">{review.user?.name || 'Anonyme'}</h6>
                          {review.isVerifiedPurchase && (
                            <Badge bg="success" className="mt-1">Achat vérifié</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-muted small mb-2">
                        {formatDate(review.createdAt)}
                      </div>
                      {review.useCase && (
                        <div className="small mb-2">
                          <span className="fw-bold">Utilisation:</span> {review.useCase}
                        </div>
                      )}
                    </div>
                  </Col>
                  
                  <Col lg={9} md={8}>
                    <div className="d-flex align-items-center mb-2">
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={18}
                        edit={false}
                        activeColor="#ffd700"
                      />
                      <h5 className="mb-0 ms-2">{review.title}</h5>
                    </div>
                    
                    <p className="mb-3">{review.content}</p>
                    
                    {(review.pros || review.cons) && (
                      <Row className="mb-3">
                        {review.pros && (
                          <Col md={6} className="mb-2 mb-md-0">
                            <div className="bg-light p-2 rounded h-100">
                              <div className="text-success mb-1">
                                <i className="icofont-plus-circle me-1"></i>
                                <strong>Points forts</strong>
                              </div>
                              <p className="mb-0 small">{review.pros}</p>
                            </div>
                          </Col>
                        )}
                        
                        {review.cons && (
                          <Col md={6}>
                            <div className="bg-light p-2 rounded h-100">
                              <div className="text-danger mb-1">
                                <i className="icofont-minus-circle me-1"></i>
                                <strong>Points faibles</strong>
                              </div>
                              <p className="mb-0 small">{review.cons}</p>
                            </div>
                          </Col>
                        )}
                      </Row>
                    )}
                    
                    {review.images && review.images.length > 0 && (
                      <div className="mb-3">
                        <div className="d-flex gap-2">
                          {review.images.map((image, index) => (
                            <div key={index} style={{ width: '100px', height: '100px', position: 'relative' }}>
                              <Image
                                src={image}
                                alt={`Review image ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Button
                          variant={review.isHelpfulByUser ? "outline-success" : "outline-secondary"}
                          size="sm"
                          className="me-2"
                          onClick={() => handleHelpful(review._id, !review.isHelpfulByUser)}
                          disabled={!session}
                        >
                          <i className="icofont-thumbs-up me-1"></i>
                          Utile ({review.helpfulCount || 0})
                        </Button>
                      </div>
                      
                      {review.user?._id === session?.user?.id && (
                        <Button variant="link" size="sm" className="text-danger">
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setPage(page - 1)} 
                    disabled={page <= 1}
                  >
                    Précédent
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => (
                  <li 
                    key={index} 
                    className={`page-item ${page === index + 1 ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setPage(page + 1)} 
                    disabled={page >= totalPages}
                  >
                    Suivant
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default EnhancedReviews;
