import React from "react";
import Layout from "../components/Layout";
import CartPage from "../components/shop/CartPage";

export default function PanierPage() {
  return <CartPage />;
}

// Utilise getLayout pour appliquer une seule fois Layout via _app.js
PanierPage.getLayout = (page) => <Layout>{page}</Layout>;
