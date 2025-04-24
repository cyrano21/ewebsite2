import React from 'react';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
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
