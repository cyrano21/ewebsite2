import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useNotifications } from "../../contexts/NotificationContext";
import Link from "next/link";
import axios from "axios";

export default function CheckoutSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState("");
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Vider le panier après un paiement réussi
    localStorage.removeItem("cart");

    if (session_id) {
      verifyPayment(session_id);
    } else {
      setLoading(false);
    }

    // Ajouter une notification de succès
    addNotification({
      title: "Paiement réussi",
      message: "Votre commande a été traitée avec succès!",
      type: "success",
    });
  }, [session_id, addNotification]);

  const verifyPayment = async (sessionId) => {
    try {
      const response = await axios.get(
        `/api/verify-payment?session_id=${sessionId}`
      );
      if (response.data && response.data.order) {
        setOrderDetails(response.data.order);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du paiement:", error);
      setError(
        "Impossible de vérifier les détails du paiement. Votre commande a toutefois été enregistrée."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-success text-white">
              <h3 className="mb-0">Commande confirmée</h3>
            </Card.Header>
            <Card.Body className="text-center py-5">
              {loading ? (
                <div className="py-4">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Chargement...</span>
                  </Spinner>
                  <p className="mt-3">Vérification de votre paiement...</p>
                </div>
              ) : (
                <>
                  {error && (
                    <Alert variant="warning" className="mb-4">
                      {error}
                    </Alert>
                  )}

                  <div className="success-icon mb-4">
                    <i
                      className="icofont-check-circled text-success"
                      style={{ fontSize: "5rem" }}
                    ></i>
                  </div>

                  <h4 className="mb-4">Merci pour votre commande!</h4>

                  <p className="mb-4">
                    Votre paiement a été traité avec succès. Un email de
                    confirmation vous sera envoyé prochainement.
                  </p>

                  {orderDetails && (
                    <div className="order-details p-3 mb-4 text-start bg-light rounded">
                      <h5 className="mb-3">Détails de la commande</h5>
                      <p className="mb-2">
                        <strong>Numéro de commande:</strong> {orderDetails._id}
                      </p>
                      <p className="mb-2">
                        <strong>Date:</strong>{" "}
                        {new Date(orderDetails.createdAt).toLocaleString()}
                      </p>
                      <p className="mb-2">
                        <strong>Total:</strong> {orderDetails.total}€
                      </p>
                      <p className="mb-0">
                        <strong>Statut:</strong>{" "}
                        <span className="badge bg-success">Payée</span>
                      </p>
                    </div>
                  )}

                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <Link href="/" passHref>
                      <Button variant="outline-primary">
                        Retour à l'accueil
                      </Button>
                    </Link>
                    <Link href="/shop" passHref>
                      <Button variant="primary">Continuer mes achats</Button>
                    </Link>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Utilise getLayout pour appliquer une seule fois Layout via _app.js
CheckoutSuccess.getLayout = (page) => <Layout>{page}</Layout>;
