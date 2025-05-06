import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ title, value, max }) => {
  const percent = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between mb-1 small">
        <span>{title}</span>
        <span>{value} / {max}</span>
      </div>
      <div className="progress" style={{ height: '6px' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${percent}%` }}
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};

export default ProgressBar;
