import React from 'react';
import { Container, Nav, Navbar, Button, Dropdown } from 'react-bootstrap';
import { Link, NavLink, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const location = useLocation();
  
  // Fonction pour vérifier si un lien est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm mb-4 admin-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/admin" className="fw-bold text-primary d-flex align-items-center">
          <i className="icofont-dashboard-web me-2 fs-4"></i>
          <span className="d-none d-md-inline">Panneau d'administration</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar" />
        <Navbar.Collapse id="admin-navbar">
          <Nav className="me-auto admin-nav">
            <Nav.Link 
              as={NavLink} 
              to="/admin" 
              className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
            >
              <i className="icofont-dashboard me-2"></i>
              <span className="nav-label">Tableau de bord</span>
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/admin/products" 
              className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}
            >
              <i className="icofont-box me-2"></i>
              <span className="nav-label">Produits</span>
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/admin/orders" 
              className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}
            >
              <i className="icofont-shopping-cart me-2"></i>
              <span className="nav-label">Commandes</span>
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/admin/customers" 
              className={`nav-item ${isActive('/admin/customers') ? 'active' : ''}`}
            >
              <i className="icofont-users-alt-4 me-2"></i>
              <span className="nav-label">Clients</span>
            </Nav.Link>
            <Nav.Link 
               as={NavLink} 
               to="/admin/reports" 
               className={`nav-item ${isActive('/admin/reports') ? 'active' : ''}`}
             >
               <i className="icofont-chart-bar-graph me-2"></i>
               <span className="nav-label">Rapports</span>
             </Nav.Link>
            <Nav.Link 
               as={NavLink} 
               to="/admin/settings" 
               className={`nav-item ${isActive('/admin/settings') ? 'active' : ''}`}
             >
               <i className="icofont-settings-alt me-2"></i>
               <span className="nav-label">Paramètres</span>
             </Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center">
            <Button variant="outline-primary" size="sm" className="me-3" as={Link} to="/">
              <i className="icofont-home me-1"></i> Voir le site
            </Button>
            
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="admin-user-dropdown" className="border rounded-pill d-flex align-items-center shadow-sm">
                <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2" style={{width: '35px', height: '35px'}}>
                  <span className="text-white fw-bold">A</span>
                </div>
                <div className="d-none d-md-block">
                  <div className="fw-bold">Admin</div>
                  <small className="text-muted">Administrateur</small>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/admin/profile">
                  <i className="icofont-user me-2"></i> Mon profil
                </Dropdown.Item>
                <Dropdown.Item>
                  <i className="icofont-gear me-2"></i> Paramètres
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/">
                  <i className="icofont-logout me-2"></i> Déconnexion
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;