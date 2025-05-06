import React from "react";
import { Button } from "react-bootstrap";

interface QuantityButtonsProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
}

const QuantityButtons: React.FC<QuantityButtonsProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  size = "md",
  variant = "primary",
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "primary":
        return "btn-outline-primary";
      case "secondary":
        return "btn-outline-secondary";
      case "outline":
        return "btn-outline-gray-400";
      default:
        return "btn-outline-primary";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return {
          button: "quantity-btn-sm",
          container: "quantity-sm",
        };
      case "lg":
        return {
          button: "quantity-btn-lg",
          container: "quantity-lg",
        };
      default:
        return {
          button: "",
          container: "",
        };
    }
  };

  const sizeClasses = getSizeClass();
  const variantClass = getVariantClass();

  return (
    <div
      className={`quantity-control d-flex align-items-center ${sizeClasses.container}`}
    >
      <Button
        variant=""
        className={`${variantClass} rounded-start ${sizeClasses.button}`}
        onClick={onDecrease}
        disabled={quantity <= 1}
      >
        <i className="icofont-minus"></i>
      </Button>
      <div className={`quantity-input px-2 ${variantClass}`}>
        <span className="fw-medium">{quantity}</span>
      </div>
      <Button
        variant=""
        className={`${variantClass} rounded-end ${sizeClasses.button}`}
        onClick={onIncrease}
      >
        <i className="icofont-plus"></i>
      </Button>
    </div>
  );
};

export default QuantityButtons;
