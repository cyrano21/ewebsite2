/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { AuthContext } from "../../contexts/AuthProvider";
import SocialShareButtons from "./SocialShareButtons";

const desc =
  "Energistia an deliver atactica metrcs after avsionary Apropria trnsition enterpris an sources applications emerging 	psd template.";

const ProductDisplay = ({ item }) => {
  const { id, img, price, name, quantity, seller } = item;
  const [prequantity, setQuantity] = useState(quantity);
  const [coupon, setCoupon] = useState("");
  const [size, setSize] = useState("Select Size");
  const [color, setColor] = useState("Select Color");

  // Obtenir les informations d'authentification de l'utilsateur
  const { user } = useContext(AuthContext);

  // Pour simuler un rôle administrateur, normalement cela viendrait d'une vérification de rôle côté serveur
  // Dans un environnement réel, vous vérifieriez si l'utilsateur a un rôle admin dans votre système d'authentification
  const isAdmin = user ? true : false; // Pour la démo, tout utilsateur connecté est considéré comme admin

  const handleDecrease = () => {
    if (prequantity > 1) {
      setQuantity(prequantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(prequantity + 1);
  };

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an object representing the product to be added to the cart
    const product = {
      id: id,
      img: img,
      name: name,
      price: price, 
      quantity: prequantity,
      size: size,
      color: color,
      coupon: coupon,
      // Ajouter la catégorie du produit
      category: item.category || "Catégorie non spécifiée"
    };

    // Retrieve existing cart items from local storage or initialize an empty array
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product with the same ID is already in the cart
    const existingProductIndex = existingCart.findIndex((item) => item.id === id);

    if (existingProductIndex !== -1) {
      // Product already in the cart; update quantity
      existingCart[existingProductIndex].quantity += prequantity;
    } else {
      // Product not in the cart; add it
      existingCart.push(product);
    }

    // Update the local storage with the updated cart items
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Reset form fields and quantity
    setQuantity(1);
    setSize("Select Size");
    setColor("Select Color");
    setCoupon("");

    // You can add further logic, such as displaying a confirmation message.
  };

  return (
    <div>
      <div>
        <h4>{name}</h4>
        <p className="rating">
          <i className="icofont-star"></i>
          <i className="icofont-star"></i>
          <i className="icofont-star"></i>
          <i className="icofont-star"></i>
          <i className="icofont-star"></i>
          (3 review)
        </p>
        <h4>${price}</h4>
        <h6>{seller}</h6>
        <p>{desc}</p>

        {/* Bouton d'administration visible uniquement pour les utilsateurs admin */}
        {isAdmin && (
          <Link
            href={`/admin/products?edit=${id}`}
            className="lab-btn bg-warning mb-3"
            legacyBehavior>
            <i className="icofont-ui-edit me-1"></i>
            <span>Gérer ce produit</span>
          </Link>
        )}
      </div>
      {/* Single Product Cart Component here */}
      <div>
      <form onSubmit={handleSubmit}>
      <div className="select-product size">
        <select value={size} onChange={handleSizeChange}>
          <option>Select Size</option>
          <option>SM</option>
          <option>MD</option>
          <option>LG</option>
          <option>XL</option>
          <option>XXL</option>
        </select>
        <i className="icofont-rounded-down"></i>
      </div>
      <div className="select-product color">
        <select value={color} onChange={handleColorChange}>
          <option>Select Color</option>
          <option>Pink</option>
          <option>Ash</option>
          <option>Red</option>
          <option>White</option>
          <option>Blue</option>
        </select>
        <i className="icofont-rounded-down"></i>
      </div>
      <div className="cart-plus-minus">
        <div onClick={handleDecrease} className="dec qtybutton">
          -
        </div>
        <input
          className="cart-plus-minus-box"
          type="text"
          name="qtybutton"
          value={prequantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        />
        <div className="inc qtybutton" onClick={handleIncrease}>
          +
        </div>
      </div>
      <div className="discount-code mb-2">
        <input
          type="text"
          placeholder="Enter Discount Code"
          onChange={(e) => setCoupon(e.target.value)}
        />
      </div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <button type="submit" className="lab-btn">
          <span>Add To Cart</span>
        </button>

        <Link href="/panier" className="lab-btn bg-primary">
          Check Out
        </Link>

        <button 
          type="button" 
          className="lab-btn bg-secondary"
          onClick={() => {
            // Récupérer les produits existants à comparer du localStorage
            const existingProductIds = JSON.parse(localStorage.getItem('comparisonProducts') || '[]');

            // Vérifier si le produit est déjà dans la liste
            if (!existingProductIds.includes(id)) {
              // Limiter à 4 produits maximum
              const updatedProductIds = [...existingProductIds, id].slice(-4);
              localStorage.setItem('comparisonProducts', JSON.stringify(updatedProductIds));
              alert('Produit ajouté à la comparaison');
            } else {
              alert('Ce produit est déjà dans votre liste de comparaison');
            }
          }}
        >
          <i className="icofont-exchange me-1"></i>
          <span>Comparer</span>
        </button>
      </div>
    </form>

    {/* Boutons de partage social */}
    <SocialShareButtons 
      url={typeof window !== 'undefined' ? window.location.href : ''}
      title={name}
      description={desc}
      image={img}
    />
      </div>
    </div>
  );
};

export default ProductDisplay;