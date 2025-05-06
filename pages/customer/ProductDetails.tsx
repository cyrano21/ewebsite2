import Section from 'components/base/Section';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import { ecomBreadcrumbItems } from 'data/commonData';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Import dynamique des composants avec SSR désactivé
const ProductDescription = dynamic(
  () => import('components/modules/e-commerce/ProductDescription'),
  { ssr: false }
);

const ProductDetailsTab = dynamic(
  () => import('components/common/ProductDetailsTab'),
  { ssr: false }
);

const SimilarProducts = dynamic(
  () => import('components/sliders/SimilarProducts'),
  { ssr: false }
);

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
  const [similarProducts, setSimilarProducts] = useState([]);

  // État pour vérifier si on est côté client
  const [isClient, setIsClient] = useState(false);

  // Utiliser l'ID provenant de getServerSideProps ou de router.query
  const productId = id || initialId || "default";

  useEffect(() => {
    // Marquer qu'on est côté client après le montage du composant
    setIsClient(true);

    // Chargement des données du produit
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

    // Chargement des produits similaires
    import('data/e-commerce/products').then((module) => {
      setSimilarProducts(module.topElectronicProducts.slice(0, 6));
    });
  }, [productId]);

  // Déterminer l'objet produit à utiliser
  const displayProduct = product || defaultProduct;

  // Afficher un placeholder pendant le chargement côté client
  if (!isClient) {
    return (
      <div className="pt-5 mb-9">
        <Section small className="py-0">
          <PageBreadcrumb items={ecomBreadcrumbItems} className="mb-3" />
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des détails du produit...</p>
          </div>
        </Section>
      </div>
    );
  }

  // Rendu principal (uniquement côté client)
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

      <Section className="py-0">
        <SimilarProducts 
          products={similarProducts} 
          title="Produits similaires"
        />
      </Section>
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
