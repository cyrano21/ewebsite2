import React from 'react';
import { Card, Button } from 'react-bootstrap';

// Composant temporaire pour résoudre l'erreur de build
const EcomGiftItemsBanner = () => {
  return (
    <Card className="h-100 overflow-hidden">
      <Card.Body className="p-4">
        <div className="row justify-content-between align-items-center">
          <div className="col-8">
            <h3 className="mb-2">Idées Cadeaux</h3>
            <p className="mb-3">
              Trouvez le cadeau parfait pour vos proches à des prix imbattables.
            </p>
            <Button variant="outline-primary" size="sm">Voir les offres</Button>
          </div>
          <div className="col-4 text-end">
            {/* Espace réservé pour une image */}
            <div className="bg-warning-subtle rounded-circle p-3" style={{ height: '100px', width: '100px', margin: '0 auto' }}>
              <p className="text-center text-muted">Cadeau</p>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EcomGiftItemsBanner;