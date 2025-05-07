import AuthProvider from '../contexts/AuthProvider';
import Layout from "../components/Layout";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "../contexts/WishlistContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import PropTypes from "prop-types";
import { useEffect } from "react";

// Import du correctif spécifique pour le problème de rechargement constant
import "../utils/fix-hmr-reload";

// Styles importés de façon optimisée pour la production
// Styles externes
import "bootstrap/dist/css/bootstrap.min.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Styles de l'application
import "../styles/globals.css";
import "../styles/admin-table.css";
import '../styles/banner.css';
import "../styles/nav-custom.css";
import "../components/modal.css";

// Remarque: les styles sont importés directement depuis le répertoire styles au lieu de public/styles
// pour éviter les problèmes de déploiement sur Vercel
import "../styles/theme.css";  
import "../styles/animations.css";
import "../styles/responsive.css";

function MyApp({ Component, pageProps }) {
  // Utiliser le layout personnalisé du composant s'il existe, sinon utiliser Layout
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  // Charger Bootstrap JS côté client uniquement
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.min.js");
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <AuthProvider>
        <NotificationProvider>
          <WishlistProvider>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          {getLayout(<Component {...pageProps} />)}
          </WishlistProvider>
        </NotificationProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};

export default MyApp;
