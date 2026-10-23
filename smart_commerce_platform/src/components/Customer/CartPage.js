import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleAuthError } from "../../AuthRoute";
import {
  ShoppingCart,
  Store,
  ArrowRight,
  Trash2,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  PackageCheck,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/customer";

//  AUTH HELPERS
const getToken = () => localStorage.getItem("token") || null;
const isLoggedIn = () => Boolean(getToken());

//  HELPERS
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

const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //  FETCH CART ITEMS
  const fetchCart = async () => {
    setLoading(true);
    setError("");

    if (isLoggedIn()) {
      try {
        const res = await axios.get(`${API_BASE_URL}/cart`, {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (res.data && res.data.success) {
          // Backend returns array of { product: {...}, quantity, _id }
          setCartItems(res.data.cart || []);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        handleAuthError(error);

        console.error("Fetch cart error:", err);
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    } else {
      // Guest — read from localStorage
      try {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        // Convert localStorage items to uniform structure
        const normalized = stored.map((item) => ({
          product: item,
          quantity: item.quantity || 1,
        }));
        setCartItems(normalized);
      } catch (err) {
        console.error("Local cart read error:", err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  //  UPDATE QUANTITY
  const handleQty = async (productId, delta) => {
    const item = cartItems.find(
      (ci) =>
        String(ci.product?._id || ci.product?.id || ci.product) ===
        String(productId),
    );
    if (!item) return;

    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;

    if (isLoggedIn()) {
      try {
        const res = await axios.put(
          `${API_BASE_URL}/cart/${productId}`,
          { quantity: newQty },
          {
            headers: {
              "Content-Type": "Application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );
        if (res.data.success) {
          setCartItems((prev) =>
            prev.map((ci) => {
              const pId = ci.product?._id || ci.product?.id;
              return String(pId) === String(productId)
                ? { ...ci, quantity: newQty }
                : ci;
            }),
          );
          window.dispatchEvent(new Event("cartUpdated"));
        }
      } catch (err) {
        handleAuthError(error);

        console.error("Update quantity error:", err);
      }
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        const updated = stored.map((p) => {
          const pId = p._id || p.id;
          return String(pId) === String(productId)
            ? { ...p, quantity: newQty }
            : p;
        });

        localStorage.setItem("cart", JSON.stringify(updated));
        setCartItems(
          updated.map((p) => ({ product: p, quantity: p.quantity || 1 })),
        );
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        console.error("Local update quantity error:", err);
      }
    }
  };

  //  REMOVE ITEM
  const handleRemove = async (productId) => {
    if (isLoggedIn()) {
      try {
        const res = await axios.delete(`${API_BASE_URL}/cart/${productId}`, {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (res.data.success) {
          setCartItems((prev) =>
            prev.filter((ci) => {
              const pId = ci.product?._id || ci.product?.id;
              return String(pId) !== String(productId);
            }),
          );
          window.dispatchEvent(new Event("cartUpdated"));
        }
      } catch (err) {
        handleAuthError(error);

        console.error("Remove item error:", err);
      }
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        const updated = stored.filter((p) => {
          const pId = p._id || p.id;
          return String(pId) !== String(productId);
        });

        localStorage.setItem("cart", JSON.stringify(updated));
        setCartItems(
          updated.map((p) => ({ product: p, quantity: p.quantity || 1 })),
        );
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        console.error("Local remove item error:", err);
      }
    }
  };

  //  CHECKOUT GUARD
  const handleProceedToCheckout = (e) => {
    if (!isLoggedIn()) {
      e.preventDefault();
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
    }
  };

  //  CALCULATIONS
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return total + Number(price) * (item.quantity || 1);
  }, 0);

  const delivery = subtotal >= 999 || subtotal === 0 ? 0 : 100;
  const total = Math.max(0, subtotal + delivery);

  const totalItems = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0,
  );

  // Group cart items by vendor
  const vendorGroups = cartItems.reduce((acc, item) => {
    const prod = item.product || {};
    const vendorName =
      typeof prod.vendor === "object"
        ? prod.vendor?.storeName ||
          `${prod.vendor?.firstName || ""} ${prod.vendor?.lastName || ""}`.trim() ||
          "Store"
        : prod.vendor || "Store";

    if (!acc[vendorName]) {
      acc[vendorName] = [];
    }
    acc[vendorName].push(item);
    return acc;
  }, {});

  const vendorsList = Object.keys(vendorGroups);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Shopping cart
              </p>
              <h1 className="display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your cart
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Review your products from trusted SmartCommerce vendors before
                checkout.
              </p>
            </div>

            {!loading && cartItems.length > 0 && (
              <div className="rounded-xl border border-border bg-card px-4 py-2.5">
                <p className="text-xs text-muted-foreground">Cart items</p>
                <p className="mt-0.5 text-sm font-bold">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <section className="rounded-[1.5rem] border border-border bg-card px-6 py-20 text-center shadow-sm flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 size={36} className="animate-spin text-primary" />
            <p className="text-sm font-semibold">Loading shopping cart...</p>
          </section>
        ) : error ? (
          <section className="rounded-[1.5rem] border border-border bg-card px-6 py-20 text-center shadow-sm flex flex-col items-center justify-center gap-3 text-red-500">
            <AlertCircle size={32} />
            <p className="text-sm font-semibold">{error}</p>
          </section>
        ) : cartItems.length === 0 ? (
          /* EMPTY CART */
          <section className="rounded-[1.5rem] border border-dashed border-border bg-card px-6 py-20 text-center shadow-sm">
            <div className="mx-auto grid size-20 place-items-center rounded-[1.5rem] bg-secondary text-primary">
              <ShoppingCart size={34} />
            </div>

            <h2 className="display mt-6 text-2xl font-extrabold">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Looks like you haven't added anything yet. Explore products from
              multiple independent vendors and find something you love.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Start shopping
              <ArrowRight size={16} />
            </Link>
          </section>
        ) : (
          /* CART CONTENT */
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* LEFT SIDE — VENDOR GROUPS */}
            <div className="space-y-5">
              {vendorsList.map((vendorName) => {
                const groupItems = vendorGroups[vendorName];

                return (
                  <section
                    key={vendorName}
                    className="overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm"
                  >
                    {/* Vendor Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">
                          {getInitials(vendorName)}
                        </div>

                        <div>
                          <h3 className="text-sm font-bold">{vendorName}</h3>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {groupItems.length}{" "}
                            {groupItems.length === 1 ? "product" : "products"}{" "}
                            from this store
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-[10px] font-bold text-teal-800">
                        <ShieldCheck size={12} />
                        Verified store
                      </span>
                    </div>

                    {/* Products */}
                    <div className="px-5">
                      {groupItems.map((ci, index) => {
                        const product = ci.product || {};
                        const pId = product._id || product.id;
                        const quantity = ci.quantity || 1;
                        const price =
                          product.discountPrice || product.price || 0;
                        const mrp = product.mrp || product.price || price;
                        const productTotal = Number(price) * quantity;
                        const categoryName =
                          typeof product.category === "object"
                            ? product.category?.name
                            : product.category || "General";

                        const mark = product.mark || getInitials(product.name);
                        const tone =
                          product.tone ||
                          "from-teal-800 via-teal-700 to-amber-600";

                        return (
                          <article
                            key={pId}
                            className={`group flex gap-4 py-5 ${
                              index !== 0 ? "border-t border-border" : ""
                            }`}
                          >
                            {/* IMAGE */}
                            <Link to={`/product/${pId}`} className="shrink-0">
                              <div
                                className={`grid size-24 place-items-center overflow-hidden rounded-xl bg-gradient-to-br transition-transform group-hover:scale-[1.02] sm:size-28 ${tone}`}
                              >
                                <span className="display text-4xl font-extrabold text-white/90 sm:text-5xl">
                                  {mark}
                                </span>
                              </div>
                            </Link>

                            {/* PRODUCT INFO */}
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                                {categoryName}
                              </p>

                              <Link to={`/product/${pId}`}>
                                <h3 className="display mt-1 line-clamp-2 text-sm font-bold leading-5 hover:text-primary sm:text-base">
                                  {product.name}
                                </h3>
                              </Link>

                              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                {product.shortDescription ||
                                  product.specs ||
                                  "Quality item"}
                              </p>

                              {/* Stock status */}
                              {product.stock !== undefined && (
                                <p
                                  className={`mt-2 text-[11px] font-semibold ${
                                    product.stock < 10
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {product.stock < 10
                                    ? `Only ${product.stock} left`
                                    : "In stock"}
                                </p>
                              )}

                              {/* CONTROLS */}
                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                <div className="flex items-center overflow-hidden rounded-lg border border-border bg-background">
                                  <button
                                    type="button"
                                    onClick={() => handleQty(pId, -1)}
                                    disabled={quantity <= 1}
                                    className="grid size-8 place-items-center transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={13} />
                                  </button>

                                  <span className="grid min-w-9 place-items-center text-xs font-bold">
                                    {quantity}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => handleQty(pId, 1)}
                                    disabled={
                                      product.stock !== undefined &&
                                      quantity >= product.stock
                                    }
                                    className="grid size-8 place-items-center transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={13} />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemove(pId)}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition hover:text-red-600"
                                >
                                  <Trash2 size={13} />
                                  Remove
                                </button>
                              </div>
                            </div>

                            {/* PRICE */}
                            <div className="shrink-0 text-right">
                              <p className="display text-base font-extrabold sm:text-lg">
                                {formatMoney(productTotal)}
                              </p>

                              {mrp > price && (
                                <p className="mt-1 text-[10px] text-muted-foreground line-through">
                                  {formatMoney(Number(mrp) * quantity)}
                                </p>
                              )}

                              {quantity > 1 && (
                                <p className="mt-1 text-[10px] text-muted-foreground">
                                  {formatMoney(price)} × {quantity}
                                </p>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })}

              {/* Continue Shopping */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 pt-1 text-sm font-bold text-primary hover:underline"
              >
                ← Continue shopping
              </Link>
            </div>

            {/* RIGHT SIDE — ORDER SUMMARY */}
            <aside className="h-fit lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm">
                {/* SUMMARY HEADER */}
                <div className="border-b border-border px-6 py-5">
                  <h2 className="display text-xl font-extrabold">
                    Order summary
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {totalItems} {totalItems === 1 ? "item" : "items"} from{" "}
                    {vendorsList.length}{" "}
                    {vendorsList.length === 1 ? "vendor" : "vendors"}
                  </p>
                </div>

                {/* PRICE DETAILS */}
                <div className="px-6 py-5">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">
                        {formatMoney(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-semibold text-primary">
                        {delivery === 0 ? "FREE" : formatMoney(delivery)}
                      </span>
                    </div>

                    {/* FREE DELIVERY MESSAGE */}
                    {subtotal < 999 && (
                      <div className="rounded-xl bg-secondary p-3.5">
                        <div className="flex gap-2">
                          <Truck
                            size={16}
                            className="mt-0.5 shrink-0 text-primary"
                          />
                          <p className="text-xs leading-5 text-muted-foreground">
                            Add{" "}
                            <strong className="text-foreground">
                              {formatMoney(999 - subtotal)}
                            </strong>{" "}
                            more to unlock{" "}
                            <strong className="text-foreground">
                              free delivery
                            </strong>
                            .
                          </p>
                        </div>
                      </div>
                    )}

                    {/* TOTAL */}
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Total</span>
                        <span className="display text-2xl font-extrabold">
                          {formatMoney(total)}
                        </span>
                      </div>
                      <p className="mt-1 text-right text-[10px] text-muted-foreground">
                        Inclusive of applicable taxes
                      </p>
                    </div>
                  </div>

                  {/* CHECKOUT BUTTON */}
                  <Link
                    to="/checkout"
                    onClick={handleProceedToCheckout}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                  >
                    Proceed to checkout
                    <ArrowRight size={16} />
                  </Link>

                  {/* SECURITY */}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5">
                    <div className="flex gap-2">
                      <Truck
                        size={16}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      <div>
                        <p className="text-[11px] font-bold">Fast delivery</p>
                        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                          Across India
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <ShieldCheck
                        size={16}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      <div>
                        <p className="text-[11px] font-bold">Secure checkout</p>
                        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                          Protected payments
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                    <PackageCheck size={13} />
                    Secure payments · Easy returns
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
