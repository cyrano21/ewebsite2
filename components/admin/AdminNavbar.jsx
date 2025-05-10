// components/admin/AdminNavbar.jsx

import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
// Importations individuelles de react-bootstrap au lieu d'importations groupées
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthContext } from '../../contexts/AuthProvider';
// Importe le nouveau fichier CSS Module
import styles from './AdminNavbar.module.css';
// Importer le contexte de notification
import { useNotifications, NOTIFICATION_TYPES } from '../../contexts/NotificationContext';
// Importation des composants de notification
import ReviewNotificationItem from './ReviewNotificationItem';
import SellerNotificationItem from './SellerNotificationItem';

// Structure révisée - Regroupement thématique des éléments de navigation
const NAV_GROUPS = [
  {
    id: 'dashboard',
    icon: 'icofont-dashboard',
    label: 'Dashboard',
    href: '/admin'
  },
  {
    id: 'seller-access',
    icon: 'icofont-shop',
    label: 'Espace Vendeur',
    children: [
      { href: '/seller', icon: 'icofont-dashboard', label: 'Dashboard Vendeur' },
      { href: '/seller/products', icon: 'icofont-box', label: 'Produits Vendeur' },
      { href: '/seller/orders', icon: 'icofont-cart', label: 'Commandes Vendeur' },
      { href: '/seller/analytics', icon: 'icofont-chart-bar-graph', label: 'Analytiques Vendeur' }
    ]
  },
  {
    id: 'products',
    icon: 'icofont-box',
    label: 'Produits',
    children: [
      { href: '/admin/products', icon: 'icofont-box', label: 'Tous les produits' },
      { href: '/admin/categories', icon: 'icofont-listine-dots', label: 'Catégories' }
    ]
  },
  {
    id: 'orders',
    icon: 'icofont-cart',
    label: 'Commandes & Ventes',
    children: [
      { href: '/admin/orders', icon: 'icofont-cart', label: 'Commandes' },
      { href: '/admin/invoices', icon: 'icofont-paper', label: 'Factures' },
      { href: '/admin/shipping', icon: 'icofont-truck', label: 'Livraisons' }
    ]
  },
  {
    id: 'users',
    icon: 'icofont-users-alt-3',
    label: 'Utilisateurs',
    children: [
      { href: '/admin/customers', icon: 'icofont-users-alt-3', label: 'Clients' },
      { href: '/admin/sellers', icon: 'icofont-business-man', label: 'Vendeurs' },
      { href: '/admin/shops', icon: 'icofont-shop', label: 'Boutiques' }
    ]
  },
  {
    id: 'marketing',
    icon: 'icofont-megaphone',
    label: 'Marketing',
    children: [
      { href: '/admin/advertisements', icon: 'icofont-megaphone', label: 'Publicités' },
      { href: '/admin/promotions', icon: 'icofont-sale-discount', label: 'Promotions' },
      { href: '/admin/email-campaigns', icon: 'icofont-email', label: 'Emails' },
      { href: '/admin/sponsors', icon: 'icofont-sponsor', label: 'Sponsors' }
    ]
  },
  {
    id: 'content',
    icon: 'icofont-blogger',
    label: 'Contenu',
    children: [
      { href: '/admin/blog', icon: 'icofont-blogger', label: 'Blog' },
      { href: '/admin/reviews', icon: 'icofont-star', label: 'Avis' }
    ]
  },
  {
    id: 'reports',
    icon: 'icofont-chart-line',
    label: 'Rapports',
    href: '/admin/reports'
  },
  {
    id: 'settings',
    icon: 'icofont-gear',
    label: 'Paramètres',
    href: '/admin/settings'
  },
  {
    id: 'dropshipping',
    icon: 'icofont-exchange',
    label: 'Dropshipping',
    href: '/admin/dropshipping'
  }
];

