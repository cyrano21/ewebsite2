import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, InputGroup, Nav, Tab } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const defaultAdvertisement = {
  name: '',
  type: 'banner',
  position: 'home',
  priority: 0,
  startDate: new Date(),
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  status: 'draft',
  imageUrl: '',
  videoUrl: '',
  targetUrl: '',
  targetDevice: ['all'],
  targetContext: ['all'],
  rotationSettings: {
    frequency: 15, // Temps en secondes entre deux rotations
    rotationGroup: 'default',
    rotationPriority: 1  // Plus la valeur est élevée, plus la publicité apparaît fréquemment
  },
  targetAudience: {
    ageRange: { min: 0, max: 100 },
    gender: [],
    interests: [],
    location: []
  },
  content: {
    title: '',
    subtitle: '',
    description: '',
    callToAction: '',
    buttonText: ''
  },
  dimensions: {
    width: 1200,
    height: 600
  },
  budget: {
    total: 0,
    spent: 0,
    currency: 'EUR'
  },
  keywords: [],
  tags: [],
  isActive: true // Actif par défaut pour les nouvelles publicités
};

const AdvertisementForm = ({ advertisement = null, onSave, onCancel }) => {
  const [form, setForm] = useState(advertisement || defaultAdvertisement);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagsInput, setTagsInput] = useState('');
  const [interestsInput, setInterestsInput] = useState('');
  const [locationsInput, setLocationsInput] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  
  useEffect(() => {
    if (advertisement) {
      setForm(advertisement);
      
      // Initialiser les inputs de tags, intérêts, lieux et mots-clés
      if (advertisement.tags && Array.isArray(advertisement.tags)) {
        setTagsInput(advertisement.tags.join(', '));
      }
      
      if (advertisement.targetAudience && advertisement.targetAudience.interests && Array.isArray(advertisement.targetAudience.interests)) {
        setInterestsInput(advertisement.targetAudience.interests.join(', '));
      }
      
      if (advertisement.targetAudience && advertisement.targetAudience.location && Array.isArray(advertisement.targetAudience.location)) {
        setLocationsInput(advertisement.targetAudience.location.join(', '));
      }
      
      if (advertisement.keywords && Array.isArray(advertisement.keywords)) {
        setKeywordsInput(advertisement.keywords.join(', '));
      }
    }
  }, [advertisement]);
  
  // Gestionnaire de changement pour les champs simples
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    // Gestion des champs imbriqués avec notation dot (ex: content.title)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Gestion des champs normaux
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  // Gestionnaire de changement pour les champs de date
  const handleDateChange = (date, field) => {
    setForm(prev => ({
      ...prev,
      [field]: date
    }));
  };
  
  // Gestionnaire de changement pour les appareils cibles
  const handleDeviceChange = (e) => {
    const { value, checked } = e.target;
    
    if (value === 'all' && checked) {
      // Si "all" est sélectionné, déselectionner les autres
      setForm(prev => ({
        ...prev,
        targetDevice: ['all']
      }));
    } else {
      setForm(prev => {
        let updatedDevices = [...prev.targetDevice];
        
        if (checked) {
          // Ajouter l'appareil sélectionné
          if (!updatedDevices.includes(value)) {
            updatedDevices.push(value);
          }
          // Si un appareil spécifique est sélectionné, retirer "all"
          updatedDevices = updatedDevices.filter(d => d !== 'all');
        } else {
          // Retirer l'appareil désélectionné
          updatedDevices = updatedDevices.filter(d => d !== value);
          
          // Si aucun appareil n'est sélectionné, mettre "all" par défaut
          if (updatedDevices.length === 0) {
            updatedDevices = ['all'];
          }
        }
        
        return {
          ...prev,
          targetDevice: updatedDevices
        };
      });
    }
  };
  
  // Gestionnaire de changement pour le contexte cible
  const handleContextChange = (e) => {
    const { value, checked } = e.target;
    
    if (value === 'all' && checked) {
      // Si "all" est sélectionné, déselectionner les autres
      setForm(prev => ({
        ...prev,
        targetContext: ['all']
      }));
    } else {
      setForm(prev => {
        let updatedContext = [...(prev.targetContext || ['all'])];
        
        if (checked) {
          // Ajouter le contexte sélectionné
          if (!updatedContext.includes(value)) {
            updatedContext.push(value);
          }
          // Si un contexte spécifique est sélectionné, retirer "all"
          updatedContext = updatedContext.filter(c => c !== 'all');
        } else {
          // Retirer le contexte désélectionné
          updatedContext = updatedContext.filter(c => c !== value);
          
          // Si aucun contexte n'est sélectionné, mettre "all" par défaut
          if (updatedContext.length === 0) {
            updatedContext = ['all'];
          }
        }
        
        return {
          ...prev,
          targetContext: updatedContext
        };
      });
    }
  };
  
  // Gestionnaire pour le changement de stratégie de rotation
  const handleRotationStrategyChange = (e) => {
    const { value } = e.target;
    
    setForm(prev => ({
      ...prev,
      rotationSettings: {
        ...prev.rotationSettings,
        strategy: value
      }
    }));
  };
  
  // Gestionnaire de changement pour le genre
  const handleGenderChange = (e) => {
    const { value, checked } = e.target;
    
    setForm(prev => {
      let updatedGenders = [...(prev.targetAudience.gender || [])];
      
      if (checked) {
        // Ajouter le genre sélectionné
        if (!updatedGenders.includes(value)) {
          updatedGenders.push(value);
        }
      } else {
        // Retirer le genre désélectionné
        updatedGenders = updatedGenders.filter(g => g !== value);
      }
      
      return {
        ...prev,
        targetAudience: {
          ...prev.targetAudience,
          gender: updatedGenders
        }
      };
    });
  };
  
  // Gestionnaire pour les tags (séparés par des virgules)
  const handleTagsInputChange = (e) => {
    setTagsInput(e.target.value);
    
    // Convertir la chaîne en tableau
    const tagsArray = e.target.value.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    setForm(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };
  
  const handleKeywordsInputChange = (e) => {
    setKeywordsInput(e.target.value);
    
    // Mettre à jour le formulaire avec les mots-clés
    const keywordsArray = e.target.value
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    
    setForm(prev => ({
      ...prev,
      keywords: keywordsArray
    }));
  };
  
  // Gestionnaire pour les intérêts (séparés par des virgules)
  const handleInterestsInputChange = (e) => {
    setInterestsInput(e.target.value);
    
    // Convertir la chaîne en tableau
    const interestsArray = e.target.value.split(',')
      .map(interest => interest.trim())
      .filter(interest => interest !== '');
    
    setForm(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        interests: interestsArray
      }
    }));
  };
  
  // Gestionnaire pour les localisations (séparés par des virgules)
  const handleLocationsInputChange = (e) => {
    setLocationsInput(e.target.value);
    
    // Convertir la chaîne en tableau
    const locationsArray = e.target.value.split(',')
      .map(location => location.trim())
      .filter(location => location !== '');
    
    setForm(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        location: locationsArray
      }
    }));
  };
  
  // Gestionnaire pour la plage d'âge
  const handleAgeRangeChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseInt(value, 10) || 0;
    
    setForm(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        ageRange: {
          ...prev.targetAudience.ageRange,
          [name]: numericValue
        }
      }
    }));
  };
  
  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formElement = e.currentTarget;
    
    // Validation du formulaire
    if (formElement.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Validation des dates
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      setErrors({
        dateRange: "La date de fin doit être postérieure à la date de début."
      });
      return;
    }
    
    // Préparation des données du formulaire
    const formData = {
      ...form,
      // S'assurer que les mots-clés sont bien formatés
      keywords: keywordsInput
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0),
      
      // S'assurer que les contextes de ciblage sont bien définis
      targetContext: form.targetContext || ['all'],
      
      // S'assurer que les paramètres de rotation sont bien définis
      rotationSettings: {
        frequency: parseInt(form.rotationSettings?.frequency || 15, 10),
        group: form.rotationSettings?.group || 'default',
        strategy: form.rotationSettings?.strategy || 'sequential',
        priority: parseInt(form.rotationSettings?.priority || 1, 10)
      }
    };
    
    // Soumettre le formulaire
    const result = await onSave(formData);
    
    if (result) {
      // Réinitialiser le formulaire en cas de succès
      setForm(defaultAdvertisement);
      setKeywordsInput('');
      setTagsInput('');
      setInterestsInput('');
      setLocationsInput('');
      setValidated(false);
      setErrors({});
    }
  };
  
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Tab.Container defaultActiveKey="basic">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="basic">Informations de base</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="content">Contenu</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="targeting">Ciblage</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="budget">Budget</Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          {/* Onglet: Informations de base */}
          <Tab.Pane eventKey="basic">
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Nom de la publicité *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Le nom est requis
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="isActive" className="mt-4">
                  <Form.Check 
                    type="switch"
                    id="active-switch"
                    label={form.isActive ? "Publicité active (visible sur le site)" : "Publicité inactive (masquée sur le site)"}
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="custom-switch"
                  />
                  <Form.Text className="text-muted">
                    Activez ou désactivez l&apos;affichage de cette publicité sur le site sans changer son statut.
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group controlId="type">
                  <Form.Label>Type *</Form.Label>
                  <Form.Select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="banner">Bannière</option>
                    <option value="popup">Popup</option>
                    <option value="sidebar">Barre latérale</option>
                    <option value="featured">Mis en avant</option>
                    <option value="video">Vidéo</option>
                    <option value="carousel">Carousel</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group controlId="position">
                  <Form.Label>Position *</Form.Label>
                  <Form.Select
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    required
                  >
                    <option value="home">Accueil</option>
                    <option value="shop">Boutique</option>
                    <option value="shop_sidebar">Barre latérale boutique</option>
                    <option value="product">Page produit</option>
                    <option value="product_detail">Détail produit</option>
                    <option value="checkout">Paiement</option>
                    <option value="category">Catégories</option>
                    <option value="blog">Blog</option>
                    <option value="shipping_info">Information livraison</option>
                    <option value="global">Global (toutes pages)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="priority">
                  <Form.Label>Priorité</Form.Label>
                  <Form.Control
                    type="number"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                  <Form.Text className="text-muted">
                    Les valeurs plus élevées sont affichées en priorité
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group controlId="startDate">
                  <Form.Label>Date de début (obligatoire)</Form.Label>
                  <DatePicker
                    selected={form.startDate ? new Date(form.startDate) : new Date()}
                    onChange={date => handleDateChange(date, 'startDate')}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group controlId="endDate">
                  <Form.Label>Date de fin (obligatoire)</Form.Label>
                  <DatePicker
                    selected={form.endDate ? new Date(form.endDate) : new Date()}
                    onChange={date => handleDateChange(date, 'endDate')}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    required
                    minDate={form.startDate ? new Date(form.startDate) : new Date()}
                  />
                  {errors.dateRange && (
                    <div className="text-danger small">{errors.dateRange}</div>
                  )}
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group controlId="status">
                  <Form.Label>Statut</Form.Label>
                  <Form.Select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Brouillon</option>
                    <option value="scheduled">Planifié</option>
                    <option value="active">Actif</option>
                    <option value="paused">En pause</option>
                    <option value="completed">Terminé</option>
                    <option value="archived">Archivé</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="targetUrl">
                  <Form.Label>URL cible *</Form.Label>
                  <Form.Control
                    type="url"
                    name="targetUrl"
                    value={form.targetUrl}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Une URL valide est requise
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group controlId="isActive">
                  <Form.Label>Activer la publicité</Form.Label>
                  <div>
                    <Form.Check
                      type="switch"
                      id="isActiveSwitch"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      label={form.isActive ? "Publicité active" : "Publicité inactive"}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="tags">
                  <Form.Label>Tags (séparés par des virgules)</Form.Label>
                  <Form.Control
                    type="text"
                    value={tagsInput}
                    onChange={handleTagsInputChange}
                    placeholder="promo, soldes, nouveauté..."
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={form.type === 'video' ? 6 : 12}>
                <Form.Group controlId="imageUrl">
                  <Form.Label>URL de l&apos;image {form.type !== 'video' && '*'}</Form.Label>
                  <Form.Control
                    type="url"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    required={form.type !== 'video'}
                  />
                  <Form.Control.Feedback type="invalid">
                    L&apos;URL de l&apos;image est requise pour ce type de publicité
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              {form.type === 'video' && (
                <Col md={6}>
                  <Form.Group controlId="videoUrl">
                    <Form.Label>URL de la vidéo *</Form.Label>
                    <Form.Control
                      type="url"
                      name="videoUrl"
                      value={form.videoUrl}
                      onChange={handleChange}
                      required={form.type === 'video'}
                    />
                    <Form.Control.Feedback type="invalid">
                      L&apos;URL de la vidéo est requise pour les publicités vidéo
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
            </Row>
          </Tab.Pane>
          
          {/* Onglet: Contenu */}
          <Tab.Pane eventKey="content">
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Contenu de la publicité</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="content.title">
                      <Form.Label>Titre</Form.Label>
                      <Form.Control
                        type="text"
                        name="content.title"
                        value={form.content.title}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group controlId="content.subtitle">
                      <Form.Label>Sous-titre</Form.Label>
                      <Form.Control
                        type="text"
                        name="content.subtitle"
                        value={form.content.subtitle}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="content.description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="content.description"
                        value={form.content.description}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="content.callToAction">
                      <Form.Label>Appel à l&apos;action</Form.Label>
                      <Form.Control
                        type="text"
                        name="content.callToAction"
                        value={form.content.callToAction}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group controlId="content.buttonText">
                      <Form.Label>Texte du bouton</Form.Label>
                      <Form.Control
                        type="text"
                        name="content.buttonText"
                        value={form.content.buttonText}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Header>
                <h5 className="mb-0">Dimensions</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="dimensions.width">
                      <Form.Label>Largeur (px)</Form.Label>
                      <Form.Control
                        type="number"
                        name="dimensions.width"
                        value={form.dimensions.width}
                        onChange={handleChange}
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group controlId="dimensions.height">
                      <Form.Label>Hauteur (px)</Form.Label>
                      <Form.Control
                        type="number"
                        name="dimensions.height"
                        value={form.dimensions.height}
                        onChange={handleChange}
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>
          
          {/* Onglet: Ciblage */}
          <Tab.Pane eventKey="targeting">
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Appareils cibles</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group>
                  {['all', 'desktop', 'tablet', 'mobile'].map((device) => (
                    <Form.Check
                      key={device}
                      inline
                      type="checkbox"
                      id={`device-${device}`}
                      label={device === 'all' ? 'Tous les appareils' : device === 'desktop' ? 'Ordinateur' : device === 'tablet' ? 'Tablette' : 'Mobile'}
                      value={device}
                      checked={form.targetDevice.includes(device)}
                      onChange={handleDeviceChange}
                    />
                  ))}
                </Form.Group>
              </Card.Body>
            </Card>
            
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Ciblage contextuel</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-3">Sélectionnez les contextes de pages sur lesquels la publicité doit apparaître:</p>
                <Form.Group>
                  {[
                    ['all', 'Tous les contextes'],
                    ['home', 'Page d&apos;accueil'],
                    ['shop', 'Pages de boutique'],
                    ['product', 'Pages de produits'],
                    ['category', 'Pages de catégories'],
                    ['blog', 'Blog (liste d&apos;articles)'],
                    ['blog_post', 'Articles de blog individuels'],
                    ['cart', 'Panier d&apos;achat'],
                    ['checkout', 'Processus de paiement'],
                    ['account', 'Compte client'],
                    ['shipping', 'Informations de livraison']
                  ].map(([context, label]) => (
                    <Form.Check
                      key={context}
                      inline
                      type="checkbox"
                      id={`context-${context}`}
                      label={label}
                      value={context}
                      checked={(form.targetContext || ['all']).includes(context)}
                      onChange={handleContextChange}
                    />
                  ))}
                </Form.Group>
                
                <Form.Group className="mt-4">
                  <Form.Label>Mots-clés pertinents</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Séparés par des virgules (ex: mode, été, promotion)"
                    value={keywordsInput}
                    onChange={handleKeywordsInputChange}
                  />
                  <Form.Text className="text-muted">
                    Ces mots-clés aideront à cibler l&apos;audience en fonction du contenu consulté.
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>
            
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Paramètres de rotation</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Form.Group controlId="rotationSettings.frequency">
                      <Form.Label>Fréquence de rotation (secondes)</Form.Label>
                      <Form.Control
                        type="number"
                        name="rotationSettings.frequency"
                        value={form.rotationSettings?.frequency || 15}
                        onChange={handleChange}
                        min="5"
                        max="60"
                      />
                      <Form.Text className="text-muted">
                        Temps en secondes avant rotation de la publicité
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group controlId="rotationSettings.rotationGroup">
                      <Form.Label>Groupe de rotation</Form.Label>
                      <Form.Control
                        type="text"
                        name="rotationSettings.group"
                        value={form.rotationSettings?.group || 'default'}
                        onChange={handleChange}
                      />
                      <Form.Text className="text-muted">
                        Regrouper les publicités qui tournent ensemble
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group controlId="rotationSettings.strategy">
                      <Form.Label>Stratégie de rotation</Form.Label>
                      <Form.Select
                        name="rotationSettings.strategy"
                        value={form.rotationSettings?.strategy || 'sequential'}
                        onChange={handleRotationStrategyChange}
                      >
                        <option value="sequential">Séquentielle</option>
                        <option value="random">Aléatoire</option>
                        <option value="balanced">Équilibrée</option>
                        <option value="fixed">Fixe (pas de rotation)</option>
                        <option value="time">Temporelle</option>
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Détermine comment les publicités sont rotées dans leur groupe
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group controlId="rotationSettings.rotationPriority">
                      <Form.Label>Priorité de rotation</Form.Label>
                      <Form.Control
                        type="number"
                        name="rotationSettings.priority"
                        value={form.rotationSettings?.priority || 1}
                        onChange={handleChange}
                        min="0"
                        max="10"
                      />
                      <Form.Text className="text-muted">
                        Plus la valeur est élevée, plus la publicité apparaît fréquemment (0-10)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Header>
                <h5 className="mb-0">Audience cible</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Plage d&apos;âge</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>De</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="min"
                        value={form.targetAudience.ageRange.min}
                        onChange={handleAgeRangeChange}
                        min="0"
                        max="100"
                      />
                      <InputGroup.Text>à</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="max"
                        value={form.targetAudience.ageRange.max}
                        onChange={handleAgeRangeChange}
                        min="0"
                        max="100"
                      />
                      <InputGroup.Text>ans</InputGroup.Text>
                    </InputGroup>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Label>Genre</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        onChange={handleGenderChange}
                      />
                    </div>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="interests">
                      <Form.Label>Centres d&apos;intérêt (séparés par des virgules)</Form.Label>
                      <Form.Control
                        type="text"
                        value={interestsInput}
                        onChange={handleInterestsInputChange}
                        placeholder="technologie, mode, sport..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="locations">
                      <Form.Label>Localisations (séparées par des virgules)</Form.Label>
                      <Form.Control
                        type="text"
                        value={locationsInput}
                        onChange={handleLocationsInputChange}
                        placeholder="France, Paris, Europe..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>
          
          {/* Onglet: Budget */}
          <Tab.Pane eventKey="budget">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Budget et dépenses</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="budget.total">
                      <Form.Label>Budget total</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          name="budget.total"
                          value={form.budget.total}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                        />
                        <InputGroup.Text>€</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group controlId="budget.spent">
                      <Form.Label>Montant dépensé</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          name="budget.spent"
                          value={form.budget.spent}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          readOnly={!advertisement} // Lecture seule si création
                        />
                        <InputGroup.Text>€</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      
      <div className="d-flex justify-content-end mt-4">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Annuler
        </Button>
        <Button variant="primary" type="submit">
          Enregistrer
        </Button>
      </div>
    </Form>
  );
};

export default AdvertisementForm;
