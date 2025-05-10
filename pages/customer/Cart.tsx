import Section from '../../components/base/Section';
import { defaultBreadcrumbItems, PageBreadcrumbItem } from '../../data/commonData';
import { Col, Row } from 'react-bootstrap';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import dynamique des composants avec SSR désactivé mais en utilisant require() pour éviter les erreurs TypeScript
// @ts-ignore - Ignorer les erreurs TypeScript pour ces imports spécifiques
const PageBreadcrumb = dynamic(() => Promise.resolve(require('../../components/common/PageBreadcrumb')), {
  ssr: false
});

// @ts-ignore - Ignorer les erreurs TypeScript pour ces imports spécifiques
const EcomCartSummaryCard = dynamic(() => Promise.resolve(require('../../components/cards/EcomCartSummaryCard')), {
  ssr: false
});

// @ts-ignore - Ignorer les erreurs TypeScript pour ces imports spécifiques
const EcomCartTable = dynamic(() => Promise.resolve(require('../../components/tables/EcomCartTable')), {
  ssr: false
});

// Définition du type pour les produits du panier
type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  total?: number;
};

interface CartProps {
  initialCartItems: CartItem[];
}

const Cart = ({ initialCartItems }: CartProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  
  // État pour vérifier si on est côté client
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Marquer qu'on est côté client après le montage du composant
    setIsClient(true);
    
    // Cette fonction pourrait être utilisée pour rafraîchir les données du panier
    const fetchCartItems = async () => {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    };
    
    // Commenté pour l'instant car l'API n'est peut-être pas encore implémentée
    // fetchCartItems();
  }, []);

  // Afficher un placeholder pendant le chargement côté client
  if (!isClient) {
    return (
      <div className="pt-5 mb-9">
        <Section small className="py-0">
          {/* @ts-ignore - Ignorer les erreurs TypeScript pour l'utilisation du composant */}
          <PageBreadcrumb items={defaultBreadcrumbItems} />
          <h2 className="mb-6">Panier</h2>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement de votre panier...</p>
          </div>
        </Section>
      </div>
    );
  }

  // Rendu principal (uniquement côté client)
  return (
    <div className="pt-5 mb-9">
      <Section small className="py-0">
        {/* @ts-ignore - Ignorer les erreurs TypeScript pour l'utilisation du composant */}
        <PageBreadcrumb items={defaultBreadcrumbItems} />
        <h2 className="mb-6">Panier</h2>
        <Row className="g-5">
          <Col xs={12} lg={8}>
            {cartItems.length > 0 ? (
              // @ts-ignore - Ignorer les erreurs TypeScript pour l'utilisation du composant
              (<EcomCartTable products={cartItems} />)
            ) : (
              <div className="text-center p-5 bg-light rounded">
                <h4>Votre panier est vide</h4>
                <p>Parcourez notre boutique pour ajouter des produits à votre panier</p>
              </div>
            )}
          </Col>
          <Col xs={12} lg={4}>
            {/* @ts-ignore - Ignorer les erreurs TypeScript pour l'utilisation du composant */}
            <EcomCartSummaryCard />
          </Col>
        </Row>
      </Section>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Ici, vous pourriez récupérer les données du panier depuis votre API MongoDB
  // en utilisant l'ID utilisateur stocké dans la session/cookie
  try {
    // Cette partie serait remplacée par un vrai appel API
    // const response = await fetch(`${process.env.API_URL}/api/cart`, {
    //   headers: { Cookie: context.req.headers.cookie || '' }
    // });
    // const cartItems = await response.json();
    
    // Pour l'instant, nous utilisons un tableau vide ou des données de test
    // jusqu'à ce que l'API soit complètement implémentée
    const cartItems: CartItem[] = [];
    
    return {
      props: {
        initialCartItems: cartItems
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données du panier:', error);
    return {
      props: {
        initialCartItems: []
      }
    };
  }
};

export default Cart;
