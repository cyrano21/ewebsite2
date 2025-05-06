import Button from 'components/base/Button';
import Section from 'components/base/Section';
import { Col, Form, Row } from 'react-bootstrap';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import { defaultBreadcrumbItems } from 'data/commonData';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Import dynamique des composants avec SSR désactivé
const EcomAddressTable = dynamic(
  () => import('components/tables/EcomAddressTable'),
  { ssr: false }
);

const DeliveryType = dynamic(
  () => import('components/modules/e-commerce/checkout/DeliveryType'),
  { ssr: false }
);

const PaymentMethod = dynamic(
  () => import('components/modules/e-commerce/checkout/PaymentMethod'),
  { ssr: false }
);

const CheckoutSummaryCard = dynamic(
  () => import('components/modules/e-commerce/checkout/CheckoutSummaryCard'),
  { ssr: false }
);

// Fonction locale pour formater les montants
const currencyFormat = (value) => {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  } catch (error) {
    console.error('Erreur de formatage du prix:', error);
    return `${value} €`;
  }
};

const Checkout = () => {
  // État pour vérifier si on est côté client
  const [isClient, setIsClient] = useState(false);
  const [shippingDetailsAddress, setShippingDetailsAddress] = useState([]);

  useEffect(() => {
    // Marquer qu'on est côté client après le montage du composant
    setIsClient(true);
    
    // Importer les données côté client seulement
    import('data/e-commerce').then((module) => {
      setShippingDetailsAddress(module.shippingDetailsAddress);
    });
  }, []);

  // Afficher un placeholder pendant le chargement côté client
  if (!isClient) {
    return (
      <div className="pt-5 mb-9">
        <Section small className="py-0">
          <PageBreadcrumb items={defaultBreadcrumbItems} />
          <h2 className="mb-5">Paiement</h2>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des informations de paiement...</p>
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
        <h2 className="mb-5">Paiement</h2>
        <Row className="justify-content-between">
          <Col lg={7}>
            <form>
              <div className="d-flex align-items-end mb-4">
                <h3 className="mb-0 me-3">Détails de livraison</h3>
                <Button variant="link" className="p-0" type="button">
                  Modifier
                </Button>
              </div>
              <EcomAddressTable data={shippingDetailsAddress} />
              <hr className="my-6" />
              <h3>Détails de facturation</h3>
              <Form.Check type="checkbox" id="sameAsShipping" className="mb-4">
                <Form.Check.Input type="checkbox" />
                <Form.Check.Label className="fs-8 fw-normal">
                  Identique à l'adresse de livraison
                </Form.Check.Label>
              </Form.Check>
              <EcomAddressTable data={shippingDetailsAddress} />
              <hr className="my-6" />
              <DeliveryType />
              <hr className="my-6" />
              <PaymentMethod />

              <div className="d-flex flex-column flex-sm-row gap-2 mb-7 mb-lg-0">
                <Button variant="primary" type="submit" className="w-100">
                  Payer {isClient ? currencyFormat(695.2) : '695,20 €'}
                </Button>

                <Button
                  variant="phoenix-secondary"
                  type="submit"
                  className="text-nowrap"
                >
                  Enregistrer et quitter
                </Button>
              </div>
            </form>
          </Col>
          <Col lg={5} xl={4}>
            <CheckoutSummaryCard />
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

export default Checkout;
