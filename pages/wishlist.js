import React from "react";
import WishlistPage from "../components/shop/WishlistPage";
import { WishlistProvider } from "../contexts/WishlistContext";

const wishlist = () => {
  return (
    <WishlistProvider>
      <WishlistPage />
    </WishlistProvider>
  );
};

export default wishlist;
