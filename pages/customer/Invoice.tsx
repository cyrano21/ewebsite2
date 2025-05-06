import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/base/Button';
import Section from 'components/base/Section';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { defaultBreadcrumbItems } from 'data/commonData';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import {
  faBagShopping,
  faDownload,
  faPrint
} from '@fortawesome/free-solid-svg-icons';

// Import dynamique du composant EcomInvoiceTable avec SSR désactivé
const EcomInvoiceTable = dynamic(
  () => import('components/tables/EcomInvoiceTable'),
  { ssr: false }
);

// Import dynamique du composant Image de Next.js avec SSR désactivé
const ImageWithNoSSR = dynamic(
  () => import('next/image'),
  { ssr: false }
);

const Invoice = () => {
  // État pour vérifier si on est côté client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marquer qu'on est côté client après le montage du composant
    setIsClient(true);
  }, []);

  // Afficher un placeholder pendant le chargement côté client
  if (!isClient) {
    return (
      <div className="pt-5 pb-9 bg-body-emphasis dark__bg-gray-1200 border-top">
        <Section small className="py-0">
          <PageBreadcrumb items={defaultBreadcrumbItems} />
          <div className="d-flex gap-2 justify-content-between align-items-end mb-4">
            <h2 className="mb-0 flex-1">Facture</h2>
          </div>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement de la facture...</p>
          </div>
        </Section>
      </div>
    );
  }

  // Rendu principal (uniquement côté client)
  return (
    <div className="pt-5 pb-9 bg-body-emphasis dark__bg-gray-1200 border-top">
      <Section small className="py-0">
        <PageBreadcrumb items={defaultBreadcrumbItems} />
        <div className="d-flex gap-2 justify-content-between align-items-end mb-4">
          <h2 className="mb-0 flex-1">Facture</h2>
          <Button variant="phoenix-secondary">
            <FontAwesomeIcon icon={faDownload} className="me-sm-2" />
            <span className="d-none d-sm-inline-block">Télécharger la facture</span>
          </Button>
          <Button variant="phoenix-secondary">
            <FontAwesomeIcon icon={faPrint} className="me-sm-2" />
            <span className="d-none d-sm-inline-block">Imprimer</span>
          </Button>
        </div>

        <div className="bg-body dark__bg-gray-1100 p-4 mb-4 rounded-2">
          <Row className="g-4">
            <Col xs={12} lg={3}>
              <Row className="g-4 g-lg-2">
                <Col xs={12} sm={6} lg={12}>
                  <Row className="align-items-center g-0">
                    <Col xs="auto" lg={6} xl={5}>
                      <h6 className="mb-0 me-3">N° Facture :</h6>
                    </Col>
                    <Col xs="auto" lg={6} xl={7}>
                      <p className="fs-9 text-body-secondary fw-semibold mb-0">
                        #FLR978282
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} sm={6} lg={12}>
                  <Row className="align-items-center g-0">
                    <Col xs="auto" lg={6} xl={5}>
                      <h6 className="me-3">Date de facture :</h6>
                    </Col>
                    <Col xs="auto" lg={6} xl={7}>
                      <p className="fs-9 text-body-secondary fw-semibold mb-0">
                        19.06.2023
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={6} lg={5}>
              <Row className="g-4 gy-lg-5">
                <Col xs={12} lg={8}>
                  <h6 className="mb-2 me-3">Vendu par :</h6>
                  <p className="fs-9 text-body-secondary fw-semibold mb-0">
                    PhoenixMart
                    <br />
                    36 rue Greendowm, Californie, USA
                  </p>
                </Col>
                <Col xs={12} lg={4}>
                  <h6 className="mb-2">N° SIRET :</h6>
                  <p className="fs-9 text-body-secondary fw-semibold mb-0">
                    XVCJ963782008
                  </p>
                </Col>
                <Col xs={12} lg={4}>
                  <h6 className="mb-2">N° TVA :</h6>
                  <p className="fs-9 text-body-secondary fw-semibold mb-0">
                    IX9878123TC
                  </p>
                </Col>
                <Col xs={12} lg={4}>
                  <h6 className="mb-2">N° Commande :</h6>
                  <p className="fs-9 text-body-secondary fw-semibold mb-0">
                    A-8934792734
                  </p>
                </Col>
                <Col xs={12} lg={4}>
                  <h6 className="mb-2">Date de commande :</h6>
                  <p className="fs-9 text-body-secondary fw-semibold mb-0">
                    19.06.2023
                  </p>
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Row className="g-4">
                <Col xs={12} lg={6}>
                  <h6 className="mb-2">Adresse de facturation :</h6>
                  <div className="fs-9 text-body-secondary fw-semibold mb-0">
                    <p className="mb-2">Jean Dupont,</p>
                    <p className="mb-2">
                      36, rue du Centre,
                      <br />
                      75001 Paris, France
                    </p>
                    <p className="mb-2">jeandupont@email.com</p>
                    <p className="mb-0">+33612345678</p>
                  </div>
                </Col>
                <Col xs={12} lg={6}>
                  <h6 className="mb-2">Adresse de livraison :</h6>
                  <div className="fs-9 text-body-secondary fw-semibold mb-0">
                    <p className="mb-2">Jean Dupont,</p>
                    <p className="mb-2">
                      36, rue du Centre,
                      <br />
                      75001 Paris, France
                    </p>
                    <p className="mb-2">jeandupont@email.com</p>
                    <p className="mb-0">+33612345678</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        {/* Le tableau de facture est maintenant chargé dynamiquement sans SSR */}
        <EcomInvoiceTable />

        <div className="text-end py-9 border-bottom">
          <div style={{ width: '200px', height: '50px', position: 'relative', marginLeft: 'auto', marginBottom: '12px' }}>
            {/* Image chargée dynamiquement sans SSR */}
            <ImageWithNoSSR 
              src="/assets/img/logos/phoenix-mart.png" 
              alt="phoenix-mart" 
              layout="fill" 
              objectFit="contain"
            />
          </div>
          <h4>Signature autorisée</h4>
        </div>

        <div className="text-center py-4 mb-9">
          <p className="mb-0">
            Merci pour votre achat chez Phoenix | 2023 ©{' '}
            <a href="https://themewagon.com/">Themewagon</a>
          </p>
        </div>

        <div className="d-flex justify-content-between">
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faBagShopping} className="me-2" />
            Continuer vos achats
          </button>
          <div>
            <button className="btn btn-phoenix-secondary me-2">
              <FontAwesomeIcon icon={faDownload} className="me-sm-2" />
              <span className="d-none d-sm-inline-block">Télécharger la facture</span>
            </button>
            <button className="btn btn-phoenix-secondary">
              <FontAwesomeIcon icon={faPrint} className="me-sm-2" />
              <span className="d-none d-sm-inline-block">Imprimer</span>
            </button>
          </div>
        </div>
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

export default Invoice;
