import AuthProvider from '../contexts/AuthProvider';
import 'chart.js/auto';
import Layout from "../components/Layout";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "../contexts/WishlistContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import PropTypes from "prop-types";
import { useEffect } from "react";
import dynamic from 'next/dynamic'; // Added import

// Désactiver temporairement le HMR pour éviter les rechargements en boucle
import '../utils/disable-hmr';

// L'outil de diagnostic restera disponible mais en mode passif
import setupHMRDebug from '../utils/hmr-debug';

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

// Suppression des erreurs de console en mode développement pour les erreurs d'hydratation
// Cela aide au débogage sans affecter la production
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Hydration failed') || 
       args[0].includes('Expected server HTML') ||
       args[0].includes('React does not recognize'))
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

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

      // Sauvegarder les méthodes de console originales
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalLog = console.log;
      const originalInfo = console.info;

      // Créer les fonctions de surveillance sans références circulaires
      console.error = function(...args) {
        const errorMsg = args.join(' ');
        if (errorMsg.includes('Hydration') || errorMsg.includes('Rendering') || 
            errorMsg.includes('React state') || errorMsg.includes('chunk load')) {
          originalWarn.call(console, '⚠️ Erreur potentiellement liée aux rechargements détectée:', errorMsg);
        }
        return originalError.apply(console, args);
      };

      // Surveiller les messages du client de développement Next.js
      const devMessages = [];

      // Substituer log, warn et info
      console.warn = function(...args) {
        const msg = args.join(' ');
        if (msg.includes('webpack') || msg.includes('HMR') || 
            msg.includes('hot') || msg.includes('module replacement') ||
            msg.includes('reload') || msg.includes('rebuild')) {
          devMessages.push({ type: 'warn', message: msg, time: new Date().toISOString() });
          originalWarn.call(console, `🔥 Message dev Next.js détecté [warn]:`, msg);

          // Stockage local pour analyse post-rechargement
          try {
            localStorage.setItem('next-dev-messages', JSON.stringify(devMessages.slice(-20)));
          } catch (e) {}
        }
        return originalWarn.apply(console, args);
      };

      console.log = function(...args) {
        const msg = args.join(' ');
        if (msg.includes('webpack') || msg.includes('HMR') || 
            msg.includes('hot') || msg.includes('module replacement') ||
            msg.includes('reload') || msg.includes('rebuild')) {
          devMessages.push({ type: 'log', message: msg, time: new Date().toISOString() });
          originalWarn.call(console, `🔥 Message dev Next.js détecté [log]:`, msg);

          try {
            localStorage.setItem('next-dev-messages', JSON.stringify(devMessages.slice(-20)));
          } catch (e) {}
        }
        return originalLog.apply(console, args);
      };

      console.info = function(...args) {
        const msg = args.join(' ');
        if (msg.includes('webpack') || msg.includes('HMR') || 
            msg.includes('hot') || msg.includes('module replacement') ||
            msg.includes('reload') || msg.includes('rebuild')) {
          devMessages.push({ type: 'info', message: msg, time: new Date().toISOString() });
          originalWarn.call(console, `🔥 Message dev Next.js détecté [info]:`, msg);

          try {
            localStorage.setItem('next-dev-messages', JSON.stringify(devMessages.slice(-20)));
          } catch (e) {}
        }
        return originalInfo.apply(console, args);
      };
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