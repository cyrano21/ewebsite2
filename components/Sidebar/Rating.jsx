import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Rating.module.css";

const Rating = ({ 
  ratings = 0, 
  value, // Ajout de la prop 'value' pour compatibilité
  maxRating = 5, 
  interactive = false, 
  size = "md", 
  color = "warning",
  showCount = false,
  count = 0,
  onRatingChange = null
}) => {
  // Utiliser 'value' si fourni, sinon utiliser 'ratings'
  const actualRating = value !== undefined ? value : ratings;
  
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(actualRating);

  // Déterminer la classe de taille
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return styles.small;
      case "lg":
        return styles.large;
      case "xl":
        return styles.extraLarge;
      default:
        return styles.medium;
    }
  };

  // Déterminer la classe de couleur
  const getColorClass = () => {
    switch (color) {
      case "primary":
        return "text-primary";
      case "danger":
        return "text-danger";
      case "success":
        return "text-success";
      case "info":
        return "text-info";
      default:
        return "text-warning";
    }
  };

  // Gestion du survol (pour les étoiles interactives)
  const handleMouseEnter = (star) => {
    if (interactive) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  // Gestion du clic (pour les étoiles interactives)
  const handleClick = (star) => {
    if (interactive) {
      setSelectedRating(star);
      if (onRatingChange) {
        onRatingChange(star);
      }
    }
  };

  // Déterminer si une étoile est active
  const isStarActive = (star) => {
    if (hoverRating >= star) {
      return true;
    }
    if (hoverRating === 0 && (interactive ? selectedRating : actualRating) >= star) {
      return true;
    }
    return false;
  };

  // Générer le tableau d'étoiles
  const stars = Array.from({ length: maxRating }, (_, index) => index + 1);

  return (
    <div className={styles.ratingContainer}>
      <span 
        className={`${styles.rating} ${getSizeClass()}`}
        onMouseLeave={handleMouseLeave}
      >
        {stars.map((star) => (
          <i
            key={star}
            className={`icofont-ui-rating ${isStarActive(star) ? getColorClass() : ''} ${interactive ? styles.interactive : ''}`}
            onMouseEnter={() => handleMouseEnter(star)}
            onClick={() => handleClick(star)}
            style={{ cursor: interactive ? "pointer" : "default" }}
          ></i>
        ))}
      </span>
      
      {showCount && (
        <span className={styles.count}>
          ({count})
        </span>
      )}
    </div>
  );
};

Rating.propTypes = {
  ratings: PropTypes.number,
  value: PropTypes.number, // Ajout de la prop 'value' aux PropTypes
  maxRating: PropTypes.number,
  interactive: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  color: PropTypes.oneOf(["warning", "primary", "danger", "success", "info"]),
  showCount: PropTypes.bool,
  count: PropTypes.number,
  onRatingChange: PropTypes.func
};

export default Rating;
