import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import styles from './AdminNavbar.module.css';

const SellerNotificationItem = ({ seller }) => {
  // Formatage de la date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
      return "Date inconnue";
    }
  };

  // Détermine le statut et l'icône correspondante
  const getStatusInfo = (status) => {
    switch(status) {
      case 'pending':
        return {
          icon: 'icofont-clock-time',
          class: 'text-warning',
          text: 'En attente'
        };
      case 'approved':
        return {
          icon: 'icofont-check-circled',
          class: 'text-success',
          text: 'Approuvé'
        };
      case 'rejected':
        return {
          icon: 'icofont-close-circled',
          class: 'text-danger',
          text: 'Rejeté'
        };
      case 'suspended':
        return {
          icon: 'icofont-ban',
          class: 'text-secondary',
          text: 'Suspendu'
        };
      default:
        return {
          icon: 'icofont-info-circle',
          class: 'text-info',
          text: 'Inconnu'
        };
    }
  };

  const statusInfo = getStatusInfo(seller.status);

  return (
    <Dropdown.Item 
      as={Link} 
      href={`/admin/sellers/${seller._id}`}
      className={styles.notificationItem}
    >
      <div className="d-flex align-items-start">
        <div className={`${styles.notificationIcon} bg-light ${statusInfo.class} me-3`}>
          <i className={statusInfo.icon} />
        </div>
        <div className="flex-grow-1">
          <p className="mb-0 small fw-bold">
            {seller.businessName || seller.name}
          </p>
          <p className="mb-0 small text-muted">
            <span className={`badge ${statusInfo.class.replace('text-', 'bg-')} bg-opacity-10 me-1`}>
              {statusInfo.text}
            </span>
            <span title={new Date(seller.createdAt).toLocaleString()}>
              {formatDate(seller.createdAt)}
            </span>
          </p>
        </div>
      </div>
    </Dropdown.Item>
  );
};

export default SellerNotificationItem;