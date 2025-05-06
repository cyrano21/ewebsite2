import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/PageHeader';

export default function AdminSettingsPage() {
  const [siteSettings, setSiteSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    address: '',
    phone: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    },
    currency: 'EUR',
    language: 'fr'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: false,
    paypalEnabled: true,
    stripePK: '',
    stripeSK: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAttempts: 5
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  useEffect(() => {
    // Charger les paramètres depuis l'API Next.js
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data) return;
        const { site = {}, payment = {}, security = {} } = data;
        setSiteSettings(site);
        setPaymentSettings(payment);
        setSecuritySettings(security);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des paramètres:', error);
        showErrorAlert('Erreur lors du chargement des paramètres');
      });
  }, []);

  const handleSiteSettingsChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSiteSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSiteSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePaymentSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentSettings({
      ...paymentSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSecuritySettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSiteSettingsSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ site: siteSettings, payment: paymentSettings, security: securitySettings }),
      });
      
      if (response.ok) {
        showSuccessAlert('Paramètres généraux sauvegardés avec succès !');
      } else {
        const errorData = await response.json();
        showErrorAlert(errorData.message || 'Erreur lors de la sauvegarde des paramètres');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showErrorAlert('Erreur de connexion au serveur');
    }
  };

  const handlePaymentSettingsSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ site: siteSettings, payment: paymentSettings, security: securitySettings }),
      });
      
      if (response.ok) {
        showSuccessAlert('Paramètres de paiement sauvegardés avec succès !');
      } else {
        const errorData = await response.json();
        showErrorAlert(errorData.message || 'Erreur lors de la sauvegarde des paramètres');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showErrorAlert('Erreur de connexion au serveur');
    }
  };

  const handleSecuritySettingsSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ site: siteSettings, payment: paymentSettings, security: securitySettings }),
      });
      
      if (response.ok) {
        showSuccessAlert('Paramètres de sécurité sauvegardés avec succès !');
      } else {
        const errorData = await response.json();
        showErrorAlert(errorData.message || 'Erreur lors de la sauvegarde des paramètres');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showErrorAlert('Erreur de connexion au serveur');
    }
  };

  const showSuccessAlert = (message) => {
    setAlertVariant('success');
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const showErrorAlert = (message) => {
    setAlertVariant('danger');
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <AdminLayout>
      <PageHeader title="Paramètres" curPage="Admin / Paramètres" />
      
      <Container fluid className="py-4">
        {showAlert && (
          <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}

        <Tabs defaultActiveKey="general" className="mb-4">
          <Tab eventKey="general" title="Paramètres généraux">
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={handleSiteSettingsSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nom du site</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="siteName" 
                          value={siteSettings.siteName} 
                          onChange={handleSiteSettingsChange} 
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email de contact</Form.Label>
                        <Form.Control 
                          type="email" 
                          name="contactEmail" 
                          value={siteSettings.contactEmail} 
                          onChange={handleSiteSettingsChange} 
                          required 
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Description du site</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      name="siteDescription" 
                      value={siteSettings.siteDescription} 
                      onChange={handleSiteSettingsChange} 
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Adresse</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={siteSettings.address}
                          onChange={handleSiteSettingsChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={siteSettings.phone}
                          onChange={handleSiteSettingsChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Devise</Form.Label>
                        <Form.Select 
                          name="currency" 
                          value={siteSettings.currency} 
                          onChange={handleSiteSettingsChange}
                        >
                          <option value="EUR">Euro (€)</option>
                          <option value="USD">Dollar américain ($)</option>
                          <option value="GBP">Livre sterling (£)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Langue par défaut</Form.Label>
                        <Form.Select 
                          name="language" 
                          value={siteSettings.language} 
                          onChange={handleSiteSettingsChange}
                        >
                          <option value="fr">Français</option>
                          <option value="en">Anglais</option>
                          <option value="es">Espagnol</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <h5 className="mt-4">Liens sociaux</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Facebook</Form.Label>
                        <Form.Control
                          type="url"
                          name="socialLinks.facebook"
                          value={siteSettings.socialLinks.facebook}
                          onChange={handleSiteSettingsChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Twitter</Form.Label>
                        <Form.Control
                          type="url"
                          name="socialLinks.twitter"
                          value={siteSettings.socialLinks.twitter}
                          onChange={handleSiteSettingsChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Instagram</Form.Label>
                        <Form.Control
                          type="url"
                          name="socialLinks.instagram"
                          value={siteSettings.socialLinks.instagram}
                          onChange={handleSiteSettingsChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>LinkedIn</Form.Label>
                        <Form.Control
                          type="url"
                          name="socialLinks.linkedin"
                          value={siteSettings.socialLinks.linkedin}
                          onChange={handleSiteSettingsChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>YouTube</Form.Label>
                        <Form.Control
                          type="url"
                          name="socialLinks.youtube"
                          value={siteSettings.socialLinks.youtube}
                          onChange={handleSiteSettingsChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="text-end">
                    <Button type="submit" variant="primary">Enregistrer les paramètres</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="payment" title="Paiement">
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={handlePaymentSettingsSubmit}>
                  <h5 className="mb-4">Méthodes de paiement</h5>
                  
                  <Form.Group className="mb-4">
                    <Form.Check 
                      type="switch"
                      id="paypal-toggle"
                      label="Activer PayPal"
                      name="paypalEnabled"
                      checked={paymentSettings.paypalEnabled}
                      onChange={handlePaymentSettingsChange}
                    />
                    <div className="ms-4 mt-2">
                      <small className="text-muted">
                        Permet aux clients de payer avec PayPal. Pour configurer PayPal, vous devez avoir un compte Business.
                      </small>
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Check 
                      type="switch"
                      id="stripe-toggle"
                      label="Activer Stripe"
                      name="stripeEnabled"
                      checked={paymentSettings.stripeEnabled}
                      onChange={handlePaymentSettingsChange}
                    />
                    
                    {paymentSettings.stripeEnabled && (
                      <div className="ms-4 mt-3">
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Clé publique Stripe</Form.Label>
                              <Form.Control 
                                type="text" 
                                name="stripePK" 
                                value={paymentSettings.stripePK} 
                                onChange={handlePaymentSettingsChange} 
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Clé secrète Stripe</Form.Label>
                              <Form.Control 
                                type="password" 
                                name="stripeSK" 
                                value={paymentSettings.stripeSK} 
                                onChange={handlePaymentSettingsChange} 
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <small className="text-muted">
                          Vous pouvez trouver vos clés API Stripe dans le tableau de bord de votre compte Stripe.
                        </small>
                      </div>
                    )}
                  </Form.Group>
                  
                  <div className="text-end">
                    <Button type="submit" variant="primary">Enregistrer les paramètres</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="security" title="Sécurité">
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={handleSecuritySettingsSubmit}>
                  <h5 className="mb-4">Paramètres de sécurité</h5>
                  
                  <Form.Group className="mb-4">
                    <Form.Check 
                      type="switch"
                      id="2fa-toggle"
                      label="Activer l'authentification à deux facteurs (2FA)"
                      name="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onChange={handleSecuritySettingsChange}
                    />
                    <div className="ms-4 mt-2">
                      <small className="text-muted">
                        Renforce la sécurité en exigeant une vérification supplémentaire lors de la connexion.
                      </small>
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Nombre maximal de tentatives de connexion</Form.Label>
                    <Form.Control 
                      type="number" 
                      min="1" 
                      max="10"
                      name="loginAttempts" 
                      value={securitySettings.loginAttempts} 
                      onChange={handleSecuritySettingsChange} 
                    />
                    <Form.Text className="text-muted">
                      Le compte sera temporairement verrouillé après ce nombre de tentatives échouées.
                    </Form.Text>
                  </Form.Group>
                  
                  <div className="text-end">
                    <Button type="submit" variant="primary">Enregistrer les paramètres</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </AdminLayout>
  );
}
