import React from "react";

const Rating = ({ ratings = 0 }) => {
  return (
    <span className="ratting">
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`icofont-ui-rating ${star <= ratings ? 'text-warning' : ''}`}
        ></i>
      ))}
    </span>
  );
};

export default Rating;
