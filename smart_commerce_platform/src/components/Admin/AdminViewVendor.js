import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {handleAuthError} from "../../AuthRouteAdmin";
import {
  ArrowLeft,
  Pencil,
  Store,
  Package,
  ShoppingCart,
  IndianRupee,
  Mail,
  User,
  CalendarDays,
  Tag,
  CheckCircle2,
  Ban,
  Clock3,
  Loader2,
  AlertCircle,
  Briefcase,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

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

const AdminViewVendor = () => {
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();
  const { vendorId } = useParams();

  const [vendor, setVendor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH VENDOR & CATEGORIES FROM BACKEND API
  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch Categories list
        const catRes = await axios
          .get(`${API_BASE_URL}/categories`, {
            headers:{
              "Content-Type": "Application/json",
              "Authorization": "Bearer " + token
            }
          })
          .catch(() => null);
        if (catRes?.data) {
          const list = Array.isArray(catRes.data)
            ? catRes.data
            : catRes.data.categories || catRes.data.data || [];
          setCategories(list);
        }

        // Fetch Vendor Profile by ID
        const res = await axios.get(`${API_BASE_URL}/vendors/${vendorId}`, {
          headers:{
            "Content-Type": "Application/json",
            "Authorization": "Bearer " + token
          }
        });
        const vendorData = res.data?.vendor || res.data?.data || res.data;

        if (vendorData) {
          setVendor(vendorData);
        } else {
          setError("Vendor details not found in database.");
        }
      } catch (err) {
        handleAuthError(err);
        
        console.error("Error fetching vendor details:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load vendor details from backend.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchVendorData();
    } else {
      setLoading(false);
      setError("No Vendor ID provided in URL.");
    }
  }, [vendorId]);

  // Resolve Category Name
  const getCategoryName = () => {
    if (!vendor) return "No Category";

    const rawCat =
      vendor.category ||
      vendor.categories ||
      vendor.categoryId ||
      vendor.categoryName ||
      vendor.businessCategory;

    if (!rawCat) return "No Category";

    if (Array.isArray(rawCat) && rawCat.length > 0) {
      const names = rawCat
        .map((c) => {
          if (typeof c === "object" && c !== null)
            return c.name || c.categoryName || "";
          const found = categories.find(
            (item) => String(item._id || item.id) === String(c),
          );
          return found ? found.name : String(c);
        })
        .filter(Boolean);
      if (names.length > 0) return names.join(", ");
    }

    if (typeof rawCat === "object" && rawCat !== null) {
      return rawCat.name || rawCat.categoryName || "No Category";
    }

    if (typeof rawCat === "string" && rawCat.trim()) {
      const catStr = rawCat.trim();
      const found = categories.find(
        (item) => String(item._id || item.id) === catStr,
      );
      if (found) return found.name || catStr;
      if (!/^[0-9a-fA-F]{24}$/.test(catStr)) return catStr;
    }

    return "No Category";
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 size={36} className="animate-spin text-[#287b6d]" />
        <p className="mt-4 text-xs font-semibold">Loading vendor details...</p>
      </div>
    );
  }

  // NOT FOUND STATE
  if (error || !vendor) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-sm p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
            <Store size={24} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Vendor not found
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {error ||
              "The requested vendor does not exist in backend database."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/vendors")}
            className="mt-5 rounded-xl bg-[#287b6d] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#226b60] transition"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  const vName =
    vendor.storeName || vendor.businessName || vendor.name || "Unnamed Store";
  const vOwner =
    vendor.ownerName ||
    (vendor.user
      ? `${vendor.user.firstName || ""} ${vendor.user.lastName || ""}`.trim()
      : "") ||
    vendor.owner ||
    vendor.name ||
    "N/A";

  const vEmail =
    vendor.email || vendor.contactEmail || vendor.user?.email || "N/A";
  const vPhone =
    vendor.phone || vendor.contactPhone || vendor.user?.phone || "N/A";
  const vBusinessType = vendor.businessType || "Individual";
  const vStatus = getNormalizedStatus(vendor);
  const initials = getInitials(vName);
  const categoryName = getCategoryName();

  const getStatusIcon = () => {
    if (vStatus === "Active") return <CheckCircle2 size={17} />;
    if (vStatus === "Pending") return <Clock3 size={17} />;
    return <Ban size={17} />;
  };

  const getStatusStyle = () => {
    if (vStatus === "Active")
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    if (vStatus === "Pending")
      return "bg-amber-50 text-amber-600 border-amber-200";
    return "bg-red-50 text-red-600 border-red-200";
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/vendors")}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#287b6d]">
              Vendor Details
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900">
              {vName}
            </h1>
          </div>
        </div>

        {/* <button
          type="button"
          onClick={() => navigate(`/admin/vendors/edit/${vendor._id || vendor.id}`)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#287b6d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#226b60] transition shadow-xs"
        >
          <Pencil size={16} />
          Edit Vendor
        </button> */}
      </div>

      {/* PROFILE CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#287b6d]/10 text-xl font-extrabold text-[#287b6d]">
            {initials}
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <h2 className="text-xl font-extrabold text-slate-900">{vName}</h2>

              <span
                className={`flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold ${getStatusStyle()}`}
              >
                {getStatusIcon()}
                {vStatus}
              </span>
            </div>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              <span className="text-[#287b6d] font-bold">{categoryName}</span>{" "}
              marketplace vendor
            </p>

            <p className="mt-2 font-mono text-xs text-slate-400">
              Vendor ID: {vendor._id || vendor.id}
            </p>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Products</p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                {formatNumber(
                  vendor.productCount || vendor.products?.length || 0,
                )}
              </h3>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#287b6d]/10 text-[#287b6d]">
              <Package size={19} />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Orders</p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                {formatNumber(vendor.orderCount || vendor.orders?.length || 0)}
              </h3>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <ShoppingCart size={19} />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Revenue</p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                ₹{formatNumber(vendor.revenue || 0)}
              </h3>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <IndianRupee size={19} />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Category</p>
              <h3 className="mt-2 text-base font-extrabold text-slate-900 truncate max-w-[150px]">
                {categoryName}
              </h3>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Tag size={19} />
            </div>
          </div>
        </div>
      </div>

      {/* INFORMATION */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* PERSONAL & STORE DETAILS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Vendor Details
          </h2>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <User size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Owner Name</p>
                <p className="text-sm font-semibold text-slate-700">{vOwner}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <Briefcase size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Business Type</p>
                <p className="text-sm font-semibold text-slate-700">
                  {vBusinessType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <Mail size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">Email Address</p>
                <p className="truncate text-sm font-semibold text-slate-700">
                  {vEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <Tag size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Category</p>
                <p className="text-sm font-semibold text-slate-700">
                  {categoryName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <CalendarDays size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Joined Date</p>
                <p className="text-sm font-semibold text-slate-700">
                  {new Date(vendor.createdAt || Date.now()).toLocaleDateString(
                    "en-IN",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACCOUNT STATUS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Account Status
          </h2>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${getStatusStyle()}`}
              >
                {getStatusIcon()}
              </span>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Account is {vStatus}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Current marketplace status in database
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-[10px] text-slate-400">Vendor ID</p>
              <p className="mt-1 text-xs font-mono font-bold text-slate-800 truncate">
                {vendor._id || vendor.id}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-[10px] text-slate-400">Joined</p>
              <p className="mt-1 text-xs font-bold text-slate-800">
                {new Date(vendor.createdAt || Date.now()).toLocaleDateString(
                  "en-IN",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewVendor;
