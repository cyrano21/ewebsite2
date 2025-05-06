// 1️⃣ Toujours **en tout premier** du fichier (pas même un console.log avant)
"use client";

// 2️⃣ Vos imports
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/images/logo/ChatGPT-lum.png";
import { AuthContext } from "../../contexts/AuthProvider";
import { NavDropdown } from "react-bootstrap";
import { clientAvatar } from "../utils/imageImports";

// 3️⃣ Votre composant
export default function NavItems() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const { user, logOut } = useContext(AuthContext);

  useEffect(() => {
    const onScroll = () => setIsFixed(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => logOut().catch(console.error);

  return (
    <header
      className={`header-section style-4 ${
        isFixed ? "header-fixed fadeInUp" : ""
      }`}
      style={{ position: "sticky", top: 0, zIndex: 1000 }}
    >
      {/* --- header-top (mobile) --- */}
      <div className={`header-top d-md-none ${socialOpen ? "open" : ""}`}>
        <div className="container header-top-area">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              gap: "8px",
            }}
          >
            {user ? (
              <>
                <Image
                  src={user.photoURL || clientAvatar}
                  className="nav-profile"
                  alt="Photo de profil"
                  width={32}
                  height={32}
                  style={{ borderRadius: "50%" }}
                />
                <button
                  onClick={handleLogout}
                  style={{
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="lab-btn me-3"
                  style={{
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Créer un compte
                </Link>
                <Link
                  href="/login"
                  style={{
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Connexion
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- header-bottom --- */}
      <div className="header-bottom">
        <div className="container header-wrapper">
          {/* logo */}
          <div
            className="logo"
            style={{
              display: "flex",
              alignItems: "center",
              height: "56px",
              padding: 0,
              margin: 0,
            }}
          >
            <Link href="/">
              <Image
                src={logo}
                alt="Logo"
                width={120}
                height={40}
                style={{
                  maxHeight: "40px",
                  width: "auto",
                  padding: 0,
                  margin: 0,
                  display: "block",
                }}
                priority
              />
            </Link>
          </div>

          {/* menu principal */}
          <nav className="menu-area">
            <ul className={`lab-ul ${menuOpen ? "active" : ""}`}>
              {["/", "/shop", "/blog", "/about", "/contact"].map((p, i) => (
                <li key={i}>
                  <Link href={p}>
                    {p === "/"
                      ? "Accueil"
                      : p === "/shop"
                      ? "Boutique"
                      : p === "/blog"
                      ? "Blog"
                      : p === "/about"
                      ? "À propos"
                      : "Contact"}
                  </Link>
                </li>
              ))}
            </ul>

            {/* si user connecté */}
            {user ? (
              <>
                <Image
                  src={user.photoURL || clientAvatar}
                  className="nav-profile"
                  alt="Photo de profil"
                  width={32}
                  height={32}
                  style={{ borderRadius: "50%" }}
                />
                <NavDropdown id="user-menu">
                  <NavDropdown.Item onClick={handleLogout}>
                    Déconnexion
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/panier">Panier</NavDropdown.Item>
                  <NavDropdown.Item href="/admin/profile">
                    Profil
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="lab-btn me-3 d-none d-md-block"
                >
                  Créer un compte
                </Link>
                <Link href="/login" className="d-none d-md-block">
                  Connexion
                </Link>
              </>
            )}

            {/* toggles mobile */}
            <button
              className="header-bar d-lg-none"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
            <button
              className="ellepsis-bar d-md-none"
              onClick={() => setSocialOpen((v) => !v)}
            >
              <i className="icofont-info-square" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
