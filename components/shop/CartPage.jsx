import React, { useState, useEffect, useContext } from "react";
import PageHeader from "../PageHeader";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "../../contexts/AuthProvider";
import { useNotifications } from "../../contexts/NotificationContext";
import axios from "axios";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ cartItemsLength: 0, localStorageCheck: false }); // Pour le débogage
  
  // Obtenir les informations d'authentification de l'utilsateur
  const { user } = useContext(AuthContext);
  // utilser le contexte de notification
  const { addNotification } = useNotifications();
  
  // Pour simuler un rôle administrateur, normalement cela viendrait d'une vérification de rôle côté serveur
  const isAdmin = user && (user.email === "admin@example.com" || user.id === "ADMIN_ID");

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        // Vérifier d'abord le localStorage
        const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
        
        // Mettre à jour les informations de débogage
        setDebugInfo({
          cartItemsLength: storedCartItems.length,
          localStorageCheck: true,
          localStorageContent: JSON.stringify(storedCartItems)
        });
        
        if (user) {
          // Si l'utilsateur est connecté, essayer de récupérer son panier depuis l'API
          try {
            const response = await axios.get(`/api/users/${user.id}/cart`);
            if (response.data && response.data.items && response.data.items.length > 0) {
              setCartItems(response.data.items);
            } else {
              // Si l'API ne renvoie pas de panier, utilser le localStorage comme fallback
              setCartItems(storedCartItems);
            }
          } catch (apiError) {
            console.error("Erreur lors du chargement du panier depuis l'API:", apiError);
            // En cas d'erreur API, utiliser le localStorage comme fallback
            setCartItems(storedCartItems);
          }
        } else {
          // Pour les utilsateurs non connectés, utilser uniquement le localStorage
          setCartItems(storedCartItems);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
        addNotification({
          title: "Erreur",
          message: "Impossible de charger votre panier. Veuillez rafraîchir la page.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
    
    // Ajouter un écouteur pour détecter les changements dans localStorage
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        try {
          const newCartItems = JSON.parse(e.newValue) || [];
          setCartItems(newCartItems);
          setDebugInfo(prev => ({
            ...prev,
            cartItemsLength: newCartItems.length,
            storageEventTriggered: true
          }));
        } catch (error) {
          console.error("Erreur lors de la mise à jour du panier:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, addNotification]);

  // Calculate the total price for each item in the cart
  const calculateTotalPrice = (item) => {
    return item.price * item.quantity;
  };

  // Handle quantity increase
  const handleIncrease = async (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    const updatedCartItems = cartItems.map(cartItem => 
      cartItem.id === item.id ? updatedItem : cartItem
    );
    
    setCartItems(updatedCartItems);
    
    // Update local storage
    updateLocalStorage(updatedCartItems);
    
    // Update server if user is logged in
    if (user) {
      try {
        await axios.put(`/api/users/${user.id}/cart`, { 
          items: updatedCartItems 
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du panier sur le serveur:", error);
        addNotification({
          title: "Erreur",
          message: "Impossible de synchroniser votre panier avec le serveur.",
          type: "error",
        });
      }
    }
    
    // Envoyer une notification pour l'augmentation de quantité
    addNotification({
      title: "Quantité mise à jour",
      message: `Quantité de ${item.name} augmentée à ${updatedItem.quantity}`,
      type: "info",
    });
    
    // Si c'est un administrateur, envoyer une notification spéciale
    if (isAdmin) {
      addNotification({
        title: "Action administrateur",
        message: `Modification du panier: ${item.name} (${updatedItem.quantity})`,
        type: "admin",
      });
    }
  };

  // Handle quantity decrease
  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      const updatedCartItems = cartItems.map(cartItem => 
        cartItem.id === item.id ? updatedItem : cartItem
      );
      
      setCartItems(updatedCartItems);
      
      // Update local storage
      updateLocalStorage(updatedCartItems);
      
      // Update server if user is logged in
      if (user) {
        try {
          await axios.put(`/api/users/${user.id}/cart`, { 
            items: updatedCartItems 
          });
        } catch (error) {
          console.error("Erreur lors de la mise à jour du panier sur le serveur:", error);
          addNotification({
            title: "Erreur",
            message: "Impossible de synchroniser votre panier avec le serveur.",
            type: "error",
          });
        }
      }
      
      // Envoyer une notification pour la diminution de quantité
      addNotification({
        title: "Quantité mise à jour",
        message: `Quantité de ${item.name} réduite à ${updatedItem.quantity}`,
        type: "info",
      });
      
      // Si c'est un administrateur, envoyer une notification spéciale
      if (isAdmin) {
        addNotification({
          title: "Action administrateur",
          message: `Modification du panier: ${item.name} (${updatedItem.quantity})`,
          type: "admin",
        });
      }
    }
  };

  // Handle item removal
  const handleRemoveItem = async (item) => {
    // Filter out the item to be removed
    const updatedCart = cartItems.filter((cartItem) => cartItem.id !== item.id);
    
    // Update the state with the new cart
    setCartItems(updatedCart);
    
    // Update local storage with the updated cart
    updateLocalStorage(updatedCart);
    
    // Update server if user is logged in
    if (user) {
      try {
        await axios.put(`/api/users/${user.id}/cart`, { 
          items: updatedCart 
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du panier sur le serveur:", error);
        addNotification({
          title: "Erreur",
          message: "Impossible de synchroniser votre panier avec le serveur.",
          type: "error",
        });
      }
    }
    
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
  const handleAddTestProduct = async () => {
    try {
      // Récupérer un produit de test depuis l'API
      const response = await axios.get('/api/products?limit=1');
      let testProduct;
      
      if (response.data && response.data.length > 0) {
        // utilser un produit de la base de données
        const product = response.data[0];
        testProduct = {
          id: product._id || Date.now(),
          name: product.name || "Produit test",
          price: product.price || 19.99,
          quantity: 1,
          img: product.image || "/assets/images/placeholder.jpg" // Chemin corrigé
        };
      } else {
        // Fallback si l'API ne retourne pas de produit
        testProduct = {
          id: Date.now(),
          name: "Produit test",
          price: 19.99,
          quantity: 1,
          img: "/assets/images/placeholder.jpg" // Chemin corrigé
        };
      }
      
      const newCartItems = [...cartItems, testProduct];
      setCartItems(newCartItems);
      updateLocalStorage(newCartItems);
      
      // Mise à jour du panier sur le serveur si l'utilsateur est connecté
      if (user) {
        await axios.put(`/api/users/${user.id}/cart`, { 
          items: newCartItems 
        });
      }
      
      // Envoyer une notification pour l'ajout d'un produit
      addNotification({
        title: "Produit ajouté",
        message: `${testProduct.name} a été ajouté à votre panier`,
        type: "success",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit test:", error);
      addNotification({
        title: "Erreur",
        message: "Impossible d'ajouter le produit test.",
        type: "error",
      });
      
      // Ajouter un produit test local en cas d'échec de l'API
      const testProduct = {
        id: Date.now(),
        name: "Produit test (local)",
        price: 19.99,
        quantity: 1,
        img: "/assets/images/placeholder.jpg" // Chemin corrigé
      };
      
      const newCartItems = [...cartItems, testProduct];
      setCartItems(newCartItems);
      updateLocalStorage(newCartItems);
    }
  };

  // Fonction pour effectuer le checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      addNotification({
        title: "Panier vide",
        message: "Votre panier est vide. Ajoutez des produits avant de procéder au paiement.",
        type: "warning",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Créer une commande via l'API
      const response = await axios.post('/api/orders', {
        user: user ? user.id : null,
        items: cartItems,
        total: orderTotal,
        status: 'pending',
        shippingAddress: null, // À compléter pendant le checkout
        paymentMethod: null    // À compléter pendant le checkout
      });
      
      if (response.data && response.data._id) {
        // Utiliser le router de Next.js pour la redirection avec l'ID de commande
        const router = require('next/router').default;
        router.push(`/checkout?orderId=${response.data._id}`);
      } else {
        throw new Error('La création de commande a échoué');
      }
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      addNotification({
        title: "Erreur",
        message: "Impossible de créer votre commande. Veuillez réessayer.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour afficher l'image du produit avec fallback
  const renderProductImage = (item) => {
    // Créer un placeholder inline pour éviter de dépendre d'une image externe
    const defaultPlaceholderSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EProduit%3C/text%3E%3C/svg%3E";
    
    if (!item || !item.img) {
      return <img src={defaultPlaceholderSrc} alt="Produit sans image" style={{ maxWidth: '100%', height: 'auto' }} />;
    }
    
    try {
      return <img 
        src={item.img} 
        alt={item.name || "Produit"} 
        style={{ maxWidth: '100%', height: 'auto' }}
        onError={(e) => {
          // Si l'image ne peut pas être chargée, utiliser l'image placeholder inline
          e.target.onerror = null;
          e.target.src = defaultPlaceholderSrc;
        }} 
      />;
    } catch (error) {
      return <img src={defaultPlaceholderSrc} alt="Erreur d'image" style={{ maxWidth: '100%', height: 'auto' }} />;
    }
  };

  return (
    <div>
      <PageHeader title={"Panier"} curPage={"Panier"} />
      <div className="shop-cart padding-tb">
        <div className="container">
          <div className="section-wrapper">
            {/* Informations de débogage pour les développeurs */}
            {isAdmin && (
              <div className="alert alert-info mb-3">
                <h5>Informations de débogage (Admin uniquement)</h5>
                <p>Nombre d'articles dans le panier: {debugInfo.cartItemsLength}</p>
                <p>Vérification du localStorage: {debugInfo.localStorageCheck ? 'Oui' : 'Non'}</p>
                {debugInfo.localStorageContent && (
                  <details>
                    <summary>Contenu du localStorage</summary>
                    <pre style={{maxHeight: '100px', overflow: 'auto'}}>{debugInfo.localStorageContent}</pre>
                  </details>
                )}
              </div>
            )}
            
            {/* cart top */}
            <div className="cart-top">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                  <p className="mt-2">Chargement de votre panier...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <i className="icofont-shopping-cart" style={{ fontSize: '4rem', color: '#ddd' }}></i>
                  <h3 className="mt-3">Votre panier est vide</h3>
                  <p className="mb-4">Vous n&apos;avez pas encore ajouté de produits à votre panier.</p>
                  <Link href="/shop" className="lab-btn">
                    <span>Continuer mes achats</span>
                  </Link>
                </div>
              ) : (
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
                            <Link href={`/Shop/${item.id}`}>
                              {renderProductImage(item)}
                            </Link>
                          </div>
                          <div className="p-content">
                            <Link href={`/Shop/${item.id}`}>{item.name || 'Produit sans nom'}</Link>
                          </div>
                        </td>
                        <td className="cat-price">${(item.price || 0).toFixed(2)}</td>
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
                              value={item.quantity || 1}
                              readOnly
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
                          ${calculateTotalPrice(item).toFixed(2)}
                        </td>
                        <td className="cat-edit">
                          <button
                            className="bg-transparent border-0 text-danger"
                            onClick={() => handleRemoveItem(item)}
                            aria-label="Supprimer l'article"
                          >
                            <i className="icofont-ui-delete display-6"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Cart actions - incluant le bouton de test */}
            <div className="cart-actions d-flex justify-content-between my-4">
              {/* Bouton pour tester l'ajout de produit (pour démonstration uniquement) */}
              <button 
                onClick={handleAddTestProduct} 
                className="lab-btn bg-success"
                disabled={loading}
              >
                <i className="icofont-plus mr-2"></i> Ajouter un produit test
              </button>
              
              {/* Bouton pour vider le localStorage (pour résoudre les problèmes potentiels) */}
              <button 
                onClick={() => {
                  localStorage.removeItem("cart");
                  setCartItems([]);
                  addNotification({
                    title: "Panier réinitialisé",
                    message: "Votre panier a été vidé avec succès.",
                    type: "info",
                  });
                }} 
                className="lab-btn bg-danger"
                disabled={loading}
              >
                <i className="icofont-trash mr-2"></i> Réinitialiser le panier
              </button>
            </div>

            {/* cart bottom */}
            {cartItems.length > 0 && (
              <div className="cart-bottom">
                {/* checkout box */}
                <div className="cart-checkout-box">
                  <form className="coupon" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      name="coupon"
                      placeholder="Code coupon..."
                      className="cart-page-input-text"
                    />
                    <input type="submit" value="Appliquer le coupon" />
                  </form>
                  <div className="cart-checkout">
                    <input 
                      type="button" 
                      value="Mettre à jour le panier" 
                      onClick={() => {
                        addNotification({
                          title: "Panier mis à jour",
                          message: "Votre panier a été mis à jour avec succès.",
                          type: "success",
                        });
                      }}
                      disabled={loading}
                    />
                    <input 
                      type="button" 
                      value="Procéder au paiement" 
                      onClick={handleCheckout}
                      disabled={loading || cartItems.length === 0}
                    />
                  </div>
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
                            <p className="pull-right">$ {cartSubtotal.toFixed(2)}</p>
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
                            <Link href="/admin/orders" className="lab-btn bg-primary" style={{ width: '100%', textAlign: 'center' }}>
                              <i className="icofont-dashboard-web mr-2"></i> Gérer les commandes
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
