import Section from 'components/base/Section';
import { Col, Form, Row } from 'react-bootstrap';
import { defaultBreadcrumbItems } from 'data/commonData';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Déclaration de types pour les composants importés dynamiquement
interface DeliveryTypeProps {
  deliveryOptions?: any[];
  selectedDeliveryId?: string;
  onSelectDelivery: (id: string) => void;
  className?: string;
}

interface ButtonProps {
  variant?: 'link' | 'danger' | 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'dark' | 'light' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-dark' | 'outline-light';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
  [key: string]: any;
}

interface PageBreadcrumbProps {
  items: any[];
  [key: string]: any;
}

interface EcomAddressTableProps {
  addresses?: any[];
  selectedAddressId: any;
  onSelectAddress: any;
  onEditAddress: any;
  onDeleteAddress: any;
  onAddAddress: any;
}

interface PaymentMethodProps {
  paymentMethods?: any[];
  selectedPaymentMethod?: any;
  onSelectPayment: any;
  className?: string;
}

interface CheckoutSummaryCardProps {
  small?: boolean;
  // Autres props nécessaires
  [key: string]: any;
}

// Définition locale des options de livraison
const DEFAULT_DELIVERY_OPTIONS = [
  {
    id: 'standard',
    title: 'Livraison standard',
    description: 'Livraison en 3-5 jours ouvrables',
    price: 4.99,
    icon: 'truck'
  },
  {
    id: 'express',
    title: 'Livraison express',
    description: 'Livraison en 1-2 jours ouvrables',
    price: 9.99,
    icon: 'zap'
  },
  {
    id: 'free',
    title: 'Livraison gratuite',
    description: 'Livraison en 5-7 jours ouvrables',
    price: 0,
    icon: 'gift'
  }
];

// Import dynamique des composants avec SSR désactivé
const Button = dynamic<ButtonProps>(() => import('components/base/Button'), {
  ssr: false
});

const PageBreadcrumb = dynamic<PageBreadcrumbProps>(() => import('components/common/PageBreadcrumb'), {
  ssr: false
});

const EcomAddressTable = dynamic<EcomAddressTableProps>(() => import('components/tables/EcomAddressTable'), {
  ssr: false
});

const DeliveryType = dynamic<DeliveryTypeProps>(
  () => import('components/modules/e-commerce/checkout/DeliveryType'),
  { ssr: false }
);

const PaymentMethod = dynamic<PaymentMethodProps>(
  () => import('components/modules/e-commerce/checkout/PaymentMethod'),
  { ssr: false }
);

const CheckoutSummaryCard = dynamic<CheckoutSummaryCardProps>(
  () => import('components/modules/e-commerce/checkout/CheckoutSummaryCard'),
  { ssr: false }
);

// Fonction locale pour formater les montants
const currencyFormat = (value: number) => {
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

// Définition du type pour les éléments du fil d'Ariane
type PageBreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

const Checkout = () => {
  // État pour vérifier si on est côté client
  const [isClient, setIsClient] = useState(false);
  const [shippingDetailsAddress, setShippingDetailsAddress] = useState<any[]>([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>('standard');
  const [deliveryOptions, setDeliveryOptions] = useState(DEFAULT_DELIVERY_OPTIONS);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  useEffect(() => {
    // Marquer qu'on est côté client après le montage du composant
    setIsClient(true);
    
    // Importer les données d'adresse côté client seulement
    import('data/e-commerce').then((module) => {
      setShippingDetailsAddress(module.shippingDetailsAddress || []);
    });
  }, []);

  // Gestionnaire pour la sélection du mode de livraison
  const handleSelectDelivery = (id: string) => {
    setSelectedDeliveryId(id);
  };

  // Gestionnaire pour la sélection d'adresse
  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  // Gestionnaire pour la sélection du mode de paiement
  const handleSelectPayment = (id: string) => {
    setSelectedPaymentMethod(id);
  };

  // Simuler des gestionnaires pour les autres actions
  const handleEditAddress = (id: string) => {
    console.log('Édition de l\'adresse', id);
  };

  const handleDeleteAddress = (id: string) => {
    console.log('Suppression de l\'adresse', id);
  };

  const handleAddAddress = () => {
    console.log('Ajout d\'une nouvelle adresse');
  };

  // Définir les éléments du fil d'Ariane pour la page de paiement
  const breadcrumbItems: PageBreadcrumbItem[] = [
    ...defaultBreadcrumbItems,
    { label: 'Panier', href: '/customer/cart' },
    { label: 'Paiement', active: true }
  ];

  return (
    <Section className="py-0">
      {isClient && (
        <>
          <Row className="g-3 mb-3">
            <Col xs={12}>
              <PageBreadcrumb items={breadcrumbItems} />
            </Col>
          </Row>

          <Row className="g-5">
            <Col lg={8}>
              <div className="checkout-details">
                {/* Adresse de livraison */}
                <Row className="g-3 mb-5">
                  <Col xs={12}>
                    <h3 className="mb-3">Adresse de livraison</h3>
                    <EcomAddressTable 
                      addresses={shippingDetailsAddress}
                      selectedAddressId={selectedAddressId}
                      onSelectAddress={handleSelectAddress}
                      onEditAddress={handleEditAddress}
                      onDeleteAddress={handleDeleteAddress}
                      onAddAddress={handleAddAddress}
                    />
                  </Col>
                </Row>

                {/* Méthode de paiement */}
                <Row className="g-3 mb-5">
                  <Col xs={12}>
                    <h3 className="mb-3">Méthode de paiement</h3>
                    <PaymentMethod 
                      paymentMethods={[]}
                      selectedPaymentMethod={selectedPaymentMethod}
                      onSelectPayment={handleSelectPayment}
                    />
                  </Col>
                </Row>

                {/* Boutons de navigation */}
                <Row className="g-3 mb-5">
                  <Col>
                    <Button 
                      variant="secondary"
                      className="me-2"
                    >
                      Retour au panier
                    </Button>
                    <Button 
                      variant="primary"
                    >
                      Confirmer la commande
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Résumé de la commande */}
            <Col lg={4}>
              <CheckoutSummaryCard small={true} />
            </Col>
          </Row>
        </>
      )}
    </Section>
  );
};

export default Checkout;
