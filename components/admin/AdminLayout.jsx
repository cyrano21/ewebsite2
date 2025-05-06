import React, { useContext, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { AuthContext } from '../../contexts/AuthProvider';
import { useRouter } from 'next/router';
import { useNotifications, NOTIFICATION_TYPES } from '../../contexts/NotificationContext';

const AdminLayout = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (loading) return; // Ne jamais rediriger tant que l'auth est en cours
    if ((!user || user.role !== 'admin') && router.pathname !== '/') {
      addNotification('Accès non autorisé. Redirection en cours...', NOTIFICATION_TYPES.WARNING);
      router.replace('/');
    } else if (user && user.role === 'admin') {
      addNotification(`Bienvenue, ${user.name || 'Administrateur'}`, NOTIFICATION_TYPES.SUCCESS);
    }
  }, [user, loading, router, addNotification]);

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
