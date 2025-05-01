// components/admin/AdminNavbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Navbar, Container, Nav, Dropdown, Button, Form, InputGroup, Image } from 'react-bootstrap';
import Link from 'next/link';
import { AuthContext } from '../../contexts/AuthProvider';
import { useRouter } from 'next/router';
import styles from './AdminNavbar.module.css';

const AdminNavbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logOut } = useContext(AuthContext);

  // État pour les notifications
  const notifications = [
    { id: 1, type: 'order', message: 'Nouvelle commande #45678', time: 'Il y a 5 minutes', read: false },
    { id: 2, type: 'inventory', message: 'Stock faible - Produit A', time: 'Il y a 2 heures', read: false },
    { id: 3, type: 'user', message: 'Nouveau compte client créé', time: 'Hier, 15:45', read: true },
    { id: 4, type: 'system', message: 'Maintenance système prévue', time: '12/05/2023', read: true }
  ];

  // Gestion du scroll pour l'effet de transparence
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gestion de la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Recherche:', searchQuery);
      setSearchQuery('');
      setSearchVisible(false);
    }
  };

  // Déconnexion
  const handleLogout = () => {
    if (logOut) {
      logOut()
        .then(() => router.push('/auth/signin'))
        .catch(error => console.error('Erreur de déconnexion:', error));
    } else {
      router.push('/auth/signin');
    }
  };

  // Détermine si un lien est actif
  const isActive = (path) => router.pathname === path;

  // Objet utilisateur
  const adminUser = {
    name: user?.displayName || 'Admin',
    email: user?.email || 'admin@example.com',
    avatar: user?.photoURL || 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=128'
  };

  return (
    <Navbar 
      className={`${styles.adminNavbar} ${isScrolled ? styles.scrolled : ''}`} 
      expand="lg" 
      fixed="top"
    >
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand as={Link} href="/admin/dashboard" className={styles.brand}>
          <i className="icofont-dashboard fs-4 text-primary me-2"></i>
          <span className="fw-bold">Admin</span>
          <span className="d-none d-sm-inline ms-1">Panel</span>
        </Navbar.Brand>

        {/* Bouton mobile */}
        <Navbar.Toggle aria-controls="admin-nav" className="border-0">
          <i className="icofont-navigation-menu fs-4"></i>
        </Navbar.Toggle>

        {/* Menu principal */}
        <Navbar.Collapse id="admin-nav">
          <Nav className="me-auto flex-wrap">
            {[
              { href: '/admin/products', icon: 'icofont-box', label: 'Produits' },
              { href: '/admin/categories', icon: 'icofont-listine-dots', label: 'Catégories' },
              { href: '/admin/orders', icon: 'icofont-cart', label: 'Commandes' },
              { href: '/admin/shipping', icon: 'icofont-truck', label: 'Livraisons' },
              { href: '/admin/sellers', icon: 'icofont-business-man', label: 'Vendeurs' },
              { href: '/admin/shops', icon: 'icofont-shop', label: 'Boutiques' },
              { href: '/admin/advertisements', icon: 'icofont-megaphone', label: 'Publicités' },
              { href: '/admin/promotions', icon: 'icofont-sale-discount', label: 'Promotions' },
              { href: '/admin/customers', icon: 'icofont-users-alt-3', label: 'Clients' },
              { href: '/admin/blog', icon: 'icofont-blogger', label: 'Blog' },
              { href: '/admin/reports', icon: 'icofont-chart-line', label: 'Rapports' },
              { href: '/admin/settings', icon: 'icofont-gear', label: 'Paramètres' }
            ].map((item) => (
              <Nav.Link 
                key={item.href}
                as={Link} 
                href={item.href} 
                className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
              >
                <i className={`${item.icon} me-1`}></i> {item.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* Actions (recherche, notifications, profil) */}
          <div className={styles.actions}>
            {/* Barre de recherche */}
            <div className={`${styles.searchContainer} ${searchVisible ? styles.visible : ''}`}>
              <Button 
                variant="light" 
                className={styles.searchBtn}
                onClick={() => setSearchVisible(!searchVisible)}
                aria-label="Recherche"
              >
                <i className="icofont-search-1"></i>
              </Button>
              
              <Form className={styles.searchForm} onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  <Button variant="primary" type="submit" className={styles.searchSubmit}>
                    <i className="icofont-search-1"></i>
                  </Button>
                </InputGroup>
              </Form>
            </div>
            
            {/* Notifications */}
            <Dropdown align="end" className="me-2">
              <Dropdown.Toggle as={Button} variant="light" className={styles.navActionBtn}>
                <i className="icofont-notification fs-5"></i>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className={styles.notificationBadge}>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Dropdown.Toggle>
              
              <Dropdown.Menu className={`${styles.dropdownMenu} ${styles.notificationDropdown}`}>
                <div className={styles.dropdownHeader}>
                  <span className="fw-bold">Notifications</span>
                  <Button variant="link" size="sm" className="p-0 text-decoration-none">
                    Tout marquer comme lu
                  </Button>
                </div>
                <Dropdown.Divider />
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <Dropdown.Item key={notification.id} className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}>
                      <div className="d-flex">
                        <div className={styles.notificationIcon}>
                          <i className={`icofont-${notification.type === 'order' ? 'shopping-cart text-success' : 
                            notification.type === 'inventory' ? 'warning-alt text-warning' : 
                            notification.type === 'user' ? 'user text-primary' : 'gear text-info'}`}></i>
                        </div>
                        <div className={styles.notificationContent}>
                          <div>{notification.message}</div>
                          <small className="text-muted">{notification.time}</small>
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))
                ) : (
                  <div className="text-center p-3 text-muted">
                    <i className="icofont-check-circled fs-4 mb-2 d-block"></i>
                    Aucune notification
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>
            
            {/* Profil utilisateur */}
            <Dropdown align="end">
              <Dropdown.Toggle as={Button} variant="light" className={styles.userDropdown}>
                <div className="d-flex align-items-center">
                  <div className={styles.avatarContainer}>
                    <Image 
                      src={adminUser.avatar} 
                      alt={adminUser.name}
                      roundedCircle 
                      width={32} 
                      height={32} 
                      className={styles.userAvatar}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=128';
                      }}
                    />
                    <div className={styles.onlineIndicator}></div>
                  </div>
                  <span className={`${styles.userName} d-none d-lg-block`}>{adminUser.name}</span>
                </div>
              </Dropdown.Toggle>
              
              <Dropdown.Menu className={styles.dropdownMenu}>
                <div className={styles.dropdownProfileHeader}>
                  <Image 
                    src={adminUser.avatar} 
                    alt={adminUser.name}
                    roundedCircle 
                    width={60} 
                    height={60} 
                    className="mb-2"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=128';
                    }}
                  />
                  <div className={styles.userNameLarge}>{adminUser.name}</div>
                  <div className={styles.userEmail}>{adminUser.email}</div>
                </div>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} href="/admin/profile">
                  <i className="icofont-ui-user me-2"></i> Mon Profil
                </Dropdown.Item>
                <Dropdown.Item as={Link} href="/admin/settings">
                  <i className="icofont-gear me-2"></i> Paramètres
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} href="/admin/help">
                  <i className="icofont-info-circle me-2"></i> Aide & Support
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
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
