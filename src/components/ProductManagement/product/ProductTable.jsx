// src/components/product/ProductTable.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Card } from 'react-bootstrap';
import ProductRow from './ProductRow'; // Import the row component

const ProductTable = ({ products, startIndex, onEdit, onDelete, onPreview, onViewOnShop }) => {
  return (
    <Card className="shadow-sm">
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="ps-3" style={{ width: '50px' }}>#</th>
              <th style={{ width: '70px' }}>Image</th>
              <th>Nom du produit</th>
              <th>Catégorie</th>
              <th className='text-end'>Prix</th>
              <th className='text-center'>Stock</th>
              <th className='text-center'>Évaluations</th>
              <th className="text-end pe-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, idx) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  index={startIndex + idx}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPreview={onPreview}
                  onViewOnShop={onViewOnShop}
                />
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-5 text-muted">
                  <i className="icofont-ban fs-1 d-block mb-2"></i>
                  Aucun produit ne correspond à vos critères.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

ProductTable.propTypes = {
  products: PropTypes.array.isRequired,
  startIndex: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  onViewOnShop: PropTypes.func.isRequired,
};

export default ProductTable;