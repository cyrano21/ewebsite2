import { faKey, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/base/Button';
import Section from 'components/base/Section';
import EcoimDefaultAddressCard from 'components/cards/EcoimDefaultAddressCard';
import EcomProfileCard from 'components/cards/EcomProfileCard';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import ProfileDetailsTab from 'components/modules/e-commerce/profile/ProfileDetailsTab';
import { defaultBreadcrumbItems } from 'data/commonData';
import { Col, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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
  
  // Vérifier si nous sommes côté client
  const isClient = typeof window !== 'undefined';

  useEffect(() => {
    if (isClient) {
      // Dans une application réelle, vous récupéreriez les données 
      // de l'utilisateur connecté depuis votre API ou Firebase
      
      // Simuler un chargement des données
      const timer = setTimeout(() => {
        setUser(defaultUser);
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isClient]);

  const handleLogout = () => {
    // Logique de déconnexion
    alert('Déconnexion');
    router.push('/login');
  };

  return (
    <div className="pt-5 mb-9">
      <Section small className="py-0">
        <PageBreadcrumb items={defaultBreadcrumbItems} />
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
            <EcomProfileCard user={user} onLogout={handleLogout} />
          </Col>
          <Col xs={12} lg={4}>
            <EcoimDefaultAddressCard />
          </Col>
        </Row>
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
