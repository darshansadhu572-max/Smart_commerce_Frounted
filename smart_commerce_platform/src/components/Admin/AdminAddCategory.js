import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, FolderPlus, Save, Loader2 } from "lucide-react";
import {handleAuthError} from "../../AuthRouteAdmin.js";

const API_BASE_URL = "http://localhost:5000/api";

const AdminAddCategory = () => {
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    // Clear field error when user corrects it
    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const description = formData.description.trim();

    // Category name validation
    if (!name) {
      newErrors.name = "Category name is required.";
    } else if (name.length < 2) {
      newErrors.name = "Category name must contain at least 2 characters.";
    } else if (name.length > 50) {
      newErrors.name = "Category name cannot exceed 50 characters.";
    }

    // Description validation
    if (!description) {
      newErrors.description = "Description is required.";
    } else if (description.length < 10) {
      newErrors.description =
        "Description must contain at least 10 characters.";
    } else if (description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      setSubmitError("Please fix the highlighted fields before submitting.");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      isActive: formData.status === "Active",
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/categories`, payload, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (res.status === 201 || res.data?.success) {
        alert("Category created successfully!");
        navigate("/admin/categories");
      } else {
        throw new Error(res.data?.message || "Failed to create category.");
      }
    } catch (error) {
      handleAuthError(error);

      console.error("ADD CATEGORY ERROR:", error);
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while creating the category. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/categories"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Categories
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Category</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create a new product category for your marketplace.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          {/* Form Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FolderPlus size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Category Information
              </h2>
              <p className="text-xs text-slate-500">
                Enter basic category details.
              </p>
            </div>
          </div>

          {/* General Error */}
          {submitError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Category Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.name
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-slate-400"
                }`}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter category description..."
                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.description
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-slate-400"
                }`}
              />

              <div className="mt-1 flex items-center justify-between">
                {errors.description ? (
                  <p className="text-xs font-medium text-red-600">
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    Minimum 10 characters.
                  </p>
                )}

                <span className="text-xs text-slate-400">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/admin/categories"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Category
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminAddCategory;
