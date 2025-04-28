import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

const CategoryModal = ({
  show,
  editingCategory,
  newCategory,
  categoryError,
  handleClose,
  handleAddCategory,
  handleEditCategory,
  handleCancelEditCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  availableCategories
}) => (
  <Modal show={show} onHide={handleClose} centered>
    {/* TODO: Integrate category management UI here */}
  </Modal>
);

CategoryModal.propTypes = {
  show: PropTypes.bool.isRequired,
  editingCategory: PropTypes.object,
  newCategory: PropTypes.string,
  categoryError: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleAddCategory: PropTypes.func,
  handleEditCategory: PropTypes.func,
  handleCancelEditCategory: PropTypes.func,
  handleUpdateCategory: PropTypes.func,
  handleDeleteCategory: PropTypes.func,
  availableCategories: PropTypes.array.isRequired
};

export default CategoryModal;
