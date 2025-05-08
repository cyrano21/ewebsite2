import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Container, Nav, Navbar, Dropdown, Button } from 'react-bootstrap';
import { useSession, signOut } from 'next-auth/react';
import ClientOnly from '../../utils/ClientOnly';

const SellerLayout = ({ children, title }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Redirection si non connecté
    if (status !== 'loading' && !session) {
      router.push('/login?callbackUrl=' + encodeURIComponent(router.asPath));
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  // Navigation principale du vendeur
  const sellerNavItems = [
    { label: 'Tableau de bord', path: '/seller/dashboard', icon: 'icofont-dashboard' },
    { label: 'Produits', path: '/seller/products', icon: 'icofont-shopping-cart' },
    { label: 'Commandes', path: '/seller/orders', icon: 'icofont-truck' },
    { label: 'Clients', path: '/seller/customers', icon: 'icofont-users' },
    { label: 'Analyses', path: '/seller/analytics', icon: 'icofont-chart-bar-graph' },
    { label: 'Paramètres', path: '/seller/settings', icon: 'icofont-settings' },
  ];

  // Si en cours de chargement ou non monté, afficher un placeholder
  if (status === 'loading' || !isMounted) {
    return (
      <>
        <title>{title || 'Espace vendeur'}</title>
        <div className="seller-layout">
          <Navbar bg="dark" variant="dark" expand="lg" className="seller-navbar">
            <Container fluid>
              <Navbar.Brand href="/seller/dashboard">Espace Vendeur</Navbar.Brand>
              <Navbar.Toggle aria-controls="seller-navbar-nav" />
            </Container>
          </Navbar>
          <Container className="py-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <title>{title || 'Espace vendeur'}</title>
      <div className="seller-layout">
        <Navbar bg="dark" variant="dark" expand="lg" className="seller-navbar">
          <Container fluid>
            <Navbar.Brand href="/seller/dashboard">Espace Vendeur</Navbar.Brand>
            <Navbar.Toggle aria-controls="seller-navbar-nav" />
            <Navbar.Collapse id="seller-navbar-nav">
              <Nav className="me-auto">
                {sellerNavItems.map((item, index) => (
                  <Link 
                    href={item.path} 
                    key={index} 
                    passHref
                  >
                    <Nav.Link 
                      active={router.pathname === item.path}
                      className={router.pathname === item.path ? 'active' : ''}
                    >
                      <i className={item.icon + " me-1"}></i> {item.label}
                    </Nav.Link>
                  </Link>
                ))}
              </Nav>

              <ClientOnly>
                {session?.user && (
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="outline-light" id="dropdown-seller-profile">
                      <i className="icofont-user me-1"></i>
                      {session.user.name || 'Profil'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="/seller/profile">Mon profil</Dropdown.Item>
                      <Dropdown.Item href="/seller/settings">Paramètres</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>Déconnexion</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </ClientOnly>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="seller-content py-4">
          <Container>
            {children}
          </Container>
        </div>
      </div>
    </>
  );
};

export default SellerLayout;