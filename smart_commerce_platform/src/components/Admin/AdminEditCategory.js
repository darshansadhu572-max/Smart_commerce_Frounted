import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {handleAuthError} from "../../AuthRouteAdmin";
import {
  ArrowLeft,
  Save,
  FolderPen,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const AdminEditCategory = () => {
  const token = localStorage.getItem("adminToken");
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FETCH CATEGORY FROM BACKEND
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      setLoading(true);
      setError("");

      try {
        if (!categoryId) {
          setError("Category ID is missing.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/categories/${categoryId}`, {
          headers: {
            "Content-Type": "Application/json",
            Authorization: "Bearer " + token,
          },
        });

        const foundCategory = res.data?.category || res.data;

        if (foundCategory) {
          setCategoryData(foundCategory);

          setFormData({
            name: foundCategory.name || "",
            description: foundCategory.description || "",
            status:
              foundCategory.status ||
              (foundCategory.isActive !== false ? "Active" : "Inactive"),
          });
        } else {
          setError("Category not found in database.");
        }
      } catch (err) {
        handleAuthError(err);

        console.error("Fetch category error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load category details from server.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess(false);
  };

  // VALIDATION
  const validateForm = () => {
    const categoryName = formData.name.trim();
    const description = formData.description.trim();

    if (!categoryName) {
      return "Please enter the category name.";
    }

    if (categoryName.length < 2) {
      return "Category name must contain at least 2 characters.";
    }

    if (categoryName.length > 50) {
      return "Category name cannot exceed 50 characters.";
    }

    if (!description) {
      return "Please enter the category description.";
    }

    if (description.length < 5) {
      return "Category description must contain at least 5 characters.";
    }

    if (description.length > 500) {
      return "Category description cannot exceed 500 characters.";
    }

    if (!formData.status) {
      return "Please select a category status.";
    }

    return "";
  };

  // UPDATE CATEGORY
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      isActive: formData.status === "Active",
    };

    try {
      const res = await axios.put(
        `${API_BASE_URL}/categories/${categoryId}`,
        payload, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (res.status === 200 || res.data?.success) {
        setSuccess(true);

        setTimeout(() => {
          navigate("/admin/categories");
        }, 1200);
      } else {
        throw new Error(res.data?.message || "Failed to update category.");
      }
    } catch (err) {
      handleAuthError(err);
      
      console.error("Update category error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not update category. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-slate-500">
        <Loader2 size={36} className="animate-spin text-slate-700" />

        <p className="mt-4 text-sm font-medium">Loading category details...</p>
      </div>
    );
  }

  // CATEGORY NOT FOUND
  if (!categoryData && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <h1 className="text-xl font-bold text-slate-900">
            Category Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error || "The category you want to edit does not exist."}
          </p>

          <Link
            to="/admin/categories"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={17} />
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-6">
        <Link
          to="/admin/categories"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Categories
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Category</h1>

          <p className="mt-1 text-sm text-slate-500">
            Update information for {formData.name || categoryData?.name}.
          </p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} noValidate className="max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
          {/* FORM HEADER */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FolderPen size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Category Information
              </h2>

              <p className="text-xs text-slate-500">
                Update the category details below.
              </p>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />

              <div>
                <p className="text-sm font-bold text-red-800">
                  Unable to update category
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <CheckCircle
                size={18}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <div>
                <p className="text-sm font-bold text-emerald-800">
                  Category updated successfully
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Your changes have been saved. Redirecting to categories...
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* NAME */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category Name <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                required
                maxLength={50}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description <span className="ml-1 text-red-500">*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                maxLength={500}
                placeholder="Describe this product category..."
                required
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
              />

              <p className="mt-1 text-right text-[11px] text-slate-400">
                {formData.description.length}/500
              </p>
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 bg-white cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* EXISTING INFORMATION */}
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-400">Category ID</p>

                <p className="mt-1 text-xs font-mono font-semibold text-slate-700">
                  {categoryId}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Products Count</p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {categoryData?.productsCount || categoryData?.products || 0}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Created At</p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {new Date(
                    categoryData?.createdAt || Date.now(),
                  ).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/admin/categories"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || success}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Update Category
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminEditCategory;
