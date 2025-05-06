import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { formatPhoneNumber } from 'helpers/utils';

const EcomAddressTable = ({ 
  addresses = [], 
  selectedAddressId,
  onSelectAddress,
  onEditAddress,
  onDeleteAddress,
  onAddAddress
}) => {
  // Si aucune adresse n'est disponible
  if (!addresses || addresses.length === 0) {
    return (
      <div className="text-center p-4 border rounded mb-4 bg-light">
        <div className="mb-3">
          <i className="icofont-location-pin text-muted" style={{ fontSize: '2rem' }}></i>
        </div>
        <h6>Aucune adresse enregistrée</h6>
        <p className="text-muted small">Ajoutez une adresse de livraison pour continuer</p>
        <Button 
          variant="primary" 
          size="sm" 
          className="mt-2"
          onClick={() => onAddAddress && onAddAddress()}
        >
          <i className="icofont-plus me-1"></i>
          Ajouter une adresse
        </Button>
      </div>
    );
  }

  return (
    <div className="address-table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Adresses de livraison</h6>
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={() => onAddAddress && onAddAddress()}
        >
          <i className="icofont-plus me-1"></i>
          Ajouter
        </Button>
      </div>

      <div className="table-responsive">
        <Table hover className="address-table">
          <thead className="bg-light">
            <tr>
              <th className="border-0" style={{ width: '40px' }}></th>
              <th className="border-0">Nom</th>
              <th className="border-0">Adresse</th>
              <th className="border-0">Téléphone</th>
              <th className="border-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address) => (
              <tr key={address.id}>
                <td className="align-middle">
                  <Form.Check
                    type="radio"
                    id={`address-${address.id}`}
                    name="selected-address"
                    checked={selectedAddressId === address.id}
                    onChange={() => onSelectAddress && onSelectAddress(address.id)}
                  />
                </td>
                <td className="align-middle">
                  <div>
                    <span className="fw-medium">{address.firstName} {address.lastName}</span>
                    {address.isDefault && (
                      <span className="badge bg-info ms-2 small">Par défaut</span>
                    )}
                  </div>
                </td>
                <td className="align-middle">
                  <div>
                    <div>{address.street}</div>
                    <div>{address.zipCode} {address.city}</div>
                    <div>{address.country}</div>
                  </div>
                </td>
                <td className="align-middle">
                  {formatPhoneNumber(address.phone)}
                </td>
                <td className="align-middle">
                  <div className="btn-group btn-group-sm">
                    <Button 
                      variant="outline-secondary"
                      onClick={() => onEditAddress && onEditAddress(address.id)}
                    >
                      <i className="icofont-edit"></i>
                    </Button>
                    <Button 
                      variant="outline-danger"
                      onClick={() => onDeleteAddress && onDeleteAddress(address.id)}
                    >
                      <i className="icofont-trash"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <style jsx>{`
        .address-table-container {
          margin-bottom: 1.5rem;
        }
        .address-table th {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default EcomAddressTable;