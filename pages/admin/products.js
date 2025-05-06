import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductManagement from '../../components/admin/ProductManagement';

export default function ProductsPage() {
  return (
    <AdminLayout>
      <ProductManagement />
    </AdminLayout>
  );
}
