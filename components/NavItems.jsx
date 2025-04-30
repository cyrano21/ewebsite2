"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { AuthContext } from "../contexts/AuthProvider";
import { NavDropdown } from "react-bootstrap";
import { clientAvatar } from "../utils/imageImports";

const NavItems = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const [socialToggle, setSocialToggle] = useState(false);
  const [headerFiexd, setHeaderFiexd] = useState(false);

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
                      <>
                        <img src={user?.photoURL} className="nav-profile" alt="Profile" />
                      </>
                    ) : (
                      <img
                        src={clientAvatar}
                        className="nav-profile"
                        alt="Default avatar"
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
                      Panneau d'admin
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
