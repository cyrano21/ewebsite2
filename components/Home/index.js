import React from "react";
import Layout from "../components/Layout";
import Home from "../components/Home/Home";
import { getProducts } from "../utils/api";
import NavItems from "../components/NavItems";

// Cette fonction s'exécute côté serveur à la compilation
export async function getStaticProps() {
  try {
    // Récupération des produits pour la page d'accueil
    const featuredProducts = await getProducts({ featured: true, limit: 6 });

    return {
      props: {
        featuredProducts,
      },
      // Revalidation toutes les 60 secondes (ISR - Incremental Static Regeneration)
      revalidate: 60,
    };
  } catch (error) {
    console.error("Erreur lors du chargement des produits:", error);
    return {
      props: {
        featuredProducts: [],
      },
      revalidate: 60,
    };
  }
}

import PropTypes from "prop-types";

export default function HomePage({ featuredProducts }) {
  return (
    <Layout>
          <Home featuredProducts={featuredProducts} />
    </Layout>
  );
}

HomePage.propTypes = {
  featuredProducts: PropTypes.array
};
