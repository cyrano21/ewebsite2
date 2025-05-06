import React from 'react';
import { Table } from 'react-bootstrap';

const EcomInvoiceTable = () => {
  // Données d'exemple pour la facture
  const invoiceItems = [
    {
      id: 1,
      item: 'Apple MacBook Pro 13 inch',
      quantity: 1,
      rate: 1499.00,
      amount: 1499.00,
    },
    {
      id: 2,
      item: 'Samsung Galaxy S21 Ultra',
      quantity: 2,
      rate: 999.00,
      amount: 1998.00,
    },
    {
      id: 3,
      item: 'Apple AirPods Pro',
      quantity: 1,
      rate: 249.00,
      amount: 249.00,
    }
  ];

  // Calculs pour le total
  const subTotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subTotal * 0.20; // 20% de TVA
  const shipping = 15.00;
  const total = subTotal + tax + shipping;

  // Formatage des prix
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(Number(price))) {
      return 'Prix non disponible';
    }
    
    try {
      return price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    } catch (error) {
      console.error('Erreur de formatage du prix:', error);
      return `${price} €`;
    }
  };

  return (
    <div className="my-4 p-4 bg-body dark__bg-gray-1100 rounded-2">
      <Table responsive striped className="fs-9 mb-0">
        <thead>
          <tr className="border-bottom border-200">
            <th className="ps-0 text-nowrap">Item</th>
            <th className="text-center">Quantity</th>
            <th className="text-end">Rate</th>
            <th className="text-end pe-0">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item) => (
            <tr key={item.id} className="border-bottom border-200">
              <td className="ps-0">{item.item}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-end">{formatPrice(item.rate)}</td>
              <td className="text-end pe-0">{formatPrice(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-4 d-flex justify-content-end">
        <div style={{ width: '250px' }}>
          <div className="d-flex justify-content-between border-bottom border-200 mb-2">
            <p className="mb-0">Subtotal:</p>
            <p className="mb-0">{formatPrice(subTotal)}</p>
          </div>
          <div className="d-flex justify-content-between border-bottom border-200 mb-2">
            <p className="mb-0">Tax (20%):</p>
            <p className="mb-0">{formatPrice(tax)}</p>
          </div>
          <div className="d-flex justify-content-between border-bottom border-200 mb-2">
            <p className="mb-0">Shipping:</p>
            <p className="mb-0">{formatPrice(shipping)}</p>
          </div>
          <div className="d-flex justify-content-between fw-bold">
            <p className="mb-0">Total:</p>
            <p className="mb-0">{formatPrice(total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcomInvoiceTable;