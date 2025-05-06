import React, { createContext, useContext, useState, useCallback } from 'react';

// Types de notifications
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'danger',
  WARNING: 'warning',
  INFO: 'info'
};

// Création du contexte
const NotificationContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Fournisseur du contexte
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Ajouter une nouvelle notification
  const addNotification = useCallback((message, type = NOTIFICATION_TYPES.INFO, duration = 5000) => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleTimeString('fr-FR')
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, duration);

    return newNotification.id;
  }, []);

  // Supprimer une notification par ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Supprimer toutes les notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      removeNotification, 
      clearNotifications,
      NOTIFICATION_TYPES 
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Composant de conteneur de notifications
const NotificationContainer = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className="notification-container" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      {notifications.map(({ id, message, type, time }) => (
        <div 
          key={id} 
          className={`alert alert-${type} alert-dismissible fade show`}
          role="alert"
          style={{
            marginBottom: '10px',
            transition: 'opacity 0.5s ease-in-out'
          }}
        >
          <strong>{time}</strong>: {message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => removeNotification(id)}
            aria-label="Close"
          />
        </div>
      ))}
    </div>
  );
};

export { NOTIFICATION_TYPES };
export default NotificationContext;
