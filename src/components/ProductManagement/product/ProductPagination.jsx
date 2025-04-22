
// src/components/product/ProductPagination.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, Card } from 'react-bootstrap';

const ProductPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Don't render pagination if only one page
  }

  return (
    <Card.Footer className="bg-white border-top-0 pt-3 pb-0"> {/* Adjusted padding */}
      <div className="d-flex justify-content-center">
        <Pagination size="sm">
          <Pagination.Prev
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {/* Simplified pagination display logic */}
          {currentPage > 2 && <Pagination.Item onClick={() => onPageChange(1)}>1</Pagination.Item>}
          {currentPage > 3 && <Pagination.Ellipsis disabled />}

          {currentPage > 1 && <Pagination.Item onClick={() => onPageChange(currentPage - 1)}>{currentPage - 1}</Pagination.Item>}
          <Pagination.Item active>{currentPage}</Pagination.Item>
          {currentPage < totalPages && <Pagination.Item onClick={() => onPageChange(currentPage + 1)}>{currentPage + 1}</Pagination.Item>}

          {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}
          {currentPage < totalPages - 1 && <Pagination.Item onClick={() => onPageChange(totalPages)}>{totalPages}</Pagination.Item>}

          <Pagination.Next
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </Card.Footer>
  );
};

ProductPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default ProductPagination;