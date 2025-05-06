import React from 'react';
import { Form, Card } from 'react-bootstrap';

const DeliveryType = ({ 
  deliveryOptions = [],
  selectedDeliveryId = null,
  onSelectDelivery,
  className = ''
}) => {
  // Si aucune option n'est fournie, utiliser des options par défaut
  const options = deliveryOptions.length > 0 ? deliveryOptions : [
    {
      id: 'standard',
      name: 'Livraison standard',
      description: 'Livraison en 3-5 jours ouvrables',
      price: 4.99,
      estimated: '3-5 jours ouvrables'
    },
    {
      id: 'express',
      name: 'Livraison express',
      description: 'Livraison en 1-2 jours ouvrables',
      price: 9.99,
      estimated: '1-2 jours ouvrables'
    },
    {
      id: 'free',
      name: 'Livraison gratuite',
      description: 'Livraison gratuite pour les commandes de plus de 50€',
      price: 0,
      estimated: '5-7 jours ouvrables'
    }
  ];

  // Gestion de la sélection d'une option de livraison
  const handleDeliverySelection = (deliveryId) => {
    if (onSelectDelivery) {
      const selectedOption = options.find(option => option.id === deliveryId);
      onSelectDelivery(selectedOption);
    }
  };

  return (
    <div className={className}>
      <h5 className="mb-3">Mode de livraison</h5>
      
      {options.map(option => (
        <Card 
          key={option.id}
          className={`mb-3 delivery-option ${selectedDeliveryId === option.id ? 'border-primary' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleDeliverySelection(option.id)}
        >
          <Card.Body className="p-3">
            <Form.Check
              type="radio"
              id={`delivery-option-${option.id}`}
              name="deliveryOption"
              className="d-flex align-items-start"
              checked={selectedDeliveryId === option.id}
              onChange={() => handleDeliverySelection(option.id)}
              label={
                <div className="ms-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{option.name}</strong>
                    <span className="delivery-price">
                      {option.price === 0 
                        ? 'Gratuit' 
                        : option.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                  <div className="text-muted small mt-1">{option.description}</div>
                  <div className="text-muted small">
                    <i className="icofont-clock-time me-1"></i>
                    Délai estimé: {option.estimated}
                  </div>
                </div>
              }
            />
          </Card.Body>
        </Card>
      ))}
      
      <style jsx>{`
        .delivery-option {
          transition: all 0.3s ease;
        }
        .delivery-option:hover {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }
        .delivery-option.border-primary {
          box-shadow: 0 0 0 1px #0d6efd;
        }
        .delivery-price {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default DeliveryType;