import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';

import {AuthRoute} from "./AuthRoute";
import {AuthRouteVendor} from "./AuthRouteVendor";
import {AuthRouteAdmin} from "./AuthRouteAdmin";

import NotFound from "./components/NotFound";

//User Panel Components
import CustomerLayout from './components/Customer/CustomerLayout';
import HomePage from "./components/Customer/HomePage";
import ShopPage from "./components/Customer/ShopPage";
import CategoriesPage from "./components/Customer/CategoriesPage";
import ProductPage from "./components/Customer/ProductPage";
import VendorStorePage from "./components/Customer/VendorStorePage";
import VendorsPage from "./components/Customer/VendorsPage";
import WishlistPage from "./components/Customer/WishlistPage";
import CartPage from "./components/Customer/CartPage";
import CheckoutPage from "./components/Customer/CheckoutPage";
import ComparePage from "./components/Customer/ComparePage";
import OrdersPage from "./components/Customer/OrdersPage";
import OrderDetailsPage from "./components/Customer/OrderDetailsPage";
import AboutPage from "./components/Customer/AboutPage";
import ContactPage from "./components/Customer/ContactPage";
import ProfilePage from "./components/Customer/ProfilePage";
import AuthPage from "./components/Customer/AuthPage";
import ResetPasswordPage from "./components/Customer/ResetPasswordPage";

//Admin Panel Components
import AdminLogin from "./components/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminVendors from "./components/Admin/AdminVendors";
import AdminViewVendor from "./components/Admin/AdminViewVendor";
import AdminProducts from "./components/Admin/AdminProducts";
import AdminProductView from "./components/Admin/AdminProductView";
import AdminCategories from "./components/Admin/AdminCategories";
import AdminAddCategory from "./components/Admin/AdminAddCategory";
import AdminViewCategory from "./components/Admin/AdminViewCategory";
import AdminEditCategory from "./components/Admin/AdminEditCategory";
import AdminOrders from "./components/Admin/AdminOrders";
import AdminViewOrder from "./components/Admin/AdminViewOrder";
import AdminEditOrder from "./components/Admin/AdminEditOrder";
import AdminCustomers from "./components/Admin/AdminCustomers";
import AdminViewCustomer from "./components/Admin/AdminViewCustomer";
import AdminPayments from "./components/Admin/AdminPayments";
import AdminViewPayment from "./components/Admin/AdminViewPayment";
import AdminEditPayment from "./components/Admin/AdminEditPayment";
import AdminRefunds from "./components/Admin/AdminRefunds";
import AdminViewRefund from "./components/Admin/AdminViewRefund";
import AdminEditRefund from "./components/Admin/AdminEditRefund";
import AdminPayouts from "./components/Admin/AdminPayouts";
import AdminViewPayout from "./components/Admin/AdminViewPayout";
import AdminMakePayout from "./components/Admin/AdminMakePayout";
import AdminProfile from "./components/Admin/AdminProfile";
import AdminProfileEdit from "./components/Admin/AdminProfileEdit";
import AdminSettings from "./components/Admin/AdminSettings";

// Vendor Panel Components
import VendorLayout from "./components/Vendor/VendorLayout";
import VendorDashboard from "./components/Vendor/VendorDashboard";
import VendorProducts from "./components/Vendor/VendorProducts";
import VendorAddProduct from "./components/Vendor/VendorAddProduct";
import VendorViewProduct from "./components/Vendor/VendorViewProduct";
import VendorEditProduct from "./components/Vendor/VendorEditProduct";
import VendorOrders from "./components/Vendor/VendorOrders";
import VendorViewOrder from "./components/Vendor/VendorViewOrder";
import VendorUpdateOrder from "./components/Vendor/VendorUpdateOrder";
import VendorInventory from "./components/Vendor/VendorInventory";
import VendorUpdateStock from "./components/Vendor/VendorUpdateStock";
import VendorEarnings from "./components/Vendor/VendorEarnings";
import VendorPayouts from "./components/Vendor/VendorPayouts";
import VendorPayoutDetail from "./components/Vendor/VendorPayoutDetail";
import VendorCustomers from "./components/Vendor/VendorCustomers";
import VendorViewCustomer from "./components/Vendor/VendorViewCustomer";
import VendorStore from "./components/Vendor/VendorStore";
import VendorShipping from "./components/Vendor/VendorShipping";
import VendorShippingOrder from "./components/Vendor/VendorShippingOrder";
import VendorProfile from "./components/Vendor/VendorProfile";
import VendorProfileEdit from "./components/Vendor/VendorProfileEdit";
import VendorSettings from "./components/Vendor/VendorSettings";
import VendorLogin from "./components/Vendor/VendorLogin";
import VendorRegisterPage from "./components/Vendor/VendorRegisterPage";
import VendorForgotPassword from "./components/Vendor/VendorForgotPassword";
import AdminContactMessages from "./components/Admin/AdminContactMessages";

/* HELPERS */

const money = (value) =>
  `₹${new Intl.NumberFormat("en-IN").format(value)}`;

const discount = (price, mrp) =>
  Math.round((1 - price / mrp) * 100);

