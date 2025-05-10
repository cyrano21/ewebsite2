import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Badge, Button, ListGroup } from 'react-bootstrap';
import { BellFill } from 'react-bootstrap-icons';
import Link from 'next/link';
import styles from './NotificationBell.module.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return 'à l\'instant';
    } else if (diffInMinutes < 60) {
      return `il y a ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `il y a ${diffInHours} h`;
    } else if (diffInDays < 7) {
      return `il y a ${diffInDays} j`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Fonction pour récupérer les notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/notifications?limit=5');
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les notifications au chargement du composant
  useEffect(() => {
    fetchNotifications();

    // Mettre à jour les notifications toutes les minutes
    const intervalId = setInterval(fetchNotifications, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Fermer le dropdown lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ all: true }),
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
    }
  };

  // Marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [notificationId] }),
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  // Obtenir l'icône en fonction du type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'seller_request':
        return 'fas fa-store';
      case 'new_order':
        return 'fas fa-shopping-cart';
      case 'refund_request':
        return 'fas fa-undo';
      case 'product_review':
        return 'fas fa-comment';
      case 'system':
        return 'fas fa-cog';
      default:
        return 'fas fa-bell';
    }
  };

  return (
    <div className={styles.notificationBell} ref={dropdownRef}>
      <div className={styles.bellContainer} onClick={() => setShowDropdown(!showDropdown)}>
        <BellFill size={20} />
        {unreadCount > 0 && (
          <Badge bg="danger" pill className={styles.badge}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </div>
      {showDropdown && (
        <div className={styles.notificationDropdown}>
          <div className={styles.notificationHeader}>
            <h6 className="mb-0">Notifications</h6>
            {unreadCount > 0 && (
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 text-primary" 
                onClick={markAllAsRead}
              >
                Tout marquer comme lu
              </Button>
            )}
          </div>

          <ListGroup variant="flush" className={styles.notificationList}>
            {loading ? (
              <div className="text-center p-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-3 text-muted">
                Aucune notification
              </div>
            ) : (
              notifications.map((notification) => (
                <ListGroup.Item 
                  key={notification._id} 
                  action
                  className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification._id);
                    }
                  }}
                >
                  <Link
                    href={notification.actionUrl || '#'}
                    className={styles.notificationLink}
                    legacyBehavior>
                    <div className="d-flex align-items-center">
                      <div className={styles.notificationIcon}>
                        <i className={getNotificationIcon(notification.type)}></i>
                      </div>
                      <div className={styles.notificationContent}>
                        <div className={styles.notificationTitle}>
                          {notification.title}
                        </div>
                        <div className={styles.notificationMessage}>
                          {notification.message}
                        </div>
                        <div className={styles.notificationTime}>
                          {formatDate(notification.createdAt)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>

          {notifications.length > 0 && (
            <div className={styles.notificationFooter}>
              <Link href="/admin/notifications" className="text-center d-block text-primary">
                Voir toutes les notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;