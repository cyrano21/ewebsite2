"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "../contexts/AuthProvider";
import { NavDropdown } from "react-bootstrap";
import { clientAvatar } from "../utils/imageImports";
import styles from "./NavItems.module.css";

// Composant Link wrapper qui gère correctement les enfants
const CustomLink = ({ href, className, children, ...props }) => {
  // Avec la nouvelle API de Link, nous n'avons plus besoin de distinguer les éléments ancrés
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
};

const NavItems = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const [socialToggle, setSocialToggle] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Système pour éviter la duplication des NavItems
  const [isMainInstance, setIsMainInstance] = useState(true);
  const navInstanceId = React.useId(); // Identifiant unique pour cette instance

  // Gestion robuste du contexte d'authentification avec des valeurs par défaut
  // Permet de gérer les cas où le contexte n'est pas encore initialisé
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logOut = authContext?.logOut || (() => {});
  const loading = authContext?.loading ?? true;

  // Vérification pour éviter les duplications de NavItems
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Créer une variable globale pour suivre les instances de NavItems
    if (!window.__navItemsInstances) {
      window.__navItemsInstances = [];
    }

    // Si cette instance est déjà enregistrée, ne rien faire
    if (window.__navItemsInstances.includes(navInstanceId)) {
      return;
    }

    // Si d'autres instances existent déjà, cette instance n'est pas la principale
    if (window.__navItemsInstances.length > 0) {
      setIsMainInstance(false);
    }

    // Enregistrer cette instance
    window.__navItemsInstances.push(navInstanceId);

    // Nettoyer lors du démontage
    return () => {
      window.__navItemsInstances = window.__navItemsInstances.filter(id => id !== navInstanceId);
    };
  }, [navInstanceId]);

  useEffect(() => {
    const scrollHandler = () => {
      const scrollThreshold = 200;
      setHeaderFixed(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  // Charger le nombre d'articles dans le panier et la liste de souhaits
  useEffect(() => {
    const updateCounts = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
        setCartCount(cartItems.length);
        setWishlistCount(wishlistItems.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setCartCount(0);
        setWishlistCount(0);
      }
    };

    updateCounts();
    const storageHandler = (e) => {
      if (e.key === 'cart' || e.key === 'wishlist') {
        updateCounts();
      }
    };

    window.addEventListener('storage', storageHandler);
    return () => window.removeEventListener('storage', storageHandler);
  }, []);

  // Log de débogage pour l'utilisateur et le chargement
  useEffect(() => {
    const logUserState = () => {
      console.log('NavItems: État complet', {
        user: user && typeof user === 'object' ? {
          name: user.name || 'N/A',
          email: user.email || 'N/A',
          photoURL: user.photoURL || null,
          id: user.id || null,
          role: user.role || 'N/A',
          sellerStatus: user.sellerStatus || 'N/A'
        } : null,
        loading: loading,
        authContextAvailable: !!authContext,
        isAdmin: user?.role === 'admin'
      });
    };

    logUserState();
  }, [user, loading, authContext]);

  const handleLogout = () => {
    logOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Si cette instance n'est pas l'instance principale, ne pas rendre le composant
  if (!isMainInstance) {
    return null;
  }

  return (
    <header
      className={`header-section style-4 ${headerFixed ? "header-fixed fadeInUp" : ""}`}
      style={{ position: 'sticky', top: 0, zIndex: 1000 }}
      data-nav-id={navInstanceId}
    >
      {/* ------ header top: first div ----- */}
      <div className={`header-top d-md-none ${socialToggle ? "open" : ""}`}>
        <div className="container">
          <div className="header-top-area">
            {/* Conditionally render login/signup or user info based on authentication status */}
            {user ? (
              <>
                <span className="me-3">Bonjour, {user.name || user.email}</span>
                <button onClick={handleLogout} className="lab-btn">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <CustomLink href="/sign-up" className="lab-btn me-3">
                  Créer un compte
                </CustomLink>
                <CustomLink href="/login">Connexion</CustomLink>
              </>
            )}
          </div>
        </div>
      </div>

      {/* header top ends*/}

      {/* ---header bottom starts */}
      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            {/* logo  */}
            <div className="logo-search-acte">
              <div className="logo">
                <CustomLink href="/">
                  <span className="d-inline-block">
                    <Image 
                      src="/assets/images/logo/logo2.png" 
                      alt="logo" 
                      width={150} 
                      height={60} 
                      priority 
                    />
                  </span>
                </CustomLink>
              </div>
            </div>

            {/* menu area */}
            <div className="menu-area">
              <div className="menu">
                <ul className={`lab-ul ${menuToggle ? "active" : ""}`}>
                  <li><CustomLink href="/">Accueil</CustomLink></li>
                  <li><CustomLink href="/shop">Boutique</CustomLink></li>
                  <li><CustomLink href="/blog">Blog</CustomLink></li>
                  <li><CustomLink href="/about">À propos</CustomLink></li>
                  <li><CustomLink href="/contact">Contact</CustomLink></li>
                  <li><CustomLink href="/wishlist">Liste de souhaits</CustomLink></li>
                  <li><CustomLink href="/shop/compare">Comparer des produits</CustomLink></li>
                  {/* Afficher "Devenir vendeur" uniquement si l'utilisateur n'est pas déjà vendeur */}
                  {user && user.sellerStatus !== 'approved' && (
                    <li>
                      <Link href="/become-seller" className="nav-link">
                        {user.sellerStatus === 'pending' ? 'Demande en cours' : 'Devenir vendeur'}
                      </Link>
                    </li>
                  )}
                  {/* Afficher "Espace vendeur" uniquement si l'utilisateur est un vendeur approuvé */}
                  {user && user.sellerStatus === 'approved' && (
                    <li>
                      <Link href="/seller/dashboard" className="nav-link">
                        Espace vendeur
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {/* Bouton du menu mobile */}
              <div className="menu-trigger d-md-none" onClick={() => setMenuToggle(!menuToggle)}>
                <span className={menuToggle ? "active" : ""}><i className="icofont-navigation-menu"></i></span>
              </div>

              {/* Icons for cart and wishlist */}
              <div className="d-flex align-items-center me-3">
                <CustomLink href="/wishlist" className="position-relative me-4">
                  <i className="icofont-heart-alt fs-5"></i>
                  {wishlistCount > 0 && (
                    <span className={styles.badgeCart}>{wishlistCount}</span>
                  )}
                </CustomLink>
                <CustomLink href="/customer/cart" className="position-relative">
                  <i className="icofont-cart-alt fs-5"></i>
                  {cartCount > 0 && (
                    <span className={styles.badgeCart}>{cartCount}</span>
                  )}
                </CustomLink>
              </div>

              {/* users when user available */}
              {user && user.email ? (
                <NavDropdown
                  title={
                    user?.photoURL && user.photoURL !== '' ? (
                      <Image 
                        src={user.photoURL} 
                        className="nav-profile rounded-circle" 
                        alt="Profile" 
                        width={40} 
                        height={40} 
                        onError={(e) => { e.target.src = clientAvatar; }}
                      />
                    ) : (
                      <Image
                        src={clientAvatar}
                        className="nav-profile rounded-circle"
                        alt="Default avatar"
                        width={40} 
                        height={40} 
                      />
                    )
                  }
                  id="user-dropdown"
                >
                  <NavDropdown.Item href="/profile">Mon Profil</NavDropdown.Item>
                  <NavDropdown.Item href="/customer/orders">Mes Commandes</NavDropdown.Item>
                  {user?.role === 'admin' && (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/admin">Tableau de bord Admin</NavDropdown.Item>
                      <NavDropdown.Item href="/admin/traffic-analytics">Analyse du trafic</NavDropdown.Item>
                      <NavDropdown.Item href="/admin/transactions">Transactions</NavDropdown.Item>
                      <NavDropdown.Item href="/admin/activity-monitor">Moniteur d'activité</NavDropdown.Item> {/* Added line */}
                    </>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Déconnexion</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <CustomLink href="/login" className="lab-btn">
                  Connexion
                </CustomLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const SocialToggler = ({ socialToggle, setSocialToggle }) => {
  return (
    <div
      className="ellepsis-bar d-md-none"
      onClick={() => setSocialToggle(!socialToggle)}
    >
      <i className="icofont-info-square"></i>
    </div>
  );
};

export default NavItems;