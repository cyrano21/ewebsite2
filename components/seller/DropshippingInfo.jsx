
import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

const DropshippingInfo = () => {
  return (
    <section className="dropshipping-info py-5">
      <div className="container">
        <h2 className="text-center mb-4">Vendez sans stock avec notre solution de Dropshipping</h2>
        <p className="text-center mb-5">
          Notre plateforme vous permet de vendre des produits sans avoir à gérer les stocks ou l'expédition.
          Le fournisseur s'occupe de tout !
        </p>
        
        <Row className="g-4">
          <Col lg={4} md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="icofont-cart-alt text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <Card.Title>Aucun stock à gérer</Card.Title>
                <Card.Text>
                  Vous n'avez pas besoin d'acheter de stock à l'avance ou de gérer un entrepôt.
                  Les produits sont expédiés directement par nos fournisseurs partenaires.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="icofont-fast-delivery text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <Card.Title>Livraison automatisée</Card.Title>
                <Card.Text>
                  Lorsqu'un client passe une commande, elle est automatiquement transmise au fournisseur
                  qui s'occupe de l'emballage et de l'expédition.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="icofont-money text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <Card.Title>Marges intéressantes</Card.Title>
                <Card.Text>
                  Vous fixez vos propres prix et marges. Nous vous recommandons généralement une marge
                  de 30% minimum sur les produits en dropshipping.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <div className="mt-5 text-center">
          <h3 className="mb-4">Comment ça fonctionne ?</h3>
          <div className="position-relative">
            <div className="timeline-steps">
              <div className="timeline-step">
                <div className="timeline-content">
                  <div className="inner-circle bg-primary text-white">1</div>
                  <p className="h6 mt-3 mb-1">Sélectionnez vos produits</p>
                  <p className="text-muted mb-0">Parcourez notre catalogue de produits disponibles en dropshipping</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="timeline-content">
                  <div className="inner-circle bg-primary text-white">2</div>
                  <p className="h6 mt-3 mb-1">Ajoutez-les à votre boutique</p>
                  <p className="text-muted mb-0">Personnalisez les descriptions et fixez vos prix</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="timeline-content">
                  <div className="inner-circle bg-primary text-white">3</div>
                  <p className="h6 mt-3 mb-1">Recevez des commandes</p>
                  <p className="text-muted mb-0">Les clients achètent vos produits sur notre plateforme</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="timeline-content">
                  <div className="inner-circle bg-primary text-white">4</div>
                  <p className="h6 mt-3 mb-1">Nous gérons la livraison</p>
                  <p className="text-muted mb-0">Le fournisseur expédie directement au client</p>
                </div>
              </div>
              <div className="timeline-step mb-0">
                <div className="timeline-content">
                  <div className="inner-circle bg-primary text-white">5</div>
                  <p className="h6 mt-3 mb-1">Recevez vos commissions</p>
                  <p className="text-muted mb-0">Nous vous versons votre marge, moins les frais de service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-5 text-center">
          <Link href="/become-seller">
            <Button variant="primary" size="lg" className="px-5">
              Démarrer votre activité de dropshipping
            </Button>
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        .timeline-steps {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }
        .timeline-step {
          text-align: center;
          flex: 1;
          position: relative;
          margin: 0 15px;
        }
        .timeline-step:not(:last-child):after {
          content: '';
          position: absolute;
          width: 100%;
          height: 3px;
          background-color: #e0e0e0;
          top: 15px;
          left: 50%;
          z-index: -1;
        }
        .timeline-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .inner-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        @media (max-width: 767px) {
          .timeline-steps {
            flex-direction: column;
          }
          .timeline-step {
            margin-bottom: 30px;
          }
          .timeline-step:not(:last-child):after {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default DropshippingInfo;
