import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryManagement from '../../components/admin/CategoryManagement';

export default function CategoriesPage() {
  return (
    <AdminLayout>
      <CategoryManagement />
    </AdminLayout>
  );
}
