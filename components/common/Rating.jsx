
import React from 'react';

const Rating = ({ value = 0, count = 0, showCount = true, size = 'normal' }) => {
  // Assurer que la valeur est un nombre entre 0 et 5
  const normalizedValue = typeof value === 'number' ? Math.min(Math.max(value, 0), 5) : 0;
  // S'assurer que count est un nombre
  const reviewCount = typeof count === 'number' ? count : 0;
  // Arrondir à 0.5 près pour un affichage d'étoiles partielles
  const roundedValue = Math.round(normalizedValue * 2) / 2;
  
  // Approche alternative - utiliser des étoiles complètes plutôt que des demi-étoiles
  return (
    <span className="rating d-flex align-items-center">
      {/* Afficher les étoiles pleines et vides directement */}
      {[...Array(5)].map((_, i) => (
        <i
          key={i}
          className={`icofont-ui-rating ${i < Math.floor(roundedValue) ? 'text-warning' : 
                     (i < Math.ceil(roundedValue) && roundedValue % 1 !== 0) ? 'text-warning half-star' : 'text-muted'} 
                     ${size === 'small' ? 'fs-6' : ''}`}
          aria-hidden="true"
          title={`${roundedValue} sur 5`}
          style={{ 
            marginRight: '2px',
            position: 'relative'
          }}
        />
      ))}
      
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
          background-color: #f8f9fa;
          z-index: 1;
        }
        
        .icofont-ui-rating {
          font-size: ${size === 'small' ? '0.9rem' : '1.2rem'};
        }
        
        .text-warning {
          color: #ffc107 !important;
        }
        
        .text-muted {
          color: #d9d9d9 !important;
        }
      `}</style>
    </span>
  );
};

export default Rating;
