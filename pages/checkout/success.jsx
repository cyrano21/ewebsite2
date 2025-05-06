import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const CheckoutSuccess = () => {
  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    // Vous pourriez ajouter ici une logique pour vérifier le statut de la commande
    // ou pour réinitialiser le panier après une commande réussie
  }, []);

  return (
    <div className="checkout-success container my-5 py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow">
            <div className="card-body text-center p-5">
              <div className="success-icon mb-4">
                <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <h1 className="mb-4">Commande confirmée !</h1>
              <p className="lead mb-4">
                Merci pour votre achat. Votre commande a été traitée avec succès.
              </p>
              {orderId && (
                <p className="mb-4">
                  Numéro de commande: <strong>{orderId}</strong>
                </p>
              )}
              <p>
                Un email de confirmation vous a été envoyé avec les détails de votre commande.
              </p>
              <div className="mt-5">
                <Link href="/account/orders" className="btn btn-primary me-3">
                  Voir mes commandes
                </Link>
                <Link href="/shop" className="btn btn-outline-secondary">
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;