function App() {
  /* PRODUCT DATA */

  const productData = [
    {
      id: "p1",
      name: "Aster Pro ANC Headphones",
      category: "Electronics",
      vendor: "Namma Audio",
      price: 7499,
      mrp: 9999,
      sold: 86,
      status: "Active",
      rating: 4.8,
      reviews: 218,
      stock: 24,
      tone: "from-teal-900 via-teal-700 to-amber-500",
      mark: "A",
      specs: "40mm drivers · 42h battery",
      sku: "SKU-AST-001",
      description:
        "Flagship wireless noise cancelling headphones with rich acoustic clarity.",
      createdAt: "Aug 05, 2026",
      image: "A",
    },

    {
      id: "p2",
      name: "Kosha Everyday Laptop 14",
      category: "Laptops",
      vendor: "Byte Bazaar",
      price: 58990,
      mrp: 64990,
      sold: 42,
      status: "Active",
      rating: 4.6,
      reviews: 94,
      stock: 8,
      tone: "from-slate-900 via-slate-700 to-teal-500",
      mark: "K",
      specs: "16GB RAM · 512GB SSD",
      sku: "SKU-KOS-002",
      description:
        "Sleek aluminum laptop designed for mobile power users.",
      createdAt: "Aug 04, 2026",
      image: "K",
    },

    {
      id: "p3",
      name: "Mitti Hand-thrown Dinner Set",
      category: "Home & Kitchen",
      vendor: "Mitti Studio",
      price: 2190,
      mrp: 2790,
      sold: 67,
      status: "Active",
      rating: 4.9,
      reviews: 71,
      stock: 42,
      tone: "from-orange-950 via-amber-700 to-orange-300",
      mark: "M",
      specs: "Stoneware · Set of 6",
      sku: "SKU-MIT-003",
      description:
        "Artisanal stoneware ceramics made from raw terracotta clay.",
      createdAt: "Aug 03, 2026",
      image: "M",
    },

    {
      id: "p4",
      name: "Reva Cotton Overshirt",
      category: "Fashion",
      vendor: "Reva Atelier",
      price: 1899,
      mrp: 2499,
      sold: 54,
      status: "Active",
      rating: 4.5,
      reviews: 182,
      stock: 16,
      tone: "from-indigo-950 via-indigo-700 to-rose-300",
      mark: "R",
      specs: "100% cotton · Relaxed fit",
      sku: "SKU-REV-004",
      description:
        "A premium 100% cotton overshirt with a relaxed fit, designed for everyday comfort and effortless styling.",
      createdAt: "Aug 01, 2026",
      image: "R",
    },

    {
      id: "p5",
      name: "Sattva Brass Table Lamp",
      category: "Home & Kitchen",
      vendor: "Sattva Living",
      price: 3290,
      mrp: 4590,
      sold: 38,
      status: "Active",
      rating: 4.7,
      reviews: 63,
      stock: 12,
      tone: "from-yellow-950 via-yellow-700 to-orange-300",
      mark: "S",
      specs: "Warm LED · Hand-finished",
      sku: "SKU-SAT-005",
      description:
        "Elegant hand-finished brass table lamp with warm LED lighting, perfect for bedrooms, study areas, and living spaces.",
      createdAt: "Jul 30, 2026",
      image: "S",
    },

    {
      id: "p6",
      name: "Drift Running Shoes",
      category: "Sports",
      vendor: "Field Notes Sports",
      price: 3199,
      mrp: 3999,
      sold: 73,
      status: "Active",
      rating: 4.4,
      reviews: 117,
      stock: 31,
      tone: "from-cyan-950 via-cyan-700 to-lime-300",
      mark: "D",
      specs: "EVA sole · Breathable mesh",
      sku: "SKU-DRI-006",
      description:
        "Lightweight running shoes featuring a breathable mesh upper and cushioned EVA sole for comfortable everyday training.",
      createdAt: "Jul 28, 2026",
      image: "D",
    },

    {
      id: "p7",
      name: "Monsoon Greens Tea Chest",
      category: "Grocery",
      vendor: "The Tea Estate",
      price: 980,
      mrp: 1250,
      sold: 91,
      status: "Active",
      rating: 4.9,
      reviews: 46,
      stock: 65,
      tone: "from-emerald-950 via-emerald-700 to-yellow-300",
      mark: "T",
      specs: "4 single-estate blends",
      sku: "SKU-MON-007",
      description:
        "A curated collection of four single-estate tea blends offering distinctive aromas and refreshing flavors inspired by India's tea regions.",
      createdAt: "Aug 07, 2026",
      image: "T",
    },

    {
      id: "p8",
      name: "The Bombay Recipe Journal",
      category: "Books",
      vendor: "Paper Boat Press",
      price: 799,
      mrp: 999,
      sold: 29,
      status: "Active",
      rating: 4.8,
      reviews: 38,
      stock: 18,
      tone: "from-rose-950 via-red-800 to-amber-300",
      mark: "P",
      specs: "Hardbound · 224 pages",
      sku: "SKU-BOM-008",
      description:
        "A beautifully designed hardbound recipe journal featuring 224 pages for documenting family recipes, culinary memories, and personal creations.",
      createdAt: "Aug 06, 2026",
      image: "P",
    },
  ];

  /* CATEGORY DATA */

  const categories = [
    {
      name: "Electronics",
      desc: "Signals, screens and smart tools",
      icon: "▦",
      count: "1240",
    },
    {
      name: "Fashion",
      desc: "Made for Indian weather",
      icon: "✦",
      count: "890",
    },
    {
      name: "Home & Kitchen",
      desc: "Objects with a point of view",
      icon: "⌂",
      count: "670",
    },
    {
      name: "Beauty",
      desc: "Small rituals, better days",
      icon: "◌",
      count: "420",
    },
    {
      name: "Sports",
      desc: "Move your way",
      icon: "↗",
      count: "315",
    },
    {
      name: "Books",
      desc: "Stories worth keeping",
      icon: "▤",
      count: "280",
    },
    {
      name: "Grocery",
      desc: "Good things, delivered",
      icon: "◒",
      count: "960",
    },
    {
      name: "Laptops",
      desc: "Work, play, repeat",
      icon: "▱",
      count: "184",
    },
  ];

  /* VENDOR DATA */

  const vendors = [
    {
      id: "v1",
      name: "Namma Audio",
      city: "Bengaluru",
      desc: "Thoughtful sound hardware tuned for long Indian commutes.",
      rating: 4.8,
      products: 42,
      initials: "NA",
      color: "bg-teal-800",
    },
    {
      id: "v2",
      name: "Mitti Studio",
      city: "Jaipur",
      desc: "Handmade tableware in quiet, tactile glazes.",
      rating: 4.9,
      products: 76,
      initials: "MS",
      color: "bg-orange-700",
    },
    {
      id: "v3",
      name: "Byte Bazaar",
      city: "Pune",
      desc: "Straightforward tech, tested by people who use it.",
      rating: 4.6,
      products: 118,
      initials: "BB",
      color: "bg-slate-800",
    },
    {
      id: "v4",
      name: "Reva Atelier",
      city: "Mumbai",
      desc: "Easy silhouettes, responsible fabrics, no loud logos.",
      rating: 4.7,
      products: 63,
      initials: "RA",
      color: "bg-indigo-800",
    },
  ];

  /* ORDERS DATA */

  const orders = [
    {
      id: "SC-24187",
      date: "09 Aug 2026",
      status: "Delivered",
      total: 7199,
      payment: "UPI",
      items: [
        {
          id: "p1",
          name: "Aster Pro ANC Headphones",
          vendor: "Namma Audio",
          price: 7499,
          quantity: 1,
          category: "Electronics",
          tone: "from-teal-900 via-teal-700 to-amber-500",
          mark: "A",
        },
      ],
      delivery: {
        name: "Fauziya Pirji",
        address: "14/3, Indiranagar, Bengaluru",
        city: "Bengaluru",
        pincode: "560038",
      },
    },

    {
      id: "SC-24172",
      date: "06 Aug 2026",
      status: "Shipped",
      total: 3999,
      payment: "Credit / Debit Card",
      items: [
        {
          id: "p6",
          name: "Drift Running Shoes",
          vendor: "Field Notes Sports",
          price: 3199,
          quantity: 1,
          category: "Sports",
          tone: "from-cyan-950 via-cyan-700 to-lime-300",
          mark: "D",
        },
      ],
      delivery: {
        name: "Fauziya Pirji",
        address: "Ahmedabad",
        city: "Ahmedabad",
        pincode: "380001",
      },
    },

    {
      id: "SC-24151",
      date: "02 Aug 2026",
      status: "Processing",
      total: 5480,
      payment: "UPI",
      items: [
        {
          id: "p3",
          name: "Mitti Hand-thrown Dinner Set",
          vendor: "Mitti Studio",
          price: 2190,
          quantity: 1,
          category: "Home & Kitchen",
          tone: "from-orange-950 via-amber-700 to-orange-300",
          mark: "M",
        },
        {
          id: "p5",
          name: "Sattva Brass Table Lamp",
          vendor: "Sattva Living",
          price: 3290,
          quantity: 1,
          category: "Home & Kitchen",
          tone: "from-yellow-950 via-yellow-700 to-orange-300",
          mark: "S",
        },
      ],
      delivery: {
        name: "Fauziya Pirji",
        address: "Ahmedabad",
        city: "Ahmedabad",
        pincode: "380001",
      },
    },

    {
      id: "SC-24120",
      date: "28 Jul 2026",
      status: "Delivered",
      total: 1899,
      payment: "Cash on Delivery",
      items: [
        {
          id: "p4",
          name: "Reva Cotton Overshirt",
          vendor: "Reva Atelier",
          price: 1899,
          quantity: 1,
          category: "Fashion",
          tone: "from-indigo-950 via-indigo-700 to-rose-300",
          mark: "R",
        },
      ],
      delivery: {
        name: "Fauziya Pirji",
        address: "Ahmedabad",
        city: "Ahmedabad",
        pincode: "380001",
      },
    },
  ];

  /* Admin Vendor Data */

  const adminVendors = [
    {
      id: 1,
      name: "ElectroCore",
      owner: "Rahul Mehta",
      email: "rahul@electrocore.com",
      category: "Electronics",
      products: 126,
      orders: 284,
      revenue: "$18,420",
      status: "Active",
      joined: "Aug 02, 2026",
      initials: "EC",
    },
    {
      id: 2,
      name: "HomeNest",
      owner: "Priya Shah",
      email: "priya@homenest.com",
      category: "Home & Living",
      products: 98,
      orders: 241,
      revenue: "$14,850",
      status: "Active",
      joined: "Jul 28, 2026",
      initials: "HN",
    },
    {
      id: 3,
      name: "FashionHub",
      owner: "Neha Patel",
      email: "neha@fashionhub.com",
      category: "Fashion",
      products: 215,
      orders: 198,
      revenue: "$12,640",
      status: "Active",
      joined: "Jul 24, 2026",
      initials: "FH",
    },
    {
      id: 4,
      name: "SportsZone",
      owner: "Arjun Joshi",
      email: "arjun@sportszone.com",
      category: "Sports",
      products: 74,
      orders: 154,
      revenue: "$9,840",
      status: "Active",
      joined: "Jul 19, 2026",
      initials: "SZ",
    },
    {
      id: 5,
      name: "GlowBeauty",
      owner: "Aisha Khan",
      email: "aisha@glowbeauty.com",
      category: "Beauty",
      products: 63,
      orders: 87,
      revenue: "$6,240",
      status: "Pending",
      joined: "Aug 07, 2026",
      initials: "GB",
    },
    {
      id: 6,
      name: "BookWorld",
      owner: "Dev Desai",
      email: "dev@bookworld.com",
      category: "Books",
      products: 145,
      orders: 96,
      revenue: "$5,420",
      status: "Pending",
      joined: "Aug 06, 2026",
      initials: "BW",
    },
    {
      id: 7,
      name: "UrbanKitchen",
      owner: "Karan Shah",
      email: "karan@urbankitchen.com",
      category: "Kitchen",
      products: 52,
      orders: 63,
      revenue: "$4,180",
      status: "Suspended",
      joined: "Jun 18, 2026",
      initials: "UK",
    },
  ];

  /* Admin Products */

  const adminProducts = [
    {
      id: 1,
      name: "Aster Pro ANC Headphones",
      vendor: "ElectroCore",
      category: "Electronics",
      price: 7499,
      mrp: 9999,
      stock: 24,
      rating: 4.8,
      reviews: 218,
      status: "Active",
      image: "A",
      description: "Premium ANC headphones with 42-hour battery life.",
      createdAt: "Aug 05, 2026",
    },
    {
      id: 2,
      name: "Kosha Everyday Laptop 14",
      vendor: "Byte Bazaar",
      category: "Laptops",
      price: 58990,
      mrp: 64990,
      stock: 8,
      rating: 4.6,
      reviews: 94,
      status: "Active",
      image: "K",
      description: "Everyday laptop with 16GB RAM and 512GB SSD.",
      createdAt: "Aug 04, 2026",
    },
    {
      id: 3,
      name: "Mitti Hand-thrown Dinner Set",
      vendor: "Mitti Studio",
      category: "Home & Kitchen",
      price: 2190,
      mrp: 2790,
      stock: 42,
      rating: 4.9,
      reviews: 71,
      status: "Active",
      image: "M",
      description: "Handmade stoneware dinner set of six pieces.",
      createdAt: "Aug 03, 2026",
    },
    {
      id: 4,
      name: "Reva Cotton Overshirt",
      vendor: "FashionHub",
      category: "Fashion",
      price: 1899,
      mrp: 2499,
      stock: 16,
      rating: 4.5,
      reviews: 182,
      status: "Active",
      image: "R",
      description: "Comfortable 100% cotton relaxed-fit overshirt.",
      createdAt: "Aug 01, 2026",
    },
    {
      id: 5,
      name: "Sattva Brass Table Lamp",
      vendor: "HomeNest",
      category: "Home & Kitchen",
      price: 3290,
      mrp: 4590,
      stock: 12,
      rating: 4.7,
      reviews: 63,
      status: "Active",
      image: "S",
      description: "Hand-finished brass table lamp with warm LED.",
      createdAt: "Jul 30, 2026",
    },
    {
      id: 6,
      name: "Drift Running Shoes",
      vendor: "SportsZone",
      category: "Sports",
      price: 3199,
      mrp: 3999,
      stock: 31,
      rating: 4.4,
      reviews: 117,
      status: "Active",
      image: "D",
      description: "Breathable running shoes with EVA sole.",
      createdAt: "Jul 28, 2026",
    },
    {
      id: 7,
      name: "Monsoon Greens Tea Chest",
      vendor: "GlowBeauty",
      category: "Grocery",
      price: 980,
      mrp: 1250,
      stock: 65,
      rating: 4.9,
      reviews: 46,
      status: "Pending",
      image: "T",
      description: "Collection of four single-estate tea blends.",
      createdAt: "Aug 07, 2026",
    },
    {
      id: 8,
      name: "The Bombay Recipe Journal",
      vendor: "BookWorld",
      category: "Books",
      price: 799,
      mrp: 999,
      stock: 18,
      rating: 4.8,
      reviews: 38,
      status: "Pending",
      image: "P",
      description: "Hardbound cookbook with 224 pages.",
      createdAt: "Aug 06, 2026",
    },
  ];

  /* Admin Category Data */

  const adminCategories = [
    {
      id: 1,
      name: "Electronics",
      description: "Mobiles, headphones, gadgets and electronic accessories.",
      products: 124,
      status: "Active",
      icon: "E",
      createdAt: "Aug 02, 2026",
    },
    {
      id: 2,
      name: "Home & Living",
      description: "Furniture, home decoration and everyday home products.",
      products: 98,
      status: "Active",
      icon: "H",
      createdAt: "Jul 28, 2026",
    },
    {
      id: 3,
      name: "Fashion",
      description: "Clothing, footwear and fashion accessories.",
      products: 215,
      status: "Active",
      icon: "F",
      createdAt: "Jul 24, 2026",
    },
    {
      id: 4,
      name: "Sports",
      description: "Sports equipment, fitness products and accessories.",
      products: 74,
      status: "Active",
      icon: "S",
      createdAt: "Jul 19, 2026",
    },
    {
      id: 5,
      name: "Beauty",
      description: "Skincare, makeup, haircare and personal care products.",
      products: 63,
      status: "Active",
      icon: "B",
      createdAt: "Aug 07, 2026",
    },
    {
      id: 6,
      name: "Books",
      description: "Books, journals, educational and reading materials.",
      products: 145,
      status: "Active",
      icon: "B",
      createdAt: "Aug 06, 2026",
    },
    {
      id: 7,
      name: "Kitchen",
      description: "Cookware, kitchen appliances and dining products.",
      products: 52,
      status: "Inactive",
      icon: "K",
      createdAt: "Jun 18, 2026",
    },
    {
      id: 8,
      name: "Grocery",
      description: "Food, beverages and daily grocery essentials.",
      products: 86,
      status: "Active",
      icon: "G",
      createdAt: "Aug 05, 2026",
    },
    {
      id: 9,
      name: "Laptops",
      description: "Laptops, notebooks and computer accessories.",
      products: 42,
      status: "Active",
      icon: "L",
      createdAt: "Aug 04, 2026",
    },
  ];

  /* ADMIN ORDERS DATA */

  const adminOrders = [
    {
      id: "SC-10001",

      customer: {
        name: "Aarav Patel",
        email: "aarav@gmail.com",
        phone: "+91 9876543210",
      },

      items: [
        {
          id: "p1",
          name: "Aster Pro ANC Headphones",
          vendor: "ElectroCore",
          quantity: 1,
          price: 7499,
        },
      ],

      subtotal: 7499,
      shipping: 0,
      discount: 500,
      tax: 1260,
      total: 8259,

      payment: {
        method: "UPI",
        status: "Paid",
        transactionId: "TXN982341",
      },

      status: "Processing",

      shippingAddress: {
        name: "Aarav Patel",
        address: "Satellite",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
        country: "India",
      },

      date: "Aug 10, 2026",

      timeline: [
        {
          status: "Order Placed",
          date: "Aug 10, 2026",
          completed: true,
        },
        {
          status: "Payment Confirmed",
          date: "Aug 10, 2026",
          completed: true,
        },
        {
          status: "Processing",
          date: "Aug 10, 2026",
          completed: true,
        },
        {
          status: "Shipped",
          date: "",
          completed: false,
        },
        {
          status: "Delivered",
          date: "",
          completed: false,
        },
      ],
    },

    {
      id: "SC-10002",

      customer: {
        name: "Meera Shah",
        email: "meera@gmail.com",
        phone: "+91 9825012345",
      },

      items: [
        {
          id: "p3",
          name: "Mitti Hand-thrown Dinner Set",
          vendor: "HomeNest",
          quantity: 2,
          price: 2190,
        },
        {
          id: "p5",
          name: "Sattva Brass Table Lamp",
          vendor: "HomeNest",
          quantity: 1,
          price: 3290,
        },
      ],

      subtotal: 7670,
      shipping: 100,
      discount: 300,
      tax: 1345,
      total: 8815,

      payment: {
        method: "Credit / Debit Card",
        status: "Paid",
        transactionId: "TXN982342",
      },

      status: "Shipped",

      shippingAddress: {
        name: "Meera Shah",
        address: "Bodakdev",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380054",
        country: "India",
      },

      date: "Aug 09, 2026",

      timeline: [
        {
          status: "Order Placed",
          date: "Aug 09, 2026",
          completed: true,
        },
        {
          status: "Payment Confirmed",
          date: "Aug 09, 2026",
          completed: true,
        },
        {
          status: "Processing",
          date: "Aug 09, 2026",
          completed: true,
        },
        {
          status: "Shipped",
          date: "Aug 10, 2026",
          completed: true,
        },
        {
          status: "Delivered",
          date: "",
          completed: false,
        },
      ],
    },

    {
      id: "SC-10003",

      customer: {
        name: "Riya Desai",
        email: "riya@gmail.com",
        phone: "+91 9898989898",
      },

      items: [
        {
          id: "p4",
          name: "Reva Cotton Overshirt",
          vendor: "FashionHub",
          quantity: 1,
          price: 1899,
        },
      ],

      subtotal: 1899,
      shipping: 80,
      discount: 0,
      tax: 342,
      total: 2321,

      payment: {
        method: "Cash on Delivery",
        status: "Pending",
        transactionId: null,
      },

      status: "Pending",

      shippingAddress: {
        name: "Riya Desai",
        address: "Vastrapur",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
        country: "India",
      },

      date: "Aug 08, 2026",

      timeline: [
        {
          status: "Order Placed",
          date: "Aug 08, 2026",
          completed: true,
        },
        {
          status: "Payment Confirmed",
          date: "",
          completed: false,
        },
        {
          status: "Processing",
          date: "",
          completed: false,
        },
        {
          status: "Shipped",
          date: "",
          completed: false,
        },
        {
          status: "Delivered",
          date: "",
          completed: false,
        },
      ],
    },

    {
      id: "SC-10004",

      customer: {
        name: "Kabir Joshi",
        email: "kabir@gmail.com",
        phone: "+91 9911223344",
      },

      items: [
        {
          id: "p6",
          name: "Drift Running Shoes",
          vendor: "SportsZone",
          quantity: 1,
          price: 3199,
        },
      ],

      subtotal: 3199,
      shipping: 0,
      discount: 200,
      tax: 540,
      total: 3539,

      payment: {
        method: "UPI",
        status: "Paid",
        transactionId: "TXN982344",
      },

      status: "Delivered",

      shippingAddress: {
        name: "Kabir Joshi",
        address: "Navrangpura",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380009",
        country: "India",
      },

      date: "Aug 05, 2026",

      timeline: [
        {
          status: "Order Placed",
          date: "Aug 05, 2026",
          completed: true,
        },
        {
          status: "Payment Confirmed",
          date: "Aug 05, 2026",
          completed: true,
        },
        {
          status: "Processing",
          date: "Aug 05, 2026",
          completed: true,
        },
        {
          status: "Shipped",
          date: "Aug 06, 2026",
          completed: true,
        },
        {
          status: "Delivered",
          date: "Aug 08, 2026",
          completed: true,
        },
      ],
    },

    {
      id: "SC-10005",

      customer: {
        name: "Nisha Shah",
        email: "nisha@gmail.com",
        phone: "+91 9876501234",
      },

      items: [
        {
          id: "p8",
          name: "The Bombay Recipe Journal",
          vendor: "BookWorld",
          quantity: 1,
          price: 799,
        },
      ],

      subtotal: 799,
      shipping: 60,
      discount: 0,
      tax: 155,
      total: 1014,

      payment: {
        method: "Credit / Debit Card",
        status: "Refunded",
        transactionId: "TXN982345",
      },

      status: "Cancelled",

      shippingAddress: {
        name: "Nisha Shah",
        address: "Thaltej",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380054",
        country: "India",
      },

      date: "Aug 03, 2026",

      timeline: [
        {
          status: "Order Placed",
          date: "Aug 03, 2026",
          completed: true,
        },
        {
          status: "Payment Confirmed",
          date: "Aug 03, 2026",
          completed: true,
        },
        {
          status: "Cancelled",
          date: "Aug 04, 2026",
          completed: true,
        },
        {
          status: "Refunded",
          date: "Aug 05, 2026",
          completed: true,
        },
      ],
    },
  ];

  /* ADMIN CUSTOMERS DATA */

  const adminCustomers = [
    {
      id: "c1",
      name: "Aarav Patel",
      email: "aarav@gmail.com",
      phone: "+91 9876543210",
      status: "Active",
      orders: 12,
      totalSpent: 58490,
      joined: "Jul 12, 2026",
      lastOrder: "Aug 10, 2026",

      address: {
        address: "Satellite",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
        country: "India",
      },

      notes: "Regular customer with multiple successful orders.",

      recentOrders: [
        {
          id: "SC-10001",
          date: "Aug 10, 2026",
          total: 8259,
          status: "Processing",
        },
        {
          id: "SC-09872",
          date: "Aug 02, 2026",
          total: 4599,
          status: "Delivered",
        },
        {
          id: "SC-09741",
          date: "Jul 25, 2026",
          total: 12999,
          status: "Delivered",
        },
      ],
    },

    {
      id: "c2",
      name: "Meera Shah",
      email: "meera@gmail.com",
      phone: "+91 9825012345",
      status: "Active",
      orders: 8,
      totalSpent: 32480,
      joined: "Jul 18, 2026",
      lastOrder: "Aug 09, 2026",

      address: {
        address: "Bodakdev",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380054",
        country: "India",
      },

      notes: "Frequently purchases home and kitchen products.",

      recentOrders: [
        {
          id: "SC-10002",
          date: "Aug 09, 2026",
          total: 8815,
          status: "Shipped",
        },
        {
          id: "SC-09784",
          date: "Jul 30, 2026",
          total: 3490,
          status: "Delivered",
        },
      ],
    },

    {
      id: "c3",
      name: "Riya Desai",
      email: "riya@gmail.com",
      phone: "+91 9898989898",
      status: "Active",
      orders: 5,
      totalSpent: 14250,
      joined: "Jul 24, 2026",
      lastOrder: "Aug 08, 2026",

      address: {
        address: "Vastrapur",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
        country: "India",
      },

      notes: "",

      recentOrders: [
        {
          id: "SC-10003",
          date: "Aug 08, 2026",
          total: 2321,
          status: "Pending",
        },
      ],
    },

    {
      id: "c4",
      name: "Kabir Joshi",
      email: "kabir@gmail.com",
      phone: "+91 9911223344",
      status: "Active",
      orders: 15,
      totalSpent: 68420,
      joined: "Jun 29, 2026",
      lastOrder: "Aug 05, 2026",

      address: {
        address: "Navrangpura",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380009",
        country: "India",
      },

      notes: "High-value customer.",

      recentOrders: [
        {
          id: "SC-10004",
          date: "Aug 05, 2026",
          total: 3539,
          status: "Delivered",
        },
        {
          id: "SC-09642",
          date: "Jul 18, 2026",
          total: 15490,
          status: "Delivered",
        },
      ],
    },

    {
      id: "c5",
      name: "Nisha Shah",
      email: "nisha@gmail.com",
      phone: "+91 9876501234",
      status: "Blocked",
      orders: 3,
      totalSpent: 5210,
      joined: "Jun 15, 2026",
      lastOrder: "Aug 03, 2026",

      address: {
        address: "Thaltej",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380054",
        country: "India",
      },

      notes: "Account temporarily blocked due to repeated payment issues.",

      recentOrders: [
        {
          id: "SC-10005",
          date: "Aug 03, 2026",
          total: 1014,
          status: "Cancelled",
        },
      ],
    },

    {
      id: "c6",
      name: "Dev Mehta",
      email: "dev@gmail.com",
      phone: "+91 9909012345",
      status: "Active",
      orders: 7,
      totalSpent: 21980,
      joined: "Jul 05, 2026",
      lastOrder: "Aug 01, 2026",

      address: {
        address: "Maninagar",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380008",
        country: "India",
      },

      notes: "",

      recentOrders: [
        {
          id: "SC-09912",
          date: "Aug 01, 2026",
          total: 2899,
          status: "Delivered",
        },
      ],
    },
  ];

  /* Admin Payments */

  const adminPayments = [
    {
      id: "PAY-10001",
      orderId: "SC-10001",

      customer: {
        name: "Aarav Patel",
        email: "aarav@gmail.com",
        phone: "+91 9876543210",
      },

      vendor: "ElectroCore",

      method: "UPI",
      gateway: "Razorpay",

      transactionId: "TXN982341",

      amount: 8259,

      subtotal: 7499,
      shipping: 0,
      discount: 500,
      tax: 1260,

      commission: 825.90,
      vendorPayout: 7433.10,

      status: "Paid",

      currency: "INR",

      date: "Aug 10, 2026",

      refund: null,
    },

    {
      id: "PAY-10002",
      orderId: "SC-10002",

      customer: {
        name: "Meera Shah",
        email: "meera@gmail.com",
        phone: "+91 9825012345",
      },

      vendor: "HomeNest",

      method: "Credit / Debit Card",
      gateway: "Razorpay",

      transactionId: "TXN982342",

      amount: 8815,

      subtotal: 7670,
      shipping: 100,
      discount: 300,
      tax: 1345,

      commission: 881.50,
      vendorPayout: 7933.50,

      status: "Paid",

      currency: "INR",

      date: "Aug 09, 2026",

      refund: null,
    },

    {
      id: "PAY-10003",
      orderId: "SC-10003",

      customer: {
        name: "Riya Desai",
        email: "riya@gmail.com",
        phone: "+91 9898989898",
      },

      vendor: "FashionHub",

      method: "Cash on Delivery",
      gateway: "COD",

      transactionId: null,

      amount: 2321,

      subtotal: 1899,
      shipping: 80,
      discount: 0,
      tax: 342,

      commission: 232.10,
      vendorPayout: 2088.90,

      status: "Pending",

      currency: "INR",

      date: "Aug 08, 2026",

      refund: null,
    },

    {
      id: "PAY-10004",
      orderId: "SC-10004",

      customer: {
        name: "Kabir Joshi",
        email: "kabir@gmail.com",
        phone: "+91 9911223344",
      },

      vendor: "SportsZone",

      method: "UPI",
      gateway: "Razorpay",

      transactionId: "TXN982344",

      amount: 3539,

      subtotal: 3199,
      shipping: 0,
      discount: 200,
      tax: 540,

      commission: 353.90,
      vendorPayout: 3185.10,

      status: "Paid",

      currency: "INR",

      date: "Aug 05, 2026",

      refund: null,
    },

    {
      id: "PAY-10005",
      orderId: "SC-10005",

      customer: {
        name: "Nisha Shah",
        email: "nisha@gmail.com",
        phone: "+91 9876501234",
      },

      vendor: "BookWorld",

      method: "Credit / Debit Card",
      gateway: "Razorpay",

      transactionId: "TXN982345",

      amount: 1014,

      subtotal: 799,
      shipping: 60,
      discount: 0,
      tax: 155,

      commission: 101.40,
      vendorPayout: 912.60,

      status: "Refunded",

      currency: "INR",

      date: "Aug 03, 2026",

      refund: {
        amount: 1014,
        status: "Completed",
        reason: "Customer requested cancellation",
        date: "Aug 05, 2026",
      },
    },
  ];

  /* ADMIN PAYOUTS DATA */

  const adminPayouts = [
    {
      id: "PO-10001",

      month: "August 2026",

      vendor: {
        id: 1,
        name: "ElectroCore",
        email: "rahul@electrocore.com",
        initials: "EC",
      },

      grossSales: 85000,

      commission: 8500,

      netPayable: 76500,

      paidAmount: 50000,

      pendingAmount: 26500,

      status: "Partial",

      payoutHistory: [
        {
          id: "TRX-001",
          date: "Aug 05, 2026",
          amount: 20000,
          method: "Bank Transfer",
          transactionId: "UTR45892341",
          status: "Paid",
          note: "First partial settlement",
        },

        {
          id: "TRX-002",
          date: "Aug 10, 2026",
          amount: 15000,
          method: "UPI",
          transactionId: "UPI982341",
          status: "Paid",
          note: "Second vendor payout",
        },

        {
          id: "TRX-003",
          date: "Aug 14, 2026",
          amount: 15000,
          method: "Bank Transfer",
          transactionId: "UTR45892387",
          status: "Paid",
          note: "Third settlement payment",
        },
      ],
    },

    {
      id: "PO-10002",

      month: "August 2026",

      vendor: {
        id: 2,
        name: "HomeNest",
        email: "priya@homenest.com",
        initials: "HN",
      },

      grossSales: 62000,

      commission: 6200,

      netPayable: 55800,

      paidAmount: 55800,

      pendingAmount: 0,

      status: "Paid",
    },

    {
      id: "PO-10003",

      month: "August 2026",

      vendor: {
        id: 3,
        name: "FashionHub",
        email: "neha@fashionhub.com",
        initials: "FH",
      },

      grossSales: 48000,

      commission: 4800,

      netPayable: 43200,

      paidAmount: 0,

      pendingAmount: 43200,

      status: "Pending",
    },

    {
      id: "PO-10004",

      month: "August 2026",

      vendor: {
        id: 4,
        name: "SportsZone",
        email: "arjun@sportszone.com",
        initials: "SZ",
      },

      grossSales: 39500,

      commission: 3950,

      netPayable: 35550,

      paidAmount: 35550,

      pendingAmount: 0,

      status: "Paid",
    },

    {
      id: "PO-10005",

      month: "August 2026",

      vendor: {
        id: 5,
        name: "GlowBeauty",
        email: "aisha@glowbeauty.com",
        initials: "GB",
      },

      grossSales: 22000,

      commission: 2200,

      netPayable: 19800,

      paidAmount: 0,

      pendingAmount: 19800,

      status: "Pending",
    },

    {
      id: "PO-10006",

      month: "July 2026",

      vendor: {
        id: 1,
        name: "ElectroCore",
        email: "rahul@electrocore.com",
        initials: "EC",
      },

      grossSales: 72000,

      commission: 7200,

      netPayable: 64800,

      paidAmount: 64800,

      pendingAmount: 0,

      status: "Paid",
    },

    {
      id: "PO-10007",

      month: "July 2026",

      vendor: {
        id: 2,
        name: "HomeNest",
        email: "priya@homenest.com",
        initials: "HN",
      },

      grossSales: 51000,

      commission: 5100,

      netPayable: 45900,

      paidAmount: 25000,

      pendingAmount: 20900,

      status: "Partial",
    },
  ];

  const [vendorOrders, setVendorOrders] = useState([
    {
      id: "SC-10001",
      orderId: "SC-10001",
      customerName: "Aarav Patel",
      customerEmail: "aarav.patel@example.com",
      customerPhone: "+91 98765 43210",
      productName: "Aster Pro ANC Headphones",
      vendor: "Tech Haven",
      price: 7499,
      quantity: 1,
      itemCount: 1,
      totalAmount: 7499,
      paymentStatus: "Paid",
      status: "Processing",
      shippingStatus: "In Transit",
      courier: "Delhivery",
      trackingNumber: "DEL9823145",
      date: "Aug 10, 2026",
      shippingAddress: {
        street: "123 CG Road, Navrangpura",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380009",
        country: "India",
      },
      timeline: [
        { status: "Order Placed", date: "Aug 10, 2026, 10:30 AM", done: true },
        { status: "Payment Confirmed", date: "Aug 10, 2026, 10:31 AM", done: true },
        { status: "Processing by Vendor", date: "Aug 10, 2026, 02:00 PM", done: true },
        { status: "Shipped", date: "Aug 11, 2026, 09:15 AM", done: false },
        { status: "Delivered", date: "Expected Aug 13, 2026", done: false },
      ],
    },
  ]);

  const [customers, setCustomers] = useState([
    {
      id: "cust-101",
      name: "Aarav Patel",
      email: "aarav.patel@example.com",
      phone: "+91 98765 43210",
      orderCount: 4,
      totalSpent: 29996,
      lastOrderDate: "Aug 10, 2026",
      status: "Active Buyer",
      address: "123 CG Road, Navrangpura, Ahmedabad, Gujarat - 380009",
      recentVendorOrders: [
        { id: "SC-10001", product: "Aster Pro ANC Headphones", amount: 7499, date: "Aug 10, 2026", status: "Processing" },
        { id: "SC-9821", product: "Aster Pro ANC Headphones", amount: 7499, date: "Jun 15, 2026", status: "Delivered" },
      ]
    },
  ]);

  const [inventory, setInventory] = useState([
    {
      id: "p1",
      productName: "Aster Pro ANC Headphones",
      sku: "SKU-AST-001",
      category: "Electronics",
      currentStock: 24,
      reservedStock: 2,
      lowStockThreshold: 10,
      lastUpdated: "Today 10:15 AM",
    },
    {
      id: "p2",
      productName: "Kosha Everyday Laptop 14",
      sku: "SKU-KOS-002",
      category: "Laptops",
      currentStock: 8,
      reservedStock: 1,
      lowStockThreshold: 10,
      lastUpdated: "Yesterday",
    },
  ]);

  // Shared Payouts & Earnings State
  const [earnings, setEarnings] = useState({
    grossSales: 245000,
    platformCommission: 24500,
    refunds: 5000,
    netEarnings: 215500,
    paidOut: 180000,
    pendingPayout: 35500,
    availableBalance: 35500,
  });

  const [payouts, setPayouts] = useState([
    {
      id: "PO-10024",
      vendorName: "Tech Haven",
      period: "01 Aug – 31 Aug 2026",
      grossSales: 85000,
      commission: 8500,
      refunds: 2000,
      adjustments: 500,
      netAmount: 74000,
      payoutDate: "31 Aug 2026",
      paymentMethod: "Bank Transfer (HDFC)",
      status: "Paid",
      transactionId: "PAYTXN98231",
    },
  ]);

  // Shared Store & Profile Info
  const [storeInfo, setStoreInfo] = useState({
    name: "Tech Haven",
    vendorId: "v101",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    description: "Premium electronics, flagship audio gear, and cutting-edge gadget accessories.",
    category: "Electronics & Tech",
    contactEmail: "support@techhaven.com",
    contactPhone: "+91 98765 12345",
    address: "Suite 402, Technology Park, SG Highway",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380054",
    country: "India",
    acceptOrders: true,
    vacationMode: false,
  });

  const [shippingList, setShippingList] = useState([
    {
      id: "SC-10001",
      customerName: "Aarav Patel",
      courier: "Delhivery",
      trackingNumber: "DEL9823145",
      status: "Shipped",
      shippingDate: "2026-08-10",
      expectedDelivery: "2026-08-13",
      address: "123 CG Road, Navrangpura, Ahmedabad, Gujarat - 380009",
    },
  ]);

  const [products, setProducts] = useState(productData)

  return (
    <Routes>
      {/* 404 - Page Not Found */}
      <Route path="*" element={<NotFound />} />

      {/* Authentication */}
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Customer Website */}
      <Route path="/" element={ <CustomerLayout /> } >
        <Route index element={ <HomePage /> } />

        <Route path="/shop" element={ <ShopPage /> } />

        <Route path="/categories" element={ <CategoriesPage /> } />

        <Route path="product/:productId" element={ <ProductPage /> } />

        <Route path="/vendors" element={ <VendorsPage /> } />

        <Route path="/vendor/:vendorId" element={ <VendorStorePage /> } />

        <Route path="/wishlist" element={ <WishlistPage /> } />

        <Route path="/cart" element={ <CartPage /> } />

        <Route path="/compare" element={ <ComparePage /> } />

        <Route path="/checkout" element={<AuthRoute> <CheckoutPage /> </AuthRoute>} />

        <Route path="/orders" element={<AuthRoute> <OrdersPage /> </AuthRoute>} />

        <Route path="/orders/:orderId" element={<AuthRoute> <OrderDetailsPage /> </AuthRoute>} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="/contact" element={<ContactPage />} />

        <Route path="/profile" element={<AuthRoute> <ProfilePage /> </AuthRoute>} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Website */}
      <Route path="/admin" element={<AuthRouteAdmin> <AdminLayout /></AuthRouteAdmin>}>
        <Route path="dashboard" element={ <AdminDashboard />} />

        <Route path="vendors" element={<AdminVendors />} />

        {/* <Route path="vendors/add" element={<AdminAddVendor />} /> */}

        {/* <Route path="vendors/edit/:vendorId" element={<AdminEditVendor vendors={adminVendors} /> } /> */}

        <Route path="vendors/:vendorId" element={<AdminViewVendor />} />

        <Route path="products" element={<AdminProducts />} />

        {/* <Route path="products/add"  element={<AdminAddProduct />} /> */}

        <Route path="products/:productId" element={ <AdminProductView />}/>

        {/* <Route path="products/:productId/edit" element={<AdminEditProduct products={adminProducts} /> } /> */}

        <Route path="categories" element={<AdminCategories />} />

        <Route path="categories/add" element={<AdminAddCategory />} />

        <Route path="categories/:categoryId" element={<AdminViewCategory />} />

        <Route path="categories/:categoryId/edit" element={<AdminEditCategory />} />

        <Route
          path="orders"
          element={
            <AdminOrders
              orders={adminOrders}
            />
          }
        />

        <Route
          path="orders/:orderId"
          element={
            <AdminViewOrder
              orders={adminOrders}
            />
          }
        />

        <Route
          path="orders/:orderId/edit"
          element={
            <AdminEditOrder
              orders={adminOrders}
            />
          }
        />

        <Route path="customers" element={ <AdminCustomers customers={adminCustomers} /> } />

        <Route path="customers/:customerId" element={ <AdminViewCustomer customers={adminCustomers} /> } />

        <Route path="contact" element={ <AdminContactMessages /> } />

        {/* <Route path="customers/:customerId/edit" element={<AdminEditCustomer customers={adminCustomers} /> } /> */}

        <Route
          path="payments"
          element={
            <AdminPayments
              payments={adminPayments}
            />
          }
        />

        <Route
          path="payments/:paymentId"
          element={
            <AdminViewPayment
              payments={adminPayments}
            />
          }
        />

        <Route
          path="payments/:paymentId/edit"
          element={
            <AdminEditPayment
              payments={adminPayments}
            />
          }
        />

        <Route
          path="refunds"
          element={
            <AdminRefunds
              refunds={[]}
            />
          }
        />

        <Route
          path="refunds/:refundId"
          element={<AdminViewRefund />}
        />

        <Route
          path="refunds/:paymentId/edit"
          element={
            <AdminEditRefund
              payments={adminPayments}
            />
          }
        />

        <Route
          path="payouts"
          element={
            <AdminPayouts
              payouts={adminPayouts}
            />
          }
        />

        <Route
          path="payouts/:payoutId"
          element={
            <AdminViewPayout
              payouts={adminPayouts}
            />
          }
        />

        <Route
          path="payouts/:payoutId/make"
          element={
            <AdminMakePayout
              payouts={adminPayouts}
              vendors={adminVendors}
            />
          }
        />

        <Route path="profile" element={<AdminProfile />} />

        <Route path="profile/edit" element={<AdminProfileEdit />} />

        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Vendor Authentication */}
      <Route path="/vendor/login" element={<VendorLogin />} />
      <Route path="/vendor/register" element={<VendorRegisterPage />} />
      <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} />

      {/* ================= VENDOR PANEL ROUTES ================= */}
      <Route path="/vendor" element={<AuthRouteVendor> <VendorLayout /> </AuthRouteVendor>}>
        <Route index element={<VendorDashboard orders={orders} products={products} />} />
        <Route path="products" element={<VendorProducts products={products} setProducts={setProducts} />} />
        <Route path="products/add" element={<VendorAddProduct setProducts={setProducts} />} />
        <Route path="products/:productId" element={<VendorViewProduct products={products} />} />
        <Route path="products/:productId/edit" element={<VendorEditProduct products={products} setProducts={setProducts} />} />

        <Route path="orders" element={<VendorOrders orders={vendorOrders} setOrders={setVendorOrders} />} />
        <Route path="orders/:orderId" element={<VendorViewOrder orders={vendorOrders} />} />
        <Route path="orders/:orderId/update" element={<VendorUpdateOrder orders={vendorOrders} setOrders={setVendorOrders} />} />

        <Route path="inventory" element={<VendorInventory inventory={inventory} setInventory={setInventory} />} />
        <Route path="inventory/:productId/update" element={<VendorUpdateStock inventory={inventory} setInventory={setInventory} />} />

        <Route path="earnings" element={<VendorEarnings earnings={earnings} />} />
        <Route path="payouts" element={<VendorPayouts payouts={payouts} />} />
        <Route path="payouts/:payoutId" element={<VendorPayoutDetail payouts={payouts} />} />

        <Route path="customers" element={<VendorCustomers customers={customers} />} />
        <Route path="customers/:customerId" element={<VendorViewCustomer customers={customers} />} />

        <Route path="store" element={<VendorStore storeInfo={storeInfo} setStoreInfo={setStoreInfo} />} />
        <Route path="shipping" element={<VendorShipping shippingList={shippingList} />} />
        <Route path="shipping/:orderId" element={<VendorShippingOrder shippingList={shippingList} setShippingList={setShippingList} />} />
        <Route path="profile" element={<VendorProfile />} />
        <Route path="profile/edit" element={<VendorProfileEdit />} />
        <Route path="settings" element={<VendorSettings />} />
      </Route>
    </Routes>
  );
}

export default App;