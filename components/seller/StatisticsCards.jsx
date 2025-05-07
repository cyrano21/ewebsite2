
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const StatisticsCards = ({ stats }) => {
  // Valeurs par défaut si aucune donnée n'est disponible
  const defaultStats = {
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    productsGrowth: 0,
    customersGrowth: 0,
  };

  // Fusionner les stats fournies avec les valeurs par défaut
  const data = { ...defaultStats, ...stats };

  // Configuration des cartes statistiques
  const cards = [
    {
      title: 'Ventes',
      value: `${data.totalSales.toLocaleString()} €`,
      icon: 'icofont-money-bag',
      iconBg: 'bg-primary',
      growth: data.salesGrowth,
      growthLabel: 'vs mois précédent',
    },
    {
      title: 'Commandes',
      value: data.totalOrders.toLocaleString(),
      icon: 'icofont-shopping-cart',
      iconBg: 'bg-success',
      growth: data.ordersGrowth,
      growthLabel: 'nouvelles commandes',
    },
    {
      title: 'Produits',
      value: data.totalProducts.toLocaleString(),
      icon: 'icofont-box',
      iconBg: 'bg-info',
      growth: data.productsGrowth,
      growthLabel: 'actifs',
    },
    {
      title: 'Clients',
      value: data.totalCustomers.toLocaleString(),
      icon: 'icofont-users-alt-5',
      iconBg: 'bg-warning',
      growth: data.customersGrowth,
      growthLabel: 'nouveaux clients',
    },
  ];

  return (
    <Row className="mb-4">
      {cards.map((card, index) => (
        <Col key={index} md={6} lg={3} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 text-muted">{card.title}</h6>
                  <h3 className="mb-0 mt-2 fw-bold">{card.value}</h3>
                </div>
                <div className={`rounded-circle ${card.iconBg} p-3 d-flex align-items-center justify-content-center`}>
                  <i className={`${card.icon} text-white fs-4`}></i>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className={`small ${card.growth >= 0 ? 'text-success' : 'text-danger'}`}>
                  <i className={`icofont-${card.growth >= 0 ? 'arrow-up' : 'arrow-down'} me-1`}></i>
                  {Math.abs(card.growth)}% {card.growthLabel}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatisticsCards;
