import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faEmptyStar } from '@fortawesome/free-regular-svg-icons';

const Rating = ({ value, count, size = 'small', showCount = true }) => {
  // Log des props reçues pour le débogage
  console.log(`Rating - Props reçues: value=${value} (${typeof value}), count=${count} (${typeof count}), size=${size}, showCount=${showCount}`);

  // S'assurer que la valeur est un nombre valide
  const safeValue = typeof value === 'number' ? value : 0;
  const normalizedValue = safeValue > 5 ? 5 : safeValue < 0 ? 0 : safeValue;

  // S'assurer que count est un nombre valide
  const safeCount = typeof count === 'number' ? count : 0;
  const reviewCount = Math.max(0, safeCount);

  // Arrondir la valeur pour l'affichage des étoiles
  const roundedValue = Math.round(normalizedValue);
  console.log(`Rating - Valeurs normalisées: safeValue=${safeValue}, normalizedValue=${normalizedValue}, safeCount=${safeCount}, reviewCount=${reviewCount}`);
  console.log(`Rating - Valeur arrondie: ${roundedValue}`);

  // Déterminer la taille des étoiles
  const iconSize = size === 'large' ? '1.5rem' : size === 'medium' ? '1rem' : '0.8rem';

  return (
    <div className="d-flex align-items-center">
      {[...Array(5)].map((_, index) => (
        <span key={index} style={{ color: '#FFD700', fontSize: iconSize, marginRight: '0.1rem' }}>
          {index < roundedValue ? (
            <FontAwesomeIcon icon={faStar} />
          ) : (
            <FontAwesomeIcon icon={faEmptyStar} />
          )}
        </span>
      ))}

      {showCount && (
        <span className="ms-1 text-muted small">
          {reviewCount > 0 ? `(${reviewCount})` : '(0)'}
        </span>
      )}
    </div>
  );
};

export default Rating;