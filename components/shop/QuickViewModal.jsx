import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Image from 'next/image';
import Rating from '../Sidebar/Rating';

const QuickViewModal = ({ show, onHide, product, onAddToCart, onAddToWishlist }) => {
  if (!product) return null;
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <Image
              src={product.img}
              alt={product.name}
              width={400}
              height={400}
              layout="responsive"
              objectFit="cover"
            />
          </div>
          <div className="col-md-6">
            <h5>
              {product.salePrice ? (
                <>
                  <del className="text-muted me-2">{product.price}€</del>
                  <span className="text-danger">{product.salePrice}€</span>
                </>
              ) : (
                <span>{product.price}€</span>
              )}
            </h5>
            <p className="my-2"><Rating value={product.rating} /></p>
            <p>{product.description}</p>
            <div className="mt-4">
              <Button variant="primary" onClick={() => onAddToCart(product)}>
                Ajouter au panier
              </Button>
              <Button variant="outline-secondary" className="ms-2" onClick={() => onAddToWishlist(product)}>
                <i className="icofont-heart"></i> Favoris
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default QuickViewModal;
