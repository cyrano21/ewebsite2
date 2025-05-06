import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PromotionManagement from '../../components/admin/PromotionManagement';

export default function PromotionsPage() {
  return (
    <AdminLayout>
      <PromotionManagement />
    </AdminLayout>
  );
}
