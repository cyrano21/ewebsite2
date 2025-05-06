import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useProductData = ({ editProductId, initialProductData = null } = {}) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalProducts, setTotalProducts] = useState(0);
    // Initialiser les catégories pour éviter les erreurs undefined
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fonction pour ajouter un seul produit à l'état
    const addSingleProductState = useCallback((product) => {
        setProducts(prevProducts => {
            // Éviter les doublons
            if (prevProducts.some(p => p._id === product._id || p.id === product._id)) {
                return prevProducts.map(p => (p._id === product._id || p.id === product._id) ? product : p);
            }
            return [product, ...prevProducts];
        });
    }, []);

    // Fonction pour mettre à jour un seul produit dans l'état
    const updateSingleProductState = useCallback((product) => {
        setProducts(prevProducts => {
            return prevProducts.map(p => {
                if (p._id === product._id || p.id === product._id || p._id === product.id || p.id === product.id) {
                    return { ...p, ...product };
                }
                return p;
            });
        });
    }, []);

    // Fonction pour supprimer un produit de l'état
    const removeSingleProductState = useCallback((productId) => {
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId && p.id !== productId));
    }, []);

    // Charger les produits
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/products');

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des produits');
                }

                const data = await response.json();

                // Normaliser les données des produits
                const normalizedProducts = Array.isArray(data.products) 
                    ? data.products.map(product => ({
                        ...product,
                        id: product._id || product.id, // Assurer la cohérence de l'ID
                      }))
                    : Array.isArray(data) 
                      ? data.map(product => ({
                          ...product,
                          id: product._id || product.id,
                        }))
                      : [];

                setProducts(normalizedProducts);
                setError(null);
            } catch (err) {
                console.error('Erreur lors du chargement des produits:', err);
                setError(err.message || 'Erreur lors du chargement des produits');
                toast.error('Erreur lors du chargement des produits');
            } finally {
                setIsLoading(false);
            }
        };

        if (!initialProductData) {
            fetchProducts();
        } else {
            // Utiliser les données initiales si fournies
            setProducts(Array.isArray(initialProductData) ? initialProductData : [initialProductData]);
            setIsLoading(false);
        }
    }, [initialProductData]);

    // Charger les catégories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des catégories');
                }

                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.error('Erreur lors du chargement des catégories:', err);
                toast.error('Erreur lors du chargement des catégories');
            }
        };

        fetchCategories();
    }, []);

    // Sélectionner un produit à éditer si editProductId est fourni
    useEffect(() => {
        if (editProductId && products.length > 0) {
            const productToEdit = products.find(p => 
                p._id === editProductId || p.id === editProductId
            );

            if (productToEdit) {
                setSelectedProduct(productToEdit);
            }
        }
    }, [editProductId, products]);

    return {
        products,
        setProducts,
        categories,
        isLoading,
        error,
        selectedProduct,
        setSelectedProduct,
        addSingleProductState,
        updateSingleProductState,
        removeSingleProductState
    };
};

// Export par défaut pour assurer la compatibilité
export default useProductData;