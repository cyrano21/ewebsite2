import React, { useState, useMemo } from "react";
import { Card, Form, Button, InputGroup, Badge } from "react-bootstrap";
import Link from "next/link";
import { useWishlist } from "../../contexts/WishlistContext";

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
  loading: boolean;
  cartItems?: any[]; // Articles du panier pour pouvoir les ajouter aux favoris
  onAddToWishlist?: (items: any[]) => void; // Fonction pour ajouter aux favoris
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  onCheckout,
  loading,
  cartItems = [],
  onAddToWishlist,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Utiliser directement le contexte pour vérifier les produits
  const { wishlistItems, isInWishlist } = useWishlist();

  // Vérifier si tous les articles du panier sont déjà dans la liste de souhaits
  const allItemsInWishlist = useMemo(() => {
    if (!cartItems.length) return false;
    return cartItems.every((item) => isInWishlist(item.id));
  }, [cartItems, isInWishlist]);

  // Gestion du code promo
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    // Simulation d'application d'un code promo
    setTimeout(() => {
      setCouponLoading(false);
      // Ici vous pourriez ajouter la logique pour appliquer réellement un code promo
      // et mettre à jour le total
    }, 800);
  };

  // Gestion de l'ajout aux favoris
  const handleAddToWishlist = () => {
    if (!onAddToWishlist || cartItems.length === 0) return;

    setWishlistLoading(true);
    setTimeout(() => {
      setWishlistLoading(false);
      onAddToWishlist(cartItems);
    }, 800);
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0">Résumé de la commande</h5>
        <Link href="/shop" className="small text-decoration-none">
          Continuer mes achats
        </Link>
      </Card.Header>

      <Card.Body className="p-0">
        {/* Section code promo */}
        <div className="p-4 border-bottom">
          <Form onSubmit={handleApplyCoupon}>
            <h6 className="mb-3">Code promo</h6>
            <InputGroup>
              <Form.Control
                placeholder="Entrez votre code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponLoading}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={couponLoading || !couponCode.trim()}
              >
                {couponLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Appliquer"
                )}
              </Button>
            </InputGroup>
          </Form>
        </div>

        {/* Détail des prix */}
        <div className="p-4">
          <div className="d-flex justify-content-between mb-3">
            <span>Sous-total</span>
            <span className="fw-semibold">{subtotal.toFixed(2)}€</span>
          </div>

          <div className="d-flex justify-content-between mb-2">
            <span>Livraison</span>
            <Badge bg="success" className="fw-normal">
              Gratuite
            </Badge>
          </div>

          {/* Si un coupon est appliqué, on pourrait ajouter une ligne ici */}

          <hr className="my-3" />

          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="h5 mb-0">Total</span>
            <span className="h5 mb-0 text-primary">{subtotal.toFixed(2)}€</span>
          </div>
          <div className="text-end mb-3">
            <small className="text-muted">TVA incluse</small>
          </div>

          <Button
            variant="primary"
            className="w-100 mb-3 py-2 fw-semibold"
            onClick={onCheckout}
            disabled={loading || subtotal <= 0}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Traitement...
              </>
            ) : (
              <>
                Procéder au paiement
                <i className="icofont-arrow-right ms-2"></i>
              </>
            )}
          </Button>

          <Button
            variant="outline-secondary"
            className="w-100 mb-3 py-2 fw-semibold"
            onClick={handleAddToWishlist}
            disabled={
              wishlistLoading || cartItems.length === 0 || allItemsInWishlist
            }
          >
            {wishlistLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Ajout...
              </>
            ) : allItemsInWishlist ? (
              <>
                Déjà dans vos favoris
                <i className="icofont-check-circled ms-2 text-success"></i>
              </>
            ) : (
              <>
                Ajouter aux favoris
                <i className="icofont-heart ms-2"></i>
              </>
            )}
          </Button>

          <div className="payment-methods text-center mb-2">
            <div className="d-flex justify-content-center gap-2 mb-1">
              <i className="icofont-visa-alt fs-3 text-primary opacity-75"></i>
              <i className="icofont-mastercard fs-3 text-danger opacity-75"></i>
              <i className="icofont-paypal-alt fs-3 text-primary opacity-75"></i>
            </div>
            <small className="text-muted">Paiement 100% sécurisé</small>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartSummary;
