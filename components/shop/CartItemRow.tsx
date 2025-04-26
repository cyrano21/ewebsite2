/* stylelint-disable */
/* webhint-disable no-inline-styles */
import React, { useMemo } from 'react';
import { Button, Badge } from "react-bootstrap";
import Link from "next/link";
import QuantityButtons from "./QuantityButtons";

interface CartItemProps {
  item: any;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItemRow: React.FC<CartItemProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const totalPrice = useMemo(() => {
    return (item.price * item.quantity).toFixed(2);
  }, [item.price, item.quantity]);

  return (
    <tr className="align-middle">
      <td className="ps-4">
        <div className="d-flex align-items-center">
          <div className="product-image me-3">
            {item.img ? (
              <Link href={`/shop/${item.id}`}>
                <img
                  src={item.img}
                  alt={item.name}
                  className="img-fluid rounded border"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              </Link>
            ) : (
              <div
                className="product-img-placeholder d-flex align-items-center justify-content-center bg-light rounded border"
                style={{ width: "80px", height: "80px" }}
              >
                <i className="icofont-box text-muted fs-2"></i>
              </div>
            )}
          </div>
          <div>
            <Link
              href={`/shop/${item.id}`}
              className="product-name fw-semibold text-decoration-none"
            >
              {item.name || "Produit sans nom"}
            </Link>
            {/* Affichage de la catégorie du produit */}
            {item.category && (
              <div className="product-category small mt-1">
                <Badge bg="light" text="dark" className="me-2">
                  <i className="icofont-tags me-1"></i>
                  {item.category}
                </Badge>
              </div>
            )}
            {item.attributes && (
              <div className="product-attributes small text-muted mt-1">
                {Object.entries(item.attributes).map(([key, value]) => (
                  <span key={key} className="me-2">
                    {`${key}: ${value}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>
      <td>
        <span className="fw-semibold">{(item.price || 0).toFixed(2)}€</span>
      </td>
      <td>
        <QuantityButtons
          quantity={item.quantity}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          variant="secondary"
          size="sm"
        />
      </td>
      <td>
        <span className="fw-bold text-primary">{totalPrice}€</span>
      </td>
      <td className="text-end pe-4">
        <Button
          variant="link"
          className="text-danger p-0"
          onClick={onRemove}
          title="Supprimer l'article"
        >
          <i className="icofont-trash fs-5"></i>
        </Button>
      </td>
    </tr>
  );
};

export default CartItemRow;
