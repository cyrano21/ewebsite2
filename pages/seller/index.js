
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Spinner, Container } from 'react-bootstrap';
import SellerLayout from '../../components/seller/SellerLayout';

export default function SellerIndex() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Redirect to dashboard when component mounts
    if (status === 'authenticated') {
      router.push('/seller/dashboard');
    } else if (status === 'unauthenticated') {
      router.push('/login?redirect=/seller/dashboard');
    }
  }, [status, router]);

  return (
    <SellerLayout title="Seller Portal">
      <Container className="py-5 text-center">
        <h2 className="mb-4">Seller Portal</h2>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Redirection en cours...</span>
        </Spinner>
        <p className="mt-3">Redirection vers le tableau de bord vendeur...</p>
      </Container>
    </SellerLayout>
  );
}
