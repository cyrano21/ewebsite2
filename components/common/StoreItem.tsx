import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './StoreItem.module.css';

// Composant temporaire pour résoudre l'erreur de build
interface StoreItemProps {
  store: {
    name: string;
    image?: string;
    logoImage?: string;
  };
}

const StoreItem = ({ store }: StoreItemProps) => {
  return (
    <Card className="h-100 store-card">
      <Card.Body className="text-center py-4">
        {store.logoImage && (
          <div className={styles.storeImageContainer}>
            <img 
              src={store.logoImage} 
              alt={store.name} 
              className={styles.storeImage}
            />
          </div>
        )}
        <h5 className={styles.storeName}>{store.name}</h5>
      </Card.Body>
    </Card>
  );
};

export default StoreItem;