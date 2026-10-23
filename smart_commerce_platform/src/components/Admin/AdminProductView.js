import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {handleAuthError} from "../../AuthRouteAdmin";
import { ArrowLeft, Loader2, Package, Tag, List } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const formatPrice = (val) => {
  const num = Number(val);
  return isNaN(num) ? "0" : num.toLocaleString("en-IN");
};

const getNormalizedStatus = (product) => {
  const approval = (product.approvalStatus || "").toLowerCase();
  if (approval === "approved" && product.isActive !== false) return "Active";
  if (approval === "pending") return "Pending";
  if (approval === "rejected" || product.isActive === false) return "Inactive";
  if (product.isActive === true) return "Active";
  return "Active";
};

// Helper: Normalize producttags / tags (Array or String)
const getTagsList = (product) => {
  const rawTags = product.productTags || product.tags;
  if (Array.isArray(rawTags)) return rawTags.filter(Boolean);
  if (typeof rawTags === "string" && rawTags.trim()) {
    return rawTags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
};

// Helper: Normalize specifications (Object or Array)
const getSpecificationsList = (product) => {
  const rawSpecs = product.specifications || product.specs;
  if (!rawSpecs) return [];

  if (Array.isArray(rawSpecs)) {
    return rawSpecs.map((item) => {
      if (typeof item === "object" && item !== null) {
        return {
          key: item.key || item.name || item.trait || "Spec",
          value: item.value || item.val || "-",
        };
      }
      return { key: "Spec", value: String(item) };
    });
  }

  if (typeof rawSpecs === "object" && rawSpecs !== null) {
    return Object.entries(rawSpecs).map(([key, value]) => ({
      key,
      value: typeof value === "object" ? JSON.stringify(value) : String(value),
    }));
  }

  return [];
};

const AdminProductView = () => {
  const token = localStorage.getItem("adminToken");
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH PRODUCT FROM BACKEND
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`${API_BASE_URL}/products/${productId}`, {
          headers: {
            "Content-Type": "Application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = res.data;

        const foundProduct = data?.product || data?.data || data;

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found in database.");
        }
      } catch (err) {
        handleAuthError(err);
        
        console.error("Fetch product error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load product details from server."
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      setLoading(false);
      setError("No Product ID provided in URL.");
    }
  }, [productId]);

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 size={36} className="animate-spin text-[#287b6d]" />
        <p className="mt-3 text-xs font-semibold">Loading product details...</p>
      </div>
    );
  }

  // NOT FOUND / ERROR STATE
  if (error || !product) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <Package size={40} className="mx-auto text-slate-300 mb-3" />
          <h1 className="text-lg font-bold text-slate-900">Product Not Found</h1>
          <p className="mt-1 text-xs text-slate-500">{error || "The requested product does not exist."}</p>

          <Link
            to="/admin/products"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#287b6d] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#226b60]"
          >
            <ArrowLeft size={15} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const pId = product._id || product.id;
  const pName = product.name || "Untitled Product";
  const pSlug = product.slug || "N/A";
  const pSubcategory = product.subcategory || "N/A";
  const pDescription =
    product.description || product.longDescription || "No description provided.";

  // Vendor Name from populated ref
  const vendorName =
    typeof product.vendor === "object" && product.vendor !== null
      ? product.vendor.storeName ||
        product.vendor.businessName ||
        product.vendor.name ||
        "Unknown Vendor"
      : product.vendorName || product.vendor || "Unknown Vendor";

  // Category Name from populated ref
  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? product.category.name
      : product.categoryName || product.category || "General";

  const sellingPrice = product.discountPrice || 0;
  const mrpPrice = product.price || 0;
  const pStatus = getNormalizedStatus(product);

  const initial = pName.charAt(0).toUpperCase();

  const tagsList = getTagsList(product);
  const specsList = getSpecificationsList(product);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Link
            to="/admin/products"
            className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#287b6d]"
          >
            <ArrowLeft size={15} />
            Back to Products
          </Link>

          <h1 className="text-2xl font-extrabold text-slate-900">{pName}</h1>
          <p className="mt-1 text-sm text-slate-500">Product details & specifications</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* PRODUCT CARD & TAGS */}
        <div className="space-y-6">
          {/* Main Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="grid h-40 place-items-center rounded-2xl bg-[#287b6d]/10 text-5xl font-black text-[#287b6d]">
              {initial}
            </div>

            <h2 className="mt-5 text-lg font-extrabold text-slate-900">{pName}</h2>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">{pDescription}</p>
          </div>

          {/* Product Tags Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Tag size={16} className="text-[#287b6d]" />
              <h3 className="text-sm font-bold text-slate-900">Product Tags</h3>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {tagsList.length > 0 ? (
                tagsList.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-[#287b6d]/10 px-2.5 py-1 text-xs font-bold text-[#287b6d]"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400">No tags specified.</p>
              )}
            </div>
          </div>
        </div>

        {/* DETAILS GRID & SPECIFICATIONS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information Grid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Product Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Detail label="Product ID" value={pId} isCode />
              <Detail label="Slug" value={pSlug} isCode />
              <Detail label="Vendor" value={vendorName} />
              <Detail label="Category" value={categoryName} />
              <Detail label="Subcategory" value={pSubcategory} />
              <Detail label="Selling Price" value={`₹${formatPrice(sellingPrice)}`} />
              <Detail label="MRP" value={`₹${formatPrice(mrpPrice)}`} />
              <Detail label="Stock Quantity" value={formatPrice(product.stock || 0)} />
              <Detail label="Status" value={pStatus} isBadge />
              <Detail
                label="Created Date"
                value={
                  product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString("en-IN")
                    : "N/A"
                }
              />
            </div>
          </div>

          {/* Specifications Table Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <List size={18} className="text-[#287b6d]" />
              <h2 className="text-base font-bold text-slate-900">Specifications</h2>
            </div>

            {specsList.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-bold uppercase text-slate-400">
                        Attribute
                      </th>
                      <th className="px-4 py-3 font-bold uppercase text-slate-400">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {specsList.map((spec, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-700 capitalize">
                          {spec.key}
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-semibold">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-4 p-4 text-center rounded-xl bg-slate-50 text-xs text-slate-400 font-medium">
                No custom specifications added for this product.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value, isCode, isBadge }) => (
  <div className="rounded-xl bg-slate-50 p-4">
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {label}
    </p>

    {isBadge ? (
      <span
        className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
          value === "Active"
            ? "bg-emerald-50 text-emerald-600"
            : value === "Pending"
            ? "bg-amber-50 text-amber-600"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {value}
      </span>
    ) : (
      <p
        className={`mt-1 text-sm font-bold text-slate-800 ${
          isCode ? "font-mono text-xs text-slate-600" : ""
        }`}
      >
        {value}
      </p>
    )}
  </div>
);

export default AdminProductView;