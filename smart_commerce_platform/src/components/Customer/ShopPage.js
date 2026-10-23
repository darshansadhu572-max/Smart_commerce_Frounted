import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { handleAuthError } from "../../AuthRoute";
import ProductCard from "./ProductCard";
import { addToCompare } from "../../utils/compareUtils";

const API_BASE_URL = "http://localhost:5000/api/customer";

// AUTH HELPERS
const getToken = () => localStorage.getItem("token") || null;
const isLoggedIn = () => Boolean(getToken());

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // DATA STATE
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FILTER STATE
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // WISHLIST STATE
  const [wishedIds, setWishedIds] = useState([]);

  // FETCH PRODUCTS & CATEGORIES
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`),
          axios.get(`${API_BASE_URL}/categories`),
        ]);

        const prodData = prodRes.data;
        setProducts(
          Array.isArray(prodData) ? prodData : prodData.products || [],
        );

        const catData = catRes.data;
        setCategories(
          Array.isArray(catData) ? catData : catData.categories || [],
        );
      } catch (err) {
        console.error("ShopPage fetch error:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // LOAD WISHLIST (DB or localStorage)
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
          console.error("Wishlist load error:", err);
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

  // CATEGORY FROM URL
  const categorySlugFromURL = searchParams.get("category") || "";

  // Find matched category object from URL slug
  const selectedCategory =
    categories.find(
      (cat) =>
        (cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-")) ===
        categorySlugFromURL,
    ) || null; // null means "All"

  const setCategory = (cat) => {
    if (!cat) {
      setSearchParams({});
    } else {
      const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-");
      setSearchParams({ category: slug });
    }
  };

  // FILTERED & SORTED PRODUCTS
  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      // Category match — compare by _id or slug
      const matchesCategory =
        !selectedCategory ||
        String(p.category?._id || p.category) === String(selectedCategory._id);

      // Search match across name, description, vendor name
      const search = q.toLowerCase();
      const vendorName =
        typeof p.vendor === "object"
          ? `${p.vendor?.storeName || ""} ${p.vendor?.firstName || ""} ${p.vendor?.lastName || ""}`.toLowerCase()
          : String(p.vendor || "").toLowerCase();

      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(search) ||
        p.shortDescription?.toLowerCase().includes(search) ||
        p.category?.name?.toLowerCase().includes(search) ||
        vendorName.includes(search);

      return matchesCategory && matchesSearch;
    });

    if (sort === "Price low to high") {
      return [...result].sort(
        (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
      );
    }
    if (sort === "Price high to low") {
      return [...result].sort(
        (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
      );
    }
    if (sort === "Newest") {
      return [...result].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    return result;
  }, [products, selectedCategory, q, sort]);

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

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* PAGE HEADER */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              The catalogue
            </p>
            <h1 className="display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Shop with a point of view.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {loading
                ? "Loading..."
                : `${filtered.length} products curated from trusted stores`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filters Toggle */}
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option>Price low to high</option>
              <option>Price high to low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
      </section>

      {/* SHOP AREA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category
                </p>
                {selectedCategory && (
                  <button
                    onClick={() => setCategory(null)}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setCategory(null)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    !selectedCategory
                      ? "bg-primary font-bold text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  All products
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      selectedCategory?._id === cat._id
                        ? "bg-primary font-bold text-white"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.name}
                    <span className="ml-1 text-[10px] opacity-60">
                      ({cat.productsCount || 0})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* PRODUCTS AREA */}
          <div>
            {/* Search */}
            <div className="mb-6">
              <div className="flex items-center rounded-xl border border-border bg-card px-3 transition focus-within:border-primary">
                <Search size={17} className="shrink-0 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
                  placeholder="Search products, brands or categories..."
                />
                {q && (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* MOBILE FILTERS */}
            {showFilters && (
              <div className="mb-6 rounded-2xl border border-border bg-card p-4 lg:hidden">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setCategory(null);
                      setShowFilters(false);
                    }}
                    className={`rounded-full px-4 py-2 text-xs font-bold ${
                      !selectedCategory
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setCategory(cat);
                        setShowFilters(false);
                      }}
                      className={`rounded-full px-4 py-2 text-xs font-bold ${
                        selectedCategory?._id === cat._id
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVE CATEGORY BANNER */}
            {selectedCategory && (
              <div className="mb-6 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Browsing category
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {selectedCategory.name}
                  </p>
                </div>
                <button
                  onClick={() => setCategory(null)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-background hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* PRODUCT COUNT */}
            {!loading && !error && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-bold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  products
                </p>
                {q && (
                  <button
                    onClick={() => setQ("")}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-sm">Loading products...</p>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-red-500">
                <AlertCircle size={32} />
                <p className="text-sm font-semibold">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
                >
                  Retry
                </button>
              </div>
            )}

            {/* PRODUCT GRID */}
            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    onCart={() => handleCart(product)}
                    onWish={() => handleWish(product)}
                    wished={wishedIds.includes(
                      String(product._id || product.id),
                    )}
                    onCompare={() => addToCompare(product)}
                  />
                ))}
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && filtered.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-20 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary">
                  <Search size={24} className="text-primary" />
                </div>
                <h2 className="display mt-5 text-2xl font-extrabold">
                  No perfect matches yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Try a broader search or clear the filters to discover more
                  products.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setCategory(null);
                  }}
                  className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ShopPage;
