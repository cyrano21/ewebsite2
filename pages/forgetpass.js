import axios from 'axios';
import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function ForgetPassPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: appeler l'API de réinitialisation de mot de passe
      await axios.post('/api/auth/forgetpass', { email });
      setMessage("Si cet email existe, tu recevras un lien de réinitialisation.");
    } catch (error) {
      console.error('Erreur réinitialisation :', error);
      setMessage('Une erreur est survenue lors de la demande.');
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="account-wrapper">
          <h3>Mot de passe oublié</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group text-center">
              <button className="d-block lab-btn">
                <span>Envoyer lien</span>
              </button>
            </div>
          </form>
          {message && <div className="message text-success">{message}</div>}
          <p>
            Retour à <Link href="/login">connexion</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
