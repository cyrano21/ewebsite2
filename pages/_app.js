import AuthProvider from '../contexts/AuthProvider';
import Layout from "../components/Layout";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "../contexts/WishlistContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import PropTypes from "prop-types";
import { useEffect } from "react";

// Importation organisée des styles CSS
// 1. Styles de base externes
import "bootstrap/dist/css/bootstrap.min.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// 2. Styles globaux de l'application
import "../styles/globals.css";

// 3. Styles spécifiques des composants et fonctionnalités
import "../styles/admin-table.css";
import '../styles/banner.css';
import "../styles/nav-custom.css";
import "../components/modal.css";

// 4. Styles pour les assets statiques (si nécessaire)
import "../public/styles/theme.css";
import "../public/styles/animations.css";
import "../public/styles/responsive.css";

console.log("_app.js: Début du chargement");

function MyApp({ Component, pageProps }) {
  console.log("_app.js: Initialisation du composant MyApp");

  // Utiliser le layout personnalisé du composant s'il existe, sinon utiliser Layout
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  // Charger Bootstrap JS côté client uniquement
  useEffect(() => {
    console.log("_app.js: useEffect - chargement de Bootstrap JS");
    import("bootstrap/dist/js/bootstrap.min.js");
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <AuthProvider>
        <NotificationProvider>
          <WishlistProvider>
          {console.log("_app.js: Rendu du AuthProvider")}
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          {console.log("_app.js: Avant rendu du Component")}
          {(() => {
            try {
              console.log(
                "🧪 Rendu de:",
                Component?.name || "Component inconnu"
              );
              // Appliquer directement le layout
              return getLayout(<Component {...pageProps} />);
            } catch (e) {
              console.error("❌ Erreur lors du rendu de Component:", Component);
              throw e;
            }
          })()}

          {console.log("_app.js: Après rendu du Component")}
          </WishlistProvider>
        </NotificationProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

console.log("_app.js: Exportation de MyApp");
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};

export default MyApp;
