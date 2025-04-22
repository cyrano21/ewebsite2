// src/components/product/CategoryManagementModal.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

const CategoryManagementModal = ({
  show,
  onHide,
  availableCategories, // Full list including 'Tous'
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [editingCategory, setEditingCategory] = useState({ oldName: null, name: '' });

  // Reset state when modal opens/closes or editing state changes
  useEffect(() => {
    if (!show) {
      setNewCategory('');
      setCategoryError('');
      setEditingCategory({ oldName: null, name: '' });
    } else if (!editingCategory.oldName) {
         setCategoryError(''); // Clear error when switching back to add mode
    }
  }, [show, editingCategory.oldName]);


  const handleAdd = (e) => {
    e.preventDefault();
    const trimmedCategory = newCategory.trim();
    if (!trimmedCategory) {
      setCategoryError('Le nom ne peut pas être vide.');
      return;
    }
    const currentCategories = availableCategories.filter(cat => cat !== 'Tous');
    if (currentCategories.map(c => c.toLowerCase()).includes(trimmedCategory.toLowerCase())) {
      setCategoryError('Cette catégorie existe déjà.');
      return;
    }
    onAddCategory(trimmedCategory); // Call parent handler
    setNewCategory('');
    setCategoryError('');
  };

  const handleEdit = (categoryName) => {
    setEditingCategory({ oldName: categoryName, name: categoryName });
    setNewCategory('');
    setCategoryError('');
  };

  const handleCancelEdit = () => {
    setEditingCategory({ oldName: null, name: '' });
    setCategoryError('');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const trimmedNewName = editingCategory.name.trim();
    if (!trimmedNewName) {
      setCategoryError('Le nom ne peut pas être vide.');
      return;
    }
    const currentCategories = availableCategories.filter(cat => cat !== 'Tous');
    if (trimmedNewName.toLowerCase() !== editingCategory.oldName.toLowerCase() &&
        currentCategories.map(c => c.toLowerCase()).includes(trimmedNewName.toLowerCase())) {
      setCategoryError('Ce nom de catégorie existe déjà.');
      return;
    }
    onUpdateCategory(editingCategory.oldName, trimmedNewName); // Call parent handler
    handleCancelEdit();
  };

  const handleDelete = (categoryName) => {
     onDeleteCategory(categoryName); // Call parent handler (parent handles confirmation)
  };

  const categoriesToList = availableCategories.filter(cat => cat !== 'Tous');
  const isEditingMode = !!editingCategory.oldName;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="icofont-tags me-2"></i>
          {isEditingMode ? `Modifier "${editingCategory.oldName}"` : 'Gestion des Catégories'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isEditingMode ? (
          // --- Edit Form ---
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Nouveau nom</Form.Label>
              <Form.Control
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                isInvalid={!!categoryError}
                autoFocus
              />
              <Form.Control.Feedback type="invalid">{categoryError}</Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCancelEdit}>Annuler</Button>
              <Button variant="primary" type="submit">Mettre à jour</Button>
            </div>
          </Form>
        ) : (
          // --- Add Form & List ---
          <>
            <Form onSubmit={handleAdd}>
              <Form.Group className="mb-3">
                <Form.Label>Ajouter une catégorie</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={newCategory}
                    onChange={(e) => { setNewCategory(e.target.value); setCategoryError(''); }}
                    placeholder="Nom de la nouvelle catégorie"
                    isInvalid={!!categoryError}
                  />
                  <Button variant="primary" type="submit">
                    <i className="icofont-plus"></i>
                  </Button>
                </InputGroup>
                <Form.Control.Feedback type="invalid" className={categoryError ? 'd-block' : ''}>
                  {categoryError}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
            <hr />
            <h6 className="mb-3">Catégories existantes</h6>
            <div className="categories-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {categoriesToList.length > 0 ? (
                categoriesToList.map((category, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded bg-light">
                    <span>{category}</span>
                    <div>
                      <Button
                        variant="link" size="sm" className="text-primary p-1 me-1"
                        onClick={() => handleEdit(category)}
                        disabled={category === 'Non classé'} title="Modifier">
                        <i className="icofont-ui-edit"></i>
                      </Button>
                      <Button
                        variant="link" size="sm" className="text-danger p-1"
                        onClick={() => handleDelete(category)}
                        disabled={category === 'Non classé'} title="Supprimer">
                        <i className="icofont-ui-delete"></i>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">Aucune catégorie personnalisée.</p>
              )}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};

CategoryManagementModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  availableCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddCategory: PropTypes.func.isRequired,
  onUpdateCategory: PropTypes.func.isRequired,
  onDeleteCategory: PropTypes.func.isRequired,
};

export default CategoryManagementModal;