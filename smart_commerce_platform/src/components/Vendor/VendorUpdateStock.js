import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, PlusCircle, MinusCircle } from "lucide-react";

const VendorUpdateStock = ({ inventory = [], setInventory }) => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const item = inventory.find((i) => i.id === productId) || {
    id: productId || "p1",
    productName: "Aster Pro ANC Headphones",
    sku: "SKU-AST-001",
    currentStock: 24,
  };

  const [formvalue, setFormvalue] = useState({
    action: "Add Stock",
    quantity: 1,
    reason: "New Purchase",
    notes: "",
  });

  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const qty = parseInt(formvalue.quantity, 10) || 0;
  const newStock =
    formvalue.action === "Add Stock"
      ? item.currentStock + qty
      : Math.max(0, item.currentStock - qty);

  const handleSubmit = (e) => {
    e.preventDefault();

    let errorData = {};
    let isValid = true;

    if (!formvalue.quantity || parseInt(formvalue.quantity, 10) <= 0) {
      isValid = false;
      errorData.quantity = "Please enter a valid stock quantity (greater than 0)";
    }

    if (formvalue.action === "Remove Stock" && qty > item.currentStock) {
      isValid = false;
      errorData.quantity = `Cannot remove more than current stock (${item.currentStock})`;
    }

    if (!formvalue.reason || formvalue.reason === "") {
      isValid = false;
      errorData.reason = "Please select a reason for stock adjustment";
    }

    setError(errorData);

    if (isValid === false) {
      return false;
    }

    console.log("Vendor Stock Adjustment Form Submission:", {
      productId: item.id,
      productName: item.productName,
      previousStock: item.currentStock,
      newStock: newStock,
      ...formvalue,
    });

    if (setInventory) {
      setInventory((prevInventory) =>
        prevInventory.map((inv) =>
          inv.id === item.id
            ? { ...inv, currentStock: newStock, lastUpdated: "Just Now" }
            : inv
        )
      );
    }

    setSuccessMessage(`Stock updated successfully! New Stock: ${newStock}`);
    setTimeout(() => {
      navigate("/vendor/inventory");
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/vendor/inventory"
          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Update Stock Quantity</h1>
          <p className="text-xs text-slate-500">Adjust stock safely without direct overwriting</p>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
          {successMessage}
        </div>
      )}

      {/* Product Summary Box */}
      <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-md space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200">Selected Product</span>
        <h2 className="text-lg font-bold">{item.productName}</h2>
        <div className="flex items-center justify-between text-xs pt-2 border-t border-blue-800">
          <span className="text-blue-200 font-mono">SKU: {item.sku}</span>
          <span className="font-bold text-white">Current Stock: {item.currentStock} units</span>
        </div>
      </div>

      {/* Adjustment Form */}
      <form onSubmit={handleSubmit} method="post" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">

        {/* Action Type Toggle */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Stock Adjustment Action</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormvalue({ ...formvalue, action: "Add Stock" })}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${formvalue.action === "Add Stock"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <PlusCircle size={16} /> Add Stock (+)
            </button>
            <button
              type="button"
              onClick={() => setFormvalue({ ...formvalue, action: "Remove Stock" })}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${formvalue.action === "Remove Stock"
                  ? "bg-rose-50 border-rose-300 text-rose-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <MinusCircle size={16} /> Remove Stock (-)
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Adjustment Quantity <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            name="quantity"
            value={formvalue.quantity}
            onChange={(e) => setFormvalue({ ...formvalue, quantity: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {error.quantity && <span className="text-rose-500 text-[11px] font-semibold">{error.quantity}</span>}
        </div>

        {/* Reason Dropdown */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Adjustment Reason <span className="text-rose-500">*</span>
          </label>
          <select
            name="reason"
            value={formvalue.reason}
            onChange={(e) => setFormvalue({ ...formvalue, reason: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="New Purchase">New Purchase / Fresh Stock</option>
            <option value="Damaged">Damaged Inventory</option>
            <option value="Returned">Customer Return</option>
            <option value="Manual Adjustment">Manual Audit Adjustment</option>
          </select>
          {error.reason && <span className="text-rose-500 text-[11px] font-semibold">{error.reason}</span>}
        </div>

        {/* Real-time Calculation Preview */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Calculated New Stock Preview:</span>
          <span className="text-lg font-black text-blue-900">{newStock} units</span>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Adjustment Audit Notes</label>
          <textarea
            rows="2"
            placeholder="Add optional notes for your inventory records..."
            value={formvalue.notes}
            onChange={(e) => setFormvalue({ ...formvalue, notes: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/vendor/inventory"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <Save size={15} /> Update Stock
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorUpdateStock;
