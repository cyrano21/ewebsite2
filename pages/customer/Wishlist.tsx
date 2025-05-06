import Section from 'components/base/Section';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import { defaultBreadcrumbItems } from 'data/commonData';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Import dynamique du composant avec SSR désactivé
const EcomWishlistTable = dynamic(
  () => import('components/tables/EcomWishlistTable'),
  { ssr: false }
);

const Wishlist = () => {
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
          <h2 className="mb-5">
            Liste de souhaits
            <span className="text-body-tertiary fw-normal ms-2">(--)</span>
          </h2>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement de votre liste de souhaits...</p>
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
        <h2 className="mb-5">
          Liste de souhaits
          <span className="text-body-tertiary fw-normal ms-2">(43)</span>
        </h2>
        <EcomWishlistTable />
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

export default Wishlist;
