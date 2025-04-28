import React from 'react';
import PropTypes from 'prop-types';

// TODO: Implement ProductsTable component using Table, Card, Pagination etc.
const ProductsTable = ({
  products,
  indexOfFirstItem,
  currentPage,
  totalPages,
  handlePageChange,
  handleViewOnShop,
  handleShowPreviewModal,
  handleShowEditModal,
  handleDeleteProduct
}) => {
  return null;
};

ProductsTable.propTypes = {
  products: PropTypes.array.isRequired,
  indexOfFirstItem: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handleViewOnShop: PropTypes.func.isRequired,
  handleShowPreviewModal: PropTypes.func.isRequired,
  handleShowEditModal: PropTypes.func.isRequired,
  handleDeleteProduct: PropTypes.func.isRequired
};

export default ProductsTable;
