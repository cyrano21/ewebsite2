import AuthProvider from '../contexts/AuthProvider';
import 'chart.js/auto';
import Layout from "../components/Layout";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "../contexts/WishlistContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import PropTypes from "prop-types";
import { useEffect } from "react";

// Import de l'outil de diagnostic des rechargements
import '../utils/hmr-debug';

// Le correctif pour le rechargement a été supprimé car il causait des rechargements en boucle

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

  // Ajout d'un log pour identifier les montages/rechargements du composant racine
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔄 _app.js: Composant racine monté/rechargé à', new Date().toISOString());
      
      // Surveiller les erreurs non gérées qui pourraient causer des rechargements
      const originalError = console.error;
      console.error = function(...args) {
        const errorMsg = args.join(' ');
        if (errorMsg.includes('Hydration') || errorMsg.includes('Rendering') || 
            errorMsg.includes('React state') || errorMsg.includes('chunk load')) {
          console.warn('⚠️ Erreur potentiellement liée aux rechargements détectée:', errorMsg);
        }
        return originalError.apply(console, args);
      };

      // Surveiller les messages du client de développement Next.js
      const devMessages = [];
      const devOriginals = {
        info: console.info,
        log: console.log,
        warn: console.warn
      };

      Object.keys(devOriginals).forEach(key => {
        console[key] = function(...args) {
          const msg = args.join(' ');
          if (msg.includes('webpack') || msg.includes('HMR') || 
              msg.includes('hot') || msg.includes('module replacement') ||
              msg.includes('reload') || msg.includes('rebuild')) {
            devMessages.push({ type: key, message: msg, time: new Date().toISOString() });
            console.warn(`🔥 Message dev Next.js détecté [${key}]:`, msg);
            
            // Stockage local pour analyse post-rechargement
            try {
              localStorage.setItem('next-dev-messages', JSON.stringify(devMessages.slice(-20)));
            } catch (e) {}
          }
          return devOriginals[key].apply(console, args);
        };
      });
    }
  }, []);

  return (
    <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
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