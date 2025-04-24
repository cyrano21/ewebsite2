import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Button, Modal, Form, Alert, Badge, Card, InputGroup, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import Image from "next/image";

const CheckoutPage = ({ onOrderComplete }) => {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("visa");
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    email: "",
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  
  const router = useRouter();

  useEffect(() => {
    // Récupérer les informations du panier pour afficher un résumé
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length > 0) {
      const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      setOrderSummary({
        items: cart,
        totalItems: cart.reduce((total, item) => total + item.quantity, 0),
        totalPrice: totalPrice.toFixed(2)
      });
    }
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Réinitialiser les erreurs lors du changement d'onglet
    setErrors({});
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === "visa") {
      if (!formData.cardName.trim()) newErrors.cardName = "Le nom du titulaire est requis";
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Le numéro de carte est requis";
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) 
        newErrors.cardNumber = "Le numéro de carte doit contenir 16 chiffres";
      
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = "La date d'expiration est requise";
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) 
        newErrors.cardExpiry = "Format invalide (MM/YY)";
      
      if (!formData.cardCVV.trim()) newErrors.cardCVV = "Le CVV est requis";
      else if (!/^\d{3,4}$/.test(formData.cardCVV)) 
        newErrors.cardCVV = "Le CVV doit contenir 3 ou 4 chiffres";
    } else if (activeTab === "paypal") {
      if (!formData.email.trim()) newErrors.email = "L'email est requis";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) 
        newErrors.email = "Format d'email invalide";
      
      if (!formData.name.trim()) newErrors.name = "Votre nom est requis";
    }
    
    // Validation des informations de livraison (communes aux deux méthodes)
    if (!formData.address.trim()) newErrors.address = "L'adresse est requise";
    if (!formData.city.trim()) newErrors.city = "La ville est requise";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Le code postal est requis";
    else if (!/^\d{5}$/.test(formData.postalCode)) 
      newErrors.postalCode = "Format de code postal invalide";
    
    return newErrors;
  };

  const handleOrderConfirm = () => {
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Fermer la modal
      handleClose();
      
      // Appeler la fonction fournie par le parent
      if (typeof onOrderComplete === 'function') {
        onOrderComplete();
      } else {
        // Vider le panier
        localStorage.removeItem("cart");
        // Rediriger vers la page d'accueil
        router.push('/');
      }
    }, 1500);
  };

  return (
    <Container className="checkout-container py-4">
      {/* Résumé de la commande avant le bouton de paiement */}
      {orderSummary && (
        <div className="order-quick-summary mb-4 p-3 border rounded bg-light">
          <h5 className="d-flex justify-content-between">
            <span>Résumé de votre panier</span>
            <Badge bg="primary" pill>{orderSummary.totalItems} article(s)</Badge>
          </h5>
          <p className="mb-1">Total: <strong>{orderSummary.totalPrice}€</strong></p>
          <div className="small text-muted mb-3">
            {orderSummary.items.slice(0, 2).map((item, idx) => (
              <div key={idx} className="d-flex justify-content-between">
                <span>{item.name} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)}€</span>
              </div>
            ))}
            {orderSummary.items.length > 2 && (
              <div className="text-center mt-1">
                <small>+ {orderSummary.items.length - 2} autre(s) article(s)</small>
              </div>
            )}
          </div>
        </div>
      )}

      <Button 
        variant="primary" 
        onClick={handleShow} 
        className="py-2 w-100 checkout-button"
        size="lg"
      >
        Procéder au paiement
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        animation={true}
        className="checkout-modal"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Finaliser votre commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="tabs mt-3">
            <ul className="nav nav-tabs" id="paymentTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === "visa" ? "active" : ""}`}
                  id="visa-tab"
                  data-toggle="tab"
                  href="#visa"
                  role="tab"
                  aria-controls="visa"
                  aria-selected={activeTab === "visa"}
                  onClick={() => handleTabChange("visa")}
                >
                  <img src="https://i.imgur.com/sB4jftM.png" width="80" alt="Visa" />
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === "paypal" ? "active" : ""}`}
                  id="paypal-tab"
                  data-toggle="tab"
                  href="#paypal"
                  role="tab"
                  aria-controls="paypal"
                  aria-selected={activeTab === "paypal"}
                  onClick={() => handleTabChange("paypal")}
                >
                  <img src="https://i.imgur.com/yK7EDD1.png" width="80" alt="PayPal" />
                </a>
              </li>
            </ul>
            <div className="tab-content mt-3" id="paymentTabsContent">
              {/* Visa/Card Tab Content */}
              <div
                className={`tab-pane fade ${activeTab === "visa" ? "show active" : ""}`}
                id="visa"
                role="tabpanel"
              >
                <Card className="mb-4 shadow-sm border-0">
                  <Card.Header className="bg-white border-0 text-center">
                    <h5>Informations de carte de crédit</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <InputGroup className="mb-3">
                        <InputGroup.Text><i className="icofont-user"></i></InputGroup.Text>
                        <Form.Control placeholder="Nom du titulaire" name="cardName" value={formData.cardName} onChange={handleInputChange} isInvalid={!!errors.cardName} />
                        <Form.Control.Feedback type="invalid">{errors.cardName}</Form.Control.Feedback>
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroup.Text><i className="icofont-credit-card"></i></InputGroup.Text>
                        <Form.Control placeholder="1234 5678 9012 3456" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} isInvalid={!!errors.cardNumber} />
                        <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
                      </InputGroup>
                      <Row>
                        <Col md={6}>
                          <InputGroup className="mb-3">
                            <InputGroup.Text><i className="icofont-calendar"></i></InputGroup.Text>
                            <Form.Control placeholder="MM/YY" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} isInvalid={!!errors.cardExpiry} />
                            <Form.Control.Feedback type="invalid">{errors.cardExpiry}</Form.Control.Feedback>
                          </InputGroup>
                        </Col>
                        <Col md={6}>
                          <InputGroup className="mb-3">
                            <InputGroup.Text><i className="icofont-ui-lock"></i></InputGroup.Text>
                            <Form.Control placeholder="CVV" name="cardCVV" value={formData.cardCVV} onChange={handleInputChange} isInvalid={!!errors.cardCVV} />
                            <Form.Control.Feedback type="invalid">{errors.cardCVV}</Form.Control.Feedback>
                          </InputGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
              
              {/* PayPal Tab Content */}
              <div
                className={`tab-pane fade ${activeTab === "paypal" ? "show active" : ""}`}
                id="paypal"
                role="tabpanel"
              >
                <div className="mx-4 mt-4">
                  <div className="text-center mb-4">
                    <h5>Connectez-vous avec PayPal</h5>
                  </div>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="exemple@email.com"
                        isInvalid={!!errors.email}
                      />
                      {errors.email && (
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Nom complet</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        isInvalid={!!errors.name}
                      />
                      {errors.name && (
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    
                    <Alert variant="info">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      Vous serez redirigé vers PayPal pour finaliser le paiement en toute sécurité.
                    </Alert>
                  </Form>
                </div>
              </div>
            </div>
            
            {/* Shipping Address - Common to all payment methods */}
            <div className="shipping-address mx-4 mt-4 pt-3 border-top">
              <h5 className="mb-3">Adresse de livraison</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    isInvalid={!!errors.address}
                  />
                  {errors.address && (
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Ville</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        isInvalid={!!errors.city}
                      />
                      {errors.city && (
                        <Form.Control.Feedback type="invalid">
                          {errors.city}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Code postal</Form.Label>
                      <Form.Control
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        isInvalid={!!errors.postalCode}
                      />
                      {errors.postalCode && (
                        <Form.Control.Feedback type="invalid">
                          {errors.postalCode}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </div>
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label>Pays</Form.Label>
                  <Form.Select 
                    name="country" 
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </div>
            
            {/* Order Summary in Modal */}
            {orderSummary && (
              <div className="order-summary mx-4 mt-4 p-3 border rounded bg-light">
                <h5>Résumé de la commande</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Sous-total:</span>
                  <span>{orderSummary.totalPrice}€</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Frais de livraison:</span>
                  <span>0.00€</span>
                </div>
                <div className="d-flex justify-content-between mb-2 fw-bold">
                  <span>Total:</span>
                  <span>{orderSummary.totalPrice}€</span>
                </div>
              </div>
            )}
            
            {/* Disclaimer */}
            <p className="mt-4 px-4 text-muted small">
              <em>Clause de non-responsabilité :</em> En confirmant votre commande, vous acceptez nos conditions générales de vente. Toutes les informations de paiement sont sécurisées et cryptées. Aucun prélèvement ne sera effectué sans votre consentement.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleOrderConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Scoped Styles for CheckoutPage */}
      <style jsx>{`
        .checkout-container { max-width: 600px; margin: auto; padding: 2rem; }
        .checkout-button { transition: all 0.3s ease; border-radius: 0.25rem; font-weight: 600; }
        .checkout-modal .modal-content { border-radius: 1rem; overflow: hidden; }
        .order-quick-summary { border-left: 4px solid #007bff; padding-left: 1rem; margin-bottom: 1.5rem; }
        .order-summary { border-left: 4px solid #28a745; padding: 1rem; background: #f8f9fa; }
        .nav-tabs .nav-link { font-weight: 600; }
      `}</style>
    </Container>
  );
};

export default CheckoutPage;
