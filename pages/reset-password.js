
import React, { useState } from "react";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import toast from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Réinitialiser les messages
    setErrorMessage("");
    setSuccessMessage("");
    
    // Validation basique
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Tous les champs sont requis");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMessage("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    
    if (newPassword.length < 6) {
      setErrorMessage("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/auth/reset-password', {
        email,
        oldPassword,
        newPassword
      });
      
      if (response.status === 200) {
        setSuccessMessage("Mot de passe mis à jour avec succès");
        toast.success("Mot de passe mis à jour avec succès");
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      const errorMsg = error.response?.data?.error || "Erreur lors de la réinitialisation du mot de passe";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="login-section padding-tb section-bg">
        <div className="container">
          <div className="account-wrapper">
            <h3 className="title">Réinitialisation du mot de passe</h3>

            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}

            <form className="account-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Ancien mot de passe *"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Nouveau mot de passe *"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmer le nouveau mot de passe *"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              {errorMessage && (
                <div className="error-message text-danger">
                  {errorMessage}
                </div>
              )}
              
              <div className="form-group text-center">
                <button 
                  className="d-block lab-btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                      Chargement...
                    </span>
                  ) : (
                    <span>Réinitialiser le mot de passe</span>
                  )}
                </button>
              </div>
            </form>
            
            <div className="account-bottom">
              <span className="d-block cate pt-10">
                <Link href="/login">Revenir à la connexion</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
