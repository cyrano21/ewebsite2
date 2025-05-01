import React, { useState, useEffect, useContext } from 'react';
import { Navbar, Container, Nav, Dropdown, Button, Badge, Form, InputGroup, Image } from 'react-bootstrap';
import Link from 'next/link';
import { AuthContext } from '../../contexts/AuthProvider';
import { useRouter } from 'next/router';
import styles from './AdminNavbar.module.css';

const AdminNavbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // État pour suivre les routes actives
  const isActive = path => path === '/' ? router.pathname === '/' : router.pathname.includes(path);
  
  // Récupération des informations de l'utilsateur depuis le contexte d'authentification
  const { user, logOut } = useContext(AuthContext);
  
  // Créer un objet adminUser à partir des données d'authentification
  const adminUser = {
    name: user?.displayName || 'Admin',
    email: user?.email || 'admin@example.com',
    avatar: user?.photoURL || 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=128'
  };

  // Log pour débogage
  console.log('Informations utilsateur:', user);
  console.log('Avatar utilsé:', adminUser.avatar);
  
  const notifications = [
    { id: 1, type: 'order', message: 'Nouvelle commande #45678', time: 'Il y a 5 minutes', read: false },
    { id: 2, type: 'inventory', message: 'Stock faible - Produit A', time: 'Il y a 2 heures', read: false },
    { id: 3, type: 'user', message: 'Nouveau compte client créé', time: 'Hier, 15:45', read: true },
    { id: 4, type: 'system', message: 'Maintenance système prévue', time: '12/05/2023', read: true }
  ];
  
  // Effet pour détecter le défilement et ajuster le style de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Gestionnaire de recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Logique de recherche à implémenter
      console.log('Recherche:', searchQuery);
      setSearchQuery('');
      setSearchVisible(false);
    }
  };
  
  // Fonction pour obtenir l'icône selon le type de notification
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'order': return 'icofont-shopping-cart text-success';
      case 'inventory': return 'icofont-warning-alt text-warning';
      case 'user': return 'icofont-user text-primary';
      case 'system': return 'icofont-gear text-info';
      default: return 'icofont-bell text-muted';
    }
  };
  
  return (
    <Navbar 
      className={`${styles['admin-navbar']} ${isScrolled ? styles['navbar-scrolled'] : ''}`} 
      expand="lg" 
      fixed="top"
    >
      <Container fluid>
        {/* Logo et Titre */}
        <Navbar.Brand as={Link} href="/admin/dashboard" className={`d-flex align-items-center ${styles['navbar-brand-link']}`}>
          <i className="icofont-dashboard fs-4 text-primary me-2"></i>
          <span className={`${styles['brand-text']} fw-bold`}>Admin</span>
          <span className={`${styles['brand-text-light']} d-none d-sm-inline ms-1`}>Panel</span>
        </Navbar.Brand>
        
        {/* Bouton de bascule pour mobile */}
        <Navbar.Toggle aria-controls="admin-navbar-nav" className="border-0 shadow-none">
          <i className="icofont-navigation-menu fs-4"></i>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="admin-navbar-nav">
          {/* Liens de navigation principaux */}
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/admin/products" className={`${styles['nav-link-animated']} ${isActive('/product') ? styles.active : ''}`}>
              <i className="icofont-box me-1"></i> Produits
            </Nav.Link>
            <Nav.Link as={Link} href="/admin/categories" className={`${styles['nav-link-animated']} ${isActive('/categor') ? styles.active : ''}`}>
              <i className="icofont-listine-dots me-1"></i> Catégories
            </Nav.Link>
            <Nav.Link as={Link} href="/admin/orders" className={`${styles['nav-link-animated']} ${isActive('/order') ? styles.active : ''}`}>
              <i className="icofont-cart me-1"></i> Commandes
            </Nav.Link>
            <Nav.Link as={Link} href="/admin/shipping" className={`${styles['nav-link-animated']} ${isActive('/shipping') ? styles.active : ''}`}>
              <i className="icofont-truck me-1"></i> Livraisons
            </Nav.Link>
            <Nav.Link as={Link} href="/admin/sellers" className={`${styles['nav-link-animated']} ${isActive('/seller') ? styles.active : ''}`}>
              <i className="icofont-business-man me-1"></i> Vendeurs
            </Nav.Link>
            <Nav.Link as={Link} href="/admin/shops" className={`${styles['nav-link-animated']} ${isActive('/shop') ? styles.active : ''}`}>
              <i className="icofont-shop me-1"></i> Boutiques
            </Nav.Link>
            <Nav.Link as={Link} href="/admin/advertisements" className={`${styles['nav-link-animated']} ${isActive('/advertisement') ? styles.active : ''}`}>
              <i className="icofont-megaphone me-1"></i> Publicités
            </Nav.Link>
            <Nav.Link as={Link} href="/admin/promotions" className={`${styles['nav-link-animated']} ${isActive('/promotion') ? styles.active : ''}`}>
              <i className="icofont-sale-discount me-1"></i> Promotions
            </Nav.Link>
            <Nav.Link as={Link} href="/admin/customers" className={`${styles['nav-link-animated']} ${isActive('/customer') ? styles.active : ''}`}>
              <i className="icofont-users-alt-3 me-1"></i> Clients
            </Nav.Link>
            <Nav.Link as={Link} href="/admin/blog" className={`${styles['nav-link-animated']} ${isActive('/blog') ? styles.active : ''}`}>
              <i className="icofont-blogger me-1"></i> Blog
            </Nav.Link>
            <Nav.Link as={Link} href="/admin/reports" className={`${styles['nav-link-animated']} ${isActive('/report') ? styles.active : ''}`}>
              <i className="icofont-chart-line me-1"></i> Rapports
            </Nav.Link>
            <Nav.Link as={Link} href="/admin/settings" className={`${styles['nav-link-animated']} ${isActive('/setting') ? styles.active : ''}`}>
              <i className="icofont-gear me-1"></i> Paramètres
            </Nav.Link>
          </Nav>
          
          {/* Barre de recherche, notifs et profil */}
          <div className={`d-flex align-items-center ${styles['navbar-actions']}`}>
            {/* Barre de recherche */}
            <div className={`${styles['search-container']} ${searchVisible ? styles['search-visible'] : ''}`}>
              <Button 
                variant="light" 
                className={`btn-icon ${styles['nav-action-btn']} ${styles['search-btn']}`}
                onClick={() => setSearchVisible(!searchVisible)}
                aria-label="Recherche"
              >
                <i className="icofont-search-1"></i>
              </Button>
              
              <Form className={styles['search-form']} onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles['search-input']}
                  />
                  <Button variant="primary" type="submit" className={styles['search-submit']}>
                    <i className="icofont-search-1"></i>
                  </Button>
                </InputGroup>
              </Form>
            </div>
            
            {/* Notifications */}
            <Dropdown align="end" className="me-2">
              <Dropdown.Toggle as={Button} variant="light" className={`${styles['nav-action-btn']} position-relative`}>
                <i className="icofont-notification fs-5"></i>
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge bg="danger" pill className={`position-absolute ${styles['notification-badge']}`}>
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Dropdown.Toggle>
              
              <Dropdown.Menu className={`${styles['dropdown-menu-animated']} ${styles['notification-dropdown']}`}>
                <div className={`${styles['dropdown-header']} d-flex justify-content-between align-items-center`}>
                  <span className="fw-bold">Notifications</span>
                  <Button variant="link" size="sm" className="p-0 text-decoration-none">
                    Tout marquer comme lu
                  </Button>
                </div>
                <Dropdown.Divider />
                {notifications.length > 0 ? (
                  <>
                    {notifications.map(notification => (
                      <Dropdown.Item key={notification.id} className={`${styles['notification-item']} ${!notification.read ? styles.unread : ''}`}>
                        <div className="d-flex">
                          <div className={`${styles['notification-icon']} me-3`}>
                            <i className={getNotificationIcon(notification.type)}></i>
                          </div>
                          <div className={`${styles['notification-content']} flex-grow-1`}>
                            <div className={styles['notification-message']}>{notification.message}</div>
                            <div className={`${styles['notification-time']} small text-muted`}>{notification.time}</div>
                          </div>
                        </div>
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <div className="text-center p-2">
                      <Button variant="light" size="sm" className="w-100">
                        Voir toutes les notifications
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-3 text-muted">
                    <i className="icofont-check-circled fs-4 mb-2 d-block"></i>
                    Aucune notification
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>
            
            {/* Profil utilsateur */}
            <Dropdown align="end">
              <Dropdown.Toggle as={Button} variant="light" className={styles['user-dropdown-toggle']}>
                <div className="d-flex align-items-center">
                  <div className={`${styles['avatar-container']} me-2`}>
                    <Image 
                      src={adminUser.avatar} 
                      alt={adminUser.name}
                      roundedCircle 
                      width={32} 
                      height={32} 
                      className={styles['user-avatar']}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=128';
                      }}
                    />
                    <div className={styles['online-indicator']}></div>
                  </div>
                  <span className={`${styles['user-name']} d-none d-lg-block`}>{adminUser.name}</span>
                </div>
              </Dropdown.Toggle>
              
              <Dropdown.Menu className={styles['dropdown-menu-animated']}>
                <div className={`${styles['dropdown-profile-header']} text-center p-3`}>
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
                  <div className={`${styles['user-name-large']} fw-bold`}>{adminUser.name}</div>
                  <div className={`${styles['user-email']} small`}>{adminUser.email}</div>
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
                <Dropdown.Item onClick={() => {
                  // utilser la fonction logOut du contexte d'authentification qui a été récupérée au niveau du composant
                  if (logOut) {
                    logOut().then(() => {
                      router.push('/');
                    }).catch(error => {
                      console.error('Erreur lors de la déconnexion:', error);
                    });
                  } else {
                    // Fallback si logOut n'est pas disponible
                    router.push('/');
                  }
                }}>
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
