import React, { useEffect, useState, useContext } from "react";
import PageHeader from "../../components/PageHeader";
import Link from "next/link";
import delImgUrl from "../../assets/images/shop/del.png";
import CheckoutPage from "./CheckoutPage";
import { AuthContext } from "../../../contexts/AuthProvider";
import { useNotifications } from "../../../contexts/NotificationContext";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  // Obtenir les informations d'authentification de l'utilsateur
  const { user } = useContext(AuthContext);
  // utilser le contexte de notification
  const { addNotification } = useNotifications();
  
  // Pour simuler un rôle administrateur, normalement cela viendrait d'une vérification de rôle côté serveur
  const isAdmin = user && (user.email === "admin@example.com" || user.uid === "ADMIN_UID");

  useEffect(() => {
    // Fetch cart items from local storage
    const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCartItems);
  }, []);

  // Calculate the total price for each item in the cart
  const calculateTotalPrice = (item) => {
    return item.price * item.quantity;
  };

  // Handle quantity increase
  const handleIncrease = (item) => {
    item.quantity += 1;
    setCartItems([...cartItems]);
    // Update local storage with the new cart items
    localStorage.setItem("cart", JSON.stringify(cartItems));
    
    // Envoyer une notification pour l'augmentation de quantité
    addNotification({
      title: "Quantité mise à jour",
      message: `Quantité de ${item.name} augmentée à ${item.quantity}`,
      type: "info",
    });
    
    // Si c'est un administrateur, envoyer une notification spéciale
    if (isAdmin) {
      addNotification({
        title: "Action administrateur",
        message: `Modification du panier: ${item.name} (${item.quantity})`,
        type: "admin",
      });
    }
  };

  // Handle quantity decrease
  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      item.quantity -= 1;
      setCartItems([...cartItems]);

      // Update local storage with the new cart items
      localStorage.setItem("cart", JSON.stringify(cartItems));
      
      // Envoyer une notification pour la diminution de quantité
      addNotification({
        title: "Quantité mise à jour",
        message: `Quantité de ${item.name} réduite à ${item.quantity}`,
        type: "info",
      });
      
      // Si c'est un administrateur, envoyer une notification spéciale
      if (isAdmin) {
        addNotification({
          title: "Action administrateur",
          message: `Modification du panier: ${item.name} (${item.quantity})`,
          type: "admin",
        });
      }
    }
  };

  // Handle item removal
  const handleRemoveItem = (item) => {
    // Filter out the item to be removed
    const updatedCart = cartItems.filter((cartItem) => cartItem.id !== item.id);
    // Update the state with the new cart
    setCartItems(updatedCart);
    // Update local storage with the updated cart
    updateLocalStorage(updatedCart);
    
    // Envoyer une notification pour le retrait d'un produit
    addNotification({
      title: "Produit retiré",
      message: `${item.name} a été retiré de votre panier`,
      type: "warning",
    });
  };

  // Update local storage with the cart items
  const updateLocalStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // Calculate the cart subtotal
  const cartSubtotal = cartItems.reduce((total, item) => {
    return total + calculateTotalPrice(item);
  }, 0);

  // Calculate the order total
  const orderTotal = cartSubtotal;

  // Fonction pour ajouter un produit (pour les tests)
  const handleAddTestProduct = () => {
    const testProduct = {
      id: Date.now(),
      name: "Produit test",
      price: 19.99,
      quantity: 1,
      img: "/src/assets/images/products/01.jpg"
    };
    
    const newCartItems = [...cartItems, testProduct];
    setCartItems(newCartItems);
    updateLocalStorage(newCartItems);
    
    // Envoyer une notification pour l'ajout d'un produit
    addNotification({
      title: "Produit ajouté",
      message: `${testProduct.name} a été ajouté à votre panier`,
      type: "success",
    });
  };

  return (
    <div>
      <PageHeader title={"Panier"} curPage={"Panier"} />
      <div className="shop-cart padding-tb">
        <div className="container">
          <div className="section-wrapper">
            {/* cart top */}
            <div className="cart-top">
              <table>
                <thead>
                  <tr>
                    <th className="cat-product">Produit</th>
                    <th className="cat-price">Prix</th>
                    <th className="cat-quantity">Quantité</th>
                    <th className="cat-toprice">Total</th>
                    <th className="cat-edit">Modifier</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, indx) => (
                    <tr key={indx}>
                      <td className="product-item cat-product">
                        <div className="p-thumb">
                          <Link href="/shop-single" legacyBehavior>
                            <img src={`${item.img}`} alt="" />
                          </Link>
                        </div>
                        <div className="p-content">
                          <Link href="/shop-single" legacyBehavior>{item.name}</Link>
                        </div>
                      </td>
                      <td className="cat-price">${item.price}</td>
                      <td className="cat-quantity">
                        <div className="cart-plus-minus">
                          <div
                            className="dec qtybutton"
                            onClick={() => handleDecrease(item)}
                          >
                            -
                          </div>
                          <input
                            className="cart-plus-minus-box"
                            type="text"
                            name="qtybutton"
                            value={item.quantity}
                          />
                          <div
                            className="inc qtybutton"
                            onClick={() => handleIncrease(item)}
                          >
                            +
                          </div>
                        </div>
                      </td>
                      <td className="cat-toprice">
                        ${calculateTotalPrice(item)}
                      </td>
                      <td className="cat-edit">
                        <a href="#" onClick={() => handleRemoveItem(item)}>
                          <img src={delImgUrl} alt="" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cart actions - incluant le bouton de test */}
            <div className="cart-actions d-flex justify-content-between my-4">
              {cartItems.length === 0 ? (
                <div className="empty-cart-message">
                  <p>Votre panier est vide.</p>
                </div>
              ) : null}
              
              {/* Bouton pour tester l'ajout de produit (pour démonstration uniquement) */}
              <button 
                onClick={handleAddTestProduct} 
                className="lab-btn bg-success"
              >
                <i className="icofont-plus mr-2"></i> Ajouter un produit test
              </button>
            </div>

            {/* cart bottom */}
            <div className="cart-bottom">
              {/* checkout box */}
              <div className="cart-checkout-box">
                <form className="coupon" action="/">
                  <input
                    type="text"
                    name="coupon"
                    placeholder="Code coupon..."
                    className="cart-page-input-text"
                  />
                  <input type="submit" value="Appliquer le coupon" />
                </form>
                <form className="cart-checkout" action="/">
                  <input type="submit" value="Mettre à jour le panier" />
                  {/* <Link href="/check-out"><input type="submit" value="Proceed to Checkout" /></Link> */}
                  <div>
                    <CheckoutPage />
                  </div>
                </form>
              </div>

              {/* shopping box */}
              <div className="shiping-box">
                <div className="row">
                  {/* shipping  */}
                  <div className="col-md-6 col-12">
                    <div className="calculate-shiping">
                      <h3>Calculer la livraison</h3>
                      <div className="outline-select">
                        <select>
                          <option value="volvo">France</option>
                          <option value="saab">Belgique</option>
                          <option value="saab">Suisse</option>
                          <option value="saab">Canada</option>
                          <option value="saab">Luxembourg</option>
                        </select>
                        <span className="select-icon">
                          <i className="icofont-rounded-down"></i>
                        </span>
                      </div>
                      <div className="outline-select shipping-select">
                        <select>
                          <option value="volvo">Département/Région</option>
                          <option value="saab">Paris</option>
                          <option value="saab">Lyon</option>
                          <option value="saab">Marseille</option>
                          <option value="saab">Toulouse</option>
                        </select>
                        <span className="select-icon">
                          <i className="icofont-rounded-down"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        name="coupon"
                        placeholder="Code postal"
                        className="cart-page-input-text"
                      />
                      <button type="submit">Mettre à jour le total</button>
                    </div>
                  </div>

                  {/* cart total */}
                  <div className="col-md-6 col-12">
                    <div className="cart-overview">
                      <h3>Total du panier</h3>
                      <ul className="lab-ul">
                        <li>
                          <span className="pull-left">Sous-total du panier</span>
                          <p className="pull-right">$ {cartSubtotal}</p>
                        </li>
                        <li>
                          <span className="pull-left">
                            Frais de livraison
                          </span>
                          <p className="pull-right">Livraison gratuite</p>
                        </li>
                        <li>
                          <span className="pull-left">Total de la commande</span>
                          <p className="pull-right">
                            $ {orderTotal.toFixed(2)}
                          </p>
                        </li>
                      </ul>
                      
                      {/* Lien vers l'administration visible uniquement pour les administrateurs */}
                      {isAdmin && (
                        <div className="admin-link mt-4">
                          <Link
                            href="/admin/orders"
                            className="lab-btn bg-primary"
                            style={{ width: '100%', textAlign: 'center' }}
                            legacyBehavior>
                            <i className="icofont-dashboard-web mr-2"></i> Gérer les commandes
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
