
import React from 'react';

const Rating = ({ value = 0, count = 0, showCount = true, size = 'normal' }) => {
  // Assurer que la valeur est un nombre entre 0 et 5
  const normalizedValue = typeof value === 'number' ? Math.min(Math.max(value, 0), 5) : 0;
  // S'assurer que count est un nombre
  const reviewCount = typeof count === 'number' ? count : 0;
  // Arrondir à 0.5 près pour un affichage d'étoiles partielles
  const roundedValue = Math.round(normalizedValue * 2) / 2;
  
  return (
    <span className="rating d-flex align-items-center">
      {[1, 2, 3, 4, 5].map(star => {
        let starClass = '';
        
        if (star <= roundedValue) {
          // Étoile pleine
          starClass = 'text-warning';
        } else if (star - 0.5 === roundedValue) {
          // Demi-étoile (simulée avec une classe CSS)
          starClass = 'text-warning half-star';
        }
        
        return (
          <i
            key={star}
            className={`icofont-ui-rating ${starClass} ${size === 'small' ? 'fs-6' : ''}`}
            aria-hidden="true"
            title={`${roundedValue} sur 5`}
          />
        );
      })}
      {showCount && (
        <small className="text-muted ms-1">
          ({reviewCount})
        </small>
      )}
      
      <style jsx>{`
        .half-star {
          position: relative;
          overflow: hidden;
        }
        .half-star:after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background-color: white;
          z-index: 1;
        }
      `}</style>
    </span>
  );
};

export default Rating;
