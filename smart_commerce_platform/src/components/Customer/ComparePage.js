import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { handleAuthError } from "../../AuthRoute";
import {
  ArrowRight,
  X,
  SlidersHorizontal,
  ShoppingCart,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/customer";

// Auth Helpers
const getToken = () => localStorage.getItem("token") || null;
const isLoggedIn = () => Boolean(getToken());

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

const ComparePage = () => {
  const [compareList, setCompareList] = useState([]);

  // Load Compare List from LocalStorage
  const loadCompare = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("compare") || "[]");
      setCompareList(Array.isArray(stored) ? stored : []);
    } catch {
      setCompareList([]);
    }
  };

  useEffect(() => {
    loadCompare();
    window.addEventListener("compareUpdated", loadCompare);
    return () => window.removeEventListener("compareUpdated", loadCompare);
  }, []);

  // Remove item from comparison
  const handleRemove = (productId) => {
    const pId = String(productId);
    try {
      const stored = JSON.parse(localStorage.getItem("compare") || "[]");
      const updated = stored.filter(
        (item) => String(item._id || item.id) !== pId,
      );
      localStorage.setItem("compare", JSON.stringify(updated));
      setCompareList(updated);
      window.dispatchEvent(new Event("compareUpdated"));
    } catch (err) {
      console.error("Remove compare error:", err);
    }
  };

  // Add item to Cart
  const handleCart = async (product) => {
    const pId = product._id || product.id;

    if (isLoggedIn()) {
      try {
        await axios.post(
          `${API_BASE_URL}/cart/add`,
          { productId: pId, quantity: 1 },
          {
            headers: {
              "Content-Type": "Application/json",
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
        console.error("Cart storage error:", err);
      }
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <p className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Decision desk
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Compare without the tab chaos.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Put products side by side and compare price, ratings,
                specifications and availability before making your decision.
              </p>
            </div>

            {compareList.length > 0 && (
              <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-primary">
                {compareList.length}{" "}
                {compareList.length === 1 ? "product" : "products"}
              </span>
            )}
          </div>
        </div>

        {/* Empty / Less than 2 products state */}
        {compareList.length < 2 ? (
          <section className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-card px-6 py-20 text-center shadow-sm">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary text-primary">
              <SlidersHorizontal size={30} />
            </div>

            <h2 className="display mt-6 text-2xl font-bold">
              Add at least two products
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Choose two or more products from the catalogue to compare their
              prices, ratings, specifications and availability.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Browse the catalogue
              <ArrowRight size={16} />
            </Link>
          </section>
        ) : (
          <>
            {/* Mobile hint */}
            <div className="mt-6 rounded-xl bg-secondary px-4 py-3 text-xs text-muted-foreground lg:hidden">
              Swipe horizontally to compare all products.
            </div>

            {/* Comparison Table */}
            <section className="mt-6 overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-left">
                  {/* Product Header */}
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-10 w-40 min-w-40 border-b border-border bg-muted p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Compare
                      </th>

                      {compareList.map((product) => {
                        const pId = product._id || product.id;
                        const sellingPrice =
                          product.discountPrice || product.price || 0;
                        const originalPrice =
                          product.mrp || product.price || sellingPrice;
                        const categoryName =
                          typeof product.category === "object"
                            ? product.category?.name
                            : product.category || "General";

                        const vendorName =
                          typeof product.vendor === "object"
                            ? product.vendor?.storeName ||
                              `${product.vendor?.firstName || ""} ${product.vendor?.lastName || ""}`.trim() ||
                              "Vendor"
                            : product.vendor || "Vendor";

                        const mark = product.mark || getInitials(product.name);
                        const tone =
                          product.tone ||
                          "from-teal-800 via-teal-700 to-amber-600";

                        return (
                          <th
                            key={pId}
                            className="min-w-[230px] border-b border-l border-border p-5 align-top"
                          >
                            <div className="relative">
                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => handleRemove(pId)}
                                className="absolute right-0 top-0 grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-600"
                                aria-label={`Remove ${product.name}`}
                              >
                                <X size={16} />
                              </button>

                              {/* Product Image */}
                              <Link to={`/product/${pId}`}>
                                <div
                                  className={`grid size-28 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br ${tone}`}
                                >
                                  <span className="display text-5xl font-extrabold text-white/90">
                                    {mark}
                                  </span>
                                </div>
                              </Link>

                              {/* Product Info */}
                              <Link to={`/product/${pId}`}>
                                <h2 className="mt-4 line-clamp-2 pr-7 text-sm font-bold leading-5 hover:text-primary">
                                  {product.name}
                                </h2>
                              </Link>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {vendorName}
                              </p>

                              {/* Price */}
                              <div className="mt-4">
                                <span className="text-lg font-extrabold">
                                  {formatMoney(sellingPrice)}
                                </span>

                                {originalPrice > sellingPrice && (
                                  <span className="ml-2 text-xs text-muted-foreground line-through">
                                    {formatMoney(originalPrice)}
                                  </span>
                                )}
                              </div>

                              {/* Cart Button */}
                              <button
                                type="button"
                                onClick={() => handleCart(product)}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition hover:opacity-90"
                              >
                                <ShoppingCart size={15} />
                                Add to cart
                              </button>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  {/* Comparison Rows */}
                  <tbody>
                    {/* Category */}
                    <tr className="border-t border-border">
                      <td className="sticky left-0 z-10 bg-muted p-4 text-xs font-bold text-muted-foreground">
                        Category
                      </td>
                      {compareList.map((product) => (
                        <td
                          key={product._id || product.id}
                          className="border-l border-border p-4 text-sm font-semibold"
                        >
                          {typeof product.category === "object"
                            ? product.category?.name
                            : product.category || "General"}
                        </td>
                      ))}
                    </tr>

                    {/* Price */}
                    <tr className="border-t border-border">
                      <td className="sticky left-0 z-10 bg-muted p-4 text-xs font-bold text-muted-foreground">
                        Price
                      </td>
                      {compareList.map((product) => (
                        <td
                          key={product._id || product.id}
                          className="border-l border-border p-4 text-sm font-extrabold text-primary"
                        >
                          {formatMoney(product.discountPrice || product.price)}
                        </td>
                      ))}
                    </tr>

                    {/* MRP */}
                    <tr className="border-t border-border">
                      <td className="sticky left-0 z-10 bg-muted p-4 text-xs font-bold text-muted-foreground">
                        MRP
                      </td>
                      {compareList.map((product) => (
                        <td
                          key={product._id || product.id}
                          className="border-l border-border p-4 text-sm text-muted-foreground"
                        >
                          {formatMoney(product.mrp || product.price)}
                        </td>
                      ))}
                    </tr>

                    {/* Specifications */}
                    <tr className="border-t border-border">
                      <td className="sticky left-0 z-10 bg-muted p-4 text-xs font-bold text-muted-foreground">
                        Specifications
                      </td>
                      {compareList.map((product) => {
                        const specifications = Array.isArray(
                          product.specifications,
                        )
                          ? product.specifications
                          : [];
                        return (
                          <td
                            key={product._id || product.id}
                            className="border-l border-border p-4 align-top"
                          >
                            {specifications.length > 0 ? (
                              <div className="space-y-2">
                                {specifications.map((spec, index) => {
                                  // If specification is an object
                                  if (
                                    typeof spec === "object" &&
                                    spec !== null
                                  ) {
                                    const field =
                                      spec.field ||
                                      spec.name ||
                                      spec.key ||
                                      `Specification ${index + 1}`;
                                    const value =
                                      spec.value ||
                                      spec.text ||
                                      spec.description ||
                                      "N/A";
                                    return (
                                      <div
                                        key={spec._id || index}
                                        className="flex items-start justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2"
                                      >
                                        <span className="text-xs font-semibold text-muted-foreground">
                                          {field}
                                        </span>
                                        <span className="text-xs font-bold text-foreground text-right">
                                          {String(value)}
                                        </span>
                                      </div>
                                    );
                                  }
                                  // If specification is already a string
                                  return (
                                    <div
                                      key={index}
                                      className="rounded-lg bg-muted/50 px-3 py-2 text-xs font-semibold"
                                    >
                                      {String(spec)}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                No specifications available
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Availability */}
                    <tr className="border-t border-border">
                      <td className="sticky left-0 z-10 bg-muted p-4 text-xs font-bold text-muted-foreground">
                        Availability
                      </td>
                      {compareList.map((product) => {
                        const inStock = (product.stock ?? 10) > 0;
                        return (
                          <td
                            key={product._id || product.id}
                            className="border-l border-border p-4"
                          >
                            {inStock ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700">
                                <CheckCircle2 size={15} />
                                In stock · {product.stock ?? 10} available
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600">
                                <XCircle size={15} />
                                Out of stock
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Vendor */}
                    <tr className="border-t border-border">
                      <td className="sticky left-0 z-10 bg-muted p-4 text-xs font-bold text-muted-foreground">
                        Vendor
                      </td>
                      {compareList.map((product) => {
                        const vendorName =
                          typeof product.vendor === "object"
                            ? product.vendor?.storeName ||
                              `${product.vendor?.firstName || ""} ${product.vendor?.lastName || ""}`.trim() ||
                              "Vendor"
                            : product.vendor || "Vendor";

                        return (
                          <td
                            key={product._id || product.id}
                            className="border-l border-border p-4 text-sm font-semibold"
                          >
                            {vendorName}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                ← Continue shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ComparePage;
