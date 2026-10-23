import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleAuthError } from "../../AuthRoute";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  CreditCard,
  HelpCircle,
  XCircle,
  CalendarDays,
  Loader2,
  AlertCircle,
  Globe,
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
        hour: "2-digit",
        minute: "2-digit",
      });
};

const getInitials = (name) => {
  if (!name) return "P";
  const words = String(name).trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return String(name).slice(0, 2).toUpperCase();
};

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH DYNAMIC ORDER DETAILS FROM API
  useEffect(() => {
    if (!isLoggedIn()) {
      sessionStorage.setItem("redirectAfterLogin", `/orders/${orderId}`);
      navigate("/login");
      return;
    }

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (res.data && res.data.success && res.data.order) {
          setOrder(res.data.order);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Fetch order details error:", err);
        handleAuthError(err);
        setError(
          "Unable to retrieve order details. Please check the order ID or try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
      setError("No order ID provided.");
    }
  }, [orderId, navigate]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 size={36} className="animate-spin text-primary mb-3" />
        <p className="text-sm font-semibold">Loading order details…</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-background px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary text-primary">
            <Package size={30} />
          </div>

          <p className="mono mt-6 text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
            SmartCommerce
          </p>

          <h1 className="display mt-3 text-3xl font-extrabold">
            Order not found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            {error ||
              "We couldn't find the order you're looking for. It may have been removed or the ID is invalid."}
          </p>

          <Link
            to="/orders"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft size={16} />
            Back to orders
          </Link>
        </div>
      </main>
    );
  }

  // ORDER STATUS MAPPING
  const rawStatus = (
    order.orderStatus ||
    order.status ||
    "placed"
  ).toLowerCase();

  const isDelivered =
    rawStatus === "delivered" || rawStatus === "partially_delivered";
  const isShipped =
    rawStatus === "shipped" || rawStatus === "partially_shipped";
  const isConfirmed =
    rawStatus === "confirmed" ||
    rawStatus === "processing" ||
    isShipped ||
    isDelivered;
  const isCancelled = rawStatus === "cancelled";

  const items = order.items || [];
  const shippingAddr = order.shippingAddress || order.delivery || {};

  const subtotal =
    order.subtotal ||
    items.reduce(
      (sum, it) => sum + (it.unitPrice || it.price || 0) * (it.quantity || 1),
      0,
    );
  const deliveryCharge = order.deliveryCharge || 0;
  const discountAmount = order.discountAmount || 0;
  const totalAmount =
    order.totalAmount ||
    order.total ||
    subtotal + deliveryCharge - discountAmount;

  // TRACKING TIMELINE STEPS
  const trackingSteps = [
    {
      title: "Order placed",
      description: "Your order has been successfully placed.",
      icon: ShoppingBag,
      completed: true,
    },
    {
      title: "Order confirmed",
      description: "Vendors have confirmed your order items.",
      icon: CheckCircle2,
      completed: isConfirmed && !isCancelled,
    },
    {
      title: "Shipped",
      description: "Your package is on its way with courier service.",
      icon: Truck,
      completed: (isShipped || isDelivered) && !isCancelled,
    },
    {
      title: "Delivered",
      description: "Package delivered to your address.",
      icon: Check,
      completed: isDelivered && !isCancelled,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* TOP HEADER */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft size={15} /> Back to orders
          </Link>

          {/* Header info */}
          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                Order details
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {order.orderNumber || order._id || order.id}
                </h1>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold ${
                    isDelivered
                      ? "bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-400"
                      : isShipped
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400"
                        : isCancelled
                          ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                  }`}
                >
                  {isDelivered ? (
                    <CheckCircle2 size={12} />
                  ) : isShipped ? (
                    <Truck size={12} />
                  ) : isCancelled ? (
                    <XCircle size={12} />
                  ) : (
                    <Clock3 size={12} />
                  )}
                  {isDelivered
                    ? "Delivered"
                    : isShipped
                      ? "Shipped"
                      : isCancelled
                        ? "Cancelled"
                        : "Processing"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Ordered on {formatDate(order.placedAt || order.createdAt)}
                </span>
                <span className="hidden text-border sm:inline">•</span>
                <span>
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold transition hover:border-primary hover:text-primary"
                onClick={() => window.print()}
              >
                <Download size={15} /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* TRACKING SECTION */}
            {!isCancelled && (
              <section className="rounded-[1.25rem] border border-border bg-card p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="mono text-[10px] uppercase tracking-widest text-primary font-bold">
                      Delivery tracking
                    </p>
                    <h2 className="display mt-2 text-xl font-extrabold">
                      {isDelivered
                        ? "Your order has arrived."
                        : isShipped
                          ? "Your order is on its way."
                          : "We're getting your order ready."}
                    </h2>
                  </div>

                  <div className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                    <Truck size={20} />
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="mt-8">
                  {trackingSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isLast = index === trackingSteps.length - 1;

                    return (
                      <div key={step.title} className="relative flex gap-4">
                        {/* Vertical line */}
                        {!isLast && (
                          <div
                            className={`absolute left-[17px] top-9 h-[calc(100%-12px)] w-px ${
                              trackingSteps[index + 1].completed
                                ? "bg-primary"
                                : "bg-border"
                            }`}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full ${
                            step.completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon size={16} />
                        </div>

                        {/* Text */}
                        <div className={`pb-7 ${isLast ? "pb-0" : ""}`}>
                          <p
                            className={`text-sm font-bold ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {step.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {step.description}
                          </p>
                          {step.completed && index === 0 && (
                            <p className="mt-2 text-[10px] font-semibold text-primary">
                              {formatDate(order.placedAt || order.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shipping location banner */}
                {!isDelivered && shippingAddr.city && (
                  <div className="mt-7 flex items-start gap-3 rounded-xl bg-secondary p-4">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <div>
                      <p className="text-xs font-bold">Delivering to</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {shippingAddr.city}, {shippingAddr.state} -{" "}
                        {shippingAddr.pincode} (
                        {shippingAddr.country || "India"})
                      </p>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* CANCELLED MESSAGE */}
            {isCancelled && (
              <section className="rounded-[1.25rem] border border-red-200 bg-red-50 dark:bg-red-950/20 p-6">
                <div className="flex gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                    <XCircle size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-red-800 dark:text-red-300">
                      Order cancelled
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-red-700/80 dark:text-red-400/80">
                      This order was cancelled. If a payment was deducted, the
                      applicable refund will be credited back.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ORDER ITEMS SECTION */}
            <section className="overflow-hidden rounded-[1.25rem] border border-border bg-card">
              <div className="border-b border-border px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="mono text-[10px] uppercase tracking-widest text-primary font-bold">
                      Your purchase
                    </p>
                    <h2 className="display mt-1 text-xl font-extrabold">
                      Order items
                    </h2>
                  </div>

                  <span className="text-xs font-semibold text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              <div className="px-5 sm:px-6">
                {items.map((product, index) => {
                  const prodId =
                    product.product?._id ||
                    product.product ||
                    product.id ||
                    index;
                  const prodName =
                    product.productName ||
                    product.title ||
                    product.name ||
                    "Product";
                  const prodImg =
                    product.productImage ||
                    (product.product?.images && product.product?.images[0]) ||
                    product.image;
                  const vendorName =
                    typeof product.vendor === "object"
                      ? product.vendor?.storeName ||
                        `${product.vendor?.firstName || ""} ${product.vendor?.lastName || ""}`.trim()
                      : product.vendor || "Verified Vendor";

                  const qty = Number(product.quantity || 1);
                  const unitPrice = Number(
                    product.unitPrice || product.price || 0,
                  );
                  const itemSubtotal = product.subtotal || unitPrice * qty;

                  return (
                    <article
                      key={index}
                      className={`flex flex-col gap-4 py-5 sm:flex-row ${index !== 0 ? "border-t border-border" : ""}`}
                    >
                      {/* Image / Initials */}
                      <Link to={`/product/${prodId}`} className="shrink-0">
                        {prodImg ? (
                          <img
                            src={prodImg}
                            alt={prodName}
                            className="size-24 sm:size-28 rounded-xl object-cover border border-border"
                          />
                        ) : (
                          <div className="grid size-24 sm:size-28 place-items-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800">
                            <span className="display text-3xl font-extrabold text-white sm:text-4xl">
                              {getInitials(prodName)}
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <Link to={`/product/${prodId}`}>
                          <h3 className="display mt-1 line-clamp-2 text-base font-bold transition hover:text-primary">
                            {prodName}
                          </h3>
                        </Link>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>Sold by</span>
                          <span className="font-bold text-foreground">
                            <Store size={12} className="mr-1 inline" />
                            {vendorName}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-lg bg-muted px-2.5 py-1 text-[10px] font-semibold">
                            Qty: {qty}
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-left sm:text-right">
                        <p className="display text-lg font-extrabold">
                          {money(itemSubtotal)}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {money(unitPrice)} each
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* DELIVERY ADDRESS SECTION */}
            <section className="rounded-[1.25rem] border border-border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <MapPin size={20} />
                </div>

                <div className="min-w-0">
                  <p className="mono text-[10px] uppercase tracking-widest text-primary font-bold">
                    Delivery address
                  </p>

                  <h2 className="mt-2 text-base font-bold">
                    {shippingAddr.fullName || shippingAddr.name || "Customer"}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {shippingAddr.addressLine1 ||
                      shippingAddr.address ||
                      "Address details"}
                    {shippingAddr.addressLine2
                      ? `, ${shippingAddr.addressLine2}`
                      : ""}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {shippingAddr.city || ""}, {shippingAddr.state || ""} -{" "}
                    {shippingAddr.pincode || ""} (
                    {shippingAddr.country || "India"})
                  </p>

                  <p className="mt-2 text-xs font-semibold text-foreground">
                    Phone: +91 {shippingAddr.phone || ""}
                  </p>
                </div>
              </div>
            </section>

            {/* HELP SUPPORT CARD */}
            <section className="rounded-[1.25rem] bg-[#203b42] p-6 text-white">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
                    <HelpCircle size={20} />
                  </div>

                  <div>
                    <p className="mono text-[10px] uppercase tracking-widest text-white/50 font-bold">
                      Need help?
                    </p>
                    <h2 className="display mt-1 text-lg font-bold">
                      Something not right?
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-white/60">
                      Our support team is ready to help with your order
                      inquiries.
                    </p>
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#203b42] transition hover:bg-white/90"
                >
                  Contact support <ArrowRight size={14} />
                </Link>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - ORDER SUMMARY */}
          <aside className="h-fit space-y-5 lg:sticky lg:top-24">
            {/* ORDER SUMMARY CARD */}
            <section className="rounded-[1.25rem] bg-[#203b42] p-6 text-white">
              <p className="mono text-[10px] uppercase tracking-widest text-white/50 font-bold">
                Order summary
              </p>

              <div className="mt-3 flex items-end justify-between gap-4">
                <h2 className="display text-3xl font-extrabold">
                  {money(totalAmount)}
                </h2>
                <span className="text-xs text-white/50">Total Payable</span>
              </div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
                <div className="flex justify-between gap-4 text-white/70">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>

                <div className="flex justify-between gap-4 text-white/70 items-center">
                  <span className="flex items-center gap-1">
                    <Globe size={13} className="text-teal-300" /> Delivery
                  </span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-teal-300 font-bold">Free</span>
                    ) : (
                      money(deliveryCharge)
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Total Paid</span>
                  <span className="display text-xl font-extrabold">
                    {money(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-white/60">
                <ShieldCheck size={16} className="text-teal-300" />
                Verified SmartCommerce Order
              </div>
            </section>

            {/* PAYMENT METHOD CARD */}
            <section className="rounded-[1.25rem] border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                  <CreditCard size={18} />
                </div>

                <div>
                  <p className="mono text-[10px] uppercase tracking-widest text-primary font-bold">
                    Payment Method
                  </p>
                  <h2 className="mt-1 text-sm font-bold uppercase">
                    {order.paymentMethod || order.payment || "Online Payment"}
                  </h2>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-muted p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="font-bold text-primary capitalize">
                    {order.paymentStatus || (isCancelled ? "refunded" : "paid")}
                  </span>
                </div>
              </div>
            </section>

            {/* CONTINUE SHOPPING LINK */}
            <Link
              to="/shop"
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold transition hover:border-primary hover:text-primary"
            >
              Continue shopping <ArrowRight size={15} />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailsPage;
