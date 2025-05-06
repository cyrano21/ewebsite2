import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import NavItems from './NavItems';
import Footer from './Footer';
import LiveChat from "./customer/LiveChat";
import CompareNotification from "./shop/CompareNotification"; // Added import for CompareNotification component
import SEOHead from './SEOHead';


const Layout = ({ 
  children, 
  title = 'Mon Site',
  description,
  keywords,
  ogImage,
  ogType
}) => {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');
  const canonicalUrl = router.asPath;

  // Ne pas rendre la navbar et le footer pour les pages d'administration
  if (isAdmin) {
    return (
      <>
        <SEOHead 
          title={`Admin - ${title}`}
          description="Panneau d'administration"
          canonicalUrl={canonicalUrl}
        />
        <main>{children}</main>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title={title}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
        ogType={ogType}
        canonicalUrl={canonicalUrl}
      />

      {/* Navigation - avec id unique pour éviter la duplication */}
      <header id="main-navigation-header">
        <NavItems />
      </header>

      {/* Contenu Principal */}
      <main>{children}</main>

      {/* Pied de page */}
      <Footer />
      <CompareNotification /> {/* Added CompareNotification component */}
      <LiveChat />

      {/* CSS personnalisé */}
      <style>{`
        .navbar-sticky {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .footer-links li {
          margin-bottom: 0.5rem;
        }

        .footer-contact li {
          margin-bottom: 0.75rem;
        }

        .social-links a {
          display: inline-block;
          width: 32px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background-color: var(--bs-primary);
          transform: translateY(-3px);
        }
      `}</style>
    </>
  );
}

// Validation des props
Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string
};

export default Layout;