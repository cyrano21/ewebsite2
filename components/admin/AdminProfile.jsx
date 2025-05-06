"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs, Badge } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Admin',
    email: 'admin@example.com',
    phone: '01 23 45 67 89',
    role: 'Administrateur',
    joinDate: '01/01/2023',
    avatar: 'A'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData({
      ...securityData,
      [name]: value
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Ici vous intégreriez la logique de mise à jour du profil
    showSuccessAlert('Profil mis à jour avec succès');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Vérification que les mots de passe correspondent
    if (securityData.newPassword !== securityData.confirmPassword) {
      showErrorAlert('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Ici vous intégreriez la logique de mise à jour du mot de passe
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    showSuccessAlert('Mot de passe mis à jour avec succès');
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
    <div>
      <PageHeader title="Mon Profil" curPage="Admin / Profil" />
      
      <Container fluid className="py-4">
        {showAlert && (
          <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}
        
        <Row>
          <Col lg={4} md={5} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <div className="mb-4 position-relative mx-auto" style={{width: '120px'}}>
                  <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto" style={{width: '120px', height: '120px'}}>
                    <span className="text-white fw-bold" style={{fontSize: '48px'}}>{profile.avatar}</span>
                  </div>
                  <Button variant="light" size="sm" className="position-absolute bottom-0 end-0 rounded-circle shadow-sm" style={{width: '35px', height: '35px'}}>
                    <i className="icofont-camera"></i>
                  </Button>
                </div>
                <h4 className="mb-1">{profile.name}</h4>
                <p className="text-muted">{profile.role}</p>
                <div className="d-flex justify-content-center my-3">
                  <Badge bg="success" className="mx-1 py-2 px-3">
                    <i className="icofont-check-circled me-1"></i> Vérifié
                  </Badge>
                  <Badge bg="primary" className="mx-1 py-2 px-3">
                    <i className="icofont-shield me-1"></i> Admin
                  </Badge>
                </div>
                <hr />
                <div className="text-start">
                  <p className="mb-1"><i className="icofont-envelope me-2 text-muted"></i> {profile.email}</p>
                  <p className="mb-1"><i className="icofont-phone me-2 text-muted"></i> {profile.phone}</p>
                  <p className="mb-0"><i className="icofont-calendar me-2 text-muted"></i> Membre depuis {profile.joinDate}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={8} md={7}>
            <Tabs defaultActiveKey="profile" className="mb-4">
              <Tab eventKey="profile" title="Informations Personnelles">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Form onSubmit={handleProfileSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nom complet</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="name" 
                              value={profile.name}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Rôle</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={profile.role}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                              type="email" 
                              name="email" 
                              value={profile.email}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Téléphone</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="phone" 
                              value={profile.phone}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Button variant="primary" type="submit">
                        Mettre à jour le profil
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="security" title="Sécurité">
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-4">Changer le mot de passe</h5>
                    <Form onSubmit={handlePasswordSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mot de passe actuel</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="currentPassword" 
                          value={securityData.currentPassword}
                          onChange={handleSecurityChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="newPassword" 
                          value={securityData.newPassword}
                          onChange={handleSecurityChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="confirmPassword" 
                          value={securityData.confirmPassword}
                          onChange={handleSecurityChange}
                        />
                      </Form.Group>
                      
                      <Button variant="primary" type="submit">
                        Mettre à jour le mot de passe
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="preferences" title="Préférences">
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-4">Préférences de notification</h5>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Check 
                          type="switch"
                          id="notification-email"
                          label="Recevoir des notifications par email"
                          defaultChecked
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check 
                          type="switch"
                          id="notification-system"
                          label="Notifications système"
                          defaultChecked
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check 
                          type="switch"
                          id="notification-order"
                          label="Notifier pour les nouvelles commandes"
                          defaultChecked
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check 
                          type="switch"
                          id="notification-product"
                          label="Alertes de stock faible"
                          defaultChecked
                        />
                      </Form.Group>
                      
                      <Button variant="primary" type="submit">
                        Enregistrer les préférences
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminProfile;
