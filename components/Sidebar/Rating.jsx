import React, { useEffect, useRef, useState } from 'react';
import styles from './Rating.module.css';

// Vérification des styles au chargement du composant
console.debug('Styles chargés Rating.module.css:', styles);

const Rating = ({ initialRating = 0, size = 'medium', readOnly = false, onChange, totalStars = 5, showValue = true, id = 'rating' }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const ratingRef = useRef(null);
  const ratingContainerRef = useRef(null);
  
  // S'assurer que les refs sont correctement initialisées
  useEffect(() => {
    if (!ratingRef.current || !ratingContainerRef.current) {
      console.debug('Refs initialisées pour le composant Rating');
    }
  }, []);

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
    
    // Accès sécurisé aux styles
    const safeStyles = styles || {};

    for (let i = 1; i <= totalStars; i++) {
      const filled = i <= displayRating;
      stars.push(
        <span
          key={`star-${i}`}
          className={`${safeStyles.star || 'star'} ${filled ? (safeStyles.filled || 'filled') : ''} icofont-ui-rating ${filled ? 'rated' : ''}`}
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

  // Utiliser des classes par défaut si les styles ne sont pas chargés correctement
  const safeStyles = styles || {};
  
  return (
    <div 
      className={safeStyles.ratingContainer || 'rating-container'} 
      ref={ratingContainerRef}
      onMouseLeave={handleMouseLeave}
      id={`${id}-container`}
      data-testid="rating-component"
    >
      <div className={safeStyles.starContainer || 'star-container'} ref={ratingRef}>
        {renderStars()}
      </div>
      {showValue && (
        <span className={safeStyles.ratingValue || 'rating-value'}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;