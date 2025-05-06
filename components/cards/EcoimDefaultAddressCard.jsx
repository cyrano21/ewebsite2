import React from 'react';
import { Card, Button } from 'react-bootstrap';

const EcoimDefaultAddressCard = ({ address, isDefault, onEdit, onDelete, onSetDefault }) => {
  if (!address) {
    return null;
  }

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1">{address.name || 'Adresse'}</h5>
            {isDefault && (
              <span className="badge bg-primary">Adresse par défaut</span>
            )}
          </div>
          <div className="dropdown">
            <Button
              variant="light"
              size="sm"
              className="rounded-circle p-0"
              style={{ width: '32px', height: '32px' }}
              id={`dropdown-address-${address.id}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="icofont-ui-more"></i>
            </Button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdown-address-${address.id}`}>
              <li>
                <Button 
                  variant="link" 
                  className="dropdown-item" 
                  onClick={() => onEdit && onEdit(address)}
                >
                  <i className="icofont-ui-edit me-2"></i>
                  Modifier
                </Button>
              </li>
              {!isDefault && (
                <li>
                  <Button 
                    variant="link" 
                    className="dropdown-item" 
                    onClick={() => onSetDefault && onSetDefault(address)}
                  >
                    <i className="icofont-check-circled me-2"></i>
                    Définir par défaut
                  </Button>
                </li>
              )}
              <li>
                <Button 
                  variant="link" 
                  className="dropdown-item text-danger" 
                  onClick={() => onDelete && onDelete(address)}
                >
                  <i className="icofont-trash me-2"></i>
                  Supprimer
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div className="address-details">
          <p className="mb-1">
            {address.firstName} {address.lastName}
          </p>
          <p className="mb-1">{address.street}</p>
          {address.additionalInfo && (
            <p className="mb-1">{address.additionalInfo}</p>
          )}
          <p className="mb-1">
            {address.postalCode} {address.city}
          </p>
          <p className="mb-1">{address.country || 'France'}</p>
          {address.phone && (
            <p className="mb-1">
              <i className="icofont-phone me-1"></i> {address.phone}
            </p>
          )}
        </div>

        <div className="address-actions mt-3 d-flex">
          <Button 
            variant="outline-primary" 
            size="sm" 
            className="me-2"
            onClick={() => onEdit && onEdit(address)}
          >
            <i className="icofont-ui-edit me-1"></i>
            Modifier
          </Button>
          {!isDefault && (
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => onSetDefault && onSetDefault(address)}
            >
              <i className="icofont-check-circled me-1"></i>
              Définir par défaut
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default EcoimDefaultAddressCard;