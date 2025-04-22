import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from './SharedUtils';

/**
 * Indicateur de variation avec flèche et couleur
 */
export const VariationIndicator = ({ value, suffix = '%' }) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return <span className="text-muted">-</span>;

  if (numValue > 0) {
    return <span className="text-success small"><i className="icofont-arrow-up"></i> {value}{suffix}</span>;
  } else if (numValue < 0) {
    return <span className="text-danger small"><i className="icofont-arrow-down"></i> {Math.abs(numValue)}{suffix}</span>;
  } else {
    return <span className="text-muted small">0{suffix}</span>;
  }
};
VariationIndicator.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suffix: PropTypes.string
};

/**
 * Barre de progression avec titre et valeurs
 */
export const ProgressBar = ({ value, max, title }) => {
  const numValue = parseFloat(value) || 0;
  const numMax = parseFloat(max) || 100;
  const percentage = numMax > 0 ? Math.min(Math.max((numValue / numMax) * 100, 0), 100) : 0;
  let barColor = 'bg-success';
  if (percentage < 30) barColor = 'bg-danger';
  else if (percentage < 70) barColor = 'bg-warning';

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between mb-1 small">
        <span>{title}</span>
        <span>{formatNumber(numValue)} / {formatNumber(numMax)}</span>
      </div>
      <div className="progress" style={{ height: '8px' }}>
        <div
          className={`progress-bar ${barColor}`}
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={numValue}
          aria-valuemin="0"
          aria-valuemax={numMax}
        ></div>
      </div>
    </div>
  );
};
ProgressBar.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired
};

/**
 * Affiche une tendance avec couleur et flèche
 */
export const TrendIndicator = ({ value, suffix = '' }) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return <span className="text-muted">-</span>;
  
  if (numValue > 0) {
    return <span className="text-success small"><i className="icofont-arrow-up"></i> {value}{suffix}</span>;
  } else if (numValue < 0) {
    return <span className="text-danger small"><i className="icofont-arrow-down"></i> {value}{suffix}</span>;
  } else {
    return <span className="text-muted small">{value}{suffix}</span>;
  }
};
TrendIndicator.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suffix: PropTypes.string
};
