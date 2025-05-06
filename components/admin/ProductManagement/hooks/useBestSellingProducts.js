import { useState, useEffect } from 'react';

export const useBestSellingProducts = (limit = 5) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/products/best-selling?limit=${limit}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => {
        console.error('Erreur useBestSellingProducts:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [limit]);

  return { products, loading, error };
};
