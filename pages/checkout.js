import React, { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
  Button,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { useNotifications } from "../contexts/NotificationContext";
import { AuthContext } from "../contexts/AuthProvider";
import Image from "next/image";

export default function Checkout() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addNotification } = useNotifications();
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "France",
  });
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Récupérer la commande depuis l'API si un orderId est présent
    if (orderId) {
      setLoading(true);
      axios
        .get(`/api/orders/${orderId}`)
        .then((response) => {
          setOrder(response.data);
          if (response.data.customer) {
            setShippingInfo({
              fullName: response.data.customer.name || "",
              email: response.data.customer.email || "",
              phone: response.data.customer.phone || "",
              address: response.data.shippingAddress?.address || "",
              city: response.data.shippingAddress?.city || "",
              zipCode: response.data.shippingAddress?.zipCode || "",
              country: response.data.shippingAddress?.country || "France",
            });
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération de la commande :",
            error
          );
          setError(
            "Impossible de récupérer les détails de votre commande. Veuillez réessayer."
          );
          addNotification({
            title: "Erreur",
            message: "Impossible de récupérer les détails de votre commande.",
            type: "error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Si pas d'orderId, vérifier le panier dans localStorage
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        // Rediriger vers le panier si le panier est vide
        router.push("/panier");
        return;
      }
      setCartItems(cart);

      // Préremplir avec les infos utilisateur si disponibles
      if (user) {
        setShippingInfo((prev) => ({
          ...prev,
          fullName: user.displayName || "",
          email: user.email || "",
        }));
      }

      setLoading(false);
    }
  }, [orderId, router, addNotification, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    const items = order ? order.items : cartItems;
    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const calculateTotalItems = () => {
    const items = order ? order.items : cartItems;
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const validateShippingInfo = () => {
    const errors = {};
    if (!shippingInfo.fullName)
      errors.fullName = "Veuillez entrer votre nom complet";
    if (!shippingInfo.email) errors.email = "Veuillez entrer votre email";
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email))
      errors.email = "Email invalide";
    if (!shippingInfo.phone)
      errors.phone = "Veuillez entrer votre numéro de téléphone";
    if (!shippingInfo.address) errors.address = "Veuillez entrer votre adresse";
    if (!shippingInfo.city) errors.city = "Veuillez entrer votre ville";
    if (!shippingInfo.zipCode)
      errors.zipCode = "Veuillez entrer votre code postal";

    return errors;
  };

  const handleContinueToPayment = () => {
    const errors = validateShippingInfo();
    if (Object.keys(errors).length === 0) {
      setStep(2);
    } else {
      // Afficher les erreurs
      let errorMessage = "Veuillez corriger les erreurs suivantes:";
      Object.values(errors).forEach((error) => {
        errorMessage += `\n- ${error}`;
      });
      addNotification({
        title: "Erreur de validation",
        message: errorMessage,
        type: "error",
      });
    }
  };

  const handleBackToShipping = () => {
    setStep(1);
  };

  const proceedToStripeCheckout = async () => {
    try {
      setActionLoading(true);

      // Récupérer les données nécessaires
      let items;
      let totalPrice;
      let orderIdentifier;

      if (order) {
        // Si une commande existe déjà
        items = order.items;
        totalPrice = order.total;
        orderIdentifier = order._id;
      } else {
        // Utiliser le panier du localStorage
        items = cartItems;
        totalPrice = parseFloat(calculateTotal());
        orderIdentifier = "cart_order";

        // Créer une commande via l'API si ce n'est pas déjà fait
        try {
          const orderResponse = await axios.post("/api/orders", {
            user: user ? user.id : null,
            items: items,
            total: totalPrice,
            status: "pending",
            customer: {
              name: shippingInfo.fullName,
              email: shippingInfo.email,
              phone: shippingInfo.phone,
            },
            shippingAddress: {
              address: shippingInfo.address,
              city: shippingInfo.city,
              zipCode: shippingInfo.zipCode,
              country: shippingInfo.country,
            },
            paymentMethod: paymentMethod,
          });

          if (orderResponse.data && orderResponse.data._id) {
            orderIdentifier = orderResponse.data._id;
          }
        } catch (orderError) {
          console.error(
            "Erreur lors de la création de la commande:",
            orderError
          );
        }
      }

      // Créer une session de checkout Stripe
      const response = await axios.post("/api/create-checkout-session", {
        items: items,
        orderId: orderIdentifier,
        customerEmail: shippingInfo.email,
      });

      // Rediriger vers la page de checkout Stripe
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("La création de la session de checkout a échoué");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la création de la session de checkout:",
        error
      );
      setError("Impossible d'initialiser le paiement. Veuillez réessayer.");
      addNotification({
        title: "Erreur",
        message:
          "Impossible de créer la session de paiement. Veuillez réessayer.",
        type: "error",
      });
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 my-5">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary" size="lg">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p className="mt-3 text-muted">
            Chargement des détails de votre commande...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5 my-4">
      <h2 className="mb-4 fw-bold text-center">Finalisation de la commande</h2>
      <div className="checkout-steps mb-5">
        <div className="step-progress">
          <div className="progress" style={{ height: "3px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: step === 1 ? "50%" : "100%" }}
              aria-valuenow={step === 1 ? 50 : 100}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div className="steps-indicator d-flex justify-content-between mt-n2">
            <div className={`step-item ${step >= 1 ? "active" : ""}`}>
              <div className="step-circle">1</div>
              <div className="step-text">Livraison</div>
            </div>
            <div className={`step-item ${step >= 2 ? "active" : ""}`}>
              <div className="step-circle">2</div>
              <div className="step-text">Paiement</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        <Col lg={8} md={7}>
          {step === 1 && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0 py-2">Informations de livraison</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Form>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Nom complet</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleInputChange}
                          placeholder="Jean Dupont"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleInputChange}
                          placeholder="email@exemple.com"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleInputChange}
                          placeholder="06 12 34 56 78"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Adresse</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleInputChange}
                          placeholder="123 rue de Paris"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Ville</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          placeholder="Paris"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Code postal</Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleInputChange}
                          placeholder="75001"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Pays</Form.Label>
                        <Form.Select
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleInputChange}
                        >
                          <option value="France">France</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Suisse">Suisse</option>
                          <option value="Luxembourg">Luxembourg</option>
                          <option value="Canada">Canada</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleContinueToPayment}
                      className="px-4"
                    >
                      Continuer vers le paiement
                      <i className="icofont-arrow-right ms-2"></i>
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 py-2">Mode de paiement</h5>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleBackToShipping}
                >
                  <i className="icofont-arrow-left me-1"></i>
                  Modifier la livraison
                </Button>
              </Card.Header>
              <Card.Body className="p-4">
                <Form>
                  <div className="payment-methods mb-4">
                    <div className="form-check custom-radio mb-3 p-3 border rounded">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="creditCard"
                        value="creditCard"
                        checked={paymentMethod === "creditCard"}
                        onChange={() => setPaymentMethod("creditCard")}
                      />
                      <label
                        className="form-check-label d-flex justify-content-between w-100"
                        htmlFor="creditCard"
                      >
                        <div>
                          <strong>Carte de crédit</strong>
                          <p className="text-muted mb-0 small">
                            Paiement sécurisé via Stripe
                          </p>
                        </div>
                        <div className="payment-icons d-flex align-items-center">
                          <i className="icofont-visa-alt me-1 text-primary fs-3"></i>
                          <i className="icofont-mastercard me-1 text-danger fs-3"></i>
                          <i className="icofont-american-express text-info fs-3"></i>
                        </div>
                      </label>
                    </div>

                    <div className="form-check custom-radio mb-3 p-3 border rounded">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="paypal"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                      />
                      <label
                        className="form-check-label d-flex justify-content-between w-100"
                        htmlFor="paypal"
                      >
                        <div>
                          <strong>PayPal</strong>
                          <p className="text-muted mb-0 small">
                            Paiement sécurisé via PayPal
                          </p>
                        </div>
                        <div className="payment-icons">
                          <i className="icofont-paypal-alt text-primary fs-3"></i>
                        </div>
                      </label>
                    </div>
                  </div>

                  <Alert variant="info" className="d-flex align-items-center">
                    <i className="icofont-info-circle fs-5 me-3"></i>
                    <div>
                      Vous serez redirigé vers notre partenaire de paiement
                      sécurisé pour finaliser votre transaction.
                    </div>
                  </Alert>

                  <div className="d-flex justify-content-between mt-4">
                    <Button
                      variant="outline-secondary"
                      onClick={handleBackToShipping}
                    >
                      <i className="icofont-arrow-left me-1"></i>
                      Retour
                    </Button>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={proceedToStripeCheckout}
                      disabled={actionLoading}
                      className="px-4"
                    >
                      {actionLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Traitement...
                        </>
                      ) : (
                        <>
                          Payer {calculateTotal()}€
                          <i className="icofont-lock ms-2"></i>
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={4} md={5}>
          <div
            className="order-summary-container sticky-top"
            style={{ top: "20px" }}
          >
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0 py-2">Résumé de la commande</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center px-4 py-3">
                    <span>Articles ({calculateTotalItems()})</span>
                    <span>{calculateTotal()}€</span>
                  </ListGroup.Item>

                  <ListGroup.Item className="d-flex justify-content-between align-items-center px-4 py-3">
                    <span>Livraison</span>
                    <Badge bg="success" pill>
                      Gratuite
                    </Badge>
                  </ListGroup.Item>

                  <ListGroup.Item className="px-4 py-3">
                    <div className="d-flex justify-content-between align-items-center fw-bold fs-5">
                      <span>Total</span>
                      <span className="text-primary">{calculateTotal()}€</span>
                    </div>
                    <div className="text-muted small mt-1">TVA incluse</div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0 py-2">Articles dans votre panier</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {(order ? order.items : cartItems).map((item, index) => (
                  <ListGroup.Item key={index} className="p-3">
                    <div className="d-flex">
                      <div
                        className="flex-shrink-0"
                        style={{ width: "60px", height: "60px" }}
                      >
                        {item.img ? (
                          <Image
                            src={item.img}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded"
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light rounded d-flex align-items-center justify-content-center"
                            style={{ width: "100%", height: "100%" }}
                          >
                            <i className="icofont-box text-muted"></i>
                          </div>
                        )}
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <h6 className="mb-1 fw-semibold">{item.name}</h6>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted small">
                            Qté : {item.quantity}
                          </span>
                          <span className="fw-semibold">
                            {(item.price * item.quantity).toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <i className="icofont-ssl-security fs-3 text-success me-3"></i>
                  <div>
                    <h6 className="mb-1">Paiement 100% sécurisé</h6>
                    <p className="mb-0 small text-muted">
                      Vos données sont protégées par un chiffrement SSL 256 bits
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <i className="icofont-truck fs-3 text-primary me-3"></i>
                  <div>
                    <h6 className="mb-1">Livraison gratuite</h6>
                    <p className="mb-0 small text-muted">
                      Sur toutes vos commandes en France métropolitaine
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <i className="icofont-exchange fs-3 text-danger me-3"></i>
                  <div>
                    <h6 className="mb-1">Retours sous 30 jours</h6>
                    <p className="mb-0 small text-muted">
                      Satisfaction garantie ou remboursement intégral
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      <style jsx>{`
        .checkout-steps {
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .steps-indicator {
          padding: 0 10px;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .step-circle {
          width: 30px;
          height: 30px;
          background-color: #e9ecef;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 5px;
          border: 2px solid #fff;
          box-shadow: 0 0 0 2px #e9ecef;
        }

        .step-item.active .step-circle {
          background-color: var(--bs-primary);
          color: white;
          box-shadow: 0 0 0 2px var(--bs-primary);
        }

        .step-text {
          font-size: 0.875rem;
          color: #6c757d;
          font-weight: 500;
        }

        .step-item.active .step-text {
          color: var(--bs-primary);
          font-weight: 600;
        }

        .payment-methods .form-check-input:checked ~ .form-check-label {
          font-weight: bold;
        }

        .form-check-input:checked ~ .form-check-label .payment-icons {
          opacity: 1;
        }

        .payment-icons {
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .payment-card {
          width: 40px;
          height: 24px;
          background-size: contain;
          background-repeat: no-repeat;
        }

        .payment-card.visa {
          background-image: url("/images/visa.png");
        }

        .payment-card.mastercard {
          background-image: url("/images/mastercard.png");
        }

        .payment-card.amex {
          background-image: url("/images/amex.png");
        }

        .payment-card.paypal {
          background-image: url("/images/paypal.png");
        }

        @media (max-width: 768px) {
          .order-summary-container {
            position: static !important;
          }
        }
      `}</style>
    </Container>
  );
}

// Utilise getLayout pour appliquer une seule fois Layout via _app.js
Checkout.getLayout = (page) => <Layout>{page}</Layout>;
