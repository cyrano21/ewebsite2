// src/components/product/ShopStatistics.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { formatNumber, getCategoryColor } from './SharedUtils.jsx'; // Extension correcte

const ShopStatistics = ({ shopStats }) => {
  if (!shopStats) return null;

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h5 className="mb-3">Aperçu de la boutique</h5>
        {/* Stat Cards */}
        <Row>
            <Col md={3} sm={6} className="mb-3">
                <div className="stat-card p-3 rounded bg-light-primary border">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                    <h3 className="mb-1">{shopStats.totalProducts}</h3>
                    <p className="text-muted mb-0 small">Produits Actifs</p>
                    </div>
                    <div className="stat-icon">
                    <i className="icofont-box fs-2 text-primary opacity-75"></i>
                    </div>
                </div>
                </div>
            </Col>
            <Col md={3} sm={6} className="mb-3">
                 <div className="stat-card p-3 rounded bg-light-success border">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="mb-1">{formatNumber(shopStats.totalStock)}</h3>
                      <p className="text-muted mb-0 small">Articles en Stock</p>
                    </div>
                    <div className="stat-icon">
                      <i className="icofont-cubes fs-2 text-success opacity-75"></i>
                    </div>
                  </div>
                </div>
            </Col>
             <Col md={3} sm={6} className="mb-3">
                <div className="stat-card p-3 rounded bg-light-warning border">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="mb-1">{formatNumber(shopStats.totalValue)}€</h3>
                      <p className="text-muted mb-0 small">Valeur du Stock</p>
                    </div>
                    <div className="stat-icon">
                      <i className="icofont-euro fs-2 text-warning opacity-75"></i>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <div className="stat-card p-3 rounded bg-light-danger border">
                   <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="mb-1">{shopStats.lowStockProducts}</h3>
                      <p className="text-muted mb-0 small">Stock Faible (&lt;10)</p>
                    </div>
                    <div className="stat-icon">
                      <i className="icofont-warning-alt fs-2 text-danger opacity-75"></i>
                    </div>
                  </div>
                </div>
              </Col>
        </Row>

        {/* Charts */}
        <Row className="mt-3">
            <Col md={8} className="mb-3 mb-md-0">
                <Card className="h-100 border-light shadow-sm">
                 <Card.Header className="bg-light py-2">
                    <h6 className="mb-0 fw-normal">Tendance des ventes - 7 derniers jours</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="sales-trend-chart" style={{ height: '180px' }}>
                      {shopStats.salesTrend && shopStats.salesTrend.length > 0 ? (
                        <>
                            <div className="simple-chart">
                                {shopStats.salesTrend.map((day, index) => (
                                <OverlayTrigger
                                    key={index}
                                    placement="top"
                                    overlay={
                                    <Tooltip id={`tooltip-sales-${index}`}>
                                        <strong>{day.date}:</strong> {day.ventes} ventes ({formatNumber(day.revenus)}€)
                                    </Tooltip>
                                    }
                                >
                                    <div className="chart-column">
                                    <div
                                        className="bar-revenue bg-primary"
                                        style={{ height: `${Math.min(100, (day.revenus / 3000) * 100)}%`, marginBottom: '2px' }}
                                    ></div>
                                    <div
                                        className="bar-sales bg-info opacity-75"
                                        style={{ height: `${Math.min(60, (day.ventes / 80) * 60)}%`}}
                                    ></div>
                                    <div className="day-label">{day.date}</div>
                                    </div>
                                </OverlayTrigger>
                                ))}
                            </div>
                            <div className="chart-legend d-flex justify-content-center small mt-2">
                                <div className="me-3"><span className="legend-indicator bg-primary"></span> Revenus</div>
                                <div><span className="legend-indicator bg-info"></span> Ventes</div>
                            </div>
                        </>
                      ) : (
                        <p className="text-muted text-center pt-5">Données de tendance non disponibles.</p>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                 <Card className="h-100 border-light shadow-sm">
                   <Card.Header className="bg-light py-2">
                    <h6 className="mb-0 fw-normal">Produits par catégorie</h6>
                  </Card.Header>
                  <Card.Body className="pt-2">
                     {shopStats.categoriesDistribution && Object.keys(shopStats.categoriesDistribution).length > 0 ? (
                        <div className="category-distribution">
                        {Object.entries(shopStats.categoriesDistribution)
                            .sort(([, countA], [, countB]) => countB - countA)
                            .map(([category, count], index) => (
                            <div key={index} className="mb-2">
                            <div className="d-flex justify-content-between small mb-1">
                                <span>{category}</span>
                                <span>{count} ({shopStats.totalProducts > 0 ? ((count / shopStats.totalProducts) * 100).toFixed(0) : 0}%)</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                                <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                    width: `${shopStats.totalProducts > 0 ? (count / shopStats.totalProducts) * 100 : 0}%`,
                                    backgroundColor: getCategoryColor(index)
                                }}
                                aria-valuenow={count}
                                aria-valuemin="0"
                                aria-valuemax={shopStats.totalProducts}
                                ></div>
                            </div>
                            </div>
                        ))}
                        </div>
                     ) : (
                         <p className="text-muted text-center pt-4">Aucune donnée de catégorie.</p>
                     )}
                  </Card.Body>
                </Card>
              </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

ShopStatistics.propTypes = {
  shopStats: PropTypes.shape({
    totalProducts: PropTypes.number,
    totalStock: PropTypes.number,
    totalValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lowStockProducts: PropTypes.number,
    categoriesDistribution: PropTypes.object,
    salesTrend: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      ventes: PropTypes.number,
      revenus: PropTypes.number,
    }))
  }).isRequired,
};

export default ShopStatistics;