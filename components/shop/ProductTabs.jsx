// components/shop/ProductTabs.js ou .jsx
import React from 'react';
// Correction : Ajouter Badge à l'importation
import { Tabs, Tab, ListGroup, Badge } from 'react-bootstrap';

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


// Main ProductTabs Component
const ProductTabs = ({ description, specifications, reviews }) => {
  const reviewList = Array.isArray(reviews) ? reviews : [];
  const specList = Array.isArray(specifications) ? specifications : [];

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
                       <span>{s}</span>
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
            {/* TODO: Add a link/button to write a review */}
            {/* <Button variant="outline-primary" size="sm" className="mt-3">Write a review</Button> */}
        </div>
      </Tab>
    </Tabs>
  );
};

export default ProductTabs;