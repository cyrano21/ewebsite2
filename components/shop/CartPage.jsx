import React, { useState, useEffect, useContext, useMemo } from "react";
import PageHeader from "../PageHeader";
import Link from "next/link";
import { AuthContext } from "../../contexts/AuthProvider";
import { useNotifications } from "../../contexts/NotificationContext";
import { useWishlist } from "../../contexts/WishlistContext";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import CartItemRow from "./CartItemRow";
import CartSummary from "./CartSummary";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    cartItemsLength: 0,
    localStorageCheck: false,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Obtenir les informations d'authentification de l'utilisateur
  const { user } = useContext(AuthContext);
  // Utiliser le contexte de notification
  const { addNotification } = useNotifications();
  // Utiliser le contexte de liste de souhaits
  const { addMultipleToWishlist } = useWishlist();

  // Pour simuler un rôle administrateur
  const isAdmin =
    user && (user.email === "admin@example.com" || user.uid === "ADMIN_ID");

  // Calcul du sous-total avec mémoïsation
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }, [cartItems]);

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
          localStorageContent: JSON.stringify(storedCartItems),
        });

        if (user) {
          // Si l'utilisateur est connecté, essayer de récupérer son panier depuis l'API
          try {
            const response = await axios.get(`/api/users/${user.uid}/cart`);
            if (
              response.data &&
              response.data.items &&
              response.data.items.length > 0
            ) {
              setCartItems(response.data.items);
            } else {
              // Si l'API ne renvoie pas de panier, utiliser le localStorage comme fallback
              setCartItems(storedCartItems);
            }
          } catch (apiError) {
            console.error(
              "Erreur lors du chargement du panier depuis l'API:",
              apiError
            );
            // En cas d'erreur API, utiliser le localStorage comme fallback
            setCartItems(storedCartItems);
          }
        } else {
          // Pour les utilisateurs non connectés, utiliser uniquement le localStorage
          setCartItems(storedCartItems);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
        addNotification({
          title: "Erreur",
          message:
            "Impossible de charger votre panier. Veuillez rafraîchir la page.",
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
          setDebugInfo((prev) => ({
            ...prev,
            cartItemsLength: newCartItems.length,
            storageEventTriggered: true,
          }));
        } catch (error) {
          console.error("Erreur lors de la mise à jour du panier:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user, addNotification]);

  // Handle quantity increase
  const handleIncrease = async (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    const updatedCartItems = cartItems.map((cartItem) =>
      cartItem.id === item.id ? updatedItem : cartItem
    );

    setCartItems(updatedCartItems);

    // Update local storage
    updateLocalStorage(updatedCartItems);

    // Update server if user is logged in
    if (user) {
      try {
        await axios.put(`/api/users/${user.uid}/cart`, {
          items: updatedCartItems,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du panier sur le serveur:",
          error
        );
        addNotification({
          title: "Erreur",
          message: "Impossible de synchroniser votre panier avec le serveur.",
          type: "error",
        });
      }
    }
  };

  // Handle quantity decrease
  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.id ? updatedItem : cartItem
      );

      setCartItems(updatedCartItems);

      // Update local storage
      updateLocalStorage(updatedCartItems);

      // Update server if user is logged in
      if (user) {
        try {
          await axios.put(`/api/users/${user.uid}/cart`, {
            items: updatedCartItems,
          });
        } catch (error) {
          console.error(
            "Erreur lors de la mise à jour du panier sur le serveur:",
            error
          );
          addNotification({
            title: "Erreur",
            message: "Impossible de synchroniser votre panier avec le serveur.",
            type: "error",
          });
        }
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
        await axios.put(`/api/users/${user.uid}/cart`, {
          items: updatedCart,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du panier sur le serveur:",
          error
        );
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

  // Fonction pour ajouter un produit test (pour les administrateurs)
  const handleAddTestProduct = async () => {
    try {
      // Récupérer un produit de test depuis l'API
      const response = await axios.get("/api/products?limit=1");
      let testProduct;

      if (response.data && response.data.length > 0) {
        // Utiliser un produit de la base de données
        const product = response.data[0];
        testProduct = {
          id: product._id || Date.now(),
          name: product.name || "Produit test",
          price: product.price || 19.99,
          quantity: 1,
          img: product.image || "/assets/images/products/01.jpg",
          // Ajouter la catégorie du produit
          category: product.category || "Catégorie test",
        };
      } else {
        // Fallback si l'API ne retourne pas de produit
        testProduct = {
          id: Date.now(),
          name: "Produit test",
          price: 19.99,
          quantity: 1,
          img: "/assets/images/products/01.jpg",
          // Ajouter une catégorie par défaut
          category: "Catégorie test",
        };
      }

      const newCartItems = [...cartItems, testProduct];
      setCartItems(newCartItems);
      updateLocalStorage(newCartItems);

      // Notification pour l'ajout d'un produit
      addNotification({
        title: "Produit ajouté",
        message: `${testProduct.name} a été ajouté à votre panier`,
        type: "success",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit test:", error);
      // Ajouter un produit test local en cas d'échec de l'API
      const testProduct = {
        id: Date.now(),
        name: "Produit test (local)",
        price: 19.99,
        quantity: 1,
        img: "/assets/images/products/01.jpg",
        // Ajouter une catégorie par défaut
        category: "Catégorie test",
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
        message:
          "Votre panier est vide. Ajoutez des produits avant de procéder au paiement.",
        type: "warning",
      });
      return;
    }

    try {
      setActionLoading(true);

      // Créer une commande via l'API
      const response = await axios.post("/api/orders", {
        user: user ? user.uid : null,
        items: cartItems,
        total: cartSubtotal,
        status: "pending",
        shippingAddress: null, // À compléter pendant le checkout
        paymentMethod: null, // À compléter pendant le checkout
      });

      if (response.data && response.data._id) {
        // Utiliser le router de Next.js pour la redirection avec l'ID de commande
        const router = require("next/router").default;
        router.push(`/checkout?orderId=${response.data._id}`);
      } else {
        throw new Error("La création de commande a échoué");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      addNotification({
        title: "Erreur",
        message: "Impossible de créer votre commande. Veuillez réessayer.",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Fonction pour gérer le tri des colonnes
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Trier les articles du panier en fonction de la configuration de tri
  const sortedCartItems = useMemo(() => {
    const itemsToSort = [...cartItems];
    if (!sortConfig.key) return itemsToSort;

    return itemsToSort.sort((a, b) => {
      // Fonction pour récupérer la valeur d'un chemin imbriqué
      const getValue = (obj, path) => {
        return path.split(".").reduce((acc, part) => acc?.[part], obj) || "";
      };
      
      // Gestion spéciale pour le total (price * quantity)
      if (sortConfig.key === "total") {
        const aValue = a.price * a.quantity;
        const bValue = b.price * b.quantity;
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // Récupérer les valeurs en suivant le chemin complet
      const aValue = getValue(a, sortConfig.key);
      const bValue = getValue(b, sortConfig.key);

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Tri numérique par défaut
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [cartItems, sortConfig]);

  return (
    <div className="cart-page py-5">
      <PageHeader title={"Mon Panier"} curPage={"Panier"} />
      <Container className="py-4">
        {/* Informations de débogage pour les administrateurs */}
        {isAdmin && (
          <Alert variant="info" className="mb-4">
            <h5 className="mb-2">
              Informations de débogage (Admin uniquement)
            </h5>
            <p className="mb-1">
              Nombre d&apos;articles dans le panier: {debugInfo.cartItemsLength}
            </p>
            <p className="mb-1">
              Vérification du localStorage:{" "}
              {debugInfo.localStorageCheck ? "Oui" : "Non"}
            </p>
            {debugInfo.localStorageContent && (
              <details>
                <summary className="cursor-pointer text-primary">
                  Contenu du localStorage
                </summary>
                <pre
                  className="mt-2 p-2 bg-light border rounded"
                  style={{ maxHeight: "100px", overflow: "auto" }}
                >
                  {debugInfo.localStorageContent}
                </pre>
              </details>
            )}
          </Alert>
        )}

        <h2 className="mb-4 fw-bold">Mon Panier</h2>

        <Row className="g-4">
          {/* Colonne principale avec le tableau des produits */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Chargement...</span>
                    </Spinner>
                    <p className="mt-3 text-muted">
                      Chargement de votre panier...
                    </p>
                  </div>
                ) : sortedCartItems.length === 0 ? (
                  <div className="text-center py-5">
                    <i
                      className="icofont-shopping-cart"
                      style={{ fontSize: "4rem", color: "#ddd" }}
                    ></i>
                    <h3 className="mt-3">Votre panier est vide</h3>
                    <p className="mb-4 text-muted">
                      Vous n&apos;avez pas encore ajouté de produits à votre
                      panier.
                    </p>
                    <Link href="/shop" passHref legacyBehavior>
                      <a className="btn btn-primary">
                        <i className="icofont-shopping-cart me-2"></i>
                        Continuer mes achats
                      </a>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <Table className="align-middle mb-0">
                        <thead className="bg-light text-dark">
                          <tr>
                            <th
                              className="ps-4 fw-bold"
                              style={{ minWidth: "350px", cursor: "pointer" }}
                              onClick={() => handleSort("name")}
                            >
                              <div className="d-flex align-items-center">
                                PRODUIT
                                {sortConfig.key === "name" && (
                                  <span
                                    className="sort-indicator ms-1"
                                    aria-hidden="true"
                                  >
                                    {sortConfig.direction === "asc"
                                      ? "&#9650;"
                                      : "&#9660;"}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th
                              className="fw-bold"
                              style={{ width: "100px", cursor: "pointer" }}
                              onClick={() => handleSort("price")}
                            >
                              <div className="d-flex align-items-center">
                                PRIX
                                {sortConfig.key === "price" && (
                                  <span
                                    className="sort-indicator ms-1"
                                    aria-hidden="true"
                                  >
                                    {sortConfig.direction === "asc"
                                      ? "&#9650;"
                                      : "&#9660;"}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th
                              className="fw-bold"
                              style={{ width: "150px", cursor: "pointer" }}
                              onClick={() => handleSort("quantity")}
                            >
                              <div className="d-flex align-items-center">
                                QUANTITÉ
                                {sortConfig.key === "quantity" && (
                                  <span
                                    className="sort-indicator ms-1"
                                    aria-hidden="true"
                                  >
                                    {sortConfig.direction === "asc"
                                      ? "&#9650;"
                                      : "&#9660;"}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th
                              className="fw-bold"
                              style={{ width: "120px", cursor: "pointer" }}
                              onClick={() => handleSort("total")}
                            >
                              <div className="d-flex align-items-center">
                                TOTAL
                                {sortConfig.key === "total" && (
                                  <span
                                    className="sort-indicator ms-1"
                                    aria-hidden="true"
                                  >
                                    {sortConfig.direction === "asc"
                                      ? "&#9650;"
                                      : "&#9660;"}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th
                              className="text-end pe-4 fw-bold"
                              style={{ width: "80px" }}
                            >
                              ACTIONS
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedCartItems.map((item, index) => (
                            <CartItemRow
                              key={item.id || index}
                              item={item}
                              onIncrease={() => handleIncrease(item)}
                              onDecrease={() => handleDecrease(item)}
                              onRemove={() => handleRemoveItem(item)}
                            />
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    {/* Actions du panier */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center p-4 border-top">
                      <div className="d-flex gap-2 mb-3 mb-md-0">
                        <Link href="/shop" passHref legacyBehavior>
                          <a className="btn btn-outline-primary">
                            <i className="icofont-arrow-left me-1"></i>
                            Continuer mes achats
                          </a>
                        </Link>

                        {isAdmin && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={handleAddTestProduct}
                            disabled={loading}
                          >
                            <i className="icofont-plus me-1"></i>
                            Ajouter un produit test
                          </Button>
                        )}
                      </div>

                      <Button
                        variant="outline-danger"
                        onClick={() => {
                          localStorage.removeItem("cart");
                          setCartItems([]);
                          // Déclencher un événement de stockage pour mettre à jour les compteurs dans la navigation
                          window.dispatchEvent(new Event("storage"));
                          addNotification({
                            title: "Panier réinitialisé",
                            message: "Votre panier a été vidé avec succès.",
                            type: "info",
                          });
                        }}
                        disabled={loading || cartItems.length === 0}
                      >
                        <i className="icofont-trash me-1"></i>
                        Vider le panier
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Colonne de résumé du panier */}
          {cartItems.length > 0 && (
            <Col lg={4}>
              <CartSummary
                subtotal={cartSubtotal}
                onCheckout={handleCheckout}
                loading={actionLoading}
                cartItems={cartItems}
                onAddToWishlist={addMultipleToWishlist}
              />

              {/* Avantages client */}
              <Card className="border-0 shadow-sm mt-4">
                <Card.Body className="p-4">
                  <h5 className="mb-3">Nos garanties</h5>

                  <div className="d-flex align-items-center mb-3">
                    <i className="icofont-truck fs-3 text-primary me-3"></i>
                    <div>
                      <h6 className="mb-1">Livraison gratuite</h6>
                      <p className="mb-0 small text-muted">
                        Sur toutes vos commandes en France métropolitaine
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <i className="icofont-exchange fs-3 text-danger me-3"></i>
                    <div>
                      <h6 className="mb-1">Retours sous 30 jours</h6>
                      <p className="mb-0 small text-muted">
                        Satisfaction garantie ou remboursement intégral
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <i className="icofont-headphone-alt fs-3 text-success me-3"></i>
                    <div>
                      <h6 className="mb-1">Service client 7j/7</h6>
                      <p className="mb-0 small text-muted">
                        Notre équipe est à votre écoute
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
      <style global>{`
        .cursor-pointer {
          cursor: pointer;
        }

        .table thead th {
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6c757d;
        }

        .table tbody tr {
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .table tbody tr:last-child {
          border-bottom: none;
        }

        .product-name {
          color: var(--bs-body-color);
          transition: color 0.2s;
        }

        .product-name:hover {
          color: var(--bs-primary);
        }

        .payment-methods i {
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .payment-methods:hover i {
          opacity: 1;
        }

        /* Styles pour les indicateurs de tri */
        .sort-indicator {
          display: inline-block;
          font-size: 1.2em;
          line-height: 1;
          color: var(--bs-primary);
          vertical-align: middle;
        }

        /* Augmenter la visibilité des en-têtes de colonnes */
        .table thead th {
          color: #333;
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
        }

        .table thead th:hover {
          background-color: #e9ecef;
        }
      `}</style>
    </div>
  );
};

export default CartPage;
