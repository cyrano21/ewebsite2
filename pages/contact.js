import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [siteSettings, setSiteSettings] = useState({ address: "", contactEmail: "", phone: "", socialLinks: {} });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => { if (data?.site) setSiteSettings(data.site); })
      .catch(err => console.error('Settings fetch failed:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur');

      // Réinitialiser le formulaire après soumission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setFormSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de l'envoi du formulaire:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <PageHeader title={"Contactez-nous"} curPage={"Contact"} />
      {error && <Alert variant="danger">{error}</Alert>}
      {formSubmitted && <Alert variant="success">Votre message a été envoyé avec succès !</Alert>}

      <section className="contact-section padding-tb section-bg">
        <Container>
          <Row className="justify-content-center">
            <Col lg={12} className="mb-5">
              <div className="contact-header text-center">
                <h2 className="mb-3">
                  Besoin d'aide? N'hésitez pas à nous contacter
                </h2>
                <p className="lead">
                  Notre équipe est à votre disposition pour répondre à toutes
                  vos questions
                </p>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={5} md={12} className="mb-5 mb-lg-0">
              <Card className="contact-info-card h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Informations de contact</h4>

                  <div className="info-item d-flex mb-4">
                    <div className="info-icon me-3">
                      <i className="icofont-location-pin fs-4 text-primary"></i>
                    </div>
                    <div className="info-content">
                      <h5 className="mb-1">Notre adresse</h5>
                      <p className="mb-0">{siteSettings.address}</p>
                    </div>
                  </div>

                  <div className="info-item d-flex mb-4">
                    <div className="info-icon me-3">
                      <i className="icofont-envelope fs-4 text-primary"></i>
                    </div>
                    <div className="info-content">
                      <h5 className="mb-1">Email</h5>
                      <p className="mb-0">{siteSettings.contactEmail}</p>
                    </div>
                  </div>

                  <div className="info-item d-flex mb-4">
                    <div className="info-icon me-3">
                      <i className="icofont-phone fs-4 text-primary"></i>
                    </div>
                    <div className="info-content">
                      <h5 className="mb-1">Téléphone</h5>
                      <p className="mb-0">{siteSettings.phone}</p>
                    </div>
                  </div>

                  <div className="info-item d-flex">
                    <div className="info-icon me-3">
                      <i className="icofont-clock-time fs-4 text-primary"></i>
                    </div>
                    <div className="info-content">
                      <h5 className="mb-1">Heures d'ouverture</h5>
                      <p className="mb-0">Lun - Ven: 9h00 - 18h00</p>
                      <p className="mb-0">Sam: 10h00 - 15h00</p>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="social-links">
                    <h5 className="mb-3">Suivez-nous</h5>
                    <div className="d-flex">
                      {siteSettings.socialLinks.facebook && (
                        <a href={siteSettings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link me-2">
                          <i className="icofont-facebook"></i>
                        </a>
                      )}
                      {siteSettings.socialLinks.twitter && (
                        <a href={siteSettings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link me-2">
                          <i className="icofont-twitter"></i>
                        </a>
                      )}
                      {siteSettings.socialLinks.instagram && (
                        <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link me-2">
                          <i className="icofont-instagram"></i>
                        </a>
                      )}
                      {siteSettings.socialLinks.linkedin && (
                        <a href={siteSettings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link me-2">
                          <i className="icofont-linkedin"></i>
                        </a>
                      )}
                      {siteSettings.socialLinks.youtube && (
                        <a href={siteSettings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="social-link">
                          <i className="icofont-youtube"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={7} md={12}>
              <Card className="contact-form-card border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Envoyez-nous un message</h4>

                  {formSubmitted ? (
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <i className="icofont-check-circled text-success display-1"></i>
                      </div>
                      <h4 className="mb-3">
                        Votre message a été envoyé avec succès !
                      </h4>
                      <p className="mb-4">
                        Nous vous répondrons dans les plus brefs délais.
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => setFormSubmitted(false)}
                      >
                        Envoyer un autre message
                      </Button>
                    </div>
                  ) : (
                    <Form onSubmit={handleSubmit}>
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Nom complet *</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Votre nom"
                              required
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Votre email"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Sujet *</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Sujet de votre message"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Message *</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Votre message"
                          rows={5}
                          required
                        />
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        className="btn-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Envoi en cours...
                          </>
                        ) : (
                          "Envoyer le message"
                        )}
                      </Button>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="map-section">
        <div className="map-container">
          {/* Remplacer le composant GoogleMap manquant par une iframe Google Maps */}
          <div
            className="google-map"
            style={{ width: "100%", height: "450px" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.95410647372!2d2.2646349499999997!3d48.85893305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sfr!2sfr!4v1682162290899!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            ></iframe>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page .contact-section {
          padding: 80px 0;
        }
        .contact-page .section-bg {
          background-color: #f8f9fa;
        }
        .contact-page .contact-info-card,
        .contact-page .contact-form-card {
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .contact-page .contact-info-card:hover,
        .contact-page .contact-form-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
        }
        .contact-page .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          background-color: #f0f0f0;
          border-radius: 50%;
          color: #333;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .contact-page .social-link:hover {
          background-color: #007bff;
          color: white;
        }
        .contact-page .map-container {
          overflow: hidden;
          padding-bottom: 0;
          position: relative;
          height: 450px;
        }
        .contact-page .info-icon {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 123, 255, 0.1);
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default function ContactPage() {
  return (
    <Layout>
      <Contact />
    </Layout>
  );
}
