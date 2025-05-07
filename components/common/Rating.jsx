
import React from 'react';

const Rating = ({ value = 0, count = 0, showCount = true, size = 'normal' }) => {
  // Assurer que la valeur est un nombre entre 0 et 5
  const normalizedValue = typeof value === 'number' ? Math.min(Math.max(value, 0), 5) : 0;
  // S'assurer que count est un nombre
  const reviewCount = typeof count === 'number' ? count : 0;
  // Arrondir à 0.5 près pour un affichage d'étoiles partielles
  const roundedValue = Math.round(normalizedValue * 2) / 2;
  
  return (
    <div className="rating-container">
      <div className="stars-container">
        {[...Array(5)].map((_, i) => {
          // Logique pour déterminer le type d'étoile à afficher
          let starType = "empty";
          if (i < Math.floor(roundedValue)) {
            starType = "full";
          } else if (i < Math.ceil(roundedValue) && roundedValue % 1 !== 0) {
            starType = "half";
          }
          
          return (
            <span key={i} className={`star-wrapper ${size === 'small' ? 'small' : ''}`}>
              {starType === "full" && (
                <i className="icofont-ui-rating text-warning" title={`${roundedValue} sur 5`}></i>
              )}
              {starType === "half" && (
                <span className="half-star-container">
                  <i className="icofont-ui-rating text-warning" title={`${roundedValue} sur 5`}></i>
                  <span className="half-star-cover"></span>
                </span>
              )}
              {starType === "empty" && (
                <i className="icofont-ui-rating text-muted" title={`${roundedValue} sur 5`}></i>
              )}
            </span>
          );
        })}
      </div>
      
      {showCount && (
        <small className="text-muted ms-1">
          ({reviewCount})
        </small>
      )}
      
      <style jsx>{`
        .rating-container {
          display: flex;
          align-items: center;
        }
        
        .stars-container {
          display: flex;
        }
        
        .star-wrapper {
          position: relative;
          margin-right: 2px;
          font-size: ${size === 'small' ? '0.9rem' : '1.2rem'};
        }
        
        .small {
          font-size: 0.9rem;
        }
        
        .half-star-container {
          position: relative;
          display: inline-block;
        }
        
        .half-star-cover {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background-color: #f8f9fa;
          z-index: 1;
          overflow: hidden;
        }
        
        .text-warning {
          color: #ffc107 !important;
        }
        
        .text-muted {
          color: #d9d9d9 !important;
        }
      `}</style>
    </div>
  );
};

export default Rating;
