// components/shop/ProductTabs.js ou .jsx
import React, { useContext, useState, useEffect } from 'react';
import { Tabs, Tab, ListGroup, Badge, Button, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthProvider';
import axios from 'axios';

// Composant interne pour afficher un avis
const ProductReview = ({ review }) => {
    // Validation de base pour l'objet review
    if (!review || !review._id) {
         return <p className="small text-muted">Les données de l'avis sont manquantes.</p>;
    }

    return (
        <div key={review._id} className="mb-3 border-bottom pb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <strong className="text-dark">{review.user?.name || 'Anonyme'}</strong>
                {review.date && <small className="text-muted">{new Date(review.date).toLocaleDateString('fr-FR')}</small>}
            </div>
            <div className="mb-1">
            {/* Afficher les étoiles en fonction de la note */}
            {[...Array(5)].map((_, i) => (
                <i
                key={i}
                className={`icofont-star small ${
                    typeof review.rating === 'number' && i < review.rating ? 'text-warning' : 'text-muted'
                }`}
                />
            ))}
            </div>
            <p className="small mb-0">{review.comment || 'Aucun commentaire fourni.'}</p>
        </div>
    );
};

// Formulaire d'ajout d'avis
const AddReviewForm = ({ productId, onSuccess, onCancel, setReviewList }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || !comment.trim()) {
      setError("Veuillez fournir une note et un commentaire.");
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Configuration de l'API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = `${API_URL}/api/products/${productId}/reviews`;
      
      console.log("=== DÉBOGAGE SOUMISSION AVIS ===");
      console.log("Envoi d'avis - URL:", apiUrl);
      console.log("Envoi d'avis - Données:", { rating, comment });
      console.log("Type de rating:", typeof rating);
      console.log("Valeur de rating:", rating);
      console.log("Type de comment:", typeof comment);
      console.log("Longueur de comment:", comment.length);
      
      // Récupération du token d'authentification avec la bonne clé
      const token = localStorage.getItem('auth-token');
      console.log("Token présent:", !!token);
      
      // Informations sur l'utilisateur
      console.log("Utilisateur connecté:", user ? `ID: ${user._id}, Nom: ${user.name}` : "Non connecté");
      
      // Envoyer l'avis directement sans vérifier l'API
      const response = await axios.post(apiUrl, {
        rating: Number(rating),
        comment: comment.trim()
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      console.log("Réponse reçue:", response.status, response.data);
      console.log("=== FIN DÉBOGAGE SOUMISSION AVIS ===");
      
      if (response.data.success) {
        onSuccess(response.data.message || "Votre avis a été soumis avec succès et sera visible après validation.");
      } else {
        setError(response.data.message || "Erreur lors de la soumission de l'avis.");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'avis:", err);
      
      // Message d'erreur plus précis pour aider au débogage
      let errorMessage = "Une erreur est survenue lors de l'envoi de l'avis.";
      
      if (err.response) {
        // La requête a été faite et le serveur a répondu avec un code d'état
        errorMessage = `Erreur ${err.response.status}: ${err.response.data?.message || err.message}`;
        
        if (err.response.status === 404) {
          errorMessage = "L'API des avis n'est pas disponible pour le moment. Votre avis a été enregistré localement.";
          
          // Simuler un succès lorsque l'API est indisponible pour améliorer l'expérience utilisateur
          // Stockage temporaire en local storage
          try {
            const savedReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
            savedReviews.push({
              productId,
              rating,
              comment,
              date: new Date().toISOString(),
              user: {
                name: user?.name || 'Utilisateur',
                _id: user?._id || 'temp_user'
              },
              _id: 'temp_' + Date.now()
            });
            localStorage.setItem('pendingReviews', JSON.stringify(savedReviews));
            onSuccess("Votre avis a été enregistré localement et sera synchronisé ultérieurement.");
            return;
          } catch (storageErr) {
            console.error("Erreur lors du stockage local de l'avis:", storageErr);
          }
        } else if (err.response.status === 401) {
          errorMessage = "Vous devez être connecté pour laisser un avis.";
        }
      } else if (err.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        errorMessage = "Aucune réponse du serveur. Veuillez vérifier votre connexion.";
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="border rounded p-3 mb-2 bg-light">
      <Form.Group className="mb-2">
        <Form.Label>Votre note</Form.Label>
        <div>
          {[1,2,3,4,5].map((star) => (
            <Button
              key={star}
              type="button"
              variant={star <= rating ? "warning" : "outline-secondary"}
              size="sm"
              className="me-1 px-2"
              onClick={() => setRating(star)}
              aria-label={`Évaluer ${star} étoiles`}
            >
              <i className="icofont-star" />
            </Button>
          ))}
        </div>
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Votre avis</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Écrivez votre avis ici..."
          required
          minLength={5}
        />
      </Form.Group>
      {error && <Alert variant="danger" className="py-1 small">{error}</Alert>}
      <div className="d-flex justify-content-between">
        <Button type="button" variant="outline-secondary" size="sm" onClick={onCancel} disabled={submitting}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={submitting}>
          {submitting ? "Envoi en cours..." : "Envoyer l'avis"}
        </Button>
      </div>
    </Form>
  );
};

// Composant principal ProductTabs
const ProductTabs = ({ description, specifications, reviews, productId }) => {
  // Utiliser directement les avis fournis en props, sans appel API
  const [reviewList, setReviewList] = useState(Array.isArray(reviews) ? reviews : []);
  const specList = Array.isArray(specifications) ? specifications : [];
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const { user } = useContext(AuthContext);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);

  // Amélioration de la fonction fetchReviews pour gérer les erreurs et utiliser les avis statiques
  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log('Tentative de récupération des avis pour le produit:', productId);
      
      // 1. Essayer d'abord d'utiliser les avis fournis en props
      if (Array.isArray(reviews) && reviews.length > 0) {
        console.log('✅ Utilisation des avis fournis en props:', reviews.length);
        setReviewList(reviews);
        
        // Calculer la note moyenne
        const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
        setAverageRating((sum / reviews.length).toFixed(1));
        setLoading(false);
        return;
      }
      
      // 2. Essayer l'API des avis
      try {
        // Corriger l'URL pour être sûr de pointer vers le bon endpoint
        const apiUrl = `/api/products/${productId}/reviews`;
        console.log('URL API des avis:', apiUrl);
        const token = localStorage.getItem('auth-token');
        
        const response = await axios.get(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          timeout: 8000 // Augmenter le timeout pour donner plus de temps à MongoDB
        });
        
        // Traitement des données de la réponse
        let reviewsData = [];
        if (response && response.data) {
          console.log('Réponse de l\'API des avis:', response.status, typeof response.data);
          
          if (Array.isArray(response.data)) {
            reviewsData = response.data;
            console.log('Format réponse: tableau direct');
          } else if (response.data.data && Array.isArray(response.data.data)) {
            reviewsData = response.data.data;
            console.log('Format réponse: propriété data');
          } else if (response.data.reviews && Array.isArray(response.data.reviews)) {
            reviewsData = response.data.reviews;
            console.log('Format réponse: propriété reviews');
          } else {
            console.log('Structure de la réponse:', JSON.stringify(response.data).substring(0, 200));
          }
          
          if (reviewsData.length > 0) {
            console.log(`✅ ${reviewsData.length} avis récupérés avec succès`);
            setReviewList(reviewsData);
            const sum = reviewsData.reduce((acc, review) => acc + (review.rating || 0), 0);
            setAverageRating((sum / reviewsData.length).toFixed(1));
            setLoading(false);
            return;
          } else {
            console.log('Aucun avis trouvé dans la réponse');
          }
        }
      } catch (axiosError) {
        // Analyse détaillée de l'erreur pour faciliter le diagnostic
        console.error('Erreur lors de la récupération des avis:', axiosError);
        if (axiosError.response) {
          // La requête a été faite et le serveur a répondu avec un statut d'erreur
          console.error(`Statut de l'erreur: ${axiosError.response.status}`);
          console.error('Données de réponse:', axiosError.response.data);
          console.error('En-têtes de réponse:', axiosError.response.headers);
          
          // Si c'est une erreur 500, c'est probablement lié à MongoDB
          if (axiosError.response.status === 500) {
            console.error('Erreur 500 détectée - Problème potentiel avec MongoDB');
          }
        } else if (axiosError.request) {
          // La requête a été faite mais aucune réponse n'a été reçue
          console.error('Requête sans réponse:', axiosError.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la requête
          console.error('Erreur de configuration de la requête:', axiosError.message);
        }
        
        // 3. En cas d'erreur, récupérer les avis depuis le produit
        try {
          console.log('Tentative de récupération du produit complet...');
          const productResponse = await axios.get(`/api/products/${productId}`, {
            timeout: 5000
          });
          
          if (productResponse.data) {
            // Extraire les avis en fonction du format de réponse
            let productReviews = [];
            
            if (productResponse.data.reviews && Array.isArray(productResponse.data.reviews)) {
              productReviews = productResponse.data.reviews;
            } else if (productResponse.data.data && productResponse.data.data.reviews && 
                      Array.isArray(productResponse.data.data.reviews)) {
              productReviews = productResponse.data.data.reviews;
            }
            
            if (productReviews.length > 0) {
              console.log(`✅ ${productReviews.length} avis trouvés dans les données du produit`);
              setReviewList(productReviews);
              const sum = productReviews.reduce((acc, review) => acc + (review.rating || 0), 0);
              setAverageRating((sum / productReviews.length).toFixed(1));
              setLoading(false);
              return;
            } else {
              console.log('Aucun avis trouvé dans les données du produit');
            }
          }
        } catch (err) {
          console.error('Erreur lors de la récupération du produit:', err);
        }
      }
      
      // 4. Vérifier les avis locaux (utilisateur actuel)
      try {
        const localReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]')
          .filter(r => r.productId === productId);
        
        if (localReviews.length > 0) {
          console.log(`✅ ${localReviews.length} avis locaux trouvés`);
          setReviewList(localReviews);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Erreur lors de la récupération des avis locaux:', e);
      }
      
      // Si nous arrivons ici, aucune méthode n'a fonctionné
      console.log('⚠️ Aucun avis trouvé par aucune méthode');
      
      // Ne pas utiliser d'avis fictifs, mais simplement afficher un message approprié
      setReviewList([]);
      
    } catch (error) {
      console.error('Erreur générale lors de la récupération des avis:', error);
      setReviewList([]);
    } finally {
      setLoading(false);
    }
  };

  // Amélioration de la fonction checkUserReviews pour correctement vérifier si l'utilisateur actuel a déjà laissé un avis
  const checkUserReviews = () => {
    if (!user || !Array.isArray(reviewList) || !user._id) {
      setUserHasReviewed(false);
      return;
    }
    
    // Vérifier si le produit et son ID existent
    if (!productId) {
      setUserHasReviewed(false);
      return;
    }
    
    // Recherche d'un avis de l'utilisateur actuel pour ce produit
    const hasReviewed = reviewList.some(review => 
      review && 
      review.user && 
      (review.user._id === user._id || review.user.id === user._id || review.userId === user._id)
    );
    
    console.log('L\'utilisateur a-t-il déjà laissé un avis?', hasReviewed);
    setUserHasReviewed(hasReviewed);
  };

  // Activer la récupération des avis depuis l'API
  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
    
    // Ajouter une logique de nouvelle tentative en cas d'échec
    const retryTimeout = setTimeout(() => {
      if (reviewList.length === 0 && productId) {
        console.log('Nouvelle tentative de récupération des avis...');
        fetchReviews();
      }
    }, 3000);
    
    return () => clearTimeout(retryTimeout);
  }, [productId]);

  const handleReviewSuccess = (message) => {
    setSuccessMsg(message);
    setShowAddForm(false);
    
    // Rafraîchir la liste des avis après l'ajout d'un nouvel avis
    if (productId) {
      // Récupérer les avis actualisés depuis l'API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      
      // Récupérer le token avec la bonne clé
      const token = localStorage.getItem('auth-token');
      
      // Utiliser l'API relative interne de Next.js
      axios.get(`${API_URL}/api/products/${productId}/reviews`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
        .then(response => {
          if (response.data.success) {
            setReviewList(response.data.data || []);
          }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des avis après ajout:", error);
          
          // En cas d'échec de l'API, récupérer les avis locaux
          try {
            const localReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]')
              .filter(r => r.productId === productId);
            
            if (localReviews.length > 0) {
              setReviewList(prevReviews => {
                // Éviter les doublons en filtrant sur les IDs
                const currentIds = new Set(prevReviews.map(r => r._id));
                const newReviews = localReviews.filter(r => !currentIds.has(r._id));
                return [...prevReviews, ...newReviews];
              });
            }
          } catch (e) {
            console.error("Erreur lors de la récupération des avis locaux:", e);
          }
        });
    }
    
    // Masquer le message de succès après 5 secondes
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <Tabs defaultActiveKey="description" id="product-details-tabs" className="mb-3 product-desc-tabs" justify>
      {/* Onglet Description */}
      <Tab eventKey="description" title="Description">
        <div className="pt-3 tab-content-section">
            {description ? 
              <div dangerouslySetInnerHTML={{ __html: description }} /> : 
              <p className="text-muted">Aucune description disponible.</p>
            }
        </div>
      </Tab>

      {/* Onglet Spécifications */}
      <Tab eventKey="specification" title="Spécifications">
         <div className="pt-3 tab-content-section">
            {specList.length > 0 ? (
                <ListGroup variant="flush">
                    {specList.map((s, i) => (
                    <ListGroup.Item key={i} className="px-0 py-2 d-flex justify-content-between">
                       <span><strong>{s.key}</strong></span>
                       <span>{s.value}</span>
                    </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p className="text-muted">Aucune spécification disponible.</p>
            )}
        </div>
      </Tab>

      {/* Onglet Avis */}
      <Tab
        eventKey="reviews"
        title={
          <>
            Avis <Badge pill bg="secondary" text="light" className="ms-1">{reviewList.length}</Badge>
          </>
        }
      >
        <div className="pt-3 tab-content-section">
            {/* Message de succès */}
            {successMsg && <Alert variant="success" className="py-2 small">{successMsg}</Alert>}
            
            {/* Liste des avis */}
            {reviewList.length > 0 ? (
                reviewList.map((r) => <ProductReview key={r._id} review={r} />)
            ) : (
                <p className="text-muted">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
            )}
            
            {/* Bouton d'ajout d'avis & Formulaire */}
            {user ? (
              userHasReviewed ? (
                <Alert variant="info" className="mt-3 py-2 small text-center">
                  Vous avez déjà laissé un avis pour ce produit. Merci pour votre contribution !
                </Alert>
              ) : showAddForm ? (
                <AddReviewForm
                  productId={productId}
                  onSuccess={handleReviewSuccess}
                  onCancel={() => setShowAddForm(false)}
                  setReviewList={setReviewList}
                />
              ) : (
                <div className="text-center mt-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setShowAddForm(true)}
                  >
                    <i className="icofont-star me-1"></i>
                    Ajouter un avis
                  </Button>
                </div>
              )
            ) : (
              <Alert variant="info" className="mt-3 py-2 small text-center">
                <span>Pour ajouter un avis, veuillez <a href="/auth/signin?redirect=back">vous connecter</a> ou <a href="/auth/signup?redirect=back">créer un compte</a>.</span>
              </Alert>
            )}
        </div>
      </Tab>
    </Tabs>
  );
};

export default ProductTabs;