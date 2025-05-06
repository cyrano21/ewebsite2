import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

// Hook pour gérer les mutations des produits (ajout, mise à jour, suppression)
export const useProductMutations = (refreshCallback) => {
    const [isMutating, setIsMutating] = useState(false);
    const [mutationError, setMutationError] = useState(null);

    // Ajout d'un produit
    const handleAddProduct = useCallback(async (productData) => {
        setIsMutating(true);
        setMutationError(null);
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de l\'ajout du produit');
            }

            const addedProduct = await response.json();

            toast.success(`${productData.name} a été ajouté avec succès`);

            // Utiliser le callback pour rafraîchir les produits
            if (typeof refreshCallback === 'function') {
                refreshCallback();
            }

            return addedProduct;
        } catch (error) {
            console.error('Erreur lors de l\'ajout du produit:', error);
            setMutationError(error.message || 'Une erreur est survenue lors de l\'ajout du produit');
            toast.error(error.message || 'Erreur lors de l\'ajout du produit');
            throw error;
        } finally {
            setIsMutating(false);
        }
    }, [refreshCallback]);

    // Mise à jour d'un produit
    const handleUpdateProduct = useCallback(async (productData) => {
        setIsMutating(true);
        setMutationError(null);
        try {
            const id = productData.id || productData._id;
            if (!id) {
                throw new Error('ID du produit manquant');
            }

            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la mise à jour du produit');
            }

            const updatedProduct = await response.json();
            toast.success(`${productData.name} a été mis à jour avec succès`);

            // Utiliser le callback pour rafraîchir les produits
            if (typeof refreshCallback === 'function') {
                refreshCallback();
            }

            return updatedProduct;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du produit:', error);
            setMutationError(error.message || 'Une erreur est survenue lors de la mise à jour du produit');
            toast.error(error.message || 'Erreur lors de la mise à jour du produit');
            throw error;
        } finally {
            setIsMutating(false);
        }
    }, [refreshCallback]);

    // Suppression d'un produit
    const handleDeleteProduct = useCallback(async (productId, productName) => {
        setIsMutating(true);
        setMutationError(null);
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la suppression du produit');
            }

            toast.success(`${productName || 'Produit'} supprimé avec succès`);

            // Utiliser le callback pour rafraîchir les produits
            if (typeof refreshCallback === 'function') {
                refreshCallback();
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du produit:', error);
            setMutationError(error.message || 'Une erreur est survenue lors de la suppression du produit');
            toast.error(error.message || 'Erreur lors de la suppression du produit');
            throw error;
        } finally {
            setIsMutating(false);
        }
    }, [refreshCallback]);

    return {
        handleAddProduct,
        handleUpdateProduct,
        handleDeleteProduct,
        isMutating,
        mutationError
    };
};

export default useProductMutations;