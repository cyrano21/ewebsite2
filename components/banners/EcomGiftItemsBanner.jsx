import React from 'react';
import { Card } from 'react-bootstrap';
import Link from 'next/link';

interface EcomGiftItemsBannerProps {
  products?: any[];
  className?: string;
}

const EcomGiftItemsBanner: React.FC<EcomGiftItemsBannerProps> = ({ products = [], className = '' }) => {
  return (
    <Card className={`overflow-hidden h-100 ${className}`}>
      <Card.Body className="bg-light p-4">
        <h3 className="mb-2">Idées Cadeaux</h3>
        <p className="mb-3">Découvrez notre sélection de cadeaux parfaits pour vos proches</p>
        <Link href="/customer/products/category/gifts" className="btn btn-sm btn-primary">
          Voir tous les cadeaux
        </Link>
      </Card.Body>
      <div className="card-img-overlay d-flex flex-column align-items-end justify-content-center pe-4 bg-transparent">
        <div className="position-relative">
          <div className="position-relative">
            <div 
              className="bg-holder" 
              style={{
                backgroundImage: "url(/assets/img/e-commerce/gifts-banner.png)",
                backgroundPosition: "center",
                backgroundSize: "cover",
                width: "160px",
                height: "170px"
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EcomGiftItemsBanner;