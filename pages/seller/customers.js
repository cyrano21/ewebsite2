// Page clients vendeur simplifiée et stable
import { useRouter } from 'next/router';

export default function CustomersPage() {
  const router = useRouter();

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '50px auto', 
      padding: '30px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: '#0d6efd',
        color: 'white',
        padding: '15px',
        borderRadius: '8px 8px 0 0',
        marginBottom: '30px'
      }}>
        <h2>Gestion des clients</h2>
      </div>
      
      <h4 style={{ marginBottom: '20px' }}>Cette page est en cours de développement</h4>
      <p style={{ marginBottom: '30px' }}>Bientôt, vous pourrez gérer vos clients ici.</p>
      
      <button 
        onClick={() => router.push('/seller/dashboard')} 
        style={{
          backgroundColor: '#0d6efd',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retour au tableau de bord
      </button>
    </div>
  );
}
