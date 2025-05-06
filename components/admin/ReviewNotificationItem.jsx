import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import styles from './AdminNavbar.module.css';

export default function ReviewNotificationItem({ review }) {
  // Formater la date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return 'Date inconnue';
    }
  };

  // Construire l'URL correcte pour accéder à l'avis
  const getReviewUrl = () => {
    // Pour les avis réels, utiliser l'ID du produit associé 
    if (review._id && review.productId) {
      return `/admin/reviews?productId=${review.productId}`;
    }
    return '/admin/reviews';
  };

  return (
    <Dropdown.Item
      as={Link}
      href={getReviewUrl()}
      className={`${styles.notificationItem} ${styles.unread}`}
    >
      <div className="d-flex align-items-start">
        <div className={`${styles.notificationIcon} bg-warning text-warning me-3`}>
          <i className="icofont-star" />
        </div>
        <div>
          <p className="mb-0 small fw-bold">{review.productName || review.product?.name || 'Produit sans nom'}</p>
          <p className="mb-0 small text-muted">
            Note: {review.rating}/5 
            {review.date && ` • ${formatDate(review.date)}`}
            {review.status && <span className={`ms-2 badge ${review.status === 'pending' ? 'bg-warning' : (review.status === 'approved' ? 'bg-success' : 'bg-secondary')}`}>
              {review.status === 'pending' ? 'En attente' : (review.status === 'approved' ? 'Approuvé' : review.status)}
            </span>}
          </p>
        </div>
      </div>
    </Dropdown.Item>
  );
}
