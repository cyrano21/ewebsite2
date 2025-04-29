// components/admin/ProductManagement/hooks/useModalState.js
import { useState, useCallback } from 'react';

export const useModalState = (initialData = null) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(initialData);

  const openModal = useCallback((data = initialData) => {
    setModalData(data);
    setIsOpen(true);
  }, [initialData]); // S'assurer que initialData est stable ou retiré des dépendances si non nécessaire

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Optionnel: Réinitialiser les données à la fermeture
    // setModalData(initialData);
  }, []); // Pas de dépendances pour closeModal

  return {
    isOpen,
    openModal,
    closeModal,
    modalData,
    setModalData, // Exposer pour mises à jour directes si besoin
  };
};

// Vous pourriez utiliser ce hook générique 3 fois dans ProductManagement
// ou créer des hooks spécifiques comme suit :

// components/admin/ProductManagement/hooks/useProductModal.js
// import { useModalState } from './useModalState';
// export const useProductModal = (initialProductData = null) => useModalState(initialProductData);

// components/admin/ProductManagement/hooks/useCategoryModal.js
// import { useModalState } from './useModalState';
// export const useCategoryModal = () => useModalState(false); // Pas de data initiale spécifique

// components/admin/ProductManagement/hooks/usePreviewModal.js
// import { useModalState } from './useModalState';
// export const usePreviewModal = () => useModalState(null);