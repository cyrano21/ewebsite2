import React from 'react';
import { Card } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

const StoreItem = ({ store }) => {
  if (!store) {
    return null;
  }

  return (
    <Card className="h-100 border-0 shadow-sm hover-actions-trigger">
      <Card.Body className="p-3 text-center">
        <div className="store-logo mb-3 d-flex justify-content-center">
          {store.logo ? (
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <Image
                src={store.logo}
                alt={store.name}
                layout="fill"
                objectFit="contain"
                className="rounded-circle"
              />
            </div>
          ) : (
            <div 
              className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
              style={{ width: '80px', height: '80px' }}
            >
              <span className="fs-4 text-primary">
                {store.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <h6 className="mb-2 store-name">{store.name}</h6>
        
        <div className="mb-2 d-flex justify-content-center">
          {[...Array(5)].map((_, i) => (
            <i 
              key={i} 
              className={`icofont-star ${i < Math.floor(store.rating || 0) ? 'text-warning' : 'text-muted'}`}
              style={{ fontSize: '0.8rem' }}
            ></i>
          ))}
          <span className="ms-1 small text-muted">
            ({store.reviewCount || 0})
          </span>
        </div>
        
        <p className="small text-muted mb-3">{store.description}</p>
        
        <Link
          href={`/shop/store/${store.slug || store.id}`}
          className="stretched-link"
          legacyBehavior>
          <span className="sr-only">Voir la boutique</span>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default StoreItem;