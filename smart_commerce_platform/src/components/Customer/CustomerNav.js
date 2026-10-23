import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Menu,
  Search,
  Heart,
  ShoppingCart,
  UserRound,
  X,
  LogOut,
  User,
  Package,
  LogIn,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/users";

const CustomerNav = ({ cartCount = 0, wishCount = 0 }) => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Sync user authentication state from localStorage on page/route change
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setUserMenuOpen(false);
  }, [location]);

  const submit = (e) => {
    e.preventDefault();

    if (!q.trim()) {
      navigate("/");
      return;
    }

    navigate(`/shop?search=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      if (user) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setUserMenuOpen(false);
        navigate("/login");
      }
    } catch (err) {
      console.warn("Logout notice skipped:", err?.message || err);
    }
  };

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-muted md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <span className="display text-lg font-extrabold tracking-tight">
              Smart<span className="text-primary">Commerce</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={submit}
            className="mx-auto hidden max-w-xl flex-1 items-center rounded-xl border border-border bg-card px-3 focus-within:border-primary md:flex"
          >
            <Search size={17} className="text-muted-foreground" />

            <input
              data-testid="input-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Search products, stores, or try "laptop under ₹70,000"'
              className="w-full border-0 bg-transparent px-3 py-3 text-sm outline-none"
            />
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              to="/shop"
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              Shop
            </Link>

            <Link
              to="/categories"
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              Categories
            </Link>

            <Link
              to="/vendors"
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              Stores
            </Link>

            <Link
              to="/about"
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              Contact
            </Link>

            <Link
              to="/compare"
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              Compare
            </Link>

            {user ? (
              <Link
                to="/orders"
                className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted"
              >
                Orders
              </Link>
            ) : (
              <></>
            )}
          </nav>

          {/* Action Icons */}
          <div className="ml-auto flex items-center gap-2">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative rounded-lg p-2 hover:bg-muted"
              aria-label="Wishlist"
            >
              <Heart size={19} />

              {wishCount > 0 && (
                <i className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold not-italic">
                  {wishCount}
                </i>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative rounded-lg p-2 hover:bg-muted"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={19} />

              {cartCount > 0 && (
                <i className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-white not-italic">
                  {cartCount}
                </i>
              )}
            </Link>

            {/* Profile OR Login Button */}
            {user ? (
              /* LOGGED IN: Show Profile Icon with Dropdown */
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted"
                  title={`Logged in as ${user.firstName || "User"}`}
                >
                  <UserRound size={19} className="text-primary" />
                </button>

                {/* User Menu Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-lg">
                    <div className="border-b border-border px-3 py-2">
                      <p className="text-xs font-bold text-foreground">
                        Hi, {user.firstName || "User"}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium hover:bg-muted"
                    >
                      <User size={14} /> My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium hover:bg-muted"
                    >
                      <Package size={14} /> My Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* NOT LOGGED IN: Hide Profile Icon and Show Sign In Button */
              <Link
                to="/login"
                className="hidden items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:opacity-90 sm:inline-flex"
              >
                <LogIn size={14} />
                Sign in
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="border-t border-border px-4 pb-4 md:hidden">
            {/* Mobile Search */}
            <form
              onSubmit={submit}
              className="my-3 flex items-center rounded-xl border border-border bg-card px-3 focus-within:border-primary"
            >
              <Search size={17} className="text-muted-foreground" />

              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                placeholder="Search SmartCommerce"
              />
            </form>

            {/* Mobile Links */}
            <div className="flex flex-wrap gap-2">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-muted px-3 py-2 text-sm font-medium"
              >
                Shop
              </Link>

              <Link
                to="/categories"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-muted px-3 py-2 text-sm font-medium"
              >
                Categories
              </Link>

              <Link
                to="/vendors"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-muted px-3 py-2 text-sm font-medium"
              >
                Stores
              </Link>

              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-muted px-3 py-2 text-sm font-medium"
              >
                About
              </Link>

              <Link
                to="/compare"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-muted px-3 py-2 text-sm font-medium"
              >
                Compare
              </Link>

              {user ? (
                <Link
                  to="/orders"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-muted px-3 py-2 text-sm font-medium"
                >
                  Orders
                </Link>
              ) : (
                <></>
              )}

              {/* Mobile User Authentication Link */}
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600"
                >
                  Sign Out ({user.firstName})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default CustomerNav;
