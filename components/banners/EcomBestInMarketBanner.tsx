import React from 'react';
import { Card } from 'react-bootstrap';
import Link from 'next/link';

interface EcomBestInMarketBannerProps {
  products?: any[];
  className?: string;
}

const EcomBestInMarketBanner: React.FC<EcomBestInMarketBannerProps> = ({ products = [], className = '' }) => {
  return (
    <Card className={`overflow-hidden h-100 ${className}`}>
      <Card.Body className="bg-primary bg-gradient p-4 text-white">
        <h3 className="mb-2 text-white">Meilleures Ventes</h3>
        <p className="mb-3">Découvrez nos produits les plus populaires à prix exceptionnels</p>
        <Link href="/customer/products/best-sellers" className="btn btn-sm btn-light">
          Explorer
        </Link>
      </Card.Body>
      <div className="card-img-overlay d-flex flex-column align-items-end justify-content-center pe-4 bg-transparent">
        <div className="position-relative">
          <div className="position-relative">
            <div
              className="bg-holder"
              style={{
                backgroundImage: "url(/assets/img/e-commerce/bestsellers-banner.png)",
                backgroundPosition: "center",
                backgroundSize: "cover",
                width: "180px",
                height: "170px"
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EcomBestInMarketBanner;