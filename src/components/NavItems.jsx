"use client";

import { useContext, useState, useEffect } from "react";
console.log("NavItems.jsx: Chargement du fichier");

console.log("NavItems.jsx: Avant imports");
import Link from "next/link";
import { useRouter } from "next/router";
console.log("NavItems.jsx: Après imports de next");

console.log("NavItems.jsx: Avant import logo");
import logo from "../assets/images/logo/ChatGPT-lum.png";
console.log("NavItems.jsx: Logo importé:", typeof logo);

console.log("NavItems.jsx: Avant import AuthContext");
import { AuthContext } from "../../contexts/AuthProvider";
console.log("NavItems.jsx: AuthContext importé:", typeof AuthContext);

console.log("NavItems.jsx: Avant import NavDropdown");
import { NavDropdown } from "react-bootstrap";
console.log("NavItems.jsx: NavDropdown importé:", typeof NavDropdown);

console.log("NavItems.jsx: Avant import clientAvatar");
import { clientAvatar } from "../utils/imageImports";
console.log("NavItems.jsx: clientAvatar importé:", typeof clientAvatar);

const NavItems = () => {
  console.log("NavItems.jsx: Exécution du composant NavItems");
  const [menuToggle, setMenuToggle] = useState(false);
  const [socialToggle, setSocialToggle] = useState(false);
  const [headerFiexd, setHeaderFiexd] = useState(false);

  // check if user is register
  const { user, logOut } = useContext(AuthContext);
  console.log("NavItems.jsx: AuthContext user:", user ? "disponible" : "null");

  const handleLogout = () => {
    logOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Déplacer l'écouteur d'événement de défilement dans useEffect pour l'exécuter uniquement côté client
  useEffect(() => {
    console.log("NavItems.jsx: useEffect pour scroll");
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setHeaderFiexd(true);
      } else {
        setHeaderFiexd(false);
      }
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener("scroll", handleScroll);

    // Nettoyage lors du démontage du composant
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Le tableau de dépendances vide signifie que cet effet ne s'exécute qu'une fois au montage

  console.log("NavItems.jsx: Avant return");
  return (
    <header
      className={`header-section style-4 ${
        headerFiexd ? "header-fixed fadeInUp" : ""
      }`}
      style={{ position: "sticky", top: 0, zIndex: 1000 }}
    >
      {/* ------ header top: first div ----- */}
      <div className={`header-top d-md-none ${socialToggle ? "open" : ""}`}>
        <div className="container">
          <div className="header-top-area">
            {user ? (
              <>
                {user.photoURL ? (
                  <img src={user.photoURL} className="nav-profile" />
                ) : (
                  <img src={clientAvatar} className="nav-profile" />
                )}
                <Link href="#" onClick={handleLogout}>
                  Déconnexion
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-up" className="lab-btn me-3">
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
                  <img src={logo} alt="logo" />
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
                      <img src={clientAvatar} className="nav-profile" />
                    )}
                  </div>
                  <NavDropdown id="basic-nav-dropdown">
                    <NavDropdown.Item as="button" onClick={handleLogout}>
                      Déconnexion
                    </NavDropdown.Item>
                    <NavDropdown.Item as="a" href="/panier">
                      Panier
                    </NavDropdown.Item>
                    <NavDropdown.Item as="a" href="/admin/profile">
                      Profil
                    </NavDropdown.Item>
                    <NavDropdown.Item as="a" href="/admin">
                      Panneau d&apos;admin
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as="a" href="/panier">
                      Commandes
                    </NavDropdown.Item>
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
      {/* header botton ends */}
    </header>
  );
};

console.log("NavItems.jsx: Exportation de NavItems");
export default NavItems;
