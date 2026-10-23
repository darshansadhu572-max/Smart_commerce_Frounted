import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {handleAuthError} from "../../AuthRouteAdmin";
import {
  ArrowLeft,
  Save,
  Package,
  Image as ImageIcon,
  FileText,
  X,
  Plus,
  Trash2,
  Loader2,
  ListPlus,
  IndianRupee,
  Boxes,
  Bookmark,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const VendorEditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("vendorToken");

  // FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    categoryName: "",
    subcategory: "",
    price: "",
    mrp: "",
    stock: "",
    lowStockAlert: "5",
    shortDescription: "",
    description: "",
    status: "Active",
  });

  // SPECIFICATIONS STATE
  const [specifications, setSpecifications] = useState([]);

  // TAGS STATE
  const [productTags, setProductTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // IMAGE PREVIEW STATE
  const [preview, setPreview] = useState(null);

  // LOADING / API STATES
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // VALIDATION ERROR STATE
  const [error, setError] = useState({
    name: "",
    category: "",
    price: "",
    mrp: "",
    stock: "",
    shortDescription: "",
    description: "",
  });

  // FETCH PRODUCT + CATEGORIES
  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      setApiError("");

      try {
        // FETCH CATEGORIES
        setLoadingCategories(true);

        const catRes = await axios.get(`${API_BASE_URL}/categories`, {
          headers: {
            "Content-Type": "Application/json",
            Authorization: "Bearer " + token,
          },
        });

        let catList = [];

        if (Array.isArray(catRes.data)) {
          catList = catRes.data;
        } else if (
          catRes.data?.success &&
          Array.isArray(catRes.data.categories)
        ) {
          catList = catRes.data.categories;
        } else if (Array.isArray(catRes.data?.categories)) {
          catList = catRes.data.categories;
        }

        setCategories(catList);
        setLoadingCategories(false);

        // FETCH PRODUCT DIRECTLY
        const prodRes = await axios.get(
          `${API_BASE_URL}/products/${productId}`,
          {
            headers: {
              "Content-Type": "Application/json",
              Authorization: "Bearer " + token,
            },
          },
        );

        let foundProduct = null;

        if (prodRes.data?.success && prodRes.data?.product) {
          foundProduct = prodRes.data.product;
        } else if (prodRes.data?.product) {
          foundProduct = prodRes.data.product;
        }

        if (!foundProduct) {
          throw new Error("Product not found in database.");
        }

        // CATEGORY
        const catId =
          typeof foundProduct.category === "object" &&
          foundProduct.category !== null
            ? foundProduct.category._id || foundProduct.category.id
            : foundProduct.category || "";

        // SET FORM DATA
        setFormData({
          name: foundProduct.name || "",
          category: catId,
          categoryName: foundProduct.categoryName || "",
          subcategory: foundProduct.subcategory || "",

          price:
            foundProduct.discountPrice !== undefined &&
            foundProduct.discountPrice !== null
              ? String(foundProduct.discountPrice)
              : "",

          mrp:
            foundProduct.price !== undefined && foundProduct.price !== null
              ? String(foundProduct.price)
              : "",

          stock:
            foundProduct.stock !== undefined && foundProduct.stock !== null
              ? String(foundProduct.stock)
              : "",

          lowStockAlert: String(
            foundProduct.lowStockAlert || foundProduct.lowStockLimit || 5,
          ),

          shortDescription: foundProduct.shortDescription || "",

          description:
            foundProduct.description || foundProduct.longDescription || "",

          status:
            foundProduct.status || (foundProduct.isActive ? "Active" : "Draft"),
        });

        // LOAD SPECIFICATIONS
        if (
          Array.isArray(foundProduct.specifications) &&
          foundProduct.specifications.length > 0
        ) {
          setSpecifications(foundProduct.specifications);
        } else if (
          foundProduct.specifications &&
          typeof foundProduct.specifications === "object"
        ) {
          const mappedSpecs = Object.entries(foundProduct.specifications).map(
            ([name, value]) => ({
              name,
              value: String(value),
              isKeyFeature: false,
            }),
          );

          setSpecifications(mappedSpecs);
        } else {
          setSpecifications([
            {
              name: "",
              value: "",
              isKeyFeature: false,
            },
          ]);
        }

        // LOAD TAGS
        if (Array.isArray(foundProduct.productTags)) {
          setProductTags(foundProduct.productTags);
        } else {
          setProductTags(["New Arrival"]);
        }

        // LOAD IMAGE
        if (
          Array.isArray(foundProduct.images) &&
          foundProduct.images.length > 0
        ) {
          setPreview(foundProduct.images[0]);
        } else if (foundProduct.image) {
          setPreview(foundProduct.image);
        }
      } catch (err) {
        handleAuthError(err);

        console.error("Error loading product for edit:", err);

        setApiError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load product details for editing.",
        );
      } finally {
        setLoading(false);
        setLoadingCategories(false);
      }
    };

    if (productId) {
      loadProductData();
    }
  }, [productId, token]);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (apiError) {
      setApiError("");
    }
  };

  // IMAGE HANDLERS
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 5MB validation
    if (file.size > 5 * 1024 * 1024) {
      setApiError("Image size must be less than 5MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setPreview(null);
  };

  // SPECIFICATION HANDLERS
  const handleAddSpec = () => {
    setSpecifications((prev) => [
      ...prev,
      {
        name: "",
        value: "",
        isKeyFeature: false,
      },
    ]);
  };

  const handleRemoveSpec = (index) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index, field, value) => {
    setSpecifications((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  // TAG HANDLERS
  const toggleTag = (tag) => {
    if (productTags.includes(tag)) {
      setProductTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setProductTags((prev) => [...prev, tag]);
    }
  };

  const addCustomTag = () => {
    const val = tagInput.trim();

    if (val && !productTags.includes(val)) {
      setProductTags((prev) => [...prev, val]);

      setTagInput("");
    }
  };

  const handleAddCustomTag = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomTag();
    }
  };

  const removeTag = (tagToRemove) => {
    setProductTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // FORM VALIDATION
  const validateForm = () => {
    let errorData = {};
    let isValid = true;

    // Product name
    if (!formData.name.trim()) {
      isValid = false;
      errorData.name = "Product name is required";
    }

    // Category
    if (!formData.category) {
      isValid = false;
      errorData.category = "Category is required. Please select one.";
    }

    // Selling price
    if (formData.price === "" || Number(formData.price) <= 0) {
      isValid = false;
      errorData.price = "Selling price must be greater than 0";
    }

    // MRP
    if (formData.mrp === "" || Number(formData.mrp) <= 0) {
      isValid = false;
      errorData.mrp = "MRP must be greater than 0";
    }

    // Selling price cannot exceed MRP
    if (
      formData.price !== "" &&
      formData.mrp !== "" &&
      Number(formData.price) > Number(formData.mrp)
    ) {
      isValid = false;

      errorData.price = "Selling price cannot be greater than MRP";

      errorData.mrp = "MRP must be equal to or greater than selling price";
    }

    // Stock
    if (formData.stock === "" || Number(formData.stock) < 0) {
      isValid = false;
      errorData.stock = "Stock cannot be negative";
    }

    // Short description
    if (!formData.shortDescription.trim()) {
      isValid = false;
      errorData.shortDescription = "Short description is required";
    }

    // Full description
    if (!formData.description.trim()) {
      isValid = false;
      errorData.description = "Full description is required";
    }

    setError(errorData);

    return isValid;
  };

  // SUBMIT UPDATED PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setApiError("");

    // FIND SELECTED CATEGORY
    const selectedCategoryObj = categories.find(
      (c) => String(c._id || c.id) === String(formData.category),
    );

    // CLEAN SPECIFICATIONS
    const cleanSpecs = specifications.filter(
      (s) => s.name?.trim() && s.value?.trim(),
    );

    // =========================
    // FINAL TAGS
    // =========================
    const finalTags = [...productTags];

    if (tagInput.trim() && !finalTags.includes(tagInput.trim())) {
      finalTags.push(tagInput.trim());
    }

    // =========================
    // UPDATED PAYLOAD
    // =========================
    const updatedPayload = {
      name: formData.name.trim(),

      category: formData.category,

      categoryName: selectedCategoryObj
        ? selectedCategoryObj.name
        : formData.categoryName,

      subcategory: formData.subcategory.trim(),

      price: Number(formData.mrp),

      discountPrice: Number(formData.price),

      stock: Number(formData.stock),

      lowStockAlert: Number(formData.lowStockAlert || 5),

      shortDescription: formData.shortDescription.trim(),

      description: formData.description.trim(),

      longDescription: formData.description.trim(),

      status: formData.status,

      isActive: formData.status === "Active",

      specifications: cleanSpecs,

      productTags: finalTags,
    };

    try {
      // UPDATE PRODUCT
      const res = await axios.put(`${API_BASE_URL}/products/${productId}`,
        updatedPayload, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + token,
        },
      });

      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to update product.");
      }

      // NO setProducts HERE

      alert("Product updated successfully!");

      navigate(`/vendor/products/${productId}`);
    } catch (err) {
      handleAuthError(err);
      
      console.error("Update product error:", err);

      setApiError(
        err.response?.data?.message ||
          err.message ||
          "Could not update product. Please check your network or inputs.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-20 text-slate-500 shadow-xs">
        <Loader2 size={36} className="animate-spin text-slate-700" />

        <p className="mt-4 text-sm font-medium">
          Loading product for editing...
        </p>
      </div>
    );
  }

  // NOT FOUND STATE
  if (apiError && !formData.name) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs">
        <Package size={48} className="mx-auto mb-4 text-slate-300" />

        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>

        <p className="mt-2 text-sm text-slate-500">{apiError}</p>

        <Link
          to="/vendor/products"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>
    );
  }

  // PRICE PREVIEW
  const priceNum = Number(formData.price || 0);

  const mrpNum = Number(formData.mrp || 0);

  const discount =
    mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

  // MAIN UI
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/vendor/products/${productId}`}
            className="rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-100"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>

            <p className="mt-1 text-sm text-slate-500">
              Update catalog details for ID:{" "}
              <span className="font-mono text-xs font-semibold">
                {productId}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/vendor/products/${productId}`}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            form="edit-product-form"
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* API ERROR */}
      {apiError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {apiError}
        </div>
      )}

      {/* FORM */}
      <form
        id="edit-product-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* 1. BASIC INFORMATION */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100">
                <Package size={20} className="text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Basic Information
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Update main details of your product
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            {/* PRODUCT NAME */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aster Pro ANC Headphones"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                  error.name
                    ? "border-red-400"
                    : "border-slate-200 focus:border-slate-400"
                }`}
              />

              {error.name && (
                <p className="mt-1.5 text-xs text-red-600">{error.name}</p>
              )}
            </div>

            {/* CATEGORY */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loadingCategories}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none ${
                  error.category ? "border-red-400" : "border-slate-200"
                }`}
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {error.category && (
                <p className="mt-1.5 text-xs text-red-600">{error.category}</p>
              )}
            </div>

            {/* SUBCATEGORY */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Subcategory
              </label>

              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                placeholder="e.g. Headphones, Gaming, Skincare..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        {/* 2. PRODUCT IMAGE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100">
                <ImageIcon size={19} className="text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">Product Image</h2>

                <p className="text-sm text-slate-500">
                  Replace the current product image preview
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="flex size-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-slate-400">
                    {formData.name?.charAt(0)?.toUpperCase() || "P"}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <label className="block">
                  <div className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center transition hover:bg-slate-50">
                    <ImageIcon
                      size={28}
                      className="mx-auto mb-3 text-slate-400"
                    />

                    <p className="text-sm font-medium text-slate-700">
                      Click to upload new image
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      PNG, JPG or WEBP • Max 5MB
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {preview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="mt-3 inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <X size={15} />
                    Remove new image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. PRICING */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100">
                <IndianRupee size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">Pricing</h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Update selling price and MRP
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">
            {/* SELLING PRICE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Selling Price *
              </label>

              <div className="relative">
                <IndianRupee
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className={`w-full rounded-xl border py-3 pl-9 pr-4 text-sm outline-none ${
                    error.price ? "border-red-400" : "border-slate-200"
                  }`}
                />
              </div>

              {error.price && (
                <p className="mt-1.5 text-xs text-red-600">{error.price}</p>
              )}
            </div>

            {/* MRP */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                MRP *
              </label>

              <div className="relative">
                <IndianRupee
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className={`w-full rounded-xl border py-3 pl-9 pr-4 text-sm outline-none ${
                    error.mrp ? "border-red-400" : "border-slate-200"
                  }`}
                />
              </div>

              {error.mrp && (
                <p className="mt-1.5 text-xs text-red-600">{error.mrp}</p>
              )}
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Product Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="Active">Active</option>

                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* PRICE PREVIEW */}
          <div className="px-6 pb-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-slate-500">Selling Price:</span>

                <span className="font-bold text-slate-900">
                  ₹{priceNum.toLocaleString("en-IN")}
                </span>

                <span className="text-slate-400 line-through">
                  ₹{mrpNum.toLocaleString("en-IN")}
                </span>

                {discount > 0 && (
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. INVENTORY */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100">
                <Boxes size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">Inventory</h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Manage available stock and alert levels
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            {/* STOCK */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Current Stock *
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="Enter stock quantity"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                  error.stock ? "border-red-400" : "border-slate-200"
                }`}
              />

              {error.stock && (
                <p className="mt-1.5 text-xs text-red-600">{error.stock}</p>
              )}
            </div>

            {/* LOW STOCK */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Low Stock Alert Threshold
              </label>

              <input
                type="number"
                name="lowStockAlert"
                value={formData.lowStockAlert}
                onChange={handleChange}
                min="0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />

              <p className="mt-2 text-xs text-slate-400">
                You will receive alert warnings when stock reaches this level.
              </p>
            </div>
          </div>
        </div>

        {/* 5. SPECIFICATIONS */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100">
                <ListPlus size={20} className="text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">Specifications</h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Update technical specifications and key feature highlights
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddSpec}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <Plus size={15} />
              Add Specification
            </button>
          </div>

          <div className="space-y-4 p-6">
            {specifications.map((spec, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 sm:flex-row"
              >
                <input
                  type="text"
                  placeholder="Specification Name (e.g. Battery, Material)"
                  value={spec.name}
                  onChange={(e) =>
                    handleSpecChange(index, "name", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none sm:flex-1"
                />

                <input
                  type="text"
                  placeholder="Value (e.g. 40 hours, 100% Cotton)"
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecChange(index, "value", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none sm:flex-1"
                />

                <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-xs font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={!!spec.isKeyFeature}
                    onChange={(e) =>
                      handleSpecChange(index, "isKeyFeature", e.target.checked)
                    }
                    className="rounded text-slate-900"
                  />
                  Key Feature
                </label>

                {specifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 6. DESCRIPTIONS */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Product Descriptions
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Update product overview and detailed specifications
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            {/* SHORT DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Short Description *
              </label>

              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows="3"
                maxLength="250"
                placeholder="Write a short summary for product cards..."
                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none ${
                  error.shortDescription ? "border-red-400" : "border-slate-200"
                }`}
              />

              {error.shortDescription && (
                <p className="mt-1.5 text-xs text-red-600">
                  {error.shortDescription}
                </p>
              )}
            </div>

            {/* FULL DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="7"
                placeholder="Describe your product in detail..."
                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none ${
                  error.description ? "border-red-400" : "border-slate-200"
                }`}
              />

              {error.description && (
                <p className="mt-1.5 text-xs text-red-600">
                  {error.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 7. TAGS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100">
              <Bookmark size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">Product Tags</h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Tags help customers discover your product in search
              </p>
            </div>
          </div>

          {/* DEFAULT TAGS */}
          <div className="mb-4 flex flex-wrap gap-2">
            {["New Arrival", "Best Seller", "Featured"].map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  productTags.includes(tag)
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}

            {/* CUSTOM TAGS */}
            {productTags
              .filter(
                (t) => !["New Arrival", "Best Seller", "Featured"].includes(t),
              )
              .map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
          </div>

          {/* ADD CUSTOM TAG */}
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddCustomTag}
              placeholder="Add custom tag (press Enter or click Add)..."
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />

            <button
              type="button"
              onClick={addCustomTag}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:justify-end">
          <Link
            to={`/vendor/products/${productId}`}
            className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-medium hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorEditProduct;
