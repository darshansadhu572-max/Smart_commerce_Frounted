import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleAuthError } from "../../AuthRoute";
import {
  Heart,
  ShoppingCart,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Store,
  GitCompare,
  Minus,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { addToCompare } from "../../utils/compareUtils";

const API_BASE_URL = "http://localhost:5000/api/customer";

const getToken = () => localStorage.getItem("token") || null;
const isLoggedIn = () => Boolean(getToken());

const formatMoney = (val) => {
  const num = Number(val);
  return isNaN(num) ? "₹0" : `₹${num.toLocaleString("en-IN")}`;
};

const getInitials = (name) => {
  if (!name) return "SC";
  const words = String(name).trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return String(name).slice(0, 2).toUpperCase();
};

const getSafeText = (value, fallback = "") => {
  if (value === null || value === undefined) return fallback;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => getSafeText(item))
      .filter(Boolean)
      .join(", ");
  }
  if (typeof value === "object") {
    if (value.name !== undefined && value.value !== undefined) {
      return `${getSafeText(value.name)}: ${getSafeText(value.value)}`;
    }
    if (value.name !== undefined) return getSafeText(value.name);
    if (value.value !== undefined) return getSafeText(value.value);
    return "";
  }
  return fallback;
};

const ProductVisual = ({ product, large = false }) => {
  const categoryName =
    typeof product.category === "object"
      ? product.category?.name || "General"
      : product.category || "General";

  const mark = product.mark || getInitials(product.name);
  const tone = product.tone || "from-teal-800 via-teal-700 to-amber-600";

  return (
    <div
      className={`relative flex ${
        large ? "min-h-[390px]" : "aspect-square"
      } items-center justify-center overflow-hidden rounded-[1.25rem] bg-gradient-to-br ${tone}`}
    >
      <span
        className={`display font-extrabold text-white/90 drop-shadow-sm ${
          large ? "text-[120px] sm:text-[150px]" : "text-[50px] sm:text-[70px]"
        }`}
      >
        {mark}
      </span>

      <span className="absolute bottom-4 left-4 rounded-full bg-black/20 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur">
        {categoryName}
      </span>
    </div>
  );
};

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [qty, setQty] = useState(1);
  const [alertMsg, setAlertMsg] = useState("");
  const [wishedIds, setWishedIds] = useState([]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        let foundProduct = null;
        try {
          const res = await axios.get(`${API_BASE_URL}/products/${productId}`);
          foundProduct = res.data.product || res.data;
        } catch {
          const res = await axios.get(`${API_BASE_URL}/products`);
          const list = Array.isArray(res.data)
            ? res.data
            : res.data.products || [];
          foundProduct = list.find(
            (item) => String(item._id || item.id) === String(productId),
          );
        }

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Load wishlist IDs
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
            setWishedIds(
              res.data.wishlist.map((item) =>
                String(item.product?._id || item.product),
              ),
            );
          }
        } catch (err) {
          handleAuthError(err);
          console.error("Wishlist fetch error:", err);
        }
      } else {
        try {
          const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
          setWishedIds(
            stored.map((item) => String(item._id || item.id || item)),
          );
        } catch {
          setWishedIds([]);
        }
      }
    };

    loadWishlist();
  }, []);

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => {
      setAlertMsg("");
    }, 2500);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const pId = product._id || product.id;

    if (isLoggedIn()) {
      try {
        await axios.post(
          `${API_BASE_URL}/cart/add`,
          { productId: pId, quantity: qty },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );

        window.dispatchEvent(new Event("cartUpdated"));
        showAlert(
          qty === 1 ? "Added to your cart" : `${qty} items added to your cart`,
        );
      } catch (err) {
        handleAuthError(err);
        console.error("Cart error:", err);
        alert("Failed to add product to cart.");
      }
    } else {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find((item) => (item._id || item.id) === pId);
        const updated = existing
          ? cart.map((item) =>
              (item._id || item.id) === pId
                ? { ...item, quantity: (item.quantity || 1) + qty }
                : item,
            )
          : [...cart, { ...product, quantity: qty }];

        localStorage.setItem("cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cartUpdated"));
        showAlert(
          qty === 1 ? "Added to your cart" : `${qty} items added to your cart`,
        );
      } catch (err) {
        console.error("Cart storage error:", err);
      }
    }
  };

  const handleWishToggle = async () => {
    if (!product) return;
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
        console.error("Wishlist storage error:", err);
      }
    }
  };

  const handleCompareClick = () => {
    if (product) {
      addToCompare(product);
      navigate("/compare");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-sm font-semibold">Loading product details...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-background px-4 py-20 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary mb-4 text-red-500">
          <AlertCircle size={28} />
        </div>
        <h1 className="display text-2xl font-extrabold">
          {error || "Product not found"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
        >
          Back to shop
        </Link>
      </main>
    );
  }

  const pId = String(product._id || product.id);

  const categoryName =
    typeof product.category === "object"
      ? product.category?.name || "General"
      : product.category || "General";

  const categorySlug =
    typeof product.category === "object"
      ? product.category?.slug ||
        categoryName.toLowerCase().replace(/\s+/g, "-")
      : String(categoryName).toLowerCase().replace(/\s+/g, "-");

  const vendorName =
    typeof product.vendor === "object"
      ? product.vendor?.storeName ||
        `${product.vendor?.firstName || ""} ${product.vendor?.lastName || ""}`.trim() ||
        "Trusted Vendor"
      : product.vendor || "Trusted Vendor";

  const vendorId =
    typeof product.vendor === "object"
      ? product.vendor?._id
      : product.vendorId || "";

  const isWished = wishedIds.includes(pId);
  const sellingPrice = product.discountPrice || product.price || 0;
  const originalPrice = product.mrp || product.price || sellingPrice;

  const discountPercent =
    originalPrice > sellingPrice
      ? Math.round((1 - sellingPrice / originalPrice) * 100)
      : 0;

  const specsList = Array.isArray(product.specifications)
    ? product.specifications
        .map((spec) => {
          if (
            spec !== null &&
            typeof spec === "object" &&
            !Array.isArray(spec)
          ) {
            return {
              name: getSafeText(spec.name, "Specification"),
              value: getSafeText(spec.value),
              isKeyFeature: Boolean(spec.isKeyFeature),
              id: spec._id || `${spec.name}-${spec.value}`,
            };
          }
          return {
            name: "",
            value: getSafeText(spec),
            isKeyFeature: true,
            id: getSafeText(spec),
          };
        })
        .filter((spec) => spec.value || spec.name)
    : typeof product.specs === "string"
      ? product.specs
          .split("·")
          .map((item, index) => ({
            name: "",
            value: item.trim(),
            isKeyFeature: true,
            id: `spec-${index}`,
          }))
          .filter((spec) => spec.value)
      : [
          { name: "", value: categoryName, isKeyFeature: true, id: "category" },
          {
            name: "",
            value: "Quality Verified",
            isKeyFeature: true,
            id: "quality",
          },
          {
            name: "",
            value: "Free Delivery Eligible",
            isKeyFeature: true,
            id: "delivery",
          },
        ];

  const descriptionText =
    product.longDescription ||
    product.description ||
    product.shortDescription ||
    `The ${getSafeText(product.name, "product")} is designed for customers looking for dependable quality and practical everyday performance.`;

  const stockValue = Number(product.stock || 0);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/shop?category=${categorySlug}`}
            className="hover:text-primary"
          >
            {categoryName}
          </Link>
          <span>/</span>
          <span className="line-clamp-1 text-foreground font-semibold">
            {getSafeText(product.name)}
          </span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-6">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[80px_1fr] gap-3 sm:gap-4">
              <div className="space-y-3">
                {[1, 2, 3].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-full rounded-xl overflow-hidden ${
                      index === 0
                        ? "ring-2 ring-primary ring-offset-2"
                        : "opacity-75"
                    }`}
                  >
                    <ProductVisual product={product} />
                  </button>
                ))}
              </div>

              <ProductVisual product={product} large />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-border bg-card p-3 text-center">
                <ShieldCheck size={18} className="mx-auto text-primary" />
                <p className="mt-1 text-[10px] font-bold">Verified product</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-3 text-center">
                <Truck size={18} className="mx-auto text-primary" />
                <p className="mt-1 text-[10px] font-bold">Fast delivery</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <Link
                to={vendorId ? `/vendor/${vendorId}` : "#"}
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
              >
                <Store size={15} />
                {vendorName}
              </Link>

              <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-[10px] font-bold text-teal-800">
                <CheckCircle2 size={12} />
                Verified vendor
              </span>
            </div>

            <h1 className="display mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {getSafeText(product.name)}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {categoryName}
              </span>
            </div>

            <div className="mt-7 rounded-2xl bg-secondary p-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-extrabold">
                  {formatMoney(sellingPrice)}
                </span>

                {originalPrice > sellingPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatMoney(originalPrice)}
                  </span>
                )}

                {discountPercent > 0 && (
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white">
                    {discountPercent}% off
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Inclusive of all applicable taxes
              </p>
            </div>

            <p className="mt-6 text-sm leading-6 text-muted-foreground">
              {getSafeText(product.shortDescription, descriptionText)}
            </p>

            {specsList.length > 0 && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-5">
                <h2 className="display font-bold text-sm">
                  Key specifications
                </h2>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {specsList.map((spec, i) => (
                    <div
                      key={spec.id || i}
                      className="rounded-xl bg-muted px-3 py-2 text-xs font-semibold"
                    >
                      {spec.name ? (
                        <>
                          <span className="text-muted-foreground">
                            {spec.name}:
                          </span>{" "}
                          <span>{spec.value}</span>
                        </>
                      ) : (
                        <span>{spec.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-2">
              {stockValue < 10 ? (
                <>
                  <span className="size-2 rounded-full bg-red-500" />
                  <span className="text-xs font-bold text-red-600">
                    Only {stockValue} left in stock
                  </span>
                </>
              ) : (
                <>
                  <span className="size-2 rounded-full bg-green-500" />
                  <span className="text-xs font-bold text-green-700">
                    In stock · Ready to dispatch
                  </span>
                </>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setQty((curr) => Math.max(1, curr - 1))}
                  className="grid size-11 place-items-center hover:bg-muted"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>

                <span className="w-10 text-center text-sm font-bold">
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQty((curr) => Math.min(stockValue || 99, curr + 1))
                  }
                  className="grid size-11 place-items-center hover:bg-muted"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleWishToggle}
                className={`grid size-11 place-items-center rounded-xl border border-border transition ${
                  isWished
                    ? "text-red-600 border-red-200 bg-red-50"
                    : "text-muted-foreground hover:border-primary"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart size={18} fill={isWished ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition"
              >
                <ShoppingCart size={17} />
                Add to cart
              </button>

              <button
                type="button"
                onClick={handleCompareClick}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-bold hover:border-primary hover:text-primary transition"
              >
                <GitCompare size={17} />
                Compare
              </button>
            </div>

            {alertMsg && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-teal-100 px-4 py-3 text-sm font-semibold text-teal-800">
                <CheckCircle2 size={17} />
                {alertMsg}
              </div>
            )}

            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
              <div className="flex gap-4 p-4">
                <Truck size={20} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold">Free delivery</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Estimated delivery within 3–5 business days.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <div>
                  <p className="text-sm font-bold">Warranty & support</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Warranty and after-sales support provided by the vendor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="border-b border-border pb-4">
              <h2 className="display text-2xl font-extrabold">
                Product details
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Everything you need to know before making your choice.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-bold">Description</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {getSafeText(descriptionText)}
              </p>
            </div>

            <div className="border-t border-border py-6">
              <h3 className="font-bold mb-4">Specifications</h3>
              <div className="divide-y divide-border rounded-xl border border-border">
                <div className="grid grid-cols-2 p-3 text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold">{categoryName}</span>
                </div>

                <div className="grid grid-cols-2 p-3 text-sm">
                  <span className="text-muted-foreground">Brand / Vendor</span>
                  <span className="font-semibold">{vendorName}</span>
                </div>

                <div className="grid grid-cols-2 p-3 text-sm">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-semibold">{stockValue} units</span>
                </div>

                {specsList.map((spec, index) => (
                  <div
                    key={spec.id || index}
                    className="grid grid-cols-2 p-3 text-sm"
                  >
                    <span className="text-muted-foreground">
                      {spec.name || `Specification ${index + 1}`}
                    </span>
                    <span className="font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
              <p className="mono text-[10px] font-bold uppercase tracking-widest text-primary">
                Sold by
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
                  {getInitials(vendorName)}
                </div>

                <div>
                  <h3 className="font-bold">{vendorName}</h3>
                  <p className="text-xs text-muted-foreground">
                    Verified SmartCommerce vendor
                  </p>
                </div>
              </div>

              {vendorId && (
                <Link
                  to={`/vendor/${vendorId}`}
                  className="mt-5 block rounded-xl border border-border px-4 py-3 text-center text-sm font-bold hover:border-primary hover:text-primary transition"
                >
                  Visit store
                </Link>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
