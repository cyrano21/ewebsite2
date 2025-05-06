import React from 'react';

const Rating = ({ value = 0 }) => (
  <span className="rating">
    {[1,2,3,4,5].map(i => (
      <i
        key={i}
        className={`icofont-ui-rating${i <= value ? ' text-warning' : ''}`}
        aria-hidden="true"
      />
    ))}
  </span>
);

export default Rating;
