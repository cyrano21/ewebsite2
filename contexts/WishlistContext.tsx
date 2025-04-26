import React, { createContext, useContext, useState, useEffect } from "react";
import { useNotifications } from "./NotificationContext";

// Interface pour le contexte
interface WishlistContextType {
  wishlistItems: any[];
  addToWishlist: (item: any) => void;
  addMultipleToWishlist: (items: any[]) => void;
  removeFromWishlist: (itemId: string | number) => void;
  isInWishlist: (itemId: string | number) => boolean;
  clearWishlist: () => void;
}

// Création du contexte avec des valeurs par défaut
const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  addToWishlist: () => {},
  addMultipleToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
});

// Hook personnalisé pour utiliser le contexte
export const useWishlist = () => useContext(WishlistContext);

// Provider qui enveloppe l'application
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const { addNotification } = useNotifications();

  // Chargement initial des favoris depuis le localStorage
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const storedWishlist = localStorage.getItem("wishlist");
        if (storedWishlist) {
          const parsedWishlist = JSON.parse(storedWishlist);
          console.log("Loading wishlist from localStorage:", parsedWishlist);
          setWishlistItems(parsedWishlist);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
      }
    };

    loadWishlist();

    // Ajouter un écouteur pour les événements de storage pour synchroniser à travers les onglets
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "wishlist") {
        loadWishlist();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Écouter aussi les événements personnalisés déclenchés manuellement
    const handleCustomStorage = () => {
      loadWishlist();
    };

    window.addEventListener("storage", handleCustomStorage);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage", handleCustomStorage);
    };
  }, []);

  // Mise à jour du localStorage à chaque changement
  useEffect(() => {
    if (wishlistItems.length > 0 || localStorage.getItem("wishlist")) {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
      console.log("Wishlist updated in localStorage:", wishlistItems);
    }
  }, [wishlistItems]);

  // Ajouter un article aux favoris
  const addToWishlist = (item: any) => {
    if (!item.id) {
      console.error("L'article doit avoir un ID");
      return;
    }

    // Vérifier si l'article est déjà dans les favoris
    if (isInWishlist(item.id)) {
      addNotification({
        title: "Information",
        message: `${item.name} est déjà dans vos favoris`,
        type: "info",
      });
      return;
    }

    setWishlistItems((prev) => [...prev, item]);
    addNotification({
      title: "Ajouté aux favoris",
      message: `${item.name} a été ajouté à vos favoris`,
      type: "success",
    });
  };

  // Ajouter plusieurs articles aux favoris
  const addMultipleToWishlist = (items: any[]) => {
    if (items.length === 0) return;

    // Filtrer les articles qui ne sont pas déjà dans les favoris
    const newItems = items.filter((item) => !isInWishlist(item.id));

    if (newItems.length === 0) {
      addNotification({
        title: "Information",
        message: "Tous ces articles sont déjà dans vos favoris",
        type: "info",
      });
      return;
    }

    setWishlistItems((prev) => [...prev, ...newItems]);
    addNotification({
      title: "Ajouté aux favoris",
      message: `${newItems.length} article(s) ajouté(s) à vos favoris`,
      type: "success",
    });
  };

  // Supprimer un article des favoris
  const removeFromWishlist = (itemId: string | number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
    addNotification({
      title: "Retiré des favoris",
      message: "L'article a été retiré de vos favoris",
      type: "warning",
    });
  };

  // Vérifier si un article est dans les favoris
  const isInWishlist = (itemId: string | number) => {
    return wishlistItems.some((item) => item.id === itemId);
  };

  // Vider les favoris
  const clearWishlist = () => {
    setWishlistItems([]);
    addNotification({
      title: "Favoris vidés",
      message: "Votre liste de favoris a été vidée",
      type: "info",
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        addMultipleToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
