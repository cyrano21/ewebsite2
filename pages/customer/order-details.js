
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, Badge, Button, Table, ProgressBar } from 'react-bootstrap';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';

const OrderDetailsPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails de la commande');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Calculer l'état de progression de la commande
  const getOrderProgress = (status) => {
    const stages = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = stages.indexOf(status);
    if (currentIndex === -1) return 0;
    return (currentIndex / (stages.length - 1)) * 100;
  };

  // Obtenir la classe de badge selon le statut
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  // Traduire le statut en français
  const translateStatus = (status) => {
    const translations = {
      'pending': 'En attente',
      'processing': 'En préparation',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return translations[status] || status;
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), "d MMMM yyyy à HH:mm", { locale: fr });
  };

  if (loading) {
    return (
      <Layout>
        <PageHeader title="Détails de la commande" curPage="Suivi de commande" />
        <Container className="py-5">
          <div className="text-center">
            <LoadingSpinner />
          </div>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageHeader title="Détails de la commande" curPage="Suivi de commande" />
        <Container className="py-5">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <h3 className="text-danger">Erreur</h3>
              <p>{error}</p>
              <Button variant="primary" onClick={() => router.push('/customer/dashboard')}>
                Retour au tableau de bord
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <PageHeader title="Détails de la commande" curPage="Suivi de commande" />
        <Container className="py-5">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <h3>Commande introuvable</h3>
              <p>Les détails de cette commande ne sont pas disponibles.</p>
              <Button variant="primary" onClick={() => router.push('/customer/dashboard')}>
                Retour au tableau de bord
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title="Détails de la commande" curPage="Suivi de commande" />
      <Container className="py-5">
        {/* En-tête de la commande */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={6}>
                <h3 className="mb-1">Commande #{order.orderNumber}</h3>
                <p className="text-muted mb-0">
                  Passée le {formatDate(order.createdAt)}
                </p>
              </Col>
              <Col md={6} className="text-md-end mt-3 mt-md-0">
                <Badge bg={getBadgeVariant(order.status)} className="fs-6 px-3 py-2">
                  {translateStatus(order.status)}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Suivi de progression */}
        <Card className="mb-4 shadow-sm">
          <Card.Header>
            <h5 className="mb-0">Suivi de commande</h5>
          </Card.Header>
          <Card.Body>
            <ProgressBar now={getOrderProgress(order.status)} className="mb-4" />
            <Row className="text-center">
              <Col>
                <div className={`tracking-step ${order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'active' : ''}`}>
                  <i className="icofont-check-circled icon"></i>
                  <span className="step-name">Commande reçue</span>
                </div>
              </Col>
              <Col>
                <div className={`tracking-step ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'active' : ''}`}>
                  <i className="icofont-box icon"></i>
                  <span className="step-name">En préparation</span>
                </div>
              </Col>
              <Col>
                <div className={`tracking-step ${order.status === 'shipped' || order.status === 'delivered' ? 'active' : ''}`}>
                  <i className="icofont-fast-delivery icon"></i>
                  <span className="step-name">Expédiée</span>
                </div>
              </Col>
              <Col>
                <div className={`tracking-step ${order.status === 'delivered' ? 'active' : ''}`}>
                  <i className="icofont-home icon"></i>
                  <span className="step-name">Livrée</span>
                </div>
              </Col>
            </Row>
            {order.trackingNumber && (
              <div className="mt-4 text-center">
                <p className="mb-2">Numéro de suivi:</p>
                <h6>{order.trackingNumber}</h6>
                <Button variant="outline-primary" size="sm" className="mt-2">
                  Suivre le colis
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        <Row>
          {/* Détails des articles */}
          <Col lg={8}>
            <Card className="mb-4 shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Articles commandés</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Produit</th>
                      <th>Prix unitaire</th>
                      <th>Quantité</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.product.image ? (
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                width={50} 
                                height={50} 
                                className="me-3"
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="bg-light me-3" style={{ width: 50, height: 50 }}></div>
                            )}
                            <div>
                              <h6 className="mb-0">{item.product.name}</h6>
                              {item.variant && <small className="text-muted">{item.variant}</small>}
                            </div>
                          </div>
                        </td>
                        <td>{item.price.toFixed(2)} €</td>
                        <td>{item.quantity}</td>
                        <td>{(item.price * item.quantity).toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Résumé de la commande */}
          <Col lg={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Résumé</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Sous-total:</span>
                  <span>{order.subtotal.toFixed(2)} €</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Frais de livraison:</span>
                  <span>{order.shippingCost.toFixed(2)} €</span>
                </div>
                {order.discount > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Remise:</span>
                    <span className="text-success">-{order.discount.toFixed(2)} €</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between mb-0">
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">{order.totalAmount.toFixed(2)} €</span>
                </div>
              </Card.Body>
            </Card>

            {/* Informations de livraison */}
            <Card className="mb-4 shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Adresse de livraison</h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-1 fw-bold">{order.shippingAddress.fullName}</p>
                <p className="mb-1">{order.shippingAddress.address}</p>
                <p className="mb-1">
                  {order.shippingAddress.postalCode} {order.shippingAddress.city}
                </p>
                <p className="mb-0">{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="mb-0 mt-2">
                    <i className="icofont-phone me-1"></i> {order.shippingAddress.phone}
                  </p>
                )}
              </Card.Body>
            </Card>

            {/* Mode de paiement */}
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Paiement</h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-1">
                  <span className="fw-bold">Méthode: </span>
                  {order.paymentMethod}
                </p>
                <p className="mb-0">
                  <span className="fw-bold">Statut: </span>
                  <Badge bg={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                    {order.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
                  </Badge>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Actions */}
        <div className="d-flex justify-content-between mt-4">
          <Button variant="outline-secondary" onClick={() => router.push('/customer/dashboard')}>
            <i className="icofont-rounded-left me-1"></i> Retour
          </Button>
          <div>
            <Button variant="outline-primary" className="me-2">
              <i className="icofont-printer me-1"></i> Imprimer
            </Button>
            <Button variant="outline-danger">
              <i className="icofont-ui-message me-1"></i> Contacter le service client
            </Button>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default OrderDetailsPage;
