import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {handleAuthError} from "../../AuthRouteAdmin";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Package,
  ChevronDown,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const formatPrice = (val) => {
  const num = Number(val);
  return isNaN(num) ? "0" : num.toLocaleString("en-IN");
};

const formatNumber = (val) => {
  const num = Number(val);
  return isNaN(num) ? "0" : num.toLocaleString("en-IN");
};

// Normalize backend approvalStatus + isActive into UI status
const getNormalizedStatus = (product) => {
  const approval = (product.approvalStatus || "").toLowerCase();
  if (approval === "approved" && product.isActive !== false) return "Active";
  if (approval === "pending") return "Pending";
  if (approval === "rejected" || product.isActive === false) return "Inactive";
  if (product.isActive === true) return "Active";
  return "Active";
};

const AdminProducts = () => {
  const token = localStorage.getItem("adminToken");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // FETCH ALL PRODUCTS FROM BACKEND
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_BASE_URL}/products`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = res.data;

      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data.success && Array.isArray(data.products))
        list = data.products;
      else if (Array.isArray(data.products)) list = data.products;
      else if (Array.isArray(data.data)) list = data.data;

      setProducts(list);
    } catch (err) {
      handleAuthError(err);

      console.error("Error fetching products:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load products from backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Dynamic categories from backend product data
  const categories = useMemo(() => {
    const list = products.map((p) => {
      if (typeof p.category === "object" && p.category !== null) {
        return p.category.name || "General";
      }
      return p.categoryName || p.category || "General";
    });
    return ["All", ...new Set(list)];
  }, [products]);

  // STATISTICS
  const totalProducts = products.length;

  const activeProducts = products.filter(
    (p) => getNormalizedStatus(p) === "Active",
  ).length;

  const pendingProducts = products.filter(
    (p) => getNormalizedStatus(p) === "Pending",
  ).length;

  const lowStockProducts = products.filter(
    (p) => Number(p.stock || 0) <= 10,
  ).length;

  // FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name = product.name || "";
      const vendorName =
        typeof product.vendor === "object" && product.vendor !== null
          ? product.vendor.storeName ||
            product.vendor.businessName ||
            product.vendor.name ||
            ""
          : "";
      const catName =
        typeof product.category === "object" && product.category !== null
          ? product.category.name
          : product.categoryName || product.category || "General";
      const pStatus = getNormalizedStatus(product);

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        name.toLowerCase().includes(searchText) ||
        vendorName.toLowerCase().includes(searchText);

      const matchesStatus = statusFilter === "All" || pStatus === statusFilter;
      const matchesCategory =
        categoryFilter === "All" || catName === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, search, statusFilter, categoryFilter]);

  // STATUS CHANGE (Approve / Pending / Inactive)
  const handleStatusChange = async (product, newStatus) => {
    const targetId = product._id || product.id;
    setActionLoadingId(targetId);

    let payload = {};
    if (newStatus === "Active") {
      payload = { approvalStatus: "approved", isActive: true };
    } else if (newStatus === "Pending") {
      payload = { approvalStatus: "pending", isActive: false };
    } else {
      payload = { approvalStatus: "rejected", isActive: false };
    }

    try {
      const res = await axios.put(
        `${API_BASE_URL}/products/${targetId}`,
        payload,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: "Bearer " + token,
          },
        },
      );

      if (res.status === 200 || res.data?.success) {
        setProducts((prev) =>
          prev.map((item) =>
            (item._id || item.id) === targetId ? { ...item, ...payload } : item,
          ),
        );
      }
    } catch (err) {
      handleAuthError(err);

      console.error("Status change error:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to update product status.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (product) => {
    const name = product.name || "this product";
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    const targetId = product._id || product.id;
    setActionLoadingId(targetId);

    try {
      const res = await axios.delete(`${API_BASE_URL}/products/${targetId}`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (res.status === 200 || res.data?.success) {
        setProducts((prev) =>
          prev.filter((item) => (item._id || item.id) !== targetId),
        );
      }
    } catch (err) {
      handleAuthError(err);
      
      console.error("Delete product error:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete product.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // Status style helper
  const getStatusStyle = (s) => {
    switch (s) {
      case "Active":
        return "bg-emerald-50 text-emerald-600";
      case "Pending":
        return "bg-amber-50 text-amber-600";
      case "Inactive":
        return "bg-slate-100 text-slate-500";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  // Stock style helper
  const getStockStyle = (stock) => {
    const num = Number(stock || 0);
    if (num === 0) return "text-red-600";
    if (num <= 10) return "text-amber-600";
    return "text-slate-700";
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#287b6d]">
            Marketplace
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage all products listed by your vendors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchProducts}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          {/* <Link
            to="/admin/products/add"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#287b6d] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#287b6d]/20 transition hover:bg-[#226b60]"
          >
            <Plus size={17} />
            Add Product
          </Link> */}
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Total Products</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {formatNumber(totalProducts)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">
            Active Products
          </p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600">
            {formatNumber(activeProducts)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">
            Pending Approval
          </p>
          <p className="mt-2 text-2xl font-extrabold text-amber-600">
            {formatNumber(pendingProducts)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">
            Low Stock (≤ 10)
          </p>
          <p className="mt-2 text-2xl font-extrabold text-red-500">
            {formatNumber(lowStockProducts)}
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name or vendor store..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#287b6d] focus:bg-white"
            />
          </div>

          {/* CATEGORY */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-xs font-semibold text-slate-600 outline-none focus:border-[#287b6d]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* STATUS */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-xs font-semibold text-slate-600 outline-none focus:border-[#287b6d]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400">
            <Loader2 size={32} className="animate-spin text-[#287b6d]" />
            <p className="mt-3 text-xs font-semibold text-slate-500">
              Loading products from database...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Product
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Vendor
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Price
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Stock
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((product) => {
                  const pId = product._id || product.id;

                  // Vendor name from populated ref
                  const vendorName =
                    typeof product.vendor === "object" &&
                    product.vendor !== null
                      ? product.vendor.storeName ||
                        product.vendor.businessName ||
                        product.vendor.name ||
                        "Unknown Vendor"
                      : "Unknown Vendor";

                  // Category name from populated ref
                  const catName =
                    typeof product.category === "object" &&
                    product.category !== null
                      ? product.category.name
                      : product.categoryName || product.category || "General";

                  // Prices from schema
                  const sellingPrice =
                    product.discountPrice || product.price || 0;
                  const mrpPrice = product.price || 0;

                  const pStatus = getNormalizedStatus(product);
                  const isActionLoading = actionLoadingId === pId;

                  // Product initial for avatar
                  const initial = product.name
                    ? product.name.charAt(0).toUpperCase()
                    : "P";

                  return (
                    <tr key={pId} className="transition hover:bg-slate-50">
                      {/* PRODUCT */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#287b6d]/10 text-sm font-bold text-[#287b6d]">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-slate-800">
                              {product.name || "Untitled Product"}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-400">
                              ID: {pId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* VENDOR (from populated MongoDB ref) */}
                      <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                        {vendorName}
                      </td>

                      {/* CATEGORY (from populated MongoDB ref) */}
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                          {catName}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-slate-800">
                          ₹{formatPrice(sellingPrice)}
                        </p>
                        {mrpPrice > sellingPrice && (
                          <p className="text-[10px] text-slate-400 line-through">
                            ₹{formatPrice(mrpPrice)}
                          </p>
                        )}
                      </td>

                      {/* STOCK */}
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-bold ${getStockStyle(product.stock)}`}
                        >
                          {formatNumber(product.stock)}
                        </span>
                      </td>

                      {/* STATUS (Editable Dropdown) */}
                      <td className="px-5 py-4">
                        {isActionLoading ? (
                          <Loader2
                            size={16}
                            className="animate-spin text-slate-400"
                          />
                        ) : (
                          <select
                            value={pStatus}
                            onChange={(e) =>
                              handleStatusChange(product, e.target.value)
                            }
                            className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-[10px] font-bold outline-none ${getStatusStyle(pStatus)}`}
                          >
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/admin/products/${pId}`}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                            title="View"
                          >
                            <Eye size={16} />
                          </Link>

                          {/* <Link
                            to={`/admin/products/${pId}/edit`}
                            className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Link> */}

                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredProducts.length === 0 && (
          <div className="py-16 text-center">
            <Package size={35} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-600">
              No products found
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
