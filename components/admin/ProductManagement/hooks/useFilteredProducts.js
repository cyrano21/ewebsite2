
// components/admin/ProductManagement/hooks/useFilteredProducts.js
import { useMemo } from 'react';

export const useFilteredProducts = (products, filters) => {
  const { searchTerm, selectedCategory, priceRange, sortOption } = filters;

  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let result = [...products];

    // Filtrage
    if (selectedCategory && selectedCategory !== 'Tous') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(lowerSearch) ||
        (p.description && p.description.toLowerCase().includes(lowerSearch)) ||
        (p.category && p.category.toLowerCase().includes(lowerSearch))
        // Ajouter d'autres champs si nécessaire
      );
    }
    const minPrice = Number(priceRange?.min) || 0;
    // Utiliser un max très grand si non défini ou invalide
    const maxPrice = Number(priceRange?.max) || Number.MAX_SAFE_INTEGER;
    result = result.filter(p => (p.price >= minPrice && p.price <= maxPrice));

    // Tri
    const sortByPrice = (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
    switch (sortOption) {
      case "price-asc": result.sort(sortByPrice); break;
      case "price-desc": result.sort((a, b) => sortByPrice(b, a)); break;
      case "popularity": result.sort((a, b) => (b.popularity || b.ratingsCount || 0) - (a.popularity || a.ratingsCount || 0)); break; // Utiliser ratingsCount comme fallback
      case "rating": result.sort((a, b) => (b.ratings || 0) - (a.ratings || 0)); break;
      case "newest":
        if (result.length > 0 && result[0]?.createdAt && !isNaN(new Date(result[0].createdAt).getTime())) {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else { /* Pas de tri spécifique ou par nom/id */ }
        break;
      // case "default": default: // Pas de tri additionnel
        // break;
    }
    return result;
  }, [products, searchTerm, selectedCategory, priceRange, sortOption]);

  return filteredAndSortedProducts;
};