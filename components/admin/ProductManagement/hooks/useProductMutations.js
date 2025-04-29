
// components/admin/ProductManagement/hooks/useProductMutations.js
import { useState } from 'react';

export const useProductMutations = ({ addSingleProductState, updateSingleProductState, removeSingleProductState, updateHistoryAndStats }) => {
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState(null);

  const addProduct = async (productData) => {
    setIsMutating(true);
    setMutationError(null);
    try {
      const res = await fetch('/api/products', { // Adapter l'URL API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) {
          const errorData = await res.json().catch(() => ({})); // Essayer de lire le corps de l'erreur
          throw new Error(errorData.message || `Erreur création ${res.status}`);
      }
      const created = await res.json();
      addSingleProductState(created); // Met à jour l'état local
      updateHistoryAndStats(created.id || created._id, 'Création', 'Produit ajouté', created); // Met à jour historique/stats
      return created; // Retourner le produit créé
    } catch (err) {
      console.error('Erreur création produit:', err);
      setMutationError(err.message);
      throw err; // Renvoyer l'erreur pour la gestion dans le composant
    } finally {
      setIsMutating(false);
    }
  };

  const updateProduct = async (productId, productData) => {
     setIsMutating(true);
     setMutationError(null);
     try {
       const res = await fetch(`/api/products/${productId}`, { // Adapter l'URL API
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(productData)
       });
       if (!res.ok) {
           const errorData = await res.json().catch(() => ({}));
           throw new Error(errorData.message ||`Erreur mise à jour ${res.status}`);
       }
       const updated = await res.json();
       updateSingleProductState(updated); // Met à jour l'état local
       updateHistoryAndStats(productId, 'Modification', 'Mise à jour infos', updated);
       return updated;
     } catch (err) {
       console.error('Erreur maj produit:', err);
       setMutationError(err.message);
       throw err;
     } finally {
       setIsMutating(false);
     }
  };

   const deleteProduct = async (productId, productName) => {
     setIsMutating(true);
     setMutationError(null);
     try {
       const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' }); // Adapter l'URL API
       if (!res.ok) {
           const errorData = await res.json().catch(() => ({}));
           throw new Error(errorData.message ||`Erreur suppression ${res.status}`);
       }
       removeSingleProductState(productId); // Met à jour l'état local
       updateHistoryAndStats(productId, 'Suppression', `Produit "${productName}" supprimé`);
       return true; // Indiquer le succès
     } catch (err) {
       console.error('Erreur suppression produit:', err);
       setMutationError(err.message);
       throw err;
     } finally {
       setIsMutating(false);
     }
   };

  return { addProduct, updateProduct, deleteProduct, isMutating, mutationError };
};