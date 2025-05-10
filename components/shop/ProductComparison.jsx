
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Card, Badge } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ProductComparison = ({ products = [] }) => {
  const router = useRouter();
  const [comparisonFeatures, setComparisonFeatures] = useState([]);
  
  // Extraire dynamiquement toutes les caractéristiques de spécifications
  useEffect(() => {
    if (products && products.length > 0) {
      const allFeatures = new Set();
      
      // Collecter toutes les caractéristiques uniques de tous les produits
      products.forEach(product => {
        if (product.specifications && Array.isArray(product.specifications)) {
          product.specifications.forEach(spec => {
            if (spec.key) {
              allFeatures.add(spec.key);
            }
          });
        }
      });
      
      // Convertir l'ensemble en tableau et trier alphabétiquement
      setComparisonFeatures([...allFeatures].sort());
    }
  }, [products]);

  // Obtenir la valeur d'une spécification pour un produit donné
  const getSpecValue = (product, featureKey) => {
    if (!product || !product.specifications) return "Non spécifié";
    
    const spec = product.specifications.find(s => s.key === featureKey);
    return spec ? spec.value : "Non spécifié";
  };

  if (!products || products.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Comparaison de produits</h2>
        <p className="mt-4">Aucun produit à comparer. Veuillez sélectionner des produits depuis la boutique.</p>
        <Button 
          variant="primary" 
          className="mt-3" 
          onClick={() => router.push('/shop')}
        >
          Retour à la boutique
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 product-comparison">
      <h2 className="mb-4 text-center">Comparaison de produits</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button 
          variant="outline-secondary" 
          size="sm"
          onClick={() => router.push('/shop')}
        >
          <i className="icofont-plus me-1"></i>Ajouter un produit
        </Button>
      </div>
      <div className="table-responsive">
        <Table bordered hover className="comparison-table">
          <thead>
            <tr className="bg-light">
              <th style={{ minWidth: '150px' }}>Caractéristiques</th>
              {products.map((product, idx) => (
                <th key={idx} className="text-center" style={{ minWidth: '220px' }}>
                  <div className="d-flex flex-column align-items-center">
                    <div className="position-relative mb-2" style={{ width: '100px', height: '100px' }}>
                      <Image
                        src={product.image || '/assets/images/shop/placeholder.jpg'}
                        alt={product.name}
                        layout="fill"
                        objectFit="contain"
                        className="product-thumbnail"
                      />
                    </div>
                    <Link
                      href={`/shop/product/${product._id}`}
                      className="mb-1 product-name"
                      legacyBehavior>
                      {product.name}
                    </Link>
                    <div className="product-price fw-bold mb-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-decoration-line-through text-muted me-2">
                            {product.price.toFixed(2)} €
                          </span>
                          <span className="text-danger">{product.salePrice.toFixed(2)} €</span>
                        </>
                      ) : (
                        <span>{product.price.toFixed(2)} €</span>
                      )}
                    </div>
                    <div className="d-flex gap-2 mt-1 mb-2">
                      <Link href={`/shop/product/${product._id}`} passHref legacyBehavior>
                        <Button size="sm" variant="outline-primary">Voir</Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="danger"
                        onClick={() => {
                          // Logique pour retirer de la comparaison
                          const newProducts = products.filter(p => p._id !== product._id);
                          // Mettre à jour le localStorage ou état global
                          localStorage.setItem('comparisonProducts', JSON.stringify(newProducts.map(p => p._id)));
                          // Rediriger vers la même page pour actualiser
                          router.push(router.asPath);
                        }}
                      >
                        Retirer
                      </Button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Informations de base */}
            <tr>
              <td className="fw-bold bg-light">Marque</td>
              {products.map((product, idx) => (
                <td key={idx} className="text-center">
                  {product.brand || "Non spécifié"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="fw-bold bg-light">Catégorie</td>
              {products.map((product, idx) => (
                <td key={idx} className="text-center">
                  {product.category || "Non classé"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="fw-bold bg-light">Stock</td>
              {products.map((product, idx) => (
                <td key={idx} className="text-center">
                  {product.stock > 0 ? (
                    <Badge bg="success" pill>En stock ({product.stock})</Badge>
                  ) : (
                    <Badge bg="danger" pill>Rupture de stock</Badge>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="fw-bold bg-light">Note</td>
              {products.map((product, idx) => (
                <td key={idx} className="text-center">
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i}
                        className={`icofont-star ${i < Math.round(product.rating || 0) ? 'text-warning' : 'text-muted'}`}
                      ></i>
                    ))}
                    <span className="ms-2 text-muted">
                      ({product.ratingsCount || 0} avis)
                    </span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="fw-bold bg-light">Couleurs disponibles</td>
              {products.map((product, idx) => (
                <td key={idx} className="text-center">
                  {product.colors && product.colors.length > 0 ? (
                    <div className="d-flex justify-content-center gap-1 flex-wrap">
                      {product.colors.map((color, colorIdx) => (
                        <div 
                          key={colorIdx}
                          className="color-dot"
                          style={{ 
                            backgroundColor: color.hex || '#ccc',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: '1px solid #ddd'
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  ) : (
                    <span>Non spécifié</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="fw-bold bg-light">Tailles disponibles</td>
              {products.map((product, idx) => (
                <td key={idx} className="text-center">
                  {product.sizes && product.sizes.length > 0 ? (
                    <div className="d-flex justify-content-center gap-1 flex-wrap">
                      {product.sizes.map((size, sizeIdx) => (
                        <Badge 
                          key={sizeIdx} 
                          bg="light" 
                          text="dark"
                          className="border"
                        >
                          {size}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span>Non spécifié</span>
                  )}
                </td>
              ))}
            </tr>
            
            {/* Spécifications techniques */}
            {comparisonFeatures.length > 0 && (
              <tr className="section-header">
                <td colSpan={products.length + 1} className="bg-primary text-white fw-bold">
                  Spécifications techniques
                </td>
              </tr>
            )}
            
            {comparisonFeatures.map((feature, idx) => (
              <tr key={idx}>
                <td className="fw-bold bg-light">{feature}</td>
                {products.map((product, productIdx) => (
                  <td key={productIdx} className="text-center">
                    {getSpecValue(product, feature)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Row className="mt-5">
        <Col className="text-center">
          <Button 
            variant="primary" 
            className="me-2"
            onClick={() => router.push('/shop')}
          >
            Continuer vos achats
          </Button>
          <Button 
            variant="outline-secondary"
            onClick={() => {
              localStorage.removeItem('comparisonProducts');
              router.push('/shop');
            }}
          >
            Effacer la comparaison
          </Button>
        </Col>
      </Row>
      <style jsx global>{`
        .comparison-table th, .comparison-table td {
          vertical-align: middle;
        }
        .section-header td {
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
        }
        .product-name {
          color: var(--bs-primary);
          font-weight: 500;
          text-decoration: none;
          display: block;
          text-align: center;
          transition: color 0.2s;
        }
        .product-name:hover {
          color: var(--bs-primary-darker);
          text-decoration: underline;
        }
        .product-thumbnail {
          background-color: #f8f9fa;
          border-radius: 8px;
          transition: transform 0.2s;
        }
        .product-thumbnail:hover {
          transform: scale(1.05);
        }
      `}</style>
    </Container>
  );
};

export default ProductComparison;
