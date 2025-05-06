
import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import Layout from '../../components/Layout';
import ProductComparison from '../../components/shop/ProductComparison';
import Head from 'next/head';

const ComparePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComparisonProducts = async () => {
      try {
        // Récupérer les IDs des produits à comparer depuis localStorage
        const productIds = JSON.parse(localStorage.getItem('comparisonProducts') || '[]');
        
        if (productIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }
        
        // Récupérer les détails de chaque produit
        const productsData = await Promise.all(
          productIds.map(async (id) => {
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) throw new Error(`Erreur lors du chargement du produit ${id}`);
            return res.json();
          })
        );
        
        setProducts(productsData);
      } catch (err) {
        console.error('Erreur lors du chargement des produits de comparaison:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };
    
    loadComparisonProducts();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Comparaison de produits | Votre Boutique</title>
        <meta name="description" content="Comparez les produits côte à côte pour faire le meilleur choix." />
      </Head>
      
      {loading ? (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </Container>
      ) : error ? (
        <Container className="py-5 text-center">
          <h2>Une erreur est survenue</h2>
          <p className="text-danger">{error}</p>
        </Container>
      ) : (
        <ProductComparison products={products} />
      )}
    </Layout>
  );
};

export default ComparePage;
