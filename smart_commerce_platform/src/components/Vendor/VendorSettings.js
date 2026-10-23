import React, { useState } from "react";
import { Save, Lock, Truck, CreditCard, Store, CheckCircle2 } from "lucide-react";

const VendorSettings = ({ settings = {}, setSettings }) => {
  const defaultSettings = {
    accountEmail: "vendor@techhaven.com",
    accountPhone: "+91 98765 12345",
    storeVisibility: true,
    acceptOrders: true,
    vacationMode: false,
    defaultShippingProvider: "Delhivery",
    processingTime: "1-2 Business Days",
    bankName: "HDFC Bank Ltd",
    accountNumber: "4921",
    upiId: "techhaven@hdfcbank",
    payoutPreference: "Weekly Settlement",
  };

  const initial = { ...defaultSettings, ...settings };

  const [formvalue, setFormvalue] = useState(initial);
  const [passwordFields, setPasswordFields] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [activeTab, setActiveTab] = useState("Account");
  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let errorData = {};
    let isValid = true;

    if (!formvalue.accountEmail || formvalue.accountEmail.trim() === "") {
      isValid = false;
      errorData.accountEmail = "Account email is required";
    }

    if (passwordFields.newPassword && passwordFields.newPassword !== passwordFields.confirmPassword) {
      isValid = false;
      errorData.confirmPassword = "New passwords do not match";
    }

    setError(errorData);

    if (isValid === false) {
      return false;
    }

    console.log("Vendor Settings Update Form Submission:", {
      ...formvalue,
      passwordChangeRequested: !!passwordFields.newPassword,
    });

    if (setSettings) {
      setSettings((prev) => ({ ...prev, ...formvalue }));
    }

    setSuccessMessage("Vendor settings saved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vendor Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage store preferences, notifications, payouts, and security controls</p>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto text-xs font-bold text-slate-500">
        {["Account", "Store", "Shipping", "Payment"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 transition border-b-2 whitespace-nowrap ${activeTab === tab
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} method="post" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">

        {/* TAB 1: ACCOUNT */}
        {activeTab === "Account" && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Lock size={16} className="text-blue-600" /> Account & Password Credentials
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Vendor Account Email</label>
                <input
                  type="email"
                  value={formvalue.accountEmail}
                  onChange={(e) => setFormvalue({ ...formvalue, accountEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {error.accountEmail && <span className="text-rose-500 text-[11px] font-semibold">{error.accountEmail}</span>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Account Phone Number</label>
                <input
                  type="text"
                  value={formvalue.accountPhone}
                  onChange={(e) => setFormvalue({ ...formvalue, accountPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-800">Change Password (Optional)</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordFields.currentPassword}
                  onChange={(e) => setPasswordFields({ ...passwordFields, currentPassword: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordFields.newPassword}
                  onChange={(e) => setPasswordFields({ ...passwordFields, newPassword: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordFields.confirmPassword}
                  onChange={(e) => setPasswordFields({ ...passwordFields, confirmPassword: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              {error.confirmPassword && <span className="text-rose-500 text-[11px] font-semibold">{error.confirmPassword}</span>}
            </div>
          </div>
        )}

        {/* TAB 2: STORE */}
        {activeTab === "Store" && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Store size={16} className="text-blue-600" /> Store Visibility & Operation Controls
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formvalue.storeVisibility}
                  onChange={(e) => setFormvalue({ ...formvalue, storeVisibility: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-900">Public Store Visibility</span>
                  <p className="text-[10px] text-slate-400">Display your store on the public vendor list</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formvalue.acceptOrders}
                  onChange={(e) => setFormvalue({ ...formvalue, acceptOrders: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-900">Accept Online Orders</span>
                  <p className="text-[10px] text-slate-400">Allow customers to add items to cart and checkout</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formvalue.vacationMode}
                  onChange={(e) => setFormvalue({ ...formvalue, vacationMode: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-900">Vacation Mode</span>
                  <p className="text-[10px] text-slate-400">Temporarily pause orders while away</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: SHIPPING */}
        {activeTab === "Shipping" && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Truck size={16} className="text-blue-600" /> Default Shipping & Dispatch Defaults
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Default Shipping Provider</label>
                <select
                  value={formvalue.defaultShippingProvider}
                  onChange={(e) => setFormvalue({ ...formvalue, defaultShippingProvider: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Delhivery">Delhivery</option>
                  <option value="BlueDart">BlueDart</option>
                  <option value="DTDC">DTDC Express</option>
                  <option value="India Post">India Post</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Order Processing Time</label>
                <select
                  value={formvalue.processingTime}
                  onChange={(e) => setFormvalue({ ...formvalue, processingTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Same Day Dispatch">Same Day Dispatch</option>
                  <option value="1-2 Business Days">1-2 Business Days</option>
                  <option value="2-3 Business Days">2-3 Business Days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT */}
        {activeTab === "Payment" && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard size={16} className="text-blue-600" /> Bank Account & Payout Preference
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Settlement Bank Name</label>
                <input
                  type="text"
                  value={formvalue.bankName}
                  onChange={(e) => setFormvalue({ ...formvalue, bankName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Bank Account Number (Ending digits)</label>
                <input
                  type="text"
                  value={formvalue.accountNumber}
                  onChange={(e) => setFormvalue({ ...formvalue, accountNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Vendor UPI Virtual ID</label>
                <input
                  type="text"
                  value={formvalue.upiId}
                  onChange={(e) => setFormvalue({ ...formvalue, upiId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Payout Settlement Frequency</label>
                <select
                  value={formvalue.payoutPreference}
                  onChange={(e) => setFormvalue({ ...formvalue, payoutPreference: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Weekly Settlement">Weekly Settlement (Every Monday)</option>
                  <option value="Bi-Weekly Settlement">Bi-Weekly Settlement (1st & 15th)</option>
                  <option value="Monthly Settlement">Monthly Settlement (End of Month)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <Save size={16} /> Save Vendor Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorSettings;
