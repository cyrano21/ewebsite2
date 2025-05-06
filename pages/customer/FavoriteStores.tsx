import Section from 'components/base/Section';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import { defaultBreadcrumbItems } from 'data/commonData';
import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';

// Import dynamique du composant avec SSR désactivé
const StoreItem = dynamic(
  () => import('components/common/StoreItem'),
  { ssr: false }
);

const FavoriteStores = () => {
  // État pour vérifier si on est côté client
  const [isClient, setIsClient] = useState(false);
  // État pour gérer les magasins favoris
  const [favoriteStores, setFavoriteStores] = useState([]);
  
  useEffect(() => {
    // Marquer qu'on est côté client après le montage du composant
    setIsClient(true);
    
    // Chargement des données côté client seulement
    import('data/e-commerce/stores').then((module) => {
      // Dans une application réelle, vous récupéreriez les favoris 
      // de l'utilisateur connecté via une API
      setFavoriteStores(module.stores);
    });
  }, []);

  // Afficher un placeholder pendant le chargement côté client
  if (!isClient) {
    return (
      <div className="pt-5 mb-9">
        <Section small className="py-0">
          <PageBreadcrumb items={defaultBreadcrumbItems} />
          <div className="mb-5">
            <h2>Mes boutiques favorites</h2>
            <p className="mb-0 text-body-tertiary fw-semibold">
              Essentiel pour une vie meilleure
            </p>
          </div>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement de vos boutiques favorites...</p>
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
        <div className="mb-5">
          <h2>Mes boutiques favorites</h2>
          <p className="mb-0 text-body-tertiary fw-semibold">
            Essentiel pour une vie meilleure
          </p>
        </div>
        
        {favoriteStores.length > 0 ? (
          <Row className="gx-3 gy-5">
            {favoriteStores.map(store => (
              <Col key={store.name} xs={6} sm={4} md={3} lg={2}>
                <StoreItem store={store} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            <p className="mb-3 fs-5">Vous n'avez pas encore de boutiques favorites.</p>
            <a href="/shop" className="btn btn-primary">
              Découvrir des boutiques
            </a>
          </div>
        )}
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

export default FavoriteStores;
