const mongoose = require('mongoose');
const path = require('path');

const Order = require(path.join(__dirname, '../models/Order.js'));

// Connexion directe sans import externe
async function connectDB() {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const connectionUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/ewebsite2-francise';
  try {
    const conn = await mongoose.connect(connectionUrl, options);
    console.log(`MongoDB connecté: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    return null;
  }
}

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
