import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "../contexts/AuthProvider";

const title = "Inscription";
const socialTitle = "S'inscrire avec les réseaux sociaux";
const btnText = "Commencer maintenant";

let socialList = [
  {
    link: "#",
    iconName: "icofont-facebook",
    className: "facebook",
  },
  {
    link: "#",
    iconName: "icofont-twitter",
    className: "twitter",
  },
  {
    link: "#",
    iconName: "icofont-linkedin",
    className: "linkedin",
  },
  {
    link: "#",
    iconName: "icofont-instagram",
    className: "instagram",
  },
  {
    link: "#",
    iconName: "icofont-pinterest",
    className: "pinterest",
  },
];

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const { signUpWithGmail, createUser } = useContext(AuthContext);

  const router = useRouter();
  const from = "/";

  // login with google
  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const user = result.user;
        router.push(from, { replace: true });
      })
      .catch((error) => console.log(error));
  };

  // login with email password
  const handleSignup = (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value; // Get the confirm password field

    if (password !== confirmPassword) {
      // Passwords do not match, set an error message
      setErrorMessage("Les mots de passe ne correspondent pas ! Veuillez fournir le mot de passe correct");
    } else {
      // Passwords match, proceed with signup logic
      setErrorMessage(""); // Clear the error message
      // Appel direct à l'API Next.js
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            setErrorMessage(data.error || "Erreur lors de l'inscription");
            alert(data.error || "Erreur lors de l'inscription");
            return;
          }
          alert("Compte créé avec succès !");
          router.push(from, { replace: true });
        })
        .catch((error) => {
          setErrorMessage("Erreur de connexion au serveur");
          alert("Erreur de connexion au serveur");
        });
    }
  };
  return (
    <div>
      <div className="login-section padding-tb section-bg">
        <div className="container">
          <div className="account-wrapper">
            <h3 className="title">{title}</h3>
            <form className="account-form" onSubmit={handleSignup}>
              <div className="form-group">
                <input type="text" name="name" placeholder="Nom d'utilisateur" />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder="Email" />
              </div>
              <div className="form-group">
                <input type="password" name="password" placeholder="Mot de passe" />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmer le mot de passe"
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
                <button className="lab-btn">
                  <span>{btnText}</span>
                </button>
              </div>
            </form>
            <div className="account-bottom">
              <span className="d-block cate pt-10">
                Déjà membre ? <Link href="/login">Connexion</Link>
              </span>
              <span className="or">
                <span>ou</span>
              </span>

              <h5 className="subtitle">{socialTitle}</h5>
              <ul className="lab-ul social-icons justify-content-center">
                <li>
                  <button onClick={handleRegister} className="github">
                    <i className="icofont-github"></i>
                  </button>
                </li>
                <li>
                  <a href="/" className="facebook">
                    <i className="icofont-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="/" className="twitter">
                    <i className="icofont-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="/" className="linkedin">
                    <i className="icofont-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a href="/" className="instagram">
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

export default Signup;
