import Section from 'components/base/Section';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import { defaultBreadcrumbItems } from 'data/commonData';
import { Button, Col, Form, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Import dynamique du composant avec SSR désactivé
const CheckoutSummaryCard = dynamic(
  () => import('components/modules/e-commerce/checkout/CheckoutSummaryCard'),
  { ssr: false }
);

const ShippingInfo = () => {
  // État pour vérifier si on est côté client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marquer qu'on est côté client après le montage du composant
    setIsClient(true);
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
            <p className="mt-3">Chargement des informations de livraison...</p>
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
        <Row className="justify-content-between gy-6 gx-5">
          <Col lg={7}>
            <h3 className="mb-5">Informations de livraison</h3>
            <Row className="g-4">
              <Col xs={12}>
                <Form.Group>
                  <label className="form-label text-transform-none ps-0 fs-8 text-body-highlight">
                    Nom complet
                  </label>
                  <Form.Control type="text" placeholder="Nom complet" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <label className="form-label text-transform-none ps-0 fs-8 text-body-highlight">
                    Email
                  </label>
                  <Form.Control type="email" placeholder="Email" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <label className="form-label text-transform-none ps-0 fs-8 text-body-highlight">
                    Téléphone
                  </label>
                  <Form.Control type="tel" placeholder="+33612345678" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <label className="form-label text-transform-none ps-0 fs-8 text-body-highlight">
                    Adresse ligne 1
                  </label>
                  <Form.Control type="text" placeholder="Adresse ligne 1" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <label className="form-label text-transform-none ps-0 fs-8 text-body-highlight">
                    Adresse ligne 2
                  </label>
                  <Form.Control type="text" placeholder="Adresse ligne 2" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <label className="form-label text-transform-none ps-0 fs-8 text-body-highlight">
                    Ville
                  </label>
                  <Form.Select defaultValue="paris">
                    <option value="paris">Paris</option>
                    <option value="lyon">Lyon</option>
                    <option value="marseille">Marseille</option>
                    <option value="toulouse">Toulouse</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <label className="form-label text-transform-none ps-0 fs-8 text-body-highlight">
                    Département
                  </label>
                  <Form.Select defaultValue="paris">
                    <option value="paris">Paris</option>
                    <option value="rhone">Rhône</option>
                    <option value="bouches-du-rhone">Bouches-du-Rhône</option>
                    <option value="haute-garonne">Haute-Garonne</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <label className="form-label text-transform-none ps-0 fs-8 text-body-highlight">
                    Code postal
                  </label>
                  <Form.Control type="text" placeholder="Code postal" />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <label className="form-label text-transform-none ps-0 fs-8 text-body-highlight">
                    Pays
                  </label>
                  <Form.Select defaultValue="france">
                    <option value="france">France</option>
                    <option value="belgique">Belgique</option>
                    <option value="suisse">Suisse</option>
                    <option value="canada">Canada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Button className="px-8 px-sm-11 me-2" type="submit">
                  Enregistrer
                </Button>
                <Button
                  variant="phoenix-secondary"
                  className="text-nowrap"
                  type="button"
                >
                  Quitter sans enregistrer
                </Button>
              </Col>
            </Row>
          </Col>
          <Col lg={5} xl={{ span: 4, offset: 1 }}>
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

export default ShippingInfo;
