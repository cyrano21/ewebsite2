import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';

const AdminSettings = () => {
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'E-Commerce Store',
    siteDescription: 'Votre boutique en ligne de référence',
    contactEmail: 'contact@ecommerce.com',
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

  const handleSiteSettingsSubmit = (e) => {
    e.preventDefault();
    // Logique de sauvegarde des paramètres
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div>
      <PageHeader title="Paramètres" curPage="Admin / Paramètres" />
      
      <Container fluid className="py-4">
        {showAlert && (
          <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
            Paramètres sauvegardés avec succès !
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
                          value={siteSettings.siteName}
                          onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email de contact</Form.Label>
                        <Form.Control 
                          type="email" 
                          value={siteSettings.contactEmail}
                          onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Description du site</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      value={siteSettings.siteDescription}
                      onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Devise</Form.Label>
                        <Form.Select 
                          value={siteSettings.currency}
                          onChange={(e) => setSiteSettings({...siteSettings, currency: e.target.value})}
                        >
                          <option value="EUR">€ Euro</option>
                          <option value="USD">$ Dollar</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Langue</Form.Label>
                        <Form.Select 
                          value={siteSettings.language}
                          onChange={(e) => setSiteSettings({...siteSettings, language: e.target.value})}
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="primary" type="submit">
                    Enregistrer les modifications
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="payment" title="Paiements">
            <Card className="shadow-sm">
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      label="Activer PayPal"
                      checked={paymentSettings.paypalEnabled}
                      onChange={() => setPaymentSettings({...paymentSettings, paypalEnabled: !paymentSettings.paypalEnabled})}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      label="Activer Stripe"
                      checked={paymentSettings.stripeEnabled}
                      onChange={() => setPaymentSettings({...paymentSettings, stripeEnabled: !paymentSettings.stripeEnabled})}
                    />
                  </Form.Group>

                  {paymentSettings.stripeEnabled && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Clé publique Stripe</Form.Label>
                        <Form.Control type="text" placeholder="Entrez votre clé publique Stripe" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Clé secrète Stripe</Form.Label>
                        <Form.Control type="password" placeholder="Entrez votre clé secrète Stripe" />
                      </Form.Group>
                    </>
                  )}

                  <Button variant="primary">Enregistrer</Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="security" title="Sécurité">
            <Card className="shadow-sm">
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      label="Authentification à deux facteurs"
                      checked={securitySettings.twoFactorAuth}
                      onChange={() => setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth})}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nombre max de tentatives de connexion</Form.Label>
                    <Form.Control 
                      type="number" 
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: parseInt(e.target.value)})}
                      min="3" 
                      max="10"
                    />
                  </Form.Group>

                  <Button variant="primary">Enregistrer</Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default AdminSettings;
