import React from 'react';

const Rating = ({ value = 0, count = 0, showCount = true, size = 'normal' }) => (
  <span className="rating d-flex align-items-center">
    {[1, 2, 3, 4, 5].map(i => (
      <i
        key={i}
        className={`icofont-ui-rating${i <= value ? ' text-warning' : ''} ${size === 'small' ? 'fs-6' : ''}`}
        aria-hidden="true"
      />
    ))}
    {showCount && (
      <small className="text-muted ms-1">
        ({count || 0})
      </small>
    )}
  </span>
);

export default Rating;
