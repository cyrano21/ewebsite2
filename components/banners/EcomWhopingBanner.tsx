import React from 'react';
import { Card, Button } from 'react-bootstrap';

// Composant temporaire pour résoudre l'erreur de build
const EcomWhopingBanner = () => {
  return (
    <Card className="h-100 overflow-hidden">
      <Card.Body className="p-4 p-sm-5">
        <div className="row justify-content-between align-items-center">
          <div className="col-md-6 col-lg-5">
            <h2 className="mb-3">Grande Promotion</h2>
            <p className="mb-4">
              Profitez de réductions exceptionnelles sur nos produits les plus populaires.
              Offre limitée dans le temps !
            </p>
            <Button variant="primary">Découvrir maintenant</Button>
          </div>
          <div className="col-md-6 col-lg-5 d-none d-md-block text-end">
            {/* Espace réservé pour une image */}
            <div className="bg-primary-subtle rounded p-4" style={{ height: '200px', width: '100%' }}>
              <p className="text-center text-muted">Image de promotion</p>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EcomWhopingBanner;