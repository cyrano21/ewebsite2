import React, { useContext, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { AuthContext } from '../../contexts/AuthProvider';
import { useRouter } from 'next/router';

const AdminLayout = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Ne jamais rediriger tant que l'auth est en cours
    if ((!user || user.role !== 'admin') && router.pathname !== '/') {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    // Sécurité supplémentaire (ne devrait pas s'afficher longtemps)
    return null;
  }

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
