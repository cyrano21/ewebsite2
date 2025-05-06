
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthContext } from '../../contexts/AuthProvider';

const title = "Connexion";
const socialTitle = "Connexion avec les réseaux sociaux";
const btnText = "Valider";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { signUpWithGmail, login, user } = useContext(AuthContext);
  const router = useRouter();

  // Récupère la redirection depuis l'URL avec les query params
  const { redirect = '/' } = router.query;
  
  // Rediriger l'utilisateur s'il est déjà connecté
  useEffect(() => {
    if (user) {
      router.push(redirect || '/');
    }
  }, [user, router, redirect]);

  // Vérifie si des identifiants sont sauvegardés au chargement du composant
  useEffect(() => {
    const savedCredentials = localStorage.getItem('rememberedCredentials');
    if (savedCredentials) {
      const { email, password } = JSON.parse(savedCredentials);
      setRememberMe(true);
      // Pré-remplir les champs si des identifiants sont sauvegardés
      const emailInput = document.querySelector('input[name="email"]');
      const passwordInput = document.querySelector('input[name="password"]');
      if (emailInput) emailInput.value = email;
      if (passwordInput) passwordInput.value = password;
    }
  }, []);

  // login with google
  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const user = result.user;
        if (rememberMe) {
          localStorage.setItem('rememberedUser', JSON.stringify({
            id: user.uid,
            email: user.email
          }));
        }
        router.push(redirect);
      })
      .catch((error) => console.log(error));
  };

  // login with email password
  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const remember = form.remember.checked;
    
    // Mettre à jour l'état de rememberMe
    setRememberMe(remember);
    
    // Passer l'option "remember" à la fonction login
    const result = await login(email, password, remember);
    if (!result) {
      setErrorMessage("Email ou mot de passe incorrect");
      return;
    }
    
    // Si "Se souvenir de moi" est coché, sauvegarder les identifiants
    if (remember) {
      localStorage.setItem('rememberedCredentials', JSON.stringify({ email, password }));
      localStorage.setItem('rememberedUser', JSON.stringify({
        id: result.user.id || result.user.uid,
        email: result.user.email
      }));
    } else {
      // Sinon, supprimer les identifiants sauvegardés
      localStorage.removeItem('rememberedCredentials');
      localStorage.removeItem('rememberedUser');
    }
    
    console.log("utilisateur connecté:", result.user);
    router.push(redirect);
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
                    <input 
                      type="checkbox" 
                      name="remember" 
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember">Se souvenir de moi</label>
                  </div>
                  <Link href="/reset-password" legacyBehavior>
                    <a>Mot de passe oublié ?</a>
                  </Link>
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
                  <a href="#" className="facebook">
                    <i className="icofont-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="twitter">
                    <i className="icofont-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="linkedin">
                    <i className="icofont-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="instagram">
                    <i className="icofont-instagram"></i>
                  </a>
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
