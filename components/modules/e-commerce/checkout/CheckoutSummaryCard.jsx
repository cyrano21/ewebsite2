import React from 'react';
import { Card, Form, Button, Table } from 'react-bootstrap';
import { currencyFormat } from 'helpers/utils';

const CheckoutSummaryCard = () => {
  // Données d'exemple pour l'affichage du panier
  const cartItems = [
    { id: 1, name: 'Produit 1', price: 299.99, quantity: 1 },
    { id: 2, name: 'Produit 2', price: 199.99, quantity: 2 },
  ];

  // Calcul des totaux
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 15.99;
  const tax = subtotal * 0.1; // 10% de taxe
  const total = subtotal + shipping + tax;

  return (
    <Card className="mb-3">
      <Card.Header className="bg-light d-flex justify-content-between">
        <h3 className="mb-0">Résumé de commande</h3>
        <Button variant="link" size="sm" className="p-0">
          Modifier
        </Button>
      </Card.Header>

      <Card.Body>
        {/* Liste des produits */}
        <Table className="fs-7 mb-0" borderless>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td className="ps-0">
                  <span className="fw-semibold">{item.quantity}x</span> {item.name}
                </td>
                <td className="pe-0 text-end fw-semibold">
                  {currencyFormat(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <hr className="my-3" />

        {/* Sous-total, frais de livraison, etc. */}
        <Table className="fs-7 mb-0" borderless>
          <tbody>
            <tr>
              <td className="ps-0">Sous-total</td>
              <td className="pe-0 text-end fw-semibold">{currencyFormat(subtotal)}</td>
            </tr>
            <tr>
              <td className="ps-0">Livraison</td>
              <td className="pe-0 text-end fw-semibold">{currencyFormat(shipping)}</td>
            </tr>
            <tr>
              <td className="ps-0">Taxes</td>
              <td className="pe-0 text-end fw-semibold">{currencyFormat(tax)}</td>
            </tr>
          </tbody>
        </Table>

        <hr className="my-3" />

        {/* Total */}
        <div className="d-flex justify-content-between">
          <h4 className="mb-0">Total</h4>
          <h4 className="mb-0">{currencyFormat(total)}</h4>
        </div>

        {/* Code promo */}
        <Form className="mt-4">
          <Form.Group>
            <Form.Label className="fs-7">Code promo</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control type="text" placeholder="Entrez votre code" />
              <Button variant="phoenix-secondary" type="button">
                Appliquer
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CheckoutSummaryCard;