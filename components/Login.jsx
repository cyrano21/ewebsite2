"use client"


import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { AuthContext } from "../contexts/AuthProvider";

const title = "Connexion";
const socialTitle = "Connexion avec les réseaux sociaux";
const btnText = "Valider";

// Les icônes et classes pour les boutons sociaux sont directement configurées dans le JSX

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { signUpWithGmail, setUser } = useContext(AuthContext);

  // console.log(signUpWithGmail);
  const router = useRouter();
  // Gestion du redirect après login
  let from = "/";
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('redirect')) {
      from = params.get('redirect');
    }
  }

  // login with google
  const handleRegister = () => {
    signUpWithGmail()
      .then(() => {
        // Redirection après connexion réussie réussie
        router.push(from, { replace: true });
      })
      .catch((error) => console.log(error));
  };

  // login with email password
  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    
    setErrorMessage('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      
      if (result.error) {
        setErrorMessage(result.error);
        return;
      }
      
      // Connexion réussie
      if (typeof setUser === 'function') {
        // Mettre à jour le contexte utilisateur si nécessaire
        const userResponse = await fetch('/api/auth/me');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
        }
      }
      
      router.push(from, { replace: true });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setErrorMessage("Erreur de connexion au serveur");
    }
  };

  return (
    <div>
      <div className="login-section padding-tb section-bg">
        <div className="container">
          <div className="account-wrapper">
            <h3 className="title">{title}</h3>

            <form className="account-form" onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse email *"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe *"
                />
              </div>
              {/* showing error message */}
              <div>
                {errorMessage && (
                  <div className="error-message text-danger">
                    {errorMessage}
                  </div>
                )}
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between flex-wrap pt-sm-2">
                  <div className="checkgroup">
                    <input type="checkbox" name="remember" id="remember" />
                    <label htmlFor="remember">Se souvenir de moi</label>
                  </div>
                  <Link href="/forgetpass">Mot de passe oublié ?</Link>
                </div>
              </div>
              <div className="form-group text-center">
                <button className="d-block lab-btn">
                  <span>{btnText}</span>
                </button>
              </div>
            </form>
            <div className="account-bottom">
              <span className="d-block cate pt-10">
                Vous n&apos;avez pas de compte ? <Link href="/sign-up">S&apos;inscrire</Link>
              </span>
              <span className="or">
                <span>ou</span>
              </span>

              {/* social icons */}
              <h5 className="subtitle">{socialTitle}</h5>
              <ul className="lab-ul social-icons justify-content-center">
                <li>
                  <button onClick={handleRegister} className="github">
                    <i className="icofont-github"></i>
                  </button>
                </li>
                <li>
                  <Link href="/" className="facebook" legacyBehavior>
                    <i className="icofont-facebook"></i>
                  </Link>
                </li>
                <li>
                  <Link href="/" className="twitter" legacyBehavior>
                    <i className="icofont-twitter"></i>
                  </Link>
                </li>
                <li>
                  <Link href="/" className="linkedin" legacyBehavior>
                    <i className="icofont-linkedin"></i>
                  </Link>
                </li>
                <li>
                  <Link href="/" className="instagram" legacyBehavior>
                    <i className="icofont-instagram"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
