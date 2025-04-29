import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Badge, OverlayTrigger, Tooltip, Pagination } from 'react-bootstrap';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/50x50/f8f9fa/6c757d?text=Aper%C3%A7u';

const ProductsTable = ({
  products,
  indexOfFirstItem,
  currentPage,
  totalPages,
  handlePageChange,
  handleViewOnShop,
  handleShowPreviewModal,
  handleShowEditModal,
  handleDeleteProduct,
}) => (
  <div>
    <Table responsive hover className="mb-0 align-middle">
      <thead className="bg-light">
        <tr>
          <th className="ps-3" style={{ width: '50px' }}>#</th>
          <th style={{ width: '70px' }}>Image</th>
          <th>Nom du produit</th>
          <th>Catégorie</th>
          <th className="text-end">Prix</th>
          <th className="text-center">Stock</th>
          <th className="text-center">Évaluations</th>
          <th className="text-end pe-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.length > 0 ? (
          products.map((product, idx) => (
            <tr key={product.id}>
              <td className="ps-3 text-muted">{indexOfFirstItem + idx + 1}</td>
              <td>
                <img
                  src={product.img || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  className="img-thumbnail"
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                />
              </td>
              <td className="fw-bold">{product.name}</td>
              <td>
                <Badge bg="secondary" className="fw-normal">
                  {product.category || 'Non classé'}
                </Badge>
              </td>
              <td className="text-end">{product.price?.toFixed(2)} €</td>
              <td className="text-center">
                <Badge
                  bg={
                    product.stock <= 0
                      ? 'danger'
                      : product.stock <= 10
                      ? 'warning'
                      : 'success'
                  }
                  className="px-2 py-1 fw-normal"
                >
                  {product.stock}
                </Badge>
              </td>
              <td className="text-center">
                <div className="d-inline-flex align-items-center">
                  <span className="text-warning me-1">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`icofont-star ${
                          i < Math.round(product.ratings || 0) ? '' : 'text-muted'
                        }`}
                      ></i>
                    ))}
                  </span>
                  <small className="text-muted">({product.ratingsCount || 0})</small>
                </div>
              </td>
              <td className="text-end pe-3">
                <OverlayTrigger placement="top" overlay={<Tooltip>Voir sur la boutique</Tooltip>}>
                  <Button variant="link" className="btn-icon text-info p-1 me-1" onClick={() => handleViewOnShop(product.id)}>
                    <i className="icofont-external-link fs-5"></i>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip>Prévisualiser</Tooltip>}>
                  <Button variant="link" className="btn-icon text-secondary p-1 me-1" onClick={() => handleShowPreviewModal(product)}>
                    <i className="icofont-eye-alt fs-5"></i>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip>Modifier</Tooltip>}>
                  <Button variant="link" className="btn-icon text-primary p-1 me-1" onClick={() => handleShowEditModal(product)}>
                    <i className="icofont-ui-edit fs-5"></i>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip>Supprimer</Tooltip>}>
                  <Button variant="link" className="btn-icon text-danger p-1" onClick={() => handleDeleteProduct(product.id)}>
                    <i className="icofont-ui-delete fs-5"></i>
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center py-3">
              Aucun produit trouvé
            </td>
          </tr>
        )}
      </tbody>
    </Table>
    <Pagination className="mt-3 justify-content-end">
      {[...Array(totalPages)].map((_, i) => (
        <Pagination.Item
          key={i + 1}
          active={i + 1 === currentPage}
          onClick={() => handlePageChange(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  </div>
);

ProductsTable.propTypes = {
  products: PropTypes.array.isRequired,
  indexOfFirstItem: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handleViewOnShop: PropTypes.func.isRequired,
  handleShowPreviewModal: PropTypes.func.isRequired,
  handleShowEditModal: PropTypes.func.isRequired,
  handleDeleteProduct: PropTypes.func.isRequired,
};

export default ProductsTable;
