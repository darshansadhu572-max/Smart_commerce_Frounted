import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {handleAuthError} from "../../AuthRouteAdmin";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  FolderOpen,
  Package,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const AdminCategories = () => {
  const token = localStorage.getItem("adminToken");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // FETCH CATEGORIES FROM BACKEND
  const fetchCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_BASE_URL}/categories-all`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = res.data;

      let catList = [];

      if (Array.isArray(data)) {
        catList = data;
      } else if (data.success && Array.isArray(data.categories)) {
        catList = data.categories;
      } else if (Array.isArray(data.categories)) {
        catList = data.categories;
      }

      setCategories(catList);
    } catch (err) {
      handleAuthError(err);

      console.error("Error fetching categories:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch categories from server.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // FILTER CATEGORIES
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const name = category.name || "";
      const desc = category.description || "";

      const status =
        category.status || (category.isActive ? "Active" : "Inactive");

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        desc.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  // DELETE CATEGORY
  const handleDelete = async (category) => {
    const catId = category._id || category.id;
    const catName = category.name || "this category";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${catName}"?`,
    );

    if (!confirmed) return;

    setActionLoadingId(catId);

    try {
      const res = await axios.delete(`${API_BASE_URL}/categories/${catId}`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (res.status === 200 || res.data?.success) {
        setCategories((prev) =>
          prev.filter((item) => (item._id || item.id) !== catId),
        );
      }
    } catch (err) {
      handleAuthError(err);

      console.error("Delete category error:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete category.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // TOGGLE STATUS
  const handleStatus = async (category) => {
    const catId = category._id || category.id;

    const currentStatus =
      category.status || (category.isActive ? "Active" : "Inactive");

    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    const newIsActive = newStatus === "Active";

    setActionLoadingId(catId);

    try {
      const res = await axios.put(`${API_BASE_URL}/categories/${catId}`, {
        isActive: newIsActive,
        status: newStatus,
      }, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (res.status === 200 || res.data?.success) {
        setCategories((prev) =>
          prev.map((item) =>
            (item._id || item.id) === catId
              ? {
                  ...item,
                  isActive: newIsActive,
                  status: newStatus,
                }
              : item,
          ),
        );
      }
    } catch (err) {
      handleAuthError(err);
      
      console.error("Toggle category status error:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to update category status.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // STATISTICS
  const activeCount = categories.filter(
    (item) => (item.status || (item.isActive ? "Active" : "")) === "Active",
  ).length;

  const totalProducts = categories.reduce(
    (total, item) => total + Number(item.productsCount || item.products || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage product categories across SmartCommerce.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchCategories}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            to="/admin/categories/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            <Plus size={18} />
            Add Category
          </Link>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Categories */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Categories</p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {categories.length}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <FolderOpen size={22} />
            </div>
          </div>
        </div>

        {/* Active Categories */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Categories</p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {activeCount}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <FolderOpen size={22} />
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Products</p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalProducts}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <Package size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Category Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400">
            <Loader2 size={32} className="animate-spin text-slate-700" />

            <p className="mt-3 text-xs font-semibold text-slate-500">
              Loading categories from backend...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Description
                  </th>

                  <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Products
                  </th>

                  <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => {
                    const catId = category._id || category.id;

                    const catStatus =
                      category.status ||
                      (category.isActive ? "Active" : "Inactive");

                    const prodCount =
                      category.productsCount !== undefined
                        ? category.productsCount
                        : category.products || 0;

                    const isActionLoading = actionLoadingId === catId;

                    return (
                      <tr key={catId} className="hover:bg-slate-50 transition">
                        {/* Category */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                                {category.name?.charAt(0)?.toUpperCase()}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-slate-900">
                                {category.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                ID: {catId}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600 max-w-xs truncate">
                            {category.description || "-"}
                          </p>
                        </td>

                        {/* Products */}
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-semibold text-slate-800">
                            {prodCount}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          {isActionLoading ? (
                            <Loader2
                              size={16}
                              className="animate-spin text-slate-400 mx-auto"
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStatus(category)}
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold cursor-pointer transition ${
                                catStatus === "Active"
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {catStatus}
                            </button>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end items-center gap-2">
                            <Link
                              to={`/admin/categories/${catId}`}
                              title="View"
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            >
                              <Eye size={17} />
                            </Link>

                            <Link
                              to={`/admin/categories/${catId}/edit`}
                              title="Edit"
                              className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition"
                            >
                              <Edit size={17} />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(category)}
                              title="Delete"
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <FolderOpen
                        size={35}
                        className="mx-auto text-slate-300 mb-3"
                      />

                      <p className="font-semibold text-slate-700">
                        No categories found
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        Try changing your search or filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
