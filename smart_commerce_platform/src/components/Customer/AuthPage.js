import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleAuthError } from "../../AuthRoute";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  User,
  UserCheck,
  Loader2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/users";
const CUSTOMER_API_URL = "http://localhost:5000/api/customer";

// Helper function to sync guest cart & wishlist to DB after login
const syncGuestDataAfterLogin = async (token) => {
  try {
    // 1. Sync Guest Cart
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(localCart) && localCart.length > 0) {
      const items = localCart
        .map((item) => ({
          productId: item._id || item.id,
          quantity: item.quantity || 1,
        }))
        .filter((i) => i.productId);

      if (items.length > 0) {
        await axios
          .post(
            `${CUSTOMER_API_URL}/cart/sync`,
            { items },
            {
              headers: {
                "Content-Type": "Application/json",
                Authorization: "Bearer " + token,
              },
            },
          )
          .catch((err) => {
            handleAuthError(err);

            console.error("Cart sync API error:", err);
          });
      }

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
    }

    // 2. Sync Guest Wishlist
    const localWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (Array.isArray(localWishlist) && localWishlist.length > 0) {
      const productIds = localWishlist
        .map((item) => (typeof item === "object" ? item._id || item.id : item))
        .filter(Boolean);

      if (productIds.length > 0) {
        await axios
          .post(
            `${CUSTOMER_API_URL}/wishlist/sync`,
            { productIds },
            {
              headers: {
                "Content-Type": "Application/json",
                Authorization: "Bearer " + token,
              },
            },
          )
          .catch((err) => {
            handleAuthError(err);

            console.error("Wishlist sync API error:", err);
          });
      }

      localStorage.removeItem("wishlist");
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  } catch (err) {
    console.error("Sync guest data error:", err);
  }
};

