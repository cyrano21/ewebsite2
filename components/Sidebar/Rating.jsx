import React, { useEffect, useRef, useState } from 'react';
import styles from './Rating.module.css';

const Rating = ({ initialRating = 0, size = 'medium', readOnly = false, onChange, totalStars = 5, showValue = true, id = 'rating' }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const ratingRef = useRef(null);
  const ratingContainerRef = useRef(null);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  // Fonction pour déterminer la taille des étoiles
  const getStarSize = () => {
    switch (size) {
      case 'small':
        return '14px';
      case 'large':
        return '24px';
      default:
        return '18px';
    }
  };

  // Fonction pour gérer le clic sur une étoile
  const handleStarClick = (selectedRating) => {
    if (readOnly) return;

    setRating(selectedRating);
    if (onChange) {
      onChange(selectedRating);
    }
  };

  // Fonction pour gérer le survol d'une étoile
  const handleStarHover = (hoveredRating) => {
    if (readOnly) return;
    setHoverRating(hoveredRating);
  };

  // Fonction pour réinitialiser le survol
  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  // Fonction pour générer les étoiles
  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || rating;
    const starSize = getStarSize();

    for (let i = 1; i <= totalStars; i++) {
      const filled = i <= displayRating;
      stars.push(
        <span
          key={`star-${i}`}
          className={`${styles.star} ${filled ? styles.filled : ''} icofont-ui-rating ${filled ? 'rated' : ''}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          style={{ fontSize: starSize, cursor: readOnly ? 'default' : 'pointer' }}
          role={readOnly ? 'presentation' : 'button'}
          aria-label={`${i} star${i === 1 ? '' : 's'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div 
      className={styles.ratingContainer} 
      ref={ratingContainerRef}
      onMouseLeave={handleMouseLeave}
      id={`${id}-container`}
    >
      <div className={styles.starContainer} ref={ratingRef}>
        {renderStars()}
      </div>
      {showValue && (
        <span className={styles.ratingValue}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;