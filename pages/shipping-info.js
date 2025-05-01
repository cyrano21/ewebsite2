import React from "react";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import PageHeader from "../components/PageHeader";
import { AdvertisementDisplay } from "../components/Advertisement";

const ShippingInfo = () => {
  // Données sur les méthodes de livraison
  const shippingMethods = [
    {
      id: 1,
      name: "Livraison Standard",
      icon: "icofont-truck-alt",
      time: "3-5 jours ouvrables",
      price: "4,99€",
      description: "Notre méthode de livraison standard est disponible pour toutes les commandes. Votre colis sera livré à l'adresse indiquée sous 3 à 5 jours ouvrables."
    },
    {
      id: 2,
      name: "Livraison Express",
      icon: "icofont-fast-delivery",
      time: "1-2 jours ouvrables",
      price: "9,99€",
      description: "Notre service express permet de recevoir votre commande sous 1 à 2 jours ouvrables. Idéal si vous avez besoin de vos articles rapidement."
    },
    {
      id: 3,
      name: "Livraison Gratuite",
      icon: "icofont-gift",
      time: "4-6 jours ouvrables",
      price: "Gratuit",
      description: "La livraison gratuite est disponible pour toutes les commandes supérieures à 50€. Le délai de livraison est de 4 à 6 jours ouvrables."
    },
    {
      id: 4,
      name: "Retrait en Point Relais",
      icon: "icofont-location-pin",
      time: "2-4 jours ouvrables",
      price: "2,99€",
      description: "Faites-vous livrer dans l'un de nos nombreux points relais partenaires. Vous pourrez récupérer votre colis quand vous le souhaitez sous 2 à 4 jours ouvrables après expédition."
    }
  ];

  const faqItems = [
    {
      question: "Comment puis-je suivre ma commande ?",
      answer: "Une fois votre commande expédiée, vous recevrez un e-mail de confirmation avec un numéro de suivi. Vous pourrez utiliser ce numéro sur notre page 'Suivi de commande' pour connaître l'état de votre livraison en temps réel."
    },
    {
      question: "Que faire si je ne suis pas présent lors de la livraison ?",
      answer: "Si vous n'êtes pas présent lors de la livraison, le livreur laissera un avis de passage avec les instructions pour récupérer votre colis ou planifier une nouvelle livraison. Généralement, une deuxième tentative de livraison sera effectuée le jour ouvrable suivant."
    },
    {
      question: "Puis-je modifier l'adresse de livraison après avoir passé ma commande ?",
      answer: "Vous pouvez modifier l'adresse de livraison tant que votre commande n'a pas été expédiée. Pour cela, contactez notre service client dès que possible avec votre numéro de commande et la nouvelle adresse."
    },
    {
      question: "Livrez-vous à l'international ?",
      answer: "Oui, nous livrons dans de nombreux pays. Les frais de port et délais varient selon la destination. Vous pouvez vérifier les pays desservis et les tarifs lors du processus de paiement."
    },
    {
      question: "Que faire si mon colis est endommagé à la réception ?",
      answer: "Si votre colis est visiblement endommagé à la réception, nous vous recommandons de le refuser et de contacter immédiatement notre service client. Si vous avez déjà accepté le colis et découvert des dommages, contactez-nous dans les 48 heures avec des photos du colis et des produits endommagés."
    }
  ];

  return (
    <div className="shipping-info-page">
      <PageHeader title="Informations de Livraison" curPage="Livraison" />

      <Container className="py-5">
        {/* Publicité en haut de page */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <AdvertisementDisplay position="shipping_info" type="banner" />
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="fw-bold mb-3">Nos Options de Livraison</h2>
            <p className="text-muted">
              Nous vous proposons plusieurs options de livraison pour répondre à vos besoins. 
              Choisissez celle qui vous convient le mieux lors de votre commande.
            </p>
          </Col>
        </Row>

        <Row className="mb-5">
          {shippingMethods.map((method) => (
            <Col md={6} lg={3} className="mb-4" key={method.id}>
              <Card className="h-100 shipping-card text-center">
                <Card.Body>
                  <div className="shipping-icon mb-3">
                    <i className={method.icon}></i>
                  </div>
                  <Card.Title className="shipping-title">{method.name}</Card.Title>
                  <div className="shipping-time mb-2">{method.time}</div>
                  <div className="shipping-price mb-3">{method.price}</div>
                  <Card.Text className="shipping-desc">
                    {method.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <h3 className="fw-bold mb-4">Comment fonctionne notre livraison</h3>
            <div className="shipping-process">
              <div className="process-step">
                <div className="step-number">1</div>
                <h5>Commande confirmée</h5>
                <p>Une fois votre commande confirmée et votre paiement validé, votre colis est préparé dans notre entrepôt.</p>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <h5>Préparation du colis</h5>
                <p>Nos équipes préparent soigneusement votre commande et l&apos;emballent pour assurer sa protection pendant le transport.</p>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <h5>Expédition</h5>
                <p>Votre colis est remis à notre transporteur partenaire qui se charge de l&apos;acheminer jusqu&apos;à vous.</p>
              </div>
              <div className="process-step">
                <div className="step-number">4</div>
                <h5>Suivi de commande</h5>
                <p>Vous recevez un e-mail avec un numéro de suivi pour suivre l&apos;acheminement de votre colis en temps réel.</p>
              </div>
              <div className="process-step">
                <div className="step-number">5</div>
                <h5>Livraison</h5>
                <p>Votre commande est livrée à l&apos;adresse indiquée selon la méthode de livraison choisie.</p>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={10} className="mx-auto">
            <h3 className="fw-bold mb-4">Questions fréquentes sur la livraison</h3>
            <Accordion>
              {faqItems.map((item, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                  <Accordion.Header>{item.question}</Accordion.Header>
                  <Accordion.Body>
                    {item.answer}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
        
        {/* Publicité en bas de page */}
        <Row className="mt-5">
          <Col lg={10} className="mx-auto">
            <AdvertisementDisplay position="shipping_info" type="featured" />
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .shipping-card {
          transition: transform 0.3s ease;
          border-radius: 10px;
          border: none;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        .shipping-card:hover {
          transform: translateY(-5px);
        }
        .shipping-icon {
          font-size: 3rem;
          color: #0d6efd;
        }
        .shipping-title {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .shipping-time {
          color: #6c757d;
          font-size: 0.9rem;
        }
        .shipping-price {
          font-weight: bold;
          color: #198754;
          font-size: 1.2rem;
        }
        .shipping-desc {
          font-size: 0.9rem;
          color: #6c757d;
        }
        .shipping-process {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          position: relative;
          margin-bottom: 2rem;
        }
        .shipping-process:before {
          content: "";
          position: absolute;
          top: 30px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e9ecef;
          z-index: -1;
        }
        .process-step {
          flex: 1;
          min-width: 170px;
          text-align: center;
          padding: 0 15px;
          margin-bottom: 30px;
          position: relative;
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
          margin: 0 auto 15px;
          position: relative;
          z-index: 1;
        }
        .accordion-button:not(.collapsed) {
          background-color: #f8f9fa;
          color: #0d6efd;
          box-shadow: none;
        }
        .accordion-button:focus {
          box-shadow: none;
          border-color: #dee2e6;
        }
      `}</style>
    </div>
  );
};

export default ShippingInfo;
