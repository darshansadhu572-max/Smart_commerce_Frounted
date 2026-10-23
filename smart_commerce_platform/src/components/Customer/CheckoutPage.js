import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleAuthError } from "../../AuthRoute";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  Globe,
  WalletCards,
  Building2,
  Banknote,
  LockKeyhole,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/customer";

// AUTH HELPERS
const getToken = () => localStorage.getItem("token") || null;
const isLoggedIn = () => Boolean(getToken());

const money = (value) =>
  `₹${new Intl.NumberFormat("en-IN").format(value || 0)}`;

const getInitials = (name) => {
  if (!name) return "SC";
  const words = String(name).trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return String(name).slice(0, 2).toUpperCase();
};

const CheckoutPage = () => {
  const navigate = useNavigate();

  // DATA STATES
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [apiError, setApiError] = useState("");

  // STEP & ORDER SUCCESS STATES
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [payment, setPayment] = useState("upi");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // ADDRESS STATES
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // PAYMENT FORM STATE
  const [paymentForm, setPaymentForm] = useState({
    upiId: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  // LOAD USER FROM LOCALSTORAGE & FETCH CART
  useEffect(() => {
    if (!isLoggedIn()) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Try to fetch cart items from API
        let items = [];
        try {
          const cartRes = await axios.get(`${API_BASE_URL}/cart`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          });

          if (
            cartRes.data &&
            cartRes.data.success &&
            (cartRes.data.cart || []).length > 0
          ) {
            items = cartRes.data.cart.map((ci) => {
              const p = ci.product || {};
              return {
                ...p,
                id: p._id || p.id,
                product: p._id || p.id,
                title: p.title || p.name || "Product",
                name: p.title || p.name || "Product",
                price: p.discountPrice || p.price || 0,
                unitPrice: p.discountPrice || p.price || 0,
                quantity: ci.quantity || 1,
                vendor:
                  typeof p.vendor === "object"
                    ? p.vendor?.storeName ||
                      `${p.vendor?.firstName || ""} ${p.vendor?.lastName || ""}`.trim()
                    : p.vendor || "Verified Vendor",
                mark: getInitials(p.title || p.name),
              };
            });
          }
        } catch (err) {
          handleAuthError(err);

          console.log("Cart API fetch fallback to localStorage:", err.message);
        }

        // Fallback to localStorage cart if API cart is empty or fails
        if (items.length === 0) {
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
          items = localCart.map((p) => ({
            ...p,
            id: p._id || p.id,
            product: p._id || p.id,
            title: p.title || p.name || "Product",
            name: p.title || p.name || "Product",
            price: p.discountPrice || p.price || 0,
            unitPrice: p.discountPrice || p.price || 0,
            quantity: p.quantity || 1,
            vendor: p.vendor || "Verified Vendor",
            mark: getInitials(p.title || p.name),
          }));
        }

        setCartItems(items);

        // 2. Get user profile & saved addresses from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        let addresses = [];

        if (
          Array.isArray(storedUser.addresses) &&
          storedUser.addresses.length > 0
        ) {
          addresses = storedUser.addresses.map((addr) => ({
            name: addr.fullName || "",
            phone: addr.phone || storedUser.phone || "",
            address: addr.address || addr.addressLine1 || "",
            city: addr.city || "",
            state: addr.state || "",
            pincode: addr.pincode || addr.zipCode || "",
            country: addr.country || "India",
          }));
        } else if (storedUser.address) {
          const singleAddr = {
            name: storedUser.fullName || "",
            phone: storedUser.phone || "",
            address: storedUser.address || "",
            city: storedUser.city || "",
            state: storedUser.state || "",
            pincode: storedUser.pincode || "",
            country: storedUser.country || "India",
          };
          if (singleAddr.address && singleAddr.city) {
            addresses = [singleAddr];
          }
        }

        setSavedAddresses(addresses);

        if (addresses.length > 0) {
          setSelectedAddressIndex(0);
          setAddressForm(addresses[0]);
          setShowNewAddressForm(false);
        } else {
          setSelectedAddressIndex(-1);
          setShowNewAddressForm(true);
        }
      } catch (err) {
        handleAuthError(err);
        console.error("Checkout initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // CALCULATIONS
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) =>
        acc +
        Number(item.price || item.unitPrice || 0) *
          (Number(item.quantity) || 1),
      0,
    );
  }, [cartItems]);

  const itemCount = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + (Number(item.quantity) || 1),
      0,
    );
  }, [cartItems]);

  const activeCountry = (addressForm.country || "India").trim();

  // DELIVERY CHARGE LOGIC:
  // If India: subtotal >= 999 -> ₹0 (FREE), else -> ₹100
  // If Outside India (International): International Courier Service Charge -> ₹1,500
  const deliveryCharge = useMemo(() => {
    if (subtotal === 0) return 0;
    const isIndia = activeCountry.toLowerCase() === "india";
    if (isIndia) {
      return subtotal >= 999 ? 0 : 100;
    } else {
      return 1500; // International Courier Charges
    }
  }, [subtotal, activeCountry]);

  const total = subtotal + deliveryCharge;

  const vendors = useMemo(() => {
    return [...new Set(cartItems.map((item) => item.vendor).filter(Boolean))];
  }, [cartItems]);

  // FORM CHANGE HANDLERS
  const clearFieldError = (field) => {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "phone") val = value.replace(/\D/g, "").slice(0, 10);
    if (name === "pincode" && activeCountry.toLowerCase() === "india")
      val = value.replace(/\D/g, "").slice(0, 6);

    setAddressForm((prev) => ({ ...prev, [name]: val }));
    clearFieldError(name);
  };

  const handleSelectSavedAddress = (index) => {
    setSelectedAddressIndex(index);
    setAddressForm(savedAddresses[index]);
    setShowNewAddressForm(false);
    setErrors({});
  };

  const handleToggleNewAddress = () => {
    setShowNewAddressForm((prev) => {
      const nextState = !prev;
      if (nextState) {
        setSelectedAddressIndex(-1);
        setAddressForm({
          name: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        });
      } else if (savedAddresses.length > 0) {
        setSelectedAddressIndex(0);
        setAddressForm(savedAddresses[0]);
      }
      return nextState;
    });
    setErrors({});
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "cardNumber") val = value.replace(/\D/g, "").slice(0, 16);
    if (name === "cvv") val = value.replace(/\D/g, "").slice(0, 3);
    if (name === "expiry") {
      val = value.replace(/\D/g, "").slice(0, 4);
      if (val.length >= 3) val = `${val.slice(0, 2)} / ${val.slice(2)}`;
    }
    setPaymentForm((prev) => ({ ...prev, [name]: val }));
    clearFieldError(name);
  };

  // VALIDATIONS
  const validateAddress = () => {
    const newErrors = {};
    const { name, phone, address, city, state, pincode, country } = addressForm;

    if (!name.trim()) newErrors.name = "Full name is required.";
    else if (name.trim().length < 3)
      newErrors.name = "Name must contain at least 3 characters.";

    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{7,15}$/.test(phone.trim()))
      newErrors.phone = "Enter a valid mobile phone number.";

    if (!address.trim()) newErrors.address = "Address is required.";
    else if (address.trim().length < 6)
      newErrors.address = "Please enter a complete address.";

    if (!city.trim()) newErrors.city = "City is required.";
    if (!state.trim()) newErrors.state = "State is required.";

    if (!pincode.trim()) newErrors.pincode = "PIN / Postal code is required.";
    if (!country.trim()) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (payment === "upi") {
      const upi = paymentForm.upiId.trim();
      if (!upi) newErrors.upiId = "UPI ID is required.";
      else if (!/^[\w.-]+@[\w.-]+$/.test(upi))
        newErrors.upiId = "Enter a valid UPI ID (e.g., name@upi).";
    }

    if (payment === "card") {
      const cn = paymentForm.cardNumber.replace(/\s/g, "");
      const exp = paymentForm.expiry.replace(/\s/g, "");
      const cv = paymentForm.cvv.trim();

      if (!cn || !/^\d{16}$/.test(cn))
        newErrors.cardNumber = "Card number must contain 16 digits.";
      if (!exp || !/^\d{2}\/\d{2}$/.test(exp))
        newErrors.expiry = "Enter expiry in MM / YY format.";
      if (!cv || !/^\d{3}$/.test(cv))
        newErrors.cvv = "CVV must contain 3 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCurrentStep = () => {
    if (step === 1) {
      if (showNewAddressForm || selectedAddressIndex === -1) {
        return validateAddress();
      }
      return true;
    }
    if (step === 2) return validatePayment();
    if (step === 3) {
      if (!termsAccepted) {
        setErrors({
          terms: "You must accept the Terms & Conditions to place order.",
        });
        return false;
      }
      return true;
    }
    return true;
  };

  const goNext = () => {
    if (!validateCurrentStep()) return;
    setErrors({});
    setStep((prev) => Math.min(3, prev + 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  // SUBMIT ORDER TO BACKEND
  const handlePlaceOrder = async () => {
    if (!validateCurrentStep()) return;

    setSubmittingOrder(true);
    setApiError("");

    const shippingAddressPayload = {
      fullName: addressForm.name.trim(),
      phone: addressForm.phone.trim(),
      addressLine1: addressForm.address.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      pincode: addressForm.pincode.trim(),
      country: addressForm.country.trim() || "India",
    };

    // Format cart items payload for OrderItem schema
    const itemsPayload = cartItems.map((item) => ({
      product: item.product || item._id || item.id,
      productName: item.title || item.name || "Product",
      productImage: (item.images && item.images[0]) || item.image || "",
      unitPrice: Number(item.price || item.unitPrice || 0),
      quantity: Number(item.quantity || 1),
      vendor: item.vendor,
    }));

    try {
      const payload = {
        shippingAddress: shippingAddressPayload,
        paymentMethod: payment,
        items: itemsPayload,
        subtotal,
        deliveryCharge,
        totalAmount: total,
      };

      const res = await axios.post(`${API_BASE_URL}/orders`, payload, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.data && res.data.success) {
        const createdOrder = res.data.order || {};
        const orderSummary = {
          orderId:
            createdOrder.orderNumber ||
            createdOrder._id ||
            `SC-${Date.now().toString().slice(-6)}`,
          customer: {
            name: shippingAddressPayload.fullName,
            phone: shippingAddressPayload.phone,
          },
          items: cartItems,
          vendors,
          address: shippingAddressPayload,
          deliveryCharge,
          payment,
          subtotal,
          total,
          status: "Placed",
        };

        // If new address was created, save to localStorage addresses array
        if (showNewAddressForm) {
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          const existingAddrs = Array.isArray(storedUser.addresses)
            ? storedUser.addresses
            : [];
          storedUser.addresses = [...existingAddrs, addressForm];
          localStorage.setItem("user", JSON.stringify(storedUser));
        }

        // Clear local cart
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));

        setOrderDetails(orderSummary);
        setDone(true);
      }
    } catch (err) {
      handleAuthError(err);

      console.error("Order submission error:", err);
      setApiError(
        err.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setSubmittingOrder(false);
    }
  };

  // RENDER LOADING STATE
  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 size={36} className="animate-spin text-primary mb-3" />
        <p className="text-sm font-semibold">Loading checkout details…</p>
      </main>
    );
  }

  // RENDER EMPTY CART STATE
  if (cartItems.length === 0 && !done) {
    return (
      <main className="min-h-screen bg-background px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary text-primary">
            <Package size={30} />
          </div>
          <h1 className="display mt-6 text-3xl font-extrabold">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add products to your cart before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Browse products <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  // RENDER ORDER SUCCESS STATE
  if (done) {
    return (
      <main className="min-h-[70vh] bg-background px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-teal-100 text-teal-700">
            <Check size={40} />
          </div>
          <p className="mono mt-7 text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
            Thank you
          </p>
          <h1 className="display mt-3 text-4xl font-extrabold">
            Order placed. Nice choice.
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Your order has been successfully placed. Our vendors are getting
            your products ready for shipping.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Order ID
                </p>
                <p className="mt-1 font-bold">{orderDetails?.orderId}</p>
              </div>
              <CheckCircle2 size={22} className="text-teal-600" />
            </div>

            <div className="mt-5 border-t border-border pt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recipient</span>
                <span className="font-semibold">
                  {orderDetails?.customer?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Country</span>
                <span className="font-semibold">
                  {orderDetails?.address?.country}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="font-semibold">{itemCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span className="font-semibold">
                  {deliveryCharge === 0 ? "FREE" : money(deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t font-bold">
                <span>Total Amount Paid</span>
                <span className="display text-lg font-extrabold">
                  {money(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              Track order <ArrowRight size={16} />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // RENDER MAIN CHECKOUT FLOW
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft size={14} /> Back to cart
          </Link>
          <p className="mono mt-6 text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
            Secure checkout
          </p>
          <h1 className="display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Almost yours.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete your shipping and payment details to place order.
          </p>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-[500px] items-center justify-between">
            {[
              { id: 1, label: "Address", icon: MapPin },
              { id: 2, label: "Payment", icon: CreditCard },
              { id: 3, label: "Confirm", icon: CheckCircle2 },
            ].map((it, idx) => {
              const Icon = it.icon;
              return (
                <React.Fragment key={it.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (it.id <= step) {
                        setErrors({});
                        setStep(it.id);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={`grid size-9 place-items-center rounded-full text-xs font-bold ${
                        step >= it.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step > it.id ? <Check size={15} /> : <Icon size={15} />}
                    </span>
                    <span
                      className={`hidden text-xs font-bold sm:block ${step >= it.id ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {it.label}
                    </span>
                  </button>
                  {idx < 2 && (
                    <div
                      className={`mx-4 h-px flex-1 ${step > it.id ? "bg-primary" : "bg-border"}`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* LEFT FORM STEP PANELS */}
          <div>
            <div className="rounded-[1.25rem] border border-border bg-card p-5 sm:p-7">
              {/* STEP 1: ADDRESS */}
              {step === 1 && (
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="display text-xl font-bold">
                        Where should we deliver?
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Select a saved address or enter a new delivery address.
                      </p>
                    </div>
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={handleToggleNewAddress}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <Plus size={14} />{" "}
                        {showNewAddressForm ? "Select saved" : "Add new"}
                      </button>
                    )}
                  </div>

                  {/* SAVED ADDRESS CARDS */}
                  {!showNewAddressForm && savedAddresses.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {savedAddresses.map((addr, index) => {
                        const isSelected = selectedAddressIndex === index;
                        return (
                          <div
                            key={index}
                            onClick={() => handleSelectSavedAddress(index)}
                            className={`w-full rounded-xl border ${
                              isSelected
                                ? "border-primary bg-secondary/60"
                                : "border-border hover:border-primary/50"
                            } p-4 text-left cursor-pointer transition`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-background text-primary">
                                <MapPin size={17} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm font-bold">
                                    {addr.name}
                                  </p>
                                  {isSelected && (
                                    <CheckCircle2
                                      size={18}
                                      className="text-primary"
                                    />
                                  )}
                                </div>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                  {addr.address}, {addr.city}, {addr.state} -{" "}
                                  {addr.pincode}
                                </p>
                                <div className="mt-2 flex items-center gap-3 text-xs">
                                  <span className="font-semibold text-foreground">
                                    +91 {addr.phone}
                                  </span>
                                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    {addr.country || "India"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* NEW ADDRESS FORM */}
                  {(showNewAddressForm || savedAddresses.length === 0) && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold">
                          Country / Region
                        </label>
                        <select
                          name="country"
                          value={addressForm.country}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United Arab Emirates">
                            United Arab Emirates
                          </option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Other International">
                            Other International
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={addressForm.name}
                          onChange={handleAddressChange}
                          placeholder="e.g. Ananya Sharma"
                          className={`mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary ${
                            errors.name ? "border-red-500" : "border-border"
                          }`}
                        />
                        {errors.name && (
                          <ErrorMessage>{errors.name}</ErrorMessage>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={addressForm.phone}
                          onChange={handleAddressChange}
                          placeholder="10-digit mobile number"
                          className={`mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary ${
                            errors.phone ? "border-red-500" : "border-border"
                          }`}
                        />
                        {errors.phone && (
                          <ErrorMessage>{errors.phone}</ErrorMessage>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold">
                          PIN / Postal Code
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={addressForm.pincode}
                          onChange={handleAddressChange}
                          placeholder="PIN / Postal Code"
                          className={`mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary ${
                            errors.pincode ? "border-red-500" : "border-border"
                          }`}
                        />
                        {errors.pincode && (
                          <ErrorMessage>{errors.pincode}</ErrorMessage>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold">
                          Street Address
                        </label>
                        <textarea
                          name="address"
                          rows={3}
                          value={addressForm.address}
                          onChange={handleAddressChange}
                          placeholder="House No., Building, Street Name, Area"
                          className={`mt-2 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary ${
                            errors.address ? "border-red-500" : "border-border"
                          }`}
                        />
                        {errors.address && (
                          <ErrorMessage>{errors.address}</ErrorMessage>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold">City</label>
                        <input
                          type="text"
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          placeholder="City"
                          className={`mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary ${
                            errors.city ? "border-red-500" : "border-border"
                          }`}
                        />
                        {errors.city && (
                          <ErrorMessage>{errors.city}</ErrorMessage>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold">
                          State / Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={addressForm.state}
                          onChange={handleAddressChange}
                          placeholder="State"
                          className={`mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary ${
                            errors.state ? "border-red-500" : "border-border"
                          }`}
                        />
                        {errors.state && (
                          <ErrorMessage>{errors.state}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={goNext}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground"
                  >
                    Continue to payment <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 2 && (
                <div>
                  <h2 className="display text-xl font-bold">
                    Choose payment method
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Select your payment method below.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        id: "upi",
                        title: "UPI",
                        desc: "Google Pay, PhonePe, Paytm",
                        icon: WalletCards,
                      },
                      {
                        id: "card",
                        title: "Credit / Debit Card",
                        desc: "Visa, Mastercard, RuPay",
                        icon: CreditCard,
                      },
                      {
                        id: "netbanking",
                        title: "Net Banking",
                        desc: "All major Indian banks",
                        icon: Building2,
                      },
                      {
                        id: "cod",
                        title: "Cash on Delivery",
                        desc: "Pay cash upon delivery",
                        icon: Banknote,
                      },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = payment === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setPayment(m.id);
                            setErrors({});
                          }}
                          className={`rounded-xl border p-5 text-left transition ${
                            isSelected
                              ? "border-primary bg-secondary/60"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="grid size-10 place-items-center rounded-xl bg-background text-primary">
                              <Icon size={19} />
                            </div>
                            {isSelected && (
                              <CheckCircle2
                                size={18}
                                className="text-primary"
                              />
                            )}
                          </div>
                          <p className="mt-4 text-sm font-bold">{m.title}</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {m.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {payment === "upi" && (
                    <div className="mt-5 rounded-xl border border-border bg-muted p-4">
                      <label className="text-xs font-bold">UPI ID</label>
                      <input
                        type="text"
                        name="upiId"
                        value={paymentForm.upiId}
                        onChange={handlePaymentChange}
                        placeholder="username@upi"
                        className={`mt-2 w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:border-primary ${
                          errors.upiId ? "border-red-500" : "border-border"
                        }`}
                      />
                      {errors.upiId && (
                        <ErrorMessage>{errors.upiId}</ErrorMessage>
                      )}
                    </div>
                  )}

                  {payment === "card" && (
                    <div className="mt-5 grid gap-4 rounded-xl border border-border bg-muted p-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentForm.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                          className={`mt-2 w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:border-primary ${
                            errors.cardNumber
                              ? "border-red-500"
                              : "border-border"
                          }`}
                        />
                        {errors.cardNumber && (
                          <ErrorMessage>{errors.cardNumber}</ErrorMessage>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-bold">Expiry Date</label>
                        <input
                          type="text"
                          name="expiry"
                          value={paymentForm.expiry}
                          onChange={handlePaymentChange}
                          placeholder="MM / YY"
                          className={`mt-2 w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:border-primary ${
                            errors.expiry ? "border-red-500" : "border-border"
                          }`}
                        />
                        {errors.expiry && (
                          <ErrorMessage>{errors.expiry}</ErrorMessage>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-bold">CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          value={paymentForm.cvv}
                          onChange={handlePaymentChange}
                          placeholder="•••"
                          className={`mt-2 w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:border-primary ${
                            errors.cvv ? "border-red-500" : "border-border"
                          }`}
                        />
                        {errors.cvv && (
                          <ErrorMessage>{errors.cvv}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex-1 rounded-xl border border-border px-5 py-3.5 text-sm font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="flex-1 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground"
                    >
                      Confirm order <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Confirm & PLACE ORDER */}
              {step === 3 && (
                <div>
                  <h2 className="display text-xl font-bold">
                    Confirm your order
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Check your items, shipping address, and payment method.
                  </p>

                  <div className="mt-6 divide-y divide-border rounded-xl border border-border">
                    {cartItems.map((p) => {
                      const qty = Number(p.quantity) || 1;
                      return (
                        <div key={p.id || p._id} className="flex gap-4 p-4">
                          <div
                            className={`grid size-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800`}
                          >
                            <span className="text-xl font-extrabold text-white">
                              {p.mark || "P"}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-bold">
                              {p.title || p.name}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Vendor: {p.vendor}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Qty: {qty}
                            </p>
                          </div>
                          <p className="text-sm font-bold">
                            {money(Number(p.price || p.unitPrice || 0) * qty)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-xl bg-muted p-4 space-y-3">
                    <div className="flex gap-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide">
                          Delivery Address ({addressForm.country})
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {addressForm.name}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {addressForm.address}, {addressForm.city},{" "}
                          {addressForm.state} - {addressForm.pincode} (
                          {addressForm.country})
                        </p>
                        <p className="mt-1 text-xs font-semibold">
                          +91 {addressForm.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-muted p-4">
                    <div className="flex gap-3">
                      <CreditCard
                        size={18}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide">
                          Payment Method
                        </p>
                        <p className="mt-1 text-sm font-semibold uppercase">
                          {payment === "upi"
                            ? "UPI"
                            : payment === "card"
                              ? "Credit / Debit Card"
                              : payment === "netbanking"
                                ? "Net Banking"
                                : "Cash on Delivery"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="mt-6 flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        if (e.target.checked) clearFieldError("terms");
                      }}
                      className="mt-1 size-4 accent-primary"
                    />
                    <span className="text-xs leading-5 text-muted-foreground">
                      I agree to the SmartCommerce{" "}
                      <span className="font-semibold text-foreground">
                        Terms & Conditions
                      </span>{" "}
                      and{" "}
                      <span className="font-semibold text-foreground">
                        Privacy Policy
                      </span>
                      .
                    </span>
                  </label>
                  {errors.terms && <ErrorMessage>{errors.terms}</ErrorMessage>}

                  {apiError && (
                    <div className="mt-4 p-3 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2 font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {apiError}
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex-1 rounded-xl border border-border px-5 py-3.5 text-sm font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={!termsAccepted || submittingOrder}
                      onClick={handlePlaceOrder}
                      className="flex-1 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submittingOrder ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" /> Placing
                          order…
                        </>
                      ) : (
                        <>
                          Place order <Check size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT ORDER SUMMARY */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[1.25rem] bg-[#203b42] text-white">
              <div className="p-6">
                <p className="mono text-[10px] uppercase tracking-widest text-white/50 font-bold">
                  Order Summary
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <p className="display text-3xl font-extrabold">
                    {money(total)}
                  </p>
                  <span className="text-xs text-white/50">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/60 flex items-center gap-1.5">
                      <Globe size={13} className="text-teal-300" />
                      Delivery (
                      {activeCountry.toLowerCase() === "india"
                        ? "India"
                        : "International"}
                      )
                    </span>
                    <span>
                      {deliveryCharge === 0 ? (
                        <span className="text-teal-300 font-bold">FREE</span>
                      ) : (
                        money(deliveryCharge)
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <div className="flex justify-between">
                    <span className="font-bold">Total Payable</span>
                    <span className="display text-xl font-extrabold">
                      {money(total)}
                    </span>
                  </div>
                  <p className="mt-1 text-right text-[10px] text-white/40">
                    Inclusive of all taxes & delivery
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-2">
                    <ShieldCheck size={17} className="shrink-0 text-teal-300" />
                    <div>
                      <p className="text-[11px] font-bold">100% Secure</p>
                      <p className="mt-1 text-[10px] text-white/40">
                        Verified checkout
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <LockKeyhole size={17} className="shrink-0 text-teal-300" />
                    <div>
                      <p className="text-[11px] font-bold">Encrypted</p>
                      <p className="mt-1 text-[10px] text-white/40">
                        SSL encrypted
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VENDORS BREAKDOWN */}
            <div className="mt-4 rounded-2xl border border-border bg-card p-5">
              <p className="mono text-[10px] uppercase tracking-widest text-primary font-bold">
                Vendors
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Products from {vendors.length}{" "}
                {vendors.length === 1 ? "vendor" : "vendors"}
              </p>
              <div className="mt-4 space-y-3">
                {vendors.map((v) => {
                  const cnt = cartItems.filter((p) => p.vendor === v).length;
                  return (
                    <div
                      key={v}
                      className="flex items-center justify-between rounded-xl bg-muted px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="grid size-7 place-items-center rounded-lg bg-background text-primary">
                          <Package size={13} />
                        </div>
                        <span className="text-xs font-bold">{v}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {cnt} {cnt === 1 ? "item" : "items"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

const ErrorMessage = ({ children }) => (
  <p className="mt-2 flex items-start gap-1 text-xs font-medium text-red-600">
    <AlertCircle size={13} className="mt-0.5 shrink-0" />
    {children}
  </p>
);

export default CheckoutPage;
