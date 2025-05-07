import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

// Données factices pour la démonstration
const WISHLIST_ITEMS = [
  {
    id: '1',
    name: 'Produit exemple 1',
    image: '/placeholder.jpg',
    price: 99.99,
    availability: 'En stock',
    url: '/product/1'
  },
  {
    id: '2',
    name: 'Produit exemple 2',
    image: '/placeholder.jpg',
    price: 149.99,
    availability: 'En stock',
    url: '/product/2'
  },
  {
    id: '3',
    name: 'Produit exemple 3',
    image: '/placeholder.jpg',
    price: 199.99,
    availability: 'Rupture de stock',
    url: '/product/3'
  },
];

const EcomWishlistTable = () => {
  const [wishlistItems, setWishlistItems] = useState(WISHLIST_ITEMS);

  const handleRemoveItem = (id: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleAddToCart = (id: string) => {
    // Implémentation à faire: logique pour ajouter au panier
    console.log(`Ajout au panier: ${id}`);
    // Après ajout au panier, on pourrait vouloir supprimer de la liste
    // handleRemoveItem(id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-5">
        <p>Votre liste de souhaits est vide.</p>
        <Link href="/products" passHref legacyBehavior>
          <a className="btn btn-primary">Découvrir nos produits</a>
        </Link>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table bordered hover className="fs--1 mb-0">
        <thead>
          <tr>
            <th className="align-middle" style={{ minWidth: '200px' }}>Produit</th>
            <th className="align-middle">Prix</th>
            <th className="align-middle">Disponibilité</th>
            <th className="align-middle">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wishlistItems.map(item => (
            <tr key={item.id}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="position-relative me-3" style={{ width: '60px', height: '60px' }}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <Link href={item.url} passHref legacyBehavior>
                    <a className="stretched-link text-decoration-none">{item.name}</a>
                  </Link>
                </div>
              </td>
              <td className="align-middle">
                <span className="fw-semibold">{item.price.toFixed(2)} €</span>
              </td>
              <td className="align-middle">
                <span className={`badge ${item.availability === 'En stock' ? 'bg-success' : 'bg-warning'}`}>
                  {item.availability}
                </span>
              </td>
              <td className="align-middle">
                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleAddToCart(item.id)}
                    disabled={item.availability !== 'En stock'}
                  >
                    Ajouter au panier
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EcomWishlistTable;