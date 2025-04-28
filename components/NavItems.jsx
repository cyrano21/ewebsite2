"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { AuthContext } from "../contexts/AuthProvider";
import { NavDropdown, Badge } from "react-bootstrap";
import { clientAvatar } from "../utils/imageImports";
import styles from "./NavItems.module.css";

const NavItems = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const [socialToggle, setSocialToggle] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const { user, logOut } = useContext(AuthContext);

  // Déconnexion
  const handleLogout = () => logOut().catch(console.error);

  // Mise à jour du compteur panier
  useEffect(() => {
    const updateCart = () => {
      try {
        const c = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(c.length);
      } catch {
        setCartCount(0);
      }
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("storage:update", updateCart);
    const iv = setInterval(updateCart, 2000);
    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("storage:update", updateCart);
      clearInterval(iv);
    };
  }, []);

  // Mise à jour du compteur favoris
  useEffect(() => {
    const updateWL = () => {
      try {
        const w = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlistCount(w.length);
      } catch {
        setWishlistCount(0);
      }
    };
    updateWL();
    window.addEventListener("storage", updateWL);
    window.addEventListener("storage:update", updateWL);
    const iv = setInterval(updateWL, 2000);
    return () => {
      window.removeEventListener("storage", updateWL);
      window.removeEventListener("storage:update", updateWL);
      clearInterval(iv);
    };
  }, []);

  return (
    <header
      className="header-section style-4 header-fixed fadeInUp"
      style={{ zIndex: 1000 }}
    >
      {/* ==== header top (mobile only) ==== */}
      <div className={`header-top d-md-none ${socialToggle ? "open" : ""}`}>
        <div className="container">
          <div className="header-top-area">
            {!user ? (
              <>
                <Link href="/signup" className="lab-btn me-3">
                  Créer un compte
                </Link>
                <Link href="/login">Connexion</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="lab-btn">
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==== header bottom ==== */}
      <div
        className="header-bottom"
        style={{
          height: 90,
          minHeight: 90,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="header-wrapper d-flex align-items-center justify-content-between">
            {/* Logo + recherche */}
            <div className="logo-search-acte d-flex align-items-center">
              <Link href="/" className="me-3">
                <img
                  src="/assets/images/logo/ChatGPT-lum.png"
                  alt="MindCard"
                  style={{ height: 40 }}
                />
              </Link>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = e.target.elements["mainnav-search"].value;
                  if (q.trim()) alert("Recherche : " + q);
                }}
                className="d-none d-md-flex flex-grow-1"
                style={{ maxWidth: 340 }}
              >
                <input
                  type="text"
                  name="mainnav-search"
                  placeholder="Rechercher sur le site..."
                  className="form-control"
                  style={{
                    paddingLeft: 32,
                    borderRadius: 20,
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-link position-relative"
                  style={{ right: 32 }}
                  aria-label="Rechercher"
                >
                  <i className="icofont-search" />
                </button>
              </form>
            </div>

            {/* Menu principal */}
            <nav className="menu-area d-flex align-items-center">
              <ul
                className={`lab-ul d-none d-lg-flex mb-0 ${
                  menuToggle ? "active" : ""
                }`}
              >
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

              {/* Auth / Profil */}
              {user ? (
                <NavDropdown title="" id="nav-user-dropdown" className="ms-3">
                  <NavDropdown.Header>
                    <img
                      src={user.photoURL || clientAvatar}
                      alt="avatar"
                      className="rounded-circle"
                      width={32}
                      height={32}
                    />
                  </NavDropdown.Header>
                  <NavDropdown.Item as="button" onClick={handleLogout}>
                    Déconnexion
                  </NavDropdown.Item>
                  <NavDropdown.Item as="a" href="/panier">
                    Panier
                  </NavDropdown.Item>
                  <NavDropdown.Item as="a" href="/admin/profile">
                    Profil
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="lab-btn me-3 d-none d-md-block"
                  >
                    Créer un compte
                  </Link>
                  <Link
                    href="/login"
                    className="me-3 d-none d-md-block"
                  >
                    Connexion
                  </Link>
                </>
              )}

              {/* Icônes Panier & Wishlist */}
              <Link href="/panier" className={styles.navIconLink}>
                <span className={styles.iconWithBadge}>
                  <i className="icofont-cart" />
                  {cartCount > 0 && (
                    <Badge pill className={styles.badgeCart}>
                      {cartCount}
                    </Badge>
                  )}
                </span>
              </Link>

              <Link href="/wishlist" className={styles.navIconLink}>
                <span className={styles.iconWithBadge}>
                  <i className="icofont-heart" />
                  {wishlistCount > 0 && (
                    <Badge pill className={styles.badgeWishlist}>
                      {wishlistCount}
                    </Badge>
                  )}
                </span>
              </Link>

              {/* bouton mobile menu */}
              <button
                className={`header-bar d-lg-none btn btn-link ${
                  menuToggle ? "active" : ""
                }`}
                onClick={() => setMenuToggle((v) => !v)}
              >
                <span />
                <span />
                <span />
              </button>

              {/* bouton mobile social */}
              <button
                className="ellepsis-bar d-md-none btn btn-link ms-2"
                onClick={() => setSocialToggle((v) => !v)}
              >
                <i className="icofont-info-square" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavItems;
