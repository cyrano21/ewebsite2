import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminDashboard from '../../components/admin/Dashboard';
import { useRouter } from 'next/router';

export default function AdminPage() {
  const router = useRouter();
  
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
