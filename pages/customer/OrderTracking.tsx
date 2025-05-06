import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/base/Button';
import Section from 'components/base/Section';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import { defaultBreadcrumbItems } from 'data/commonData';
import { Col, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Import dynamique des composants avec SSR désactivé
const Mapbox = dynamic(
  () => import('components/base/MapBox'),
  { ssr: false }
);

const OrderTrackingTimeline = dynamic(
  () => import('components/timelines/OrderTrackingTimeline'),
  { ssr: false }
);

const OrderTracking = () => {
  // État pour vérifier si on est côté client
  const [isClient, setIsClient] = useState(false);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    // Marquer qu'on est côté client après le montage du composant
    setIsClient(true);
    
    // Importer les données côté client seulement
    import('data/timelineData').then((module) => {
      setTimelineData(module.orderTrackingTimelineData);
    });
  }, []);

  // Afficher un placeholder pendant le chargement côté client
  if (!isClient) {
    return (
      <div className="pt-5 mb-9">
        <Section small className="py-0">
          <PageBreadcrumb items={defaultBreadcrumbItems} />
          <div className="d-flex gap-3 flex-wrap justify-content-between align-items-end mb-5">
            <div>
              <h2>Suivi de commande #234</h2>
            </div>
          </div>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des informations de suivi...</p>
          </div>
        </Section>
      </div>
    );
  }

  // Rendu principal (uniquement côté client)
  return (
    <div className="pt-5 mb-9">
      <Section small className="py-0">
        <PageBreadcrumb items={defaultBreadcrumbItems} />
        <div className="d-flex gap-3 flex-wrap justify-content-between align-items-end mb-5">
          <div>
            <h2>Suivi de commande #234</h2>
            <p className="text-body-secondary mb-0">
              Paiement via{' '}
              <a className="fw-bold" href="#!">
                Paiement à la livraison
              </a>
              ,<br className="d-sm-none" />
              <span className="ms-sm-1">12 Nov. 2023, 08:54.</span>
            </p>
          </div>
          <Button variant="outline-primary">
            <FontAwesomeIcon icon={faPhone} className="me-2" />
            Contacter le support
          </Button>
        </div>
        <Row className="gy-9 gx-5">
          <Col xs={12} lg={6}>
            <Mapbox
              className="border rounded-3 min-vh-50"
              options={{
                center: [-74.0020158, 40.7228022],
                zoom: 15,
                scrollZoom: false
              }}
            />
          </Col>
          <Col xs={12} lg={6}>
            <OrderTrackingTimeline data={timelineData} />
          </Col>
        </Row>
      </Section>
    </div>
  );
};

// Utiliser getServerSideProps pour éviter les erreurs de pré-rendu
export async function getServerSideProps() {
  return {
    props: {}, // Les données seront chargées côté client
  };
}

export default OrderTracking;
