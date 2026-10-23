import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { handleAuthError } from "../../AuthRoute";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Star,
  Truck,
  Users,
  Loader2,
  AlertCircle,
  Globe,
} from "lucide-react";

import ProductCard from "./ProductCard";

const API_BASE_URL = "http://localhost:5000/api/customer";

//  AUTH HELPERS
const getToken = () => localStorage.getItem("token") || null;
const isLoggedIn = () => Boolean(getToken());

const getInitials = (name) => {
  if (!name) return "SC";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

//  COMPONENT
const VendorStorePage = () => {
  const { vendorId } = useParams();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [wishedIds, setWishedIds] = useState([]);

  //  FETCH VENDOR & PRODUCTS
  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      setError("");
      try {
        const [venRes, prodRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/vendors`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/products`).catch(() => ({ data: [] })),
        ]);

        // Process Vendors
        const venData = venRes.data;
        const venList = Array.isArray(venData)
          ? venData
          : venData.vendors || venData.data || [];

        const foundVendor = venList.find(
          (item) => String(item._id || item.id) === String(vendorId),
        );

        if (!foundVendor) {
          setError("Store not found");
          setLoading(false);
          return;
        }

        setVendor(foundVendor);

        // Process Products for this vendor
        const prodData = prodRes.data;
        const prodList = Array.isArray(prodData)
          ? prodData
          : prodData.products || prodData.data || [];

        const vendorProds = prodList.filter((p) => {
          const vRef = p.vendor?._id || p.vendor?.id || p.vendor;
          return (
            String(vRef) === String(vendorId) ||
            String(p.vendorId) === String(vendorId)
          );
        });

        setProducts(vendorProds);
      } catch (err) {
        console.error("Error fetching vendor store data:", err);
        setError("Failed to load store information.");
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) fetchStoreData();
  }, [vendorId]);

  //  LOAD WISHLIST
  useEffect(() => {
    const loadWishlist = async () => {
      if (isLoggedIn()) {
        try {
          const res = await axios.get(`${API_BASE_URL}/wishlist`, {
            headers: {
              "Content-Type": "Application/json",
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

          console.error("Wishlist error:", err);
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

  //  CART & WISHLIST HANDLERS
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
        console.error("Cart localStorage error:", err);
      }
    }
  };

  const handleWish = async (product) => {
    const pId = String(product._id || product.id);

    if (isLoggedIn()) {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/wishlist/toggle`,
          { productId: pId },
          {
            headers: {
              "Content-Type": "Application/json",
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

  //  CATEGORIES EXTRACTED FROM PRODUCTS
  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        products
          .map((p) =>
            typeof p.category === "object" ? p.category?.name : p.category,
          )
          .filter(Boolean),
      ),
    ];
    return ["All", ...unique];
  }, [products]);

  //  FILTER + SEARCH + SORT
  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    let result = products.filter((product) => {
      const catName =
        typeof product.category === "object"
          ? product.category?.name
          : product.category;

      const matchesCategory = category === "All" || catName === category;
      const matchesSearch = product.name?.toLowerCase().includes(searchValue);

      return matchesCategory && matchesSearch;
    });

    if (sort === "Price low to high") {
      result = [...result].sort(
        (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
      );
    }
    if (sort === "Price high to low") {
      result = [...result].sort(
        (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
      );
    }

    return result;
  }, [products, category, search, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("Featured");
  };

  //  LOADING / NOT FOUND STATES
  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-sm font-semibold">Loading store...</p>
      </main>
    );
  }

  if (error || !vendor) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary text-primary">
              <Package size={28} />
            </div>
            <h1 className="display mt-5 text-2xl font-extrabold">
              {error || "Store not found"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The store you are looking for does not exist or has been removed.
            </p>
            <Link
              to="/vendors"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              <ArrowLeft size={16} />
              Back to stores
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const storeName = vendor.storeName || vendor.businessName || "Vendor Store";
  const initials = vendor.initials || getInitials(storeName);
  const city = vendor.city || "India";
  const description =
    vendor.storeDescription ||
    vendor.description ||
    "Verified SmartCommerce seller.";
  const color = vendor.color || "bg-primary";

  return (
    <main className="min-h-screen bg-background">
      {/* BACK TO STORES */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          to="/vendors"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to stores
        </Link>
      </div>

      {/* STORE INFORMATION CARD */}
      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.5rem] border border-border bg-card p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row">
              {/* LOGO */}
              <div
                className={`grid size-20 shrink-0 place-items-center rounded-2xl ${color} text-2xl font-black text-white shadow-sm sm:size-24 sm:text-3xl`}
              >
                {initials}
              </div>

              {/* NAME + DETAILS */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {storeName}
                  </h1>

                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-[10px] font-bold text-teal-800">
                    <CheckCircle2 size={12} />
                    Verified
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin size={14} />
                    {city}
                  </span>
                  {vendor.website ? (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Globe size={14} />· {vendor.website}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6 max-w-4xl">
            <p className="text-sm leading-7 text-muted-foreground sm:text-[15px]">
              {description}
            </p>
          </div>

          {/* STORE STATS */}
          <div className="mt-7 grid grid-cols-2 gap-5 border-t border-border pt-6 sm:grid-cols-3">
            <StoreStat
              icon={Package}
              value={filteredProducts.length}
              label="Products"
            />
            <StoreStat
              icon={Users}
              value={vendor.orders || "99+"}
              label="Orders completed"
            />
            <StoreStat
              icon={ShieldCheck}
              value={vendor.since ? `Since ${vendor.since}` : "Verified"}
              label="Trusted seller"
            />
          </div>
        </div>
      </section>

      {/* PRODUCT COLLECTION */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
              Store collection
            </p>
            <h2 className="display mt-2 text-3xl font-extrabold tracking-tight">
              Shop {storeName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore products available from this store.
            </p>
          </div>

          {/* SEARCH + SORT */}
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <div className="flex min-w-0 items-center rounded-xl border border-border bg-card px-3 sm:min-w-[260px]">
              <Search size={17} className="shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search this store..."
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="Featured">Featured</option>
              <option value="Price low to high">Price low to high</option>
              <option value="Price high to low">Price high to low</option>
            </select>
          </div>
        </div>

        {/* CATEGORY FILTER */}
        {categories.length > 1 && (
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                  category === item
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* PRODUCT COUNT */}
        <div className="mb-5 mt-5 flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-foreground">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

          {(search || category !== "All" || sort !== "Featured") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onCart={() => handleCart(product)}
                onWish={() => handleWish(product)}
                wished={wishedIds.includes(String(product._id || product.id))}
                onCompare={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card px-6 py-20 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
              <Package size={26} />
            </div>
            <h3 className="display mt-5 text-lg font-bold">
              No products found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Try another search or category filter.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* STORE PROMISE */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-[1.5rem] bg-[#203b42] p-6 text-white sm:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <PromiseItem
              icon={ShieldCheck}
              title="Verified store"
              text="Every store on SmartCommerce goes through our seller verification process."
            />
            <PromiseItem
              icon={Truck}
              title="Reliable delivery"
              text="Orders are packed and dispatched by the store with SmartCommerce support."
            />
          </div>
        </div>
      </section>
    </main>
  );
};

function StoreStat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
        <Icon size={17} />
      </div>
      <div>
        <p className="text-sm font-extrabold">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function PromiseItem({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
        <Icon size={19} />
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-white/60">{text}</p>
      </div>
    </div>
  );
}

export default VendorStorePage;
