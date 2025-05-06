
import { useState, useEffect, useMemo } from 'react';

export const useFilteredProducts = (products, filters) => {
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Mémoriser les filtres appliqués pour éviter des recalculs inutiles
    const activeFilters = useMemo(() => {
        if (!filters) return {};

        // Ne conserver que les filtres avec des valeurs
        return Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});
    }, [filters]);

    // Appliquer les filtres lorsque les produits ou les filtres changent
    useEffect(() => {
        if (!products || products.length === 0) {
            setFilteredProducts([]);
            return;
        }

        // Si aucun filtre actif, renvoyer tous les produits
        if (Object.keys(activeFilters).length === 0) {
            setFilteredProducts(products);
            return;
        }

        // Appliquer les filtres
        const result = products.filter(product => {
            // Pour chaque filtre actif, vérifier si le produit correspond
            return Object.entries(activeFilters).every(([key, value]) => {
                if (!value) return true; // Ignorer les filtres vides

                switch (key) {
                    case 'search':
                        const searchTerms = value.toLowerCase().split(' ');
                        const searchableFields = [
                            product.name,
                            product.description,
                            product.category?.name || '',
                            product.brand || '',
                            product.sku || '',
                            product.vendor || ''
                        ].map(field => field.toLowerCase());
                        
                        // Tous les termes doivent correspondre à au moins un champ
                        return searchTerms.every(term => 
                            searchableFields.some(field => field.includes(term))
                        );
                        
                    case 'category':
                        return product.category?._id === value || product.category?.id === value;
                        
                    case 'priceRange':
                        const [min, max] = value;
                        const price = product.salePrice > 0 ? product.salePrice : product.price;
                        return (!min || price >= min) && (!max || price <= max);
                        
                    case 'stock':
                        if (value === 'inStock') return product.stock > 0;
                        if (value === 'outOfStock') return product.stock <= 0;
                        if (value === 'lowStock') return product.stock > 0 && product.stock <= 10;
                        return true;
                        
                    case 'rating':
                        return product.rating >= value;
                        
                    case 'sort':
                        // Le tri est géré séparément, pas dans le filtre
                        return true;
                        
                    default:
                        return true;
                }
            });
        });

        // Appliquer le tri si spécifié
        if (activeFilters.sort) {
            result.sort((a, b) => {
                switch (activeFilters.sort) {
                    case 'price-asc':
                        return (a.salePrice || a.price) - (b.salePrice || b.price);
                    case 'price-desc':
                        return (b.salePrice || b.price) - (a.salePrice || a.price);
                    case 'name-asc':
                        return a.name.localeCompare(b.name);
                    case 'name-desc':
                        return b.name.localeCompare(a.name);
                    case 'rating-desc':
                        return (b.rating || 0) - (a.rating || 0);
                    case 'date-desc':
                        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                    case 'date-asc':
                        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
                    case 'stock-desc':
                        return b.stock - a.stock;
                    case 'stock-asc':
                        return a.stock - b.stock;
                    default:
                        return 0;
                }
            });
        }

        setFilteredProducts(result);
    }, [products, activeFilters]);

    return {
        filteredProducts,
        activeFilters,
        hasActiveFilters: Object.keys(activeFilters).length > 0
    };
};

// Export par défaut pour assurer la compatibilité
export default useFilteredProducts;
