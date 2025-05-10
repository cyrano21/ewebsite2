import React, { useState } from 'react';
import { Table, Button, Image, Form, InputGroup } from 'react-bootstrap';
import Link from 'next/link';
import { formatPrice } from 'helpers/utils';

const EcomWishlistTable = ({ 
  wishlistItems = [], 
  onRemoveItem, 
  onAddToCart,
  onQuantityChange
}) => {
  // État pour gérer les quantités de chaque produit
  const [quantities, setQuantities] = useState(
    wishlistItems.reduce((acc, item) => {
      acc[item.id] = 1;
      return acc;
    }, {})
  );

  // Gestion du changement de quantité
  const handleQuantityChange = (id, value) => {
    // Valider que la valeur est un nombre positif
    const newQuantity = Math.max(1, parseInt(value) || 1);
    
    setQuantities(prev => ({
      ...prev,
      [id]: newQuantity
    }));

    if (onQuantityChange) {
      onQuantityChange(id, newQuantity);
    }
  };

  // Ajout au panier avec la quantité actuelle
  const handleAddToCart = (item) => {
    if (onAddToCart) {
      onAddToCart(item, quantities[item.id]);
    }
  };

  // Si la liste est vide
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="text-center p-5 bg-light rounded">
        <div className="mb-4">
          <i className="icofont-heart text-muted" style={{ fontSize: '3rem' }}></i>
        </div>
        <h5>Votre liste de souhaits est vide</h5>
        <p className="text-muted">Parcourez notre catalogue et ajoutez des produits à votre liste de souhaits</p>
        <Link href="/shop" passHref legacyBehavior>
          <Button variant="primary" className="mt-3">
            Continuer mes achats
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-table-container">
      <div className="table-responsive">
        <Table hover className="wishlist-table">
          <thead className="bg-light">
            <tr>
              <th className="border-0">Produit</th>
              <th className="border-0">Prix</th>
              <th className="border-0">Disponibilité</th>
              <th className="border-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map((item) => (
              <tr key={item.id}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <div className="product-image me-3" style={{ width: '80px', height: '80px' }}>
                      {item.image && (
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          width={80}
                          height={80}
                          className="img-fluid rounded"
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div>
                      <Link href={`/product/${item.slug}`} passHref legacyBehavior>
                        <span className="product-title fw-medium text-decoration-none">
                          {item.name}
                        </span>
                      </Link>
                      {item.variant && <div className="small text-muted">{item.variant}</div>}
                    </div>
                  </div>
                </td>
                <td className="align-middle">
                  <div className="product-price">
                    {item.discountPrice ? (
                      <>
                        <span className="text-primary fw-medium">{item.discountPrice.toFixed(2)} €</span>
                        <del className="small text-muted ms-2">{item.price.toFixed(2)} €</del>
                      </>
                    ) : (
                      <span className="fw-medium">{item.price.toFixed(2)} €</span>
                    )}
                  </div>
                </td>
                <td className="align-middle">
                  {item.inStock ? (
                    <span className="badge bg-success-subtle text-success">En stock</span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger">Épuisé</span>
                  )}
                </td>
                <td className="align-middle">
                  <div className="btn-group">
                    <Button 
                      variant="primary" 
                      size="sm"
                      disabled={!item.inStock}
                      onClick={() => onAddToCart && onAddToCart(item.id)}
                    >
                      <i className="icofont-shopping-cart me-1"></i>
                      Ajouter au panier
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => onRemoveItem && onRemoveItem(item.id)}
                    >
                      <i className="icofont-trash"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <style jsx>{`
        .wishlist-table-container {
          margin-bottom: 2rem;
        }
        .wishlist-table th {
          font-weight: 500;
        }
        .product-title {
          color: #333;
          cursor: pointer;
        }
        .product-title:hover {
          color: var(--bs-primary);
        }
      `}</style>
    </div>
  );
};

export default EcomWishlistTable;