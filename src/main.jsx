import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'swiper/css';

// bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
import '././assets/css/bootstrap-fixes.css'; // Correctifs pour bootstrap
import 'bootstrap/dist/js/bootstrap.min.js';

// fonts and icons
import '././assets/css/icofont.min.css';
import '././assets/css/animate.css';
import '././assets/css/style.min.css';
import '././assets/css/admin.css';

// Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home/Home.jsx';
import Shop from './pages/Shop/Shop.jsx';
import SingleProduct from './pages/Shop/SingleProduct.jsx';
import Blog from './pages/Blog/Blog.jsx';
import SingleBlog from './pages/Blog/SingleBlog.jsx';
import About from './pages/AboutPage/About.jsx';
import Contact from './pages/ContactPage/Contact.jsx';
import CartPage from './pages/Shop/CartPage.jsx';
import CheckoutPage from './pages/Shop/CheckoutPage.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import PrivateRoute from './PrivateRoute/PrivateRoute.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';

// Importation des composants Admin
import AdminLayout from './pages/Admin/AdminLayout.jsx';
import AdminDashboard from './pages/Admin/Dashboard.jsx';
import ProductManagement from './pages/Admin/ProductManagement.jsx';
import OrderManagement from './pages/Admin/OrderManagement.jsx';
import CustomerManagement from './pages/Admin/CustomerManagement.jsx';
import AdminReports from './pages/Admin/AdminReports.jsx';
import AdminSettings from './pages/Admin/AdminSettings.jsx';
import AdminProfile from './pages/Admin/AdminProfile.jsx';
import BlogManagement from './pages/Admin/BlogManagement.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
    children:[
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/shop",
        element: <Shop/>
      },
      {
        path: "shop/:id",
        element: <SingleProduct/>
      },
      {
        path: "/blog",
        element: <Blog/>
      },
      {
        path: "/blog/:id",
        element: <SingleBlog/>
      },
      {
        path: "/about",
        element: <About/>
      },
      {
        path: "/contact",
        element: <Contact/>
      },
      {
        path: "/cart-page",
        element: <PrivateRoute><CartPage/></PrivateRoute>
      },
    ]
  },
  {
    path: "/sign-up",
    element: <Signup/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/check-out",
    element: <CheckoutPage/>
  },
  // Routes Admin
  {
    path: "/admin",
    element: <PrivateRoute><AdminLayout /></PrivateRoute>,
    children: [
      {
        index: true, // Utiliser index pour la route par défaut
        element: <AdminDashboard />
      },
      {
        path: "dashboard", // Ajout de la route dashboard explicite
        element: <AdminDashboard />
      },
      {
        path: "products",
        element: <ProductManagement />
      },
      {
        path: "blog",
        element: <BlogManagement />
      },
      {
        path: "orders",
        element: <OrderManagement />
      },
      {
        path: "customers",
        element: <CustomerManagement />
      },
      {
        path: "reports",
        element: <AdminReports />
      },
      {
        path: "settings",
        element: <AdminSettings />
      },
      {
        path: "profile",
        element: <AdminProfile />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
     <RouterProvider router={router} />
  </AuthProvider>
  
)
