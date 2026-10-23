import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleAuthError } from "../../AuthRoute";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowRight,
  Search,
  ShoppingBag,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/customer";

const getToken = () => localStorage.getItem("token") || null;
const isLoggedIn = () => Boolean(getToken());

const money = (value) =>
  `₹${new Intl.NumberFormat("en-IN").format(value || 0)}`;

const formatDate = (dateStr) => {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? "Recently"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const getInitials = (name) => {
  if (!name) return "P";
  const words = String(name).trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return String(name).slice(0, 2).toUpperCase();
};

const OrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  // FETCH ALL CUSTOMER ORDERS FROM API
  useEffect(() => {
    if (!isLoggedIn()) {
      sessionStorage.setItem("redirectAfterLogin", "/orders");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_BASE_URL}/orders`, {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (res.data && res.data.success) {
          setOrders(res.data.orders || []);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Fetch orders error:", err);
        handleAuthError(err);
        setError("Failed to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Normalize raw backend orderStatus to filter category
  const normalizeStatus = (rawStatus = "") => {
    const s = String(rawStatus).toLowerCase();
    if (s === "delivered" || s === "partially_delivered") return "Delivered";
    if (s === "shipped" || s === "partially_shipped") return "Shipped";
    if (s === "cancelled") return "Cancelled";
    return "Processing"; // placed, confirmed, processing
  };

  const getStatusIcon = (status) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case "Delivered":
        return <CheckCircle2 size={17} />;
      case "Shipped":
        return <Truck size={17} />;
      case "Processing":
        return <Clock3 size={17} />;
      case "Cancelled":
        return <XCircle size={17} />;
      default:
        return <Package size={17} />;
    }
  };

  const getStatusStyle = (status) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";
      case "Shipped":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
      case "Processing":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const normStatus = normalizeStatus(order.orderStatus || order.status);
    const matchesFilter = activeFilter === "All" || normStatus === activeFilter;

    const orderId = order.orderNumber || order._id || order.id || "";
    const items = order.items || [];

    const matchesSearch =
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      items.some((item) => {
        const name =
          item.productName ||
          item.title ||
          item.name ||
          item.product?.title ||
          "";
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });

    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background">
      {/* PAGE HEADER */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
            Your activity
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="display text-4xl font-extrabold tracking-tight">
                Your orders.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Track your purchases and view order history from SmartCommerce
                vendors.
              </p>
            </div>

            {orders.length > 0 && (
              <div className="rounded-xl bg-secondary px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Total orders
                </p>
                <p className="mt-1 text-xl font-extrabold">{orders.length}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* SEARCH + FILTER BAR */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or product..."
              className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <div className="mt-16 flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 size={36} className="animate-spin text-primary mb-3" />
            <p className="text-sm font-semibold">Loading your orders…</p>
          </div>
        ) : orders.length === 0 ? (
          /* EMPTY ORDERS STATE */
          <section className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-card px-6 py-20 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary text-primary">
              <ShoppingBag size={30} />
            </div>

            <h2 className="display mt-6 text-2xl font-bold">No orders yet</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Your future purchases will appear here. Explore products from
              independent vendors across SmartCommerce.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Start shopping
              <ArrowRight size={16} />
            </Link>
          </section>
        ) : filteredOrders.length === 0 ? (
          /* NO FILTER RESULTS STATE */
          <section className="mt-8 rounded-2xl border border-border bg-card px-6 py-16 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
              <Search size={24} />
            </div>

            <h2 className="display mt-5 text-xl font-bold">
              No matching orders
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Try another search term or change the active filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              className="mt-5 text-sm font-bold text-primary hover:underline"
            >
              Clear filters
            </button>
          </section>
        ) : (
          /* ORDERS LIST */
          <div className="mt-8 space-y-5">
            {filteredOrders.map((order) => {
              const orderId =
                order.orderNumber || order._id || order.id || "SC-00000";
              const rawStatus = order.orderStatus || order.status || "placed";
              const displayStatus = normalizeStatus(rawStatus);
              const orderDate = formatDate(order.placedAt || order.createdAt);
              const totalPayable = order.totalAmount || order.total || 0;
              const itemsList = order.items || [];

              return (
                <article
                  key={orderId}
                  className="overflow-hidden rounded-[1.25rem] border border-border bg-card transition hover:shadow-sm"
                >
                  {/* ORDER HEADER */}
                  <div className="flex flex-col gap-4 border-b border-border bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Order ID
                        </p>
                        <p className="mt-1 text-sm font-extrabold">{orderId}</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Placed on
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {orderDate}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Total
                        </p>
                        <p className="mt-1 text-sm font-extrabold">
                          {money(totalPayable)}
                        </p>
                      </div>
                    </div>

                    {/* STATUS BADGE */}
                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold ${getStatusStyle(rawStatus)}`}
                    >
                      {getStatusIcon(rawStatus)}
                      {displayStatus}
                    </span>
                  </div>

                  {/* ORDER ITEMS LIST */}
                  <div className="p-5">
                    <div className="space-y-4">
                      {itemsList.map((item, idx) => {
                        const prodId =
                          item.product?._id || item.product || item.id || idx;
                        const prodName =
                          item.productName ||
                          item.title ||
                          item.name ||
                          item.product?.title ||
                          "Product";
                        const prodImg =
                          item.productImage ||
                          (item.product?.images && item.product?.images[0]) ||
                          item.image;
                        const vendorName =
                          typeof item.vendor === "object"
                            ? item.vendor?.storeName ||
                              `${item.vendor?.firstName || ""} ${item.vendor?.lastName || ""}`.trim()
                            : item.vendor ||
                              item.product?.vendor?.storeName ||
                              "Verified Vendor";

                        const qty = Number(item.quantity || 1);
                        const unitPrice = Number(
                          item.unitPrice || item.price || 0,
                        );
                        const itemSubtotal = item.subtotal || unitPrice * qty;

                        return (
                          <div key={idx} className="flex gap-4 items-center">
                            {/* IMAGE / INITIALS */}
                            <Link
                              to={`/product/${prodId}`}
                              className="shrink-0"
                            >
                              {prodImg ? (
                                <img
                                  src={prodImg}
                                  alt={prodName}
                                  className="size-20 sm:size-24 rounded-xl object-cover border border-border"
                                />
                              ) : (
                                <div className="grid size-20 sm:size-24 place-items-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800">
                                  <span className="display text-2xl font-extrabold text-white sm:text-3xl">
                                    {getInitials(prodName)}
                                  </span>
                                </div>
                              )}
                            </Link>

                            {/* ITEM INFO */}
                            <div className="min-w-0 flex-1">
                              <Link to={`/product/${prodId}`}>
                                <h3 className="line-clamp-2 text-sm font-bold hover:text-primary sm:text-base">
                                  {prodName}
                                </h3>
                              </Link>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Sold by {vendorName}
                              </p>
                              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                                Quantity: {qty}
                              </p>
                            </div>

                            {/* PRICE */}
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-extrabold sm:text-base">
                                {money(itemSubtotal)}
                              </p>
                              <p className="mt-1 text-[10px] text-muted-foreground">
                                {money(unitPrice)} each
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* STATUS INFORMATION BAR */}
                    <div className="mt-5 rounded-xl bg-secondary p-4">
                      <div className="flex gap-3">
                        <div className="mt-0.5 text-primary">
                          {displayStatus === "Delivered" ? (
                            <CheckCircle2 size={18} />
                          ) : displayStatus === "Shipped" ? (
                            <Truck size={18} />
                          ) : displayStatus === "Cancelled" ? (
                            <XCircle size={18} />
                          ) : (
                            <Clock3 size={18} />
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-bold">
                            {displayStatus === "Delivered"
                              ? "Delivered successfully"
                              : displayStatus === "Cancelled"
                                ? "Order cancelled"
                                : displayStatus === "Shipped"
                                  ? "Your order is on the way"
                                  : "Your order is being processed by vendors"}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {displayStatus === "Delivered"
                              ? "Thank you for shopping with SmartCommerce."
                              : displayStatus === "Shipped"
                                ? "Tracking details are being updated by courier."
                                : "Estimated delivery within 3-5 business days."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTON (VIEW & TRACK ONLY - NO CANCEL OR RETURN) */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/orders/${order._id || order.id || orderId}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition hover:opacity-90"
                        >
                          View order & track <ArrowRight size={14} />
                        </Link>
                      </div>

                      <span className="text-[11px] text-muted-foreground italic font-medium">
                        Need assistance? Contact support
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default OrdersPage;
