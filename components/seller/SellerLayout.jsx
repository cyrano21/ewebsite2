
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Nav, Navbar, Dropdown, Button } from 'react-bootstrap';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';

const SellerLayout = ({ children, title = "Espace Vendeur" }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const navItems = [
    { label: 'Tableau de bord', path: '/seller/dashboard', icon: 'icofont-dashboard-web' },
    { label: 'Produits', path: '/seller/products', icon: 'icofont-shopping-cart' },
    { label: 'Commandes', path: '/seller/orders', icon: 'icofont-delivery-time' },
    { label: 'Clients', path: '/seller/customers', icon: 'icofont-users-alt-5' },
    { label: 'Analyses', path: '/seller/analytics', icon: 'icofont-chart-bar-graph' },
    { label: 'Paramètres', path: '/seller/settings', icon: 'icofont-settings' },
  ];

  return (
    <>
      <Head>
        <title>{title} | Plateforme E-commerce</title>
      </Head>

      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm" expanded={expanded}>
        <Container fluid>
          <Link href="/seller/dashboard" passHref>
            <Navbar.Brand className="d-flex align-items-center">
              <i className="icofont-shopping-cart me-2"></i>
              Espace Vendeur
            </Navbar.Brand>
          </Link>
          
          <Navbar.Toggle 
            aria-controls="seller-navbar" 
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          
          <Navbar.Collapse id="seller-navbar">
            <Nav className="me-auto">
              {navItems.map((item, index) => (
                <Nav.Link 
                  key={index}
                  as={Link}
                  href={item.path}
                  active={router.pathname === item.path}
                  onClick={() => setExpanded(false)}
                  className="d-flex align-items-center"
                >
                  <i className={`${item.icon} me-1`}></i> {item.label}
                </Nav.Link>
              ))}
            </Nav>

            <Nav>
              <Link href="/" passHref>
                <Nav.Link className="d-flex align-items-center me-3">
                  <i className="icofont-home me-1"></i> Retour au site
                </Nav.Link>
              </Link>
              
              {session?.user && (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" id="dropdown-seller-profile">
                    <i className="icofont-user me-1"></i>
                    {session.user.name || 'Mon compte'}
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu>
                    <Dropdown.Item href="/seller/settings">
                      <i className="icofont-settings me-2"></i> Paramètres
                    </Dropdown.Item>
                    <Dropdown.Item href="/seller/profile">
                      <i className="icofont-user me-2"></i> Profil
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleSignOut}>
                      <i className="icofont-logout me-2"></i> Déconnexion
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="seller-main py-4" style={{ minHeight: 'calc(100vh - 130px)' }}>
        {children}
      </main>

      <footer className="bg-light text-center py-3 border-top">
        <Container>
          <small className="text-muted">
            &copy; {new Date().getFullYear()} Plateforme E-commerce - Espace Vendeur
          </small>
        </Container>
      </footer>

      <style jsx global>{`
        .seller-sidebar {
          min-height: calc(100vh - 56px);
          background-color: #f8f9fa;
        }
        
        .navbar .nav-link.active {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .navbar .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

export default SellerLayout;
