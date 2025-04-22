import React, { useState } from 'react';
import { Container, Nav, Navbar, Button, Dropdown } from 'react-bootstrap';
import { Link, NavLink, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  // Fonction pour fermer le menu après avoir cliqué sur un lien (sur mobile)
  const handleNavClick = () => {
    // Si le menu est actuellement ouvert, le fermer
    if (expanded) {
      setExpanded(false);
    }
  };

  return (
    <div className="admin-header sticky-top">
      {/* Barre supérieure - Logo et contrôles utilisateur */}
      <div className="admin-topbar bg-white py-2 border-bottom">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center">
            {/* Brand */}
            <Navbar.Brand as={Link} to="/admin" className="fw-bold text-primary d-flex align-items-center m-0">
              <i className="icofont-dashboard-web fs-4 me-2"></i>
              <span>Panneau d&apos;administration</span>
            </Navbar.Brand>

            {/* Contrôles utilisateur */}
            <div className="d-flex align-items-center">
              {/* View Site Button */}
              <Button
                variant="outline-primary"
                size="sm"
                className="d-flex align-items-center py-1 px-3 me-3"
                as={Link}
                to="/"
              >
                <i className="icofont-home me-2"></i>
                <span className="d-none d-md-inline">Voir le site</span>
              </Button>

              {/* User Dropdown */}
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="admin-user-dropdown" className="d-flex align-items-center p-1 border-0">
                  <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2" style={{width: '32px', height: '32px'}}>
                    <span className="text-white fw-bold">A</span>
                  </div>
                  <div className="d-none d-md-block text-start">
                    <div className="fw-bold">Admin</div>
                    <small className="text-muted">Administrateur</small>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/admin/profile">
                    <i className="icofont-user me-2"></i> Mon profil
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/settings">
                    <i className="icofont-gear me-2"></i> Paramètres
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/">
                    <i className="icofont-logout me-2"></i> Déconnexion
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Container>
      </div>

      {/* Barre de navigation principale */}
      <Navbar 
        bg="light" 
        expand="lg" 
        expanded={expanded}
        onToggle={setExpanded}
        className="admin-navbar shadow-sm mb-4 py-0"
      >
        <Container fluid>
          <Navbar.Toggle aria-controls="admin-navbar" className="ms-auto my-2" />
          <Navbar.Collapse id="admin-navbar">
            <Nav className="mx-auto admin-nav py-2 py-lg-0">
              <Nav.Link
                as={NavLink}
                to="/admin"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={handleNavClick}
                end
              >
                <i className="icofont-dashboard me-2"></i>
                <span className="nav-label">Tableau de bord</span>
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/products"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <i className="icofont-box me-2"></i>
                <span className="nav-label">Produits</span>
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/blog"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <i className="icofont-pen-alt-1 me-2"></i>
                <span className="nav-label">Articles</span>
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/orders"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <i className="icofont-shopping-cart me-2"></i>
                <span className="nav-label">Commandes</span>
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/customers"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <i className="icofont-users-alt-4 me-2"></i>
                <span className="nav-label">Clients</span>
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/reports"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <i className="icofont-chart-bar-graph me-2"></i>
                <span className="nav-label">Rapports</span>
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/settings"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <i className="icofont-settings-alt me-2"></i>
                <span className="nav-label">Paramètres</span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default AdminNavbar;