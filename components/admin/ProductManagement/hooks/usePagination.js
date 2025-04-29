// components/admin/ProductManagement/hooks/usePagination.js
import { useMemo, useState, useEffect } from 'react'; // <<< AJOUT DE useEffect ICI

export const usePagination = (totalItems, initialPage = 1, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => {
    if (!totalItems || totalItems <= 0) return 1;
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  // S'assurer que la page actuelle n'est pas hors limites
  useEffect(() => {
      // Si le nombre total de pages change (ex: après filtrage) et que
      // la page actuelle devient supérieure, on revient à la dernière page valide.
      if (currentPage > totalPages) {
          setCurrentPage(totalPages || 1);
      }
      // Si la page actuelle est 0 ou moins (ne devrait pas arriver mais par sécurité)
      else if (currentPage < 1 && totalPages >= 1) {
           setCurrentPage(1);
      }
  }, [currentPage, totalPages]); // Dépend de currentPage et totalPages


  const paginate = (pageNumber) => {
    // S'assurer que le numéro de page demandé est valide
    const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
    if (newPage !== currentPage) { // Changer seulement si la page est différente
        setCurrentPage(newPage);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return {
    currentPage,
    setCurrentPage: paginate, // Exposer la fonction paginate contrôlée
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    itemsPerPage
  };
};