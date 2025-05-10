import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

const SellerLayout = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === 'admin';

  if (isAdmin) {
    console.log('Accès administrateur au tableau de bord vendeur');
  }

  return (
    <div className="seller-dashboard-layout">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Link href="/seller" passHref legacyBehavior>
            <Navbar.Brand>Tableau de bord Vendeur</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="seller-navbar" onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="seller-navbar" in={expanded}>
            <Nav className="me-auto">
              <Link href="/seller/dashboard" passHref legacyBehavior>
                <Nav.Link>Statistiques</Nav.Link>
              </Link>
              <Link href="/seller/products" passHref legacyBehavior>
                <Nav.Link>Produits</Nav.Link>
              </Link>
              <Link href="/seller/orders" passHref legacyBehavior>
                <Nav.Link>Commandes</Nav.Link>
              </Link>
              <Link href="/seller/customers" passHref legacyBehavior>
                <Nav.Link>Clients</Nav.Link>
              </Link>
              {isAdmin && (
                <Link href="/admin" passHref legacyBehavior>
                  <Nav.Link>Administration</Nav.Link>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="container py-4">
        {children}
      </main>
    </div>
  );
};

export default SellerLayout;