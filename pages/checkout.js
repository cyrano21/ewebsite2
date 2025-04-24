import React, { useEffect, useState } from "react";
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
  Button,
} from "react-bootstrap";
import { useNotifications } from "../contexts/NotificationContext";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import Image from "next/image";
import Link from "next/link";

export default function Checkout() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addNotification } = useNotifications();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Récupérer la commande depuis l'API si un orderId est présent
    if (orderId) {
      setLoading(true);
      axios
        .get(`/api/orders/${orderId}`)
        .then((response) => {
          setOrder(response.data);
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
      setLoading(false);
    }
  }, [orderId, router, addNotification]);

  const proceedToStripeCheckout = async () => {
    try {
      setLoading(true);

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
        items = JSON.parse(localStorage.getItem("cart")) || [];
        totalPrice = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        orderIdentifier = "cart_order";

        // Créer une commande via l'API si ce n'est pas déjà fait
        try {
          const orderResponse = await axios.post("/api/orders", {
            user: user ? user.id : null,
            items: items,
            total: totalPrice,
            status: "pending",
            shippingAddress: null,
            paymentMethod: null,
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
        customerEmail: user?.email,
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
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 mt-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-3">Chargement des détails de votre commande...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Finaliser votre commande</h3>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {/* Résumé de la commande */}
              {order ? (
                <div className="order-summary mb-4">
                  <h4 className="mb-3">Résumé de votre commande</h4>
                  <div className="p-3 bg-light rounded mb-4">
                    <p className="mb-2">
                      <strong>Numéro de commande:</strong> {order._id}
                    </p>
                    <p className="mb-2">
                      <strong>Total:</strong> {order.total}€
                    </p>
                    <p className="mb-0">
                      <strong>Articles:</strong> {order.items?.length || 0}
                    </p>
                  </div>

                  <div className="items-list mb-4">
                    <h5 className="mb-3">Articles</h5>
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-3 p-2 border-bottom"
                      >
                        <div
                          className="item-image me-3"
                          style={{ width: "60px", height: "60px" }}
                        >
                          {item.img ? (
                            <img
                              src={item.img}
                              alt={item.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              className="rounded"
                            />
                          ) : (
                            <div
                              className="bg-light rounded d-flex align-items-center justify-content-center"
                              style={{ width: "100%", height: "100%" }}
                            >
                              <i className="icofont-image text-muted"></i>
                            </div>
                          )}
                        </div>
                        <div className="item-details flex-grow-1">
                          <h6 className="mb-1">{item.name}</h6>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">
                              Quantité: {item.quantity}
                            </span>
                            <span className="fw-bold">
                              {(item.price * item.quantity).toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="cart-summary mb-4">
                  <h4 className="mb-3">Résumé du panier</h4>
                  <CartSummary />
                </div>
              )}

              {/* Bouton pour procéder au paiement avec Stripe Checkout */}
              <div className="text-center mt-4">
                <p className="mb-3">
                  Vous allez être redirigé vers notre partenaire sécurisé Stripe
                  pour finaliser votre paiement.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  className="px-5 py-3"
                  onClick={proceedToStripeCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Chargement...
                    </>
                  ) : (
                    <>
                      <i className="icofont-lock me-2"></i> Procéder au paiement
                      sécurisé
                    </>
                  )}
                </Button>

                <div className="mt-3 d-flex justify-content-center align-items-center">
                  <img
                    src="https://stripe.com/img/v3/home/twitter-card.png"
                    alt="Paiement sécurisé par Stripe"
                    height="30"
                    className="me-2"
                  />
                  <span className="text-muted small">
                    Paiement sécurisé par Stripe
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Composant pour afficher le résumé du panier depuis localStorage
function CartSummary() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalPrice);
  }, []);

  if (cartItems.length === 0) {
    return <p>Votre panier est vide.</p>;
  }

  return (
    <div className="cart-items">
      <div className="p-3 bg-light rounded mb-4">
        <p className="mb-2">
          <strong>Total:</strong> {total.toFixed(2)}€
        </p>
        <p className="mb-0">
          <strong>Articles:</strong> {cartItems.length}
        </p>
      </div>

      <div className="items-list">
        {cartItems.map((item, index) => (
          <div
            key={index}
            className="d-flex align-items-center mb-3 p-2 border-bottom"
          >
            <div
              className="item-image me-3"
              style={{ width: "60px", height: "60px" }}
            >
              {item.img ? (
                <img
                  src={item.img}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="rounded"
                />
              ) : (
                <div
                  className="bg-light rounded d-flex align-items-center justify-content-center"
                  style={{ width: "100%", height: "100%" }}
                >
                  <i className="icofont-image text-muted"></i>
                </div>
              )}
            </div>
            <div className="item-details flex-grow-1">
              <h6 className="mb-1">{item.name}</h6>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Quantité: {item.quantity}</span>
                <span className="fw-bold">
                  {(item.price * item.quantity).toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Utilise getLayout pour appliquer une seule fois Layout via _app.js
Checkout.getLayout = (page) => <Layout>{page}</Layout>;
