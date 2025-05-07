import { Col, Container, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ecom4 from '../../assets/img/e-commerce/4.png';
import '../../styles/homepage.css'; // Import du fichier CSS externe

// Import dynamique des composants avec SSR désactivé
const EcomCategoryNavs = dynamic(
  () => import('../../components/navs/EcomCategoryNavs'),
  { ssr: false }
);

const EcomWhopingBanner = dynamic(
  () => import('../../components/banners/EcomWhopingBanner'),
  { ssr: false }
);

const EcomGiftItemsBanner = dynamic(
  () => import('../../components/banners/EcomGiftItemsBanner'),
  { ssr: false }
);

const EcomBestInMarketBanner = dynamic(
  () => import('../../components/banners/EcomBestInMarketBanner'),
  { ssr: false }
);

const EcomTopDeals = dynamic(
  () => import('../../components/sliders/EcomTopDeals'),
  { ssr: false }
);

const EcomTopElectronics = dynamic(
  () => import('../../components/sliders/EcomTopElectronics'),
  { ssr: false }
);

const EcomBestOffers = dynamic(
  () => import('../../components/sliders/EcomBestOffers'),
  { ssr: false }
);

const EcomBecomeMember = dynamic(
  () => import('../../components/cta/EcomBecomeMember'),
  { ssr: false }
);

const Homepage = () => {
  // État pour vérifier si on est côté client
  const [isClient, setIsClient] = useState(false);
  const [productsData, setProductsData] = useState({
    topDealsProducts: [],
    topElectronicProducts: [],
    bestOfferProducts: []
  });

  useEffect(() => {
    // Marquer qu'on est côté client après le montage du composant
    setIsClient(true);
    
    // Chargement des données côté client seulement
    import('../../data/e-commerce/products').then((module) => {
      setProductsData({
        topDealsProducts: module.topDealsProducts,
        topElectronicProducts: module.topElectronicProducts,
        bestOfferProducts: module.bestOfferProducts
      });
    });
  }, []);

  // Afficher un placeholder pendant le chargement côté client
  if (!isClient) {
    return (
      <div className="ecommerce-homepage pt-5 mb-9">
        <section className="py-0 px-xl-3">
          <Container className="px-xl-0 px-xxl-3">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-3">Chargement de la page d'accueil...</p>
            </div>
          </Container>
        </section>
      </div>
    );
  }

  // Rendu principal (uniquement côté client)
  return (
    <div className="ecommerce-homepage pt-5 mb-9">
      <section className="py-0">
        <div className="container-small">
          <div className="scrollbar">
            <EcomCategoryNavs />
          </div>
        </div>
      </section>
      <section className="py-0 px-xl-3">
        <Container className="px-xl-0 px-xxl-3">
          <Row className="g-3 mb-9">
            <Col xs={12}>
              <EcomWhopingBanner />
            </Col>
            <Col xs={12} xl={6}>
              <EcomGiftItemsBanner />
            </Col>
            <Col xs={12} xl={6}>
              <EcomBestInMarketBanner />
            </Col>
          </Row>
          <Row className="g-4 mb-6">
            <Col xs={12} lg={9} xxl={10}>
              {/* @ts-ignore */}
              <EcomTopDeals products={productsData.topDealsProducts} />
            </Col>
            <Col lg={3} xxl={2} className="d-none d-lg-block">
              <div className="h-100 position-relative rounded-3 overflow-hidden">
                <div
                  className="bg-holder product-bg"
                />
              </div>
            </Col>
          </Row>
          <div className="mb-6">
            {/* @ts-ignore */}
            <EcomTopElectronics products={productsData.topElectronicProducts} />
          </div>
          <div className="mb-6">
            {/* @ts-ignore */}
            <EcomBestOffers products={productsData.bestOfferProducts} />
          </div>
          <EcomBecomeMember />
        </Container>
      </section>
    </div>
  );
};

// Utiliser getServerSideProps pour éviter les erreurs de pré-rendu
export async function getServerSideProps() {
  return {
    props: {}, // Les données seront chargées côté client
  };
}

export default Homepage;
