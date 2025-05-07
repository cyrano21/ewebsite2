import { faKey, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/base/Button';
import Section from '../../components/base/Section';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { defaultBreadcrumbItems } from '../../data/commonData';
import { Col, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Import dynamique des composants avec SSR désactivé
const EcoimDefaultAddressCard = dynamic(
  () => import('../../components/cards/EcoimDefaultAddressCard'),
  { ssr: false }
);

const EcomProfileCard = dynamic(
  () => import('../../components/cards/EcomProfileCard'),
  { ssr: false }
);

const ProfileDetailsTab = dynamic(
  () => import('../../components/modules/e-commerce/profile/ProfileDetailsTab'),
  { ssr: false }
);

// Exemple de données utilisateur par défaut
const defaultUser = {
  displayName: 'Utilisateur',
  email: 'utilisateur@exemple.com',
  photoURL: null,
  coverImage: null,
  ordersCount: 0,
  reviewsCount: 0,
  wishlistCount: 0
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // État pour vérifier si on est côté client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marquer qu'on est côté client après le montage du composant
    setIsClient(true);
    
    // Dans une application réelle, vous récupéreriez les données 
    // de l'utilisateur connecté depuis votre API ou Firebase
    
    // Simuler un chargement des données
    const timer = setTimeout(() => {
      setUser(defaultUser);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    // Logique de déconnexion
    alert('Déconnexion');
    router.push('/login');
  };

  // Afficher un placeholder pendant le chargement côté client
  if (!isClient) {
    return (
      <div className="pt-5 mb-9">
        <Section small className="py-0">
          <PageBreadcrumb items={defaultBreadcrumbItems} className="" />
          <Row className="align-items-center justify-content-between g-3 mb-4">
            <Col xs="auto">
              <h2 className="mb-0">Profil</h2>
            </Col>
          </Row>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement de votre profil...</p>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-5 mb-9">
      <Section small className="py-0">
        <PageBreadcrumb items={defaultBreadcrumbItems} className="" />
        <Row className="align-items-center justify-content-between g-3 mb-4">
          <Col xs="auto">
            <h2 className="mb-0">Profil</h2>
          </Col>
          <Col xs="auto" className="d-flex flex-wrap gap-2 gap-sm-3">
            <Button
              variant="phoenix-danger"
              startIcon={<FontAwesomeIcon className="me-2" icon={faTrashAlt} />}
            >
              Supprimer compte
            </Button>
            <Button
              variant="phoenix-secondary"
              startIcon={<FontAwesomeIcon className="me-2" icon={faKey} />}
            >
              Réinitialiser mot de passe
            </Button>
          </Col>
        </Row>
        <Row className="g-3 mb-6">
          <Col xs={12} lg={8}>
            {/* @ts-ignore - Ignorer les erreurs de typage pour ce composant */}
            <EcomProfileCard user={user} onLogout={handleLogout} />
          </Col>
          <Col xs={12} lg={4}>
            <EcoimDefaultAddressCard />
          </Col>
        </Row>
        {/* @ts-ignore - Ignorer les erreurs de typage pour ce composant */}
        <ProfileDetailsTab user={user} />
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

export default Profile;
