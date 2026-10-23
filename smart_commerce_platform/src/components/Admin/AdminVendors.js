import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {handleAuthError} from "../../AuthRouteAdmin";
import {
  Search,
  Eye,
  CheckCircle2,
  Trash2,
  Store,
  Users,
  Clock3,
  Ban,
  ChevronDown,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

/* HELPERS */

const formatNumber = (val) => {
  const num = Number(val);
  return isNaN(num) ? "0" : num.toLocaleString("en-IN");
};

const getInitials = (name) => {
  if (!name) return "VN";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getVendorId = (vendor) => {
  return vendor?._id || vendor?.id;
};

const getVendorName = (vendor) => {
  return (
    vendor?.storeName || vendor?.businessName || vendor?.name || "Unnamed Store"
  );
};

const getVendorEmail = (vendor) => {
  return (
    vendor?.user?.email ||
    vendor?.userId?.email ||
    vendor?.email ||
    vendor?.contactEmail ||
    "N/A"
  );
};

/* NORMALIZE STATUS */
const getNormalizedStatus = (vendor) => {
  const status = String(
    vendor?.status || vendor?.approvalStatus || "",
  ).toLowerCase();

  if (status === "approved" && vendor?.isActive !== false) {
    return "Active";
  }

  if (status === "pending") {
    return "Pending";
  }

  if (
    status === "rejected" ||
    status === "suspended" ||
    vendor?.isActive === false
  ) {
    return "Suspended";
  }

  return "Active";
};

/* BULLETPROOF CATEGORY NAME RESOLVER */
const getVendorCategoryName = (vendor, allCategories = []) => {
  if (!vendor) return "No Category";

  const rawCat =
    vendor.category ||
    vendor.categories ||
    vendor.categoryId ||
    vendor.categoryName ||
    vendor.businessCategory;

  if (!rawCat) return "No Category";

  // CASE 1: Array of categories (populated objects or IDs)
  if (Array.isArray(rawCat) && rawCat.length > 0) {
    const names = rawCat
      .map((cat) => {
        if (typeof cat === "object" && cat !== null) {
          return cat.name || cat.categoryName || cat.title || "";
        }
        const catStr = String(cat).trim();
        const found = allCategories.find(
          (item) => String(item._id || item.id) === catStr,
        );
        return found ? found.name || found.categoryName : catStr;
      })
      .filter(Boolean);

    if (names.length > 0) return names.join(", ");
  }

  // CASE 2: Single populated Category Object
  if (typeof rawCat === "object" && rawCat !== null) {
    return rawCat.name || rawCat.categoryName || rawCat.title || "No Category";
  }

  // CASE 3: Single Category String or ObjectId
  if (typeof rawCat === "string" && rawCat.trim()) {
    const catStr = rawCat.trim();
    const found = allCategories.find(
      (item) => String(item._id || item.id) === catStr,
    );

    if (found) {
      return found.name || found.categoryName || catStr;
    }

    // If it's not a hex ObjectId string, it is already the Category Name string (e.g. "Electronics & Tech")
    if (!/^[0-9a-fA-F]{24}$/.test(catStr)) {
      return catStr;
    }
  }

  // CASE 4: Direct categoryName field
  if (vendor.categoryName && typeof vendor.categoryName === "string") {
    return vendor.categoryName;
  }

  return "No Category";
};

/* COMPONENT */
const AdminVendors = () => {
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  /* FETCH CATEGORIES */
  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`, {
        headers:{
          "Content-Type": "Application/json",
          "Authorization": "Bearer " + token
        }
      });
      const data = res.data;

      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data?.success && Array.isArray(data.categories))
        list = data.categories;
      else if (Array.isArray(data?.categories)) list = data.categories;
      else if (Array.isArray(data?.data)) list = data.data;

      setAllCategories(list);
    } catch (err) {
      handleAuthError(err);

      console.error("Error fetching categories:", err);
      setAllCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  /* FETCH VENDORS */
  const fetchVendors = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_BASE_URL}/vendors`, {
        headers:{
          "Content-Type": "Application/json",
          "Authorization": "Bearer " + token
        }
      });
      const data = res.data;

      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data?.success && Array.isArray(data.vendors))
        list = data.vendors;
      else if (Array.isArray(data?.vendors)) list = data.vendors;
      else if (Array.isArray(data?.data)) list = data.data;

      setVendors(list);
    } catch (err) {
      handleAuthError(err);

      console.error("Error fetching vendors:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load vendors from backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchCategories();
  }, []);

  /* DYNAMIC CATEGORIES FOR FILTER DROPDOWN */
  const categories = useMemo(() => {
    const backendCatNames = allCategories
      .map((item) => item?.name || item?.categoryName)
      .filter(Boolean);

    const vendorCatNames = vendors
      .map((v) => getVendorCategoryName(v, allCategories))
      .filter((name) => name && name !== "No Category");

    return ["All", ...new Set([...backendCatNames, ...vendorCatNames])];
  }, [allCategories, vendors]);

  /* STATISTICS */
  const totalVendors = vendors.length;
  const activeCount = vendors.filter(
    (v) => getNormalizedStatus(v) === "Active",
  ).length;
  const pendingCount = vendors.filter(
    (v) => getNormalizedStatus(v) === "Pending",
  ).length;
  const suspendedCount = vendors.filter(
    (v) => getNormalizedStatus(v) === "Suspended",
  ).length;

  /* FILTER VENDORS */
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const name = getVendorName(vendor);
      const businessType = vendor?.businessType || "";
      const email = getVendorEmail(vendor);
      const categoryName = getVendorCategoryName(vendor, allCategories);
      const vendorStatus = getNormalizedStatus(vendor);

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        name.toLowerCase().includes(searchText) ||
        String(businessType).toLowerCase().includes(searchText) ||
        String(email).toLowerCase().includes(searchText) ||
        categoryName.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" ||
        categoryName.split(", ").includes(category) ||
        categoryName === category;

      const matchesStatus = status === "All" || vendorStatus === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [vendors, allCategories, search, category, status]);

  /* APPROVE VENDOR */
  const handleActivate = async (vendor) => {
    const targetId = getVendorId(vendor);
    if (!targetId) return alert("Vendor ID not found.");

    setActionLoadingId(targetId);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/vendors/${targetId}/approve`, 
        {},
        {
          headers:{
            "Content-Type": "Application/json",
            "Authorization": "Bearer " + token
          }
        });
      if (res.status === 200 || res.data?.success) {
        setVendors((prev) =>
          prev.map((item) =>
            getVendorId(item) === targetId
              ? {
                  ...item,
                  status: "approved",
                  approvalStatus: "approved",
                  isActive: true,
                }
              : item,
          ),
        );
      }
    } catch (err) {
      handleAuthError(err);

      console.error("Approve vendor error:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to approve vendor.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  /* SUSPEND VENDOR */
  const handleSuspend = async (vendor) => {
    const targetId = getVendorId(vendor);
    if (!targetId) return alert("Vendor ID not found.");

    setActionLoadingId(targetId);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/vendors/${targetId}/suspend`, 
          {},
          {
            headers:{
              "Content-Type": "Application/json",
              "Authorization": "Bearer " + token
            }
          }
        );
      if (res.status === 200 || res.data?.success) {
        setVendors((prev) =>
          prev.map((item) =>
            getVendorId(item) === targetId
              ? {
                  ...item,
                  status: "rejected",
                  approvalStatus: "rejected",
                  isActive: false,
                }
              : item,
          ),
        );
      }
    } catch (err) {
      handleAuthError(err);

      console.error("Suspend vendor error:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to suspend vendor.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  /* DELETE VENDOR */
  const handleDelete = async (vendor) => {
    const name = getVendorName(vendor);
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    const targetId = getVendorId(vendor);
    if (!targetId) return alert("Vendor ID not found.");

    setActionLoadingId(targetId);
    try {
      const res = await axios.delete(`${API_BASE_URL}/vendors/${targetId}`, {
        headers:{
          "Content-Type": "Application/json",
          "Authorization": "Bearer " + token
        }
      });
      if (res.status === 200 || res.data?.success) {
        setVendors((prev) =>
          prev.filter((item) => getVendorId(item) !== targetId),
        );
      }
    } catch (err) {
      handleAuthError(err);
      
      console.error("Delete vendor error:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete vendor.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusStyle = (statusValue) => {
    switch (statusValue) {
      case "Active":
        return "bg-emerald-50 text-emerald-600";
      case "Pending":
        return "bg-amber-50 text-amber-600";
      case "Suspended":
        return "bg-red-50 text-red-600";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#287b6d]">
            Marketplace
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
            Vendors
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage marketplace vendors, store accounts, and approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              fetchVendors();
              fetchCategories();
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50"
          >
            <RefreshCw
              size={15}
              className={loading || categoryLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Total Vendors
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                {formatNumber(totalVendors)}
              </h2>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#287b6d]/10 text-[#287b6d]">
              <Store size={20} />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            All registered vendors
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Active Vendors
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                {formatNumber(activeCount)}
              </h2>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">Currently selling</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Pending Vendors
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                {formatNumber(pendingCount)}
              </h2>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={20} />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">Awaiting approval</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Suspended Vendors
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                {formatNumber(suspendedCount)}
              </h2>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-500">
              <Ban size={20} />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            Currently restricted
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search store name, business type, email, or category..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs outline-none transition focus:border-[#287b6d] focus:bg-white focus:ring-4 focus:ring-[#287b6d]/10"
            />
          </div>

          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-9 text-xs font-semibold text-slate-600 outline-none focus:border-[#287b6d] md:w-48"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Categories" : item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-9 text-xs font-semibold text-slate-600 outline-none focus:border-[#287b6d] md:w-44"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* VENDOR TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">All Vendors</h2>
            <p className="mt-1 text-xs text-slate-400">
              {filteredVendors.length} vendors found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400">
            <Loader2 size={32} className="animate-spin text-[#287b6d]" />
            <p className="mt-3 text-xs font-semibold text-slate-500">
              Fetching vendors from database...
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Store Name
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Business Type
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Category
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Products
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Joined
                    </th>
                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {filteredVendors.map((vendor) => {
                    const vId = getVendorId(vendor);
                    const vName = getVendorName(vendor);
                    const vEmail = getVendorEmail(vendor);
                    const vBusinessType = vendor?.businessType || "Individual";
                    const vCategory = getVendorCategoryName(
                      vendor,
                      allCategories,
                    );
                    const vProductCount =
                      vendor?.productCount ??
                      (Array.isArray(vendor?.products)
                        ? vendor.products.length
                        : 0);
                    const vStatus = getNormalizedStatus(vendor);
                    const initials = getInitials(vName);
                    const isActionLoading = actionLoadingId === vId;

                    return (
                      <tr key={vId} className="transition hover:bg-slate-50">
                        {/* STORE */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#287b6d]/10 text-xs font-extrabold text-[#287b6d]">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-800">
                                {vName}
                              </p>
                              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                {vEmail}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* BUSINESS TYPE */}
                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                            {vBusinessType}
                          </span>
                        </td>

                        {/* CATEGORY (Dynamic & Fallback safe) */}
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${
                              vCategory === "No Category"
                                ? "bg-slate-100 text-slate-400"
                                : "bg-teal-50 text-teal-700"
                            }`}
                          >
                            {vCategory}
                          </span>
                        </td>

                        {/* PRODUCTS */}
                        <td className="px-5 py-4 text-xs font-bold text-slate-700">
                          {formatNumber(vProductCount)}
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                              vStatus,
                            )}`}
                          >
                            {vStatus}
                          </span>
                        </td>

                        {/* JOINED */}
                        <td className="px-5 py-4 text-xs text-slate-500">
                          {vendor?.createdAt
                            ? new Date(vendor.createdAt).toLocaleDateString(
                                "en-IN",
                              )
                            : "N/A"}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {isActionLoading ? (
                              <Loader2
                                size={16}
                                className="animate-spin text-slate-400"
                              />
                            ) : (
                              <>
                                <button
                                  type="button"
                                  title="View"
                                  onClick={() =>
                                    navigate(`/admin/vendors/${vId}`)
                                  }
                                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#287b6d]"
                                >
                                  <Eye size={16} />
                                </button>

                                {vStatus !== "Active" && (
                                  <button
                                    type="button"
                                    title="Approve Vendor"
                                    onClick={() => handleActivate(vendor)}
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                                  >
                                    <CheckCircle2 size={16} />
                                  </button>
                                )}

                                {vStatus === "Active" && (
                                  <button
                                    type="button"
                                    title="Suspend Vendor"
                                    onClick={() => handleSuspend(vendor)}
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
                                  >
                                    <Ban size={16} />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  title="Delete"
                                  onClick={() => handleDelete(vendor)}
                                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-slate-100 lg:hidden">
              {filteredVendors.map((vendor) => {
                const vId = getVendorId(vendor);
                const vName = getVendorName(vendor);
                const vEmail = getVendorEmail(vendor);
                const vBusinessType = vendor?.businessType || "Individual";
                const vCategory = getVendorCategoryName(vendor, allCategories);
                const vProductCount =
                  vendor?.productCount ??
                  (Array.isArray(vendor?.products)
                    ? vendor.products.length
                    : 0);
                const vStatus = getNormalizedStatus(vendor);
                const initials = getInitials(vName);

                return (
                  <div key={vId} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#287b6d]/10 text-xs font-extrabold text-[#287b6d]">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {vName}
                          </p>
                          <p className="truncate text-[10px] text-slate-400">
                            {vEmail}
                          </p>
                          <p className="truncate text-[10px] text-slate-400">
                            {vBusinessType}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                          vStatus,
                        )}`}
                      >
                        {vStatus}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-slate-400">Category</p>
                        <p
                          className={`mt-1 text-xs font-semibold ${
                            vCategory === "No Category"
                              ? "text-slate-400"
                              : "text-teal-700 font-bold"
                          }`}
                        >
                          {vCategory}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400">Products</p>
                        <p className="mt-1 text-xs font-bold text-slate-800">
                          {formatNumber(vProductCount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        title="View"
                        onClick={() => navigate(`/admin/vendors/${vId}`)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#287b6d]"
                      >
                        <Eye size={16} />
                      </button>

                      {vStatus !== "Active" && (
                        <button
                          type="button"
                          title="Approve Vendor"
                          onClick={() => handleActivate(vendor)}
                          className="rounded-lg p-2 text-emerald-500 hover:bg-emerald-50"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}

                      {vStatus === "Active" && (
                        <button
                          type="button"
                          title="Suspend Vendor"
                          onClick={() => handleSuspend(vendor)}
                          className="rounded-lg p-2 text-amber-500 hover:bg-amber-50"
                        >
                          <Ban size={16} />
                        </button>
                      )}

                      <button
                        type="button"
                        title="Delete"
                        onClick={() => handleDelete(vendor)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredVendors.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <Users size={24} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-800">
              No vendors found
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVendors;
