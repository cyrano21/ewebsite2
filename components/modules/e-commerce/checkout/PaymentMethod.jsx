import React, { useState } from 'react';
import { Card, Form, InputGroup, Button, Collapse } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Image from 'next/image';

const PaymentMethod = ({
  paymentMethods = [],
  selectedPaymentMethod = null,
  onSelectPayment,
  className = ''
}) => {
  const router = useRouter();
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Si aucune méthode n'est fournie, utiliser des méthodes par défaut
  const methods = paymentMethods.length > 0 ? paymentMethods : [
    {
      id: 'creditCard',
      name: 'Carte de crédit / débit',
      description: 'Paiement sécurisé par carte bancaire',
      icon: '/assets/img/payment/visa.png',
      additionalIcons: [
        '/assets/img/payment/mastercard.png',
        '/assets/img/payment/amex.png'
      ],
      requiresForm: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Paiement via votre compte PayPal',
      icon: '/assets/img/payment/paypal.png',
      redirectUrl: 'https://www.paypal.com'
    },
    {
      id: 'applePay',
      name: 'Apple Pay',
      description: 'Paiement rapide et sécurisé avec Apple Pay',
      icon: '/assets/img/payment/apple-pay.png',
      isDisabled: !window?.ApplePaySession // Désactiver si Apple Pay n'est pas disponible
    }
  ];

  // Gestion de la sélection d'une méthode de paiement
  const handlePaymentSelection = (paymentId) => {
    const selectedMethod = methods.find(method => method.id === paymentId);
    
    if (selectedMethod && !selectedMethod.isDisabled) {
      if (onSelectPayment) {
        onSelectPayment(selectedMethod);
      }
      
      // Afficher le formulaire de carte si nécessaire
      if (selectedMethod.id === 'creditCard') {
        setShowCardForm(true);
      } else {
        setShowCardForm(false);
      }
      
      // Rediriger si nécessaire
      if (selectedMethod.redirectUrl) {
        // Dans une application réelle, vous devriez stocker l'état de la commande
        // avant de rediriger l'utilisateur
        window.open(selectedMethod.redirectUrl, '_blank');
      }
    }
  };

  // Mise à jour des informations de carte
  const handleCardInfoChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Formater automatiquement le numéro de carte
  const formatCardNumber = (value) => {
    // Supprimer tous les espaces existants
    let v = value.replace(/\s+/g, '');
    // Ajouter un espace tous les 4 chiffres
    let matches = v.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Formater automatiquement la date d'expiration
  const formatExpiryDate = (value) => {
    // Supprimer les caractères non numériques
    let v = value.replace(/[^\d]/g, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  // Gérer la soumission du formulaire de carte
  const handleCardSubmit = (e) => {
    e.preventDefault();
    
    // Ici, vous traiteriez normalement les informations de carte
    // par exemple en les envoyant à une API de paiement
    
    // Pour cet exemple, nous simulons simplement une validation
    if (cardInfo.cardNumber && cardInfo.cardName && cardInfo.expiryDate && cardInfo.cvv) {
      // Simuler un traitement réussi
      alert('Informations de carte enregistrées avec succès');
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  return (
    <div className={className}>
      <h5 className="mb-3">Méthode de paiement</h5>
      
      {methods.map(method => (
        <Card 
          key={method.id}
          className={`mb-3 payment-method ${selectedPaymentMethod === method.id ? 'border-primary' : ''} ${method.isDisabled ? 'opacity-50' : ''}`}
          style={{ cursor: method.isDisabled ? 'not-allowed' : 'pointer' }}
          onClick={() => !method.isDisabled && handlePaymentSelection(method.id)}
        >
          <Card.Body className="p-3">
            <Form.Check
              type="radio"
              id={`payment-method-${method.id}`}
              name="paymentMethod"
              className="d-flex align-items-start"
              checked={selectedPaymentMethod === method.id}
              onChange={() => handlePaymentSelection(method.id)}
              disabled={method.isDisabled}
              label={
                <div className="ms-2 flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <strong className="me-2">{method.name}</strong>
                      {method.isDisabled && <small className="text-danger">(Non disponible)</small>}
                    </div>
                    <div className="payment-icons d-flex align-items-center">
                      {method.icon && (
                        <div className="me-2">
                          <Image 
                            src={method.icon} 
                            alt={method.name}
                            width={40}
                            height={25}
                            objectFit="contain"
                          />
                        </div>
                      )}
                      {method.additionalIcons && method.additionalIcons.map((icon, index) => (
                        <div key={index} className="ms-1">
                          <Image 
                            src={icon} 
                            alt={`${method.name} option ${index + 1}`}
                            width={35}
                            height={22}
                            objectFit="contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-muted small mt-1">{method.description}</div>
                </div>
              }
            />
          </Card.Body>
        </Card>
      ))}
      
      {/* Formulaire de carte de crédit */}
      <Collapse in={showCardForm && selectedPaymentMethod === 'creditCard'}>
        <div>
          <Card className="mt-3 mb-4">
            <Card.Body>
              <h6 className="mb-3">Entrez les informations de votre carte</h6>
              <Form onSubmit={handleCardSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Numéro de carte</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      name="cardNumber"
                      value={cardInfo.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setCardInfo(prev => ({ ...prev, cardNumber: formatted }));
                      }}
                      maxLength={19}
                      required
                    />
                    <InputGroup.Text><i className="icofont-credit-card"></i></InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Nom sur la carte</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Jean Dupont"
                    name="cardName"
                    value={cardInfo.cardName}
                    onChange={handleCardInfoChange}
                    required
                  />
                </Form.Group>
                
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Date d'expiration</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="MM/YY"
                        name="expiryDate"
                        value={cardInfo.expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          setCardInfo(prev => ({ ...prev, expiryDate: formatted }));
                        }}
                        maxLength={5}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>CVV</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="123"
                          name="cvv"
                          value={cardInfo.cvv}
                          onChange={handleCardInfoChange}
                          maxLength={4}
                          required
                        />
                        <InputGroup.Text title="Les 3 ou 4 chiffres au dos de votre carte">
                          <i className="icofont-info-circle"></i>
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </div>
                </div>
                
                <div className="text-end mt-3">
                  <Button type="submit" variant="primary">
                    Enregistrer la carte
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Collapse>
      
      <style jsx>{`
        .payment-method {
          transition: all 0.3s ease;
        }
        .payment-method:hover:not(.opacity-50) {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }
        .payment-method.border-primary {
          box-shadow: 0 0 0 1px #0d6efd;
        }
      `}</style>
    </div>
  );
};

export default PaymentMethod;