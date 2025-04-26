"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { AuthContext } from "../contexts/AuthProvider";
import { NavDropdown, Badge } from "react-bootstrap";
import { clientAvatar } from "../utils/imageImports";

const NavItems = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [socialToggle, setSocialToggle] = useState(false);

  // check if user is register
  const { user, logOut } = useContext(AuthContext);
  console.log("[NavItems] user:", user);

  const handleLogout = () => {
    logOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fonction pour déclencher une mise à jour des compteurs
  const triggerCountersUpdate = () => {
    const event = new Event('storage:update');
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cart.length);
      } catch (error) {
        setCartCount(0);
      }
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("storage:update", updateCount);
    const interval = setInterval(updateCount, 2000);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("storage:update", updateCount);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlistCount(wishlist.length);
      } catch (error) {
        setWishlistCount(0);
      }
    };
    updateWishlistCount();
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("storage:update", updateWishlistCount);
    const interval = setInterval(updateWishlistCount, 2000);
    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("storage:update", updateWishlistCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="header-section style-4 header-fixed fadeInUp" style={{ zIndex: 1000 }}>
      {/* ------ header top: first div ----- */}
      <div className={`header-top d-md-none ${socialToggle ? "open" : ""}`}>
        <div className="container">
          <div className="header-top-area">
            {!user && (
              <>
                <Link href="/signup" className="lab-btn me-3">
                  <span>Créer un compte</span>
                </Link>
                <Link href="/login">Connexion</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* header top ends*/}

      {/* ---header botton starts */}
      <div className="header-bottom" style={{ height: 90, minHeight: 90, display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="header-wrapper">
            {/* logo  */}
            <div className="logo-search-acte d-flex align-items-center">
              <div className="logo me-2">
                <Link href="/">
                  <img src="/assets/images/logo/ChatGPT-lum.png" alt="logo" />
                </Link>
              </div>
              {/* BARRE DE RECHERCHE NAVBAR GENERALE */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const query = e.target.elements['mainnav-search'].value;
                  if (query.trim()) alert('Recherche : ' + query);
                }}
                className="d-none d-md-flex"
                style={{ marginLeft: 8, marginRight: 16, alignItems: 'center', flex: 1, maxWidth: 340 }}
              >
                <input
                  type="text"
                  name="mainnav-search"
                  placeholder="Rechercher sur le site..."
                  style={{
                    border: '1px solid #ced4da',
                    borderRadius: 20,
                    padding: '3px 12px 3px 32px',
                    fontSize: '0.98em',
                    height: 30,
                    background: '#fff',
                    outline: 'none',
                    boxShadow: 'none',
                    marginRight: 6,
                    minWidth: 120,
                    width: '100%'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    marginLeft: -32,
                    color: '#0d6efd',
                    cursor: 'pointer',
                    fontSize: 18,
                    padding: 0
                  }}
                  aria-label="Rechercher"
                >
                  <i className="icofont-search"></i>
                </button>
              </form>
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

              {/* users when user available */}
              {user ? (
                <>
                  <div>
                    {user?.photoURL ? (
                      <img src={user?.photoURL} className="nav-profile" />
                    ) : (
                      <img src={clientAvatar} className="nav-profile" />
                    )}
                  </div>
                  <NavDropdown id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} href="#" onClick={handleLogout}>
                      Déconnexion
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} href="/panier">
                      Panier
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} href="/admin/profile">
                      Profil
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} href="/admin">
                      Panneau d&apos;admin
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} href="/panier">Commandes</NavDropdown.Item>
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
              {/* Icone Panier */}
              <Link href="/panier" className="me-3 ms-3 d-none d-md-inline-block position-relative">
                <i className="icofont-cart"></i>
                {cartCount > 0 && <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">{cartCount}</Badge>}
              </Link>
              
              {/* Icone Wishlist (Favoris) */}
              <Link href="/wishlist" className="me-3 d-none d-md-inline-block position-relative">
                <i className="icofont-heart"></i>
                {wishlistCount > 0 && <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">{wishlistCount}</Badge>}
              </Link>
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
      {/* header botton ends */}
    </header>
  );
};

export default NavItems;