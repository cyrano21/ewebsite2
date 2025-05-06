import Section from '../../components/base/Section';
import EcomCartSummaryCard from '../../components/cards/EcomCartSummaryCard';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import EcomCartTable from '../../components/tables/EcomCartTable';
import { defaultBreadcrumbItems } from '../../data/commonData';
import { Col, Row } from 'react-bootstrap';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';

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
  
  // Exemple de hook pour charger les données du panier depuis l'API
  useEffect(() => {
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

  return (
    <div className="pt-5 mb-9">
      <Section small className="py-0">
        <PageBreadcrumb items={defaultBreadcrumbItems} />
        <h2 className="mb-6">Panier</h2>
        <Row className="g-5">
          <Col xs={12} lg={8}>
            {cartItems.length > 0 ? (
              <EcomCartTable products={cartItems} />
            ) : (
              <div className="text-center p-5 bg-light rounded">
                <h4>Votre panier est vide</h4>
                <p>Parcourez notre boutique pour ajouter des produits à votre panier</p>
              </div>
            )}
          </Col>
          <Col xs={12} lg={4}>
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
