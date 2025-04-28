import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const StatsOverview = ({ shopStats, formatNumber }) => (
  <Card className="mb-4 shadow-sm">
    <Card.Body>
      <h5 className="mb-3">Aperçu de la boutique</h5>
      <Row>
        {/* Stat cards will be implemented here */}
      </Row>
    </Card.Body>
  </Card>
);

StatsOverview.propTypes = {
  shopStats: PropTypes.object.isRequired,
  formatNumber: PropTypes.func.isRequired
};

export default StatsOverview;
