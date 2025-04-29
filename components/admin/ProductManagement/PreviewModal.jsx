import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import ProgressBar from './ProgressBar';

const PreviewModal = ({
  show,
  product,
  handleClose,
  handleEdit
}) => (
  <Modal show={show} onHide={handleClose} size="lg" centered>
    <Modal.Header closeButton>
      <Modal.Title>
        <i className="icofont-eye-alt me-2" />
        Aperçu rapide du produit
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {product ? (
        <Row className="g-3">
          <Col md={4} className="text-center">
            <img
              src={product.img || 'https://via.placeholder.com/300x300/f8f9fa/6c757d?text=Aper%C3%A9u'}
              alt={product.name}
              className="img-fluid rounded"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/300x300/f8f9fa/6c757d?text=Aper%C3%A9u')}
            />
          </Col>
          <Col md={8}>
            <h5>{product.name}</h5>
            <Badge bg="secondary" className="mb-2">{product.category || 'Non classé'}</Badge>
            <p className="fw-bold">
              Prix : {product.price?.toFixed(2)} € <span className="ms-3">Stock : {product.stock}</span>
            </p>
            <p>Description : {product.description || <span className="text-muted">Aucune description</span>}</p>
            <p>
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`icofont-star ${i < Math.round(product.ratings || 0) ? 'text-warning' : 'text-muted'}`}
                ></i>
              ))}
              <small className="text-muted ms-2">({product.ratingsCount || 0})</small>
            </p>
          </Col>
        </Row>
      ) : (
        <p className="text-center text-muted">Aucun produit à prévisualiser.</p>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>Fermer</Button>
      <Button variant="primary" onClick={() => handleEdit(product)}>Modifier</Button>
    </Modal.Footer>
  </Modal>
);

PreviewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  product: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired
};

export default PreviewModal;