export default function AdminNavbar() {
  const router = useRouter();
  const { user, logOut } = useContext(AuthContext);
  const { addNotification, notifications, NOTIFICATION_TYPES } = useNotifications();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [pendingSellersCount, setPendingSellersCount] = useState(0);
  const [pendingSellers, setPendingSellers] = useState([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = useMemo(() => path => router.pathname === path || router.pathname.startsWith(path), [router.pathname]);

  const isGroupActive = useCallback((group) => {
    if (group.href && isActive(group.href)) {
      return true;
    }
    if (group.children) {
      return group.children.some(item => isActive(item.href));
    }
    return false;
  }, [isActive]);

  const handleLogout = async () => {
    try {
      if (logOut) await logOut();
      addNotification('Déconnexion réussie', NOTIFICATION_TYPES.SUCCESS);
      router.push('/auth/signin');
    } catch (error) {
      addNotification(`Erreur de déconnexion: ${error.message}`, NOTIFICATION_TYPES.ERROR);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      addNotification('Veuillez saisir un terme de recherche', NOTIFICATION_TYPES.WARNING);
      return;
    }
    try {
      console.log('Recherche:', searchQuery);
      addNotification(`Recherche pour: ${searchQuery}`, NOTIFICATION_TYPES.INFO);
    } catch (error) {
      addNotification(`Erreur de recherche: ${error.message}`, NOTIFICATION_TYPES.ERROR);
    }
    setSearchQuery('');
    setSearchVisible(false);
  };

  const toggleSearch = () => setSearchVisible(!searchVisible);

  // Fonctions utilitaires pour les notifications
  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'icofont-check-circled';
      case NOTIFICATION_TYPES.ERROR:
        return 'icofont-error';
      case NOTIFICATION_TYPES.WARNING:
        return 'icofont-warning-alt';
      case NOTIFICATION_TYPES.INFO:
      default:
        return 'icofont-info-circle';
    }
  };

  const getNotificationBgClass = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'bg-success-light text-success';
      case NOTIFICATION_TYPES.ERROR:
        return 'bg-danger-light text-danger';
      case NOTIFICATION_TYPES.WARNING:
        return 'bg-warning-light text-warning';
      case NOTIFICATION_TYPES.INFO:
      default:
        return 'bg-primary-light text-primary';
    }
  };

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const unread = notifications.filter(notif => !notif.read).length;
      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  }, [notifications]);

  // Utiliser une référence sécurisée pour les styles
  const safeStyles = styles || {};

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`${safeStyles.adminNavbar || ''} ${scrolled ? styles.scrolled : ''}`}
    >
      <Container fluid>
        <Navbar.Brand as={Link} href="/admin/dashboard" className={safeStyles.brand || ''}>
          <i className="icofont-dashboard fs-4 text-primary me-2" />
          <span className={safeStyles.brandText || ''}>
             <span className="fw-bold">Admin</span>
             <span className="d-none d-sm-inline ms-1">Panel</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-nav-collapse" className="border-0">
           <i className="icofont-navigation-menu fs-4" />
        </Navbar.Toggle>

        <Navbar.Collapse id="admin-nav-collapse">
          <Nav className="me-auto flex-wrap py-2 py-lg-0">
            <Nav.Link
              as={Link}
              href="/" 
              className={`${safeStyles.navLink || ''}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icofont-ui-home me-1" />
              Accueil
            </Nav.Link>

            {NAV_GROUPS.map(group => (
              group.children ? (
                <Dropdown key={group.id} as={Nav.Item} className={safeStyles.navDropdown || ''}>
                  <Dropdown.Toggle 
                    as={Nav.Link} 
                    className={`${safeStyles.navLink || ''} ${isGroupActive(group) ? safeStyles.active || '' : ''}`}
                  >
                    <i className={`${group.icon} me-1`} />
                    {group.label}
                    {group.id === 'content' && pendingReviewsCount > 0 && (
                      <span className="badge bg-danger rounded-pill ms-1">
                        {pendingReviewsCount}
                      </span>
                    )}
                    <i className="icofont-simple-down ms-1 small"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={safeStyles.menuDropdown || ''}>
                    {group.children.map(item => (
                      <Dropdown.Item 
                        key={item.href}
                        as={Link}
                        href={item.href}
                        className={`${safeStyles.dropdownItem || ''} ${isActive(item.href) ? safeStyles.active || '' : ''}`}
                      >
                        <i className={`${item.icon} me-2`} />
                        {item.label}
                        {item.href === '/admin/reviews' && pendingReviewsCount > 0 && (
                          <span className="badge bg-danger rounded-pill ms-1">
                            {pendingReviewsCount}
                          </span>
                        )}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Nav.Link
                  key={group.id}
                  as={Link}
                  href={group.href}
                  className={`${styles.navLink} ${isActive(group.href) ? styles.active : ''}`}
                >
                  <i className={`${group.icon} me-1`} />
                  {group.label}
                </Nav.Link>
              )
            ))}
          </Nav>

          <div className={styles.actions}>
            <div className={`${styles.searchContainer} ${searchVisible ? styles.visible : ''}`}>
              <Form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <InputGroup size="sm">
                  <Form.Control
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                    aria-label="Barre de recherche"
                  />
                  <Button type="submit" variant="outline-secondary" className={styles.searchSubmit}>
                    <i className="icofont-search-1" />
                  </Button>
                </InputGroup>
              </Form>
              <Button onClick={toggleSearch} className={styles.navActionBtn}>
                <i className="icofont-search-1 fs-5" />
              </Button>
            </div>

            <Dropdown align="end">
              <Dropdown.Toggle as={Button} className={styles.navActionBtn} id="dropdown-reviews">
                <i className="icofont-star fs-5" />
                {pendingReviewsCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                    {pendingReviewsCount > 9 ? '9+' : pendingReviewsCount}
                    <span className="visually-hidden">{pendingReviewsCount} avis en attente</span>
                  </span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className={safeStyles.notificationDropdown || ''}>
                <div className={safeStyles.dropdownHeader || ''}>
                  <h6 className="mb-0 fw-bold">
                    Avis en attente ({pendingReviewsCount})
                  </h6>
                </div>
                <Dropdown.Divider className="my-0" />

                {pendingReviews && pendingReviews.length > 0 ? (
                  <>
                    {pendingReviews.slice(0, 5).map((review) => (
                      <ReviewNotificationItem key={review._id} review={review} />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-3 text-muted">
                    <i className="icofont-star fs-4 d-block mb-1"></i>
                    <small>Aucun avis en attente</small>
                  </div>
                )}

                <Dropdown.Divider className="my-0" />
                <Dropdown.Item 
                  as={Link} 
                  href="/admin/reviews" 
                  className="text-center small text-primary py-2"
                >
                  Gérer tous les avis
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown align="end">
              <Dropdown.Toggle as={Button} className={styles.navActionBtn} id="dropdown-sellers">
                <i className="icofont-business-man fs-5" />
                {pendingSellersCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle">
                    {pendingSellersCount > 9 ? '9+' : pendingSellersCount}
                    <span className="visually-hidden">{pendingSellersCount} vendeurs en attente</span>
                  </span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className={safeStyles.notificationDropdown || ''}>
                <div className={safeStyles.dropdownHeader || ''}>
                  <h6 className="mb-0 fw-bold">
                    Vendeurs en attente ({pendingSellersCount})
                  </h6>
                </div>
                <Dropdown.Divider className="my-0" />

                {pendingSellers && pendingSellers.length > 0 ? (
                  <>
                    {pendingSellers.slice(0, 5).map((seller) => (
                      <SellerNotificationItem key={seller._id} seller={seller} />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-3 text-muted">
                    <i className="icofont-business-man fs-4 d-block mb-1"></i>
                    <small>Aucun vendeur en attente</small>
                  </div>
                )}

                <Dropdown.Divider className="my-0" />
                <Dropdown.Item 
                  as={Link} 
                  href="/admin/sellers?filter=pending" 
                  className="text-center small text-primary py-2"
                >
                  Gérer tous les vendeurs
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown align="end">
              <Dropdown.Toggle as={Button} className={styles.navActionBtn} id="dropdown-notifications">
                <i className="icofont-notification fs-5" />
                 {unreadCount > 0 && (
                   <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                     {unreadCount > 9 ? '9+' : unreadCount}
                     <span className="visually-hidden">{unreadCount} alertes non lues</span>
                   </span>
                 )}
              </Dropdown.Toggle>
              <Dropdown.Menu className={safeStyles.notificationDropdown || ''}>
                 <div className={safeStyles.dropdownHeader || ''}>
                    <h6 className="mb-0 fw-bold">Notifications</h6>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 text-muted" 
                      onClick={(e) => {
                        e.stopPropagation();
                        addNotification('Toutes les notifications marquées comme lues', NOTIFICATION_TYPES.SUCCESS);
                      }}
                    >
                      <i className="icofont-check-circled me-1"></i>Tout marquer comme lu
                    </Button>
                 </div>
                 <Dropdown.Divider className="my-0" />

                 {notifications && notifications.length > 0 ? (
                   <>
                     {notifications.slice(0, 5).map((notification, idx) => (
                       <Dropdown.Item 
                         key={notification.id || idx} 
                         href="#" 
                         className={`${safeStyles.notificationItem || ''} ${notification.read ? '' : safeStyles.unread || ''}`}
                         onClick={(e) => {
                           e.preventDefault();
                           console.log('Naviguer vers la notification:', notification);
                         }}
                       >
                         <div className="d-flex align-items-start">
                           <div className={`${styles.notificationIcon} ${getNotificationBgClass(notification.type)} me-3`}>
                             <i className={getNotificationIcon(notification.type)}/>
                           </div>
                           <div>
                             <p className="mb-0 small fw-bold">{notification.message}</p>
                             <p className="mb-0 small text-muted">{notification.time}</p>
                           </div>
                         </div>
                       </Dropdown.Item>
                     ))}
                   </>
                 ) : (
                   <div className="text-center py-3 text-muted">
                     <i className="icofont-notification fs-4 d-block mb-1"></i>
                     <small>Aucune notification</small>
                   </div>
                 )}

                 <Dropdown.Divider className="my-0" />
                 <Dropdown.Item 
                   as={Link} 
                   href="/admin/notifications" 
                   className="text-center small text-primary py-2"
                 >
                   Voir toutes les notifications
                 </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown align="end">
              <Dropdown.Toggle as={Button} className={styles.userDropdown} id="dropdown-user">
                <div className={styles.avatarContainer}>
                    <Image
                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Admin'}&background=random&size=40`}
                        roundedCircle
                        width={32}
                        height={32}
                        className={styles.userAvatar}
                        alt="Avatar utilisateur"
                    />
                </div>
                <span className={`${styles.userName} ms-2 d-none d-lg-inline`}>
                  {user?.displayName || 'Admin User'}
                </span>
                <i className="icofont-simple-down ms-1 small text-muted d-none d-lg-inline" />
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ minWidth: '180px' }}>
                 <div className={styles.dropdownProfileHeader}>
                    <Image
                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Admin'}&background=random&size=64`}
                        roundedCircle
                        width={60}
                        height={60}
                        alt="Avatar utilisateur"
                        className="mb-2"
                    />
                    <h6 className="mb-0 fw-bold">{user?.displayName || 'Admin User'}</h6>
                    <p className="mb-0 small text-muted">{user?.email || 'admin@example.com'}</p>
                 </div>
                 <Dropdown.Divider className="my-0" />
                 <Dropdown.Item as={Link} href="/admin/profile">
                    <i className="icofont-user me-2" />Profil
                 </Dropdown.Item>
                 <Dropdown.Item as={Link} href="/admin/settings">
                   <i className="icofont-gear me-2" />Paramètres
                 </Dropdown.Item>
                 <Dropdown.Divider />
                 <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="icofont-logout me-2" />Déconnexion
                 </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}