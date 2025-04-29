import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Button, Modal, Form, Table, Spinner, Alert } from 'react-bootstrap';

export default function CategoryManagement() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState({ name: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/article-categories');
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      setCategories(data.categories || data);
    } catch (err) {
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (cat = { name: '' }) => {
    setCurrent(cat);
    setIsEditing(!!cat._id);
    setShowModal(true);
  };
  const closeModal = () => {
    setCurrent({ name: '' });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleChange = e => setCurrent({ ...current, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const url = isEditing ? `/api/article-categories/${current._id}` : '/api/article-categories';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: current.name }) });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      closeModal();
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async id => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      const res = await fetch(`/api/article-categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container className="py-4">
      <Button variant="link" className="mb-3 p-0" onClick={() => router.back()}>
        <i className="icofont-rounded-left me-1"></i>Retour
      </Button>
      <h2>Gestion des catégories</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="success" className="mb-3" onClick={() => openModal()}>Nouvelle catégorie</Button>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table bordered hover>
          <thead><tr><th>Nom</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>
                  <Button size="sm" variant="outline-primary" onClick={() => openModal(cat)} className="me-2">Éditer</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(cat._id)}>Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifier' : 'Créer'} une catégorie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom *</Form.Label>
              <Form.Control name="name" value={current.name} onChange={handleChange} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Annuler</Button>
          <Button variant="primary" onClick={handleSave}>{isEditing ? 'Enregistrer' : 'Créer'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
