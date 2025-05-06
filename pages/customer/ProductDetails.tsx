import ProductDescription from 'components/modules/e-commerce/ProductDescription';
import ProductDetailsTab from 'components/common/ProductDetailsTab';
import { topElectronicProducts } from 'data/e-commerce/products';
import SimilarProducts from 'components/sliders/SimilarProducts';
import Section from 'components/base/Section';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import { ecomBreadcrumbItems } from 'data/commonData';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Données de produit par défaut
const defaultProduct = {
  id: "default",
  name: "Chargement du produit...",
  price: 0,
  stock: 0,
  category: "",
  description: "Chargement de la description...",
  images: [],
  reviews: []
};

const ProductDetails = ({ initialId }) => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Utiliser l'ID provenant de getServerSideProps ou de router.query
  const productId = id || initialId || "default";

  useEffect(() => {
    if (productId && productId !== "default") {
      // Dans un cas réel, utilisez l'ID pour faire un appel API
      // Exemple de chargement de données de produit
      setProduct({
        id: productId,
        name: "Produit exemple",
        price: 199.99,
        discountPrice: 149.99,
        rating: 4.5,
        stock: 15,
        category: "Électronique",
        description: "Description détaillée du produit exemple.",
        images: ["/assets/images/products/01.jpg"],
        reviews: [],
        specifications: [
          { name: "Marque", value: "Exemple" },
          { name: "Modèle", value: "E2023" }
        ]
      });
      setLoading(false);
    }
  }, [productId]);

  // Déterminer l'objet produit à utiliser
  const displayProduct = product || defaultProduct;

  // Vérifier si nous sommes côté client
  const isClient = typeof window !== 'undefined';

  return (
    <div className="pt-5 mb-9">
      <Section small className="py-0">
        <PageBreadcrumb items={ecomBreadcrumbItems} className="mb-3" />
        <ProductDescription product={displayProduct} />
      </Section>

      <Section small className="py-0">
        <div className="mb-9">
          <ProductDetailsTab productId={productId} />
        </div>
      </Section>

      {isClient && (
        <Section className="py-0">
          <SimilarProducts 
            products={topElectronicProducts.slice(0, 6)} 
            title="Produits similaires"
          />
        </Section>
      )}
    </div>
  );
};

// Utiliser getServerSideProps à la place de getStaticProps/getStaticPaths
export async function getServerSideProps(context) {
  // Récupérer l'ID du produit depuis les paramètres d'URL
  const { id } = context.query;

  return {
    props: {
      // Passer l'ID initial au composant pour éviter des problèmes d'hydratation
      initialId: id || null,
    },
  };
}

export default ProductDetails;
