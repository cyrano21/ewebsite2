import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductManagement from '../../../components/admin/ProductManagement';
import AdminLayout from '../../../components/admin/AdminLayout';

const ProductEditPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    // Récupérer les données du produit depuis sessionStorage si disponibles
    if (typeof window !== 'undefined' && id) {
      const storedData = sessionStorage.getItem('editProductData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          // Garantir la présence d'un ID valide
          const validatedProductData = {
            ...parsedData,
            id: parsedData.id || parsedData._id, // Assurer la cohérence de l'ID
            isEditMode: true // Marquer explicitement pour l'édition
          };

          console.log("Données produit validées pour édition:", validatedProductData);
          setProductData(validatedProductData);
          setIsLoading(false);
          // Effacer les données après récupération
          sessionStorage.removeItem('editProductData');
        } catch (error) {
          console.error("Erreur lors de la récupération des données du produit:", error);
          setError("Erreur lors de la récupération des données du produit");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [id]);

  return (
    <AdminLayout>
      <ProductManagement editProductId={id} productDataFromShop={productData} />
    </AdminLayout>
  );
};

export default ProductEditPage;