// src/components/product/ProductRow.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { PLACEHOLDER_IMAGE } from '../SharedUtils'; // Adjust path

const ProductRow = ({ product, index, onEdit, onDelete, onPreview, onViewOnShop }) => {
  return (
    <tr key={product.id}>
      <td className="ps-3 text-muted">{index}</td>
      <td>
        <img
          src={product.img || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="img-thumbnail"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
        />
      </td>
      <td className='fw-bold'>{product.name}</td>
      <td>
        <Badge bg="secondary" className="fw-normal">{product.category || 'Non classé'}</Badge>
      </td>
      <td className='text-end'>{product.price?.toFixed(2)} €</td>
      <td className='text-center'>
        <Badge
          bg={product.stock <= 0 ? 'danger' : product.stock <= 10 ? 'warning' : 'success'}
          className="px-2 py-1 fw-normal"
        >
          {product.stock}
        </Badge>
      </td>
      <td className='text-center'>
        <div className="d-inline-flex align-items-center">
          <span className="text-warning me-1">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`icofont-star ${i < Math.round(product.ratings || 0) ? '' : 'text-muted'}`}></i>
            ))}
          </span>
          <small className="text-muted">({product.ratingsCount || 0})</small>
        </div>
      </td>
      <td className="text-end pe-3">
        <OverlayTrigger placement="top" overlay={<Tooltip>Voir sur la boutique</Tooltip>}>
          <Button
            variant="link"
            className="btn-icon text-info p-1 me-1"
            onClick={() => onViewOnShop(product.id)}
          >
            <i className="icofont-external-link fs-5"></i>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>Prévisualiser</Tooltip>}>
          <Button
            variant="link"
            className="btn-icon text-secondary p-1 me-1"
            onClick={() => onPreview(product)}
          >
            <i className="icofont-eye-alt fs-5"></i>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>Modifier</Tooltip>}>
          <Button
            variant="link"
            className="btn-icon text-primary p-1 me-1"
            onClick={() => onEdit(product)}
          >
            <i className="icofont-ui-edit fs-5"></i>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>Supprimer</Tooltip>}>
          <Button
            variant="link"
            className="btn-icon text-danger p-1"
            onClick={() => onDelete(product.id)}
          >
            <i className="icofont-ui-delete fs-5"></i>
          </Button>
        </OverlayTrigger>
      </td>
    </tr>
  );
};

ProductRow.propTypes = {
  product: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  onViewOnShop: PropTypes.func.isRequired,
};

export default ProductRow;