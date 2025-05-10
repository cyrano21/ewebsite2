import React, { useState, useEffect, useMemo } from "react";
import { useWishlist } from "../../contexts/WishlistContext";
import { useNotifications } from "../../contexts/NotificationContext";
import Link from "next/link";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
} from "react-bootstrap";
import PageHeader from "../PageHeader";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addNotification } = useNotifications();
  const [cartItems, setCartItems] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Pour debug - vérifier si nous avons des items dans wishlistItems
  // console.log("WishlistItems:", wishlistItems);

  // Vérifier les données au démarrage (optionnel, peut être retiré si le context gère bien la synchro)
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem("wishlist");
      // console.log("Stored wishlist:", storedWishlist);
      if (
        wishlistItems.length === 0 &&
        storedWishlist &&
        JSON.parse(storedWishlist).length > 0
      ) {
        // console.log("Forcing wishlist reload from localStorage event");
        // Note: Directly manipulating context state based on localStorage here might conflict
        // with the context's own logic. Relying on the context's initialization is often better.
        // Consider if this manual sync is truly necessary or if the WishlistContext handles it.
        // window.dispatchEvent(new Event("storage")); // Dispatching might cause loops if not handled carefully
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des favoris:", error);
    }
  }, [wishlistItems]); // Dependency array includes wishlistItems to re-run if it changes externally

  const sortedWishlist = useMemo(() => {
    if (!wishlistItems || wishlistItems.length === 0) return [];

    // Create a shallow copy before sorting to avoid mutating the original array from context
    const sortableItems = [...wishlistItems];

    return sortableItems.sort((a, b) => {
      if (!sortConfig.key) return 0;

      // Helper function to safely access nested properties
      const getValue = (obj, path) => {
        // Handle null/undefined objects gracefully
        if (!obj) return "";
        // Split the path and reduce to get the value
        return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? ""; // Use nullish coalescing for undefined/null
      };

      let valA = getValue(a, sortConfig.key);
      let valB = getValue(b, sortConfig.key);

      // Handle numeric comparison for price
      if (sortConfig.key === 'price') {
        valA = Number(valA) || 0; // Convert to number, default to 0 if invalid
        valB = Number(valB) || 0;
      }
      // Handle string comparison (case-insensitive)
      else if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      // Comparison logic
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0; // Items are equal for sorting purposes
    });
  }, [wishlistItems, sortConfig]); // Re-sort when items or sort config changes

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      // Toggle direction if sorting the same key, otherwise default to 'asc'
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Charger les articles du panier au chargement et quand le localStorage change
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart);
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
        // Optionally, notify the user or set cart to empty array
        setCartItems([]);
      }
    };

    loadCartItems(); // Initial load

    // Listener for storage events (e.g., cart updated in another tab)
    const handleStorageChange = (event) => {
        // Check if the 'cart' key changed in localStorage
        if (event.key === 'cart') {
            loadCartItems();
        }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Vérifier si un article est déjà dans le panier
  const isInCart = (itemId) => {
    // Ensure cartItems is an array before using .some()
    return Array.isArray(cartItems) && cartItems.some((cartItem) => cartItem.id === itemId);
  };

  // Fonction pour ajouter un article au panier
  const handleAddToCart = (item) => {
    if (!item || !item.id) {
      console.error("Tentative d'ajout d'un article invalide:", item);
      addNotification({
        title: "Erreur",
        message: "Impossible d'ajouter l'article (données invalides).",
        type: "error",
      });
      return;
    }

    try {
      setIsAddingToCart((prev) => ({ ...prev, [item.id]: true }));

      // Simulate async operation (e.g., API call) if needed, otherwise can be instant
      setTimeout(() => {
        try {
            let currentCart = [];
            try {
                currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
                // Ensure it's an array
                if (!Array.isArray(currentCart)) {
                    console.warn("Le panier dans localStorage n'était pas un tableau, réinitialisation.");
                    currentCart = [];
                }
            } catch (parseError) {
                console.error("Erreur lors de la lecture du panier depuis localStorage:", parseError);
                currentCart = []; // Start with empty cart if parsing fails
            }


          const existingItemIndex = currentCart.findIndex(
            (cartItem) => cartItem.id === item.id
          );

          if (existingItemIndex !== -1) {
            // Increment quantity if item exists
            currentCart[existingItemIndex].quantity = (currentCart[existingItemIndex].quantity || 0) + 1;
            addNotification({
              title: "Quantité mise à jour",
              message: `La quantité de ${item.name || 'l\'article'} a été augmentée dans votre panier.`,
              type: "info",
            });
          } else {
            // Add new item with quantity 1
            currentCart.push({
              ...item, // Spread item properties
              quantity: 1, // Add quantity property
            });
            addNotification({
              title: "Article ajouté",
              message: `${item.name || 'Article'} a été ajouté à votre panier.`,
              type: "success",
            });
          }

          // Update localStorage and state
          localStorage.setItem("cart", JSON.stringify(currentCart));
          setCartItems(currentCart); // Update local state to reflect change
          // Dispatch a storage event to notify other components/tabs
          window.dispatchEvent(new Event('storage'));

        } catch (innerError) {
            console.error("Erreur interne lors de l'ajout au panier:", innerError);
            addNotification({
                title: "Erreur",
                message: "Une erreur s'est produite lors de la mise à jour du panier.",
                type: "error",
            });
        } finally {
          // Reset loading state regardless of success or failure inside the timeout
          setIsAddingToCart((prev) => ({ ...prev, [item.id]: false }));
        }
      }, 300); // Reduced delay for better UX

    } catch (error) {
      console.error("Erreur lors de l'initialisation de l'ajout au panier:", error);
      addNotification({
        title: "Erreur",
        message: "Impossible de traiter l'ajout au panier.",
        type: "error",
      });
      // Ensure loading state is reset in case of initial error
      setIsAddingToCart((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  // Fonction pour ajouter tous les articles au panier
  const handleAddAllToCart = () => {
    if (!wishlistItems || wishlistItems.length === 0) return; // Do nothing if wishlist is empty

    try {
      let currentCart = [];
      try {
        currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
         if (!Array.isArray(currentCart)) {
            console.warn("Le panier dans localStorage n'était pas un tableau, réinitialisation.");
            currentCart = [];
        }
      } catch (parseError) {
        console.error("Erreur lors de la lecture du panier depuis localStorage:", parseError);
        currentCart = [];
      }

      let updatedCart = [...currentCart]; // Work with a copy
      let newItemsCount = 0;
      let updatedItemsCount = 0;

      wishlistItems.forEach((item) => {
        if (!item || !item.id) {
            console.warn("Article invalide ignoré dans la liste de souhaits:", item);
            return; // Skip invalid items
        }
        const existingItemIndex = updatedCart.findIndex(
          (cartItem) => cartItem.id === item.id
        );

        if (existingItemIndex !== -1) {
          // Increment quantity
          updatedCart[existingItemIndex].quantity = (updatedCart[existingItemIndex].quantity || 0) + 1;
          updatedItemsCount++;
        } else {
          // Add new item
          updatedCart.push({
            ...item,
            quantity: 1,
          });
          newItemsCount++;
        }
      });

      // Update localStorage and state
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      window.dispatchEvent(new Event('storage')); // Notify other parts

      // Provide more detailed notification
      let message = "";
      if (newItemsCount > 0 && updatedItemsCount > 0) {
          message = `${newItemsCount} nouvel(aux) article(s) ajouté(s) et ${updatedItemsCount} quantité(s) mise(s) à jour dans votre panier.`;
      } else if (newItemsCount > 0) {
          message = `${newItemsCount} nouvel(aux) article(s) ajouté(s) à votre panier.`;
      } else if (updatedItemsCount > 0) {
          message = `${updatedItemsCount} quantité(s) d'article(s) mise(s) à jour dans votre panier.`;
      } else {
          message = "Aucun changement nécessaire dans le panier."; // Or maybe don't notify
      }

      if (newItemsCount > 0 || updatedItemsCount > 0) {
        addNotification({
            title: "Panier mis à jour",
            message: message,
            type: "success",
        });
      }

    } catch (error) {
      console.error("Erreur lors de l'ajout de tous les articles au panier:", error);
      addNotification({
        title: "Erreur",
        message: "Impossible d'ajouter tous les articles au panier.",
        type: "error",
      });
    }
  };

  // Handler for clearing wishlist with notification and storage event
  const handleClearWishlist = () => {
      const itemCount = wishlistItems.length;
      clearWishlist(); // Call context function
      if (itemCount > 0) {
           addNotification({
                title: "Favoris vidés",
                message: "Votre liste de favoris a été vidée.",
                type: "info",
            });
      }
      // Dispatch storage event maybe not needed if context handles it,
      // but can be useful for other components listening directly to storage.
      // window.dispatchEvent(new Event('storage'));
  };

  // Handler for removing a single item with notification
  const handleRemoveItem = (item) => {
       if (!item || !item.id) return;
       removeFromWishlist(item.id); // Call context function
       addNotification({
            title: "Article retiré",
            message: `${item.name || 'L\'article'} a été retiré de vos favoris.`,
            type: "info",
        });
      // window.dispatchEvent(new Event('storage')); // Optional: if needed elsewhere
  }


  return (
    <div className="wishlist-page py-5">
      <PageHeader title="Mes Favoris" curPage="Favoris" />
      <Container className="py-4">
        <h2 className="mb-4 fw-bold">
          Mes Favoris
          {/* Display count only if there are items */}
          {wishlistItems && wishlistItems.length > 0 && (
            <Badge bg="primary" className="ms-2 fs-6 align-middle" pill>
              {wishlistItems.length}
            </Badge>
          )}
        </h2>

        <Row>
          <Col xs={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0"> {/* Remove padding if table has its own */}
                {/* Conditional Rendering: Empty state or Table */}
                {!wishlistItems || wishlistItems.length === 0 ? (
                  <div className="text-center py-5 px-3">
                    <i
                      className="icofont-heart"
                      style={{ fontSize: "4rem", color: "#dee2e6" }} // Lighter grey
                    ></i>
                    <h3 className="mt-3 text-muted">Votre liste de favoris est vide</h3>
                    <p className="mb-4 text-secondary">
                      Ajoutez des produits que vous aimez pour les retrouver facilement !
                    </p>
                    <Link href="/shop" className="btn btn-primary" legacyBehavior>
                      <i className="icofont-shopping-cart me-2"></i>
                      Découvrir nos produits
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <Table hover className="align-middle mb-0"> {/* Added hover effect */}
                        <thead className="table-light"> {/* Use table-light class */}
                          <tr>
                            {/* Produit Header */}
                            <th
                              scope="col" // Accessibility: scope attribute
                              className="ps-4 py-3 fw-semibold" // Adjusted padding/weight
                              onClick={() => handleSort("name")}
                              style={{ cursor: "pointer", whiteSpace: 'nowrap' }} // Prevent wrapping
                            >
                              <div className="d-flex align-items-center">
                                PRODUIT
                                {sortConfig.key === "name" && (
                                  <span
                                    className="sort-indicator ms-2" // Increased margin
                                    aria-hidden="true"
                                  >
                                    {/* --- CORRECTION HERE --- */}
                                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                                  </span>
                                )}
                              </div>
                            </th>
                            {/* Couleur Header */}
                            <th
                              scope="col"
                              className="py-3 fw-semibold"
                              onClick={() => handleSort("attributes.color")}
                              style={{ cursor: "pointer", whiteSpace: 'nowrap' }}
                            >
                              <div className="d-flex align-items-center">
                                COULEUR
                                {sortConfig.key === "attributes.color" && (
                                  <span
                                    className="sort-indicator ms-2"
                                    aria-hidden="true"
                                  >
                                    {/* --- CORRECTION HERE --- */}
                                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                                  </span>
                                )}
                              </div>
                            </th>
                            {/* Taille Header */}
                            <th
                              scope="col"
                              className="py-3 fw-semibold"
                              onClick={() => handleSort("attributes.size")}
                              style={{ cursor: "pointer", whiteSpace: 'nowrap' }}
                            >
                              <div className="d-flex align-items-center">
                                TAILLE
                                {sortConfig.key === "attributes.size" && (
                                  <span
                                    className="sort-indicator ms-2"
                                    aria-hidden="true"
                                  >
                                    {/* --- CORRECTION HERE --- */}
                                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                                  </span>
                                )}
                              </div>
                            </th>
                             {/* Prix Header */}
                            <th
                              scope="col"
                              className="py-3 fw-semibold"
                              onClick={() => handleSort("price")}
                              style={{ cursor: "pointer", whiteSpace: 'nowrap' }}
                            >
                              <div className="d-flex align-items-center">
                                PRIX
                                {sortConfig.key === "price" && (
                                  <span
                                    className="sort-indicator ms-2"
                                    aria-hidden="true"
                                  >
                                     {/* --- CORRECTION HERE --- */}
                                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                                  </span>
                                )}
                              </div>
                            </th>
                            {/* Actions Header */}
                            <th scope="col" className="text-end pe-4 py-3 fw-semibold">ACTIONS</th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* Use the sorted list */}
                          {sortedWishlist.map((item) => (
                            // Use a stable key, preferably item.uniqueId if available, else item.id
                            (<tr key={item.id || `wishlist-item-${item.name}`} className="align-middle">
                              {/* Product Info Cell */}
                              <td className="ps-4 py-3">
                                <div className="d-flex align-items-center">
                                  {/* Product Image */}
                                  <div className="flex-shrink-0 me-3">
                                    {item.img ? (
                                      <Link href={`/shop/${item.id}`} aria-label={`Voir ${item.name}`} legacyBehavior>
                                        <img
                                          src={item.img}
                                          alt={item.name || 'Image produit'} // Provide default alt text
                                          className="img-fluid rounded border"
                                          style={{
                                            width: "60px", // Slightly smaller
                                            height: "60px",
                                            objectFit: "cover",
                                          }}
                                          loading="lazy" // Lazy load images below the fold
                                        />
                                      </Link>
                                    ) : (
                                      // Placeholder Image
                                      (<div
                                        className="bg-light rounded border d-flex align-items-center justify-content-center text-muted"
                                        style={{ width: "60px", height: "60px" }}
                                        aria-label="Image non disponible"
                                      >
                                        <i className="icofont-image fs-3"></i>
                                      </div>)
                                    )}
                                  </div>
                                  {/* Product Details */}
                                  <div className="flex-grow-1">
                                    <Link
                                      href={`/shop/${item.id}`}
                                      className="product-name fw-semibold text-dark text-decoration-none mb-1 d-block"
                                      legacyBehavior>
                                      {item.name || "Produit sans nom"}
                                    </Link>
                                    {/* Category Badge */}
                                    {item.category && (
                                      <div className="product-category small mb-1">
                                        <Badge
                                          bg="light"
                                          text="dark"
                                          className="me-1 fw-normal" // Lighter weight for badge
                                        >
                                          <i className="icofont-tag me-1"></i> {/* Corrected icon */}
                                          {item.category}
                                        </Badge>
                                      </div>
                                    )}
                                    {/* Other Attributes */}
                                    {item.attributes && (
                                      <div className="product-attributes small text-muted">
                                        {Object.entries(item.attributes)
                                          // Filter out color and size as they have dedicated columns
                                          .filter(
                                            ([key]) => key !== "color" && key !== "size"
                                          )
                                          .map(([key, value]) => (
                                            <span key={key} className="me-3"> {/* Increased spacing */}
                                              <span className="text-capitalize">{key}:</span> {value}
                                            </span>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              {/* Color Cell */}
                              <td className="py-3">
                                {item.attributes?.color ? (
                                  <div className="d-flex align-items-center">
                                    <div
                                      className="color-swatch me-2 border rounded-circle" // Added rounded-circle
                                      style={{
                                        backgroundColor: item.attributes.color,
                                        width: "20px",
                                        height: "20px",
                                        // Add outline for very light colors if needed
                                        // outline: '1px solid rgba(0,0,0,0.1)'
                                      }}
                                      title={item.attributes.color} // Add title attribute
                                    ></div>
                                    {/* Optionally display text, maybe hidden on small screens */}
                                    <span className="d-none d-md-inline">{item.attributes.color}</span>
                                  </div>
                                ) : (
                                  <span className="text-muted">—</span>
                                )}
                              </td>
                              {/* Size Cell */}
                              <td className="py-3">
                                {item.attributes?.size ? (
                                  <Badge
                                    pill // Use pill shape for size
                                    bg="secondary" // Different background for size
                                    text="white"
                                    className="px-2 py-1 fw-normal"
                                  >
                                    {item.attributes.size}
                                  </Badge>
                                ) : (
                                  <span className="text-muted">—</span>
                                )}
                              </td>
                              {/* Price Cell */}
                              <td className="py-3">
                                <span className="fw-semibold text-dark">
                                  {/* Format price, handle potential non-numeric values */}
                                  {typeof item.price === 'number' ? item.price.toFixed(2) + '€' : 'N/A'}
                                </span>
                              </td>
                              {/* Actions Cell */}
                              <td className="text-end pe-4 py-3">
                                <div className="d-flex justify-content-end align-items-center gap-2">
                                  {/* Add to Cart Button */}
                                  <Button
                                    variant={
                                      isInCart(item.id)
                                        ? "success" // Solid green if in cart
                                        : "outline-primary" // Outline primary if not
                                    }
                                    size="sm"
                                    onClick={() => handleAddToCart(item)}
                                    disabled={isAddingToCart[item.id] || isInCart(item.id)} // Disable if adding or already in cart
                                    aria-label={
                                      isInCart(item.id)
                                        ? `${item.name} est déjà dans le panier`
                                        : `Ajouter ${item.name} au panier`
                                    }
                                    title={
                                        isInCart(item.id)
                                        ? "Dans le panier" // Shorter title
                                        : "Ajouter au panier"
                                    }
                                    style={{minWidth: '90px'}} // Ensure minimum width
                                  >
                                    {isAddingToCart[item.id] ? (
                                      <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                    ) : isInCart(item.id) ? (
                                      <>
                                        <i className="icofont-check me-1"></i> Ajouté
                                      </>
                                    ) : (
                                      // --- COMMENT REMOVED FROM HERE ---
                                      (<i className="icofont-plus"></i>)
                                    )}
                                  </Button>
                                  {/* Remove from Wishlist Button */}
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleRemoveItem(item)} // Use specific handler
                                    aria-label={`Retirer ${item.name} des favoris`}
                                    title="Retirer des favoris"
                                  >
                                    <i className="icofont-ui-love-remove"></i> {/* More specific icon */}
                                  </Button>
                                </div>
                              </td>
                            </tr>)
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    {/* Footer Actions */}
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 p-sm-4 border-top bg-light">
                      <Button
                        variant="outline-danger"
                        onClick={handleClearWishlist} // Use specific handler
                        className="mb-2 mb-sm-0" // Margin bottom on small screens only
                        aria-label="Vider toute la liste de favoris"
                      >
                        <i className="icofont-trash me-2"></i>
                        Vider la liste ({wishlistItems.length})
                      </Button>

                      <Button
                        variant="primary"
                        onClick={handleAddAllToCart}
                        disabled={wishlistItems.length === 0} // Disable if list is empty
                        aria-label="Ajouter tous les articles des favoris au panier"
                      >
                        <i className="icofont-shopping-cart me-2"></i>
                        Tout ajouter au panier
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Scoped CSS using styled-jsx */}
      <style jsx global>{`
        .wishlist-page .table thead th {
          // font-weight: 600; // Handled by fw-semibold class now
          font-size: 0.85rem; // Slightly smaller header text
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #495057; // Darker grey for better contrast
          vertical-align: middle; // Ensure vertical alignment
        }

        .wishlist-page .table > :not(caption) > * > * {
             // Target all cells (th, td)
            padding-top: 1rem; // Consistent vertical padding
            padding-bottom: 1rem;
            vertical-align: middle; // Ensure vertical alignment for all cells
        }


        .wishlist-page .table tbody tr {
          border-color: #e9ecef; // Slightly lighter border color
        }

        .wishlist-page .table tbody tr:last-child {
          border-bottom: none; // Already handled by table structure, but explicit doesn't hurt
        }

        .wishlist-page .product-name {
          color: #212529; // Default text color
          transition: color 0.2s ease-in-out;
        }
        .wishlist-page .product-name:hover,
        .wishlist-page .product-name:focus {
          color: var(--bs-primary); // Use Bootstrap primary color on hover/focus
          text-decoration: underline; // Add underline on hover/focus
        }

        .wishlist-page .sort-indicator {
          font-size: 0.7rem; // Smaller arrows
          color: #6c757d; // Muted color for arrows
          line-height: 1; // Ensure proper alignment
        }

        /* Style for the button when item is already in cart */
        .btn-success:disabled, .btn-success.disabled {
            cursor: not-allowed; // Show not-allowed cursor
            // Keep the success style even when disabled to indicate state
            color: #fff !important;
            background-color: var(--bs-success) !important;
            border-color: var(--bs-success) !important;
            opacity: 0.75; // Slightly faded
        }
      `}</style>
    </div>
  );
};

export default WishlistPage;