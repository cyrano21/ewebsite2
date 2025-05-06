import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';

const ORDER_STATUSES = {
  PLACED: 'Commande passée',
  PROCESSING: 'En cours de traitement',
  SHIPPED: 'Expédiée',
  DELIVERY: 'En cours de livraison',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée'
};

const getStatusColor = (status) => {
  switch (status) {
    case ORDER_STATUSES.PLACED:
      return 'primary';
    case ORDER_STATUSES.PROCESSING:
      return 'info';
    case ORDER_STATUSES.SHIPPED:
      return 'warning';
    case ORDER_STATUSES.DELIVERY:
      return 'warning';
    case ORDER_STATUSES.DELIVERED:
      return 'success';
    case ORDER_STATUSES.CANCELLED:
      return 'danger';
    default:
      return 'secondary';
  }
};

const OrderTrackingTimeline = ({ order }) => {
  // Determiner l'étape actuelle
  const getStatusIndex = (status) => {
    const statuses = Object.values(ORDER_STATUSES);
    return statuses.indexOf(status);
  };

  const currentStatusIndex = getStatusIndex(order?.status || ORDER_STATUSES.PLACED);
  
  // Générer les étapes de la timeline
  const timelineSteps = Object.values(ORDER_STATUSES).filter(
    status => status !== ORDER_STATUSES.CANCELLED
  );
  
  return (
    <Card className="tracking-card">
      <Card.Body>
        <h5 className="mb-4">Suivi de commande</h5>
        
        {order?.status === ORDER_STATUSES.CANCELLED ? (
          <div className="text-center py-4">
            <div className="cancelled-icon mb-3">
              <i className="icofont-close-circled"></i>
            </div>
            <h4 className="text-danger">Commande annulée</h4>
            <p className="text-muted">
              {order?.cancellationReason || 'Nous sommes désolés, cette commande a été annulée.'}
            </p>
          </div>
        ) : (
          <div className="timeline-container">
            {timelineSteps.map((step, index) => (
              <div 
                key={step} 
                className={`timeline-step ${index <= currentStatusIndex ? 'completed' : ''}`}
              >
                <div className="timeline-icon">
                  {index < currentStatusIndex ? (
                    <i className="icofont-check-circled"></i>
                  ) : index === currentStatusIndex ? (
                    <i className="icofont-clock-time"></i>
                  ) : (
                    <i className="icofont-dotted-right"></i>
                  )}
                </div>
                <div className="timeline-content">
                  <h6>
                    {step}
                    {index === currentStatusIndex && (
                      <Badge 
                        bg={getStatusColor(step)} 
                        className="ms-2"
                      >
                        Actuel
                      </Badge>
                    )}
                  </h6>
                  {order?.timeline && order.timeline[step] && (
                    <p className="text-muted small mb-0">
                      {new Date(order.timeline[step]).toLocaleString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {order?.estimatedDelivery && order.status !== ORDER_STATUSES.CANCELLED && order.status !== ORDER_STATUSES.DELIVERED && (
          <div className="mt-4 text-center">
            <p className="mb-0">
              <span className="text-muted">Livraison estimée :</span>{' '}
              <strong>{new Date(order.estimatedDelivery).toLocaleDateString('fr-FR')}</strong>
            </p>
          </div>
        )}
      </Card.Body>

      <style jsx>{`
        .tracking-card {
          border-radius: 0.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: none;
        }
        
        .timeline-container {
          position: relative;
          padding: 1rem 0;
        }
        
        .timeline-container::before {
          content: '';
          position: absolute;
          left: 18px;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: #e9ecef;
          z-index: 0;
        }
        
        .timeline-step {
          position: relative;
          display: flex;
          margin-bottom: 1.5rem;
          z-index: 1;
        }
        
        .timeline-step:last-child {
          margin-bottom: 0;
        }
        
        .timeline-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #f8f9fa;
          border: 2px solid #dee2e6;
          margin-right: 1rem;
          color: #6c757d;
          z-index: 1;
        }
        
        .timeline-step.completed .timeline-icon {
          background-color: #d4edda;
          border-color: #28a745;
          color: #28a745;
        }
        
        .timeline-content {
          flex: 1;
        }
        
        .timeline-content h6 {
          margin-bottom: 0.25rem;
          font-weight: 600;
        }
        
        .cancelled-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: #f8d7da;
          margin: 0 auto;
          font-size: 2rem;
          color: #dc3545;
        }
      `}</style>
    </Card>
  );
};

export default OrderTrackingTimeline;