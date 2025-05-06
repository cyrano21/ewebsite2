
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import PageHeader from '../PageHeader';

const DropshippingManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    website: '',
    description: '',
    commissionRate: 15,
    status: 'pending'
  });

  // Charger les fournisseurs
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/suppliers');
        setSuppliers(data);
        setLoading(false);
      } catch (error) {
        setError('Erreur lors du chargement des fournisseurs');
        setLoading(false);
        console.error(error);
      }
    };

    fetchSuppliers();
  }, []);

  // Ouvrir modal pour ajouter
  const handleShowAddModal = () => {
    setCurrentSupplier(null);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      website: '',
      description: '',
      commissionRate: 15,
      status: 'pending'
    });
    setShowModal(true);
  };

  // Ouvrir modal pour éditer
  const handleShowEditModal = (supplier) => {
    setCurrentSupplier(supplier);
    setFormData({
      name: supplier.name,
      company: supplier.company,
      email: supplier.email,
      phone: supplier.phone,
      address: {
        street: supplier.address?.street || '',
        city: supplier.address?.city || '',
        state: supplier.address?.state || '',
        postalCode: supplier.address?.postalCode || '',
        country: supplier.address?.country || ''
      },
      website: supplier.website || '',
      description: supplier.description || '',
      commissionRate: supplier.commissionRate || 15,
      status: supplier.status || 'pending'
    });
    setShowModal(true);
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentSupplier) {
        // Mise à jour
        await axios.put(`/api/suppliers/${currentSupplier._id}`, formData);
        setSuppliers(suppliers.map(sup => 
          sup._id === currentSupplier._id ? { ...sup, ...formData } : sup
        ));
      } else {
        // Création
        const { data } = await axios.post('/api/suppliers', formData);
        setSuppliers([...suppliers, data.data]);
      }
      
      setShowModal(false);
    } catch (error) {
      setError('Erreur lors de la sauvegarde du fournisseur');
      console.error(error);
    }
  };

  // Supprimer un fournisseur
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      try {
        await axios.delete(`/api/suppliers/${id}`);
        setSuppliers(suppliers.filter(sup => sup._id !== id));
      } catch (error) {
        setError('Erreur lors de la suppression du fournisseur');
        console.error(error);
      }
    }
  };

  // Fonction pour afficher le badge de statut
  const getStatusBadge = (status) => {
    const statusMap = {
      'active': <Badge bg="success">Actif</Badge>,
      'inactive': <Badge bg="secondary">Inactif</Badge>,
      'pending': <Badge bg="warning">En attente</Badge>,
      'suspended': <Badge bg="danger">Suspendu</Badge>
    };
    
    return statusMap[status] || <Badge bg="info">{status}</Badge>;
  };

  return (
    <div>
      <PageHeader title="Gestion des Fournisseurs Dropshipping" curPage="Admin / Dropshipping" />
      
      <Container fluid className="py-4">
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Fournisseurs Dropshipping</h5>
              <Button variant="primary" onClick={handleShowAddModal}>
                <i className="icofont-plus-circle me-1"></i> Ajouter un fournisseur
              </Button>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement des fournisseurs...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Entreprise</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Statut</th>
                      <th>Commission</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          Aucun fournisseur trouvé
                        </td>
                      </tr>
                    ) : (
                      suppliers.map((supplier) => (
                        <tr key={supplier._id}>
                          <td>{supplier.name}</td>
                          <td>{supplier.company}</td>
                          <td>{supplier.email}</td>
                          <td>{supplier.phone}</td>
                          <td>{getStatusBadge(supplier.status)}</td>
                          <td>{supplier.commissionRate || 15}%</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleShowEditModal(supplier)}
                              >
                                <i className="icofont-edit"></i>
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDelete(supplier._id)}
                              >
                                <i className="icofont-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
      
      {/* Modal pour ajouter/éditer un fournisseur */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentSupplier ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du contact*</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Entreprise*</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email*</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone*</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="Rue"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="Ville"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="État/Province"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleChange}
                    placeholder="Code postal"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    placeholder="Pays"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Web</Form.Label>
                  <Form.Control
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Taux de commission (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="commissionRate"
                    value={formData.commissionRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">En attente</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {currentSupplier ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DropshippingManagement;
