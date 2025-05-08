import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminDashboard from '../../components/admin/Dashboard';
import { useRouter } from 'next/router';

const AdminPage = () => {
  const router = useRouter();
  
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminPage;
