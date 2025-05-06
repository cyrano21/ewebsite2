
import React, { useState, useEffect } from 'react';
import { Toast, Button } from 'react-bootstrap';
import Link from 'next/link';

const CompareNotification = () => {
  const [show, setShow] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    // Vérifier le localStorage au chargement du composant
    const productIds = JSON.parse(localStorage.getItem('comparisonProducts') || '[]');
    setCompareCount(productIds.length);

    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      const updatedProductIds = JSON.parse(localStorage.getItem('comparisonProducts') || '[]');
      setCompareCount(updatedProductIds.length);
      if (updatedProductIds.length > 0) {
        setShow(true);
      }
    };

    // Ajouter un événement personnalisé pour détecter les changements
    window.addEventListener('storage-compare-updated', handleStorageChange);

    // Nettoyer l'écouteur d'événements
    return () => {
      window.removeEventListener('storage-compare-updated', handleStorageChange);
    };
  }, []);

  // Si aucun produit n'est en comparaison, ne pas afficher la notification
  if (compareCount === 0) return null;

  return (
    <div className="compare-notification-container">
      <Toast 
        show={show} 
        onClose={() => setShow(false)}
        className="position-fixed bottom-0 end-0 m-3"
        style={{ zIndex: 1050 }}
        delay={5000}
        autohide
      >
        <Toast.Header>
          <i className="icofont-exchange me-2"></i>
          <strong className="me-auto">Comparaison</strong>
          <small>{compareCount} produit(s)</small>
        </Toast.Header>
        <Toast.Body className="d-flex flex-column">
          <p className="mb-2">Vous avez {compareCount} produit(s) à comparer.</p>
          <div className="d-flex gap-2">
            <Link href="/shop/compare" passHref legacyBehavior>
              <Button variant="primary" size="sm" className="flex-grow-1">
                Comparer maintenant
              </Button>
            </Link>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => {
                localStorage.removeItem('comparisonProducts');
                setCompareCount(0);
                setShow(false);
                // Déclencher l'événement personnalisé
                window.dispatchEvent(new Event('storage-compare-updated'));
              }}
            >
              Effacer
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default CompareNotification;
