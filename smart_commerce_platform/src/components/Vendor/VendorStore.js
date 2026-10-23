import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Store, Save, ExternalLink, MapPin, CheckCircle2 } from "lucide-react";

const VendorStore = ({ storeInfo = {}, setStoreInfo }) => {
  const defaultStore = {
    name: "Tech Haven",
    vendorId: "v101",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    description: "Premium electronics, flagship audio gear, and cutting-edge gadget accessories.",
    category: "Electronics & Tech",
    contactEmail: "support@techhaven.com",
    contactPhone: "+91 98765 12345",
    address: "Suite 402, Technology Park, SG Highway",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380054",
    country: "India",
    acceptOrders: true,
    vacationMode: false,
  };

  const currentStore = { ...defaultStore, ...storeInfo };

  const [formvalue, setFormvalue] = useState({
    name: currentStore.name,
    description: currentStore.description,
    category: currentStore.category,
    contactEmail: currentStore.contactEmail,
    contactPhone: currentStore.contactPhone,
    address: currentStore.address,
    city: currentStore.city,
    state: currentStore.state,
    pincode: currentStore.pincode,
    acceptOrders: currentStore.acceptOrders,
    vacationMode: currentStore.vacationMode,
  });

  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let errorData = {};
    let isValid = true;

    if (!formvalue.name || formvalue.name.trim() === "") {
      isValid = false;
      errorData.name = "Store name is required";
    }

    if (!formvalue.contactEmail || formvalue.contactEmail.trim() === "") {
      isValid = false;
      errorData.contactEmail = "Store contact email is required";
    }

    if (!formvalue.contactPhone || formvalue.contactPhone.trim() === "") {
      isValid = false;
      errorData.contactPhone = "Store contact phone is required";
    }

    setError(errorData);

    if (isValid === false) {
      return false;
    }

    console.log("Vendor Storefront Settings Updated:", formvalue);

    if (setStoreInfo) {
      setStoreInfo((prev) => ({ ...prev, ...formvalue }));
    }

    setSuccessMessage("Storefront settings updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Preview Store button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Store Management</h1>
          <p className="text-xs text-slate-500 mt-1">Customize your storefront details, contact information, and operation status</p>
        </div>
        <Link
          to="/vendor/v1"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition inline-flex items-center gap-2"
        >
          <ExternalLink size={15} /> View My Public Store Page
        </Link>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      )}

      {/* Store Banner Preview */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-44 bg-slate-800">
        <img
          src={currentStore.banner}
          alt="Store Banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-4 left-6 flex items-center gap-4">
          <img
            src={currentStore.logo}
            alt="Store Logo"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
          />
          <div className="text-white">
            <h2 className="text-lg font-bold drop-shadow-sm">{formvalue.name}</h2>
            <p className="text-xs text-slate-200 drop-shadow-sm">{formvalue.category}</p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} method="post" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">

        {/* Section 1: Store Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Store size={16} className="text-blue-600" /> Store Profile & Branding
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Store Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formvalue.name}
                onChange={(e) => setFormvalue({ ...formvalue, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {error.name && <span className="text-rose-500 text-[11px] font-semibold">{error.name}</span>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Store Category</label>
              <input
                type="text"
                name="category"
                value={formvalue.category}
                onChange={(e) => setFormvalue({ ...formvalue, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Store Description</label>
            <textarea
              rows="3"
              value={formvalue.description}
              onChange={(e) => setFormvalue({ ...formvalue, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Contact Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formvalue.contactEmail}
                onChange={(e) => setFormvalue({ ...formvalue, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {error.contactEmail && <span className="text-rose-500 text-[11px] font-semibold">{error.contactEmail}</span>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formvalue.contactPhone}
                onChange={(e) => setFormvalue({ ...formvalue, contactPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {error.contactPhone && <span className="text-rose-500 text-[11px] font-semibold">{error.contactPhone}</span>}
            </div>
          </div>
        </div>

        {/* Section 2: Store Address */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" /> Physical Store Address
          </h3>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Street Address</label>
            <input
              type="text"
              value={formvalue.address}
              onChange={(e) => setFormvalue({ ...formvalue, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">City</label>
              <input
                type="text"
                value={formvalue.city}
                onChange={(e) => setFormvalue({ ...formvalue, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">State</label>
              <input
                type="text"
                value={formvalue.state}
                onChange={(e) => setFormvalue({ ...formvalue, state: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Pincode</label>
              <input
                type="text"
                value={formvalue.pincode}
                onChange={(e) => setFormvalue({ ...formvalue, pincode: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Country</label>
              <input
                type="text"
                disabled
                value="India"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Operation Settings Toggles */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Operation Controls</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Accept New Orders</p>
                <p className="text-[10px] text-slate-400">Allow customers to order from your catalog</p>
              </div>
              <input
                type="checkbox"
                checked={formvalue.acceptOrders}
                onChange={(e) => setFormvalue({ ...formvalue, acceptOrders: e.target.checked })}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Vacation Mode</p>
                <p className="text-[10px] text-slate-400">Temporarily pause storefront listings</p>
              </div>
              <input
                type="checkbox"
                checked={formvalue.vacationMode}
                onChange={(e) => setFormvalue({ ...formvalue, vacationMode: e.target.checked })}
                className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <Save size={16} /> Save Store Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorStore;
