import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Lock } from "lucide-react";

const VendorUpdateOrder = ({ orders = [], setOrders }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const existingOrder = orders.find((o) => o.id === orderId) || {
    id: orderId || "SC-10001",
    customerName: "Aarav Patel",
    productName: "Aster Pro ANC Headphones",
    totalAmount: 7499,
    status: "Processing",
    courier: "Delhivery",
    trackingNumber: "DEL9823145",
  };

  const [formvalue, setFormvalue] = useState({
    status: existingOrder.status,
    courier: existingOrder.courier || "",
    trackingNumber: existingOrder.trackingNumber || "",
    vendorNotes: "",
  });

  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let errorData = {};
    let isValid = true;

    if (!formvalue.status || formvalue.status === "") {
      isValid = false;
      errorData.status = "Please select an order status";
    }

    if (formvalue.status === "Shipped" && (!formvalue.trackingNumber || formvalue.trackingNumber.trim() === "")) {
      isValid = false;
      errorData.trackingNumber = "Tracking number is required when shipping order";
    }

    setError(errorData);

    if (isValid === false) {
      return false;
    }

    console.log("Vendor Order Status Update Form:", {
      orderId: existingOrder.id,
      ...formvalue,
    });

    if (setOrders) {
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === existingOrder.id
            ? { ...o, status: formvalue.status, courier: formvalue.courier, trackingNumber: formvalue.trackingNumber }
            : o
        )
      );
    }

    setSuccessMessage("Order status updated successfully!");
    setTimeout(() => {
      navigate("/vendor/orders");
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/vendor/orders"
          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Update Order Status</h1>
          <p className="text-xs text-slate-500">Order ID: <span className="font-semibold text-slate-800">{existingOrder.id}</span></p>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
          {successMessage}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} method="post" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">

        {/* Read-Only Restricted Fields Notice */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-slate-700 text-xs font-bold">
            <Lock size={15} className="text-slate-500" />
            Protected Platform Information
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Customer:</span>
              <p className="font-semibold text-slate-800">{existingOrder.customerName}</p>
            </div>
            <div>
              <span className="text-slate-400">Total Amount:</span>
              <p className="font-semibold text-slate-800">₹{existingOrder.totalAmount?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Fulfillment Order Status <span className="text-rose-500">*</span>
          </label>
          <select
            name="status"
            value={formvalue.status}
            onChange={(e) => setFormvalue({ ...formvalue, status: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="Processing">Processing</option>
            <option value="Ready to Ship">Ready to Ship</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          {error.status && <span className="text-rose-500 text-[11px] font-semibold">{error.status}</span>}
        </div>

        {/* Courier Provider */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Courier Shipping Provider</label>
          <input
            type="text"
            name="courier"
            placeholder="e.g. Delhivery, BlueDart, DTDC"
            value={formvalue.courier}
            onChange={(e) => setFormvalue({ ...formvalue, courier: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Tracking Number */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Courier Tracking Number</label>
          <input
            type="text"
            name="trackingNumber"
            placeholder="e.g. DEL9823145"
            value={formvalue.trackingNumber}
            onChange={(e) => setFormvalue({ ...formvalue, trackingNumber: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {error.trackingNumber && <span className="text-rose-500 text-[11px] font-semibold">{error.trackingNumber}</span>}
        </div>

        {/* Vendor Fulfillment Notes */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Internal Fulfillment Notes</label>
          <textarea
            rows="3"
            placeholder="Add optional dispatch notes..."
            value={formvalue.vendorNotes}
            onChange={(e) => setFormvalue({ ...formvalue, vendorNotes: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/vendor/orders"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <Save size={15} />
            Update Order Status
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorUpdateOrder;
