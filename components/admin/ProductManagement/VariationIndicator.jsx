import React from 'react';
import PropTypes from 'prop-types';

const VariationIndicator = ({ value, suffix = '%' }) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return <span className="text-muted">-</span>;
  if (numValue > 0) return <span className="text-success small"><i className="icofont-arrow-up"></i> {value}{suffix}</span>;
  if (numValue < 0) return <span className="text-danger small"><i className="icofont-arrow-down"></i> {Math.abs(numValue)}{suffix}</span>;
  return <span className="text-muted small">0{suffix}</span>;
};

VariationIndicator.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suffix: PropTypes.string
};

export default VariationIndicator;
