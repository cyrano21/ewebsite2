
import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import Link from 'next/link';

const RecentOrdersTable = ({ orders = [] }) => {
  // Fonction pour déterminer la couleur du badge en fonction du statut
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'refunded':
        return 'secondary';
      default:
        return 'light';
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Message si aucune commande n'est disponible
  if (orders.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="icofont-box fs-1 text-muted"></i>
        <p className="mt-3 text-muted">Aucune commande récente à afficher</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead>
          <tr>
            <th>ID Commande</th>
            <th>Client</th>
            <th>Date</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <span className="fw-medium">#{order.orderNumber || order._id.substring(0, 8)}</span>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <div className="bg-light rounded-circle p-2 me-2">
                    <i className="icofont-user"></i>
                  </div>
                  <div>
                    <p className="mb-0 fw-medium">{order.customerName}</p>
                    <small className="text-muted">{order.customerEmail}</small>
                  </div>
                </div>
              </td>
              <td>{formatDate(order.createdAt)}</td>
              <td className="fw-medium">{order.totalAmount.toLocaleString()} €</td>
              <td>
                <Badge bg={getStatusBadge(order.status)}>
                  {order.status}
                </Badge>
              </td>
              <td>
                <Link href={`/seller/orders/${order._id}`} passHref legacyBehavior>
                  <Button variant="outline-primary" size="sm">
                    <i className="icofont-eye me-1"></i> Détails
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RecentOrdersTable;
