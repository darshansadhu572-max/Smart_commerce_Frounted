import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {handleAuthError} from "../../AuthRouteAdmin";
import {
  ArrowLeft,
  Edit,
  FolderOpen,
  Package,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const AdminViewCategory = () => {
  const token = localStorage.getItem("adminToken");
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH CATEGORY FROM BACKEND
  useEffect(() => {
    const fetchCategory = async () => {
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

        const categoryData = res.data?.category || res.data;

        if (categoryData) {
          setCategory(categoryData);
        } else {
          setError("Category not found in database.");
        }
      } catch (err) {
        handleAuthError(err);
        
        console.error("Fetch category error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load category details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500">
        <Loader2 size={36} className="animate-spin text-slate-700" />

        <p className="mt-4 text-sm font-medium">Loading category details...</p>
      </div>
    );
  }

  // CATEGORY NOT FOUND / ERROR
  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FolderOpen size={28} className="text-slate-400" />
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Category Not Found
          </h1>

          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-2">
            <AlertCircle size={16} />
            <span>
              {error || "The category you are looking for does not exist."}
            </span>
          </div>

          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            <ArrowLeft size={17} />
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  // CATEGORY ID
  const id = category._id || category.id;

  // STATUS
  const status = category.status || (category.isActive ? "Active" : "Inactive");

  // PRODUCTS COUNT
  const productsCount = category.productsCount ?? category.products ?? 0;

  // CREATED DATE
  const createdDate = category.createdAt
    ? new Date(category.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={17} />
          Back to Categories
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Category Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View complete category information.
            </p>
          </div>

          <Link
            to={`/admin/categories/${id}/edit`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            <Edit size={17} />
            Edit Category
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-4xl">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Category Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl font-bold">
                {category.name?.charAt(0)?.toUpperCase()}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {category.name}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-2">
                  Category ID: #{id}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-100">
            {/* Products */}
            <div className="p-6 border-b sm:border-b-0 sm:border-r border-slate-100">
              <Package size={20} className="text-blue-600 mb-3" />

              <p className="text-sm text-slate-500">Products</p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {productsCount}
              </p>
            </div>

            {/* Status */}
            <div className="p-6 border-b sm:border-b-0 sm:border-r border-slate-100">
              <FolderOpen size={20} className="text-emerald-600 mb-3" />

              <p className="text-sm text-slate-500">Status</p>

              <p className="text-lg font-bold text-slate-900 mt-1">{status}</p>
            </div>

            {/* Created */}
            <div className="p-6">
              <Calendar size={20} className="text-purple-600 mb-3" />

              <p className="text-sm text-slate-500">Created</p>

              <p className="text-lg font-bold text-slate-900 mt-1">
                {createdDate}
              </p>
            </div>
          </div>

          {/* Information */}
          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-5">
              Category Information
            </h3>

            <div className="space-y-5">
              {/* Category Name */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Category Name
                </p>

                <p className="text-sm font-medium text-slate-800 mt-1">
                  {category.name || "Not specified"}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Description
                </p>

                <p className="text-sm text-slate-600 mt-1 leading-6">
                  {category.description || "No description available."}
                </p>
              </div>

              {/* Active Status */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Active Status
                </p>

                <p className="text-sm font-medium text-slate-800 mt-1">
                  {category.isActive === undefined
                    ? status
                    : category.isActive
                      ? "Active"
                      : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewCategory;
