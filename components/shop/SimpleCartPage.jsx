import React from "react";
import Link from "next/link";
import PageHeader from "../../components/PageHeader";

const SimpleCartPage = () => {
  return (
    <div>
      <PageHeader title="Panier" curPage="Panier" />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body text-center p-5">
                <h2>Votre panier</h2>
                <p className="lead my-4">
                  Cette page est une version simplifiée de la page panier pour tester la route.
                </p>
                <Link href="/" className="lab-btn" legacyBehavior>
                  <span>Retour à l'accueil</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCartPage;
