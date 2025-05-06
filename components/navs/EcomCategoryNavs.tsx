import React from 'react';
import { Nav } from 'react-bootstrap';

// Composant temporaire pour résoudre l'erreur de build
const EcomCategoryNavs = () => {
  const categories = [
    'All Categories',
    'Electronics',
    'Home & Garden',
    'Clothing',
    'Beauty',
    'Sports',
    'Books'
  ];

  return (
    <Nav className="nav-underline mb-3 mb-md-4 mx-n3 justify-content-start">
      {categories.map((category, index) => (
        <Nav.Item key={index}>
          <Nav.Link 
            href="#!" 
            className="px-3"
            active={index === 0}
          >
            {category}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default EcomCategoryNavs;