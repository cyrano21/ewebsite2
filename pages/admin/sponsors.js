// pages/admin/sponsors.js
import React from 'react';
// Utilisation d'un chemin relatif au lieu de l'alias @
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]"; // ✅ Chemin relatif corrigé
import AdminLayout from '../../components/admin/AdminLayout';
import SponsorBannerAdmin from '../../components/admin/SponsorBannerAdmin';

export default function SponsorsPage() {
  return (
    <AdminLayout>
      <div className="container py-4">
        <h1 className="mb-4">Gestion des sponsors</h1>
        <SponsorBannerAdmin />
      </div>
    </AdminLayout>
  );
}

// Protection de la page admin
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  if (!session || session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  return {
    props: { 
      session: {
        ...session,
        user: {
          ...session.user,
          image: session.user.image || null
        }
      }
    }
  };
}