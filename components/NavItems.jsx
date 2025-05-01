"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "../contexts/AuthProvider";
import { NavDropdown } from "react-bootstrap";
import { clientAvatar } from "../utils/imageImports";
import styles from "./NavItems.module.css";

const NavItems = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const [socialToggle, setSocialToggle] = useState(false);
  const [headerFiexd, setHeaderFiexd] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // check if user is register
  const { user, logOut } = useContext(AuthContext);

  const handleLogout = () => {
    logOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setHeaderFiexd(true);
      } else {
        setHeaderFiexd(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Charger le nombre d'articles dans le panier et la liste de souhaits
  useEffect(() => {
    // Fonction pour récupérer et mettre à jour les compteurs
    const updateCounts = () => {
      try {
        // Récupérer le panier depuis localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cartItems.length);
        
        // Récupérer la liste de souhaits depuis localStorage
        const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlistCount(wishlistItems.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    
    // Mettre à jour les compteurs au chargement du composant
    updateCounts();
    
    // Écouter les changements dans localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'cart' || e.key === 'wishlist') {
        updateCounts();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement les changements (utile pour les mises à jour au sein de la même fenêtre)
    const interval = setInterval(updateCounts, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <header
      className={`header-section style-4 ${
        headerFiexd ? "header-fixed fadeInUp" : ""
      }`}
    >
      {/* ------ header top: first div ----- */}
      <div className={`header-top d-md-none ${socialToggle ? "open" : ""}`}>
        <div className="container">
          <div className="header-top-area">
            <Link href="/sign-up" className="lab-btn me-3">
              <span>Créer un compte</span>
            </Link>
            <Link href="/login">Connexion</Link>
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
                <Link href="/">
                  <Image 
                    src="/assets/images/logo/logo2.png" 
                    alt="logo" 
                    width={150} 
                    height={60} 
                    priority 
                  />
                </Link>
              </div>
            </div>

            {/* menu area */}
            <div className="menu-area">
              <div className="menu">
                <ul className={`lab-ul ${menuToggle ? "active" : ""}`}>
                  <li>
                    <Link href="/">Accueil</Link>
                  </li>
                  <li>
                    <Link href="/shop">Boutique</Link>
                  </li>
                  <li>
                    <Link href="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link href="/about">À propos</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
              
              {/* Icons for cart and wishlist */}
              <div className="d-flex align-items-center me-3">
                <Link href="/wishlist" className="position-relative me-4">
                  <i className="icofont-heart-alt fs-5"></i>
                  {wishlistCount > 0 && (
                    <span className={styles.badgeCart}>{wishlistCount}</span>
                  )}
                </Link>
                <Link href="/customer/cart" className="position-relative">
                  <i className="icofont-cart-alt fs-5"></i>
                  {cartCount > 0 && (
                    <span className={styles.badgeCart}>{cartCount}</span>
                  )}
                </Link>
              </div>

              {/* users when user available */}
              {user ? (
                <>
                  <div>
                    {user?.photoURL ? (
                      <>
                        <Image 
                          src={user?.photoURL} 
                          className="nav-profile" 
                          alt="Profile" 
                          width={40} 
                          height={40} 
                        />
                      </>
                    ) : (
                      <Image
                        src={clientAvatar}
                        className="nav-profile"
                        alt="Default avatar"
                        width={40} 
                        height={40} 
                      />
                    )}
                  </div>
                  <NavDropdown id="basic-nav-dropdown">
                    <NavDropdown.Item href="#" onClick={handleLogout}>
                      Déconnexion
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/panier">
                      Panier
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/admin/profile">
                      Profil
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/admin">
                      Panneau d&apos;admin
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/admin/orders">Commandes</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    className="lab-btn me-3 d-none d-md-block"
                  >
                    <span>Créer un compte</span>
                  </Link>
                  <Link href="/login" className="d-none d-md-block">
                    Connexion
                  </Link>
                </>
              )}

              {/* menu toggle btn */}
              <div
                className={`header-bar d-lg-none ${menuToggle ? "active" : ""}`}
                onClick={() => setMenuToggle(!menuToggle)}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>

              {/* social toggler */}
              <div
                className="ellepsis-bar d-md-none"
                onClick={() => setSocialToggle(!socialToggle)}
              >
                <i className="icofont-info-square"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* header bottom ends */}
    </header>
  );
};

export default NavItems;
