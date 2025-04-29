import connectDB from "../config/db";
import Order from "../models/Order";
import mongoose from "mongoose";

async function addDemoOrders() {
  await connectDB();

  const demoOrders = [
    {
      orderNumber: `ORD-${Date.now()}-001`,
      items: [
        { id: "1", name: "Produit Test 1", quantity: 2, price: 29.99 },
        { id: "2", name: "Produit Test 2", quantity: 1, price: 49.99 }
      ],
      total: 109.97,
      status: "pending",
      shippingAddress: {
        fullName: "Jean Testeur",
        address: "123 Rue de Paris",
        city: "Paris",
        postalCode: "75001",
        country: "France"
      },
      paymentMethod: "Carte de crédit",
      createdAt: new Date(),
    },
    {
      orderNumber: `ORD-${Date.now()}-002`,
      items: [
        { id: "3", name: "Produit Test 3", quantity: 1, price: 99.99 }
      ],
      total: 99.99,
      status: "processing",
      shippingAddress: {
        fullName: "Marie Demo",
        address: "456 Avenue de Lyon",
        city: "Lyon",
        postalCode: "69000",
        country: "France"
      },
      paymentMethod: "PayPal",
      createdAt: new Date(),
    }
  ];

  await Order.insertMany(demoOrders);
  console.log("Commandes de démonstration ajoutées avec succès !");
  mongoose.connection.close();
}

addDemoOrders();
