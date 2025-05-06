import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdvertisementManagement from '../../components/admin/AdvertisementManagement';
import { getSession } from 'next-auth/react';

const AdvertisementsPage = () => {
  return (
    <AdminLayout>
      <AdvertisementManagement />
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/admin/advertisements',
        permanent: false,
      },
    };
  }
  
  // Vérifier si l'utilisateur est un administrateur
  if (session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  
  return {
    props: { session },
  };
}

export default AdvertisementsPage;