const AuthPage = ({ mode = "login" }) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  const titles = {
    login: "Welcome back.",
    register: "Make room for better finds.",
    forgot: "Let's get you back in.",
  };

  const subtitles = {
    login:
      "Sign in to continue your shopping journey and pick up where you left off.",
    register:
      "Create your SmartCommerce account and make shopping a little more intentional.",
    forgot:
      "Enter your email address and we'll help you get back into your account.",
  };

  const validate = () => {
    if (isLogin) {
      if (!formData.email.trim()) {
        return "Please enter your email address.";
      }
      if (!formData.password) {
        return "Please enter your password.";
      }
    }

    if (isRegister) {
      if (!formData.firstName.trim()) {
        return "Please enter your first name.";
      }

      if (!formData.lastName.trim()) {
        return "Please enter your last name.";
      }

      if (!formData.email.trim()) {
        return "Please enter your email address.";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        return "Please enter a valid email address.";
      }

      if (!formData.phone.trim()) {
        return "Please enter your phone number.";
      }

      if (!formData.password) {
        return "Please create a password.";
      }

      if (formData.password.length < 8) {
        return "Password must contain at least 8 characters.";
      }

      if (formData.password !== formData.confirmPassword) {
        return "Passwords do not match.";
      }

      if (!formData.termsAccepted) {
        return "You must agree to the Terms of Service and Privacy Policy.";
      }
    }

    if (isForgot) {
      if (!formData.email.trim()) {
        return "Please enter your email address.";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        return "Please enter a valid email address.";
      }
    }

    return "";
  };

  // API SUBMIT HANDLER USING AXIOS FOR LOGIN, REGISTER, & FORGOT PASSWORD
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // 1. LOGIN
        const res = await axios.post(`${API_BASE_URL}/login`, {
          email: formData.email.trim(),
          password: formData.password,
        });

        const data = res.data;

        if (!data.success) {
          throw new Error(
            data.message || "Failed to log in. Please check your credentials.",
          );
        }

        // Save Auth Token and User info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Sync local guest cart and wishlist to Database
        await syncGuestDataAfterLogin(data.token);

        setSubmitted(true);

        // Redirect to intended checkout page or home
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "/";
        sessionStorage.removeItem("redirectAfterLogin");

        setTimeout(() => navigate(redirectUrl), 1200);
      } else if (isRegister) {
        // 2. REGISTER
        const res = await axios.post(`${API_BASE_URL}/register`, {
          firstName: formData.firstName.trim(),
          middleName: formData.middleName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          gender: formData.gender || undefined,
          dob: formData.dob || undefined,
          password: formData.password,
          role: "customer",
        });

        const data = res.data;

        if (!data.success) {
          throw new Error(data.message || "Failed to register account.");
        }

        localStorage.setItem("user", JSON.stringify(data.user));

        setSubmitted(true);
        setTimeout(() => navigate("/login"), 1200);
      } else if (isForgot) {
        // 3. FORGOT
        const res = await axios.post(`${API_BASE_URL}/forgot-password`, {
          email: formData.email.trim(),
        });

        const data = res.data;

        if (!data.success) {
          throw new Error(data.message || "Failed to send recovery email.");
        }

        setSubmitted(true);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please check your backend connection.";
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFooterText = () => {
    if (isLogin) {
      return (
        <>
          New to SmartCommerce?{" "}
          <Link
            to="/register"
            className="font-bold text-primary hover:underline"
          >
            Create an account
          </Link>
        </>
      );
    }

    if (isRegister) {
      return (
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </>
      );
    }

    return (
      <>
        Remember your password?{" "}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Back to sign in
        </Link>
      </>
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top navigation */}
      <div className="border-b border-border bg-[#f0eadf] px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
              SC
            </span>
            <span className="display text-lg font-extrabold tracking-tight">
              Smart<span className="text-primary">Commerce</span>
            </span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-white/60 hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to store
          </Link>
        </div>
      </div>

      {/* Main Section */}
      <section className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden flex-col justify-center px-8 py-16 lg:flex lg:px-16">
          <div className="max-w-lg">
            <div className="mb-8 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary text-lg font-black text-primary-foreground">
                SC
              </div>
              <div>
                <p className="display text-xl font-extrabold">
                  Smart<span className="text-primary">Commerce</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  A calmer way to choose well.
                </p>
              </div>
            </div>

            <h1 className="display text-5xl font-extrabold leading-[1.05] tracking-tight xl:text-6xl">
              A calmer way
              <br />
              to choose well.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
              SmartCommerce brings trusted Indian vendors, thoughtful products
              and better comparisons together in one place.
            </p>

            {/* Trust card */}
            <div className="mt-10 rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <p className="font-bold">Trusted shopping, made simpler.</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Compare products, discover independent stores and keep your
                    choices in one account.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-5">
                <div>
                  <p className="display text-xl font-extrabold">2,400+</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Local makers
                  </p>
                </div>
                <div>
                  <p className="display text-xl font-extrabold">4.8/5</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Shopper rating
                  </p>
                </div>
                <div>
                  <p className="display text-xl font-extrabold">18k+</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Shoppers
                  </p>
                </div>
              </div>
            </div>

            {/* Vendor CTA */}
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#203b42] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-white/10">
                  <Store size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold">
                    Selling something special?
                  </p>
                  <p className="text-xs text-white/55">
                    Join SmartCommerce as a vendor.
                  </p>
                </div>
              </div>

              <Link
                to="/vendor/login"
                className="flex items-center gap-1 text-sm font-bold text-[#f0a84f] hover:underline"
              >
                Become a vendor
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-lg">
            {/* Mobile logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <span className="grid size-10 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
                  SC
                </span>
                <span className="display text-xl font-extrabold">
                  Smart<span className="text-primary">Commerce</span>
                </span>
              </Link>
            </div>

            {/* Form Card */}
            <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_20px_60px_rgba(37,50,64,.08)] sm:p-8">
              {/* Heading */}
              <div>
                <div className="mb-4 inline-flex rounded-full bg-secondary px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                  {isLogin && "Your account"}
                  {isRegister && "Join SmartCommerce"}
                  {isForgot && "Account recovery"}
                </div>

                <h2 className="display text-3xl font-extrabold tracking-tight">
                  {titles[mode]}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {subtitles[mode]}
                </p>
              </div>

              {/* Success State */}
              {submitted ? (
                <div className="mt-8">
                  <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
                    <div className="flex gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-600 text-white">
                        <Check size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-teal-900">
                          {isLogin
                            ? "You're signed in."
                            : isRegister
                              ? "Account created successfully."
                              : "Check your inbox."}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-teal-800">
                          {isLogin
                            ? "Taking you back to SmartCommerce..."
                            : isRegister
                              ? "Your SmartCommerce account is ready. You can now sign in."
                              : "If an account exists with this email, recovery instructions have been sent."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isLogin && (
                    <Link
                      to="/login"
                      className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
                    >
                      Continue to sign in
                    </Link>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-7 space-y-4"
                >
                  {/* Custom Error Alert */}
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {error}
                    </div>
                  )}

                  {/* REGISTER FIELDS */}
                  {isRegister && (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* First Name */}
                        <div>
                          <label className="text-sm font-semibold">
                            First Name *
                          </label>
                          <div className="relative mt-1.5">
                            <User
                              size={17}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={(e) =>
                                updateField("firstName", e.target.value)
                              }
                              placeholder="Ananya"
                              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                          </div>
                        </div>

                        {/* Middle Name */}
                        <div>
                          <label className="text-sm font-semibold">
                            Middle Name{" "}
                            <span className="text-xs text-muted-foreground">
                              (Optional)
                            </span>
                          </label>
                          <div className="relative mt-1.5">
                            <User
                              size={17}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                              type="text"
                              value={formData.middleName}
                              onChange={(e) =>
                                updateField("middleName", e.target.value)
                              }
                              placeholder="Kumar"
                              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="text-sm font-semibold">
                          Last Name *
                        </label>
                        <div className="relative mt-1.5">
                          <UserCheck
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              updateField("lastName", e.target.value)
                            }
                            placeholder="Sharma"
                            className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div>
                    <label className="text-sm font-semibold">
                      Email Address *
                    </label>
                    <div className="relative mt-1.5">
                      <Mail
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="ananya@email.com"
                        className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  {isRegister && (
                    <div>
                      <label className="text-sm font-semibold">
                        Phone Number *
                      </label>
                      <div className="relative mt-1.5">
                        <Phone
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Gender & Date of Birth */}
                  {isRegister && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Gender */}
                      <div>
                        <label className="text-sm font-semibold">
                          Gender{" "}
                          <span className="text-xs text-muted-foreground">
                            (Optional)
                          </span>
                        </label>
                        <div className="relative mt-1.5">
                          <select
                            value={formData.gender}
                            onChange={(e) =>
                              updateField("gender", e.target.value)
                            }
                            className="w-full rounded-xl border border-border bg-background py-3 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">
                              Prefer not to say
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="text-sm font-semibold">
                          Date of Birth{" "}
                          <span className="text-xs text-muted-foreground">
                            (Optional)
                          </span>
                        </label>
                        <div className="relative mt-1.5">
                          <Calendar
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                          <input
                            type="date"
                            value={formData.dob}
                            onChange={(e) => updateField("dob", e.target.value)}
                            className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  {!isForgot && (
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">
                          Password *
                        </label>
                        {isLogin && (
                          <Link
                            to="/forgot-password"
                            className="text-xs font-bold text-primary hover:underline"
                          >
                            Forgot password?
                          </Link>
                        )}
                      </div>

                      <div className="relative mt-1.5">
                        <LockKeyhole
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            updateField("password", e.target.value)
                          }
                          placeholder="Enter your password"
                          className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>

                      {isRegister && (
                        <p className="mt-1.5 text-[11px] text-muted-foreground">
                          Must contain at least 8 characters.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Confirm Password */}
                  {isRegister && (
                    <div>
                      <label className="text-sm font-semibold">
                        Confirm Password *
                      </label>
                      <div className="relative mt-1.5">
                        <LockKeyhole
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            updateField("confirmPassword", e.target.value)
                          }
                          placeholder="Confirm your password"
                          className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Terms Agreement */}
                  {isRegister && (
                    <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={(e) =>
                          updateField("termsAccepted", e.target.checked)
                        }
                        className="mt-1 size-4 shrink-0 accent-[hsl(168,48%,31%)]"
                      />
                      <span>
                        I agree to the SmartCommerce{" "}
                        <Link to="/terms" className="font-bold text-primary">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="font-bold text-primary">
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {isLogin && "Sign in"}
                        {isRegister && "Create account"}
                        {isForgot && "Send recovery link"}
                        <ArrowRight
                          size={17}
                          className="transition group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Footer navigation */}
              {!submitted && (
                <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
                  {getFooterText()}
                </div>
              )}
            </div>

            {/* Vendor link on mobile */}
            <div className="mt-5 rounded-2xl border border-border bg-secondary/60 p-4 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Store size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Are you a seller?</p>
                  <p className="text-xs text-muted-foreground">
                    Start selling on SmartCommerce.
                  </p>
                </div>
                <Link
                  to="/vendor/register"
                  className="text-xs font-bold text-primary"
                >
                  Register
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center text-[11px] text-muted-foreground">
              Built for Bharat · SmartCommerce
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
