import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Boxes, AlertTriangle, CheckCircle, Edit, RefreshCw } from "lucide-react";

const VendorInventory = ({ inventory = [], setInventory }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockStatusFilter, setStockStatusFilter] = useState("All");

  const totalProducts = inventory.length;
  const inStockCount = inventory.filter((item) => item.currentStock > 10).length;
  const lowStockCount = inventory.filter((item) => item.currentStock > 0 && item.currentStock <= 10).length;
  const outOfStockCount = inventory.filter((item) => item.currentStock === 0).length;

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;

    let matchesStatus = true;
    if (stockStatusFilter === "In Stock") matchesStatus = item.currentStock > 10;
    if (stockStatusFilter === "Low Stock") matchesStatus = item.currentStock > 0 && item.currentStock <= 10;
    if (stockStatusFilter === "Out of Stock") matchesStatus = item.currentStock === 0;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-xs text-slate-500 mt-1">Track stock levels, reserved units, and low-stock alerts</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Total Catalog Items</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600">In Stock</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{inStockCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-amber-600">Low Stock Warning</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{lowStockCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-rose-600">Out of Stock</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{outOfStockCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Product Name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Footwear">Footwear</option>
            <option value="Laptops">Laptops</option>
          </select>

          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="All">All Stock Statuses</option>
            <option value="In Stock">In Stock (&gt;10)</option>
            <option value="Low Stock">Low Stock (1-10)</option>
            <option value="Out of Stock">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Reserved Stock</th>
                <th className="px-6 py-4">Available Stock</th>
                <th className="px-6 py-4">Low-Stock Alert</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const available = item.currentStock - (item.reservedStock || 0);
                  const isLow = item.currentStock <= (item.lowStockThreshold || 10);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">{item.productName}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{item.sku}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{item.currentStock}</td>
                      <td className="px-6 py-4 text-slate-500">{item.reservedStock || 0}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">{available}</td>
                      <td className="px-6 py-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                            <AlertTriangle size={14} /> Low (&le;{item.lowStockThreshold || 10})
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-[11px]">Normal</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.currentStock === 0
                            ? 'bg-rose-50 text-rose-700'
                            : isLow
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}>
                          {item.currentStock === 0 ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{item.lastUpdated}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/vendor/inventory/${item.id}/update`}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[11px] inline-flex items-center gap-1 transition"
                        >
                          <RefreshCw size={13} /> Update Stock
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center text-slate-400">
                    No inventory products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorInventory;
