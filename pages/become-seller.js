import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import PageHeader from "../components/PageHeader";
import Layout from "../components/Layout";
import DropshippingInfo from '../components/seller/DropshippingInfo';

const BecomeSeller = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    taxId: "",
    street: "",
    city: "",
    country: "",
    postalCode: "",
    bankName: "",
    accountHolder: "",
    iban: "",
    swift: "",
    category: "",
    termsAccepted: false,
  });
  const [logo, setLogo] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [logoPreview, setLogoPreview] = useState("");
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Préremplir l'email si l'utilisateur est connecté
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        contactEmail: session.user.email || '',
      }));
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!session) {
      setError("Vous devez être connecté pour soumettre une demande");
      return;
    }

    if (documents.length === 0) {
      setError("Veuillez télécharger au moins un document de vérification");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Préparer le formulaire avec les fichiers
      const formDataToSubmit = new FormData();
      
      // Ajouter toutes les données du formulaire
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSubmit.append(key, formData[key]);
        }
      });
      
      // Ajouter le logo s'il existe
      if (logo) {
        formDataToSubmit.append('logo', logo);
      }
      
      // Ajouter les documents
      documents.forEach(doc => {
        formDataToSubmit.append('documents', doc);
      });
      
      // Envoyer la requête
      const response = await fetch('/api/sellers/register', {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        window.scrollTo(0, 0);
      } else {
        setError(data.message || "Une erreur est survenue lors de l'envoi de votre demande");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setError("Une erreur est survenue lors de l'envoi de votre demande");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Options pour le menu déroulant des catégories
  const categoryOptions = [
    "Électronique",
    "Mode et Vêtements",
    "Maison et Jardin",
    "Santé et Beauté",
    "Sports et Loisirs",
    "Jouets et Jeux",
    "Alimentation",
    "Automobile",
    "Artisanat",
    "Autre",
  ];

  // Données pour les avantages
  const sellerBenefits = [
    {
      icon: "icofont-money-bag",
      title: "Revenus supplémentaires",
      description: "Transformez votre passion en source de revenus complémentaires.",
    },
    {
      icon: "icofont-globe-alt",
      title: "Visibilité mondiale",
      description: "Accédez à des clients du monde entier grâce à notre plateforme.",
    },
    {
      icon: "icofont-dashboard-web",
      title: "Tableau de bord intuitif",
      description: "Gérez facilement vos produits, commandes et clients.",
    },
    {
      icon: "icofont-chart-growth",
      title: "Outils de croissance",
      description: "Augmentez vos ventes grâce à nos outils marketing intégrés.",
    },
    {
      icon: "icofont-support",
      title: "Support dédié",
      description: "Profitez d'un support personnalisé pour développer votre boutique.",
    },
    {
      icon: "icofont-money",
      title: "Commissions compétitives",
      description: "Bénéficiez de nos taux de commission parmi les plus bas du marché.",
    },
  ];

  // Données pour les étapes
  const sellerSteps = [
    {
      number: "01",
      title: "Inscription",
      description: "Remplissez le formulaire d'inscription avec les informations de votre boutique.",
    },
    {
      number: "02",
      title: "Vérification",
      description: "Notre équipe vérifie les informations fournies et approuve votre boutique.",
    },
    {
      number: "03",
      title: "Configuration",
      description: "Configurez les détails de votre boutique et ajoutez vos premiers produits.",
    },
    {
      number: "04",
      title: "Lancement",
      description: "Publiez votre boutique et commencez à vendre vos produits sur notre plateforme !",
    },
  ];

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (status === 'unauthenticated') {
    return (
      <Layout>
        <PageHeader title="Devenir Vendeur" curPage="Devenir Vendeur" />
        <Container className="py-5">
          <Alert variant="warning">
            <Alert.Heading>Connexion requise</Alert.Heading>
            <p>Vous devez être connecté pour soumettre une demande de vendeur.</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button variant="outline-primary" onClick={() => router.push('/login?redirect=/become-seller')}>
                Se connecter
              </Button>
            </div>
          </Alert>
        </Container>
      </Layout>
    );
  }

  // Afficher un chargement pendant la vérification de la session
  if (status === 'loading') {
    return (
      <Layout>
        <PageHeader title="Devenir Vendeur" curPage="Devenir Vendeur" />
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title="Devenir Vendeur" curPage="Devenir Vendeur" />

      {/* Section Hero */}
      <section className="seller-hero py-5 bg-primary text-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">Développez votre activité avec nous</h1>
              <p className="lead mb-4">
                Rejoignez notre marketplace et vendez vos produits à des milliers de clients.
                Lancez votre boutique en ligne en quelques étapes simples.
              </p>
              <a href="#seller-form" className="btn btn-light btn-lg">
                Commencer maintenant
              </a>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src="/assets/images/shop/01.jpg"
                alt="Devenir vendeur"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "350px" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Section Avantages */}
      <section className="seller-benefits py-5">
        <Container>
          <Row className="mb-5 text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="fw-bold mb-3">Pourquoi devenir vendeur chez nous ?</h2>
              <p className="text-muted">
                Découvrez les nombreux avantages de rejoindre notre plateforme de vente en ligne.
              </p>
            </Col>
          </Row>
          <Row>
            {sellerBenefits.map((benefit, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card className="h-100 seller-benefit-card border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="benefit-icon mb-3">
                      <i className={benefit.icon}></i>
                    </div>
                    <Card.Title className="fw-bold">{benefit.title}</Card.Title>
                    <Card.Text className="text-muted">{benefit.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Section Étapes */}
      <section className="seller-steps py-5 bg-light">
        <Container>
          <Row className="mb-5 text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="fw-bold mb-3">Comment ça marche</h2>
              <p className="text-muted">
                Suivez ces étapes simples pour commencer à vendre sur notre plateforme.
              </p>
            </Col>
          </Row>
          <Row>
            {sellerSteps.map((step, index) => (
              <Col md={3} key={index} className="mb-4">
                <div className="step-card text-center">
                  <div className="step-number mb-3">{step.number}</div>
                  <h4 className="fw-bold">{step.title}</h4>
                  <p className="text-muted">{step.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Section Formulaire */}
      <section id="seller-form" className="py-5">
        <Container>
          <Row className="mb-4 text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="fw-bold mb-3">Inscrivez-vous comme vendeur</h2>
              <p className="text-muted">
                Remplissez ce formulaire pour commencer votre parcours de vendeur sur notre plateforme.
              </p>
            </Col>
          </Row>
          
          {success ? (
            <Row>
              <Col lg={8} className="mx-auto">
                <Alert variant="success">
                  <Alert.Heading>Demande soumise avec succès!</Alert.Heading>
                  <p>
                    Votre demande pour devenir vendeur a été soumise avec succès. 
                    Notre équipe va examiner votre demande et vous contactera sous peu.
                    Vous pouvez suivre l'état de votre demande dans votre tableau de bord.
                  </p>
                  <hr />
                  <div className="d-flex justify-content-end">
                    <Button variant="outline-success" onClick={() => router.push('/account')}>
                      Aller à mon compte
                    </Button>
                  </div>
                </Alert>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col lg={10} className="mx-auto">
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError("")}>
                    {error}
                  </Alert>
                )}
                
                <Card className="border-0 shadow">
                  <Card.Body className="p-4 p-lg-5">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                      <h4 className="mb-4">Informations sur la boutique</h4>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nom de l'entreprise *</Form.Label>
                            <Form.Control
                              type="text"
                              name="businessName"
                              value={formData.businessName}
                              onChange={handleInputChange}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Veuillez entrer le nom de votre entreprise.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Identifiant fiscal (SIRET/TVA)</Form.Label>
                            <Form.Control
                              type="text"
                              name="taxId"
                              value={formData.taxId}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Description de l'entreprise *</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="businessDescription"
                          value={formData.businessDescription}
                          onChange={handleInputChange}
                          rows={3}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Veuillez décrire votre entreprise.
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Catégorie principale *</Form.Label>
                            <Form.Select
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Sélectionnez une catégorie</option>
                              {categoryOptions.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Veuillez sélectionner une catégorie.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Logo de l'entreprise</Form.Label>
                            <Form.Control
                              type="file"
                              name="logo"
                              accept="image/*"
                              onChange={handleLogoChange}
                            />
                            <Form.Text className="text-muted">
                              Formats recommandés: JPG, PNG. Max 2MB
                            </Form.Text>
                          </Form.Group>
                          
                          {logoPreview && (
                            <div className="mt-2 text-center">
                              <img 
                                src={logoPreview} 
                                alt="Logo preview" 
                                style={{ maxHeight: '100px', maxWidth: '100%' }} 
                                className="img-thumbnail"
                              />
                            </div>
                          )}
                        </Col>
                      </Row>

                      <h4 className="mb-4 mt-4">Informations de contact</h4>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email de contact *</Form.Label>
                            <Form.Control
                              type="email"
                              name="contactEmail"
                              value={formData.contactEmail}
                              onChange={handleInputChange}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Veuillez entrer une adresse email valide.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Téléphone de contact *</Form.Label>
                            <Form.Control
                              type="tel"
                              name="contactPhone"
                              value={formData.contactPhone}
                              onChange={handleInputChange}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Veuillez entrer votre numéro de téléphone.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Site web (optionnel)</Form.Label>
                        <Form.Control
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://www.votresite.com"
                        />
                      </Form.Group>

                      <h4 className="mb-4 mt-4">Adresse</h4>
                      <Form.Group className="mb-3">
                        <Form.Label>Adresse *</Form.Label>
                        <Form.Control
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Veuillez entrer votre adresse.
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Ville *</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Veuillez entrer votre ville.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Code postal *</Form.Label>
                            <Form.Control
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Veuillez entrer votre code postal.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Pays *</Form.Label>
                            <Form.Control
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Veuillez entrer votre pays.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <h4 className="mb-4 mt-4">Informations bancaires</h4>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nom de la banque</Form.Label>
                            <Form.Control
                              type="text"
                              name="bankName"
                              value={formData.bankName}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Titulaire du compte</Form.Label>
                            <Form.Control
                              type="text"
                              name="accountHolder"
                              value={formData.accountHolder}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>IBAN</Form.Label>
                            <Form.Control
                              type="text"
                              name="iban"
                              value={formData.iban}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>BIC/SWIFT</Form.Label>
                            <Form.Control
                              type="text"
                              name="swift"
                              value={formData.swift}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <h4 className="mb-4 mt-4">Documents de vérification</h4>
                      <Form.Group className="mb-3">
                        <Form.Label>Documents de vérification *</Form.Label>
                        <Form.Control
                          type="file"
                          name="documents"
                          multiple
                          onChange={handleDocumentsChange}
                          required
                        />
                        <Form.Text className="text-muted">
                          Veuillez télécharger des documents prouvant l'existence légale de votre entreprise (Kbis, carte d'identité, etc.)
                          Formats acceptés: PDF, JPG, PNG. Max 5MB par fichier.
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                          Veuillez télécharger au moins un document de vérification.
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      {documents.length > 0 && (
                        <div className="mb-3">
                          <p className="mb-2">Documents téléchargés ({documents.length}):</p>
                          <ul className="list-group">
                            {documents.map((doc, index) => (
                              <li key={index} className="list-group-item">
                                {doc.name} ({Math.round(doc.size / 1024)} KB)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Form.Group className="mb-4">
                        <Form.Check
                          required
                          name="termsAccepted"
                          label="J'accepte les termes et conditions *"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                          feedback="Vous devez accepter les termes et conditions."
                          feedbackType="invalid"
                        />
                      </Form.Group>

                      <div className="text-center">
                        <Button 
                          type="submit" 
                          variant="primary" 
                          size="lg" 
                          className="px-5"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Traitement en cours...
                            </>
                          ) : (
                            'Soumettre ma demande'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      <style jsx global>{`
        .seller-hero {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
        }
        .benefit-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(13, 110, 253, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .benefit-icon i {
          font-size: 2rem;
          color: #0d6efd;
        }
        .step-number {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #0d6efd;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .seller-benefit-card {
          transition: transform 0.3s ease;
        }
        .seller-benefit-card:hover {
          transform: translateY(-10px);
        }
        .seller-options {
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Layout>
  );
};

export default BecomeSeller;