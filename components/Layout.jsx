import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import NavItems from './NavItems';
import Footer from './Footer';

export default function Layout({ children, title = 'Mon Site' }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');
  
  // Ne pas rendre la navbar et le footer pour les pages d'administration
  if (isAdmin) {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main>{children}</main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Navigation */}
      <header>
        <NavItems />
      </header>
      
      {/* Contenu Principal */}
      <main style={{ marginTop: '100px' }}>{children}</main>
      
      {/* Pied de page */}
      <Footer />
      
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
  title: PropTypes.string
};
