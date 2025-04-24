import { createContext, useContext, useState } from 'react';

// Création du contexte
const NotificationContext = createContext();

// Hook personnalisé pour utilser le contexte
export const useNotifications = () => useContext(NotificationContext);

// Fournisseur du contexte
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Ajouter une nouvelle notification
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      time: new Date().toLocaleTimeString('fr-FR'),
      id: Date.now()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  // Supprimer une notification
  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  // Supprimer toutes les notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      removeNotification, 
      clearNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
