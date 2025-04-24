import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tab,
  Tabs,
  Badge,
} from "react-bootstrap";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/PageHeader";
import { AuthContext } from "../../contexts/AuthProvider";

export default function AdminProfilePage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@example.com",
    phone: "01 23 45 67 89",
    role: "Administrateur",
    joinDate: "01/01/2023",
    avatar: "A",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    // Si l'utilsateur est connecté, récupérer ses informations depuis l'API
    if (user && user._id) {
      fetch(`/api/users/${user._id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setProfile((prevProfile) => ({
              ...prevProfile,
              name: data.name || prevProfile.name,
              email: data.email || prevProfile.email,
              avatar: data.name ? data.name.charAt(0).toUpperCase() : "A",
              // Autres champs selon la structure de vos données utilisateur
            }));
          }
        })
        .catch((error) => {
          console.error("Erreur lors du chargement du profil:", error);
        });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData({
      ...securityData,
      [name]: value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      // Appel à l'API Next.js pour mettre à jour le profil
      if (user) {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        });

        if (response.ok) {
          showSuccessAlert("Profil mis à jour avec succès");
        } else {
          const errorData = await response.json();
          showErrorAlert(
            errorData.message || "Erreur lors de la mise à jour du profil"
          );
        }
      }
    } catch (error) {
      showErrorAlert("Erreur de connexion au serveur");
      console.error(error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Vérification que les mots de passe correspondent
    if (securityData.newPassword !== securityData.confirmPassword) {
      showErrorAlert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      // Appel à l'API Next.js pour mettre à jour le mot de passe
      if (user) {
        const response = await fetch(`/api/auth/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            currentPassword: securityData.currentPassword,
            newPassword: securityData.newPassword,
          }),
        });

        if (response.ok) {
          setSecurityData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          showSuccessAlert("Mot de passe mis à jour avec succès");
        } else {
          const errorData = await response.json();
          showErrorAlert(
            errorData.message || "Erreur lors de la mise à jour du mot de passe"
          );
        }
      }
    } catch (error) {
      showErrorAlert("Erreur de connexion au serveur");
      console.error(error);
    }
  };

  const showSuccessAlert = (message) => {
    setAlertVariant("success");
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const showErrorAlert = (message) => {
    setAlertVariant("danger");
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <AdminLayout>
      <PageHeader title="Mon Profil" curPage="Admin / Profil" />

      <Container fluid className="py-4">
        {showAlert && (
          <Alert
            variant={alertVariant}
            onClose={() => setShowAlert(false)}
            dismissible
          >
            {alertMessage}
          </Alert>
        )}

        <Row>
          <Col lg={4} md={5} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <div
                  className="mb-4 position-relative mx-auto"
                  style={{ width: "120px" }}
                >
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: "120px", height: "120px" }}
                  >
                    <span
                      className="text-white fw-bold"
                      style={{ fontSize: "48px" }}
                    >
                      {profile.avatar}
                    </span>
                  </div>
                  <Button
                    variant="light"
                    size="sm"
                    className="position-absolute bottom-0 end-0 rounded-circle shadow-sm"
                    style={{ width: "35px", height: "35px" }}
                  >
                    <i className="icofont-camera"></i>
                  </Button>
                </div>

                <h4 className="fw-bold">{profile.name}</h4>
                <p className="text-muted mb-4">{profile.role}</p>

                <div className="d-flex justify-content-center mb-3">
                  <Badge bg="success" className="me-2">
                    Actif
                  </Badge>
                  <Badge bg="primary">Staff</Badge>
                </div>

                <div className="d-flex justify-content-between border-top pt-3">
                  <div className="text-center px-3">
                    <div className="fw-bold">125</div>
                    <small className="text-muted">Produits</small>
                  </div>
                  <div className="text-center px-3 border-start border-end">
                    <div className="fw-bold">43</div>
                    <small className="text-muted">Commandes</small>
                  </div>
                  <div className="text-center px-3">
                    <div className="fw-bold">18</div>
                    <small className="text-muted">Articles</small>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm mt-4">
              <Card.Body>
                <h5 className="fw-bold mb-3">Informations de Contact</h5>
                <div className="mb-3">
                  <small className="text-muted d-block">Email</small>
                  <div>{profile.email}</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Téléphone</small>
                  <div>{profile.phone}</div>
                </div>
                <div>
                  <small className="text-muted d-block">
                    Date d&apos;inscription
                  </small>
                  <div>{profile.joinDate}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8} md={7}>
            <Card className="shadow-sm">
              <Card.Body>
                <Tabs defaultActiveKey="profile" className="mb-4">
                  <Tab eventKey="profile" title="Profil">
                    <Form onSubmit={handleProfileSubmit}>
                      <h5 className="fw-bold mb-4">
                        Informations Personnelles
                      </h5>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={profile.name}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={profile.email}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Téléphone</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={profile.phone}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Rôle</Form.Label>
                            <Form.Control
                              type="text"
                              name="role"
                              value={profile.role}
                              onChange={handleProfileChange}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button type="submit" variant="primary">
                        Enregistrer les modifications
                      </Button>
                    </Form>
                  </Tab>

                  <Tab eventKey="security" title="Sécurité">
                    <Form onSubmit={handlePasswordSubmit}>
                      <h5 className="fw-bold mb-4">
                        Modification du Mot de Passe
                      </h5>
                      <Form.Group className="mb-3">
                        <Form.Label>Mot de passe actuel</Form.Label>
                        <Form.Control
                          type="password"
                          name="currentPassword"
                          value={securityData.currentPassword}
                          onChange={handleSecurityChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={securityData.newPassword}
                          onChange={handleSecurityChange}
                          required
                          minLength={8}
                        />
                        <Form.Text className="text-muted">
                          Le mot de passe doit contenir au moins 8 caractères.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Confirmer le nouveau mot de passe
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={securityData.confirmPassword}
                          onChange={handleSecurityChange}
                          required
                        />
                      </Form.Group>
                      <Button type="submit" variant="primary">
                        Mettre à jour le mot de passe
                      </Button>
                    </Form>
                  </Tab>

                  <Tab eventKey="notifications" title="Notifications">
                    <h5 className="fw-bold mb-4">Paramètres de Notification</h5>
                    <Form>
                      <div className="mb-4">
                        <h6 className="fw-bold">Email</h6>
                        <Form.Check
                          type="switch"
                          id="email-orders"
                          label="Nouvelles commandes"
                          defaultChecked
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          id="email-comments"
                          label="Nouveaux commentaires"
                          defaultChecked
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          id="email-products"
                          label="Alertes de stock"
                          className="mb-2"
                        />
                      </div>

                      <div>
                        <h6 className="fw-bold">Application</h6>
                        <Form.Check
                          type="switch"
                          id="app-orders"
                          label="Nouvelles commandes"
                          defaultChecked
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          id="app-comments"
                          label="Nouveaux commentaires"
                          defaultChecked
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          id="app-products"
                          label="Alertes de stock"
                          defaultChecked
                          className="mb-2"
                        />
                      </div>
                      <Button variant="primary" className="mt-3">
                        Enregistrer les préférences
                      </Button>
                    </Form>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  );
}
