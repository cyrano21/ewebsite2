
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, Form, Button, Row, Col, Table, Image, 
  Alert, Spinner, Badge, Modal 
} from 'react-bootstrap';

// Objet banner vide pour initialiser le formulaire
const emptyBanner = {
  name: '',
  imageUrl: '',
  link: '',
  order: 0,
  isActive: true
};

const SponsorBannerAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(emptyBanner);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  // Liste des sponsors de secours pour l'importation
  const defaultSponsors = [
    { imageUrl: '/assets/images/sponsor/ile.png', name: 'ile' },
    { imageUrl: '/assets/images/sponsor/nestle.png', name: 'Nestlé' },
    { imageUrl: '/assets/images/sponsor/disney.png', name: 'Disney' },
    { imageUrl: '/assets/images/sponsor/airbnb.png', name: 'airbnb' },
    { imageUrl: '/assets/images/sponsor/grab.png', name: 'Grab' },
    { imageUrl: '/assets/images/sponsor/netflix.png', name: 'Netflix' }
  ];

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/sponsor-banners');
      setBanners(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des sponsors: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour importer les sponsors par défaut
  const importDefaultSponsors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Importation séquentielle des sponsors par défaut
      for (let i = 0; i < defaultSponsors.length; i++) {
        const sponsor = defaultSponsors[i];
        await axios.post('/api/sponsor-banners', {
          name: sponsor.name,
          imageUrl: sponsor.imageUrl,
          isActive: true,
          order: i
        });
      }
      
      setSuccess("Sponsors par défaut importés avec succès!");
      fetchBanners(); // Rafraîchir la liste
    } catch (err) {
      setError("Erreur lors de l'importation des sponsors par défaut: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    
    // Créer un aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      // Créer un FormData pour l'upload
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.url;
    } catch (err) {
      throw new Error("Échec du téléchargement de l'image: " + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      let finalForm = { ...form };
      
      // Si une image a été sélectionnée, la télécharger d'abord
      if (imageFile) {
        try {
          const imageUrl = await uploadImage(imageFile);
          finalForm.imageUrl = imageUrl;
        } catch (uploadErr) {
          setError(uploadErr.message);
          setLoading(false);
          return;
        }
      }
      
      if (editingId) {
        // Mode édition
        await axios.put('/api/sponsor-banners', { 
          _id: editingId,
          ...finalForm
        });
        setSuccess("Sponsor mis à jour avec succès!");
      } else {
        // Mode création
        await axios.post('/api/sponsor-banners', finalForm);
        setSuccess("Nouveau sponsor ajouté avec succès!");
      }
      
      // Réinitialiser le formulaire et rafraîchir la liste
      setForm(emptyBanner);
      setEditingId(null);
      setImageFile(null);
      setImagePreview('');
      fetchBanners();
    } catch (err) {
      setError("Erreur lors de l'enregistrement: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setForm({
      name: banner.name,
      imageUrl: banner.imageUrl,
      link: banner.link || '',
      order: banner.order,
      isActive: banner.isActive
    });
    setEditingId(banner._id);
    setImagePreview('');
    setImageFile(null);
    
    // Faire défiler jusqu'au formulaire
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCancel = () => {
    setForm(emptyBanner);
    setEditingId(null);
    setImageFile(null);
    setImagePreview('');
  };

  const confirmDelete = (banner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    
    try {
      setLoading(true);
      await axios.delete('/api/sponsor-banners', { 
        data: { _id: bannerToDelete._id } 
      });
      setSuccess("Sponsor supprimé avec succès!");
      fetchBanners();
    } catch (err) {
      setError("Erreur lors de la suppression: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setBannerToDelete(null);
    }
  };

  // Effacer les messages après 5 secondes
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="sponsor-banner-admin">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card className="mb-4">
        <Card.Header as="h5">{editingId ? 'Modifier un sponsor' : 'Ajouter un nouveau sponsor'}</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du sponsor</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="Ex: Nestlé, Disney, etc." 
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Lien (optionnel)</Form.Label>
                  <Form.Control 
                    type="url" 
                    name="link" 
                    value={form.link} 
                    onChange={handleChange} 
                    placeholder="https://..." 
                  />
                  <Form.Text className="text-muted">
                    URL vers laquelle l'utilisateur sera redirigé lorsqu'il clique sur le logo
                  </Form.Text>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ordre d'affichage</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="order" 
                        value={form.order} 
                        onChange={handleChange} 
                        min="0" 
                      />
                      <Form.Text className="text-muted">
                        Les sponsors seront affichés dans l'ordre croissant
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3 mt-2">
                      <Form.Check 
                        type="checkbox" 
                        label="Actif" 
                        name="isActive" 
                        checked={form.isActive} 
                        onChange={handleChange} 
                        className="mt-4"
                      />
                      <Form.Text className="text-muted">
                        Seuls les sponsors actifs sont affichés
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  
                  {/* Aperçu de l'image */}
                  {(imagePreview || form.imageUrl) && (
                    <div className="mb-3 text-center">
                      <Image 
                        src={imagePreview || form.imageUrl} 
                        alt="Aperçu" 
                        thumbnail 
                        style={{ maxHeight: '150px', maxWidth: '100%' }}
                      />
                    </div>
                  )}
                  
                  {/* Uploader une nouvelle image */}
                  <Form.Control 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="mb-3"
                  />
                  
                  {/* Ou utiliser une URL existante */}
                  <Form.Label>Ou URL de l'image</Form.Label>
                  <Form.Control 
                    type="url" 
                    name="imageUrl" 
                    value={form.imageUrl} 
                    onChange={handleChange} 
                    placeholder="URL de l'image (https://...)" 
                    className="mt-2"
                    required={!imageFile && !imagePreview}
                  />
                  <Form.Text className="text-muted">
                    Téléchargez une image ou fournissez une URL externe.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end gap-2 mt-3">
              {editingId && (
                <Button variant="secondary" onClick={handleCancel}>
                  Annuler
                </Button>
              )}
              <Button variant="primary" type="submit" disabled={loading || uploading}>
                {(loading || uploading) && <Spinner as="span" animation="border" size="sm" className="me-2" />}
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
          <span>Liste des sponsors</span>
          {banners.length === 0 && (
            <Button 
              variant="success" 
              size="sm" 
              onClick={importDefaultSponsors}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-1" />
                  Importation...
                </>
              ) : (
                <>
                  <i className="icofont-download me-1"></i>
                  Importer les sponsors par défaut
                </>
              )}
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Chargement des sponsors...</p>
            </div>
          ) : banners.length === 0 ? (
            <Alert variant="info">
              Aucun sponsor trouvé. Ajoutez-en un premier ou importez les sponsors par défaut !
            </Alert>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Image</th>
                  <th>Lien</th>
                  <th>Ordre</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map(b => (
                  <tr key={b._id}>
                    <td>{b.name}</td>
                    <td>
                      <Image 
                        src={b.imageUrl} 
                        alt={b.name} 
                        style={{ maxHeight: 40, maxWidth: 80 }} 
                        thumbnail 
                      />
                    </td>
                    <td>
                      {b.link ? (
                        <a href={b.link} target="_blank" rel="noopener noreferrer">
                          {b.link.length > 25 ? b.link.substring(0, 25) + '...' : b.link}
                        </a>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>{b.order}</td>
                    <td>
                      <span className={`badge ${b.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {b.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleEdit(b)}
                        >
                          <i className="icofont-edit"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => confirmDelete(b)}
                        >
                          <i className="icofont-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer le sponsor "{bannerToDelete?.name}" ? 
          Cette action est irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SponsorBannerAdmin;
