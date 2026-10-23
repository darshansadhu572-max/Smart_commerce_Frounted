import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleAuthError } from "../../AuthRoute";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  TrendingUp,
  Loader2,
  ShoppingBag,
  Truck,
  Sparkles,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { addToCompare } from "../../utils/compareUtils";

const API_BASE_URL = "http://localhost:5000/api/customer";

// AUTH HELPERS
const getToken = () => localStorage.getItem("token") || null;
const isLoggedIn = () => Boolean(getToken());

// FORMATTERS
const formatMoney = (val) => {
  const num = Number(val);
  return isNaN(num) ? "₹0" : `₹${num.toLocaleString("en-IN")}`;
};

const getInitials = (name) => {
  if (!name) return "SC";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

// COMPONENT
const HomePage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // wishedIds — array of product ID strings
  const [wishedIds, setWishedIds] = useState([]);

  // FETCH HOME DATA
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes, venRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/categories`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/vendors`).catch(() => ({ data: [] })),
        ]);

        const prodData = prodRes.data;
        setProducts(
          Array.isArray(prodData)
            ? prodData
            : prodData.products || prodData.data || [],
        );

        const catData = catRes.data;
        setCategories(
          Array.isArray(catData)
            ? catData
            : catData.categories || catData.data || [],
        );

        const venData = venRes.data;
        setVendors(
          Array.isArray(venData)
            ? venData
            : venData.vendors || venData.data || [],
        );
      } catch (err) {
        console.error("Error loading home page data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // LOAD WISHLIST (DB if logged in, localStorage if guest)
  useEffect(() => {
    const loadWishlist = async () => {
      if (isLoggedIn()) {
        try {
          const res = await axios.get(`${API_BASE_URL}/wishlist`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          });
          if (res.data.success) {
            const ids = res.data.wishlist.map((item) =>
              String(item.product?._id || item.product),
            );
            setWishedIds(ids);
          }
        } catch (err) {
          handleAuthError(err);
          console.error("Failed to load wishlist from DB:", err);
        }
      } else {
        try {
          const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
          const ids = stored.map((item) => String(item._id || item.id || item));
          setWishedIds(ids);
        } catch {
          setWishedIds([]);
        }
      }
    };

    loadWishlist();
  }, []);

  // CART HANDLER
  const handleCart = async (product) => {
    const pId = product._id || product.id;
    if (isLoggedIn()) {
      try {
        await axios.post(
          `${API_BASE_URL}/cart/add`,
          { productId: pId, quantity: 1 },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        handleAuthError(err);
        console.error("Cart DB error:", err);
      }
    } else {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find((item) => (item._id || item.id) === pId);
        const updated = existing
          ? cart.map((item) =>
              (item._id || item.id) === pId
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item,
            )
          : [...cart, { ...product, quantity: 1 }];
        localStorage.setItem("cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        console.error("Cart localStorage error:", err);
      }
    }
  };

  // WISHLIST HANDLER
  const handleWish = async (product) => {
    const pId = String(product._id || product.id);
    if (isLoggedIn()) {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/wishlist/toggle`,
          { productId: pId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );
        if (res.data.success) {
          setWishedIds(res.data.wishlistIds.map(String));
          window.dispatchEvent(new Event("wishlistUpdated"));
        }
      } catch (err) {
        handleAuthError(err);
        console.error("Wishlist DB error:", err);
      }
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const isWished = wishedIds.includes(pId);
        const updated = isWished
          ? stored.filter((item) => String(item._id || item.id || item) !== pId)
          : [...stored, product];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setWishedIds(
          updated.map((item) => String(item._id || item.id || item)),
        );
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (err) {
        console.error("Wishlist localStorage error:", err);
      }
    }
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const featuredProduct = products[0];

  return (
    <main className="bg-background text-foreground">
      {/* ANNOUNCEMENT BANNER */}
      <div className="bg-[#172f2c] py-2.5 px-4 text-center text-xs font-medium text-white sm:text-sm shadow-inner">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <Truck size={16} className="text-amber-300 animate-bounce shrink-0" />
          <span>
            Free Delivery on all orders over{" "}
            <strong className="text-amber-300 font-extrabold text-sm sm:text-base">
              ₹999
            </strong>
          </span>
          <Sparkles
            size={14}
            className="text-amber-300 shrink-0 hidden sm:inline"
          />
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#e6eee7] px-4 py-14 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_.95fr]">
          {/* LEFT */}
          <div className="rise">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#287b6d]">
              The considered marketplace
            </p>

            <h1 className="display max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Shop smarter.
              <br />
              Compare better.
              <br />
              <span className="text-[#287b6d]">Buy confidently.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover products from trusted vendors, compare your options, and
              find the right deal — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <RouterLink
                to="/shop"
                className="rounded-xl bg-[#287b6d] px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-[#226b60]"
              >
                Explore products
              </RouterLink>

              <RouterLink
                to="/compare"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-[#287b6d] hover:text-[#287b6d] transition"
              >
                Compare products
              </RouterLink>
            </div>

            {/* DYNAMIC STATS */}
            <div className="mt-10 flex flex-wrap gap-8 border-t border-slate-200 pt-6">
              <div>
                <p className="display text-xl font-extrabold">
                  {vendors.length || "0"}
                </p>
                <p className="text-xs text-slate-500">trusted vendors</p>
              </div>
              <div>
                <p className="display text-xl font-extrabold">
                  {products.length || "0"}
                </p>
                <p className="text-xs text-slate-500">active products</p>
              </div>
            </div>
          </div>

          {/* RIGHT - FEATURED PRODUCT */}
          <div className="relative rise delay-2">
            {featuredProduct ? (
              <div className="rounded-[1.5rem] bg-[#172f2c] p-5 text-white shadow-[0_20px_50px_rgba(23,47,44,0.18)] sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                    Smart Pick
                  </p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-amber-300">
                    Featured
                  </span>
                </div>

                <div className="mx-auto flex h-44 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900 via-teal-700 to-amber-600 sm:h-48">
                  <span className="display text-[90px] font-extrabold text-white/90 drop-shadow-lg">
                    {getInitials(featuredProduct.name)}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold text-amber-300">
                    {featuredProduct.vendor?.storeName?.trim() || ""}
                  </p>

                  <h2 className="display mt-1 text-xl font-extrabold sm:text-2xl truncate">
                    {featuredProduct.name}
                  </h2>

                  <p className="mt-2 text-xs text-white/60 line-clamp-1">
                    {featuredProduct.shortDescription}
                  </p>

                  <p className="mt-2 text-xs text-white/60 line-clamp-1">
                    {featuredProduct.longDescription}
                  </p>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xl font-extrabold">
                        {formatMoney(
                          featuredProduct.discountPrice ||
                            featuredProduct.price,
                        )}
                      </p>
                      {featuredProduct.price >
                        (featuredProduct.discountPrice || 0) && (
                        <p className="text-xs text-white/40 line-through">
                          {formatMoney(featuredProduct.price)}
                        </p>
                      )}
                    </div>

                    <RouterLink
                      to={`/product/${featuredProduct._id || featuredProduct.id}`}
                      className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 hover:bg-white/90 transition"
                    >
                      View product
                    </RouterLink>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-[#172f2c] p-8 text-white text-center">
                <ShoppingBag size={40} className="mx-auto text-white/40 mb-3" />
                <p className="text-sm font-bold">Discover Market Products</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION (LIMITED TO 6 CATEGORIES) */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#287b6d]">
              BROWSE BY CATEGORY
            </p>
            <h2 className="display mt-2 text-2xl font-extrabold sm:text-3xl text-slate-900">
              Find your next favourite
            </h2>
          </div>

          <RouterLink
            to="/categories"
            className="hidden items-center gap-1 text-sm font-bold text-[#287b6d] hover:underline sm:flex"
          >
            All categories
            <ArrowRight size={15} />
          </RouterLink>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[#287b6d]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((category, index) => {
              const catId = category._id || category.id;
              const slug = (category.slug || category.name || "")
                .toLowerCase()
                .replace(/\s+/g, "-");
              const iconText =
                category.icon || category.name?.charAt(0).toUpperCase();

              return (
                <RouterLink
                  key={catId}
                  to={`/shop?category=${slug}`}
                  className={`group rounded-2xl border p-4 transition hover:-translate-y-1 ${
                    index === 0
                      ? "border-[#287b6d] bg-[#287b6d] text-white"
                      : "border-slate-200 bg-white hover:border-[#287b6d]"
                  }`}
                >
                  <span
                    className={`grid size-10 place-items-center rounded-xl text-lg font-bold ${
                      index === 0
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {iconText}
                  </span>

                  <h3 className="mt-3 text-sm font-bold truncate">
                    {category.name}
                  </h3>

                  <p
                    className={`mt-1 line-clamp-2 text-[10px] leading-4 ${
                      index === 0 ? "text-white/70" : "text-slate-500"
                    }`}
                  >
                    {category.description || "Quality items"}
                  </p>

                  <p
                    className={`mt-3 text-[10px] font-bold ${
                      index === 0 ? "text-white/80" : "text-[#287b6d]"
                    }`}
                  >
                    {category.productsCount || category.products || 0} products
                  </p>
                </RouterLink>
              );
            })}
          </div>
        )}
      </section>

      {/* THE EDIT — FEATURED PRODUCTS (LIMITED TO 4 PRODUCTS) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#287b6d]">
              The edit
            </p>
            <h2 className="display mt-2 text-2xl font-extrabold sm:text-3xl text-slate-900">
              Good things, selling fast
            </h2>
          </div>

          <RouterLink
            to="/shop"
            className="hidden items-center gap-1 text-sm font-bold text-[#287b6d] hover:underline sm:flex"
          >
            Shop all
            <ArrowRight size={15} />
          </RouterLink>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onCart={() => handleCart(product)}
              onWish={() => handleWish(product)}
              wished={wishedIds.includes(String(product._id || product.id))}
              onCompare={() => addToCompare(product)}
            />
          ))}
        </div>

        {/* View Cart button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGoToCart}
            className="inline-flex items-center gap-2 rounded-xl bg-[#287b6d] px-6 py-3 text-sm font-bold text-white hover:bg-[#226b60] transition"
          >
            <ShoppingBag size={16} />
            View Cart
          </button>
        </div>

        <RouterLink
          to="/shop"
          className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-[#287b6d] sm:hidden"
        >
          Shop all
          <ArrowRight size={15} />
        </RouterLink>
      </section>

      {/* COMPARISON STRIP */}
      <section className="mx-4 my-8 overflow-hidden rounded-[2rem] bg-slate-900 text-white sm:mx-6 lg:mx-auto lg:max-w-7xl">
        <div className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-10">
          <div>
            <p className="mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
              Make the call
            </p>
            <h2 className="display mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              Less scrolling.
              <br />
              More certainty.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
              Put products side by side. We'll surface the trade-offs so your
              choice feels like yours.
            </p>
            <RouterLink
              to="/compare"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 hover:-translate-y-0.5 transition"
            >
              Try compare
              <ArrowRight size={15} />
            </RouterLink>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {products.slice(0, 4).map((product, index) => (
              <div
                key={product._id || product.id}
                className={`rounded-2xl p-3 ${
                  index === 1 ? "bg-amber-300 text-slate-900" : "bg-white/10"
                }`}
              >
                <div className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-slate-800 text-white font-extrabold text-2xl">
                  {getInitials(product.name)}
                </div>

                <p className="mt-3 line-clamp-2 text-xs font-bold">
                  {product.name}
                </p>

                <p className="mt-2 line-clamp-2 text-[10px] text-white/60">
                  {product.shortDescription}
                </p>

                <p
                  className={`mt-2 text-sm font-extrabold ${index === 1 ? "text-slate-900" : "text-white"}`}
                >
                  {formatMoney(product.discountPrice || product.price)}

                  {product.price > (product.discountPrice || 0) && (
                    <span
                      className={`block text-xs font-normal line-through ${index === 1 ? "text-slate-700" : "text-white/40"}`}
                    >
                      {formatMoney(product.price)}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VENDORS SECTION (LIMITED TO 4 VENDORS) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#287b6d]">
            The people behind it
          </p>
          <h2 className="display mt-2 text-2xl font-extrabold sm:text-3xl text-slate-900">
            Independent stores, properly introduced
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vendors.slice(0, 4).map((vendor) => {
            const vId = vendor._id || vendor.id;
            const vName = vendor.storeName || vendor.businessName || "Vendor";
            const vDesc =
              vendor.storeDescription ||
              vendor.description ||
              "Trusted marketplace store.";

            return (
              <RouterLink
                key={vId}
                to={`/vendor/${vId}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-[#287b6d] shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-12 place-items-center rounded-2xl bg-[#287b6d] font-extrabold text-white text-base">
                    {getInitials(vName)}
                  </div>
                </div>

                <h3 className="display mt-5 font-extrabold text-slate-900 group-hover:text-[#287b6d] transition">
                  {vName}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {vendor.businessType || "Independent Seller"}
                </p>

                <p className="mt-3 line-clamp-3 text-sm leading-5 text-slate-600">
                  {vDesc}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] font-bold text-slate-700">
                  <span>{vendor.productCount || 0} products</span>
                </div>
              </RouterLink>
            );
          })}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 text-[#287b6d]" size={20} />
            <div>
              <p className="text-sm font-bold text-slate-900">
                Trusted vendors
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Every store is reviewed before joining.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <TrendingUp className="mt-0.5 text-[#287b6d]" size={20} />
            <div>
              <p className="text-sm font-bold text-slate-900">
                Compare before buying
              </p>
              <p className="mt-1 text-xs text-slate-500">
                See products side by side.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Heart className="mt-0.5 text-[#287b6d]" size={20} />
            <div>
              <p className="text-sm font-bold text-slate-900">
                Your choices, your way
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Save products and build your wishlist.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
