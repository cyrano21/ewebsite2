// components/admin/AdminNavbar.jsx

import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Navbar, Container, Nav, Dropdown, Button, Form, InputGroup, Image } from 'react-bootstrap';
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

const NAV_ITEMS = [
  { href: '/admin/products', icon: 'icofont-box', label: 'Produits' },
  { href: '/admin/categories', icon: 'icofont-listine-dots', label: 'Catégories' },
  { href: '/admin/orders', icon: 'icofont-cart', label: 'Commandes' },
  { href: '/admin/shipping', icon: 'icofont-truck', label: 'Livraisons' },
  { href: '/admin/dropshipping', icon: 'icofont-exchange', label: 'Dropshipping' },
  { href: '/admin/sellers', icon: 'icofont-business-man', label: 'Vendeurs' },
  { href: '/admin/shops', icon: 'icofont-shop', label: 'Boutiques' },
  { href: '/admin/advertisements', icon: 'icofont-megaphone', label: 'Publicités' },
  { href: '/admin/promotions', icon: 'icofont-sale-discount', label: 'Promotions' },
  { href: '/admin/customers', icon: 'icofont-users-alt-3', label: 'Clients' },
  { href: '/admin/blog', icon: 'icofont-blogger', label: 'Blog' },
  { href: '/admin/reviews', icon: 'icofont-star', label: 'Avis' }, // Avis clients
  { href: '/admin/email-campaigns', icon: 'icofont-email', label: 'Emails' }, // Nouveau lien pour la gestion des emails
  { href: '/admin/reports', icon: 'icofont-chart-line', label: 'Rapports' },
  { href: '/admin/settings', icon: 'icofont-gear', label: 'Paramètres' },
  { href: '/admin/sponsors', icon: 'icofont-sponsor', label: 'Sponsors' }
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
  // Ajout des états pour les vendeurs
  const [pendingSellersCount, setPendingSellersCount] = useState(0);
  const [pendingSellers, setPendingSellers] = useState([]);

  // Effet de scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fonction de repli avec paramètre explicite pour indiquer si admin
  const applyFallbackData = useCallback((isAdmin) => {
    // Si aucune valeur n'est fournie, détecter si admin par le contexte ou la route
    const adminStatus = isAdmin !== undefined 
      ? isAdmin 
      : (router.pathname.startsWith('/admin') || (user && user.role === 'admin'));
    
    console.info(`Utilisation des données de secours. Admin: ${adminStatus}`);
    
    if (pendingReviews.length === 0) {
      if (adminStatus) {
        // Pour les admins: données temporaires d'avis en attente
        setPendingReviews([
          {
            _id: 'temp-id-1',
            productId: 'product-1',
            productName: 'Avis en attente de connexion serveur',
            rating: 4,
            date: new Date().toISOString(),
            status: 'pending'
          }
        ]);
        setPendingReviewsCount(1);
      } else {
        // Pour les non-admins: message d'accès restreint
        setPendingReviews([
          {
            _id: 'access-denied',
            productId: 'access-denied',
            productName: 'Accès réservé aux administrateurs',
            rating: 0,
            date: new Date().toISOString(),
            status: 'restricted'
          }
        ]);
        setPendingReviewsCount(1);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, user]);

  // Effet pour récupérer les avis en attente
  const fetchPendingReviews = useCallback(async () => {
    try {
      // Considérons d'abord que le contexte admin est valide si nous sommes sur une route admin
      const isAdminRoute = router.pathname.startsWith('/admin');
      
      // Récupérer le token JWT du localStorage
      const token = localStorage.getItem('auth-token');
      
      // Si pas de token mais route admin, utiliser des données temporaires
      if (!token && isAdminRoute) {
        console.warn('Token d\'authentification manquant mais sur route admin');
        applyFallbackData(true); // true = on est admin car sur route admin
        return;
      } else if (!token) {
        console.warn('Token d\'authentification manquant');
        applyFallbackData(false);
        return;
      }
      
      try {
        // Ajouter un cache buster pour éviter les problèmes de cache
        const apiUrl = `/api/admin/pending-reviews?t=${new Date().getTime()}&isAdmin=${isAdminRoute ? 'true' : 'false'}`;
        
        // Timeout pour la requête
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          console.warn(`Erreur API: ${res.status} ${res.statusText}`);
          applyFallbackData(isAdminRoute); // Considérer comme admin si sur route admin
          return;
        }
        
        const data = await res.json();
        
        if (data.success) {
          setPendingReviews(data.data || []);
          setPendingReviewsCount(data.count || 0);
        } else {
          console.warn('Réponse API non valide:', data.message || 'Erreur inconnue');
          applyFallbackData(isAdminRoute);
        }
      } catch (fetchError) {
        console.error('Erreur réseau lors de la récupération des avis:', fetchError);
        applyFallbackData(isAdminRoute);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des avis en attente:', error);
      applyFallbackData(router.pathname.startsWith('/admin'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  useEffect(() => {
    // Si nous sommes sur le dashboard admin, on présume que l'utilisateur est autorisé
    const isAdminDashboard = router.pathname.startsWith('/admin');
    
    // Vérifier si l'utilisateur est connecté ou si on est déjà sur le dashboard admin
    if (isAdminDashboard || (user && user.role === 'admin')) {
      // L'utilisateur est un admin ou est sur le dashboard admin, on récupère les avis en attente
      fetchPendingReviews();
      
      // En cas d'échec, réessayer après 3 secondes (une seule fois)
      const retryTimeout = setTimeout(() => {
        if (pendingReviewsCount === 0 && pendingReviews.length === 0) {
          console.info('Nouvelle tentative de récupération des avis...');
          fetchPendingReviews();
        }
      }, 3000);
      
      // Rafraîchir toutes les 5 minutes
      const interval = setInterval(fetchPendingReviews, 5 * 60 * 1000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(retryTimeout);
      };
    } else {
      // L'utilisateur n'est pas un admin et n'est pas sur le dashboard
      applyFallbackData();
    }
  }, [user, fetchPendingReviews, applyFallbackData, pendingReviews.length, pendingReviewsCount, router.pathname]);
  // Ajout de router.pathname aux dépendances

  // Fonction pour récupérer les vendeurs en attente
  const fetchPendingSellers = useCallback(async () => {
    try {
      // Vérifier si on est sur une route admin
      const isAdminRoute = router.pathname.startsWith('/admin');
      
      // Récupérer le token JWT du localStorage
      const token = localStorage.getItem('auth-token');
      
      // Si pas de token ou pas en zone admin, ne rien faire
      if (!token || !isAdminRoute) {
        console.warn('Token d\'authentification manquant ou accès non autorisé');
        return;
      }
      
      try {
        // Ajouter un cache buster pour éviter les problèmes de cache
        const apiUrl = `/api/sellers?status=pending&t=${new Date().getTime()}`;
        
        // Timeout pour la requête
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          console.warn(`Erreur API vendeurs: ${res.status} ${res.statusText}`);
          return;
        }
        
        const data = await res.json();
        
        if (data.success) {
          setPendingSellers(data.sellers || []);
          setPendingSellersCount(data.count || 0);
        } else {
          console.warn('Réponse API vendeurs non valide:', data.message || 'Erreur inconnue');
        }
      } catch (fetchError) {
        console.error('Erreur réseau lors de la récupération des vendeurs:', fetchError);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des vendeurs en attente:', error);
    }
  }, [router.pathname]);

  // Effet pour récupérer les vendeurs en attente
  useEffect(() => {
    // Si nous sommes sur le dashboard admin, on récupère les vendeurs en attente
    if (router.pathname.startsWith('/admin')) {
      fetchPendingSellers();
      
      // Rafraîchir toutes les 5 minutes
      const interval = setInterval(fetchPendingSellers, 5 * 60 * 1000);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [fetchPendingSellers, router.pathname]);

  // --- Helpers (inchangés) ---
  const isActive = useMemo(() => path => router.pathname === path, [router.pathname]);

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
      // TODO: Implémenter la recherche
      console.log('Recherche:', searchQuery);
      addNotification(`Recherche pour: ${searchQuery}`, NOTIFICATION_TYPES.INFO);
    } catch (error) {
      addNotification(`Erreur de recherche: ${error.message}`, NOTIFICATION_TYPES.ERROR);
    }
    setSearchQuery('');
    setSearchVisible(false); // Cache la recherche après soumission
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

  // Effet pour calculer le nombre de notifications non lues
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const unread = notifications.filter(notif => !notif.read).length;
      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  }, [notifications]);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`${styles.adminNavbar} ${scrolled ? styles.scrolled : ''}`}
    >
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand as={Link} href="/admin/dashboard" className={styles.brand}>
          <i className="icofont-dashboard fs-4 text-primary me-2" />
          <span className={styles.brandText}>
             <span className="fw-bold">Admin</span>
             <span className="d-none d-sm-inline ms-1">Panel</span>
          </span>
        </Navbar.Brand>

        {/* Toggle pour mobile */}
        <Navbar.Toggle aria-controls="admin-nav-collapse" className="border-0">
           <i className="icofont-navigation-menu fs-4" />
        </Navbar.Toggle>

        {/* Contenu de la barre de navigation */}
        <Navbar.Collapse id="admin-nav-collapse">
          {/* Navigation Principale */}
          <Nav className="me-auto flex-wrap py-2 py-lg-0">
            <Nav.Link
              as={Link}
              href="/" 
              className={`${styles.navLink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icofont-ui-home me-1" />
              Accueil
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="/admin" 
              className={`${styles.homeLink} ${isActive('/admin') ? styles.active : ''}`}
            >
              <i className="icofont-dashboard me-1" />
              Dashboard
            </Nav.Link>

            {NAV_ITEMS.map(item => (
              <Nav.Link
                key={item.href}
                as={Link}
                href={item.href}
                className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
              >
                <i className={`${item.icon} me-1`} />
                {item.label}
                {item.href === '/admin/reviews' && pendingReviewsCount > 0 && (
                  <span className="badge bg-danger rounded-pill ms-1">
                    {pendingReviewsCount}
                  </span>
                )}
              </Nav.Link>
            ))}
          </Nav>

          {/* Actions à droite */}
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

            {/* Bouton Notifications des Avis */}
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
              <Dropdown.Menu className={styles.notificationDropdown}>
                <div className={styles.dropdownHeader}>
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

            {/* Bouton Notifications des Vendeurs */}
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
              <Dropdown.Menu className={styles.notificationDropdown}>
                <div className={styles.dropdownHeader}>
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

            {/* Bouton Notifications */}
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
              <Dropdown.Menu className={styles.notificationDropdown}>
                 <div className={styles.dropdownHeader}>
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
                         className={`${styles.notificationItem} ${notification.read ? '' : styles.unread}`}
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

            {/* Dropdown Profil Utilisateur */}
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