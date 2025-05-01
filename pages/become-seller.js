import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import PageHeader from "../components/PageHeader";

const BecomeSeller = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    description: "",
    category: "",
    website: "",
    termsAccepted: false,
  });

  const [validated, setValidated] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Ici, vous implémenterez la logique d'envoi des données
    console.log("Données du formulaire:", formData);
    alert("Merci pour votre inscription ! Nous examinerons votre demande et vous contacterons sous peu.");
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

  return (
    <div>
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
                src="/assets/images/seller-hero.png"
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
          <Row>
            <Col lg={10} className="mx-auto">
              <Card className="border-0 shadow">
                <Card.Body className="p-4 p-lg-5">
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <h4 className="mb-4">Informations sur la boutique</h4>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nom de la boutique *</Form.Label>
                          <Form.Control
                            type="text"
                            name="shopName"
                            value={formData.shopName}
                            onChange={handleInputChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Veuillez entrer un nom pour votre boutique.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
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
                    </Row>
                    <Form.Group className="mb-4">
                      <Form.Label>Description de la boutique *</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Veuillez décrire votre boutique.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <h4 className="mb-4">Informations personnelles</h4>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nom complet *</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Veuillez entrer votre nom complet.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Veuillez entrer une adresse email valide.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Téléphone *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Veuillez entrer votre numéro de téléphone.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Site web (optionnel)</Form.Label>
                          <Form.Control
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <h4 className="mb-4">Adresse</h4>
                    <Form.Group className="mb-3">
                      <Form.Label>Adresse *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
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
                    </Row>

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
                      <Button type="submit" variant="primary" size="lg" className="px-5">
                        Soumettre ma demande
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
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
      `}</style>
    </div>
  );
};

export default BecomeSeller;
