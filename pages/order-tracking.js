import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useRouter } from "next/router";
import PageHeader from "../components/PageHeader";
import { AuthContext } from "../contexts/AuthProvider";

const OrderTracking = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { orderId } = router.query;

  const [trackingForm, setTrackingForm] = useState({
    orderId: orderId || "",
    email: user?.email || "",
  });

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trackingSubmitted, setTrackingSubmitted] = useState(false);

  // Données de suivi factices pour la démo
  const mockOrderDetails = {
    id: "ORD-2025-12345",
    date: "27/04/2025",
    status: "En transit",
    customer: {
      name: "Thomas Dupont",
      email: "thomas.dupont@example.com",
      address: "123 Rue de Paris, 75001 Paris, France",
    },
    items: [
      {
        id: 1,
        name: "Smartphone XYZ Pro",
        quantity: 1,
        price: 899.99,
        image: "/assets/images/shop/01.jpg",
      },
      {
        id: 2,
        name: "Écouteurs sans fil",
        quantity: 2,
        price: 129.99,
        image: "/assets/images/shop/02.jpg",
      },
    ],
    shipping: {
      method: "Livraison standard",
      carrier: "ChronoPost",
      trackingNumber: "CP129876543FR",
      estimatedDelivery: "03/05/2025",
    },
    payment: {
      method: "Carte bancaire",
      total: 1159.97,
    },
    timeline: [
      {
        date: "27/04/2025",
        time: "10:23",
        status: "Commande confirmée",
        description: "Votre commande a été confirmée et le paiement a été validé.",
      },
      {
        date: "28/04/2025",
        time: "09:45",
        status: "En préparation",
        description: "Votre commande est en cours de préparation dans notre entrepôt.",
      },
      {
        date: "29/04/2025",
        time: "15:37",
        status: "Expédiée",
        description: "Votre commande a été expédiée via ChronoPost.",
      },
      {
        date: "30/04/2025",
        time: "08:12",
        status: "En transit",
        description: "Votre colis est en transit. Il est actuellement au centre de distribution de Lyon.",
      },
    ],
  };

  // Utiliser useEffect pour préremplir le formulaire avec l'ID de commande depuis l'URL
  useEffect(() => {
    if (orderId) {
      setTrackingForm(prev => ({ ...prev, orderId }));
      // Simuler une recherche automatique si l'ID de commande est présent dans l'URL
      handleTrackOrder({ preventDefault: () => {} });
    }
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrackingForm({
      ...trackingForm,
      [name]: value,
    });
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simuler une requête API
    setTimeout(() => {
      // Vérifier si les données de formulaire correspondent à notre commande factice
      if (trackingForm.orderId === mockOrderDetails.id || 
          trackingForm.orderId === "12345" || 
          trackingForm.orderId === "") {
        setOrder(mockOrderDetails);
        setTrackingSubmitted(true);
      } else {
        setError("Aucune commande trouvée avec ces informations. Veuillez vérifier et réessayer.");
        setOrder(null);
      }
      setLoading(false);
    }, 1500);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Commande confirmée":
        return "bg-primary";
      case "En préparation":
        return "bg-info";
      case "Expédiée":
        return "bg-warning";
      case "En transit":
        return "bg-info";
      case "Livrée":
        return "bg-success";
      case "Annulée":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="order-tracking-page">
      <PageHeader title="Suivi de Commande" curPage="Suivi de commande" />

      <Container className="py-5">
        <Row className="justify-content-center mb-5">
          <Col lg={8}>
            <Card className="tracking-card border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="card-title text-center mb-4">Suivre ma commande</h3>
                <Form onSubmit={handleTrackOrder}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Numéro de commande</Form.Label>
                        <Form.Control
                          type="text"
                          name="orderId"
                          placeholder="Ex: ORD-2025-12345"
                          value={trackingForm.orderId}
                          onChange={handleInputChange}
                        />
                        <Form.Text className="text-muted">
                          Vous trouverez ce numéro dans votre e-mail de confirmation.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Email utilisé pour la commande</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="votre@email.com"
                          value={trackingForm.email}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-center mt-3">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="px-4 py-2"
                      disabled={loading}
                    >
                      {loading ? "Recherche en cours..." : "Suivre ma commande"}
                    </Button>
                  </div>
                </Form>

                {error && (
                  <div className="alert alert-danger mt-4" role="alert">
                    {error}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {trackingSubmitted && order && (
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="order-details-section">
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h4 className="mb-0">Commande #{order.id}</h4>
                        <p className="text-muted mb-0">Passée le {order.date}</p>
                      </div>
                      <div className={`status-badge ${getStatusClass(order.status)} text-white px-3 py-2 rounded`}>
                        {order.status}
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row>
                      <Col md={6} className="mb-4 mb-md-0">
                        <h5 className="mb-3">Informations de livraison</h5>
                        <p><strong>Destinataire:</strong> {order.customer.name}</p>
                        <p><strong>Adresse:</strong> {order.customer.address}</p>
                        <p><strong>Mode de livraison:</strong> {order.shipping.method}</p>
                        <p><strong>Transporteur:</strong> {order.shipping.carrier}</p>
                        <p><strong>Numéro de suivi:</strong> {order.shipping.trackingNumber}</p>
                        <p><strong>Livraison estimée:</strong> {order.shipping.estimatedDelivery}</p>
                      </Col>
                      <Col md={6}>
                        <h5 className="mb-3">Récapitulatif de la commande</h5>
                        {order.items.map((item) => (
                          <div key={item.id} className="d-flex align-items-center mb-3">
                            <div className="product-image me-3">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                width="60" 
                                height="60"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0">{item.name}</h6>
                              <p className="mb-0 text-muted">
                                Quantité: {item.quantity} × {item.price.toFixed(2)} €
                              </p>
                            </div>
                          </div>
                        ))}
                        <div className="mt-3 pt-3 border-top">
                          <div className="d-flex justify-content-between">
                            <span>Total:</span>
                            <span className="fw-bold">{order.payment.total.toFixed(2)} €</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Mode de paiement:</span>
                            <span>{order.payment.method}</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Timeline de la commande */}
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white py-3">
                    <h5 className="mb-0">Historique de la commande</h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="order-timeline">
                      {order.timeline.map((event, index) => (
                        <div key={index} className={`timeline-item ${index === order.timeline.length - 1 ? 'active' : ''}`}>
                          <div className="timeline-badge">
                            <div className={`badge-inner ${getStatusClass(event.status)}`}></div>
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-date">
                              {event.date} à {event.time}
                            </div>
                            <h6 className="timeline-title">{event.status}</h6>
                            <p className="timeline-text">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                <div className="text-center mt-4">
                  <p className="mb-3">Besoin d'aide concernant votre commande ?</p>
                  <Button variant="outline-primary" href="/contact">
                    Contactez notre service client
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>

      <style jsx global>{`
        .tracking-card {
          border-radius: 12px;
        }
        .order-timeline {
          position: relative;
          padding-left: 30px;
        }
        .order-timeline:before {
          content: "";
          position: absolute;
          left: 11px;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: #e9ecef;
        }
        .timeline-item {
          position: relative;
          padding-bottom: 30px;
        }
        .timeline-item:last-child {
          padding-bottom: 0;
        }
        .timeline-badge {
          position: absolute;
          left: -30px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #fff;
          border: 2px solid #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .timeline-item.active .timeline-badge {
          border-color: #0d6efd;
        }
        .badge-inner {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .timeline-content {
          padding-bottom: 10px;
        }
        .timeline-date {
          font-size: 0.85rem;
          color: #6c757d;
          margin-bottom: 5px;
        }
        .timeline-title {
          margin-bottom: 5px;
        }
        .timeline-text {
          margin-bottom: 0;
          color: #6c757d;
        }
        .status-badge {
          font-size: 0.85rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default OrderTracking;
