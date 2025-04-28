// components/shop/ProductTabs.js ou .jsx
import React, { useContext } from 'react';
// Correction : Ajouter Badge à l'importation
import { Tabs, Tab, ListGroup, Badge, Button, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthProvider';

// Internal helper component for displaying a single review
const ProductReview = ({ review }) => {
    // Basic validation for review object
    if (!review || !review.id) {
         return <p className="small text-muted">Review data is missing.</p>;
    }

    return (
        <div key={review.id} className="mb-3 border-bottom pb-3"> {/* Increased bottom padding */}
            <div className="d-flex justify-content-between align-items-center mb-1">
                <strong className="text-dark">{review.user || 'Anonymous'}</strong>
                 {/* Display review date if available */}
                 {review.date && <small className="text-muted">{review.date}</small>}
             </div>
            <div className="mb-1">
            {/* Render stars based on rating */}
            {[...Array(5)].map((_, i) => (
                <i
                key={i}
                className={`icofont-star small ${
                    typeof review.rating === 'number' && i < review.rating ? 'text-warning' : 'text-muted'
                }`}
                />
            ))}
            </div>
            <p className="small mb-0">{review.comment || 'No comment provided.'}</p>
             {/* You could add review images or reply sections here if needed */}
        </div>
    );
};


// --- Inline Add Review Form ---
const AddReviewForm = ({ onSubmit, submitting, error }) => {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    onSubmit({ rating, comment });
  };

  return (
    <Form onSubmit={handleSubmit} className="border rounded p-3 mb-2 bg-light">
      <Form.Group className="mb-2">
        <Form.Label>Note</Form.Label>
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
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Écrivez votre avis ici..."
          required
        />
      </Form.Group>
      {error && <Alert variant="danger" className="py-1 small">{error}</Alert>}
      <div className="d-flex justify-content-end">
        <Button type="submit" variant="primary" size="sm" disabled={submitting}>
          {submitting ? "Envoi..." : "Envoyer l'avis"}
        </Button>
      </div>
    </Form>
  );
};

// Main ProductTabs Component
const ProductTabs = ({ description, specifications, reviews }) => {
  const reviewList = Array.isArray(reviews) ? reviews : [];
  const specList = Array.isArray(specifications) ? specifications : [];
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(null);
  const [successMsg, setSuccessMsg] = React.useState(null);
  const { user } = useContext(AuthContext);

  // Demo submit handler (to be replaced by parent callback/API)
  const handleAddReview = async ({ rating, comment }) => {
    setSubmitting(true);
    setSubmitError(null);
    setSuccessMsg(null);
    try {
      // Simule l'envoi (remplacer par appel API réel)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMsg("Merci pour votre avis ! Il sera publié après modération.");
      setShowAddForm(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setSubmitError("Erreur lors de l'envoi de l'avis.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Tabs defaultActiveKey="description" id="product-details-tabs" className="mb-3 product-desc-tabs" justify>
      {/* Description Tab */}
      <Tab eventKey="description" title="Description">
        <div className="pt-3 tab-content-section">
            {description ? <p>{description}</p> : <p className="text-muted">No description available.</p>}
        </div>
      </Tab>

      {/* Specification Tab */}
      <Tab eventKey="specification" title="Specification">
         <div className="pt-3 tab-content-section">
            {specList.length > 0 ? (
                <ListGroup variant="flush">
                    {specList.map((s, i) => (
                    <ListGroup.Item key={i} className="px-0 py-2 d-flex justify-content-between"> {/* Adjusted padding/layout */}
                       <span><strong>{s.key}</strong>: {s.value}</span>
                       {/* Optionally add checkmark or details */}
                    </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p className="text-muted">No specifications available.</p>
            )}
        </div>
      </Tab>

      {/* Reviews Tab */}
      <Tab
        eventKey="reviews"
        title={
          <>
            Reviews <Badge pill bg="secondary" text="light" className="ms-1">{reviewList.length}</Badge>
          </>
        }
      >
        <div className="pt-3 tab-content-section">
            {reviewList.length > 0 ? (
                reviewList.map((r) => <ProductReview key={r.id} review={r} />)
            ) : (
                <p className="text-muted">No reviews yet.</p>
            )}
            {/* Add Review Button & Inline Form */}
            {successMsg && <Alert variant="success" className="py-1 small">{successMsg}</Alert>}
            {user ? (
              showAddForm ? (
                <AddReviewForm
                  onSubmit={handleAddReview}
                  submitting={submitting}
                  error={submitError}
                />
              ) : (
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mt-3"
                  onClick={() => setShowAddForm(true)}
                >
                  Ajouter un avis
                </Button>
              )
            ) : (
              <Alert variant="info" className="mt-3 py-2 small">
                <span>Pour ajouter un avis, veuillez <a href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}>vous connecter</a> ou <a href={`/register?redirect=${encodeURIComponent(window.location.pathname)}`}>créer un compte</a>.</span>
              </Alert>
            )}
        </div>
      </Tab>
    </Tabs>
  );
};

export default ProductTabs;