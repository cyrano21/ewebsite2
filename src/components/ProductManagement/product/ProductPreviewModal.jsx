// src/components/product/ProductPreviewModal.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { PLACEHOLDER_IMAGE } from '../SharedUtils'; // Adjust path

const ProductPreviewModal = ({ show, onHide, product, onEdit }) => {
  if (!product) return null; // Don't render if no product is selected

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title><i className="icofont-eye-alt me-2"></i>Prévisualisation Rapide</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={5} className="text-center">
            <img
              src={product.img || PLACEHOLDER_IMAGE}
              alt={product.name}
              className="img-fluid rounded shadow-sm mb-3"
              style={{ maxHeight: '250px' }}
              onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
            />
          </Col>
          <Col md={7}>
            <h4 className="mb-1">{product.name}</h4>
            <div className="mb-2">
              <Badge bg="secondary" className="fw-normal me-2">{product.category}</Badge>
              <span className="text-warning me-1">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`icofont-star ${i < Math.round(product.ratings || 0) ? '' : 'text-muted opacity-50'}`}></i>
                ))}
              </span>
              <small className="text-muted">({product.ratingsCount || 0} avis)</small>
            </div>
            <h5 className="text-primary mb-3">{product.price?.toFixed(2)} €</h5>
            <p className="mb-1"><strong className='fw-normal'>Stock:</strong> <Badge bg={product.stock <= 0 ? 'danger' : product.stock <= 10 ? 'warning' : 'success'}>{product.stock}</Badge></p>
            <p className="mb-1"><strong className='fw-normal'>Vendeur:</strong> {product.seller}</p>
            <hr />
            <p className="small text-muted">{product.description || 'Aucune description fournie.'}</p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => { onEdit(product); onHide(); }}>
          <i className="icofont-edit me-1"></i> Modifier ce produit
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ProductPreviewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  product: PropTypes.object, // Can be null when hidden
  onEdit: PropTypes.func.isRequired,
};

export default ProductPreviewModal;