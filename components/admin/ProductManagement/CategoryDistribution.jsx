import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

const defaultColors = ['#007bff', '#28a745', '#17a2b8', '#ffc107', '#dc3545', '#6c757d'];

const CategoryDistribution = ({
  distribution = {},
  totalProducts = 0,
  getCategoryColor = (index) => defaultColors[index % defaultColors.length],
  formatNumber = (num) => num.toLocaleString()
}) => (
  <Card className="mb-4 shadow-sm">
    <Card.Header className="bg-light py-2">
      <h6 className="mb-0 fw-normal">Produits par catégorie</h6>
    </Card.Header>
    <Card.Body className="pt-2">
      {Object.entries(distribution)
        .sort(([, a], [, b]) => b - a)
        .map(([category, count], index) => (
          <div key={index} className="mb-2">
            <div className="d-flex justify-content-between small mb-1">
              <span>{category}</span>
              <span>{formatNumber(count)} ({((count / totalProducts) * 100).toFixed(0)}%)</span>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${(count / totalProducts) * 100}%`,
                  backgroundColor: getCategoryColor(index)
                }}
                aria-valuenow={count}
                aria-valuemin="0"
                aria-valuemax={totalProducts}
              />
            </div>
          </div>
        ))}
    </Card.Body>
  </Card>
);

CategoryDistribution.propTypes = {
  distribution: PropTypes.object,
  totalProducts: PropTypes.number,
  getCategoryColor: PropTypes.func,
  formatNumber: PropTypes.func
};

export default CategoryDistribution;
