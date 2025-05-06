import React from 'react';
import { Table } from 'react-bootstrap';

// Composant temporaire pour résoudre l'erreur de build
interface InvoiceItem {
  id: string;
  product: string;
  description?: string;
  quantity: number;
  price: number;
  total: number;
}

interface EcomInvoiceTableProps {
  items?: InvoiceItem[];
  className?: string;
}

const EcomInvoiceTable = ({ items = [], className = '' }: EcomInvoiceTableProps) => {
  // Calcul du sous-total
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.2; // TVA à 20%
  const total = subtotal + tax;

  // Éléments de facture par défaut si aucun n'est fourni
  const defaultItems: InvoiceItem[] = [
    {
      id: '1',
      product: 'Smartphone premium',
      description: 'Dernière génération avec 256GB de stockage',
      quantity: 1,
      price: 899.99,
      total: 899.99
    },
    {
      id: '2',
      product: 'Coque de protection',
      quantity: 1,
      price: 29.99,
      total: 29.99
    },
    {
      id: '3',
      product: 'Extension de garantie',
      description: 'Protection supplémentaire de 2 ans',
      quantity: 1,
      price: 79.99,
      total: 79.99
    }
  ];

  // Utiliser les éléments fournis ou les éléments par défaut
  const invoiceItems = items.length > 0 ? items : defaultItems;

  return (
    <div className={className}>
      <Table responsive bordered className="mb-0">
        <thead className="bg-light">
          <tr>
            <th>Produit</th>
            <th>Description</th>
            <th className="text-end">Quantité</th>
            <th className="text-end">Prix unitaire</th>
            <th className="text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item) => (
            <tr key={item.id}>
              <td className="align-middle">{item.product}</td>
              <td className="align-middle">{item.description || '-'}</td>
              <td className="text-end align-middle">{item.quantity}</td>
              <td className="text-end align-middle">{item.price.toFixed(2)} €</td>
              <td className="text-end align-middle">{item.total.toFixed(2)} €</td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className="text-end fw-bold">Sous-total</td>
            <td className="text-end">{subtotal.toFixed(2)} €</td>
          </tr>
          <tr>
            <td colSpan={4} className="text-end fw-bold">TVA (20%)</td>
            <td className="text-end">{tax.toFixed(2)} €</td>
          </tr>
          <tr>
            <td colSpan={4} className="text-end fw-bold fs-5">Total</td>
            <td className="text-end fw-bold fs-5">{total.toFixed(2)} €</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default EcomInvoiceTable;