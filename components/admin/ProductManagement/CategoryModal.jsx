import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

const CategoryModal = ({
  show,
  onHide,
  availableCategories: initialCategories = [],
  onCategoriesChange
}) => {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return setError('Le nom ne peut pas être vide.');
    if (categories.some(cat => cat.toLowerCase() === trimmed.toLowerCase())) return setError('Cette catégorie existe déjà.');
    const updated = [...categories, trimmed];
    setCategories(updated);
    setNewCategory('');
    setError('');
    onCategoriesChange && onCategoriesChange(updated);
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditValue(categories[idx]);
    setError('');
  };

  const handleEditSave = () => {
    const trimmed = editValue.trim();
    if (!trimmed) return setError('Le nom ne peut pas être vide.');
    if (categories.some((cat, i) => i !== editIndex && cat.toLowerCase() === trimmed.toLowerCase())) return setError('Cette catégorie existe déjà.');
    const updated = categories.map((cat, i) => i === editIndex ? trimmed : cat);
    setCategories(updated);
    setEditIndex(null);
    setEditValue('');
    setError('');
    onCategoriesChange && onCategoriesChange(updated);
  };

  const handleDelete = (idx) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    const updated = categories.filter((_, i) => i !== idx);
    setCategories(updated);
    setError('');
    onCategoriesChange && onCategoriesChange(updated);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Gérer les catégories</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Catégories existantes :</h6>
        <ul className="list-group mb-3">
          {categories.map((cat, idx) => (
            <li key={cat} className="list-group-item d-flex align-items-center justify-content-between">
              {editIndex === idx ? (
                <>
                  <input
                    className="form-control me-2"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') { setEditIndex(null); setEditValue(''); } }}
                  />
                  <Button variant="success" size="sm" className="me-1" onClick={handleEditSave}><i className="icofont-check" /></Button>
                  <Button variant="outline-secondary" size="sm" onClick={() => { setEditIndex(null); setEditValue(''); }}><i className="icofont-close" /></Button>
                </>
              ) : (
                <>
                  <span>{cat}</span>
                  <span>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(idx)}><i className="icofont-pencil" /></Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(idx)}><i className="icofont-trash" /></Button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
        <InputGroup>
          <Form.Control
            placeholder="Nouvelle catégorie..."
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          />
          <Button variant="primary" onClick={handleAdd}>Ajouter</Button>
        </InputGroup>
        {error && <div className="text-danger mt-2 small">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};

CategoryModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  availableCategories: PropTypes.array.isRequired
};

export default CategoryModal;
