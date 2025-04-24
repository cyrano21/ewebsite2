"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";

import { AuthContext } from "../contexts/AuthProvider";
import { NavDropdown, Badge } from "react-bootstrap";
import { clientAvatar } from "../utils/imageImports";

const NavItems = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [socialToggle, setSocialToggle] = useState(false);

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

  React.useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, []);

  console.log('NavItems user:', user);
  return (
    <header className="header-section style-4 header-fixed fadeInUp" style={{ zIndex: 1000 }}>
      {/* ------ header top: first div ----- */}
      <div className={`header-top d-md-none ${socialToggle ? "open" : ""}`}>
        <div className="container">
          <div className="header-top-area">
            {/* Afficher les liens d'inscription/connexion uniquement si pas connecté */}
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
      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            {/* logo  */}
            <div className="logo-search-acte">
              <div className="logo">
                <Link href="/">
                  <img src="/assets/images/logo/logo.png" alt="logo" />
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
                    <Link href="shop">Boutique</Link>
                  </li>
                  <li>
                    <Link href="/blog">Blog</Link>
                  </li>
                  <li>
                    {" "}
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
                      <>
                        <img src={user?.photoURL} className="nav-profile" />
                      </>
                    ) : (
                      <img
                        src={clientAvatar}
                        className="nav-profile"
                      />
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
