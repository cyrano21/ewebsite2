import React from 'react';
import { Card, Button } from 'react-bootstrap';

interface EcomBecomeMemberProps {
  className?: string;
}

const EcomBecomeMember: React.FC<EcomBecomeMemberProps> = ({ className = '' }) => {
  return (
    <Card className={`bg-primary text-white ${className}`}>
      <Card.Body className="p-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h3 className="text-white mb-2">Devenez membre premium</h3>
            <p className="mb-md-0">
              Rejoignez notre programme de fidélité et bénéficiez d'avantages exclusifs, de remises spéciales et de livraisons gratuites illimitées.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <Button variant="light" className="btn-lg">
              S'inscrire maintenant
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EcomBecomeMember;