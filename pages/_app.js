import AuthProvider from '../contexts/AuthProvider';
import Layout from "../components/Layout";
// import "../styles/App.css";
// import "../styles/index.css";
import "../styles/admin-table.css";
import '../styles/banner.css';
import "../components/modal.css"; // Import du CSS de la modal utilisé dans CheckoutPage
import Head from "next/head";
import { SessionProvider } from "next-auth/react"; // Importer le SessionProvider pour NextAuth
import { WishlistProvider } from "../contexts/WishlistContext"; // Import du WishlistProvider

console.log("_app.js: Début du chargement");

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../styles/admin-table.css";
import '../styles/banner.css';
import "../components/modal.css";
import "../styles/nav-custom.css";

import { useEffect } from "react";
import { NotificationProvider } from "../contexts/NotificationContext";

import PropTypes from "prop-types";

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
            {/* CSS files are now imported at the top of the file */}
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
