import React from 'react';
import { Card, Button } from 'react-bootstrap';
import styles from './EcomBestInMarketBanner.module.css';

// Composant temporaire pour résoudre l'erreur de build
const EcomBestInMarketBanner = () => {
  return (
    <Card className="h-100 overflow-hidden">
      <Card.Body className="p-4">
        <div className="row justify-content-between align-items-center">
          <div className="col-8">
            <h3 className="mb-2">Meilleurs du marché</h3>
            <p className="mb-3">
              Découvrez nos produits de haute qualité sélectionnés par nos experts.
            </p>
            <Button variant="outline-primary" size="sm">Voir les produits</Button>
          </div>
          <div className="col-4 text-end">
            {/* Espace réservé pour une image */}
            <div className={`bg-success-subtle rounded p-3 ${styles.productImageContainer}`}>
              <p className="text-center text-muted">Produit</p>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EcomBestInMarketBanner;