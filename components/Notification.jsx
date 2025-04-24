"use client"


import React, { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import './modal.css';

const Notification = () => {
  const { notifications, removeNotification, clearNotifications } = useNotifications();

  // Nettoyage automatique des notifications après un délai
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        // Supprimer la notification la plus ancienne
        if (notifications.length > 0) {
          removeNotification(0);
        }
      }, 5000); // 5 secondes

      return () => clearTimeout(timer);
    }
  }, [notifications, removeNotification]);

  // Obtenir l'icône en fonction du type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'icofont-check-circled';
      case 'info':
        return 'icofont-info-circle';
      case 'warning':
        return 'icofont-warning-alt';
      case 'error':
        return 'icofont-error';
      case 'admin':
        return 'icofont-gear';
      default:
        return 'icofont-bell-alt';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h5><i className="icofont-bell-alt mr-2"></i>Notifications</h5>
        <button className="clear-btn" onClick={clearNotifications}>Tout effacer</button>
      </div>
      <div className="notification-list">
        {notifications.map((notification, index) => (
          <div key={notification.id} className={`notification-item ${notification.type}`}>
            <div className="notification-icon">
              <i className={getNotificationIcon(notification.type)}></i>
            </div>
            <div className="notification-content">
              <h6 className="notification-title">{notification.title}</h6>
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
            <button className="close-btn" onClick={() => removeNotification(index)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;