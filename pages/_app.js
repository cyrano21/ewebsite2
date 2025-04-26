import AuthProvider from '../contexts/AuthProvider';
import Layout from "../components/Layout";
import "../src/App.css";
import "../src/index.css";
import "../styles/admin-table.css";
import '../styles/banner.css';
import "../components/modal.css"; // Import du CSS de la modal utilisé dans CheckoutPage
import Head from "next/head";
import { WishlistProvider } from "../contexts/WishlistContext"; // Import du WishlistProvider

console.log("_app.js: Début du chargement");

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/assets/css/bootstrap-fixes.css";

// fonts and icons
import "../src/assets/css/icofont.min.css";
import "../src/assets/css/animate.css";
import "../public/assets/css/style.min.css";
// import '../components/shop/shop-list-fix.css';
import "../src/assets/css/admin.css";

// Font Awesome
import "@fortawesome/fontawesome-free/css/all.min.css";

import { useEffect } from "react";
import { NotificationProvider } from "../contexts/NotificationContext";

import PropTypes from "prop-types";

function MyApp({ Component, pageProps }) {
  console.log("_app.js: Initialisation du composant MyApp");

  // Vérifier si le composant a un layout personnalisé
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  // Charger Bootstrap JS côté client uniquement
  useEffect(() => {
    console.log("_app.js: useEffect - chargement de Bootstrap JS");
    import("bootstrap/dist/js/bootstrap.min.js");
  }, []);

  return (
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
  );
}

console.log("_app.js: Exportation de MyApp");
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};

export default MyApp;
