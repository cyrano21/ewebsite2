import React from 'react';
import { Card, Button } from 'react-bootstrap';

// Composant temporaire pour résoudre l'erreur de build
const EcomBecomeMember = () => {
  return (
    <Card className="bg-primary text-white">
      <Card.Body className="p-4 p-sm-5 text-center">
        <h2 className="mb-3">Devenez membre</h2>
        <p className="mb-4">
          Rejoignez notre programme de fidélité et bénéficiez d'avantages exclusifs,
          de remises et d'offres spéciales.
        </p>
        <Button variant="light" size="lg">
          S'inscrire maintenant
        </Button>
      </Card.Body>
    </Card>
  );
};

export default EcomBecomeMember;