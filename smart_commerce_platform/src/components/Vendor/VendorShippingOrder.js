import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, MapPin, } from "lucide-react";

const VendorShippingOrder = ({ shippingList = [], setShippingList }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const existingItem = shippingList.find((s) => s.id === orderId) || {
    id: orderId || "SC-10021",
    customerName: "Aarav Patel",
    courier: "Delhivery",
    trackingNumber: "DEL98231",
    status: "Shipped",
    shippingDate: "2026-08-10",
    expectedDelivery: "2026-08-13",
    address: "123 CG Road, Navrangpura, Ahmedabad, Gujarat - 380009",
    packageWeight: "1.2 kg",
  };

  const [formvalue, setFormvalue] = useState({
    courier: existingItem.courier,
    trackingNumber: existingItem.trackingNumber,
    status: existingItem.status,
    shippingDate: existingItem.shippingDate,
    expectedDelivery: existingItem.expectedDelivery,
    packageWeight: existingItem.packageWeight,
    notes: "",
  });

  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let errorData = {};
    let isValid = true;

    if (!formvalue.courier || formvalue.courier.trim() === "") {
      isValid = false;
      errorData.courier = "Courier provider is required";
    }

    if (!formvalue.trackingNumber || formvalue.trackingNumber.trim() === "") {
      isValid = false;
      errorData.trackingNumber = "Tracking number is required";
    }

    if (!formvalue.expectedDelivery || formvalue.expectedDelivery.trim() === "") {
      isValid = false;
      errorData.expectedDelivery = "Expected delivery date is required";
    }

    setError(errorData);

    if (isValid === false) {
      return false;
    }

    console.log("Vendor Shipping Order Dispatch Details:", {
      orderId: existingItem.id,
      ...formvalue,
    });

    if (setShippingList) {
      setShippingList((prev) =>
        prev.map((item) =>
          item.id === existingItem.id ? { ...item, ...formvalue } : item
        )
      );
    }

    setSuccessMessage("Shipping logistics updated successfully!");
    setTimeout(() => navigate("/vendor/shipping"), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back & Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/vendor/shipping"
          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Update Order Dispatch Logistics</h1>
          <p className="text-xs text-slate-500">Order ID: <span className="font-semibold text-slate-800">{existingItem.id}</span></p>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
          {successMessage}
        </div>
      )}

      {/* Customer Delivery Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recipient Information</h2>
        <p className="text-sm font-bold text-slate-900">{existingItem.customerName}</p>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <MapPin size={14} className="text-blue-600 shrink-0" /> {existingItem.address}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} method="post" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">

        {/* Courier Provider */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Courier Provider <span className="text-rose-500">*</span>
          </label>
          <select
            name="courier"
            value={formvalue.courier}
            onChange={(e) => setFormvalue({ ...formvalue, courier: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="Delhivery">Delhivery</option>
            <option value="BlueDart">BlueDart</option>
            <option value="DTDC">DTDC Express</option>
            <option value="India Post">India Post Speed Post</option>
            <option value="FedEx">FedEx India</option>
          </select>
          {error.courier && <span className="text-rose-500 text-[11px] font-semibold">{error.courier}</span>}
        </div>

        {/* Tracking Number */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Waybill / Tracking Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="trackingNumber"
            value={formvalue.trackingNumber}
            onChange={(e) => setFormvalue({ ...formvalue, trackingNumber: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {error.trackingNumber && <span className="text-rose-500 text-[11px] font-semibold">{error.trackingNumber}</span>}
        </div>

        {/* Shipping Status */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Logistics Status</label>
          <select
            name="status"
            value={formvalue.status}
            onChange={(e) => setFormvalue({ ...formvalue, status: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="Ready to Ship">Ready to Ship</option>
            <option value="Shipped">Dispatched / In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Dispatch Date</label>
            <input
              type="date"
              value={formvalue.shippingDate}
              onChange={(e) => setFormvalue({ ...formvalue, shippingDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Estimated Delivery Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formvalue.expectedDelivery}
              onChange={(e) => setFormvalue({ ...formvalue, expectedDelivery: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
            {error.expectedDelivery && <span className="text-rose-500 text-[11px] font-semibold">{error.expectedDelivery}</span>}
          </div>
        </div>

        {/* Package Weight */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Package Weight / Dimensions</label>
          <input
            type="text"
            placeholder="e.g. 1.2 kg (20x15x10 cm)"
            value={formvalue.packageWeight}
            onChange={(e) => setFormvalue({ ...formvalue, packageWeight: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/vendor/shipping"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <Save size={15} /> Save Shipping Info
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorShippingOrder;
