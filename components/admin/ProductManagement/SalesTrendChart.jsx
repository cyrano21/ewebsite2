import React from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SalesTrendChart = ({ salesTrend, formatNumber }) => (
  <Card className="mb-4 shadow-sm">
    <Card.Header className="bg-light py-2">
      <h6 className="mb-0 fw-normal">Performance Hebdomadaire</h6>
    </Card.Header>
    <Card.Body className="pt-2">
      <div className="simple-chart" style={{ height: '150px' }}>
        {salesTrend.map((day, index) => (
          <OverlayTrigger
            key={index}
            placement="top"
            overlay={
              <Tooltip id={`tooltip-sales-${index}`}>
                <strong>{day.date}:</strong> {day.sales} ventes ({formatNumber(day.revenue)}€)
              </Tooltip>
            }
          >
            <div className="chart-column">
              <div
                className="bar-revenue bg-primary"
                style={{ height: `${Math.min(100, (day.revenue / 3000) * 100)}%`, marginBottom: '2px' }}
              ></div>
              <div
                className="bar-sales bg-info opacity-75"
                style={{ height: `${Math.min(60, (day.sales / 80) * 60)}%` }}
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
    </Card.Body>
  </Card>
);

SalesTrendChart.propTypes = {
  salesTrend: PropTypes.array.isRequired,
  formatNumber: PropTypes.func.isRequired
};

export default SalesTrendChart;
