import React from 'react';
import Link from 'next/link';

const HomeCategory = () => {
  // Données d'exemple pour les catégories
  const categories = [
    { id: 1, name: 'Électronique', image: '/path/to/electronics.jpg', count: 120 },
    { id: 2, name: 'Vêtements', image: '/path/to/clothing.jpg', count: 85 },
    { id: 3, name: 'Maison', image: '/path/to/home.jpg', count: 63 },
    { id: 4, name: 'Beauté', image: '/path/to/beauty.jpg', count: 47 },
  ];

  return (
    <div className="home-category-section py-5">
      <div className="container">
        <div className="section-header text-center mb-5">
          <h2>Découvrez nos catégories</h2>
          <p>Explorez notre vaste gamme de produits par catégorie</p>
        </div>
        
        <div className="row">
          {categories.map(category => (
            <div key={category.id} className="col-md-6 col-lg-3 mb-4">
              <div className="category-card">
                <div className="category-image">
                  {/* Utilisation d'une div au lieu d'une image pour éviter les erreurs */}
                  <div 
                    style={{
                      width: '100%',
                      height: '200px',
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {category.name}
                  </div>
                </div>
                <div className="category-content p-3">
                  <h4>{category.name}</h4>
                  <p>{category.count} produits</p>
                  <Link href={`/shop?category=${category.id}`} className="btn btn-outline-primary btn-sm">
                    Voir tous
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCategory;